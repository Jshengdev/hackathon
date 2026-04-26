# SHARD A3 — v2 swarm-loop architecture conformance audit

You are an audit-only Claude instance. Do NOT modify code.

## Critical context

The technical PRD was updated 2026-04-25 (commit `fe18314`) to v2 — TRIBE-cut + swarm-loop architecture. K2 plays THREE roles on one surface:
- **Stage 1B** (specialists, 7 parallel) — `services/swarm_runner.py`
- **Stage 2** (moderator, 1 call per round) — `services/empathy_synthesis.py`
- **Stage 3** (evaluators, 7 parallel per round, 8 rounds with plateau exit) — `services/iterative_loop.py`

Opus 4.7 = **Stage 4 polish ONLY** (~100-word literary pass; CUT-LINE first; ships K2 best paragraph as-is on cut). See PRD §4.2b.
Falsification = **Stage 5 embedding-proxy** (sentence-transformer → 7-dim Yeo7 projection vs activity.json). See PRD §4.4b.

Your job is to audit how faithfully the pulled code (in `backend/services/`) implements the v2 architecture diagram in PRD §3, NOT to design a merge — the merge is already specified.

## Read first
- `refactor/CONSTRAINTS.md` (especially rule 3)
- `refactor/CONTRACTS.md` (especially C2 EmpathyDocument shape, C3 per-round trace)
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` §3 (architecture diagram), §4.2 (Stage 2 = Opus), §4.3 (iterative loop = K2), §6.4–§6.7 (data contracts), §8 (Stage 2 + iterative loop spec)
- `caltech/architecture-overview.md` (especially the K2 SWARM box, ITERATIVE LOOP box, and STAGE 2 box)
- The `suggestion_locked_2026_04_25` note at the top of architecture-overview.md

## Investigate
1. **v2-conformance map.** For each of `services/swarm_runner.py`, `services/empathy_synthesis.py`, `services/iterative_loop.py`, `services/falsification.py`, `services/embedding_proxy/__init__.py`: read the code, then verify that input/output, API surface, and dependencies match what PRD §3 + §4.2 + §4.3 + §4.4b specify. Cite the deviation if any (e.g., "swarm_runner.py:42 still imports tribev2 — should be removed per PRD §4.4 v2 rule").
2. **Stage 2 = K2 (not Opus).** Verify `empathy_synthesis.py` calls K2 (not Anthropic) for the moderator role. Verify it accepts `prior_score` and `per_region_miss` for rounds ≥ 2 (PRD §3 Stage 2 box). Check that the prompt loaded is `backend/prompts/moderator_synthesis.md`.
3. **Stage 3 evaluator-swarm shape.** Verify `iterative_loop.py` fires 7 parallel K2 evaluator calls per round (one per Yeo7 network), uses `backend/prompts/evaluator_score.md`, parses `score: <0..1>` + `justification: ...`, computes mean as `round_score`, and applies plateau-exit on |Δ|<0.02 over 2 rounds OR round 8.
4. **Stage 4 Opus-polish boundary.** Where in the pipeline does Opus get called? Is it gated as cut-line (env flag or feature flag)? When polish is cut, does the pipeline ship `best_paragraph` as-is? Verify the polish never runs inside the iterative loop.
5. **Stage 5 embedding-proxy correctness.** Verify `embedding_proxy/__init__.py` does the 384→7 projection via the `projection_map.npy` matrix, that `falsification.py` reads `activity.json` as the target and `control_activity.json` (if present) as the control, and that the `delta > 0.40` verdict threshold is honored.
6. **Per-round trace extraction.** What does each iteration emit? At minimum the trajectory must contain: `round`, `score`, `paragraph_excerpt`, `per_region_attribution: {<network>: {score, justification}}`. Compare against PRD §6.5.
7. **Frontend ↔ backend trace contract.** `frontend/src/components/IterativeLoop.vue` consumes a `:trajectory` prop with `{round, score, paragraphExcerpt}`. Does the v2 backend emit a superset? Document field-name conversions (snake_case backend → camelCase frontend).
8. **Use-case modularity.** The same engine runs `30s_ironsite` (Ironsight prompt) and `30s_twitter` (Listen Labs prompt). Document where the scenario-specific framing lives — should be in the moderator prompt + frontend persona shell only (per PRD §4.5 v2 simplified registry).
9. **Concurrency & latency budget.** Does the code use `asyncio.gather(*calls)` for the 7-call swarms (PRD §4.3 v2 says no semaphore needed inside one stage)? Is the `asyncio.Semaphore(6)` correctly only inside `services/warmup.py` for the k2_region_cache pre-bake? Estimate the cold-warmup time per clip and compare to PRD §3 budget (≈ 90-110s).

## Report (write to `refactor/audits/A3-swarm-loop-merge.md`)

Required sections:
- **v2 conformance matrix** — table per PRD §3 box (Stage 1A, 1B, 2, 3, 4, 5): file path implementing it, deviations from the diagram, severity (critical/important/minor).
- **Stage-by-stage code walkthrough** — for each of the 5 backend services in scope: input/output shape, K2-vs-Opus, prompt path, error-handling pattern, latency estimate.
- **Per-round trace schema** — exact JSON shape of each `round_trajectory[]` entry, validated against PRD §6.5 + frontend IterativeLoop's prop expectations.
- **Stage 4 Opus boundary** — how is the polish gated? cut-line behavior? feature flag? Verify Opus NEVER runs inside the loop.
- **Stage 5 falsification correctness** — proxy math, file IO, threshold honored, control source.
- **Frontend trace contract** — backend emit vs frontend consume. Field-name conversions documented.
- **Latency budget rollup** — table: PRD-target vs estimated actual for each stage. Sum vs 90-110s warmup target.
- **Use-case modularity** — exact files where scenario-specific framing lives (moderator prompt + persona shell). Verify no specialist roster swap (per v2 simplified registry).
- **Risk callouts** — what's likely to silently break? (race conditions in warmup, blocking calls in WS handler, missing activity.json on cold boot).
- **Open questions for orchestrator** — anything that needs PM input.

Do NOT write code. Just the report.

## Acceptance
Report at `refactor/audits/A3-swarm-loop-merge.md` with all 10 sections. Every claim cites a PRD §3/§4 line. Per-round trace schema is a concrete JSON shape, not prose. Latency rollup numbers add up.
