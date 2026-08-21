// Types for the CATAIR ACE Broker Download chapter (Chapter 9 / BD & NS
// Applications) — the 10 core mandatory backbone OUTPUT records. Unlike every
// other chapter modeled so far, Broker Download is output-only: CBP pushes
// this data to ABI filers (there is no filer-submitted input side), so
// Qubere's real usage is decoding what CBP sends, not encoding it.
// Source: docs/plans/catair-source-docs/09-broker-download-draft.pdf (August
// 2024 DRAFT)
//
// Deferred (not modeled this slice): 11 conditional/optional/mode-specific/
// overflow records — 2M, 1A, 2B, 4B, 2N, 3N, 4N, 1I, 2I, 2C, 0D (BD
// Application Grouping). See tests/abi-broker-download-specs.test.ts's
// DEFERRED_RECORDS registry for page citations and per-record deferral
// rationale (that registry still lists all 17 originally-deferred records —
// it's a standalone audit fixture, not re-synced here — but 1V, 2V, 3V,
// NS40, NS50, NS60 are now modeled below per
// tests/abi-broker-download-extended.test.ts, pages 43-45 and 49-51).
//
// No `Decimal`-bound fields exist in this slice: every quantity/weight field
// the source PDF documents (1B's Manifest Quantity & Weight, 1D's Piece
// Count, NS30's Quantity) is explicitly a whole number with no implied
// decimal scaling ("Gross weight in whole numbers, no decimals" — 1B Weight
// note) — plain `number`, not `Decimal`. Don't add implied-decimal scaling
// here; nothing in the source PDF or test fixtures calls for it.

/** 1M-Record: Manifest Header. One per manifest; carrier, mode, conveyance,
 * and trip identification. */
export interface ManifestHeaderRecord {
  /** SCAC of the importing carrier. */
  carrierCode: string;
  /** 10=Vessel Non-Cont, 11=Vessel Cont, 20=Rail Non-Cont, 21=Rail Cont,
   * 30=Land Non-Cont. Kept as the raw zero-padded string (not `number`) since
   * it's an identifier code, not a count. */
  transportationIndicator: string;
  /** Mandatory in Ocean/Rail; not used in Truck. */
  countryCode?: string;
  /** Trip number in Truck mode ("SYSTEM" if preliminary and unknown). */
  conveyanceName?: string;
  /** Rail: Julian date YYDDD; Ocean: voyage number — class "5X" (alphanumeric),
   * not a date field, since it holds either format depending on mode. Kept as
   * a plain string, never bound to `Date`. */
  tripData?: string;
  /** Rail and Ocean only; defaults to "000001" — an identifier/sequence
   * value, not a count, so kept as a zero-padded string. */
  manifestSequenceNumber?: string;
  /** IMO code (Ocean). */
  vesselCode?: string;
  /** P=Preliminary, Y=Amendment, T=In-transit, W=Complete. */
  manifestTypeCode: "P" | "Y" | "T" | "W";
}

/** 1P-Record: Port of Crossing. */
export interface PortOfCrossingRecord {
  /** Schedule D port code — leading zero significant. */
  portOfUnlading: string;
  /** MMDDYY. Per the source PDF this field is labeled class "N", but it uses
   * the same 6-char MMDDYY wire format as every other chapter's class-D date
   * field, so it's bound to `Date` via the shared `dateField` helper (see
   * recordSpecs.ts) rather than treated as a new format. */
  originalScheduledArrivalDate?: Date;
  /** Rail only. */
  firmsCode?: string;
  /** HHMM (Rail & Truck) — kept as a raw string, not a full date/time. */
  time?: string;
}

/** 1J-Record: Issuer Code. */
export interface IssuerCodeRecord {
  /** SCAC of the party issuing the master bill / SCN. */
  issuerCode: string;
}

/** 1B-Record: Bill of Lading Transaction. */
export interface BillOfLadingTransactionRecord {
  /** Master bill number / SCN. */
  billOfLading: string;
  /** Schedule K code — leading zero significant. */
  foreignPortOfLading: string;
  /** Rail/Ocean required; whole number (not truncated by implied decimals) —
   * not returned in Truck. */
  manifestQuantity?: number;
  manifestUnits?: string;
  /** Gross weight in whole numbers, no decimals (per the source PDF's own
   * field note) — plain `number`, not `Decimal`. */
  weight?: number;
  /** LB, KG, LT, ST, ET, MT. */
  weightUnit?: string;
  /** Bill type: 0, 2-9, B, I, J, K, M, N, O, P, R, S, T, U — class X since the
   * value set mixes digits and letters. */
  billStatusIndicator?: string;
  /** "0"/space = Not MIB, "1" = MIB (Rail/Ocean). */
  masterInBondIndicator?: string;
  /** Truck & Ocean house bill. */
  houseBillNumber?: string;
  /** 61, 62, 63, 69, 70 — identifier code, kept as a zero-padded string. */
  inBondEntryType?: string;
  /** Schedule D port code — leading zero significant. */
  inBondPortOfDestination: string;
  /** SCAC of the house bill issuer. */
  issuerCode?: string;
}

