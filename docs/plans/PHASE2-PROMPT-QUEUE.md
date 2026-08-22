# Phase 2 Prompt Queue — Entry Summary Query DB integration

Same category of work as `PHASE1-PROMPT-QUEUE.md` — assembling already-built, already-verified
codec pieces against real Prisma models, not deriving any new record layout from a PDF. Same
workflow: paste into Antigravity, post the result back in chat, gets verified before it's
treated as done.

**Why this one, next.** `docs/plans/ABI-CERTIFICATION-READINESS.md` Phase 2's remaining item is
Entry Summary Query — needed to check the status of what's already been filed. Its codec
(`src/lib/abi/entrySummaryQuery/`) is fully built and PDF-verified (§2 sequence 3), same as
Entry Summary Create/Update's was before `fromCustomsFiling.ts` wired it to the database. This
prompt is that same wiring step for the Query chapter — the one thing missing between "codec
exists" and "a route could actually use this."

---

## P1 — `fromCustomsFiling`-equivalent for Entry Summary Query (request side)

```
Internal engineering task, not a PDF extraction — assembling already-verified pieces.

Context: read src/lib/abi/entrySummary/fromCustomsFiling.ts first — it's the direct model
for this task. It maps Prisma CustomsFiling + relations into EntrySummaryTransactionInput,
calls assembleTransaction(), then wrapBlock()/wrapBatch() from
src/lib/abi/batchBlockControl/build.ts to produce full transmittable batch/block bytes. This
task does the same thing for the Query chapter, which is much simpler on the request side —
src/lib/abi/entrySummaryQuery/assembleQuery.ts already has assembleEntryNumberQuery(entries:
EntryReference[], opts) and assembleCriteriaQuery(criteria, opts); EntryReference is just
{ entryFilerCode: string; entryNumber: string } (src/lib/abi/entrySummaryQuery/types.ts).

Task: write src/lib/abi/entrySummaryQuery/fromCustomsFiling.ts with a function that takes
one or more accountId-scoped CustomsFiling records and produces EntryReference[], then
composes assembleEntryNumberQuery() + wrapBlock()/wrapBatch() into full transmittable bytes
— same composition shape as buildAbiTransmissionForFiling() in the Create/Update chapter's
version, reuse its EnvelopeHeaderOptions type if it fits as-is, or explain in your report
if Query's envelope needs something different.

Two things to get right, not assume:
1. entryFilerCode does NOT come from CustomsFiling — that model has no filer-code field
   (verified by grep). It comes from the account's AbiFilerCredential.filerCode
   (prisma/schema.prisma, built in the Phase 1 credential-model pass — one per Account).
   Your function should take the resolved AbiFilerCredential (or just its filerCode string)
   as an explicit parameter, not query for it itself.
2. CustomsFiling.entryNumber's own schema comment says "see authorityReference on
   CustomsResponse" — that field does not exist anywhere in CustomsResponse (verified by
   grep, prisma/schema.prisma ~line 1309). The comment is stale. Don't go looking for a
   second field; CustomsFiling.entryNumber is what you have, and Appendix E check-digit
   validity should hold for it already (src/lib/abi/entryNumber.ts) — verify that inline
   rather than assuming.

Also add a second function for a date-range criteria query (assembleCriteriaQuery) ONLY if
you can point to a real, already-existing use case for it in the codebase (e.g. an
account-wide "what's the status of everything I've filed this month" query) — otherwise
skip it and say so in your report; don't build speculative API surface.

Write a round-trip test mirroring tests/entry-summary-from-customs-filing.test.ts's
approach: build from mock CustomsFiling + AbiFilerCredential records, then decode the
result back with decodeRecord() (src/lib/abi/fixedWidth.ts) against the relevant
RecordSpecs (ENTRY_NUMBER_QUERY_REQUEST_SPEC etc. — there's no dedicated parseJ1Record
wrapper, decodeRecord() directly against the spec is the right tool here) to confirm the
round trip is lossless. tests/entry-summary-query-from-customs-filing.test.ts.

Report back with: function signatures, what you did about the criteria-query decision, and
test count.
```

---

## P2 — `interpretResponse`-equivalent for Entry Summary Query (response side)

```
Internal engineering task, not a PDF extraction — assembling already-verified pieces.

Context: read src/lib/abi/entrySummary/interpretResponse.ts first — it's the direct model.
It enriches parsed E1 condition records against src/lib/abi/errorDictionary.ts and produces
CustomsResponseRecordData[] shaped for the existing Prisma CustomsResponse model. This task
does the same for Entry Summary Query's response, which is richer — parseQueryResponse()
(src/lib/abi/entrySummaryQuery/parse.ts) already returns a ParsedQueryResponse covering
status detail, liquidation info, bond/surety info, bill/collection detail, and
QueryReturnedCondition records (read parseQueryResponse's return type in
src/lib/abi/entrySummaryQuery/types.ts before writing anything — don't guess its shape).

Task: write src/lib/abi/entrySummaryQuery/interpretResponse.ts that:
1. Resolves each QueryReturnedCondition's condition/reason code through
   getAllAbiErrors() (src/lib/abi/errorDictionary.ts), same ambiguous-multi-match handling
   as enrichE1Record() (surface every match, don't collapse).
2. Produces CustomsResponseRecordData[] — reuse the exact shape from
   src/lib/abi/entrySummary/interpretResponse.ts (accountId, filingId, code, title,
   description, status) rather than inventing a new one; the existing Prisma
   CustomsResponse model this feeds into already matches that shape exactly (verified by
   reading prisma/schema.prisma ~line 1309 — no new model needed here).
3. Also surfaces the richer status/liquidation/bond fields ParsedQueryResponse carries that
   Entry Summary Create/Update's response never had (liquidation date/amount, estimated
   revenue, bond/surety status) — these don't fit CustomsResponse's flat code/title/
   description/status shape. Don't force them in. Return them as a separate structured
   object alongside the CustomsResponseRecordData[] array, and say explicitly in your
   report whether you think CustomsResponse needs new columns for these or a separate model
   — a judgment call to flag, not to make unilaterally by extending the schema yourself.

Write tests mirroring tests/entry-summary-response-interpret.test.ts's approach — real
built-then-parsed fixtures (use build.ts/parse.ts round-trip, not hand-typed fixed-width
strings), covering at least one ambiguous condition code (same kind of check as
tests/entry-summary-response-interpret.test.ts already does) and one response carrying
liquidation/bond info to prove the separate structured object actually gets populated.
tests/entry-summary-query-response-interpret.test.ts.

Report back with: the shape of the separate liquidation/bond object you designed, your
recommendation on whether CustomsResponse needs schema changes (and why), and test count.
```

---

## Status

Both P1 and P2 landed 2026-08-22 and are verified — see `ABI-CERTIFICATION-READINESS.md`
Phase 2's checklist for the full writeup, including two real bugs caught in review and
fixed (a wrong `applicationIdentifierCode` default, and a `tsc`-only import error vitest
couldn't see).

## Not queued here

- **Wiring either of the above into an actual route** — no route calls
  `buildAbiTransmissionForFiling()` yet either (confirmed by grep in the Phase 1 pass), and
  `RealAceProvider.transmit`/`getStatus` are still throwing stubs blocked on Phase 0. Revisit
  once real transport exists; premature before then.
- **AD/CVD rate data (Phase 2's other open bullet)** — already resolved as of a prior,
  unrelated pass; `docs/plans/review/OPEN-ITEMS.md` #20 is marked `[RESOLVED]`. Nothing to
  queue here, just needs the Phase 2 checklist bullet checked off next time that doc is
  touched.
