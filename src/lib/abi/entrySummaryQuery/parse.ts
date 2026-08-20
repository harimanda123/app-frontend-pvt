import { decodeRecord, AbiFixedWidthError } from "@/lib/abi/fixedWidth";
import {
  CRITERIA_QUERY_RESPONSE_HEADER_SPEC,
  ENTRY_SUMMARY_STATUS_INFO_SPEC,
  QUERY_RETURNED_CONDITION_SPEC,
  ENTRY_SUMMARY_STATUS_DETAIL_SPEC,
  LIQUIDATION_INFO_SPEC,
  ESTIMATED_REVENUE_INFO_SPEC,
  ENTRY_SUMMARY_FILING_INFO_SPEC,
  WAREHOUSE_AND_LINE_INFO_SPEC,
  FORM_REFERENCE_INFO_SPEC,
  BOND_SURETY_INFO_SPEC,
} from "./recordSpecs";
import type {
  CriteriaQueryResponseHeader,
  EntrySummaryStatusInfo,
  QueryReturnedCondition,
  EntrySummaryStatusDetail,
  LiquidationInfo,
  EstimatedRevenueInfo,
  EntrySummaryFilingInfo,
  WarehouseAndLineInfo,
  FormReferenceInfo,
  BondSuretyInfo,
} from "./types";

export type EsqOutputLineType = "JA" | "JB" | "JC" | "JD" | "JE" | "JF" | "JG" | "JH" | "JI" | "JZ" | "UNKNOWN";

/** "UNKNOWN" covers JJ-JN (5 output records not modeled this slice — protest,
 * bill, and collection detail, all conditional — see types.ts), the reused
 * Entry Summary Details Grouping (10-90-Records), and the 4A-Record. */
export function classifyOutputLine(line: string): EsqOutputLineType {
  const two = line.slice(0, 2);
  if (["JA", "JB", "JC", "JD", "JE", "JF", "JG", "JH", "JI", "JZ"].includes(two)) {
    return two as EsqOutputLineType;
  }
  return "UNKNOWN";
}

export function parseCriteriaQueryResponseHeader(line: string): CriteriaQueryResponseHeader {
  return decodeRecord(CRITERIA_QUERY_RESPONSE_HEADER_SPEC, line);
}

export function parseEntrySummaryStatusInfo(line: string): EntrySummaryStatusInfo {
  return decodeRecord(ENTRY_SUMMARY_STATUS_INFO_SPEC, line);
}

export function parseQueryReturnedCondition(line: string): QueryReturnedCondition {
  return decodeRecord(QUERY_RETURNED_CONDITION_SPEC, line);
}

export function parseEntrySummaryStatusDetail(line: string): EntrySummaryStatusDetail {
  return decodeRecord(ENTRY_SUMMARY_STATUS_DETAIL_SPEC, line);
}

export function parseLiquidationInfo(line: string): LiquidationInfo {
  return decodeRecord(LIQUIDATION_INFO_SPEC, line);
}

export function parseEstimatedRevenueInfo(line: string): EstimatedRevenueInfo {
  return decodeRecord(ESTIMATED_REVENUE_INFO_SPEC, line);
}

export function parseEntrySummaryFilingInfo(line: string): EntrySummaryFilingInfo {
  return decodeRecord(ENTRY_SUMMARY_FILING_INFO_SPEC, line);
}

export function parseWarehouseAndLineInfo(line: string): WarehouseAndLineInfo {
  return decodeRecord(WAREHOUSE_AND_LINE_INFO_SPEC, line);
}

export function parseFormReferenceInfo(line: string): FormReferenceInfo {
  return decodeRecord(FORM_REFERENCE_INFO_SPEC, line);
}

export function parseBondSuretyInfo(line: string): BondSuretyInfo {
  return decodeRecord(BOND_SURETY_INFO_SPEC, line);
}

/** One entry summary's full status: JB plus its mandatory JC-JH detail records
 * and 0+ JI bond/surety records. */
