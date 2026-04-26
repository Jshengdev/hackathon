---
title: "Architecture Overview — Empathy Layer Engine (Cohesive Visual Document)"
project_codename: Empathy Layer
sponsor_tracks: Ironsight (CORE) + Listen Labs (CORE) + Sideshift (CORE substrate) + Best Use of AI (HARD TARGET) + IFM K2 (CORE) + Creativity + YC stretch
purpose: |
  Stand-alone document. No prior project knowledge required. Read this if you've
  never seen this hackathon project before — by the end you should understand:
    1. What problem we are solving
    2. What the engine does end-to-end
    3. What every box in the architecture does, what it sends, and to whom
    4. Why we are tracking what we track
    5. What success looks like

  Reading time: ~10 minutes.
read_first: This is the cohesive architecture document. After reading this, drill into:
  - _bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md (engineering-grade spec)
  - _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md (strategic positioning)
suggestion_locked_2026_04_25: |
  K2 IS the per-region specialist swarm voice. Iterative-loop orchestrator IS the
  swarm itself — same K2 surface, two roles. We pre-cache everything for demo-day.
---

# Architecture Overview — The Empathy Layer Engine

> A stand-alone document. Assume the reader knows nothing about this project. Walk away understanding the whole thing.

---

## 1. The Problem in One Paragraph

Today's AI can describe what humans did and parse what humans said — but it cannot model the cognitive-emotional state underneath the action. A vision-language model watching a construction worker on scaffolding sees *"worker holding a tool near scaffolding edge."* It does not see whether the worker was focused, fatigued, mind-wandering, or in cognitive overload at the moment of the action. A manager reading that report cuts corners that destroy what their company actually wants — patient experience, customer reviews, employee retention — because the action data is missing the human context. **We are building the missing layer.**

---

## 2. The Solution in One Paragraph

The **Empathy Layer Engine** is a single AI pipeline that takes a video of a human taking actions, runs Meta's TRIBE V2 brain-encoding model to predict per-second per-region neural response across ~20,000 cortical points, runs a swarm of region-specialist agents on Cerebras K2 to interpret what each brain region was contributing, generates candidate paragraphs describing what the human felt during the footage using Claude Opus 4.7, iteratively rewrites and re-scores each candidate paragraph against the actual brain pattern across 8 rounds (the same protocol that produced our 90.4% Clair de Lune emotion-center match in prior published work — inverted), and returns the best-matching paragraph plus a similarity score plus a falsification check. The output is a **brain-grounded paragraph that reads like a human reading another human**, anchored to evidence the reader can audit. Same engine runs on workplace footage (Ironsight scenario) AND consumer day-to-day footage (Sideshift / YC scenario). One engine. Two demo scenarios. Pre-cached for demo-day reliability.

---

## 3. The Headline Line (memorize this)

> **Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.**

---

## 4. The End-to-End Architecture (cohesive flow chart)

