# Refactor Execution Plan — synthesized from 9 audits + 3 deepdives (5,124 lines total)

**Date synthesized:** 2026-04-25 23:30 PST
**Authority:** `caltech/NEW-ARCHITECTURE.md` v2 + technical PRD v2 §3+§4 (post-DOCS-merge becomes the standing QA doc).
**Sequence rule:** PHASE 1 (R-DOCS) → PHASE 2 (R-STRUCT) → PHASE 3 (R1..R9 sequential) → PHASE 4 (settle gate) → PHASE 5 (B-pass parallel).

---

## §1 Convergent demo-blocking findings (multi-shard confirmed)

| # | Finding | Confirmed by | Severity | Resolved by |
|---|---|---|---|---|
| **1** | Falsification self-substitution (`main.py:289` + `warmup.py:226` fall back to `main_activity` when control dir missing; both control dirs DO NOT EXIST) → every demo run shows `delta=0.00 · generic_plausible` instead of PRD §12-promised `delta=0.27 · ANCHORED` | A1, A3, A5 | 🚨 **demo-blocking** | R1 + A1-deepdive option (i) hand-picked control |
| **2** | Stage 4 Opus polish absent in code despite docs claiming it | A3, A3-deepdive | important | R3: ship gated `services/empathy_polish.py` (`OPUS_POLISH=1`) |
| **3** | Falsification field-name divergence (backend short-form vs CONTRACTS C2 long-form) | A3, A4, A4-deepdive | important | R-DOCS: **spec moves to short-form** (Pick B per A4-deepdive). No code change. |
| **4** | No canonical `logger.error + return error payload` helper exists; `_stub_report` patterns persist | A2 | important | R2: establish `services/error_payload.py` helper + replace all `_stub_report` sites |
| **5** | Empathy guardrail call short-circuited by Python truthiness bug | A1, A1-deepdive | important | R1 (alongside falsification fix) |
| **6** | Cache pre-bake not committed for demo clips → NFR1 (≤90s) holds only on warm path | A1, A5 | demo-day risk | R1 commits Saturday-8AM bake into repo |
| **7** | LoadingStage fake-success log violation (`✓ ready` printed even on fetch failure) | A4, A4-deepdive | minor (CONSTRAINTS §2 violation) | R-FRONTEND: gate success log on `result != null` |
| **8** | EmpathyDocumentStage soft fallbacks (`'(empathy paragraph not yet generated)'`) read as fluent placeholders | A4-deepdive | minor (PROD-only) | R-FRONTEND: flip to "REAL DATA MISSING" red badge in PROD |
| **9** | ComparisonStage.vue is dead (already cut from route per A4) but file remains with 8-round inline mock | A4 | cleanup | R-STRUCT: archive |
| **10** | `comparison.json` outlives deleted `/demo/comparison` endpoint | A1 | cleanup | R-STRUCT: archive + remove `_resolve_video_path` references |
| **11** | `/brain/run-inference` returns 200-with-error-payload; should be 410 Gone | A1 | minor | R3 (alongside swarm-loop pass) |

## §2 Locked decisions from deepdives

| Decision | Resolution | Source |
|---|---|---|
| Stage 4 Opus polish: ship vs cut | **SHIP** — thin gated `services/empathy_polish.py`, single Anthropic call, ~140 tokens out, `OPUS_POLISH=1` flag, K2-best fallback on failure | A3-deepdive |
| Falsification field-name divergence: which side moves | **SPEC moves to short-form** (`{main_score, control_score, delta, verdict}`) — backend + frontend + caches stay put. Update CONTRACTS C2 + PRD §6.6 only. | A4-deepdive (Pick B) |
| Control-clip strategy for falsification | **Ship hybrid:** option (i) hand-picked control video (headline number) + option (ii) temporal-shuffle script (labeled secondary). Option (iii) synthetic only if both fail. | A1-deepdive |
| Repo structure — long-term layout | **Option C** (lighter consolidation, no full rename storm before ship) | A7 |
| Dashboard redesign — swarm readings UI | **Option 1**: 7-row "specialist readings" view bound to cached `swarm_readings`, each row pulses when its network is `top_region`. **No WS changes** in A8 scope. | A8 |
| Loading transition strategy | **Collapse Loading into a brief brain-warm overlay on the same dashboard page** | A8 |
| PostEffects — bloom/vignette/grain | **Bloom ONLY** (UnrealBloomPass). Skip vignette + noise. | A8 |

## §3 Phase sequence

### PHASE 1 — R-DOCS (PRD update FIRST, alone)

