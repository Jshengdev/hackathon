# R-DOCS shard summary — PHASE 1 source-of-truth doc refactor

**Branch:** `refactor/docs` (worktree `worktrees/R-DOCS`)
**Date:** 2026-04-25 (post-audit DOCS-FROZEN)
**Status:** **DONE**

---

## Alignment statement

This refactor aligns the four source-of-truth docs (technical PRD, strategic PRD, `caltech/architecture-overview.md`, `caltech/NEW-ARCHITECTURE.md`) with the v2 architecture so that every subsequent R-shard has an unambiguous spec to implement against. The standing-QA-document framing locked by the user before R-DOCS spawned is honored: after this branch merges, the four docs become the contract every R1–R9 + B-pass shard measures against. No code in `backend/` or `frontend/` was modified; no audit reports were edited; no merges to `main` performed; no remote pushes.

**Verbatim Johnny line backing the empathy-layer thesis** (from `caltech/yaps/2026-04-25-empowerment-synthesis/01-high-signal-extracts.md` §B):

> *"You're either at a disadvantage for wanting to maintain who you are as a person and make your own conclusions, or you give up all of your data... we're trying to offer the third option: you could use AI but you should be able to see what they're doing to you and make that choice. That's the empowerment angle."*

The v2 architecture serves this thesis structurally: K2 plays three roles on one surface, the swarm-loop merge surfaces *every* per-region inference to the auditable empathy document (un-black-boxing the AI's reasoning, not just the algorithm's output), and the Stage-4 Opus polish + persona shell let the same simulation render scenario-appropriate empathy paragraphs without rewiring the moderator. Pre-rendered TRIBE V2 + embedding-proxy falsification + no-silent-stub rule make the demo honest *and* reliable — Johnny's "third option" made operational.

Cross-anchor in `caltech/yaps/2026-04-25-listenlabs-conversation/01-high-signal-extracts.md` §D — the un-black-box mandate:

> *"We're trying to un-black box everything — all decisions that this swarm has made about how and why things fired in your brain compared to the content itself."*

The v2-locked architecture enacts this: the K2 swarm's per-region readings (Stage 1B), per-round attribution (Stage 3), and falsification verdict (Stage 5) are all surfaced to §C of the empathy doc — the swarm's reasoning is auditable, not hidden behind a synthesis layer.

---

## File-by-file diff summary

| Doc | Sections changed | What changed |
|---|---|---|
| `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` (v2.0 → v2.1) | frontmatter (`v2_changelog`); §6.6 falsification; §4.2b Stage 4 polish; §13 LANE-J + LANE-K + LANE-O FRs; §14 NFRs; §10 smoke gate + new §10.1 eval-harness recipes | Field-name lock to short-form (A4-deepdive Pick B); Stage 4 SHIP path with `OPUS_POLISH=1` + K2-best fallback (A3-deepdive); FR-J5/FR-K3/FR-K4/FR-K5 tagged `[v2-superseded]` / `[v2-relocated]`; FR-K12 `[v2-promoted-to-mandatory]`; FR-J11 + FR-K13 + FR-O4′ added as `[v2 NEW]`; NFR2/3/6/31 struck; NFR22 amended (monotone-Δ semantics); added NFR41/42/43/44 (embedding-proxy ≤200ms; K2 three-roles concurrency; no-silent-stub NON-NEGOTIABLE; Opus polish env-flag discipline); §10 extended with A6's grep gate + no-silent-stub kill-switch + schema validators + e2e demo gate + latency budget harness + golden-output similarity oracle + run-test-run rule. |
| `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` (v1.1 → v2.0) | frontmatter (version + new `v2_changelog` block + `one_size_fits_all_solution_statement`); main "Solution Statement" section; "How the Engine Satisfies Both Briefs Simultaneously" sponsor-pitch table; "The Vision"; "What Makes This Special" (5 structural moves); Project Type prose; "Same Engine" tagline; Persona 4 (Junsoo) + Persona 5 (Jacob) stories; Architecture Diagram (full); Data Transfer Spec (full); Demo Visualization (full); §14 NFR Performance block; "Iterative-loop → empathy-document contract" line; single-paragraph elevator pitch | Strategic narrative re-aligned with v2 architecture (TRIBE pre-rendered only, K2 three-roles, swarm-loop merged, Opus-as-Stage-4-polish-only, embedding-proxy falsification). Sponsor-pitch alignment paragraphs rewritten: Ironsight = "the swarm gives the video the information it didn't have before — that's the spatial-sidecar"; Listen Labs = "modular Opus polish + per-scenario PersonaShell lets the same simulation render scenario-appropriate output." All "live TRIBE" / "TRIBE forward" / "Stage 2 Opus" residual mentions removed. v1 architecture diagram + data spec + demo visualization preserved at `archive/strategic-prd-v1-sections.md` per preservation discipline. |
| `caltech/architecture-overview.md` | Stage 4 box (lines 236-249); §9 Stack table Stage 4 row | Stage 4 box now spells the SHIP path verbatim: `services/empathy_polish.py`, `OPUS_POLISH=1` gate, ~140 output tokens, K2-best fallback on any failure or guardrail violation, structured `opus_polish_unavailable` log. §9 stack-table row mirrors. |
| `caltech/NEW-ARCHITECTURE.md` | Newly committed to `refactor/docs` branch (was untracked in main); §1 Stage 4 box; §1 Stage 5 falsification box; §1 EmpathyDocument frontend box; §3 cache layout `empathy.json` schema; §7 locked rule 3 | NEW-ARCHITECTURE.md was an untracked file in main — this commit brings the canonical summary into version control on the refactor branch. Stage 4 box gains the OPUS_POLISH gate + fallback semantics. Stage 5 box uses short-form `{main_score, control_score, delta, verdict}` keys verbatim with the new `control_unavailable` verdict (per A1-deepdive §1 + technical PRD §6.6 v2.1). EmpathyDocument §B clarifies polished-paragraph-vs-best-paragraph selection logic. §3 cache layout enumerates every v2 empathy.json field. §7 locked rule 3 spells the Stage 4 ship path inline. |
| `_bmad-output/planning-artifacts/archive/strategic-prd-v1-sections.md` | NEW (preservation archive) | v1 strategic-PRD Architecture Diagram + Data Transfer Spec + Demo Visualization preserved verbatim (per R-DOCS preservation discipline). Header explains the v2 supersession rationale and points to the canonical v2 sources. |

