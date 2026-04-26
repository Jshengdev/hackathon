---
title: "Ironsight / Listen Labs PRD — Brain-Grounded Empathy Engine (Caltech HackTech 2026)"
project_name: ironsight-listenlabs-prd
codename: empathy layer
prior_filename: empathy-layer-prd.md (renamed 2026-04-25 to ironsight-listenlabs-prd.md per user direction)
author: Johnnysheng (PM/Integration), Junsoo Kim (TRIBE V2), Jacob Cho (K2 swarm + iterative loop), Emilie Duran (Packaging + UI)
date: 2026-04-25
version: 2.0 (post-TRIBE-cut + swarm-loop merged + Opus-as-Stage-4-polish — strategic narrative re-aligned with technical PRD v2.1)
v2_changelog: |
  2026-04-25 evening — R-DOCS shard. The v1 strategic narrative described a
  two-stage agent pipeline with runtime TRIBE V2 forward + reverse and Opus 4.7 as
  the Stage-2 synthesizer. The v2 architecture (canonicalized in
  ../planning-artifacts/ironsight-listenlabs-technical-prd.md §3 + §4 and
  ../../caltech/NEW-ARCHITECTURE.md) ships:
    - Pre-rendered TRIBE V2 ONLY — `backend/prerendered/<clip>/activity.json` is
      the brain artifact; runtime TRIBE never runs in any direction.
    - K2 plays three roles on one surface: Stage 1B specialists × 7, Stage 2
      moderator × 1, Stage 3 evaluator swarm × 7 per iterative-loop round.
      Swarm + iterative loop are merged.
    - Stage 4 Opus 4.7 polish is gated, optional, post-loop, cut-line. Implemented
      as `services/empathy_polish.py` behind `OPUS_POLISH=1`.
    - Stage 5 falsification uses a sentence-transformer embedding proxy
      (all-MiniLM-L6-v2 → 7-dim Yeo7 projection W) standing in for runtime TRIBE
      forward. Real cosine numbers, CPU-only, ≤200ms.
    - SAME ENGINE answers Ironsight + Listen Labs + Sideshift + YC. Sponsor-pitch
      alignment paragraphs in §3 are rewritten to reflect "swarm gives the video
      info Ironsight didn't have" + "modular Opus polish + persona shell ships
      scenario-appropriate output for Listen Labs."
  Removed: prose blocks naming TRIBE-forward as the per-round scorer or Opus as
  Stage 2. Old prose archived to ./archive/strategic-prd-v1-sections.md (per
  preservation discipline, R-DOCS shard rules).
workflowType: prd
releaseMode: single-release
freeze: 2026-04-26 8 PM PDT
submit: 2026-04-26 11 PM PDT
hardDeadline: 2026-04-27 9 AM PDT


 ironside_prompt_we_are_solving: |
  "Can you teach a machine to truly understand the physical world? Today's AI can see,
  but doesn't comprehend. It recognizes objects but misses the critical spatial
  relationship that humans understand intuitively. Pinpoint a key spatial task where
  current models fail. Develop an innovative technique. Showcase the impact on a
  real-world problem."
  — Ironsight HackTech 2026 spatial intelligence brief (36-hour hackathon)

listen_labs_prompt_we_are_solving: |
  "Can you simulate how humans really think? Humans don't just process information —
  they argue, persuade, change their minds, and influence each other in complex,
  unpredictable ways. Today's AI can mimic language, but can it model the messy reality
  of human cognition and social dynamics? Pick any slice of human or social behavior
  and simulate it. Use LLMs, agent frameworks, game theory, network simulations, or
  anything else you can get your hands on. We care about the insight, not the stack."
  — Listen Labs "Simulate Humanity" challenge, HackTech 2026

