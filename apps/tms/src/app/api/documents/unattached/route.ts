import { NextResponse } from "next/server";
import { db } from "@qubere/db";

export async function GET() {
  try {
    const documents = await db.shipmentDocument.findMany({
      where: { shipmentId: null },
      orderBy: { createdAt: "desc" },
      take: 20,
    }).catch(() => []);

    return NextResponse.json({
      documents: documents.map((d) => ({
        id: d.id,
        docType: d.docType,
        fileName: d.fileName,
      })),
    });
  } catch {
    return NextResponse.json({ documents: [] });
  }
}
