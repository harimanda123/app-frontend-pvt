import {
  dateField,
  filler,
  constantField,
  conditionReferencePrefix,
  numericCodeField,
  type FieldSpec,
  type RecordSpec,
} from "@/lib/abi/fixedWidth";
import { Decimal } from "@/lib/tariff/decimal";
import type {
  HeaderControlInput,
  HeaderContentInput,
  LineItemHeaderInput,
  TariffDetailInput,
  FeeTotalInput,
  GrandTotalsInput,
  E0SummaryReference,
  E0OtherReference,
  E1Record,
  BondDetailInput,
  FtzStatusInput,
  FtzPrivilegedStatusDetailInput,
  AdcvdCaseDetailInput,
  AdcvdDutyTotalsInput,
} from "./types";

// RecordSpecs for the CATAIR Entry Summary Create/Update (AE) input records —
// core MVP subset (10, 11, 40, 50, 89, 90) plus the AD/CVD, Bond, and FTZ
// records (31, 41, SE61, 53, 88).
// Source: docs/plans/catair-source-docs/02-entry-summary-create-update-2026-07.pdf

/** A right-justified, zero-padded numeric field with `decimals` implied decimal
 * places on the wire (e.g. Duty Amount: 2 implied decimals, $1,234.56 -> "0000123456"
 * for a 10-char field). Bound to `Decimal`, never a float.
 *
 * Rounds directly to the field's own `decimals` count rather than pre-rounding
 * through `roundToCents` (harmless when every caller passes `decimals: 2`, but
 * would silently truncate a genuinely 4-implied-decimal field — e.g. the
 * 53-Record's AD/CVD Quantity — down to 2 decimals before scaling). Same fix
 * as the Drawback chapter's own `impliedDecimalField` applied for the same
 * reason; see its comment for the full rationale.
 *
 * `cls` defaults to "SN" (money/rate fields, per this chapter's existing
 * convention) but the 41-Record's FTZ Line Item Quantity is documented as
 * plain class "N" (not "(S)N") in the source PDF, so it's a caller-supplied
 * override rather than a hardcoded assumption.
 */
function impliedDecimalField<K extends string>(
  key: K,
  start: number,
  length: number,
  decimals: number,
  designation: "M" | "C" | "O",
  cls: "SN" | "N" = "SN"
): FieldSpec<K> {
  const scale = new Decimal(10).pow(decimals);
  return {
    key,
    start,
    length,
    class: cls,
    designation,
    encodeValue: (raw) => {
      const scaled = (raw as Decimal).times(scale).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
      return scaled.toString().padStart(length, "0");
    },
    decodeValue: (field) => {
      const trimmed = field.trim();
      if (trimmed.length === 0) return undefined;
      return new Decimal(trimmed).dividedBy(scale);
    },
  };
}

/** A whole-dollar (no implied decimals) numeric amount field. */
function wholeDollarField<K extends string>(
  key: K,
  start: number,
  length: number,
  designation: "M" | "C" | "O"
): FieldSpec<K> {
  return impliedDecimalField(key, start, length, 0, designation);
}

// ── 10-Record: Entry Summary Header Control ─────────────────────────────────

