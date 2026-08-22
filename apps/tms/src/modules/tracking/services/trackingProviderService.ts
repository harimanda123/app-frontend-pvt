import { db } from "@qubere/db";
import type { AccountContext } from "@qubere/auth";
import { publishTransportationEvent } from "../../events/services/eventService";

export type TrackingProviderType =
  | "PROJECT44"
  | "FOURKITES"
  | "VIZION"
  | "TERMINAL_API"
  | "EDI_214"
  | "OCEAN_CARRIER_SCRAPE"
  | "MANUAL_UPDATE";

export interface IngestTrackingSignalInput {
  provider: TrackingProviderType;
  shipmentId?: string;
  movementId?: string;
  rawEventCode: string;
  eventDescription?: string;
  occurredAt?: Date;
  location?: { city?: string; country?: string; unlocode?: string; coordinates?: [number, number] };
  newEstimatedArrival?: Date;
  carrierReference?: string;
}

export async function ingestRawTrackingSignal(
  ctx: AccountContext,
  input: IngestTrackingSignalInput
) {
  const occurredAt = input.occurredAt ?? new Date();

  // Map provider raw event code to standardized TransportationEvent code
  const eventType = mapProviderEventCode(input.rawEventCode);

  // Update Shipment arrival / ETA if provided
  if (input.shipmentId) {
    const updateData: any = {};
    if (input.newEstimatedArrival) {
      updateData.estimatedArrival = input.newEstimatedArrival;
    }
    if (eventType === "CONTAINER_DISCHARGED" || eventType === "PORT_ARRIVED") {
      updateData.arrivalDate = occurredAt;
    }

    if (Object.keys(updateData).length > 0) {
      await db.shipment.update({
        where: { id: input.shipmentId },
        data: updateData,
      });
    }
  }

  // Publish standardized TransportationEvent
  const event = await publishTransportationEvent(ctx, {
    entityType: input.movementId ? "MOVEMENT" : "SHIPMENT",
    entityId: input.movementId ?? input.shipmentId ?? "shp_unknown",
    shipmentId: input.shipmentId ?? null,
    movementId: input.movementId ?? null,
    eventType,
    source: "API",
    sourceReference: `${input.provider}:${input.carrierReference ?? input.rawEventCode}`,
    occurredAt,
    location: input.location as any,
    payload: {
      provider: input.provider,
      rawEventCode: input.rawEventCode,
      eventDescription: input.eventDescription ?? input.rawEventCode,
      newEstimatedArrival: input.newEstimatedArrival,
    },
  });

  return { event, eventType };
}

export function mapProviderEventCode(rawCode: string): string {
  const normalized = rawCode.toUpperCase().replace(/[\s\-_]+/g, "_");

  if (normalized.includes("DISCHARGE") || normalized.includes("UNLOAD")) {
    return "CONTAINER_DISCHARGED";
  }
  if (normalized.includes("GATE_OUT") || normalized.includes("OUT_PORT")) {
    return "GATE_OUT_PORT";
  }
  if (normalized.includes("DEPART") || normalized.includes("VESSEL_DEPART")) {
    return "VESSEL_DEPARTED";
  }
  if (normalized.includes("ARRIV") || normalized.includes("PORT_ARRIV")) {
    return "PORT_ARRIVED";
  }
  if (normalized.includes("DELIVER") || normalized.includes("POD")) {
    return "DELIVERED";
  }

  return "TRACKING_UPDATE";
}
