# Post-Audit Orchestration — Master Sequence

This is what the orchestrator does once all audits land. The user's lock: **update the PRD first with the new changes, then those PRDs become the standing QA document** that every refactor measures against. Code refactor is downstream of the PRD update, never upstream.

---

## The 5 phases (in order, no jumping)

```
PHASE 0 — Audits land (A1-A9 + deepdives) → orchestrator QA synthesis
   ↓
PHASE 1 — DOCS REFACTOR FIRST (R-DOCS shard, alone)
            updates 3 source-of-truth docs to reflect locked decisions
   ↓ DOCS-FROZEN GATE: PRDs become "standing QA document"
   ↓
PHASE 2 — STRUCTURE refactor (R-STRUCT) — file moves, archive, cleanup
   ↓ STRUCTURE-FROZEN GATE: clean repo
   ↓
PHASE 3 — CODE refactors (R1-R9 sequential) — backend + frontend changes
   ↓ each R-shard's spec IS the updated PRD; refactor must match
   ↓
PHASE 4 — Eval harness + manual demo gate
   ↓
PHASE 5 — B-pass verify (B1-B9 parallel) per POST-REFACTOR-QA-PLAN.md
```

---

## PHASE 0 — Orchestrator QA synthesis

**When:** all 9 A-shard audits + 3 deepdives present in `refactor/audits/`.

**Trigger condition (script-checkable):**
```bash
test $(ls refactor/audits/A*.md 2>/dev/null | wc -l) -ge 9 && \
test -f refactor/audits/A1-deepdive.md && \
test -f refactor/audits/A3-deepdive.md && \
test -f refactor/audits/A4-deepdive.md && \
echo "READY"
```

**Orchestrator (this main session) does:**
1. Read all 12 reports.
2. Build cross-cutting findings table (already started in earlier turns).
3. Identify conflicts between shards (especially A1↔A3↔A5 on falsification, A4↔A8 on dashboard, A7↔A9 on file moves).
4. Resolve conflicts (orchestrator authority).
5. Write `refactor/EXECUTION-PLAN.md` — the consolidated plan, ordered, with file paths + PRD section refs.

**Output:** `refactor/EXECUTION-PLAN.md` is the spec for PHASES 1-3.

---

## PHASE 1 — R-DOCS shard (PRD + architecture update FIRST)

**Why first:** the user's lock — *"update the PRD first with the new changes and then have those be a standing quality assurance document."* The refactored docs become the spec every code refactor measures against.

**Spawned alone** (not parallel with other R-shards). Worktree: `worktrees/R-DOCS` on `refactor/docs` branch.

**Scope (3 docs in canonical order):**

1. **`_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md`** — apply locked v2 decisions:
   - §13 (FRs) — already partly tagged `[v2-superseded]` last session; finish all 35 FRs.
   - §14 (NFRs) — strike obsolete (NFR3 TRIBE forward, NFR6 Opus per-candidate, NFR22 iterative-loop convergence threshold), add v2 (embedding-proxy latency, K2 three-roles concurrency, no-silent-stub rule).
   - §6.6 falsification field-name decision (per A4 deep-dive) — pick backend-or-CONTRACTS naming, document.
   - §10 smoke gate — extend with A6's eval harness recipes.
   - §15 per-lane checklist — update to reflect actual pipeline as built.

2. **`_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md`** — strategic PRD, currently FULLY STALE. Rewrite §1-§3 to v2 narrative:
   - Two-stage agent pipeline → swarm-loop merged simulation
   - Live TRIBE forward → pre-rendered activity.json + embedding proxy
   - Opus-as-Stage-2 → Opus-as-Stage-4-polish (cut-line)
   - Update sponsor-pitch alignment paragraphs (Ironsight = swarm gives the video info; Listen Labs = modular Opus framing).

3. **`caltech/architecture-overview.md`** — already v2-current per junsoo's commit `fe18314`. Reconcile against R-DOCS's PRD edits — if anything diverges, fix here.

4. **`caltech/NEW-ARCHITECTURE.md`** — the canonical summary. Update if any locked decision shifted during synthesis.

**R-DOCS deliverable:**
- All 4 docs reflect the same architecture, same field names, same numbers, same locked decisions.
- A diff summary at `refactor/audits/R-DOCS-summary.md` listing every doc + every section + every change.
- Commits on branch `refactor/docs` ready to merge.

**Acceptance gate (DOCS-FROZEN):**
- `git diff refactor/docs main -- _bmad-output/planning-artifacts/` shows the v2 edits cleanly.
- `grep -c "Stage 2 Opus" _bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` returns 0 (zero residual v1 Opus-as-Stage-2 mentions).
- `grep -c "TRIBE forward" _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` returns 0.
- Architecture-overview's pipeline diagram and PRD §3 diagram are isomorphic (verify via human read; orchestrator approves).