export const HEADER_CONTROL_SPEC: RecordSpec<HeaderControlInput> = {
  recordType: "10-Record (Entry Summary Header Control)",
  length: 80,
  fields: [
    constantField(1, "10"),
    { key: "summaryFilingActionRequestCode", start: 3, length: 1, class: "A", designation: "M" },
    { key: "entryFilerCode", start: 4, length: 3, class: "AN", designation: "M" },
    filler(7, 2),
    { key: "entryNumber", start: 9, length: 8, class: "AN", designation: "M" },
    filler(17, 1),
    { key: "districtPortOfEntry", start: 18, length: 4, class: "AN", designation: "M" },
    { key: "brokerReferenceNumber", start: 22, length: 9, class: "X", designation: "C" },
    filler(31, 3),
    { key: "entryTypeCode", start: 34, length: 2, class: "AN", designation: "M" },
    { key: "modeOfTransportationCode", start: 36, length: 2, class: "AN", designation: "C" },
    { key: "bondWaiverIndicator", start: 38, length: 1, class: "AN", designation: "C" },
    { key: "electronicSignature", start: 39, length: 1, class: "AN", designation: "C" },
    { key: "cargoReleaseCertificationRequestIndicator", start: 40, length: 1, class: "AN", designation: "C" },
    { key: "electronicInvoiceIndicator", start: 41, length: 1, class: "AN", designation: "C" },
    { key: "consolidatedSummaryIndicator", start: 42, length: 1, class: "AN", designation: "C" },
    { key: "shipmentUsageTypeCode", start: 43, length: 1, class: "AN", designation: "C" },
    { key: "liveEntryIndicator", start: 44, length: 1, class: "AN", designation: "C" },
    { key: "deferredTaxPaymentCode", start: 45, length: 1, class: "AN", designation: "C" },
    { key: "tradeAgreementReconciliationIndicator", start: 46, length: 1, class: "AN", designation: "C" },
    { key: "reconciliationIssueCode", start: 47, length: 3, class: "AN", designation: "C" },
    filler(50, 1),
    { key: "paymentTypeCode", start: 51, length: 1, class: "AN", designation: "C" },
    dateField("preliminaryStatementPrintDate", 52, "C"),
    { key: "periodicStatementMonth", start: 58, length: 2, class: "AN", designation: "C" },
    { key: "statementClientBranchIdentifier", start: 60, length: 2, class: "AN", designation: "C" },
    { key: "bondWaiverReasonCode", start: 62, length: 3, class: "AN", designation: "C" },
    { key: "postSummaryCorrectionIndicator", start: 65, length: 1, class: "AN", designation: "C" },
    { key: "acceleratedLiquidationRequestIndicator", start: 66, length: 1, class: "AN", designation: "C" },
    { key: "knownImporterIndicator", start: 67, length: 1, class: "AN", designation: "O" },
    { key: "pgaDataIncludedIndicator", start: 68, length: 1, class: "AN", designation: "C" },
    { key: "tibDeclarationIndicator", start: 69, length: 1, class: "AN", designation: "C" },
    { key: "consolidatedExpressInformalIndicator", start: 70, length: 1, class: "AN", designation: "C" },
    filler(71, 10),
  ],
};

// ── 11-Record: Entry Summary Header Content ─────────────────────────────────

export const HEADER_CONTENT_SPEC: RecordSpec<HeaderContentInput> = {
  recordType: "11-Record (Entry Summary Header Content)",
  length: 80,
  fields: [
    constantField(1, "11"),
    { key: "importerOfRecordNumber", start: 3, length: 12, class: "X", designation: "M" },
    { key: "consigneeNumber", start: 15, length: 12, class: "X", designation: "C" },
    { key: "designatedNotifyPartyNumber", start: 27, length: 12, class: "X", designation: "C" },
    filler(39, 3),
    dateField("estimatedEntryDate", 42, "C"),
    dateField("dateOfImportation", 48, "C"),
    filler(54, 7),
    { key: "usStateOfDestinationCode", start: 61, length: 2, class: "AN", designation: "C" },
    { key: "foreignTradeZoneIdentifier", start: 63, length: 9, class: "AN", designation: "C" },
    filler(72, 9),
  ],
};

// ── 40-Record: Line Item Header ─────────────────────────────────────────────