**Worktree:** `worktrees/R-DOCS` on `refactor/docs` branch.

**Scope (4 docs):**

1. **`_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md`**:
   - **§6.6 falsification:** rename long-form → short-form per A4-deepdive Pick B. Field names become `{main_score, control_score, delta, verdict}`. Drop `main_video_id`, `control_video_id` fields entirely.
   - **§4.2b Stage 4 polish:** clarify SHIP path with `OPUS_POLISH=1` gating + K2-best fallback semantics (per A3-deepdive).
   - **§13 (FRs):** finish v2-supersession tagging on remaining FRs (FR-J5, FR-K3-K5 already tagged; complete FR-O4, FR-O17 Opus references).
   - **§14 (NFRs):** strike NFR3 (TRIBE forward), NFR6 (Opus per-candidate latency), NFR22 (TRIBE-forward convergence threshold). Add NFR40+ (embedding-proxy 200ms target, K2-three-roles concurrency, no-silent-stub).
   - **§10 smoke gate:** extend with A6's eval recipes (no-fallback grep recipe + integration test cases + e2e demo gate script).

2. **`_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md`** (strategic — currently FULLY STALE):
   - Rewrite §1-§3: two-stage pipeline → swarm-loop merged simulation; live TRIBE → pre-rendered + embedding proxy; Opus-as-Stage-2 → Opus-as-Stage-4-polish (cut-line).
   - Update sponsor-pitch alignment paragraphs: Ironsight = swarm gives video info; Listen Labs = modular Opus framing per persona.
   - Drop "live TRIBE V2 forward + reverse" claims throughout.

3. **`caltech/architecture-overview.md`** (already v2-current):
   - Reconcile against R-DOCS edits to PRD. If anything diverges, fix here.

4. **`caltech/NEW-ARCHITECTURE.md`** (canonical summary):
   - Update field-names table to short-form.
   - Update §3 cache layout: confirm `activity.json` not `target_brain.json`.
   - Add Stage 4 polish flag explicitly.

**Acceptance gate (DOCS-FROZEN):**
- `grep -c "main_paragraph_score\|control_paragraph_score\|falsification_delta" _bmad-output/planning-artifacts/` returns 0.
- `grep -c "Stage 2 Opus\|Stage 2 (Opus)\|Opus 4.7.*Stage 2\|TRIBE forward" _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` returns 0.
- All 4 docs reflect identical field names + identical pipeline diagram.

After DOCS-FROZEN: merge `refactor/docs` → `main`. **PRDs become the standing QA document.**

---

### PHASE 2 — R-STRUCT (file moves, no code)

**Worktree:** `worktrees/R-STRUCT` on `refactor/structure` branch.

**Source:** A7 Option C + A9 deprecation catalog + A1 stale-orphan list.

**Scope:**
- Archive `frontend/src/stages/ComparisonStage.vue` (dead — already cut from route per A4).
- Archive `backend/prerendered/30s_ironsite/comparison.json` (orphan — endpoint deleted).
- Archive `backend/prerendered/example_clip/{action_segments.json, per_action_activations.json, ironside_report.json}` (v1 artifacts).
- Archive `caltech/engine/` if A7 Option C confirms (verify no active imports first).
- Archive `junsoo/`, `feesh/` if scratch (preservation discipline: grep all references first).
- Strip `.DS_Store` from prerendered dirs + add to `.gitignore`.
- Update `CLAUDE.md` repo-map to match.
- Update `research/INDEX.md` if any sponsor clones moved.

**Acceptance gate:**
- `python -c "import backend.main"` works.
- `cd frontend && npm run build` clean.
- `git diff main refactor/structure -- '*.py' '*.vue' '*.js' '*.ts'` returns empty (zero source changes).

After: merge `refactor/structure` → `main`.

---

### PHASE 3 — Code refactors (sequential)