**After DOCS-FROZEN:** Merge `refactor/docs` → `main`. The 3 docs are now the standing QA document.

---

## PHASE 2 — R-STRUCT shard (file moves + archive)

**Spawned alone** after R-DOCS merges. Worktree: `worktrees/R-STRUCT` on `refactor/structure` branch.

**Scope (from A7 + A9 audit findings):**
- Move deprecated docs to `archive/` per A9's deprecation catalog.
- Archive `caltech/engine/` if A7 confirms superseded by `backend/services/`.
- Archive `junsoo/`, `feesh/` if scratch (per A7).
- Stale prerendered orphans (`comparison.json`, `example_clip/` v1 artifacts per A1).
- Empty cleanup: `git rm` files that lost their endpoint per A1's `/brain/run-inference` finding.
- Update `.gitignore` for any lock files / cache files that shouldn't be tracked.
- Update `CLAUDE.md` repo-map to match new layout.
- Update `research/INDEX.md` if any sponsor clones moved.

**Critical: no source code touched in this phase** (R-STRUCT only does `git mv` and `git rm`).

**Acceptance gate (STRUCTURE-FROZEN):**
- Directory tree matches `caltech/NEW-ARCHITECTURE.md` §6 target layout.
- `git ls-files | wc -l` decreased (deletions) without breaking imports (`python -c "import backend.main"` still works; `npm run build` still passes).
- `CLAUDE.md` repo-map references actual paths (no stale `caltech/engine/...` mentions if archived).

**After STRUCTURE-FROZEN:** Merge `refactor/structure` → `main`.

---

## PHASE 3 — Code refactor R1-R9 (SEQUENTIAL)

**Why sequential:** R-shards may touch overlapping files (e.g., R3 swarm-loop and R4 frontend both touch the contract surface). Serial avoids merge hell.

**Order (by dependency + criticality):**

1. **R1 — pre-render cache + falsification fix** — generates control_activity.json (per A1 deep-dive option), removes silent self-substitution, fixes guardrail truthiness bug. **Demo-blocking; must land first.**
2. **R2 — strip silent stubs** — converts every `_stub_report` / `"stub": True` pattern to `logger.error + return error payload`. Touches multiple services.
3. **R3 — swarm-loop conformance** — fixes any v2-architecture deviation found by A3. Implements Stage 4 Opus polish if A3 deep-dive recommended IMPLEMENT (gated `OPUS_POLISH=1`).
4. **R4 — frontend ↔ /demo/empathy wiring** — removes `ComparisonStage.vue` inline mock or deletes the stage; wires `EmpathyDocumentStage.vue` to real fetch; fixes field-name divergence per A4 deep-dive.
5. **R5 — PRD alignment cleanup** — already done in R-DOCS; R5 is now reduced to: verify code matches PRD post-DOCS-merge. May be a no-op.
6. **R6 — eval harness** — install A6's grep recipes, integration tests, schema validators, e2e demo gate script. Add CI / pre-commit hooks.
7. **R7 — structure consolidation** — already done in R-STRUCT; R7 reduces to: fix any import paths broken by R-STRUCT moves.
8. **R8 — brain dashboard redesign** — biggest frontend change; collapses 4 stages → 1 dashboard with greenchain layout × icarus hover anchors. Touches `App.vue`, all stages, `BrainScene.vue`, `RegionPopup.vue`. Land last (highest risk of breaking demo).
9. **R9 — code-quality lint pass** — fix long lines (>120 chars), remove debug `print()` / `console.log`, replace bare `except Exception`, address TODO/FIXME from A9.

**Each R-shard:**
- Reads its A-shard report + PRD (now the standing QA doc) as the spec.
- Writes failing test FIRST (TDD via `superpowers:test-driven-development`).
- Commits in small steps, runs tests after each, records latency budget.
- Reports at `refactor/audits/R<N>-summary.md` with file diff summary + commits.
- Merges to `main` before next R-shard starts.

**Between R-shards:** orchestrator runs the eval harness and confirms no regression before triggering next.

---

## PHASE 4 — Settle gate

**5-condition gate (per `refactor/POST-REFACTOR-QA-PLAN.md`):**

1. ✅ All R-pass shards merged.
2. ✅ Backend `pytest` / smoke tests green.
3. ✅ Frontend `npm run build` clean.
4. ✅ Manual demo flow works end-to-end with real backend + real keys + real cache.
5. ✅ A6's e2e demo gate script passes.

If any fails: queue a targeted fix-shard. Do NOT proceed to PHASE 5.

---

## PHASE 5 — B-pass verification (parallel)