export const LINE_ITEM_HEADER_SPEC: RecordSpec<LineItemHeaderInput> = {
  recordType: "40-Record (Line Item Header)",
  length: 80,
  fields: [
    constantField(1, "40"),
    filler(3, 2),
    { key: "lineItemIdentifier", start: 5, length: 3, class: "X", designation: "M" },
    { key: "articleSetIndicator", start: 8, length: 1, class: "AN", designation: "C" },
    { key: "countryOfOriginCode", start: 9, length: 2, class: "X", designation: "M" },
    { key: "countryOfExportCode", start: 11, length: 2, class: "AN", designation: "C" },
    dateField("dateOfExportation", 13, "C"),
    dateField("dateOfExportationForTextiles", 19, "C"),
    { key: "tradeAgreementSpecialProgramClaimCode", start: 25, length: 2, class: "AN", designation: "C" },
    wholeDollarField("chargesAmount", 27, 10, "C"),
    { key: "foreignPortOfLadingCode", start: 37, length: 5, class: "AN", designation: "C" },
    wholeDollarField("grossShippingWeight", 42, 10, "C"),
    numericCodeField("categoryCodeForTextiles", 52, 3, "C"),
    { key: "productClaimCode", start: 55, length: 1, class: "AN", designation: "C" },
    { key: "relatedPartyIndicator", start: 56, length: 1, class: "AN", designation: "C" },
    { key: "naftaNetCostIndicator", start: 57, length: 1, class: "AN", designation: "C" },
    { key: "feeExemptionCode", start: 58, length: 1, class: "AN", designation: "C" },
    filler(59, 1),
    { key: "adCaseNonReimbursementStatement", start: 60, length: 1, class: "AN", designation: "C" },
    filler(61, 20),
  ],
};

// ── 50-Record: Tariff/Value/Quantity Detail ─────────────────────────────────

export const TARIFF_DETAIL_SPEC: RecordSpec<TariffDetailInput> = {
  recordType: "50-Record (Tariff/Value/Quantity Detail)",
  length: 80,
  fields: [
    constantField(1, "50"),
    { key: "htsNumber", start: 3, length: 10, class: "AN", designation: "M" },
    filler(13, 1),
    impliedDecimalField("dutyAmount", 14, 10, 2, "M"),
    filler(24, 1),
    wholeDollarField("valueOfGoodsAmount", 25, 10, "M"),
    filler(35, 1),
    impliedDecimalField("quantity1", 36, 12, 2, "C"),
    { key: "unitOfMeasureCode1", start: 48, length: 3, class: "AN", designation: "M" },
    impliedDecimalField("quantity2", 51, 12, 2, "C"),
    { key: "unitOfMeasureCode2", start: 63, length: 3, class: "AN", designation: "C" },
    impliedDecimalField("quantity3", 66, 12, 2, "C"),
    { key: "unitOfMeasureCode3", start: 78, length: 3, class: "AN", designation: "C" },
  ],
};

// ── 89-Record: Fee Total Detail ──────────────────────────────────────────────
// 5 repeating Accounting Class Code + Total Fee Amount pairs at fixed positions
// (not a loop construct in fixedWidth.ts — just more FieldSpec entries).

export const FEE_TOTAL_SPEC: RecordSpec<FeeTotalInput> = {
  recordType: "89-Record (Fee Total Detail)",
  length: 80,
  fields: [
    constantField(1, "89"),
    numericCodeField("accountingClassCode1", 3, 3, "M"),
    impliedDecimalField("totalFeeAmount1", 6, 11, 2, "M"),
    numericCodeField("accountingClassCode2", 17, 3, "C"),
    impliedDecimalField("totalFeeAmount2", 20, 11, 2, "C"),
    numericCodeField("accountingClassCode3", 31, 3, "C"),
    impliedDecimalField("totalFeeAmount3", 34, 11, 2, "C"),
    numericCodeField("accountingClassCode4", 45, 3, "C"),
    impliedDecimalField("totalFeeAmount4", 48, 11, 2, "C"),
    numericCodeField("accountingClassCode5", 59, 3, "C"),
    impliedDecimalField("totalFeeAmount5", 62, 11, 2, "C"),
    filler(73, 8),
  ],
};

// ── 90-Record: Grand Totals ──────────────────────────────────────────────────