| # | Shard | Worktree branch | Scope | Demo-blocking? |
|---|---|---|---|---|
| **R1** | falsification + cache pre-bake | `refactor/falsification` | Generate hand-picked control_activity.json + temporal-shuffle alternative; remove `main.py:289`/`warmup.py:226` self-substitution; fix empathy guardrail truthiness bug; commit pre-bake JSONs for both clips. | 🚨 yes — fixes finding #1, #5, #6 |
| **R2** | strip silent stubs | `refactor/no-stubs` | Establish `services/error_payload.py` canonical helper; replace every `_stub_report` / `"stub": True` site with `logger.error + error payload`. Per A2 audit's ordered checklist. | important |
| **R3** | swarm-loop conformance + Opus polish | `refactor/swarm-loop` | Implement `services/empathy_polish.py` gated by `OPUS_POLISH=1`; fix `/brain/run-inference` to return 410. Per A3 + A3-deepdive. | important |
| **R-FRONTEND** | LoadingStage + EmpathyDocumentStage soft fixes | `refactor/frontend-soft` | Gate LoadingStage success log; flip EmpathyDocumentStage soft fallbacks to "REAL DATA MISSING" red in PROD. Per A4-deepdive. | minor |
| **R6** | eval harness | `refactor/eval` | Install A6's grep recipes, integration tests, schema validators, e2e demo gate. Add CI / pre-commit. Per A6 (802-line spec). | quality |
| **R8** | brain dashboard redesign | `refactor/dashboard` | Greenchain layout × icarus hover anchors. Vue 3 + Three.js translation per A8 §3 table. Single-page collapse. UnrealBloomPass only. Per A8. | hero |
| **R9** | code-quality lint pass | `refactor/lint` | Long-line fixes (>120 chars), debug `print()`/`console.log` removal, bare `except` replacement, TODO/FIXME triage. Per A9 §4-§6. | quality |

**Universal R-shard discipline (per POST-AUDIT-ORCHESTRATION.md §"Universal R-shard discipline"):**
- Set thinking effort to MAX.
- Read 5 verbatim yaps before writing code.
- Preservation discipline: grep all references before any move/delete.
- No-hardcoding double-check before reporting DONE.
- End-goal alignment statement in every R-shard summary.

**Between R-shards:** orchestrator runs eval harness, confirms no regression before next R-shard fires.

---

### PHASE 4 — Settle gate

5 conditions per `POST-REFACTOR-QA-PLAN.md`:
1. ✅ All R-shards merged
2. ✅ Backend tests green (`pytest backend/`)
3. ✅ Frontend `npm run build` clean
4. ✅ Manual demo flow Landing → Dashboard works end-to-end with real backend, real keys, real cache
5. ✅ A6 e2e demo gate script passes

If any fails: targeted fix-shard. Do NOT proceed to PHASE 5.

---

### PHASE 5 — B-pass verification

Per `POST-REFACTOR-QA-PLAN.md`. B1-B9 fan out parallel, each verifying its A-shard's findings closed. Reports at `refactor/audits/B<N>-verification.md`. If regressions: queue R-pass-2.

---

## §4 Cross-shard conflicts surfaced + resolution

| Conflict | Resolution |
|---|---|
| A4 says ComparisonStage is dead; A8 plans dashboard collapse | R-STRUCT archives ComparisonStage; R8 builds dashboard |
| A1 + A5 both diagnose falsification self-substitution | R1 owns the fix; A1-deepdive supplies control-clip strategy |
| A2 + A9 overlap on stub-fallback catalog | A2's ordered checklist is canonical; A9 defers to A2 (per A9 §10 open questions) |
| A7 + A9 overlap on file moves | A7 Option C is canonical layout; A9 supplies extra deprecated-doc archive paths; R-STRUCT merges both lists |
| A4 says no migration needed; A8 says dashboard collapse needed | R-FRONTEND handles soft fallbacks; R8 handles dashboard collapse separately. A4's "nothing to migrate" applies only to the empathy-document path. |

## §5 Open questions for human (orchestrator escalation)

1. **Control-clip selection (A1-deepdive):** approve hand-pick + temporal-shuffle hybrid? Or drop falsification on consumer scenario (NFR15 within-subject violation otherwise — between-subject downgrade).
2. **R8 dashboard timing:** dashboard collapse is the biggest frontend change; ship it Saturday morning, or defer to post-demo?
3. **R6 eval harness in CI:** install pre-commit hooks now or just have ad-hoc shell scripts? A6 recommends pre-commit.

These questions land in the R-shard summaries with `[ESCALATE]` tags.

---

## §6 Total work estimate

- R-DOCS: 30-60 min (focused doc edits across 4 files)
- R-STRUCT: 30-60 min (`git mv` + `git rm` + verify)
- R1: 1-2 hr (code + cache regen)
- R2: 1-2 hr
- R3: 1-2 hr
- R-FRONTEND: 30-45 min
- R6: 2-3 hr (eval harness)
- R8: 3-5 hr (dashboard rebuild)
- R9: 1-2 hr (lint pass)
- Settle gate + B-pass: 1-2 hr

**Total: 11-21 hr of work, sequenced.** Critical path R1 (demo-blocking) → R-DOCS → R8 (hero). Other shards parallelizable inside their phase if user decides.
