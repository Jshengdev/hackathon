---
title: "Use Case — Ironsight (Demo Scenario A: Workplace Footage Data Source)"
status: updated 2026-04-25 to reflect Ironsight/Listen Labs PRD rename + one-size-fits-all framing
sponsor: Ironsight (CORE — primary $5K target)
track_role: core (use-case LOCKED 2026-04-25)
demo_scenario: A (workplace footage data source — egocentric construction-worker video; generalizes to healthcare / retail / food-service / education / logistics / emergency-response)
companion_scenario: B (consumer day-to-day visual data — see `./listenlabs-sideshift.md`)
brief_structure: Define / Develop / Showcase (per Ironsight-provided brief)
canonical_prd: _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md
codename: Empathy Layer
one_size_fits_all_engine: |
  This document is one of two demo scenarios on the same overarching engine. Same
  TRIBE V2 + two-stage agent pipeline + iterative-scoring loop. Different data source
  (workplace footage). Different data-processing parameters (specialist roster weighted
  toward spatial / motor / threat / cognitive-load). Different beneficiary story
  (B2B manager-decision-aware; "for the worker, rendered humanity-aware for the buyer").
ladders_to: caltech/prd-final.md §6 Ironside swap-slide; _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md (canonical PRD — Ironsight + Listen Labs covered together); research/wiki/decisions/009-ironside-pipeline-mirror.md; caltech/use-cases/two-demo-scenarios.md (scenario contract)
companion_use_cases:
  - ./two-demo-scenarios.md (canonical two-scenario contract)
  - ./listenlabs-sideshift.md (Scenario B — consumer day-to-day)
  - ./empathy-layer-hero-output.md (strategic hero-output framing)
  - ./empathy-layer-prd-simplified.md (build-clarity simplified pipeline spec)
key_vocabulary:
  - "data layer" (TRIBE V2's per-second per-region brain-activation JSON — frames the engine as data-infrastructure Ironsight's pipeline can consume, not a competing pipeline)
  - "empathy layer" (the codename for the engine; the translation surface that converts action data into brain-grounded human-readable description)
  - "behavior gap" (the gap between treating workers as machines and workers actually being humans; what the engine fixes)
---

# Ironside Use Case — Demo Scenario A: Job-Site Data Layer

> **Canonical contract:** This is **Scenario A** of the two-demo-scenarios contract (see [`./two-demo-scenarios.md`](./two-demo-scenarios.md)). Same engine as Scenario B (consumer day-to-day visual data). Different input source: egocentric job-site video. Same TRIBE V2 + K2 swarm + Opus + 3D viz pipeline runs unchanged. We add the **data layer** Ironside's pixel-only pipeline lacks.
>
> Construction-worker egocentric video → TRIBE V2 brain encoding (the data layer) → K2 region-specialist swarm → per-action cognitive-emotional state report → grounded VLM augmentation.

## §1. Define a Problem (per Ironside ask 1)

### The spatial-intelligence failure mode

Current VLMs (Gemini 2.5 Pro / Claude Opus / GPT-5) given egocentric construction-worker footage cannot answer:

> *"Was this worker safely engaged or cognitively overloaded when they made this decision?"*

They describe what's in the frame (*"a worker holding a drill near scaffolding"*). They cannot infer the **cognitive-emotional state** that produced the spatial action. Pixel-only perception strips out:

