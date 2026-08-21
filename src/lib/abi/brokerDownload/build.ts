import { encodeRecord } from "@/lib/abi/fixedWidth";
import {
  MANIFEST_HEADER_SPEC,
  PORT_OF_CROSSING_SPEC,
  ISSUER_CODE_SPEC,
  BILL_OF_LADING_TRANSACTION_SPEC,
  ENTITY_NAME_SPEC,
  BILL_OF_LADING_CONTAINER_SPEC,
  BILL_CARGO_DESCRIPTION_SPEC,
  MARKS_AND_NUMBERS_SPEC,
  STATUS_NOTIFICATION_HEADER_SPEC,
  STATUS_NOTIFICATION_DETAIL_SPEC,
} from "./recordSpecs";
import type {
  ManifestHeaderRecord,
  PortOfCrossingRecord,
  IssuerCodeRecord,
  BillOfLadingTransactionRecord,
  EntityNameRecord,
  BillOfLadingContainerRecord,
  BillCargoDescriptionRecord,
  MarksAndNumbersRecord,
  StatusNotificationHeaderRecord,
  StatusNotificationDetailRecord,
} from "./types";

// ACE Broker Download is output-only — CBP pushes this data to ABI filers,
// there's no filer-submitted input side. These `buildX` wrappers exist to
// represent CBP's own encoding logic (useful for testing/simulating CBP
// responses against Qubere's decode path in `parse.ts`), not for anything
// Qubere itself transmits.

export function buildManifestHeader(input: ManifestHeaderRecord): string {
  return encodeRecord(MANIFEST_HEADER_SPEC, input);
}

export function buildPortOfCrossing(input: PortOfCrossingRecord): string {
  return encodeRecord(PORT_OF_CROSSING_SPEC, input);
}

export function buildIssuerCode(input: IssuerCodeRecord): string {
  return encodeRecord(ISSUER_CODE_SPEC, input);
}

export function buildBillOfLadingTransaction(input: BillOfLadingTransactionRecord): string {
  return encodeRecord(BILL_OF_LADING_TRANSACTION_SPEC, input);
}

export function buildEntityName(input: EntityNameRecord): string {
  return encodeRecord(ENTITY_NAME_SPEC, input);
}

export function buildBillOfLadingContainer(input: BillOfLadingContainerRecord): string {
  return encodeRecord(BILL_OF_LADING_CONTAINER_SPEC, input);
}

export function buildBillCargoDescription(input: BillCargoDescriptionRecord): string {
  return encodeRecord(BILL_CARGO_DESCRIPTION_SPEC, input);
}

export function buildMarksAndNumbers(input: MarksAndNumbersRecord): string {
  return encodeRecord(MARKS_AND_NUMBERS_SPEC, input);
}

export function buildStatusNotificationHeader(input: StatusNotificationHeaderRecord): string {
  return encodeRecord(STATUS_NOTIFICATION_HEADER_SPEC, input);
}

export function buildStatusNotificationDetail(input: StatusNotificationDetailRecord): string {
  return encodeRecord(STATUS_NOTIFICATION_DETAIL_SPEC, input);
}
