# A5 — PRD-alignment master audit

**Shard:** A5 (audit-only, no source modifications)
**Branch:** `audit/A5-prd-alignment-master`
**Date:** 2026-04-25
**Auditor scope:** Cross-cutting alignment between technical PRD v2 (`_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` §3 + §4 + §5 + §6 + §10 + §13 + §14), `caltech/architecture-overview.md`, `caltech/use-cases/*`, `caltech/demo-script.md`, and the actual backend at `backend/` + frontend at `frontend/`.

> Methodology: every claim below traces to a file:line citation I read in this session, or to a shell command result. Where a claim is sourced from a sibling subagent, I re-verified the underlying file directly before relying on it (one Explore-agent summary contradicted CONSTRAINTS.md §6 — I trusted the direct grep over the agent).

---

## 1. PRD requirement matrix

Walk of every load-bearing requirement in tech-PRD §3 + §4 + §6 + §10 + §13 + §14, mapped to current code.

| ID | Requirement (PRD ref) | State | Evidence (file:line) | Gap |
|---|---|---|---|---|
| **§3 pipeline 1A** | Qwen3-VL via OpenRouter, ≤10s, cache to vision_report.json | ⚠️ | `backend/services/vision_client.py:230,360-440`; cache reads at `backend/main.py:271`. Both demo clips have `vision_report.json` already. | On API failure, returns `_stub_report` with `"stub": True` and **writes the stub to disk** (`vision_client.py:396-411`) → CONSTRAINTS rule 2 violation by definition. Should log+return error payload, not pretend success. |
| **§3 pipeline 1B** | 7-network K2 swarm over `activity.json`, ≤8s, cache to `swarm_readings.json` | ⚠️ | `backend/services/swarm_runner.py:117-135`; aggregation at `:45-83` is well-formed. | (a) `swarm_readings.json` is **not present** in `30s_ironsite/` or `30s_twitter/` — cold warmup must run live on first request. (b) On per-call failure, line 113 swallows the exception and returns `{"reading": "[K2 error: <e>]"}` which gets embedded into the moderator's user message as if it were valid → silent-substitution-by-formatting (rule 2). |
| **§3 pipeline 2** | K2 moderator combines vision + swarm → 1 paragraph; ≤5s; guardrail pre-flight | ✅ | `backend/services/empathy_synthesis.py:174-202`; `backend/prompts/moderator_synthesis.md:1-75` correctly enforces all six PRD §5 categories in-prompt. | One nit: line 192 calls `bool(pass_guardrail_pre_flight(candidate))` but the function returns `(ok, violations)`; `bool((True, []))` is always `True`, so the **STRICT MODE retry never fires**. Guardrails depend purely on the in-prompt instruction, not the regex post-check. (See §3 below.) |
| **§3 pipeline 3** | Per-round K2 evaluator swarm × 7 networks; plateau exit `\|Δ\|<0.02 over 2 rounds OR R==8`; emit `round_trajectory[]` + `per_region_attribution` | ✅ | `backend/services/iterative_loop.py:140-209`. Plateau test at `:192-202` is correctly 2-consecutive (`plateau_streak >= 2`). | None — logic matches PRD §3 + FR-K6 (`technical-prd.md:803`). |
| **§3 pipeline 4** | Opus 4.7 polish, ONE call, ~100 words, cut-line | ❌ | `backend/main.py:388` hardcodes `"polished_paragraph": None`. No `anthropic` import in `backend/`. `backend/services/` has no `polish.py`. | Stage 4 is **completely unimplemented**. Per PRD §4.2b this is the cut-line cherry; per CONSTRAINTS rule 6 this is *acceptable* if it's a deliberate cut. But: the Listen Labs sponsor pitch leans on "modular, literature-grade Opus output" — see §6 below. |
| **§3 pipeline 5** | Embedding-proxy falsification; cosine vs control; verdict `delta>0.40 = anchored` | ⚠️ | `backend/services/falsification.py:10-24`; threshold = 0.40 ✓; uses `compute_falsification(paragraph, main_activity, control_activity)` ✓; `services/embedding_proxy/projection_map.npy` exists. | **Control activity baselines do not exist.** `backend/main.py:289-295` `_load_control_activity` silently falls back to `main_activity` when `prerendered/workplace_routine_baseline/` or `prerendered/curated_short_film_baseline/` is missing. Confirmed via `ls backend/prerendered/`: only `30s_ironsite`, `30s_twitter`, `example_clip`. With main==control, `delta = main_score − main_score = 0.0` → verdict `"generic_plausible"` always → §C of the empathy doc displays a **broken** falsification readout. (See §5 below.) |
| **§3 pre-warmup contract** | `POST /demo/match` triggers `warmup_clip` BackgroundTask; pre-bakes vision/swarm/k2_region_cache/empathy; frontend polls `/demo/warmup-status` | ✅ wiring | `backend/main.py:298-327` (match), `backend/services/warmup.py:243-338`. Required keys at `warmup.py:37` = `("vision_report", "swarm_readings", "k2_region_cache", "empathy")`. | **No demo clip has any of those four files yet** — `ls 30s_ironsite/` shows only `activity.json`, `vision_report.json`, `scenario.json`, `comparison.json`, `30s_ironsite.mp4`. PRD §3 calls out "Saturday 8 AM pre-cache freeze runs warmup once and commits the JSON files to repo, so demo-day warmup is just disk reads." That bake hasn't happened. First demo request will trigger 90-110s cold compute. |
| **§4 API surface** | `/demo/{clips, match, warmup-status, vision-report, activity, empathy, iterative-trajectory, falsification, k2-region}` + WS `/ws` + `/brain/*` | ✅ | All present in `backend/main.py`: lines 222 (clips), 298 (match), 330 (warmup-status), 263 (vision-report), 250 (activity), 398 (empathy), 404 (iterative-trajectory), 421 (falsification), 433 (k2-region), 519 (ws), 105+ (brain). Old `/demo/comparison` correctly removed (`technical-prd.md:45`). | None for the contract; see §5 for the falsification *content*. |
| **§5 forbidden claims** | 6 categories enforced (reverse inference / clinical / sub-second / population norm / inflated TRIBE / inner-monologue) | ⚠️ | `backend/services/guardrails.py:12-24` — see §3 below. | **Sub-second predictions** category is not enforced by regex (no patterns for `\d+ ?ms`, `millisecond`, `0\.\d+ ?s`, `sub-second`). Generic "felt" / "thought" without a `she\|he` prefix slip past. Also: STRICT MODE retry never fires (the bool-of-tuple bug). |
| **§6.2 activity.json** | Pre-rendered TRIBE V2 reverse, fsaverage5, 1Hz, 5s HRF lag, per-frame regions | ✅ | Both `30s_ironsite/activity.json` and `30s_twitter/activity.json` present (12.7 KB each). Schema consumed at `backend/services/swarm_runner.py:45-83`. | None for the data; the v2 schema names match `top_region`, `regions{}`, `frames[]`, `t_s`. PRD §6.2 example uses `time_s` — the actual files use `t_s` per CONTRACTS.md C1 — code is consistent with CONTRACTS, not PRD §6.2 example. Not a real issue. |
| **§6.5 EmpathyDocument** | `best_paragraph + final_score + round_trajectory[] + per_region_attribution + falsification`. Frontend renders §A vision / §B empathy / §C falsification | ✅ shape | `backend/main.py:381-393` builds the dict matching CONTRACTS.md C2. `frontend/src/stages/EmpathyDocumentStage.vue:76,116` calls `fetchEmpathyDocument(props.clipId)`; renders §B (`:23-24`), §C (`:33`), trajectory (`:58-61`), attribution (`:99-101`). | (a) `polished_paragraph` always `null` (Stage 4 unimplemented). (b) Falsification verdict on cold cache will read `"generic_plausible"` because controls are missing — §C will render but the headline number is wrong. |
| **§6.5 round_trajectory** | Round, score, paragraph_excerpt | ✅ | `backend/services/iterative_loop.py:181-185`. | Excerpt truncated to 80 chars — PRD §6.5 example is full text. CONTRACTS.md C3 says additive fields are fine; frontend renders `r.score` + excerpt fine. |
| **§10 smoke gate** | 8 Friday-night smoke tests, must pass for fallback decisions | ⚠️ | No smoke test results checked in. `backend/smoke_test_swarm.py` exists — single-purpose smoke for swarm. | No record of #1, #2, #6, #7, #8 being run; #7 (control delta ≥0.40) **cannot pass today** because controls don't exist. |
| **§13 FR-J6** | Pre-cached activity.json for ALL demo clips by Saturday 8 AM | ✅ | both clips have it. | None. |
| **§13 FR-J7** | Pre-cached `control_activity.json` for `workplace_routine_baseline` + `curated_short_film_baseline` | ❌ | `ls backend/prerendered/` returns no baseline dirs. | **Hardest demo-day blocker** — see §5 + §9. |
| **§13 FR-J11** | `services/embedding_proxy/projection_map.npy` (384×7), fit reproducibly | ✅ | `backend/services/embedding_proxy/projection_map.npy` present, `training_pairs.yaml` present. Reproducibility not re-verified in this audit. | Unknown — out of scope here; A2 + A6 should rerun the fit script. |
| **§13 FR-K6** | Plateau exit logic | ✅ | `iterative_loop.py:192-202` correct. | None. |
| **§13 FR-O17** | Guardrail regex pre-flight on every Opus output | ⚠️ | Only fires on K2 moderator output (`empathy_synthesis.py:192`). Stage 4 Opus polish doesn't exist, so vacuously true. | Bool-of-tuple bug skips retry; sub-second pattern missing. |
| **§14 NFR1** | Demo end-to-end ≤90s | ⚠️ | Cold warmup ≈90-110s per PRD §3; warm reads O(1). | Cache files for both demo clips are missing today → first request will hit cold path. Once Saturday 8 AM bake commits, satisfies. (See §2.) |
| **§14 NFR23** | Falsification control delta ≥0.40 | ❌ | Controls missing; current delta on both clips = 0.0. | Hard blocker on the single most demo-visible *number* (the §C "anchored 0.57" line). |
| **§14 NFR4** (frontend mocks) — see CONSTRAINTS §4 | "No inline mock arrays in shipping code" | ❌ | `frontend/src/stages/ComparisonStage.vue:61-72` ships an inline `const trajectory = [...8 mock rounds...]` with comment `// Mock iterative-loop trajectory until the engine's EmpathyDocument JSON wires up`. Not gated behind `import.meta.env.DEV`. | A4's territory but flags for cross-shard coherence. ComparisonStage is the ONLY stage that wasn't ported; the others (`IterativeRevealStage.vue:34,52`, `EmpathyDocumentStage.vue:76,116`) all consume real endpoints. |