/** 0N-Record: Entity Name. Note: the source PDF's own Filler field label
 * reads "78AN" (positions 64-80), but 64 to 80 inclusive is 17 characters —
 * a documented typo in CBP's source document, not a bug here. The filler is
 * modeled at its correct 17-char width. */
export interface EntityNameRecord {
  /** BN, C1, CB, CD, CN, IM, N1, N2, OO, PF, SF, SH, UC, SNP. */
  entityIdCode?: string;
  name?: string;
  /** 2=SCAC, 17=ABI Routing Code. */
  codeQualifier?: string;
  /** SCAC/FIRMS or ABI routing code. */
  idCode?: string;
  /** Reserved for future use. */
  entityRelationshipCode?: string;
  /** Reserved for future use. */
  entityIdCodeReserved?: string;
}

/** 1C-Record: Bill of Lading Container. */
export interface BillOfLadingContainerRecord {
  /** Equipment prefix. */
  equipmentInitial?: string;
  /** Equipment serial number ("No number" in Truck if unknown). */
  equipmentNumber: string;
  sealNumber1?: string;
  sealNumber2?: string;
  /** See Ocean Appendix B ("NC" if none). */
  containerDescriptionCode?: string;
  /** FFFII (feet + inches) composite code (Ocean only) — an identifier-style
   * packed value, not a plain integer, kept as a zero-padded string. */
  containerLength?: string;
  /** FFFFFFII format (Ocean only) — class X per the source PDF. */
  height?: string;
  /** FFFFFFII format (Ocean only) — class X per the source PDF. */
  width?: string;
  /** Ocean Appendix M (Ocean only). */
  containerType?: string;
  /** E/L for Rail/Ocean; C/I/A/B for Truck. */
  loadEmptyStatus?: string;
  /** BB, CS, CY, HH, HL, HP, MD, NC, PH, PP, RR (Ocean only). */
  typeOfService?: string;
}

/** 1D-Record: Bill Cargo Description. */
export interface BillCargoDescriptionRecord {
  /** Smallest exterior package units — whole number, not `Decimal`. */
  pieceCount?: number;
  description: string;
  /** CBP C4 line release number (Rail & Truck). */
  c4Number?: string;
  /** Manifest unit of measure. */
  manifestUnitCode?: string;
  /** ISO country code of origin (Rail & Truck). */
  countryCode?: string;
}

/** 2D-Record: Marks and Numbers. */
export interface MarksAndNumbersRecord {
  /** "No Marks or Numbers" if none exist (Rail and Ocean convention). */
  marksAndNumbers?: string;
}

/** NS05-Record: Status Notification Header — Conveyance Information. Wire
 * control identifier is the bare 2-char "05" (not "NS05" — the "NS" prefix
 * distinguishes this chapter's Application Identifier grouping from "BD", it
 * isn't literally present in the record's own first two bytes). */
export interface StatusNotificationHeaderRecord {
  importingConveyanceName?: string;
  /** Rail: Julian date YYDDD; Ocean: voyage number — class "5X", kept as a
   * plain string, same rationale as 1M's `tripData`. */
  tripNumber?: string;
  /** Schedule D port code — leading zero significant. */
  port?: string;
  /** YYMMDD — note the year-month-day field order, distinct from every other
   * chapter's MMDDYY convention. See `dateFieldYYMMDD` in fixedWidth.ts. */
  estimatedArrivalDate?: Date;
  /** HHMMSS (Rail only) — leading zero significant, kept as a raw
   * zero-padded string rather than a lossy numeric parse. */
  estimatedArrivalTime?: string;
}

/** NS30-Record: Status Notification Detail. Wire control identifier is the
 * bare 2-char "30" (see `StatusNotificationHeaderRecord`'s note on "NS"). */
