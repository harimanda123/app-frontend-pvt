// Types for the CATAIR ACE Cargo Manifest/In-bond/Entry Status Query chapter
// (04b) — the 6 records forming one complete "query an entry, get its status
// back" round trip. Request messages use Application Identifier "CQ"
// (WR1-Input); response messages use "C1" (WR0, WO10, WO60, WR1-Output, WR2).
// Source: docs/plans/catair-source-docs/04b-cargo-manifest-bond-entry-status-query-v21.pdf
//
// Deferred (not modeled this slice): WO20, WO30, WO40, WO42, WO50, WO70,
// WO71, WO72, WR3, WR4, WR5, WS4, WS5, WSA, WSB, WSC, WSD, WN0, WN1 — 20
// further conditional/mode-specific output records outside this slice's scope.

/**
 * WR1-Record (Input): Cargo Manifest Query Request. Per the record's own
 * Note 1, only one type of query may be initiated per WR1 record: entry
 * (`entryFilerCode` + `entryNumber`), in-bond (`inBondNumber` alone), an
 * ocean/rail/truck bill (`issuerCode` + `billNumber`, i.e. SCAC + Master
 * Bill Number), or an air waybill (`airWaybillNumber`, optionally +
 * `houseAirWaybillNumber`). The WR1-Record (Input) may be repeated to submit
 * multiple queries in one transmission.
 */
export interface CargoManifestQueryRequestInput {
  entryFilerCode?: string;
  /** 8-char Appendix E entry number (7-digit transaction number + check
   * digit) — see `@/lib/abi/entryNumber`. Wire-encoded right-justified in a
   * 9-char field per the record's own field note ("The number must be right
   * justified"). */
  entryNumber?: string;
  /** The in-bond ("IT") number. Left-justified on the wire per the field note. */
  inBondNumber?: string;
  /** SCAC of the bill of lading issuer (ocean/rail/truck), or the air
   * carrier code (2-3 char) when querying an in-bond by air. */
  issuerCode?: string;
  /** Left-justified on the wire per the field note. */
  billNumber?: string;
  airWaybillNumber?: string;
  houseAirWaybillNumber?: string;
  /** "Y" to also return related House/Master Bills when querying an ocean
   * bill by Issuer Code + Bill Number. */
  requestRelatedBol?: "Y";
  /** "Y" to also return bill-of-lading status for any master/house bills or
   * in-bond numbers found on the queried entry. */
  requestBillAndEntryData?: "Y";
  /** Limits the number of notifications returned in the query response. */
  limitOutputOption?: "1" | "2";
}

/**
 * WR0-Record (Output): Entry Query Error. Conditional — returned only when
 * the original query involved an entry filer + entry number and CBP could
 * not process it.
 */
export interface CargoManifestQueryErrorOutput {
  entryFilerCode: string;
  entryNumber: string;
  /** See the CQ Query Error Appendix (record Note 1) for the code list. */
  errorMessageId: string;
  narrativeMessage: string;
}

/**
 * WO10-Record (Output): Entry Status Processing Header. Mandatory header of
 * a successful entry-status query response; mirrors ACE Cargo Release's
 * SO10 Notification Record.
 */
export interface EntryStatusHeaderOutput {
  /** Class N (leading zero significant) — see `numericCodeField`. */
  districtPortOfEntry?: string;
  entryFilerCode: string;
  /** 8-char entry number — plain, unlike the WR-Records' 9-char
   * right-justified variant (no field note here calling for right-justify). */
  entryNumber: string;
  /** Class N (leading zero significant), e.g. "01". */
  entryTypeCode: string;
  /** See the field's own Note 1 for valid formats (IRS/CBP-assigned/SSN). */
  importerOfRecordNumber: string;
  carrierCode?: string;
  vesselName?: string;
  voyageFlightTripNumber?: string;
  estimatedDateOfArrival?: Date;
  splitShipmentReleaseCode?: string;
  /** "P" indicates the response is due to a PGA CA (correction) request. */
  correctionResponseIndicator?: string;
}

/**
 * WO60-Record (Output): Disposition/Status Result. Repeats as often as
 * necessary — one per disposition event on the queried entry.
 */
export interface EntryDispositionResultOutput {
  dispositionActionDate: Date;
  /** Military HHMM, leading zero significant — see `numericCodeField` (same
   * convention as PGA's `requestedOrScheduledTimeOfInspection`). */
  dispositionActionTime: string;
  /** Class AN, not purely numeric — e.g. "1N" is a valid code per the
   * record's own Note 1 table alongside "22", "98", "04" etc. — so kept as a
   * raw string, not run through `numericCodeField`. */
  dispositionActionCode: string;
  narrativeMessage: string;
  /** Only returned if Disposition Action Code is 22 or 98. */
  releaseDate?: Date;
  /** Class N (leading zero significant); only returned if Disposition Action
   * Code is 22 or 98 — see Note 2's code table. */
  releaseOriginCode?: string;
  /** Per the source PDF's own inconsistency (position range stated as 65-67
   * but Length/Class stated as "6AN") — implemented here at positions 65-70
   * per the position-math resolution documented in recordSpecs.ts. */
  documentType?: string;
}

/**
 * WR1-Record (Output): Manifest Processing Results / Conveyance. A
 * completely different field layout from `CargoManifestQueryRequestInput`
 * above despite sharing the same 2-char "WR" + Record Type "1" control
 * identifier — the shared "WR1" name only identifies the record family
 * across the Input/Output split, not a single shared shape. Conditional;
 * returned once per successful query.
 */
export interface ManifestConveyanceResultOutput {
  /** Class N (leading zero significant). */
  districtPortOfEntry?: string;
  entryFilerCode?: string;
  /** 9-char right-justified on the wire, same convention as the WR1-Input's
   * `entryNumber` and WR0's `entryNumber` — see the field's own reused note. */
  entryNumber?: string;
  /** Class N (leading zero significant). */
  entryTypeCode?: string;
  importerOfRecordNumber?: string;
  brokerReferenceNumber?: string;
  carrierCode?: string;
  importingVesselCodeOrConveyanceName?: string;
  voyageFlightTripNumber: string;
  dateOfArrival: Date;
}

/**
 * WR2-Record (Output): Trip Number & FIRMS Cargo Location. Conditional;
 * returned once per successful entry query.
 */
export interface TripFirmsLocationOutput {
  /** MOT Truck trip number. */
  tripNumber: string;
  /** FIRMS code indicating the location of the air cargo. */
  firmsCode: string;
}