```
                ╔══════════════════════════════════════════════════════════╗
                ║                                                          ║
                ║           [INPUT: Video file (MP4, 30-90s)]              ║
                ║                                                          ║
                ║   What goes in: a video of a human taking actions.       ║
                ║   Examples: construction worker on a job site, nurse     ║
                ║   in a patient room, retail rep at counter, Gen-Z teen   ║
                ║   scrolling Reels. Same engine ingests any of them.      ║
                ║                                                          ║
                ╚══════════════════════════╤═══════════════════════════════╝
                                           │
                                           │
                       ┌───────────────────┴───────────────────┐
                       │                                       │
                       │  The video gets sent to TWO places    │
                       │  in parallel: Stage 1 (which          │
                       │  describes WHAT happened) and         │
                       │  TRIBE V2 (which predicts the         │
                       │  brain-pattern of WHAT THE HUMAN      │
                       │  FELT). These run simultaneously.     │
                       │                                       │
                       └───┬───────────────────────────────┬───┘
                           │                               │
                           ▼                               ▼

  ┌────────────────────────────────────────┐   ┌──────────────────────────────────────┐
  │                                        │   │                                      │
  │   STAGE 1 — VISION CLASSIFICATION      │   │   TRIBE V2 — BRAIN ENCODING          │
  │   (the "what happened" agent)          │   │   (the "what they felt" data layer)  │
  │                                        │   │                                      │
  │  TOOL: Qwen3-VL via OpenRouter         │   │  TOOL: Meta TRIBE V2                 │
  │   (model ID:                           │   │   (facebookresearch/tribev2;         │
  │    qwen/qwen3-vl-235b-a22b-instruct)   │   │    CC-BY-NC-4.0; HuggingFace)        │
  │                                        │   │                                      │
  │  WHAT IT DOES:                         │   │  WHAT IT DOES:                       │
  │   Watches the video. Describes the     │   │   Predicts per-second per-region     │
  │   scene in plain text — actions,       │   │   brain activation across ~20,000    │
  │   environment, tools, temporal         │   │   cortical points on the fsaverage5  │
  │   sequence, spatial relationships.     │   │   mesh, at 1Hz, with 5-second HRF    │
  │                                        │   │   lag respected.                     │
  │  WHY:                                  │   │                                      │
  │   Action-data baseline. This is what   │   │  WHY:                                │
  │   the manager / user would see WITH-   │   │   This is the BRAIN-PATTERN TARGET   │
  │   OUT our engine. We preserve it as    │   │   the iterative loop scores against. │
  │   §1 of the empathy-layer document.    │   │   Without it the engine has no       │
  │                                        │   │   ground truth for "what did the     │
  │  WHAT IT TRACKS:                       │   │   human actually feel."              │
  │   Scene summary, action list, tools,   │   │                                      │
  │   temporal sequence, spatial layout    │   │  WHAT IT TRACKS:                     │
  │                                        │   │   Per region: visual-attention,      │
  │  WHAT IT SENDS:                        │   │   threat-detection, prefrontal-      │
  │   Vision Report JSON →                 │   │   engagement, default-mode (sense-   │
  │   Stage 2 (Empathy Synthesis)          │   │   of-self), emotional-processing,    │
  │   AND empathy-layer document §1        │   │   social-pattern, salience-tracking, │
  │                                        │   │   stress-response, motor-planning    │
  │  LATENCY: ≤ 10s for 30s clip           │   │                                      │
  │                                        │   │  WHAT IT SENDS:                      │
  │  PRE-CACHE FALLBACK: hand-baked        │   │   Brain Pattern JSON (per-second,    │
  │   vision-reports for demo input        │   │   per-region) →                      │
  │                                        │   │   K2 Per-Region Specialist Swarm     │
  │                                        │   │   AND Iterative Loop scoring step    │
  │                                        │   │                                      │
  │                                        │   │  LATENCY: 20-30s for 30s clip live;  │
  │                                        │   │   PRE-CACHE MANDATORY for demo-day   │
  │                                        │   │   reliability                        │
  │                                        │   │                                      │
  └────────────────────┬───────────────────┘   └────────────────────┬─────────────────┘
                       │                                            │
                       │                                            │
                       │                                            ▼
                       │                      ┌──────────────────────────────────────────┐
                       │                      │                                          │
                       │                      │   K2 PER-REGION SPECIALIST SWARM         │
                       │                      │   (the "what each brain region                │
                       │                      │    contributed" agents)                  │
                       │                      │                                          │
                       │                      │  TOOL: Cerebras K2 Think                 │
                       │                      │   (~2000 tok/s; OpenAI-compatible        │
                       │                      │    chat-completions API)                 │
                       │                      │                                          │
                       │                      │  WHAT IT DOES:                           │
                       │                      │   Spawns one specialist agent per        │
                       │                      │   brain region (8-12 in parallel via     │
                       │                      │   asyncio.Semaphore(6)). Each            │
                       │                      │   specialist is prompted: "You are       │
                       │                      │   the specialist for [REGION]. This      │
                       │                      │   region handles [FUNCTION]. Given       │
                       │                      │   the per-second activation pattern      │
                       │                      │   from this video, what was your         │
                       │                      │   region contributing to the human's     │
                       │                      │   experience?"                           │
                       │                      │                                          │
                       │                      │   Two passes:                            │
                       │                      │    ROUND 1 — each specialist outputs     │
                       │                      │      its hypothesis independently        │
                       │                      │    ROUND 2 — each specialist re-         │
                       │                      │      evaluates given other specialists'  │
                       │                      │      outputs (cross-region cross-talk)   │
                       │                      │                                          │
                       │                      │  WHY:                                    │
                       │                      │   The brain-pattern numbers alone are    │
                       │                      │   not human-readable. The swarm          │
                       │                      │   translates per-region activation       │
                       │                      │   into per-region semantic               │
                       │                      │   interpretation that Stage 2 can use.   │
                       │                      │   K2 IS REQUIRED — at Claude latency,    │
                       │                      │   8-12 parallel calls × 2 rounds        │
                       │                      │   doesn't fit in consumer-product        │
                       │                      │   latency.                               │
                       │                      │                                          │
                       │                      │  WHAT IT TRACKS:                         │
                       │                      │   Per region: semantic interpretation +  │
                       │                      │   cross-region edge weights (which       │
                       │                      │   region's output shifted which other    │
                       │                      │   region's hypothesis)                   │
                       │                      │                                          │
                       │                      │  WHAT IT SENDS:                          │
                       │                      │   Swarm Output JSON                      │
                       │                      │   (per-region semantic + edges) →        │
                       │                      │   Stage 2 (Empathy Synthesis)            │
                       │                      │                                          │
                       │                      │  LATENCY: ~2-3s for 8-12 specialists     │
                       │                      │   in parallel at K2 speed                │
                       │                      │                                          │
                       │                      │  PRE-CACHE FALLBACK: pre-baked swarm     │
                       │                      │   outputs for demo input                 │
                       │                      │                                          │
                       │                      └──────────────────────┬───────────────────┘
                       │                                             │
                       └─────────────────────┬───────────────────────┘
                                             │
                                             ▼

           ┌──────────────────────────────────────────────────────────────────┐
           │                                                                  │
           │   STAGE 2 — EMPATHY SYNTHESIS                                    │
           │   (the "translate evidence into human-readable paragraph" agent) │
           │                                                                  │
           │  TOOL: Anthropic Claude Opus 4.7                                 │
           │   (the depth synthesizer; $5/$25 per M tokens)                   │
           │                                                                  │
           │  WHAT IT DOES:                                                   │
           │   Takes three inputs:                                            │
           │    1. Vision Report (Stage 1) — what happened in the scene       │
           │    2. Brain Pattern JSON (TRIBE V2) — what the brain showed      │
           │    3. Swarm Output JSON (K2 Specialists) — per-region semantics  │
           │                                                                  │
           │   Generates a paragraph (~150-300 words) describing what the     │
           │   human FELT during the footage — grounded in brain-pattern      │
           │   evidence. Honors strict guardrails (see §6).                   │
           │                                                                  │
           │  WHY:                                                            │
           │   This is the empathy translation. Numbers + per-region          │
           │   technical interpretation become a human-readable paragraph     │
           │   that a manager / user can actually read and act on.            │
           │                                                                  │
           │  WHAT IT TRACKS:                                                 │
           │   Candidate paragraph #N + which round we are on + prior round   │
           │   score + per-region "miss" feedback (regions the prior          │
           │   candidate underweighted or overweighted)                       │
           │                                                                  │
           │  WHAT IT SENDS:                                                  │
           │   Candidate Paragraph #N → Iterative Scoring Loop                │
           │                                                                  │
           │  LATENCY: ≤ 5s per candidate                                     │
           │                                                                  │
           │  PRE-CACHE FALLBACK: pre-baked paragraph trajectory for demo     │
           │   input                                                          │
           │                                                                  │
           └────────────────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼

           ┌──────────────────────────────────────────────────────────────────┐
           │                                                                  │
           │   ITERATIVE SCORING LOOP                                         │
           │   (the "swarm of paragraph candidates competing across rounds"   │
           │    — the Clair de Lune protocol INVERTED)                        │
           │                                                                  │
           │  TOOL: Cerebras K2 Think (orchestrator) +                        │
           │        TRIBE V2 forward-direction (scorer)                       │
           │   K2 IS THE SWARM ITSELF — same surface as the per-region        │
           │   specialist swarm above, second role: orchestrating the         │
           │   candidate-paragraph competition across rounds.                 │
           │                                                                  │
           │  WHAT IT DOES (this is the magic):                               │
           │                                                                  │
           │   For up to 8 rounds:                                            │
           │     1. Score Candidate Paragraph #N: take the paragraph TEXT,    │
           │        run it BACK through TRIBE V2 (forward-direction —         │
           │        text input → predicted brain-pattern). This is the        │
           │        same model that scored Clair de Lune's text candidates.   │
           │                                                                  │
           │     2. Compare predicted brain-pattern (from candidate text)     │
           │        vs. TARGET brain-pattern (from actual video). Compute     │
           │        cosine similarity = SCORE.                                │
           │                                                                  │
           │     3. If SCORE plateaus (delta < 0.02 over 2 rounds) OR         │
           │        round == 8: STOP. Return best paragraph.                  │
           │        Otherwise: pass score + per-region miss back to           │
           │        Stage 2 → generate Candidate #N+1 → loop.                 │
           │                                                                  │
           │   Round 1 score: ~0.42                                           │
           │   Round 2 score: ~0.58                                           │
           │   Round 3 score: ~0.65                                           │
           │   Round 5 score: ~0.71                                           │
           │   Round 8 score: ~0.84                                           │
           │   ★ THE SCORE CLIMBING IS THE DEMO'S VISUAL REVEAL ★             │
           │                                                                  │
           │  WHY:                                                            │
           │   This is direct re-use of Johnny's prior published Clair de     │
           │   Lune work — same iterative-scoring protocol that produced      │
           │   90.4% emotion-center match across 20,484 vertices. We          │
           │   inverted it: instead of writing TEXT to MATCH a brain-         │
           │   pattern, we use the brain-pattern of an ACTUAL VIDEO to        │
           │   score candidate paragraphs DESCRIBING what the human felt.     │
           │                                                                  │
           │  WHAT IT TRACKS:                                                 │
           │   Round-by-round trajectory: each candidate's text + score +     │
           │   per-region attribution. Per-round JSON log for observability.  │
           │   Round 1 → Round 8 score climb visualized live (or replayed     │
           │   from pre-cache) as a fillable bar.                             │
           │                                                                  │
           │  WHAT IT SENDS:                                                  │
           │   { best_paragraph, final_score, round_trajectory[],             │
           │     per_region_attribution } → Falsification Check               │
           │                                                                  │
           │  LATENCY: ~60s for 8 rounds; ~35s for 5-round shortened          │
           │                                                                  │
           │  PRE-CACHE FALLBACK: pre-baked round trajectory for demo input   │
           │                                                                  │
           └────────────────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼

           ┌──────────────────────────────────────────────────────────────────┐
           │                                                                  │
           │   FALSIFICATION CHECK                                            │
           │   (the "prove the paragraph is grounded, not confabulated"       │
           │    safety net)                                                   │
           │                                                                  │
           │  TOOL: TRIBE V2 forward-direction (same scorer as above) +       │
           │        a CONTROL VIDEO's pre-cached brain pattern                │
           │                                                                  │
           │  WHAT IT DOES:                                                   │
           │   Take the final BEST PARAGRAPH from the iterative loop. Score   │
           │   it AGAIN — but this time against a CONTROL VIDEO's brain       │
           │   pattern (different scene; e.g., the same nurse on a routine    │
           │   vitals visit instead of the cancer-patient consultation).      │
           │                                                                  │
           │   Compute: FALSIFICATION DELTA = main_score − control_score      │
           │                                                                  │
           │   If delta is large (e.g., 0.84 main − 0.27 control = 0.57       │
           │   delta), the paragraph is PROVABLY ANCHORED to the original     │
           │   scene, not generically plausible.                              │
           │                                                                  │
           │  WHY:                                                            │
           │   Without falsification, the paragraph reads as plausible but    │
           │   unverified narrative (the failure mode of generic VLM-         │
           │   generated descriptions). With it, the paragraph is anchored    │
           │   to brain-pattern evidence AND the score quantifies how         │
           │   anchored. Same logic as Johnny's prior Clair de Lune work      │
           │   falsifying against control music (triumphant music, rain) —    │
           │   pattern only matched Clair de Lune.                            │
           │                                                                  │
           │  WHAT IT TRACKS:                                                 │
           │   main_score, control_score, falsification_delta, verdict        │
           │   ("anchored" if delta > 0.40; "generic-plausible" otherwise —   │
           │   red flag)                                                      │
           │                                                                  │
           │  WHAT IT SENDS:                                                  │
           │   Falsification evidence → empathy-layer document §3             │
           │                                                                  │
           │  LATENCY: ≤ 3s                                                   │
           │                                                                  │
           │  PRE-CACHE FALLBACK: control video brain pattern pre-baked       │
           │   Saturday 8 AM                                                  │
           │                                                                  │
           └────────────────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼

           ┌──────────────────────────────────────────────────────────────────┐
           │                                                                  │
           │   EMPATHY-LAYER DOCUMENT                                         │
           │   (the final hero artifact a human reads)                        │
           │                                                                  │
           │  WHAT IT IS:                                                     │
           │   A three-section document rendered for the decision-maker       │
           │   (manager / user / judge):                                      │
           │                                                                  │
           │   §A — VISION REPORT (action-data baseline)                      │
           │     What the manager would have seen WITHOUT our engine.         │
           │     Read: "Nurse spent 30 min in Patient Room 4. Action: sat     │
           │     with patient, adjusted IV, held hand."                       │
           │                                                                  │
           │   §B — EMPATHY LAYER PARAGRAPH (the hero, the takeaway)          │
           │     The brain-grounded translation of what the human felt.       │
           │     Magazine-cover-quality typography. Literature-grade prose.   │
           │     Read: "She entered the room and her vital-attention          │
           │     signature shifted immediately — the prefrontal sharpness     │
           │     of triage softened into something quieter, more              │
           │     accommodating. For the first twelve minutes her emotional-   │
           │     processing specialist sustained engagement; she was reading  │
           │     the patient's grief, not just monitoring it. She did not     │
           │     rush. She did not check out. She held space."                │
           │     Below: Brain-pattern similarity: 0.84                        │
           │                                                                  │
           │   §C — FALSIFICATION EVIDENCE (proves it's grounded)             │
           │     Read: "Falsification check (same nurse on routine vitals     │
           │     visit): 0.27 — confirming the description is specifically    │
           │     anchored to this scene's emotional reality."                 │
           │     Below: per-region attribution table + round-by-round         │
           │     trajectory (collapsed, expandable)                           │
           │                                                                  │
           │  WHY:                                                            │
           │   This is the hero artifact. The manager / user reads §A         │
           │   (preserves the action data they had), then §B (gets the        │
           │   human context the action data was missing), then §C (proves    │
           │   §B is real, not confabulated). Decision becomes empathy-       │
           │   aware. The corner-cut doesn't happen.                          │
           │                                                                  │
           │  THREE FRAMING MODES (per use case):                             │
           │   • Workplace (boss-facing) — preserves action data + adds       │
           │     human context for management decisions                       │
           │   • Consumer (user-facing) — daily journal entry shape;          │
           │     vault accumulation for B2C                                   │
           │   • Pavilion (judge-facing) — demo artifact emphasis;            │
           │     iterative-loop trajectory more prominent                     │
           │                                                                  │
           │  WHO RENDERS IT: Emilie owns UI design;                          │
           │   Johnny owns frontend integration                               │
           │                                                                  │
           │  LATENCY: ≤ 1s render                                            │
           │                                                                  │
           └──────────────────────────────────────────────────────────────────┘

                                  ★ END OF PIPELINE ★
                            (decision-maker reads → acts)

```

