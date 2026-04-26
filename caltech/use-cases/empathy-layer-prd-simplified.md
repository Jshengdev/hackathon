---
title: "Simplified PRD — Empathy Layer Engine with Two-Stage Agent Pipeline"
status: updated 2026-04-25 to reflect Ironsight/Listen Labs PRD rename + one-size-fits-all framing
purpose: |
  Build-clarity companion to the canonical Ironsight/Listen Labs PRD. Focused on the
  actual build path: two-stage agent pipeline + TRIBE V2 brain-encoding in-between +
  iterative-scoring loop (Clair de Lune protocol inverted). Per Johnny's conversation
  with the Ironsight team at their office hours, this two-stage pipeline structurally
  satisfies their spatial-intelligence definition (agents map brain-wave back to video).

  ONE engine. Multiple data sources. Different processing parameters per scenario.
  Different beneficiary stories per scenario. The build doesn't fork; the engine ships
  one binary with a prompt-registry hot-swap for per-scenario configuration.
canonical_prd: _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md
codename: Empathy Layer
ironside_definition_clarified: |
  "What spatial intelligence means to them is basically adding in another form of
  information that helps the model infer about the overall environment. Us just using
  the [TRIBE V2] model is enough for them to consider that spatial intelligence, as long
  as the classification — the swarm mapping of what this brain wave maps back to the
  video — is what they're looking for in terms of spatial intelligence."
   — Johnny verbatim, 2026-04-25 post-Ironside-pavilion conversation
ladders_to:
  - caltech/use-cases/empathy-layer-hero-output.md (the strategic framing this PRD implements)
  - caltech/use-cases/two-demo-scenarios.md (canonical scenario contract)
  - caltech/use-cases/ironside.md (Scenario A — workplace footage)
  - caltech/use-cases/listenlabs-sideshift.md (Scenario B — consumer)
  - _bmad-output/planning-artifacts/prd.md §FR (functional requirements)
ironside_team_context_captured:
  Keenan: founding member, 11 years construction superintendent
  Vidyali: CSO; Gemini quantization research; Etch
  Luca: AI research, physics simulators
  David: research; Vanderbilt hackathon
  Jeffrey: USC '24 math/CS; built initial product + data infrastructure + database + data pipeline
---

# Simplified PRD — Empathy Layer with Two-Stage Agent Pipeline

> **Build clarity, not strategic positioning.** Strategic framing lives in [`empathy-layer-hero-output.md`](./empathy-layer-hero-output.md). This document is what the engineers reference when they're shipping.

---

## §1. The product in one sentence

**Take a video of a human taking actions. Run two stages of agent processing. Produce an emotionally-grounded paragraph describing what the human felt, with a similarity score proving the description is anchored to brain-pattern evidence. Hand the paragraph to a decision-maker who would otherwise read action data alone.**

---

## §2. The pipeline (two-stage agents + TRIBE V2 in the middle + iterative scoring)

