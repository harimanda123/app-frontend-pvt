import type { Decimal } from "@/lib/tariff/decimal";

// Types for the CATAIR Entry Summary Query (ESQ) chapter — input J0/J1/J2
// records and output records JA/JB through JI (the records the Output Record
// Structure Map marks "M" — mandatory/always-present in a real response).
// Source: docs/plans/catair-source-docs/03-entry-summary-query-2026-05-v26.pdf
//
// Deferred (not modeled this slice): output JJ-JN (5 records — protest, bill,
// and collection detail — all conditional ("C") in the Structure Map, only
// returned when specifically requested via the J2-Record's Collection/Bill
// Information Code), the reused Entry Summary Details Grouping (output 10-
// through 90-Records) and the 4A-Record that precedes each 40 in it — tied to
// a future "Entry Summary Create/Update output parsing" slice.

/** Always present (J0's only real field); the record's presence in a query is
 * itself the signal — omit the whole record if detail isn't wanted. */
export interface DetailReturnRequestInput {
  returnDetailRequestIndicator: "Y";
}

/** One Entry Filer Code + Entry Number pair to query. */
export interface EntryReference {
  entryFilerCode: string;
  /** 8-char (7-digit transaction number + check digit, Appendix E) — see `@/lib/abi/entryNumber`. */
  entryNumber: string;
}

/** Flat shape matching the J1-Record's 5 fixed field-pair positions. */
export interface EntryNumberQueryRequestInput {
  entryFilerCode1: string;
  entryNumber1: string;
  entryFilerCode2?: string;
  entryNumber2?: string;
  entryFilerCode3?: string;
  entryNumber3?: string;
  entryFilerCode4?: string;
  entryNumber4?: string;
  entryFilerCode5?: string;
  entryNumber5?: string;
}

export type CriteriaQueryTypeCode = "AII" | "DOC" | "RCN" | "PSC" | "LIQ" | "NLQ" | "EES";

/** Collection/Bill Information Code (J2-Record Note 5) — controls which of the
 * deferred JK/JL/JM/JN detail records get returned; kept as an input field even
 * though we don't decode those outputs yet, since the filer still needs to
 * request or suppress them. */
export type CollectionBillInformationCode = "1" | "2" | "3" | "4" | "5" | "6";

export interface CriteriaQueryRequestInput {
  criteriaQueryTypeCode: CriteriaQueryTypeCode;
  requestedFromDateTime: Date;
  requestedToDateTime: Date;
  entrySummariesFlag?: "Y";
  ftaReconSummariesFlag?: "Y";
  otherReconSummariesFlag?: "Y";
  drawbackSummariesFlag?: "Y";
  dutyDeferralSummariesFlag?: "Y";
  collectionBillInformationCode?: CollectionBillInformationCode;
}

// ── Output records ──────────────────────────────────────────────────────────

export interface CriteriaQueryResponseHeader {
  criteriaQueryTypeCode: string;
  requestedFromDateTime?: Date;
  requestedToDateTime?: Date;
}

export type LiquidationStatusCode = "1" | "2" | "3";

export interface EntrySummaryStatusInfo {
  entryFilerCode: string;
  entryNumber: string;
  /** Raw 5-char version number (major revision 1-3, minor 4-5) — see the same
   * convention as `E1Record.versionNumber` in the Create/Update chapter. */
  versionNumber: string;
  acceptDateTime?: Date;
  pscIndicator?: string;
  pscAcceptDate?: Date;
  ownershipDataReturnedIndicator?: string;
  liquidationStatusCode?: LiquidationStatusCode;
  liquidationDate?: Date;
  centerId: string;
}

export interface QueryReturnedCondition {
  conditionCode: string;
  reasonCode?: string;
  narrativeText: string;
  entryFilerCode?: string;
  entryNumber?: string;
  districtPortOfEntry?: string;
}

