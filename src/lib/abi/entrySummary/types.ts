import type { Decimal } from "@/lib/tariff/decimal";

// Types for the CATAIR Entry Summary Create/Update (AE) input records — the
// core MVP subset (10, 11, 40, 50, 89, 90). See docs/plans/catair-source-docs/
// 02-entry-summary-create-update-2026-07.pdf, pages ESF-26 through ESF-131.

export interface HeaderControlInput {
  /** "A"/"R" = Add or entirely Replace, "D" = Delete. */
  summaryFilingActionRequestCode: "A" | "R" | "D";
  entryFilerCode: string;
  /** 7-digit transaction number + check digit (Appendix E). Use `buildEntryNumber()` from
   * `@/lib/abi/entryNumber` to compute it — `buildHeaderControl` rejects a wrong check digit. */
  entryNumber: string;
  districtPortOfEntry: string;
  brokerReferenceNumber?: string;
  entryTypeCode: string;
  modeOfTransportationCode?: string;
  /** "0" = bond waived/no bond required (spec note: use "0", not the conventional "Y"). */
  bondWaiverIndicator?: "0";
  /** "X" = Filer's Electronic Signature — mandatory when action is A or R. */
  electronicSignature?: "X";
  cargoReleaseCertificationRequestIndicator?: "A";
  electronicInvoiceIndicator?: "Y";
  consolidatedSummaryIndicator?: "Y";
  shipmentUsageTypeCode?: "P" | "X";
  liveEntryIndicator?: "Y";
  deferredTaxPaymentCode?: "1" | "2";
  tradeAgreementReconciliationIndicator?: "Y";
  reconciliationIssueCode?: string;
  paymentTypeCode?: string;
  preliminaryStatementPrintDate?: Date;
  periodicStatementMonth?: string;
  statementClientBranchIdentifier?: string;
  bondWaiverReasonCode?: string;
  postSummaryCorrectionIndicator?: "Y";
  acceleratedLiquidationRequestIndicator?: "Y";
  knownImporterIndicator?: "Y";
  /** "Y" = expedited release, "F" = weekly FTZ. */
  pgaDataIncludedIndicator?: "Y" | "F";
  tibDeclarationIndicator?: "Y";
  consolidatedExpressInformalIndicator?: "Y";
}

export interface HeaderContentInput {
  importerOfRecordNumber: string;
  consigneeNumber?: string;
  designatedNotifyPartyNumber?: string;
  estimatedEntryDate?: Date;
  dateOfImportation?: Date;
  usStateOfDestinationCode?: string;
  /** Format NNNXXXXXX — see 11-Record Note 3. */
  foreignTradeZoneIdentifier?: string;
}

export interface LineItemHeaderInput {
  /** Unique within the summary; must not be "*". */
  lineItemIdentifier: string;
  /** "X" = header of an article set, "V" = component of one. */
  articleSetIndicator?: "X" | "V";
  /** ISO country code, or "**" if unknown. */
  countryOfOriginCode: string;
  countryOfExportCode?: string;
  dateOfExportation?: Date;
  dateOfExportationForTextiles?: Date;
  tradeAgreementSpecialProgramClaimCode?: string;
  chargesAmount?: Decimal;
  foreignPortOfLadingCode?: string;
  grossShippingWeight?: Decimal;
  categoryCodeForTextiles?: string;
  productClaimCode?: string;
  relatedPartyIndicator?: "Y" | "N";
  naftaNetCostIndicator?: "Y";
  feeExemptionCode?: "1" | "2";
  adCaseNonReimbursementStatement?: "Y";
}

export interface TariffDetailInput {
  /** Full 10-digit HTS classification unless a legitimate 8-digit-only classification applies. */
  htsNumber: string;
  /** Implied 2 decimal places on the wire. */
  dutyAmount: Decimal;
  /** Whole U.S. dollars on the wire (no implied decimals). */
  valueOfGoodsAmount: Decimal;
  /** Implied 2 decimal places on the wire. */
  quantity1?: Decimal;
  unitOfMeasureCode1: string;
  quantity2?: Decimal;
  unitOfMeasureCode2?: string;
  quantity3?: Decimal;
  unitOfMeasureCode3?: string;
}

/** One Accounting Class Code + Total Fee Amount pair, as reported on the 89-Record. */
export interface FeeTotalEntry {
  accountingClassCode: string;
  /** Implied 2 decimal places on the wire. */
  totalFeeAmount: Decimal;
}

