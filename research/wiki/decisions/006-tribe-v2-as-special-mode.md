---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions:
  - 001-tech-first-stack-strategy.md
  - 002-track-commitments-locked.md
cites-sources:
  - research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/006-tribe-v2-meta-trimodal-brain-encoder.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/100-tribe-v2-and-agent-swarms-architectural-anchors.md
  - caltech/context/team/johnny-public-corpus.md
  - caltech/context/architecture.md
cross-links:
  - 007-agent-swarms-as-coordination-pattern.md
  - 009-ironside-pipeline-mirror.md
  - ../themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md
---

# 006 — TRIBE V2 as the special mode

## Decision

**TRIBE V2** (Meta FAIR's trimodal brain encoder; ICLR 2026; CC BY-NC-4.0) is the architectural anchor #1 — the "special mode" / "freaky tech" curveball the build is structured around. Used as a *novel input modality* on top of standard VLM pipelines: video/audio/text → predicted whole-cortex BOLD response.

## Date locked

2026-04-25 (Johnny's directional steer naming TRIBE V2 + agent swarms together).

## Locked by

Johnny (verbatim):
> "I want to lean heavy into Tribe V2 as our special mode, agent swarms obviously, and then basically figure out how to like sort through all the mess of everything here and get things going." [source: `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/100-tribe-v2-and-agent-swarms-architectural-anchors.md` line 3]

## Why

Three reasons stack:

1. **Johnny has hands-on TRIBE V2 experience** — Synthetic Synesthesia (matching Clair de Lune brain pattern from text, 90.4% match in emotion centers) + Empathy "Floor and Bounce" via DMN (DMN signal drops then bounces back as inner narrator activates). He is not learning the model from scratch [source: `caltech/context/team/johnny-public-corpus.md` lines 10–53].
2. **It is the only publicly-available system that lets you check the predicted neural response to content in software, before deployment** — the literal inverse of trends slop (source 003) [source: `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/100-...md` table row 3].
3. **No TreeHacks 2026 winner used it** — verifiable greenfield differentiator [source: `research/wiki/scrapes/treehacks-2026-winners.md` line 8].

## What this opens

- A "creator pre-screening their own content" use case (the *good* version per source 006 cautions).
- The AI-paradox theme's "augmented intelligence" gets a concrete instrument — measurement of what content does to a brain.
- Trimodal architecture (V-JEPA 2 + Wav2Vec-BERT + Llama-3.2) gives natural composability with K2 (text reasoning), Listen Labs (audio surface), Ironside (video/spatial).
- ~1 GB checkpoint, ~1 hour fine-tune to a new subject, public Colab demo + interactive demo at `aidemos.atmeta.com/tribev2/` — runnable in the worktree.

## What this closes

- Reverse-inference UX claims ("this content will make you feel X") — explicitly disclaimed by Poldrack 2006 + Ramsøy 2026 [source: `tribe-v2-canonical-reference.md` §7a].
- Sub-second latency demos — fMRI temporal resolution (1 Hz) is a hard physical floor; HRF-offset is 5s.
- Commercial deployment claims — license is CC BY-NC-4.0 with active enforcement (issue #48 AskKairo violation closed) [source: `tribe-v2-canonical-reference.md` §6c].
- "Reads your inner monologue" framing — not what the model does.

## Reversibility

Reversible only if all three of: TRIBE V2 fails on the chosen video domain (untested on Ironside-style construction footage), engineering deploy is too slow, and a fallback baseline doesn't preserve the demo arc. Until then, locked.

## Tensions held (per protocol — not resolved)

- **T2 from `500-elicitation-qa-pass.md` + `tribe-v2-canonical-reference.md` §3a contradiction:** source 006 cites "70,000 voxels" + "trained on 700 people"; the canonical reference shows ~20,000 cortical-surface vertices on `fsaverage5` + ~25 training subjects (with 700+ in evaluation universe). **Treat the canonical reference as authoritative; the 70K figure is marketing summary.**
- **T7 from `500-elicitation-qa-pass.md`:** wow-toggle vs. fMRI-temporal-resolution floor — the demo theatre target and the physics floor are not yet reconciled.
- **T8 from `500-elicitation-qa-pass.md`:** reverse-inference is the largest scientific failure mode AND the most natural demo claim — the most demoable framing is the source's most explicit prohibition.

## Trace

- `research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md` — primary-source verification, supersedes source 006 on three load-bearing facts.
- `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/006-tribe-v2-meta-trimodal-brain-encoder.md` — original ingest from two YouTube transcripts.
- `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/100-tribe-v2-and-agent-swarms-architectural-anchors.md` — synthesis with agent-swarm pairing.
- `caltech/context/team/johnny-public-corpus.md` lines 10–53 — Johnny's two prior experiments.
- `caltech/context/architecture.md` Layer 2 — TRIBE V2 in the directional stack.
