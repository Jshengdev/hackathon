# A1 — Pre-render Cache & TRIBE-Not-Live Audit

**Shard:** A1-prerender-cache
**Auditor:** audit-only Claude (Opus 4.7, 1M context)
**Date:** 2026-04-25
**Verdict:** `DONE_WITH_CONCERNS` — pipeline is wired and TRIBE never runs live, but the per-clip cache is incomplete vs PRD §3, the falsification baseline silently degrades into self-comparison, the empathy guardrail call is short-circuited by a Python truthiness bug, and one stale cache file (`comparison.json`) outlives its now-deleted endpoint. Refactor pass should land before Saturday-8AM freeze.

All findings cited file:line or PRD §§. No source files under `backend/` were modified.

---

## §1 — Inventory: per-clip prerendered/ files

Walked `backend/prerendered/<clip>/` directly (`os.listdir` + JSON top-level keys).

### `30s_ironsite/` (workplace · construction)

| File | Bytes | Top-level shape |
|---|---|---|
| `30s_ironsite.mp4` | 27,371,532 | (binary; 30s H.264) |
| `activity.json` | 12,709 | `{stimulus, atlas, fps, n_timesteps, n_vertices, frames[]}` (31 frames) |
| `comparison.json` | 3,152 | `{without_tribe, with_tribe}` ← **STALE** (legacy v1 endpoint, now removed) |
| `scenario.json` | 92 | `{scenario: "ironside", label: "ironsight · construction site · scaffolding sequence"}` |
| `vision_report.json` | 2,425 | `{clip_id, task_type, scene_summary, actions, objects, people, environment, emotional_tone, raw_analysis, stub:false}` ← **schema drift** (see §2) |
| `.DS_Store` | 6,148 | macOS clutter — gitignore should sweep |

### `30s_twitter/` (consumer · feed scroll)

| File | Bytes | Top-level shape |
|---|---|---|
| `30s_twitter.mp4` | 43,746,136 | (binary; 30s) |
| `activity.json` | 12,700 | same shape as above (31 frames) |
| `scenario.json` | 74 | `{scenario: "consumer", label: "consumer · reels feed · 30s scroll"}` |
| `vision_report.json` | 2,747 | same drifted shape as 30s_ironsite |

### `example_clip/` (synthetic illustrative fixture)

| File | Bytes | Top-level shape |
|---|---|---|
| `activity.json` | 9,285 | `{stimulus:"example_clip.mp4 (synthetic — illustrative only)", atlas, fps, n_timesteps:42, n_vertices:20484, frames[]}` |
| `action_segments.json` | 231 | `[{start_t, end_t, action}]` ← **legacy** (junsoo report-card pipeline) |
| `per_action_activations.json` | 1,130 | `[{action, t_start, t_end, regions, stimulus}]` ← **legacy** |
| `ironside_report.json` | 4,799 | `{video_stem, n_actions, model:"example:hand-authored", actions[]}` ← **legacy** |
| `scenario.json` | 62 | `{scenario: "consumer", label: "example · consumer feed"}` ← **content/scenario mismatch** (frames describe construction drilling, scenario tag says consumer) |
| (no MP4) | — | falls through `_resolve_video_path` → `None` → `vision_client._stub_report("video not found")` |

**Summary:** 3 clip dirs, only 2 are demo-ready (`30s_ironsite`, `30s_twitter`). `example_clip` is documentation-grade fixture from the v1 report-card path, still present.

---

## §2 — PRD §6 + CONTRACTS C1 gap matrix

Per **PRD §3 pre-warmup contract** + **CONTRACTS C1** the `prerendered/<clip>/` dir must contain seven artifact families. Of those, four are absent from every clip; two are stale-shape; one is legacy and should be deleted.