export const GRAND_TOTALS_SPEC: RecordSpec<GrandTotalsInput> = {
  recordType: "90-Record (Grand Totals)",
  length: 80,
  fields: [
    constantField(1, "90"),
    impliedDecimalField("grandTotalDutyAmount", 3, 11, 2, "C"),
    filler(14, 1),
    impliedDecimalField("grandTotalUserFeeAmount", 15, 11, 2, "C"),
    filler(26, 1),
    impliedDecimalField("grandTotalIrTaxAmount", 27, 11, 2, "C"),
    filler(38, 1),
    impliedDecimalField("grandTotalAdDutyAmount", 39, 11, 2, "C"),
    filler(50, 1),
    impliedDecimalField("grandTotalCvDutyAmount", 51, 11, 2, "C"),
    filler(62, 1),
    impliedDecimalField("grandTotalOtherRevenueAmount", 63, 11, 2, "C"),
    filler(74, 7),
  ],
};

// ── 31-Record: Bond Detail ───────────────────────────────────────────────────

export const BOND_DETAIL_SPEC: RecordSpec<BondDetailInput> = {
  recordType: "31-Record (Bond Detail)",
  length: 80,
  fields: [
    constantField(1, "31"),
    { key: "bondTypeCode", start: 3, length: 1, class: "AN", designation: "M" },
    { key: "bondDesignationTypeCode", start: 4, length: 1, class: "AN", designation: "M" },
    { key: "continuousBondIndicator", start: 5, length: 1, class: "AN", designation: "C" },
    { key: "suretyCompanyCode", start: 6, length: 3, class: "AN", designation: "M" },
    wholeDollarField("singleTransactionBondAmount", 9, 10, "C"),
    { key: "singleTransactionBondProducerAccountNumber", start: 19, length: 10, class: "AN", designation: "O" },
    filler(29, 52),
  ],
};

// ── 41-Record: FTZ Status Information ────────────────────────────────────────

export const FTZ_STATUS_SPEC: RecordSpec<FtzStatusInput> = {
  recordType: "41-Record (FTZ Status Information)",
  length: 80,
  fields: [
    constantField(1, "41"),
    { key: "ftzMerchandiseStatusCode", start: 3, length: 1, class: "AN", designation: "M" },
    dateField("privilegedFtzMerchandiseFilingDate", 4, "C"),
    impliedDecimalField("ftzLineItemQuantity", 10, 10, 0, "M", "N"),
    filler(20, 61),
  ],
};

// ── SE61-Record: FTZ Privileged Foreign Status Additional Detail ────────────
// Unlike this chapter's 2-char-code detail records, SE61's own control
// identifier is a single 4-char literal — `constantField` already supports an
// arbitrary-length literal, so this needs no new helper, just a 4-char value.

export const FTZ_PRIVILEGED_STATUS_DETAIL_SPEC: RecordSpec<FtzPrivilegedStatusDetailInput> = {
  recordType: "SE61-Record (FTZ Privileged Foreign Status Additional Detail)",
  length: 80,
  fields: [
    constantField(1, "SE61"),
    { key: "currentHtsNumber", start: 5, length: 10, class: "AN", designation: "M" },
    filler(15, 66),
  ],
};

// ── 53-Record: AD/CVD Case Detail ────────────────────────────────────────────
// Three distinct implied-decimal conventions in one record: Case Deposit Rate
// (2 decimals), AD/CVD Value of Goods Amount (0 — whole dollars), AD/CVD
// Quantity (4 decimals), AD/CVD Duty Amount (2 decimals) — each applied per
// field below, not a blanket record-level assumption.

export const ADCVD_CASE_DETAIL_SPEC: RecordSpec<AdcvdCaseDetailInput> = {
  recordType: "53-Record (AD/CVD Case Detail)",
  length: 80,
  fields: [
    constantField(1, "53"),
    { key: "caseNumber", start: 3, length: 10, class: "AN", designation: "M" },
    { key: "bondCashClaimCode", start: 13, length: 1, class: "AN", designation: "M" },
    impliedDecimalField("caseDepositRate", 14, 8, 2, "M"),
    { key: "caseRateTypeQualifierCode", start: 22, length: 1, class: "AN", designation: "M" },
    filler(23, 2),
    wholeDollarField("valueOfGoodsAmount", 25, 10, "C"),
    impliedDecimalField("quantity", 35, 12, 4, "C"),
    impliedDecimalField("dutyAmount", 47, 10, 2, "M"),
    { key: "nonReimbursementDeclarationIdentifier", start: 57, length: 10, class: "AN", designation: "C" },
    filler(67, 14),
  ],
};