---

## 2. Latency budget estimate

PRD §14 NFR1 = "Demo end-to-end ≤90s for live-attempt path". Cold warmup vs. warm read:

| Stage | PRD target | Code path | Per-call (measured / estimated) | Notes |
|---|---|---|---|---|
| 1A — Qwen3-VL vision (5 frames) | ≤10s (PRD §3, NFR5) | `vision_client.py:_call_openrouter`, `timeout=60.0s` | ~5-8s typical (single chat-completion w/ 5 jpegs) | Stub fallback masks failure (rule 2 violation). |
| 1B — K2 swarm × 7 networks, parallel | ≤8s (PRD §3) | `swarm_runner.py:run_swarm`, `asyncio.gather`, `timeout=30s/call` | ~5-15s in practice; parallel in 7 calls | Unbounded gather — no semaphore, fine since 7 < provider limit. |
| 2 — K2 moderator | ≤5s/round (NFR6 was Opus; v2 substitutes K2) | `empathy_synthesis.py:synthesize`, `timeout=30s`, `max_tokens=600` | ~3-6s/call | Fired once per round of Stage 3 loop. |
| 3 — K2 evaluator swarm × 7, R rounds | ≤60s for 8 rounds (NFR7) | `iterative_loop.py:run_iterative_loop`; per-call `timeout=20s` | ~5-8s/round (parallel 7 evals) + ~3-6s/round Stage 2 = ~10-15s/round → 8 rounds ≈ 80-120s **worst-case** | **Risk:** PRD says ≤60s; observed worst-case can exceed. Plateau-exit at round 3+ usually saves. Saturday-8AM bake removes risk. |
| 4 — Opus polish | ≤5s | not implemented | 0s (skipped) | Cut-line; budget freed. |
| 5 — Embedding falsification | ≤200ms | `falsification.py:compute_falsification` | Lazy singleton load ~5-10s on first call (model download); ~50ms thereafter | First-of-process penalty — pre-warm in `startup` would pay it once. Currently doesn't. |
| `k2_region_cache` pre-bake | ~35s w/ Semaphore(6) | `warmup.py:_bake_k2_region_cache` | 7 networks × N frames (30 frames per clip); 210 calls / 6 concurrent ≈ 35-50s | Required for instant brain-3D click responses. |

