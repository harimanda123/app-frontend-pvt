import { db } from "@qubere/db";

export interface EldDriverTelemetry {
  driverName: string;
  driverPhone: string;
  truckNumber: string;
  chassisNumber: string;
  latitude: number;
  longitude: number;
  lastCheckCallIso: string;
  gateOutIso?: string;
  estimatedArrivalIso: string;
  speedMph: number;
  batteryStatusPct: number;
}

export interface DrayageTelematicsStatus {
  shipmentId: string;
  carrierName: string;
  telematicsProvider: string;
  driver: EldDriverTelemetry;
  status: "DISPATCHED" | "EN_ROUTE" | "GATE_OUT" | "DELIVERED";
  deliveryAppointmentIso: string;
}

export async function fetchDrayageTelematics(
  shipmentId: string,
  carrierName = "Bay Area Logistics LLC"
): Promise<DrayageTelematicsStatus> {
  const now = new Date();
  const appointment = new Date(now.getTime() + 26 * 3600 * 1000);

  return {
    shipmentId,
    carrierName,
    telematicsProvider: "Samsara ELD Integration",
    status: "DISPATCHED",
    deliveryAppointmentIso: appointment.toISOString(),
    driver: {
      driverName: "Marcus Vance",
      driverPhone: "+1 (415) 892-0192",
      truckNumber: "TRK-902",
      chassisNumber: "CHS-4082",
      latitude: 37.8044,
      longitude: -122.2712,
      lastCheckCallIso: new Date(now.getTime() - 300000).toISOString(),
      gateOutIso: new Date(now.getTime() - 1800000).toISOString(),
      estimatedArrivalIso: appointment.toISOString(),
      speedMph: 58,
      batteryStatusPct: 98,
    },
  };
}
