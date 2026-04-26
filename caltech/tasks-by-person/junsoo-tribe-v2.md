---
file-type: tasks-by-person
status: scaffold (extracted from PRFAQ canvas yap 2026-04-25; not yet a locked PRD slice)
last-verified: 2026-04-25
locked-by: Johnny verbatim PRFAQ canvas yap
cross-links:
  - ../yaps/2026-04-25-prfaq-canvas/01-high-signal-extracts.md
  - ../../research/wiki/decisions/006-tribe-v2-as-special-mode.md
  - ../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md
  - ../context/team/junsoo.md
---

# Junsoo — TRIBE V2 (brain-encoding pipeline)

> **Source:** Johnny's verbatim PRFAQ canvas yap, 2026-04-25. Scaffolding only.

## What Johnny named you'll be doing

The video → TRIBE V2 → per-region brain-activation JSON pipeline. You are the **input modality unlock** that makes everything else load-bearing.

1. **Ingest** a video (input format: TBD with team; likely standard mp4 or webm)
2. **Run TRIBE V2 inference** on the video → predicted whole-cortex BOLD response per second
3. **Partition** the activation map by brain region (you decide the partition scheme — see Q-Jun2)
4. **Output** a JSON file: brain-region key → activation intensity / time series, separated by part
5. **Hand off** to Jacob's swarm orchestration

## Corrected facts (T1 — DO NOT use marketing numbers on stage)

Per `tribe-v2-canonical-reference.md`:
- **~20,000 cortical-surface vertices** on `fsaverage5` mesh (NOT 70K voxels — that's marketing)
- **Trained on ~25 deeply-scanned subjects** (~451.6 hours fMRI), generalized across ~720 subjects in evaluation (NOT 700 trained)
- **Temporal resolution: 1 Hz** with 5-second HRF lag — sub-second prediction is structurally impossible
- **License: CC BY-NC-4.0** (non-commercial only — three open GitHub issues asking for commercial license, zero Meta response)
- **OOD degradation:** 0.32 → 0.17 score collapse on out-of-distribution stimuli (cartoons, silent film). Industrial / construction footage is OOD; if Ironside dataset is the demo input, expect degraded performance — have a fallback (consumer-media clip).

## Forbidden moves (will sink the demo if violated)

- **Reverse inference** — saying "frontal lobe lit up = the person felt X" is scientifically invalid (Poldrack 2006). The output is *activation patterns*, not psychology. Frame everything as patterns + specialist inference, never "the brain felt."
- **Sub-second claims** — fMRI is 1 Hz floor. If anyone in the team wants "real-time" framing, push back.

## High-signal extracts from the yap (your context)

- Johnny: *"it doesn't give you the data natively... it's literally just 'this amount of part of the brain fired from this section'"* — yes, that's exactly the output. Activation per region, not semantic content.
- Johnny: *"you're going to find a way to process that into semantic data we can use"* — your partition + JSON shape is what makes downstream specialists possible. The semantic conversion is Jacob's swarm; YOU give them the partitioned numerical input.
- Johnny: *"separated by each brain part"* — the partition scheme is your call; communicate it to Jacob early so the I/O contract is stable.

## Open questions for you to bring back

- **Q-Jun1.** Partition scheme: which atlas / parcellation? (TRIBE outputs per-vertex; you collapse to regions. Glasser 360-parcel? Yeo-7 networks? Major lobes? Trade-off: granularity vs. specialist-prompt clarity.)
- **Q-Jun2.** Inference latency budget: how long does TRIBE take on a 30s clip on the GPU you have access to? This sets the demo-window ceiling.
- **Q-Jun3.** Llama-3.2-3B is a TRIBE dependency and is HuggingFace-gated. Have you confirmed access? (Approval is usually same-day but blocks setup if delayed.)
- **Q-Jun4.** Pre-cache the ~1 GB checkpoint *before* venue demo-day. Confirm this is on your prep list.
- **Q-Jun5.** Mock contract for Jacob: what does the JSON look like *exactly*? Stub it Friday so Jacob can start building against the mock.

## What's NOT yet your problem

- The swarm orchestration / specialist prompts (Jacob)
- The 3D visualization (Emilie / Johnny)
- The pitch / sponsor angles (Emilie / Johnny)

## NEW — your shipped corpus directly fills 3 pitch blockers (2026-04-25 sync)

Per the team-profile + corpus gap-filler analysis (`caltech/validation-findings/2026-04-25-team-gap-fillers.md`), your prior shipped work directly answers three otherwise-unanswered questions. You own these by virtue of having already done the work:

### 1. Ironside close defense — owned by you

Your egocentric-video → VLM-supervision pipeline (3D scene recon + grasp annotation + trajectory extraction) IS the credibility chip when an Ironside judge asks *"how does brain encoding actually help our pixel-only pipeline?"*

**Reframed close (drop the "feel emotions" reverse-inference language):**
> *"Pixel-only VLMs miss the salience signal — what a human observer's brain attends to. We add that signal as a second modality so your pipeline catches manipulation moments your VLMs currently miss."*

You can defend this in Q&A because you literally built the failure mode this pipeline addresses.

### 2. Cross-region communication protocol — owned by you

Your Icarus Lab work (LLM ↔ PDDL bridge, two-LLM cooperative planning compiling to formal symbolic representations) lets you define the cross-region swarm-communication protocol **formally**, not hand-wavy. Frame as: structured handoff messages (region A's hypothesis → region B's evaluation against its own activation evidence).

This defends the team against red-team attack RT-2 (*"how do you know the cross-talk isn't trends-slop converging?"*) — your black-box LLM behavior probing experience is the empirical method to *test* whether cross-region outputs diverge meaningfully.

### 3. Q-J6 inverted-brain-search structure — owned by you

Your KG-grounded LLM reasoning experience (knowledge graphs as a structured backbone, query/traverse rather than parametric memory) gives you the implementation pattern for the Land card's inverted-brain-search: **structure per-region archetype lookup as a small KG** (region → function → content-type → exemplar set) instead of free-form generation. Defends against Sally's "stochastic bad suggestion" failure mode.

## PhD-application narrative for this hackathon (per `junsoo.md` win conditions)

This work is publishable as a technical writeup on multi-agent LLM coordination + brain-encoding-as-grounding. Sven Koenig's IDM Lab orbit (multi-agent path-finding, agent coordination) has direct interest-overlap with the cross-region communication protocol you'd be designing. **Frame the work as a research artifact, not just a demo.** Capture:
- Protocol specification for cross-region semantic handoffs
- Empirical results on whether cross-talk produces semantically distinct outputs (your black-box probing methodology applied)
- Comparative baseline: single-LLM-call vs. swarm+cross-talk on brain-encoded inputs

This becomes letter-of-rec material if Sven's lab cites it.

## Lane tools

- Claude Code or Cursor for the inference pipeline
- Output a stub JSON early (mock activation values) so Jacob's lane is unblocked

## What you are NOT cleared to do until Johnny locks the PRFAQ

Wait for orchestration green-light. Pre-work allowed:
- Confirm TRIBE V2 GitHub clone + `tribe_demo.ipynb` runs locally
- Confirm Llama-3.2-3B access on HuggingFace
- Pre-cache the checkpoint (~1 GB)
- Read the canonical reference fully — `research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md`
