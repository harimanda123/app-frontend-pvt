import type { Decimal } from "@/lib/tariff/decimal";

// Types for the CATAIR Cargo Release (SE) chapter — the mandatory backbone
// (SE10/SE11/SE13) plus core commercial extensions (bill of lading, conveyance,
// reference, entity/address/geo at header and line level, HTS line, output
// disposition, equipment, GBI pilot entity identifiers, FTZ detail). Source:
// docs/plans/catair-source-docs/04-cargo-release-implementation-guide-v40.pdf
//
// PGA grouping (OI, PG01-PG35): this chapter's own PDF (record usage map,
// SE-27) lists the grouping but never defines its field layout — there is no
// "Record Identifier PG0x" section anywhere in this document. The layout is
// fully defined only in Chapter 8's PGA Message Set publication
// (docs/plans/catair-source-docs/08-pga-message-set-2026-07.pdf), already
// modeled generically at src/lib/abi/pgaMessageSet/ (OI_LINE_ITEM_SPEC,
// PG01_HEADER_SPEC, ... PG60_ADDITIONAL_REFERENCE_SPEC). Cargo Release reuses
// those same records by reference rather than redefining them here.
//
// Deferred (not modeled this slice): the ISF grouping (SF10-SF36) — unlike
// the PGA grouping, this *is* fully defined in this chapter's own PDF
// (pages 73-80+, Unified Entry/ISF Filing) as its own record family, not a
// reuse of another chapter's generic records — but it isn't covered by this
// slice's test fixtures.

export interface HeaderInput {
  actionCode: "A" | "R" | "D";
  entryFilerCode: string;
  /** 8-char (7-digit transaction number + check digit, Appendix E). */
  entryNumber: string;
  entryTypeCode: string;
  importerOfRecordType?: string;
  importerOfRecordNumber?: string;
  modeOfTransportationCode?: string;
  bondTypeCode?: "8" | "9";
  /** Whole US dollars — no implied decimals. */
  estimatedEntryValue: Decimal;
  plannedPortOfEntry?: string;
  splitShipmentReleaseCode?: string;
  portOfUnlading?: string;
}

export interface AdditionalHeaderInput {
  entryDateElectionCode?: string;
  /** MMDDYY. */
  electedEntryDate?: Date;
  locationOfGoodsFirms?: string;
  electedExamSiteFirms?: string;
  conveyanceNameOrFtzId?: string;
  voyageFlightTripManifestNumber?: string;
  generalOrderNumber?: string;
  cbpBondedWarehouseFirms?: string;
  originatingWarehouseEntryFilerCode?: string;
  originatingWarehouseEntryNumber?: string;
  immediateDeliveryIndicator?: string;
}

export interface ContactCancellationInput {
  contactName: string;
  contactPhone: string;
  cancellationReasonCode?: string;
  multipleCargoDispositionsIndicator?: number;
  disIndicator?: number;
  splitShipmentIndicator?: number;
}

export interface BillOfLadingInput {
  billTypeIndicator: string;
  issuerCodeOfBillOfLadingNumber?: string;
  billOfLadingNumber: string;
  /** Quantity manifested — a count, not money. */
  quantity?: number;
  nonAmsIndicator: string;
}

export interface ConveyanceInput {
  carrierCode: string;
  voyageFlightTripManifestNumber: string;
  /** MMDDYY. */
  dateOfArrival: Date;
  quantity: number;
  unitOfMeasure?: string;
  conveyanceName?: string;
}

export interface ReferenceInput {
  referenceIdentifierQualifier: string;
  referenceIdentifier: string;
}

export interface EntityInput {
  entityCode: string;
  entityName?: string;
  entityIdentifierQualifier?: string;
  entityIdentifier?: string;
}

export interface EntityAddressInput {
  addressComponentQualifier1: string;
  addressInformation1: string;
  addressComponentQualifier2?: string;
  addressInformation2?: string;
}

export interface EntityGeoInput {
  cityName: string;
  countrySubEntityCode?: string;
  postalCode?: string;
  countryCode: string;
}

export interface LineItemInput {
  /** 3-char sequential line identifier (e.g. "001") — leading zeros significant. */
  lineItemIdentifier: string;
  countryOfOrigin: string;
  commercialInvoiceDescription?: string;
}

export interface HtsLineInput {
  htsNumber: string;
  /** Whole US dollars — no implied decimals. */
  lineItemValue?: Decimal;
}

export interface OutputDispositionInput {
  messageTypeCode: string;
  messageIdentifierCode?: string;
  narrativeMessageText: string;
}
