---
file-type: pattern
status: verified
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/009-ironside-pipeline-mirror.md
cites-sources:
  - ../projects/jarvis.md
  - ../../caltech/context/sponsors/ironsite.md
cross-links:
  - spatial-sidecar.md
  - grounded-citation.md
  - ../projects/jarvis.md
  - ../projects/memento.md
---

# Localize-and-Zoom

**Defeat VLM spatial blindness without fine-tuning: use the model itself as a region proposer, then re-query it on a crop of the *raw* (un-downsampled) frame.**

## When to reach for it

You're asking a vision-language model a spatial question — "is the hand touching the blade?", "is the pedestrian inside the crosswalk?", "is the IV in the vein?", "is the rebar inside the rebar cage?" — and the model is wrong because the interaction zone is a tiny cluster of pixels in a wide shot.

Documented failure modes (all 2025): GeoMeter Benchmark on depth/height failures, AdaptVis (ICML 2025) on misallocated spatial attention, EgoConQS (2025) on egocentric moment retrieval. Each says the same thing in different words: single-shot VLM attention spreads across the whole frame.

## The pattern

```
┌─ Wide frame (1920×1080)
│
└─► [Scan pass] VLM call: "return bbox(es) for hand, tool, ..."
        │
        ▼
    bbox(hand) = [x1,y1,x2,y2]
    bbox(tool) = [x1,y1,x2,y2]
        │
        ▼
    crop the RAW frame at (union of bboxes, padded ~10%)
    (NOT the downsampled view used for the scan)
        │
        ▼
    [Verify pass] VLM call on the crop: "is contact happening? confidence?"
        │
        ▼
    confidence < threshold? ──► re-crop (different padding / aspect) and re-verify
        │
        ▼
    temporal consistency vote: ±2s adjacent keyframes → majority decision
```

## Why it works

Two reasons stack:

1. **Resolution density.** A 64×64 hand-near-blade region inside a 1920×1080 frame is ~0.2% of pixels. After the model's image encoder downsamples (typically to 224×224 or 384×384 patches), that interaction is 1–2 patches wide. After cropping at native resolution and re-encoding, the same region fills the full encoder input — 100× the patches per square inch of *the thing the question is about*.
2. **Attention focus.** Even if the encoder could resolve the small region, language-conditioned attention on a wide frame spreads across irrelevant content. A crop is a *prior* — it tells the model "the answer is in here." This is what AdaptVis demonstrated.

The temporal vote at the end is the cheap kill of single-frame anomalies. ±2 seconds at 30 fps is ~120 frames; sample 5 evenly and majority-vote.

## Real-code citations

- [`projects/jarvis.md`](../projects/jarvis.md) — claimed-but-unverified: the headline pipeline pattern. Gemini 2.5 Flash for both passes; OpenCV for crop; the temporal vote runs after.

## Gotchas / failure modes

- **Crop from the raw frame, not the scan-pass input.** Easy mistake: the scan was done on a 384px-resized frame; the bbox is in resized coords; you crop the resized frame and re-query at the same low resolution → no improvement. Map the bbox back to native coordinates and crop the original.
- **Padding.** Tight crops cut off relevant context (the blade's full geometry, the wider hand pose). Pad ~10–15% on each side.
- **Bbox hallucination.** The scan pass sometimes returns confident bboxes for things that aren't there. Cross-check with a parallel detector (YOLOv8, MediaPipe) — see `patterns/spatial-sidecar.md`.
- **Cost.** Two VLM calls per keyframe (sometimes three with the resample). Budget upfront; pre-filter keyframes aggressively.
- **Latency.** The verify pass is sequentially dependent on the scan pass — you can't parallelize within a frame. Parallelize *across* frames instead.

## Generalizes to

Any wide-shot → small-interaction problem:
- Dashcams (cyclist proximity, lane changes)
- Surgical / ER cams (instrument-tissue contact, sterile-field breaks)
- Warehouse drones (mis-shelved item, damaged pallet)
- Retail security cams (theft gestures, slip-and-fall)
- Kitchen cams (food temperature handling, glove use)
- Drone footage (illegal dumping, infrastructure faults)
- Microscopy / pathology (cell anomalies)
- Satellite imagery (rural infrastructure changes)

## Theme alignment

- **AI paradox / invisible use cases** — defeating VLM spatial blindness *without fine-tuning* is engineering-over-prompting. The pattern's existence is a refutation of the trends-slop framing that AI can only do what its prompt asks; here the inference loop *itself* is the un-black-box.

## Anti-theme alignment

- **Cropping from the scan-pass input** instead of the raw frame (the most common failure mode) means the resolution gain never happens. The pattern reduces to two equivalent VLM calls — performance flat, latency 2×, demo-claim broken.
- **Cost dishonesty** — quoting the pattern as "free spatial reasoning" while two VLM calls per keyframe stack tokens fast. Pre-filter keyframes aggressively or the demo budget collapses.

## Cross-links

- [`projects/jarvis.md`](../projects/jarvis.md)
- [`patterns/spatial-sidecar.md`](spatial-sidecar.md) (the complementary "fuse-cheap-detectors" half)
- [`patterns/grounded-citation.md`](grounded-citation.md) (the report layer that consumes the verified events)
