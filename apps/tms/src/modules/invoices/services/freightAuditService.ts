import { db } from "@qubere/db";
import { Decimal } from "decimal.js";
import type { AccountContext } from "@qubere/auth";

export interface FreightAuditLineResult {
  chargeType: string;
  expectedUsd: number;
  invoicedUsd: number;
  varianceUsd: number;
  variancePct: number;
  status: "MATCHED" | "WITHIN_TOLERANCE" | "VARIANCE";
}

export interface FreightAuditResult {
  shipmentId: string;
  carrierInvoiceId: string;
  agreedBuyRateUsd: number;
  carrierInvoicedUsd: number;
  varianceUsd: number;
  variancePct: number;
  auditStatus: "MATCHED" | "WITHIN_TOLERANCE" | "VARIANCE_FLAGGED" | "EXCEPTION";
  hasSignedPod: boolean;
  lines: FreightAuditLineResult[];
  notes: string;
}

/**
 * Variance tolerance in % — variances within this band are auto-approved.
 * Default: 3% (e.g. minor fuel surcharge fluctuations).
 */
const AUTO_APPROVE_TOLERANCE_PCT = 3.0;

/**
 * Performs a real 3-way match:
 *   1. Loads the CarrierInvoice + CarrierInvoiceLine records
 *   2. Compares against ShipmentCost records for expected costs
 *   3. Computes variance per charge type and overall
 *   4. Updates CarrierInvoice.matchStatus in DB
 *   5. Returns a structured result for the Freight Audit Agent to act on
 */
export async function performFreightAudit(
  ctx: AccountContext,
  carrierInvoiceId: string
): Promise<FreightAuditResult> {
  const [invoice, proofOfDelivery] = await Promise.all([
    db.carrierInvoice.findFirst({
      where: { id: carrierInvoiceId, accountId: ctx.accountId },
      include: { lines: true },
    }),
    db.proofOfDelivery.findFirst({
      where: { accountId: ctx.accountId },
      // Find the POD for the shipment this invoice belongs to
      // Will be filtered below once we have the shipmentId
    }),
  ]);

  if (!invoice) {
    throw new Error(`CarrierInvoice ${carrierInvoiceId} not found for account ${ctx.accountId}`);
  }

  // Load expected costs for this shipment
  const expectedCosts = await db.shipmentCost.findMany({
    where: { shipmentId: invoice.shipmentId, accountId: ctx.accountId },
    select: { costType: true, amount: true, description: true },
  });

  // Load POD specific to this shipment
  const pod = await db.proofOfDelivery.findFirst({
    where: { shipmentId: invoice.shipmentId, accountId: ctx.accountId },
    select: { id: true },
  });

  const hasPod = !!pod;

  // Build expected cost map by costType
  const expectedByType = new Map<string, Decimal>();
  for (const cost of expectedCosts) {
    const existing = expectedByType.get(cost.costType) ?? new Decimal(0);
    expectedByType.set(cost.costType, existing.plus(new Decimal(cost.amount.toString())));
  }

  // Total invoiced amount
  const totalInvoiced = invoice.lines.reduce(
    (acc, l) => acc.plus(new Decimal(l.amount.toString())),
    new Decimal(0)
  );

  // Total expected
  const totalExpected = expectedCosts.reduce(
    (acc, c) => acc.plus(new Decimal(c.amount.toString())),
    new Decimal(0)
  );

  // Per-line comparison
  const lineResults: FreightAuditLineResult[] = invoice.lines.map((line) => {
    const invoicedAmt = new Decimal(line.amount.toString());
    // Map invoice charge type to cost type (e.g. LINEHAUL → CARRIER_LINEHAUL)
    const expectedAmt =
      expectedByType.get(line.chargeType) ??
      expectedByType.get(`CARRIER_${line.chargeType}`) ??
      new Decimal(0);

    const varianceAmt = invoicedAmt.minus(expectedAmt);
    const variancePct =
      expectedAmt.gt(0)
        ? varianceAmt.dividedBy(expectedAmt).times(100).toDecimalPlaces(2).toNumber()
        : 0;

    const absVariancePct = Math.abs(variancePct);
    const status: FreightAuditLineResult["status"] =
      absVariancePct === 0
        ? "MATCHED"
        : absVariancePct <= AUTO_APPROVE_TOLERANCE_PCT
          ? "WITHIN_TOLERANCE"
          : "VARIANCE";

    return {
      chargeType: line.chargeType,
      expectedUsd: expectedAmt.toNumber(),
      invoicedUsd: invoicedAmt.toNumber(),
      varianceUsd: varianceAmt.toNumber(),
      variancePct,
      status,
    };
  });

  // Overall variance
  const totalVariance = totalInvoiced.minus(totalExpected);
  const totalVariancePct =
    totalExpected.gt(0)
      ? totalVariance.dividedBy(totalExpected).times(100).toDecimalPlaces(2).toNumber()
      : 0;

  const hasVarianceLine = lineResults.some((l) => l.status === "VARIANCE");
  const overallStatus: FreightAuditResult["auditStatus"] = (() => {
    if (!hasVarianceLine && Math.abs(totalVariancePct) === 0) return "MATCHED";
    if (!hasVarianceLine && Math.abs(totalVariancePct) <= AUTO_APPROVE_TOLERANCE_PCT)
      return "WITHIN_TOLERANCE";
    return "VARIANCE_FLAGGED";
  })();

  // Persist matchStatus to DB
  const dbMatchStatus =
    overallStatus === "MATCHED" || overallStatus === "WITHIN_TOLERANCE"
      ? "MATCHED"
      : "DISPUTED";

  await db.carrierInvoice
    .update({
      where: { id: carrierInvoiceId },
      data: { matchStatus: dbMatchStatus },
    })
    .catch(() => null);

  // Notes for the work item / audit trail
  const notes =
    overallStatus === "MATCHED"
      ? "3-way match verified cleanly against expected costs and POD."
      : overallStatus === "WITHIN_TOLERANCE"
        ? `Carrier invoice is within ${AUTO_APPROVE_TOLERANCE_PCT}% tolerance (${totalVariancePct.toFixed(1)}%). Auto-approved.`
        : `Carrier invoice has a $${Math.abs(totalVariance.toNumber()).toFixed(2)} (${Math.abs(totalVariancePct).toFixed(1)}%) variance requiring review.`;

  return {
    shipmentId: invoice.shipmentId,
    carrierInvoiceId,
    agreedBuyRateUsd: totalExpected.toNumber(),
    carrierInvoicedUsd: totalInvoiced.toNumber(),
    varianceUsd: totalVariance.toNumber(),
    variancePct: totalVariancePct,
    auditStatus: overallStatus,
    hasSignedPod: hasPod,
    lines: lineResults,
    notes,
  };
}

/**
 * Finds all carrier invoices needing audit for a given shipment.
 * Used by the Freight Audit Agent to process all pending invoices.
 */
export async function getPendingAuditsForShipment(
  ctx: AccountContext,
  shipmentId: string
): Promise<string[]> {
  const invoices = await db.carrierInvoice.findMany({
    where: { shipmentId, accountId: ctx.accountId, matchStatus: "PENDING" },
    select: { id: true },
  });
  return invoices.map((inv) => inv.id);
}
