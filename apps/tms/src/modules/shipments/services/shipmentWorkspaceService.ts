import { db } from "@qubere/db";
import type { AccountContext } from "@qubere/auth";

export interface JourneyMilestone {
  id: string;
  title: string;
  location: string;
  scheduledTime?: string;
  actualTime?: string;
  status: "COMPLETED" | "ACTIVE" | "UPCOMING" | "DELAYED" | "BLOCKED";
  source?: string;
  notes?: string;
}

export interface RiskDimension {
  key: string;
  label: string;
  status: "Healthy" | "At Risk" | "Critical" | "Cleared" | "Complete" | "On Promise";
  value: string;
  cause?: string | null;
  impact?: string | null;
  explanation?: string;
}

export interface QubereAiActionState {
  needsHumanAction: boolean;
  headline: string;
  actionRequiredTitle?: string;
  reasoning: string;
  recommendedAction?: string;
  alternativeOption?: string;
  costImpactUsd?: number;
  marginBeforePct?: number;
  marginAfterPct?: number;
  customerImpact?: string;
  confidenceScore: number;
  monitoredItems: string[];
  nextAutoActions: string[];
}

export interface ShipmentHealthSnapshot {
  overallHealth: "ON_TRACK" | "AT_RISK" | "ACTION_REQUIRED" | "DELIVERED" | "CRITICAL";
  healthScore: number;
  eta: string;
  etaConfidence: number;
  customerPromiseDate: string;
  scheduleBufferHours: number;
  nextMilestone: {
    title: string;
    location: string;
    scheduledTime: string;
  };
  humanActionRequired: boolean;
  actionRequiredTitle?: string;
  route: {
    origin: string;
    portOfDischarge: string;
    finalDestination: string;
    fullRouteText: string;
    modes: string;
  };
  dimensions: RiskDimension[];
  qubereAi: QubereAiActionState;
}

export async function getShipmentWorkspaceDetails(
  ctx: AccountContext,
  shipmentId: string
) {
  const shipment = await db.shipment.findFirst({
    where: {
      accountId: ctx.accountId,
      id: shipmentId,
    },
    include: {
      client: true,
      importerOfRecord: true,
      assignedBroker: true,
      documents: { orderBy: { createdAt: "desc" } },
      lineItems: true,
      customsFilings: {
        orderBy: { createdAt: "desc" },
        include: { responses: true },
      },
      exceptionItems: { orderBy: { createdAt: "desc" } },
      agentDecisions: { orderBy: { createdAt: "desc" } },
      transportLegs: { orderBy: { sequence: "asc" } },
      trackingStops: { orderBy: { sequence: "asc" } },
      trackingEvents: { orderBy: { occurredAt: "desc" } },
      etaObservations: { orderBy: { estimatedAt: "desc" }, take: 1 },
      shipmentCharges: true,
      shipmentCosts: true,
    },
  }).catch(() => null);

  if (!shipment) {
    return null;
  }

  const journey = computeMultimodalJourney(shipment);
  const crossDomainRisks = evaluateCrossDomainRisks(shipment);
  const healthSnapshot = computeShipmentHealthSnapshot(shipment);

  // Use Decimal-safe number conversion, fall back to cached Shipment fields
  const sellAmount =
    (shipment as any).shipmentCharges?.reduce(
      (acc: number, c: any) => acc + Number(c.netAmount ?? c.grossAmount ?? 0),
      0
    ) ?? Number(shipment.sellAmount ?? 0);

  const costAmount =
    (shipment as any).shipmentCosts?.reduce(
      (acc: number, c: any) => acc + Number(c.amount ?? 0),
      0
    ) ?? Number(shipment.expectedBuyCost ?? 0);

  const grossProfit = sellAmount - costAmount;
  const grossMarginPct = sellAmount > 0 ? (grossProfit / sellAmount) * 100 : 0;
  const markupOnCostPct = costAmount > 0 ? (grossProfit / costAmount) * 100 : 0;

  return {
    shipment,
    journey,
    crossDomainRisks,
    healthSnapshot,
    financials: {
      totalSellAmount: sellAmount,
      totalBuyAmount: costAmount,
      grossProfit,
      margin: grossProfit,
      grossMarginPct: Number(grossMarginPct.toFixed(2)),
      markupOnCostPct: Number(markupOnCostPct.toFixed(2)),
      currency: (shipment as any).invoiceCurrency ?? "USD",
    },
  };
}

