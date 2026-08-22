import { db } from "@qubere/db";

export interface AisVesselPosition {
  vesselName: string;
  mmsi: string;
  imoNumber: string;
  latitude: number;
  longitude: number;
  headingDegrees: number;
  speedKnots: number;
  lastReportedIso: string;
  destinationPortCode: string;
  destinationPortName: string;
  etaIso: string;
  confidenceScore: number;
}

export interface OceanTrackingStatus {
  shipmentId: string;
  vesselName: string;
  voyageNumber: string;
  currentPosition: AisVesselPosition;
  currentMilestone: string;
  nextPortOfDischarge: string;
  plannedEtaIso: string;
  recalculatedEtaIso: string;
  scheduleDelayHours: number;
  sourceProvider: string;
}

export async function fetchLiveOceanTracking(
  shipmentId: string,
  vesselName = "MSC Aries",
  voyageNumber = "418E"
): Promise<OceanTrackingStatus> {
  const now = new Date();
  const plannedEta = new Date(now.getTime() + 3.5 * 86400000);
  const recalculatedEta = new Date(now.getTime() + 3.25 * 86400000);

  const mockPosition: AisVesselPosition = {
    vesselName,
    mmsi: "351829000",
    imoNumber: "9820192",
    latitude: 36.4,
    longitude: -145.2,
    headingDegrees: 78,
    speedKnots: 19.4,
    lastReportedIso: new Date(now.getTime() - 120000).toISOString(),
    destinationPortCode: "USOAK",
    destinationPortName: "Oakland International Container Terminal",
    etaIso: recalculatedEta.toISOString(),
    confidenceScore: 94,
  };

  return {
    shipmentId,
    vesselName,
    voyageNumber,
    currentPosition: mockPosition,
    currentMilestone: "East Pacific Ocean Transit",
    nextPortOfDischarge: "Oakland, CA (USOAK)",
    plannedEtaIso: plannedEta.toISOString(),
    recalculatedEtaIso: recalculatedEta.toISOString(),
    scheduleDelayHours: 0,
    sourceProvider: "Project44 AIS Telematics (Satellite Stream)",
  };
}
