import { describe, it, expect, vi } from "vitest";
import { getTenantScopedModelNames } from "@qubere/db";
import { findPermission, PERMISSION_NAMES, defaultPermissionsForRole } from "@qubere/auth";
import { normalizeDecisionStatus, normalizeExceptionStatus } from "@qubere/decisions";
import { AssistantToolRegistry } from "@qubere/assistant";
import { z } from "zod";

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

  it("enforces assistant permissions, write access, confirmation, and input schemas", async () => {
    const registry = new AssistantToolRegistry();
    const execute = vi.fn(async () => ({ ok: true }));
    registry.register({
      declaration: { name: "mutating_tool", description: "Test mutating tool" },
      schema: z.object({ recordId: z.string().min(1) }),
      access: {
        permission: "transportationOrders.write",
        write: true,
        confirmationRequired: true,
      },
      execute,
    });
    const baseContext: any = {
      isPlatformAdmin: false,
      roleNames: ["MEMBER"],
      platformRoles: [],
      permissions: [],
    };

    await expect(
      registry.execute("mutating_tool", baseContext, { recordId: "order_1", confirm: true })
    ).rejects.toThrow("requires permission");
    await expect(
      registry.execute(
        "mutating_tool",
        { ...baseContext, roleNames: ["VIEWER"], permissions: ["transportationOrders.write"] },
        { recordId: "order_1", confirm: true }
      )
    ).rejects.toThrow("read-only");
    await expect(
      registry.execute(
        "mutating_tool",
        { ...baseContext, permissions: ["transportationOrders.write"] },
        { recordId: "order_1" }
      )
    ).rejects.toThrow("explicit confirmation");

    await expect(
      registry.execute(
        "mutating_tool",
        { ...baseContext, permissions: ["transportationOrders.write"] },
        { recordId: "order_1", confirm: true }
      )
    ).resolves.toEqual({ ok: true });
    expect(execute).toHaveBeenCalledTimes(1);
  });
});