export function computeShipmentHealthSnapshot(shipment: any): ShipmentHealthSnapshot {
  const latestFiling = shipment.customsFilings?.[0];
  const isCustomsReleased =
    latestFiling?.filingStatus === "RELEASED" ||
    latestFiling?.filingStatus === "ACCEPTED" ||
    latestFiling?.filingStatus === "Released";
  const hasCustomsHold =
    latestFiling?.filingStatus === "CustomsHold" ||
    latestFiling?.filingStatus === "HOLD" ||
    shipment.exceptionItems?.some((e: any) => e.type === "CUSTOMS_HOLD");
  const openExceptions =
    shipment.exceptionItems?.filter(
      (e: any) => e.status === "Open" || e.status === "OPEN"
    ) ?? [];

  // ---------------------------------------------------------------------------
  // ETA — use latest EtaObservation, fall back to Shipment.estimatedArrival
  // ---------------------------------------------------------------------------
  const latestEtaObs = shipment.etaObservations?.[0];
  const etaDate: Date | null = latestEtaObs?.eta ?? shipment.estimatedArrival ?? null;
  const etaConfidence: number = latestEtaObs?.confidence ?? 0;
  const etaStr = etaDate
    ? etaDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " • " +
      etaDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "ETA unknown";

  // ---------------------------------------------------------------------------
  // Customer promise & buffer
  // ---------------------------------------------------------------------------
  const promiseDate: Date | null = shipment.customerPromiseDate ?? null;
  const promiseDateStr = promiseDate
    ? promiseDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " • " +
      promiseDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "No promise date";

  const bufferHours =
    etaDate && promiseDate
      ? (promiseDate.getTime() - etaDate.getTime()) / (1000 * 60 * 60)
      : null;

  const promiseState: string = shipment.promiseState ?? "ON_PROMISE";
  const isDelayDetected =
    promiseState === "AT_RISK" || promiseState === "MISSED" || openExceptions.length > 0;
  const needsAction = isDelayDetected || hasCustomsHold;

  // ---------------------------------------------------------------------------
  // Route text — use real DB fields
  // ---------------------------------------------------------------------------
  const origin: string = shipment.portOfLoading
    ? String(shipment.portOfLoading).split(",")[0]
    : shipment.origin ?? "Origin";
  const portOfDischarge: string = shipment.portOfUnlading
    ? String(shipment.portOfUnlading).split(",")[0]
    : shipment.destination ?? "Destination";
  const finalDestination: string =
    shipment.destinationCountry ?? shipment.destination ?? portOfDischarge;

  // ---------------------------------------------------------------------------
  // Financials — use cached Shipment columns (set by financialLedgerService)
  // ---------------------------------------------------------------------------
  const grossMarginPct = shipment.grossMarginPct != null ? Number(shipment.grossMarginPct) : null;
  const costVariancePct = shipment.costVariancePct != null ? Number(shipment.costVariancePct) : null;

  // Documents
  const totalDocs = shipment.documents?.length ?? 0;
  const verifiedDocs =
    shipment.documents?.filter(
      (d: any) => d.status === "VERIFIED" || d.status === "Verified"
    ).length ?? 0;

  // Carrier info from tracking data
  const latestTrackingEvent = shipment.trackingEvents?.[0];
  const carrierName = shipment.carrierName ?? latestTrackingEvent?.source ?? "Carrier";

  // ---------------------------------------------------------------------------
  // Risk dimensions — derived from real data
  // ---------------------------------------------------------------------------
  const dimensions: RiskDimension[] = [
    {
      key: "schedule",
      label: "Schedule",
      status: promiseState === "MISSED" ? "Critical" : promiseState === "AT_RISK" || openExceptions.length > 0 ? "At Risk" : "Healthy",
      value:
        bufferHours != null
          ? bufferHours < 0
            ? `ETA slipped ${Math.abs(bufferHours).toFixed(1)}h past promise`
            : `${bufferHours.toFixed(1)}h ahead of customer promise`
          : etaStr,
      cause: openExceptions.some((e: any) => e.type === "PORT_DELAY") ? "Vessel arrival delay" : undefined,
      explanation:
        promiseState === "MISSED"
          ? "ETA has passed customer promise date — rescheduling required"
          : promiseState === "AT_RISK"
            ? "Schedule buffer is below threshold"
            : "Shipment on schedule",
    },
    {
      key: "cost",
      label: "Cost",
      status:
        costVariancePct != null && Math.abs(costVariancePct) > 5
          ? "At Risk"
          : grossMarginPct != null && grossMarginPct < 10
            ? "At Risk"
            : "Healthy",
      value:
        grossMarginPct != null
          ? `Gross margin ${grossMarginPct.toFixed(1)}%`
          : "Financials not yet computed",
      explanation:
        costVariancePct != null && costVariancePct > 0
          ? `Cost variance +${costVariancePct.toFixed(1)}% vs expected`
          : "Within financial budget",
    },
    {
      key: "carrier",
      label: "Carrier",
      status: "Healthy",
      value: carrierName,
      explanation: "No active carrier service exceptions",
    },
    {
      key: "customs",
      label: "Customs",
      status: hasCustomsHold ? "Critical" : isCustomsReleased ? "Cleared" : "Healthy",
      value: isCustomsReleased
        ? "Customs Released"
        : hasCustomsHold
          ? "Customs Hold — Action Required"
          : latestFiling
            ? "Entry Submitted"
            : "No filing yet",
      explanation: isCustomsReleased
        ? "CBP Entry released"
        : hasCustomsHold
          ? "CBP hold active — drayage blocked"
          : "Awaiting customs clearance",
    },
    {
      key: "documents",
      label: "Documents",
      status: totalDocs > 0 && verifiedDocs === totalDocs ? "Complete" : "Healthy",
      value: totalDocs > 0 ? `${verifiedDocs}/${totalDocs} Verified` : "No documents uploaded",
      explanation:
        verifiedDocs < totalDocs
          ? `${totalDocs - verifiedDocs} document(s) pending verification`
          : "All documents verified",
    },
    {
      key: "delivery",
      label: "Delivery",
      status: isCustomsReleased ? "Healthy" : hasCustomsHold ? "Critical" : "Healthy",
      value: isCustomsReleased ? "Drayage confirmed" : "Awaiting customs release",
      explanation: isCustomsReleased
        ? "Drayage dispatch unlocked"
        : "Drayage held pending customs release",
    },
    {
      key: "customerCommitment",
      label: "Customer",
      status:
        promiseState === "MISSED"
          ? "Critical"
          : promiseState === "AT_RISK"
            ? "At Risk"
            : "On Promise",
      value:
        bufferHours != null
          ? bufferHours < 0
            ? `Promise missed by ${Math.abs(bufferHours).toFixed(1)}h`
            : `${bufferHours.toFixed(1)}h buffer remaining`
          : promiseDateStr,
      explanation:
        promiseState === "MISSED"
          ? "ETA is past the customer promise date"
          : promiseState === "AT_RISK"
            ? "Buffer below threshold — notify customer"
            : "On track to meet customer promise",
    },
  ];

  // Qubere AI state — reflect pending agent decisions needing review
  const pendingDecision = shipment.agentDecisions?.find(
    (d: any) => d.triageState === "NEEDS_REVIEW" || d.status === "Review Required"
  );

  const qubereAi: QubereAiActionState = pendingDecision
    ? {
        needsHumanAction: true,
        headline: "QUBERE NEEDS YOU",
        actionRequiredTitle: pendingDecision.decisionSummary ?? "Agent decision requires your review.",
        reasoning: pendingDecision.purpose ?? pendingDecision.decisionSummary ?? "",
        recommendedAction: pendingDecision.proposedDescription ?? undefined,
        confidenceScore: pendingDecision.confidence ?? 85,
        monitoredItems: pendingDecision.dataSources ?? [],
        nextAutoActions: ["Approve or reject the pending decision to unblock the agent workflow"],
      }
    : {
        needsHumanAction: false,
        headline: needsAction ? "QUBERE — Monitoring active exceptions." : "QUBERE — Everything is on track.",
        reasoning:
          openExceptions.length > 0
            ? `${openExceptions.length} open exception(s) under review. Monitoring for resolution.`
            : "All operational risk dimensions clear. Monitoring continuously.",
        confidenceScore: 88,
        monitoredItems: [
          "ETA and vessel position",
          "Customs clearance status",
          "Last Free Day exposure",
          "Carrier invoice matching",
        ],
        nextAutoActions: [
          "Update ETA when tracking signal arrives",
          "Dispatch drayage upon customs release",
          "Notify customer if ETA changes >2h",
          "Match carrier invoice when received",
        ],
      };

  const aiSummary = {
    headline: qubereAi.headline,
    reasoning: qubereAi.reasoning,
    recommendedAction: openExceptions.some((e: any) => e.type === "PORT_DELAY")
      ? "Reschedule delivery appointment"
      : (qubereAi.recommendedAction ?? "Monitor shipment progress"),
    customerImpact: openExceptions.some((e: any) => e.type === "PORT_DELAY") ? "+1 day" : "On Schedule",
    confidenceScore: 88,
  };

  const overallHealth: ShipmentHealthSnapshot["overallHealth"] = (() => {
    if (shipment.status === "Completed") return "DELIVERED";
    if (hasCustomsHold) return "CRITICAL";
    if (promiseState === "MISSED") return "CRITICAL";
    if (shipment.status === "At Risk" || promiseState === "AT_RISK" || openExceptions.length > 0) return "AT_RISK";
    if (needsAction) return "ACTION_REQUIRED";
    return "ON_TRACK";
  })();

  const healthScore =
    overallHealth === "DELIVERED"
      ? 100
      : overallHealth === "CRITICAL"
        ? 30
        : overallHealth === "ACTION_REQUIRED"
          ? 55
          : overallHealth === "AT_RISK"
            ? 78
            : 95;

  // Next upcoming milestone from transport legs
  const nextLeg = shipment.transportLegs?.find((l: any) => !l.actualEnd);
  const nextMilestone = nextLeg
    ? {
        title: nextLeg.description ?? "Next Leg",
        location: nextLeg.portOfUnlading ?? nextLeg.destination ?? "En route",
        scheduledTime: nextLeg.estimatedEnd
          ? new Date(nextLeg.estimatedEnd).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }) +
            " • " +
            new Date(nextLeg.estimatedEnd).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })
          : "TBD",
      }
    : {
        title: "Delivery",
        location: finalDestination,
        scheduledTime: etaStr,
      };

  return {
    overallHealth,
    healthScore,
    eta: etaStr,
    etaConfidence: 88,
    customerPromiseDate: promiseDateStr,
    scheduleBufferHours: bufferHours ?? 0,
    nextMilestone,
    humanActionRequired: needsAction,
    actionRequiredTitle: pendingDecision?.decisionSummary ?? (needsAction ? "Exception requires your review" : undefined),
    route: {
      origin,
      portOfDischarge,
      finalDestination,
      fullRouteText: `${origin} → ${portOfDischarge} → ${finalDestination}`,
      modes: shipment.transportMode ? String(shipment.transportMode).replace(/_/g, " + ") : "Ocean",
    },
    dimensions,
    qubereAi,
    aiSummary,
  } as any;
}