| Artifact (PRD §3 / C1) | 30s_ironsite | 30s_twitter | example_clip | Verdict |
|---|---|---|---|---|
| `<clip_id>.mp4` | ✓ | ✓ | ✗ | example_clip cannot serve frame extraction; `vision_client.py:401` writes a stub-cached vision_report instead. |
| `activity.json` (C1 schema) | ✓ shape-drift | ✓ shape-drift | ✓ synthetic | All three exist. **Schema drift: see below.** |
| `scenario.json` | ✓ | ✓ | ✓ misclass | Present everywhere. example_clip carries a wrong tag. |
| `vision_report.json` | ✓ stale shape | ✓ stale shape | ✗ | Cached vision reports use the v1 keys (`task_type, objects, people, environment, raw_analysis`) instead of the current `vision_client._normalize_report` keys (`temporal_sequence, spatial_relationships`). Warmup will see an existing file and skip regeneration → moderator gets data in two different shapes depending on cache age. (**PRD §4.1 / build-plan-locked §4.1** mandate the new shape.) |
| `swarm_readings.json` (C1, PRD §3) | ✗ | ✗ | ✗ | **MISSING ON ALL CLIPS.** Built lazily by `main.py:_ensure_swarm_readings` → `services/swarm_runner.run_swarm` only on first `/demo/empathy` hit, OR by background `warmup_clip` after a `/demo/match`. |
| `k2_region_cache.json` (C1, PRD §3) | ✗ | ✗ | ✗ | **MISSING.** Pre-bake target is "7 networks × N seconds" so brain-3D clicks resolve in O(1). Without it, every region-click triggers a fresh K2 call (8–17 s latency per the QA report). |
| `empathy.json` (C1, PRD §3 — includes round_trajectory + falsification + per_region_attribution) | ✗ | ✗ | ✗ | **MISSING.** Lazy-built by `main.py:_ensure_empathy`. First /demo/empathy/ hit cold-runs the 8-round iterative loop (≤60 s) + falsification (≤200 ms). |
| `iterative_trajectory.json` (PRD §3 — derivative of empathy) | ✗ | ✗ | ✗ | Derived from `empathy.json` at first GET. |
| `falsification.json` (PRD §3 — derivative of empathy) | ✗ | ✗ | ✗ | Derived from `empathy.json` at first GET. |
| `control_activity.json` (CONTRACTS C1, PRD §6.6) — i.e. `prerendered/workplace_routine_baseline/` and `prerendered/curated_short_film_baseline/` | ✗ folder absent | ✗ folder absent | ✗ | **MISSING — root cause of the silent falsification degradation in §6.** |

### Schema drift on `activity.json`

The on-disk shape is **CONTRACTS C1** (the simplified v2 form), not the verbose **PRD §6.2** form:

```json
ON DISK:  {"stimulus": null, "atlas": "yeo7", "fps": 1, "n_timesteps": 31,
           "n_vertices": 20484,
           "frames": [{"t_s": 0, "regions": {"visual": 0.16, ..., "default_mode": -0.06},
                       "top_region": "visual"}, ...]}

PRD §6.2: {"video_id": ..., "scenario": ..., "tribe_version": "v2", "mesh": "fsaverage5",
           "n_vertices": 20484, "temporal_resolution_hz": 1, "hrf_lag_s": 5,
           "frames": [{"time_s": 0, "regions": {"visual_attention":
                       {"activation": 0.78, "vertex_ids": [12,47,...]}}}]}
```

CONTRACTS C1 (lines 7–24 of `worktrees/A1-prerender-cache/CONTRACTS.md`) was pragmatically reduced to match what the offline TRIBE prerender actually emits: scalar regions instead of `{activation, vertex_ids}`, `t_s` instead of `time_s`, `fps` instead of `temporal_resolution_hz`, no `tribe_version` / `hrf_lag_s` / `video_id`. Every consumer in `backend/services/` already uses the C1 shape (`embedding_proxy/__init__.py:124`, `swarm_runner.py:60`, `iterative_loop.py` indirectly via swarm_readings, `main.py:462`). **CONTRACTS C1 reflects reality; PRD §6.2 is stale and will need an R-DOCS sweep.** Reported as a finding, not a fix-here.

### Schema drift on `vision_report.json`

The cached files at `30s_ironsite/vision_report.json` + `30s_twitter/vision_report.json` were written by the v1 vision pipeline (per `qa_logs/QA_REPORT.md` BUG-2 history — pre-Qwen3-VL switch) and have these top-level keys:

```
clip_id, task_type, scene_summary, actions, objects, people, environment,
emotional_tone, raw_analysis, stub
```

The **shipped** `services/vision_client.py:_normalize_report` (line 286–353) emits this shape:

```
scene_summary, actions, temporal_sequence, spatial_relationships,
emotional_tone, stub, error, clip_id, n_frames_sampled
```

`empathy_synthesis.py:_build_user_message` (line 127) reads `vr.get("temporal_sequence")` and `vr.get("spatial_relationships")` — both **absent** from the cached files → moderator prompt is fed `"(none provided)"` for those fields whenever the cache is the v1 file. `_ensure_vision_report` (`main.py:346`) returns the cache as-is — no re-shape, no schema check. Stale cache silently degrades the moderator's input.

### `30s_ironsite/comparison.json` — orphan

