import { db } from "@qubere/db";
import { createAuditLog } from "@qubere/decisions";

export interface ReconcileCarrierInvoiceInput {
  accountId: string;
  carrierInvoiceId: string;
  tolerancePercentage?: number; // default 1.0% tolerance
}

export async function reconcileCarrierInvoice(input: ReconcileCarrierInvoiceInput) {
  const tolerance = input.tolerancePercentage ?? 1.0;

  // 1. Fetch CarrierInvoice
  const invoice = await db.carrierInvoice.findFirst({
    where: { id: input.carrierInvoiceId, accountId: input.accountId },
    include: { lines: true },
  });

  if (!invoice) {
    throw new Error(`CarrierInvoice ${input.carrierInvoiceId} not found.`);
  }

  // 2. Fetch accepted FreightQuote or Tender for shipment
  const acceptedTender = await db.tender.findFirst({
    where: {
      accountId: input.accountId,
      shipmentId: invoice.shipmentId,
      carrierId: invoice.carrierId,
      status: "ACCEPTED",
    },
  });

  const quote = await db.freightQuote.findFirst({
    where: {
      accountId: input.accountId,
      shipmentId: invoice.shipmentId,
      carrierId: invoice.carrierId,
    },
    orderBy: { createdAt: "desc" },
  });

  const expectedAmount = quote ? Number(quote.amount) : 0;
  const invoicedAmount = Number(invoice.totalAmount);

  if (expectedAmount === 0) {
    // No accepted quote found => flag exception
    await db.carrierInvoice.update({
      where: { id: invoice.id },
      data: { matchStatus: "EXCEPTION" },
    });

    const exception = await db.exceptionItem.create({
      data: {
        accountId: input.accountId,
        shipmentId: invoice.shipmentId,
        category: "BILLING",
        type: "INVOICE_NO_ACCEPTED_QUOTE",
        severity: "High",
        description: `Carrier invoice ${invoice.invoiceNumber ?? invoice.id} has no accepted quote or tender`,
        status: "Open",
      },
    });

    return { matchStatus: "EXCEPTION", exception };
  }

  const difference = Math.abs(invoicedAmount - expectedAmount);
  const allowedToleranceUsd = (expectedAmount * tolerance) / 100;
  const isMatch = difference <= allowedToleranceUsd;

  if (isMatch) {
    const updatedInvoice = await db.carrierInvoice.update({
      where: { id: invoice.id },
      data: { matchStatus: "MATCHED" },
    });

    await createAuditLog({
      accountId: input.accountId,
      action: "CARRIER_INVOICE_MATCHED",
      entity: "CarrierInvoice",
      entityId: invoice.id,
      source: "SYSTEM",
      metadata: {
        expectedAmount,
        invoicedAmount,
        difference,
      },
    });

    return { matchStatus: "MATCHED", invoice: updatedInvoice };
  } else {
    // Variance exceeds tolerance => DISPUTED + ExceptionItem
    const updatedInvoice = await db.carrierInvoice.update({
      where: { id: invoice.id },
      data: { matchStatus: "DISPUTED" },
    });

    const exception = await db.exceptionItem.create({
      data: {
        accountId: input.accountId,
        shipmentId: invoice.shipmentId,
        category: "BILLING",
        type: "INVOICE_AMOUNT_MISMATCH",
        severity: "High",
        description: `Carrier invoice variance ($${invoicedAmount} vs quote $${expectedAmount}) exceeds tolerance`,
        status: "Open",
      },
    });

    await createAuditLog({
      accountId: input.accountId,
      action: "CARRIER_INVOICE_DISPUTED",
      entity: "CarrierInvoice",
      entityId: invoice.id,
      source: "SYSTEM",
      metadata: {
        expectedAmount,
        invoicedAmount,
        difference,
        exceptionId: exception.id,
      },
    });

    return { matchStatus: "DISPUTED", invoice: updatedInvoice, exception };
  }
}