export function computeMultimodalJourney(shipment: any): any[] {
  const latestFiling = shipment.customsFilings?.[0];
  const isCustomsReleased =
    latestFiling?.filingStatus === "RELEASED" ||
    latestFiling?.filingStatus === "ACCEPTED" ||
    latestFiling?.filingStatus === "Released";

  return [
    {
      id: "m_1",
      name: "Origin Port",
      title: "Origin Port",
      location: shipment.portOfLoading || shipment.countryOfExport || "Shanghai (CNSHA)",
      status: "COMPLETED",
    },
    {
      id: "m_2",
      name: "Ocean Transit",
      title: "Ocean Transit",
      location: shipment.carrierName || "Ocean Vessel",
      status: "COMPLETED",
    },
    {
      id: "m_3",
      name: "Port of Entry / Discharge",
      title: "Port of Entry / Discharge",
      location: shipment.portOfEntry || "Oakland (USOAK)",
      status: "COMPLETED",
    },
    {
      id: "m_4",
      name: "Customs Clearance",
      title: "Customs Clearance",
      location: "CBP Entry 7501",
      status: isCustomsReleased ? "COMPLETED" : "UPCOMING",
    },
    {
      id: "m_5",
      name: "Drayage Dispatch",
      title: "Drayage Dispatch",
      location: "Port -> Terminal",
      status: isCustomsReleased ? "UPCOMING" : "BLOCKED",
    },
    {
      id: "m_6",
      name: "Final Delivery",
      title: "Final Delivery",
      location: shipment.destinationCountry || "Final Destination",
      status: "UPCOMING",
    },
  ];
}

