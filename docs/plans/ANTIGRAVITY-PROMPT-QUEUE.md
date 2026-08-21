# Antigravity Prompt Queue — CATAIR Reference Data (remaining)

All CATAIR wire-format chapters are done. What's left in `docs/plans/catair-source-docs/`
is reference/validation data. Recommended order below, by how many already-built chapters
each table would validate. Paste each prompt into Antigravity as-is; post the result back
here in chat and it'll get the same treatment as everything before it — independent
verification against the source PDF (full re-extraction if the table is small enough to
fully diff, spot-check with page citations if not), then either a direct `src/` module
(for clean structured data) or a background implementation pass (if Antigravity leaves it
as tests only).

**Recommendation:** do P1 and P2 first — Country/Currency Codes and Units of Measure are
referenced by nearly every chapter already built (country-of-origin fields, quantity/UOM
pairs everywhere from Entry Summary line items to Drawback to PGA). P3–P6 are all real but
narrower. Appendix F (Duty Calculation) is deliberately not queued — it's flagged in memory
as a 2011-dated document that needs Client-Rep verification before it's worth trusting,
separate from the extraction-accuracy concern every other prompt here is about.

---

## P1 — Country and Currency Codes (Appendix B, pp. 6–16, largest table)

```
Not a wire-format chapter — a reference data extraction.

Source: docs/plans/catair-source-docs/appendix-b-valid-codes.pdf, pages 6-16
("Country and Currency Codes" section — 11 pages, the largest table in this appendix)

This table backs the ISO country-of-origin / country-of-export fields already built
across nearly every chapter (Cargo Release, Entry Summary, Statement, eBond, Drawback,
PGA, Broker Download, Cargo Manifest Query, In-Bond) — none of them currently validate
against a real country code list.

Task: extract the full table — country name, ISO country code, and currency
code/name if the table includes it (check the actual columns; don't assume a shape).
Watch for multi-line-wrapped entries (the EU Country Codes table you already did had
some) and for any non-standard/CBP-specific codes mixed in with real ISO codes (flag
any you're not sure about rather than guessing). If a src/ file is warranted (this is
structured tabular data, same category as the Government Agency Codes and Valid Codes
work already done — a real src/ module is fine here, tests-only is not required),
write src/lib/abi/countryCurrencyCodes.ts directly; otherwise write
tests/abi-country-currency-codes.test.ts. Same evidentiary bar as every prior pass:
real extracted table evidence with page citations, confirm your total count against
what you can see in the PDF (don't just trust a running total), flag anything
ambiguous rather than resolving it silently. Report back with total entry count and
citations.
```

---

## P2 — Units of Measure (Appendix B, pp. 22–25)

```
Not a wire-format chapter — a reference data extraction.

Source: docs/plans/catair-source-docs/appendix-b-valid-codes.pdf, pages 22-25
("Units of Measure" section — 4 pages)

This backs every UOM field already built (Cargo Release line items, Entry Summary
quantity/UOM pairs, Drawback's Unit of Measure Code on Records 42/50/60/70, PGA's
Unit of Measure fields) — none currently validate against a real UOM code list.

Task: extract the full table (code, description, and any category/grouping the PDF
uses). Same evidentiary bar as every prior pass: real extracted table evidence with
page citations, confirmed total count. Write src/lib/abi/unitsOfMeasure.ts directly
if the data is clean structured tabular data (same treatment as Government Agency
Codes / Valid Codes), otherwise tests/abi-units-of-measure.test.ts. Report back with
total entry count and citations.
```

---

## P3 — Equipment Description Codes (Appendix B, pp. 28–31)

```
Not a wire-format chapter — a reference data extraction.

Source: docs/plans/catair-source-docs/appendix-b-valid-codes.pdf, pages 28-31
("Equipment Description Codes" section — 4 pages)

This backs container/equipment type fields already built (Cargo Release's container
records, Broker Download's 1C Bill of Lading Container record's
Container/Equipment Description Code and Type fields).

Task: extract the full table (code, description). Same evidentiary bar: real
extracted evidence, confirmed count. Write src/lib/abi/equipmentDescriptionCodes.ts
directly if clean structured data, otherwise tests/abi-equipment-description-codes.test.ts.
Report back with total entry count and citations.
```

---

## P4 — Location Identifiers / US States / Mexican States / Canadian Provinces (Appendix B, pp. 18–21)

```
Not a wire-format chapter — a reference data extraction, four smaller related tables.

Source: docs/plans/catair-source-docs/appendix-b-valid-codes.pdf, pages 18-21:
- Page 18: Location Identifiers
- Page 19: United States (state codes)
- Page 20: Mexican States
- Page 21: Canadian Provinces

Task: extract all four tables (they're smaller — likely under 60 entries each). Same
evidentiary bar: real extracted evidence with page citations per table, confirmed
counts. Write one src/lib/abi/locationCodes.ts module (or four separate exports in
one file — your call on organization) if the data is clean structured tabular data,
otherwise a single tests/abi-location-codes.test.ts covering all four. Report back
with entry counts per table and citations.
```

---

## P5 — Appendix C: Tariff Abbreviations

```
Not a wire-format chapter — a reference data extraction.

Source: docs/plans/catair-source-docs/appendix-c-tariff-abbreviations.pdf (8 pages)

Read the document first and report what it actually contains (don't assume the
shape) — likely a list of abbreviation codes used in tariff/HTS descriptions. Extract
the full table with the same evidentiary bar as every prior pass: real extracted
evidence, page citations, confirmed count. Write a src/lib/abi/ module directly if
it's clean structured data, otherwise a test file. Report back with what the document
actually covers, entry count, and citations.
```

---

## P6 — Appendix H: Census Warning Override Codes

```
Not a wire-format chapter — a reference data extraction.

Source: docs/plans/catair-source-docs/appendix-h-census-codes.pdf (19 pages, dated
2008 — old, but unlike Appendix F this one isn't currently flagged as needing
revision verification, just note the document date in your report so it's on record)

This backs Census Warning override codes referenced by the error dictionary already
built (several rows in src/lib/abi/errorDictionary.ts mention "Census Warning Query"
by name) and by Entry Summary's census-related fields.

Task: extract the full table (code, description, and whatever else the table has —
read it first, don't assume the shape). Same evidentiary bar: real extracted
evidence, page citations, confirmed count against what's visible in the document.
Write a src/lib/abi/ module directly if clean structured data, otherwise a test
file. Report back with entry count, citations, and confirmation of the document's
actual revision date.
```

---

## Not queued (needs a decision, not just extraction)

- **Appendix F (Duty Calculation)** — 2011-dated, flagged in memory as needing
  Client-Rep verification before trusting its formulas for anything duty-calculation
  related. Extracting it isn't the blocker; trusting a 15-year-old formula document is.
  Ask before queuing this one.
- **Manifest / FTZ Admission chapters** — explicitly out of scope pending a go/no-go
  decision (would mean Qubere modeling carrier-side filing, a different business than
  today's broker-facing tool). Not reference data, not queued here.

## After the reference data lands (not an Antigravity task)

Once P1–P6 are in, the natural next move is wiring the new lookup tables into the
validation paths of chapters that already exist — e.g. Entry Summary/Cargo Release's
entry type and country fields checked against `validCodes.ts`, the diagnostic/output
records (X0/X1, E0/E1, WR0, WO60) resolving their raw condition codes through
`errorDictionary.ts` instead of passing them through opaque. That's direct
implementation work, not something to route through Antigravity — flag it when you're
ready and it'll go through the same background-agent-plus-verification pattern as the
chapter builds.
