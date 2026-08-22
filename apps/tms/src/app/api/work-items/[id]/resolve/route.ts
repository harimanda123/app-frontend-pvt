import { NextResponse } from "next/server";
import { withAuthenticatedRoute } from "@qubere/auth";
import { db } from "@qubere/db";

interface RouteParams {
  id: string;
}

/**
 * PATCH /api/work-items/[id]/resolve
 *
 * Resolves a work queue item — either an ExceptionItem or an AgentDecision.
 * Body: { action: "approve" | "reject" | "resolve", note?: string, itemType?: "EXCEPTION" | "DECISION" }
 */
export const PATCH = withAuthenticatedRoute<RouteParams>(
  async ({ req, ctx, params }) => {
    const { id } = await params;
    const body = await req.json();
    const { action, note, itemType } = body as {
      action: "approve" | "reject" | "resolve";
      note?: string;
      itemType?: "EXCEPTION" | "DECISION";
    };

    if (!action) {
      return NextResponse.json({ error: "action is required" }, { status: 400 });
    }

    // Try AgentDecision first (most common from ops dashboard)
    if (!itemType || itemType === "DECISION") {
      const decision = await db.agentDecision
        .findFirst({ where: { id, accountId: ctx.accountId } })
        .catch(() => null);

      if (decision) {
        if (action === "approve") {
          await db.agentDecision.update({
            where: { id },
            data: {
              autoApproved: true,
              status: "Completed",
              reviewedByUserId: ctx.userId,
            },
          });
          return NextResponse.json({
            success: true,
            type: "DECISION",
            action: "APPROVED",
            id,
          });
        }

        if (action === "reject") {
          await db.agentDecision.update({
            where: { id },
            data: {
              autoApproved: false,
              status: "Rejected",
              reviewedByUserId: ctx.userId,
              blockedReason: note ?? "Rejected by operator.",
            },
          });
          return NextResponse.json({
            success: true,
            type: "DECISION",
            action: "REJECTED",
            id,
          });
        }
      }
    }

    // Try ExceptionItem
    if (!itemType || itemType === "EXCEPTION") {
      const exception = await db.exceptionItem
        .findFirst({ where: { id, accountId: ctx.accountId } })
        .catch(() => null);

      if (exception) {
        await db.exceptionItem.update({
          where: { id },
          data: {
            status: "Resolved",
            resolvedAt: new Date(),
            resolvedBy: ctx.userId,
            resolvedByName: ctx.email ?? "Operator",
            resolutionNote:
              note ?? "Resolved by operator via Operations Dashboard.",
          },
        });
        return NextResponse.json({
          success: true,
          type: "EXCEPTION",
          action: "RESOLVED",
          id,
        });
      }
    }

    return NextResponse.json({ error: "Work item not found" }, { status: 404 });
  }
);
