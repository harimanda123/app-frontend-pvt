# Phase 3 Prompt Queue — Cargo Release, then repeat the Phase 2 pattern

Phase 3 (`docs/plans/ABI-CERTIFICATION-READINESS.md` §3) covers 5 more chapters: Cargo
Release, Statement Processing, Bond/eBond, Drawback, PGA Message Set (In-Bond and
Manifest/FTZ stay gated per the plan doc). This queue starts with just the first one.

**Why not the same P1/P2 DB-integration pattern as Phase 2, straight away.** Before
building a `fromCustomsFiling.ts`-style mapper for any Phase 3 chapter, checked whether
each chapter has an assembly/composition layer — something that sequences the individual
`buildXxx()` record functions into a full transaction in the right order, the way
`src/lib/abi/entrySummary/assembleTransaction.ts` and
`src/lib/abi/entrySummaryQuery/assembleQuery.ts` already do for the two Phase 2 chapters.
**None of the 5 Phase 3 chapters have this yet** (confirmed by `ls` — no
`assembleTransaction`/`assembleQuery`-equivalent file in `cargoRelease/`, `statement/`,
`ebond/`, `drawback/`, or `pgaMessageSet/`). Only the atomic per-record `build*()`/`decode*()`
functions and `RecordSpec`s exist. Asking for a DB-integration mapper before that layer
exists would force whoever builds it to invent the record sequencing themselves — exactly
the kind of guessing that produced the two corrected passes already in this project's
history (Cargo Release's first pass, In-Bond's QP40). So: assembly layer first, one chapter
at a time, DB integration queued as a separate follow-up once each one lands.

---

## P1 — Cargo Release transaction assembly (`assembleTransaction.ts`) — DONE 2026-08-22

Landed and independently verified against the real PDF page (not just the report) — see
`ABI-CERTIFICATION-READINESS.md`'s Phase 3 entry for the full writeup. Sequencing and every
repeat limit checked out against the chapter's "Input Record Usage Map for 'A' Add and 'R'
Replace Actions" (PDF page 24, SE-22). Kept below for reference since it's the model the
next prompt should follow.

<details>
<summary>Original P1 prompt (for reference)</summary>

```
PDF-grounded task — this is sequencing/composition logic, not a new record layout, but the
ORDER and GROUPING of records within a transaction still needs to come from the chapter's
own documented structure, not be guessed from record names.

Context: src/lib/abi/cargoRelease/ has all 20 records built and PDF-verified (SE10, SE11,
SE13, SE15, SE16, SE17, SE20, SE30, SE31, SE35, SE36, SE40, SE41, SE50, SE51, SE55, SE56,
SE60, SE61, SE90 — see src/lib/abi/cargoRelease/index.ts for the full list), each with its
own buildXxx()/decodeXxx() pair, but there is no function that assembles them into one
transaction in the right order. Compare to src/lib/abi/entrySummary/assembleTransaction.ts
and src/lib/abi/entrySummaryQuery/assembleQuery.ts — both direct models for what this task
produces, and both grounded their record ordering in their own chapter's documented
structure map (entrySummaryQuery's docstring cites "the Input Record Structure Map" by
name — Cargo Release's PDF will have its own equivalent, find it, don't assume Entry
Summary's structure carries over).

Source: docs/plans/catair-source-docs/04-cargo-release-implementation-guide-v40.pdf — find
this chapter's own record structure/sequence map (how Header relates to Additional Header,
Bill of Lading, Conveyance, Reference, header-level Entity/Entity-Address/Entity-Geo/GBI
groups, and how line-level records — Line Item, HTS Line, FTZ Detail, line-level
Entity/Entity-Address/Entity-Geo/GBI — repeat and nest under it; where Equipment fits;
whether Bill of Lading and Conveyance can repeat and how many times). Don't infer this from
field names or from how Entry Summary's structure works — Cargo Release is a different
chapter with its own rules, cite the actual page(s) where the structure is documented.

Task: write src/lib/abi/cargoRelease/assembleTransaction.ts with a function (or small set
of functions, if the chapter's own structure map suggests a natural split — e.g. one for
building the record sequence, matching assembleTransaction's shape in the Entry Summary
chapter) that takes structured input for each record group and returns the ordered string[]
of encoded lines, ready to hand to wrapBlock()/wrapBatch()
(src/lib/abi/batchBlockControl/build.ts) same as Entry Summary Create/Update does. Handle
repeating groups (multiple line items, multiple entities, multiple bills of lading) as
arrays, matching how Entry Summary's own assembleTransaction.ts handles its repeating
groups — read that file's approach before designing this one, don't invent a different
pattern for no reason.

Non-negotiable evidentiary bar, same as every prior codec pass: cite the actual page(s) of
the structure map you're building against, don't self-verify only via internal consistency.
If any part of the sequencing is genuinely ambiguous in the PDF, flag it explicitly in your
report rather than picking silently.

Write tests verifying: a full transaction with every record type populated round-trips
losslessly through decode (spot-check field values, don't just check line count), and that
omitting an optional group (no FTZ detail, single line item, single entity) produces a
correctly shorter, still-valid sequence. tests/abi-cargo-release-assemble.test.ts.

Report back with: the structure map's page citation(s), the function signature(s) you
landed on and why, anything genuinely ambiguous you flagged rather than guessed, and test
count.
```