**Commits on `refactor/docs`** (all small + focused, none merged to main):

```
49d86f4  docs(architecture): reconcile architecture-overview + NEW-ARCHITECTURE to PRD v2.1
b4a121c  docs(prd): strategic PRD v2 — narrative re-aligned with v2 architecture
2ca5fb1  docs(prd): technical PRD v2.1 — DOCS-FROZEN edits per R-DOCS shard
```

**Aggregate diff stat (`git diff main...refactor/docs --stat`):**

```
.../archive/strategic-prd-v1-sections.md           | 238 ++++++++++
.../planning-artifacts/ironsight-listenlabs-prd.md | 487 ++++++++++-----------
.../ironsight-listenlabs-technical-prd.md          | 161 +++++--
caltech/NEW-ARCHITECTURE.md                        | 272 ++++++++++++
caltech/architecture-overview.md                   |  27 +-
5 files changed, 875 insertions(+), 310 deletions(-)
```

---

## Acceptance gate — real terminal output

Ran from worktree root `worktrees/R-DOCS/`:

```
$ grep -c "main_paragraph_score\|control_paragraph_score\|falsification_delta" _bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md
_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md:0
_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md:0
```
**Expected: 0 0 — PASS** (long-form falsification names eliminated from both PRDs).

```
$ grep -c "Stage 2 Opus\|Stage 2 (Opus)\|Opus 4\.7.*Stage 2\|TRIBE forward\|live TRIBE" _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md
0
```
**Expected: 0 — PASS** (stale v1 framings eliminated from strategic PRD).

```
$ grep -c "main_score\|control_score" caltech/architecture-overview.md caltech/NEW-ARCHITECTURE.md
caltech/architecture-overview.md:3
caltech/NEW-ARCHITECTURE.md:6
```
**Expected: ≥1 each — PASS** (architecture-overview + NEW-ARCHITECTURE field-names consistent with PRDs).

```
$ grep -c "OPUS_POLISH" _bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md caltech/architecture-overview.md caltech/NEW-ARCHITECTURE.md
_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md:11
caltech/architecture-overview.md:5
caltech/NEW-ARCHITECTURE.md:4
```
**Expected: ≥1 each — PASS** (Stage 4 polish flag documented in all three).

**All four gates PASS. DOCS-FROZEN.**

---

## No-hardcoding double-check

R-DOCS modified docs only — no `backend/services/` or `frontend/src/` source touched, so the runtime no-hardcoding greps are not applicable inside this shard's diff. The strategic PRD's persona stories (Maya, Sarah) retain v1 illustrative numbers (similarity 0.42→0.84 trajectory, falsification delta 0.27 / 0.24) — these are **prose aspirations of what the engine should produce on the demo clips**, NOT runtime canned values, and they predate this shard. They will be re-validated against real outputs by the A6 §7 golden-similarity oracle once the eval harness lands (per technical PRD §10.1 + EXECUTION-PLAN PHASE 3 R6).

