import { db } from "@qubere/db";
import type { AccountContext } from "@qubere/auth";

export interface CreateCarrierProfileInput {
  partyId?: string;
  legalName?: string;
  scac?: string | null;
  dot?: string | null;
  mc?: string | null;
  modes?: string[];
  equipmentCapabilities?: string[];
  insuranceStatus?: "ACTIVE" | "EXPIRED" | "PENDING";
  safetyStatus?: "SATISFACTORY" | "CONDITIONAL" | "UNSATISFACTORY";
  approvedStatus?: "APPROVED" | "PENDING" | "REJECTED";
  preferredStatus?: boolean;
  serviceAreas?: Record<string, unknown>;
  trackingCapabilities?: Record<string, unknown>;
}

export async function createCarrierProfile(
  ctx: AccountContext,
  input: CreateCarrierProfileInput
) {
  let partyId = input.partyId;

  if (!partyId && (db as any).party) {
    const party = await (db as any).party.create({
      data: {
        accountId: ctx.accountId,
        partyKind: "ORGANIZATION",
        status: "ACTIVE",
        reviewStatus: "APPROVED",
        names: {
          create: {
            accountId: ctx.accountId,
            rawName: input.legalName ?? "Unknown Carrier",
            normalizedName: (input.legalName ?? "UNKNOWN CARRIER").toUpperCase(),
            nameType: "LEGAL",
            isPrimary: true,
          },
        },
        roles: {
          create: {
            accountId: ctx.accountId,
            roleType: "CARRIER",
          },
        },
      },
    });
    partyId = party.id;
  }

  const model = (db as any).carrierProfile ?? (db as any).carrier;
  if (!model) return null;

  return model.create({
    data: {
      accountId: ctx.accountId,
      partyId,
      legalName: input.legalName ?? "Unknown Carrier",
      scac: input.scac ?? null,
      dot: input.dot ?? null,
      mc: input.mc ?? null,
      modes: input.modes ? (input.modes as any) : undefined,
      equipmentCapabilities: input.equipmentCapabilities ? (input.equipmentCapabilities as any) : undefined,
      insuranceStatus: input.insuranceStatus ?? "ACTIVE",
      safetyStatus: input.safetyStatus ?? "SATISFACTORY",
      approvedStatus: input.approvedStatus ?? "APPROVED",
      preferredStatus: input.preferredStatus ?? false,
      serviceAreas: input.serviceAreas ? (input.serviceAreas as any) : undefined,
      trackingCapabilities: input.trackingCapabilities ? (input.trackingCapabilities as any) : undefined,
    },
    include: {
      party: {
        include: {
          names: true,
          roles: true,
        },
      },
    },
  });
}

export async function getCarrierProfileByPartyId(ctx: AccountContext, partyId: string) {
  const model = (db as any).carrierProfile ?? (db as any).carrier;
  if (!model) return null;
  return model.findFirst({
    where: {
      accountId: ctx.accountId,
      partyId,
    },
    include: {
      party: {
        include: {
          names: true,
          roles: true,
        },
      },
    },
  });
}

export async function listCarrierProfiles(ctx: AccountContext) {
  const model = (db as any).carrierProfile ?? (db as any).carrier;
  if (!model) return [];
  return model.findMany({
    where: {
      accountId: ctx.accountId,
    },
    include: {
      party: {
        include: {
          names: true,
          roles: true,
        },
      },
    },
  });
}

export const createCarrier = createCarrierProfile;
export const getCarrierById = getCarrierProfileByPartyId;
export const listCarriers = listCarrierProfiles;
