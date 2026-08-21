import { encodeRecord, AbiFixedWidthError } from "@/lib/abi/fixedWidth";
import { isValidEntryNumberCheckDigit } from "@/lib/abi/entryNumber";
import {
  HEADER_CONTROL_SPEC,
  HEADER_CONTENT_SPEC,
  LINE_ITEM_HEADER_SPEC,
  TARIFF_DETAIL_SPEC,
  FEE_TOTAL_SPEC,
  GRAND_TOTALS_SPEC,
  BOND_DETAIL_SPEC,
  FTZ_STATUS_SPEC,
  FTZ_PRIVILEGED_STATUS_DETAIL_SPEC,
  ADCVD_CASE_DETAIL_SPEC,
  ADCVD_DUTY_TOTALS_SPEC,
} from "./recordSpecs";
import type {
  HeaderControlInput,
  HeaderContentInput,
  LineItemHeaderInput,
  TariffDetailInput,
  FeeTotalEntry,
  FeeTotalInput,
  GrandTotalsInput,
  BondDetailInput,
  FtzStatusInput,
  FtzPrivilegedStatusDetailInput,
  AdcvdCaseDetailInput,
  AdcvdDutyTotalsInput,
} from "./types";

/**
 * Builds the 10-Record. Validates the Entry Number's check digit against
 * Appendix E before encoding — a wrong check digit is a guaranteed CBP
 * rejection, so it's better to fail fast here than find out from ACE. Use
 * `buildEntryNumber()` from `@/lib/abi/entryNumber` to compute a correct one.
 */
export function buildHeaderControl(input: HeaderControlInput): string {
  if (!isValidEntryNumberCheckDigit(input.entryFilerCode, input.entryNumber)) {
    throw new AbiFixedWidthError(
      `10-Record: Entry Number "${input.entryNumber}" has an invalid check digit for Entry Filer Code "${input.entryFilerCode}" (Appendix E). Use buildEntryNumber() to compute one.`
    );
  }
  return encodeRecord(HEADER_CONTROL_SPEC, input);
}

export function buildHeaderContent(input: HeaderContentInput): string {
  return encodeRecord(HEADER_CONTENT_SPEC, input);
}

export function buildLineItemHeader(input: LineItemHeaderInput): string {
  return encodeRecord(LINE_ITEM_HEADER_SPEC, input);
}

export function buildTariffDetail(input: TariffDetailInput): string {
  return encodeRecord(TARIFF_DETAIL_SPEC, input);
}

/** Accepts 1-5 fee entries and maps them onto the 89-Record's 5 fixed positional pairs. */
export function buildFeeTotal(fees: FeeTotalEntry[]): string {
  if (fees.length < 1 || fees.length > 5) {
    throw new AbiFixedWidthError(
      `89-Record (Fee Total Detail): expects 1-5 fee entries, got ${fees.length}.`
    );
  }
  const input: Partial<FeeTotalInput> = {};
  fees.forEach((fee, i) => {
    const n = i + 1;
    (input as Record<string, unknown>)[`accountingClassCode${n}`] = fee.accountingClassCode;
    (input as Record<string, unknown>)[`totalFeeAmount${n}`] = fee.totalFeeAmount;
  });
  return encodeRecord(FEE_TOTAL_SPEC, input as FeeTotalInput);
}

export function buildGrandTotals(input: GrandTotalsInput): string {
  return encodeRecord(GRAND_TOTALS_SPEC, input);
}

/** Builds a 31-Record. The Bond Grouping allows up to 2 of these per summary
 * — callers assemble that occurrence limit themselves; this just encodes one. */
export function buildBondDetail(input: BondDetailInput): string {
  return encodeRecord(BOND_DETAIL_SPEC, input);
}

export function buildFtzStatus(input: FtzStatusInput): string {
  return encodeRecord(FTZ_STATUS_SPEC, input);
}

export function buildFtzPrivilegedStatusDetail(input: FtzPrivilegedStatusDetailInput): string {
  return encodeRecord(FTZ_PRIVILEGED_STATUS_DETAIL_SPEC, input);
}

/** Builds a 53-Record. Up to 2 of these are allowed per line item — callers
 * assemble that occurrence limit themselves; this just encodes one. */
export function buildAdcvdCaseDetail(input: AdcvdCaseDetailInput): string {
  return encodeRecord(ADCVD_CASE_DETAIL_SPEC, input);
}

export function buildAdcvdDutyTotals(input: AdcvdDutyTotalsInput): string {
  return encodeRecord(ADCVD_DUTY_TOTALS_SPEC, input);
}
