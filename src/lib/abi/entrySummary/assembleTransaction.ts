import { AbiFixedWidthError } from "@/lib/abi/fixedWidth";
import {
  buildHeaderControl,
  buildHeaderContent,
  buildLineItemHeader,
  buildTariffDetail,
  buildFeeTotal,
  buildGrandTotals,
} from "./build";
import type { EntrySummaryTransactionInput } from "./types";

const MAX_FEE_TOTAL_RECORDS = 9;
const FEES_PER_RECORD = 5;

/**
 * Assembles one full Entry Summary TRANSACTION grouping — 10(+11), each line
 * item's 40 followed by its 50s, then any 89s and a 90 — into the ordered flat
 * record strings CBP expects. This is the transaction-level nesting; each
 * record's own field encoding is handled by build.ts.
 *
 * The result is ready to hand to Slice 1's `wrapBlock()` as opaque detail lines.
 */
export function assembleTransaction(input: EntrySummaryTransactionInput): string[] {
  const records: string[] = [buildHeaderControl(input.headerControl)];

  if (input.headerContent) {
    records.push(buildHeaderContent(input.headerContent));
  }

  for (const lineItem of input.lineItems) {
    records.push(buildLineItemHeader(lineItem.header));
    for (const tariffDetail of lineItem.tariffDetails) {
      records.push(buildTariffDetail(tariffDetail));
    }
  }

  if (input.feeTotals && input.feeTotals.length > 0) {
    const recordCount = Math.ceil(input.feeTotals.length / FEES_PER_RECORD);
    if (recordCount > MAX_FEE_TOTAL_RECORDS) {
      throw new AbiFixedWidthError(
        `Fee Total Grouping: ${input.feeTotals.length} fee entries need ${recordCount} 89-Records, exceeding the spec's limit of ${MAX_FEE_TOTAL_RECORDS}.`
      );
    }
    for (let i = 0; i < input.feeTotals.length; i += FEES_PER_RECORD) {
      records.push(buildFeeTotal(input.feeTotals.slice(i, i + FEES_PER_RECORD)));
    }
  }

  if (input.grandTotals) {
    records.push(buildGrandTotals(input.grandTotals));
  }

  return records;
}
