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

## C6 — `EmpathySynthesisDocument` (Stage 4 — Opus 4.7 synthesis output)

This is the document produced by **Stage 4 (Opus 4.7 synthesis)**. It braids the Stage 1A vision report, the Stage 1B/2/3 swarm + iterative-loop output, the Stage 5 falsification result, and the pre-rendered TRIBE V2 brain activations into a single causally-coherent document. Unlike `moderator_synthesis` (Stage 2) which emits ONE freeform paragraph, this document is **structured JSON** with a temporal arc, neural evidence per network, an inflection moment, and a scenario-specific lens. The document shape is constant across the two demo scenarios; only `scenario_lens` swaps based on `clip.scenario`.

**Cut-line / optional:** When `OPUS_POLISH≠1` or `ANTHROPIC_API_KEY` is missing, Stage 4 is skipped and `synthesis_document` is `null` in the `EmpathyDocument` response. Frontend then falls back to rendering `best_paragraph`.

**Addition to `EmpathyDocument`:** `synthesis_document` is added as a **top-level optional field** on the existing `EmpathyDocument` (C2). Do not redefine `EmpathyDocument` here — only the new field is specified:

```jsonc
// EmpathyDocument additions (top-level, optional)
{
  ...,
  "synthesis_document": EmpathySynthesisDocument | null
}
```

Shape:
```json
{
  "headline": "string (≤120 chars; one-line verdict)",
  "synthesis_paragraph": "string (≈150 words; Opus's polished narrative — replaces best_paragraph for user-facing display, but best_paragraph is preserved separately)",
  "temporal_arc": [
    {
      "t_window": "string (e.g., '0-8s')",
      "scene": "string (what Qwen3-VL observed in this window — 1 sentence)",
      "brain_signature": "string (dominant Yeo7 networks during this window — 1 short clause)",
      "claim": "string (1-2 sentences of causal interpretation tying scene→brain)"
    }
  ],
  "neural_evidence": [
    {
      "network": "string (one of: visual, somatomotor, dorsal_attention, ventral_attention, limbic, frontoparietal, default_mode)",
      "what_it_processed": "string (qualitative reading of this network's role in the clip)",
      "anchored": "boolean (did this network's signal anchor the paragraph per per_region_attribution?)",
      "contribution": "string (what this region's signal added to the verdict)"
    }
  ],
  "inflection_moment": {
    "t_s": "integer (seconds, the single pivot point in the clip)",
    "scene_event": "string (what was visually happening at t_s)",
    "neural_event": "string (what shifted in brain-space at t_s)",
    "why_it_matters": "string (why this is the load-bearing moment of the clip)"
  },
  "falsification": {
    "delta": "float (from Stage 5 falsification.delta)",
    "verdict": "string ('anchored' | 'generic_plausible')",
    "explanation": "string (1-3 sentences explaining WHY the delta is what it is — which regions' signals anchored to main vs diverged from control)"
  },
  "scenario_lens": "object (exactly one of the two below — selected by clip.scenario)",
  "model_metadata": {
    "model": "string (e.g., 'claude-opus-4-7')",
    "input_tokens": "integer",
    "output_tokens": "integer",
    "elapsed_ms": "integer"
  }
}
```

`scenario_lens` when `clip.scenario == "ironsight_workplace"`:
```json
{
  "ironside": {
    "cognitive_load_index": "float (0..1; synthesized from frontoparietal + dorsal_attention sustainment vs. limbic spikes)",
    "decision_quality": "string ('engaged' | 'hijacked' | 'distracted' | 'recovering')",
    "risk_flag": "string (e.g., 't=18s — limbic spike while frontoparietal receded')",
    "training_target": "string (which network stayed under-engaged across the clip; recommendation phrased in observational language)"
  }
}
```

`scenario_lens` when `clip.scenario == "consumer"`:
```json
{
  "listenlabs": {
    "shift_signature": "string (which networks dominated; which were recessive)",
    "argument_lever": "string (the moment/scene that pulled the most regions simultaneously — the lever-frame)",
    "immunization_brief": "string (≈40 words user-facing — what to watch for)",
    "brain_card_summary": "string (≤80 chars — shareable Wrapped-style card text)"
  }
}
```

Notes:
- `synthesis_document` is added as a top-level optional field on the existing `EmpathyDocument` (C2) — do NOT redefine `EmpathyDocument`; only the addition is specified above.
- Exactly one of `scenario_lens.ironside` or `scenario_lens.listenlabs` must be present per response, never both, never neither (when the document is non-null).
- `best_paragraph` (from C2) is preserved alongside `synthesis_document.synthesis_paragraph` so frontend can fall back if the synthesis is null.
- Same forbidden-claim guardrails as `moderator_synthesis` (no reverse inference, no clinical claims, within-subject only, no inflated TRIBE numbers).
