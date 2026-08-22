import { NextRequest, NextResponse } from "next/server";
import { withAuthenticatedRoute } from "@qubere/auth";
import { db } from "@qubere/db";

export const GET = withAuthenticatedRoute(
  async ({ req, ctx }: any) => {
    try {
      const carriers = await db.carrier.findMany({
        where: { accountId: ctx.accountId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ carriers });
    } catch (err) {
      return NextResponse.json({ error: "Failed to fetch carriers" }, { status: 500 });
    }
  },
  { permission: "carriers.manage" }
);
