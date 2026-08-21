import { Form7501Result } from "./form7501";

/**
 * Clean, server-side PDF renderer for CBP Form 7501 (Entry Summary).
 * Constructs a valid %PDF-1.4 binary stream containing formatted tables, boxes,
 * and entry summary details with exact byte-level xref offsets and absolute matrices.
 */
export function generateForm7501PdfBuffer(form: Form7501Result): Buffer {
  const sanitize = (text?: string | number | null) => {
    if (text === null || text === undefined) return "-";
    return String(text)
      .replace(/[()\\]/g, "")
      .replace(/[^\x20-\x7E]/g, " ");
  };

  const entryNo = sanitize(form.entryNumber.value);
  const entryType = sanitize(form.entryType.value);
  const importer = sanitize(form.importerName.value);
  const importerNum = sanitize(form.importerNumber.value);
  const port = sanitize(form.portCode.value);
  const bond = sanitize(form.bondNumber.value);
  const exportCountry = sanitize(form.countryOfExport.value);
  const carrier = sanitize(form.carrier.value);
  const totalValue = form.totalEnteredValue.value !== null ? `$${form.totalEnteredValue.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00";
  const totalDuty = form.totalDuty.value !== null ? `$${form.totalDuty.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00";

  const streamCommands: string[] = ["q"];

  // Header Banner
  streamCommands.push("0.1 0.2 0.45 rg 40 725 532 45 re f");
  streamCommands.push("1 1 1 rg");
  streamCommands.push("BT /F1 14 Tf 1 0 0 1 52 750 Tm (DEPARTMENT OF HOMELAND SECURITY - CBP) Tj ET");
  streamCommands.push("BT /F1 11 Tf 1 0 0 1 380 750 Tm (CBP FORM 7501) Tj ET");
  streamCommands.push("BT /F2 8.5 Tf 1 0 0 1 380 736 Tm (ENTRY SUMMARY) Tj ET");
  streamCommands.push("0 0 0 rg");

  // Grid Box
  streamCommands.push("0.7 0.7 0.7 rg 0.75 w 40 600 532 115 re s");
  streamCommands.push("40 676 532 1 re s");
  streamCommands.push("40 638 532 1 re s");
  streamCommands.push("216 600 0.75 115 re s");
  streamCommands.push("380 600 0.75 115 re s");

  // Box Field Text
  streamCommands.push(`BT /F1 7.5 Tf 0.2 0.25 0.35 rg 1 0 0 1 45 695 Tm (1. ENTRY TYPE: ${entryType}) Tj ET`);
  streamCommands.push(`BT /F1 7.5 Tf 0.2 0.25 0.35 rg 1 0 0 1 222 695 Tm (2. ENTRY NUMBER: ${entryNo}) Tj ET`);
  streamCommands.push(`BT /F1 7.5 Tf 0.2 0.25 0.35 rg 1 0 0 1 386 695 Tm (4. BOND NUMBER: ${bond}) Tj ET`);

  streamCommands.push(`BT /F1 7.5 Tf 0.2 0.25 0.35 rg 1 0 0 1 45 656 Tm (8. CARRIER: ${carrier}) Tj ET`);
  streamCommands.push(`BT /F1 7.5 Tf 0.2 0.25 0.35 rg 1 0 0 1 222 656 Tm (10. COUNTRY OF EXPORT: ${exportCountry}) Tj ET`);
  streamCommands.push(`BT /F1 7.5 Tf 0.2 0.25 0.35 rg 1 0 0 1 386 656 Tm (45. PORT OF ENTRY: ${port}) Tj ET`);

  streamCommands.push(`BT /F1 7.5 Tf 0.2 0.25 0.35 rg 1 0 0 1 45 618 Tm (23. IMPORTER NO: ${importerNum}) Tj ET`);
  streamCommands.push(`BT /F1 7.5 Tf 0.2 0.25 0.35 rg 1 0 0 1 222 618 Tm (25. IMPORTER OF RECORD: ${importer}) Tj ET`);
  streamCommands.push(`BT /F1 7.5 Tf 0.2 0.25 0.35 rg 1 0 0 1 386 618 Tm (TOTAL ENTERED VALUE: ${totalValue}) Tj ET`);

  // Table Header Line
  streamCommands.push("0.9 0.92 0.95 rg 40 570 532 20 re f 0 0 0 rg");
  streamCommands.push("0.7 0.7 0.7 rg 0.5 w 40 570 532 20 re s");

  streamCommands.push("BT /F1 7.5 Tf 0.1 0.1 0.2 rg 1 0 0 1 45 576 Tm (LN) Tj ET");
  streamCommands.push("BT /F1 7.5 Tf 0.1 0.1 0.2 rg 1 0 0 1 68 576 Tm (DESCRIPTION) Tj ET");
  streamCommands.push("BT /F1 7.5 Tf 0.1 0.1 0.2 rg 1 0 0 1 225 576 Tm (HTS CODE) Tj ET");
  streamCommands.push("BT /F1 7.5 Tf 0.1 0.1 0.2 rg 1 0 0 1 310 576 Tm (COO) Tj ET");
  streamCommands.push("BT /F1 7.5 Tf 0.1 0.1 0.2 rg 1 0 0 1 350 576 Tm (QTY) Tj ET");
  streamCommands.push("BT /F1 7.5 Tf 0.1 0.1 0.2 rg 1 0 0 1 405 576 Tm (VALUE) Tj ET");
  streamCommands.push("BT /F1 7.5 Tf 0.1 0.1 0.2 rg 1 0 0 1 465 576 Tm (RATE) Tj ET");
  streamCommands.push("BT /F1 7.5 Tf 0.1 0.1 0.2 rg 1 0 0 1 525 576 Tm (DUTY) Tj ET");

  // Line Items Rows
  let y = 550;
  for (const item of form.lineItems) {
    if (y < 120) break;
    const lineNo = sanitize(item.lineNumber);
    const desc = sanitize(item.description.value).substring(0, 28);
    const hts = sanitize(item.htsCode.value);
    const country = sanitize(item.countryOfOrigin.value);
    const qty = item.quantity.value !== null ? String(item.quantity.value) : "1";
    const val = item.enteredValue.value !== null ? `$${item.enteredValue.value.toFixed(2)}` : "$0.00";
    const rate = item.dutyRate.value !== null ? `${(item.dutyRate.value * 100).toFixed(2)}%` : "0.00%";
    const duty = item.dutyAmount.value !== null ? `$${item.dutyAmount.value.toFixed(2)}` : "$0.00";

    streamCommands.push(`BT /F2 7.5 Tf 0.1 0.1 0.1 rg 1 0 0 1 45 ${y} Tm (${lineNo}) Tj ET`);
    streamCommands.push(`BT /F2 7.5 Tf 0.1 0.1 0.1 rg 1 0 0 1 68 ${y} Tm (${desc}) Tj ET`);
    streamCommands.push(`BT /F2 7.5 Tf 0.1 0.1 0.1 rg 1 0 0 1 225 ${y} Tm (${hts}) Tj ET`);
    streamCommands.push(`BT /F2 7.5 Tf 0.1 0.1 0.1 rg 1 0 0 1 310 ${y} Tm (${country}) Tj ET`);
    streamCommands.push(`BT /F2 7.5 Tf 0.1 0.1 0.1 rg 1 0 0 1 350 ${y} Tm (${qty}) Tj ET`);
    streamCommands.push(`BT /F2 7.5 Tf 0.1 0.1 0.1 rg 1 0 0 1 405 ${y} Tm (${val}) Tj ET`);
    streamCommands.push(`BT /F2 7.5 Tf 0.1 0.1 0.1 rg 1 0 0 1 465 ${y} Tm (${rate}) Tj ET`);
    streamCommands.push(`BT /F2 7.5 Tf 0.1 0.1 0.1 rg 1 0 0 1 525 ${y} Tm (${duty}) Tj ET`);

    y -= 16;
  }

  // Summary Footer Box
  streamCommands.push("0.95 0.96 0.98 rg 40 60 532 45 re f");
  streamCommands.push("0.7 0.7 0.7 rg 0.75 w 40 60 532 45 re s");
  streamCommands.push(`BT /F1 9 Tf 0.1 0.1 0.2 rg 1 0 0 1 50 86 Tm (TOTAL CUSTOMS VALUE: ${totalValue}) Tj ET`);
  streamCommands.push(`BT /F1 9 Tf 0.1 0.1 0.2 rg 1 0 0 1 300 86 Tm (TOTAL DUTIES & FEES: ${totalDuty}) Tj ET`);
  streamCommands.push("BT /F2 7.5 Tf 0.4 0.4 0.4 rg 1 0 0 1 50 68 Tm (Generated by Qubere Trade Engine & CBP Automated Commercial Environment - 19 CFR Section 141) Tj ET");
  streamCommands.push("Q");

  const streamContent = streamCommands.join("\n");
  const streamLength = Buffer.byteLength(streamContent, "utf-8");

  const obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const obj2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
  const obj3 = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources 4 0 R /Contents 5 0 R >>\nendobj\n";
  const obj4 = "4 0 obj\n<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>\nendobj\n";
  const obj5 = `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`;

  const headerStr = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const headerBuf = Buffer.from(headerStr, "latin1");
  const objects = [
    Buffer.from(obj1, "utf-8"),
    Buffer.from(obj2, "utf-8"),
    Buffer.from(obj3, "utf-8"),
    Buffer.from(obj4, "utf-8"),
    Buffer.from(obj5, "utf-8"),
  ];

  const offsets: number[] = [0];
  let currOffset = headerBuf.length;

  for (const objBuf of objects) {
    offsets.push(currOffset);
    currOffset += objBuf.length;
  }

  const startXrefOffset = currOffset;
  let xrefStr = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    xrefStr += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  xrefStr += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXrefOffset}\n%%EOF\n`;

  const xrefBuf = Buffer.from(xrefStr, "utf-8");

  return Buffer.concat([headerBuf, ...objects, xrefBuf]);
}