/** JC-Record: entry summary control/status codes and key dates. Status/reason
 * code fields are kept as raw strings (not literal unions) — see the source
 * PDF's own field-by-field code tables for the full valid-value lists. */
export interface EntrySummaryStatusDetail {
  entrySummaryControlStatus: string;
  entrySummaryStatusCode: string;
  entrySummaryStatusDate?: Date;
  lateFilingStatusCode: string;
  releaseStatusCode?: string;
  releaseDate?: Date;
  collectionStatusCode: string;
  collectionDate?: Date;
  extensionSuspensionDate?: Date;
  extensionSuspensionNoticeDate?: Date;
  censusHeaderStatusCode: string;
  invoiceStatusCode?: string;
  protestStatusCode: string;
  quotaStatusCode?: string;
  tradeAgreementReconciliationFilerCode?: string;
  tradeAgreementReconciliationEntryNumber?: string;
  otherReconciliationFilerCode?: string;
  otherReconciliationEntryNumber?: string;
  /** Liquidation extension/suspension reason codes — see `LIQUIDATION_EXTENSION_SUSPENSION_CODES`. */
  extensionSuspensionStatusCode1?: string;
  extensionSuspensionStatusCode2?: string;
  extensionSuspensionStatusCode3?: string;
  extensionSuspensionStatusCode4?: string;
}

/** JD-Record: liquidation amounts and reason. Amounts can be negative (a
 * different, non-zero-padded wire encoding — see `signedImpliedDecimalField`
 * in recordSpecs.ts) for refund-type entry summaries. */
export interface LiquidationInfo {
  cbpReviewIndicator: string;
  entryDate?: Date;
  liquidatedDuty?: Decimal;
  liquidatedTax?: Decimal;
  liquidatedFees?: Decimal;
  liquidatedInterest?: Decimal;
  liquidatedAdCvd?: Decimal;
  /** See `LIQUIDATION_REASON_CODES`. */
  liquidationReasonCode1?: string;
  liquidationReasonCode2?: string;
  liquidationReasonCode3?: string;
  immediateDeliveryIndicator: string;
}

/** JE-Record: estimated (pre-liquidation) revenue amounts — same signed-amount
 * wire encoding as JD. */
export interface EstimatedRevenueInfo {
  estimatedDuty?: Decimal;
  estimatedTax?: Decimal;
  estimatedFees?: Decimal;
  estimatedInterest?: Decimal;
  estimatedAdCvd?: Decimal;
}

/** JF-Record: importer, entry type, filing dates, and port. */
export interface EntrySummaryFilingInfo {
  importerOfRecordNumber?: string;
  entryTypeCode?: string;
  rejectDate?: Date;
  acceleratedDrawbackIndicator?: string;
  electronicInvoiceIndicator?: string;
  districtPortOfEntry: string;
  entrySummaryFilingDate?: Date;
}

/** JG-Record: warehouse withdrawal, team, center, and line count. */
export interface WarehouseAndLineInfo {
  numberOfWithdrawals?: number;
  warehouseFinalWithdrawalIndicator?: string;
  importSpecialistTeam?: string;
  centerId?: string;
  numberOfLineItems?: number;
}

/** JH-Record: CBP Form 4811 reference, preliminary statement date, broker reference. */
export interface FormReferenceInfo {
  cbpForm4811ReferenceNumber?: string;
  preliminaryStatementPrintDate?: Date;
  brokerReferenceNumber?: string;
}

/** JI-Record: one bond/surety reference. Repeats (whole-record, up to 20) when
 * multiple bonds apply — see the Output Record Structure Map. */
export interface BondSuretyInfo {
  suretyCode?: string;
  primarySuretyIndicator?: string;
  bondTypeCode?: string;
  bondDesignationTypeCode?: string;
  multipleBondsIndicator?: string;
  bondNumber?: string;
  singleEntryBondAmount?: Decimal;
  /** Whole US dollars — no implied decimals. */
  suretyLiabilityAmount?: Decimal;
}