</details>

---

## P2 — Cargo Release response parsing (`parseResponse.ts`) — DONE 2026-08-22, one real gap found

Landed and independently re-verified against the real PDF pages (not just the report) —
see `ABI-CERTIFICATION-READINESS.md`'s Phase 3 entry for the full writeup. The SE90
two-type design (message-level 01/02/03/04 vs. record-level 11/13) and the per-occurrence
error attachment are both confirmed accurate. **One real, unfixed gap**: the map shows "SE
Header Grouping" repeating up to 999 times per response (multiple transactions' worth of
replies in one output message), but `parseCargoReleaseResponse` only models a single
occurrence — a second one would silently overwrite the first and co-mingle its child
records with no way to attribute them back to the right transaction. Not fixed yet; see P3
below, which should land before DB integration is attempted.

<details>
<summary>Original P2 prompt (for reference)</summary>

```
PDF-grounded task, same category as P1 — composition/parsing logic, not a new record
layout, but needs the chapter's own documented OUTPUT structure, not guessed.

Context: src/lib/abi/cargoRelease/parse.ts currently only has classifyCargoReleaseLine()
plus per-record decodeXxx() functions (via decodeRecord() against each RecordSpec) — there
is no function that walks a full raw response and groups its records into a structured
result, the way src/lib/abi/entrySummary/parse.ts's parseEntrySummaryResponse() or
src/lib/abi/entrySummaryQuery/parse.ts's parseQueryResponse() do for their chapters. Read
both of those as direct models.

This chapter's output structure is NOT the same shape as those two. Its own "Output Record
Usage Map" (docs/plans/catair-source-docs/04-cargo-release-implementation-guide-v40.pdf,
starting PDF page 28 / SE-26 — confirm the exact end page yourself, the table continues
past what's been spot-checked so far) nests an SE90 Error Record option under EVERY
individual grouping — SE Header Error Grouping, Bill of Lading Error Grouping, Conveyance
Error Grouping, Equipment Error Grouping, Reference Error Grouping, and (verify — not yet
confirmed past the header-entity section) presumably the line-level and PGA groupings too,
each allowing up to 9 SE90 records per occurrence. This is a materially different shape
from Entry Summary's flat E0/E1 pair — don't assume it collapses to something simpler than
it is, read the full map before designing the parsed-result type.

Task: write src/lib/abi/cargoRelease/parseResponse.ts (name it to match this chapter's own
convention if build.ts/assembleTransaction.ts suggest a different one) with a function that
takes raw response lines and returns a structured result grouping each record occurrence
with its own SE90 errors (if any), for every grouping the Output Record Usage Map defines —
read the map's own accept/reject signaling (is there a top-level disposition indicator
somewhere, the way Entry Summary Query has JB/JC status records? or is "any SE90 present
anywhere" the only reject signal for this chapter? — verify from the PDF, don't assume
either way).

Non-negotiable evidentiary bar: cite the actual page(s), don't self-verify only via internal
consistency. Flag genuine ambiguity in your report rather than picking silently — this
chapter's nesting is deep enough that guessing is a real risk here.

Write tests round-tripping a built-then-parsed response covering: a fully clean accept (no
SE90 anywhere), and a response with SE90 errors attached to at least two different grouping
levels (e.g. one on a Bill of Lading occurrence, one on a header entity occurrence) to prove
the errors attach to the right occurrence, not just get flattened into one bag.
tests/abi-cargo-release-parse-response.test.ts.

Report back with: the page citation(s) for the full output structure (including whatever
comes after SE-26/PDF page 28), how you modeled the per-occurrence SE90 attachment, what you
found (or didn't find) for a top-level accept/reject signal, and test count.
```

</details>

---

## P3 — Support multiple SE Header Groupings per response — DONE 2026-08-22

Landed and independently re-verified — see `ABI-CERTIFICATION-READINESS.md`'s Phase 3
entry for the full writeup. `ParsedCargoReleaseResponse` is now `{ scenario, headerGroups:
ParsedCargoReleaseHeaderGroup[], unrecognizedLines }`, confirmed via a test that builds two
genuinely distinct transactions through the already-verified `assembleTransaction()` and
proves they come back correctly separated, not merged.

<details>
<summary>Original P3 prompt (for reference)</summary>

