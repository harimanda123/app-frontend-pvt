import { decodeRecord } from "@/lib/abi/fixedWidth";
import {
  CARGO_MANIFEST_QUERY_ERROR_SPEC,
  ENTRY_STATUS_HEADER_SPEC,
  ENTRY_DISPOSITION_RESULT_SPEC,
  MANIFEST_CONVEYANCE_RESULT_SPEC,
  TRIP_FIRMS_LOCATION_SPEC,
} from "./recordSpecs";
import type {
  CargoManifestQueryErrorOutput,
  EntryStatusHeaderOutput,
  EntryDispositionResultOutput,
  ManifestConveyanceResultOutput,
  TripFirmsLocationOutput,
} from "./types";

export type CargoManifestQueryLineType = "WR0" | "WO10" | "WO60" | "WR1" | "WR2" | "UNKNOWN";

const KNOWN_WO_CODES: ReadonlySet<string> = new Set(["WO10", "WO60"]);

/**
 * Classifies a line from a C1 (query response) stream by its control
 * identifier. Only meaningful for the response side: the WR1-Record
 * (Output, Manifest Processing Results/Conveyance) and the WR1-Record
 * (Input, Cargo Manifest Query Request) share the identical "WR1" control
 * identifier + Record Type on the wire (see the module comment in
 * types.ts), so nothing in the line's own bytes can tell them apart — this
 * classifier resolves the ambiguity contextually instead, by only ever being
 * used to walk a *response* stream, where "WR1" can only mean the Output
 * variant (a WR1-Input line never appears in a C1 response; it's built via
 * `buildCargoManifestQueryRequest`, not parsed by this module).
 *
 * "UNKNOWN" covers the 20 explicitly out-of-scope records this slice doesn't
 * model (WO20, WO30, WO40, WO42, WO50, WO70-72, WR3-5, WS4/5, WSA-D, WN0/1)
 * as well as any batch/block envelope line (Record B, Y, etc.).
 */
export function classifyCargoManifestQueryLine(line: string): CargoManifestQueryLineType {
  const four = line.slice(0, 4);
  if (KNOWN_WO_CODES.has(four)) return four as CargoManifestQueryLineType;
  const three = line.slice(0, 3);
  if (three === "WR0" || three === "WR1" || three === "WR2") return three as CargoManifestQueryLineType;
  return "UNKNOWN";
}

export function parseCargoManifestQueryError(line: string): CargoManifestQueryErrorOutput {
  return decodeRecord(CARGO_MANIFEST_QUERY_ERROR_SPEC, line);
}

export function parseEntryStatusHeader(line: string): EntryStatusHeaderOutput {
  return decodeRecord(ENTRY_STATUS_HEADER_SPEC, line);
}

export function parseEntryDispositionResult(line: string): EntryDispositionResultOutput {
  return decodeRecord(ENTRY_DISPOSITION_RESULT_SPEC, line);
}

export function parseManifestConveyanceResult(line: string): ManifestConveyanceResultOutput {
  return decodeRecord(MANIFEST_CONVEYANCE_RESULT_SPEC, line);
}

export function parseTripFirmsLocation(line: string): TripFirmsLocationOutput {
  return decodeRecord(TRIP_FIRMS_LOCATION_SPEC, line);
}

/**
 * One entry's full query response: the mandatory WO10 header, 0+ WO60
 * disposition events, and the conditional WR1/WR2 conveyance and
 * trip/FIRMS-location records — or, on failure, the WR0 error record
 * instead. Per the source PDF, WR1-Output/WR2 are each returned at most once
 * per successful query (not repeatable, unlike WO60).
 */
export interface CargoManifestQueryResult {
  error?: CargoManifestQueryErrorOutput;
  header?: EntryStatusHeaderOutput;
  dispositions: EntryDispositionResultOutput[];
  conveyance?: ManifestConveyanceResultOutput;
  tripFirmsLocation?: TripFirmsLocationOutput;
  /** Lines that don't classify as WR0/WO10/WO60/WR1/WR2 — one of the 20
   * out-of-scope records (see `classifyCargoManifestQueryLine`) or a
   * batch/block envelope line. Preserved in original order rather than
   * silently dropped. */
  unrecognizedLines: string[];
}

/** Walks a raw C1 (query response) stream, decoding each recognized record
 * type and grouping repeatable WO60 dispositions into a single array. */
export function parseCargoManifestQueryResponse(lines: string[]): CargoManifestQueryResult {
  const result: CargoManifestQueryResult = { dispositions: [], unrecognizedLines: [] };

  for (const line of lines) {
    const type = classifyCargoManifestQueryLine(line);
    switch (type) {
      case "WR0":
        result.error = parseCargoManifestQueryError(line);
        break;
      case "WO10":
        result.header = parseEntryStatusHeader(line);
        break;
      case "WO60":
        result.dispositions.push(parseEntryDispositionResult(line));
        break;
      case "WR1":
        result.conveyance = parseManifestConveyanceResult(line);
        break;
      case "WR2":
        result.tripFirmsLocation = parseTripFirmsLocation(line);
        break;
      default:
        result.unrecognizedLines.push(line);
    }
  }

  return result;
}
