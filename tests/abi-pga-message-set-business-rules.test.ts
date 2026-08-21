/**
 * CATAIR Participating Government Agencies (PGA) Message Set (Chapter 8) Business Rules Tests
 * Source PDF: docs/plans/catair-source-docs/08-pga-message-set-2026-07.pdf (July 1, 2026 - Pub # 0875-0419)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BUSINESS RULES & VERIFICATION ENGINE FOR CATAIR CHAPTER 8
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { describe, it, expect } from "vitest";

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN TYPES AND HELPERS FOR PGA BUSINESS RULES
// ─────────────────────────────────────────────────────────────────────────────

export interface PgaLineIdentifier {
  agencyCode: string;
  pgaLineNumber: string; // 3-digit formatted string, e.g. "001"
}

export interface PgaRecordInput {
  recordType: string;
  [key: string]: any;
}

export interface PgaValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Format a numeric value with implied decimal precision into a fixed-width zero-padded string.
 */
export function formatImpliedDecimal(value: number, totalLength: number, decimals: number): string {
  const scaled = Math.round(value * Math.pow(10, decimals));
  if (scaled < 0) {
    throw new Error("Negative numbers cannot be formatted directly into unsigned implied decimal field.");
  }
  return String(scaled).padStart(totalLength, "0");
}

/**
 * Parse a fixed-width numeric string with implied decimal precision.
 */
export function parseImpliedDecimal(str: string, decimals: number): number {
  const val = parseInt(str, 10);
  if (isNaN(val)) return 0;
  return val / Math.pow(10, decimals);
}

/**
 * Evaluate PGA Line Numbering restart and increment logic.
 * Rule: Within a tariff line, PG01 PGA Line Number starts at 001 for a given Agency Code,
 * and increments by 1 for every new PG01 for that same Agency Code.
 * When the Agency Code changes, line numbering restarts at 001.
 */
export function computePgaLineNumbers(agencyCodes: string[]): PgaLineIdentifier[] {
  const results: PgaLineIdentifier[] = [];
  let currentAgency = "";
  let counter = 0;

  for (const agency of agencyCodes) {
    if (agency !== currentAgency) {
      currentAgency = agency;
      counter = 1;
    } else {
      counter++;
    }
    const formatted = String(counter).padStart(3, "0");
    results.push({ agencyCode: agency, pgaLineNumber: formatted });
  }

  return results;
}

/**
 * Validate OI (Commercial Line Description) placement.
 * Rule: Exactly one OI record per HTS line item; must precede PG01 records.
 */