```
Bug fix / structural gap, not new PDF research — the grounding for this already exists.

Context: src/lib/abi/cargoRelease/parseResponse.ts's parseCargoReleaseResponse() currently
assumes exactly one SE Header Grouping (SE10/SE11/SE13) per response — header,
additionalHeader, and contactCancellation are singular fields, and every SE15/SE20/SE30/
SE40 etc. line gets pushed onto one flat bills/references/headerEntities/lines array with
no association back to a specific SE10 occurrence.

The real PDF (docs/plans/catair-source-docs/04-cargo-release-implementation-guide-v40.pdf,
page 28-29 / SE-26/27, "Output Record Usage Map") shows "SE Header Grouping | M | | 999" —
a single output message can carry up to 999 separate transaction dispositions (e.g. CBP's
reply to a batch cancellation covering multiple entries). Right now, if a raw response ever
contains a second SE10 line, parseCargoReleaseResponse silently overwrites header/
additionalHeader/contactCancellation with the second occurrence's values, and every bill,
reference, entity, and line item from BOTH transactions ends up merged into the same flat
arrays with no way to tell which SE10 they belong to.

Task: restructure parseCargoReleaseResponse's return type so the top-level SE Header
Grouping is modeled as a repeating array — each element carrying its own header/
additionalHeader/contactCancellation plus the bills/references/headerEntities/lines that
belong to it (i.e., everything currently flat becomes scoped per SE-Header-Grouping
occurrence, the same way bills/headerEntities/lines are already correctly scoped as arrays
within a single occurrence today). A new SE10 line starts a new grouping; everything
encountered before the next SE10 (or end of input) belongs to the current one. Update
src/lib/abi/cargoRelease/types.ts's ParsedCargoReleaseResponse and friends accordingly, and
fix every existing caller/test in this repo that assumed the old singular shape (grep for
ParsedCargoReleaseResponse, parseCargoReleaseResponse, and the singular header/
additionalHeader/contactCancellation field names before you start, so you know the actual
blast radius, not just the current test file).

Add a test with two SE10 header groupings in one raw response — each with at least one bill
and one line item — proving both come back distinct with their own child records correctly
attributed, not merged.

Report back with: the type shape you landed on, what existing tests/call sites needed
updating and why, and test count.
```

</details>

---

## P4 — Cargo Release DB integration, request side (`fromCustomsFiling.ts`) — DONE 2026-08-22, 5 real bugs found and fixed

Landed, but the first pass had a serious problem caught on independent review — see
`ABI-CERTIFICATION-READINESS.md`'s Phase 3 entry for the full writeup. Traced every field
in the hand-written `CustomsFilingWithCargoReleaseRelations` type against the actual Prisma
schema and found 5 that don't exist or are misnamed (`ShipmentLineItem.shipmentParties`,
`ShipmentTrackingIdentifier.scac`, `Shipment.trackingNumber`, `FtzDetail.zoneStatus`,
`FtzDetail.ftzLineItemQuantity`) — all invisible to the tests because the mock fixture used
the same invented names. Fixed directly: corrected all 5 references (2 straightforward
renames confirmed against Entry Summary's own already-verified FTZ mapping, 1 dead fallback
removed, 1 fabricated relation replaced with an explicit TODO), updated the test fixture to
match reality. Re-verified clean after the fix: `tsc` clean, chapter suite 124/124, full
repo suite 263 files / 3417 tests / 2 pre-existing skips.

<details>
<summary>Original P4 prompt (for reference)</summary>

