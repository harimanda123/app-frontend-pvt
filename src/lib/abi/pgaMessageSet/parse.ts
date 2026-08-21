export type PgaMessageSetLineType =
  | "OI"
  | "PG01"
  | "PG02"
  | "PG04"
  | "PG06"
  | "PG07"
  | "PG08"
  | "PG10"
  | "PG13"
  | "PG14"
  | "PG18"
  | "PG19"
  | "PG20"
  | "PG21"
  | "PG22"
  | "PG24"
  | "PG25"
  | "PG26"
  | "PG27"
  | "PG29"
  | "PG30"
  | "PG32"
  | "PG34"
  | "PG50"
  | "PG51"
  | "PG55"
  | "PG60"
  | "PG00"
  | "UNKNOWN";

const KNOWN_PG_CODES: ReadonlySet<string> = new Set([
  "PG01", "PG02", "PG04", "PG06", "PG07", "PG08", "PG10", "PG13", "PG14",
  "PG18", "PG19", "PG20", "PG21", "PG22", "PG24", "PG25", "PG26", "PG27",
  "PG29", "PG30", "PG32", "PG34", "PG50", "PG51", "PG55", "PG60", "PG00",
]);

/**
 * Classifies a PGA Message Set line by its control identifier. Unlike other
 * chapters, PGA's identifier isn't a uniform width: the OI-Record uses a
 * bare 2-char "OI", while every PG-record uses a 4-char "PG" + 2-digit record
 * type (e.g. "PG01"). "UNKNOWN" covers the 7 agency-specific record variants
 * (PG05, PG17, PG23, PG28, PG31, PG33, PG35) — not modeled this slice, see
 * types.ts.
 */
export function classifyPgaMessageSetLine(line: string): PgaMessageSetLineType {
  if (line.slice(0, 2) === "OI") return "OI";
  const code = line.slice(0, 4);
  return KNOWN_PG_CODES.has(code) ? (code as PgaMessageSetLineType) : "UNKNOWN";
}