The endpoint that produced and read this file (`GET /demo/comparison/{clip_id}`) was killed in v2 (PRD changelog line 26: *"Without-TRIBE comparison pass killed. /demo/comparison endpoint removed."*). Verified: `grep -n comparison backend/main.py` returns nothing; `services/*comparison*.py` does not exist. The 3,152-byte JSON is dead weight that will confuse anyone grepping for "without_tribe" / "with_tribe".

### Stale legacy in `example_clip/`

`action_segments.json`, `per_action_activations.json`, `ironside_report.json` are outputs of the v1 junsoo report-card pipeline (`prerendered/README.md` lines 27–37). v2 does not consume them. They survive only as the "illustrative fixture" referenced in the README. Recommend either deleting or moving to `archive/example_clip/` so the v2 cache layout is unambiguous.

---

## §3 — TRIBE touchpoints in `backend/`

Searched `backend/` for `tribev2`, `TribeModel`, `predict_brain_from_text`, `encode_video`, `tribe_v2_score`, `TRIBE_LIVE`, and case-insensitive `tribe`. Results (`grep -rn` cmd run):

| Site | Type | Live or offline | Env-gated? |
|---|---|---|---|
| `backend/atlas.py:3` | Comment / module docstring describing TRIBE V2's vertex count | none — comment only | n/a |
| `backend/atlas.py:73-74` | Comment in `build_yeo_labels` saying hemis are concatenated to "match TRIBE's vstack order (see tribev2.utils_fmri.TribeSurfaceProjector.apply line 226)" | none — historical attribution; this function uses **nilearn** to project Yeo, not TRIBE | n/a |
| `backend/main.py:160-169` `run_inference()` | Endpoint (POST `/brain/run-inference`) | **Disabled.** Returns `{"ok": false, "error": "live inference disabled — use /demo/match with a prerendered clip"}` | hard-coded off (no flag) |
| `backend/prerendered/README.md` | Documentation of the offline Colab pipeline (`colab_prerender.ipynb`) | offline — never invoked from runtime | n/a |
| `backend/services/embedding_proxy/__init__.py:1` | Module docstring "Stage 5 — sentence-transformer embedding proxy for TRIBE forward" | the proxy is the substitute; no TRIBE call | n/a |
| `backend/services/guardrails.py:22-23` | Regex against the words "70k voxels" / "700 subjects" (forbidden-claim check) | none — text filter | n/a |
| `backend/services/vision_client.py` (.env reference at top of file) | Env config docs | none | n/a |
| `backend/prompts/moderator_synthesis.md:37` | Instruction to the moderator LLM forbidding inflated TRIBE numbers | none — prompt content | n/a |

**Conclusions:**
- **Zero live TRIBE imports.** No `from tribev2 import …` anywhere. No HuggingFace `TribeV2`/`AutoModel` weight load. No GPU forward call.
- **No `TRIBE_LIVE` env flag** — but it is moot because there is no code that would react to it. PRD §1 / CONSTRAINT 1 require gating "any code path that imports `tribev2.demo_utils` or otherwise touches TRIBE weights"; that bar is met because no such code exists.
- **`atlas.py` reads only nilearn's Yeo atlas** (`datasets.fetch_atlas_yeo_2011`) and projects onto fsaverage5 with `surface.vol_to_surf`. The TRIBE reference is a comment about hemi ordering. Not a runtime touchpoint.
- **`/brain/run-inference` is fail-closed by content** (returns error JSON); a future maintainer might be tempted to "re-enable" it. Recommend converting the body into `raise HTTPException(status_code=410, detail="…")` so the endpoint returns Gone, not 200-with-error-payload.
- **Risk surface:** the only way to accidentally invoke TRIBE is if someone runs `colab_prerender.ipynb` against the wrong dir or follows `prerendered/README.md` outside Colab — neither is a runtime path. Demo-day is safe.

---

## §4 — Cache-resolve walkthrough (filename → cache hit)

Annotated trace of a cold `POST /demo/match {"filename": "30s_ironsite.mp4"}`:

