import { describe, it, expect, vi, beforeEach } from "vitest";
import { evaluateCarriersForShipment } from "../src/modules/carriers/services/carrierSelectionService";
import { createAndSendTender, respondToTender, sweepExpiredTenders } from "../src/modules/tenders/services/tenderService";
import { scheduleAppointment } from "../src/modules/movement/services/appointmentService";
import { ingestRawTrackingSignal } from "../src/modules/tracking/services/trackingProviderService";

const { dbMock } = vi.hoisted(() => ({
  dbMock: {
    carrierProfile: {
      findMany: vi.fn(),
    },
    tender: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    movementStop: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    shipment: {
      update: vi.fn(),
    },
    agentDecision: {
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    transportationEvent: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@qubere/db", () => ({ db: dbMock }));

const mockContext: any = {
  userId: "user_123",
  accountId: "acc_999",
};

describe("Phase 5 — Execution Engine (Carrier Scoring, Tenders, Fallback Cascade, Appointments & Tracking)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    dbMock.tender.create.mockImplementation(async ({ data }: any) => ({
      id: "ten_501",
      ...data,
    }));

    dbMock.tender.update.mockImplementation(async ({ data }: any) => ({
      id: "ten_501",
      ...data,
    }));

    dbMock.agentDecision.create.mockImplementation(async ({ data }: any) => ({
      id: "dec_501",
      ...data,
    }));

    dbMock.auditLog.create.mockImplementation(async ({ data }: any) => ({
      id: "audit_501",
      ...data,
    }));

    dbMock.transportationEvent.create.mockImplementation(async ({ data }: any) => ({
      id: "evt_501",
      ...data,
    }));
  });

  it("evaluates carrier profiles and ranks options based on insurance, safety status, and metrics", async () => {
    dbMock.carrierProfile.findMany.mockResolvedValueOnce([
      {
        id: "prof_1",
        partyId: "car_swift",
        insuranceStatus: "ACTIVE",
        safetyStatus: "SATISFACTORY",
        preferredStatus: true,
        modes: ["OCEAN"],
        equipmentCapabilities: ["40HC"],
        performanceMetrics: { onTimeDeliveryRate: 98 },
        party: { names: [{ rawName: "Swift Ocean Trans" }] },
      },
      {
        id: "prof_2",
        partyId: "car_slow",
        insuranceStatus: "INACTIVE",
        safetyStatus: "SATISFACTORY",
        preferredStatus: false,
        modes: ["OCEAN"],
        equipmentCapabilities: ["40HC"],
        performanceMetrics: { onTimeDeliveryRate: 70 },
        party: { names: [{ rawName: "Slow Freight" }] },
      },
    ]);

    const ranked = await evaluateCarriersForShipment(mockContext, { mode: "OCEAN", requireInsurance: true });

    expect(ranked[0].carrierId).toBe("car_swift");
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
    expect(ranked[0].isEligible).toBe(true);
  });

  it("dispatches tender and triggers automated fallback cascade upon rejection", async () => {
    dbMock.carrierProfile.findMany.mockResolvedValue([
      {
        id: "prof_1",
        partyId: "car_fast",
        insuranceStatus: "ACTIVE",
        safetyStatus: "SATISFACTORY",
        modes: ["OCEAN"],
        equipmentCapabilities: ["40HC"],
        party: { names: [{ value: "Fast Trans" }] },
      },
      {
        id: "prof_2",
        partyId: "car_fallback",
        insuranceStatus: "ACTIVE",
        safetyStatus: "SATISFACTORY",
        modes: ["OCEAN"],
        equipmentCapabilities: ["40HC"],
        party: { names: [{ value: "Fallback Trans" }] },
      },
    ]);

    dbMock.tender.findFirst.mockResolvedValueOnce({
      id: "ten_501",
      accountId: "acc_999",
      shipmentId: "shp_500",
      carrierId: "car_fast",
      history: [],
    });

    const result = await respondToTender(mockContext, {
      tenderId: "ten_501",
      accept: false,
      rejectionReason: "No equipment available",
    });

    expect(result.status).toBe("REJECTED");
    expect(dbMock.tender.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          carrierId: "car_fallback",
        }),
      })
    );
  });

  it("schedules facility appointment for a movement stop", async () => {
    dbMock.movementStop.findFirst.mockResolvedValueOnce({
      id: "stop_501",
      accountId: "acc_999",
      movementId: "mov_501",
      locationName: "Oakland Terminal Pier 55",
    });

    dbMock.movementStop.update.mockResolvedValueOnce({
      id: "stop_501",
      status: "CONFIRMED",
      locationName: "Oakland Terminal Pier 55",
      unlocode: "USOAK",
    });

    const updated = await scheduleAppointment(mockContext, {
      movementStopId: "stop_501",
      appointmentStart: new Date("2026-08-25T08:00:00Z"),
      appointmentEnd: new Date("2026-08-25T10:00:00Z"),
      unlocode: "USOAK",
    });

    expect(updated.status).toBe("CONFIRMED");
    expect(dbMock.transportationEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          eventType: "APPOINTMENT_SCHEDULED",
        }),
      })
    );
  });

  it("ingests raw Project44 container discharge signal and standardizes into CONTAINER_DISCHARGED event", async () => {
    dbMock.shipment.update.mockResolvedValueOnce({ id: "shp_500" });

    const result = await ingestRawTrackingSignal(mockContext, {
      provider: "PROJECT44",
      shipmentId: "shp_500",
      rawEventCode: "CONTAINER_DISCHARGED_OAKLAND",
      location: { unlocode: "USOAK", city: "Oakland" },
      occurredAt: new Date("2026-08-22T12:00:00Z"),
    });

    expect(result.eventType).toBe("CONTAINER_DISCHARGED");
    expect(dbMock.transportationEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          eventType: "CONTAINER_DISCHARGED",
          source: "API",
          entityType: "SHIPMENT",
          entityId: "shp_500",
        }),
      })
    );
  });
});