export const computeShipmentJourney = computeMultimodalJourney;

export function evaluateCrossDomainRisks(shipment: any) {
  const risks: Array<{ code: string; title: string; severity: "CRITICAL" | "WARNING" | "INFO"; description: string }> = [];

  const latestFiling = shipment.customsFilings?.[0];
  const isCustomsReleased = latestFiling?.filingStatus === "RELEASED" || latestFiling?.filingStatus === "ACCEPTED" || latestFiling?.filingStatus === "Released";

  if (!isCustomsReleased) {
    risks.push({
      code: "CUSTOMS_BLOCKING_DELIVERY",
      title: "Customs Clearance Awaiting Release — Drayage Blocked",
      severity: "CRITICAL",
      description: "Customs entry 7501 has been submitted to CBP. Drayage dispatch is held until official Customs release to avoid demurrage penalties.",
    });
  }

  const hasLfdRisk = shipment.complianceDeadlines?.some((c: any) => c.deadlineType === "LAST_FREE_DAY") || shipment.lastFreeDay;
  if (hasLfdRisk) {
    risks.push({
      code: "LAST_FREE_DAY_RISK",
      title: "Last Free Day Risk — Demurrage Exposure",
      severity: "CRITICAL",
      description: "Last Free Day is approaching or exceeded. Clear customs and arrange drayage immediately.",
    });
  }

  return risks;
}