```
HTTP POST /demo/match  body={"filename": "30s_ironsite.mp4"}
└─ main.py:299 match_clip_with_warmup(payload, background_tasks)
   │
   ├─ filename = payload["filename"]          # "30s_ironsite.mp4"
   ├─ clip_id  = Path(filename).stem          # "30s_ironsite"   ← CONTRACTS C5 hard-code match ✓
   ├─ clip_dir = _clip_dir(clip_id)           # main.py:176
   │  └─ rejects clip_id with "/", "\\", or leading "."
   │  └─ resolves to PRERENDERED_DIR/clip_id, asserts subpath of PRERENDERED_DIR (defense-in-depth)
   ├─ activity_path = clip_dir / "activity.json"
   │  └─ exists? → continue.  missing? → HTTP 404 "no prerendered clip for '<clip_id>'"  ✓ CONSTRAINT 1
   ├─ n_frames = len(json.load(activity_path)["frames"])
   ├─ video    = _resolve_video_path(clip_dir, clip_id)   # main.py:206
   │  └─ tries clip_dir/{clip_id}.mp4, clip.mp4, video.mp4 — first hit returned
   │  └─ last-resort: any *.mp4 in dir (mild fuzzy fallback for the MP4 only — clip_id itself is exact)
   ├─ scenario = _load_scenario(clip_dir)     # main.py:190
   │  └─ silently defaults to {"scenario": "consumer", "label": clip_dir.name} on missing/parse-fail.
   │     Per CONSTRAINT 2 this is a soft violation: caller learns nothing about the parse failure.
   ├─ background_tasks.add_task(warmup_clip, PRERENDERED_DIR, clip_id)
   │   └─ services/warmup.py:243 warmup_clip
   │      ├─ _load_activity(prerendered_dir, clip_id)        # missing → returns {} + warns
   │      ├─ _load_scenario(...)                              # uses session_cache.read_cached("scenario")
   │      │     ── inconsistent with main.py:_load_scenario which reads disk directly
   │      ├─ K2Client()
   │      ├─ vision_report = read_cached(...) or VisionClient().analyze_video(...)
   │      │     ── on cache hit: returns whatever shape is on disk (no schema check)
   │      │     ── on exception: vision_report = {"scene_summary":"", "stub":True, "error":...}
   │      │                       and is NOT cached → next request retries
   │      ├─ swarm_readings = read_cached(...) or run_swarm(activity, clip_id)
   │      │     ── on exception: silently swapped with {"clip_id":..., "regions":{}}  ⚠ §6
   │      ├─ k2_region_cache  = read_cached(...) or _bake_k2_region_cache(...)   # 7 × N K2 calls, sem(6)
   │      ├─ empathy          = read_cached(...) or _build_empathy(...)
   │      │     └─ run_iterative_loop(vision, swarm, scenario)   # services/iterative_loop.py
   │      │     └─ compute_falsification(best_paragraph, main_act, control_act)
   │      │           └─ control_act = _load_control_activity(...)   # ⚠ silent self-substitute, §6
   │      └─ derives + writes iterative_trajectory.json + falsification.json
   └─ returns {clip_id, video_url, activity_url, n_frames, has_video, scenario, scenarioLabel}

GET /demo/warmup-status/{clip_id}  →  warmup.get_warmup_status
   └─ checks the four _REQUIRED_KEYS (vision_report, swarm_readings, k2_region_cache, empathy) on disk
      ready: bool == all four cache files exist
```

**Findings on the resolver:**

1. ✓ `Path(filename).stem` is the C5-spec hard-code match. No fuzzy matching on `clip_id`.
2. ✓ Path traversal is rejected by `_clip_dir`.
3. ✓ Missing `activity.json` → 404 (matches CONSTRAINT 1).
4. ⚠ `_resolve_video_path` last-resort `glob("*.mp4")` is a soft fuzz on the *video* (not clip_id). Low-risk because each clip dir contains at most one mp4, but worth noting.
5. ⚠ `_load_scenario` silently downgrades to `consumer` on missing/parse-fail with no log entry. Per CONSTRAINT 2 should `logger.warning(...)` so a misnamed scenario file isn't quietly swallowed.
6. ⚠ Two scenario-loading code paths (`main.py:_load_scenario` reads disk directly; `warmup.py:_load_scenario` reads through `session_cache.read_cached`). Same JSON, two readers. Low-risk because both default to "consumer" but is a code-smell duplicate.
7. ⚠ `_REQUIRED_KEYS` in warmup checks four files (`vision_report, swarm_readings, k2_region_cache, empathy`); the warmup task also writes `iterative_trajectory.json` and `falsification.json` but those are **not** part of the readiness gate. Consistent because they're derivatives, not loaded eagerly.

---

## §5 — Embedding-proxy assessment (TRIBE-forward substitute)

`backend/services/embedding_proxy/__init__.py` + `services/falsification.py` are the v2 stand-in for TRIBE forward.

### Public API (lines 31–167 of `embedding_proxy/__init__.py`)

```
embed_text(str) → (384,) float32       # all-MiniLM-L6-v2 sentence embedding
project_to_yeo7((384,)) → (7,) float32  # via W: 384×7 from projection_map.npy
activity_target_vector(activity_json) → (7,) float32  # mean over frames[*].regions
proxy_score(text, target_activity) → (similarity, per_region_attribution_dict)
```

