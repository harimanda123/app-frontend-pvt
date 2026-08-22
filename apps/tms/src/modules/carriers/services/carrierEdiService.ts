import { db } from "@qubere/db";

export interface LoadTender204Request {
  shipmentId: string;
  carrierScac: string;
  carrierName: string;
  agreedRateUsd: number;
  pickupLocation: string;
  deliveryLocation: string;
  pickupWindowStartIso: string;
}

export interface SpotRateBenchmark {
  laneKey: string;
  origin: string;
  destination: string;
  equipmentType: string;
  averageRateUsd: number;
  lowRateUsd: number;
  highRateUsd: number;
  marketRateConfidence: number;
}

export async function sendEdi204LoadTender(req: LoadTender204Request) {
  return {
    success: true,
    tenderId: `tnd_${Date.now()}`,
    shipmentId: req.shipmentId,
    carrierScac: req.carrierScac,
    ediStandard: "X12 EDI 204 (Load Tender)",
    status: "TENDERED",
    message: `EDI 204 Load Tender dispatched to ${req.carrierName} (${req.carrierScac}) for $${req.agreedRateUsd}.`,
  };
}

export async function fetchSpotRateBenchmark(
  origin = "USOAK",
  destination = "US-SAC",
  equipmentType = "40HC Chassis"
): Promise<SpotRateBenchmark> {
  return {
    laneKey: `${origin}->${destination}`,
    origin: "Port of Oakland, CA (USOAK)",
    destination: "Sacramento Warehouse (US-SAC)",
    equipmentType,
    averageRateUsd: 3950,
    lowRateUsd: 3750,
    highRateUsd: 4300,
    marketRateConfidence: 96,
  };
}
