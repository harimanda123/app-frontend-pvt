import { Decimal } from "decimal.js";
import { db } from "@qubere/db";
import type { AccountContext } from "@qubere/auth";
import { publishTransportationEvent } from "../../events/services/eventService";
import { evaluateAutonomyPolicy } from "../../autonomy/services/policyEngineService";
import { persistPromiseState } from "../../shipments/services/promiseService";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Port congestion/delay adds this many hours per detected event */
const PORT_DELAY_HOURS = 48;

/** If LFD is within this many hours with customs not released, escalate */
const LFD_RISK_THRESHOLD_HOURS = 48;

/** Demurrage rate per day (USD) used for exposure estimate */
const DEMURRAGE_RATE_PER_DAY_USD = 350;

// ---------------------------------------------------------------------------
// ETA Agent — Tracking & Replanning Cascade
//
// Observe: reads latest TrackingEvent + EtaObservation
// Understand: detects delay, calculates new ETA from event data
// Predict: estimates impact on customer promise and LFD
// Decide: evaluate autonomy policy before writing
// Act: update ETA, write EtaObservation, update promiseState, compute demurrage
// Verify: emit TransportationEvent for audit trail
// Escalate: create NEEDS_REVIEW AgentDecision if policy blocks auto-execution
// ---------------------------------------------------------------------------
export async function runTrackingEtaAgent(
  ctx: AccountContext,
  shipmentId: string
): Promise<{
  decision: { id: string; triageState: string | null; decisionSummary: string | null };
  updatedEta: Date | null;
  delayDetected: boolean;
  promiseState: string;
  demurrageExposureUsd: number;
}> {
  const shipment = await db.shipment.findFirst({
    where: { accountId: ctx.accountId, id: shipmentId },
    include: {
      trackingEvents: {
        orderBy: { occurredAt: "desc" },
        take: 5,
      },
      etaObservations: {
        orderBy: { estimatedAt: "desc" },
        take: 1,
      },
      customsFilings: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!shipment) throw new Error(`Shipment ${shipmentId} not found.`);

  const latestEvent = shipment.trackingEvents?.[0];
  const previousEta = shipment.etaObservations?.[0]?.eta ?? shipment.estimatedArrival;
  const latestFiling = shipment.customsFilings?.[0];
  const isCustomsReleased =
    latestFiling?.filingStatus === "RELEASED" ||
    latestFiling?.filingStatus === "ACCEPTED";

  // ---- OBSERVE: Determine delay from tracking signal ----
  const DELAY_EVENT_TYPES = [
    "PORT_DELAY",
    "VESSEL_DELAY",
    "WEATHER_DELAY",
    "EQUIPMENT_DELAY",
    "CONGESTION",
    "TERMINAL_DELAY",
  ];
  const delayEvent = shipment.trackingEvents.find(
    (e) => DELAY_EVENT_TYPES.includes(e.eventType ?? "")
  );
  const delayDetected = !!delayEvent;

  // ---- UNDERSTAND: Compute new ETA ----
  let newEta: Date | null = previousEta ?? null;
  let etaSource = "TRACKING_CONFIRMED";
  let etaConfidence = 90;

  if (delayDetected && previousEta) {
    const delayHours =
      (delayEvent?.normalizedData as any)?.delayHours ?? PORT_DELAY_HOURS;
    newEta = new Date(previousEta.getTime() + delayHours * 3600 * 1000);
    etaSource = delayEvent?.eventType ?? "PORT_DELAY";
    etaConfidence = 82;
  }

  // ---- PREDICT: Customer promise impact and LFD exposure ----
  const bufferHours =
    newEta && shipment.customerPromiseDate
      ? (shipment.customerPromiseDate.getTime() - newEta.getTime()) /
        (1000 * 60 * 60)
      : null;

  const lfd = shipment.lastFreeDay;
  const daysOverLfd =
    newEta && lfd
      ? Math.max(0, (newEta.getTime() - lfd.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
  const demurrageExposureUsd = Math.round(daysOverLfd * DEMURRAGE_RATE_PER_DAY_USD);

  // LFD risk: LFD within threshold and customs not released
  const hoursToLfd =
    lfd ? (lfd.getTime() - Date.now()) / (1000 * 60 * 60) : null;
  const lfdAtRisk =
    hoursToLfd !== null &&
    hoursToLfd < LFD_RISK_THRESHOLD_HOURS &&
    !isCustomsReleased;

  // ---- DECIDE: Check autonomy policy ----
  const policyResult = await evaluateAutonomyPolicy(
    ctx,
    {
      actionType: "UPDATE_ETA",
      confidenceScore: etaConfidence,
    },
    "Tracking & ETA Agent"
  );

  // ---- ACT: Write to DB if policy permits ----
  if (policyResult.allowed && newEta) {
    await db.shipment.update({
      where: { id: shipmentId },
      data: {
        estimatedArrival: newEta,
        demurrageExposureUsd: demurrageExposureUsd > 0
          ? new Decimal(demurrageExposureUsd)
          : undefined,
        healthStatus:
          lfdAtRisk || (bufferHours !== null && bufferHours < 0)
            ? "Critical"
            : bufferHours !== null && bufferHours < 4
              ? "At Risk"
              : "Healthy",
      },
    });

    // Write EtaObservation for timeline/audit
    await db.etaObservation?.create({
      data: {
        accountId: ctx.accountId,
        shipmentId,
        eta: newEta,
        provider: etaSource,
        confidence: etaConfidence,
        estimatedAt: new Date(),
      },
    }).catch(() => null);

    // Update promise state based on new ETA
    await persistPromiseState(ctx, shipmentId).catch(() => null);
  }

  // ---- VERIFY: Emit TransportationEvent ----
  if (delayDetected && newEta && previousEta) {
    await publishTransportationEvent(ctx, {
      entityType: "SHIPMENT",
      entityId: shipmentId,
      shipmentId,
      eventType: "ETA_CHANGED",
      source: "AGENT",
      payload: {
        oldEta: previousEta.toISOString(),
        newEta: newEta.toISOString(),
        reason: delayEvent?.eventType ?? "DELAY",
        delayHours: (newEta.getTime() - previousEta.getTime()) / (1000 * 60 * 60),
        demurrageExposureUsd,
        lfdAtRisk,
      },
    });
  }

  // ---- ESCALATE if needed ----
  const summary = delayDetected
    ? `Delay detected (${delayEvent?.eventType ?? "DELAY"}). ETA updated to ${newEta?.toLocaleDateString()}. ${
        demurrageExposureUsd > 0
          ? `Estimated demurrage exposure: $${demurrageExposureUsd}.`
          : ""
      }${lfdAtRisk ? " LFD at risk — customs not released." : ""}`
    : `Tracking confirmed — shipment on schedule. ETA: ${newEta?.toLocaleDateString() ?? "TBD"}.`;

  const decision = await db.agentDecision.create({
    data: {
      accountId: ctx.accountId,
      shipmentId,
      agentName: "Tracking & ETA Agent",
      decisionSummary: summary,
      confidence: etaConfidence,
      triageState: policyResult.triageState,
      autoApproved: policyResult.allowed,
      status: policyResult.allowed ? "Completed" : "Review Required",
      blockedReason: policyResult.allowed ? null : policyResult.reason,
    },
  });

  const promiseState = shipment.promiseState ?? "ON_PROMISE";

  return {
    decision: {
      id: decision.id,
      triageState: decision.triageState,
      decisionSummary: decision.decisionSummary,
    },
    updatedEta: newEta,
    delayDetected,
    promiseState,
    demurrageExposureUsd,
  };
}

// ---------------------------------------------------------------------------
// Risk Agent — LFD / Demurrage / Promise surveillance sweep
//
// Runs on a schedule (or triggered by ETA changes) to evaluate all active
// shipments. Creates ExceptionItems for shipments crossing risk thresholds.
// ---------------------------------------------------------------------------
export async function runRiskAgent(ctx: AccountContext): Promise<{
  evaluated: number;
  exceptionsCreated: number;
  shipmentsAtRisk: string[];
}> {
  const policyResult = await evaluateAutonomyPolicy(
    ctx,
    { actionType: "RESOLVE_EXCEPTION", confidenceScore: 95 },
    "Risk Agent"
  );

  // Load all active shipments with LFD or customerPromiseDate
  const shipments = await db.shipment.findMany({
    where: {
      accountId: ctx.accountId,
      deletedAt: null,
      status: { notIn: ["Completed", "Cancelled", "DELIVERED"] },
    },
    select: {
      id: true,
      shipmentNumber: true,
      lastFreeDay: true,
      customerPromiseDate: true,
      estimatedArrival: true,
      demurrageExposureUsd: true,
      healthStatus: true,
      etaObservations: {
        orderBy: { estimatedAt: "desc" },
        take: 1,
        select: { eta: true },
      },
      customsFilings: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { filingStatus: true },
      },
      exceptionItems: {
        where: { type: "LFD_AT_RISK", status: "Open" },
        select: { id: true },
      },
    },
    take: 200,
  });

  let exceptionsCreated = 0;
  const shipmentsAtRisk: string[] = [];

  for (const shipment of shipments) {
    const currentEta =
      shipment.etaObservations[0]?.eta ?? shipment.estimatedArrival;
    const lfd = shipment.lastFreeDay;
    const latestFiling = shipment.customsFilings[0];
    const isCustomsReleased =
      latestFiling?.filingStatus === "RELEASED" ||
      latestFiling?.filingStatus === "ACCEPTED";

    // LFD risk
    const hoursToLfd =
      lfd ? (lfd.getTime() - Date.now()) / (1000 * 60 * 60) : null;
    const hasOpenLfdException = shipment.exceptionItems.length > 0;

    if (
      hoursToLfd !== null &&
      hoursToLfd < LFD_RISK_THRESHOLD_HOURS &&
      !isCustomsReleased &&
      !hasOpenLfdException &&
      policyResult.allowed
    ) {
      await db.exceptionItem.create({
        data: {
          accountId: ctx.accountId,
          shipmentId: shipment.id,
          type: "LFD_AT_RISK",
          category: "TRANSPORTATION",
          severity: hoursToLfd < 12 ? "Critical" : "High",
          description: `Last Free Day is ${hoursToLfd.toFixed(1)}h away and customs has not been released. Demurrage risk is active.`,
          requiredAction: `Expedite customs release immediately to avoid demurrage charges. Contact broker for Entry ${shipment.shipmentNumber}.`,
          blocking: true,
          status: "Open",
          sourceAgent: "Risk Agent",
        },
      }).catch(() => null);
      exceptionsCreated++;
      shipmentsAtRisk.push(shipment.shipmentNumber);
    }

    // Update shipment health status
    const bufferHours =
      currentEta && shipment.customerPromiseDate
        ? (shipment.customerPromiseDate.getTime() - currentEta.getTime()) /
          (1000 * 60 * 60)
        : null;

    const isCritical =
      (hoursToLfd !== null && hoursToLfd < 12 && !isCustomsReleased) ||
      (bufferHours !== null && bufferHours < 0);
    const isAtRisk =
      (hoursToLfd !== null && hoursToLfd < LFD_RISK_THRESHOLD_HOURS) ||
      (bufferHours !== null && bufferHours < 4);

    const newHealthStatus = isCritical
      ? "Critical"
      : isAtRisk
        ? "At Risk"
        : "Healthy";

    if (newHealthStatus !== shipment.healthStatus) {
      await db.shipment
        .update({
          where: { id: shipment.id },
          data: { healthStatus: newHealthStatus },
        })
        .catch(() => null);
    }
  }

  return {
    evaluated: shipments.length,
    exceptionsCreated,
    shipmentsAtRisk,
  };
}

// ---------------------------------------------------------------------------
// Exception Resolution Agent — processes open exceptions
//
// For each open exception, determines if it can be auto-resolved or needs
// human escalation. Customs holds are always escalated.
// ---------------------------------------------------------------------------
export async function runExceptionResolutionAgent(
  ctx: AccountContext,
  shipmentId: string
): Promise<{
  decision: { id: string; triageState: string | null; decisionSummary: string | null };
  resolutionAction: string;
  triageState: "AUTO_VERIFIED" | "NEEDS_HUMAN_REVIEW";
}> {
  const shipment = await db.shipment.findFirst({
    where: { accountId: ctx.accountId, id: shipmentId },
    include: {
      exceptionItems: {
        where: { status: { in: ["Open", "OPEN"] } },
      },
      customsFilings: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!shipment) throw new Error(`Shipment ${shipmentId} not found.`);

  const openExceptions = shipment.exceptionItems;
  const latestFiling = shipment.customsFilings[0];
  const isCustomsHold =
    latestFiling?.filingStatus === "CustomsHold" ||
    latestFiling?.filingStatus === "HOLD" ||
    openExceptions.some((e) => e.type === "CUSTOMS_HOLD");

  let resolutionAction = "MONITORING";
  let triageState: "AUTO_VERIFIED" | "NEEDS_HUMAN_REVIEW" = "AUTO_VERIFIED";

  if (isCustomsHold) {
    // Customs hold override is always forbidden autonomously
    const policyResult = await evaluateAutonomyPolicy(
      ctx,
      { actionType: "CUSTOMS_HOLD_OVERRIDE", confidenceScore: 90.0 },
      "Exception Resolution Agent"
    );
    resolutionAction = "ESCALATED_CUSTOMS_HOLD";
    triageState = policyResult.triageState;
  } else if (openExceptions.length === 0) {
    resolutionAction = "ALL_CLEAR";
  } else {
    // Non-blocking, non-customs exceptions — check policy for auto-resolution
    const policyResult = await evaluateAutonomyPolicy(
      ctx,
      { actionType: "RESOLVE_EXCEPTION", confidenceScore: 88 },
      "Exception Resolution Agent"
    );
    resolutionAction = policyResult.allowed
      ? "AUTO_MONITORING"
      : "ESCALATED_MANUAL_REVIEW";
    triageState = policyResult.triageState;
  }

  const decision = await db.agentDecision.create({
    data: {
      accountId: ctx.accountId,
      shipmentId: shipment.id,
      agentName: "Exception Resolution Agent",
      decisionSummary: isCustomsHold
        ? `Customs Hold detected on ${shipment.shipmentNumber}. Escalated to licensed Customs Broker for resolution.`
        : openExceptions.length > 0
          ? `${openExceptions.length} open exception(s) under review on ${shipment.shipmentNumber}.`
          : `All exception monitors clear on ${shipment.shipmentNumber}.`,
      confidence: 95.0,
      triageState,
      autoApproved: triageState === "AUTO_VERIFIED",
      status:
        triageState === "NEEDS_HUMAN_REVIEW" ? "Review Required" : "Completed",
    },
  });

  return {
    decision: {
      id: decision.id,
      triageState: decision.triageState,
      decisionSummary: decision.decisionSummary,
    },
    resolutionAction,
    triageState,
  };
}
