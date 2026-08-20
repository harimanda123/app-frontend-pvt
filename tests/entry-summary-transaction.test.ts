import { describe, it, expect } from "vitest";
import { Decimal } from "@/lib/tariff/decimal";
import { buildEntryNumber } from "@/lib/abi/entryNumber";
import { assembleTransaction } from "@/lib/abi/entrySummary/assembleTransaction";
import type { EntrySummaryTransactionInput, LineItemInput } from "@/lib/abi/entrySummary/types";

function headerControl() {
  return {
    summaryFilingActionRequestCode: "A" as const,
    entryFilerCode: "N01",
    entryNumber: buildEntryNumber("N01", "5000003"),
    districtPortOfEntry: "2704",
    entryTypeCode: "01",
  };
}

function lineItem(id: string, htsNumbers: string[]): LineItemInput {
  return {
    header: { lineItemIdentifier: id, countryOfOriginCode: "CN" },
    tariffDetails: htsNumbers.map((hts) => ({
      htsNumber: hts,
      dutyAmount: new Decimal("100.00"),
      valueOfGoodsAmount: new Decimal("1000"),
      unitOfMeasureCode1: "NO",
    })),
  };
}

function assertAll80Chars(records: string[]) {
  records.forEach((r, i) => expect(r, `record ${i}`).toHaveLength(80));
}

describe("assembleTransaction — single line, single tariff detail", () => {
  const input: EntrySummaryTransactionInput = {
    headerControl: headerControl(),
    lineItems: [lineItem("001", ["8481805090"])],
  };

  it("emits 10, 40, 50 in order", () => {
    const records = assembleTransaction(input);
    assertAll80Chars(records);
    expect(records.map((r) => r.slice(0, 2))).toEqual(["10", "40", "50"]);
  });

  it("does not emit an 11-Record when headerContent is omitted", () => {
    const records = assembleTransaction(input);
    expect(records.some((r) => r.slice(0, 2) === "11")).toBe(false);
  });
});

describe("assembleTransaction — multi-line, multi-tariff nesting", () => {
  const input: EntrySummaryTransactionInput = {
    headerControl: headerControl(),
    headerContent: { importerOfRecordNumber: "123456789012" },
    lineItems: [lineItem("001", ["8481805090", "8481806000"]), lineItem("002", ["9018903000"])],
  };

  it("emits 10, 11, then each line's 40 immediately followed by its 50s", () => {
    const records = assembleTransaction(input);
    assertAll80Chars(records);
    expect(records.map((r) => r.slice(0, 2))).toEqual(["10", "11", "40", "50", "50", "40", "50"]);
  });

  it("each line item's 40-Record carries its own line identifier", () => {
    const records = assembleTransaction(input);
    const fortyRecords = records.filter((r) => r.slice(0, 2) === "40");
    expect(fortyRecords[0].slice(4, 7)).toBe("001");
    expect(fortyRecords[1].slice(4, 7)).toBe("002");
  });

  it("each 50-Record carries the correct line's HTS numbers in order", () => {
    const records = assembleTransaction(input);
    const fiftyRecords = records.filter((r) => r.slice(0, 2) === "50");
    expect(fiftyRecords.map((r) => r.slice(2, 12))).toEqual(["8481805090", "8481806000", "9018903000"]);
  });
});

describe("assembleTransaction — fee totals and grand totals", () => {
  const base: EntrySummaryTransactionInput = {
    headerControl: headerControl(),
    lineItems: [lineItem("001", ["8481805090"])],
  };

  it("omits 89/90-Records entirely when neither is provided", () => {
    const records = assembleTransaction(base);
    expect(records.some((r) => r.slice(0, 2) === "89")).toBe(false);
    expect(records.some((r) => r.slice(0, 2) === "90")).toBe(false);
  });

  it("emits an 89-Record for fee totals and a 90-Record for grand totals, after the line items", () => {
    const input: EntrySummaryTransactionInput = {
      ...base,
      feeTotals: [{ accountingClassCode: "499", totalFeeAmount: new Decimal("31.67") }],
      grandTotals: { grandTotalDutyAmount: new Decimal("100.00") },
    };
    const records = assembleTransaction(input);
    assertAll80Chars(records);
    expect(records.map((r) => r.slice(0, 2))).toEqual(["10", "40", "50", "89", "90"]);
  });

  it("chunks more than 5 fee entries across multiple 89-Records", () => {
    const sevenFees = Array.from({ length: 7 }, (_, i) => ({
      accountingClassCode: String(100 + i),
      totalFeeAmount: new Decimal("1.00"),
    }));
    const records = assembleTransaction({ ...base, feeTotals: sevenFees });
    const feeRecords = records.filter((r) => r.slice(0, 2) === "89");
    expect(feeRecords).toHaveLength(2);
    expect(feeRecords[0].slice(2, 5)).toBe("100");
    expect(feeRecords[1].slice(2, 5)).toBe("105");
  });

  it("throws when fee entries would exceed the spec's 9-record limit", () => {
    const tooManyFees = Array.from({ length: 46 }, (_, i) => ({
      accountingClassCode: String(100 + i).padStart(3, "0"),
      totalFeeAmount: new Decimal("1.00"),
    }));
    expect(() => assembleTransaction({ ...base, feeTotals: tooManyFees })).toThrow();
  });
});
