import { NextResponse } from "next/server";
import { withAuthenticatedRoute } from "@qubere/auth";
import { db } from "@qubere/db";
import { createAuditLog } from "@qubere/decisions";
import { z } from "zod";

const respondTenderSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"]),
  reason: z.string().optional().nullable(),
});

export const POST = withAuthenticatedRoute<{ id: string }>(
  async ({ req, ctx, params, requestId }) => {
    const { id } = await params;
    const body = await req.json();
    const parsed = respondTenderSchema.parse(body);

    const tender = await db.tender.findFirst({
      where: { id, accountId: ctx.accountId },
    });

    if (!tender) {
      return NextResponse.json({ error: "Tender not found" }, { status: 404 });
    }

    if (tender.status !== "SENT") {
      return NextResponse.json(
        { error: `Cannot respond to tender in status '${tender.status}'` },
        { status: 400 }
      );
    }

    const now = new Date();
    const existingHistory = Array.isArray(tender.history) ? tender.history : [];
    const updatedHistory = [
      ...existingHistory,
      {
        status: parsed.status,
        timestamp: now.toISOString(),
        userId: ctx.userId,
        reason: parsed.reason ?? null,
      },
    ];

    const updatedTender = await db.tender.update({
      where: { id },
      data: {
        status: parsed.status,
        respondedAt: now,
        history: updatedHistory as any,
      },
    });

    await createAuditLog({
      accountId: ctx.accountId,
      userId: ctx.userId,
      action: parsed.status === "ACCEPTED" ? "TENDER_ACCEPTED" : "TENDER_REJECTED",
      entity: "Tender",
      entityId: id,
      source: "API",
      requestId,
      metadata: {
        reason: parsed.reason ?? null,
      },
    });

    return NextResponse.json({ tender: updatedTender });
  },
  { permission: "tenders.send", write: true }
);
