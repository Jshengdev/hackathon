# SHARD R-DOCS — PHASE 1 docs refactor (PRD update FIRST)

You are a **refactor-execution Claude instance**, NOT an audit. You modify files. Spawned alone in PHASE 1.

After this shard merges, the 4 docs you touch become the **standing QA document** for every subsequent R-shard.

## Skills to load (load BEFORE editing anything)

- `superpowers:writing-plans`
- `superpowers:test-driven-development` — for any future-spec assertions you add to §10 smoke gate
- `superpowers:verification-before-completion` — claims need run-commands
- `superpowers:using-git-worktrees`
- `code-simplifier:code-simplifier`
- `bmad-advanced-elicitation` — for any judgment call

## Read first (in order)

1. `/Users/johnnysheng/code/hackathon/CLAUDE.md`
2. `/Users/johnnysheng/code/hackathon/caltech/NEW-ARCHITECTURE.md`
3. `/Users/johnnysheng/code/hackathon/refactor/EXECUTION-PLAN.md` — your instructions live in §3 PHASE 1 + §1 + §2.
4. `/Users/johnnysheng/code/hackathon/refactor/POST-AUDIT-ORCHESTRATION.md` — Universal R-shard discipline section is mandatory.
5. **Verbatim yaps (mandatory before any doc edit):**
   - `caltech/yaps/2026-04-25-empowerment-synthesis/01-high-signal-extracts.md`
   - `caltech/yaps/2026-04-25-capability-first-pivot/01-high-signal-extracts.md`
   - `caltech/yaps/2026-04-25-execution-layer-search/01-high-signal-extracts.md`
   - `caltech/yaps/2026-04-25-listenlabs-conversation/01-high-signal-extracts.md`
6. **Audit reports (the v2-decisions you encode):**
   - `refactor/audits/A4-deepdive.md` — falsification field-name decision (Pick B: spec moves to short-form)
   - `refactor/audits/A3-deepdive.md` — Stage 4 Opus polish decision (SHIP, gated `OPUS_POLISH=1`)
   - `refactor/audits/A1-deepdive.md` — control-clip strategy
   - `refactor/audits/A5-prd-alignment-master.md` — FR/NFR coverage gaps
   - `refactor/audits/A6-qa-eval-harness.md` §10 smoke gate recipes

## Files to edit (4 docs)

### 1. `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md`

- **§6.6 falsification:** rename long-form fields to short-form per A4-deepdive Pick B:
  - `main_paragraph_score` → `main_score`
  - `control_paragraph_score` → `control_score`
  - `falsification_delta` → `delta`
  - Drop `main_video_id`, `control_video_id` fields entirely (not in live path).
- **§4.2b Stage 4 polish:** clarify SHIP path:
  - Implementation file: `services/empathy_polish.py`
  - Single Anthropic Messages API call, `claude-opus-4-7`, ~140 output tokens.
  - Env flag: `OPUS_POLISH=1` (default OFF; enable in production demo build).
  - On any failure: fall back to shipping K2 `best_paragraph` as-is, log `opus_polish_unavailable` structurally.
  - JSON field on `EmpathyDocument`: `polished_paragraph` (optional; null when polish disabled or failed).
- **§13 (FRs):** finish v2-supersession tagging on remaining FRs:
  - FR-O4 (Stage 2 Opus integration) → `[v2-superseded]` — Stage 2 is now K2 moderator
  - FR-O17 (guardrail regex on every Opus output) → `[v2-amended]` — applies to Stage 2 K2 output (and Stage 4 Opus polish if enabled)
  - Verify all Lane-J/K/O/E FRs scan for "Stage 2 Opus" / "TRIBE forward" residual mentions.
- **§14 (NFRs):** update:
  - Strike NFR3 (TRIBE forward inference per candidate ≤2s) — never live in v2.
  - Strike NFR6 (Opus 4.7 ≤5s per candidate) — replace with NFR6′ "K2 moderator ≤5s per candidate".
  - Amend NFR22 (iterative-loop convergence) — change "by round 8, score ≥0.75" to "score climbs monotonically with mean Δ ≥ 0.02 across 8 rounds; plateau-exit honored". (Old threshold assumed TRIBE-forward; new K2-evaluator scoring has different distribution.)
  - Add NFR41: embedding-proxy falsification ≤200ms.
  - Add NFR42: K2 three-roles concurrency uses `asyncio.gather(*calls)` for 7-call swarms (no semaphore inside one stage).
  - Add NFR43: no-silent-stub rule — failures log structurally + return error payload + render visible failure surface.
- **§10 smoke gate:** extend with A6's eval recipes:
  - Append no-fallback grep recipe (run in CI).
  - Append schema validators (Pydantic for activity.json, vision_report.json, swarm_readings.json, empathy.json, falsification.json).
  - Append e2e demo gate script.

### 2. `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` (strategic — currently FULLY STALE)

