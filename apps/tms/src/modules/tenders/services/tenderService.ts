import { db } from "@qubere/db";
import type { AccountContext } from "@qubere/auth";
import { publishTransportationEvent } from "../../events/services/eventService";
import { createAuditLog } from "@qubere/decisions";
import { evaluateAutonomyPolicy } from "../../autonomy/services/policyEngineService";
import { evaluateCarriersForShipment } from "../../carriers/services/carrierSelectionService";

// ---------------------------------------------------------------------------
// Tender Agent — Carrier Dispatch
//
// Manages the full tender lifecycle:
//   createAndSendTender    — idempotent dispatch to a single carrier
//   respondToTender        — handle carrier accept/reject + trigger cascade
//   sweepExpiredTenders    — cron: expire tenders + trigger cascade
//   triggerFallbackCascade — re-dispatch to next-best carrier on rejection
//   autoDispatchTender     — policy-gated: agent selects + dispatches carrier
// ---------------------------------------------------------------------------

export interface CreateTenderInput {
  shipmentId?: string;
  freightQuoteId?: string;
  carrierId: string;
  timeoutHours?: number;
  idempotencyKey?: string;  // prevents double-dispatch on retry
}

export interface RespondTenderInput {
  tenderId: string;
  accept: boolean;
  rejectionReason?: string;
}

// ---------------------------------------------------------------------------
// createAndSendTender — idempotent carrier dispatch
// ---------------------------------------------------------------------------
export async function createAndSendTender(
  ctx: AccountContext,
  input: CreateTenderInput
) {
  const timeoutHours = input.timeoutHours ?? 4;
  const expiresAt = new Date(Date.now() + timeoutHours * 3600 * 1000);

  // Idempotency: if a tender with this key already exists, return it
  if (input.idempotencyKey) {
    const existingTender = await db.tender
      .findFirst({
        where: {
          accountId: ctx.accountId,
          carrierId: input.carrierId,
          shipmentId: input.shipmentId ?? undefined,
          status: { in: ["SENT", "ACCEPTED"] },
          createdAt: { gte: new Date(Date.now() - 24 * 3600 * 1000) }, // within 24h
        },
      })
      .catch(() => null);

    if (existingTender) {
      return { tender: existingTender, wasIdempotent: true };
    }
  }

  const tender = await db.tender.create({
    data: {
      accountId: ctx.accountId,
      shipmentId: input.shipmentId ?? null,
      freightQuoteId: input.freightQuoteId ?? null,
      carrierId: input.carrierId,
      status: "SENT",
      sentAt: new Date(),
      expiresAt,
      sentByUserId: ctx.userId ?? null,
      history: [
        {
          status: "SENT",
          timestamp: new Date().toISOString(),
          byUserId: ctx.userId ?? "system",
        },
      ] as any,
    },
  });

  const decision = await db.agentDecision.create({
    data: {
      accountId: ctx.accountId,
      shipmentId: input.shipmentId ?? null,
      agentName: "Tender Dispatch Agent",
      decisionSummary:
        `Dispatched freight tender to carrier ${input.carrierId}. ` +
        `Expires: ${expiresAt.toLocaleString()}.`,
      confidence: 95,
      triageState: "AUTO_VERIFIED",
      autoApproved: true,
      status: "Completed",
    },
  });

  await db.tender.update({
    where: { id: tender.id },
    data: { agentDecisionId: decision.id },
  }).catch(() => null);

  await createAuditLog({
    accountId: ctx.accountId,
    userId: ctx.userId ?? "system",
    action: "TENDER_DISPATCHED",
    entity: "Tender",
    entityId: tender.id,
    source: "SYSTEM",
    metadata: { carrierId: input.carrierId, expiresAt },
  });

  await publishTransportationEvent(ctx, {
    entityType: "TENDER",
    entityId: tender.id,
    shipmentId: input.shipmentId ?? null,
    eventType: "TENDER_SENT",
    source: "SYSTEM",
    payload: { tenderId: tender.id, carrierId: input.carrierId, expiresAt },
  });

  return { tender, wasIdempotent: false };
}

