# Spatial sidecar (fuse-then-reason)

**Run several cheap, specialized perception models in parallel on each keyframe, fuse their outputs into a structured JSON evidence file, then let the LLM reason over the JSON instead of the pixels.**

## When to reach for it

You want LLM-grade reasoning over visual content, but VLMs are unreliable on the perceptual sub-task (depth, joints, object boxes, OCR, faces). Replace the perception with off-the-shelf small models, ship the result as JSON, and let the LLM operate where it's actually good.

## The pattern

```
keyframe ──┬──► [MiDaS depth]            depth_per_pixel: ndarray
           ├──► [MediaPipe hands]        joints: list[(x,y,z,confidence)]
           ├──► [YOLOv8 tools]           detections: list[{label, bbox, confidence}]
           ├──► [OCR (PaddleOCR / etc.)] text_regions: list[{text, bbox}]
           └──► [Other perception ...]
                      │
                      ▼ (all parallel; join when all return)
            ┌─────────────────────────┐
            │ fused JSON sidecar/frame │
            │ {                       │
            │   frame_id, t,          │
            │   depth_summary: {...}, │
            │   hands: [...],         │
            │   tools: [...],         │
            │   text:  [...],         │
            │   interactions: [...],  │ ← derived: hand-tool overlap, distances
            │ }                       │
            └─────────────────────────┘
                      │
                      ▼
              [LLM reasoner]
              prompt: "given this evidence, what happened?"
```

## Why it works

- **LLMs are vastly better at structured reasoning over JSON than at perception over pixels.** Structured input is in-distribution for LLM training (HTML, JSON, YAML, code, tables); raw images aren't.
- **Specialized small models are cheap, fast, and reliable** for narrow perception tasks. MiDaS-small, MediaPipe, YOLOv8-Nano all run in tens of ms on commodity hardware.
- **Failures are observable.** If MiDaS misses a frame, the `depth_summary` field is missing, not silently wrong. The LLM can react to "I don't have depth here" rather than confidently hallucinate.
- **Determinism where it matters.** Tool detection bboxes, joint positions, depth maps are reproducible across runs. The non-determinism is confined to the reasoning layer, where you actually want it.
- **The schema is the API.** Every downstream component (rules engine, dashboard, voice agent, retriever) reads the same JSON. The LLM is *one* consumer, not the only consumer.

## Real-code citations

- [`projects/jarvis.md`](../projects/jarvis.md) — claimed-but-unverified: MiDaS depth + MediaPipe hands + YOLOv8 tools fused into one JSON evidence file per keyframe; downstream rules engine + LLM-graded report.

## Gotchas / failure modes

- **Don't dump everything.** A 300×300 depth map serialized as JSON is wasteful and unreadable. Summarize: `{nearest_point: 0.4m, mean_depth: 1.8m, depth_at_hand_centroid: 0.32m}`. Keep raw arrays in a sidecar binary if you need them.
- **Coordinate systems.** Depth, hand joints, tool bboxes — all in image coords (pixels)? Native frame coords? Normalized 0–1? Pick one and stick to it; convert at the perception boundary.
- **Time alignment.** If perception models run at different speeds, multi-model fusion needs explicit timestamps. Don't assume "same keyframe" = "same instant."
- **Schema versioning.** Change the sidecar JSON shape mid-hack and you re-run perception on every demo video. Version it from day one (`"schema": "sidecar/v1"`).
- **Failure-case schemas.** Define what "MiDaS failed on this frame" looks like in JSON (`{"depth_summary": null, "depth_error": "..."}`), so downstream code branches cleanly.

## Generalizes to

- **Any video/image analysis pipeline** where the question is interpretive but the perception is decomposable: surgical workflow, sports, traffic incidents, retail behavior, lab procedures, manufacturing QC.
- **Document/UI understanding:** OCR + layout detection + table extraction → JSON sidecar → LLM Q&A. Same pattern, different perception models.
- **Audio:** speech-to-text + speaker diarization + acoustic event detection → JSON sidecar → LLM summary. Same pattern, different modality.

## Cross-links

- [`projects/jarvis.md`](../projects/jarvis.md)
- [`patterns/localize-and-zoom.md`](localize-and-zoom.md) (handles the cases where structured evidence isn't enough)
- [`patterns/grounded-citation.md`](grounded-citation.md) (the citation layer that points back to specific frames in the sidecar)