Per `refactor/POST-REFACTOR-QA-PLAN.md`. B1-B9 fan out parallel, each verifying its A-shard's findings closed. Reports at `refactor/audits/B<N>-verification.md`.

If B-pass shows regressions: queue R-pass-2 (targeted re-fix). Iterate until all B-shards report ALL_CLOSED.

---

## Universal R-shard discipline (applies to PHASES 1-3)

The user's lock for major refactor moves: **max effort, deep thinking, no hardcoding, alignment over speed.** Every R-shard must follow this discipline:

### 1. Set thinking effort to MAX

Every R-shard prompt opens with: `Set thinking effort to MAX for every architectural decision in this shard. Use xhigh-effort thinking on any change that touches more than one file or alters a public API. Take time. Better slow + correct than fast + wrong.`

### 2. Read the verbatim yaps before writing code

Every R-shard reads BEFORE making changes:
- `caltech/yaps/2026-04-25-empowerment-synthesis/01-high-signal-extracts.md` — the empathy-layer thesis in Johnny's own words
- `caltech/yaps/2026-04-25-capability-first-pivot/01-high-signal-extracts.md` — why the architecture pivoted (alignment with end goal)
- `caltech/yaps/2026-04-25-execution-layer-search/01-high-signal-extracts.md` — what "execution layer" means to Johnny
- `caltech/yaps/2026-04-25-listenlabs-conversation/01-high-signal-extracts.md` — Listen Labs scenario framing
- `caltech/yaps/2026-04-25-team-execution-status/00-raw-yap.md` — the latest team-state yap (rawest)

Every refactor decision must trace back to a verbatim Johnny line OR a locked PRD section. If neither, escalate to the orchestrator.

### 3. Preservation discipline (never silent-delete)

When R-STRUCT or any R-shard moves/deletes a file:
- Run `grep -rn "<filename>"` across the repo BEFORE the move/delete.
- If any reference exists, either fix the reference OR convert the move to an archive (`git mv` to `archive/`) — never `rm`.
- Every move/delete records in `refactor/audits/R<N>-summary.md` with: original path → new path (or `[archived]` / `[deleted]`), and the grep output proving safety.
- Functionality preservation: if a code change risks removing functionality (e.g., dropping `_stub_report` paths), confirm there's a real-API path to replace it. Never remove a code path without a verified replacement.

### 4. No hardcoding double-check

Before any R-shard reports DONE:
- `grep -rnE "= ['\"][A-Z][a-z]+ et al\." backend/ frontend/src/` — flag canned citations.
- `grep -rnE "(0\.[0-9]+|0\.40|0\.84)" backend/services/ | grep -v "test\|fixture"` — flag magic numbers without comments.
- `grep -rn '"stub":\s*True\|return _stub' backend/services/` — must be 0 lines.
- Frontend: `grep -rn "const trajectory\|const.*= \[{round" frontend/src/stages/` — must be 0 lines (only fixtures).

### 5. End-goal alignment statement

Each R-shard's `R<N>-summary.md` opens with:
> **Alignment statement:** This refactor advances the end goal of [empathy-grounded paragraph anchored to brain evidence] by [specific causal link]. Verbatim Johnny line backing this: [quote + yap path].

If the alignment statement can't be written truthfully, the R-shard pauses and escalates.

---

## Standing QA document (locked after PHASE 1)

Once R-DOCS merges, these 3 files become the contract:
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` (v2 final)
- `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` (v2 final)
- `caltech/architecture-overview.md` (v2 final)
- `caltech/NEW-ARCHITECTURE.md` (canonical summary)

Every R-shard's commit message must reference the PRD §section it implements. Every B-shard's verification commands trace back to PRD acceptance criteria. Every future demo-day decision cites these docs.

The point: the PRD stops being a planning artifact and starts being the testable spec.

---

## Orchestrator's job during PHASES 1-5

The orchestrator (this main session) does NOT spawn shards in parallel during R-pass. It:
1. Reads + synthesizes audit reports (PHASE 0).
2. Writes the EXECUTION-PLAN (PHASE 0 output).
3. Spawns R-DOCS, watches, merges (PHASE 1).
4. Spawns R-STRUCT, watches, merges (PHASE 2).
5. Spawns R1, watches, merges; spawns R2, watches, merges; ... R9 (PHASE 3 sequential).
6. Runs settle gate (PHASE 4).
7. Spawns B-pass (PHASE 5 parallel).

Worktrees + tmux windows are reused across phases — the orchestrator script tears down old `audit/<shard>` worktrees before spawning `refactor/<shard>` ones.

---

## Watch script

A polling watch script is at `refactor/watch-audits.sh` — runs the trigger-condition check every minute and prints a status line. When the condition flips to READY, come back to the orchestrator session and say **"QA the audits"** to start PHASE 0 synthesis.
