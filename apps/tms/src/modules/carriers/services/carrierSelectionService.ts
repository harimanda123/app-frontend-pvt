import { db } from "@qubere/db";
import type { AccountContext } from "@qubere/auth";
import { TmsAccountContextBuilder } from "../../memory/memory.context-builder";
import { buildLaneKey } from "../../memory/memory.domain-events";

export interface CarrierScoringInput {
  mode: string;
  origin?: { city?: string; country?: string; unlocode?: string };
  destination?: { city?: string; country?: string; unlocode?: string };
  equipment?: string;
  requireInsurance?: boolean;
  requireSafetyCheck?: boolean;
  excludeCarrierIds?: string[];
  shipmentId?: string;
}

export interface ScoredCarrier {
  carrierId: string;
  carrierProfileId?: string;
  carrierName: string;
  scac?: string | null;
  mc?: string | null;
  dot?: string | null;
  score: number;
  isEligible: boolean;
  isPreferred: boolean;
  hasInsurance: boolean;
  safetyStatus?: string;
  onTimeDeliveryRate: number;
  tenderAcceptanceRate: number;
  recentRejectionCount: number;
  scoreBreakdown: {
    base: number;
    insurance: number;
    safety: number;
    preferred: number;
    onTime: number;
    tenderAcceptance: number;
    recentHistory: number;
    accountMemory: number;
  };
}

