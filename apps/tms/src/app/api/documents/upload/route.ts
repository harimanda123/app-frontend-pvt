import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
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
      let fileUrl = `/uploads/${fileName}`;

      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const blobPath = `tms/documents/${ctx.accountId}/${Date.now()}-${fileName}`;
        const blob = await put(blobPath, buffer, {
          access: "public",
          contentType: file.type || "application/pdf",
          token,
        });
        fileUrl = blob.url;
      }

      const doc = await db.shipmentDocument.create({
        data: {
          accountId: ctx.accountId,
          docType: docType as any,
          fileName,
          fileUrl,
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
        metadata: { fileName, docType, shipmentId, fileUrl },
      }).catch(() => null);

      return NextResponse.json({
        ok: true,
        documentId: doc.id,
        fileName,
        fileUrl,
        docType,
        message: "Document uploaded successfully to dedicated TMS Blob storage",
      });
    } catch (err) {
      return NextResponse.json({ error: "Failed to process document upload" }, { status: 500 });
    }
  },
  { permission: "documents.create", write: true }
);
