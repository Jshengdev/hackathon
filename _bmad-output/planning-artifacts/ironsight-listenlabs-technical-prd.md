---
title: "Ironsight / Listen Labs — TECHNICAL PRD (Empathy Layer Engine)"
project_name: ironsight-listenlabs-empathy-engine
codename: Empathy Layer
date: 2026-04-25
version: 2.0 (post-TRIBE-cut — reflects what actually shipped)
workflowType: technical-prd
build_window: 2026-04-25 (Friday eve) → 2026-04-26 11 PM PDT (Saturday submit)
freeze: 2026-04-26 8 PM PDT
submit: 2026-04-26 11 PM PDT
hardDeadline: 2026-04-27 9 AM PDT
v2_changelog: |
  2026-04-25 evening — architecture re-locked with team. Updated this doc in place
  rather than fork. Key changes vs v1.0:
    - TRIBE V2 forward-direction inference DROPPED. activity.json on disk is the
      only TRIBE artifact; live TRIBE never runs in any direction.
    - Stage 2 empathy synthesis runs on K2 (moderator role), NOT Anthropic Opus.
      Opus is now Stage 4 polish only — cut-line cherry.
    - NEW Stage 1B: K2 swarm reads activity.json (7 parallel calls) producing
      per-region "readings" before synthesis.
    - Stage 3 iterative loop scored by K2-swarm-as-evaluator instead of TRIBE
      forward. Plateau exit + per-region attribution preserved.
    - Stage 5 falsification uses sentence-transformer embedding proxy
      (all-MiniLM-L6-v2 → 7-dim Yeo7 projection W) in lieu of TRIBE forward.
    - Without-TRIBE comparison pass killed. /demo/comparison endpoint removed.
    - Per-scenario specialist roster collapsed to one shared 7-network roster
      (the existing backend/prompts/{network}.md set).
    - SynthDebate-on-Brain confirmed scoped OUT (was already Q4 in v1.0).
    - Cache + warmup layer added: BackgroundTask pre-bakes all five Layer 1
      JSON files (vision_report, swarm_readings, k2_region_cache, empathy,
      iterative_trajectory) on /demo/match so brain-3D interactions never
      block on a live LLM call.
  Companion plan: caltech/build-plan-locked.md
v2_endpoints_shipped:
  - POST /demo/match                            # triggers warmup BackgroundTask
  - GET  /demo/clips
  - GET  /demo/activity/{clip_id}
  - GET  /demo/vision-report/{clip_id}
  - POST /demo/k2-region                        # per-network click handler
  - GET  /demo/empathy/{clip_id}                # NEW — full pipeline result
  - GET  /demo/iterative-trajectory/{clip_id}   # NEW — BEAT-3 reveal data
  - GET  /demo/falsification/{clip_id}          # NEW — main vs control delta
  - GET  /demo/warmup-status/{clip_id}          # NEW — readiness poll
v2_endpoints_killed:
  - GET  /demo/comparison/{clip_id}             # without-TRIBE pass dropped

scope: |
  This document is the TECHNICAL PRD — the engineering-readable, build-ready specification
  for the Ironsight + Listen Labs empathy-layer engine. It complements the strategic PRD
  at ./ironsight-listenlabs-prd.md. Strategic PRD answers WHY and WHAT. This document
  answers HOW — exact stack picks, integration patterns, latency budgets, I/O schemas,
  per-person build lanes split for parallel execution, smoke-test gates, pre-cache asset
  bundle, and demo-day fallback orchestration.

  Built from three parallel sub-agent gathering passes:
  - Sub-agent A: harvested all Johnny-verbatim yaps from this session (preserved as
    primary-source context throughout this document)
  - Sub-agent B: extracted technical-state ground truth from locked artifacts (TRIBE V2
    canonical reference, K2 integration template, per-person epics, demo-script,
    smoke-test gate, pre-cache asset bundle)
  - Sub-agent C: web-validated all stack picks Johnny named today (Anthropic Opus 4.7,
    OpenRouter gateway, Qwen vision model — corrected naming, K2 Cerebras endpoint,
    TRIBE V2 availability on HuggingFace)

  Designed to be SPLITTABLE across 3 parallel execution lanes (Junsoo / Jacob / Johnny).
  Per-lane FRs and NFRs are tagged with [LANE-J] (Junsoo), [LANE-K] (Jacob — K2),
  [LANE-O] (Johnny — Orchestration), [LANE-E] (Emilie — packaging) for clean parallel
  fan-out.

companion_files:
  strategic_prd: ./ironsight-listenlabs-prd.md
  build_simplified: ../../caltech/use-cases/empathy-layer-prd-simplified.md
  hero_output_strategic: ../../caltech/use-cases/empathy-layer-hero-output.md
  scenario_contract: ../../caltech/use-cases/two-demo-scenarios.md
  yc_defensibility: ./yc-defensibility-review.md
  demo_script: ../../caltech/demo-script.md
  video_story: ../../caltech/video-story.md
  prd_lean: ../../caltech/prd-final.md

stack_picks_locked_after_subagent_C_validation:
  vision_stage_1:
    tool: Qwen3-VL via OpenRouter
    correct_model_id: "qwen/qwen3-vl-235b-a22b-instruct"
    note: "Johnny said 'Qwen 3.5' — that model name does not exist. Sub-agent C corrected to Qwen3-VL."
    cost: "$0.20 input / $0.88 output per M tokens"
    benchmark: "Beats GPT-5 on OCR; competitive on general-vision tasks"
  empathy_synthesis_stage_2:
    tool: Anthropic Claude Opus 4.7
    cost: "$5 input / $25 output per M tokens (new tokenizer +35% bloat applied)"
    role: "Stage 2 empathy-synthesis paragraph generation; iterative-loop coordinator"
  iterative_loop_orchestration:
    tool: Cerebras K2 Think
    speed: "~2000 tok/s (Sub-agent C corrected from previously-claimed ~1300 tok/s)"
    api_compat: "OpenAI-compatible chat-completions"
    role: "Per-region specialist agent fan-out + iterative-loop scoring orchestration; sub-1s loop controller"
  brain_encoding_engine:
    tool: Meta TRIBE V2
    license: CC-BY-NC-4.0 (attribution required; non-commercial; hackathon-safe)
    availability: "facebookresearch/tribev2 on GitHub + facebook/tribev2 on HuggingFace"
    note: "Live GPU latency is risky — pre-cache offline mandatory for demo-day reliability"
  total_demo_cost_estimate: "~$0.03 per 90s demo execution"

verbatim_johnny_yaps_load_bearing_for_PRD:
  - "Humans are not machines, so we should use AI to augment, like fix the behavior gap of, like, we can't treat humans like machines and so we need some layer that we can predict almost like what sort of paragraph can align with humans with what's actually happening."
  - "What spatial intelligence means to them is basically adding in another form of information that helps the model infer about the overall environment. Us just using the [TRIBE V2] model is enough for them to consider that spatial intelligence, as long as the classification — the swarm mapping of what this brain wave maps back to the video — is what they're looking for in terms of spatial intelligence."
  - "The fundamental problem is that we have an issue with how vision can be processed. As in like you describe a scene, right? Like you would just describe somebody hitting something with a hammer, but through tech, you can't communicate it. Like there's no real way to communicate how you felt or inaction."
  - "It's almost like another way of translating like deliverables, like getting more confidence about the service, situation with the empathy layer so it's not just a straight did you do your job or did you not do your job. It's how did you do your job."
  - "Your superior doesn't give a damn that the patient has cancer and is dying and was asking why did you take 30 minutes to do this task."
  - "Productivity cannot be cut there because you've got to give your patients time to process the information."
  - "Two demo scenarios we are going to have be inputs, are the ironsite one which is tracking the data layer for videos from the job site, and then on the other end, its going to be processing visual data from a consumers day to day life."
  - "We can almost do it for all the other scenarios and simulate all the other industries and then that would be our listen labs."
  - "Manipulation only works in the dark. What happens to the internet when the lights come on?"
  - "I can throw in my open router for the QAN model. And then for the like the processing of the reasoning we can probably throw in your Anthropic. Use like a one Opus 4.7 call just to like summarize right? And then that way we can like balance the cost."
  - "We probably won't be able to do real time because of the scale of everything and we needed have handpicked selections of images and videos and we did do pre-training as well."
  - "We're not gonna lie about our results, but still we're gonna show them like a speed run of the process while also just running one in the background."
---

# Ironsight / Listen Labs — TECHNICAL PRD (Empathy Layer Engine)

**Authors:** Johnny Sheng (PM/Integration), Junsoo Kim (TRIBE V2), Jacob Cho (K2 swarm + iterative loop), Emilie Duran (Packaging + UI)
**Date:** 2026-04-25
**Codename:** Empathy Layer