// ---------------------------------------------------------------------------
// respondToTender — handle carrier accept/reject; triggers fallback on reject
// ---------------------------------------------------------------------------
export async function respondToTender(
  ctx: AccountContext,
  input: RespondTenderInput
) {
  const tender = await db.tender.findFirst({
    where: { accountId: ctx.accountId, id: input.tenderId },
  });

  if (!tender) throw new Error(`Tender ${input.tenderId} not found.`);
  if (tender.status === "ACCEPTED") {
    throw new Error(`Tender ${input.tenderId} is already accepted.`);
  }

  const existingHistory = (tender.history as any[]) ?? [];
  const status = input.accept ? "ACCEPTED" : "REJECTED";

  const updatedTender = {
    ...tender,
    status,
    respondedAt: new Date(),
    history: [
      ...existingHistory,
      {
        status,
        timestamp: new Date().toISOString(),
        rejectionReason: input.rejectionReason ?? null,
      },
    ] as any,
  };

  await db.tender
    .update({
      where: { id: tender.id },
      data: {
        status,
        respondedAt: updatedTender.respondedAt,
        history: updatedTender.history,
      },
    })
    .catch(() => null);

  await publishTransportationEvent(ctx, {
    entityType: "TENDER",
    entityId: tender.id,
    shipmentId: tender.shipmentId,
    eventType: input.accept ? "TENDER_ACCEPTED" : "TENDER_REJECTED",
    source: "CARRIER",
    payload: {
      tenderId: tender.id,
      carrierId: tender.carrierId,
      rejectionReason: input.rejectionReason ?? null,
    },
  });

  // Rejection/expiry → trigger automated fallback cascade
  if (!input.accept) {
    await triggerFallbackCascade(ctx, updatedTender);
  }

  return updatedTender;
}

// ---------------------------------------------------------------------------
// sweepExpiredTenders — cron job: expire SENT tenders past their deadline
// ---------------------------------------------------------------------------
export async function sweepExpiredTenders(callerCtx?: AccountContext) {
  const now = new Date();
  const expiredTenders = await db.tender.findMany({
    where: { status: "SENT", expiresAt: { lt: now } },
    select: {
      id: true,
      accountId: true,
      shipmentId: true,
      carrierId: true,
      freightQuoteId: true,
      history: true,
    },
  });

  let expiredCount = 0;

  for (const tender of expiredTenders) {
    const ctx = callerCtx ?? ({ accountId: tender.accountId } as unknown as AccountContext);
    const existingHistory = (tender.history as any[]) ?? [];

    await db.tender.update({
      where: { id: tender.id },
      data: {
        status: "EXPIRED",
        history: [
          ...existingHistory,
          { status: "EXPIRED", timestamp: now.toISOString(), reason: "Tender response timeout" },
        ] as any,
      },
    });

    await createAuditLog({
      accountId: tender.accountId,
      userId: "system_cron",
      action: "TENDER_EXPIRED",
      entity: "Tender",
      entityId: tender.id,
      source: "SYSTEM",
      metadata: { carrierId: tender.carrierId, expiredAt: now },
    });

    await publishTransportationEvent(ctx, {
      entityType: "TENDER",
      entityId: tender.id,
      shipmentId: tender.shipmentId,
      eventType: "TENDER_EXPIRED",
      source: "SYSTEM",
      payload: { tenderId: tender.id, carrierId: tender.carrierId },
    });

    await triggerFallbackCascade(ctx, tender);
    expiredCount++;
  }

  return { expiredCount };
}

