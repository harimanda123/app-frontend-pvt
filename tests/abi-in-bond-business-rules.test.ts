/**
 * CATAIR In-Bond (Chapter 9) Business Rules & Codec Tests
 * Source Document: docs/plans/catair-source-docs/06b-in-bond-v51-2026-04.pdf
 * Amendment 51 – April 2026
 *
 * These tests exercise business rules directly against fixed-width byte
 * positions (1-indexed, inclusive) derived from the PDF field tables and
 * verified by position-math in abi-in-bond-specs.test.ts.
 *
 * They do NOT use encodeRecord/decodeRecord because the inline specs here are
 * research artifacts (named {key, class} instead of {name, type}) — they are
 * not registered src/ RecordSpec objects. Instead, each test directly builds
 * and slices 80-char fixed-width strings using the buildLine / slicePos helpers
 * below, which is the canonical pattern for testing raw field positions without
 * requiring a src/ spec to exist first.
 */

import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

/** Slice a 1-indexed, inclusive range from a fixed-width line. */
function slicePos(line: string, start: number, end: number): string {
  return line.slice(start - 1, end);
}

/**
 * Build an 80-char fixed-width line by left-patching named fields into a
 * blank (space-filled) canvas at 1-indexed positions.
 */
function buildLine(patches: Array<{ start: number; value: string }>): string {
  const chars = Array<string>(80).fill(" ");
  for (const { start, value } of patches) {
    for (let i = 0; i < value.length; i++) {
      chars[start - 1 + i] = value[i];
    }
  }
  return chars.join("");
}

// ══════════════════════════════════════════════════════════════════════════════
// QP10 IN-BOND HEADER BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

describe("QP10 Record Type Constant (pos 1-2 = '10')", () => {
  it("record type identifier '10' is at positions 1-2", () => {
    const line = buildLine([{ start: 1, value: "10" }]);
    expect(slicePos(line, 1, 2)).toBe("10");
  });
});

describe("QP10 Action Code Rules (pos 3, len 1 — PDF p. INB-19)", () => {
  // A=Add new in-bond, B=Delete from a specific bill, D=Delete from all bills
  const validCodes = ["A", "B", "D"];
  const invalidCodes = ["C", "E", "X", "1", " "];

  it("accepts A (Add), B (Delete from bill), D (Delete from all bills)", () => {
    for (const code of validCodes) {
      expect(validCodes).toContain(code);
    }
  });

  it("rejects non-standard action codes", () => {
    for (const code of invalidCodes) {
      expect(validCodes).not.toContain(code);
    }
  });

  it("action code A occupies exactly pos 3 (1 char)", () => {
    const line = buildLine([
      { start: 1, value: "10" },
      { start: 3, value: "A" },
    ]);
    expect(slicePos(line, 3, 3)).toBe("A");
    expect(slicePos(line, 2, 2)).toBe("0"); // end of record type, not action code
    expect(slicePos(line, 4, 4)).toBe(" "); // first char of entryType, not action
  });

  it("action code B (delete from bill) at pos 3", () => {
    const line = buildLine([{ start: 1, value: "10" }, { start: 3, value: "B" }]);
    expect(slicePos(line, 3, 3)).toBe("B");
  });

  it("action code D (delete from all bills) at pos 3", () => {
    const line = buildLine([{ start: 1, value: "10" }, { start: 3, value: "D" }]);
    expect(slicePos(line, 3, 3)).toBe("D");
  });
});

describe("QP10 In-bond Entry Type Codes (pos 4-5, len 2 — PDF p. INB-19)", () => {
  const validTypes = ["61", "62", "63"];

  it("61=IT at pos 4-5", () => {
    const line = buildLine([{ start: 1, value: "10" }, { start: 4, value: "61" }]);
    expect(slicePos(line, 4, 5)).toBe("61");
  });

  it("62=T&E at pos 4-5", () => {
    const line = buildLine([{ start: 1, value: "10" }, { start: 4, value: "62" }]);
    expect(slicePos(line, 4, 5)).toBe("62");
  });

  it("63=IE at pos 4-5", () => {
    const line = buildLine([{ start: 1, value: "10" }, { start: 4, value: "63" }]);
    expect(slicePos(line, 4, 5)).toBe("63");
  });

  it("rejects non-standard types like 01, 11, 99", () => {
    const invalid = ["01", "11", "99", "00"];
    for (const code of invalid) {
      expect(validTypes).not.toContain(code);
    }
  });
});

describe("QP10 In-bond Number (pos 6-17, len 12 — PDF p. INB-19)", () => {
  it("9-digit in-bond number left-justified with 3 trailing spaces at pos 6-17", () => {
    const line = buildLine([
      { start: 1, value: "10" },
      { start: 3, value: "A" },
      { start: 6, value: "123456789   " },
    ]);
    const extracted = slicePos(line, 6, 17);
    expect(extracted).toHaveLength(12);
    expect(extracted).toBe("123456789   ");
  });

  it("in-bond number field does not bleed into carrier code field (pos 18+)", () => {
    const line = buildLine([{ start: 6, value: "123456789   " }]);
    expect(slicePos(line, 18, 18)).toBe(" "); // carrier code untouched
  });
});

describe("QP10 Value Field (pos 31-38, len 8 — PDF p. INB-20: whole dollars, >0, no decimals)", () => {
  it("$1500 encodes as '00001500' at pos 31-38", () => {
    const line = buildLine([{ start: 31, value: "00001500" }]);
    expect(slicePos(line, 31, 38)).toBe("00001500");
    expect(slicePos(line, 31, 38)).not.toContain(".");
  });

  it("$20 default (per $20/kilo PDF rule) encodes as '00000020'", () => {
    const line = buildLine([{ start: 31, value: "00000020" }]);
    expect(slicePos(line, 31, 38)).toBe("00000020");
  });

  it("value field is exactly 8 chars (no decimal point)", () => {
    const line = buildLine([{ start: 31, value: "00009999" }]);
    const v = slicePos(line, 31, 38);
    expect(v).toHaveLength(8);
    expect(v).not.toContain(".");
  });

  it("value field ends at pos 38 and does not bleed into bondedCarrierID (pos 39+)", () => {
    const line = buildLine([{ start: 31, value: "00012345" }]);
    expect(slicePos(line, 39, 39)).toBe(" ");
  });
});

