# `junsoo/brain/` — TRIBE V2 brain-encoding interface

The data-layer module of the Empathy Engine. Wraps Meta's TRIBE V2 brain-encoding model in both directions:

- **Reverse**: video → per-second brain pattern (~20K vertices, fsaverage5, 1Hz, 5s HRF lag)
- **Forward**: text paragraph → predicted brain pattern (the load-bearing capability for the iterative scoring loop)

## Files

| File | Purpose |
|---|---|
| `schema.py` | Pydantic v2 models — `BrainPattern`, `PredictedBrainPattern`, `BrainFrame`, `RegionActivation`. Each model has a `flatten_regions()` helper that returns a sorted-key 1D numpy array — that's what cosine similarity operates on. |
| `forward.py` | `predict_brain_from_text(paragraph, scenario)` — wraps TRIBE V2 forward inference. The iterative scoring loop calls this every round. |
| `reverse.py` | `encode_video(video_path, scenario)` — wraps TRIBE V2 reverse inference (video → BrainPattern JSON). Thin wrapper around the existing `junsoo/run_inference.py` pipeline. |
| `test_brain_offline.py` | 5 offline tests using `MOCK_FORWARD=1` |

## Env vars

```bash
# Mock path (default during dev / CI)
MOCK_FORWARD=1   # bypasses real TRIBE call; returns deterministic hash-based mock activations

# Live path (requires TRIBE V2 weights + a GPU)
HF_TOKEN=hf_...
TRIBE_CACHE_DIR=./cache  # weights persist here; ~7 GB
```

## Mock vs. live

The mock path is **load-bearing for the iterative loop's offline testability**. It produces deterministic outputs that:
- Differ for different inputs (cosine sim < 0.95 between two different paragraphs)
- Are similar for similar inputs (cosine sim > 0.7 between paragraph and `paragraph + " ."`)

This means the iterative loop's scoring trajectory is *meaningful* in mock mode — score climbs across rounds because the synthesizer's output drifts toward the target — without needing a GPU.

## Lane vs. existing report_card

This module replaces and supersedes the `BrainPattern` schema concept that lived informally in `junsoo/report_card/`. The new schema is stricter (Pydantic v2 with `extra="forbid"`) and includes both directions. The old `report_card/` modules still work but produce a different artifact (per-action JSON report card) and are not part of the new Empathy Engine pipeline.

## Run tests

```bash
MOCK_FORWARD=1 python3 junsoo/brain/test_brain_offline.py
# 5/5 passed
```

## Region rosters (per scenario)

The forward inference adapts to the active scenario's specialist roster:

- **`ironsight_workplace`**: `visual_attention, threat_detection, spatial_mapping, motor_planning, salience_tracking, prefrontal_engagement, default_mode, stress_response`
- **`listenlabs_sideshift_consumer`**: `visual_attention, emotional_processing, prefrontal_engagement, default_mode, social_pattern, salience_tracking, memory_recall, language_region`

Defined in `caltech/engine/registry.py`.

## Caveats

- **Live TRIBE forward direction is the highest-risk piece of the engine.** If the Clair de Lune-style forward call doesn't work on this machine, the iterative loop has nothing to score against. Mitigation: pre-bake the round trajectory for the demo input clip; live forward becomes a stretch goal.
- **Construction footage is OOD** for TRIBE V2 (canonical reference notes 0.32 → 0.17 score collapse on cartoons). Pre-cache mandatory for demo-day reliability.
- **Region pooling currently uses naive `np.array_split` slabs** rather than the Yeo-atlas mapping in `junsoo/atlas.py`. The 8-specialist roster doesn't map 1:1 to Yeo7/17 networks, so atlas integration is a follow-up. Mock path unaffected.
