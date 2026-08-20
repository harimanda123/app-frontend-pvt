import {
  dateField,
  dateTimeField,
  filler,
  constantField,
  numericCodeField,
  AbiFixedWidthError,
  type FieldSpec,
  type RecordSpec,
} from "@/lib/abi/fixedWidth";
import { Decimal, roundToCents } from "@/lib/tariff/decimal";
import type {
  DetailReturnRequestInput,
  EntryNumberQueryRequestInput,
  CriteriaQueryRequestInput,
  CriteriaQueryResponseHeader,
  EntrySummaryStatusInfo,
  QueryReturnedCondition,
  EntrySummaryStatusDetail,
  LiquidationInfo,
  EstimatedRevenueInfo,
  EntrySummaryFilingInfo,
  WarehouseAndLineInfo,
  FormReferenceInfo,
  BondSuretyInfo,
} from "./types";

/** A right-justified, zero-padded, unsigned numeric field with `decimals`
 * implied decimal places — same convention as Entry Summary Create/Update's
 * `impliedDecimalField`. */
function impliedDecimalField<K extends string>(
  key: K,
  start: number,
  length: number,
  decimals: number,
  designation: "M" | "C" | "O"
): FieldSpec<K> {
  const scale = new Decimal(10).pow(decimals);
  return {
    key,
    start,
    length,
    class: "SN",
    designation,
    encodeValue: (raw) => {
      const scaled = roundToCents(raw as Decimal).times(scale).toDecimalPlaces(0);
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

/**
 * JD/JE amounts can be negative, per each record's own usage note: "the
 * negative sign (-) will be reported in the adjacent position preceding the
 * value without leading zeros." So a negative value is right-justified,
 * space-padded (not zero-padded), with `-` immediately left of the digits; a
 * non-negative value stays plain zero-padded. CBP's own field table labels
 * this class "AN"/"13AN", but our codec's AN validation (A-Z, 0-9, space only)
 * rejects the literal `-` these fields actually carry — class X (free keyboard
 * text) instead, same posture as Batch & Block's X1 narrativeText for the same
 * reason (a stated class that doesn't cover the field's real character set).
 * Decode is unchanged from the plain unsigned case: `Decimal` parses a leading
 * `-` natively regardless of the padding style.
 */
function signedImpliedDecimalField<K extends string>(
  key: K,
  start: number,
  length: number,
  decimals: number,
  designation: "M" | "C" | "O"
): FieldSpec<K> {
  const scale = new Decimal(10).pow(decimals);
  return {
    key,
    start,
    length,
    class: "X",
    designation,
    encodeValue: (raw) => {
      const scaled = roundToCents(raw as Decimal).times(scale).toDecimalPlaces(0);
      if (scaled.isNegative()) {
        const withSign = "-" + scaled.abs().toString();
        if (withSign.length > length) {
          throw new AbiFixedWidthError(`Signed amount "${withSign}" exceeds field length ${length}.`);
        }
        return withSign.padStart(length, " ");
      }
      return scaled.toString().padStart(length, "0");
    },
    decodeValue: (field) => {
      const trimmed = field.trim();
      if (trimmed.length === 0) return undefined;
      return new Decimal(trimmed).dividedBy(scale);
    },
  };
}

// RecordSpecs for the CATAIR Entry Summary Query (ESQ) chapter — J0/J1/J2 input,
// JA/JB/JZ output. Position math cross-checked against the extracted spec
// tables to sum to exactly 80 per record before writing.
// Source: docs/plans/catair-source-docs/03-entry-summary-query-2026-05-v26.pdf

// ── J0-Record: Detail Return Request (input) ─────────────────────────────────

export const DETAIL_RETURN_REQUEST_SPEC: RecordSpec<DetailReturnRequestInput> = {
  recordType: "J0-Record (Detail Return Request)",
  length: 80,
  fields: [
    constantField(1, "J0"),
    { key: "returnDetailRequestIndicator", start: 3, length: 1, class: "AN", designation: "M" },
    filler(4, 77),
  ],
};

// ── J1-Record: Entry Number Query Request (input) ───────────────────────────
// 5 repeating Entry Filer Code + Entry Number pairs at fixed positions.

export const ENTRY_NUMBER_QUERY_REQUEST_SPEC: RecordSpec<EntryNumberQueryRequestInput> = {
  recordType: "J1-Record (Entry Number Query Request)",
  length: 80,
  fields: [
    constantField(1, "J1"),
    filler(3, 3),
    { key: "entryFilerCode1", start: 6, length: 3, class: "AN", designation: "M" },
    filler(9, 2),
    { key: "entryNumber1", start: 11, length: 8, class: "AN", designation: "M" },
    { key: "entryFilerCode2", start: 19, length: 3, class: "AN", designation: "C" },
    filler(22, 2),
    { key: "entryNumber2", start: 24, length: 8, class: "AN", designation: "C" },
    { key: "entryFilerCode3", start: 32, length: 3, class: "AN", designation: "C" },
    filler(35, 2),
    { key: "entryNumber3", start: 37, length: 8, class: "AN", designation: "C" },
    { key: "entryFilerCode4", start: 45, length: 3, class: "AN", designation: "C" },
    filler(48, 2),
    { key: "entryNumber4", start: 50, length: 8, class: "AN", designation: "C" },
    { key: "entryFilerCode5", start: 58, length: 3, class: "AN", designation: "C" },
    filler(61, 2),
    { key: "entryNumber5", start: 63, length: 8, class: "AN", designation: "C" },
    filler(71, 10),
  ],
};

// ── J2-Record: Entry Summary Criteria Query Request (input) ─────────────────

export const CRITERIA_QUERY_REQUEST_SPEC: RecordSpec<CriteriaQueryRequestInput> = {
  recordType: "J2-Record (Entry Summary Criteria Query Request)",
  length: 80,
  fields: [
    constantField(1, "J2"),
    filler(3, 1),
    { key: "criteriaQueryTypeCode", start: 4, length: 3, class: "AN", designation: "M" },
    filler(7, 1),
    dateTimeField("requestedFromDateTime", 8, "M"),
    dateTimeField("requestedToDateTime", 22, "M"),
    filler(36, 1),
    { key: "entrySummariesFlag", start: 37, length: 1, class: "AN", designation: "O" },
    { key: "ftaReconSummariesFlag", start: 38, length: 1, class: "AN", designation: "O" },
    { key: "otherReconSummariesFlag", start: 39, length: 1, class: "AN", designation: "O" },
    { key: "drawbackSummariesFlag", start: 40, length: 1, class: "AN", designation: "O" },
    { key: "dutyDeferralSummariesFlag", start: 41, length: 1, class: "AN", designation: "O" },
    numericCodeField("collectionBillInformationCode", 42, 1, "O"),
    filler(43, 38),
  ],
};

// ── JA-Record: Criteria Query Response Header (output) ──────────────────────

export const CRITERIA_QUERY_RESPONSE_HEADER_SPEC: RecordSpec<CriteriaQueryResponseHeader> = {
  recordType: "JA-Record (Criteria Query Response Header)",
  length: 80,
  fields: [
    constantField(1, "JA"),
    filler(3, 1),
    { key: "criteriaQueryTypeCode", start: 4, length: 3, class: "AN", designation: "M" },
    filler(7, 1),
    dateTimeField("requestedFromDateTime", 8, "M"),
    dateTimeField("requestedToDateTime", 22, "M"),
    filler(36, 45),
  ],
};

// ── JB-Record: Entry Summary Status Information (output, core) ──────────────

export const ENTRY_SUMMARY_STATUS_INFO_SPEC: RecordSpec<EntrySummaryStatusInfo> = {
  recordType: "JB-Record (Entry Summary Status Information)",
  length: 80,
  fields: [
    constantField(1, "JB"),
    { key: "entryFilerCode", start: 3, length: 3, class: "AN", designation: "M" },
    filler(6, 2),
    { key: "entryNumber", start: 8, length: 8, class: "AN", designation: "M" },
    { key: "versionNumber", start: 16, length: 5, class: "AN", designation: "M" },
    dateTimeField("acceptDateTime", 21, "M"),
    { key: "pscIndicator", start: 35, length: 1, class: "AN", designation: "M" },
    dateField("pscAcceptDate", 36, "C"),
    { key: "ownershipDataReturnedIndicator", start: 42, length: 1, class: "AN", designation: "M" },
    { key: "liquidationStatusCode", start: 43, length: 1, class: "AN", designation: "C" },
    dateField("liquidationDate", 44, "C"),
    filler(50, 1),
    { key: "centerId", start: 51, length: 6, class: "AN", designation: "M" },
    filler(57, 24),
  ],
};

// ── JZ-Record: Returned Condition (output) ───────────────────────────────────

export const QUERY_RETURNED_CONDITION_SPEC: RecordSpec<QueryReturnedCondition> = {
  recordType: "JZ-Record (Returned Condition)",
  length: 80,
  fields: [
    constantField(1, "JZ"),
    { key: "conditionCode", start: 3, length: 3, class: "AN", designation: "M" },
    { key: "reasonCode", start: 6, length: 3, class: "AN", designation: "C" },
    { key: "narrativeText", start: 9, length: 40, class: "AN", designation: "M" },
    filler(49, 1),
    { key: "entryFilerCode", start: 50, length: 3, class: "AN", designation: "C" },
    filler(53, 2),
    { key: "entryNumber", start: 55, length: 8, class: "AN", designation: "C" },
    filler(63, 2),
    { key: "districtPortOfEntry", start: 65, length: 4, class: "AN", designation: "M" },
    filler(69, 12),
  ],
};

// ── JC-Record: Entry Summary Status Information (output) ────────────────────

export const ENTRY_SUMMARY_STATUS_DETAIL_SPEC: RecordSpec<EntrySummaryStatusDetail> = {
  recordType: "JC-Record (Entry Summary Status Information)",
  length: 80,
  fields: [
    constantField(1, "JC"),
    { key: "entrySummaryControlStatus", start: 3, length: 1, class: "AN", designation: "M" },
    { key: "entrySummaryStatusCode", start: 4, length: 1, class: "AN", designation: "M" },
    dateField("entrySummaryStatusDate", 5, "M"),
    { key: "lateFilingStatusCode", start: 11, length: 1, class: "AN", designation: "M" },
    { key: "releaseStatusCode", start: 12, length: 1, class: "AN", designation: "C" },
    dateField("releaseDate", 13, "C"),
    filler(19, 1),
    { key: "collectionStatusCode", start: 20, length: 1, class: "AN", designation: "M" },
    dateField("collectionDate", 21, "C"),
    filler(27, 1),
    dateField("extensionSuspensionDate", 28, "C"),
    dateField("extensionSuspensionNoticeDate", 34, "C"),
    { key: "censusHeaderStatusCode", start: 40, length: 1, class: "AN", designation: "M" },
    { key: "invoiceStatusCode", start: 41, length: 1, class: "AN", designation: "M" },
    { key: "protestStatusCode", start: 42, length: 2, class: "AN", designation: "M" },
    { key: "quotaStatusCode", start: 44, length: 1, class: "AN", designation: "M" },
    { key: "tradeAgreementReconciliationFilerCode", start: 45, length: 3, class: "AN", designation: "C" },
    filler(48, 2),
    { key: "tradeAgreementReconciliationEntryNumber", start: 50, length: 8, class: "AN", designation: "C" },
    { key: "otherReconciliationFilerCode", start: 58, length: 3, class: "AN", designation: "C" },
    filler(61, 2),
    { key: "otherReconciliationEntryNumber", start: 63, length: 8, class: "AN", designation: "C" },
    { key: "extensionSuspensionStatusCode1", start: 71, length: 2, class: "AN", designation: "C" },
    { key: "extensionSuspensionStatusCode2", start: 73, length: 2, class: "AN", designation: "O" },
    { key: "extensionSuspensionStatusCode3", start: 75, length: 2, class: "AN", designation: "O" },
    { key: "extensionSuspensionStatusCode4", start: 77, length: 2, class: "AN", designation: "O" },
    filler(79, 2),
  ],
};

// ── JD-Record: Liquidation Info (output) ─────────────────────────────────────

export const LIQUIDATION_INFO_SPEC: RecordSpec<LiquidationInfo> = {
  recordType: "JD-Record (Liquidation Info)",
  length: 80,
  fields: [
    constantField(1, "JD"),
    { key: "cbpReviewIndicator", start: 3, length: 1, class: "AN", designation: "M" },
    dateField("entryDate", 4, "C"),
    signedImpliedDecimalField("liquidatedDuty", 10, 12, 2, "C"),
    signedImpliedDecimalField("liquidatedTax", 22, 12, 2, "C"),
    signedImpliedDecimalField("liquidatedFees", 34, 12, 2, "C"),
    signedImpliedDecimalField("liquidatedInterest", 46, 12, 2, "C"),
    signedImpliedDecimalField("liquidatedAdCvd", 58, 12, 2, "C"),
    { key: "liquidationReasonCode1", start: 70, length: 2, class: "AN", designation: "C" },
    { key: "liquidationReasonCode2", start: 72, length: 2, class: "AN", designation: "C" },
    { key: "liquidationReasonCode3", start: 74, length: 2, class: "AN", designation: "C" },
    { key: "immediateDeliveryIndicator", start: 76, length: 1, class: "AN", designation: "M" },
    filler(77, 4),
  ],
};

// ── JE-Record: Estimated Revenue Info (output) ───────────────────────────────

export const ESTIMATED_REVENUE_INFO_SPEC: RecordSpec<EstimatedRevenueInfo> = {
  recordType: "JE-Record (Estimated Revenue Info)",
  length: 80,
  fields: [
    constantField(1, "JE"),
    signedImpliedDecimalField("estimatedDuty", 3, 13, 2, "C"),
    signedImpliedDecimalField("estimatedTax", 16, 13, 2, "C"),
    signedImpliedDecimalField("estimatedFees", 29, 13, 2, "C"),
    signedImpliedDecimalField("estimatedInterest", 42, 13, 2, "C"),
    signedImpliedDecimalField("estimatedAdCvd", 55, 13, 2, "C"),
    filler(68, 13),
  ],
};

// ── JF-Record: Entry Summary Filing Info (output) ────────────────────────────

export const ENTRY_SUMMARY_FILING_INFO_SPEC: RecordSpec<EntrySummaryFilingInfo> = {
  recordType: "JF-Record (Entry Summary Filing Info)",
  length: 80,
  fields: [
    constantField(1, "JF"),
    { key: "importerOfRecordNumber", start: 3, length: 12, class: "X", designation: "C" },
    numericCodeField("entryTypeCode", 15, 2, "C"),
    dateField("rejectDate", 17, "C"),
    numericCodeField("acceleratedDrawbackIndicator", 23, 1, "C"),
    { key: "electronicInvoiceIndicator", start: 24, length: 1, class: "A", designation: "C" },
    { key: "districtPortOfEntry", start: 25, length: 4, class: "AN", designation: "M" },
    dateField("entrySummaryFilingDate", 29, "C"),
    filler(35, 46),
  ],
};

// ── JG-Record: Warehouse and Line Info (output) ──────────────────────────────

export const WAREHOUSE_AND_LINE_INFO_SPEC: RecordSpec<WarehouseAndLineInfo> = {
  recordType: "JG-Record (Warehouse and Line Info)",
  length: 80,
  fields: [
    constantField(1, "JG"),
    { key: "numberOfWithdrawals", start: 3, length: 3, class: "N", designation: "C" },
    { key: "warehouseFinalWithdrawalIndicator", start: 6, length: 1, class: "A", designation: "C" },
    { key: "importSpecialistTeam", start: 7, length: 3, class: "AN", designation: "C" },
    { key: "centerId", start: 10, length: 6, class: "AN", designation: "C" },
    { key: "numberOfLineItems", start: 16, length: 3, class: "N", designation: "C" },
    filler(19, 62),
  ],
};

// ── JH-Record: Form Reference Info (output) ──────────────────────────────────

export const FORM_REFERENCE_INFO_SPEC: RecordSpec<FormReferenceInfo> = {
  recordType: "JH-Record (Form Reference Info)",
  length: 80,
  fields: [
    constantField(1, "JH"),
    { key: "cbpForm4811ReferenceNumber", start: 3, length: 12, class: "X", designation: "C" },
    dateField("preliminaryStatementPrintDate", 15, "C"),
    { key: "brokerReferenceNumber", start: 21, length: 9, class: "X", designation: "C" },
    filler(30, 51),
  ],
};

// ── JI-Record: Bond and Surety Info (output) ─────────────────────────────────

export const BOND_SURETY_INFO_SPEC: RecordSpec<BondSuretyInfo> = {
  recordType: "JI-Record (Bond and Surety Info)",
  length: 80,
  fields: [
    constantField(1, "JI"),
    numericCodeField("suretyCode", 3, 3, "C"),
    { key: "primarySuretyIndicator", start: 6, length: 1, class: "AN", designation: "C" },
    numericCodeField("bondTypeCode", 7, 1, "C"),
    { key: "bondDesignationTypeCode", start: 8, length: 1, class: "AN", designation: "C" },
    { key: "multipleBondsIndicator", start: 9, length: 1, class: "AN", designation: "C" },
    { key: "bondNumber", start: 10, length: 9, class: "AN", designation: "C" },
    impliedDecimalField("singleEntryBondAmount", 19, 15, 2, "C"),
    wholeDollarField("suretyLiabilityAmount", 34, 10, "C"),
    filler(44, 37),
  ],
};