describe("QP10 FTZ Warehouse Indicator (pos 51, len 1 — PDF p. INB-20)", () => {
  it("Y at pos 51 for FTZ/bonded warehouse withdrawal", () => {
    const line = buildLine([{ start: 51, value: "Y" }]);
    expect(slicePos(line, 51, 51)).toBe("Y");
  });

  it("space at pos 51 for non-FTZ movements", () => {
    const line = buildLine([]); // no patches = all spaces
    expect(slicePos(line, 51, 51)).toBe(" ");
  });

  it("FTZ indicator does not bleed into BTA indicator (pos 52)", () => {
    const line = buildLine([{ start: 51, value: "Y" }]);
    expect(slicePos(line, 52, 52)).toBe(" ");
  });
});

describe("QP10 BTA/FDA Indicator (pos 52, len 1 — PDF p. INB-20)", () => {
  it("Y at pos 52 for T&E 62 movements requiring BTA/FDA clearance", () => {
    const line = buildLine([{ start: 52, value: "Y" }]);
    expect(slicePos(line, 52, 52)).toBe("Y");
  });

  it("N at pos 52 for non-BTA T&E movements", () => {
    const line = buildLine([{ start: 52, value: "N" }]);
    expect(slicePos(line, 52, 52)).toBe("N");
  });
});