// ---------------------------------------------------------------------------
// triggerFallbackCascade — re-dispatches to next-best eligible carrier
//
// Called after a REJECTED or EXPIRED tender. Excludes the failed carrier
// and any carrier with a recent rejection for this shipment.
// ---------------------------------------------------------------------------
export async function triggerFallbackCascade(
  ctx: AccountContext,
  failedTender: {
    id: string;
    accountId: string;
    carrierId: string | null;
    shipmentId?: string | null;
    freightQuoteId?: string | null;
  }
) {
  // Find shipment mode for carrier scoring
  let shipmentMode = "OCEAN";
  let shipmentEquipment = "40HC";

  if (failedTender.shipmentId && typeof db.shipment?.findFirst === "function") {
    const shipment = await db.shipment
      .findFirst({
        where: { id: failedTender.shipmentId },
        select: { transportMode: true },
      })
      .catch(() => null);
    if (shipment?.transportMode) shipmentMode = shipment.transportMode;
  }

  // Collect all carriers previously rejected on this shipment to exclude them
  let previouslyRejectedCarrierIds = failedTender.carrierId ? [failedTender.carrierId] : [];
  if (failedTender.shipmentId && typeof db.tender?.findMany === "function") {
    try {
      const res = await db.tender.findMany({
        where: {
          accountId: ctx.accountId,
          shipmentId: failedTender.shipmentId,
          status: { in: ["REJECTED", "EXPIRED"] },
        },
        select: { carrierId: true },
      });
      if (Array.isArray(res)) {
        previouslyRejectedCarrierIds = Array.from(
          new Set([...previouslyRejectedCarrierIds, ...res.map((t: any) => t.carrierId)])
        );
      }
    } catch {
      // Keep [failedTender.carrierId]
    }
  }

  // Score all eligible carriers, excluding rejected ones
  const rankedCarriers = await evaluateCarriersForShipment(ctx, {
    mode: shipmentMode,
    equipment: shipmentEquipment,
    requireInsurance: true,
    shipmentId: failedTender.shipmentId ?? undefined,
    excludeCarrierIds: previouslyRejectedCarrierIds,
  });

  const nextCarrier = rankedCarriers.find((c) => c.isEligible);

  if (!nextCarrier) {
    // No eligible carrier found — create a NEEDS_HUMAN_REVIEW exception
    if (failedTender.shipmentId) {
      await db.exceptionItem
        .create({
          data: {
            accountId: ctx.accountId,
            shipmentId: failedTender.shipmentId,
            type: "NO_CARRIER_AVAILABLE",
            category: "TRANSPORTATION",
            severity: "Critical",
            description:
              `All ${previouslyRejectedCarrierIds.length} attempted carrier(s) rejected/expired the tender. ` +
              `Manual carrier sourcing required.`,
            requiredAction:
              "Manually source a carrier or negotiate with a rejected carrier for this shipment.",
            blocking: true,
            status: "Open",
            sourceAgent: "Tender Dispatch Agent",
          },
        })
        .catch(() => null);
    }
    return null;
  }

  // Dispatch to next carrier
  const { tender: fallbackTender } = await createAndSendTender(ctx, {
    shipmentId: failedTender.shipmentId ?? undefined,
    freightQuoteId: failedTender.freightQuoteId ?? undefined,
    carrierId: nextCarrier.carrierId,
    timeoutHours: 4,
  });

  await createAuditLog({
    accountId: ctx.accountId,
    userId: ctx.userId ?? "system",
    action: "TENDER_FALLBACK_CASCADE",
    entity: "Tender",
    entityId: fallbackTender.id,
    source: "SYSTEM",
    metadata: {
      failedTenderId: failedTender.id,
      fallbackCarrierId: nextCarrier.carrierId,
      fallbackCarrierName: nextCarrier.carrierName,
      score: nextCarrier.score,
      cascadeAttempt: previouslyRejectedCarrierIds.length,
    },
  });

  return fallbackTender;
}

// ---------------------------------------------------------------------------
// autoDispatchTender — full agent flow: score carriers + policy gate + dispatch
//
// Called by the booking workflow. Policy must allow AUTO_TENDER.
// ---------------------------------------------------------------------------
export async function autoDispatchTender(
  ctx: AccountContext,
  shipmentId: string,
  options: {
    mode?: string;
    equipment?: string;
    freightQuoteId?: string;
  } = {}
) {
  // Policy gate: is auto-tender allowed?
  const policyResult = await evaluateAutonomyPolicy(
    ctx,
    { actionType: "AUTO_TENDER", confidenceScore: 90 },
    "Tender Dispatch Agent"
  );

  if (!policyResult.allowed) {
    // Create a Review Required decision — human must dispatch manually
    const decision = await db.agentDecision.create({
      data: {
        accountId: ctx.accountId,
        shipmentId,
        agentName: "Tender Dispatch Agent",
        decisionSummary: `Auto-tender blocked by policy: ${policyResult.reason ?? "SUPERVISED mode"}.`,
        confidence: 95,
        triageState: "NEEDS_HUMAN_REVIEW",
        autoApproved: false,
        status: "Review Required",
        blockedReason: policyResult.reason,
      },
    });
    return { dispatched: false, decision, reason: policyResult.reason };
  }

  // Score carriers for this shipment
  const rankedCarriers = await evaluateCarriersForShipment(ctx, {
    mode: options.mode ?? "OCEAN",
    equipment: options.equipment ?? "40HC",
    requireInsurance: true,
    shipmentId,
  });

  const topCarrier = rankedCarriers.find((c) => c.isEligible);

  if (!topCarrier) {
    return { dispatched: false, reason: "No eligible carriers found." };
  }

  const { tender } = await createAndSendTender(ctx, {
    shipmentId,
    freightQuoteId: options.freightQuoteId,
    carrierId: topCarrier.carrierId,
    timeoutHours: 4,
    idempotencyKey: `auto-${shipmentId}`,
  });

  return {
    dispatched: true,
    tender,
    carrier: topCarrier,
  };
}