- Rewrite §1 (Solution) and §2 (Mechanism) to v2 narrative:
  - "Two-stage agent pipeline (vision-classification + empathy-synthesis) with TRIBE V2 in-between" → "Three-stage K2 swarm + iterative scoring loop reading pre-rendered TRIBE V2 brain pattern, with optional Opus 4.7 literary polish"
  - "live TRIBE V2 forward + reverse" → "TRIBE V2 pre-rendered offline; demo runs against committed activity.json"
  - "Opus-as-Stage-2 synthesis" → "Stage 2 = K2 moderator; Opus 4.7 = Stage 4 polish (cut-line)"
- Update §3 sponsor-pitch alignment paragraphs:
  - Ironsight = the K2 swarm gives the video information it didn't have before (per-region cognitive context)
  - Listen Labs = the modular Opus polish + persona-shell lets the same simulation generate scenario-appropriate output (workplace / consumer / pavilion)
- Drop "live TRIBE V2 forward + reverse" claims throughout — search globally and rewrite.
- Preserve §1 problem statement (still locked Johnny verbatim).
- Preserve sponsor-track strategic anchoring (still valid).

### 3. `caltech/architecture-overview.md` (already v2-current per junsoo's commit)

- Reconcile against your edits to PRD:
  - If §6.6 field names changed in PRD, ensure architecture-overview's pipeline diagram + JSON examples match.
  - If §4.2b Stage 4 polish details changed, ensure §4.2 here matches.
- This doc is downstream of the PRD; it shouldn't need much.

### 4. `caltech/NEW-ARCHITECTURE.md` (canonical summary)

- Update §3 cache layout: confirm `activity.json` (not `target_brain.json`).
- Update §6.7 falsification field names to short-form (`main_score`, `control_score`, `delta`).
- Update §4.2b: Stage 4 polish ship path with `OPUS_POLISH=1` flag + fallback semantics.

## Acceptance gate (DOCS-FROZEN)

Run these checks; ALL must pass:

```bash
# 1. Long-form falsification names eliminated from PRDs
grep -c "main_paragraph_score\|control_paragraph_score\|falsification_delta" _bmad-output/planning-artifacts/*.md
# expected: 0 0   (one count per file)

# 2. Stale "Stage 2 Opus" / "TRIBE forward" eliminated from strategic PRD
grep -c "Stage 2 Opus\|Stage 2 (Opus)\|Opus 4\.7.*Stage 2\|TRIBE forward\|live TRIBE" _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md
# expected: 0

# 3. Architecture overview + NEW-ARCHITECTURE field-names consistent
grep -c "main_score\|control_score" caltech/architecture-overview.md caltech/NEW-ARCHITECTURE.md
# expected: ≥1 each

# 4. Stage 4 polish flag documented
grep -c "OPUS_POLISH" _bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md caltech/architecture-overview.md caltech/NEW-ARCHITECTURE.md
# expected: ≥1 each
```

## Universal R-shard discipline (NON-NEGOTIABLE)

1. **Effort = MAX.** xhigh-effort thinking on every architectural decision.
2. **Read the 5 verbatim yaps BEFORE editing anything.** Every doc edit must trace back to a Johnny verbatim line OR a locked PRD § OR a deepdive recommendation.
3. **Preservation discipline.** Don't delete prose; rewrite or relocate. If you remove a section, archive it as `_bmad-output/planning-artifacts/archive/<file>-<section>-v1.md`.
4. **No-hardcoding double-check.** Verify no canned numbers / canned sponsor names appear in the rewritten strategic PRD without a citation.
5. **End-goal alignment statement** at top of `refactor/audits/R-DOCS-summary.md`:
   > **Alignment statement:** This refactor aligns the source-of-truth docs with the v2 architecture so that every subsequent R-shard has an unambiguous spec to implement against. The standing QA document framing is honored. Verbatim Johnny line backing the empathy-layer thesis: [QUOTE + yap path].

## Commit + report

- Branch: `refactor/docs` (worktree `worktrees/R-DOCS`)
- Commits: small, focused (one per doc, or one per logical change cluster)
- Final commit: writes `refactor/audits/R-DOCS-summary.md` with:
  - Alignment statement (above)
  - File-by-file diff summary (which sections changed in each of 4 docs)
  - Acceptance-gate command outputs (paste real terminal output)
  - Open questions for orchestrator (if any — leave empty if none)
  - Status: `DONE` or `DONE_WITH_CONCERNS` or `BLOCKED`

After report lands and acceptance gate passes, STOP. Do NOT merge to main yourself — the orchestrator session merges after review.

## Constraints

- Touch ONLY the 4 docs listed.
- Do NOT touch any code in `backend/` or `frontend/`.
- Do NOT touch `refactor/audits/` (those are read-only audit reports).
- Do NOT push to remote.
- Do NOT merge to main yourself.
- If you discover a doc that should be edited but isn't in scope, raise as `[ESCALATE]` in your summary — don't unilaterally edit.
