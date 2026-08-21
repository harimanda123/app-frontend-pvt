export type CargoReleaseLineType =
  | "SE10"
  | "SE11"
  | "SE13"
  | "SE15"
  | "SE16"
  | "SE20"
  | "SE30"
  | "SE35"
  | "SE36"
  | "SE40"
  | "SE50"
  | "SE55"
  | "SE56"
  | "SE60"
  | "SE90"
  | "UNKNOWN";

const KNOWN_CODES: ReadonlySet<string> = new Set([
  "SE10", "SE11", "SE13", "SE15", "SE16", "SE20", "SE30", "SE35", "SE36",
  "SE40", "SE50", "SE55", "SE56", "SE60", "SE90",
]);

/**
 * "UNKNOWN" covers SE17 (Equipment), SE31/SE51 (Entity GBI pilot), SE41/SE61
 * (FTZ status detail), the PGA grouping (OI, PG01-PG35), and the ISF grouping
 * (SF10-SF36) — none modeled this slice, see types.ts.
 */
export function classifyCargoReleaseLine(line: string): CargoReleaseLineType {
  const code = line.slice(0, 4);
  return KNOWN_CODES.has(code) ? (code as CargoReleaseLineType) : "UNKNOWN";
}
