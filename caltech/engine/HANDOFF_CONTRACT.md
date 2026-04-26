# Cross-lane handoff contracts — Empathy Layer Engine

The 3 interface schemas that bind the 3 lanes together. Each schema has exactly one producer and known consumers. Lock these before parallel work starts; rebuild any lane behind them.

## Contract A — `BrainPattern` (Junsoo's lane → Jacob's + Johnny's)

**Producer:** `junsoo.brain.reverse.encode_video(video_path, scenario)`
**Consumers:** `caltech.engine.swarm.SpecialistSwarm.run`, `caltech.engine.iterative_loop.IterativeLoop.run`, `caltech.engine.runner.EmpathyEngine.run`
**Pydantic source of truth:** `junsoo/brain/schema.py`

```json
{
  "video_id": "demo-input-1.mp4",
  "scenario": "ironsight_workplace",
  "tribe_version": "v2",
  "mesh": "fsaverage5",
  "n_vertices": 20484,
  "temporal_resolution_hz": 1,
  "hrf_lag_s": 5,
  "frames": [
    {
      "time_s": 0,
      "regions": {
        "visual_attention":      {"activation": 0.78, "vertex_ids": null},
        "threat_detection":      {"activation": 0.31, "vertex_ids": null},
        "spatial_mapping":       {"activation": 0.55, "vertex_ids": null},
        "motor_planning":        {"activation": 0.42, "vertex_ids": null},
        "salience_tracking":     {"activation": 0.18, "vertex_ids": null},
        "prefrontal_engagement": {"activation": 0.71, "vertex_ids": null},
        "default_mode":          {"activation": 0.08, "vertex_ids": null},
        "stress_response":       {"activation": 0.22, "vertex_ids": null}
      }
    }
  ]
}
```

Rules:
- All `activation` values in [0, 1] (per-vertex z-score → sigmoid squeeze upstream)
- Region keys MUST match the active scenario's specialist roster (8 entries)
- `frames` is per-second; one entry per second of input video
- `vertex_ids` is optional context for atlas mapping; consumers can ignore

## Contract B — `predict_brain_from_text(paragraph, scenario) -> PredictedBrainPattern`

**Producer:** `junsoo.brain.forward.predict_brain_from_text` (Junsoo's lane)
**Consumers:** `caltech.engine.iterative_loop.IterativeLoop` (called every round), `caltech.engine.falsification.compute_falsification`

```json
{
  "input_text": "She moved through the scaffolding...",
  "regions": {
    "visual_attention":      {"activation": 0.62, "vertex_ids": null},
    "threat_detection":      {"activation": 0.18, "vertex_ids": null},
    "spatial_mapping":       {"activation": 0.49, "vertex_ids": null},
    "motor_planning":        {"activation": 0.35, "vertex_ids": null},
    "salience_tracking":     {"activation": 0.22, "vertex_ids": null},
    "prefrontal_engagement": {"activation": 0.71, "vertex_ids": null},
    "default_mode":          {"activation": 0.14, "vertex_ids": null},
    "stress_response":       {"activation": 0.18, "vertex_ids": null}
  }
}
```

Rules:
- No time dimension — text input has no time axis
- Same region keys as the matching scenario's `BrainPattern`
- `flatten_regions()` returns a fixed-length 1-D `np.ndarray` (sorted alphabetically by region key) — that's what cosine similarity operates on
- Mock path (`MOCK_FORWARD=1`) is deterministic and produces SIMILAR outputs for similar inputs (so the iterative loop's score climbs as the synthesizer's text drifts toward truth)

## Contract C — `EmpathyDocument` (engine.runner → frontend / consumer)

**Producer:** `caltech.engine.runner.EmpathyEngine.run`
**Consumer:** any frontend that renders the 3-section empathy-layer document, plus any downstream automation

```json
{
  "clip_id": "ironsight_warehouse_demo",
  "scenario": "ironsight_workplace",
  "vision_report": {
    "scene_summary": "...",
    "actions": ["...", "..."],
    "temporal_sequence": [{"t": 0, "action": "..."}],
    "spatial_relationships": [{"from": "worker", "to": "scaffold", "relation": "approaching"}]
  },
  "best_paragraph": "She moved through the scaffolding like someone whose attention had already left for the day...",
  "final_score": 0.84,
  "round_trajectory": [
    {"round": 1, "score": 0.42, "paragraph_excerpt": "Worker walked..."},
    {"round": 2, "score": 0.58, "paragraph_excerpt": "She entered the scaffolding..."},
    {"round": 8, "score": 0.84, "paragraph_excerpt": "She moved through the scaffolding..."}
  ],
  "per_region_attribution": {
    "default_mode":          {"candidate_match": 0.91, "target": 0.87},
    "prefrontal_engagement": {"candidate_match": 0.78, "target": 0.81}
  },
  "falsification": {
    "main_video_id": "ironsight_warehouse_demo.mp4",
    "control_video_id": "workplace_routine_baseline.mp4",
    "main_paragraph_score": 0.84,
    "control_paragraph_score": 0.27,
    "falsification_delta": 0.57,
    "verdict": "anchored"
  },
  "model_metadata": {
    "stage_1_latency_ms": 8300,
    "stage_2_latency_ms_total": 24500,
    "swarm_latency_ms": 2300,
    "loop_latency_ms": 60100,
    "engine_version": "1.0"
  }
}
```

Rules:
- `final_score`, `main_paragraph_score`, `control_paragraph_score` are cosine similarity in [-1, 1]
- `verdict` is `"anchored"` if `falsification_delta > 0.40`, else `"generic-plausible"` (red flag — the paragraph is generically plausible against ANY brain pattern)
- `round_trajectory` has 1..8 entries; loop stops early on plateau
- `falsification` may be `null` if no control video was provided
- All fields validated via `EmpathyDocument(BaseModel, extra="forbid")` in `runner.py`

## Lane ownership at a glance

| Schema | Producer (lane) | Consumer (lane) |
|---|---|---|
| `BrainPattern` (A) | Junsoo (`brain.reverse`) | Jacob (`engine.swarm`, `engine.iterative_loop`) + Johnny (`engine.runner`) |
| `PredictedBrainPattern` (B) | Junsoo (`brain.forward`) | Jacob (`engine.iterative_loop`, `engine.falsification`) |
| `EmpathyDocument` (C) | Johnny (`engine.runner`) | Emilie (UI), demo runner |

## When a schema must change

- **Adding a region** to a scenario roster: update `caltech/engine/registry.py` AND `junsoo/brain/forward.py`'s mock fallback AND `caltech/engine/swarm.py`'s prompt loader. All three must agree.
- **Changing `vertex_ids` semantics**: requires atlas decision; coordinate with all consumers.
- **Adding a top-level field to `EmpathyDocument`**: backwards-compatible (`Optional[...]`) is preferred; otherwise frontend renderer must be updated in lockstep.

## Verification

All three contracts have offline tests under their owning module:

```bash
MOCK_FORWARD=1   python3 junsoo/brain/test_brain_offline.py        # Contract A + B
MOCK_K2=1        python3 -m caltech.engine.test_swarm_offline       # Contract A consumer
                 python3 -m caltech.engine.test_loop_offline        # Contract B consumer
MOCK_VISION=1 MOCK_OPUS=1 MOCK_K2=1 MOCK_FORWARD=1 \
                 python3 -m caltech.engine.test_runner_offline      # Contract C end-to-end
```

If any of these break, a contract is misaligned. Re-read this doc, find the schema mismatch, fix the producer or consumer, re-run.
