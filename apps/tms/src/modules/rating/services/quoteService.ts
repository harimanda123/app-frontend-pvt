import { Decimal } from "decimal.js";
import { db } from "@qubere/db";
import type { AccountContext } from "@qubere/auth";
import { publishTransportationEvent } from "../../events/services/eventService";
import { evaluateAutonomyPolicy } from "../../autonomy/services/policyEngineService";
import { TmsAccountContextBuilder } from "../../memory/memory.context-builder";
import { buildLaneKey } from "../../memory/memory.domain-events";
import {
  getLaneIntelligence,
  computeSellPrice,
  type LaneKey,
} from "./rateIntelligenceService";

// ---------------------------------------------------------------------------
// Quote Agent — Rate & Quote Recommendation
//
// OBSERVE: reads TransportationOrder, available CarrierRates, lane intelligence
// UNDERSTAND: identifies best-fit carrier rates for the lane/equipment
// PREDICT: computes buy cost, market position, margin
// DECIDE: evaluates policy — is this quote auto-approvable?
// ACT: creates FreightQuote + AgentDecision, updates order status
// VERIFY: emits QUOTE_CREATED TransportationEvent
// ESCALATE: sets approvalState = PENDING_APPROVAL if policy blocks
// ---------------------------------------------------------------------------

export interface CreateCarrierRateInput {
  carrierPartyId?: string;
  carrierName?: string;
  mode: string;
  origin: { city?: string; country?: string; unlocode?: string; zone?: string };
  destination: { city?: string; country?: string; unlocode?: string; zone?: string };
  equipment: string;
  baseRate: number;
  currency?: string;
  minimums?: number;
  surcharges?: Record<string, number>;
  accessorials?: Record<string, number>;
  contractReference?: string;
  effectiveFrom?: Date;
  effectiveTo?: Date;
  source?: string;
}

export interface EvaluateRFQInput {
  transportationOrderId: string;
  targetMarginPercent?: number;      // override; uses policy default if omitted
  requireFreshRates?: boolean;       // reject stale rates if true
  forceQuoteEvenIfNoRates?: boolean; // use market median even without account rates
}

// ---------------------------------------------------------------------------
// createCarrierRate — store a rate from any source (manual, EDI, email parse)
// ---------------------------------------------------------------------------
export async function createCarrierRate(
  ctx: AccountContext,
  input: CreateCarrierRateInput
) {
  const rate = await db.carrierRate.create({
    data: {
      accountId: ctx.accountId,
      carrierPartyId: input.carrierPartyId,
      carrierName: input.carrierName ?? "Partner Carrier",
      mode: input.mode.toUpperCase(),
      origin: input.origin as any,
      destination: input.destination as any,
      equipment: input.equipment,
      baseRate: input.baseRate,
      currency: input.currency ?? "USD",
      minimums: input.minimums,
      surcharges: input.surcharges as any,
      accessorials: input.accessorials as any,
      contractReference: input.contractReference,
      effectiveFrom: input.effectiveFrom ?? new Date(),
      effectiveTo: input.effectiveTo,
      source: input.source ?? "MANUAL",
    },
  });

  return rate;
}

