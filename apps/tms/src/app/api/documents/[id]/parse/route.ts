import { NextRequest, NextResponse } from "next/server";
import { withAuthenticatedRoute } from "@qubere/auth";
import { db } from "@qubere/db";
import { createAuditLog } from "@qubere/decisions";

export const POST = withAuthenticatedRoute<{ id: string }>(
  async ({ req, ctx }: any) => {
    try {
      const pathname = req.nextUrl.pathname;
      const parts = pathname.split("/");
      const documentId = parts[parts.indexOf("documents") + 1];

      if (!documentId) {
        return NextResponse.json({ error: "documentId is required" }, { status: 400 });
      }

      const doc = await db.shipmentDocument.findFirst({
        where: { id: documentId, accountId: ctx.accountId },
      });

      if (!doc) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 });
      }

      await db.shipmentDocument.update({
        where: { id: doc.id },
        data: { status: "PARSED" },
      });

      await createAuditLog({
        accountId: ctx.accountId,
        userId: ctx.userId,
        source: "API",
        action: "DOCUMENT_PARSED",
        entity: "ShipmentDocument",
        entityId: doc.id,
        metadata: { fileName: doc.fileName },
      }).catch(() => null);

      return NextResponse.json({
        success: true,
        documentId: doc.id,
        status: "PARSED",
        message: "Document classification and extraction completed.",
      });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || "Parsing failed" }, { status: 500 });
    }
  },
  { permission: "documents.create", write: true }
);