/** Flat shape matching the 89-Record's 5 fixed field-pair positions. */
export interface FeeTotalInput {
  accountingClassCode1: string;
  totalFeeAmount1: Decimal;
  accountingClassCode2?: string;
  totalFeeAmount2?: Decimal;
  accountingClassCode3?: string;
  totalFeeAmount3?: Decimal;
  accountingClassCode4?: string;
  totalFeeAmount4?: Decimal;
  accountingClassCode5?: string;
  totalFeeAmount5?: Decimal;
}

// ── 31-Record: Bond Detail ───────────────────────────────────────────────────
// Header-level, conditional, reported up to 2 times per summary (the Bond
// Grouping). See docs/plans/catair-source-docs/02-entry-summary-create-update-
// 2026-07.pdf, pages ESF-49 through ESF-50.

export interface BondDetailInput {
  /** "8" = continuous (multiple transaction) bond, "9" = single transaction bond (STB). */
  bondTypeCode: "8" | "9";
  /** "B" = basic, "A" = additional, "U" = substitution STB, "E" = superseding STB. */
  bondDesignationTypeCode: "B" | "A" | "U" | "E";
  /**
   * "Y" = continuous bond supersedes the bond presented at time of entry, "S" =
   * substitution continuous bond replaces it. Space-fill if continuous yet not
   * superseding/substituting, or if STB.
   */
  continuousBondIndicator?: "Y" | "S";
  suretyCompanyCode: string;
  /** Whole U.S. dollars (no implied decimals). Space-fill if continuous bond. */
  singleTransactionBondAmount?: Decimal;
  /**
   * The Surety Reference Number from CBP Form 301, as assigned by the STB's
   * Surety company. Left-justified, trailing spaces. Space-fill if continuous bond.
   */
  singleTransactionBondProducerAccountNumber?: string;
}

// ── 41-Record: FTZ Status Information ────────────────────────────────────────
// Line-item-level, conditional, reported at most once per line item. See PDF
// page ESF-72.

export interface FtzStatusInput {
  /** "P" = Privileged Foreign, "N" = Non-Privileged Foreign, "D" = Domestic. */
  ftzMerchandiseStatusCode: "P" | "N" | "D";
  /**
   * The date the merchandise entered the zone. Only meaningful (and only
   * reported) for Privileged Foreign status — space-filled otherwise.
   */
  privilegedFtzMerchandiseFilingDate?: Date;
  /** Whole units removed from the FTZ and entered into U.S. commerce (no implied decimals). */
  ftzLineItemQuantity: Decimal;
}

// ── SE61-Record: FTZ Privileged Foreign Status Additional Detail ────────────
// Reported only once per Tariff/Value/Quantity Detail (50-Record), only when
// Privileged Foreign status was declared on the preceding 41-Record AND the
// 50-Record's declared HTS is no longer an active HTS number. See PDF page
// ESF-92. (The chapter's other conditional detail records mostly use a 2-char
// control identifier + separate record-type digit; SE61's own identifier is a
// single 4-char literal occupying positions 1-4.)

export interface FtzPrivilegedStatusDetailInput {
  /**
   * The current, full 10-digit HTS classification for Privileged Foreign
   * status merchandise whose originally-declared 50-Record HTS is no longer
   * active. Used only to identify current PGA flagging — not used for duty
   * calculation or entry summary reporting.
   */
  currentHtsNumber: string;
}

// ── 53-Record: AD/CVD Case Detail ────────────────────────────────────────────
// Line-item-level, conditional, up to 2 times per line item. See PDF pages
// ESF-98 through ESF-99. Note the three distinct implied-decimal conventions
// among this record's own numeric fields: Case Deposit Rate (2), AD/CVD Value
// of Goods Amount (0 — whole dollars), AD/CVD Quantity (4), AD/CVD Duty
// Amount (2).

export interface AdcvdCaseDetailInput {
  /** The AD/CVD case number, without hyphens. */
  caseNumber: string;
  /** "B" = surety bond, "C" = cash deposit. */
  bondCashClaimCode: "B" | "C";
  /** Implied 2 decimal places on the wire. */
  caseDepositRate: Decimal;
  /** "A" = ad valorem rate, "S" = specific rate. */
  caseRateTypeQualifierCode: "A" | "S";
  /** Whole U.S. dollars (no implied decimals); used in lieu of the line item value. */
  valueOfGoodsAmount?: Decimal;
  /** Primary unit quantity for specific-rate calculations. Implied 4 decimal places on the wire. */
  quantity?: Decimal;
  /** Estimated duty amount, in U.S. dollars and cents. Implied 2 decimal places on the wire. */
  dutyAmount: Decimal;
  /** Blanket non-reimbursement declaration identifier. */
  nonReimbursementDeclarationIdentifier?: string;
}