```
[INPUT: Video of human action]
                ↓
        ┌──────────────────────────────────────┐
        │ STAGE 1 — Vision Classification Agent │
        │ Tool: Gemini (or Claude vision API,   │
        │       via OpenRouter key)             │
        │                                       │
        │ Job: Describe what happened in the    │
        │      scene as a classification report │
        │      (worker actions, environment,    │
        │      tools, temporal sequence,        │
        │      spatial relationships)           │
        │                                       │
        │ Output: Vision report                 │
        └──────────────────────────────────────┘
                ↓
        ┌──────────────────────────────────────┐
        │ TRIBE V2 — Brain Encoding Inference   │
        │                                       │
        │ Job: Run the same input video through │
        │      TRIBE V2 to produce per-second   │
        │      per-region brain-response data   │
        │      layer (~20K vertices on          │
        │      fsaverage5 mesh)                 │
        │                                       │
        │ Output: Brain-pattern target (TARGET) │
        │         + per-region activation JSON  │
        └──────────────────────────────────────┘
                ↓
        ┌──────────────────────────────────────┐
        │ STAGE 2 — Empathy Synthesis Agent     │
        │ Tool: Claude Opus (the depth          │
        │       synthesizer per Decision 008)   │
        │                                       │
        │ Inputs:                                │
        │   1. Vision report from Stage 1       │
        │   2. Brain-pattern data from TRIBE V2 │
        │   3. (Optional) any other data layers │
        │      Ironside's pipeline already has  │
        │                                       │
        │ Job: Generate an emotionally-          │
        │      intelligent paragraph describing │
        │      what the human felt during the   │
        │      footage, grounded in the         │
        │      brain-pattern + vision report    │
        │                                       │
        │ Output: Candidate paragraph #N        │
        └──────────────────────────────────────┘
                ↓
        ┌──────────────────────────────────────┐
        │ ITERATIVE SCORING LOOP                │
        │ (Clair de Lune protocol inverted)     │
        │                                       │
        │ For 8 rounds:                          │
        │   1. Score candidate paragraph by     │
        │      running it back through TRIBE V2 │
        │      (forward-direction text inference)│
        │   2. Compare candidate's predicted    │
        │      brain-pattern vs. TARGET         │
        │      brain-pattern from the video     │
        │   3. Cosine similarity = score        │
        │   4. If score plateaus or 8 rounds    │
        │      reached: stop                    │
        │   5. Otherwise: feed score + per-     │
        │      region miss back to Stage 2      │
        │      Empathy Synthesis Agent          │
        │   6. Stage 2 generates candidate #N+1 │
        └──────────────────────────────────────┘
                ↓
        ┌──────────────────────────────────────┐
        │ FALSIFICATION CHECK                   │
        │                                       │
        │ Score the same final paragraph        │
        │ against a CONTROL video (different    │
        │ worker / different task / different   │
        │ context). Similarity should DROP      │
        │ sharply, proving the paragraph is     │
        │ specifically anchored to the original │
        │ scene, not generically plausible.     │
        │                                       │
        │ Output: Falsification delta           │
        └──────────────────────────────────────┘
                ↓
[OUTPUT: Empathy-layer document for the boss]
        - Best-scoring paragraph (the empathy translation)
        - Final brain-pattern similarity score (e.g., 0.84)
        - Falsification delta (e.g., 0.27 against control)
        - Per-region attribution (which brain regions
          the paragraph captured well)
        - Vision report from Stage 1 (the action data
          context)
```

---

## §3. Why two-agent stages (Ironside's spatial-intelligence definition satisfied)

Per Johnny's office-hours conversation with the Ironside team:

> *"What spatial intelligence means to them is basically adding in another form of information that helps the model infer about the overall environment. Us just using the [TRIBE V2] model is enough for them to consider that spatial intelligence, as long as the classification — the swarm mapping of what this brain wave maps back to the video — is what they're looking for in terms of spatial intelligence."*

**Translated to build:** Ironside considers the pipeline spatial-intelligent if there is an explicit step where the agent maps the brain-wave back to the video. That mapping IS what we do in Stage 2 + the iterative scoring loop. The brain-pattern is a new modality (brain-wave); the mapping is the agent doing the work of integrating it into the vision-derived classification.

The two stages do this:
- **Stage 1** is the vision-classification step Ironside's existing pipeline already does (or analogous to it)
- **TRIBE V2** is the new modality (brain-wave data layer)
- **Stage 2** is the agent that maps the brain-wave back to the video by synthesizing the empathy-layer paragraph
- **Iterative scoring** is the falsification mechanism that proves the mapping is grounded

**This satisfies Ironside's "another form of information that helps the model infer about the overall environment" requirement structurally.** We are not bolting on TRIBE V2; we are using it as the in-between data layer whose mapping to the video is the agent's job.

---

## §4. Stack (build-time concrete)

