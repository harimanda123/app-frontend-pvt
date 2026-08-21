import {
  dateFieldNumericMMDDYY,
  filler,
  constantField,
  numericCodeField,
  type Designation,
  type FieldSpec,
  type RecordSpec,
} from "@/lib/abi/fixedWidth";
import type {
  CargoManifestQueryRequestInput,
  CargoManifestQueryErrorOutput,
  EntryStatusHeaderOutput,
  EntryDispositionResultOutput,
  ManifestConveyanceResultOutput,
  TripFirmsLocationOutput,
} from "./types";

// RecordSpecs for the CATAIR ACE Cargo Manifest/In-bond/Entry Status Query
// chapter (04b) — the 6 records forming one complete "query an entry, get
// its status back" round trip. Position math cross-checked against the
// extracted spec tables (and the source PDF directly for the two documented
// quirks below) to sum to exactly 80 per record before writing.
// Source: docs/plans/catair-source-docs/04b-cargo-manifest-bond-entry-status-query-v21.pdf

/**
 * The WR-Record family's Entry Number field (WR0, WR1-Input, WR1-Output) is
 * 9 chars wide on the wire — one char wider than the 8-char Appendix E entry
 * number (7-digit transaction number + check digit) it carries — and the
 * WR1-Input field's own note explicitly says "The number must be right
 * justified," unlike this codec's default AN encoding (left-justified,
 * space-padded end). So this right-pads at the *start* instead: an 8-char
 * value becomes " 12345678" (leading space + value), and decode trims that
 * leading space back off. Distinct from WO10's plain 8AN Entry Number field
 * (no right-justify note there, and it's already exactly 8 chars wide), which
 * uses a plain field instead.
 */
function rightJustifiedEntryNumberField<K extends string>(
  key: K,
  start: number,
  designation: Designation
): FieldSpec<K> {
  return {
    key,
    start,
    length: 9,
    class: "AN",
    designation,
    encodeValue: (raw) => String(raw).padStart(9, " "),
    decodeValue: (field) => (field.trim().length === 0 ? undefined : field.trimStart()),
  };
}

// ── WR1-Record (Input): Cargo Manifest Query Request ────────────────────────

export const CARGO_MANIFEST_QUERY_REQUEST_SPEC: RecordSpec<CargoManifestQueryRequestInput> = {
  recordType: "WR1-Record (Cargo Manifest Query Request, Input)",
  length: 80,
  fields: [
    constantField(1, "WR"),
    constantField(3, "1"),
    filler(4, 4),
    { key: "entryFilerCode", start: 8, length: 3, class: "AN", designation: "C" },
    rightJustifiedEntryNumberField("entryNumber", 11, "C"),
    { key: "inBondNumber", start: 20, length: 12, class: "AN", designation: "C" },
    { key: "issuerCode", start: 32, length: 4, class: "AN", designation: "C" },
    { key: "billNumber", start: 36, length: 12, class: "AN", designation: "C" },
    { key: "airWaybillNumber", start: 48, length: 11, class: "AN", designation: "C" },
    { key: "houseAirWaybillNumber", start: 59, length: 12, class: "AN", designation: "O" },
    { key: "requestRelatedBol", start: 71, length: 1, class: "AN", designation: "O" },
    { key: "requestBillAndEntryData", start: 72, length: 1, class: "AN", designation: "O" },
    { key: "limitOutputOption", start: 73, length: 1, class: "AN", designation: "O" },
    filler(74, 7),
  ],
};

// ── WR0-Record (Output): Entry Query Error ───────────────────────────────────

export const CARGO_MANIFEST_QUERY_ERROR_SPEC: RecordSpec<CargoManifestQueryErrorOutput> = {
  recordType: "WR0-Record (Entry Query Error, Output)",
  length: 80,
  fields: [
    constantField(1, "WR"),
    constantField(3, "0"),
    { key: "entryFilerCode", start: 4, length: 3, class: "AN", designation: "M" },
    rightJustifiedEntryNumberField("entryNumber", 7, "M"),
    filler(16, 14),
    { key: "errorMessageId", start: 30, length: 3, class: "AN", designation: "M" },
    { key: "narrativeMessage", start: 33, length: 40, class: "X", designation: "M" },
    filler(73, 8),
  ],
};

// ── WO10-Record (Output): Entry Status Processing Header ────────────────────