The technical PRD's NFR23 + the smoke-gate row 7 are now explicit that under `verdict == "control_unavailable"`, NFR23 evaluates as `n/a` and the demo doc renders the missing-data surface — never silently substitutes a fabricated number. This honors CONSTRAINTS rule 2 + CONSTRAINTS §6 "Don't be a blocker" simultaneously: the demo is honest about what it has and what it doesn't, and pre-cache misses surface visibly without freezing the run.

---

## Open questions for orchestrator

These are escalations the strategic-PRD edits + the technical-PRD edits surfaced. None block PHASE 2; all are tagged `[ESCALATE]`.

1. **[ESCALATE]** **Consumer-scenario control-clip strategy (A1-deepdive open question, surfaced in technical PRD §6.6 + FR-J7 v2-amended).** Strict NFR15 ("within-subject contrast only") is hard for the consumer scenario — the demo clip is a publicly-available Reels feed scroll without subject identity. Two paths: (a) treat the consumer control as between-subject (different person, similar scroll behavior) and disclose the loosened constraint in `falsification.json` metadata + the deck (downgrade); OR (b) drop falsification on the consumer scenario and label §C accordingly. The current docs leave this open per A1-deepdive §1.6. Decision needed BEFORE R1 fires (R1 owns the control-clip bake).

2. **[ESCALATE]** **A5 §9 cross-cutting cross-stage K2 semaphore.** A5 audit flagged a possible race between WS swarm events (`/ws` per-second pushes) and HTTP empathy-fetch K2 calls — both share one `K2Client` and one upstream rate limit. NFR42 currently says "no semaphore inside one stage; `Semaphore(6)` only inside `services/warmup.py`." If WS + warmup contend for K2 at demo-day load, we may need a global semaphore. R3 (swarm-loop conformance) is the natural place to address; flagging here for orchestrator visibility before that shard fires.

3. **[ESCALATE]** **`caltech/engine/` offline-harness HANDOFF_CONTRACT.md long-form names.** A4-deepdive §1.c Path A recommended leaving the offline-harness long-form names in place and adding a header note clarifying scope. R-DOCS scope was the four canonical docs only, so HANDOFF_CONTRACT.md was NOT touched. If the orchestrator wants belt-and-suspenders alignment, R-STRUCT or R7 can do the trivial header-note addition; otherwise the offline harness's separate-contract framing is fine.

---

## Universal R-shard discipline checklist (per POST-AUDIT-ORCHESTRATION.md §"Universal R-shard discipline")

- [x] Effort = MAX (xhigh-effort thinking applied to every architectural decision: A4-deepdive Pick B vs Pick A trade-off; A3-deepdive ship-vs-cut for Opus polish; FR/NFR re-tagging strategy; v1-section archival vs deletion).
- [x] Read 5 verbatim yaps BEFORE editing anything. Confirmed by reading `caltech/yaps/2026-04-25-empowerment-synthesis/01-high-signal-extracts.md`, `2026-04-25-capability-first-pivot/01-high-signal-extracts.md`, `2026-04-25-execution-layer-search/01-high-signal-extracts.md`, `2026-04-25-listenlabs-conversation/01-high-signal-extracts.md`, `2026-04-25-team-execution-status/00-raw-yap.md` in full before any Edit/Write to the four docs.
- [x] Preservation discipline: v1 architecture diagram + data spec + demo visualization archived to `_bmad-output/planning-artifacts/archive/strategic-prd-v1-sections.md` (with header explaining the v2 supersession rationale and pointing to canonical v2 sources). v1 FR/NFR rows preserved with `~~strikethrough~~ + [v2-superseded|v2-amended|v2-relocated|v2-promoted-to-mandatory]` tags rather than deleted.
- [x] No-hardcoding double-check: no canned sponsor names introduced; numbers in persona stories pre-existing illustrative; no runtime-code mocks added (R-DOCS scope = docs only).
- [x] End-goal alignment statement at top of this summary, with verbatim Johnny lines + yap paths.
- [x] Touched ONLY the 4 docs in scope (technical PRD, strategic PRD, architecture-overview, NEW-ARCHITECTURE) plus the preservation archive. No code in `backend/` or `frontend/`. No audit reports modified. No merges to `main` performed by this shard. No pushes to remote.

---

## Status

**DONE.** All four acceptance-gate greps pass with the expected counts. The four R-DOCS source-of-truth docs are now ready to become the standing QA document for every subsequent R-shard once `refactor/docs` merges to `main`. Three `[ESCALATE]` items are surfaced above for orchestrator decision; none block PHASE 2 (R-STRUCT) or PHASE 3 (R1+ code refactors). PHASE 1 deliverable per EXECUTION-PLAN.md §3 is complete.
