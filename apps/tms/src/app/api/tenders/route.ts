import { NextRequest, NextResponse } from "next/server";
import { withAuthenticatedRoute } from "@qubere/auth";
import { db } from "@qubere/db";
import { createAuditLog } from "@qubere/decisions";

export const GET = withAuthenticatedRoute(
  async ({ req, ctx }: any) => {
    try {
      const tenders = await db.tender.findMany({
        where: { accountId: ctx.accountId },
        orderBy: { createdAt: "desc" },
        include: {
          shipment: true,
          freightQuote: true,
        },
      });
      return NextResponse.json({ tenders });
    } catch (err) {
      return NextResponse.json({ error: "Failed to fetch tenders" }, { status: 500 });
    }
  },
  { permission: "transportationOrders.read" }
);

export const POST = withAuthenticatedRoute(
  async ({ req, ctx }: any) => {
    try {
      const body = await req.json().catch(() => ({}));
      const { shipmentId, carrierId, freightQuoteId, expiresAtHours } = body;

      if (!carrierId) {
        return NextResponse.json({ error: "carrierId is required" }, { status: 400 });
      }

      const expiresAt = new Date(Date.now() + (expiresAtHours ?? 4) * 60 * 60 * 1000);

      const tender = await db.tender.create({
        data: {
          accountId: ctx.accountId,
          shipmentId: shipmentId || null,
          carrierId,
          freightQuoteId: freightQuoteId || null,
          status: "SENT",
          sentAt: new Date(),
          expiresAt,
          sentByUserId: ctx.userId,
          history: [
            {
              timestamp: new Date().toISOString(),
              action: "TENDER_DISPATCHED",
              actorUserId: ctx.userId,
              notes: "Tender created and dispatched to carrier",
            },
          ],
        },
      });

      await createAuditLog({
        accountId: ctx.accountId,
        userId: ctx.userId,
        source: "API",
        action: "TENDER_CREATED",
        entity: "Tender",
        entityId: tender.id,
        metadata: { carrierId, shipmentId, freightQuoteId },
      }).catch(() => null);

      return NextResponse.json({
        ok: true,
        tenderId: tender.id,
        shipmentId: tender.shipmentId,
        carrierId: tender.carrierId,
        status: tender.status,
        message: "Tender created and dispatched to carrier",
      });
    } catch (err) {
      return NextResponse.json({ error: "Failed to dispatch tender" }, { status: 500 });
    }
  },
  { permission: "tenders.send", write: true }
);