export const ENTRY_STATUS_HEADER_SPEC: RecordSpec<EntryStatusHeaderOutput> = {
  recordType: "WO10-Record (Entry Status Processing Header, Output)",
  length: 80,
  fields: [
    constantField(1, "WO10"),
    numericCodeField("districtPortOfEntry", 5, 4, "C"),
    { key: "entryFilerCode", start: 9, length: 3, class: "AN", designation: "M" },
    filler(12, 2),
    { key: "entryNumber", start: 14, length: 8, class: "AN", designation: "M" },
    filler(22, 1),
    numericCodeField("entryTypeCode", 23, 2, "M"),
    { key: "importerOfRecordNumber", start: 25, length: 12, class: "X", designation: "M" },
    { key: "carrierCode", start: 37, length: 4, class: "AN", designation: "C" },
    { key: "vesselName", start: 41, length: 20, class: "AN", designation: "C" },
    { key: "voyageFlightTripNumber", start: 61, length: 5, class: "X", designation: "C" },
    dateFieldNumericMMDDYY("estimatedDateOfArrival", 66, "C"),
    { key: "splitShipmentReleaseCode", start: 72, length: 1, class: "AN", designation: "O" },
    { key: "correctionResponseIndicator", start: 73, length: 1, class: "X", designation: "C" },
    filler(74, 7),
  ],
};

// ── WO60-Record (Output): Disposition/Status Result ─────────────────────────
//
// The source PDF's own field table states Document Type's position range as
// "65-67" but its Length/Class as "6AN" (6 chars) — internally inconsistent.
// Position math resolves it: 65-70 (6 chars) for Document Type + 71-80 (10
// chars) for Filler sums to exactly 80; "65-67" (3 chars) would leave the
// record 3 chars short. Implemented as 65-70 per that resolution.

export const ENTRY_DISPOSITION_RESULT_SPEC: RecordSpec<EntryDispositionResultOutput> = {
  recordType: "WO60-Record (Disposition/Status Result, Output)",
  length: 80,
  fields: [
    constantField(1, "WO60"),
    dateFieldNumericMMDDYY("dispositionActionDate", 5, "M"),
    numericCodeField("dispositionActionTime", 11, 4, "M"),
    { key: "dispositionActionCode", start: 15, length: 2, class: "AN", designation: "M" },
    { key: "narrativeMessage", start: 17, length: 40, class: "X", designation: "M" },
    dateFieldNumericMMDDYY("releaseDate", 57, "C"),
    numericCodeField("releaseOriginCode", 63, 2, "C"),
    { key: "documentType", start: 65, length: 6, class: "AN", designation: "C" },
    filler(71, 10),
  ],
};

// ── WR1-Record (Output): Manifest Processing Results / Conveyance ───────────
// A completely different field layout from the WR1-Record (Input) above
// despite sharing the same 2-char "WR" + Record Type "1" control identifier
// — see the module comment in types.ts.

export const MANIFEST_CONVEYANCE_RESULT_SPEC: RecordSpec<ManifestConveyanceResultOutput> = {
  recordType: "WR1-Record (Manifest Processing Results / Conveyance, Output)",
  length: 80,
  fields: [
    constantField(1, "WR"),
    constantField(3, "1"),
    numericCodeField("districtPortOfEntry", 4, 4, "C"),
    { key: "entryFilerCode", start: 8, length: 3, class: "AN", designation: "C" },
    rightJustifiedEntryNumberField("entryNumber", 11, "C"),
    numericCodeField("entryTypeCode", 20, 2, "C"),
    { key: "importerOfRecordNumber", start: 22, length: 12, class: "X", designation: "C" },
    { key: "brokerReferenceNumber", start: 34, length: 9, class: "X", designation: "C" },
    { key: "carrierCode", start: 43, length: 4, class: "AN", designation: "C" },
    { key: "importingVesselCodeOrConveyanceName", start: 47, length: 20, class: "AN", designation: "C" },
    { key: "voyageFlightTripNumber", start: 67, length: 5, class: "X", designation: "M" },
    dateFieldNumericMMDDYY("dateOfArrival", 72, "M"),
    filler(78, 3),
  ],
};

// ── WR2-Record (Output): Trip Number & FIRMS Cargo Location ─────────────────

export const TRIP_FIRMS_LOCATION_SPEC: RecordSpec<TripFirmsLocationOutput> = {
  recordType: "WR2-Record (Trip Number & FIRMS Cargo Location, Output)",
  length: 80,
  fields: [
    constantField(1, "WR"),
    constantField(3, "2"),
    { key: "tripNumber", start: 4, length: 25, class: "AN", designation: "M" },
    filler(29, 48),
    { key: "firmsCode", start: 77, length: 4, class: "AN", designation: "M" },
  ],
};