export async function evaluateCarriersForShipment(
  ctx: AccountContext,
  input: CarrierScoringInput
): Promise<ScoredCarrier[]> {
  const mode = input.mode.toUpperCase();
  const laneKey = buildLaneKey({ mode, equipment: input.equipment, origin: input.origin, destination: input.destination });
  const memoryContext = await TmsAccountContextBuilder.build({
    accountId: ctx.accountId,
    task: "CARRIER_SELECTION",
    query: [mode, input.equipment, input.origin?.unlocode, input.destination?.unlocode].filter(Boolean).join(" "),
    scope: {
      shipmentId: input.shipmentId,
      laneKey,
      mode,
      equipment: input.equipment,
      origin: input.origin?.unlocode ?? input.origin?.city,
      destination: input.destination?.unlocode ?? input.destination?.city,
    },
  });
  const profileModel = (db as any).carrierProfile ?? (db as any).carrier;

  if (!profileModel) return [];

  let profiles: any[] = [];
  try {
    profiles = await profileModel.findMany({
      where: {
        accountId: ctx.accountId,
        ...(profileModel === (db as any).carrierProfile ? { approvedStatus: "APPROVED" } : { status: "ACTIVE" }),
      },
      include: {
        party: { include: { names: true } },
      },
    });
  } catch {
    profiles = [];
  }

  // Load recent tender history (last 90 days) for all carriers — one query
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400 * 1000);
  let recentTenders: any[] = [];
  try {
    recentTenders = await (db as any).tender.findMany({
      where: {
        accountId: ctx.accountId,
        createdAt: { gte: ninetyDaysAgo },
        carrierId: { in: profiles.map((p: any) => p.partyId ?? p.id).filter((id: any): id is string => Boolean(id)) },
      },
      select: {
        carrierId: true,
        status: true,
        shipmentId: true,
      },
    });
  } catch {
    recentTenders = [];
  }

  // Build per-carrier tender maps
  const tendersByCarrier = new Map<
    string,
    { total: number; accepted: number; rejected: number; activeOnShipment: boolean }
  >();

  for (const tender of (recentTenders || [])) {
    if (!tender.carrierId) continue;
    const existing = tendersByCarrier.get(tender.carrierId) ?? {
      total: 0,
      accepted: 0,
      rejected: 0,
      activeOnShipment: false,
    };
    existing.total++;
    if (tender.status === "ACCEPTED") existing.accepted++;
    if (tender.status === "REJECTED" || tender.status === "EXPIRED") existing.rejected++;
    if (
      input.shipmentId &&
      tender.shipmentId === input.shipmentId &&
      (tender.status === "SENT" || tender.status === "DRAFT")
    ) {
      existing.activeOnShipment = true;
    }
    tendersByCarrier.set(tender.carrierId, existing);
  }

  // Score each carrier
  const scored: ScoredCarrier[] = (profiles as any[])
    .filter((profile) => {
      const cId = profile.partyId ?? profile.id;
      if (input.excludeCarrierIds?.includes(cId)) return false;
      return true;
    })
    .map((profile): ScoredCarrier | null => {
      const carrierName = profile.party?.names?.[0]?.rawName ?? profile.legalName ?? "Carrier";
      const modes = (profile.modes as string[]) ?? ["OCEAN", "TRUCK"];
      const equipmentCaps = (profile.equipmentCapabilities as string[]) ?? ["40HC", "20GP", "53FT_DRY"];
      const metrics = (profile.performanceMetrics as Record<string, number>) ?? {};

      const supportsMode = modes.includes(mode);
      const supportsEquipment = input.equipment
        ? equipmentCaps.includes(input.equipment)
        : true;
      const hasInsurance = profile.insuranceStatus === "ACTIVE" || profile.insuranceOnFile === true;
      const isSafetySatisfactory =
        profile.safetyStatus === "SATISFACTORY" || !input.requireSafetyCheck;
      const isPreferred = profile.preferredStatus === true;

      const cId = profile.partyId ?? profile.id;
      const tenderHistory = tendersByCarrier.get(cId);

      if (tenderHistory?.activeOnShipment) {
        return null;
      }

      const base = 40;
      const insuranceScore = hasInsurance ? 15 : input.requireInsurance ? -30 : 0;
      const safetyScore = isSafetySatisfactory ? 10 : -10;
      const preferredScore = isPreferred ? 10 : 0;

      const onTimeRate = metrics.onTimeDeliveryRate ?? 85;
      const onTimeScore = Math.round(
        Math.max(0, Math.min(15, ((onTimeRate - 80) / 20) * 15))
      );

      const profileAcceptance = metrics.tenderAcceptanceRate ?? null;
      const computedAcceptance =
        tenderHistory && tenderHistory.total > 0
          ? (tenderHistory.accepted / tenderHistory.total) * 100
          : null;
      const tenderAcceptanceRate = computedAcceptance ?? profileAcceptance ?? 85;
      const tenderAcceptanceScore = Math.round(
        Math.max(0, Math.min(10, ((tenderAcceptanceRate - 70) / 30) * 10))
      );

      const recentRejectionCount = tenderHistory?.rejected ?? 0;
      const recentHistoryScore = Math.max(-15, -recentRejectionCount * 5);
      const accountMemoryScore = TmsAccountContextBuilder.carrierPreferenceAdjustment(memoryContext, {
        carrierId: cId,
        carrierName,
        scac: profile.scac,
      });

      const rawScore =
        base +
        insuranceScore +
        safetyScore +
        preferredScore +
        onTimeScore +
        tenderAcceptanceScore +
        recentHistoryScore +
        accountMemoryScore;

      const score = Math.max(0, Math.min(100, rawScore));

      const isEligible =
        supportsMode &&
        supportsEquipment &&
        (input.requireInsurance ? hasInsurance : true) &&
        (input.requireSafetyCheck ? isSafetySatisfactory : true);

      return {
        carrierId: cId,
        carrierProfileId: profile.id,
        carrierName,
        scac: profile.scac ?? undefined,
        mc: profile.mc ?? profile.mcNumber ?? undefined,
        dot: profile.dot ?? profile.dotNumber ?? undefined,
        score,
        isEligible,
        isPreferred,
        hasInsurance,
        safetyStatus: profile.safetyStatus ?? undefined,
        onTimeDeliveryRate: onTimeRate,
        tenderAcceptanceRate,
        recentRejectionCount,
        scoreBreakdown: {
          base,
          insurance: insuranceScore,
          safety: safetyScore,
          preferred: preferredScore,
          onTime: onTimeScore,
          tenderAcceptance: tenderAcceptanceScore,
          recentHistory: recentHistoryScore,
          accountMemory: accountMemoryScore,
        },
      } satisfies ScoredCarrier;
    })
    .filter((c): c is ScoredCarrier => c !== null);

  // Sort: eligible carriers first, then by score descending
  scored.sort((a, b) => {
    if (a.isEligible !== b.isEligible) return a.isEligible ? -1 : 1;
    return b.score - a.score;
  });

  return scored;
}
