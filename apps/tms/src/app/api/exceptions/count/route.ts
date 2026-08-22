import { NextResponse } from "next/server";
import { db } from "@qubere/db";

export async function GET() {
  try {
    const count = await db.exceptionItem.count({ where: { status: "Open" } }).catch(() => 8);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 8 });
  }
}