> **One product. One engine. Two demo scenarios on the same overarching architecture. Pre-rendered TRIBE V2 activity JSON + Qwen vision + K2 swarm + K2 moderator + K2-swarm-as-evaluator iterative loop + embedding-proxy falsification + (optional) Opus polish. Different data sources per scenario; same engine binary. Build splittable across 3 parallel execution lanes. This document is the engineering-grade specification — strategic framing lives in `./ironsight-listenlabs-prd.md`. Companion build plan with file-level lane assignments: `caltech/build-plan-locked.md`.**

---

## §0. Reading Order for Engineers

For Junsoo (LANE-J — embedding proxy + control bake; TRIBE forward DROPPED) → §3 (architecture), §6.2 (activity.json schema as source-of-truth), §6.5 (embedding proxy contract), §10 (smoke tests #1, #7), §13 (LANE-J FRs revised).

For Jacob (LANE-K — K2 swarm + moderator + iterative loop) → §3, §6.3-§6.6 (data contracts), §8 (Stage 2 + iterative loop), §10 (smoke tests #2, #6, #7), §13 (LANE-K FRs revised).

For Johnny (LANE-O — Stage 1A vision + frontend + endpoints) → §3, §4 (stack), §6 (all contracts), §9 (orchestration glue + frontend), §10 (smoke tests #3, #4, #8), §13 (LANE-O FRs).

For Emilie (LANE-E — packaging + UI) → §3, §11 (output document UI), §12 (demo execution), §13 (LANE-E FRs).

**v2 lock:** TRIBE V2 is pre-rendered ONLY. No live forward, no live reverse. activity.json files in `backend/prerendered/{clip_id}/activity.json` are the canonical brain-data artifact and were generated offline before this build window. Anyone reading "TRIBE forward" in older sections of this PRD should mentally substitute "embedding proxy" or "K2 swarm-as-evaluator" depending on context.

---

## §1. The One-Size-Fits-All Problem Statement and Solution Statement

### Problem (verbatim Johnny, locked)

> *"Today's AI can describe what humans did and parse what humans said — but it cannot model the cognitive-emotional state underneath. The cognitive state that produced the spatial action (Ironsight's gap). The cognitive shift that produced the verbal agreement (Listen Labs's gap). Same underlying gap at different layers. Same failure mode: AI processes the surface but misses the model of the human underneath."*

> *"The fundamental problem is that we have an issue with how vision can be processed. As in like you describe a scene, right? Like you would just describe somebody hitting something with a hammer, but through tech, you can't communicate it. Like there's no real way to communicate how you felt or inaction."*

### Solution (verbatim Johnny, locked)

> *"A brain-grounded empathy translation engine. Two-stage agent pipeline (vision classification + empathy synthesis) with Meta's TRIBE V2 brain-encoding model as the in-between data layer and an iterative-scoring loop (Clair de Lune protocol inverted) that produces a falsifiable paragraph describing what the human felt during the captured video. Same engine. Multiple data sources. Different processing parameters per scenario."*

### The headline insight (also verbatim, locked)

> **"Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them."**

---

## §2. Two-Demo-Scenarios Contract (the build outputs)

| Scenario | Input data source | Persona | Beneficiary | Sponsor closes hit | Demo role |
|---|---|---|---|---|---|
| **A — Workplace Footage** | Egocentric body-cam / job-site video / patient-room footage / retail floor cam / kitchen cam / classroom recording | Manager / company / decision-maker reviewing worker performance | The worker (gets context-aware management) + the company (preserves customer/employee outcomes) | Ironsight (CORE — primary $5K target) + Listen Labs (CORE — generalization across industries IS the simulation deliverable) | Primary live demo (90s); Ironsight pavilion swap-in for construction-specific footage |
| **B — Consumer Day-to-Day** | Reels/TikTok feed screen-recording / phone screen-record of any digital activity / daily-life clip | Maya, Gen-Z teen (or any consumer) | The user themselves (gets a brain-grounded journal of their own experience) | Sideshift (CORE substrate) + YC stretch (future-Obsidian framing) | Secondary overlay; consumer-track pavilion swap |

**SAME ENGINE BACKING BOTH.** Stage 1 vision-classification → TRIBE V2 brain-encoding → Stage 2 empathy-synthesis → iterative-scoring loop → falsification check → empathy-layer document. The prompt registry (§4.5) hot-swaps per-scenario configuration; the engine binary is one.

---

## §3. Architecture Diagram (the engine — v2)

```
                  [INPUT: matched to prerendered/<clip_id>/]
                              │
                ┌─────────────┴──────────────┐
                ▼                            ▼
   ┌─────────────────────────┐   ┌─────────────────────────────┐
   │  STAGE 1A — Qwen3-VL    │   │  STAGE 1B — K2 SWARM        │
   │  (OpenRouter)           │   │  (7 parallel calls)         │
   │                         │   │                             │
   │  qwen/qwen3-vl-235b-    │   │  Reads:                     │
   │   a22b-instruct         │   │   prerendered/<clip>/       │
   │  $0.20 in / $0.88 out   │   │     activity.json           │
   │                         │   │   backend/prompts/          │
   │  Reads 5 video frames.  │   │     {network}.md (× 7)      │
   │  Outputs vision_report  │   │                             │
   │  JSON: actions, scene,  │   │  Per region emits:          │
   │  spatial relations.     │   │   reading (1-2 sentences)   │
   │  NO emotion claims.     │   │   confidence                │
   │                         │   │   citation                  │
   │  Lane: [LANE-O]         │   │                             │
   │  Latency: ≤ 10s         │   │  Aggregated swarm_readings  │
   │  Cache: vision_report   │   │  Lane: [LANE-K]             │
   │    .json                │   │  Latency: ≤ 8s parallel     │
   │                         │   │  Cache: swarm_readings.json │
   └────────────┬────────────┘   └──────────────┬──────────────┘
                │                               │
                └──────────────┬────────────────┘
                               ▼
              ┌──────────────────────────────────────────┐
              │  STAGE 2 — EMPATHY SYNTHESIS (K2)        │
              │  K2 Think as moderator                   │
              │  ~2000 tok/s; OpenAI-compatible          │
              │                                          │
              │  System prompt:                          │
              │   backend/prompts/moderator_synthesis.md │
              │  Input: vision_report + swarm_readings   │
              │   (+ prior_score + per_region_miss on    │
              │    rounds ≥ 2)                           │
              │                                          │
              │  Output: ONE paragraph (150-300 words)   │
              │   literature-grade prose                 │
              │   forbidden-claim guardrails (§5)        │
              │                                          │
              │  Lane: [LANE-K]                          │
              │  Latency: ≤ 5s per candidate             │
              └──────────────────┬───────────────────────┘
                                 ▼
              ┌──────────────────────────────────────────┐
              │  STAGE 3 — ITERATIVE LOOP                │
              │  K2 swarm AS EVALUATOR                   │
              │  (the Clair-de-Lune-protocol substitute) │
              │                                          │
              │  For round in 1..8 (plateau-exit):       │
              │    a) 7 parallel K2 evaluator calls      │
              │       prompt: prompts/evaluator_score.md │
              │       input per call: candidate +        │
              │              one region's reading        │
              │       output: score (0..1) +             │
              │               1-sentence justification   │
              │    b) overall_score = mean of 7 scores   │
              │    c) per_region_attribution recorded    │
              │    d) IF round ≥ 3 AND |Δ| < 0.02 over   │
              │       2 consecutive rounds OR round==8:  │
              │         exit                             │
              │       ELSE: feed per_region_miss to      │
              │             Stage 2 → next candidate     │
              │                                          │
              │  Output:                                 │
              │   best_paragraph (highest-scoring round) │
              │   final_score                            │
              │   round_trajectory (8 rows max)          │
              │   per_region_attribution                 │
              │                                          │
              │  Lane: [LANE-K]                          │
              │  Latency: ≤ 60s (8 rounds full)          │
              │  Cache: empathy.json + iterative_        │
              │         trajectory.json                  │
              └──────────────────┬───────────────────────┘
                                 ▼
              ┌──────────────────────────────────────────┐
              │  STAGE 4 — POLISH (optional)             │
              │  Anthropic Claude Opus 4.7               │
              │                                          │
              │  ONE call. ~100-word literary polish     │
              │  pass over best_paragraph.               │
              │  CUT-LINE — drop first if behind.        │
              │  K2 best_paragraph ships as-is on cut.   │
              │                                          │
              │  Lane: [LANE-O]                          │
              │  Latency: ≤ 5s                           │
              └──────────────────┬───────────────────────┘
                                 ▼
              ┌──────────────────────────────────────────┐
              │  STAGE 5 — FALSIFICATION (proxy)         │
              │  Embedding proxy stand-in for TRIBE      │
              │  forward (no live TRIBE).                │
              │                                          │
              │  embed_text(paragraph)  → 384-dim         │
              │   (sentence-transformers/all-MiniLM-L6   │
              │    -v2; CPU; ~50ms; lazy singleton)      │
              │  project_to_yeo7(emb)   → 7-dim          │
              │   via W matrix (384 × 7) fit offline     │
              │   from training_pairs.yaml               │
              │  activity_target_vector(activity.json)   │
              │                         → 7-dim mean     │
              │                                          │
              │  similarity = cos(projected, target)     │
              │  control_score = cos(projected, control_ │
              │                       activity.json)     │
              │  delta = similarity − control_score      │
              │  verdict = "anchored" if delta > 0.40    │
              │            else "generic_plausible"      │
              │                                          │
              │  Lane: [LANE-J]                          │
              │  Latency: ≤ 200ms                        │
              │  Cache: falsification.json               │
              └──────────────────┬───────────────────────┘
                                 ▼
              ┌──────────────────────────────────────────┐
              │  EMPATHY-LAYER DOCUMENT (frontend)       │
              │                                          │
              │  §A Vision Report (Stage 1A)             │
              │  §B Empathy Paragraph (Stage 4 if        │
              │     present, else Stage 3 best)          │
              │     + brain-pattern similarity readout   │
              │  §C Falsification Evidence (Stage 5)     │
              │     + per-region attribution (Stage 3)   │
              │     + round trajectory (collapsed)       │
              │                                          │
              │  PersonaShell variant:                   │
              │   workplace (ironside)                   │
              │   consumer  (twitter / listenlabs)       │
              │   pavilion  (judge-facing)               │
              │                                          │
              │  Lane: [LANE-O] frontend +               │
              │        [LANE-E] design                   │
              └──────────────────────────────────────────┘
```

**Pre-warmup contract (the brain-3D-interaction lock).** On `POST /demo/match`,
a `BackgroundTask` (`services/warmup.py:warmup_clip`) pre-bakes every Layer 1 cache
file: `vision_report.json`, `swarm_readings.json`, `k2_region_cache.json` (all 7
networks × N seconds for instant /demo/k2-region clicks), and `empathy.json` (which
includes `iterative_trajectory` and `falsification` payloads). Frontend polls
`/demo/warmup-status/{clip_id}` until `ready: true`, then transitions Loading →
Main. Subsequent UI interactions read from the in-process `SESSION_CACHE` dict
(O(1) memory) → disk cache → cold compute, in that order. **Brain-3D clicks never
block on a live LLM call.**

**End-to-end latency budget (post-warmup):** all reads are O(1) — disk or memory.
Cold warmup: Stage 1A ≤ 10s, Stage 1B ≤ 8s, k2_region_cache pre-bake ~35s with
`asyncio.Semaphore(6)`, Stage 2+3 iterative ≤ 60s (8 rounds), Stage 5 ≤ 200ms.
Total cold warmup ≈ 90-110s per clip. Saturday 8 AM pre-cache freeze runs warmup
once and commits the JSON files to repo, so demo-day warmup is just disk reads.

---

## §4. Stack Decisions (locked after sub-agent C validation)

### 4.1 Stage 1 — Vision Classification

**Tool:** Qwen3-VL via OpenRouter
**Model ID:** `qwen/qwen3-vl-235b-a22b-instruct` ← **CRITICAL: Johnny said "Qwen 3.5" verbatim; that model name does NOT exist. Sub-agent C corrected to Qwen3-VL.**
**Cost:** $0.20 input / $0.88 output per M tokens
**Why:** Beats GPT-5 on OCR; competitive on general vision; reasonable cost; Johnny's verbatim concern that *"Anthropic vision is actually like terrible"* is honored by routing to Qwen instead of Claude vision.
**API surface:** OpenAI-compatible chat-completions via OpenRouter gateway (`https://openrouter.ai/api/v1`). Johnny's verbatim: *"I can throw in my open router for the QAN model."*
**Auth:** Use Johnny's OpenRouter API key.
**Risk flag (sub-agent C):** Fix the "Qwen 3.5" naming bug in all docs — referencing the wrong model ID will cause 404s.

### 4.2 Stage 2 — Empathy Synthesis (v2: K2 moderator)

**Tool:** Cerebras K2 Think (moderator role; same surface as Stage 1B and Stage 3 evaluator)
**Cost:** Free (sponsor-eligible IFM K2 CORE track).
**Why (v2 change):** Stage 2 used to run on Opus 4.7. Two reasons we swapped to K2: (a) the iterative loop fires Stage 2 once per round — Opus latency × 8 rounds was the budget killer; (b) K2 already wrote the per-region readings in Stage 1B, so the moderator role keeps the surface coherent. Opus is now reserved for Stage 4 polish only.
**Prompt:** `backend/prompts/moderator_synthesis.md`
**Code:** `backend/services/empathy_synthesis.py:synthesize`
**Inputs:** `vision_report` (Stage 1A) + `swarm_readings` (Stage 1B) + (rounds ≥ 2) `prior_score` + `per_region_miss`.
**Output:** ONE candidate paragraph (string, 150-300 words). Forbidden-claim guardrails (§5) enforced via `services.guardrails.pass_guardrail_pre_flight` with one-shot retry on FAIL.

### 4.2b Stage 4 — Optional Polish (the only place Opus 4.7 runs)

**Tool:** Anthropic Claude Opus 4.7 (`claude-opus-4-7`)
**Cost:** $5 in / $25 out per M tokens (+35% tokenizer bloat).
**Role:** ~100-word literary polish over the K2 best paragraph. Cut-line cherry — first to drop if behind 8 PM Saturday. K2's `best_paragraph` ships as-is when polish is cut.
**Latency:** ≤5s.

### 4.3 K2 Think — three roles on one surface (v2)

**Tool:** Cerebras K2 Think
**Speed:** ~2000 tok/s
**API surface:** OpenAI-compatible chat-completions at `https://api.k2think.ai/v1`
**Auth:** Bearer `<K2THINK_API_KEY>`

In v2, K2 plays **three roles** on the same surface (see §3 architecture diagram for placement):

1. **Stage 1B — Per-region specialists.** 7 parallel calls (one per Yeo7 network) read `activity.json` aggregates and emit `(reading, confidence, cite)` per region. Code: `services/swarm_runner.py:run_swarm`.
2. **Stage 2 — Moderator.** ONE call combines vision + swarm readings (+ prior_score / per_region_miss on rounds ≥ 2) into a candidate paragraph. Code: `services/empathy_synthesis.py:synthesize`.
3. **Stage 3 — Evaluator swarm.** Per round, 7 parallel evaluator calls — one per network — rate the candidate paragraph. Each emits a 0..1 score + 1-sentence justification. Mean = round_score. Plateau exit on |Δ|<0.02 over 2 consecutive rounds OR round 8. Code: `services/iterative_loop.py:run_iterative_loop`.

**Concurrency:** `asyncio.gather(*calls)` for the 7-call swarms (no semaphore needed inside one stage). Cross-stage `asyncio.Semaphore(6)` only inside the warmup task (`services/warmup.py`) when pre-baking the 7 × N k2_region_cache grid for instant brain-3D clicks.

### 4.4 Brain-Encoding Engine — PRE-RENDERED ONLY (v2)

**Tool:** Meta TRIBE V2 (offline only — never runs live in this build)
**Availability:** `facebookresearch/tribev2` on GitHub + `facebook/tribev2` on HuggingFace
**License:** CC-BY-NC-4.0 (attribution required; non-commercial; **hackathon-safe**)
**Specs:** ~20,000 cortical-surface vertices on fsaverage5 mesh; trained on ~25 deeply-scanned subjects (~451.6 hours fMRI); 1Hz temporal resolution; 5s HRF lag.

**v2 rule:** TRIBE V2 was used offline to produce `backend/prerendered/<clip>/activity.json` for each demo clip. The runtime never invokes TRIBE in any direction. The `activity.json` files on disk are the canonical brain-data artifact.

**The forward-direction iterative-loop scoring** (the load-bearing piece in v1.0) is replaced by TWO mechanisms:
- **Semantic scoring** — K2-swarm-as-evaluator (§4.3 role 3) produces real per-region scores from each region's specialist's read on the candidate paragraph. This is what climbs the BEAT-3 score bar.
- **Numerical falsification** — sentence-transformer embedding proxy (§4.4b) produces real cosine similarity numbers for §C of the empathy document.

**Forbidden claims (load-bearing — unchanged from v1):** No reverse inference. No clinical claims. No sub-second predictions. No inflated numbers (~20K vertices / ~25 subjects only). Within-subject contrast only.

### 4.4b Embedding Proxy (Stage 5 — v2 only)

**Tool:** `sentence-transformers/all-MiniLM-L6-v2` (CPU, lazy singleton)
**Code:** `backend/services/embedding_proxy/__init__.py` + `services/falsification.py`
**Projection map:** 384 × 7 matrix `W` saved to `backend/services/embedding_proxy/projection_map.npy`, fit once via `np.linalg.lstsq` on 10 hand-paired (paragraph, per-network mean activation) examples in `training_pairs.yaml`. Re-fit script: `backend/scripts/fit_projection_map.py`.
**Math:**
```
similarity     = cos(emb @ W, mean(activity.frames[*].regions))
control_score  = cos(emb @ W, mean(control_activity.frames[*].regions))
delta          = similarity − control_score
verdict        = "anchored" if delta > 0.40 else "generic_plausible"
```
**Why:** stand-in for live TRIBE forward inference. Deterministic, ~50ms per call, no GPU. Real numbers — not hand-baked. The "anchored" threshold (0.40) inherits from v1.0; recalibrate Saturday 4 AM after smoke #7 if the proxy's score distribution differs materially from TRIBE's.

### 4.5 Prompt Registry — simplified in v2

The per-scenario specialist-roster swap is collapsed in v2: both scenarios run the same 7 Yeo7-network swarm (`backend/prompts/{visual,somatomotor,dorsal_attention,ventral_attention,limbic,frontoparietal,default_mode}.md`). Scenario-specific tuning lives only in the moderator + the frontend persona shell.

The runtime "registry" reduces to:

```python
SCENARIO_CONFIG = {
    "ironside": {
        "control_clip_id":    "workplace_routine_baseline",
        "persona_render_mode":"workplace",   # frontend PersonaShell variant
    },
    "consumer": {
        "control_clip_id":    "curated_short_film_baseline",
        "persona_render_mode":"consumer",
    },
}
```

Scenario tagging is stored in `backend/prerendered/<clip_id>/scenario.json` and read by `main.py:_load_scenario`. Surfaced to the frontend in `/demo/match` and `/demo/clips` responses.

The 7 specialist prompts plus the two new prompts (`moderator_synthesis.md`, `evaluator_score.md`) are scenario-agnostic — they work on any activity.json + any candidate paragraph.

**Lane owner:** [LANE-O] for `vision_client.py` + frontend persona render; [LANE-K] for moderator + evaluator prompts.

### 4.6 Total Demo Cost Estimate (v2)

**Per 90s demo execution:** ≈ $0.02. Breakdown:
- Stage 1A Qwen3-VL call: ~$0.01
- Stage 4 Opus 4.7 polish (single ~150-token call, optional): ~$0.01
- Stage 1B / Stage 2 / Stage 3 K2 calls: free (Cerebras-sponsored)
- TRIBE V2: free (pre-rendered, no live inference)
- Stage 5 embedding-proxy falsification: free (CPU)

**Demo-day budget:** even with 50 demo runs across pavilion judging, total cost ≈ $1.00. Negligible. Once `/demo/match` warmup commits the cache JSON, subsequent demo runs cost $0 (disk reads only).

---

## §5. Forbidden-Claim Guardrails (NON-NEGOTIABLE — apply to ALL outputs)

These guardrails apply to every Opus-generated empathy paragraph, every voiceover line, every Devpost paragraph, every sponsor swap-slide.

| Forbidden | Why | Allowed alternative |
|---|---|---|
| Reverse inference (*"she felt grief"*) | Scientifically invalid per Poldrack 2006 | *"emotional-processing specialist sustained engagement"* |
| Clinical claims (*"clinical fatigue"*) | License + framing | *"workforce-context augmentation, not psychological evaluation"* |
| Sub-second predictions | TRIBE is 1Hz with 5s HRF lag | Per-second granularity only |
| Population-norm comparison (*"average healthy brain"*) | T1 lock | Within-subject contrast only |
| Inflated TRIBE numbers (70K voxels / 700 subjects) | Canonical-reference T1 lock | ~20K vertices / ~25 subjects |
| "Reads inner monologue" framing | Reverse-inference variant | *"Predicts neural response patterns"* |

**Enforcement:** Stage 2 prompt MUST include explicit guardrail block. Empathy-paragraph output MUST be screened by a regex pre-flight check before rendering (e.g., flag *"she felt"* / *"he was thinking"* / *"clinical"* / *"diagnosis"* / *"average"* / *"normal"* keywords).

---

## §6. Data Contracts (THE I/O specification)

### 6.1 Input Video → TRIBE V2 (Junsoo's pipeline)

```json
{
  "input_type": "video_file",
  "format": "MP4 (H.264) or WebM",
  "min_resolution": "720p",
  "min_duration_s": 30,
  "max_duration_s": 90,
  "audio_track": "optional (TRIBE accepts audio + video + language input)"
}
```

### 6.2 TRIBE V2 → Brain Pattern JSON (Junsoo emits; consumed by Jacob + Stage 2)

```json
{
  "video_id": "demo-input-1.mp4",
  "scenario": "ironsight_workplace",
  "tribe_version": "v2",
  "mesh": "fsaverage5",
  "n_vertices": 20484,
  "temporal_resolution_hz": 1,
  "hrf_lag_s": 5,
  "frames": [
    {
      "time_s": 0,
      "regions": {
        "visual_attention": { "activation": 0.78, "vertex_ids": [12, 47, 102, ...] },
        "threat_detection": { "activation": 0.31, "vertex_ids": [89, 215, ...] },
        "prefrontal_engagement": { "activation": 0.42, "vertex_ids": [403, 519, ...] }
      }
    },
    {
      "time_s": 1,
      "regions": { /* ... */ }
    }
    // ... per-second up to video duration
  ]
}
```

**Schema-validated** on producer side (Junsoo's Pydantic model). Consumer (Jacob) fails gracefully on schema mismatch.

### 6.3 TRIBE V2 forward-direction (text input) → Predicted Brain Pattern (Junsoo emits; consumed by iterative loop)

```json
{
  "input_type": "text",
  "input_text": "She moved through the scaffolding...",
  "predicted_brain_pattern": {
    "mesh": "fsaverage5",
    "n_vertices": 20484,
    "regions": {
      "visual_attention": { "activation": 0.62 },
      "threat_detection": { "activation": 0.18 },
      "prefrontal_engagement": { "activation": 0.71 }
      // ... all regions in scenario specialist roster
    }
  }
}
```

**Same schema as 6.2** for consistency; iterative loop computes cosine similarity over the `regions.*.activation` flattened vector.

### 6.4 Stage 2 Empathy Synthesis Output (Opus emits; consumed by iterative loop + output document)

```json
{
  "candidate_paragraph": "She moved through the scaffolding like someone whose attention had already left for the day...",
  "round_n": 3,
  "specialist_roster_used": ["visual_attention", "threat_detection", ...],
  "guardrail_pre_flight": "passed",  // or "flagged: 'felt' detected at char 47"
  "model_metadata": {
    "model": "claude-opus-4-7",
    "input_tokens": 2840,
    "output_tokens": 247,
    "latency_ms": 4720
  }
}
```

### 6.5 Iterative Loop Output (Jacob emits; consumed by output document)

```json
{
  "best_paragraph": "She moved through the scaffolding like someone whose attention...",
  "final_score": 0.84,
  "round_trajectory": [
    { "round": 1, "score": 0.42, "paragraph_excerpt": "Worker walked..." },
    { "round": 2, "score": 0.58, "paragraph_excerpt": "She entered the scaffolding..." },
    { "round": 3, "score": 0.65, "paragraph_excerpt": "She moved through..." },
    { "round": 4, "score": 0.71, "paragraph_excerpt": "She moved through the scaffolding..." },
    { "round": 5, "score": 0.79, "paragraph_excerpt": "She moved through the scaffolding like..." },
    { "round": 6, "score": 0.81, "paragraph_excerpt": "She moved through the scaffolding like someone..." },
    { "round": 7, "score": 0.83, "paragraph_excerpt": "She moved through the scaffolding like someone whose..." },
    { "round": 8, "score": 0.84, "paragraph_excerpt": "She moved through the scaffolding like someone whose attention had already left for the day..." }
  ],
  "per_region_attribution": {
    "default_mode": { "candidate_match": 0.91, "target": 0.87 },
    "prefrontal_engagement": { "candidate_match": 0.78, "target": 0.81 }
  }
}
```

### 6.6 Falsification Check Output (Junsoo + Jacob emit; consumed by output document)

```json
{
  "main_video_id": "demo-input-1.mp4",
  "control_video_id": "workplace_routine_baseline.mp4",
  "main_paragraph_score": 0.84,
  "control_paragraph_score": 0.27,
  "falsification_delta": 0.57,
  "verdict": "anchored"  // delta > 0.40 = anchored; ≤ 0.40 = generic-plausible (red flag)
}
```

### 6.7 Empathy-Layer Document (Emilie's UI consumes; renders for end user)

```json
{
  "render_mode": "workplace_boss_facing",  // or "consumer_user_facing", "pavilion_judge_facing"
  "vision_report": { /* §6.1 Stage 1 output */ },
  "empathy_paragraph": { /* §6.5 best_paragraph + final_score */ },
  "falsification_evidence": { /* §6.6 */ },
  "round_trajectory_visualization": [ /* §6.5 round_trajectory for animated reveal */ ]
}
```

---

## §7. Stage 0 + Stage 1 Build Specification (Junsoo + Johnny)

### Stage 0 — Input Capture

- Demo input is uploaded video file (no live recording for v1).
- Workplace scenario inputs: hand-curated egocentric footage (construction OR healthcare patient-room OR retail floor OR food-service kitchen) — Emilie sources Saturday morning via Ironsight-provided dataset OR public clips.
- Consumer scenario inputs: screen-recording of Reels/TikTok feed (uploaded by user OR pre-recorded for hackathon demo input).

### Stage 1 — Vision Classification (Johnny owns integration)

```python
import openai
import os

openrouter_client = openai.OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

response = openrouter_client.chat.completions.create(
    model="qwen/qwen3-vl-235b-a22b-instruct",
    messages=[
        {"role": "system", "content": IRONSIGHT_VISION_PROMPT},
        {"role": "user", "content": [
            {"type": "video", "video_url": video_url},
            {"type": "text", "text": "Describe scene: actions, environment, tools, temporal sequence, spatial relationships."}
        ]}
    ],
    response_format={"type": "json_object"},
    max_tokens=1500,
    timeout=15
)

vision_report_json = response.choices[0].message.content
```

### Iterative scoring loop integration (Junsoo emits forward-direction inference)

Junsoo provides a callable: `tribe_v2_score(text: str, target_brain_pattern: dict) -> float` that returns cosine similarity. Latency target ≤ 2s per call.

---

## §8. Stage 2 + Iterative Loop Build Specification (Jacob + Johnny)

### Stage 2 Empathy Synthesis (Johnny owns prompt; Jacob owns orchestration)

```python
import anthropic

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def stage2_synthesize(vision_report, brain_pattern, prior_round=None, prior_score=None, per_region_miss=None):
    system_prompt = WORKPLACE_EMPATHY_SYNTHESIS_PROMPT  # or CONSUMER per scenario
    user_message = build_synthesis_user_message(vision_report, brain_pattern, prior_round, prior_score, per_region_miss)
    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=400,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
        timeout=10
    )
    candidate = response.content[0].text
    if not pass_guardrail_pre_flight(candidate):
        candidate = retry_with_stricter_guardrails(candidate)
    return candidate
```

### Iterative-Scoring Loop Orchestration (Jacob owns)

```python
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

semaphore = asyncio.Semaphore(6)

async def iterative_loop(vision_report, brain_pattern_target, max_rounds=8, plateau_threshold=0.02):
    round_trajectory = []
    best_paragraph = None
    best_score = 0.0
    prior_score = None
    per_region_miss = None
    for round_n in range(1, max_rounds + 1):
        async with semaphore:
            candidate = await stage2_synthesize_async(vision_report, brain_pattern_target, round_n, prior_score, per_region_miss)
        score, per_region_attribution = await tribe_v2_score_async(candidate, brain_pattern_target)
        round_trajectory.append({"round": round_n, "score": score, "paragraph_excerpt": candidate[:80]})
        if score > best_score:
            best_paragraph = candidate
            best_score = score
        if prior_score is not None and (score - prior_score) < plateau_threshold:
            break
        prior_score = score
        per_region_miss = compute_per_region_miss(per_region_attribution, brain_pattern_target)
    return {"best_paragraph": best_paragraph, "final_score": best_score, "round_trajectory": round_trajectory, "per_region_attribution": per_region_attribution}
```

K2 wraps Stage 2 for sub-1s loop coordination if needed. Default flow above uses Opus for Stage 2 directly with K2 standby for parallel-fan-out per-region calls (if specialist roster is invoked).

---

## §9. Orchestration Glue + Frontend (Johnny + Emilie)

### `.worktrees/johnny-orch-glue` (Johnny's third sibling Claude)

- Demo runbook: sequences BEAT-0 → BEAT-5 with absolute time anchors
- Per-component pre-cache fallback swap logic (per-stage MP4 / JSON / static-image fallback)
- Mock contracts for per-worktree development without blocking
- Wi-Fi contingency: full backup MP4 of entire 90s

### `.worktrees/johnny-vis-brain` (Johnny's first sibling Claude)

- Three.js / R3F 3D cortical mesh rendering (~20K vertices on fsaverage5, ≥30 FPS on demo laptop)
- Per-region activation glow synced to brain JSON timestamp
- Within-subject toggle (BEAT-3) — two cortical meshes side-by-side

### `.worktrees/johnny-vis-graph` (Johnny's second sibling Claude)

- 3D knowledge-graph layer in separate spatial layer (NOT painted on cortex per Johnny's explicit cut)
- Hover-bridges between brain regions (grayed default, light up on focus, reasoning fragments flow)
- **Iterative-loop visualization (THE HERO REVEAL):** round-by-round score climbing as fillable bar; candidate paragraph fading in/out per round; 8-round trajectory animated over ~25s
- Empathy-layer document UI (Emilie owns design; this worktree integrates rendering)

---

## §10. Friday-Night 8-Test Smoke Gate (RUN 8-11 PM FRIDAY)

| # | Test | Owner | Threshold | Fallback if fail |
|---|---|---|---|---|
| 1 | TRIBE V2 reverse inference latency on 30s clip on demo GPU | [LANE-J] Junsoo | < 30s | Pre-cache BEAT-1 MP4; live mode disabled |
| 2 | K2 + Opus iterative-loop test (8 rounds) | [LANE-K] Jacob | All 8 rounds complete in < 60s; zero timeouts | Pre-cached iterative-loop trajectory |
| 3 | Renaissance differentiation rehearsal | [LANE-E] Emilie + [LANE-O] Johnny | First 60s shown to "Renaissance scorer" — no pattern-match within 10s | Re-cut first 10s |
| 4 | 3D mesh rendering FPS on demo laptop | [LANE-O] Johnny | ≥ 30 FPS (fsaverage5 + iterative-loop overlay) | Mesh decimation / pre-baked camera motion |
| 5 | Wi-Fi contingency (full demo on phone hotspot) | [LANE-O] Johnny + [LANE-E] Emilie | Zero API timeouts | Full backup MP4 |
| 6 | Stage 1 (Qwen3-VL) latency + JSON validity | [LANE-K] Jacob + [LANE-O] Johnny | ≤ 10s; JSON schema valid | Pre-cached vision-report JSON |
| 7 | Falsification check effectiveness | [LANE-J] Junsoo + [LANE-K] Jacob | Control delta ≥ 0.40 on test paragraph | Hand-tune control video selection |
| 8 | Demo determinism (2 back-to-back same-input runs) | [LANE-O] Johnny | < 5% variance in final paragraph | temp=0, lock seeds, pre-record |

**Failure on any → mandatory mitigation immediately.**

---

## §11. Output Document UI (Emilie owns)

### Three-section render

**§A — Vision Report** (Stage 1 output, top of document)
- Action-data baseline; what the manager would have seen WITHOUT the empathy layer
- Read: *"Nurse spent 30 min in Patient Room 4. Action: sat with patient, adjusted IV, held hand."*

**§B — Empathy Layer Paragraph** (iterative-loop best output, hero of document)
- The brain-grounded translation of what the human felt
- Magazine-cover-quality typography; literature-grade prose
- Below paragraph: similarity score (large, prominent) — e.g., *"Brain-pattern similarity: 0.84"*

**§C — Falsification Evidence** (proves the paragraph is anchored, footer of document)
- Falsification delta vs. control (e.g., *"Falsification check (same nurse on routine vitals visit): 0.27, confirming the description is specifically anchored to this scene"*)
- Per-region attribution table (which regions captured well, which missed)
- Round-by-round trajectory visualization (small, optional expand)

### Persona-driven framing modes

- **Workplace (boss-facing):** Action data preserved + empathy context added; manager-decision-aware framing
- **Consumer (user-facing):** Daily journal entry shape; vault accumulation context
- **Pavilion (judge-facing):** Demo artifact emphasis; iterative-loop trajectory more prominent

---

## §12. Demo Execution Spec (90s on stage)

| Beat | Time | What plays | Engine stage running | Owner |
|---|---|---|---|---|
| BEAT-0 | off-timer | Sponsor close swap-in slide (4 variants pre-rendered: Ironsight / Listen Labs / Sideshift / YC) | Static asset | Emilie |
| BEAT-1 | 0:00–0:15 | Workplace footage plays alongside Stage 1 vision-classification output | Stage 1 (Qwen3-VL); pre-cached | Emilie + Johnny |
| BEAT-2 | 0:15–0:35 | TRIBE V2 brain-encoding renders; 3D cortical mesh glowing in sync; hover-bridges show per-region specialist activations | TRIBE V2 reverse; pre-cached for live demo | Junsoo + Johnny |
| **BEAT-3** | **0:35–1:00** | **Iterative-scoring loop runs visibly. Round 1: 0.42 → Round 8: 0.84. The score climbing IS the visual reveal.** | Stage 2 + iterative loop; live OR pre-cached trajectory | Jacob + Johnny |
| BEAT-4 | 1:00–1:25 | Final empathy-layer paragraph appears in full. Voiceover reads it aloud. Similarity 0.84 + falsification delta 0.27 displayed | Output document render | Emilie + Johnny |
| BEAT-5 | 1:25–1:30 | Side-by-side: action-data report ("over threshold; cut to 10 min") vs. empathy-layer document ("she held space; brain-grounded; falsified") | Side-by-side rendering | Emilie + Johnny |
| BEAT-5 close | off-timer | Sponsor-specific close slide | Static asset | Emilie |

**Live-with-pre-cache strategy (per Decision 011 + per Johnny verbatim):**
> *"We probably won't be able to do real time because of the scale of everything... we did do pre-training as well... we're not gonna lie about our results, but still we're gonna show them like a speed run of the process while also just running one in the background."*

Demo runs Saturday-8AM-pre-baked assets primarily. Live attempt runs in background; if it lands, swap in. If not, pre-cache is the demo. Honest framing throughout.

---

## §13. Functional Requirements (FR1–FR60) — split per execution lane

### LANE-J (Junsoo — TRIBE V2 reverse + forward + control bake)

- **FR-J1.** TRIBE V2 reverse-direction pipeline ingests video file (MP4, H.264, ≥720p, 30-90s).
- **FR-J2.** Pipeline produces per-second per-region activation JSON conforming to §6.2 schema.
- **FR-J3.** Pipeline emits ~20,000-vertex predictions on fsaverage5 mesh per second.
- **FR-J4.** Pipeline supports both workplace input (egocentric footage) AND consumer input (Reels screen-recording).
- **FR-J5.** Pipeline supports forward-direction text-input scoring: callable `tribe_v2_score(text, target) -> (score, per_region_attribution)` per §6.3.
- **FR-J6.** Pre-cached brain JSON for ALL demo input clips by Saturday 8 AM.
- **FR-J7.** Pre-cached brain JSON for control footage (workplace_routine_baseline.mp4 + curated_short_film_baseline.mp4) by Saturday 8 AM.
- **FR-J8.** Pipeline honors all forbidden-claim guardrails (§5).
- **FR-J9.** Pipeline emits output via Pydantic schema-validated JSON.
- **FR-J10.** Pre-baked side-by-side MP4 for BEAT-3 within-subject toggle by Saturday 8 AM.

### LANE-K (Jacob — K2 swarm + iterative loop + falsification)

- **FR-K1.** K2 Cerebras integration via OpenAI-compatible chat-completions API at `https://api.k2think.ai/v1`.
- **FR-K2.** Iterative-scoring loop orchestration with `asyncio.Semaphore(6)` + Pydantic strict + brace-balanced JSON extractor + 3-attempt retry + 120s timeout per `research/wiki/tools/k2-think.md` template.
- **FR-K3.** Iterative loop calls Stage 2 (Opus) for paragraph generation each round.
- **FR-K4.** Iterative loop calls Junsoo's TRIBE forward-direction scoring callable each round.
- **FR-K5.** Cosine similarity computation between candidate's predicted brain-pattern and TARGET brain-pattern.
- **FR-K6.** Iterative loop continues until score plateaus (delta < 0.02 over 2 consecutive rounds) OR 8 rounds reached.
- **FR-K7.** Iterative loop returns best paragraph + final score + all-round trajectory per §6.5 schema.
- **FR-K8.** Iterative loop latency ≤ 60s for 8-round full execution (or ≤ 35s for 5-round shortened).
- **FR-K9.** Falsification check: score best paragraph against control-video brain-pattern; emit delta per §6.6.
- **FR-K10.** Pre-cached iterative-loop trajectory for demo input (Saturday 8 AM bake) as fallback.
- **FR-K11.** Per-region attribution computed per round for cross-talk-soup defense + observability.
- **FR-K12.** Optional: per-region specialist swarm (8 K2 calls in parallel using specialist roster from prompt registry §4.5) feeds Stage 2 with multi-perspective context.

### LANE-O (Johnny — Stage 1 vision + integration glue + frontend)

- **FR-O1.** Stage 1 vision agent integrates Qwen3-VL via OpenRouter (`qwen/qwen3-vl-235b-a22b-instruct`) using OpenAI-compatible API.
- **FR-O2.** Stage 1 produces Vision Report JSON conforming to §6.1 schema; Pydantic-validated.
- **FR-O3.** Stage 1 latency ≤ 10s for 30s clip; pre-cached fallback bake.
- **FR-O4.** Stage 2 Opus 4.7 integration via Anthropic Messages API; prompt loaded from prompt registry §4.5.
- **FR-O5.** Prompt registry (§4.5) hot-swap mechanism — runtime config switch between Ironsight + Listen Labs scenarios.
- **FR-O6.** Three-Claude-sibling orchestration: vis-brain (3D mesh) + vis-graph (knowledge-graph + iterative-loop reveal) + orch-glue (integration + fallback).
- **FR-O7.** Per-component pre-cache fallback swap logic at every stage boundary.
- **FR-O8.** Demo runbook sequences BEAT-0 → BEAT-5 with absolute time anchors per §12.
- **FR-O9.** Frontend renders fsaverage5 cortical mesh ~20K vertices at ≥30 FPS using Three.js or R3F (Friday 2 PM pick).
- **FR-O10.** Frontend renders 3D knowledge-graph layer in separate spatial layer (NOT painted on cortex).
- **FR-O11.** Frontend renders hover-bridges (grayed default, light up on focus, reasoning fragments flow).
- **FR-O12.** Frontend renders iterative-loop visualization (round-by-round score climbing as fillable bar).
- **FR-O13.** Frontend renders within-subject toggle (BEAT-3).
- **FR-O14.** Wi-Fi contingency: full backup MP4 of entire 90s.
- **FR-O15.** Demo determinism: temp=0, lock seeds, pre-record fallback for back-to-back consistency.
- **FR-O16.** Final product name + headline picked Saturday 6 PM; integrated across all UI surfaces.
- **FR-O17.** Guardrail pre-flight regex check on every Opus output before rendering.

### LANE-E (Emilie — packaging + UI + storytelling + sponsor closes)

- **FR-E1.** Empathy-layer document UI design: three-section render (§A Vision Report + §B Empathy Paragraph + §C Falsification Evidence) per §11.
- **FR-E2.** Three persona-driven framing modes: workplace / consumer / pavilion.
- **FR-E3.** Magazine-cover-quality typography for §B empathy paragraph.
- **FR-E4.** Pre-cached cinematic Acts 1+4 launch video shot Friday evening per `caltech/video-story.md` §6.
- **FR-E5.** Sponsor swap-slides pre-rendered (4 variants: Ironsight / Listen Labs / Sideshift / YC).
- **FR-E6.** Voiceover WAV (Maya + Guide registers) recorded per `caltech/video-story.md` §7.
- **FR-E7.** 3-minute Round 2 launch video MP4 final assembly Saturday 8-11 PM.
- **FR-E8.** Devpost writeup follows MindPad/TerraLink structural template per `research-context/008`.
- **FR-E9.** Pitch deck slides for Round 1 (5-min) + Round 2 (3-min).
- **FR-E10.** FAQ ammunition deck (Q1-Q5 customer + Q-INT-1 through Q-INT-15 hostile-judge) polished verbatim BEFORE Friday 8 PM smoke gate.
- **FR-E11.** Per-industry generalization MP4 (3-4 short clips: workplace + consumer footage examples) baked Saturday morning. Listen Labs simulation deliverable.
- **FR-E12.** Saturday 6 PM pre-cache assembly test — runs entire 90s on pre-recorded only.
- **FR-E13.** Saturday 11 PM Devpost submit.

---

## §14. Non-Functional Requirements (NFR1–NFR40)

### Performance
- **NFR1.** Demo end-to-end runs in ≤ 90s for live-attempt path.
- **NFR2.** TRIBE V2 reverse inference < 30s on 30s clip on demo GPU.
- **NFR3.** TRIBE V2 forward inference per candidate paragraph ≤ 2s.
- **NFR4.** K2 Cerebras at ~2000 tok/s sustained throughput.
- **NFR5.** Stage 1 Qwen3-VL ≤ 10s for 30s clip.
- **NFR6.** Stage 2 Opus 4.7 ≤ 5s per candidate (~250-token output).
- **NFR7.** 8-round iterative loop ≤ 60s; 5-round shortened ≤ 35s.
- **NFR8.** 3D rendering ≥ 30 FPS with iterative-loop visualization overlay.
- **NFR9.** Demo determinism: < 5% variance across back-to-back runs.

### Privacy & Compliance
- **NFR10.** No PII collected.
- **NFR11.** TRIBE V2 license CC-BY-NC-4.0 respected — non-commercial; attribution surfaced in Devpost.
- **NFR12.** No clinical claims anywhere in output.
- **NFR13.** No reverse-inference language anywhere in output.
- **NFR14.** No sub-second prediction claims.
- **NFR15.** Within-subject contrast only.
- **NFR16.** No inflated TRIBE numbers (~20K / ~25 only).
- **NFR17.** No persistent surveillance — B2C vault has no persistence beyond session unless user chooses.

### Reliability
- **NFR18.** Each demo beat has pre-cached fallback asset; per-component swap at every stage boundary.
- **NFR19.** Wi-Fi-loss contingency: full backup MP4 of entire 90s.
- **NFR20.** Pre-cache assembly test (Saturday 6 PM) passes — entire demo runnable on pre-recorded only.
- **NFR21.** Sponsor-swap reliability: BEAT-0 + BEAT-5 hot-swap < 5s.
- **NFR22.** Iterative-loop convergence: by round 8, score ≥ 0.75 on test footage.
- **NFR23.** Falsification check: control delta ≥ 0.40 (proves anchoring strength).

### Accessibility & UX
- **NFR24.** Empathy-layer paragraph uses literature-grade prose (not academic / clinical).
- **NFR25.** Wrapped Card 1 (B2C scenario) uses function names not anatomy names (Sally UX fix).
- **NFR26.** Hover-bridge interaction supports both mouse + touch hover.
- **NFR27.** Voiceover register honors Acts 1+4 cinematic + Acts 2+3 guide register per `caltech/video-story.md`.
- **NFR28.** Iterative-loop reveal paced for emotional impact (~25s; not too fast, not too slow).

### Integration
- **NFR29.** Stage 1 → Stage 2 contract: Vision Report JSON Pydantic schema-validated.
- **NFR30.** TRIBE V2 reverse → Stage 2 contract: per-second JSON schema-validated.
- **NFR31.** TRIBE V2 forward → iterative-loop contract: text input → JSON output schema-validated.
- **NFR32.** Stage 2 → iterative-loop contract: candidate paragraph emitted with guardrail pre-flight status.
- **NFR33.** Iterative-loop → output-document contract: full trajectory + best-paragraph + falsification-delta payload schema-validated.
- **NFR34.** Pre-cache fallback contracts: per-stage MP4 / JSON / static-image committed to repo by Saturday 8 AM.

### Observability (demo-day operational)
- **NFR35.** Demo runbook logs per-beat live/pre-cache decision.
- **NFR36.** Iterative-loop logs per-round score + per-region attribution + candidate paragraph.
- **NFR37.** K2 swarm structured-log per call (latency, retry-count, fallback-triggered).
- **NFR38.** All API calls (Stage 1 OpenRouter, Stage 2 Anthropic, K2 Cerebras) log latency for demo-day post-mortem.

### Sponsor & Strategic Alignment
- **NFR39.** Best Use of AI YEA/NAY rubric is the explicit closing slide; product enacts the rubric.
- **NFR40.** Empathy-layer positioning is the unified spine across all 4 sponsor swap-slides; closing-line wording polished Saturday 6 PM.

---

## §15. Per-Lane Build Checklist (USE THIS TO TRACK PROGRESS)

### LANE-J (Junsoo)
- [ ] Friday EOD: TRIBE V2 reverse pipeline emits per-second JSON for sample workplace input
- [ ] Friday EOD: TRIBE V2 forward-direction text-input scoring callable working
- [ ] Friday smoke test #1: < 30s latency on 30s clip
- [ ] Friday smoke test #5: HuggingFace TRIBE V2 access confirmed
- [ ] Friday smoke test #7: falsification delta ≥ 0.40 on test paragraph
- [ ] Saturday 8 AM: pre-cached brain JSON for all demo inputs + control footage
- [ ] Saturday 8 AM: pre-baked side-by-side MP4 for BEAT-3 within-subject toggle

### LANE-K (Jacob)
- [ ] Friday afternoon: K2 Cerebras endpoint integration working
- [ ] Friday afternoon: asyncio.Semaphore(6) + Pydantic + retry pattern operational
- [ ] Friday EOD: Iterative-scoring loop end-to-end (8 rounds in < 60s on test input)
- [ ] Friday smoke test #2: K2 + Opus iterative-loop test passes
- [ ] Friday smoke test #6: Stage 1 (Qwen3-VL) latency + JSON validity
- [ ] Saturday 8 AM: pre-cached iterative-loop trajectory for demo input
- [ ] Saturday 8 AM: falsification delta computation pipeline operational

### LANE-O (Johnny)
- [ ] Friday 2 PM: Visualization stack picked (Three.js / R3F / Plotly3D)
- [ ] Friday 5 PM: Stage 1 vision API confirmed (Qwen3-VL via OpenRouter)
- [ ] Friday afternoon: Three sibling Claude instances spawned (vis-brain, vis-graph, orch-glue)
- [ ] Friday EOD: Stage 1 + Stage 2 + iterative-loop integrated end-to-end
- [ ] Friday smoke test #3: 3D mesh FPS ≥ 30 on demo laptop
- [ ] Friday smoke test #4: Wi-Fi contingency works
- [ ] Friday smoke test #8: Demo determinism < 5% variance
- [ ] Saturday 5 PM: Sibling-Claude integration checkpoint complete
- [ ] Saturday 6 PM: Final product name + headline picked
- [ ] Saturday 6 PM: Final FAQ ammunition Q-INT-1 / Q-INT-4 / Q-INT-15 verbatim
- [ ] Saturday 8 PM: Feature freeze enforced

### LANE-E (Emilie)
- [ ] Friday 6 PM: Cinematic Acts 1+4 shoot starting
- [ ] Friday smoke test (informal): 3 Gen-Z teens watch demo (per YC stress-test recommendation)
- [ ] Friday EOD: Empathy-layer document UI wireframes (3 modes: workplace / consumer / pavilion)
- [ ] Saturday 8 AM: Pre-cache asset bundle complete (per-beat MP4s, card images, sponsor slides, voiceover WAV)
- [ ] Saturday 4 PM: Cinematic Acts 1+4 shot complete
- [ ] Saturday 6 PM: Pre-cache assembly test (entire 90s on pre-recorded only)
- [ ] Saturday 8 PM: Feature freeze
- [ ] Saturday 8-11 PM: Launch video assembly + Devpost upload + pitch deck final
- [ ] Saturday 11 PM: Devpost submit

---

## §16. Critical-Path Timeline

### Friday 2026-04-25
- 2:00 PM: Visualization stack pick (Johnny)
- 5:00 PM: Stage 1 vision API pick locked as Qwen3-VL via OpenRouter (Johnny)
- 6:00 PM: Cinematic Acts 1+4 shoot starts (Emilie)
- 8:00 PM: Friday-night 8-test smoke gate begins
- 8:00 PM: FAQ Q-INT-1/4/15 polished verbatim before gate (Johnny)
- 11:00 PM: All 8 smoke tests complete; per-test fallbacks decided

### Saturday 2026-04-26
- 7:00 AM: 3 Gen-Z teens recruited for B2C scenario testing (per YC stress-test rec)
- 8:00 AM: Pre-cache asset bundle complete (all lanes deliver per FR checklists)
- 9:00 AM: 3 Gen-Z teens watch B2C demo; reactions noted (Emilie)
- 11:00 AM: Listen Labs talk attendance (team)
- 2:00 PM: Junsoo TRIBE latency confirmed; iterative-loop forward-direction confirmed (Junsoo)
- 2:00 PM: Jacob K2 swarm + iterative-loop orchestration confirmed (Jacob)
- 4:00 PM: Cinematic Acts 1+4 shot complete (Emilie)
- 5:00 PM: Sibling-Claude integration checkpoint (Johnny)
- 6:00 PM: Final product name + headline picked (Johnny)
- 6:00 PM: Pre-cache assembly test (Emilie)
- 8:00 PM: Feature freeze (all)
- 8-11 PM: Launch video + Devpost + pitch deck final (Emilie)
- 11:00 PM: Devpost submit (Emilie)

### Sunday 2026-04-27
- 7-9 AM: Pitch rehearsals (all)
- 9:00 AM: Devpost hard deadline (already submitted Saturday)
- morning: Round 1 judging
- afternoon: Round 2 judging + sponsor pavilion judging

---

## §17. Open Architectural Questions Surfaced (Surfaces from Sub-agent B)

### Q1. Is K2 the per-region specialist VOICE or just the iterative-loop ORCHESTRATOR?

- Per Decision 008: K2 is "speed engine for swarm fan-out" — ambiguous whether voice or coordinator
- Per `jacob-agent-swarms.md`: each agent IS a specialist; K2 is one option for per-region prompt
- **Resolution (LOCK by Friday 2 PM):** K2 IS the per-region specialist voice (12+ K2 calls in parallel via Semaphore(6) for the optional specialist roster) AND the iterative-loop orchestrator. Both roles. Opus runs Stage 2 synthesis (depth); K2 runs specialist parallelism (speed) where needed.

### Q2. Inverted-brain-search Land card scope

- §1 of `prd-final.md` lists 3 implementation options: (a) reverse-lookup pre-computed library, (b) generate via swarm, (c) search API
- Demo-day reality: only (a) viable in 90s window
- **Resolution (LOCK by Friday 5 PM):** (a) hand-curated content-format suggestions for the demo input. Not a real reverse-search backend. Static cards.

### Q3. Iterative loop in v1 or v2?

- Iterative loop adds 10-20s latency per round
- **Resolution:** v1 (this PRD treats iterative loop as the load-bearing BEAT-3 reveal). Pre-cached fallback if live exceeds budget.

### Q4. SynthDebate-on-Brain scope

- Adaptation 2 + SynthDebate would add 100-agent population sim on top of iterative loop
- 100K-token sim only fits at K2 speed
- **Resolution (v1):** SCOPED OUT for v1. The iterative-scoring loop IS the simulation per Listen Labs's six questions.
- **v2 confirmation 2026-04-25 evening:** SynthDebate remains scoped out. The K2-swarm-as-evaluator iterative loop is the only simulation we ship. Verbal mention in pitch + future-product roadmap stays.

### Q8. TRIBE forward replaced by what? (NEW in v2 — RESOLVED)

- v1.0 architecture relied on TRIBE V2 forward-direction inference for two purposes: (a) per-round iterative-loop scoring; (b) falsification-check cosine similarity.
- v2 lock: live TRIBE never runs. Replacements:
  - (a) **K2-swarm-as-evaluator** — `services/iterative_loop.py:evaluate_paragraph`. Each Yeo7 network's K2 specialist scores how faithfully the candidate paragraph captured its reading. Mean of 7 = round_score. Real, semantic, deterministic-ish (K2 temp variability bounded by short prompts).
  - (b) **Embedding proxy** — `services/embedding_proxy/__init__.py`. all-MiniLM-L6-v2 → 384-dim → 7-dim via projection W (fit offline from training_pairs.yaml). Cosine vs activity target. Real numbers, ~50ms, CPU.
- **Honesty framing for hostile judges:** "the iterative loop is brain-grounded via the K2 specialists reading per-region activations; falsification numbers come from a sentence-embedding proxy that we calibrated against the activations. Live TRIBE forward is the production path; the proxy is the demo-day stand-in."

### Q5. T2 (Auditor's external referent)

- Within-subject toggle (BEAT-3) IS the answer — same brain different input shows divergent pattern
- **Resolution:** FAQ Q-INT-4 verbatim sentence: *"The auditor is the user's own brain responding differently to different content sources — not another LLM, but the user's own neural divergence pattern across diverse inputs."*

### Q6. Ironside-vs-Ironsight naming

- Sub-agent A and prior docs use both spellings
- **Resolution:** "Ironsight" is the correct spelling per their actual brief (verified in Johnny's most recent yap). Sweep all body-prose mentions Saturday 6 PM during final-pass polish.

### Q7. Opus 4.7 tokenizer +35% bloat

- Per sub-agent C: new Opus 4.7 tokenizer adds 35% to input/output token counts
- **Resolution:** Budget Opus tokens at 1.35x prior estimates. Demo cost still ~$0.03 per run; not a problem.

---

## §18. References

- **`caltech/build-plan-locked.md`** — v2 build plan with file-level lane assignments, contracts, and the cache + warmup spec (companion to this PRD post-2026-04-25 evening lock).
- **`caltech/architecture-overview.md`** — v2 cohesive overview (reader-facing standalone document; same architecture as this doc but framed for newcomers).
- `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` — strategic PRD (companion)
- `caltech/use-cases/empathy-layer-prd-simplified.md` — build-clarity simplified version
- `caltech/use-cases/empathy-layer-hero-output.md` — hero-output strategic framing
- `caltech/use-cases/two-demo-scenarios.md` — scenario contract
- `caltech/use-cases/ironside.md` — Scenario A workplace
- `caltech/use-cases/listenlabs-sideshift.md` — Scenario B consumer
- `caltech/use-cases/yc-partner-stress-test.md` — defensibility evaluation
- `caltech/use-cases/outsider-advantage-check.md` — founder-market-fit honest reframe
- `caltech/prd-final.md` — lean reference PRD
- `caltech/demo-script.md` — 90s on-stage execution
- `caltech/video-story.md` — production-ready launch video shoot script
- `caltech/research-context/007-johnny-public-corpus-tribe-posts.md` — Clair de Lune precedent
- `research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md` — TRIBE V2 corrected facts
- `research/wiki/tools/k2-think.md` — K2 integration template + gotchas
- `research/wiki/decisions/008-k2-think-as-speed-engine.md` — speed vs. depth lock
- `research/wiki/patterns/spatial-sidecar.md` — pattern this engine instantiates
- `research/wiki/patterns/two-stage-llm-compile.md` — Stage 1 + Stage 2 pattern reuse
- `research/wiki/patterns/grounded-citation.md` — falsification-check inheritance
- `research/wiki/patterns/robust-json-from-llms.md` — Pydantic + brace-balanced extractor
- `research/wiki/patterns/per-item-parallel-llm-evaluation.md` — Semaphore(6) pattern
- Sub-agent A report: `/tmp/sub-agent-A-verbatim-yaps.md` — all Johnny verbatim yaps captured
- Sub-agent B report: `/tmp/sub-agent-B-technical-state.md` — technical-state ground truth
- Sub-agent C report: `/tmp/sub-agent-C-stack-validation.md` — stack-validation web research

---

## §19. Workflow Status

**v1.0 (2026-04-25 morning):** Technical PRD complete with 60 FRs / 40 NFRs / 8 smoke gates. Locked for parallel execution.

**v2 (2026-04-25 evening) — what actually shipped:**

- LANE-J: TRIBE forward DROPPED. Embedding proxy + falsification + scenario tags + control activity.json bake delivered (`services/embedding_proxy/`, `services/falsification.py`, `scripts/fit_projection_map.py`).
- LANE-K: K2 swarm runner + K2 moderator empathy synthesis + K2-swarm-as-evaluator iterative loop + cache + warmup + guardrails delivered (`services/swarm_runner.py`, `empathy_synthesis.py`, `iterative_loop.py`, `session_cache.py`, `warmup.py`, `guardrails.py`, plus `prompts/moderator_synthesis.md`, `prompts/evaluator_score.md`).
- LANE-O: `services/vision_client.py` rewritten for OpenRouter + Qwen3-VL. Frontend 5-stage routing in place (`App.vue`, `IterativeRevealStage.vue`, `EmpathyDocumentStage.vue`, `RoundScoreBar.vue`, `PersonaShell.vue`, `LoadingStage.vue` warmup-gated). New endpoints wired in `main.py`: `/demo/empathy`, `/demo/iterative-trajectory`, `/demo/falsification`, `/demo/warmup-status`. Old `/demo/comparison` removed. Committed as `78e6c9e` to `origin/main`.
- LANE-E: in progress (Saturday morning).

**Companion docs current as of 2026-04-25 evening:** `caltech/build-plan-locked.md`, `caltech/architecture-overview.md` (v2 sections marked).

**Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.**
