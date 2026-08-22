import { db } from "@qubere/db";

export interface ComputeEtaInput {
  shipmentId: string;
  trackingEventId: string;
  newEstimatedArrival: Date;
  reasonCode?: string | null;
  confidence?: number | null;
}

export async function computeAndPersistEtaObservation(input: ComputeEtaInput) {
  // 1. Fetch previous EtaObservation if available
  const previousObservation = await db.etaObservation.findFirst({
    where: { shipmentId: input.shipmentId },
    orderBy: { createdAt: "desc" },
  });

  let deltaMinutes = 0;
  if (previousObservation?.eta) {
    const prevMs = new Date(previousObservation.eta).getTime();
    const newMs = input.newEstimatedArrival.getTime();
    deltaMinutes = Math.round((newMs - prevMs) / (1000 * 60));
  }

  const shipment = await db.shipment.findUnique({
    where: { id: input.shipmentId },
    select: { accountId: true },
  });

  if (!shipment) {
    throw new Error(`Shipment ${input.shipmentId} not found`);
  }

  // 2. Create new EtaObservation record
  const observation = await db.etaObservation.create({
    data: {
      accountId: shipment.accountId,
      shipmentId: input.shipmentId,
      estimatedAt: new Date(),
      eta: input.newEstimatedArrival,
      previousEta: previousObservation?.eta ?? null,
      deltaMinutes,
      provider: "CARRIER",
      reasonCode: input.reasonCode ?? "CARRIER_UPDATE",
      confidence: input.confidence ?? 90,
    },
  });

  return observation;
}