export interface EntrySummaryQueryResult {
  status: EntrySummaryStatusInfo;
  detail: EntrySummaryStatusDetail;
  liquidation: LiquidationInfo;
  estimatedRevenue: EstimatedRevenueInfo;
  filing: EntrySummaryFilingInfo;
  warehouseAndLine: WarehouseAndLineInfo;
  formReference: FormReferenceInfo;
  bonds: BondSuretyInfo[];
}

export interface ParsedQueryResponse {
  criteriaHeader?: CriteriaQueryResponseHeader;
  results: EntrySummaryQueryResult[];
  conditions: QueryReturnedCondition[];
  /**
   * Lines that don't classify as JA/JB-JI/JZ: JJ-JN (protest/bill/collection
   * detail, conditional — not requested unless the J2-Record's Collection/Bill
   * Information Code asks for them), the Entry Summary Details Grouping
   * (10-90-Records), and the 4A-Record. Preserved in original order rather than
   * silently dropped or guessed at; a future slice can walk this list once
   * those record types are built.
   */
  unrecognizedLines: string[];
}

const DECODERS = {
  JC: parseEntrySummaryStatusDetail,
  JD: parseLiquidationInfo,
  JE: parseEstimatedRevenueInfo,
  JF: parseEntrySummaryFilingInfo,
  JG: parseWarehouseAndLineInfo,
  JH: parseFormReferenceInfo,
} as const;

const RESULT_KEYS = {
  JC: "detail",
  JD: "liquidation",
  JE: "estimatedRevenue",
  JF: "filing",
  JG: "warehouseAndLine",
  JH: "formReference",
} as const;

/**
 * Walks a raw Entry Summary Query response, grouping each JB with the JC-JH
 * detail records and JI bond/surety records that structurally follow it (per
 * the Output Record Structure Map: JB -> JC -> JD -> JE -> JF -> JG -> JH ->
 * JI x0-20). JJ-JN and the Entry Summary Details Grouping aren't modeled, so
 * they're preserved verbatim in `unrecognizedLines` rather than guessed at.
 */
export function parseQueryResponse(lines: string[]): ParsedQueryResponse {
  const result: ParsedQueryResponse = { results: [], conditions: [], unrecognizedLines: [] };
  let current: Partial<EntrySummaryQueryResult> | undefined;

  const flushCurrent = () => {
    if (!current) return;
    if (!current.status || !current.detail || !current.liquidation || !current.estimatedRevenue ||
      !current.filing || !current.warehouseAndLine || !current.formReference) {
      throw new AbiFixedWidthError(
        "Entry Summary Query response: a JB group is missing one of its mandatory JC-JH detail records."
      );
    }
    result.results.push({ ...current, bonds: current.bonds ?? [] } as EntrySummaryQueryResult);
    current = undefined;
  };

  for (const line of lines) {
    const type = classifyOutputLine(line);
    if (type === "JA") {
      result.criteriaHeader = parseCriteriaQueryResponseHeader(line);
    } else if (type === "JB") {
      flushCurrent();
      current = { status: parseEntrySummaryStatusInfo(line) };
    } else if (type === "JI") {
      if (!current) {
        throw new AbiFixedWidthError("Entry Summary Query response: JI-Record with no preceding JB group.");
      }
      (current.bonds ??= []).push(parseBondSuretyInfo(line));
    } else if (type in DECODERS) {
      if (!current) {
        throw new AbiFixedWidthError(`Entry Summary Query response: ${type}-Record with no preceding JB group.`);
      }
      const key = RESULT_KEYS[type as keyof typeof RESULT_KEYS];
      const decoder = DECODERS[type as keyof typeof DECODERS];
      (current as Record<string, unknown>)[key] = decoder(line);
    } else if (type === "JZ") {
      result.conditions.push(parseQueryReturnedCondition(line));
    } else {
      result.unrecognizedLines.push(line);
    }
  }
  flushCurrent();

  return result;
}
