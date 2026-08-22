import { describe, it, expect } from "vitest";
import { getTenantScopedModelNames } from "@qubere/db";
import { findPermission, PERMISSION_NAMES, defaultPermissionsForRole } from "@qubere/auth";
import { normalizeDecisionStatus, normalizeExceptionStatus } from "@qubere/decisions";

describe("Phase 0 — Extraction & Schema Verification", () => {
  it("registers all 7 new AI Freight models in getTenantScopedModelNames()", () => {
    const tenantScopedModels = getTenantScopedModelNames();
    const expectedNewModels = [
      "TransportationOrder",
      "CarrierProfile",
      "Movement",
      "ShipmentMovement",
      "MovementStop",
      "TransportationEvent",
      "Carrier",
      "FreightQuote",
      "Tender",
      "ProofOfDelivery",
      "CarrierInvoice",
    ];

    for (const modelName of expectedNewModels) {
      expect(tenantScopedModels).toContain(modelName);
    }
  });

  it("includes all new freight permissions in @qubere/auth catalogue", () => {
    const newFreightPermissions = [
      "transportationOrders.read",
      "transportationOrders.write",
      "carriers.manage",
      "tenders.send",
      "carrierInvoices.match",
      "carrierInvoices.override",
    ];

    for (const permName of newFreightPermissions) {
      expect(PERMISSION_NAMES).toContain(permName);
      const permDef = findPermission(permName);
      expect(permDef).not.toBeNull();
      expect(permDef?.category).toBe("Freight");
    }
  });

  it("assigns appropriate default roles to new freight permissions", () => {
    const adminPerms = defaultPermissionsForRole("ADMIN");
    const memberPerms = defaultPermissionsForRole("MEMBER");
    const viewerPerms = defaultPermissionsForRole("VIEWER");

    // Admin should hold carriers.manage & carrierInvoices.override
    expect(adminPerms).toContain("carriers.manage");
    expect(adminPerms).toContain("carrierInvoices.override");

    // Member should hold operational permissions but not admin risk overrides
    expect(memberPerms).toContain("transportationOrders.write");
    expect(memberPerms).toContain("tenders.send");
    expect(memberPerms).not.toContain("carriers.manage");

    // Viewer should hold read permission only
    expect(viewerPerms).toContain("transportationOrders.read");
    expect(viewerPerms).not.toContain("transportationOrders.write");
  });

  it("normalizes decision and exception states cleanly via @qubere/decisions", () => {
    expect(normalizeDecisionStatus("Needs Review")).toBe("NEEDS_REVIEW");
    expect(normalizeDecisionStatus("Auto-Approved")).toBe("AUTO_VERIFIED");

    expect(normalizeExceptionStatus("InProgress")).toBe("IN_PROGRESS");
    expect(normalizeExceptionStatus("WAIVED")).toBe("WAIVED");
  });
});
