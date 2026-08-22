import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createCarrierRate,
  evaluateRFQ,
  convertQuoteToShipment,
} from "../src/modules/rating/services/quoteService";

const { dbMock } = vi.hoisted(() => ({
  dbMock: {
    carrierRate: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    transportationOrder: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    agentDecision: {
      create: vi.fn(),
    },
    freightQuote: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    shipment: {
      create: vi.fn(),
    },
    shipmentCharge: {
      create: vi.fn(),
    },
    shipmentCost: {
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

describe("Phase 4 — Quote Engine, Carrier Rate Matching, Margins & Conversion", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    dbMock.carrierRate.create.mockImplementation(async ({ data }: any) => ({
      id: "rate_101",
      ...data,
    }));

    dbMock.agentDecision.create.mockImplementation(async ({ data }: any) => ({
      id: "dec_401",
      ...data,
    }));

    dbMock.freightQuote.create.mockImplementation(async ({ data }: any) => ({
      id: "quote_401",
      ...data,
    }));

    dbMock.shipment.create.mockImplementation(async ({ data }: any) => ({
      id: "shp_401",
      shipmentNumber: data.shipmentNumber,
      ...data,
    }));

    dbMock.transportationEvent.create.mockImplementation(async ({ data }: any) => ({
      id: "evt_401",
      ...data,
    }));
  });

  it("creates a carrier rate record for Shanghai -> Oakland 40HC ocean lane", async () => {
    const rate = await createCarrierRate(mockContext, {
      carrierName: "MSC Ocean",
      mode: "OCEAN",
      origin: { unlocode: "CNSHA", city: "Shanghai" },
      destination: { unlocode: "USOAK", city: "Oakland" },
      equipment: "40HC",
      baseRate: 2500,
      surcharges: { BAF: 300, ISPS: 50 },
      accessorials: { Chassis: 150 },
    });

    expect(dbMock.carrierRate.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          accountId: "acc_999",
          carrierName: "MSC Ocean",
          mode: "OCEAN",
          equipment: "40HC",
          baseRate: 2500,
        }),
      })
    );
    expect(rate.id).toBe("rate_101");
  });

  it("evaluates RFQ into recommended quote with buy cost, markup, profit margin, and evidence", async () => {
    dbMock.transportationOrder.findFirst.mockResolvedValueOnce({
      id: "ord_401",
      accountId: "acc_999",
      mode: "OCEAN",
      equipmentRequirements: ["40HC"],
      origin: { unlocode: "CNSHA", city: "Shanghai" },
      destination: { unlocode: "USOAK", city: "Oakland" },
      requestedBy: "Acme Imports",
    });

    dbMock.carrierRate.findMany.mockResolvedValueOnce([
      {
        id: "rate_101",
        carrierName: "MSC Ocean",
        baseRate: 2500,
        surcharges: { BAF: 300, ISPS: 50 },
        accessorials: { Chassis: 150 },
      },
    ]);

    const result = await evaluateRFQ(mockContext, {
      transportationOrderId: "ord_401",
      targetMarginPercent: 15,
    });

    // Total Buy = 2500 + 350 + 150 = 3000
    // Sell Price = 3000 * 1.15 = 3450
    // Margin = 3450 - 3000 = 450
    expect(dbMock.agentDecision.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          confidence: 92,
          triageState: "AUTO_VERIFIED",
        }),
      })
    );

    expect(dbMock.freightQuote.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          buyAmount: 3000,
          markupPercentage: 15,
          sellAmount: 3450,
          margin: 450,
          approvalState: "AUTO_APPROVED",
          status: "PROPOSED",
        }),
      })
    );

    expect(result.quote.id).toBe("quote_401");
  });

  it("converts winning quote into operational shipment with sell charges and buy costs", async () => {
    dbMock.freightQuote.findFirst.mockResolvedValueOnce({
      id: "quote_401",
      accountId: "acc_999",
      transportationOrderId: "ord_401",
      carrierName: "MSC Ocean",
      mode: "OCEAN",
      buyAmount: 3000,
      sellAmount: 3450,
      margin: 450,
      currency: "USD",
      transportationOrder: {
        id: "ord_401",
        requestedBy: "Acme Imports Inc",
        origin: { country: "CN" },
        destination: { country: "US", unlocode: "USOAK" },
      },
    });

    const shipment = await convertQuoteToShipment(mockContext, "quote_401");

    expect(dbMock.shipment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          importerName: "Acme Imports Inc",
          carrierName: "MSC Ocean",
          transportMode: "OCEAN",
          portOfEntry: "USOAK",
        }),
      })
    );

    expect(dbMock.shipmentCharge.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          unitPrice: 3450,
          grossAmount: 3450,
          netAmount: 3450,
        }),
      })
    );

    expect(dbMock.shipmentCost.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          costType: "LINEHAUL",
          amount: 3000,
        }),
      })
    );

    expect(dbMock.freightQuote.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "quote_401" },
        data: expect.objectContaining({
          status: "ACCEPTED",
        }),
      })
    );

    expect(shipment.id).toBe("shp_401");
  });
});
