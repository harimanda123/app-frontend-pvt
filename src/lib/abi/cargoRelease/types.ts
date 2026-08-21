import type { Decimal } from "@/lib/tariff/decimal";

// Types for the CATAIR Cargo Release (SE) chapter — the mandatory backbone
// (SE10/SE11/SE13) plus core commercial extensions (bill of lading, conveyance,
// reference, entity/address/geo at header and line level, HTS line, output
// disposition). Source:
// docs/plans/catair-source-docs/04-cargo-release-implementation-guide-v40.pdf
//
// Deferred (not modeled this slice): SE17 (Equipment), SE31/SE51 (Entity GBI
// pilot), SE41/SE61 (FTZ status/privileged foreign status detail), the PGA
// grouping (OI, PG01-PG35), and the ISF grouping (SF10-SF36).

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