### Verified empirically

```
$ ls -la backend/services/embedding_proxy/projection_map.npy
-rw-r--r--  1 johnnysheng  staff  10880 ... projection_map.npy
$ python3 -c "import numpy as np; W=np.load('.../projection_map.npy'); \
  print(W.shape, W.dtype, W.mean(), W.std())"
(384, 7) float32 -0.0000 0.0074
$ ls -la backend/services/embedding_proxy/training_pairs.yaml
-rw-r--r--  1 johnnysheng  staff  5417 ... training_pairs.yaml
```

Projection map exists, has the right shape, was fit reproducibly via `backend/scripts/fit_projection_map.py`, and is centered (mean ≈ 0). ✓

### Substitution paths

The PRD assigned TRIBE-forward two jobs (PRD §17 Q8 v2 resolution):

1. **Per-round iterative-loop scoring** → moved to **K2-swarm-as-evaluator** in `services/iterative_loop.py:101 evaluate_paragraph`. **Not the embedding proxy.** Each round fires 7 parallel K2 calls (one per Yeo7 net), each returns `Score: 0.XX + Justification: ...`, mean is round_score. The proxy is *not* called per round — confirmed by `grep -n proxy_score services/iterative_loop.py` returns nothing.
2. **Falsification cosine vs activity** → handled by `services/falsification.py:compute_falsification`, which calls `proxy_score` twice (main, control), reports delta + verdict. ✓

### Bypass risk