export interface StatusNotificationDetailRecord {
  /** Posting action disposition code. */
  dispositionCode: string;
  /** SCAC — mandatory for Ocean. */
  issuerCodeMasterBill?: string;
  /** Master bill / SCN. */
  masterBillNumber: string;
  /** SCAC (Truck & Ocean). */
  issuerCodeHouseBill?: string;
  houseBillNumber?: string;
  /** Reserved space fill. */
  issuerCodeSubHouseBill?: string;
  /** Reserved space fill. */
  subHouseBillNumber?: string;
  /** Total piece count affected — whole number, not `Decimal`. */
  quantity: number;
  /** "N" for negative quantity, else space. */
  negativeIndicator?: string;
  /** YYMMDD — see `StatusNotificationHeaderRecord.estimatedArrivalDate`. */
  actionDate: Date;
  /** HHMM military format — leading zero significant, kept as a raw
   * zero-padded string. */
  actionTime: string;
  /** SCAC or IATA code. */
  inBondCarrierCode: string;
}

/** 1V-Record: Hazardous Material Detail. Conditional; may repeat up to ten
 * times. Rail/Ocean/Truck (per-field usage varies — see individual notes). */
export interface HazardousMaterialDetailRecord {
  /** UN/identification number assigned to the hazardous material. Rail,
   * Ocean and Truck. Class X per the source PDF (not AN) — kept as a plain
   * string. */
  hazardousMaterialCode: string;
  /** IMDG hazardous class/division code. Ocean only. */
  hazardousMaterialClass?: string;
  /** Code describing the hazardous material class. Rail and Ocean only. */
  hazardousMaterialCodeQualifier?: string;
  /** Proper shipping name of the hazardous material. Rail and Ocean only. */
  hazardousMaterialDescription?: string;
  /** Name and/or phone number of the emergency contact. Rail, Ocean and
   * Truck. */
  hazardousMaterialContact?: string;
  /** IMDG code page number where the hazardous material identification
   * appears. Ocean only. */
  unHazardousMaterialPage?: string;
}

/** 2V-Record: Additional Hazardous Material Detail (Flashpoint). Conditional;
 * Rail and Ocean only. */
export interface AdditionalHazardousMaterialDetailRecord {
  /** Lowest temperature at which the hazardous combustible liquid's vapor
   * ignites in air. A genuine measured quantity (paired with
   * `negativeIndicator` for sign), not an identifier — plain `number`, not
   * zero-pad-preserving. */
  flashpointTemperature?: number;
  /** Unit of measure for the flashpoint temperature — "CE" (Centigrade/
   * Celsius) is the only documented value. */
  unitOfMeasureCode?: string;
  /** "N" when the flashpoint temperature is negative (below 0 C), else
   * space. */
  negativeIndicator?: string;
}

/** 3V-Record: Hazardous Material Classification Detail. Conditional; may
 * repeat up to 99 times. Rail and Ocean only. */
export interface HazardousMaterialClassificationDetailRecord {
  /** Material name, special instructions and/or phone number. */
  hazardousMaterialDescription?: string;
  /** Free-form hazardous material classification/division/label
   * requirements. Ocean only. */
  hazardousMaterialClassification?: string;
}

/** NS40-Record: Status Notification Continuation. Wire control identifier is
 * the bare 2-char "40" (see `StatusNotificationHeaderRecord`'s note on the
 * "NS" Application Identifier grouping). Conditional; follows the associated
 * NS30 record when present. */
export interface StatusNotificationContinuationRecord {
  /** Entry category code (ACE Ocean Appendix B). Identifier with
   * leading-zero significance, not a quantity. */
  entryType?: string;
  /** CBP entry number, form number, or regulatory provision. */
  entryNumber?: string;
  /** Schedule D port code where the action occurred; always "9900" for
   * disposition code 1W status notifications. */
  portOfTransaction: string;
  /** FIRMS code for the location of the goods. */
  firmsCode?: string;
  /** Container/equipment number associated with the bill of lading. */
  containerNumber?: string;
}

/** NS50-Record: Status Notification Remarks. Wire control identifier is the
 * bare 2-char "50". Conditional; at most two per NS30 record. */
export interface StatusNotificationRemarksRecord {
  /** Free-text reason a hold is placed; may contain hold quantities or other
   * information. */
  remarks: string;
}

/** NS60-Record: Status Notification Container Detail. Wire control
 * identifier is the bare 2-char "60". Conditional; up to 999 per NS30
 * record. */
export interface StatusNotificationContainerDetailRecord {
  /** "1" indicates the NS30 disposition action was taken specifically
   * against this container; blank indicates it was not a container-level
   * action. Identifier-style flag, not a quantity. */
  actionIndicator?: string;
  /** Container/equipment number. */
  containerNumber?: string;
  /** Exporter/carrier seal number. */
  sealNumber1?: string;
  /** Exporter/carrier seal number. */
  sealNumber2?: string;
}
