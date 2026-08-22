import { NextRequest, NextResponse } from "next/server";
import { withAuthenticatedRoute } from "@qubere/auth";
import { db } from "@qubere/db";
import { createAuditLog } from "@qubere/decisions";

export const POST = withAuthenticatedRoute<{ id: string }>(
  async ({ req, ctx }: any) => {
    try {
      const pathname = req.nextUrl.pathname;
      const parts = pathname.split("/");
      const id = parts[parts.indexOf("documents") + 1];
      const body = await req.json().catch(() => ({}));
      const shipmentId = body.shipmentId;

      if (!id || !shipmentId) {
        return NextResponse.json({ error: "documentId and shipmentId are required" }, { status: 400 });
      }

      const doc = await db.shipmentDocument.findFirst({
        where: { id, accountId: ctx.accountId },
      });

      if (!doc) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 });
      }

      await db.shipmentDocument.update({
        where: { id: doc.id },
        data: { shipmentId },
      });

      await createAuditLog({
        accountId: ctx.accountId,
        userId: ctx.userId,
        source: "API",
        action: "DOCUMENT_ATTACHED",
        entity: "ShipmentDocument",
        entityId: doc.id,
        metadata: { shipmentId },
      }).catch(() => null);

      return NextResponse.json({
        ok: true,
        documentId: doc.id,
        shipmentId,
        message: "Document successfully attached to shipment.",
      });
    } catch {
      return NextResponse.json({ error: "Failed to attach document" }, { status: 500 });
    }
  },
  { permission: "documents.create", write: true }
);