// ---------------------------------------------------------------------------
// evaluateRFQ — Quote Agent core
// ---------------------------------------------------------------------------
export async function evaluateRFQ(ctx: AccountContext, input: EvaluateRFQInput) {
  // ---- OBSERVE ----
  const order = await db.transportationOrder.findFirst({
    where: { accountId: ctx.accountId, id: input.transportationOrderId },
    include: { client: true },
  });

  if (!order) {
    throw new Error(`TransportationOrder ${input.transportationOrderId} not found.`);
  }

  const mode = (order.mode ?? "OCEAN").toUpperCase();
  const equipmentReqs = (order.equipmentRequirements as string[]) ?? ["40HC"];
  const equipment = equipmentReqs[0] ?? "40HC";
  const originData = (order.origin ?? {}) as Record<string, string>;
  const destData = (order.destination ?? {}) as Record<string, string>;

  const lane: LaneKey = {
    mode,
    equipment,
    originUnlocode: originData.unlocode,
    originCountry: originData.country,
    destinationUnlocode: destData.unlocode,
    destinationCountry: destData.country,
  };
  const accountMemory = await TmsAccountContextBuilder.build({
    accountId: ctx.accountId,
    task: "RATE_QUOTING",
    query: [mode, equipment, lane.originUnlocode, lane.destinationUnlocode, order.client?.name]
      .filter(Boolean)
      .join(" "),
    scope: {
      transportationOrderId: order.id,
      customerId: order.clientId ?? undefined,
      customerName: order.client?.name,
      laneKey: buildLaneKey({ mode, equipment, origin: order.origin, destination: order.destination }),
      mode,
      equipment,
      origin: lane.originUnlocode,
      destination: lane.destinationUnlocode,
    },
  });

  // ---- UNDERSTAND: Lane intelligence + rate matching ----
  let availableRates: any[] = [];
  try {
    const res = await db.carrierRate.findMany({
      where: {
        accountId: ctx.accountId,
        mode,
        equipment,
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: new Date() } }],
      },
      select: {
        id: true,
        carrierPartyId: true,
        carrierName: true,
        baseRate: true,
        surcharges: true,
        accessorials: true,
        confidence: true,
        updatedAt: true,
      },
      orderBy: [
        { confidence: "desc" },
        { baseRate: "asc" },
      ],
      take: 20,
    });
    availableRates = Array.isArray(res) ? res : [];
  } catch {
    availableRates = [];
  }

  const laneIntel = await getLaneIntelligence(ctx, lane, availableRates);

  // ---- PREDICT: Compute all-in buy cost with Decimal.js ----
  const ratesList = availableRates ?? [];
  const selectedRate = ratesList[0];
  let buyBase: Decimal;
  let surchargesTotal: Decimal;
  let accessorialsTotal: Decimal;
  let carrierId: string;
  let carrierName: string;
  let rateSource: string;

  if (selectedRate) {
    buyBase = new Decimal(selectedRate.baseRate.toString());

    surchargesTotal = selectedRate.surcharges && typeof selectedRate.surcharges === "object"
      ? Object.values(selectedRate.surcharges as Record<string, number>).reduce(
          (acc, v) => acc.plus(new Decimal(String(v ?? 0))),
          new Decimal(0)
        )
      : new Decimal(0);

    accessorialsTotal = selectedRate.accessorials && typeof selectedRate.accessorials === "object"
      ? Object.values(selectedRate.accessorials as Record<string, number>).reduce(
          (acc, v) => acc.plus(new Decimal(String(v ?? 0))),
          new Decimal(0)
        )
      : new Decimal(0);

    carrierId = selectedRate.id;
    carrierName = selectedRate.carrierName ?? "Contracted Carrier";
    rateSource = "CONTRACTED_RATE";
  } else if (input.forceQuoteEvenIfNoRates && laneIntel.recommendedBuyRate > 0) {
    // No contracted rates — use market intelligence median as buy estimate
    buyBase = new Decimal(laneIntel.recommendedBuyRate);
    surchargesTotal = new Decimal(0);
    accessorialsTotal = new Decimal(0);
    carrierId = "market_rate";
    carrierName = "Market Rate (No Contracted Carrier)";
    rateSource = "MARKET_INTELLIGENCE";
  } else if (!selectedRate && laneIntel.rateCount === 0 && !input.forceQuoteEvenIfNoRates) {
    throw new Error(
      `No rates available for lane ${lane.mode}/${lane.equipment}. ` +
      `Add at least one CarrierRate to proceed.`
    );
  } else {
    buyBase = new Decimal(laneIntel.recommendedBuyRate > 0 ? laneIntel.recommendedBuyRate : 2500);
    surchargesTotal = new Decimal(0);
    accessorialsTotal = new Decimal(0);
    carrierId = "market_rate";
    carrierName = "Contracted Carrier";
    rateSource = "MARKET_INTELLIGENCE";
  }

  const totalBuyCost = buyBase.plus(surchargesTotal).plus(accessorialsTotal);

  const confidenceScore = selectedRate
    ? (selectedRate.confidence ?? 92)
    : laneIntel.confidence;

  // ---- DECIDE: Load policy for margin target and auto-approval gate ----
  const policyResult = await evaluateAutonomyPolicy(
    ctx,
    {
      actionType: "QUOTE_APPROVE",
      confidenceScore,
      financialAmount: totalBuyCost.toNumber(),
    },
    "Rate & Quote Recommendation Agent"
  );

  // Determine target margin — use policy default, then input override, then 15%
  const rememberedTargetMargin = input.targetMarginPercent == null
    ? TmsAccountContextBuilder.rememberedTargetMargin(accountMemory)
    : null;
  const targetMarginPct = new Decimal(input.targetMarginPercent ?? rememberedTargetMargin ?? 15.0);

  const { sellAmount, grossProfit, actualMarginPct } = computeSellPrice(
    totalBuyCost,
    targetMarginPct
  );

  // Is this quote within our financial threshold?
  const meetsMarginGate =
    actualMarginPct.gte(targetMarginPct.times(0.8)); // allow 20% tolerance

  const isAutoApproved =
    policyResult.allowed &&
    meetsMarginGate &&
    confidenceScore >= 60;

  const approvalState = isAutoApproved ? "AUTO_APPROVED" : "PENDING_APPROVAL";

  // ---- ACT: Create AgentDecision ----
  const decision = await db.agentDecision.create({
    data: {
      accountId: ctx.accountId,
      agentName: "Rate & Quote Recommendation Agent",
      decisionSummary:
        `Recommended ${carrierName} — Buy: $${totalBuyCost.toFixed(2)}, ` +
        `Sell: $${sellAmount.toFixed(2)}, Margin: ${actualMarginPct.toFixed(1)}%. ` +
        `Source: ${rateSource}. Lane confidence: ${laneIntel.confidence}%.`,
      confidence: confidenceScore,
      triageState: isAutoApproved ? "AUTO_VERIFIED" : "NEEDS_HUMAN_REVIEW",
      autoApproved: isAutoApproved,
      status: isAutoApproved ? "Completed" : "Review Required",
      blockedReason: isAutoApproved ? null : policyResult.reason,
      evidenceItems: [
        {
          field: "buyAmount",
          extractedValue: `$${totalBuyCost.toFixed(2)}`,
          sourceSpan: `Base: $${buyBase.toFixed(2)}, Surcharges: $${surchargesTotal.toFixed(2)}, Accessorials: $${accessorialsTotal.toFixed(2)}`,
          confidence: selectedRate ? 95 : 60,
        },
        {
          field: "laneAvgRate",
          extractedValue: `$${laneIntel.averageRate.toFixed(2)}`,
          sourceSpan: `${laneIntel.rateCount} rate(s) on file, ${laneIntel.freshRateCount} fresh`,
          confidence: laneIntel.confidence,
        },
        {
          field: "targetMarginPct",
          extractedValue: `${targetMarginPct.toFixed(1)}%`,
          sourceSpan: input.targetMarginPercent != null
            ? "Caller Override"
            : rememberedTargetMargin != null
              ? "Account Operating Memory"
              : "Account Default",
          confidence: 100,
        },
        ...TmsAccountContextBuilder.summarizeForEvidence(accountMemory).map((memory) => ({
          field: "accountOperatingMemory",
          extractedValue: memory.content,
          sourceSpan: `AccountMemory ${memory.memoryId} (${memory.sourceType})`,
          confidence: Math.round(memory.confidence * 100),
        })),
        {
          field: "sellAmount",
          extractedValue: `$${sellAmount.toFixed(2)}`,
          sourceSpan: `Margin-on-sell: buy ÷ (1 - margin%)`,
          confidence: 95,
        },
      ] as any,
    },
  });

  // ---- ACT: Create FreightQuote ----
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 7);

  const quote = await db.freightQuote.create({
    data: {
      accountId: ctx.accountId,
      transportationOrderId: order.id,
      clientId: order.clientId,
      carrierId,
      carrierPartyId: selectedRate?.carrierPartyId ?? null,
      carrierName,
      mode,
      laneOrigin: order.origin ?? { unlocode: "CNSHA", city: "Shanghai" },
      laneDestination: order.destination ?? { unlocode: "USOAK", city: "Oakland" },
      equipment,
      buyAmount: totalBuyCost.toNumber() as any,
      markupPercentage: targetMarginPct.toNumber() as any,
      sellAmount: sellAmount.toNumber() as any,
      margin: grossProfit.toNumber() as any,
      amount: sellAmount.toNumber() as any,
      currency: "USD",
      transitDays: 14,
      validUntil,
      surcharges: selectedRate?.surcharges ?? {},
      accessorials: selectedRate?.accessorials ?? {},
      source: rateSource === "CONTRACTED_RATE" ? "RATE_ENGINE" : "MANUAL",
      status: "PROPOSED",
      approvalState,
      agentDecisionId: decision.id,
      rawProviderResponse: {
        laneIntelligence: {
          rateCount: laneIntel.rateCount,
          freshRateCount: laneIntel.freshRateCount,
          averageRate: laneIntel.averageRate,
          confidence: laneIntel.confidence,
          recommendedBuyRateRationale: laneIntel.recommendedBuyRateRationale,
        },
        selectedRateId: selectedRate?.id ?? null,
      } as any,
    },
  });

  // Update order status to QUOTED
  await db.transportationOrder.update({
    where: { id: order.id },
    data: { status: "QUOTED" },
  });

  // ---- VERIFY: Publish QUOTE_CREATED event ----
  await publishTransportationEvent(ctx, {
    entityType: "FREIGHT_QUOTE",
    entityId: quote.id,
    transportationOrderId: order.id,
    eventType: "QUOTE_CREATED",
    source: "AGENT",
    payload: {
      quoteId: quote.id,
      carrierName,
      buyAmount: totalBuyCost.toNumber(),
      sellAmount: sellAmount.toNumber(),
      grossProfit: grossProfit.toNumber(),
      actualMarginPct: actualMarginPct.toNumber(),
      approvalState,
      rateSource,
      laneConfidence: laneIntel.confidence,
    },
  });

  return { quote, decision, laneIntelligence: laneIntel };
}

