# Phase 1 Prompt Queue — foundational transmission infrastructure

Phase 1 of `docs/plans/ABI-CERTIFICATION-READINESS.md` (§3) is different in kind from the
CATAIR chapter/reference-data work in `ANTIGRAVITY-PROMPT-QUEUE.md` and
`CODEC-COMPLETION-QUEUE.md` — those were PDF-grounded record-layout extractions; this is
internal application engineering (route wiring, credential modeling, assembling
already-verified codec pieces). Same workflow as before regardless: paste each prompt into
Antigravity, post the result back in chat, it gets verified before being treated as done.

**Scoped down from the full Phase 1 checklist.** Two of the four Phase 1 bullets are not
included here because they're genuinely blocked, not because they were skipped:

- **Actual CBP transport connection** (the core of `RealAceProvider.transmit`/`getStatus`) —
  blocked on Phase 0's still-open items: no CBP test-environment credentials yet, and no
  Client Rep confirmation of which transport option applies to a new vendor in 2026. The
  general ABI Requirements overview (`docs/plans/catair-source-docs/00-abi-requirements-overview.pdf`,
  read directly, not queued below — it's 8 pages of narrative policy text, not a
  record-layout table, so it didn't need Antigravity's extraction treatment) does list CBP's
  actual transport menu — MQIPT, Internet-based IPSEC/IKEv2 LAN-to-LAN, AT&T MPLS VPN,
  Service Centers, and VANs, plus a mandatory Interconnection Security Agreement (ISA) for
  any direct/SFTP connection — which **corrects** the plan doc's shorthand "VAN/AS2/direct
  connect"; there's no AS2 option in CBP's own list. Still not enough to write real transport
  code against without the Client Rep confirming which of these Qubere should build for.
- **Batch & Block Control envelope + CATAIR fixed-length serializer** (Phase 1 bullets 1–2) —
  already built. `src/lib/abi/batchBlockControl/` is the envelope (A/B/Y/Z wrap/unwrap,
  X0/X1 diagnostics) and `src/lib/abi/entrySummary/` (plus every other chapter) already
  serializes against CBP's real published field positions, not the old internal
  `catair-ae-2024.1` reference layout the U9 spec targeted. No new prompt needed; this is a
  documentation-reconciliation note for whoever next updates the Phase 1 checkboxes.