**Cold-path total per clip (approximate):** 1A 8 + 1B 12 + (Stages 2+3 8 rounds) 80 + region-cache 40 + Stage 5 0.05 ≈ **140s**, plausibly 90-110s with plateau exit at round 4-5.

**Warm-path total per clip (after Saturday 8 AM bake):** all reads O(disk I/O) ≤ 100ms. Demo BEAT-1..5 latency dominated by frontend rendering.

**Verdict:** PRD NFR1 (≤90s) holds *only on the warm path*. The current repo state has zero pre-baked empathy/swarm/region cache for the two demo clips. Either (a) the Saturday-8AM bake lands by then, or (b) demo-day first request blows budget. The right move is to commit the bake; the warmup code is ready.

---

## 3. Forbidden-claim guardrail coverage

PRD §5 lists 6 categories. Walk:

| Category | PRD example | guardrails.py regex(es) | Coverage |
|---|---|---|---|
| Reverse inference | "she felt grief", "he was thinking" | `\bshe felt\b`, `\bhe felt\b`, `\b(she\|he) was thinking\b`, `reads (the )?inner monologue` | ✅ Common shapes covered. ⚠️ Bare "felt" / "thought" / "they felt" / "Maya felt" slip through. |
| Clinical claims | "clinical fatigue", "diagnosis" | `\bclinical\b`, `\bdiagnos(is\|ed\|tic)\b` | ✅ Both. ⚠️ "symptom", "disorder", "pathology", "depression", "anxiety disorder" called out in `moderator_synthesis.md:33-34` and `empathy_synthesis.py:_STRICTER_DIRECTIVE` but **not in regex**. |
| Sub-second predictions | "0.5s prediction" | *(none)* | ❌ **Not enforced by regex.** Pattern set has no `\d+\s?ms`, `millisecond`, `\d\.\d\s?s`, `sub-second`, `per-millisecond`. The in-prompt rule is the only line of defense. |
| Population-norm comparison | "average healthy brain", "normal brain" | `\baverage (healthy )?brain\b`, `\bnormal brain\b` | ✅ Common shapes. ⚠️ "compared to most people", "typical adult", "average person" not covered. |
| Inflated TRIBE numbers | "70K voxels", "700 subjects" | `\b(70\|70,000) ?(k\|thousand)? voxels?\b`, `\b700 subjects?\b` | ✅ Exact PRD examples. ⚠️ Other inflated numbers ("80K voxels", "1000 subjects") slip. |
| "Reads inner monologue" framing | as above | `reads (the )?inner monologue\b` | ✅ |

**Two compounding issues beyond pattern coverage:**

