# SHARD A6 — QA + eval harness audit (so every refactor has a passable test)

You are an audit-only Claude instance. Do NOT modify code.

## Skills to load before starting
- `superpowers:test-driven-development` — discipline for write-test-then-code refactor moves.
- `superpowers:verification-before-completion` — never claim done without running the verification commands.
- `superpowers:systematic-debugging` — when an eval fails, root-cause not stub-it-out.

## Critical context

The user's lock: "no fallbacks, real data only — especially frontend." The way to enforce this is structural: every backend stage and every frontend stage must have a concrete eval that fails when the output is fake/stub/canned and passes when the output is real.

This shard catalogs what eval tools EXIST today, what gaps exist, and what needs to be built so the refactor cycle is `run → test → run → test → ship`.

## Read first
- `refactor/CONSTRAINTS.md` (rules 2 + 4 — no fallbacks)
- `refactor/CONTRACTS.md` (the schemas that need validators)
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` §10 (Friday-night 8-test smoke gate), §13 (FRs), §14 (NFRs)
- `caltech/architecture-overview.md` §7 (per-stage latency metrics for smoke gate v2)
- `backend/qa_logs/QA_REPORT.md` (the existing QA pass from 2026-04-25; baseline to extend)

## Investigate

1. **Current eval surface inventory.**
   - Backend smoke tests: `backend/smoke_test_swarm.py` — what does it cover? Document the test cases.
   - Existing QA log: `backend/qa_logs/QA_REPORT.md` + the 17 T-numbered test files. Which endpoints are covered? Which aren't?
   - Frontend tests: search `frontend/` for any `*.test.*` / `*.spec.*` / `vitest.config.*`. What's there?
   - Schema validators: search `backend/services/` for Pydantic models matching CONTRACTS.md (activity.json, vision_report.json, swarm_readings.json, empathy.json, falsification.json). Which contracts have validators, which don't?

2. **Per-FR / per-NFR test mapping.** For every functional requirement in PRD §13 marked `[v2: held]` or `[v2 NEW]`, identify whether a passing test exists. For every NFR in §14, identify whether a measurement exists. Build a coverage matrix.

3. **No-fallback eval tools.** Design the eval that detects a stub leak. Examples:
   - `grep -rn "\"stub\":\s*True" backend/prerendered/` should always return 0 lines on a healthy build.
   - HTTP integration test: hit `/demo/empathy/<clip_id>` with API keys deliberately unset — the response should be HTTP 503 with a structured error body, NOT HTTP 200 with canned content.
   - Schema test: `vision_report.json` must have non-empty `actions[]` AND `scene_summary`; assert these are not the stub strings.

4. **Frontend real-data eval.** The frontend's risk surface: inline mock arrays (the current `ComparisonStage.vue trajectory = [...]`), placeholder strings, hardcoded SVG defaults that fire when data is missing. Catalog every component that has a fallback render path. Propose: in dev mode show the fallback with a red badge; in prod mode (`import.meta.env.PROD`) the fallback path must throw or render an explicit "REAL DATA MISSING" state, never a happy stub.

5. **End-to-end demo gate.** Define a single shell-script gate that proves the full pipeline ran with real data:
   - Hit `/demo/match` for `30s_ironsite`
   - Poll `/demo/warmup-status/30s_ironsite` until `ready: true`
   - GET `/demo/empathy/30s_ironsite` and assert: `stub == false`, `best_paragraph` length > 200, `falsification.delta` is a number, `round_trajectory.length >= 1`
   - Open browser to `http://localhost:3000`, drive through Loading → Main → Comparison, screenshot each stage, scan screenshots for visible "STUB" / "FAILED" badges

6. **Latency budget verification.** PRD §3 says cold warmup ≈ 90-110s. Design a timing harness that runs `/demo/match` cold and breaks down per-stage timing, asserting each stage hits its PRD target.

7. **Comparable golden outputs.** Do we have a "what the empathy paragraph SHOULD say" gold reference for each demo clip? If not, propose one — not as a literal string match but as a content-similarity oracle (cosine ≥ 0.8 against a hand-authored gold paragraph).

## Report (write to `refactor/audits/A6-qa-eval-harness.md`)

Required sections:
- **Eval surface inventory** — every existing test file, what it covers, what it misses.
- **FR/NFR coverage matrix** — table of every v2 FR and NFR with test status (✅ has passing test / ⚠️ partial / ❌ no test).
- **No-fallback eval tools (proposed)** — grep recipes, integration test cases, schema assertions. Concrete commands that go in CI.
- **Frontend real-data eval (proposed)** — per-component checklist; runtime assertions vs PROD-mode behavior.
- **End-to-end demo gate (proposed)** — shell script outline that proves the demo works with real data.
- **Latency budget harness (proposed)** — timing instrumentation strategy.
- **Golden outputs (proposed)** — the eval oracle for "is this empathy paragraph good enough?"
- **Refactor discipline** — how every refactor PR should run this harness pre/post and report deltas.

Do NOT write code. Just the report.

## Acceptance
Report at `refactor/audits/A6-qa-eval-harness.md` with all 8 sections. The FR/NFR coverage matrix lists every v2 PRD FR/NFR. The proposed test commands are concrete (real shell, not pseudo-code).
