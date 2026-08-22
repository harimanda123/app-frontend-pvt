import { describe, it, expect } from "vitest";
import {
  computeShipmentHealthSnapshot,
  computeMultimodalJourney,
  evaluateCrossDomainRisks,
} from "../src/modules/shipments/services/shipmentWorkspaceService";

describe("Phase 8 — AI-Native Exception-First Architecture & Shipment Health", () => {
  it("computes explainable shipment health snapshot across 7 risk dimensions", () => {
    const mockShipment: any = {
      id: "shp_801",
      shipmentNumber: "SHP-10482",
      status: "At Risk",
      estimatedArrival: new Date("2026-08-28T14:30:00Z"),
      deliveryDate: new Date("2026-08-29T17:00:00Z"),
      customsFilings: [{ filingStatus: "RELEASED" }],
      exceptionItems: [
        { type: "PORT_DELAY", status: "Open", title: "Vessel Arrival Delay" },
      ],
    };

    const snapshot = computeShipmentHealthSnapshot(mockShipment);

    expect(snapshot.overallHealth).toBe("AT_RISK");
    expect(snapshot.healthScore).toBe(78);
    expect(snapshot.etaConfidence).toBe(88);
    expect(snapshot.dimensions).toHaveLength(7);

    const scheduleDim = snapshot.dimensions.find((d) => d.key === "schedule");
    expect(scheduleDim?.status).toBe("At Risk");
    expect(scheduleDim?.cause).toContain("Vessel arrival delay");

    expect(snapshot.aiSummary.recommendedAction).toContain("Reschedule delivery appointment");
    expect(snapshot.aiSummary.customerImpact).toBe("+1 day");
  });

  it("combines transportation and customs into a single unified journey timeline", () => {
    const mockShipment: any = {
      id: "shp_802",
      transportMode: "OCEAN",
      countryOfExport: "Shanghai (CNSHA)",
      destinationCountry: "Sacramento, CA",
      portOfEntry: "Oakland (USOAK)",
      customsFilings: [{ filingStatus: "RELEASED" }],
    };

    const journey = computeMultimodalJourney(mockShipment);

    expect(journey).toHaveLength(6);
    expect(journey[0].name).toBe("Origin Port");
    expect(journey[1].name).toBe("Ocean Transit");
    expect(journey[3].name).toBe("Customs Clearance");
    expect(journey[3].status).toBe("COMPLETED");
    expect(journey[4].name).toBe("Drayage Dispatch");
  });

  it("detects cross-domain customs clearance blocking delivery risk", () => {
    const mockShipment: any = {
      id: "shp_803",
      arrivalDate: new Date("2026-08-26T10:00:00Z"),
      customsFilings: [{ filingStatus: "CustomsHold" }],
      complianceDeadlines: [
        { deadlineType: "LAST_FREE_DAY", status: "OPEN", dueAt: new Date("2026-08-27T23:59:59Z") },
      ],
    };

    const risks = evaluateCrossDomainRisks(mockShipment);

    expect(risks).toHaveLength(2);
    expect(risks[0].code).toBe("CUSTOMS_BLOCKING_DELIVERY");
    expect(risks[0].severity).toBe("CRITICAL");
    expect(risks[1].code).toBe("LAST_FREE_DAY_RISK");
  });
});