- **`empathy_synthesis.py:192` STRICT MODE retry never fires.**
  ```python
  ok = bool(pass_guardrail_pre_flight(candidate))
  ```
  `pass_guardrail_pre_flight` returns `tuple[bool, list[str]]` (`guardrails.py:27-34`). `bool((False, [...]))` is `True` because the *tuple* is truthy. Result: `if not ok` is always `False`; STRICT MODE never re-fires; the regex post-check is decorative. The in-prompt forbidden block (`moderator_synthesis.md:25-44`) does most of the work — but if K2 violates, the system ships the violation. Refactor signal (per CONSTRAINTS rule 2): change to `ok, _violations = pass_guardrail_pre_flight(candidate)`; on `not ok`, retry once; if still fails, return error payload `{"error": "guardrail_violation", "violations": violations, "clip_id": clip_id}` rather than the violating paragraph.

- **No guardrail on Stage 1A vision report.** `_normalize_report` accepts whatever Qwen returns into `scene_summary`/`actions` and ships it as part of the empathy doc. Vision reports rarely violate, but PRD §5 says "every output". Low risk, flagging.

---

## 4. Scenario routing trace

End-to-end trace from upload → empathy doc:

1. **Upload arrives at `POST /demo/match`** (`main.py:298`). Filename stem becomes `clip_id` (line 305). `_clip_dir(clip_id)` is folder-sandboxed (`main.py:176-187`). 404 if `prerendered/<clip_id>/activity.json` missing.
2. **Scenario read** at `main.py:_load_scenario` (line 190-203) — reads `prerendered/<clip_id>/scenario.json`.
   - `30s_ironsite/scenario.json` → `{"scenario": "ironside", "label": "ironsight · construction site · scaffolding sequence"}`
   - `30s_twitter/scenario.json` → `{"scenario": "consumer", "label": "consumer · reels feed · 30s scroll"}`
3. **`/demo/match` returns** `{clip_id, video_url, activity_url, n_frames, scenario, scenarioLabel}` (line 319-327) and kicks `warmup_clip` BackgroundTask (line 317). Frontend stores `scenario` and renders `PersonaShell` accordingly.
4. **Warmup pipeline:** `warmup.py:warmup_clip` reads activity.json → runs 1A vision → 1B swarm → bakes k2_region_cache → assembles empathy. The scenario string is passed to `run_iterative_loop(..., scenario=scenario["scenario"])` which forwards into `synthesize(..., scenario=...)` (`empathy_synthesis.py:174`).
5. **Where scenario actually changes the output:**
   - `empathy_synthesis.py:_build_user_message` injects line: `f"Scenario: {scenario}"` into the user message (line 138-139).
   - **Moderator system prompt is identical for both scenarios** — `backend/prompts/moderator_synthesis.md` has zero conditional branches; it's loaded once and used for both clips.
   - **Evaluator prompt is also scenario-agnostic** — `backend/prompts/evaluator_score.md` is a single file; users only see network identity, not scenario.
   - **Frontend `PersonaShell.vue`** reads scenario from `/demo/match` response and switches workplace/consumer/pavilion render mode (per PRD §11, NFR2 "three persona-driven framing modes").
6. **What is NOT implemented from PRD §4.5:**
   - The `SCENARIO_CONFIG` table in PRD §4.5 (line 410-420) defines `control_clip_id` per scenario. This is partially honored: `main.py:276-279` and `warmup.py:39-42` both have `_CONTROL_FOR = {"ironside": "workplace_routine_baseline", "consumer": "curated_short_film_baseline"}`. **But the control directories don't exist** (see §5).
   - `persona_render_mode` (workplace / consumer / pavilion) is enforced by frontend, not backend.

**Differentiation strength:** weak. The same moderator prompt + the same 7-network evaluator prompt produces paragraphs that differ only because the K2 model gets a one-line `Scenario: ironside` vs `Scenario: consumer` hint plus different `vision_report` content + different `swarm_readings` derived from different `activity.json`. The moderator is told to "braid physical events with cognitive/affective engagement" — same instruction either way. **See §7 for the predicted-output diff test.**

---

## 5. Falsification readiness

PRD §6.6 deliverable: `{main_paragraph_score, control_paragraph_score, falsification_delta, verdict}` with verdict = "anchored" iff delta > 0.40.

**Required pre-conditions (per PRD §13 FR-J7):**

1. `backend/prerendered/workplace_routine_baseline/activity.json` — for ironside scenario.
2. `backend/prerendered/curated_short_film_baseline/activity.json` — for consumer scenario.
3. `backend/services/embedding_proxy/projection_map.npy` (384×7) fit from `training_pairs.yaml`.

**Actual state:**

| Pre-condition | Present? | Evidence |
|---|---|---|
| workplace control | ❌ | `ls backend/prerendered/` returns only `30s_ironsite, 30s_twitter, example_clip, README.md`. |
| consumer control | ❌ | Same. |
| projection map | ✅ | `backend/services/embedding_proxy/projection_map.npy` exists. Reproducibility not verified here. |

**What happens at runtime today** (trace from `main.py:_ensure_empathy:374`):
1. `control_activity = _load_control_activity(scenario["scenario"], main_activity)`.
2. `_load_control_activity` (`main.py:289-295`):
   ```python
   def _load_control_activity(scenario: str, main_activity: dict) -> dict:
       control_id = _CONTROL_FOR.get(scenario)
       if control_id:
           ctrl_path = (PRERENDERED_DIR / control_id / "activity.json")
           if ctrl_path.exists():
               return json.loads(ctrl_path.read_text(encoding="utf-8"))
       return main_activity
   ```
   **Silently** returns `main_activity` when control is missing. No log, no error payload.