```
Internal engineering task, not a PDF extraction — assembling already-verified pieces. Same
category as the Phase 2 prompts (src/lib/abi/entrySummary/fromCustomsFiling.ts and
src/lib/abi/entrySummaryQuery/fromCustomsFiling.ts) — read both as direct models, and
src/lib/abi/entrySummary/fromCustomsFiling.ts specifically for how it maps CustomsFiling's
loaded relations to a CATAIR input shape and surfaces AbiFilingValidationError for missing
required fields rather than silently defaulting them.

Context: src/lib/abi/cargoRelease/assembleTransaction.ts (built, PDF-verified) takes a
CargoReleaseTransactionInput and returns ordered record lines. Nothing maps a database
CustomsFiling record to that input shape yet. CargoReleaseTransactionInput's fields — read
src/lib/abi/cargoRelease/types.ts in full before starting — need real data sources, not all
of which live on CustomsFiling itself:

- header/additionalHeader/contactCancellation, line items, FTZ detail, bond type: mostly
  the same CustomsFiling + shipment.lineItems + bond relations already used in Entry
  Summary's own fromCustomsFiling.ts — reuse that mapping logic/shape where the fields
  genuinely overlap, don't re-derive it from scratch.
- ConveyanceInput (carrier code, voyage/flight number, conveyance name): the shipment's own
  carrierName/transportMode fields (prisma/schema.prisma Shipment model) plus the richer
  TransportLeg model (vesselName, voyageNumber, flightNumber, carrierCode) — check
  TransportLeg's relation to Shipment and decide how to pick "the" leg if multiple exist
  (e.g. the first/main one) rather than guessing.
- BillOfLadingInput / EquipmentInput (bill of lading number, container/equipment numbers):
  ShipmentTrackingIdentifier (prisma/schema.prisma) — type MBL/HBL/BOOKING for bill of
  lading data, CONTAINER for equipment numbers. Read this model's actual fields before
  assuming which type values apply.
- ContactCancellationInput (contactName/contactPhone): verify whether CustomsFiling or its
  relations have anything resembling a filer contact — if genuinely nothing maps, this is
  exactly the kind of field Entry Summary's own fromCustomsFiling.ts already flags as an
  explicit TODO with no schema home (see its own comments) rather than fabricating a
  placeholder value. Do the same here if there's no real source.

Task: write src/lib/abi/cargoRelease/fromCustomsFiling.ts with a function that maps a
CustomsFiling (with whatever relations it needs loaded — spell out the Prisma `include`
shape explicitly, matching how Entry Summary's version documents its own) into a
CargoReleaseTransactionInput, then composes assembleTransaction() +
wrapBlock()/wrapBatch() into full transmittable bytes, matching
buildAbiTransmissionForFiling()'s shape from the Entry Summary chapter. Use
AbiFilingValidationError (or a chapter-specific equivalent, your call, but follow the
existing naming convention) for genuinely missing required fields — don't fabricate
defaults for anything CBP would reject as invalid.

Write a round-trip test mirroring tests/entry-summary-from-customs-filing.test.ts's
approach: build from a realistic mock CustomsFiling + shipment + TransportLeg +
ShipmentTrackingIdentifier fixture, then decode the result back and spot-check real field
values, not just line count. tests/abi-cargo-release-from-customs-filing.test.ts.

Report back with: the function signature, exactly which Prisma relations/fields you sourced
each CargoReleaseTransactionInput field from, what (if anything) you flagged as having no
real schema home, and test count.
```

</details>

---

## P5 — Cargo Release DB integration, response side (`interpretResponse.ts`) — DONE 2026-08-22, clean

