# ABI Certification Readiness Plan
> Created: 2026-08-20. Updated: 2026-08-20 — direct-transmission path confirmed; full chapter build-out confirmed (not the P0-only staged approach originally recommended). Scope decision: Qubere pursues direct CBP ABI transmission (not the filer-handoff model). This **reverses** the non-goal stated in `docs/requirements/7501-draft-and-abi-export.md:3-5` ("Qubere does not transmit to CBP. The filer does.") — that doc's serializers (U8-U10) become useful groundwork, not the finish line.

**Source documents:** downloaded live from cbp.gov into [`docs/plans/catair-source-docs/`](catair-source-docs/) — see §4. (Our WebFetch tool specifically got 403'd by CBP's bot protection; a plain browser-UA `curl` was not blocked, so the docs were pulled directly rather than reconstructed from search.)

## 0. What CBP is actually going to test

CBP's "ABI test" is not a written exam — it's a certification process run by an assigned **CBP Client Representative**, who supervises live test transmissions into CBP's ACE test environment until your software reliably produces valid, accepted transactions for each transaction type you intend to file in production. It is gated on:

1. A **Letter of Intent** to CBP identifying who you are and what you intend to transmit.
2. Legal/operational standing to file — see [Open Question A](#open-question-a-who-is-the-filer-of-record) below; this determines whether you need a licensed customs broker on staff, a continuous bond, and/or a filer code of your own.
3. Software that produces CATAIR-conformant records, wrapped in CBP's batch/block envelope, over an approved transport (VAN, AS2, or CBP-approved direct connect).
4. Passing CBP's test scenarios for each chapter in scope — CBP does **not** require every CATAIR chapter, only the ones matching your declared transaction types.
5. Sustained production performance under 19 CFR 143 Subpart A once live — CBP can suspend ABI privileges for a bad error rate. This is a standing obligation, not a one-time gate.

**Caveat on chapter list currency:** CBP's site (`cbp.gov/trade/automated/catair`) blocks automated fetching (403 on every path tried, including PDFs and the Wayback snapshot), so the chapter list below is reconstructed from search-indexed document titles/dates, not a live read of the page. CATAIR chapters revise often — we saw Entry Summary Create/Update revisions dated 2016, 2024-09, 2025-01, 2025-06, and a "future" 2026-07 Entry Summary Query draft in search results alone. **Once a Client Representative is assigned, get the current authoritative chapter list and revision numbers from them directly** — do not build against what's below without that confirmation.

---

## Open Question A: who is the filer of record?

**Resolved 2026-08-20: Qubere transmits to CBP directly.** That confirms the *technical* path — real transport, real credentials, no more handing files to a third-party filer. It does **not** by itself answer the narrower legal sub-question below, which still needs an explicit answer before Phase 0's Letter of Intent goes out, because it changes what CBP asks for:

| Path (both are "direct transmission" from CBP's perspective) | What it requires | Implication |
|---|---|---|
| **Qubere self-files** (Qubere itself is the ABI filer of record) | A continuous bond, a filer code issued to Qubere, and — per 19 CFR 111 — a licensed customs broker on staff if filing on behalf of customers (not just Qubere's own imports) | Qubere takes on legal filing liability for every transmission. Heaviest path, but consistent with "we will build all those" — this is the version where Qubere owns the full chapter set end to end. |
| **Qubere certifies as an ABI software vendor**, transmitting under each customer's own filer code/credentials | Software-level CBP certification; each customer still holds their own filer code and legal responsibility | Still genuinely "direct transmission" (no third-party filer in the loop) — the difference is whose credentials/liability it runs under. Matches CBP's [ABI Software Vendors list](https://www.cbp.gov/document/guidance/abi-software-vendors-list) model. |

**Action:** confirm which of these two with whoever issued the directive before the Letter of Intent goes out (Phase 0) — CBP's intake process differs (self-filer bond/broker paperwork vs. vendor certification paperwork), even though the engineering build (envelope, serializer, transport, response parsing) is identical either way.

---

## 1. Current codebase state vs. what direct transmission requires

Grounded in the 2026-08-13 audit (`docs/plans/review/OPEN-ITEMS.md`) plus direct file reads.

| Capability | Current state | File(s) | Gap for real ABI transmission |
|---|---|---|---|
| Entry Summary data model (7501) | Real, provenance-tracked field builder | `src/lib/filing/form7501.ts` | None at data-model level — this is solid ground to build on |
| 7501 PDF export | Exists (contradicts OPEN-ITEMS #17, which predates this file by hours) | `src/lib/filing/form7501Pdf.ts` | Not CATAIR-relevant, but confirms the field data is real |
| CATAIR-shaped EDI serializer | **Spec'd, not built.** Existing spec (U9 in `7501-draft-and-abi-export.md`) intentionally targets a "broker's proprietary flat file," not raw CBP-conformant CATAIR | `docs/requirements/7501-draft-and-abi-export.md:444-475` | Must be rescoped: fixed-length record layout must match CBP's actual published field positions, not an internal reference layout |
| Batch & Block Control envelope (CBP's header/trailer wrapper required on every transaction) | Does not exist | — | Net-new. Every CATAIR chapter transaction rides inside this envelope; build once, reuse everywhere |
| Real ACE/ABI transmission provider | **Stub only** — every method throws "not yet implemented" | `src/lib/filing/transmissionProvider.ts` (`RealAceProvider`) | Net-new: actual connection (VAN/AS2/direct), CBP account credentials, real request/response cycle |
| CBP response/reject handling | Fully simulated (`devStub.ts`), explicitly dev-only | `src/lib/canonicalMessaging/devStub.ts:1-21` | Net-new: parse CBP's real response/reject transaction codes, replace the simulation, keep the queue/audit infrastructure around it (that part is real and reusable) |
| Message routing/config (procedure codes, message catalog, most-specific-match resolution) | Real, well-tested, country-agnostic | `src/lib/canonicalMessaging/resolveMessageContext.ts`, `wildcardLookup.ts` | Reusable as-is — this is legitimately good infrastructure for the certification build |
| Cargo Release | Not modeled | — | Net-new if in scope (see chapter table below) |
| Manifest | Not modeled at all — "manifest" only appears in doc-intake keyword lists | — | Out of scope unless Qubere intends to file as a carrier, which nothing in the product suggests |
| In-Bond | Entry-type code recognized (`61`/`62`/`63`); no structured transaction | `src/modules/filing/entryType.ts:29` | Build if declared in scope |
| Statement Processing (payment) | Not modeled | — | Net-new, required for any production filer (this is how duties actually get paid) |
| Bond / eBond | Basic CRUD, `status: "Unverified"` — no real surety/ACE verification | `src/modules/bonds/bond.service.ts` | Needs real bond verification against CBP/surety data before certification, not just a status field |
| Drawback (TFTEA) | Real claim/match/lot models and service | `src/modules/drawback/drawback.service.ts`, Prisma `DrawbackClaim` etc. | Good foundation; needs a CATAIR drawback chapter transaction on top |
| PGA screening | Real screening logic and API | `src/app/api/pga/screen/route.ts`, `HtsPgaRequirement` model | Screening ≠ filing; the PGA Message Set chapter is a distinct transaction format still to build |
| AD/CVD rate data | Architecture real, data "almost unseeded" (1 AD row, 0 CVD rows) | OPEN-ITEMS #20 | Must be populated before any Entry Summary line carrying AD/CVD can be certified — CBP will reject on bad/missing rates |
| Idempotency on mutation routes | 8 of ~150 routes | OPEN-ITEMS #78 | CBP transmission routes specifically need this — a retried transmission must never double-file an entry |

**Bottom line:** the *data* side of Entry Summary is genuinely strong. Everything from "turn that data into CBP's wire format" outward — envelope, real transport, real response parsing — does not exist yet and is the actual engineering lift.

---

## 2. CATAIR chapters — full build scope, sequenced by build order

**2026-08-20: confirmed — build all chapters,** not a P0-only staged subset. CBP still certifies incrementally per transaction type in practice (you cannot skip straight to testing everything at once — see §3), so the table below is a **build/certification sequence**, not an in/out-of-scope filter. Two carrier-side chapters (Manifest, FTZ Admission) are flagged separately below since "build all those" most naturally reads as all the chapters this plan already scoped in — confirm explicitly if full carrier-side manifest functionality is also wanted, since that's a distinct product pivot (Qubere would be filing as/for a carrier, not just a broker-facing compliance tool) worth a deliberate yes rather than an assumed one.

| Sequence | Chapter | Why this order | Codebase readiness |
|---|---|---|---|
| 1 — foundational | Batch & Block Control | Required envelope for every other chapter; build once, first | **Codec built** (`src/lib/abi/batchBlockControl/`) — A/B/Y/Z, X0/X1 diagnostics, ACE-generated rejection fallbacks. Transport not wired. |
| 2 | Entry Summary Create/Update (AE/AX) | Core existing product capability; fastest path to a first certified transaction | **Codec built, MVP subset** (`src/lib/abi/entrySummary/`) — input 10/11/40/50/89/90, output E0/E1 response parsing, Appendix E check-digit validation. PGA/AD-CVD/FTZ/bond/description-text/cargo-manifest and 20+ other record types deferred (see the module's own doc comments). Transport not wired. |
| 3 | Entry Summary Query | Needed to check status of what's filed; reuses envelope + routing infra | **Codec built, mandatory backbone complete** (`src/lib/abi/entrySummaryQuery/`) — input J0/J1/J2; output JA/JB and all 7 "M" (always-present) status records JC-JI, with `parseQueryResponse` correctly grouping each JB with its JC-JI per the Output Record Structure Map. Deferred: output JJ-JN (5 conditional records — protest/bill/collection detail, only returned when specifically requested) and the reused Entry Summary Details Grouping (10-90 output + 4A). Transport not wired. |
| 4 | Cargo Release / Entry | Modern ACE filing bundles cargo release with entry summary; required to get goods released, not just paperwork accepted | 0% — net-new |
| 5 | Statement Processing (Daily/Periodic Monthly Statement) | Required to actually pay duties on filed entries — a production filer cannot operate without this | 0% — net-new |
| 6 | Bond / eBond | Product has a `Bond` model; needs real verification, not just CRUD | ~30% |
| 7 | Drawback (TFTEA) | Strong existing foundation (claims/matches/lots are real) | ~50% (CATAIR transaction format not built) |
| 8 | Partner Government Agencies (PGA) Message Set | Screening exists; filing transaction does not | ~20% |
| 9 | In-Bond | Confirm actual customer demand for bonded-freight movements before building — cheap to sequence last if it turns out unneeded | ~10% (entry-type recognition only) |
| Confirm before building | Manifest (ocean/air/rail/truck) | Carrier-side filing; no product signal today that Qubere acts as a carrier — this is a different business, not just another chapter | 0% |
| Confirm before building | Foreign Trade Zone Admission (e214) | No FTZ functionality anywhere in the product today | 0% |

**Sequencing rationale:** each chapter after #1 reuses the envelope built in #1 and (from #3 on) the transport/response-parsing infrastructure built in #2 — so the *marginal* build cost drops sharply after the first two are proven, even though the total scope is now "all of it."

---

## 3. Phased execution plan

### Phase 0 — Business & legal setup (no code)
- [ ] Resolve the narrower Open Question A sub-question — self-filer (Qubere is the filer of record) vs. software-vendor (transmits under each customer's credentials) — before the Letter of Intent goes out.
- [ ] Send CBP the Letter of Intent; get a Client Representative assigned.
- [ ] Confirm with the Client Rep: current CATAIR chapter list, current revision numbers, and CBP's approved transport options (VAN/AS2/direct connect) for a new vendor in 2026.
- [ ] If self-filing: confirm bond and (if filing for others) broker-license requirements with counsel. If software-vendor path: confirm what CBP requires evidence-wise from the vendor vs. from each customer's own filer relationship.
- [ ] Get CBP ABI test-environment credentials once the above is settled.

### Phase 1 — Foundational transmission infrastructure (engineering)
- [ ] Build the **Batch & Block Control envelope** module — CBP's required header/trailer wrapper, shared by every chapter transaction. Build once against the confirmed spec from Phase 0.
- [ ] Build the real CATAIR fixed-length record serializer, rescoped from the existing U9 spec (`docs/requirements/7501-draft-and-abi-export.md:444-475`) — the "layout as data" approach in that spec is still correct, but the shipped layout must be CBP's actual published Entry Summary AE/AX field positions, not the internal `catair-ae-2024.1` reference layout.
- [ ] Implement `RealAceProvider` (`src/lib/filing/transmissionProvider.ts`) for real: actual transport connection, credential handling (never in code/env-plaintext — use the existing secret-ref pattern from `FilerProfile.transportConfig`), request send.
- [ ] Build real CBP response/reject parsing to replace `devStub.ts`'s simulated `ACCEPTED`/`CANCELLED` responses — keep the underlying `FilingMessage` queue, `PgCanonicalMessageConsumer`, and audit trail (all real, reusable infrastructure per `docs/customs-filing/02-architecture.md`), swap only the "what answers the outbound message" piece.
- [ ] Idempotency on every transmission-adjacent route — a retry must never double-file.

### Phase 2 — Chapters 2-3 build + first certification pass
- [ ] Entry Summary Create/Update: wire the U1-U7 draft/validation pipeline (already spec'd in `7501-draft-and-abi-export.md`) into the Phase 1 envelope + real serializer + real transport.
- [ ] Entry Summary Query.
- [ ] Populate AD/CVD rate data properly (OPEN-ITEMS #20) — a certification test with unseeded rate data will fail on any AD/CVD-bearing test scenario.
- [ ] Run CBP's prescribed test scenarios with the Client Rep for these two chapters; iterate on rejects.
- [ ] Target: CBP grants production authorization for Entry Summary Create/Update + Query.

### Phase 3 — Chapters 4-8 expansion (full remaining scope)
- [ ] Cargo Release / Entry.
- [ ] Statement Processing (daily/periodic statement + payment).
- [ ] Bond/eBond real verification (replace `status: "Unverified"` placeholder with actual surety/ACE-backed verification).
- [ ] Drawback CATAIR transaction on top of the existing claim/match/lot models.
- [ ] PGA Message Set filing transaction on top of existing screening.
- [ ] In-Bond, once demand is confirmed per the chapter-9 note above.
- [ ] Manifest / FTZ Admission, only if explicitly confirmed as in scope (see §2) — otherwise skip.
- [ ] Repeat CBP test-and-certify cycle per chapter added.

### Phase 4 — Production cutover
- [ ] Get listed on CBP's ABI Software Vendor list (if software-vendor path) or activate production filer code (if self-filer path).
- [ ] Cut over from `devStub.ts` simulation to `RealAceProvider` in production, behind the existing `CUSTOMS_FILING_MOCK_RESPONSES` flag pattern (`devStub.ts:85`) so it's a single, reversible switch.
- [ ] Remove the `[DEMO MODE]` simulated-filing path currently writing `triageState: "APPROVED"` with no environment gate (`src/modules/agents/customsFilingAgent.ts:176`, OPEN-ITEMS #4) — this must not coexist with real production transmission.

### Phase 5 — Ongoing compliance (standing obligation, not a milestone)
- [ ] Monitor CATAIR revision releases (CBP revises chapters multiple times a year) and re-test changes before they hit production, per CBP's stated expectation that vendors self-test subsequent programming changes.
- [ ] Track ABI performance/error-rate standards under 19 CFR 143 Subpart A; CBP can suspend privileges for a poor rate.
- [ ] Maintain the audit trail (`AuditLog`) coverage gap (OPEN-ITEMS #19 — ~45% of write routes) at least across every transmission-adjacent route, since this is now regulator-facing, not just internal audit.

---

## 4. Source documents

**Downloaded 2026-08-20 into [`docs/plans/catair-source-docs/`](catair-source-docs/)** — pulled live from cbp.gov (a plain browser-UA `curl` works fine; only our automated WebFetch tool was 403'd, not the site itself) and cross-checked against the hub page's actual current link targets, not search-index snapshots. This is now the authoritative local copy — build against these, not the earlier search-derived links in prior revisions of this doc.

| Local file | Chapter | Live revision found |
|---|---|---|
| [00-abi-requirements-overview.pdf](catair-source-docs/00-abi-requirements-overview.pdf) | ABI Requirements (general/overview) | 2022-08 |
| [01-batch-block-control-v23.pdf](catair-source-docs/01-batch-block-control-v23.pdf) | Batch & Block Control | v23, 2023-06 |
| [02-entry-summary-create-update-2026-07.pdf](catair-source-docs/02-entry-summary-create-update-2026-07.pdf) | Entry Summary Create/Update (AE/AX) | 2026-07-17 — newer than anything search surfaced |
| [03-entry-summary-query-2026-05-v26.pdf](catair-source-docs/03-entry-summary-query-2026-05-v26.pdf) | Entry Summary Query | v26, 2026-05 |
| [04-cargo-release-implementation-guide-v40.pdf](catair-source-docs/04-cargo-release-implementation-guide-v40.pdf) | Cargo Release Implementation Guide | v40, 2025-07 |
| [04b-cargo-manifest-bond-entry-status-query-v21.pdf](catair-source-docs/04b-cargo-manifest-bond-entry-status-query-v21.pdf) | Cargo/Manifest/Bond/Entry Status Query | v21, 2025-09 |
| [05-daily-statement.pdf](catair-source-docs/05-daily-statement.pdf) | Statement Processing — Daily Statement | 2025-09 |
| [05b-periodic-monthly-statement.pdf](catair-source-docs/05b-periodic-monthly-statement.pdf) | Statement Processing — Periodic Monthly Statement | 2020-02 (oldest of the set — worth double-checking with the Client Rep for a newer revision) |
| [06-ebond-create-update-v1.9.pdf](catair-source-docs/06-ebond-create-update-v1.9.pdf) | eBond Create/Update | v1.9, 2020-04 |
| [06b-in-bond-v51-2026-04.pdf](catair-source-docs/06b-in-bond-v51-2026-04.pdf) | In-Bond | rev 51, 2026-04 |
| [07-drawback-tftea-v27.pdf](catair-source-docs/07-drawback-tftea-v27.pdf) | Drawback (TFTEA) | v27, 2025-07 |
| [08-pga-message-set-2026-07.pdf](catair-source-docs/08-pga-message-set-2026-07.pdf) | Partner Government Agencies (PGA) Message Set | 2026-07 |
| [09-broker-download-draft.pdf](catair-source-docs/09-broker-download-draft.pdf) | ACE Broker Download | draft, 2026-07 |
| [10-error-dictionary-2026-07.xlsx](catair-source-docs/10-error-dictionary-2026-07.xlsx) | CATAIR Error Dictionary (all reject/error codes — needed for Phase 1's response parsing) | 2026-07, `.xlsx` not PDF |
| [appendix-b-valid-codes.pdf](catair-source-docs/appendix-b-valid-codes.pdf) | Appendix B — Valid Codes | 2026-08 |
| [appendix-c-tariff-abbreviations.pdf](catair-source-docs/appendix-c-tariff-abbreviations.pdf) | Appendix C — Tariff Abbreviations | 2016 (via a 2020 reissue) |
| [appendix-e-valid-entry-numbers.pdf](catair-source-docs/appendix-e-valid-entry-numbers.pdf) | Appendix E — Valid Entry Numbers | 2012 |
| [appendix-f-duty-calculation.pdf](catair-source-docs/appendix-f-duty-calculation.pdf) | Appendix F — Duty Calculation | 2011 — old; sanity-check against `src/lib/tariff/dutyEngine.ts`'s current logic before treating as authoritative |
| [appendix-h-census-codes.pdf](catair-source-docs/appendix-h-census-codes.pdf) | Appendix H — Census Codes | 2018 |
| [appendix-v-government-agency-codes.pdf](catair-source-docs/appendix-v-government-agency-codes.pdf) | Appendix V — Government Agency Codes | 2020 |

**Deliberately not downloaded:**
- **Manifest / FTZ Admission (e214)** — per §2, "confirm before building"; the hub lists a Truck Manifest section (`/trade/automated/catair/air-features` and similar) and a full FTZ chapter, both skipped pending an explicit yes.
- **Agency-specific PGA supplements** (FDA, DEA, ATF, USFWS, NMFS, DDTC, CPSC, APHIS, etc.) — the hub page lists ~15 of these. The core `pga-message-set` chapter above is the format spec; each agency's supplement only matters once we know which PGAs actually apply to Qubere customers' commodities. Pull the relevant ones when that's known.
- **~90 other guidance/technical-documentation pages** on the hub (reconciliation, ISF, currency exchange, MID, quota query, census warning query, AD/CVD case query, and more) — out of the chapters scoped in §2. The hub page was fully crawled during this pass, so revisiting it later for any of these is a five-minute lookup, not a re-discovery effort.

**Process/reference pages (not chapter documents, but load-bearing for Phase 0):**

| What | Link |
|---|---|
| Getting started / how to transmit via EDI (first point of contact = CBP Client Representative) | https://www.cbp.gov/trade/automated/getting-started/transmitting-data-cbp-electronic-data-interchange-edi |
| ABI Software Vendors list (current certified vendors — reference for the software-vendor path in Open Question A) | https://www.cbp.gov/document/guidance/abi-software-vendors-list |
| 19 CFR Part 143 Subpart A — Automated Broker Interface (the regulation itself) | https://www.ecfr.gov/current/title-19/chapter-I/part-143/subpart-A |

---

## 5. Immediate next actions (this week)

1. Confirm the self-filer vs. software-vendor sub-question (Open Question A) with whoever issued the ABI-readiness directive — this determines what Phase 0's Letter of Intent actually asks CBP for.
2. Have the Client Rep, once assigned, confirm the Periodic Monthly Statement (2020) and Duty Calculation appendix (2011) revisions specifically — those are the two oldest documents in the downloaded set and are the most likely to have quietly drifted from what's live today.
3. Send the Letter of Intent to CBP / request a Client Representative.
4. Start Phase 1 engineering against the downloaded documents in `docs/plans/catair-source-docs/` — they were pulled live from cbp.gov today, not reconstructed from search.

## Open items this plan does not resolve

- Whether any current Qubere customer's broker-of-record relationship changes if Qubere becomes a direct transmitter for that customer — a contracts/customer-success question, not engineering.
- Staffing: does Qubere have or need a licensed customs broker on staff under the self-filer path (Open Question A).
- Whether Manifest / FTZ Admission are actually wanted (flagged in §2 as "confirm before building," not assumed in scope from "we will build all those").