- **Salience signal** — which spatial cue the worker actually attended to (vs. what's in frame)
- **Cognitive load signature** — was the worker focused, distracted, panicked, complacent
- **Threat-detection state** — did the worker SEE the hazard or just look in its direction
- **Decision quality marker** — was this action made under prefrontal engagement, or under amygdala-hijack stress

Trivial for humans (we read each other's cognitive state from posture + gaze + action-pacing constantly). VLMs fail because they have no model of the brain that produced the behavior.

### Test prompt that reveals the failure

Take a 30-second egocentric clip from a construction site. Ask the VLM:

> *"Rank the worker's cognitive-emotional state during this clip on (a) attention-allocation, (b) threat-detection engagement, (c) cognitive-load level, (d) decision-quality indicators. Justify each score with the specific cue that produced it."*

VLMs return generic narration with confabulated justifications. They cannot ground these scores in observable cues because they have no internal brain-response model.

### Why this matters for Ironside

Ironside's pipeline is Auto-Classifier → Narration → Observer-as-Judge (per Decision 009). Adding cognitive-emotional state as a derived modality means:
- **Auto-Classifier** flags "decision made under high cognitive load"
- **Narration** explains WHY the worker took the action
- **Observer-as-Judge** scores job-fit / training-depth / risk-classification empirically

## §2. Develop a Technique (per Ironside ask 2)

### Architecture (same engine; persona-switched input)

```
[INPUT]            Egocentric construction-worker video
   ↓
[BRAIN ENCODING]   TRIBE V2 inference @ 1Hz on fsaverage5 mesh
                   ~20,000-vertex per-second activation predictions
   ↓
[SWARM SPLIT]      K2 region-specialist agents:
                   • Visual-attention specialist
                   • Threat-detection specialist
                   • Spatial-mapping specialist
                   • Motor-planning specialist
                   • Salience-tracking specialist
                   • Prefrontal-engagement specialist (cognitive load proxy)
                   • Default-mode specialist (mind-wandering proxy)
                   • Stress-response specialist
   ↓
[CROSS-REGION]     2-pass cross-talk:
                   Round 1: each specialist outputs hypothesis
                   Round 2: re-evaluate given other specialists' outputs
                            ("threat-detection high but prefrontal low —
                             hazard the worker saw but didn't process")
   ↓
[OPUS SYNTHESIS]   Per-action cognitive-emotional state report:
                   { time_window, action, attention_score, threat_engagement,
                     cognitive_load, decision_quality, archetype_state,
                     supporting_specialist_evidence }
   ↓
[VLM AUGMENTATION] VLM gets video + per-second per-region activation JSON +
                   swarm specialist reasoning as structured grounding.
                   Now reasons over evidence, not over pixels.
   ↓
[OUTPUT]           • Job-fit signal per action
                   • Training-depth recommendation (regions under-engaged)
                   • Risk-classification signal (threat-detection without
                     prefrontal engagement = risky action)
```

### Why this technique fits Ironside's brief

The brief asks for: prompt engineering / fine-tuning / inference-time compute strategies / clever techniques.

This is an **inference-time compute strategy** (spatial-sidecar pattern, per `research/wiki/patterns/spatial-sidecar.md`) that adds a brain-encoding sidecar to the VLM:

- **Not fine-tuning** — TRIBE V2 stays as-is; VLM stays as-is
- **Not prompt-engineering alone** — augmenting the input modality
- **Inference-time augmentation** — runs alongside the VLM; structured grounding feeds the VLM's reasoning

### Falsification methodology (per Clair de Lune precedent)

Within-subject contrast: same worker, two different tasks (one routine, one novel). Show VLM-with-grounding produces different cognitive-state reports per task — and the difference matches what a construction safety manager would predict. Same falsification logic as the Clair de Lune work falsifying against control music.

### Forbidden-claim guardrails

- ❌ No reverse inference (use observational language: *"prefrontal-engagement specialist scored low; supporting cue: action timing pattern matches the prefrontal-disengagement signature in TRIBE training data"*)
- ❌ No clinical claims — *"workforce-safety augmentation, not psychological evaluation"*
- ❌ Within-subject contrast only — *"this worker on this task vs. this worker on another task"*
- ❌ ~20K vertices on fsaverage5; 1Hz; no inflated TRIBE numbers

## §3. Showcase the Impact (per Ironside ask 3)

### Real-world use case — site-safety augmentation

Construction safety manager reviews 50 hours of egocentric footage per worker per month. Cannot manually review. Uses VLM to surface clips warranting attention.

**Without our technique:** VLM flags "worker near scaffolding edge" — generic, high false-positive rate.

**With our technique:** VLM flags "worker near scaffolding edge with cognitive-load specialist score 0.87 (high) AND threat-detection specialist score 0.31 (low) — worker was overloaded and did not visually engage the hazard." Specific, actionable, auditable.

### Three measurable signals the technique unlocks

| Signal | Without | With |
|---|---|---|
| Job-fit per action | "Worker did the thing" | "Worker did the thing while their archetype-state matched (or didn't match) workers who execute this task safely" |
| Training-depth recommendation | "Worker should have more training" (vague) | "Spatial-mapping specialist consistently low across novel-environment tasks → training in environmental scanning would target the gap" |
| Risk-classification per moment | Frame-level hazard detection | State-grounded risk: "hazard present + threat-detection low + prefrontal disengaged = high-priority intervention moment" |

### What the demo shows in 90 seconds (Ironside-swap variant)

| Beat | What plays | Owner |
|---|---|---|
| BEAT-1 (0:00–0:15) | Egocentric construction-worker video split-screen with cortical mesh glowing in sync | Junsoo's TRIBE pipeline on construction footage |
| BEAT-2 (0:15–0:45) | K2 swarm specialist labels appear (threat-detection / spatial-mapping / prefrontal); hover-bridges show cross-talk; reasoning fragments flow | Jacob's K2 swarm rerun on construction brain JSON |
| BEAT-3 (0:45–1:15) | Within-subject toggle: same worker, routine task vs. novel task — visibly different brain-fire pattern; stress-response + cognitive-load specialists diverge | Junsoo's pre-baked side-by-side MP4 |
| BEAT-4 (1:15–1:30) | Per-action report card: decision quality index / training recommendations / risk-classification flag | Emilie + Johnny |
| BEAT-5 close | *"Egocentric video tells you what was done. Brain encoding tells you what state of mind it took to do it well. Same engine, ethos preserved — for the worker, not the surveiller."* | Locked verbatim per `prd-final.md` §7 |

## §4. Single-paragraph Ironside elevator pitch (Johnny voice)

> *"Current vision-language models can describe what a construction worker did in egocentric footage. They cannot tell you what cognitive-emotional state they were in when they did it. That's the **data layer** the pixel-only pipeline misses — and it's the data layer that turns 'worker near scaffolding edge' from generic noise into actionable intervention. We use Meta's TRIBE V2 brain-encoding model — same model that matched Clair de Lune's neural fingerprint to 90.4% in our prior work — to predict per-second neural response across 20,000 cortical points on the worker's egocentric footage. That per-second per-region prediction IS the data layer your pipeline can consume. We run a K2 swarm of region-specialist agents — visual-attention, threat-detection, prefrontal-engagement, stress-response — and let them cross-talk in 2 passes. Now when the VLM is asked 'was this worker safely engaged?' it reasons over per-region specialist evidence, not over pixels alone. Output: job-fit signal per action, training-depth recommendations grounded in which regions stayed under-engaged, risk-classification flagged at the moment cognitive load + threat-detection diverged. **Same engine that scans Gen-Z brains scrolling Reels — that's our other demo scenario, where this same data layer surfaces brainrot in real time.** Different input modality. Same architecture. Same ethos: surface what's invisible so the human in the loop can judge. Egocentric video tells you what was done. Brain encoding tells you what state of mind it took to do it well. We added the data layer to your pipeline. For the worker, not the surveiller."*

## §5. Hackathon-execution risks specific to Ironside swap

| Risk | Mitigation |
|---|---|
| TRIBE V2 OOD on construction footage (consumer-media trained; OOD degrades 0.32 → 0.17 per canonical reference) | Junsoo bakes side-by-side MP4 in advance using TRIBE-friendly footage approximating egocentric construction (POV documentary clips). Pre-cache mandatory for Ironside-swap. Live framing verbal-only. |
| VLM augmentation requires API integration | Pre-cache both VLM responses (with grounding / without grounding). Render side-by-side text comparison in BEAT-4 Ironside variant. |
| Construction-domain credibility | Lean on Junsoo's prior egocentric-video supervision pipeline work as credibility chip. *"Junsoo's prior research is what we ground this in; brain-encoding is the addition."* |
| "Surveillance vs. empowerment" optics | Lock *"for the worker, not the surveiller"* phrasing. Worker owns the data; safety augmentation is the worker's tool, not management's. |
| Best Use of AI YEA/NAY rubric across Ironside swap | Same rubric: surfaces options for worker; doesn't replace human judgment; menial high-throughput (50h footage scoring); synthesizes across signals. YEA-side throughout. |

## §6. Cross-references to locked artifacts

- `caltech/prd-final.md` §6 Ironside swap-slide (use case spec already locked)
- `_bmad-output/planning-artifacts/prd.md` §FR6 + Stream A (architecture locked)
- `caltech/tasks-by-person/junsoo-tribe-v2.md` (build owner assigned)
- `caltech/demo-script.md` BEAT-5 Ironside variant (demo execution scripted)
- `research/wiki/decisions/009-ironside-pipeline-mirror.md` (decision locked)
- `research/wiki/patterns/spatial-sidecar.md` (technique pattern locked)

**Net: no new locks needed.** This document just frames the Ironside use case in the brief's Define/Develop/Showcase structure for direct slot-into the BEAT-5 Ironside-swap close + Devpost section + Ironside-pavilion handout.