// ── 88-Record: AD/CVD Duty Totals ────────────────────────────────────────────
// Totals-level, conditional, reported at most once per summary. See PDF page
// ESF-128. All four amounts carry 2 implied decimal places.

export interface AdcvdDutyTotalsInput {
  totalBondedAdDutyAmount?: Decimal;
  totalCashDepositAdDutyAmount?: Decimal;
  totalBondedCvDutyAmount?: Decimal;
  totalCashDepositCvDutyAmount?: Decimal;
}

export interface GrandTotalsInput {
  grandTotalDutyAmount?: Decimal;
  grandTotalUserFeeAmount?: Decimal;
  grandTotalIrTaxAmount?: Decimal;
  grandTotalAdDutyAmount?: Decimal;
  grandTotalCvDutyAmount?: Decimal;
  grandTotalOtherRevenueAmount?: Decimal;
}

/** One line item: its 40-Record plus 1+ tariff (50-Record) details. */
export interface LineItemInput {
  header: LineItemHeaderInput;
  tariffDetails: TariffDetailInput[];
}

/** One full Entry Summary TRANSACTION grouping: 10(+11), N line items, optional totals. */
export interface EntrySummaryTransactionInput {
  headerControl: HeaderControlInput;
  headerContent?: HeaderContentInput;
  lineItems: LineItemInput[];
  feeTotals?: FeeTotalEntry[];
  grandTotals?: GrandTotalsInput;
}

// ── Output response records (E0/E1) ─────────────────────────────────────────
// The "SUMMRY" Reference Data Type Code is unconditionally returned and its
// Reference Data Text sub-layout (Entry Filer Code/Entry Number/Broker Reference
// Number/CBP Team Number) is decoded. Every other type code (CARMAN, BOLINB,
// BNDDTL, PGA groupings, ...) identifies data on an input record this slice
// hasn't built yet — its Reference Data Text is carried through undecoded rather
// than guessed at.

export interface E0SummaryReference {
  referenceDataTypeCode: "SUMMRY";
  /** Relative sequence of this Entry Summary transaction within the Block Control Grouping. */
  occurrencePosition: number;
  entryFilerCode?: string;
  entryNumber?: string;
  brokerReferenceNumber?: string;
  cbpTeamNumber?: string;
}

export interface E0OtherReference {
  referenceDataTypeCode: string;
  occurrencePosition: number;
  /** Raw 55-char Reference Data Text — sub-layout not modeled for this reference type. */
  referenceDataText: string;
}

export type E0Record = E0SummaryReference | E0OtherReference;

/**
 * Type guard for narrowing E0Record. Plain `referenceDataTypeCode === "SUMMRY"`
 * equality checks don't narrow the union on their own, since E0OtherReference's
 * `referenceDataTypeCode` is a general `string` (an open-ended set of other
 * chapters' type codes), not a finite set of literals TS can discriminate against.
 */
export function isE0SummaryReference(record: E0Record): record is E0SummaryReference {
  return record.referenceDataTypeCode === "SUMMRY";
}

export interface E1Record {
  /** "" = not a final disposition; "A" = final, accepted; "R" = final, rejected. */
  dispositionTypeCode: string;
  /** "F" fatal / "W" Census warning / "P" PGA warning / "I" informational / "" none. */
  severityCode: string;
  conditionCode: string;
  reasonCode?: string;
  narrativeText: string;
  /** Filer's code as reported on the input 10-Record. */
  entryFilerCode?: string;
  entryNumber?: string;
  /**
   * Raw 5-char version number (major revision positions 1-3, minor 4-5), e.g.
   * "00100". Present only on an ACCEPTED final disposition after an Add/Replace —
   * blank on Delete, on Rejected, and on non-final condition records.
   */
  versionNumber?: string;
  brokerReferenceNumber?: string;
  isFinalDisposition: boolean;
}

/** One non-final condition, paired with the E0-Record(s) that identify what caused it. */
export interface EntrySummaryCondition {
  references: E0Record[];
  condition: E1Record;
}

/** The full parsed response for one Entry Summary TRANSACTION Grouping. */
export interface ParsedEntrySummaryResponse {
  scenario: "ACCEPTED" | "REJECTED";
  conditions: EntrySummaryCondition[];
  finalDisposition: E1Record;
}
