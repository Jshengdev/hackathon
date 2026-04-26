# A7 — Structure Consolidation Audit

**Shard:** A7-structure-consolidation
**Mode:** Audit-only (no code modifications)
**Author:** A7 Claude
**Date:** 2026-04-25
**Repo state at audit:** branch `audit/A7-structure-consolidation`; tip `419828d` (Merge `origin/main`).
**Reference:** PRD v2 §3 + §4 (`_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md`), `caltech/architecture-overview.md`, `caltech/NEW-ARCHITECTURE.md`, `refactor/CONSTRAINTS.md`, `refactor/CONTRACTS.md`.

---

## TL;DR

The runtime is healthy at the **module layer** — `backend/main.py` consumes only the v2 services and the frontend talks only to the documented HTTP/WS surface — but the **filesystem layer carries three accreted strata**: the live v2 stack (`backend/`, `frontend/`), a complete-but-orphaned v1 stack (`caltech/engine/`, ~4,000 LOC, no inbound imports), and three placeholder/scratch dirs (`junsoo/` empty, `feesh/` gitignored separate-repo, `refactor/audits/audits → audits` recursive symlink). Plus four content violations of the locked rules: `vision_client._stub_report`, `warmup.py` silent `{"stub": true}` fallbacks, `ComparisonStage.vue` inline trajectory mock + dead route, and a per-clip cache that doesn't match Contract C1 yet (no `swarm_readings.json` / `empathy.json` / `falsification.json` / `k2_region_cache.json` committed). **Recommended layout = Option C (Targeted hygiene)**: archive `caltech/engine/`, delete `junsoo/`, hoist docs to `docs/`, defer the full `apps/services` monorepo move to post-demo. Each cleanup step in §8 leaves a working demo.

---

## 1. Top-level dir inventory

Verified by `du -sh`, `find … -name '*.{py,vue,ts,js,jsx,tsx}' | wc -l`, `git log -1 -- <dir>`, and direct `ls`/`Read` inspection.

| Dir | Purpose | LOC files | Size on disk | Last touched | Status | Notes |
|---|---|---|---|---|---|---|
| `backend/` | Active demo backend (FastAPI + K2 + Qwen + embedding-proxy + WS swarm). | 7 029 (incl. `.venv`) | 725 M | `9941283` 53 min ago | **ACTIVE** | Real LOC excl. `.venv` is ~3.1 K (see §2.1). |
| `frontend/` | Active demo UI (Vue 3 + Three.js). | 1 368 (incl. `node_modules`) | 63 M | `9941283` 53 min ago | **ACTIVE** | Real source LOC = 3 579 across 17 `.vue/.js` files (§3.1). |
| `caltech/` | Project-work area: PRD, architecture, use-cases, pitch-deck, the v1 empathy engine, yaps. | 18 366 (mostly `pitch-deck/`) | 924 M | `419828d` 25 min ago | **MIXED** | `caltech/engine/` is dead v1 code (§4.1). `caltech/pitch-deck/` is a self-contained Next.js app (923 M of which 622 M = `node_modules`, 288 M = `.next`). The rest is markdown. |
| `research/` | Sponsor clones, papers, wiki of locked decisions. | 1 780 | 2.8 G | `04ffa55` 6 hr ago | **ACTIVE (read-only)** | Most weight is `sponsors/*/clones/*` which is gitignored. |
| `_bmad/` | BMad workflow plugin config. | 3 | 712 K | `ccb8625` 2 hr ago | **ACTIVE (tooling)** | Not part of demo runtime; tracked for shard orchestration. |
| `_bmad-output/` | BMad workflow outputs (planning-artifacts: PRDs). | 0 | 276 K | `fe18314` 26 min ago | **ACTIVE (docs)** | `planning-artifacts/ironsight-listenlabs-technical-prd.md` is authoritative for v2. |
| `archive/` | Historical artifacts: pre-v2 empathy engine, TRIBE pipeline, junsoo scripts, MIROFISH ref. | 18 | 312 K | `ccb8625` 2 hr ago | **ARCHIVAL** | Already serving its function. No inbound imports. |
| `junsoo/` | Re-introduced scratch dir. | 0 | 4.0 K | `9941283` 53 min ago | **EMPTY** | `ls junsoo/` returns nothing. `.gitignore` already excludes its build artifacts. **Safe to remove.** |
| `feesh/` | Nested separate-repo workspace (`Jshengdev/feesh`). | 0 | 284 K | (untracked) | **NOT-OURS** | `.gitignore` line 33: `# Nested project workspace — tracked in its own repo (Jshengdev/feesh)` then `feesh/`. Contains research markdown only. **Move out of this repo or delete the placeholder.** |
| `refactor/` | This audit-swarm orchestration: shards, audits, constraints, contracts, launcher. | 0 | 80 K | (untracked) | **ACTIVE (tooling)** | Lifecycle = duration of the refactor; can graduate to `plans/` post-merge. **Note: `refactor/audits/` previously contained a recursive symlink `audits → /Users/.../refactor/audits` that creates an infinite-loop directory** (no longer present after audit-shard initialization, but worth a `find -L … -type l -lname '*refactor/audits'` guard). |

**Hidden/runtime-only:**
- `worktrees/` — git worktrees for each audit shard (`A1`…`A8`). Created by `refactor/spawn-audit-swarm.sh`. Lifecycle = until merged back. Don't track.
- `backend/.venv/` — local Python venv. Already in `.gitignore`.
- `backend/cache/` — `yeo7_fsaverage5_labels.npy` (atlas labels). Active runtime asset. Already gitignored at the dir level (line 67 of `.gitignore`).
- `backend/qa_logs/` — 5.9 M of dev-time response captures + 3.9 M of UI screenshots. Useful but doesn't belong on the demo critical path — see §4.

---

## 2. Backend deep-walk

### 2.1 `backend/services/` — module status

LOC verified via `wc -l`. Imports verified via `grep -rn "^from services\|^import services" backend/`.

