import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { db } from "@qubere/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return new NextResponse("documentId query parameter is required", { status: 400 });
    }

    const doc = await db.shipmentDocument.findFirst({
      where: { id: documentId },
      select: { fileName: true, fileUrl: true },
    }).catch(() => null);

    const fileName = doc?.fileName || "sample_document.pdf";
    const samplePath = path.join(process.cwd(), "public", "sample_document.pdf");

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await fs.readFile(samplePath);
    } catch {
      return new NextResponse("Document file not found", { status: 404 });
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err: any) {
    return new NextResponse(err.message || "Failed to stream document", { status: 500 });
  }
}