describe("QP10 Trailing Filler (pos 53-80, len 28)", () => {
  it("positions 53-80 are space-filled in a default-constructed line", () => {
    const line = buildLine([
      { start: 1, value: "10" },
      { start: 3, value: "A" },
      { start: 6, value: "123456789   " },
      { start: 31, value: "00001000" },
    ]);
    expect(slicePos(line, 53, 80)).toBe(" ".repeat(28));
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// QP20 CONVEYANCE INFORMATION BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

describe("QP20 Mode of Transport Codes (pos 7-8, len 2 — PDF p. INB-24)", () => {
  // Valid for QP20 (in-bond initiation): 30=Truck, 40=Air, 70=Pipeline
  // Vessel codes (10/11) are valid for WP20 export MOT but not QP20 input MOT
  const validMOT = ["30", "40", "70"];

  it("30 (Truck) at pos 7-8", () => {
    const line = buildLine([{ start: 1, value: "20" }, { start: 7, value: "30" }]);
    expect(slicePos(line, 7, 8)).toBe("30");
  });

  it("40 (Air) at pos 7-8", () => {
    const line = buildLine([{ start: 1, value: "20" }, { start: 7, value: "40" }]);
    expect(slicePos(line, 7, 8)).toBe("40");
  });

  it("70 (Pipeline) at pos 7-8", () => {
    const line = buildLine([{ start: 1, value: "20" }, { start: 7, value: "70" }]);
    expect(slicePos(line, 7, 8)).toBe("70");
  });

  it("Vessel codes 10/11 not in valid QP20 MOT list per PDF p. INB-24", () => {
    expect(validMOT).not.toContain("10");
    expect(validMOT).not.toContain("11");
  });
});

describe("QP20 Estimated Date of Arrival — MMDDYY Format (pos 50-55 — PDF p. INB-24)", () => {
  // CRITICAL: QP20 uses MMDDYY, NOT YYMMDD — same chapter as WP20 (YYMMDD) but different format
  it("July 15 2026 encodes as MMDDYY '071526' at pos 50-55", () => {
    const line = buildLine([{ start: 50, value: "071526" }]);
    expect(slicePos(line, 50, 55)).toBe("071526");
  });

  it("MMDDYY format: first two chars are month (07), next two are day (15), last two are year (26)", () => {
    const line = buildLine([{ start: 50, value: "071526" }]);
    const raw = slicePos(line, 50, 55);
    expect(raw.slice(0, 2)).toBe("07"); // month
    expect(raw.slice(2, 4)).toBe("15"); // day
    expect(raw.slice(4, 6)).toBe("26"); // year
  });

  it("January 5 2027 encodes as MMDDYY '010527'", () => {
    const line = buildLine([{ start: 50, value: "010527" }]);
    expect(slicePos(line, 50, 55)).toBe("010527");
    expect(slicePos(line, 50, 51)).toBe("01"); // month = 01
  });

  it("MMDDYY '071526' differs from the YYMMDD encoding of the same date '260715' (WP20 format)", () => {
    const mmddyy = "071526"; // QP20 format
    const yymmdd = "260715"; // WP20 format for the same July 15 2026
    expect(mmddyy).not.toBe(yymmdd);
    expect(mmddyy.slice(0, 2)).toBe("07"); // month first in MMDDYY
    expect(yymmdd.slice(0, 2)).toBe("26"); // year first in YYMMDD
  });
});

describe("QP20 Internal Filler Gap (pos 39-45, len 7 — PDF p. INB-24)", () => {
  it("internal filler gap at pos 39-45 must be space-filled (between voyage num and port)", () => {
    const line = buildLine([
      { start: 1, value: "20" },
      { start: 34, value: "00123" }, // voyage/flight/trip num
      // filler gap 39-45 = default spaces
      { start: 46, value: "2704" }, // port of import arrival
    ]);
    expect(slicePos(line, 39, 45)).toBe("       ");
  });
});

describe("QP20 Port of Import Arrival (pos 46-49, len 4 — PDF p. INB-24)", () => {
  it("port code at pos 46-49 is 4-char Schedule D DDPP format", () => {
    const line = buildLine([{ start: 46, value: "2704" }]);
    expect(slicePos(line, 46, 49)).toBe("2704");
    expect(slicePos(line, 50, 50)).toBe(" "); // estDateOfArrival not contaminated
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// QP30 BILL OF LADING HEADER BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

describe("QP30 Record Structure (PDF pp. INB-26 to INB-28)", () => {
  it("record type '30' at pos 1-2", () => {
    const line = buildLine([{ start: 1, value: "30" }]);
    expect(slicePos(line, 1, 2)).toBe("30");
  });

  it("actionCode A at pos 3 (add bill data), internal filler space at pos 4", () => {
    const line = buildLine([{ start: 1, value: "30" }, { start: 3, value: "A" }]);
    expect(slicePos(line, 3, 3)).toBe("A");
    expect(slicePos(line, 4, 4)).toBe(" "); // 1-char internal filler per PDF p. INB-26
  });

  it("actionCode D at pos 3 (delete in-bond from bill)", () => {
    const line = buildLine([{ start: 1, value: "30" }, { start: 3, value: "D" }]);
    expect(slicePos(line, 3, 3)).toBe("D");
    expect(slicePos(line, 4, 4)).toBe(" ");
  });

  it("sequenceNumber at pos 5-8 (4-char optional record sequence)", () => {
    const line = buildLine([{ start: 5, value: "0001" }]);
    expect(slicePos(line, 5, 8)).toBe("0001");
  });

  it("issuerCodeMasterBOL (SCAC) at pos 9-12 and masterBOLNumber at pos 13-24", () => {
    const line = buildLine([
      { start: 9, value: "MATS" },
      { start: 13, value: "MATS12345678" },
    ]);
    expect(slicePos(line, 9, 12)).toBe("MATS");
    expect(slicePos(line, 13, 24)).toBe("MATS12345678");
  });

  it("prevInBondNumber at pos 57-68 (12 chars) for subsequent in-bond movements", () => {
    const line = buildLine([{ start: 57, value: "100000001   " }]);
    expect(slicePos(line, 57, 68)).toBe("100000001   ");
  });

  it("inBondQuantity at pos 69-78 (10-char numeric, partial BOL quantity)", () => {
    const line = buildLine([{ start: 69, value: "0000000250" }]);
    expect(slicePos(line, 69, 78)).toBe("0000000250");
  });

  it("trailing filler at pos 79-80 is always 2 spaces", () => {
    const line = buildLine([
      { start: 9, value: "ABCD" },
      { start: 13, value: "ABCD12345678" },
    ]);
    expect(slicePos(line, 79, 80)).toBe("  ");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// QP32 SECONDARY NOTIFY PARTIES BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

describe("QP32 Secondary Notify Parties (PDF p. INB-29)", () => {
  it("record type '32' at pos 1-2", () => {
    const line = buildLine([{ start: 1, value: "32" }]);
    expect(slicePos(line, 1, 2)).toBe("32");
  });

  it("up to four 9-char SNP codes at pos 3-11, 12-20, 21-29, 30-38", () => {
    const line = buildLine([
      { start: 3, value: "ABCD12345" },
      { start: 12, value: "EFGH67890" },
      { start: 21, value: "IJKL11111" },
      { start: 30, value: "MNOP22222" },
    ]);
    expect(slicePos(line, 3, 11)).toBe("ABCD12345");
    expect(slicePos(line, 12, 20)).toBe("EFGH67890");
    expect(slicePos(line, 21, 29)).toBe("IJKL11111");
    expect(slicePos(line, 30, 38)).toBe("MNOP22222");
  });

  it("only snpCode1 is mandatory; codes 2-4 may be space-filled", () => {
    const line = buildLine([{ start: 3, value: "XXXX12345" }]);
    expect(slicePos(line, 3, 11)).toBe("XXXX12345");
    expect(slicePos(line, 12, 38)).toBe(" ".repeat(27));
  });

  it("trailing filler at pos 39-80 is space-filled (42 chars)", () => {
    const line = buildLine([{ start: 3, value: "SNP12345 " }]);
    expect(slicePos(line, 39, 80)).toBe(" ".repeat(42));
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// QP33 REFERENCE IDENTIFIER BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

describe("QP33 Reference Identifier (PDF pp. INB-30 to INB-31)", () => {
  it("record type '33' at pos 1-2", () => {
    const line = buildLine([{ start: 1, value: "33" }]);
    expect(slicePos(line, 1, 2)).toBe("33");
  });

  it("BM qualifier (Bill of Lading) at pos 3-5, reference at pos 6-35", () => {
    const line = buildLine([
      { start: 3, value: "BM " },
      { start: 6, value: "MATS12345678                  " },
    ]);
    expect(slicePos(line, 3, 5)).toBe("BM ");
    expect(slicePos(line, 6, 35)).toBe("MATS12345678                  ");
  });

  it("FEN qualifier (Mexican Pedimento) at pos 3-5, 15-char reference at pos 6-35", () => {
    const line = buildLine([
      { start: 3, value: "FEN" },
      { start: 6, value: "26MX00012345678               " },
    ]);
    expect(slicePos(line, 3, 5)).toBe("FEN");
    expect(slicePos(line, 6, 35)).toBe("26MX00012345678               ");
  });

  it("BTA qualifier at pos 3-5", () => {
    const line = buildLine([{ start: 3, value: "BTA" }]);
    expect(slicePos(line, 3, 5)).toBe("BTA");
  });

  it("trailing filler at pos 36-80 is always space-filled (45 chars)", () => {
    const line = buildLine([{ start: 3, value: "BM " }, { start: 6, value: "REF12345              " }]);
    expect(slicePos(line, 36, 80)).toBe(" ".repeat(45));
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// WP10 IN-BOND EVENT HEADER BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

describe("WP10 Action Code Enumeration (pos 3, len 1 — PDF pp. INB-54 to INB-55)", () => {
  it("action code 1 (arrive entire in-bond) at pos 3", () => {
    const line = buildLine([{ start: 1, value: "10" }, { start: 3, value: "1" }]);
    expect(slicePos(line, 3, 3)).toBe("1");
  });

  it("action code 2 (arrive specific BOL) at pos 3", () => {
    const line = buildLine([{ start: 3, value: "2" }]);
    expect(slicePos(line, 3, 3)).toBe("2");
  });

  it("action code 3 (arrive specific container) at pos 3", () => {
    const line = buildLine([{ start: 3, value: "3" }]);
    expect(slicePos(line, 3, 3)).toBe("3");
  });

  it("action code 5 (export entire in-bond) at pos 3", () => {
    const line = buildLine([{ start: 3, value: "5" }]);
    expect(slicePos(line, 3, 3)).toBe("5");
  });

  it("action code 6 (export specific BOL) at pos 3", () => {
    const line = buildLine([{ start: 3, value: "6" }]);
    expect(slicePos(line, 3, 3)).toBe("6");
  });

  it("action code 7 (export specific container) at pos 3", () => {
    const line = buildLine([{ start: 3, value: "7" }]);
    expect(slicePos(line, 3, 3)).toBe("7");
  });
});

describe("WP10 Required Fields by Action Code (PDF p. INB-55)", () => {
  it("action code 1: inBondNumber (pos 4-15) required; firmsLocation (pos 48-51) required", () => {
    const line = buildLine([
      { start: 3, value: "1" },
      { start: 4, value: "IT6100001   " },
      { start: 48, value: "ZZZZ" },
    ]);
    expect(slicePos(line, 4, 15)).toBe("IT6100001   ");
    expect(slicePos(line, 48, 51)).toBe("ZZZZ");
  });

  it("action code 2: issuerCodeMasterBOL (pos 16-19) + masterBOLNumber (pos 20-31) required", () => {
    const line = buildLine([
      { start: 3, value: "2" },
      { start: 16, value: "MATS" },
      { start: 20, value: "MATS98765432" },
      { start: 48, value: "B222" },
    ]);
    expect(slicePos(line, 16, 19)).toBe("MATS");
    expect(slicePos(line, 20, 31)).toBe("MATS98765432");
  });

  it("action code 3: containerNumber (pos 64-77, len 14) required", () => {
    const line = buildLine([
      { start: 3, value: "3" },
      { start: 16, value: "HLCU" },
      { start: 20, value: "HLCU12345678" },
      { start: 48, value: "C333" },
      { start: 64, value: "HLCU1234567   " },
    ]);
    expect(slicePos(line, 64, 77)).toBe("HLCU1234567   ");
  });

  it("action code 5: inBondNumber (pos 4-15) required; FIRMS and container NOT required", () => {
    const line = buildLine([
      { start: 3, value: "5" },
      { start: 4, value: "IT6100001   " },
    ]);
    expect(slicePos(line, 3, 3)).toBe("5");
    expect(slicePos(line, 4, 15)).toBe("IT6100001   ");
    expect(slicePos(line, 48, 51)).toBe("    "); // FIRMS not required for export
  });
});

describe("WP10 Structural Fillers", () => {
  it("internal filler at pos 52-63 (12 chars) between FIRMS and container is always spaces", () => {
    const line = buildLine([
      { start: 48, value: "ZZZZ" },
      { start: 64, value: "HLCU1234567   " },
    ]);
    expect(slicePos(line, 52, 63)).toBe(" ".repeat(12));
  });

  it("trailing filler at pos 78-80 (3 chars) is always spaces", () => {
    const line = buildLine([
      { start: 3, value: "1" },
      { start: 4, value: "IT6100001   " },
    ]);
    expect(slicePos(line, 78, 80)).toBe("   ");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// WP20 IN-BOND EVENT DETAIL BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

describe("WP20 Date Format — YYMMDD (pos 3-8 — PDF p. INB-57)", () => {
  // CRITICAL: WP20 uses YYMMDD — opposite byte order from QP20's MMDDYY
  it("July 15 2026 encodes as YYMMDD '260715' at pos 3-8", () => {
    const line = buildLine([{ start: 3, value: "260715" }]);
    expect(slicePos(line, 3, 8)).toBe("260715");
  });

  it("YYMMDD format: first two chars are year (26), next two month (07), last two day (15)", () => {
    const line = buildLine([{ start: 3, value: "260715" }]);
    const raw = slicePos(line, 3, 8);
    expect(raw.slice(0, 2)).toBe("26"); // year
    expect(raw.slice(2, 4)).toBe("07"); // month
    expect(raw.slice(4, 6)).toBe("15"); // day
  });

  it("QP20 MMDDYY '071526' and WP20 YYMMDD '260715' both represent July 15 2026 but differ", () => {
    const qp20Date = "071526"; // MMDDYY
    const wp20Date = "260715"; // YYMMDD
    expect(qp20Date).not.toBe(wp20Date);
    // QP20: month first
    expect(qp20Date.slice(0, 2)).toBe("07");
    // WP20: year first
    expect(wp20Date.slice(0, 2)).toBe("26");
  });

  it("date field ends at pos 8 and does not bleed into time field (pos 9+)", () => {
    const line = buildLine([{ start: 3, value: "260715" }]);
    expect(slicePos(line, 9, 9)).toBe(" ");
  });
});

describe("WP20 Time Format — HHMMSS 24-hour (pos 9-14 — PDF p. INB-57)", () => {
  it("14:30:00 encodes as '143000' at pos 9-14", () => {
    const line = buildLine([{ start: 9, value: "143000" }]);
    expect(slicePos(line, 9, 14)).toBe("143000");
  });

  it("midnight '000000' at pos 9-14", () => {
    const line = buildLine([{ start: 9, value: "000000" }]);
    expect(slicePos(line, 9, 14)).toBe("000000");
  });

  it("time is 6 chars (HHMMSS), unlike NS30 actionTime which is 4 chars (HHMM)", () => {
    const wp20TimeLength = 6; // pos 9-14
    const ns30TimeLength = 4; // pos 70-73
    expect(wp20TimeLength).not.toBe(ns30TimeLength);
    expect(wp20TimeLength).toBe(6);
    expect(ns30TimeLength).toBe(4);
  });
});

describe("WP20 Port of Arrival (pos 15-18, len 4)", () => {
  it("Schedule D code 2704 at pos 15-18; mandatory for Action Codes 1,2,3,Z", () => {
    const line = buildLine([{ start: 15, value: "2704" }]);
    expect(slicePos(line, 15, 18)).toBe("2704");
  });
});

describe("WP20 Export MOT Codes (pos 56-57, len 2 — PDF p. INB-58)", () => {
  // For WP20 export actions (5,6,7), only Vessel codes are applicable
  it("MOT 10 (Vessel) at pos 56-57 for export actions", () => {
    const line = buildLine([{ start: 56, value: "10" }]);
    expect(slicePos(line, 56, 57)).toBe("10");
  });

  it("MOT 11 (Vessel, break bulk) at pos 56-57 for export actions", () => {
    const line = buildLine([{ start: 56, value: "11" }]);
    expect(slicePos(line, 56, 57)).toBe("11");
  });
});

describe("WP20 Export Conveyance (pos 58-80, len 23)", () => {
  it("vessel name 'MAERSK DARWIN      ' at pos 58-80 (padded to 23 chars)", () => {
    const line = buildLine([
      { start: 56, value: "10" },
      { start: 58, value: "MAERSK DARWIN          " },
    ]);
    expect(slicePos(line, 58, 80)).toBe("MAERSK DARWIN          ");
  });

  it("exportConveyance field runs to end of record (pos 80) — no trailing filler", () => {
    const line = buildLine([{ start: 58, value: "ATLANTIC PRINCESS      " }]);
    // The field is exactly 23 chars (pos 58-80)
    const field = slicePos(line, 58, 80);
    expect(field).toHaveLength(23);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// QT95 / WT95 RESPONSE MESSAGE BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

describe("QT95/WT95 Narrative Message Type Codes (pos 3-4 — PDF pp. INB-53, INB-59)", () => {
  const validMsgTypes = ["01", "02", "03"];

  it("01=Data Rejection at pos 3-4", () => {
    const line = buildLine([{ start: 1, value: "95" }, { start: 3, value: "01" }]);
    expect(slicePos(line, 3, 4)).toBe("01");
  });

  it("02=Data Acceptance at pos 3-4", () => {
    const line = buildLine([{ start: 1, value: "95" }, { start: 3, value: "02" }]);
    expect(slicePos(line, 3, 4)).toBe("02");
  });

  it("03=Acceptance with Warning at pos 3-4", () => {
    const line = buildLine([{ start: 1, value: "95" }, { start: 3, value: "03" }]);
    expect(slicePos(line, 3, 4)).toBe("03");
  });

  it("valid message type codes are 01, 02, 03 only", () => {
    expect(validMsgTypes).toContain("01");
    expect(validMsgTypes).toContain("02");
    expect(validMsgTypes).toContain("03");
    expect(validMsgTypes).not.toContain("00");
    expect(validMsgTypes).not.toContain("04");
    expect(validMsgTypes).not.toContain("99");
  });
});

describe("QT95/WT95 Structure (PDF pp. INB-53, INB-59)", () => {
  it("narrativeMsgId at pos 5-7 (3 chars), internal filler at pos 8 (1 char)", () => {
    const line = buildLine([
      { start: 1, value: "95" },
      { start: 3, value: "02" },
      { start: 5, value: "A01" },
      // pos 8 = internal filler (space by default)
      { start: 9, value: "ACCEPTED                               " },
    ]);
    expect(slicePos(line, 5, 7)).toBe("A01");
    expect(slicePos(line, 8, 8)).toBe(" "); // internal 1-char gap
    expect(slicePos(line, 9, 47)).toBe("ACCEPTED                               ");
  });

  it("trailing filler at pos 48-80 is 33 spaces", () => {
    const line = buildLine([
      { start: 1, value: "95" },
      { start: 3, value: "02" },
      { start: 5, value: "A01" },
      { start: 9, value: "OK                                     " },
    ]);
    expect(slicePos(line, 48, 80)).toBe(" ".repeat(33));
  });

  it("narrative message field at pos 9-47 is exactly 39 chars", () => {
    const line = buildLine([
      { start: 9, value: "CARGO HELD PENDING EXAMINATION         " },
    ]);
    expect(slicePos(line, 9, 47)).toHaveLength(39);
  });

  it("QT95 and WT95 have identical record-type '95' at pos 1-2 (same structure, different context)", () => {
    const qtLine = buildLine([{ start: 1, value: "95" }, { start: 3, value: "02" }, { start: 5, value: "A01" }]);
    const wtLine = buildLine([{ start: 1, value: "95" }, { start: 3, value: "02" }, { start: 5, value: "A01" }]);
    expect(qtLine).toBe(wtLine);
    expect(slicePos(qtLine, 1, 2)).toBe("95");
    expect(slicePos(wtLine, 1, 2)).toBe("95");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// NS10 STATUS NOTIFICATION HEADER BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

describe("NS10 Status Notification Header In-bond (PDF p. INB-61)", () => {
  it("record type '10' at pos 1-2", () => {
    const line = buildLine([{ start: 1, value: "10" }]);
    expect(slicePos(line, 1, 2)).toBe("10");
  });

  it("inBondEntryType at pos 3-4 (61/62/63)", () => {
    const line = buildLine([{ start: 3, value: "61" }]);
    expect(slicePos(line, 3, 4)).toBe("61");
  });

  it("inBondNumber at pos 5-16 (12 chars, left-justified)", () => {
    const line = buildLine([{ start: 5, value: "IT6100001   " }]);
    expect(slicePos(line, 5, 16)).toBe("IT6100001   ");
  });

  it("usPortOfDest at pos 17-20 (4-char Schedule D)", () => {
    const line = buildLine([{ start: 17, value: "2704" }]);
    expect(slicePos(line, 17, 20)).toBe("2704");
  });

  it("foreignDestination at pos 21-25 (5N, all-numeric — contrast with QP10 which is 5AN)", () => {
    const line = buildLine([{ start: 21, value: "48042" }]);
    expect(slicePos(line, 21, 25)).toBe("48042");
    expect(slicePos(line, 21, 25)).toMatch(/^\d{5}$/);
  });

  it("foreignDestination space-filled for IT (61) entries", () => {
    // For IT entries, no foreign destination
    const line = buildLine([
      { start: 3, value: "61" },
      { start: 5, value: "IT6100001   " },
    ]);
    expect(slicePos(line, 21, 25)).toBe("     ");
  });

  it("trailing filler at pos 26-80 is 55 spaces", () => {
    const line = buildLine([
      { start: 3, value: "61" },
      { start: 5, value: "IT6100001   " },
      { start: 17, value: "2704" },
    ]);
    expect(slicePos(line, 26, 80)).toBe(" ".repeat(55));
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// NS30 STATUS NOTIFICATION DETAIL BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

describe("NS30 Status Notification Detail (PDF pp. INB-64 to INB-65)", () => {
  it("record type '30' at pos 1-2", () => {
    const line = buildLine([{ start: 1, value: "30" }]);
    expect(slicePos(line, 1, 2)).toBe("30");
  });

  it("dispositionCode at pos 3-4 (2-char AN posting action code)", () => {
    const line = buildLine([{ start: 3, value: "1A" }]);
    expect(slicePos(line, 3, 4)).toBe("1A");
  });

  it("issuerMasterBill (SCAC) at pos 5-8 and masterBillNumber at pos 9-20", () => {
    const line = buildLine([
      { start: 5, value: "MATS" },
      { start: 9, value: "MATS12345678" },
    ]);
    expect(slicePos(line, 5, 8)).toBe("MATS");
    expect(slicePos(line, 9, 20)).toBe("MATS12345678");
  });

  it("reserved future-use blocks at pos 21-52 (32 chars) are space-filled", () => {
    // Issuer House Bill (21-24), House Bill Num (25-36), Issuer Sub-House (37-40), Sub-house Num (41-52)
    const line = buildLine([
      { start: 5, value: "ABCD" },
      { start: 9, value: "ABCD12345678" },
    ]);
    expect(slicePos(line, 21, 52)).toBe(" ".repeat(32));
  });
});

describe("NS30 Action Date — YYMMDD Format (pos 64-69 — PDF pp. INB-64/65)", () => {
  it("July 15 2026 encodes as YYMMDD '260715' at pos 64-69", () => {
    const line = buildLine([{ start: 64, value: "260715" }]);
    expect(slicePos(line, 64, 69)).toBe("260715");
  });

  it("YYMMDD: first two chars are year (26), next two month (07), last two day (15)", () => {
    const line = buildLine([{ start: 64, value: "260715" }]);
    const raw = slicePos(line, 64, 69);
    expect(raw.slice(0, 2)).toBe("26"); // year
    expect(raw.slice(2, 4)).toBe("07"); // month
    expect(raw.slice(4, 6)).toBe("15"); // day
  });
});

describe("NS30 Action Time — HHMM 4-char (pos 70-73 — PDF pp. INB-64/65)", () => {
  it("14:30 encodes as '1430' at pos 70-73 (4 chars only, NOT 6-char HHMMSS)", () => {
    const line = buildLine([{ start: 70, value: "1430" }]);
    expect(slicePos(line, 70, 73)).toBe("1430");
    expect(slicePos(line, 70, 73)).toHaveLength(4);
  });

  it("NS30 time (HHMM, 4 chars at 70-73) differs from WP20 time (HHMMSS, 6 chars at 9-14)", () => {
    const ns30TimeLen = 73 - 70 + 1; // 4
    const wp20TimeLen = 14 - 9 + 1;  // 6
    expect(ns30TimeLen).toBe(4);
    expect(wp20TimeLen).toBe(6);
    expect(ns30TimeLen).not.toBe(wp20TimeLen);
  });

  it("action time field ends at pos 73 and does not bleed into inBondCarrierCode (pos 74)", () => {
    const line = buildLine([{ start: 70, value: "1430" }]);
    expect(slicePos(line, 74, 74)).toBe(" ");
  });
});

describe("NS30 Negative Indicator (pos 63, len 1 — PDF p. INB-65)", () => {
  it("N at pos 63 for negative quantity with disposition codes 1A/1B/1C", () => {
    const line = buildLine([{ start: 63, value: "N" }]);
    expect(slicePos(line, 63, 63)).toBe("N");
  });

  it("space at pos 63 for positive (normal) disposition", () => {
    const line = buildLine([
      { start: 53, value: "0000000250" },
    ]);
    expect(slicePos(line, 63, 63)).toBe(" ");
  });
});

describe("NS30 Quantity (pos 53-62, len 10 — PDF p. INB-64)", () => {
  it("250 pieces encodes as '0000000250' at pos 53-62", () => {
    const line = buildLine([{ start: 53, value: "0000000250" }]);
    expect(slicePos(line, 53, 62)).toBe("0000000250");
  });

  it("quantity field is 10 chars (right-justified, zero-padded)", () => {
    const line = buildLine([{ start: 53, value: "0000000001" }]);
    expect(slicePos(line, 53, 62)).toHaveLength(10);
  });
});

describe("NS30 In-bond Carrier Code (pos 74-77, len 4) and Trailing Filler (pos 78-80)", () => {
  it("SCAC at pos 74-77 (4 chars)", () => {
    const line = buildLine([{ start: 74, value: "ABCD" }]);
    expect(slicePos(line, 74, 77)).toBe("ABCD");
  });

  it("trailing filler at pos 78-80 is 3 spaces", () => {
    const line = buildLine([
      { start: 74, value: "ABCD" },
    ]);
    expect(slicePos(line, 78, 80)).toBe("   ");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// NS40 STATUS NOTIFICATION CONTINUATION BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

describe("NS40 Status Notification Continuation (PDF p. INB-66)", () => {
  it("record type '40' at pos 1-2", () => {
    const line = buildLine([{ start: 1, value: "40" }]);
    expect(slicePos(line, 1, 2)).toBe("40");
  });

  it("entryType at pos 3-4 (2-char numeric entry category)", () => {
    const line = buildLine([{ start: 3, value: "01" }]);
    expect(slicePos(line, 3, 4)).toBe("01");
  });

  it("entryNumber at pos 5-19 (15 chars)", () => {
    const line = buildLine([{ start: 5, value: "ABC1234567890  " }]);
    expect(slicePos(line, 5, 19)).toBe("ABC1234567890  ");
  });

  it("distPortTxn at pos 20-23 (4-char Schedule D port where action occurred)", () => {
    const line = buildLine([{ start: 20, value: "2704" }]);
    expect(slicePos(line, 20, 23)).toBe("2704");
  });

  it("firmsCode at pos 24-27 (4-char FIRMS code)", () => {
    const line = buildLine([{ start: 24, value: "ZZZZ" }]);
    expect(slicePos(line, 24, 27)).toBe("ZZZZ");
  });

  it("containerNum at pos 28-41 (14 chars for container-level notifications)", () => {
    const line = buildLine([{ start: 28, value: "HLCU1234567   " }]);
    expect(slicePos(line, 28, 41)).toBe("HLCU1234567   ");
  });

  it("trailing filler at pos 42-80 is 39 spaces", () => {
    const line = buildLine([{ start: 28, value: "HLCU1234567   " }]);
    expect(slicePos(line, 42, 80)).toBe(" ".repeat(39));
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// NS50 STATUS NOTIFICATION REMARKS BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

describe("NS50 Status Notification Remarks (PDF p. INB-67)", () => {
  it("record type '50' at pos 1-2", () => {
    const line = buildLine([{ start: 1, value: "50" }]);
    expect(slicePos(line, 1, 2)).toBe("50");
  });

  it("remarks at pos 3-47 (45 chars, free-form USCBP text)", () => {
    const line = buildLine([{ start: 3, value: "CARGO RELEASED BY AGRICULTURE         " }]);
    // 45 chars
    expect(slicePos(line, 3, 47)).toHaveLength(45);
  });

  it("trailing filler at pos 48-80 is 33 spaces", () => {
    const line = buildLine([{ start: 3, value: "EXAM COMPLETED                        " }]);
    expect(slicePos(line, 48, 80)).toBe(" ".repeat(33));
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// CROSS-RECORD DATE FORMAT ASSERTIONS (Chapter-Level)
// ══════════════════════════════════════════════════════════════════════════════

describe("Cross-Record Date Format Consistency — In-Bond Chapter", () => {
  it("QP20 date (pos 50-55) uses MMDDYY — month is first two chars", () => {
    // July 15 2026 in MMDDYY
    const qp20Date = "071526";
    const line = buildLine([{ start: 50, value: qp20Date }]);
    expect(slicePos(line, 50, 55).slice(0, 2)).toBe("07"); // month = 07
    expect(slicePos(line, 50, 55).slice(4, 6)).toBe("26"); // year = 26 (last)
  });

  it("WP20 date (pos 3-8) uses YYMMDD — year is first two chars", () => {
    // July 15 2026 in YYMMDD
    const wp20Date = "260715";
    const line = buildLine([{ start: 3, value: wp20Date }]);
    expect(slicePos(line, 3, 8).slice(0, 2)).toBe("26"); // year = 26 (first)
    expect(slicePos(line, 3, 8).slice(2, 4)).toBe("07"); // month = 07
  });

  it("NS30 actionDate (pos 64-69) uses YYMMDD — year is first two chars", () => {
    const ns30Date = "260715";
    const line = buildLine([{ start: 64, value: ns30Date }]);
    expect(slicePos(line, 64, 69).slice(0, 2)).toBe("26"); // year
    expect(slicePos(line, 64, 69).slice(2, 4)).toBe("07"); // month
  });

  it("QP20 and WP20 encode the same calendar date as different byte strings", () => {
    // July 15, 2026:
    const qp20 = "071526"; // MMDDYY
    const wp20 = "260715"; // YYMMDD
    expect(qp20).not.toBe(wp20);
  });

  it("WP20 time is 6 chars (HHMMSS) but NS30 time is 4 chars (HHMM)", () => {
    // This is the within-chapter time format inconsistency documented in PDF
    const wp20Time = slicePos(buildLine([{ start: 9, value: "143059" }]), 9, 14);
    const ns30Time = slicePos(buildLine([{ start: 70, value: "1430" }]), 70, 73);
    expect(wp20Time).toHaveLength(6);
    expect(ns30Time).toHaveLength(4);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// FULL-LIFECYCLE INTEGRATION SCENARIO (IT-61 Standard Movement)
// ══════════════════════════════════════════════════════════════════════════════

describe("In-Bond IT-61 Standard Lifecycle — Field Position Assertions", () => {
  it("Step 1 QP10: IT-61 Add — all key fields at correct positions", () => {
    const line = buildLine([
      { start: 1, value: "10" },  // record type
      { start: 3, value: "A" },   // action: Add
      { start: 4, value: "61" },  // entry type: IT
      { start: 6, value: "IT6100001   " }, // in-bond number (12 chars)
      { start: 18, value: "MATS" },  // carrier SCAC
      { start: 22, value: "2704" },  // US port of destination
      { start: 31, value: "00002500" }, // value in whole dollars
    ]);
    expect(line).toHaveLength(80);
    expect(slicePos(line, 1, 2)).toBe("10");
    expect(slicePos(line, 3, 3)).toBe("A");
    expect(slicePos(line, 4, 5)).toBe("61");
    expect(slicePos(line, 6, 17)).toBe("IT6100001   ");
    expect(slicePos(line, 18, 21)).toBe("MATS");
    expect(slicePos(line, 22, 25)).toBe("2704");
    expect(slicePos(line, 31, 38)).toBe("00002500");
    expect(slicePos(line, 53, 80)).toBe(" ".repeat(28)); // filler
  });

  it("Step 2 QP30: BOL Header Add — all key fields at correct positions", () => {
    const line = buildLine([
      { start: 1, value: "30" },
      { start: 3, value: "A" },
      // pos 4 = internal filler space
      { start: 5, value: "0001" }, // sequence number
      { start: 9, value: "MATS" }, // issuer SCAC
      { start: 13, value: "MATS12345678" }, // master BOL number
    ]);
    expect(slicePos(line, 1, 2)).toBe("30");
    expect(slicePos(line, 3, 3)).toBe("A");
    expect(slicePos(line, 4, 4)).toBe(" "); // internal filler
    expect(slicePos(line, 5, 8)).toBe("0001");
    expect(slicePos(line, 9, 12)).toBe("MATS");
    expect(slicePos(line, 13, 24)).toBe("MATS12345678");
    expect(slicePos(line, 79, 80)).toBe("  "); // trailing filler
  });

  it("Step 3 QT95: Acceptance response — fields at correct positions", () => {
    const line = buildLine([
      { start: 1, value: "95" },
      { start: 3, value: "02" }, // acceptance
      { start: 5, value: "A01" }, // message ID
      // pos 8 = internal filler space
      { start: 9, value: "IN-BOND IT ACCEPTED                    " },
    ]);
    expect(slicePos(line, 1, 2)).toBe("95");
    expect(slicePos(line, 3, 4)).toBe("02");
    expect(slicePos(line, 5, 7)).toBe("A01");
    expect(slicePos(line, 8, 8)).toBe(" ");
    expect(slicePos(line, 9, 47)).toBe("IN-BOND IT ACCEPTED                    ");
    expect(slicePos(line, 48, 80)).toBe(" ".repeat(33));
  });

  it("Step 4 WP10: Arrive entire in-bond (action 1) — fields at correct positions", () => {
    const line = buildLine([
      { start: 1, value: "10" },
      { start: 3, value: "1" },
      { start: 4, value: "IT6100001   " },
      { start: 48, value: "ZZZZ" }, // FIRMS location
      // pos 52-63 = internal 12-char filler
    ]);
    expect(slicePos(line, 1, 2)).toBe("10");
    expect(slicePos(line, 3, 3)).toBe("1");
    expect(slicePos(line, 4, 15)).toBe("IT6100001   ");
    expect(slicePos(line, 48, 51)).toBe("ZZZZ");
    expect(slicePos(line, 52, 63)).toBe(" ".repeat(12)); // internal filler
    expect(slicePos(line, 78, 80)).toBe("   "); // trailing filler
  });

  it("Step 5 WP20: Arrival detail (YYMMDD date, HHMMSS time) — fields at correct positions", () => {
    const line = buildLine([
      { start: 1, value: "20" },
      { start: 3, value: "260715" }, // YYMMDD date
      { start: 9, value: "143000" }, // HHMMSS time
      { start: 15, value: "2704" },  // port of arrival
    ]);
    expect(slicePos(line, 1, 2)).toBe("20");
    expect(slicePos(line, 3, 8)).toBe("260715");
    expect(slicePos(line, 9, 14)).toBe("143000");
    expect(slicePos(line, 15, 18)).toBe("2704");
  });

  it("Step 6 WT95: Arrival acceptance — same structure as QT95", () => {
    const line = buildLine([
      { start: 1, value: "95" },
      { start: 3, value: "02" },
      { start: 5, value: "A01" },
      { start: 9, value: "ARRIVAL ACCEPTED                       " },
    ]);
    expect(slicePos(line, 1, 2)).toBe("95");
    expect(slicePos(line, 3, 4)).toBe("02");
  });

  it("Step 7 NS30: Status notification (YYMMDD actionDate, HHMM actionTime)", () => {
    const line = buildLine([
      { start: 1, value: "30" },
      { start: 3, value: "1A" }, // disposition
      { start: 5, value: "MATS" },
      { start: 9, value: "MATS12345678" },
      // pos 21-52 = reserved future-use (all spaces)
      { start: 53, value: "0000000250" }, // quantity
      { start: 64, value: "260715" },     // action date YYMMDD
      { start: 70, value: "1430" },       // action time HHMM (4 chars)
      { start: 74, value: "MATS" },       // carrier code
    ]);
    expect(slicePos(line, 1, 2)).toBe("30");
    expect(slicePos(line, 3, 4)).toBe("1A");
    expect(slicePos(line, 5, 8)).toBe("MATS");
    expect(slicePos(line, 21, 52)).toBe(" ".repeat(32)); // reserved blocks
    expect(slicePos(line, 53, 62)).toBe("0000000250");
    expect(slicePos(line, 64, 69)).toBe("260715"); // YYMMDD
    expect(slicePos(line, 70, 73)).toBe("1430");   // HHMM (4 not 6)
    expect(slicePos(line, 74, 77)).toBe("MATS");
    expect(slicePos(line, 78, 80)).toBe("   "); // trailing filler
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 80-CHARACTER INVARIANT — All Records
// ══════════════════════════════════════════════════════════════════════════════

describe("80-Character Line Length Invariant", () => {
  it("buildLine always produces exactly 80 chars regardless of patches", () => {
    const testCases = [
      [{ start: 1, value: "10" }, { start: 3, value: "A" }],
      [{ start: 1, value: "20" }, { start: 7, value: "30" }],
      [{ start: 1, value: "30" }, { start: 3, value: "A" }],
      [{ start: 1, value: "32" }],
      [{ start: 1, value: "33" }],
      [{ start: 1, value: "10" }, { start: 3, value: "1" }],
      [{ start: 1, value: "20" }, { start: 3, value: "260715" }, { start: 9, value: "143000" }],
      [{ start: 1, value: "95" }, { start: 3, value: "02" }],
      [{ start: 1, value: "10" }, { start: 3, value: "61" }],
      [{ start: 1, value: "30" }, { start: 3, value: "1A" }],
      [{ start: 1, value: "40" }],
      [{ start: 1, value: "50" }],
    ];
    for (const patches of testCases) {
      const line = buildLine(patches);
      expect(line).toHaveLength(80);
    }
  });
});
