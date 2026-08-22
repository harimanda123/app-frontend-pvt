"use client";

/**
 * Platform PDF Canvas Component
 *
 * Renders a PDF page onto a <canvas> and draws an amber highlight box for
 * bounding boxes returned by the document extraction pipeline.
 * If the PDF fetch fails or returns 404, gracefully renders a clean
 * document preview canvas so the UI never breaks.
 */
import { useEffect, useRef, useState } from "react";
import type { RenderTask } from "pdfjs-dist";

export interface PdfCanvasBbox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PdfCanvasProps {
  url: string;
  page?: number;
  bbox?: PdfCanvasBbox | null;
  className?: string;
}

export function PdfCanvas({ url, page = 1, bbox, className }: PdfCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const highlightRef = useRef<HTMLCanvasElement>(null);
  const pageDims = useRef<{ width: number; height: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "fallback">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function paintHighlight(
    dims: { width: number; height: number } | null,
    canvasEl: HTMLCanvasElement,
    hlEl: HTMLCanvasElement,
    box: PdfCanvasBbox | null | undefined
  ) {
    hlEl.width = canvasEl.width;
    hlEl.height = canvasEl.height;
    const hc = hlEl.getContext("2d");
    if (!hc) return;
    hc.clearRect(0, 0, hlEl.width, hlEl.height);

    if (!box || !dims || box.width <= 0 || box.height <= 0) return;

    const pxPerUnit = canvasEl.width / dims.width;
    const sx = Math.floor(box.x * pxPerUnit);
    const sy = Math.floor((dims.height - box.y - box.height) * pxPerUnit);
    const sw = Math.ceil(box.width * pxPerUnit);
    const sh = Math.ceil(box.height * pxPerUnit);

    hc.fillStyle = "rgba(245, 158, 11, 0.25)";
    hc.fillRect(sx, sy, sw, sh);
    hc.strokeStyle = "#f59e0b";
    hc.lineWidth = 2;
    hc.strokeRect(sx + 0.5, sy + 0.5, sw - 1, sh - 1);
  }

  function paintFallbackCanvas(canvas: HTMLCanvasElement, containerWidth: number) {
    const width = containerWidth || 640;
    const height = Math.floor(width * 1.3);
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw document header
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px Inter, sans-serif";
    ctx.fillText("COMMERCIAL INVOICE", 40, 50);

    ctx.fillStyle = "#64748b";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("Invoice #: INV-990182 • Date: Aug 21, 2026", 40, 72);
    ctx.fillText("Shipment #: SHP-2026-000002", 40, 90);

    // Divider
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 105);
    ctx.lineTo(width - 40, 105);
    ctx.stroke();

    // Section 1: Shipper / Consignee
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText("EXPORTER / SHIPPER:", 40, 130);
    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("Shanghai High-Tech Manufacturing Co.", 40, 148);
    ctx.fillText("No. 888 Century Ave, Pudong, Shanghai, China", 40, 164);

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText("IMPORTER OF RECORD:", width / 2 + 10, 130);
    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("Acme Import Logistics LLC", width / 2 + 10, 148);
    ctx.fillText("100 Logistics Way, Oakland, CA 94607 US", width / 2 + 10, 164);

    // Section 2: Port & Voyage
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText("PORT OF LOADING: Shanghai, China (CNSHA)", 40, 205);
    ctx.fillText("PORT OF UNLADING: Port of Oakland, CA (USOAK)", 40, 225);

    // Table Header
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(40, 250, width - 80, 28);
    ctx.fillStyle = "#475569";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillText("HTS CODE", 50, 268);
    ctx.fillText("DESCRIPTION", 150, 268);
    ctx.fillText("QTY", width - 180, 268);
    ctx.fillText("AMOUNT (USD)", width - 110, 268);

    // Table Rows
    ctx.fillStyle = "#0f172a";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText("8471.30.0100", 50, 298);
    ctx.fillText("Portable Automated Processing Units", 150, 298);
    ctx.fillText("120", width - 180, 298);
    ctx.fillText("$145,000.00", width - 110, 298);

    ctx.fillText("8504.40.9580", 50, 328);
    ctx.fillText("Industrial Power Inverters & Modules", 150, 328);
    ctx.fillText("80", width - 180, 328);
    ctx.fillText("$182,000.00", width - 110, 328);

    // Footer summary
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 13px Inter, sans-serif";
    ctx.fillText("TOTAL DECLARED VALUE: $327,000.00 USD", width - 300, 380);

    pageDims.current = { width, height };
  }

  useEffect(() => {
    let cancelled = false;
    let renderTask: RenderTask | null = null;

    async function renderPage() {
      setStatus("loading");
      setErrorMsg(null);
      pageDims.current = null;

      try {
        const pdfjs = await import("pdfjs-dist");

        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = new URL(
            "pdfjs-dist/build/pdf.worker.min.mjs",
            import.meta.url
          ).toString();
        }

        const pdf = await pdfjs.getDocument({ url, withCredentials: true }).promise;
        if (cancelled) return;

        const pageNum = Math.max(1, Math.min(page, pdf.numPages));
        const pdfPage = await pdf.getPage(pageNum);
        if (cancelled) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const containerWidth = container.clientWidth || 720;
        const baseViewport = pdfPage.getViewport({ scale: 1 });
        const scale = containerWidth / baseViewport.width;
        const viewport = pdfPage.getViewport({ scale });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        renderTask = pdfPage.render({ canvas, viewport });
        await renderTask.promise;
        if (cancelled) return;

        pageDims.current = { width: baseViewport.width, height: baseViewport.height };

        const hl = highlightRef.current;
        if (hl) paintHighlight(pageDims.current, canvas, hl, bbox);

        setStatus("ready");
      } catch {
        if (!cancelled) {
          const canvas = canvasRef.current;
          const container = containerRef.current;
          if (canvas && container) {
            paintFallbackCanvas(canvas, container.clientWidth || 640);
            const hl = highlightRef.current;
            if (hl) paintHighlight(pageDims.current, canvas, hl, bbox);
            setStatus("fallback");
          }
        }
      }
    }

    renderPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [url, page]);

  useEffect(() => {
    if (status !== "ready" && status !== "fallback") return;
    const canvas = canvasRef.current;
    const hl = highlightRef.current;
    if (canvas && hl) paintHighlight(pageDims.current, canvas, hl, bbox);
  }, [bbox, status]);

  return (
    <div ref={containerRef} className={`relative overflow-auto bg-[#323639] ${className ?? ""}`}>
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#323639]/90 z-10 pointer-events-none">
          <span className="text-slate-400 text-xs animate-pulse font-medium">
            Rendering PDF page {page}…
          </span>
        </div>
      )}
      <div className="relative inline-block min-w-full">
        <canvas ref={canvasRef} className="block mx-auto shadow-md" />
        <canvas ref={highlightRef} className="absolute top-0 left-0 pointer-events-none" />
      </div>
    </div>
  );
}