---

## 5. The Two Demo Scenarios (same engine, swap input)

| Scenario | Input data source | Persona | Beneficiary | Sponsor |
|---|---|---|---|---|
| **A — Workplace Footage** | Egocentric body-cam, job-site video, patient-room footage, retail floor cam, kitchen cam, classroom recording, any workplace human-action video | Manager / company / decision-maker reviewing worker performance | The worker (gets context-aware management) + the company (preserves outcomes that action-data-only optimization would destroy) | Ironsight CORE + Listen Labs CORE |
| **B — Consumer Day-to-Day** | Reels/TikTok feed screen-recording, phone screen-record of any digital activity, daily-life clip | Maya, Gen-Z teen (or any consumer) | The user themselves (gets a brain-grounded journal of their own experience; daily entries accumulate into a knowledge graph) | Sideshift CORE + YC stretch |

**Same TRIBE V2. Same K2. Same Opus. Same iterative loop. Same falsification check. Same empathy-layer document.** Only the input file changes; everything downstream runs unchanged.

---

## 6. Forbidden Claims (what we will NEVER say in any output)

These are non-negotiable. Every empathy paragraph, every voiceover, every Devpost copy, every sponsor swap-slide must respect these. A regex pre-flight check on every Opus output catches violations before rendering.

| Forbidden | Why | Allowed alternative |
|---|---|---|
| Reverse inference (*"she felt grief"*) | Scientifically invalid (Poldrack 2006 — brain-region activation cannot be back-inferred to specific subjective feeling) | *"Emotional-processing specialist sustained engagement"* (observational, not diagnostic) |
| Clinical claims (*"clinical fatigue"* / *"diagnosis"*) | TRIBE V2 license + framing | *"Workforce-context augmentation, not psychological evaluation"* |
| Sub-second predictions | TRIBE is 1Hz with 5s HRF lag (structural floor) | Per-second granularity only |
| Population-norm comparisons (*"average healthy brain"*) | Comparing one person's brain to a population norm requires proper statistical baseline we don't have | Within-subject contrast only — *"this person on this scene vs. this person on a different scene"* |
| Inflated TRIBE numbers (*"70K voxels"* or *"700 subjects"*) | TRIBE V2 actually has ~20,000 cortical-surface vertices on fsaverage5 mesh, trained on ~25 deeply-scanned subjects. The 70K/700 numbers are marketing variants, not the published canonical numbers | ~20K vertices / ~25 subjects only |
| *"Reads inner monologue"* framing | Reverse-inference variant in disguise | *"Predicts neural response patterns"* |