// ---------------------------------------------------------------------------
// convertQuoteToShipment — accepts a quote and creates the live shipment
// ---------------------------------------------------------------------------
export async function convertQuoteToShipment(ctx: AccountContext, quoteId: string) {
  const quote = await db.freightQuote.findFirst({
    where: { accountId: ctx.accountId, id: quoteId },
    include: { transportationOrder: true },
  });

  if (!quote) throw new Error(`FreightQuote ${quoteId} not found.`);

  const order = quote.transportationOrder;
  const shipmentNumber = `SHP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const shipment = await db.shipment.create({
    data: {
      accountId: ctx.accountId,
      shipmentNumber,
      importerName: order?.requestedBy ?? "Importer",
      transportMode: quote.mode ?? "OCEAN",
      countryOfExport: (order?.origin as any)?.country ?? "CN",
      destinationCountry: (order?.destination as any)?.country ?? "US",
      portOfEntry: (order?.destination as any)?.unlocode ?? "USOAK",
      carrierName: quote.carrierName ?? "Carrier",
      status: "In Progress",
      invoiceCurrency: quote.currency,
      estimatedArrival: new Date(Date.now() + 14 * 86400 * 1000),
      // Seed financial cache from the accepted quote
      sellAmount: quote.sellAmount,
      expectedBuyCost: quote.buyAmount,
    },
  });

  // Attach sell charge (AR side) + buy cost (AP side)
  await Promise.all([
    db.shipmentCharge.create({
      data: {
        accountId: ctx.accountId,
        shipmentId: shipment.id,
        description: "Freight Linehaul & Surcharges (Sell)",
        quantity: 1,
        unitPrice: quote.sellAmount,
        grossAmount: quote.sellAmount,
        netAmount: quote.sellAmount,
        currency: quote.currency,
      },
    }),
    db.shipmentCost.create({
      data: {
        accountId: ctx.accountId,
        shipmentId: shipment.id,
        costType: "LINEHAUL",
        description: "Carrier Buy Rate",
        amount: quote.buyAmount,
        currency: quote.currency,
      },
    }),
  ]);

  // Link Quote and Order to Shipment
  await db.freightQuote.update({
    where: { id: quote.id },
    data: { shipmentId: shipment.id, status: "ACCEPTED" },
  });

  if (order) {
    await db.transportationOrder.update({
      where: { id: order.id },
      data: { shipmentId: shipment.id, status: "SHIPMENT_CREATED" },
    });
  }

  await publishTransportationEvent(ctx, {
    entityType: "SHIPMENT",
    entityId: shipment.id,
    shipmentId: shipment.id,
    transportationOrderId: order?.id,
    eventType: "SHIPMENT_CREATED",
    source: "SYSTEM",
    payload: {
      shipmentId: shipment.id,
      shipmentNumber,
      convertedFromQuoteId: quote.id,
    },
  });

  return shipment;
}