| File | LOC | Public surface | Imported by | Status | Maps to PRD §4 stage |
|---|---:|---|---|---|---|
| `__init__.py` | 0 | — | (package marker) | ACTIVE | — |
| `brain_mesh.py` | 146 | `class BrainMesh` | `main.py:15` (startup, `/brain/mesh`) | ACTIVE | brain hero asset |
| `activity_reader.py` | 162 | `class ActivityReader`, `_normalize_region_frames` | `main.py:16`, `smoke_test_swarm.py:33` | ACTIVE | activity ingestion |
| `swarm.py` | 150 | `class Agent`, `class SwarmSimulation` | `main.py:17` (`/brain/start`, `/ws`) | **ACTIVE-LEGACY** | Pre-v2 brain-globe agent simulation; PRD v2 §4.3 doesn't reference `SwarmSimulation`. The WS feed it drives is still listed in C4 as `/ws`, but the v2 dashboard (`NEW-ARCHITECTURE.md` §5) consumes `swarm_readings.json` + `empathy.json` directly. **Decision needed: keep `/ws` as the live agent-edge animator or retire it?** |
| `orchestrator.py` | 215 | `class Orchestrator`, `_parse_observation`, `_load_prompt`, `_looks_like_template_echo`, `_strip_label` | `main.py:18` (class + parser), `swarm_runner.py:12` (parser only) | **MIXED** | `_parse_observation` is shared K2 output sanitizer (KEEP). The `Orchestrator` class is v1-style end-to-end driver (per swarm-loop merge in CONSTRAINT 3 it's superseded). Class likely reachable only via legacy WS path. |
| `k2_client.py` | 90 | `class K2Client`, `_strip_reasoning` | `empathy_synthesis.py`, `iterative_loop.py`, `swarm_runner.py`, `orchestrator.py`, `warmup.py` | ACTIVE | shared K2 surface (PRD §4.3) |
| `vision_client.py` | 449 | `class VisionClient`, `extract_frames` | `main.py:20`, `warmup.py:243` | **ACTIVE + VIOLATIONS** | Stage 1A. Contains `_stub_report()` (line 192) returning `{"stub": True, ...}` payloads on **6 different failure paths** (lines 396, 401, 409, 423, 431, plus the JSON-parse fallback at 441). Violates CONSTRAINT 2. See §3.4. |
| `swarm_runner.py` | 135 | `run_swarm`, `_aggregate_per_network`, `_call_one`, `_load_system_prompt` | `main.py:21`, `warmup.py` | ACTIVE | Stage 1B (PRD §4.3) |
| `empathy_synthesis.py` | 202 | `synthesize`, `_build_user_message`, `_format_*`, `_load_system_prompt` | `main.py:22`, `warmup.py` | ACTIVE | Stage 2 (PRD §4.3 — K2 moderator, swapped from Opus per CONSTRAINT 3) |
| `iterative_loop.py` | 209 | `run_iterative_loop`, `evaluate_paragraph`, `_evaluate_one`, `_per_region_miss` | `main.py:23`, `warmup.py` | ACTIVE | Stage 3 (PRD §4.3 — K2 evaluator swarm) |
| `falsification.py` | 24 | `compute_falsification` | `main.py:24`, `warmup.py` | ACTIVE | Stage 5 (PRD §4.5 — embedding-proxy delta) |
| `session_cache.py` | 66 | `read_cached`, `write_cached`, `invalidate`, `_cache_path` | `main.py:25`, `warmup.py` | ACTIVE | per-clip JSON cache helpers |
| `warmup.py` | 354 | `warmup_clip`, `get_warmup_status`, `_build_empathy`, `_bake_k2_region_cache`, `_run_k2_region`, `_load_*` | `main.py:26` (`/demo/match` BackgroundTask) | **ACTIVE + VIOLATIONS** | Stage-orchestration. On exception in vision/swarm it writes silent fallbacks: `vision_report = {"scene_summary": "", "stub": True, "error": str(e)}` (line 282) and `swarm_readings = {"clip_id": clip_id, "regions": {}}` (line 296). Violates CONSTRAINT 2. |
| `guardrails.py` | 34 | `pass_guardrail_pre_flight` | `empathy_synthesis.py:20` (try-import; falls back to `lambda _: True` if missing) | ACTIVE | pre-flight regex check |
| `embedding_proxy/__init__.py` | (loaded as package) | `embed_text`, `project_to_yeo7`, `activity_target_vector`, `proxy_score`, `NETWORKS`, `EMBEDDING_DIM` | `falsification.py`, `scripts/fit_projection_map.py` | ACTIVE | Stage 5 (PRD §4.5). NB: package shadows a same-named data dir — see comment in module docstring. |

**Backend totals:** 14 active service files + 1 package, 3 146 LOC excl. `__pycache__` and `.venv`. Two files carry the silent-stub anti-pattern (CONSTRAINT 2).

### 2.2 `backend/prompts/` — referenced map

| File | Loaded by | Status |
|---|---|---|
| `default_mode.md`, `dorsal_attention.md`, `frontoparietal.md`, `limbic.md`, `somatomotor.md`, `ventral_attention.md`, `visual.md` (7 Yeo7) | `swarm_runner._load_system_prompt` (line 39), `warmup._load_region_system_prompt` (line 76), `orchestrator._load_prompt` (line 90), `main.py:469` (`/demo/k2-region`) | ACTIVE |
| `moderator_synthesis.md` | `empathy_synthesis._load_system_prompt` (line 60) | ACTIVE |
| `evaluator_score.md` | `iterative_loop._load_evaluator_system_prompt` (line 45) | ACTIVE |
| `moderator.md` | (no inbound `read_text`/`open` reference found) | **ORPHAN** — superseded by `moderator_synthesis.md`. Safe to archive. |

### 2.3 `backend/prerendered/` — Contract C1 conformance

C1 says each `prerendered/<clip_id>/` should contain: `<clip_id>.mp4`, `activity.json`, `scenario.json`, `vision_report.json`, `swarm_readings.json`, `k2_region_cache.json`, `empathy.json`, plus optional `control_activity.json`. (Plus `falsification.json` per `NEW-ARCHITECTURE.md` §3.)

Verified by `find backend/prerendered -maxdepth 2 -type f`:

| Clip | Has | Missing per C1 | Extra (not in C1) |
|---|---|---|---|
| `30s_ironsite/` | `30s_ironsite.mp4`, `activity.json`, `scenario.json`, `vision_report.json` | `swarm_readings.json`, `k2_region_cache.json`, `empathy.json`, `falsification.json` | `comparison.json` (orphan from old comparison stage; no producer in current codebase, no live consumer — `ComparisonStage.vue` is dead, see §3.2) |
| `30s_twitter/` | `30s_twitter.mp4`, `activity.json`, `scenario.json`, `vision_report.json` | same four as above | — |
| `example_clip/` | `activity.json`, `scenario.json`, `action_segments.json`, `ironside_report.json`, `per_action_activations.json` | mp4, `vision_report.json`, `swarm_readings.json`, `k2_region_cache.json`, `empathy.json`, `falsification.json` | three `report_card`-pipeline artifacts — see `archive/report_card/{aggregate_per_action.py, run_report_card.py}`. Pipeline is in `archive/`, fixture is still in active dir. |

**Findings:**
- **CONSTRAINT 7 / PRD §3 deviation.** No clip currently has the four files that warmup.py is supposed to bake at `/demo/match` time. They will be written on first run, but per CONSTRAINT 7 the demo-day reliability story is "real-LLM-generated and committed to repo on Saturday 8 AM." None are committed.
- **`example_clip/` no longer matches C1.** It's a v1-pipeline fixture. Recommendation: drop `example_clip/` (replaced by `30s_*` clips) or relocate to `archive/example-fixture-v1/`.
- **`comparison.json` in `30s_ironsite/`** is a stale artifact from the deprecated comparison view. Drop.
- **`.DS_Store` files** (macOS metadata) checked into `prerendered/` and `prerendered/30s_ironsite/`. Already covered by `.gitignore` line 2 — re-track gap.

### 2.4 Root-level scripts vs services

| File | Role | Verdict |
|---|---|---|
| `backend/main.py` (579 LOC) | FastAPI app: 21 routes (15 documented in C4 + `/brain/{upload,run-inference}` + startup hook). | KEEP. The single mounted entrypoint. |
| `backend/atlas.py` (117 LOC) | (no inbound imports found by `grep -rn "from atlas\|import atlas" backend/`) | **ORPHAN.** Verify: if standalone CLI for atlas building, move to `backend/scripts/build_atlas.py`. If not used, archive. |
| `backend/smoke_test_swarm.py` (214 LOC) | One-off smoke test. Imports `services.activity_reader` and `services.orchestrator`. | **MOVE to `backend/scripts/`** (or `backend/tests/smoke/`). Currently sits in the same root as `main.py`, which makes the boundary between "API surface" and "ad-hoc script" fuzzy. |
| `backend/scripts/fit_projection_map.py` (30+ LOC) | One-off offline tool: fit 384→7 projection matrix. | KEEP in `backend/scripts/`. **Inconsistency:** uses `from backend.services.embedding_proxy import …` (line 17) with `sys.path.insert(0, str(REPO_ROOT))` — every other backend file uses `from services.X` because uvicorn is launched from `backend/`. Standardize on `from services.embedding_proxy import …` and run from `backend/`. |

---

## 3. Frontend deep-walk

### 3.1 `frontend/src/` — file map

LOC verified via `wc -l`.

| File | LOC | Status |
|---|---:|---|
| `App.vue` | 138 | **ACTIVE** — defines stage map: `landing → loading → main → iterative-reveal → empathy-document`. |
| `main.js` | 4 | ACTIVE |
| `stages/LandingStage.vue` | 308 | ACTIVE — `@matched` event into App. |
| `stages/LoadingStage.vue` | 495 | ACTIVE — fetches `vision-report`, `activity`, polls `warmup-status`. |
| `stages/MainStage.vue` | 344 | ACTIVE — brain hero + region popup. |
| `stages/IterativeRevealStage.vue` | 159 | ACTIVE — fetches `iterative-trajectory`. |
| `stages/EmpathyDocumentStage.vue` | 242 | ACTIVE — fetches `empathy/{clip_id}`. |
| `stages/ComparisonStage.vue` | **201** | **DEAD + VIOLATION** — not in `App.vue`'s `stageMap` (verified). Imports `fetchComparison` from `api/index.js` which **does not exist** there (verified by `grep -n "fetchComparison" frontend/src/api/index.js` → no matches). Build doesn't fail today only because the file is tree-shaken out. Also contains the inline `const trajectory = [ … ]` mock at line 63 — explicitly called out as a violation in CONSTRAINT 4. **Delete.** |
| `components/AnalysisPanel.vue` | 208 | ACTIVE (×2 referrers) |
| `components/BrainScene.vue` | 739 | ACTIVE — three.js + `OrbitControls`, `CSS2DRenderer`. Calls `fetchMesh()`. |
| `components/IterativeLoop.vue` | 503 | ACTIVE (×1 referrer: `IterativeRevealStage`). Stylistic comment at line 384 references "ComparisonStage" — drop after deletion. |
| `components/PersonaShell.vue` | 38 | (×1 referrer; possibly unused — verify) |
| `components/RegionPopup.vue` | 259 | ACTIVE — used by `MainStage`. |
| `components/RoundScoreBar.vue` | 83 | (×1 referrer) |
| `composables/useActivityPlayback.js` | (drives brain visuals from `activity.json` + time ref) | ACTIVE |
| `api/index.js` | (15 named exports: `fetchMesh`, `startSim`, `stopSim`, `fetchStatus`, `postDemoMatch`, `fetchVisionReport`, `fetchActivity`, `postK2Region`, `fetchEmpathyDocument`, `fetchIterativeTrajectory`, `fetchFalsification`, `fetchWarmupStatus`, `videoUrl` …) | ACTIVE |
| `utils/colors.js` | (network color tokens) | ACTIVE |

**No WebSocket consumer in the frontend.** `grep -rn "WebSocket\|new WebSocket\|/ws"` returns only the prose comment in `useActivityPlayback.js` and the vite proxy entry. The backend's `/ws` endpoint exposes per-frame swarm events (PRD §4 + C4) but no Vue component currently subscribes. **Decision needed alongside §2.1:** wire `/ws` from the live dashboard or retire the endpoint.

### 3.2 Dead components / mocks / placeholders

| Item | Evidence | Action |
|---|---|---|
| `stages/ComparisonStage.vue` | Not in `stageMap`. Broken import (`fetchComparison` not exported). Inline trajectory mock at line 63 (CONSTRAINT 4). | **Delete the file.** |
| `components/IterativeLoop.vue:384` comment "ComparisonStage's …" | Stylistic only. | Remove comment after `ComparisonStage.vue` deletion. |
| `LoadingStage.vue:139` "Tick a fake progress while fetching" | This is a UI tick heuristic, not fake data — no rule violation. | KEEP. |
| Inline mocks in shipping code | `grep -rn "MOCK_\|placeholder\|trajectory\s*=\s*\[" frontend/src` → only the `ComparisonStage.vue:63` hit. | Once `ComparisonStage.vue` is removed, the rule-4 violation disappears. |

### 3.3 Frontend ↔ backend boundary

Verified by `grep -rn "fetch\|axios\|XMLHttpRequest\|http://\|https://" frontend/src`. **Every** outbound call goes through `api/index.js` and lands on:

- `${BRAIN}/mesh|status|start|stop` (4 routes)
- `${DEMO}/match|warmup-status/{id}|vision-report/{id}|activity/{id}|empathy/{id}|iterative-trajectory/{id}|falsification/{id}|k2-region` (8 routes)
- `${BRAIN}/upload`, `${BRAIN}/run-inference` not invoked from the frontend (backend-only / dev-only)
- `videoUrl(clipId) → /prerendered/<id>/<id>.mp4` — relies on FastAPI `app.mount("/prerendered", StaticFiles(...))` at `backend/main.py:41-43`
- No hardcoded hostnames; uses bare `/brain` + `/demo` paths proxied by `vite.config.js`. Backend-port assumption (`localhost:8000`) lives **only** in `vite.config.js`.

**No cross-language imports.** `grep -rn "from backend\|import backend\|from caltech\|import caltech\|from junsoo" frontend backend` returned only:
- `backend/scripts/fit_projection_map.py:17` — `from backend.services.embedding_proxy import …` (cosmetic inconsistency — see §2.4)
- `backend/services/embedding_proxy/__init__.py:18` — a docstring mention, not an import.

**Conclusion: the boundary is clean.** The frontend talks to `/brain/*`, `/demo/*`, `/prerendered/*`, and (potentially) `/ws`. Nothing else. If we move `backend/prerendered/` to `data/prerendered/` (Option B), only the static-files mount path needs to change; the URL space stays `/prerendered/<id>/…`.

### 3.4 Stub + fallback content (CONSTRAINT 2 violations) — visibility map

These are not strictly A7's brief (A2-stub-fallbacks owns the catalog), but they directly affect what counts as "dead" vs "actively wrong" in the consolidation:

1. **`backend/services/vision_client.py:192-228`** — `_stub_report(clip_id, reason, n_frames)` returns a §4.1-shaped payload with sensible defaults and `"stub": True`. Called from 6 sites (lines 396, 401, 409, 423, 431, 441). The frontend has no special render path for `stub: true` — it shows the stub as if it were real vision output. **Convert to log+error payload per CONSTRAINT 2 canonical shape.**
2. **`backend/services/warmup.py:282`** — on vision exception: `vision_report = {"scene_summary": "", "stub": True, "error": str(e)}`. Same pattern, propagates into `empathy.json`.
3. **`backend/services/warmup.py:296`** — on swarm exception: `swarm_readings = {"clip_id": clip_id, "regions": {}}`. Empty-shaped fallback (CONSTRAINT 2 §"Acceptable" allows schema-defaulted-empty, but only when the stage *genuinely produced no data* — not on exception).
4. **`backend/services/empathy_synthesis.py:20-22`** — `try: from services.guardrails import pass_guardrail_pre_flight except ImportError: def pass_guardrail_pre_flight(text): return True`. Lambda fallback hides import errors. Use a plain import; let the failure surface.

Per CONSTRAINT 2 closing paragraph: "the autonomous refactor flow should NOT block on rule 2 — instead it should **convert** existing silent stubs into log-and-surface error payloads." That's the R-shard mandate, not A7's, but consolidation can't move these files cleanly until the conversion is done.

---

## 4. Cross-cutting cleanup candidates

| Candidate | Evidence | Recommendation |
|---|---|---|
| `caltech/engine/` (~4 000 LOC across 38 files: `runner.py`, `swarm.py`, `stage1.py`, `stage2.py`, `iterative_loop.py`, `falsification.py`, `score.py`, `registry.py`, `guardrails.py`, `sample_fixture.py`, 5 offline tests, prompt rosters, `HANDOFF_CONTRACT.md`) | `grep -l "from caltech.engine\|import caltech.engine" -r backend frontend caltech` → no inbound imports. Header of `HANDOFF_CONTRACT.md` enumerates Junsoo's lane / Jacob's lane / Johnny's lane in v1 terms. | **Move to `archive/empathy-engine-v1/`.** Preserve as historical reference (the prompts contain useful per-region content the new prompts may want to merge). |
| `caltech/engine/prompts/specialists/{social_pattern, memory_recall, language_region, emotional_processing, …}.md` | Per-scenario specialist roster from v1 (8-region per scenario, *not* the locked Yeo7 7-region used by v2 in `backend/prompts/`). | Archive with `caltech/engine/`. Cherry-pick any per-region wording into `backend/prompts/{visual,…}.md` if useful, then archive. |
| `junsoo/` (empty placeholder) | `ls junsoo/` returns no entries. `.gitignore` lines 30-43 already exclude its build artifacts. Verified `find . -name "junsoo*" -not -path "*/worktrees/*"` returns only the empty dir + `archive/junsoo-scripts/` + `archive/junsoo-papers-CONTEXT.md` + `caltech/tasks-by-person/junsoo-tribe-v2.md`. | **Delete `junsoo/`.** It serves no purpose at HEAD; keep `.gitignore` lines as guards in case someone re-clones the v1 work locally. |
| `feesh/` (separate-repo placeholder) | `.gitignore` line 33 already excludes the dir. Contents: `README.md` + `research/{01,02,03}-*.md`. Tracked under `Jshengdev/feesh` per the gitignore comment. | **Move out of this repo.** Either `git rm -r feesh/` (it's gitignored anyway, so this affects only the local checkout), or replace the placeholder with a single-file `feesh.symlink → ../feesh-repo/`. |
| `backend/qa_logs/` (5.9 M, 56 files, incl. 3.9 M PNG screenshots) | Tracked dev-time evidence captured during build-out. Useful as documentation; not loaded by any service. | **Move to `docs/qa-evidence/`** (or `archive/qa-evidence/` if treated as historical). Keep the screenshots — they're useful for refactor regression checks. |
| `backend/prerendered/example_clip/` | v1 fixture (`action_segments.json`, `ironside_report.json`, `per_action_activations.json`). Producer is `archive/report_card/`. Not loaded by any active main.py route. | **Drop or move to `archive/example-fixture-v1/`.** Replaced by `30s_ironsite/` + `30s_twitter/`. |
| `backend/prerendered/30s_ironsite/comparison.json` | Stale artifact from the deprecated comparison view. No producer in current codebase, no live consumer. | **Drop.** |
| `backend/prerendered/.DS_Store`, `backend/prerendered/30s_ironsite/.DS_Store` | macOS Finder metadata. `.gitignore` line 2 already covers them. | `git rm` and re-track gap. |
| `backend/prompts/moderator.md` | No producer/consumer (`grep -rn "moderator.md" backend/` → only this file). Superseded by `moderator_synthesis.md`. | **Archive** to `archive/prompts-v1/moderator.md`. |
| `backend/atlas.py` | No inbound imports (`grep -rn "from atlas\|import atlas" backend/`). | Verify human use. If standalone CLI, move to `backend/scripts/build_atlas.py`. If unused, archive. |
| `archive/` contents (existing): `empathy-engine/`, `tribe-pipeline/`, `report_card/`, `junsoo-scripts/`, `ironside-prompts/`, `colab_prerender.ipynb`, `tribe_prerender_simple.ipynb`, `MIROFISH-REFERENCE.md`, `INTEGRATION_GAPS.md`, `swarm_contract.md`, `future_plan.md`, `brain-swarm-README.md`, `junsoo-papers-CONTEXT.md` | Already serving their purpose (historical context). No inbound imports from active code (verified). | **Keep as-is.** Consolidation is to *add* to `archive/`, not reorganize it. |
| `caltech/pitch-deck/` (923 M of which 622 M `node_modules`, 288 M `.next`) | Self-contained Next.js app with its own `package.json`, `app/`, `public/`, `remotion/`. Used for the public deck (separate Next.js project). | **Optional hoist to top-level `pitch-deck/`** (Option B/C). Already isolated; "moving up one level" doesn't change its build commands. The 923 M is dominated by gitignored build artifacts; on-disk source is small. |
| `_bmad/`, `_bmad-output/` | Planning workflow tooling + outputs. `_bmad-output/planning-artifacts/` has the v2-authoritative PRD. | **Keep at root.** `_bmad/` is owned by the BMad plugin; `_bmad-output/planning-artifacts/` could be soft-linked from a future `docs/prd/`. |
| `refactor/audits/audits → /Users/.../refactor/audits` (recursive symlink seen earlier) | Earlier `ls /Users/johnnysheng/code/hackathon/refactor/audits/` showed a single recursive symlink. At time of this audit's `ls -la`, the dir is empty (the loop appears to have been cleaned during shard initialization). | **Add a CI / pre-commit guard** against recursive symlinks: `find -L refactor -maxdepth 4 -type l -lname '*refactor/audits' -delete` or similar. |

---

## 5. Long-term layout — three options

### Option A — Status-quo+ (purely additive cleanup)

```
hackathon/
├── backend/                  # unchanged
├── frontend/                 # unchanged
├── caltech/                  # unchanged (incl. pitch-deck/, engine/ ARCHIVED via §4)
├── research/                 # unchanged
├── archive/                  # + empathy-engine-v1/, + qa-evidence/, + prompts-v1/, + example-fixture-v1/
├── _bmad/, _bmad-output/     # unchanged
├── refactor/                 # unchanged (lifecycle = until R-shards merge)
├── tmux-spawn-all.sh, TODO.md, CLAUDE.md
└── (REMOVED: junsoo/, feesh/)
```

- **Pros:** Zero churn at the demo-runtime layer. `tmux-spawn-all.sh` (which hardcodes `REPO=/Users/johnnysheng/code/hackathon`), vite proxy targets, FastAPI startup paths (`Path(__file__).parents[1] / "prompts"`), backend-internal imports — all unchanged. Each cleanup is independent and reversible.
- **Cons:** Still leaves the visible "flat layout" — `backend/` + `frontend/` + `caltech/` + `research/` siblings. Doesn't communicate "this is a polished SaaS-shaped repo" to a judge skimming the GitHub root.
- **Migration cost:** ~2 hours.

### Option B — `apps/` + `services/` + `data/` + `docs/` (full monorepo restructure)

```
hackathon/
├── apps/
│   ├── web/                  # was frontend/
│   └── deck/                 # was caltech/pitch-deck/
├── services/
│   └── api/                  # was backend/
├── data/
│   └── prerendered/          # was backend/prerendered/
├── docs/
│   ├── prd/                  # was _bmad-output/planning-artifacts/
│   ├── architecture/         # caltech/architecture-overview.md, NEW-ARCHITECTURE.md
│   ├── runbook/              # caltech/demo-script*.md
│   └── research/             # was research/
├── plans/                    # was refactor/
├── archive/                  # unchanged
└── tools/, scripts/
```

- **Pros:** Canonical monorepo shape. Onboarding-readable. `apps/services/data/docs` separation is immediately legible. Pitch-deck no longer feels nested under "caltech/" (which sounds like a docs dir).
- **Cons:** Rewrites every hardcoded path:
  - `backend/main.py:35-43` (`PRERENDERED_DIR = Path(__file__).parent / "prerendered"` → `Path(...).parents[1] / "data" / "prerendered"`)
  - `backend/main.py:47` (`PROMPTS_DIR`)
  - `backend/services/{empathy_synthesis,iterative_loop,orchestrator,swarm_runner,warmup}.py` — all use `Path(__file__).parents[1] / "prompts"` (services dir → backend dir → prompts). Must become `Path(__file__).parents[2] / "services" / "api" / "prompts"` or similar.
  - `tmux-spawn-all.sh` (`REPO`, `epic_path`, `WORKTREES_DIR`)
  - `vite.config.js` proxy unchanged (still `localhost:8000`), but `videoUrl()` mapping changes if static-mount path moves.
  - All inter-shard SHARD.md/CONSTRAINTS.md/CONTRACTS.md cross-refs.
  - `refactor/spawn-audit-swarm.sh` (`worktrees/<shard>` paths).
- **Migration cost:** Full day. Each step risks the demo. **Not recommended pre-demo.**

### Option C — Targeted hygiene + docs hoist (recommended)

```
hackathon/
├── backend/                  # unchanged at runtime layer
│   ├── services/             # standardized: all imports `from services.X` (fix scripts/fit_projection_map.py)
│   ├── prompts/              # archive moderator.md
│   ├── prerendered/          # commit pre-baked swarm/empathy/falsification/k2_region per CONSTRAINT 7
│   ├── scripts/              # + smoke_test_swarm.py, + atlas.py (if used)
│   └── main.py
├── frontend/                 # unchanged at runtime layer (delete ComparisonStage.vue; remove dead component refs)
├── pitch-deck/               # was caltech/pitch-deck/  (hoisted; symlink at old path during transition)
├── docs/                     # NEW root for all human-readable docs
│   ├── prd/                  # ← _bmad-output/planning-artifacts/
│   ├── architecture/         # ← caltech/{architecture-overview.md, NEW-ARCHITECTURE.md}
│   ├── runbook/              # ← caltech/{demo-script*.md, build-plan-locked.md} if present
│   ├── use-cases/            # ← caltech/use-cases/
│   ├── ideation/             # ← caltech/{ideation, yaps, validation-findings, research-context}/
│   └── qa-evidence/          # ← backend/qa_logs/
├── research/                 # unchanged (raw sponsor + paper material; large, gitignored clones)
├── refactor/                 # unchanged (audit-swarm tooling; promote to `plans/` post-merge)
├── _bmad/, _bmad-output/     # unchanged (BMad plugin owns these)
├── archive/                  # + empathy-engine-v1/, + prompts-v1/, + example-fixture-v1/
├── tmux-spawn-all.sh, TODO.md, CLAUDE.md
└── (REMOVED: junsoo/, feesh/, caltech/engine/, caltech/pitch-deck/)
```

- **Pros:** Visible cleanup wins (no `junsoo/` placeholder, no v1 engine duplicate, no `feesh/` confusion, no nested `caltech/pitch-deck/`). All docs co-located under `docs/` — judges grep one tree. Demo runtime untouched: `backend/` and `frontend/` keep their hardcoded paths. Reversible in stages — each move is its own commit. Option B can layer on after demo if the team wants.
- **Cons:** Hybrid shape — `backend/` and `frontend/` at root alongside a new `docs/` and a hoisted `pitch-deck/`. Not the canonical monorepo template, but communicates intent.
- **Migration cost:** ~3 hours. See §8.

**Recommendation: Option C.** The user's lock was "consolidate the structure and refactor everything into the exact architecture structure that we need for long-term coding development and ensuring that there's a good frontend and stable backend." Option C delivers on the consolidation + the stable/good-quality promise without a 12-hour rename storm before the Saturday-night ship. If post-demo there's appetite, Option B is a clean second pass on a rested team.

---

## 6. Migration risk callouts

What breaks under each option (verified by `grep` against current source):

| Risk | Source of truth | Affected by Option A | Affected by B | Affected by C |
|---|---|---|---|---|
| `tmux-spawn-all.sh` hardcodes `REPO=/Users/johnnysheng/code/hackathon` and `epic_path` references like `caltech/tasks-by-person/junsoo-tribe-v2.md`. | `tmux-spawn-all.sh:16,52-58` | safe | breaks all `epic_path`s | breaks `epic_path`s **only if `caltech/tasks-by-person/` moves** — leave it under `docs/tasks/`-style only if you also rewrite the script |
| `refactor/spawn-audit-swarm.sh` hardcodes `REPO` and `worktrees/<shard>` symlinks back into `refactor/{CONSTRAINTS,CONTRACTS,shards}.md`. | `refactor/spawn-audit-swarm.sh:17,52-59` | safe | breaks symlinks if `refactor/` moves to `plans/` | safe (refactor/ untouched in C) |
| FastAPI startup: `PRERENDERED_DIR = Path(__file__).parent / "prerendered"`. | `backend/main.py:35-43` | safe | requires reparenting | safe |
| FastAPI prompt loading: `_PROMPTS_DIR = Path(__file__).parents[1] / "prompts"` (in 5 service files) and `PROMPTS_DIR = (Path(__file__).parent / "prompts")` (main). | `backend/services/{empathy_synthesis,iterative_loop,orchestrator,swarm_runner,warmup}.py`, `backend/main.py:47` | safe | requires every `parents[N]` recount | safe |
| FastAPI static mount: `app.mount("/prerendered", StaticFiles(directory=str(PRERENDERED_DIR)))`. | `backend/main.py:41-43` | safe | URL stays `/prerendered/...` but `directory=` arg changes | safe |
| Vite proxy: `'/brain' → 8000`, `'/demo' → 8000`, `'/prerendered' → 8000`, `/ws`. | `frontend/vite.config.js:7-13` | safe | safe (URL space stable) | safe |
| `backend/scripts/fit_projection_map.py` uses `from backend.services.embedding_proxy import …` plus `sys.path.insert(0, REPO_ROOT)`. | `backend/scripts/fit_projection_map.py:13-17` | **already inconsistent** (only file using `backend.` prefix) — fix in any option | breaks (would need `from services.api.services.embedding_proxy import …`) | fix to `from services.embedding_proxy import …`, run from `backend/` |
| `embedding_proxy/` is BOTH a Python package and a data dir (`projection_map.npy`, `training_pairs.yaml`). Python import path = data path. | `backend/services/embedding_proxy/__init__.py` (docstring lines 13-18) | safe | safe (move keeps the joint structure) | safe |
| `caltech/engine/HANDOFF_CONTRACT.md` references `junsoo.brain.{forward,reverse}` etc. — none of which exist in current codebase. | `caltech/engine/HANDOFF_CONTRACT.md:5-8` | safe (archived) | safe (archived) | safe (archived) |
| Worktree symlinks: each `worktrees/A*/` has `audits → /Users/.../refactor/audits/` and `CONSTRAINTS.md`, `CONTRACTS.md`, `SHARD.md` symlinks created by `refactor/spawn-audit-swarm.sh`. | `refactor/spawn-audit-swarm.sh:54-59` | safe | breaks if `refactor/` → `plans/` | safe |
| `.gitignore` patterns `backend/prerendered/*/vision_report.json` and `*/comparison.json` (lines 50-51). | `.gitignore:48-51` | safe | path changes if `backend/prerendered/` moves | safe |
| Pitch-deck has its own `node_modules/`, `.next/`, `package.json`. Hoisting to top-level requires no internal change. | `caltech/pitch-deck/` | safe | safe | safe |

**Verified non-breakages under Option C:**
- The frontend/backend HTTP boundary is path-stable (vite proxy doesn't change).
- `backend/` and `frontend/` runtime layouts are untouched.
- `archive/` is purely additive in C.

---

## 7. Boundary violations / leaks (re-affirmation)

`grep -rn "from backend\|import backend\|from caltech\|import caltech\|from junsoo\|import junsoo" backend frontend` returns **only**:

1. **`backend/scripts/fit_projection_map.py:17`** — `from backend.services.embedding_proxy import EMBEDDING_DIM, NETWORKS, embed_text`. Runs with `sys.path.insert(0, str(REPO_ROOT))`. **Inconsistent** with the `from services.X` convention used by every other file in `backend/`. Fix: change to `from services.embedding_proxy import …`, drop the `sys.path` hack, and document "run from `backend/` directory" in the script's docstring.
2. **`backend/services/embedding_proxy/__init__.py:18`** — string in the module docstring; not an import.

That's it. The frontend never reaches into backend Python; the backend never reaches into frontend; neither reaches into `caltech/`, `junsoo/`, or `feesh/`. **The runtime boundary is clean.** The structural boundary is muddy because the *filesystem* contains v1 dead code (`caltech/engine/`) and placeholder dirs (`junsoo/`, `feesh/`) sitting next to the v2 stack.

---

## 8. Refactor execution sequence (R-shards)

Each step **leaves the demo runnable**. Verify after each by running the smoke harness (`backend/smoke_test_swarm.py` and a manual `curl` against the warmup endpoint, plus a Vite dev server start).

> Steps 1-4 are pure-deletion / archive moves and unblock everything else. Steps 5-7 require code edits (fixing CONSTRAINT 2 violations); they are technically R-shard work, but listed here so the consolidation order is end-to-end.

**Phase 1 — Inert dirs (safe deletes; reversible via git revert):**

- [ ] **Step 1.** `rm -rf junsoo/` (verified empty). Verify: `git status` clean for `junsoo/`. Demo runnable: yes (no inbound imports).
- [ ] **Step 2.** Move `caltech/engine/` → `archive/empathy-engine-v1/`. Verify: `grep -rn "caltech.engine\|caltech/engine" backend frontend` returns nothing (already verified by this audit). Demo runnable: yes.
- [ ] **Step 3.** Move `backend/prompts/moderator.md` → `archive/prompts-v1/moderator.md`. Verify: no live consumer (already verified). Demo runnable: yes.
- [ ] **Step 4.** Decide on `feesh/`: if keeping the symlink-to-other-repo pattern, add a top-level `feesh.symlink` and `git rm -r feesh/` (gitignored anyway). Otherwise `git rm -r feesh/`. Demo runnable: yes (no consumer).

**Phase 2 — Cache hygiene (per Contract C1):**

- [ ] **Step 5.** Drop `backend/prerendered/30s_ironsite/comparison.json` (orphan from deprecated comparison view). Verify: no fetch path in `backend/main.py` for `comparison`. Demo runnable: yes.
- [ ] **Step 6.** Move `backend/prerendered/example_clip/` → `archive/example-fixture-v1/`. Demo runnable: yes (`30s_ironsite` and `30s_twitter` are the shipping clips).
- [ ] **Step 7.** Run the warmup pipeline against `30s_ironsite` and `30s_twitter`, then `git add` the resulting `swarm_readings.json`, `k2_region_cache.json`, `empathy.json`, `falsification.json`. **Conformance to CONSTRAINT 7** ("real-LLM-generated and committed to repo on Saturday 8 AM"). Demo runnable: yes (faster — no warmup latency at demo time).
- [ ] **Step 8.** Add `.gitignore`-ignored `.DS_Store` cleanup: `find backend/prerendered -name .DS_Store -delete && git rm --cached backend/prerendered/.DS_Store backend/prerendered/30s_ironsite/.DS_Store`.

**Phase 3 — Frontend dead-code:**

- [ ] **Step 9.** Delete `frontend/src/stages/ComparisonStage.vue`. Verify: `grep -rn "ComparisonStage" frontend/src` returns only the stylistic comment in `IterativeLoop.vue:384`. Build passes (it doesn't fail today only because of tree-shaking; deletion makes it explicit). Demo runnable: yes.
- [ ] **Step 10.** Strip the `IterativeLoop.vue:384` "ComparisonStage's …" comment. Demo runnable: yes.

**Phase 4 — CONSTRAINT 2 conversions (R2 shard owns these; listed for sequencing):**

- [ ] **Step 11.** Convert `backend/services/vision_client.py` `_stub_report` calls (6 sites) to log-then-error-payload per CONSTRAINT 2 canonical shape. Frontend `LoadingStage.vue` should render `error.code === "vision_unavailable"` as a visible red badge. Demo runnable: yes (panels show "VISION UNAVAILABLE" instead of fake report).
- [ ] **Step 12.** Convert `backend/services/warmup.py` lines 282 + 296 silent fallbacks to `logger.error(...) + return {"error": "...", "clip_id": ...}` shape. Demo runnable: yes.
- [ ] **Step 13.** Replace the `try/except ImportError` lambda fallback in `empathy_synthesis.py:20-22` with a plain import. Demo runnable: yes.

**Phase 5 — Backend internal hygiene:**

- [ ] **Step 14.** Move `backend/smoke_test_swarm.py` → `backend/scripts/smoke_test_swarm.py`. Update any docs that reference the old path. Demo runnable: yes (script is dev-only).
- [ ] **Step 15.** Either move `backend/atlas.py` → `backend/scripts/build_atlas.py` (if it's a CLI) or `archive/atlas-builder.py` (if unused). Confirm with the brain-mesh author. Demo runnable: yes.
- [ ] **Step 16.** Standardize `backend/scripts/fit_projection_map.py`: change `from backend.services.embedding_proxy import …` to `from services.embedding_proxy import …`, drop `sys.path.insert`, document "run from `backend/`". Demo runnable: yes.

**Phase 6 — Docs hoist (Option C target shape):**

- [ ] **Step 17.** Create `docs/{prd,architecture,runbook,use-cases,ideation,qa-evidence}/`.
- [ ] **Step 18.** `git mv _bmad-output/planning-artifacts/*.md docs/prd/`. Add `_bmad-output/planning-artifacts/README.md` pointing to new location. Update internal cross-refs in `caltech/NEW-ARCHITECTURE.md` and `refactor/{CONSTRAINTS,CONTRACTS,shards/*}.md` (search-replace the path). Demo runnable: yes.
- [ ] **Step 19.** `git mv caltech/{architecture-overview.md,NEW-ARCHITECTURE.md} docs/architecture/`. Update `refactor/CONSTRAINTS.md §6` and `refactor/CONTRACTS.md` paths. Demo runnable: yes.
- [ ] **Step 20.** `git mv caltech/use-cases docs/use-cases`, same for `caltech/{ideation,yaps,validation-findings,research-context}` → `docs/ideation/`. Demo runnable: yes.
- [ ] **Step 21.** `git mv backend/qa_logs docs/qa-evidence`. Demo runnable: yes.

**Phase 7 — Pitch-deck hoist (optional, last step):**

- [ ] **Step 22.** `git mv caltech/pitch-deck pitch-deck`. Verify: `pitch-deck/package.json` still resolves. Update any deploy-config (Vercel link, etc.) that references the old path. Demo runnable: yes (pitch-deck is independent).

**Verification commands (run after each phase):**

```bash
# Phase 1-4 verification
cd backend && python -m uvicorn main:app --reload --port 8000 &
curl -s http://localhost:8000/demo/clips | jq '.clips | length'  # expect 2
curl -X POST -H 'Content-Type: application/json' \
     -d '{"filename":"30s_ironsite.mp4"}' \
     http://localhost:8000/demo/match | jq
curl -s http://localhost:8000/demo/empathy/30s_ironsite | jq '.best_paragraph'
cd ../frontend && npm run dev   # browse to localhost:3000, complete the flow

# Phase 6-7 verification
grep -rn "_bmad-output/planning-artifacts\|caltech/architecture-overview\|caltech/NEW-ARCHITECTURE" \
   refactor _bmad-output backend frontend  # expect zero hits after Step 18-19
```

Smoke pass + manual click-through ⇒ that phase is green and committed; advance to the next.

---

## 9. Open questions for the orchestrator

1. **Retire `/ws` and `services/swarm.py:SwarmSimulation` or keep them?** They're listed in C4 as live API surface, but no Vue component subscribes (verified: no `WebSocket` constructor in `frontend/src`) and the v2 dashboard pulls from `swarm_readings.json` instead. If they're being held for the brain-globe agent-edge animation, keep them and wire a frontend consumer in A8. If not, retire them and shrink `main.py` by ~80 lines.
2. **`backend/atlas.py` provenance?** No inbound imports. Asking before archiving.
3. **`PersonaShell.vue` referenced from?** `grep` shows 1 file containing the string (likely the file itself or its `import` site). If only self-referencing, archive.
4. **Cap on `caltech/pitch-deck/.next` weight in repo (288 M)?** Should be `.gitignore`d if not already (verify).
5. **Is `caltech/tasks-by-person/` still load-bearing for the tmux orchestration script, or are we past tier-1 spawn?** Affects whether moves under Option C should rewrite `tmux-spawn-all.sh` or leave the dir in place.

---

## 10. Self-review

- **Spec coverage (SHARD.md "Required sections"):** ✅ Top-level inventory (§1), Backend dead-code map (§2 + §4), Frontend dead-code + mock-data map (§3), Cross-cutting cleanup (§4), Long-term layout options (§5), Migration risk callouts (§6), Boundary violations (§7), Refactor execution sequence (§8). All 8 covered.
- **Evidence discipline:** every claim has a `grep`/`wc`/`ls`/`Read` source. Inline mock count = 1 (`ComparisonStage.vue:63`); silent stub count = 6 (vision) + 2 (warmup) + 1 (guardrails import) = 9 sites. caltech/engine inbound import count = 0.
- **Did not modify code.** Only file written: this report. Verified by `git status` showing only the new audit file under `audits/`.
- **Did not block on CONSTRAINT 2.** Surfaced the 9 violation sites as audit findings + put their conversion in Phase 4 of the migration sequence (R2 shard owns the actual edits). Per CONSTRAINT 2 closing paragraph: "the autonomous refactor flow should NOT block on rule 2 — instead it should convert."
- **Recommendation flagged conflicts with demo deadline:** Option B (full apps/services restructure) is explicitly **not recommended pre-demo** in §5; Option C is the de-risked path.

---

**Report ends.**
