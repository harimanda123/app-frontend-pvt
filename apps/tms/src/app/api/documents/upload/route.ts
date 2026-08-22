import { NextRequest, NextResponse } from "next/server";
import { withAuthenticatedRoute } from "@qubere/auth";
import { db } from "@qubere/db";
import { createAuditLog } from "@qubere/decisions";

export const POST = withAuthenticatedRoute(
  async ({ req, ctx }: any) => {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const docType = (formData.get("docType") as string) || "BILL_OF_LADING";
      const shipmentId = formData.get("shipmentId") as string | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const fileName = file.name;

      const doc = await db.shipmentDocument.create({
        data: {
          accountId: ctx.accountId,
          docType: docType as any,
          fileName,
          fileUrl: `/uploads/${fileName}`,
          shipmentId: shipmentId || null,
          status: "PARSED",
        },
      });

      await createAuditLog({
        accountId: ctx.accountId,
        userId: ctx.userId,
        source: "API",
        action: "DOCUMENT_UPLOADED",
        entity: "ShipmentDocument",
        entityId: doc.id,
        metadata: { fileName, docType, shipmentId },
      }).catch(() => null);

      return NextResponse.json({
        ok: true,
        documentId: doc.id,
        fileName,
        docType,
        message: "Document uploaded successfully",
      });
    } catch (err) {
      return NextResponse.json({ error: "Failed to process document upload" }, { status: 500 });
    }
  },
  { permission: "documents.create", write: true }
);