Landed and independently reviewed — clean, no bugs found. Unlike P4, this file only touches
already-verified types (`ParsedCargoReleaseResponse`/`ParsedCargoReleaseHeaderGroup`) and
`errorDictionary.ts`, no Prisma schema fields, so there was no fabrication surface. Its one
real design call — resolving `SE90.messageIdentifierCode` against the master ACE Error
Dictionary rather than the separate "Cargo Release Condition Codes" document the SE90 spec
mentions (which isn't downloaded into this codebase) — is disclosed and defensible. 4/4
tests, part of the same clean full-suite run as P4.

<details>
<summary>Original P5 prompt (for reference)</summary>

```
Internal engineering task, not a PDF extraction — assembling already-verified pieces. Same
category as src/lib/abi/entrySummary/interpretResponse.ts and
src/lib/abi/entrySummaryQuery/interpretResponse.ts — read both as direct models,
particularly entrySummaryQuery's for how it handled a response shape richer than
CustomsResponse's flat fields (it returned a separate structured summary object alongside
CustomsResponseRecordData[] rather than forcing everything into CustomsResponse).

Context: src/lib/abi/cargoRelease/parseResponse.ts (built, PDF-verified, multi-transaction
aware) returns a ParsedCargoReleaseResponse with a headerGroups[] array — each group
carrying its own scenario, disposition, and per-record SE90 errors, but those errors are
still raw OutputDispositionInput records, not error-dictionary-enriched ones. Check whether
Cargo Release's condition/reason codes actually resolve against the same ACE Error
Dictionary the other chapters use, or whether this chapter's own PDF says something
different about where SE90's messageIdentifierCode should be looked up — its own field
description mentions "the Cargo Release Condition Codes document" as a distinct source from
the general ACE Error Dictionary; verify which one actually applies before assuming they're
the same.

Task: write src/lib/abi/cargoRelease/interpretResponse.ts that:
1. Enriches each SE90 error record's condition/reason code — against whichever source you
   confirmed is correct above.
2. Produces CustomsResponseRecordData[] (reuse the exact existing shape, don't invent a
   new one) — since ParsedCargoReleaseResponse now supports multiple header groups, each
   group needs its own filingId attribution; follow entrySummaryQuery's filingIdMap pattern
   (map of an identifying key — likely entry number — to Prisma filingId) rather than
   assuming one filing per response.
3. Handle the multi-group case explicitly in the exported result shape — don't silently
   flatten headerGroups[] results together the way a naive single-group implementation
   would.

Write tests covering: a single-group response, a multi-group response (reuse or adapt the
two-transaction fixture pattern from tests/abi-cargo-release-parse-response.test.ts) proving
each group's records attribute to the right filingId via filingIdMap, and at least one
SE90 error enrichment. tests/abi-cargo-release-response-interpret.test.ts.

Report back with: which source you confirmed for condition-code enrichment and why, the
multi-group filingId attribution approach, and test count.
```

</details>

---

## Cargo Release chapter status: build complete, transport still deferred

Assembly, response parsing, multi-transaction support, and DB integration (both
directions) are all done and independently verified as of 2026-08-22. Same status as
Entry Summary Create/Update and Entry Summary Query: nothing wires this into a live
route yet (`RealAceProvider.transmit`/`getStatus` are still throwing stubs, blocked on
Phase 0's CBP transport confirmation) — that's expected, not a gap in this queue's scope.

---

## Statement Processing — Daily Statement — DONE 2026-08-22, clean

Landed and independently re-verified — clean, no bugs found. Confirmed the structure map
transcription below matches PDF page 9 exactly, and independently grepped the full 42-page
source PDF myself for the "no SE90-style error records" claim (only narrative prose
mentions of "error"/"reject," no actual output error record — accurate). 89/89 chapter
tests, full repo suite 264 files / 3426 tests / 2 pre-existing skips, `tsc` clean. See
`ABI-CERTIFICATION-READINESS.md`'s Phase 3 entry for the full writeup.

<details>
<summary>Original Daily Statement prompt (for reference)</summary>

**This chapter is structurally different from every other Phase 3 chapter checked so far.**
Read the Daily Statement source PDF's own introduction directly (not delegated) —
`docs/plans/catair-source-docs/05-daily-statement.pdf`, pages 6-9 — and it says outright:
"The following table illustrates how repeating groups are structured and **returned** in a
proprietary format Daily Statement **generated by ACE**." Every one of its core records
(Q1, Q2, QA, Q3, Q4, QE, Q5, Q6, QJ, Q7) is CBP-generated output — there is no filer-built
"Daily Statement" transaction to assemble and transmit, unlike Entry Summary/Cargo Release
where the filer builds the input. So the next needed piece isn't an `assembleTransaction.ts`
at all — it's a `parseResponse.ts`-equivalent (composition/parsing logic, the same category
as Cargo Release's P2), grounded in the chapter's own real "Output Record Structure Map"
(PDF page 9, already read and verified directly, not delegated):

```
Daily Statement (M, loop 1)
  Outstanding Action ES Query Response Grouping (C, 1)   -- already known-deferred, see plan doc
  Daily Statement Details Grouping (M, loop 2000)
    Q1  Entry Summary Data, Duty & Tax             (M, 1)
    Q2  Entry Summary Data, Duty & Tax Continued    (M, 1)
    QA  Entry Summary Fees                          (C, 5)
  Preliminary or Final Daily Grouping (C, 1)
    Q3  Daily Payment Due - Statement Totals & Duty/Tax (M, 1)
    Q4  Daily Payment Due - Statement Totals & Duty/Tax (M, 1)
    QE  Daily Payment Due - Fees                        (C, 5)
  Final Daily Statement Grouping (C, 1)
    Q5  Daily Payment - Statement Totals & Duty/Tax (M, 1)
    Q6  Daily Payment - Statement Totals & Duty/Tax (M, 1)
    QJ  Daily Payment - Fees                        (C, 5)
  Q7  Entry Summaries Deleted (C, loop 2000)
```

Also directly confirmed from the same pages: "The application identifier on Record
Identifiers A, B, and Y is PF" — independently cross-checked against this project's own
already-verified `src/lib/abi/batchBlockControl/applicationIdentifierCodes.ts`, which
already lists `{ transactionName: "Daily Statement", responseCode: "PF" }`. Consistent, real,
not something the next prompt needs to re-derive.

```
PDF-grounded task, same category as Cargo Release's parseResponse.ts (P2 above) — composition/
parsing logic for CBP-generated OUTPUT, not a new record layout and not an input-side
assembler (this chapter has none for its core records — see the note above this prompt for
why, already verified directly against the source PDF's own introduction).

Context: src/lib/abi/statement/ has every Daily Statement record built (Q1, Q2, QA, Q3, Q4,
QE, Q5, Q6, QJ, Q7 — see src/lib/abi/statement/index.ts) but parse.ts only has
classifyStatementLine(), no function that walks a full raw Daily Statement and groups its
records per the structure map above. Read src/lib/abi/cargoRelease/parseResponse.ts as the
closest direct model for shape/style (per-occurrence grouping, though this chapter has no
SE90-style per-record error attachment to replicate — verify whether Daily Statement has any
error/condition signaling of its own before assuming it doesn't).

The structure map above (Daily Statement -> Outstanding Action ES Query Response Grouping
[already known-deferred, skip] -> Daily Statement Details Grouping [Q1/Q2/QA, repeats 2000]
-> Preliminary or Final Daily Grouping [Q3/Q4/QE] -> Final Daily Statement Grouping [Q5/Q6/QJ]
-> Q7 [repeats 2000]) is already independently verified against
docs/plans/catair-source-docs/05-daily-statement.pdf page 9 — you don't need to re-derive it,
but DO verify it yourself before writing code (page 9 is short; read it directly) rather than
trusting this transcription blindly, and read pages 10+ for each record's own field layout
before building decode logic, same as every other codec pass in this project.

Task: write src/lib/abi/statement/parseResponse.ts (or parseDailyStatement.ts if that
name fits the chapter's existing conventions better — your call, but be consistent with
however build.ts/types.ts already distinguish Daily from Periodic) with a function that
takes raw Daily Statement lines and returns a structured result matching the grouping above
— an array of entry-summary detail groups (Q1/Q2/QA), the preliminary-or-final payment
totals group (Q3/Q4/QE) when present, the final-statement totals group (Q5/Q6/QJ) when
present, and the deleted-entry-summaries list (Q7) when present. Do NOT build anything for
the "Outstanding Action ES Query Response Grouping" — that's separately, explicitly deferred
per the plan doc, not in scope here.

Non-negotiable evidentiary bar: cite the actual page(s), verify the structure map
transcription above yourself rather than trusting it as given, don't self-verify only via
internal consistency. Flag genuine ambiguity in your report rather than guessing.

Write tests round-tripping a built-then-parsed Daily Statement covering: a preliminary
statement (Q1/Q2/QA + Q3/Q4/QE, no Q5/Q6/QJ), a final statement (adds Q5/Q6/QJ), and at
least one deleted entry summary (Q7) — using build.ts's existing buildQ1Daily()/etc.
functions to construct realistic fixtures, not hand-typed strings.
tests/abi-statement-daily-parse-response.test.ts.

Report back with: the page citation(s) you verified, the type shape you landed on, anything
you found different from the structure map transcription above (if anything), and test
count.
```

</details>

---

## Statement Processing — Periodic Monthly Statement — DONE 2026-08-22, clean

Landed and independently re-verified — clean, no bugs found. All three flagged differences
confirmed correct (application ID, repeat limits, and — specifically re-checked myself — the
Mandatory-vs-Conditional fee-record handling, genuinely tested both the strict-by-default
throw and the explicit `allowMissingFees` opt-in, not just asserted in prose). Also
independently verified the shared reuse of `Q7DeletedInput`/`decodeQ7Deleted` between Daily
and Periodic is genuinely correct — pulled Periodic's own Q7 page from the PDF and confirmed
it's byte-for-byte identical to the existing shared spec, not an unverified shortcut. 102/102
chapter tests, full repo suite 265 files / 3439 tests / 2 pre-existing skips, `tsc` clean.
See `ABI-CERTIFICATION-READINESS.md`'s Phase 3 entry for the full writeup.

<details>
<summary>Original Periodic Monthly Statement prompt (for reference)</summary>

Checked directly against `docs/plans/catair-source-docs/05b-periodic-monthly-statement.pdf`
(pages 5-6, read myself, not delegated) before queuing this. **Also entirely CBP-generated
output**, same as Daily Statement — its own introduction uses the identical phrasing
("returned in a proprietary format Periodic Monthly Statement generated by ACE"), so this
is another `parseResponse.ts`-style task, not an assembler. The record family reuses the
same 2-char codes (Q1/Q2/QA/Q3/Q4/QE/Q5/Q6/QJ/Q7) and near-identical grouping shape to
Daily — already-built `Q1PeriodicInput` etc. types in `src/lib/abi/statement/types.ts`
confirm the codec side is done — BUT three concrete, independently-verified differences
mean this is NOT safe to build by copy-pasting `parseDailyStatement.ts` and swapping
type names:

1. **Application identifier is `MS`, not `PF`.** PDF page 5: "The application identifier
   on Record Identifiers A, B, and Y is MS." Independently cross-checked against this
   project's own `src/lib/abi/batchBlockControl/applicationIdentifierCodes.ts`, which
   already lists `{ transactionName: "Periodic Monthly Statement", responseCode: "MS" }` —
   confirmed, not something to re-derive.
2. **Repeat limits are 9,999, not 2,000.** PDF page 6's Output Record Structure Map:
   "Periodic Daily Statement Details Grouping" and "Entry Summaries Deleted" (Q7) both
   loop-repeat 9,999 — Daily Statement's equivalents cap at 2,000.
3. **QA/QE/QJ fee records are Mandatory (M), not Conditional (C).** Daily Statement's
   structure map marks these fee-detail records "C" (optional); Periodic's marks the exact
   same three record types "M" (mandatory) at loop-repeat 5. A parser that treats an absent
   QA/QE/QJ group as fine (correct for Daily) would be silently wrong for Periodic. Verify
   this yourself against the real page rather than trusting this summary, and decide how
   your parser should actually enforce (or not enforce) mandatory-fee-record presence —
   don't just copy Daily's permissive handling without considering whether it's still right
   here.

```
PDF-grounded task, same category as the Daily Statement parseResponse.ts task above (already
landed — read src/lib/abi/statement/parseDailyStatement.ts as your direct structural model,
but do NOT assume its permissive/lenient handling of every group carries over unchanged —
see the three confirmed differences above, especially QA/QE/QJ's Mandatory designation).

Context: src/lib/abi/statement/ already has every Periodic record built (Q1PeriodicInput
through Q7-equivalent — check types.ts and recordSpecs.ts for the exact existing names,
they may not be named identically to Daily's) via build.ts's buildQ1Periodic() etc., but
there's no response-parsing/composition function for this record family, mirroring the gap
parseDailyStatement.ts just filled for Daily.

Task: write src/lib/abi/statement/parsePeriodicStatement.ts with a function that takes raw
Periodic Monthly Statement lines and returns a structured result matching this chapter's
own Output Record Structure Map (PDF page 6, docs/plans/catair-source-docs/05b-periodic-monthly-statement.pdf
— verify it yourself directly before writing code, don't trust the summary above blindly):
Periodic Daily Statement Details Grouping (Q1/Q2/QA, repeats 9,999), Preliminary-or-Final
PMS Grouping (Q3/Q4/QE), Final Periodic Monthly Statement Grouping (Q5/Q6/QJ), Entry
Summaries Deleted (Q7, repeats 9,999). Read pages 7+ for each record's own field layout
before building decode logic if the existing Q1PeriodicInput-family types need any
cross-checking, same as every other codec pass in this project — though the record
specs themselves are already built, so this task is composition/parsing logic on top of
what exists, not new record derivation.

Non-negotiable evidentiary bar: cite the actual page(s), verify the three differences listed
above (and the base structure) against the real PDF yourself, don't self-verify only via
internal consistency. Flag genuine ambiguity in your report rather than guessing.

Write tests round-tripping a built-then-parsed Periodic Monthly Statement covering: a
preliminary statement, a final statement, at least one deleted entry summary (Q7), and
specifically a case exercising the QA/QE/QJ Mandatory-vs-Conditional difference from Daily
(whatever your parser decides to do when one is absent — assert that behavior explicitly,
don't leave it untested). Use build.ts's existing buildQ1Periodic()/etc. functions to
construct fixtures, not hand-typed strings. tests/abi-statement-periodic-parse-response.test.ts.

Report back with: the page citation(s) you verified, confirmation of (or correction to) the
three differences listed above, the type shape you landed on, anything else you found
different from Daily Statement's shape, and test count.
```

</details>

---

## Statement Processing — DB integration, response side (both Daily and Periodic) — DONE 2026-08-22, one real gap flagged (not fixed)

Landed. Daily's per-entry `filingIdMap` attribution is genuinely correct (`Q1DailyInput`
really has `entryFilerCode`/`entryNumber`). **Periodic's is not the same granularity,
despite being described in parallel terms as "per-entry" in the walkthrough report** —
independently checked `Q1PeriodicInput` and confirmed it has no `entryFilerCode`/
`entryNumber` at all, only `periodicDailyStatementFilerCode`/`periodicDailyStatementNumber`,
because Periodic's Q1 represents a rolled-up *daily statement* (potentially containing many
entry summaries), not one entry summary. The code itself handles this honestly (attributes
via a statement-number key, tests the `defaultFilingId` fallback explicitly) — not a bug —
but a caller assuming entry-number keying (the natural assumption from Daily's convention)
would find every Periodic Q1/Q2/QA `CustomsResponse` row silently falling through to
`defaultFilingId`. **Not fixed this round — needs a deliberate design decision** (should
these rows be per-filing at all, or only live in the summary object?) before this is wired
into anything real. Also confirmed `StatementRecord`/`StatementFeeLine` Prisma models are
real (verified at `prisma/schema.prisma` ~line 6370) — the recommendation to defer
persistence and return a structured summary instead was reasonable. 111/111 chapter tests,
full repo suite 267 files / 3448 tests / 2 pre-existing skips, `tsc` clean. See
`ABI-CERTIFICATION-READINESS.md`'s Phase 3 entry for the full writeup.

<details>
<summary>Original Statement DB-integration prompt (for reference)</summary>

```
Internal engineering task, not a PDF extraction — assembling already-verified pieces. Same
category as Cargo Release's interpretResponse.ts (P5) and Entry Summary Query's — read both
as direct models, particularly Entry Summary Query's for how it handled response data richer
than CustomsResponse's flat shape (a separate structured summary object alongside
CustomsResponseRecordData[], not forced into columns that don't fit).

Context: src/lib/abi/statement/parseDailyStatement.ts and parsePeriodicStatement.ts (both
built, PDF-verified) return ParsedDailyStatementResponse / ParsedPeriodicStatementResponse —
each has a details[] array (one entry per Q1/Q2/QA group, keyed by entryFilerCode+entryNumber,
same correlation key already used by entrySummaryQuery's filingIdMap pattern) plus
STATEMENT-LEVEL totals (Q3/Q4/QE preliminary-or-final, Q5/Q6/QJ final) that are NOT per-filing
— one statement's totals cover every entry summary listed in its details[], which will
usually span MANY different CustomsFiling records, not one. This is a materially different
shape from every DB-integration task done so far (Entry Summary, Entry Summary Query, Cargo
Release all mapped one response to one filing, or one response to N independently-scoped
transactions) — don't force this into the same per-filing CustomsResponse-record pattern
without thinking about it; this is exactly the kind of design question to solve deliberately
and report back on, not silently pick.

Task: write src/lib/abi/statement/interpretDailyStatement.ts and interpretPeriodicStatement.ts
(or one shared module if the two response shapes are similar enough to justify it — your
call, but explain the choice) that:
1. Maps each details[] entry to its CustomsFiling via a filingIdMap
   (Record<`${entryFilerCode}-${entryNumber}`, filingId>, same convention as
   entrySummaryQuery/interpretResponse.ts) and produces CustomsResponseRecordData[] for the
   per-entry duty/tax/fee data — reuse the exact existing shape, don't invent a new one.
2. Decide what to do with the statement-level totals (Q3/Q4/QE, Q5/Q6/QJ) and the deleted-
   entry-summaries list (Q7) — these don't belong to one filing. Consider: do they need their
   own Prisma model (check prisma/schema.prisma for anything already resembling a "statement"
   concept before assuming one needs to be added — search for Statement-prefixed models), or
   is a returned-but-not-persisted structured object sufficient for now given nothing calls
   this yet? Don't add a Prisma model yourself without flagging it as a recommendation first,
   same discipline as prior DB-integration passes in this project.
3. Handle Q7 (deleted entry summaries) similarly — each deletion references a specific
   entryFilerCode+entryNumber, so it CAN map to one filing's CustomsResponseRecordData; do so.

Write tests covering: a preliminary statement with multiple detail entries mapping to
different filingIds via filingIdMap, a final statement, and at least one Q7 deletion
correctly attributed. tests/abi-statement-daily-response-interpret.test.ts and
tests/abi-statement-periodic-response-interpret.test.ts (or one combined file if you went
with a shared module — match your file structure to your module structure).

Report back with: the statement-level-totals design decision and why, whether you found any
existing Prisma model this should reuse, the filingIdMap attribution approach, and test count.
```

</details>

---

## Statement Processing chapter status: response-side build complete, one flagged gap, transport/DB-write still deferred

Response parsing and DB-integration mapping are done and independently verified for both
Daily and Periodic flows as of 2026-08-22. Two things intentionally left open, not gaps in
this queue's scope: (1) the Periodic per-detail-group `filingId` attribution granularity
issue flagged above — needs a deliberate design decision before real use; (2) SU/RM/PN
input transactions and the "Outstanding Action ES Query Response Grouping" remain
explicitly deferred per the chapter's own scope boundary set at the start of this queue.
Nothing wires any of this into a live route yet, same as every other chapter.

## Not queued here
- **Statement Processing — Periodic Monthly Statement's own structure/parsing** — a
  separate source document (`docs/plans/catair-source-docs/05b-periodic-monthly-statement.pdf`)
  with its own record family (periodic-variant Q1-Q6, already built in `src/lib/abi/statement/`
  alongside the Daily records) and, per the Daily Statement chapter's own text, a genuinely
  different processing model (Periodic Daily + Periodic Monthly statements sent together when
  payment indicators 6/7/8 are used) — not yet checked whether it's also output-only or has a
  real input side. Queue once the Daily Statement prompt above lands and is verified.
- **Bond/eBond, Drawback, PGA Message Set assembly layers** — same gap likely exists in all
  three (confirmed by `ls` for the absence of an `assembleTransaction`-equivalent; not yet
  checked whether any of them share Statement's output-only wrinkle). Deliberately doing one
  chapter at a time rather than firing off several similarly-shaped prompts at once — this
  project's own history (Cargo Release's first pass, PGA, Drawback) shows oversized/parallel
  scope is exactly what produces fabricated-but-self-consistent output. Queue the next one
  once this one is verified.
- **Bond/eBond real surety/ACE verification** (replacing the `status: "Unverified"`
  placeholder) — this is a different kind of work entirely, not a codec/assembly gap. It
  needs a real verification data source (surety company / ACE lookup), which doesn't exist
  in this codebase yet and isn't a wire-format question. Worth scoping separately once the
  eBond chapter's own assembly + DB integration work is done.