one_size_fits_all_problem_statement: |
  Today's AI can describe what humans did and parse what humans said — but it cannot
  model the cognitive-emotional state underneath. The cognitive state that produced
  the spatial action (Ironsight's gap). The cognitive shift that produced the verbal
  agreement (Listen Labs's gap). Same underlying gap at different layers. Same
  failure mode: AI processes the surface but misses the model of the human underneath.

one_size_fits_all_solution_statement: |
  A brain-grounded empathy translation engine. The engine takes a video, looks up
  Meta TRIBE V2's brain-pattern JSON (pre-rendered offline; runtime TRIBE never runs),
  describes the scene with Qwen3-VL, fires a K2 swarm of seven Yeo7-network
  specialists to read the brain pattern, hands both to a K2 moderator that writes
  one candidate empathy paragraph, then iteratively rewrites and re-scores each
  candidate by re-firing the K2 swarm as evaluators (each region rates how
  faithfully the paragraph captured its reading) across up to eight rounds with
  plateau exit, optionally polishes the best paragraph with Anthropic Claude Opus
  4.7 as a ~100-word literary pass (cut-line cherry, gated `OPUS_POLISH=1`), and
  falsifies the result via a sentence-transformer embedding proxy that stands in
  for runtime TRIBE-V2-forward inference and produces a real cosine similarity number
  against the activity target plus a control delta. The output is a falsifiable
  paragraph describing what the human felt during the captured video. Same engine
  runs across workplace footage (Ironsight's job-site data) and consumer
  day-to-day visual data (Reels-feed / smart-glasses POV / any consumer visual
  data). Different data sources, same engine binary; pre-cached for demo-day
  reliability.

scope: |
  This PRD covers the one-size-fits-all engine that satisfies BOTH Ironsight's spatial-
  intelligence brief AND Listen Labs's "Simulate Humanity" brief. The engine is a single
  AI pipeline: pre-rendered TRIBE V2 activity.json on disk + Qwen3-VL vision report +
  K2 swarm of seven Yeo7-network specialists + K2 moderator synthesis + K2-swarm-as-
  evaluator iterative loop with plateau exit + optional Anthropic Opus 4.7 literary
  polish (cut-line, gated `OPUS_POLISH=1`) + sentence-transformer embedding-proxy
  falsification. Brain-encoded TRIBE V2 is pre-rendered offline; the runtime never
  invokes TRIBE in any direction. Authoritative engineering spec is the technical PRD
  v2.1 (../planning-artifacts/ironsight-listenlabs-technical-prd.md §3 + §4); canonical
  summary is ../../caltech/NEW-ARCHITECTURE.md.

  The engine ships across two demo scenarios with different data sources (workplace
  footage for Ironsight; consumer day-to-day visual data for Sideshift + YC overlay),
  different scenario tagging via `scenario.json` + `PersonaShell` mode (workplace /
  consumer / pavilion), and different stories (B2B manager-decision-aware vs. B2C
  consumer self-knowledge journal). The engine binary is one across both.

  COMPANION FILES:
  - caltech/use-cases/empathy-layer-prd-simplified.md (build-clarity simplified version)
  - caltech/use-cases/empathy-layer-hero-output.md (strategic positioning)
  - caltech/use-cases/two-demo-scenarios.md (canonical scenario contract)
  - caltech/use-cases/ironside.md (Scenario A — workplace footage)
  - caltech/use-cases/listenlabs-sideshift.md (Scenario B — consumer)
  - caltech/use-cases/yc-partner-stress-test.md (defensibility evaluation)
  - caltech/use-cases/outsider-advantage-check.md (founder-market-fit honest reframe)
  - caltech/video-story.md (3-min Round 2 launch video)
  - caltech/demo-script.md (90s on-stage execution)

classification:
  projectType: web_app_demo (real-time AI pipeline; merged K2 swarm + iterative loop on pre-rendered TRIBE V2 brain-encoding sidecar; optional Opus polish; browser-based Vue 3 + Three.js demo)
  domain: ai_neuroscience_workforce_consumer (Best Use of AI hard target; Creativity; Listen Labs; Sideshift; Ironside; YC stretch)
  complexity: high
  projectContext: greenfield (48 person-hour build window; brownfield team-context: 16 locked decisions, full PRFAQ + prior PRD + use-case docs)

target_tracks:
  - Best Use of AI (HARD TARGET — YEA/NAY rubric enacted by architecture)
  - Ironside (CORE — primary $5K target; spatial-intelligence definition satisfied via brain-wave-to-video mapping)
  - Listen Labs (CORE — $3K + interview; six-question rubric answered structurally; iterative loop IS the simulation)
  - Sideshift (CORE — vault substrate for B2C overlay)
  - K2 / IFM (CORE — speed required for 8-round iterative loop in consumer-product latency)
  - Creativity (DEFINITE — 3D cortical viz + iterative-loop reveal + brain-grounded paragraph as art-meets-rigor)
  - YC (STRETCH — future-Obsidian framing for B2C daily-journal accumulation)

inputDocuments:
  - caltech/PRD-INPUT-BUNDLE.md
  - caltech/prd-final.md
  - caltech/prd.md (draft v1)
  - caltech/prfaq.md
  - caltech/demo-script.md
  - caltech/narration-script-3min.md
  - caltech/video-story.md
  - caltech/CONSOLIDATION-REPORT.md
  - caltech/use-cases/two-demo-scenarios.md
  - caltech/use-cases/ironside.md
  - caltech/use-cases/listenlabs-sideshift.md
  - caltech/use-cases/empathy-layer-hero-output.md
  - caltech/use-cases/empathy-layer-prd-simplified.md
  - caltech/use-cases/yc-partner-stress-test.md
  - caltech/use-cases/outsider-advantage-check.md
  - caltech/validation-findings/2026-04-25-capability-inventory-summary.md
  - caltech/validation-findings/2026-04-25-treehacks-pattern-search.md
  - caltech/research-context/007-johnny-public-corpus-tribe-posts.md (Clair de Lune + 77-mental-models corpus)
  - caltech/research-context/004-spotify-wrapped-as-format.md
  - caltech/research-context/005-bereal-as-anti-curation-pattern.md
  - caltech/research-context/008-devpost-exemplars-mindpad-terralink.md
  - caltech/tasks-by-person/junsoo-tribe-v2.md
  - caltech/tasks-by-person/jacob-agent-swarms.md
  - caltech/tasks-by-person/johnny-orchestration.md
  - caltech/tasks-by-person/emilie-storytelling-research.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md
  - research/wiki/decisions/006-tribe-v2-as-special-mode.md
  - research/wiki/decisions/007-agent-swarms-as-coordination-pattern.md
  - research/wiki/decisions/008-k2-think-as-speed-engine.md
  - research/wiki/decisions/009-ironside-pipeline-mirror.md
  - research/wiki/decisions/010-b2c-primary-b2b-overlay-positioning.md
  - research/wiki/patterns/spatial-sidecar.md
  - research/wiki/patterns/grounded-citation.md
  - research/wiki/patterns/two-stage-llm-compile.md
  - research/wiki/patterns/witnessed-dissent.md

stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish

new_vocabulary_locked:
  - "empathy layer" — the translation surface that converts action data into brain-grounded human-readable description
  - "behavior gap" — the gap between treating humans as machines and humans actually being humans; what the empathy layer fixes
  - "empathy layer translation" — the verb form (running the layer on workplace or consumer footage)
  - "brainrot" — Gen-Z user-facing term for algorithmic neural convergence (B2C consumer-facing)
  - "algorithm breaking out argument" — user-facing term for SynthDebate-style output (B2C)
  - "data layer" — TRIBE V2 brain-encoded JSON as data-infrastructure noun
  - "empathy-layer document" — the boss-facing 3-section output (vision report + empathy paragraph + falsification evidence)

verbatim_yaps_captured_this_session:
  - "Humans are not machines, so we should use AI to augment, like fix the behavior gap of, like, we can't treat humans like machines and so we need some layer that we can predict almost like what sort of paragraph can align with humans with what's actually happening." (Johnny epiphany)
  - "What spatial intelligence means to them is basically adding in another form of information that helps the model infer about the overall environment. Us just using the [TRIBE V2] model is enough for them to consider that spatial intelligence, as long as the classification — the swarm mapping of what this brain wave maps back to the video — is what they're looking for." (Johnny post-Ironside-office-hours)
  - "Manipulation only works in the dark. What happens to the internet when the lights come on?" (Johnny published TRIBE V1 thesis)
  - "The fundamental problem is that we have an issue with how vision can be processed. As in like you describe a scene, right? Like you would just describe somebody hitting something with a hammer, but through tech, you can't communicate it. Like there's no real way to communicate how you felt or inaction." (Johnny office-hours epiphany)
  - "Your superior doesn't give a damn that the patient has cancer and is dying and was asking why did you take 30 minutes to do this task." (Johnny healthcare scenario)
  - "Productivity cannot be cut there because you've got to give your patients time to process the information." (Johnny empathy-business-case)
  - "It's almost like another way of translating like deliverables, like getting more confidence about the service, situation with the empathy layer so it's not just a straight did you do your job or did you not do your job. It's how did you do your job." (Johnny empathy-layer naming)
  - "Two demo scenarios we are going to have be inputs, are the ironsite one which is tracking the data layer for videos from the job site, and then on the other end, its going to be processing visual data from a consumers day to day life. something more human tasks like the scrolling and brainrot and the algorithm breaking out argument." (Johnny two-scenarios contract)
  - "We can almost do it for all the other scenarios and simulate all the other industries and then that would be our listen labs." (Johnny generalization insight)
  - "Same engine that scans Gen-Z brains responding to Reels — that's our other demo scenario." (Johnny cross-scenario coherence)
---

# Ironsight / Listen Labs PRD — Brain-Grounded Empathy Engine

**Author:** Johnny Sheng (PM/Integration), Junsoo Kim (TRIBE V2), Jacob Cho (K2 swarm + iterative loop), Emilie Duran (Packaging + UI)
**Date:** 2026-04-25
**Codename:** Empathy Layer

> **The product is one engine that satisfies both the Ironsight spatial-intelligence brief AND the Listen Labs "Simulate Humanity" brief. One-size-fits-all problem statement, one-size-fits-all solution statement, with different data sets per scenario, different data-processing parameters per scenario, and different stories per beneficiary. The overarching engine is unchanged.**

## The Two Sponsor Briefs This PRD Solves

> *"Can you teach a machine to truly understand the physical world? Today's AI can see, but doesn't comprehend. It recognizes objects but misses the critical spatial relationship that humans understand intuitively. Pinpoint a key spatial task where current models fail. Develop an innovative technique. Showcase the impact on a real-world problem."*
> — **Ironsight** HackTech 2026 spatial-intelligence brief (36-hour hackathon)

> *"Can you simulate how humans really think? Humans don't just process information — they argue, persuade, change their minds, and influence each other in complex, unpredictable ways. Today's AI can mimic language, but can it model the messy reality of human cognition and social dynamics? Pick any slice of human or social behavior and simulate it. Use LLMs, agent frameworks, game theory, network simulations, or anything else you can get your hands on. We care about the insight, not the stack."*
> — **Listen Labs** "Simulate Humanity" challenge, HackTech 2026

## One-Size-Fits-All Problem Statement

**Today's AI can describe what humans did and parse what humans said — but it cannot model the cognitive-emotional state underneath.** The cognitive state that produced the spatial action (Ironsight's gap). The cognitive shift that produced the verbal agreement (Listen Labs's gap). Same underlying gap at different layers. Same failure mode: AI processes the surface but misses the model of the human underneath.

## One-Size-Fits-All Solution Statement

**A brain-grounded empathy translation engine — three K2 roles on one surface, with TRIBE V2 as a pre-rendered data layer and Opus 4.7 reserved for an optional Stage-4 literary polish.** A K2 swarm reads each brain region's pre-rendered activations and emits per-region readings; a K2 moderator synthesizes one candidate empathy paragraph from the readings and the vision report; a K2 evaluator-swarm re-scores the candidate region-by-region across up to eight rounds with plateau exit; the best paragraph is optionally polished by Anthropic Claude Opus 4.7 (cut-line cherry, gated `OPUS_POLISH=1`); a sentence-transformer embedding proxy produces real cosine numbers against the activity target plus a control delta as the falsifier. Same engine runs on multiple data sources. Different data sets per scenario. Different persona shell + scenario hint per scenario. **Same overarching engine.**

## How the Engine Satisfies Both Briefs Simultaneously

| Sponsor brief asks for | How this engine answers (v2) |
|---|---|
| **Ironsight: define a spatial task where VLMs fail** | VLMs cannot infer cognitive-emotional state from spatial action. We test this with the API-credited models — they confabulate when asked to rank cognitive state from egocentric footage. |
| **Ironsight: develop an innovative technique** | Inference-time compute strategy. Spatial-sidecar pattern. The K2 swarm reads pre-rendered TRIBE V2 brain activations and gives the VLM the per-region cognitive context the egocentric video alone doesn't carry — which Ironsight's team explicitly defined as qualifying spatial intelligence. **The swarm gives the video the information it didn't have before; that's the spatial-sidecar.** |
| **Ironsight: showcase real-world impact** | Construction safety manager reads the empathy-layer document instead of action data alone; the corner-cut doesn't happen; the worker is treated as a human. Generalizes to healthcare / retail / food-service / education / logistics / emergency-response. |
| **Listen Labs: simulate humans / societies** | The merged swarm + iterative-scoring loop IS the multi-agent simulation — seven K2 specialists fire INSIDE each round, the moderator rewrites, evaluators rescore, plateau exit. Per-industry generalization (different `scenario.json` + `PersonaShell` mode) IS the demonstration of simulation across humanity. |
| **Listen Labs: care about insight, not stack** | Insight: brain-grounding distinguishes genuine cognitive-emotional state from confabulated VLM narration. No text-only sim can do this. **Modular Opus polish + per-scenario PersonaShell** lets the same simulation render scenario-appropriate output (workplace / consumer / pavilion) without rewiring the moderator — Listen Labs's "next-generation synthetic-profile use case." |
| **Listen Labs: ground in data, measure against something real** | Within-subject brain contrast. Same person, two scenes — candidate paragraph's projected 7-dim Yeo7 vector vs. the same person's pre-rendered activity target vs. the same person's control activity. Real cosine numbers from the embedding proxy (no runtime TRIBE-V2-forward in v2; the falsification methodology is preserved, the scorer is swapped). Same Clair-de-Lune-protocol shape; live execution path is `services/falsification.py`. |

**Two sponsor briefs answered by one engine.** The engine doesn't fork. The data-set forks. The persona shell forks. The story forks. The engine is one.

---

## Executive Summary

### The Vision

We are building a **brain-grounded empathy translation engine** — a single AI pipeline that takes any video of a human taking actions, looks up Meta FAIR's TRIBE V2 brain-pattern JSON for that clip (~20,000 cortical vertices on the fsaverage5 mesh; pre-rendered offline; runtime TRIBE never runs), describes the scene with Qwen3-VL, fires a K2 swarm of seven Yeo7-network specialists to read per-region activations, hands both to a K2 moderator that drafts an empathy paragraph, then iteratively re-scores each candidate by re-firing the K2 swarm as evaluators across up to eight rounds with plateau exit, optionally polishes the best paragraph with Anthropic Claude Opus 4.7 as a ~100-word literary pass (cut-line cherry, gated `OPUS_POLISH=1`), and falsifies the result via a sentence-transformer embedding proxy that stands in for runtime TRIBE-V2-forward inference. The output is a paragraph anchored to brain-pattern evidence with a similarity number that proves the description is grounded — and a control delta that demonstrates the description is specifically anchored to that scene, not generically plausible.

The mechanism inherits the methodology from Johnny's published prior work: in the original Clair de Lune experiment, TRIBE V2 was used forward — text candidate paragraphs were iteratively scored against the brain-pattern of Clair de Lune music, producing a paragraph that achieved 90.4% emotion-center match across 20,484 cortical vertices (falsified against triumphant music, rain, and aggressive speech — pattern only matched Clair de Lune). The empathy layer inverts the protocol: instead of generating text to match a target brain-pattern, the engine uses the brain-pattern of an actual video to score candidate paragraphs describing what the human felt. v2 swaps the per-round scorer (runtime TRIBE-V2-forward → K2-evaluator-swarm semantic scoring) and the falsification scorer (runtime TRIBE-V2-forward → embedding proxy with a 384×7 Yeo7 projection W) — same Clair-de-Lune protocol shape; different production-path scorers chosen for demo-day reliability.

The product's beneficiaries are **decision-makers (managers, companies, individuals) who would otherwise read action data alone and make corner-cutting decisions that destroy the outcomes they actually care about.** A nurse who spent 30 minutes with a patient processing terminal diagnosis. A construction worker who took 45 minutes on a task because they were navigating a hazard the manager couldn't see. A retail rep who extended a customer interaction because they were de-escalating distress. Action data flags these as productivity outliers; the empathy layer reveals they are care, judgment, and de-escalation — outcomes the company actually wants to preserve. The empathy layer surfaces the human context action data strips out.

### What Makes This Special

**Five structural moves that distinguish this product from any incumbent in workforce analytics, consumer wellness apps, vision-language model augmentation, or multi-agent simulation:**

1. **Direct reuse of a shipped credibility chip.** Johnny's published TRIBE V2 work (Clair de Lune 90.4% match across 20,484 cortical vertices, 8 rounds of iterative scoring, falsified against control music) IS the methodology this product runs in inverse. The mechanism is not theoretical; it has shipped at brain-encoding fidelity in a different direction. **Founder-market-fit and methodology-credibility chip become the same thing.**

2. **Spatial-sidecar pattern with K2 swarm reading pre-rendered TRIBE activations.** Per the Ironsight team's spatial-intelligence definition (clarified in their open office hours): adding another form of information that helps the model infer about the environment qualifies as spatial intelligence, as long as the agent maps the new modality back to the video. Stage 1A (Qwen3-VL) describes the scene; pre-rendered TRIBE V2 emits the new modality (per-second per-region brain-encoded activations on disk); Stage 1B's K2 swarm of seven Yeo7-network specialists reads those activations and emits per-region semantic readings; the K2 moderator (Stage 2) braids the readings + the vision report into a paragraph that maps the cognitive context back to the video. **The swarm gives the video the information it didn't have before** — that's the spatial-sidecar.

3. **Falsification methodology grounded in within-subject brain contrast.** The similarity number IS the falsifier (cosine similarity of the candidate paragraph's projected 7-dim Yeo7 vector vs. the same person's pre-rendered activity target). The falsification check (same paragraph scored against the same person's control-clip activity) drops similarity sharply, proving the description is specifically anchored. Same logic as the original Clair de Lune work falsifying against control music. v2 swaps runtime TRIBE-V2-forward for the embedding proxy (`all-MiniLM-L6-v2 → 384×7 Yeo7 projection W`); the protocol shape is preserved.

4. **One engine, two demo scenarios, one hero output.** The engine generalizes across any video of human action: workplace footage (Ironsight primary), consumer day-to-day footage (Sideshift + YC overlay). Both scenarios produce the same hero output — the empathy-layer document — with persona-appropriate framing. Multi-track sponsor coverage (Best AI + Ironsight + Listen Labs + Sideshift + K2 + Creativity + YC) is structurally MECE because the engine is general; the input file is the persona switch.

5. **The architecture itself enacts the YEA/NAY rubric.** Best Use of AI track answer is the rubric; the empathy layer enacts it: surface options (the paragraph), user judges (the manager / consumer reads and decides), system never recommends, menial high-throughput work via K2 swarm + iterative loop, synthesizes across signals (vision + brain-encoding + language). The product is the answer to the track question.

### The Headline Insight (Johnny verbatim, distilled)

> **Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.**

## Project Classification

- **Project Type:** Web app + real-time AI pipeline. Front-end is browser-based 3D visualization (Vue 3 + Three.js) + empathy-layer document UI. Back-end (v2) is a FastAPI surface that orchestrates pre-rendered TRIBE V2 activity.json + Stage 1A vision-classification (Qwen3-VL via OpenRouter) + Stage 1B K2 swarm of seven Yeo7-network specialists + Stage 2 K2 moderator synthesis + Stage 3 K2-swarm-as-evaluator iterative loop (plateau exit) + Stage 4 optional Anthropic Opus 4.7 polish (gated `OPUS_POLISH=1`) + Stage 5 sentence-transformer embedding-proxy falsification. A `BackgroundTask` warmup pipeline pre-bakes every Layer 1 cache file on `/demo/match` so brain-3D interactions never block on a runtime LLM call. Live-with-pre-cache fallback is the operating mode for demo-day reliability.
- **Domain:** AI / Neuroscience / Workforce Analytics / Consumer (multi-track sponsor coverage). Best Use of AI is the hard target; Ironside is the primary B2B target ($5K + spatial-intelligence definition explicitly satisfied); Listen Labs is the simulation surface ($3K + interview); Sideshift + YC are B2C overlay (vault + future-Obsidian); K2 is structurally required (8-round loop in consumer latency); Creativity comes from the iterative-loop reveal + 3D viz + brain-grounded paragraph as art.
- **Complexity:** High. (1) Brain-encoding model integration with forbidden-claim guardrails (no reverse inference, ~20K vertices canonical, within-subject contrast only). (2) Two-stage agent pipeline with iterative-scoring loop requires bidirectional TRIBE V2 inference (forward for scoring + reverse for video brain-encoding). (3) Multi-track sponsor strategy requires one product surface enact multiple distinct sponsor narratives with measurable architectural fit. (4) Live AI pipeline on stage with 90-second budget under hostile-judge scrutiny requires both live-attempt AND per-component pre-cache fallbacks orchestrated under freeze.
- **Project Context:** Greenfield from a code standpoint (build window opens at hackathon start; budget ~48 person-hours). Brownfield from a planning standpoint — 16 locked decisions, PRFAQ Stage 1, prior PRD draft v1, demo-script.md, narration-script-3min.md, validation-findings × 5, 4 prior use-case docs (ironside, listenlabs-sideshift, yc-stress-test, outsider-advantage), capability-inventory with SynthDebate recommendation, all extant and feeding this PRD.

## Two-Demo-Scenarios Contract

| Scenario | Input source | Persona | Beneficiary | Sponsor closes hit | Demo role |
|---|---|---|---|---|---|
| **A — Workplace Footage** | Egocentric body-cam / job-site video / patient-room footage / retail floor cam / kitchen cam / classroom recording / any workplace human-action video | Manager / company / decision-maker reviewing worker performance | The worker (gets context-aware management) + the company (preserves customer/employee outcomes that action-data-only optimization would destroy) | Ironside (CORE) + Listen Labs (CORE — generalization across industries IS the simulation deliverable) | Primary live demo (90s); Ironside pavilion swap-in for construction-specific footage |
| **B — Consumer Day-to-Day Visual Data** | Reels/TikTok feed screen-recording / phone screen-record of any digital activity / smart-glasses POV / daily-life clip | Maya, Gen-Z teen (or any consumer) | The user themselves (gets a brain-grounded journal of their own experience; daily entries accumulate into knowledge graph) | Sideshift (CORE substrate) + YC stretch (future-Obsidian framing) | Secondary overlay; consumer-track pavilion swap |

**Same engine. Same pre-rendered TRIBE V2 activity.json + Qwen vision pass + K2 three-roles (specialists / moderator / evaluators) + iterative loop + optional Opus polish + embedding-proxy falsification. Different input file. Different beneficiary. Different framing.**

---

## Success Criteria

### User Success

The user (judge / manager / consumer) succeeds when, in order:

1. **They recognize the surface.** Workplace footage or consumer feed plays alongside the cortical mesh — recognizable, neuroscience-credible, unmistakable. No explanation needed.
2. **They feel awe at the cortical-vertex density.** ~20,000 vertices on fsaverage5 visibly rendered at ≥30 FPS conveys vastness. The brain feels like a brain, not a stylized cartoon.
3. **They watch the iterative-scoring loop reveal itself.** Round 1 candidate paragraph: similarity 0.42. Round 2: 0.58. Round 3: 0.65. Round 5: 0.71. Round 8: 0.84. **The score climbing IS the satisfying reveal.** The judge experiences the engine improving its understanding in real time.
4. **They read the final empathy-layer paragraph.** A human-readable description of what the worker / consumer felt during the footage, anchored to brain-pattern evidence. Not a stress chart. Not an action sequence. A paragraph that reads like a human reading another human.
5. **They see the falsification evidence.** Similarity score (0.84) + falsification delta (0.27 against control footage). The paragraph is grounded, not confabulated.
6. **They see the corner-cut decision change.** Side-by-side: action-data-only report vs. empathy-layer document. The decision-maker would make a different call.
7. **They walk away with the paragraph.** Empathy-layer document is the takeaway artifact — exportable, shareable, defensible.

### Business Success

- **Best Use of AI track win (HARD TARGET).** Validation: the YEA/NAY rubric is mentioned by judges; the architecture is recognized as the answer to the track question.
- **Ironside CORE track win ($5K).** Validation: spatial-intelligence definition satisfied via Stage 2 brain-wave-to-video mapping; judges from Ironside team (Keenan, Vidyali, Luca, David, Jeffrey) recognize the technique.
- **Listen Labs CORE track win ($3K + interview).** Validation: six-question rubric answered structurally; iterative-scoring loop recognized as the multi-agent simulation; per-industry generalization recognized as the demonstration.
- **Sideshift CORE track win.** Validation: B2C overlay's vault frame + Brain Card export + daily journal aggregation recognized as consumer-data-agency surface.
- **K2 / IFM CORE track win.** Validation: 8-round iterative loop fits consumer latency only at K2 speed; judges recognize speed as architectural-required.
- **Creativity track win.** Validation: 3D cortical viz + iterative-loop reveal + brain-grounded paragraph mentioned in scoring.
- **YC stretch (named target).** Validation: future-Obsidian framing for B2C journal recognized; founder-market-fit (Clair de Lune protocol reused) recognized.
- **Career-narrative wins per Decision 003 lane locks.** Junsoo's TRIBE+forward-direction work is publishable; Jacob's K2-iterative-loop is the production-pattern resume narrative; Johnny's two-stage-agent orchestration is methodology demo; Emilie's launch-video and packaging quality bar is *"pass the startup test."*

### Technical Success

- **TRIBE V2 inference latency on demo GPU** for a 30-second clip: < 30 seconds on Friday-night smoke test #1.
- **TRIBE V2 forward-direction text inference** for the iterative-scoring loop: ≤ 2 seconds per candidate paragraph on demo GPU. (8 candidates × 2s = 16s within 90s budget.)
- **K2 swarm load test:** 10 concurrent specialist calls in a 30-second window with zero timeouts on Friday-night smoke test #2.
- **Stage 1 vision-classification latency:** ≤ 10 seconds for a 30-second clip via Gemini or Claude vision API.
- **Stage 2 empathy-synthesis per round:** ≤ 5 seconds per candidate paragraph via Claude Opus.
- **Iterative-loop convergence:** by round 8, similarity score ≥ 0.75 on test workplace footage (Junsoo bakes test asset Saturday morning).
- **Falsification check effectiveness:** same paragraph scored against control footage drops similarity ≥ 0.40 (proves anchoring).
- **3D rendering FPS on demo laptop:** ≥ 30 FPS for fsaverage5 mesh + iterative-loop visualization overlay.
- **Wi-Fi contingency:** full demo runs on phone hotspot with zero API timeouts.
- **Demo determinism:** 2 back-to-back runs on the same input show < 5% variance in final paragraph (temp=0, lock seeds, pre-record fallback).
- **Pre-cache assembly test (Saturday 6 PM):** Emilie runs entire 90s using only pre-recorded assets. Pass = live is bonus.

### Measurable Outcomes

- **Hard demo-day metric.** 4/4 emotional beats (Recognition / Awe / Surprise / Pride+Comfort) land in 90s on a sample-of-3 informal smoke test Friday night.
- **Hard sponsor metric.** ≥ 5 of 7 targeted sponsor tracks score the project in their top 3.
- **Founder-credibility metric.** Clair de Lune precedent named verbatim in Round 2 narration OR FAQ ammunition during judging; iterative-loop protocol recognized as direct reuse.
- **Iterative-loop reveal metric.** Judge audibly reacts to score climbing during BEAT-3 (informal Friday-night rehearsal threshold).
- **Empathy-layer paragraph quality.** Final paragraph reads as literature-grade prose AND honors all forbidden-claim guardrails (no reverse inference, no clinical claims, observational language only).
- **Engineering-budget metric.** Total person-hours consumed ≤ 48 (Decision 016).
- **Submission metric.** Devpost submission complete by Saturday 11 PM PDT (10h buffer to Sunday 9 AM hard deadline).

---

## Product Scope

### Single-release Scope (hackathon submission Saturday 11 PM PDT)

**A. The Engine (the product backbone)**

1. **Stage 1 — Vision Classification Agent** (Johnny owns integration; Gemini via OpenRouter API or Claude vision API). Input: video file. Output: vision-report JSON describing the scene (actions / environment / tools / temporal sequence / spatial relationships).
2. **TRIBE V2 Brain Encoding** (Junsoo owns). Input: same video file. Output: per-second per-region brain-response data layer (~20,000 vertices on fsaverage5 mesh) as JSON `{time_s, region_id, activation, vertices[]}` — the BRAIN-PATTERN TARGET for the iterative loop.
3. **Stage 2 — Empathy Synthesis Agent** (Johnny owns prompt engineering; Claude Opus per Decision 008). Input: vision-report + brain-pattern data + (optional) any other Ironside data layers. Output: candidate empathy-layer paragraph #N describing what the human felt.
4. **Iterative-Scoring Loop** (Jacob owns K2 orchestration). For up to 8 rounds: score candidate paragraph #N by running it through TRIBE V2 forward-direction text inference; cosine similarity vs. brain-pattern target; if score plateaus or 8 rounds reached, return; otherwise feed score + per-region miss back to Stage 2; generate candidate #N+1.
5. **Falsification Check** (Junsoo owns). Score the final paragraph against a CONTROL video (different worker / different task / different context) using TRIBE V2 forward-direction. Output: falsification delta (drop in similarity proves anchoring).
6. **Output Document** (Emilie owns UI rendering). Three-section empathy-layer document: Vision Report (Stage 1 output) + Empathy Layer Paragraph (final iterative-loop winner) + Falsification Evidence (similarity score + control delta + per-region attribution).

**B. The Demo (the user-facing 90s slice)**

7. **BEAT-0 (off-timer).** Sponsor close swap-in slide (4 variants pre-rendered: Ironside / Listen Labs / Sideshift / YC).
8. **BEAT-1 (0:00–0:15).** Workplace footage plays alongside Stage 1 vision-classification output. Action-data baseline shown.
9. **BEAT-2 (0:15–0:35).** TRIBE V2 brain-encoding renders: 3D cortical mesh glowing in sync with footage. Hover-bridges between regions show per-region specialist activations.
10. **BEAT-3 (0:35–1:00).** Iterative-scoring loop runs visibly: candidate paragraph #1 → similarity 0.42; #2 → 0.58; #3 → 0.65; #5 → 0.71; #8 → 0.84. **The score climbing IS the visual reveal.** Pre-cached fallback if K2 latency exceeds budget.
11. **BEAT-4 (1:00–1:25).** Final empathy-layer paragraph appears in full on screen. Voiceover reads it aloud. Similarity score 0.84 + falsification delta 0.27 displayed.
12. **BEAT-5 (1:25–1:30).** Side-by-side: action-data report ("over 30 min threshold; cut to 10 min") vs. empathy-layer document ("she held space; brain-pattern grounded; falsified against control"). The decision-maker would make a different call.
13. **BEAT-5 close (off-timer).** Sponsor-specific close slide.

**C. Packaging (the artifacts judges read)**

14. **3-minute Round 2 launch video** (per `caltech/video-story.md`; Emilie owns end-to-end).
15. **Devpost writeup** following MindPad/TerraLink structural template.
16. **Pitch decks** for Round 1 (5-min) + Round 2 (3-min).
17. **FAQ ammunition deck** with Q1-Q5 (customer FAQ) + Q-INT-1 through Q-INT-15 (hostile-judge FAQ); per YC stress-test, polished from seed-state to verbatim BEFORE Friday smoke gate.
18. **Friday-night 8-test smoke gate.**
19. **Saturday 8 AM pre-cache asset bundle.**
20. **Saturday 6 PM pre-cache assembly test.**
21. **Saturday 8 PM feature freeze.**
22. **Saturday 11 PM Devpost submit.**

### Adaptation Picks (default-included; flagged for Johnny override)

- **Adaptation 2 — Shareable Brain Card export.** 1:1 IG-Story shape of the empathy-layer document for the user/buyer to share. ~3-4h.
- **Per-industry generalization demonstration.** Pre-baked side-by-side MP4s showing the engine running on 3-4 different industry footage examples (construction / healthcare / retail / consumer Reels). ~3-4h. Listen Labs simulation deliverable.

### Out of Scope (explicitly parked)

- Production-level consented worker-data pipeline at scale
- Multi-user social product (Brain Card seeds the viral loop; the social product is post-hackathon)
- Mobile app
- Real-time empathy-layer running on live body-cam streams (demo runs on uploaded footage; production scales with consented streaming)
- Auditor's external referent fully resolved (held as tension; FAQ Q-INT-4 has within-subject-framing answer)
- Multi-modal input beyond video (no audio-only, no text-only, no still-image)
- Any clinical claim, reverse-inference claim, sub-second prediction (forbidden per TRIBE canonical)
- Brain-wave-generated content surface (the Clair de Lune-style forward-direction generation as a user-driven creative tool — held as future B2C feature; not in 90s demo scope)

### Vision (Future, post-hackathon)

- **Today:** empathy layer applied to workplace footage and consumer day-to-day footage; manager/user reads paragraph; corner-cuts prevented OR daily journal accumulates.
- **Tomorrow:** empathy layer extends to BCI direct neural data; same architecture; same falsification methodology; same ethos. The trilemma escalates; the third option (use AI + see what it does + choose) remains the same.
- **Monetization paths held (per Open Item #7):** (a) hosted database FOR the user/buyer (subscription); (b) local-first pay-once (model + inference on-device).

---

## User Journeys

### Persona 1 — Maya, the Gen-Z teen (B2C overlay, secondary demo)

**Backstory.** Maya is 17, born 2008. Suburban California. Scrolls Reels ~2.5h/day. Has tried to "use TikTok less" three times and given up. Felt-friction sentence: *"If a headline is engineered to make you angry, the only way to know is to notice your own reaction after it already got you."* She has no pre-algorithm reference frame.

**Opening scene.** Maya opens the product on a friend's laptop. She uploads (or screen-records) 90s of her actual Reels feed.

**Rising action.** Stage 1 vision-classification produces a baseline scene-description ("trending dance, AI fashion advice, true-crime, relatable-sadness"). TRIBE V2 emits the brain-pattern. Stage 2 starts generating candidate empathy-layer paragraphs. The 3D cortical mesh glows alongside her feed. She watches the iterative-scoring loop: candidate #1 (similarity 0.42), candidate #2 (0.58), candidate #5 (0.71), candidate #8 (0.84). The score climbs.

**Climax.** The final paragraph appears: *"Her amygdala ignited in the small repetitive way that anger wears when it's been served instead of arrived at. There was no surprise in her threat-detection — these were familiar shapes, content her brain had already learned to recognize and respond to without choosing. Her default-mode network — the part of her that's her — sat quiet, not engaged with the feed but not free of it either. She wasn't watching. She was being watched-at."* Similarity 0.79. Falsification check (vs. her brain on a curated short film): 0.24.

**Resolution.** She has language for what was happening. She exports the paragraph as a Brain Card. *"My brain this week — what about yours?"* She walks away. Daily entries accumulate into her knowledge graph (future-Obsidian B2C overlay).

**Capabilities revealed.** Video upload; live brain-encoding inference; iterative-scoring loop with visible reveal; empathy-layer paragraph; falsification evidence; Brain Card export; daily journal aggregation.

### Persona 2 — Sarah, the Healthcare Manager (B2B primary, the load-bearing pitch story)

**Backstory.** Sarah manages 12 nurses at a mid-size oncology clinic. She reviews patient-room body-cam footage weekly to optimize for visit-time efficiency. Her dashboard shows action data: *"Nurse Lisa spent 30 min in Patient Room 4; threshold is 10 min."* She's about to message Lisa about cutting time.

**Opening scene.** Sarah opens the empathy-layer engine. She uploads the footage of Lisa's 30-minute visit.

**Rising action.** Stage 1 reports: *"Nurse entered room. Sat for 30 minutes. Adjusted IV. Held patient's hand. Left."* TRIBE V2 produces brain-pattern. Stage 2 generates empathy-layer candidates. Iterative loop runs (8 rounds, score climbs to 0.86). Final paragraph appears.

**Climax.** Sarah reads: *"She entered the room and her vital-attention signature shifted immediately — the prefrontal sharpness of triage softened into something quieter, more accommodating. For the first twelve minutes her emotional-processing specialist sustained engagement; she was reading the patient's grief, not just monitoring it. Then a long stretch of default-mode dominance — minutes 18 through 22 — the brain-signature of being present with someone, not waiting for them to finish. The final eight minutes returned to focused care, prefrontal-engaged, holding the patient's hand. She did not rush. She did not check out. She held space."* Similarity 0.86. Falsification check (Lisa on routine vitals visit): 0.27.

**Resolution.** Sarah does NOT message Lisa about cutting time. The action data was wrong. The 30-minute visit was care, not inefficiency. Patient-experience metric preserved. Lisa retained. Patient retained. **The corner-cut didn't happen.**

**Capabilities revealed.** Workplace footage upload; Stage 1 vision-report; TRIBE brain-encoding; Stage 2 empathy-synthesis; iterative-scoring loop; falsification check; empathy-layer document UI; manager-decision-aware output.

### Persona 3 — Diego, the Listen Labs Judge

**Backstory.** Diego is a Listen Labs research engineer evaluating ~30 hackathon projects in 6 hours. He's looking for: (a) compelling and creative simulation of human behavior, (b) insight not stack, (c) quantified accuracy grounded in something real.

**Opening scene.** Diego sits at the team's table. Emilie cues the 90-second demo.

**Rising action.** BEAT-1 (recognition), BEAT-2 (cortical mesh awe + per-region specialists), BEAT-3 (iterative-scoring loop reveal — Diego watches the score climb across 8 rounds), BEAT-4 (final paragraph reading aloud).

**Climax.** Diego sees: the iterative-loop IS the multi-agent simulation. The cosine similarity score IS the quantified accuracy. The falsification check IS the grounding-in-reality. The per-industry generalization (pre-baked MP4 montage of the same engine running on construction / healthcare / retail / consumer footage) IS the demonstration that the engine simulates humanity, not a single use case.

**Resolution.** Diego scores. Listen Labs interview offer follows. Team rotates to next judge.

**Capabilities revealed.** Sponsor-swap slides (4 variants); FAQ ammunition deck; iterative-loop reveal as the demo's center of gravity; per-industry generalization as the simulation deliverable.

### Persona 4 — Junsoo (Embedding-Proxy + Control-Bake Owner; v2-relocated)

**Backstory.** v1: Junsoo owned video-to-brain JSON pipeline AND the forward-direction text-input scoring. **v2 relocation:** TRIBE V2 forward-direction is dropped at runtime (the engine reads pre-rendered `activity.json` only). Junsoo's load-bearing v2 lane is the **embedding proxy** (`services/embedding_proxy/` + `services/falsification.py`) and the offline bake of `control_activity.json` per scenario. The Clair de Lune work originated in his collaboration with Johnny — that methodology is the falsification protocol the embedding proxy honors.

**Opening scene.** Friday afternoon. Junsoo runs the offline TRIBE V2 pipeline once per demo clip on a Vultr GPU box. Output: per-second per-region activation JSON @ 1Hz on the 30s test clip. Latency: ~24s, offline only. He commits `activity.json` to `backend/prerendered/<clip>/`. Smoke test #1 (v2): activity.json schema-valid for both demo clips.

**Rising action.** He fits the projection map W (384 × 7) by `np.linalg.lstsq` from `training_pairs.yaml` — 10 hand-paired (paragraph, per-network mean activation) examples. Saves to `services/embedding_proxy/projection_map.npy`. Tests `services/falsification.py` end-to-end: paragraph → 384-dim → 7-dim → cosine vs target. Saturday 8 AM, he bakes `workplace_routine_baseline/activity.json` and `curated_short_film_baseline/activity.json` per A1-deepdive option (i) hand-pick, keeps option (ii) temporal-shuffle as labeled secondary.

**Climax.** Demo-day. BEAT-1 reads pre-rendered `activity.json` from disk. BEAT-3 iterative-scoring loop runs through K2-evaluator-swarm semantic scoring (no runtime brain-encoding inference). Falsification (Stage 5) produces the headline `delta=0.57 anchored` with the embedding proxy. Q-INT-2 from a judge: *"What are the actual TRIBE numbers?"* Junsoo: *"~20,000 cortical-surface vertices on fsaverage5, trained on ~25 deeply-scanned subjects. We pre-render once and cache; the embedding proxy is the runtime stand-in for the forward direction so we don't burn GPU on stage."*

**Resolution.** Architecture defense holds. Forbidden-claim guardrails respected throughout.

**Capabilities revealed.** TRIBE V2 offline reverse-direction bake; embedding-proxy projection map fit; control-clip activity.json bake (hand-pick + temporal-shuffle); falsification short-form output `{main_score, control_score, delta, verdict}`; smoke-test gate ownership.

### Persona 5 — Jacob (K2 Three-Roles + Iterative-Loop Orchestrator; v2-promoted)

**Backstory.** Jacob owns the K2 surface that plays three roles in v2 (Stage 1B specialists × 7, Stage 2 moderator × 1, Stage 3 evaluator-swarm × 7 per round) plus the iterative-scoring loop. The merged swarm + loop runs at K2 speed because at Anthropic Opus latency, eight rounds × per-paragraph K2-evaluator-swarm doesn't fit a consumer-product budget. K2 = ~2000 tok/s, OpenAI-compatible chat-completions.

**Opening scene.** Friday afternoon. Jacob spins up the Cerebras K2 endpoint. Sets up `asyncio.gather(*calls)` for the 7-call swarms (no semaphore inside one stage); cross-stage `asyncio.Semaphore(6)` lives only inside `services/warmup.py` for `k2_region_cache` pre-bake. Pydantic strict + brace-balanced JSON extractor + 3-attempt retry + per-call 30s timeout.

**Rising action.** He builds the iterative loop in `services/iterative_loop.py`. Per round: K2 moderator (`services/empathy_synthesis.py`) writes a candidate paragraph from the vision report + Stage 1B swarm readings; seven K2 evaluators (one per Yeo7 network, prompt `evaluator_score.md`) re-score the candidate against each region's expected reading; mean of seven = round_score; per-region miss feeds back to the moderator for round N+1. Plateau exit `|Δ|<0.02` over 2 rounds OR R==8. Friday-night smoke test #2 (v2): K2 + K2-evaluator-swarm iterative loop, 8 rounds in ≤ 60s. Zero timeouts. PASS.

**Climax.** Demo-day BEAT-3. Iterative loop runs visibly. Each round logs: candidate generated, mean score computed, per-region attribution surfaced. Judge asks Q-INT-6 (K2-could-be-Claude): *"Why K2?"* Jacob: *"K2 plays three roles on one surface — specialists, moderator, evaluators — at ~2000 tok/s. Eight rounds × seven evaluators × per-round moderator at Anthropic latency doesn't fit ninety seconds. K2 makes the merged swarm + iterative loop a consumer-product surface, not a research artifact. Anthropic Opus 4.7 runs once at the end as an optional ~100-word polish, gated by `OPUS_POLISH=1` — cut-line cherry."*

**Resolution.** K2 architectural-required defense lands.

**Capabilities revealed.** Three K2 roles on one surface; merged swarm + iterative-loop orchestration; per-round attribution + plateau exit; cache + warmup BackgroundTask; cross-talk-soup defense via per-region attribution.

### Persona 6 — Emilie (Packaging + Output Document UI)

**Backstory.** Emilie owns end-to-end packaging per Decision 003. Quality bar: *"pass the startup test."*

**Opening scene.** Friday early evening. Emilie loads the locked empathy-layer document spec. She opens Figma. She designs the three-section output UI: Vision Report (top, contextual baseline) + Empathy Layer Paragraph (middle, hero) + Falsification Evidence (bottom, scientific grounding).

**Rising action.** Friday: wireframes. Friday-night smoke test #3: Renaissance differentiation rehearsal. Saturday morning: cinematic Acts 1+4 shoot complete. Saturday afternoon: design polish, hero shot, launch video assembly, Devpost copy. She renders the empathy-layer document UI in three modes: workplace (boss-facing), consumer (user-facing), pavilion (judge-facing).

**Climax.** Saturday 6 PM. Pre-cache assembly test — entire 90s on pre-recorded only. PASS. Saturday 8 PM freeze. Saturday 8-11 PM final assembly. Saturday 11 PM submit.

**Resolution.** Demo-day. Sunday morning rehearsals. Round 1 (5-min) + Round 2 (3-min) cuts ready. Empathy-layer document is magazine-cover beautiful.

**Capabilities revealed.** 3-section empathy-layer document UI; launch video MP4; Devpost writeup; 4 sponsor-close slides; on-camera narration + voiceover; pre-cache orchestration.

### Persona 7 — Johnny (PM / Integration / 2-Stage Pipeline Architect)

**Backstory.** Johnny owns hard innovation + integration. The empathy-layer epiphany came from the Ironside open-office-hours conversation. He's the integration point across all stages.

**Opening scene.** Friday 2 PM. Visualization stack pick (Three.js or R3F). Friday 5 PM: Stage 1 vision-classification API pick (Gemini via OpenRouter or Claude vision).

**Rising action.** He spawns three sibling Claude instances per `tasks-by-person/johnny-orchestration.md`: vis-brain (3D cortical mesh + iterative-loop visualization), vis-graph (knowledge-graph layer + hover-bridges + empathy-layer document UI integration), orch-glue (Stage 1 + TRIBE + Stage 2 + iterative loop + fallback swap logic). Saturday 5 PM integration checkpoint.

**Climax.** Saturday 6 PM Johnny picks final headline + product name. Saturday 8 PM freeze. Demo-day: he handles integration narration during Q&A.

**Resolution.** Integration is plumbing per the I/O contracts.

**Capabilities revealed.** Two-stage pipeline integration; iterative-loop visualization; empathy-layer document rendering; multi-Claude orchestration; final-pick discipline.

### Journey Requirements Summary

The journeys reveal these capabilities (which feed Functional Requirements §FR1-§FR60):

- **Engine capabilities:** Stage 1 vision-classification; TRIBE V2 reverse + forward inference; Stage 2 empathy-synthesis; iterative-scoring loop with K2 orchestration; falsification check; output document rendering
- **Demo-day capabilities:** 90s 5-beat demo; iterative-loop visual reveal; empathy-layer document UI; sponsor-swap slides; pre-cache fallback per beat
- **Packaging capabilities:** 3-min launch video; Round 1 + Round 2 pitch decks; Devpost writeup; FAQ ammunition deck; per-industry generalization MP4 montage
- **Architectural-defense capabilities:** Clair de Lune precedent cite; cross-talk soup defense; falsification methodology rigor; spatial-intelligence definition satisfaction (Ironside)

---

## Domain-Specific Requirements

### Compliance & Regulatory

- **TRIBE V2 license: CC BY-NC 4.0.** Non-commercial only. Hackathon is non-commercial; commercial path TBD via Meta legal.
- **No clinical claims.** *"Workforce-context augmentation, not psychological evaluation."* / *"Content-discovery journal, not clinical diagnosis."*
- **No reverse inference (Poldrack 2006).** Empathy-layer paragraph uses observational language: *"emotional-processing specialist sustained engagement"*, *"default-mode dominance suggests quiet co-presence"*. NEVER *"she felt grief"* or *"he felt distracted."*
- **No sub-second predictions.** TRIBE is 1Hz with 5s HRF lag. Animations and per-second outputs respect this.
- **Within-subject contrast only.** Falsification check uses control footage from THE SAME human on a different scene. Never population-norm comparison.
- **No inflated TRIBE numbers.** Canonical: ~20,000 vertices on fsaverage5, ~25 trained subjects. Never 70K voxels / 700 subjects.
- **Consent and data ownership.** B2C: user uploads their own footage; vault is theirs; no persistence beyond session unless user chooses. B2B: workplace footage is the buyer's; consent assumed via existing employment data agreements; the empathy layer is the buyer's tool to USE the data better, not a new data-collection mechanism.
- **Sponsor-attribution honesty.** When citing IFM K2 / Listen Labs / Sideshift / Ironside / YC, frame their tools as load-bearing or as named-comparable; don't overclaim formal partnership.

### Technical Constraints

- Demo runs on demo-day GPU.
- TRIBE inference + 3D rendering both fight for GPU.
- K2 Think API rate limits (smoke test #2 confirms zero timeouts at 10 concurrent).
- Wi-Fi unreliability at venue (smoke test #5; backup MP4 mandatory).
- 3D rendering FPS ≥ 30 with iterative-loop visualization overlay.
- Live latency budget: 90 seconds end-to-end.
- Demo determinism: < 5% variance in final paragraph across back-to-back runs.

### Integration Requirements

- **Stage 1 vision API → empathy pipeline contract.** Vision-report JSON: `{scene_summary, actions[], temporal_sequence[], spatial_relationships[]}`. Stage 1 produces; Stage 2 consumes.
- **TRIBE V2 reverse → iterative-loop contract.** Per-second JSON: `{time_s, region_id, activation, vertices[]}`. Junsoo provides; Jacob consumes for scoring.
- **TRIBE V2 forward (text input) → iterative-loop contract.** Same JSON output schema; input is the candidate paragraph text. Junsoo provides; Jacob consumes for scoring.
- **Stage 2 empathy-synthesis → iterative-loop contract.** Output: `{candidate_paragraph_text, generation_round, prior_round_score_feedback}`. Johnny+Jacob shared.
- **Iterative-loop → empathy-document contract.** Output (v2 short-form per technical PRD §6.5 + §6.6): `{best_paragraph, polished_paragraph, final_score, round_trajectory[], per_region_attribution{}, falsification: {main_score, control_score, delta, verdict}}`. Jacob produces; Emilie's UI consumes; field names match the live demo path emitted by `services/iterative_loop.py` + `services/falsification.py`.
- **Pre-cache fallback contracts.** Each beat has a pre-cached MP4 / static asset. Per-beat owners bake by Saturday 8 AM.
- **Per-industry generalization MP4 contract.** 3-4 short side-by-side clips showing the engine running on construction / healthcare / retail / consumer footage. Listen Labs simulation deliverable.

### Risk Mitigations

- **TRIBE latency on demo GPU.** Pre-cache fallback IS the answer.
- **K2 rate-limit / timeout.** Pre-cached iterative-loop output ready.
- **Iterative loop convergence.** If by round 8 score < 0.70, pre-cached final paragraph swap-in.
- **Stage 1 vision API rate-limit.** Pre-cached vision-report ready.
- **Per-region attribution accuracy.** Documented as observational (per forbidden-claim guardrails); no clinical claim made.
- **Renaissance pattern-match.** Iterative-loop reveal IS the structural differentiation (no debate triad; brain-grounded paragraph generation; Clair de Lune protocol inverted).
- **Empathy-layer paragraph quality variance.** Hand-curated test footage Saturday morning ensures demo paragraph is literature-grade.
- **Sponsor close mismatch across pavilions.** 4 pre-rendered swap slides + per-pavilion mental-rehearsal protocol.
- **Wi-Fi failure.** Full backup MP4 of entire 90s.

---

## Innovation & Novel Patterns

### Detected Innovation Areas

**Innovation #1 — Clair de Lune protocol inverted.** Original work generated text to MATCH a target brain-pattern (90.4% Clair de Lune match). The empathy layer uses the brain-pattern of an actual video to score candidate paragraphs DESCRIBING what the human felt. **Same iterative-scoring loop, opposite direction of question.** Direct reuse of shipped credibility chip.

**Innovation #2 — Two-stage agent pipeline with TRIBE V2 as in-between modality.** Stage 1 (vision-classification) describes the scene; TRIBE V2 emits the new modality (brain-wave data layer); Stage 2 (empathy-synthesis) maps the brain-wave back to the video by generating empathy-grounded paragraphs. The mapping IS the agent's spatial-intelligence work. Satisfies Ironside's spatial-intelligence definition structurally.

**Innovation #3 — Falsification methodology grounded in within-subject brain contrast.** Cosine similarity score (candidate vs. target) IS the falsifier. Falsification check (same paragraph scored against control footage) drops sharply, proving anchoring. Same logic as Clair de Lune work falsifying against control music.

**Innovation #4 — Empathy-layer document as boss-facing artifact.** Three-section output (Vision Report + Empathy Layer Paragraph + Falsification Evidence) is the artifact decision-makers read BEFORE making productivity-cut decisions. The corner-cut doesn't happen because the action data is contextualized by the empathy paragraph + grounded by the falsification evidence.

**Innovation #5 — One engine, multi-industry, multi-track sponsor coverage.** The engine generalizes across any video of human action. Workplace footage (Ironside primary; healthcare / construction / retail / food service / education / logistics generalizations) and consumer day-to-day footage (Sideshift + YC overlay; daily journal that writes itself). Multi-track sponsor coverage is structurally MECE.

**Innovation #6 — Iterative-loop reveal as the demo's center of gravity.** Round-by-round score climbing visible to the judge. Round 1 (0.42) → Round 2 (0.58) → Round 8 (0.84). The judge experiences the engine improving its understanding in real time. **The visual reveal IS the demo's emotional climax.** Replaces the prior Land card hero gesture as BEAT-4 center of gravity.

### Market Context & Competitive Landscape

- **Cortex.buzz** — Commercial product built on TRIBE V2 (attention-engineering direction). We INVERT it. Manipulation only works in the dark.
- **Renaissance Research (HackTech 2025 winner)** — 3-LLM debate triad. Different epistemology, different visual signature, different answer to T2.
- **Workforce analytics incumbents** (Pillar Safety, OpsCheck, eSUB, Procore Workforce, etc.) — measure action data; don't measure feeling-state. We add the upstream optimization signal.
- **Consumer wellness apps** (Apple Screen Time, Headspace, RescueTime) — measure usage; don't decompose by brain region; no falsification grounding. We differentiate on architecture.
- **Multi-agent simulation research** (PolicySim, AgentSociety, MATRIX, SynthAgent, Listen Labs internal) — text-grounded; cannot distinguish genuine shift from surface agreement. We brain-ground.
- **VLM augmentation research** — most work focuses on prompt engineering or fine-tuning; spatial-sidecar pattern (cheap perception → JSON evidence → LLM reasons over JSON) is locked in our wiki at `research/wiki/patterns/spatial-sidecar.md`. We extend it with brain-encoding as the perception modality.

### Validation Approach

- **Friday-night smoke-test gate** (8 tests).
- **Renaissance differentiation rehearsal** (smoke test #3).
- **Self-audit table** at bottom of `demo-script.md`.
- **Pre-cache assembly test** (Saturday 6 PM).
- **Per-industry generalization validation** — Saturday morning, generate empathy-layer paragraphs on 3-4 industry footage examples to confirm engine generalizes.
- **YC stress-test recommendations applied** — talk to 3 actual Gen-Z teens before Friday smoke gate (per `caltech/use-cases/yc-partner-stress-test.md` + `outsider-advantage-check.md`).

### Risk Mitigation

(see Risk Mitigations under Domain-Specific Requirements above)

---

## Architecture Diagram (THE ENGINE — v2)

> **Authoritative source:** `caltech/NEW-ARCHITECTURE.md` §1 (canonical pipeline diagram) + `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` §3 + §4. Long-form prose walk-through: `caltech/architecture-overview.md`. The v1 strategic-PRD diagram (the runtime-TRIBE-V2-forward + reverse pipeline with Anthropic Opus 4.7 in the per-round synthesizer slot and ~1,300 tok/s K2 framing) is archived at `archive/strategic-prd-v1-sections.md` for traceability.

```
       [INPUT: filename → match → backend/prerendered/<clip_id>/]
                            │
                            │  POST /demo/match → BackgroundTask `warmup_clip`
                            │  pre-bakes every Layer-1 cache file:
                            │  vision_report, swarm_readings, k2_region_cache,
                            │  empathy, iterative_trajectory, falsification.
                            │  Frontend polls /demo/warmup-status until ready.
                            ▼
   ┌────────────────────────┬────────────────────────┐
   ▼                        ▼                        │
┌──────────────┐   ┌──────────────────────────┐      │  TRIBE V2 = pre-rendered ONLY.
│ STAGE 1A     │   │ STAGE 1B                 │      │  activity.json on disk is the
│ Qwen3-VL via │   │ K2 SWARM (×7 Yeo7        │      │  canonical brain artifact.
│ OpenRouter   │   │ networks, parallel)      │      │  Runtime never invokes TRIBE.
│              │   │                          │      │
│ 5 frames →   │   │ activity.json →          │      │
│ vision_      │   │ 7 per-region readings →  │      │
│ report.json  │   │ swarm_readings.json      │      │
│ ≤ 10s        │   │ ≤ 8s parallel            │      │
└──────┬───────┘   └─────────────┬────────────┘      │
       └─────────────────┬───────┘                   │
                         ▼                           │
            ┌──────────────────────────┐             │
            │ STAGE 2 — K2 MODERATOR   │             │  K2 plays THREE roles on the
            │ ONE call combines vision │             │  same OpenAI-compatible chat-
            │ + swarm + (rounds≥2)     │             │  completions surface:
            │ prior_score + miss →     │             │   1B specialists × 7
            │ candidate_paragraph      │             │   2 moderator × 1
            │ ≤ 5s/round               │             │   3 evaluator-swarm × 7/round
            └──────────┬───────────────┘             │
                       ▼                             │
            ┌──────────────────────────┐             │
            │ STAGE 3 — K2 EVALUATOR   │             │
            │ SWARM (rounds 1..8,      │             │
            │ plateau-exit             │             │
            │ |Δ|<0.02 over 2 rounds   │             │
            │ OR R==8). 7 parallel K2  │             │
            │ calls per round. Mean    │             │
            │ = round_score. Per-      │             │
            │ region attribution.      │             │
            │ ≤ 60s for 8 rounds       │             │
            │ → empathy.json + iter-   │             │
            │ ative_trajectory.json    │             │
            └──────────┬───────────────┘             │
                       ▼                             │
            ┌──────────────────────────┐             │
            │ STAGE 4 — OPUS POLISH    │             │  Anthropic Claude Opus 4.7,
            │ (CUT-LINE; OPTIONAL)     │             │  `claude-opus-4-7`. ONE call,
            │ Gated `OPUS_POLISH=1`.   │             │  ~140 output tokens, ~100-word
            │ K2 best ships as-is on   │             │  literary polish over the K2
            │ flag-off OR any failure  │             │  best paragraph. Implementation:
            │ (logger.error, fallback) │             │  services/empathy_polish.py.
            │ ≤ 5s                     │             │
            └──────────┬───────────────┘             │
                       ▼                             │
            ┌──────────────────────────┐             │
            │ STAGE 5 — FALSIFICATION  │             │  Sentence-transformer
            │ embedding proxy:         │             │  all-MiniLM-L6-v2 (CPU, lazy
            │ paragraph → 384-dim →    │             │  singleton). 384×7 projection
            │ 7-dim @ projection W →   │             │  W fit offline from
            │ cos vs activity target   │             │  training_pairs.yaml.
            │ + cos vs control         │             │
            │ {main_score, control_    │             │
            │  score, delta, verdict}  │             │
            │ verdict = "anchored"     │             │
            │ if delta > 0.40          │             │
            │ ≤ 200ms                  │             │
            └──────────┬───────────────┘             │
                       ▼                             │
            ┌──────────────────────────┐             │
            │ EMPATHY-LAYER DOCUMENT   │             │
            │ §A vision_report (Stage  │             │
            │    1A baseline)          │             │
            │ §B empathy paragraph     │             │
            │    (Stage 4 if present,  │             │
            │     else Stage 3 best)   │             │
            │ §C falsification +       │             │
            │    per-region attribution│             │
            │    + round trajectory    │             │
            │ PersonaShell: workplace /│             │
            │  consumer / pavilion     │             │
            └──────────────────────────┘             │
                                                     │
        Demo-day operating mode: Saturday 8 AM the warmup runs once per clip
        and the resulting JSON is committed to the repo. On stage, every
        endpoint is a disk read. Brain-3D clicks never block on a runtime
        LLM call. Live attempt runs in the background; if it lands cleanly,
        swap in. If not, the pre-cache IS the demo. Honest framing throughout.
```

**Per-stage owners + files:**
- LANE-J (Junsoo): `services/embedding_proxy/` + `services/falsification.py` + offline TRIBE-V2-reverse bake of `activity.json` per clip + control activity.json bake (workplace_routine_baseline + curated_short_film_baseline; A1-deepdive option i + ii hybrid).
- LANE-K (Jacob): `services/swarm_runner.py` (Stage 1B) + `services/empathy_synthesis.py` (Stage 2) + `services/iterative_loop.py` (Stage 3) + `services/empathy_polish.py` (Stage 4) + `services/warmup.py` + `services/session_cache.py` + `services/guardrails.py`. Prompts: `prompts/{network}.md` × 7 + `moderator_synthesis.md` + `evaluator_score.md` + `empathy_polish.md`.
- LANE-O (Johnny): `services/vision_client.py` (Stage 1A; OpenRouter + Qwen3-VL) + `frontend/src/` (Vue 3 dashboard, persona shell, brain-3D scene, iterative-loop reveal, empathy document) + `main.py` glue.
- LANE-E (Emilie): typography (Crimson Pro for §B paragraph), launch video, sponsor swap-slides (4 variants), voiceover, Devpost, pitch decks, FAQ ammunition deck, Saturday 6 PM pre-cache assembly test.

### Data Transfer Spec (v2)

| Stage | Input | Tool | Output | Latency target |
|---|---|---|---|---|
| Stage 0 cache lookup | `filename` → `clip_id` → `backend/prerendered/<clip_id>/` | match handler | activity.json + scenario.json on disk | ≤ 50ms |
| Stage 1A vision | 5 frames (cv2/ffmpeg extract) | Qwen3-VL via OpenRouter (`qwen/qwen3-vl-235b-a22b-instruct`) | `vision_report.json` | ≤ 10s ideal; tolerated inside warmup BackgroundTask if higher |
| Stage 1B K2 swarm | activity.json (per-network aggregates) | K2 × 7 parallel via `asyncio.gather` (no semaphore) | `swarm_readings.json` | ≤ 8s parallel |
| Stage 2 K2 moderator (per round) | vision_report + swarm_readings + (rounds ≥ 2) prior_score + per_region_miss | K2 × 1 (`prompts/moderator_synthesis.md`) | candidate paragraph (~150-300 words) | ≤ 5s |
| Stage 3 K2 evaluator swarm (per round) | candidate paragraph + 7 region readings | K2 × 7 parallel (`prompts/evaluator_score.md`) | per-region score + justification → mean = round_score | ≤ 8s/round; ≤ 60s for 8 rounds full |
| Stage 4 Opus polish (OPTIONAL) | `best_paragraph` + scenario | Anthropic `claude-opus-4-7` (`OPUS_POLISH=1` only) | `polished_paragraph` (~100 words) OR `null` on cut/fail | ≤ 5s; runs in warmup, not on live read path |
| Stage 5 falsification | `best_paragraph` + main activity + control activity | embedding proxy (all-MiniLM-L6-v2 CPU) + projection W | `{main_score, control_score, delta, verdict}` | ≤ 200ms (after lazy singleton load) |
| Empathy doc render | All upstream outputs | Frontend (Vue 3 + Three.js) | rendered EmpathyDocument | ≤ 1s |
| **Cold warmup total (per clip)** | Video filename | Full pipeline (BackgroundTask) | All cache JSON committed to disk | ≈ 90-110s (hidden from demo path) |
| **Warm read (post-Saturday 8 AM bake)** | Same `clip_id` | Disk read of empathy.json | Empathy-Layer Document | < 100ms |

**Pre-cache strategy (v2 lock):** Saturday 8 AM the warmup pipeline runs once per demo clip and the resulting JSON is committed to the repo. On stage, demo-day reads are O(1) cache hits. Live attempt runs as a non-blocking background; if it lands cleanly, the demo prefers the live result; if not, the pre-cache IS the demo. **TRIBE V2 NEVER runs in any direction at runtime.**

### The Demo Visualization (90 Seconds On Stage — v2)

```
TIME      WHAT THE JUDGE SEES                           CACHE / STAGE READ
─────     ──────────────────────────────────────        ─────────────────────
0:00      Scenario clip plays (workplace OR consumer)   GET /demo/match → /demo/vision-report
          Vision Report appears as text overlay         (Stage 1A; pre-baked)
0:15      3D cortical mesh appears alongside clip.       GET /demo/activity (pre-rendered
          ~20K vertices, fsaverage5, ≥30 FPS.            TRIBE V2 activity.json on disk)
          Per-network glow synced to per-second
          activations. Hover anchors fire K2-region
          specialist popups (greenchain × icarus
          dashboard pattern).                            POST /demo/k2-region (cache hit)
0:35      Iterative-loop reveal:                         GET /demo/iterative-trajectory
          • Round 1: candidate #1 fades in;             (round_trajectory[] from cached
            score bar 0.42                               empathy.json — climb is the
          • Round 2: rewrites; 0.58                      visual reveal; pre-baked from
          • Round 3: 0.65                                K2-evaluator-swarm semantic scoring,
          • Round 5: 0.71                                NOT TRIBE-V2-forward inference)
          • Round 8: 0.84 (bar full)
          ★ THE SCORE CLIMBING IS THE VISUAL REVEAL ★
1:00      Final empathy paragraph in full.               GET /demo/empathy → §B
          Voiceover reads it aloud (literature-grade     (best_paragraph if OPUS_POLISH=0,
          prose; Stage 4 polish if `OPUS_POLISH=1`).     polished_paragraph if =1; frontend
          Similarity score + falsification delta         already prefers polished || best)
          rendered in §C.                                GET /demo/falsification → §C
1:25      Side-by-side:                                   PersonaShell: workplace mode for
          LEFT: action-data report ("over threshold;     ironside; consumer mode for twitter
                cut to 10 min")                          /reels feed; pavilion mode for
          RIGHT: empathy-layer document                   judges.
          Decision-maker would call this differently.
1:30      Sponsor close swap-slide                       Static asset (Ironsight /
          (Ironsight / Listen Labs / Sideshift / YC)     Listen Labs / Sideshift / YC)
```

---

## Functional Requirements (FR1-FR60)

> The capability contract. Every feature traces back here.

### Capability Area 1 — Stage 1 Vision Classification

- **FR1.** Stage 1 agent ingests video file (MP4, H.264, ≥720p, 30-90s duration).
- **FR2.** Stage 1 calls Gemini 2.5 Pro (via OpenRouter API) OR Claude vision API based on Open Item Friday-5PM pick.
- **FR3.** Stage 1 produces Vision Report JSON: `{scene_summary, actions[], temporal_sequence[], spatial_relationships[]}`.
- **FR4.** Stage 1 latency ≤ 10s for 30s clip.
- **FR5.** Stage 1 has pre-cached fallback (pre-baked vision-report for demo input).

### Capability Area 2 — TRIBE V2 Brain Encoding (Reverse Direction)

- **FR6.** TRIBE V2 reverse-direction pipeline ingests same video file.
- **FR7.** TRIBE V2 produces per-second per-region activation JSON: `{time_s, region_id, activation, vertices[]}` across ~20,000 cortical vertices on fsaverage5 mesh.
- **FR8.** TRIBE V2 inference latency < 30s on 30s clip on demo GPU.
- **FR9.** TRIBE V2 has pre-cached fallback (pre-baked brain-pattern JSON for demo input).
- **FR10.** TRIBE V2 supports the Ironside-swap input source (egocentric construction-worker video).
- **FR11.** TRIBE V2 supports B2C input source (consumer Reels/TikTok screen-recording).

### Capability Area 3 — Stage 2 Empathy Synthesis

- **FR12.** Stage 2 agent (Claude Opus) ingests Vision Report + BRAIN-PATTERN TARGET + (optional) prior-round score + per-region miss.
- **FR13.** Stage 2 generates candidate empathy-layer paragraph (~150-300 words) describing what the human felt during the footage.
- **FR14.** Stage 2 honors all forbidden-claim guardrails (no reverse inference; no clinical claims; observational language; ~20K vertices canonical).
- **FR15.** Stage 2 latency ≤ 5s per candidate.
- **FR16.** Stage 2 has pre-cached fallback (pre-baked candidate paragraphs per round for demo input).

### Capability Area 4 — Iterative Scoring Loop

- **FR17.** K2 Cerebras orchestrates iterative-loop with asyncio.Semaphore(6) + Pydantic strict + brace-balanced JSON extractor + 3-attempt retry + 120s timeout.
- **FR18.** Iterative loop calls TRIBE V2 forward-direction (text input → predicted brain-pattern) for each candidate.
- **FR19.** Iterative loop computes cosine similarity between candidate's predicted brain-pattern and TARGET brain-pattern.
- **FR20.** Iterative loop continues until score plateaus (delta < 0.02 over 2 consecutive rounds) OR 8 rounds reached.
- **FR21.** Iterative loop returns best paragraph + final score + all-round score trajectory.
- **FR22.** Iterative loop latency ≤ 60s for 8-round full execution; pre-cached fallback for demo if exceeded.
- **FR23.** Iterative loop logs per-round score + per-region attribution for observability + cross-talk-soup defense.

### Capability Area 5 — Falsification Check

- **FR24.** Falsification check scores final paragraph against a CONTROL video's brain-pattern (different human OR same human on different scene).
- **FR25.** Falsification check computes falsification delta = main_score − control_score.
- **FR26.** Falsification check produces output proving the paragraph is specifically anchored, not generically plausible.
- **FR27.** Falsification check latency ≤ 3s.
- **FR28.** Falsification check has pre-baked control-footage brain-pattern (Junsoo bakes Saturday 8 AM).

### Capability Area 6 — Output Document Rendering

- **FR29.** Frontend renders three-section Empathy-Layer Document: Vision Report + Empathy Layer Paragraph + Falsification Evidence.
- **FR30.** Output document supports persona-driven framing modes: workplace (boss-facing) / consumer (user-facing) / pavilion (judge-facing).
- **FR31.** Output document is exportable as a 1:1 IG-Story Brain Card (per Adaptation 2; user/buyer can save and share).
- **FR32.** Output document is rendered in Wrapped-style swipe-card format for B2C scenario.
- **FR33.** Output document rendering latency ≤ 1s.

### Capability Area 7 — 3D Visualization Frontend

- **FR34.** Frontend renders fsaverage5 cortical mesh with ~20K vertices visible at ≥ 30 FPS on demo laptop.
- **FR35.** Frontend paints per-region activation glow on the mesh in sync with brain-pattern JSON stream.
- **FR36.** Frontend renders 3D knowledge-graph layer in spatial space separate from cortical mesh (NOT painted on cortex per Johnny's explicit cut).
- **FR37.** Frontend renders hover-bridges between brain regions (grayed default, light up on focus within radius, reasoning fragments flow along edges).
- **FR38.** Frontend renders iterative-loop visualization: round-by-round score climbing as a fillable bar; candidate paragraph fading in/out per round; the score climb IS the visual reveal.
- **FR39.** Frontend renders within-subject toggle (BEAT-3): two cortical meshes side-by-side (same brain, different input) with summary stats overlay.

### Capability Area 8 — Demo Orchestration & Fallback

- **FR40.** Demo runbook sequences BEAT-0 through BEAT-5 with absolute time anchors.
- **FR41.** Each beat attempts live execution; per-component pre-cache fallback if budget exceeded.
- **FR42.** Pre-cache asset bundle (per-beat MP4s + cards + sponsor slides + voiceover WAV) ready by Saturday 8 AM.
- **FR43.** Demo runs end-to-end on pre-cached only (validated by Saturday 6 PM assembly test).
- **FR44.** Demo runs on phone hotspot (Wi-Fi contingency).
- **FR45.** Sponsor-swap hot-swaps BEAT-0 + BEAT-5 slides per pavilion.

### Capability Area 9 — Storytelling & Packaging

- **FR46.** 3-minute Round 2 launch video MP4 (16:9 1080p + 9:16 1080p social variant + 16:9 4K archive) per `caltech/video-story.md` delivery checklist.
- **FR47.** 5-minute Round 1 pitch deck extends 3-min spine.
- **FR48.** Devpost writeup follows MindPad/TerraLink structural template.
- **FR49.** FAQ ammunition deck: Q1-Q5 customer + Q-INT-1 through Q-INT-15 hostile-judge, polished verbatim BEFORE Friday 8 PM smoke gate.
- **FR50.** Every team member can perform 90s demo from memory.
- **FR51.** Sponsor swap-slides (4 variants: Ironside / Listen Labs / Sideshift / YC) pre-rendered.
- **FR52.** Per-industry generalization MP4 (3-4 short clips: construction / healthcare / retail / consumer Reels) baked Saturday morning. Listen Labs simulation deliverable.

### Capability Area 10 — Smoke Tests & Freeze Discipline

- **FR53.** Friday-night 8-test smoke gate (TRIBE latency / K2 load / Renaissance differentiation / 3D FPS / Wi-Fi contingency / swarm coherence / Figma-data contract / demo determinism).
- **FR54.** Saturday 8 AM pre-cache asset bundle complete and committed.
- **FR55.** Saturday 6 PM pre-cache assembly test passes.
- **FR56.** Saturday 8 PM feature freeze enforced.
- **FR57.** Saturday 11 PM Devpost submit complete.

### Capability Area 11 — YC-Stress-Test Recommendations Applied

- **FR58.** Talk to 3 actual Gen-Z teens (siblings/friends-of-friends/high-school students) Saturday morning before pre-cache deadline. Cite in Devpost.
- **FR59.** FAQ Q-INT-1 / Q-INT-4 / Q-INT-15 polished from seed-state to verbatim BEFORE Friday 8 PM smoke gate.
- **FR60.** Honest pitch reframe ("outsider-builder" Devora archetype, not strict founder-market-fit) integrated into YC swap-slide + Devpost.

---

## Non-Functional Requirements (NFR1-NFR40)

### Performance

> **v2 supersession note:** authoritative NFR semantics now live in technical PRD §14 (NFR1–NFR44). The strategic NFRs below preserve the v1 numbering for traceability; v2 deltas are tagged inline. **Authoritative source for v2 latency budgets is technical PRD §14 + architecture-overview §7.**

- **NFR1.** Demo end-to-end runs in ≤ 90 seconds for live-attempt path. (v2: holds on the warm-cache path post-Saturday-8-AM bake; cold warmup ≈ 90-110s and is hidden inside the `BackgroundTask` warmup pipeline.)
- **NFR2.** ~~TRIBE V2 reverse inference completes 30s clip in < 30s on demo GPU.~~ **[v2-superseded]** — TRIBE V2 reverse runs OFFLINE only; activity.json on disk is the canonical artifact.
- **NFR3.** ~~TRIBE V2 forward-direction inference per candidate paragraph ≤ 2s.~~ **[v2-superseded]** — runtime TRIBE-V2-forward never runs in v2. Per-round semantic scoring is K2-evaluator-swarm; falsification cosine numbers come from the embedding proxy (see technical PRD NFR41).
- **NFR4.** K2 swarm completes 7-call specialist swarm within 8s with zero timeouts (`asyncio.gather(*calls)` per stage; see technical PRD NFR42).
- **NFR5.** ~~Stage-2 Anthropic Opus call ≤ 5s per round.~~ **[v2-superseded]** — Stage 2 is now the K2 moderator (≤ 5s per candidate, per technical PRD NFR6′). Stage 4 Opus polish (gated `OPUS_POLISH=1`) is the only place Anthropic Opus 4.7 runs in v2; ≤ 5s end-to-end (technical PRD NFR6″).
- **NFR6.** 8-round iterative loop completes in ≤ 60s; plateau exit usually drops this to 3-5 rounds in practice.
- **NFR7.** 3D rendering ≥ 30 FPS with iterative-loop visualization overlay.
- **NFR8.** Demo determinism: < 5% variance across back-to-back runs (temp=0, lock seeds, pre-record fallback).

### Privacy & Compliance

- **NFR9.** No PII collected.
- **NFR10.** TRIBE V2 license CC BY-NC 4.0 respected — non-commercial demo.
- **NFR11.** No clinical claims.
- **NFR12.** No reverse-inference language anywhere.
- **NFR13.** No sub-second prediction claims.
- **NFR14.** Within-subject contrast only.
- **NFR15.** No inflated TRIBE numbers.
- **NFR16.** No persistent surveillance — B2C vault has no persistence beyond session unless user chooses.

### Reliability

- **NFR17.** Each demo beat has pre-cached fallback asset; per-component swap.
- **NFR18.** Wi-Fi-loss contingency: full backup MP4.
- **NFR19.** Pre-cache assembly test (Saturday 6 PM) passes.
- **NFR20.** Sponsor-swap reliability: BEAT-0 + BEAT-5 hot-swap < 5s.
- **NFR21.** Iterative-loop convergence: by round 8, similarity score ≥ 0.75 on test footage.
- **NFR22.** Falsification check: control delta ≥ 0.40 (proves anchoring strength).

### Accessibility & UX

- **NFR23.** Empathy-layer paragraph uses literature-grade prose (not academic jargon, not clinical terminology).
- **NFR24.** Wrapped Card 1 uses function names not anatomy names (Sally UX fix).
- **NFR25.** Cohort comparison must DISAGREE with intuition (Sally UX fix).
- **NFR26.** Hover-bridge interaction supports both mouse + touch hover.
- **NFR27.** Voiceover register honors Acts 1+4 cinematic + Acts 2+3 guide register per `caltech/video-story.md`.
- **NFR28.** Color palette + typography honors `tier-2-epics/pkg-brand-system.md`.
- **NFR29.** Iterative-loop reveal is paced for emotional impact (score climbs visibly across ~25s; not too fast to register, not too slow to bore).

### Integration

- **NFR30.** Stage 1 → empathy pipeline contract: Vision Report JSON schema-validated.
- **NFR31.** TRIBE V2 reverse → iterative-loop contract: per-second JSON schema validated.
- **NFR32.** TRIBE V2 forward → iterative-loop contract: text input → JSON output schema validated.
- **NFR33.** Stage 2 → iterative-loop contract: Pydantic strict + brace-balanced JSON extractor + 3-attempt retry on K2 side.
- **NFR34.** Iterative-loop → output-document contract: full trajectory + best-paragraph payload schema validated.
- **NFR35.** Pre-cache fallback contracts: per-beat MP4 / static asset committed to repo by Saturday 8 AM.

### Observability (demo-day operational)

- **NFR36.** Demo runbook logs per-beat live/pre-cache decision.
- **NFR37.** Iterative-loop logs per-round score + per-region attribution + candidate paragraph for cross-talk soup defense post-mortem.
- **NFR38.** K2 swarm structured-log per call (latency, retry-count, fallback-triggered).

### Sponsor & Strategic Alignment

- **NFR39.** Best Use of AI YEA/NAY rubric is the explicit closing slide; product enacts the rubric.
- **NFR40.** Empathy-layer positioning is the unified spine across all four sponsor swaps; closing-line wording per `prd-final.md` §7 (final polish [TBD-FINAL-PASS] Saturday 6 PM).

---

## The Story (How This Reimagines What's Possible)

### What the technology reimagines

Today's AI augments tasks that are mechanizable. Spreadsheet automation. Code completion. Image classification. The pattern is: AI does the work, human supervises.

The empathy layer reverses the pattern. **AI doesn't do the work; it contextualizes the work the human already did.** The nurse made the human judgment to spend 30 minutes with a dying patient. The construction worker made the spatial-cognitive judgment to navigate the scaffolding. The Gen-Z teen made the consumption choice to scroll Reels for 30 minutes. The empathy layer doesn't replace any of these decisions. It makes the decisions LEGIBLE to the next human in the loop — the manager, the company, the user themselves — who would otherwise read action data alone and miss the human reality.

This reimagines workforce optimization. Today optimization treats workers as machines because the only data managers have IS machine-shaped (action sequences, time-to-completion, throughput). The empathy layer fills the behavior gap by giving managers human-shaped data so they can make human-aware decisions. Productivity is downstream of feeling-state. Feeling-state is what the action data strips out. The empathy layer puts it back.

This reimagines consumer self-knowledge. Today consumers know what they consumed (screen time, watch history, listen log). They don't know what their consumption did to them. The empathy layer gives consumers a brain-grounded paragraph describing their own experience — a journal that writes itself, anchored to their own neural response. Daily entries accumulate into a knowledge graph of their experience. Future Obsidian for brain-grounded notes.

This reimagines AI's role. The YEA/NAY rubric IS the architecture. AI surfaces options (the paragraph), the user judges (the manager / consumer reads and decides), the system never recommends. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.

### Who it's for (target audience)

**Primary B2B audience:**
- Workforce safety managers (construction, manufacturing, logistics)
- Healthcare administrators (clinics, hospitals, home-health agencies)
- Retail operations managers
- Food-service operations managers
- Education administrators (especially teacher-evaluation contexts)
- Emergency response operations (fire, EMS, police accountability)
- Any HR-tech buyer responsible for workforce optimization decisions

**Secondary B2C audience:**
- Gen-Z and millennial consumers who track screen time and want to understand it
- Wellness-curious users who want a journal that writes itself
- Users in the personal-knowledge-management space (Obsidian / Notion / Anytype power-users)
- Users concerned about algorithmic shaping of their attention and cognition

**Hackathon judges:**
- Ironside (Keenan, Vidyali, Luca, David, Jeffrey + safety-pipeline buyer)
- Listen Labs (research engineers focused on opinion-dynamics and human-cognition simulation)
- Sideshift (consumer-data-agency advocates)
- IFM K2 (speed-engine evaluators)
- YC partners (founder-quality and category-creator evaluators)
- Best Use of AI judges (architecture-aligned-with-ethics evaluators)
- Creativity judges (visceral demonstration evaluators)

### What it solves for

| For whom | What problem it solves |
|---|---|
| Workforce manager | Stops you from cutting corners that destroy outcomes you actually care about (patient experience, customer reviews, employee retention) by adding human context to the action data that drives your decisions |
| The worker being managed | Gets context-aware management; their judgment is preserved when the manager reads the empathy layer instead of the action data alone |
| Consumer (Gen-Z teen) | Gets a brain-grounded journal of their own experience; daily entries help them recognize patterns in what their consumption does to them |
| Listen Labs research engineer | Gets a brain-grounded society simulation that distinguishes genuine cognitive shift from surface agreement (text-only sims cannot) |
| Ironside safety-pipeline buyer | Gets the spatial-intelligence augmentation that turns generic VLM flagging into actionable intervention grounded in per-region brain-specialist evidence |
| YC partner | Gets a category-creator that uses TRIBE V2 (foundation-model unlock) to ship a consumer + B2B product spanning multiple sponsor briefs |
| Best AI judge | Gets a product whose architecture IS the answer to the track question (the YEA/NAY rubric is enacted, not described) |

### How it applies (use-case examples)

**Healthcare (the load-bearing pitch story):** Nurse spends 30 min with patient processing terminal diagnosis. Manager about to cut nurse-time per room to 10 min. Empathy layer reveals: she held space; brain-grounded; falsified. The corner-cut doesn't happen. Patient experience preserved. Nurse retained.

**Construction:** Worker takes 45 min on a task that "should" take 20. Empathy layer reveals: worker was navigating a hazard the manager couldn't see; cognitive-load 0.87, threat-detection sustained, prefrontal engaged. Corner-cut prevented. Safety incident avoided.

**Retail:** Rep extends customer interaction to 12 min. Empathy layer reveals: customer was in distress; rep was de-escalating with sustained emotional-processing engagement. Corner-cut prevented. Review preserved. Customer retained.

**Consumer (Maya scrolling Reels):** Maya scrolls for 30 min. Empathy-layer journal entry: *"Her amygdala ignited in the small repetitive way that anger wears when it's been served instead of arrived at. She wasn't watching. She was being watched-at."* She has language for what was happening. She makes a different choice tomorrow.

### Target Demo / Pitch Anchors

**Single-paragraph elevator (Johnny voice):**

> *"Vision-language models can describe what a human did. They cannot communicate how that human felt doing it. That gap is the empathy layer — and it's the gap that makes managers cut corners that destroy what the company actually cares about. A nurse spends 30 minutes with a patient processing terminal diagnosis. The action data says 'over threshold; cut to 10 min.' The action data is wrong because it can't read the room. We close the gap. We use Meta's TRIBE V2 brain-encoding model — the same model that matched Clair de Lune's neural fingerprint to 90.4% in our prior published work, falsified against control music — pre-rendered offline as a brain-pattern data layer for each demo clip. A K2 swarm of seven Yeo7-network specialists reads each region's activations, a K2 moderator drafts the empathy paragraph, and a K2 evaluator-swarm re-scores the candidate region by region across up to eight rounds with plateau exit — at Cerebras K2 throughput so the merged swarm + loop fits inside a consumer-product latency budget. The best paragraph is optionally polished by Anthropic Claude Opus 4.7 as a ~100-word literary pass — cut-line cherry, gated by an env flag. Falsification check: a sentence-transformer embedding proxy projects the paragraph into seven Yeo7 dimensions and scores cosine similarity against the activity target plus a control delta, real numbers, ≤ 200ms — proving the description is specifically anchored to this scene, not generically plausible. Managers read the paragraph BEFORE they make optimization decisions. The corner doesn't get cut. The patient experience holds. The company keeps the money the manager couldn't see they were losing. This generalizes to construction, retail, healthcare, food service, education, logistics, any workplace where humans take actions and someone above them is making productivity calls based on action data alone. Same engine extends to consumer day-to-day footage as a B2C overlay: empathy-layer paragraphs accumulate into a daily journal of the user's own brain-grounded experience. Future Obsidian. Database FOR you, not the database that sells you. Humans aren't machines. We built the layer that lets AI augment management decisions with the human context the action data strips out."*

---

## Open Items Deferred to Johnny

| # | Item | Owner | Deadline | Default if not picked |
|---|---|---|---|---|
| 1 | Visualization stack (Three.js / R3F / Plotly3D) | Johnny | Friday 2 PM | R3F |
| 2 | Stage 1 vision API (Gemini via OpenRouter / Claude vision) | Johnny | Friday 5 PM | Gemini via OpenRouter |
| 3 | Final product name (replaces empathy-layer codename for user-facing copy) | Johnny | Saturday 6 PM | Empathy Layer remains |
| 4 | Final headline | Johnny | Saturday 6 PM | "Humans are not machines" framing |
| 5 | T2 stance (own / counter) | Johnny | FAQ time | Within-subject contrast as auditor (Q-INT-4) |
| 6 | Iterative-loop number of rounds (5 / 8 / 10) | Johnny + Jacob | Friday smoke test | 8 rounds (Clair de Lune protocol fidelity) |
| 7 | YC monetization path (hosted / local-first) | Johnny | Saturday 6 PM | Both held |
| 8 | On-device-vs-cloud lock | Johnny | Friday | Held privately |
| 9 | Per-industry generalization scope (3 / 4 / 5 industries in pre-baked MP4) | Johnny | Saturday 8 AM | 4 industries: construction + healthcare + retail + consumer Reels |
| 10 | B2C secondary scope (full overlay vs. verbal mention only) | Johnny | Saturday 8 AM | Verbal mention only if budget tight; full overlay if budget headroom |

---

## Critical-Path Timeline

### Friday 2026-04-25

| Time (PDT) | Milestone | Owner |
|---|---|---|
| 2:00 PM | Visualization stack pick | Johnny |
| 5:00 PM | Stage 1 vision API pick | Johnny |
| 6:00 PM | Cinematic Acts 1+4 shoot starting | Emilie |
| 8:00 PM | Friday-night 8-test smoke gate begins | All |
| 8:00 PM | FAQ Q-INT-1/4/15 polished verbatim before gate | Johnny |
| 11:00 PM | All 8 smoke tests complete; per-test fallbacks decided | All |

### Saturday 2026-04-26

| Time (PDT) | Milestone | Owner |
|---|---|---|
| 7:00 AM | 3 Gen-Z teens recruited for testing (per YC stress-test recommendation) | Emilie |
| 8:00 AM | Pre-cache asset bundle complete | All per-beat owners |
| 9:00 AM | 3 Gen-Z teens watch the demo; reactions noted | Emilie |
| 11:00 AM | Listen Labs talk attendance | Team |
| 2:00 PM | Junsoo TRIBE latency confirmed; iterative-loop forward-direction confirmed | Junsoo |
| 2:00 PM | Jacob K2 swarm + iterative-loop orchestration confirmed | Jacob |
| 4:00 PM | Emilie cinematic Acts 1+4 shot complete | Emilie |
| 5:00 PM | Johnny sibling-Claude integration checkpoint | Johnny |
| 6:00 PM | Final product name + headline picked | Johnny |
| 6:00 PM | Pre-cache assembly test (full 90s on pre-recorded) | Emilie |
| 8:00 PM | Feature freeze | All |
| 8-11 PM | Launch video assembly + Devpost upload + pitch deck final | Emilie |
| 11:00 PM | Devpost submit | Emilie |

### Sunday 2026-04-27

| Time (PDT) | Milestone | Owner |
|---|---|---|
| 7-9 AM | Pitch rehearsals (Round 1 5-min + Round 2 3-min) | All |
| 9:00 AM | Devpost hard deadline (already submitted Sat 11 PM) | n/a |
| morning | Round 1 judging (5-min pitch) | Team |
| afternoon | Round 2 judging + sponsor pavilion judging | Team rotating |

---

## References

- [`caltech/use-cases/empathy-layer-prd-simplified.md`](../../caltech/use-cases/empathy-layer-prd-simplified.md) — build-clarity simplified pipeline spec
- [`caltech/use-cases/empathy-layer-hero-output.md`](../../caltech/use-cases/empathy-layer-hero-output.md) — strategic positioning + hero-output justification
- [`caltech/use-cases/two-demo-scenarios.md`](../../caltech/use-cases/two-demo-scenarios.md) — canonical scenario contract
- [`caltech/use-cases/ironside.md`](../../caltech/use-cases/ironside.md) — Scenario A workplace use case
- [`caltech/use-cases/listenlabs-sideshift.md`](../../caltech/use-cases/listenlabs-sideshift.md) — Scenario B consumer use case
- [`caltech/use-cases/yc-partner-stress-test.md`](../../caltech/use-cases/yc-partner-stress-test.md) — defensibility evaluation
- [`caltech/use-cases/outsider-advantage-check.md`](../../caltech/use-cases/outsider-advantage-check.md) — founder-market-fit honest reframe
- [`caltech/prd-final.md`](../../caltech/prd-final.md) — lean reference PRD
- [`_bmad-output/planning-artifacts/prd.md`](./prd.md) — prior comprehensive BMAD-format PRD (Maya-Reels-primary version; this file supersedes for empathy-layer pipeline)
- [`_bmad-output/planning-artifacts/yc-defensibility-review.md`](./yc-defensibility-review.md) — YC stress-test report
- [`caltech/PRD-INPUT-BUNDLE.md`](../../caltech/PRD-INPUT-BUNDLE.md) — source bundle this PRD compresses from
- [`caltech/prfaq.md`](../../caltech/prfaq.md) — Stage 1 PRFAQ
- [`caltech/demo-script.md`](../../caltech/demo-script.md) — 90s shot-by-shot
- [`caltech/narration-script-3min.md`](../../caltech/narration-script-3min.md) — 3-min Round 2 spine
- [`caltech/video-story.md`](../../caltech/video-story.md) — production-ready launch video shoot script
- [`caltech/research-context/007-johnny-public-corpus-tribe-posts.md`](../../caltech/research-context/007-johnny-public-corpus-tribe-posts.md) — Clair de Lune precedent
- [`research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md`](../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md) — TRIBE V2 corrected facts
- [`research/wiki/decisions/`](../../research/wiki/decisions/) — 16 locked decisions
- [`research/wiki/patterns/spatial-sidecar.md`](../../research/wiki/patterns/spatial-sidecar.md) — pattern this engine instantiates
- [`research/wiki/patterns/two-stage-llm-compile.md`](../../research/wiki/patterns/two-stage-llm-compile.md) — pattern the two-stage agent pipeline reuses
- [`research/wiki/patterns/grounded-citation.md`](../../research/wiki/patterns/grounded-citation.md) — pattern the falsification-check inherits

---

## Workflow Status

**PRD complete.** All 11 BMAD steps executed in single autonomous pass per user instruction. Empathy-layer pipeline + two-stage agent architecture + iterative-scoring loop + falsification check + output document spec all locked.

Ready for:
1. **Lock-in pass** — confirm pipeline architecture, FR coverage, demo execution; update sponsor closes + Devpost copy.
2. **Build execution** — Junsoo (TRIBE reverse + forward), Jacob (K2 iterative-loop), Johnny (Stage 1 + Stage 2 + integration), Emilie (output document UI + packaging).
3. **Friday 8 PM smoke gate** — 8 tests run; per-test fallbacks decided.
4. **Saturday 8 PM freeze** — feature freeze; final assembly begins.
5. **Saturday 11 PM submit** — Devpost upload complete with 10h buffer.

**Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.**