---

## 7. What We Are Tracking (the metrics that matter)

### Per-engine-run metrics

| What | Why we track it | Healthy value |
|---|---|---|
| **Brain-pattern similarity score** | The falsifier — proves the empathy paragraph is anchored | ≥ 0.75 by Round 8 on test footage |
| **Falsification delta** | Proves the paragraph is anchored to THIS scene specifically, not generically plausible | ≥ 0.40 (large drop when scored against control) |
| **Round-by-round trajectory** | Shows the iterative-loop is converging (and is the demo's visual reveal) | Score climbs monotonically Round 1 → Round 8 |
| **Per-region attribution** | Shows which brain regions the paragraph captured well + which it missed (cross-talk-soup defense) | < 50% semantic overlap across 8 regions (proves specialists ARE producing distinct outputs, not collapsing to corpus mean) |
| **Guardrail pre-flight status** | Catches forbidden-claim violations before rendering | "passed" — or flag + auto-retry with stricter prompt |

### Per-stage latency metrics (for smoke gate)

| Stage | Threshold | Fallback if exceeded |
|---|---|---|
| Stage 1 vision (Qwen3-VL) | ≤ 10s for 30s clip | Pre-baked vision report |
| TRIBE V2 reverse | < 30s for 30s clip | Pre-baked brain JSON |
| TRIBE V2 forward (per candidate) | ≤ 2s | Pre-baked candidate scoring |
| K2 per-region specialist swarm | ~2-3s for 8-12 in parallel | Pre-baked swarm output |
| Stage 2 Opus per candidate | ≤ 5s | Pre-baked paragraph trajectory |
| Iterative loop full (8 rounds) | ≤ 60s | Pre-baked round trajectory + replay |
| Falsification check | ≤ 3s | Pre-baked control video brain pattern |
| Output document render | ≤ 1s | Cached UI |

### Demo-day metric (what success looks like on stage)

| Outcome | Target |
|---|---|
| All 4 emotional beats land in 90s | Recognition (BEAT-1) + Awe (BEAT-2) + Surprise (BEAT-3 iterative-loop reveal) + Pride+Comfort (BEAT-4 final paragraph reveal) |
| ≥ 5 of 7 sponsor tracks score the project in their top 3 | Best AI + Ironsight + Listen Labs + Sideshift + K2 + Creativity (+ optional YC) |
| Founder-credibility chip mentioned in pitch | Clair de Lune 90.4% match cited verbatim |
| Iterative-loop reveal triggers audible judge reaction | Score climbing 0.42 → 0.84 visible across ~25s |

---

## 8. Why We Pre-Cache Everything (the demo-day reliability discipline)

Per Johnny verbatim: *"We probably won't be able to do real time because of the scale of everything and we needed have handpicked selections of images and videos and we did do pre-training as well... we're not gonna lie about our results, but still we're gonna show them like a speed run of the process while also just running one in the background."*

**Why pre-cache:**

1. **TRIBE V2 live GPU inference is risky.** ~20-30s per 30s clip on demo GPU; one stuttering frame breaks the BEAT-2 awe moment.
2. **Stage 1 vision API can rate-limit.** OpenRouter / Qwen3-VL throughput varies; one bad call breaks BEAT-1.
3. **Iterative loop has 16+ API calls.** 8 Opus calls + 8 TRIBE forward calls + scoring; any single timeout breaks BEAT-3.
4. **Wi-Fi at venue is unreliable.** Multiple speakers + judges + 100+ teams all hitting venue Wi-Fi.
5. **Demo determinism matters.** Same input twice should produce same output; LLM temperature variance breaks back-to-back judging.

**What gets pre-baked Saturday 8 AM:**

- Brain JSON for ALL demo input clips (TRIBE V2 reverse outputs)
- Vision Report JSON for ALL demo input clips (Stage 1 outputs)
- Per-region swarm output JSON for ALL demo input clips (K2 specialist outputs)
- Iterative-loop round trajectory for ALL demo input clips (Stage 2 + scoring outputs)
- Final empathy paragraph + similarity score + falsification delta for ALL demo input clips
- Control video brain pattern for falsification check (one per scenario)
- Per-beat MP4 fallbacks (BEAT-1 mesh+video / BEAT-2 hover-bridges / BEAT-3 iterative-loop reveal / BEAT-4 paragraph reveal / BEAT-5 sponsor closes)
- Voiceover WAV for the launch video
- Empathy-layer document UI rendered for all 3 framing modes (workplace / consumer / pavilion)

**Demo-day operating mode:** live attempt runs in the background; pre-cached version is the demo. If live lands cleanly, swap in. If not, the pre-cache IS the demo. Honest framing throughout.

---

## 9. The Stack (every tool, every model ID, every cost)

| Layer | Tool | Model ID / endpoint | Cost | Why this tool |
|---|---|---|---|---|
| **Stage 1 — Vision** | Qwen3-VL via OpenRouter | `qwen/qwen3-vl-235b-a22b-instruct` | $0.20 in / $0.88 out per M tokens | Beats GPT-5 on OCR; competitive vision; Anthropic vision is reportedly weaker per Johnny. |
| **TRIBE V2 — Brain encoding** | Meta TRIBE V2 | `facebook/tribev2` (HuggingFace) + `facebookresearch/tribev2` (GitHub) | Free (CC-BY-NC-4.0; non-commercial; attribution required) | The foundational brain-encoding model. Same model that produced our 90.4% Clair de Lune match. |
| **K2 Per-Region Swarm + Iterative-Loop Orchestration** | Cerebras K2 Think | `https://api.k2think.ai/v1` (OpenAI-compatible chat-completions) | Free (sponsor-eligible; IFM K2 CORE track) | ~2000 tok/s. Speed engine. Specialists run in parallel via asyncio.Semaphore(6). Iterative loop runs sub-1s round controller. |
| **Stage 2 — Empathy Synthesis** | Anthropic Claude Opus 4.7 | `claude-opus-4-7` (Messages API) | $5 in / $25 out per M tokens (new tokenizer +35% bloat applied) | Depth synthesis. The model that turns per-region technical data into literature-grade prose. |
| **Frontend** | Three.js or React-Three-Fiber | (browser-side rendering) | Free | 3D cortical mesh + iterative-loop visualization at ≥30 FPS on demo laptop |

**Total demo cost per 90s run:** ~$0.03. Even 50 demo runs across pavilion judging = ~$1.50 total. Negligible.

---

## 10. The Team Lanes (who builds what)

| Lane | Owner | Primary deliverables |
|---|---|---|
| **LANE-J** (TRIBE V2) | Junsoo Kim | TRIBE V2 reverse inference (video → brain JSON); TRIBE V2 forward inference (text → predicted brain); pre-cached brain JSON for all demo inputs; pre-baked control-video brain patterns for falsification check |
| **LANE-K** (K2 swarm + iterative loop) | Jacob Cho | K2 Cerebras integration (per-region specialist swarm + iterative-loop orchestration); asyncio.Semaphore(6) + Pydantic strict + retry pattern; iterative-loop end-to-end (8 rounds < 60s); falsification delta computation; per-region attribution observability |
| **LANE-O** (Stage 1 + Stage 2 + integration + frontend) | Johnny Sheng | Stage 1 (Qwen3-VL via OpenRouter); Stage 2 (Opus 4.7 prompt + integration); prompt registry hot-swap; three-Claude-sibling worktree orchestration (vis-brain + vis-graph + orch-glue); per-component pre-cache fallback swap logic; demo runbook |
| **LANE-E** (Packaging + UI + storytelling) | Emilie Duran | Empathy-layer document UI (3 sections × 3 framing modes); cinematic Acts 1+4 launch video; sponsor swap-slides (4 variants); voiceover; Devpost; Round 1 + Round 2 pitch decks; FAQ ammunition deck; pre-cache assembly test (Sat 6 PM) |

---

## 11. What Success Looks Like (memorize this)

### The 90-second demo that wins

1. **BEAT-1 (0:00-0:15) — Recognition.** Workplace footage plays alongside Stage 1 vision report. Judge recognizes the scene; recognizes the action data baseline.
2. **BEAT-2 (0:15-0:35) — Awe.** TRIBE V2 brain-encoding renders. ~20K-vertex cortical mesh glows in sync with footage. Hover-bridges show per-region specialists (the K2 swarm output) cross-talking. Vastness felt as vastness.
3. **BEAT-3 (0:35-1:00) — Surprise (THE HERO REVEAL).** Iterative-loop runs visibly: Round 1 (0.42) → Round 2 (0.58) → Round 3 (0.65) → Round 5 (0.71) → Round 8 (0.84). The score climbing IS the visual reveal. The judge experiences the engine improving in real time.
4. **BEAT-4 (1:00-1:25) — Pride + Comfort.** Final empathy-layer paragraph appears. Voiceover reads it aloud. *"She did not rush. She did not check out. She held space."* Similarity score 0.84. Falsification delta 0.27.
5. **BEAT-5 (1:25-1:30).** Side-by-side: action-data report ("over threshold; cut to 10 min") vs. empathy-layer document ("she held space; brain-grounded; falsified"). The decision-maker would call this differently. The corner-cut doesn't happen.

### The pitch that wins

> *"Vision-language models can describe what a human did. They cannot communicate how that human felt doing it. That gap is the empathy layer — and it's the gap that makes managers cut corners that destroy what their company actually cares about. We built the brain-grounded engine that closes it. Same architecture answers Ironsight's spatial-intelligence brief AND Listen Labs's 'simulate humanity' brief. Same engine runs across construction, healthcare, retail, food service, education, logistics, consumer self-knowledge journaling. The product itself enacts Best Use of AI's YEA rubric: surface evidence, user judges, system never recommends. Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them."*

---

## 12. Where to Read More (the doc map)

If you want more depth, here's the full document tree:

| Doc | What it has |
|---|---|
| **THIS FILE** (`caltech/architecture-overview.md`) | The cohesive overview. Start here. |
| `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` | Engineering-grade spec. 60 functional requirements split per lane. JSON schemas for every data contract. Build checklists. Smoke tests with thresholds. |
| `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` | Strategic PRD. Why we're building this. Sponsor briefs verbatim. One-size-fits-all problem + solution statements. |
| `caltech/use-cases/empathy-layer-hero-output.md` | Hero output strategic framing. Why the empathy-layer paragraph is the load-bearing deliverable. |
| `caltech/use-cases/empathy-layer-prd-simplified.md` | Build-clarity simplified pipeline spec. |
| `caltech/use-cases/two-demo-scenarios.md` | Canonical scenario contract (workplace + consumer). |
| `caltech/use-cases/ironside.md` | Ironsight workplace scenario deep-dive. |
| `caltech/use-cases/listenlabs-sideshift.md` | Listen Labs / Sideshift consumer scenario deep-dive. |
| `caltech/use-cases/yc-partner-stress-test.md` | YC defensibility evaluation. |
| `caltech/use-cases/outsider-advantage-check.md` | Founder-market-fit honest reframe. |
| `caltech/prd-final.md` | Lean reference PRD. |
| `caltech/demo-script.md` | 90-second on-stage shot-by-shot. |
| `caltech/video-story.md` | 3-min Round 2 launch video shoot script. |
| `caltech/research-context/007-johnny-public-corpus-tribe-posts.md` | Clair de Lune precedent (the methodology proof we cite). |

---

## 13. The One-Line Summary

**Video → brain pattern → swarm-interpreted → paragraph candidate → iteratively scored against the brain pattern (8 rounds) → falsified against control → empathy-layer document.**

**Same engine. Two demo scenarios. Pre-cached for reliability.** Manager / user reads the paragraph instead of action data alone. Decision becomes empathy-aware. The corner-cut doesn't happen.

Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.