What's left and genuinely buildable right now, without CBP access, is below: idempotency on
the transmission-adjacent routes, a real per-customer credential model (the plan doc's claim
of an existing `FilerProfile.transportConfig` secret-ref pattern to reuse is **fabricated** —
verified by grep, no such model or field exists anywhere in `prisma/schema.prisma` or `src/`;
see P2 for what does exist and why it's not good enough to copy), and wiring
`RealAceProvider.parseAcknowledgment` up to the already-built, already-PDF-verified
batch/block + entry-summary response parsers instead of leaving it a stub.

---

## P1 — Idempotency on transmission-adjacent filing routes

```
Internal engineering task, not a PDF extraction — no source document for this one.

Context: this codebase already has a working idempotency pattern —
src/lib/api/idempotency.ts's checkIdempotency()/persistIdempotency() — used correctly in
src/app/api/filing/[id]/transmit/route.ts, .../cancel/route.ts, .../approve/route.ts, and
.../resubmit/route.ts. Read transmit/route.ts first; it's the reference implementation:
call checkIdempotency(req, ctx.accountId, requestId) right after auth/param validation,
return cachedResponse or idempError immediately if present, do the mutation, then call
persistIdempotency(ctx.accountId, idempotencyKey, requestHash ?? "", 200, responsePayload)
right before returning — only when idempotencyKey is set (the header is optional; requests
without it just don't get replay protection).

Task: apply this exact same pattern to the mutation routes below, which currently have none
of it (verified by grep — zero hits for checkIdempotency in each). These are the
"transmission-adjacent" routes per docs/plans/ABI-CERTIFICATION-READINESS.md Phase 1 — a
retried request must never double-file, double-create, or silently clobber a concurrent
edit:

- POST src/app/api/filing/route.ts (creates a new CustomsFiling — the highest-value one
  here, since a network retry on filing creation today creates a duplicate filing case)
- PATCH src/app/api/filing/[id]/route.ts
- POST src/app/api/filing/[id]/validate/route.ts (check whether this route actually
  mutates anything or is read-only-with-side-effects before deciding it needs replay
  protection — don't assume from the HTTP verb alone; report what you find)
- PATCH src/app/api/filing/[id]/currency/route.ts
- PATCH src/app/api/filing/[id]/declaration/route.ts
- POST src/app/api/shipments/[id]/pipeline-retry/route.ts (note: this one does NOT use
  withAuthenticatedRoute like the others — it uses authorizeWrite() + manual requestId
  generation; check how req is obtained/available in that handler shape before wiring
  checkIdempotency, which needs the Request object)

Do NOT touch any other route outside this list — the broader "8 of ~150 mutation routes"
gap tracked in docs/plans/review/OPEN-ITEMS.md #78 is a separate, much larger effort; this
prompt is scoped to the transmission-adjacent set only.

For each route, add a test (or extend an existing test file for that route if one exists —
check tests/ first) proving: (1) two identical requests with the same Idempotency-Key header
return the same response and only mutate the database once, (2) two requests with different
keys (or no key) are treated independently.

Report back with: which routes got idempotency added, what validate/route.ts turned out to
actually do (mutate or not, and what you decided as a result), and test count.
```

---

## P2 — Per-customer ABI filer credential model

```
Internal engineering task, not a PDF extraction.

Context — read this before writing any code: docs/plans/ABI-CERTIFICATION-READINESS.md
Phase 1 says to use "the existing secret-ref pattern from FilerProfile.transportConfig."
That pattern does not exist. There is no FilerProfile model in prisma/schema.prisma and no
transportConfig field anywhere in the codebase (confirmed by grep across prisma/ and src/).
Do not go looking for it a second time or assume you missed it — start from the fact that
this needs to be designed, not reused.

What DOES exist, for reference on what NOT to copy: prisma/schema.prisma's
IntegrationConfig model (~line 6082) stores third-party integration credentials as plain
String? apiKey / apiSecret columns — i.e., plaintext in Postgres. That's an existing pattern
in this codebase, but it is not acceptable for CBP ABI filer credentials: these authenticate
real federal customs filings on behalf of Qubere's broker-customers, filed under each
customer's own legal filer code (see Open Question A in the plan doc — Qubere is a
software vendor transmitting under each customer-broker's own credentials, not its own).
A leaked filer password is a leaked ability to file customs entries as that broker.

Task: design and build a new Prisma model — something like AbiFilerCredential — scoped
per Account (one Qubere customer = one broker = one CBP filer code/credential set, per
Open Question A's resolution), storing:
- the filer code itself (not secret, fine as plaintext — it's an identifier CBP assigns,
  comparable to a username)
- a secretRef: an opaque string identifier pointing to where the actual credential
  (password/certificate/whatever CBP's ISA process ends up requiring — unknown yet, see
  the plan doc's Phase 0 open items) is actually stored in an external secret store. Do
  NOT store the raw secret value in this table. You do not need to build or pick the actual
  external secret store integration (that depends on infra decisions outside this task) —
  just the reference/pointer shape, plus a small pluggable resolver interface (e.g. an
  injected function/interface that turns a secretRef into the real secret at call time,
  with a throwing not-implemented default) so the real secret-store integration can be
  dropped in later without another schema change.
- whatever else RealAceProvider needs per-customer to operate: baseUrl/environment
  (sandbox vs production), status (active/inactive), createdAt/updatedAt.

Then update src/lib/filing/transmissionProvider.ts's RealAceProvider: today its
constructor reads a single global process.env.CBP_ABI_FILER_CODE /
CBP_ABI_FILER_PASSWORD — replace this with a per-customer lookup (accept an accountId or
the resolved AbiFilerCredential record at construction/call time instead of reading
process.env directly). Keep transmit()/getStatus() throwing "not yet implemented" — this
task is the credential model only, not the real HTTP calls (those are blocked on CBP
transport confirmation, tracked separately). Write tests for the new model and the
credential-resolution path; do not attempt to wire this into any live route yet.

Report back with: the schema you designed (and why, if you deviated from the shape
sketched above), how RealAceProvider's constructor changed, and test count.
```

---

## P3 — Wire RealAceProvider.parseAcknowledgment to the already-built response parsers

```
Internal engineering task, not a PDF extraction — this assembles already-verified pieces,
it does not derive any new record layout.

Context: src/lib/filing/transmissionProvider.ts's RealAceProvider.parseAcknowledgment(raw)
currently just throws "not yet implemented." Meanwhile, two full response-parsing pipelines
already exist and are independently PDF-verified:
- src/lib/abi/batchBlockControl/parse.ts — classifyLine() and parseOutput*/parse*Record
  functions for the A/B/Y/Z envelope and the X0/X1 diagnostic records (batch/block-level
  rejections — e.g. a whole batch rejected before any transaction inside it is even
  evaluated).
- src/lib/abi/entrySummary/ — parseEntrySummaryResponse (in parse.ts) reads the E0/E1
  transaction-level disposition records, and interpretResponse.ts's
  interpretEntrySummaryResponse()/enrichE1Record() enrich those against the full CBP error
  dictionary (src/lib/abi/errorDictionary.ts, all 1054 real condition codes).

Neither pipeline is called from anywhere outside src/lib/abi/ and their own tests yet
(verified by grep) — this task is the first real caller.

Task: implement RealAceProvider.parseAcknowledgment(raw: string) to:
1. Split raw into fixed-width lines and classify each with batchBlockControl's
   classifyLine().
2. If the response is a batch/block-level rejection (X0/X1, or a B/Y/Z ACE-generated
   record indicating rejection — check the actual ACE_GENERATED specs in
   src/lib/abi/batchBlockControl/recordSpecs.ts for how rejection is actually signaled,
   don't guess), return an AcknowledgmentResult with accepted: false and
   rejectionReasons drawn from the X0/X1 record's condition codes resolved through
   errorDictionary.ts's getAllAbiErrors().
3. Otherwise, treat the payload as an Entry Summary response and delegate to
   parseEntrySummaryResponse() + interpretEntrySummaryResponse(), mapping the result into
   this file's own AcknowledgmentResult shape (accepted / responseCode / rejectionReasons
   / raw). Note the type mismatch you'll hit here: AbiPayload/TransmissionResult in this
   file are an older, simpler shape than EntrySummaryTransactionInput/
   ParsedEntrySummaryResponse in src/lib/abi/entrySummary/types.ts — don't silently paper
   over this by inventing fields. Report the mismatch and either (a) propose the minimal
   mapping that's actually correct, flagging anything lossy, or (b) if you find the two
   shapes are irreconcilable without a larger interface change, stop and report that
   instead of forcing it.

Leave transmit() and getStatus() as throwing stubs — untouched, out of scope, blocked on
real CBP transport access. Write tests covering: a batch-level rejection input, an
entry-summary-level accept, an entry-summary-level reject with multiple E1 conditions, and
at least one condition code that matches multiple ambiguous errorDictionary entries (the
dictionary has 27 of these — pick one and verify getAllAbiErrors' actual behavior, don't
assume single-match).

Report back with: the type-mismatch decision you made and why, test count, and any batch/
block-level rejection signaling detail you had to look up in recordSpecs.ts to get step 2
right.
```

---

## Not queued here

- **Real HTTP transport** for `RealAceProvider.transmit`/`getStatus` — blocked on Phase 0
  (CBP test credentials + Client Rep transport confirmation). Queue once that lands.
- **Wiring `buildAbiTransmissionForFiling()` into the live transmit route** — premature
  while `transmit()` still can't actually send anything; revisit once P2 (credentials) and
  real transport both exist. `src/lib/canonicalMessaging/devStub.ts`'s simulated
  ACCEPTED/CANCELLED responses stay in place as the active dev-mode behavior until then —
  it's outside this queue's scope to touch the multi-country canonical messaging consumer
  itself, only `RealAceProvider`'s own parsing (P3).
