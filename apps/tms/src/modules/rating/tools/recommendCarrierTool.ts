import { z } from "zod";
import type { AssistantTool } from "@qubere/assistant";
import type { AccountContext } from "@qubere/auth";
import { db } from "@qubere/db";
import { createAuditLog } from "@qubere/decisions";
import { TmsAccountContextBuilder } from "../../memory/memory.context-builder";

export const recommendCarrierSchema = z.object({
  shipmentId: z.string(),
  preferredMaxTransitDays: z.number().int().optional().nullable(),
  requireInsurance: z.boolean().default(true),
});

export type RecommendCarrierInput = z.infer<typeof recommendCarrierSchema>;

export const recommendCarrierTool: AssistantTool = {
  declaration: {
    name: "recommend_carrier",
    description:
      "Evaluates available FreightQuotes for a shipment, considering rate, transit time, and carrier insurance status, producing an AgentDecision recommendation with comparison proof.",
    parameters: {
      type: "OBJECT",
      properties: {
        shipmentId: { type: "STRING", description: "Target shipment ID to evaluate quotes for" },
      },
      required: ["shipmentId"],
    },
  },
  schema: recommendCarrierSchema as any,
  execute: async (ctx: AccountContext, args: Record<string, unknown>) => {
    const input = recommendCarrierSchema.parse(args);

    // 1. Fetch available quotes for the shipment
    const quotes = await db.freightQuote.findMany({
      where: {
        accountId: ctx.accountId,
        shipmentId: input.shipmentId,
      },
    });

    if (quotes.length === 0) {
      throw new Error(`No FreightQuote records found for shipment ${input.shipmentId}.`);
    }

    // 2. Fetch carrier records for quote evaluation
    const carrierIds = quotes.map((q) => q.carrierId).filter((id): id is string => Boolean(id));
    const carriers = await db.carrier.findMany({
      where: {
        accountId: ctx.accountId,
        id: { in: carrierIds },
        status: "ACTIVE",
      },
    });

    const carrierMap = new Map(carriers.map((c) => [c.id, c]));
    const accountMemory = await TmsAccountContextBuilder.build({
      accountId: ctx.accountId,
      task: "CARRIER_SELECTION",
      query: quotes.flatMap((quote) => [quote.carrierId, quote.carrierName, quote.mode, quote.equipment]).filter(Boolean).join(" "),
      scope: { shipmentId: input.shipmentId },
    });

    // Filter and score options
    const evaluatedOptions = quotes.map((quote) => {
      const carrier = quote.carrierId ? carrierMap.get(quote.carrierId) : undefined;
      const hasInsurance = carrier?.insuranceOnFile ?? false;
      const isEligible = input.requireInsurance ? hasInsurance : true;

      // Simple scoring model: rate weight + transit weight
      const numericAmount = Number(quote.amount);
      const memoryAdjustment = quote.carrierId
        ? TmsAccountContextBuilder.carrierPreferenceAdjustment(accountMemory, {
            carrierId: quote.carrierId,
            carrierName: carrier?.legalName ?? quote.carrierName,
            scac: carrier?.scac,
          })
        : 0;
      const score = (isEligible ? 1000 : 0) - numericAmount - (quote.transitDays ?? 5) * 10 + memoryAdjustment * 10;

      return {
        quote,
        carrier,
        hasInsurance,
        isEligible,
        numericAmount,
        score,
        memoryAdjustment,
      };
    });

    const eligibleOptions = evaluatedOptions.filter((o) => o.isEligible);
    const winner = (eligibleOptions.length > 0 ? eligibleOptions : evaluatedOptions).sort(
      (a, b) => b.score - a.score
    )[0];

    const isHighConfidence = winner && winner.isEligible && evaluatedOptions.length > 0;
    const confidence = isHighConfidence ? 92 : 45;

    // Construct detailed evidence items matching product positioning (Qubere proves every recommendation)
    const evidenceItems = evaluatedOptions.map((opt) => ({
      field: "carrierQuoteComparison",
      extractedValue: `Carrier: ${opt.carrier?.legalName ?? opt.quote.carrierId}, Rate: $${opt.numericAmount}, Insurance: ${opt.hasInsurance}`,
      sourceSpan: `Quote ID: ${opt.quote.id}, Transit Days: ${opt.quote.transitDays ?? "N/A"}`,
    }));
    evidenceItems.push(...TmsAccountContextBuilder.summarizeForEvidence(accountMemory).map((memory) => ({
      field: "accountOperatingMemory",
      extractedValue: memory.content,
      sourceSpan: `AccountMemory ${memory.memoryId} (${memory.sourceType})`,
    })));

    // 3. Create AgentDecision recommendation record
    const agentDecision = await db.agentDecision.create({
      data: {
        accountId: ctx.accountId,
        shipmentId: input.shipmentId,
        agentName: "CarrierRecommendationAgent",
        decisionSummary: `Recommended ${winner.carrier?.legalName ?? winner.quote.carrierId} at $${winner.numericAmount} USD`,
        status: isHighConfidence ? "Completed" : "Review Required",
        triageState: isHighConfidence ? "AUTO_VERIFIED" : "NEEDS_REVIEW",
        confidence,
        rulesApplied: ["RATE_COMPARISON_V1", "CARRIER_INSURANCE_CHECK"],
        evidenceItems: evidenceItems as any,
        proposedDescription: `Recommended ${winner.carrier?.legalName ?? winner.quote.carrierId} at $${winner.numericAmount} USD`,
      },
    });

    // Link decision to winning quote
    await db.freightQuote.update({
      where: { id: winner.quote.id },
      data: { agentDecisionId: agentDecision.id },
    });

    // 4. Record Audit Log
    await createAuditLog({
      accountId: ctx.accountId,
      userId: ctx.userId,
      action: "CARRIER_RECOMMENDED",
      entity: "FreightQuote",
      entityId: winner.quote.id,
      source: "AGENT",
      metadata: {
        shipmentId: input.shipmentId,
        recommendedCarrierId: winner.quote.carrierId,
        amount: winner.numericAmount,
        confidence,
        agentDecisionId: agentDecision.id,
      },
    });

    return {
      recommendedQuote: winner.quote,
      recommendedCarrier: winner.carrier,
      agentDecision,
      allEvaluatedOptions: evaluatedOptions,
    };
  },
};