export function validateOiPlacement(records: PgaRecordInput[]): PgaValidationResult {
  const errors: string[] = [];
  const oiIndices = records
    .map((r, idx) => (r.recordType === "OI" ? idx : -1))
    .filter((idx) => idx !== -1);

  if (oiIndices.length === 0) {
    errors.push("Missing mandatory OI (Commercial Line Item Description) record.");
  } else if (oiIndices.length > 1) {
    errors.push("Only one OI record is allowed per HTS entry line.");
  } else {
    const firstPg01Index = records.findIndex((r) => r.recordType === "PG01");
    if (firstPg01Index !== -1 && oiIndices[0] > firstPg01Index) {
      errors.push("OI record must precede all PG01 records.");
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate Disclaimer code rules in PG01.
 * Codes: A (not regulated), B (data not required), C (filed other means), D (filed paper),
 * E (FWS only), F (FDA Entry Type 21 only), G (APHIS Lacey de minimis only).
 */
export function validatePg01Disclaimer(disclaimerCode: string, agencyCode?: string): PgaValidationResult {
  const errors: string[] = [];
  const validCodes = ["A", "B", "C", "D", "E", "F", "G"];
  if (!validCodes.includes(disclaimerCode)) {
    errors.push(`Invalid Disclaimer code '${disclaimerCode}'. Must be one of A, B, C, D, E, F, G.`);
    return { valid: false, errors };
  }

  if (disclaimerCode === "E" && agencyCode && agencyCode !== "FWS") {
    errors.push("Disclaimer code E is only allowed for U.S. Fish and Wildlife Service (FWS).");
  }
  if (disclaimerCode === "F" && agencyCode && agencyCode !== "FDA") {
    errors.push("Disclaimer code F is only allowed for Food and Drug Administration (FDA).");
  }
  if (disclaimerCode === "G" && agencyCode && agencyCode !== "APH") {
    errors.push("Disclaimer code G is only allowed for USDA APHIS Lacey Act.");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate PG02 Product vs Component rules.
 */
export function validatePg02Hierarchy(pg02Records: PgaRecordInput[]): PgaValidationResult {
  const errors: string[] = [];
  const productRecords = pg02Records.filter((r) => r.itemType === "P");

  if (productRecords.length > 1) {
    errors.push("Only one PG02 'P' (Product) record is allowed per PGA line number.");
  }

  for (const r of pg02Records) {
    if (r.itemType !== "P" && r.itemType !== "C") {
      errors.push(`Invalid PG02 itemType '${r.itemType}'. Must be 'P' (Product) or 'C' (Component).`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate PG26 Packaging Level hierarchy rules.
 * Packaging Qualifiers 1 to 6 (1=outermost, 6=innermost).
 */
export function validatePg26Packaging(pg26Records: PgaRecordInput[]): PgaValidationResult {
  const errors: string[] = [];
  if (pg26Records.length > 6) {
    errors.push("A maximum of 6 packaging level PG26 records are allowed.");
  }

  let lastLevel = 0;
  for (let i = 0; i < pg26Records.length; i++) {
    const level = parseInt(pg26Records[i].packagingQualifier, 10);
    if (isNaN(level) || level < 1 || level > 6) {
      errors.push(`Invalid Packaging Qualifier '${pg26Records[i].packagingQualifier}'. Must be between 1 (outermost) and 6 (innermost).`);
    }
    if (i > 0 && level <= lastLevel) {
      errors.push("PG26 packaging levels must be reported sequentially from outermost (1) to innermost.");
    }
    lastLevel = level;
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate PG50/PG51 Grouping structure.
 */
export function validateGroupingStructure(records: PgaRecordInput[]): PgaValidationResult {
  const errors: string[] = [];
  let inGroup = false;
  let currentGroupParent = "";
  const allowedParents = ["PG02", "PG04", "PG13", "PG14"];
  const allowedChildren = ["PG05", "PG06", "PG07", "PG10", "PG14", "PG19", "PG22", "PG25", "PG26", "PG29", "PG31", "PG32"];

  let lastRecordType = "";
  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    if (rec.recordType === "PG50") {
      if (inGroup) {
        errors.push("Nested PG50 groupings are not allowed.");
      }
      if (!allowedParents.includes(lastRecordType)) {
        errors.push(`PG50 grouping parent '${lastRecordType}' is invalid. Allowed parents: PG02, PG04, PG13, PG14.`);
      }
      inGroup = true;
      currentGroupParent = lastRecordType;
    } else if (rec.recordType === "PG51") {
      if (!inGroup) {
        errors.push("PG51 end-of-grouping without preceding PG50 start-of-grouping.");
      }
      inGroup = false;
      currentGroupParent = "";
    } else if (inGroup) {
      if (!allowedChildren.includes(rec.recordType)) {
        errors.push(`Record '${rec.recordType}' is not allowed inside a PG50/PG51 group.`);
      }
    }
    if (rec.recordType !== "PG50" && rec.recordType !== "PG51") {
      lastRecordType = rec.recordType;
    }
  }

  if (inGroup) {
    errors.push("Unclosed PG50 grouping missing corresponding PG51.");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate PG60 Additional Reference qualifier attachment rules.
 */
export function validatePg60Qualifier(qualifier: string, parentRecordType: string): PgaValidationResult {
  const errors: string[] = [];
  const qualifierMap: Record<string, string[]> = {
    TBN: ["PG07"],
    PMN: ["PG07"],
    AD1: ["PG19"],
    ENA: ["PG19"],
    CP1: ["PG19"],
    CP2: ["PG19"],
    CP3: ["PG19"],
    CP4: ["PG19"],
    LAT: ["PG19"],
    LON: ["PG19"],
    AD2: ["PG20"],
    AD3: ["PG20"],
    AD4: ["PG20"],
    AD5: ["PG20"],
    ECI: ["PG20"],
    TEL: ["PG21"],
    EMA: ["PG21"],
    INA: ["PG21"],
    CIT: ["PG19", "PG20", "PG21"],
  };

  const validParents = qualifierMap[qualifier];
  if (!validParents) {
    errors.push(`Invalid PG60 Additional Reference qualifier code '${qualifier}'.`);
  } else if (!validParents.includes(parentRecordType)) {
    errors.push(`PG60 qualifier '${qualifier}' is not valid after parent record '${parentRecordType}'. Allowed parents: ${validParents.join(", ")}.`);
  }

  return { valid: errors.length === 0, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// VITEST BUSINESS RULES TEST SUITE
// ─────────────────────────────────────────────────────────────────────────────

describe("PGA Message Set Generic Business Rules — Unit Verification", () => {
  describe("Rule 1: PGA Line Numbering & Restart Logic", () => {
    it("increments line number for same agency and restarts at 001 for new agency", () => {
      const agencies = ["EPA", "EPA", "EPA", "FSI", "FDA"];
      const lines = computePgaLineNumbers(agencies);
      expect(lines).toEqual([
        { agencyCode: "EPA", pgaLineNumber: "001" },
        { agencyCode: "EPA", pgaLineNumber: "002" },
        { agencyCode: "EPA", pgaLineNumber: "003" },
        { agencyCode: "FSI", pgaLineNumber: "001" },
        { agencyCode: "FDA", pgaLineNumber: "001" },
      ]);
    });
  });

  describe("Rule 2: OI Commercial Description Placement", () => {
    it("passes when exactly one OI record precedes PG01", () => {
      const records = [{ recordType: "OI" }, { recordType: "PG01" }, { recordType: "PG02" }];
      const res = validateOiPlacement(records);
      expect(res.valid).toBe(true);
      expect(res.errors).toHaveLength(0);
    });

    it("fails when OI record is missing", () => {
      const records = [{ recordType: "PG01" }];
      const res = validateOiPlacement(records);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("Missing mandatory OI");
    });

    it("fails when multiple OI records are submitted for a single HTS line", () => {
      const records = [{ recordType: "OI" }, { recordType: "OI" }, { recordType: "PG01" }];
      const res = validateOiPlacement(records);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("Only one OI record is allowed");
    });

    it("fails when OI appears after PG01", () => {
      const records = [{ recordType: "PG01" }, { recordType: "OI" }];
      const res = validateOiPlacement(records);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("OI record must precede");
    });
  });

  describe("Rule 3: PG01 Disclaimer Codes & Agency Guidance Constraints", () => {
    it("accepts generic disclaimer codes A, B, C, D for any agency", () => {
      expect(validatePg01Disclaimer("A", "EPA").valid).toBe(true);
      expect(validatePg01Disclaimer("B", "FDA").valid).toBe(true);
      expect(validatePg01Disclaimer("C", "FWS").valid).toBe(true);
      expect(validatePg01Disclaimer("D", "APH").valid).toBe(true);
    });

    it("enforces agency restrictions on disclaimers E, F, and G", () => {
      expect(validatePg01Disclaimer("E", "FWS").valid).toBe(true);
      expect(validatePg01Disclaimer("E", "EPA").valid).toBe(false);

      expect(validatePg01Disclaimer("F", "FDA").valid).toBe(true);
      expect(validatePg01Disclaimer("F", "FWS").valid).toBe(false);

      expect(validatePg01Disclaimer("G", "APH").valid).toBe(true);
      expect(validatePg01Disclaimer("G", "FDA").valid).toBe(false);
    });
  });

  describe("Rule 4: PG02 Product vs Component Level Data", () => {
    it("passes with one Product ('P') and multiple Components ('C')", () => {
      const pg02s = [
        { recordType: "PG02", itemType: "P" },
        { recordType: "PG02", itemType: "C" },
        { recordType: "PG02", itemType: "C" },
      ];
      const res = validatePg02Hierarchy(pg02s);
      expect(res.valid).toBe(true);
    });

    it("fails if multiple Product ('P') records are submitted for a single PGA line", () => {
      const pg02s = [
        { recordType: "PG02", itemType: "P" },
        { recordType: "PG02", itemType: "P" },
      ];
      const res = validatePg02Hierarchy(pg02s);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("Only one PG02 'P' (Product) record is allowed");
    });
  });

  describe("Rule 5: PG26 Packaging Level Breakdown", () => {
    it("validates sequential packaging level qualifiers from 1 to 6", () => {
      const pg26s = [
        { recordType: "PG26", packagingQualifier: "1" },
        { recordType: "PG26", packagingQualifier: "2" },
        { recordType: "PG26", packagingQualifier: "3" },
      ];
      expect(validatePg26Packaging(pg26s).valid).toBe(true);
    });

    it("rejects non-sequential or out-of-order packaging qualifiers", () => {
      const pg26s = [
        { recordType: "PG26", packagingQualifier: "2" },
        { recordType: "PG26", packagingQualifier: "1" },
      ];
      const res = validatePg26Packaging(pg26s);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("must be reported sequentially");
    });
  });

  describe("Rule 6: PG50 / PG51 Grouping Parent-Child Constraints", () => {
    it("allows valid grouping under parent PG14 with allowed child records", () => {
      const records = [
        { recordType: "PG13" },
        { recordType: "PG14" },
        { recordType: "PG50" },
        { recordType: "PG10" },
        { recordType: "PG19" },
        { recordType: "PG26" },
        { recordType: "PG51" },
      ];
      const res = validateGroupingStructure(records);
      expect(res.valid).toBe(true);
    });

    it("rejects unclosed PG50 groupings", () => {
      const records = [{ recordType: "PG14" }, { recordType: "PG50" }, { recordType: "PG10" }];
      const res = validateGroupingStructure(records);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("Unclosed PG50 grouping");
    });

    it("rejects nested PG50 groupings", () => {
      const records = [
        { recordType: "PG14" },
        { recordType: "PG50" },
        { recordType: "PG10" },
        { recordType: "PG50" },
        { recordType: "PG51" },
        { recordType: "PG51" },
      ];
      const res = validateGroupingStructure(records);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("Nested PG50 groupings are not allowed");
    });
  });

  describe("Rule 7: PG60 Overflow Qualifier Attachment Rules", () => {
    it("validates qualifier attachment to designated parent record types", () => {
      expect(validatePg60Qualifier("TBN", "PG07").valid).toBe(true);
      expect(validatePg60Qualifier("TBN", "PG19").valid).toBe(false);

      expect(validatePg60Qualifier("AD1", "PG19").valid).toBe(true);
      expect(validatePg60Qualifier("AD2", "PG20").valid).toBe(true);
      expect(validatePg60Qualifier("TEL", "PG21").valid).toBe(true);
      expect(validatePg60Qualifier("CIT", "PG20").valid).toBe(true);
    });
  });

  describe("Rule 8: Implied Decimal Precision & Scaling Verifications", () => {
    it("formats and parses PG04 Constituent Quantity (12N, 2 implied decimals)", () => {
      const formatted = formatImpliedDecimal(1250.75, 12, 2);
      expect(formatted).toBe("000000125075");
      expect(parseImpliedDecimal(formatted, 2)).toBe(1250.75);
    });

    it("formats and parses PG04 Constituent Percent (7N, 4 implied decimals)", () => {
      expect(formatImpliedDecimal(100.0, 7, 4)).toBe("1000000");
      expect(formatImpliedDecimal(9.0, 7, 4)).toBe("0090000");
      expect(formatImpliedDecimal(0.0009, 7, 4)).toBe("0000009");
      expect(parseImpliedDecimal("0000009", 4)).toBe(0.0009);
    });

    it("formats and parses PG14 LPCO Quantity (16N, 4 implied decimals)", () => {
      const formatted = formatImpliedDecimal(50.1234, 16, 4);
      expect(formatted).toBe("0000000000501234");
      expect(parseImpliedDecimal(formatted, 4)).toBe(50.1234);
    });

    it("formats and parses PG25 PGA Line Value (12N, 0 implied decimals - whole dollars)", () => {
      const formatted = formatImpliedDecimal(75000, 12, 0);
      expect(formatted).toBe("000000075000");
      expect(parseImpliedDecimal(formatted, 0)).toBe(75000);
    });

    it("formats and parses PG25 PGA Unit Value (12N, 2 implied decimals)", () => {
      const formatted = formatImpliedDecimal(49.99, 12, 2);
      expect(formatted).toBe("000000004999");
      expect(parseImpliedDecimal(formatted, 2)).toBe(49.99);
    });
  });
});
