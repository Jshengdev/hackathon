# CONTRACTS — cross-shard data shapes that must not change

If your audit recommends changing one of these, escalate to the orchestrator (this main session) instead of deciding unilaterally.

## C1 — `activity.json` (per-clip pre-rendered TRIBE output — v2 canonical name)

Located at `backend/prerendered/<clip_id>/activity.json`. Source: TRIBE V2 reverse, run offline (Vultr or equivalent GPU box). The runtime NEVER invokes TRIBE — `activity.json` IS the brain-data artifact.

Shape (per technical PRD §6.2 — v2 names this `activity.json` not `target_brain.json`):
```json
{
  "video_id": "30s_ironsite",
  "scenario": "ironsight_workplace",
  "tribe_version": "v2",
  "mesh": "fsaverage5",
  "n_vertices": 20484,
  "temporal_resolution_hz": 1,
  "hrf_lag_s": 5,
  "frames": [
    { "t_s": 0, "regions": { "visual": 0.78, "default_mode": 0.31, ... }, "top_region": "visual" },
    ...
  ]
}
```

Per-clip cache layout (v2 — see PRD §3 pre-warmup contract):
```
backend/prerendered/<clip_id>/
├── <clip_id>.mp4                ← original video (for vision frame extraction)
├── activity.json                ← TRIBE V2 brain output (this contract)
├── scenario.json                ← {"scenario": "ironside" | "consumer", "label": "..."}
├── vision_report.json           ← Stage 1A Qwen3-VL output (cached)
├── swarm_readings.json          ← Stage 1B K2 swarm output (cached)
├── k2_region_cache.json         ← 7 networks × N seconds of K2 readings (instant region clicks)
├── empathy.json                 ← Stage 2+3 iterative loop result (cached) — INCLUDES iterative_trajectory + falsification
└── (control_activity.json optional — only for control clips)
```

## C2 — `EmpathyDocument` (Opus final-layer output)

Returned by `GET /demo/empathy/{clip_id}`. Shape:
```json
{
  "clip_id": "30s_ironsite",
  "scenario": "ironsight_workplace",
  "vision_report": {...},
  "best_paragraph": "She moved through the scaffolding...",
  "final_score": 0.84,
  "round_trajectory": [
    { "round": 1, "score": 0.42, "paragraph_excerpt": "...", "specialist_readings": {...}, "cross_region_edges": [...] },
    ...
  ],
  "per_region_attribution": { "<network>": {"candidate_match": 0.91, "target": 0.87}, ... },
  "falsification": { "main_video_id": "...", "control_video_id": "...", "main_paragraph_score": 0.84, "control_paragraph_score": 0.27, "falsification_delta": 0.57, "verdict": "anchored" },
  "model_metadata": {...}
}
```

## C3 — Per-round simulation trace (frontend's IterativeLoop consumes this)

Each entry in `round_trajectory[]` carries the per-round simulation snapshot — specialist readings, cross-region edges, score, candidate paragraph excerpt. Frontend `IterativeLoop.vue` renders the trajectory; new fields (specialist_readings, cross_region_edges) are additive and frontend can ignore unknown keys.

## C4 — Live API surface (do not rename without coordinating)

- `GET /demo/clips`
- `POST /demo/match {filename}`
- `GET /demo/activity/{clip_id}`
- `GET /demo/vision-report/{clip_id}`
- `GET /demo/empathy/{clip_id}` ← Opus final layer (PRIMARY consumer-facing endpoint)
- `GET /demo/iterative-trajectory/{clip_id}` ← swarm-loop simulation trace
- `GET /demo/falsification/{clip_id}`
- `POST /demo/k2-region` ← single-region debug call (used by brain-region click popup)
- `WS /ws` ← per-frame swarm event stream (for live agent-edge animation)
- `GET /brain/mesh`, `GET /brain/status`, `POST /brain/{start,stop,reload}`

## C5 — Hard-code clip→cache name matching

- Folder name `backend/prerendered/<clip_id>/` is the canonical id.
- Match upload filename to clip_id by stripping extension: `30s_ironsite.mp4` → `30s_ironsite`.
- No fuzzy matching. No "almost matches" fallback. If `prerendered/<clip_id>/` doesn't exist, log + 404.
