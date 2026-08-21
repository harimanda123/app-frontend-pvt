import { decodeRecord } from "@/lib/abi/fixedWidth";
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

export type BrokerDownloadLineType =
  | "1M"
  | "1P"
  | "1J"
  | "1B"
  | "0N"
  | "1C"
  | "1D"
  | "2D"
  | "NS05"
  | "NS30"
  | "UNKNOWN";

const KNOWN_BD_CODES: ReadonlySet<string> = new Set(["1M", "1P", "1J", "1B", "0N", "1C", "1D", "2D"]);

/**
 * Classifies a Broker Download / Status Notification line by its control
 * identifier. Unlike the BD Application Grouping records (1M, 1P, 1J, 1B, 0N,
 * 1C, 1D, 2D), whose first two bytes are the record's own literal identifier,
 * the NS Application Grouping's NS05/NS30 records carry only the bare 2-digit
 * "05"/"30" on the wire — the "NS" prefix returned here is a chapter-level
 * label distinguishing the grouping (Application Identifier "NS" vs "BD"), not
 * literally present in those two bytes. "UNKNOWN" covers the 17 deferred
 * records (2M, 1A, 2B, 4B, 2N, 3N, 4N, 1I, 2I, 2C, 0D, 1V, 2V, 3V, NS40, NS50,
 * NS60 — see types.ts) as well as any Batch & Block Control envelope lines.
 */
export function classifyBrokerDownloadLine(line: string): BrokerDownloadLineType {
  const code = line.slice(0, 2);
  if (KNOWN_BD_CODES.has(code)) return code as BrokerDownloadLineType;
  if (code === "05") return "NS05";
  if (code === "30") return "NS30";
  return "UNKNOWN";
}

export function parseManifestHeader(line: string): ManifestHeaderRecord {
  return decodeRecord(MANIFEST_HEADER_SPEC, line);
}

export function parsePortOfCrossing(line: string): PortOfCrossingRecord {
  return decodeRecord(PORT_OF_CROSSING_SPEC, line);
}

export function parseIssuerCode(line: string): IssuerCodeRecord {
  return decodeRecord(ISSUER_CODE_SPEC, line);
}

export function parseBillOfLadingTransaction(line: string): BillOfLadingTransactionRecord {
  return decodeRecord(BILL_OF_LADING_TRANSACTION_SPEC, line);
}

export function parseEntityName(line: string): EntityNameRecord {
  return decodeRecord(ENTITY_NAME_SPEC, line);
}

export function parseBillOfLadingContainer(line: string): BillOfLadingContainerRecord {
  return decodeRecord(BILL_OF_LADING_CONTAINER_SPEC, line);
}

export function parseBillCargoDescription(line: string): BillCargoDescriptionRecord {
  return decodeRecord(BILL_CARGO_DESCRIPTION_SPEC, line);
}

export function parseMarksAndNumbers(line: string): MarksAndNumbersRecord {
  return decodeRecord(MARKS_AND_NUMBERS_SPEC, line);
}

export function parseStatusNotificationHeader(line: string): StatusNotificationHeaderRecord {
  return decodeRecord(STATUS_NOTIFICATION_HEADER_SPEC, line);
}

export function parseStatusNotificationDetail(line: string): StatusNotificationDetailRecord {
  return decodeRecord(STATUS_NOTIFICATION_DETAIL_SPEC, line);
}