| Component | Tool | Role |
|---|---|---|
| Stage 1 vision-classification agent | Gemini (via OpenRouter key) — Anthropic also has image processing if we prefer Claude vision | Describe the scene from the video; produce vision report |
| Brain encoding | TRIBE V2 inference (Junsoo's pipeline) | Run the same video through TRIBE V2 → per-second per-region brain-response data layer (the brain-wave TARGET) |
| Stage 2 empathy-synthesis agent | Claude Opus (per Decision 008 — Opus is the depth synthesizer) | Combine vision report + brain-pattern data + any other Ironside data layers → generate emotionally-intelligent paragraph candidates |
| Iterative scoring | TRIBE V2 forward-direction inference on text input | Score each candidate paragraph against the brain-pattern target; rank candidates; iterate until plateau or 8 rounds |
| Falsification check | TRIBE V2 forward-direction on the final paragraph against a CONTROL video's brain-pattern | Drop in similarity proves the paragraph is specifically anchored, not confabulated |
| K2 swarm | K2 Cerebras (~1,300 tok/s) | Powers the iterative loop — 8 rounds of generate + score in consumer-product latency only fits at K2 speed |
| Output rendering | Static document or live UI surface | The boss-facing empathy-layer document |

---

## §5. The output document — what the boss reads

**Format:** a single document the manager / decision-maker reads BEFORE making any productivity-cut or worker-evaluation decision. Three sections:

### Section 1 — Vision Report (what action data already shows)

Stage 1's Gemini-style scene description: *"Nurse entered patient room. Sat for 30 minutes. Adjusted IV. Held patient's hand. Left."*

(This is what the manager would have seen WITHOUT our pipeline.)

### Section 2 — Empathy Layer (what the human felt during the action)

Stage 2's Opus-synthesized paragraph, iteratively scored to match the brain-pattern target:

> *"She entered the room and her vital-attention signature shifted immediately — the prefrontal sharpness of triage softened into something quieter, more accommodating. For the first twelve minutes her emotional-processing specialist sustained engagement; she was reading the patient's grief, not just monitoring it. Then a long stretch of default-mode dominance — minutes 18 through 22 — the brain-signature of being present with someone, not waiting for them to finish. The final eight minutes returned to focused care, prefrontal-engaged, holding the patient's hand. She did not rush. She did not check out. She held space."*

### Section 3 — Falsification Evidence (proves the empathy layer is grounded)

> *"Brain-pattern similarity: 0.84. Falsification check (same nurse on routine vitals visit): 0.27 — confirming the description is specifically anchored to this scene's emotional reality."*

**The boss reads all three sections. Action data is preserved. Empathy layer adds context. Falsification evidence proves the context isn't confabulated. Decision becomes empathy-aware.**

---

## §6. Generalization across industries (your verbatim insight)

The same pipeline runs across any industry where humans take physical actions captured visually:

| Industry | Stage 1 vision report describes | Empathy layer reveals |
|---|---|---|
| **Construction** (Ironside primary) | *"Worker on scaffolding, holding tool"* | Whether the worker was focused, fatigued, mind-wandering, or in cognitive overload at the moment of the action |
| **Healthcare** (the office-hours example) | *"Nurse spent 30 min in patient room"* | Whether the time was care, distraction, or emotional engagement with a patient processing diagnosis |
| **Retail** | *"Rep at counter for 12 min"* | Whether engagement was fresh-presence or late-shift performed depletion |
| **Food service** | *"Line cook moved through orders"* | Whether the cook was in flow, sustained-stress, or cognitive overload during rush |
| **Logistics / warehouse** | *"Picker completed 47 picks per hour"* | Whether attention sustained or decayed across shift hours; mundanity-vs-engagement signature |
| **Education** | *"Teacher spent 8 min with one student"* | Whether the time produced a breakthrough moment or was administrative drag |
| **Emergency response** | *"EMT responded to scene"* | Cognitive-load + stress-response signatures during high-stakes decision moments |
| **Daily life / B2C** | *"User scrolled Reels for 30 min"* | What the algorithm did to the user's brain — same pipeline, applied to consumer footage as a daily journal |

**Same pipeline. Different input footage. Different beneficiary class (manager / company / user). Same hero output: empathy-layer paragraph + similarity score + falsification check.**

---

## §7. The Listen Labs simulation answer (per your verbatim)

> *"And then because we can do like this we can almost do it for all the other scenarios and simulate all the other industries and then that would be our listen labs."*

The Listen Labs deliverable IS the architecture itself, applied across multiple industry scenarios. Demonstrably:

1. The iterative-scoring loop IS a multi-agent simulation (8 candidate paragraphs competing across rounds)
2. Generalization across industries IS the demonstration that the simulation models humanity, not a single use case
3. The cosine similarity score IS the quantified-accuracy answer to Listen Labs's sixth question
4. Within-subject contrast (same person, same scene, paragraph scored against scene's own brain-pattern vs. control scene's brain-pattern) IS the falsification grounding Listen Labs explicitly asks for

**Same architecture wins both Ironside and Listen Labs.** The build doesn't fork.

---

## §8. The B2C version (your open question, sharpened)

You said the B2C surface is harder to ID. Per the empathy-layer architecture above, the B2C version is structurally simple:

**The user uploads or screen-records their own daily footage** (Reels-feed scroll, smart-glasses POV, phone-screen recording of any digital activity). The same two-stage pipeline runs. Output: an empathy-layer paragraph describing what the user felt during the footage, with similarity score.

**Daily entries accumulate into a journal** — your verbatim list (*"wellness, notes, life documentation, journaling"*) all map. The product positioning:

> *"A journal that writes itself, anchored to your brain. Today you scrolled Reels for 30 minutes. Here's what your brain actually felt during it. Save the entry. See the pattern across your week."*

This honors:
- **Sideshift** (consumer-grade tool for capturing your own data — your data, for you)
- **YC future-Obsidian** (your knowledge graph is the shape of your brain-grounded experience entries, not typed notes)
- **Best Use of AI YEA-rubric** (surfaces your own experience back to you; you judge what to do with it; system never recommends)

---

## §9. Build clarity — what each teammate ships

| Owner | What they build | Maps to pipeline stage |
|---|---|---|
| **Junsoo** | TRIBE V2 inference pipeline that ingests video → per-second per-region brain JSON; ALSO supports forward-direction text-input scoring (the iterative loop's scoring step) | Brain encoding + iterative scoring substrate |
| **Jacob** | K2 swarm orchestration for the iterative-scoring loop (8 rounds of Opus generate + TRIBE score; asyncio.Semaphore + Pydantic + retry per locked spec) + (optional) per-region specialist swarm if we keep that layer | Iterative loop orchestration |
| **Johnny** | Stage 1 vision-classification agent integration (Gemini via OpenRouter or Claude vision); Stage 2 Opus empathy-synthesis prompt engineering; integration glue across stages; demo runbook with per-component pre-cache fallbacks; UI rendering of the empathy-layer document | Stages 1 + 2 + integration + UI |
| **Emilie** | Demo footage selection (workplace footage that produces a visceral empathy-layer paragraph in the demo; consumer footage for B2C overlay); Wrapped-style document UI for the boss-facing output; sponsor swap-slides for Ironside / Listen Labs / Sideshift / YC; launch-video assembly | Output rendering + packaging |

---

## §10. Demo execution — what the 90 seconds shows

| Beat | Time | What plays |
|---|---|---|
| **BEAT-1** | 0:00–0:15 | Workplace footage (construction OR healthcare OR retail) plays alongside the Stage 1 vision-classification agent's output: *"worker / nurse / rep doing X for Y minutes"*. Action-data baseline shown. |
| **BEAT-2** | 0:15–0:35 | TRIBE V2 brain-encoding renders: 3D cortical mesh glowing in sync with the footage. The brain-wave data layer becomes visible as a new modality alongside the action data. Hover-bridges between regions show the per-region specialist activations. |
| **BEAT-3** | 0:35–1:00 | The iterative-scoring loop runs visibly: candidate paragraph #1 appears; similarity score 0.42; rewrites to candidate #2; score 0.58; rewrites; score 0.71; ... by round 8, score 0.84. The loop is the visual reveal — the judge watches the score climb. |
| **BEAT-4** | 1:00–1:25 | Final paragraph appears in full on screen. Voiceover reads it aloud. The empathy-layer document is the hero artifact. Similarity score 0.84 + falsification delta 0.27 displayed. |
| **BEAT-5** | 1:25–1:30 | Side-by-side: action-data report ("over 30 min threshold; cut to 10 min") vs. empathy-layer document ("she held space; brain-pattern grounded; falsified against control"). The decision-maker would make a different call. The corner doesn't get cut. |
| **BEAT-5 close** | off-timer | Sponsor swap-slide: *"Same pipeline runs across construction, healthcare, retail, food service, education, daily life. The empathy layer is the translation surface managers and users have been missing."* |

---

## §11. Forbidden-claim guardrails (non-negotiable)

- ❌ **No reverse inference.** The empathy-layer paragraph uses observational language: *"emotional-processing specialist sustained engagement"*, *"default-mode dominance suggests quiet co-presence"*. NEVER *"she felt grief"* or *"she felt distracted"*. The paragraph DESCRIBES; the reader INFERS.
- ❌ **No clinical claims.** *"Workforce-context augmentation, not psychological evaluation."* The empathy layer is a translation tool, not a diagnostic tool.
- ❌ **Within-subject contrast only.** Falsification check uses control footage from THE SAME person on a different task. Never population-norm comparison.
- ❌ **No inflated TRIBE numbers.** ~20K vertices on fsaverage5; ~25 trained subjects; 1Hz with 5s HRF lag.
- ❌ **The empathy-layer paragraph is anchored, not generated-from-nothing.** The similarity score IS the falsifier. If the score is low, we say so. If the falsification delta is small, we say so. Honest framing protects the product.

---

## §12. The line that goes on every sponsor swap-slide and the Devpost

> *"Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them."*

(Distilled from your verbatim: *"we should use AI to augment, like fix the behavior gap of like we can't treat humans like machines and so we need some layer that we can predict almost like what sort of paragraph can align with humans with what's actually happening."*)

---

## §13. Lock-in confirmations

Three things to confirm before the team moves:

1. **Two-agent-stage pipeline** (Stage 1 vision-classification + Stage 2 empathy-synthesis) with TRIBE V2 brain-encoding in between as the new modality + iterative scoring loop as the falsification mechanism. Yes / no / refine.

2. **The empathy-layer paragraph + similarity score + falsification delta** is the hero output (replacing the prior Wrapped-cards + Land card hero structure as the BEAT-4 deliverable). Yes / no / both.

3. **Per-industry generalization** is the Listen Labs simulation deliverable (same pipeline, different industry footage, demonstrates the engine simulates humanity across contexts). Yes / no / scope-cut.

Once locked, the team builds against this PRD; I update the canonical artifacts (`two-demo-scenarios.md`, `ironside.md`, `listenlabs-sideshift.md`, `prd-final.md`, `_bmad-output/.../prd.md`, `demo-script.md`, `video-story.md`) to reflect the simplified pipeline.

---

## §14. Cross-reference

- Strategic framing (the "why"): [`./empathy-layer-hero-output.md`](./empathy-layer-hero-output.md)
- Two-scenario contract: [`./two-demo-scenarios.md`](./two-demo-scenarios.md)
- Ironside use case detail: [`./ironside.md`](./ironside.md)
- Listen Labs / Sideshift use case detail: [`./listenlabs-sideshift.md`](./listenlabs-sideshift.md)
- Clair de Lune precedent (the protocol we invert): [`../research-context/007-johnny-public-corpus-tribe-posts.md`](../research-context/007-johnny-public-corpus-tribe-posts.md)
- Decision 008 (K2 = speed engine): [`../../research/wiki/decisions/008-k2-think-as-speed-engine.md`](../../research/wiki/decisions/008-k2-think-as-speed-engine.md)
- Decision 009 (Ironside pipeline mirror): [`../../research/wiki/decisions/009-ironside-pipeline-mirror.md`](../../research/wiki/decisions/009-ironside-pipeline-mirror.md)