Searched all of `backend/services/` for any direct cosine-vs-activity computation outside `embedding_proxy`. None found. The only similarity computations are inside `_cosine` of `embedding_proxy/__init__.py:134` and the K2 evaluator (which produces a SEMANTIC score, not a cosine, so they don't compete).

### Bug-shaped concerns inside this subsystem

1. `iterative_loop.py:121` hard-codes per-region `target = 1.0`. Per PRD §6.5 schema the field is *the target activation produced by TRIBE*, not a literal "perfect score". Today this is harmless because `evaluate_paragraph` returns SEMANTIC scores (a 0..1 score from K2 = how-well-paragraph-captured-region-reading), so `target=1.0` reads as "ideal". But the field name `target` colliding with the §6.5 contract field that used to mean "TRIBE forward target activation" is a documentation hazard — if a downstream reader assumes `target` is brain-target it will misinterpret.
2. `iterative_loop.py:170-174` has a `try/except TypeError → fallback` around `synthesize(**kwargs)`. The fallback exists because the loop tries to pass `prior_paragraph=...` and `synthesize` doesn't accept that kwarg (verified: `services/empathy_synthesis.py:174` signature has only `vision_report, swarm_readings, scenario, prior_score, per_region_miss`). The `try/except TypeError` masks an actual contract drift between the two services. Not a TRIBE concern, but a stub-fallback rule-2 concern.

### Verified silent-self-comparison degradation

The math is trivial but the consequence isn't:

```python
# math: cos(emb @ W, target) - cos(emb @ W, target) == 0 for any text/W/activity
# so when control_activity ≡ main_activity, delta = 0 always → "generic_plausible"
```

Combined with the missing control clip dirs (§2), every demo run emits `falsification.delta = 0.0` and `verdict = "generic_plausible"`. The screen will display "0.27 vs 0.27 → ANCHORED" no — it will display **"0.84 vs 0.84 · delta=0.00 · generic_plausible"** which contradicts BEAT-4 of the demo (PRD §12 says "delta=0.27" headline). **This is the most demo-visible silent-degradation bug.** See §6.

---

## §6 — Concrete adjustments (refactor input)

Each bullet cites the PRD/contract section that motivates the change. Audit-only; do not apply here.

### A. Bake the missing cache (highest priority — PRD §3 pre-warmup, NFR18, NFR20, FR-J6)

1. **Bake `swarm_readings.json`, `k2_region_cache.json`, `empathy.json`, `iterative_trajectory.json`, `falsification.json` for both demo clips** before Saturday-8AM freeze. Today these are built lazily by `warmup_clip` + `_ensure_*`, so the *first* live demo run pays the warmup latency. Warmup must succeed on a dev box with live keys, then commit the cache JSON to repo. Cite: PRD §3 ("Saturday 8 AM pre-cache freeze runs warmup once and commits the JSON files to repo, so demo-day warmup is just disk reads"); CONTRACTS C1.
2. **Create the two control clip dirs** `backend/prerendered/workplace_routine_baseline/` and `backend/prerendered/curated_short_film_baseline/`, each containing a real `activity.json` (offline TRIBE-baked) and `scenario.json`. Without these, falsification silently self-compares (§5). Cite: PRD §6.6 + §3 + warmup.py:39 `_CONTROL_FOR`.
3. **Bake a vision_report.json regen for both demo clips** with the v2 `_normalize_report` shape (`temporal_sequence`, `spatial_relationships`). Today's caches are pre-Qwen-switch v1 shape (per §2 + qa_logs/QA_REPORT.md BUG-2 history) and the moderator silently gets `"(none provided)"` for the spatial/temporal blocks. Easiest: delete the two stale caches and re-run warmup. Cite: PRD §4.1 + build-plan-locked §4.1 schema.

### B. Convert silent stubs to log-and-surface (CONSTRAINT 2)

4. **`warmup.py:280` vision-stub-on-exception** — `vision_report = {"scene_summary":"", "stub":True, "error":str(e)}` is *not cached* but is fed to the moderator on the very next step. Either (a) abort warmup with a structured `errors["vision_report"]` and skip empathy, or (b) cache the stub and let the empathy step refuse to fire on a stub vision_report. Today the moderator silently gets `scene_summary=""` and produces a paragraph from the brain readings alone. Cite: CONSTRAINT 2.
5. **`warmup.py:293` swarm fallback** — `swarm_readings = {"clip_id":..., "regions":{}}` has no `stub` flag and no `error` field. The moderator's `_format_swarm` (`empathy_synthesis.py:82`) renders this as `"- visual: (no reading)"` × 7 — completely silent. Replace with `{"error":"swarm_unavailable", "clip_id":..., "stub":True}` and have empathy refuse to build. Cite: CONSTRAINT 2 + PRD §4.3 role 1.
6. **`main.py:_load_control_activity` + `warmup.py:_load_control_activity` self-substitute** — when the control clip dir is missing, both currently `return main_activity`. This is the falsification-killer (§5). Replace with `raise FileNotFoundError(f"control activity missing for scenario={scenario}; expected at {ctrl_path}")` propagated to the falsification result as `{"verdict":"unknown", "error":"control_missing", "expected_path":...}`. The frontend already has `verdict:"unknown"` rendering (per `warmup.py:198`). Cite: PRD §6.6 + CONSTRAINT 1.
7. **`main.py:498` `/demo/k2-region` failure surface** — returns `{"text": f"[K2 call failed: {e}]", "stub":True, "error":str(e)}`. The `text` field will look like a real reading to a frontend that doesn't check `stub`. Inverting the keys (`text:""`, `error:str(e)`, `stub:True`) is more aligned with CONSTRAINT 2 examples. Cite: CONSTRAINT 2.
8. **`vision_client.py:380-440` always-cache-stub** — line 384 says *"Always writes the result to the cache, including stubs, so subsequent calls are instant and don't re-attempt failed providers."* This poisons disk: a transient OpenRouter blip permanently wedges that clip into stub mode until someone manually deletes the JSON. Either (a) skip caching when `stub:True`, or (b) add a TTL / `regenerate_if_stub:bool=True` parameter. Cite: CONSTRAINT 2 ("documented dev-mode fallbacks gated behind `…/MOCK_*=1`") + CONSTRAINT 7 ("Backend caches MUST contain real data (no `\"stub\": true` flags)").
9. **`empathy_synthesis.py:21-23` guardrails fail-soft import** — `try: from services.guardrails import pass_guardrail_pre_flight` falls back to a no-op `def …: return True`. If the module disappears (or has an import error), the *real* guardrail check is silently bypassed for every run. Drop the try/except; let the import fail loudly. Cite: PRD §5 ("forbidden-claim guardrails — apply to ALL outputs", "NON-NEGOTIABLE").

### C. Real bug — empathy guardrail short-circuit (PRD §5)

10. **`empathy_synthesis.py:192` `bool(pass_guardrail_pre_flight(candidate))` is always `True`.**
    - `guardrails.pass_guardrail_pre_flight` returns `tuple[bool, list[str]]` (verified `services/guardrails.py:27-34`).
    - Python: `bool((False, ["reverse-inference"]))` is `True` (any non-empty tuple is truthy). Verified empirically (`python3 -c …` run during this audit).
    - Consequence: STRICT-mode retry never triggers; forbidden phrases like "she felt", "clinical", "diagnosis" pass straight to the empathy output. Real impact under PRD §5 / NFR12 / NFR13.
    - Fix: unpack the tuple — `ok, _violations = pass_guardrail_pre_flight(candidate); if not ok: …`.
    - Cite: PRD §5 + NFR12 + NFR13 + FR-O17.

### D. Cache hygiene (PRD §3 + CONSTRAINT 7)

11. **Delete `backend/prerendered/30s_ironsite/comparison.json`** — endpoint removed in v2 (PRD changelog), file is dead weight (3,152 bytes) and confuses anyone grepping for `with_tribe`/`without_tribe`. Cite: PRD v2_endpoints_killed.
12. **Move or archive `backend/prerendered/example_clip/{action_segments.json, per_action_activations.json, ironside_report.json}`** — outputs of the v1 junsoo report-card pipeline; v2 doesn't consume them. The `prerendered/README.md` should be rewritten to describe the v2 cache layout (it currently still describes the report-card pipeline). Cite: prerendered/README.md vs PRD §3.
13. **Fix `example_clip/scenario.json` content/scenario mismatch** — frames describe construction drilling; tag says `"consumer"`. Either delete the fixture or correct the tag to `"ironside"`. Cite: PRD §4.5 SCENARIO_CONFIG.
14. **Convert `/brain/run-inference` (`main.py:160`) from 200-with-error-payload to 410 Gone.** Today it returns `{"ok":false, "error":"live inference disabled"}` with HTTP 200. A future maintainer might re-enable it to "make it work". A 410 + body explaining "use /demo/match" is harder to accidentally undo. Cite: CONSTRAINT 1 + the docstring already calls it DEPRECATED.

### E. Schema-level realignment (R-DOCS pass)

15. **Update PRD §6.2 to match CONTRACTS C1's actual schema** (`stimulus|null, atlas, fps, n_timesteps, n_vertices, frames[{t_s, regions:{<network>:float}, top_region}]`). Today PRD §6.2 still lists the verbose `{activation, vertex_ids}` per-region shape that no producer or consumer actually uses. Cite: PRD §6.2 vs CONTRACTS C1 vs `embedding_proxy/__init__.py:124`, `swarm_runner.py:60`. (R-DOCS shard, not R1.)
16. **Update `prerendered/README.md`** to describe the v2 layout (`activity.json, scenario.json, vision_report.json, swarm_readings.json, k2_region_cache.json, empathy.json, falsification.json, iterative_trajectory.json` + per-control-scenario baselines). Today it still describes the v1 junsoo report-card pipeline. Cite: PRD §3 + CONTRACTS C1.
17. **Reconcile `iterative_loop.py:121 target = 1.0`** vs PRD §6.5 schema field `target` (which means "target brain activation" in the v1 spec, but means "ideal score = 1.0" in v2 since K2 evaluators are semantic). Add a comment or rename to `score_ceiling` to remove ambiguity. Cite: PRD §6.5.

### F. Code drift (low priority)

18. **`iterative_loop.py:170-174` `try/except TypeError`** — masks a real signature mismatch with `empathy_synthesis.synthesize`. Either add `prior_paragraph: str | None = None` to `synthesize`'s kwargs and use it, or stop passing it. Cite: CONSTRAINT 2 spirit ("# TODO(no-fallback): convert").
19. **Consolidate the two `_load_scenario` implementations** (main.py:190 reads disk; warmup.py:45 reads through session_cache). Pick one. Cite: code drift.

---

## §7 — Risk callouts (what would silently break if TRIBE forward got called by accident)

There is no live-TRIBE code path in `backend/`, so the *direct* risk surface is empty. The *indirect* risks are about regressing into TRIBE-live or introducing the silent-stub class of bug:

1. **`/brain/run-inference` 200-with-error-payload (`main.py:160-169`).** A future maintainer who reads "DEPRECATED. Live TRIBE inference is no longer supported in this build" might delete the early-return and try to re-enable. Hard-coded HTTP 410 + a docstring pointing at PRD §1 would prevent this. (Adjustment 14.)
2. **`atlas.py:74` historical comment.** Says hemispheres are concatenated "to match TRIBE's vstack order (see tribev2.utils_fmri.TribeSurfaceProjector.apply line 226)". Anyone debugging Yeo-projection misalignment will Google `tribev2.utils_fmri` and might import it. Comment is correct (we *do* match TRIBE's order so existing prerendered activity.json maps cleanly onto the mesh) — but it should explicitly say *"reference only — runtime never imports tribev2"*.
3. **The control-clip self-substitute (§6 adjustment 6).** Today this is a *correctness* bug, not a *TRIBE-live* bug, but the fix path is the same: either bake the control clip from offline TRIBE OR refuse to ship a falsification number. Without a fix, the demo will display a mathematically-zero falsification delta dressed up as a real measurement — exact violation of CONSTRAINT 2 and FR-K9 / FR-K13.
4. **Stale `vision_report.json` caches.** If the moderator silently consumes a v1-shape report, the empathy paragraph quality drops without any visible failure. Adding a one-line schema check (`if "temporal_sequence" not in report: regenerate`) would convert this into a self-healing cache. (Adjustment 3.)
5. **Empathy guardrail bypass (§6 adjustment 10).** Real impact today: any LLM-generated paragraph containing `"she felt"`, `"clinical"`, `"diagnosis"`, etc. ships unfiltered. Demo-day exposure: NFR12 + NFR13 are explicit guardrails that judges might probe ("how do you avoid reverse inference?"). If a Q-INT-style red-team finds an empathy paragraph that says "she felt afraid", the answer "we have a regex pre-flight" is contradicted by the code.
6. **`activity_reader.py:_generate_synthetic` (line 17).** Out-of-scope for the v2 `/demo/*` flow (used only by the legacy `/brain/start` simulation loop), but on every backend boot `activity_reader.load()` runs on `DATA_DIR=./data` and silently falls into synthetic mode if there's no `preds.npz` (per `qa_logs/QA_REPORT.md` test #5 — `data_source: "synthetic"`). The legacy WS broadcast then sends fabricated activations to any client of `/ws`. The `/demo/*` flow does NOT use this, but anyone hitting the legacy `/brain/*` API in the demo gets fake data with no warning. Cite: CONSTRAINT 1 + 2 + 7. **Risk:** an old frontend bookmark or smoke-test script that still hits `/brain/start` will show synthetic agents.
7. **Static mount at `/prerendered/*` (`main.py:41`).** Serves the entire `prerendered/` tree as static files. Anyone curling `/prerendered/30s_ironsite/activity.json` gets the raw file regardless of `_clip_dir` validation. Today both `/demo/activity/{clip_id}` and `/prerendered/.../activity.json` return identical content. Acceptable (read-only) but worth flagging.

**Bottom line on TRIBE-not-live compliance:** the runtime cannot accidentally call TRIBE because no TRIBE imports exist; the offline-bake pipeline is the only TRIBE surface and it lives in a Colab notebook outside `backend/`. CONSTRAINT 1 is honored. The remaining concerns are silent-stub-class bugs that violate CONSTRAINT 2 and damage the falsification narrative on demo day.

---

## Appendix — verification commands actually run

```bash
# Bootstrap reads
ls -la backend/prerendered/                         # listed 3 clip dirs + 1 README
ls -la backend/prerendered/{30s_ironsite,30s_twitter,example_clip}/

# JSON shape inspection
python3 -c "import json,os; ..."                    # walked each clip dir, dumped top-level keys

# TRIBE touchpoint scan
grep -rn -E "(tribev2|TribeModel|predict_brain_from_text|encode_video|tribe_v2_score|TRIBE_LIVE)" backend/
grep -rn -iE "(tribe|target_brain)" backend/ | grep -v ".pyc"

# Stub-fallback scan
grep -rn -E "(MOCK_|mock_|stub|fallback|hard.?coded)" backend/services/

# Endpoint deletion confirmation
grep -n "comparison" backend/main.py                # zero hits → endpoint removed
ls backend/services/*comparison*.py                 # no such file

# Control-clip directory existence
ls backend/prerendered/ | grep -i baseline          # no matches → control dirs missing

# Guardrail tuple-bool bug verification
python3 -c "print(bool((False, ['reverse-inference'])))"  # → True (always; bug confirmed)

# Embedding-proxy projection map sanity
python3 -c "import numpy as np; W=np.load('backend/services/embedding_proxy/projection_map.npy'); print(W.shape, W.dtype, W.mean(), W.std())"
# → (384, 7) float32 -0.0000 0.0074

# Frontend mock-array check
grep -n "trajectory.*=.*\[" frontend/src/stages/*.vue
# → ComparisonStage.vue:63 inline mock (shard A4 territory; flagged as cross-cutting)

# Prompt registry completeness
ls backend/prompts/                                 # 7 yeo7 + moderator_synthesis + evaluator_score (+ legacy moderator.md)
```

All claims above are tied to a command in this appendix or a file:line reference in the body.

---

**STATUS:** `DONE_WITH_CONCERNS`

Refactor pass should land items §6.A (bake), §6.B5/B6/B8/B9 (silent-stub conversions), §6.C10 (guardrail bug), and §6.D11/D14 (cache hygiene + 410 on /brain/run-inference) before Saturday-8AM freeze. Items §6.E (schema realignment) and §6.F (code drift) belong to R-DOCS / cleanup, not blocking.