// ── 88-Record: AD/CVD Duty Totals ────────────────────────────────────────────

export const ADCVD_DUTY_TOTALS_SPEC: RecordSpec<AdcvdDutyTotalsInput> = {
  recordType: "88-Record (AD/CVD Duty Totals)",
  length: 80,
  fields: [
    constantField(1, "88"),
    impliedDecimalField("totalBondedAdDutyAmount", 3, 11, 2, "C"),
    filler(14, 1),
    impliedDecimalField("totalCashDepositAdDutyAmount", 15, 11, 2, "C"),
    filler(26, 1),
    impliedDecimalField("totalBondedCvDutyAmount", 27, 11, 2, "C"),
    filler(38, 1),
    impliedDecimalField("totalCashDepositCvDutyAmount", 39, 11, 2, "C"),
    filler(50, 31),
  ],
};

// ── E0-Record: Entry Summary Condition Reference (output) ───────────────────
// Positions 1-25 (control id, reference data type code, occurrence position,
// "REF ID:" literal) are the chapter-agnostic conditionReferencePrefix shared
// with Batch & Block Control's X0-Record.

export const E0_SUMMARY_SPEC: RecordSpec<E0SummaryReference> = {
  recordType: "E0-Record (Entry Summary Condition Reference — SUMMRY)",
  length: 80,
  fields: [
    ...conditionReferencePrefix("E0"),
    { key: "entryFilerCode", start: 26, length: 3, class: "AN", designation: "C" },
    filler(29, 1),
    { key: "entryNumber", start: 30, length: 8, class: "AN", designation: "C" },
    filler(38, 1),
    { key: "brokerReferenceNumber", start: 39, length: 12, class: "X", designation: "C" },
    filler(51, 1),
    { key: "cbpTeamNumber", start: 52, length: 3, class: "AN", designation: "C" },
    filler(55, 26),
  ],
};

export const E0_GENERIC_SPEC: RecordSpec<E0OtherReference> = {
  recordType: "E0-Record (Entry Summary Condition Reference — generic)",
  length: 80,
  fields: [
    ...conditionReferencePrefix("E0"),
    { key: "referenceDataText", start: 26, length: 55, class: "X", designation: "M" },
  ],
};

// ── E1-Record: Entry Summary Condition/Disposition Response (output) ────────

/** Preserves the raw 5-char string (major revision 1-3, minor 4-5) rather than
 * parsing it as a single number, since the two parts are independently meaningful. */
function versionNumberField<K extends string>(key: K, start: number): FieldSpec<K> {
  return {
    key,
    start,
    length: 5,
    class: "SN",
    designation: "C",
    decodeValue: (field) => (field.trim().length === 0 ? undefined : field),
  };
}

export const E1_SPEC: RecordSpec<Omit<E1Record, "isFinalDisposition">> = {
  recordType: "E1-Record (Entry Summary Condition/Disposition Response)",
  length: 80,
  fields: [
    constantField(1, "E1"),
    { key: "dispositionTypeCode", start: 3, length: 1, class: "AN", designation: "M" },
    { key: "severityCode", start: 4, length: 1, class: "AN", designation: "M" },
    { key: "conditionCode", start: 5, length: 3, class: "AN", designation: "M" },
    { key: "reasonCode", start: 8, length: 3, class: "AN", designation: "C" },
    { key: "narrativeText", start: 11, length: 40, class: "AN", designation: "M" },
    { key: "entryFilerCode", start: 51, length: 3, class: "AN", designation: "C" },
    filler(54, 2),
    { key: "entryNumber", start: 56, length: 8, class: "AN", designation: "C" },
    versionNumberField("versionNumber", 64),
    { key: "brokerReferenceNumber", start: 69, length: 9, class: "X", designation: "C" },
    filler(78, 3),
  ],
};