3. `compute_falsification(paragraph, main_activity, main_activity)` → `main_score == control_score` → `delta = 0.0` → `verdict = "generic_plausible"`.
4. Frontend `EmpathyDocumentStage.vue:106-112` renders falsification line with verdict "generic_plausible" — labelled in CSS as "anchored" / "generic" toggle.

**Verdict logic (≥0.40)** is honored. It just never trips because the math is comparing the same vector against itself.

**Per-region attribution** is computed independently (`iterative_loop.py:101-127`) per evaluator scoring — works correctly, separate from falsification.

**This is the single biggest demo-day risk.** PRD §10 smoke test #7 is "Falsification check effectiveness — Control delta ≥ 0.40 on test paragraph". It cannot pass today. The §C falsification readout is the literal proof-of-anchoring story; today it would render `delta=0.00 verdict=generic_plausible` for both clips, which is the demo's anti-payload.

**Recommended fix (refactor signal, NOT in this audit's scope):**
- Bake two control clips offline (Vultr or any TRIBE V2 access) with sensibly *different* activity profiles than the demo clips. Examples:
  - `workplace_routine_baseline/activity.json`: a static office desk, no motion, no salience.
  - `curated_short_film_baseline/activity.json`: an art-house clip with structured pacing.
- Convert the `_load_control_activity` silent fallback into log+error per CONSTRAINTS rule 2:
  ```python
  if not ctrl_path.exists():
      logger.error("control_missing", extra={"scenario": scenario, "expected": str(ctrl_path)})
      raise HTTPException(status_code=503, detail={"error": "control_baseline_missing", "scenario": scenario})
  ```

---

## 6. Sponsor pitch alignment

Per PRD §2 and the build-plan-locked: 5 pitch tracks. For each, does the current architecture make the pitch obvious?

| Pitch | Hard requirement | Current state | Verdict |
|---|---|---|---|
| **IFM K2 Think (CORE)** — "K2 is core to your product" | Multiple K2 calls visibly load-bearing on the user-visible flow | K2 plays 3 roles on one surface (`empathy_synthesis.py:174` moderator + `swarm_runner.py:117` 7-spec swarm + `iterative_loop.py:140` 7-eval × 8 rounds). Per warm-clip demo: ≥ (7 + 1×R + 7×R) = 8 + 14×R K2 calls. R=8 → 120 K2 calls. | ✅ Strongest alignment of the five. The demo ledger demonstrably runs through K2 for every output. Moderator prompt at `prompts/moderator_synthesis.md` shows real K2-specific tuning (output-contract directive, FINAL ANSWER marker — `k2_client.py:58-68`). |
| **Listen Labs (CORE)** — simulate the consumer industry | Generalization across persona/industry; modular paragraph output | Same engine binary handles `30s_ironsite` (workplace) and `30s_twitter` (consumer). The K2-evaluator-swarm-as-evaluator iterative loop *is* the simulation Listen Labs cares about per `caltech/use-cases/listenlabs-sideshift.md`. **However:** Stage 4 Opus polish ("modular literary polish per scenario") is unimplemented (`main.py:388 polished_paragraph: None`). The persona-render-mode (workplace/consumer/pavilion) is on the frontend. | ⚠️ Architecturally fine; output texturally weaker without Opus polish. K2 best paragraph ships as-is per CONSTRAINTS rule 3 cut-line. The Listen Labs "different industry, same engine" claim still holds because of the shared swarm + scenario.json + persona shell — but the literature-grade-prose differentiation between scenarios is absent. (See §7.) |
| **Ironsight (CORE — primary $5K)** — workplace footage proves spatial intelligence | `30s_ironsite.mp4` runs end-to-end through the same engine, produces a workplace-mode empathy doc + falsification | Backend supports it (scenario.json = `ironside`); frontend `PersonaShell` should render workplace mode; pre-bake of cache files **not done** (see §1, §2). | ⚠️ Architecturally aligned but the *artifacts* aren't committed. Without the Saturday-8AM bake, demo-day first request runs cold — and the falsification number is wrong (no control). Both fixable. |
| **Best Use of AI (overall hard target)** — multi-model orchestration with intent | Vision + 3 K2 roles + Opus polish + falsification proxy is the rubric demo | Same answer as Listen Labs + Ironsight: present except Stage 4 + controls. Pipeline is multi-model and intentional. | ⚠️ Strong claim; held back by Stage 4 absence and falsification-zero. |
| **YC stretch (B2C overlay)** — daily journal / vault framing | Persona-shell consumer mode + Wrapped-style or daily-journal framing of the empathy doc | Backend ships scenario `consumer` for `30s_twitter`. Frontend `PersonaShell.vue` exists. The PRFAQ/strategic PRD framing leans on "Sideshift / vault / Wrapped" language that is pre-cut from v2 architecture (`technical-prd.md:45 — /demo/comparison removed`). | ⚠️ Architecturally OK but the storytelling doc layer (caltech/demo-script.md, strategic PRD) still describes a Reels-Wrapped flow that backend no longer matches — see §8. |

---

## 7. Use-case differentiation test (predicted Opus output diff)

Walk the pipeline mentally for both clips with the **current** code:

| Element | `30s_ironsite` | `30s_twitter` |
|---|---|---|
| `activity.json` | TRIBE-baked workplace activations | TRIBE-baked Reels-feed activations |
| `scenario.json.scenario` | `"ironside"` | `"consumer"` |
| `scenario.json.label` | "ironsight · construction site · scaffolding sequence" | "consumer · reels feed · 30s scroll" |
| Vision report (Stage 1A) | qwen3-vl describes scaffolding/tools/motion | qwen3-vl describes phone screen / scrolling content |
| Swarm readings (Stage 1B) | per-network reading per Yeo7 over the workplace activations | per-network reading per Yeo7 over the consumer activations |
| Moderator system prompt | identical (`moderator_synthesis.md`) | identical |
| Moderator user message | + `Scenario: ironside` (one line) | + `Scenario: consumer` (one line) |
| Evaluator prompt | identical | identical |
| Falsification control | `main_activity` (silent fallback) — delta 0.0 | `main_activity` (silent fallback) — delta 0.0 |
| Persona shell | workplace render | consumer render |

**Predicted diff:** ironside paragraph will mention "scaffolding / tool path / embodied attentiveness / dorsal-attention sustained engagement" because vision_report carries those events. Consumer paragraph will mention "screen / feed / default-mode high / visual cortex tracking" because vision_report sees the screen content. The differentiation comes 90% from the upstream `vision_report` + `activity.json` *content* and 10% from the one-line scenario hint. The moderator's "literature-grade prose" instruction is identical, so the *register* of the two paragraphs will be near-identical.

**Differentiation gap:** if Listen Labs judges read "the same engine, two industries", they will see that the engine *can* run both — but the resulting paragraphs will not feel scenario-architected; they'll feel like the same essayist describing two different scenes. Without Stage 4 (Opus polish per scenario) or scenario-conditional moderator prompts, the output texture argument is weaker than the architecture argument.

**Mitigation options (refactor signal, not blocking):**
- Cheapest: scenario-conditional fragment appended to `moderator_synthesis.md` user prompt — e.g., for ironside add "Frame as a foreman's debrief"; for consumer add "Frame as a daily journal entry". Single file, ~10 lines.
- Medium: implement Stage 4 Opus polish with scenario-specific system prompt; cut at 8 PM Saturday if behind.
- High-value but largest: per-scenario moderator prompt (workplace_synthesis.md vs consumer_synthesis.md) per PRD §4.5's collapsed registry.

---

## 8. Demo-script readiness

`caltech/demo-script.md` (160 lines, dated 2026-04-25, "draft v1 — validation pending") is a beat-by-beat 90s plan. **It does not match the current backend.** Cross-check:

| Demo-script promises | Backend produces |
|---|---|
| BEAT-1 0:00–0:15: "Cold open: smartphone screen-recording of Gen-Z user scrolling Instagram Reels … 3D cortical mesh appears" + voiceover *"every day, TikTok tells me what to think"* | Backend ships `30s_ironsite.mp4` (workplace) AND `30s_twitter.mp4` (consumer feed). The demo-script picks consumer-only narrative. Both are supported by code, but BEAT-1 narration assumes consumer-only. |
| BEAT-2 0:15–0:45: hover-over-amygdala lights bridges; specialist labels: "Amygdala Specialist", "Memory Specialist", "Visual Specialist" | Backend specialists are the **7 Yeo7 networks** (visual, somatomotor, dorsal_attention, ventral_attention, limbic, frontoparietal, default_mode) — not "Amygdala / Memory / Threat-detection". The Yeo7 atlas doesn't have an "amygdala" network (limbic is the closest). **Demo-script's label set is from a pre-Yeo7 architecture.** |
| BEAT-3 0:45–1:15: "feed-shaped vs curated-shaped" within-subject toggle; insula glows 12% → 78% | Backend has no "within-subject toggle" UI. The closest match is `comparison.json` in `30s_ironsite/` (3.1KB, role unknown — possibly leftover from the v2-killed `/demo/comparison` endpoint per `technical-prd.md:45`). **Mismatch.** |
| BEAT-4 1:15–1:30: "Spotify-Wrapped of your brain" with 4 swipeable cards + "click on Broca's Area" inverted-brain-search | Backend has zero Wrapped-card endpoint; no inverted-brain-search; no Broca's Area. The frontend `EmpathyDocumentStage.vue` renders §A vision / §B paragraph / §C falsification — a magazine-style document, not Wrapped cards. **Mismatch.** |
| BEAT-5 (off-timer): 3 sponsor-close slide variants — Listen Labs / Ironside / **Sideshift** | Sideshift is mentioned in strategic PRD line 85 and demo-script BEAT-5 but is dropped from v2 (per CONSTRAINTS.md §6 "strategic PRD currently STALE"). |
| Renaissance differentiation: "100+ specialists per brain region" (line 104) | Backend runs 7 specialists (one per Yeo7 network), not 100+. **Inflated number — would not pass smoke test #3.** |

`caltech/demo-script.md` predates the v2 architecture lock (TRIBE-cut, K2-3-roles, Opus-polish-only). **It belongs in `archive/` or needs a v2 rewrite.** A separate `caltech/narration-script-3min.md` exists (per `technical-prd.md:1052` references); the Explore-agent's claim that *that* doc aligns is plausible but unverified in this audit (out of scope budget).

---

## 9. Cross-cutting concerns (things A1–A4 may miss)

- **Race between WS swarm events and HTTP empathy fetch.** `main.py:simulation_loop` (`:546`) drives `/ws` per-second pushes via `orchestrator.run_frame`, which fires K2 calls *unbounded* via `asyncio.create_task` (line 556-558). If the user simultaneously requests `/demo/empathy` (which also fires K2 calls in the iterative loop), both share the same `K2Client` instance and same upstream rate limit. No semaphore at the *cross-stage* level — only per-stage `asyncio.gather`. Result on slow K2 days: per-second WS ticks queue tasks faster than they complete. Consider gating both behind a single global K2 semaphore (Sem(6) per PRD §4.3 footnote — but enforced cross-stage, not just inside `warmup.py`).
- **Session-cache memory + disk disagreement on stub.** `vision_client.py:_save` writes the stub-flagged JSON to disk; on next request, `EmpathyDocumentStage` shows the stub paragraph. Per CONSTRAINTS rule 2, stubs are *acceptable* only if explicitly env-gated; this isn't. Convert: on `OPENROUTER_API_KEY` missing or vision fail, **don't write to disk**, return error payload, log structured event.
- **`activity_reader.py` (line 96) is the live-WS data source** — separate from `/demo/*`. Drives `simulation_loop.broadcast`. WS clients see stale data if `data/` is empty. Not in PRD scope but worth noting that the `/ws` and `/demo/*` paths use *different* underlying activity sources.
- **Strategic PRD is provably stale** (CONSTRAINTS.md §6 already calls this out — verified via `grep -n` at `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md:234, 309, 728, 750`: all carry "Stage 2 empathy-synthesis via Claude Opus" and "TRIBE forward" language). Documentation drift compounds across the demo-script, prd-final.md, narration-script. R-DOCS shard (per `NEW-ARCHITECTURE.md:240`) needs to fix at minimum: strategic PRD §3, demo-script BEAT-2/3/4, prfaq.md (unread but referenced).
- **`backend/prerendered/30s_ironsite/comparison.json`** (3.1 KB, present) is unaccounted for in v2 — `/demo/comparison` was explicitly killed (`technical-prd.md:45`). Either delete or document.
- **`session_cache.KNOWN_KEYS`** includes `"scenario"` (line 11) but `_load_scenario` in `main.py` does NOT use the session_cache — it reads `scenario.json` directly each time. Minor inconsistency.
- **Bool-of-tuple bug at `empathy_synthesis.py:192`** (covered in §3) is a single-line fix but would silently let through any guardrail-violating output forever. High priority.
- **`example_clip/` directory in `prerendered/`** — not on the demo plan. Either it's a test fixture (annotate so) or remove.

---

## 10. Top-5 priority adjustments

Ranked by demo-day payoff, with PRD citations.

### #1 — Bake the two control activity baselines AND commit the empathy/swarm/region/falsification cache for both demo clips.
- **PRD ref:** §3 pre-warmup contract; §13 FR-J6, FR-J7; §14 NFR1, NFR23; §10 smoke #7.
- **Why this is #1:** without controls, the §C falsification headline is `delta=0.00 verdict=generic_plausible`. That is the *opposite* of the demo's payload. Without the cache bake, the first demo request runs cold (likely >90s).
- **What:** (a) On a Vultr GPU box (or any TRIBE V2 access), produce `backend/prerendered/workplace_routine_baseline/activity.json` and `backend/prerendered/curated_short_film_baseline/activity.json`. They should encode genuinely different cognitive profiles (low-salience desk shot for workplace; structured short film for consumer). (b) Run `warmup_clip` once for each demo clip, commit `vision_report.json`, `swarm_readings.json`, `k2_region_cache.json`, `empathy.json`, `iterative_trajectory.json`, `falsification.json` to the repo. (c) After (a)+(b), re-verify `delta > 0.40` on at least one demo clip; if not, recalibrate `_anchored_threshold` per PRD §4.4b note: "recalibrate Saturday 4 AM after smoke #7 if proxy's score distribution differs materially from TRIBE's".

### #2 — Replace `ComparisonStage.vue:61-72` inline mock trajectory with a real `fetchIterativeTrajectory(clipId)` call.
- **PRD ref:** §4 API surface; CONSTRAINTS §4 "Frontend never has inline mock data in shipping code"; A4 shard's primary task.
- **Why:** the *only* shipping inline-mock left in the frontend. Other stages (`IterativeRevealStage.vue:34,52` and `EmpathyDocumentStage.vue:76,116`) are correctly wired. Single component fix.
- **What:** mirror the pattern from `IterativeRevealStage.vue` — add `fetchIterativeTrajectory` import, set `trajectory.value = data?.round_trajectory || []` in an `onMounted` hook, gate empty-array render. ~30 LOC change.

### #3 — Fix the guardrail-retry bool-of-tuple bug at `empathy_synthesis.py:192`.
- **PRD ref:** §5 forbidden-claim guardrails; §13 FR-O17; CONSTRAINTS rule 2 (failures must be visible).
- **Why:** today's regex post-check is decorative — STRICT MODE retry never fires. If the K2 moderator slips a "she felt" past the in-prompt block, the system ships the violation as the hero §B paragraph. Compounds Listen Labs/Ironsight legal risk.
- **What:** `ok, violations = pass_guardrail_pre_flight(candidate)`; on `not ok`, log `"guardrail_violation_pre_retry"` with violations list, retry once; if still fails, log `"guardrail_violation_final"` and return error payload (per CONSTRAINTS rule 2 canonical shape) rather than the violating paragraph. Add sub-second-prediction patterns: `\b\d+\s?ms\b`, `\bmillisecond`, `\bsub-second\b`, `\b0\.\d+\s?s\b`. Add `\bsymptom\b`, `\bdisorder\b`, `\bpathology\b` to clinical category.

### #4 — Convert `vision_client.py` stub-fallback writes into log + error-tagged response.
- **PRD ref:** CONSTRAINTS rule 2 ("a failure must be visible"); refactor signal explicit in CONSTRAINTS ("the autonomous refactor flow should NOT block on rule 2 — instead it should *convert* existing silent stubs").
- **Why:** today, when `OPENROUTER_API_KEY` is missing or vision call fails, `vision_client._stub_report` writes `{"stub": True, "scene_summary": "[stub vision report — ...]"}` to disk. The downstream moderator then *consumes* this stub as if it were a real vision report and writes a real-looking paragraph based on it. Judges cannot tell. Same pattern in `warmup.py:280` for vision failures.
- **What:** on failure, do NOT cache; log `"vision_call_failed"` structured event; return `{"error": "vision_unavailable", "clip_id": clip_id, "reason": str(e)}`. Frontend renders "REAL DATA MISSING · vision unavailable" red badge per CONSTRAINTS §7. The empathy fetch should bubble: `_ensure_empathy` returns 503 if vision_report carries `error`.

### #5 — Refresh `caltech/demo-script.md` to v2 architecture (or re-archive).
- **PRD ref:** CONSTRAINTS §6 (PRD + architecture-overview are alignment targets); v2 lock at `technical-prd.md:9`.
- **Why:** the demo-script as written would lead a human presenter to narrate Sideshift / Wrapped-cards / Broca's-Area / 100+ specialists per region — none of which the backend produces. Misalignment between demo flow and demo doc would surface in any orchestrator-led rehearsal. PRFAQ + strategic PRD have the same drift.
- **What:** rewrite BEAT-1..5 to: BEAT-1 video plays → vision report renders; BEAT-2 brain-3D loads with hover anchors firing K2-region specialist popups (Yeo7 names, not Amygdala); BEAT-3 iterative-loop trajectory animates from round 1 to round-final; BEAT-4 hero empathy paragraph fades in with falsification §C bottom strip; BEAT-5 sponsor swap. Drop Sideshift/Wrapped/Broca's framing. Aligns with `caltech/architecture-overview.md` v2 + `frontend/src/stages/EmpathyDocumentStage.vue` + `IterativeRevealStage.vue`. Sibling task: confirm `caltech/narration-script-3min.md` is already on v2 (per Explore-agent claim, unverified here); if so, demote `demo-script.md` and elevate that one.

---

## Appendix — file inventory referenced

```
backend/main.py                                       (579 lines)
backend/services/empathy_synthesis.py                 (202)
backend/services/iterative_loop.py                    (209)
backend/services/swarm_runner.py                      (135)
backend/services/orchestrator.py                      (215)
backend/services/falsification.py                     (24)
backend/services/guardrails.py                        (34)
backend/services/k2_client.py                         (90)
backend/services/vision_client.py                     (449)
backend/services/warmup.py                            (354)
backend/services/session_cache.py                     (66)
backend/services/embedding_proxy/{__init__.py, projection_map.npy, training_pairs.yaml}
backend/prompts/{visual,somatomotor,dorsal_attention,ventral_attention,limbic,frontoparietal,default_mode}.md
backend/prompts/{moderator_synthesis.md, evaluator_score.md, moderator.md}
backend/prerendered/30s_ironsite/{30s_ironsite.mp4, activity.json, vision_report.json, scenario.json, comparison.json}
backend/prerendered/30s_twitter/{30s_twitter.mp4, activity.json, vision_report.json, scenario.json}
frontend/src/api/index.js
frontend/src/stages/{ComparisonStage.vue, EmpathyDocumentStage.vue, IterativeRevealStage.vue, LandingStage.vue, LoadingStage.vue, MainStage.vue}
frontend/src/components/{AnalysisPanel, BrainScene, IterativeLoop, PersonaShell, RegionPopup, RoundScoreBar}.vue
_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md (1081 lines, v2)
_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md           (1106 lines, STALE per CONSTRAINTS §6)
caltech/architecture-overview.md                                       (527 lines, v2)
caltech/NEW-ARCHITECTURE.md                                            (canonical pipeline summary)
caltech/demo-script.md                                                 (160 lines, STALE per §8 above)
caltech/use-cases/{ironside, listenlabs-sideshift, two-demo-scenarios, empathy-layer-hero-output, empathy-layer-prd-simplified}.md
SHARD.md, CONSTRAINTS.md, CONTRACTS.md (this worktree)
```

**Audit complete.** No source code modified. Refactor signals routed via §10 priority list — not blockers.
