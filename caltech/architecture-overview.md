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
v2_locked_2026_04_25_evening: |
  Architecture re-locked after the team regrouped. TRIBE V2 is PRE-RENDERED ONLY —
  the activity.json files in backend/prerendered/{clip}/ are the canonical brain-
  data artifact and were generated offline. Live TRIBE never runs in any direction.
  Stage 2 empathy synthesis runs on K2 (moderator role). Anthropic Opus 4.7 is now
  Stage 4 polish only — cut-line cherry. Iterative-loop scoring uses K2-swarm-as-
  evaluator (each region's K2 specialist scores the candidate paragraph) instead
  of TRIBE forward inference. Falsification numbers come from a sentence-
  transformer embedding proxy (all-MiniLM-L6-v2 → 7-dim Yeo7 projection) that
  stands in for TRIBE forward. Without-TRIBE comparison pass is killed.
  Per-scenario specialist roster collapsed to one shared 7-network roster.
  SynthDebate scoped OUT (was already an open question in v1.0).
  Companion build plan: caltech/build-plan-locked.md.
---

# Architecture Overview — The Empathy Layer Engine

> A stand-alone document. Assume the reader knows nothing about this project. Walk away understanding the whole thing.

---

## 1. The Problem in One Paragraph

Today's AI can describe what humans did and parse what humans said — but it cannot model the cognitive-emotional state underneath the action. A vision-language model watching a construction worker on scaffolding sees *"worker holding a tool near scaffolding edge."* It does not see whether the worker was focused, fatigued, mind-wandering, or in cognitive overload at the moment of the action. A manager reading that report cuts corners that destroy what their company actually wants — patient experience, customer reviews, employee retention — because the action data is missing the human context. **We are building the missing layer.**

---

## 2. The Solution in One Paragraph

The **Empathy Layer Engine** is a single AI pipeline that takes a video of a human taking actions, looks up the **pre-rendered TRIBE V2** brain-pattern JSON for that clip (per-second per-region neural response on the fsaverage5 mesh, generated offline), runs **Qwen3-VL via OpenRouter** in parallel to describe what physically happened, fires a **K2 swarm of 7 Yeo7-network specialists** to read the brain-pattern frame data and emit per-region semantic readings, hands both to a **K2 moderator** that synthesizes one candidate paragraph describing what the human felt during the footage, then iteratively rewrites and re-scores each candidate by re-firing the **K2 swarm as evaluators** (each region rates how faithfully the paragraph captured its reading) across up to 8 rounds with plateau exit, optionally polishes the best paragraph with **Claude Opus 4.7** as a 100-word literary pass, and falsifies the result via a **sentence-transformer embedding proxy** (all-MiniLM-L6-v2 → 7-dim Yeo7 projection) that stands in for live TRIBE forward inference and produces a real cosine-similarity number against the activity target plus a control delta. The output is a **brain-grounded paragraph that reads like a human reading another human**, anchored to evidence the reader can audit. Same engine runs on workplace footage (Ironsight scenario) AND consumer day-to-day footage (Listen Labs / Sideshift / YC scenario). One engine. Two demo scenarios. Pre-cached for demo-day reliability — a `BackgroundTask` warmup runs the entire pipeline once on `/demo/match` and serves all subsequent UI interactions from cache.

---

## 3. The Headline Line (memorize this)

> **Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.**

---

## 4. The End-to-End Architecture (cohesive flow chart — v2)

```
                ╔══════════════════════════════════════════════════════════╗
                ║                                                          ║
                ║   [INPUT: uploaded MP4 → matched to prerendered clip]    ║
                ║                                                          ║
                ║   What goes in: a video of a human taking actions.       ║
                ║   The frontend posts the filename to /demo/match. The    ║
                ║   server strips the extension, looks up                  ║
                ║   prerendered/<clip_id>/, kicks off a BackgroundTask     ║
                ║   that pre-bakes every Layer 1 cache file (vision        ║
                ║   report, swarm readings, k2 region cache, empathy       ║
                ║   document) so subsequent UI interactions are instant.   ║
                ║                                                          ║
                ╚══════════════════════════╤═══════════════════════════════╝
                                           │
                                           │
                       ┌───────────────────┴───────────────────┐
                       │                                       │
                       │  The clip ID is sent to TWO Stage 1   │
                       │  components in parallel:              │
                       │   1A — Qwen3-VL describes WHAT        │
                       │        physically happened.           │
                       │   1B — K2 swarm reads the prerendered │
                       │        TRIBE V2 activity.json and     │
                       │        emits per-region readings of   │
                       │        what each brain area was       │
                       │        contributing.                  │
                       │  Live TRIBE inference does NOT run.   │
                       │                                       │
                       └───┬───────────────────────────────┬───┘
                           │                               │
                           ▼                               ▼

  ┌────────────────────────────────────────┐   ┌──────────────────────────────────────┐
  │                                        │   │                                      │
  │   STAGE 1A — VISION CLASSIFICATION     │   │   STAGE 1B — K2 SPECIALIST SWARM     │
  │   (the "what happened" agent)          │   │   (the "what each brain area was     │
  │                                        │   │    contributing" agents)             │
  │  TOOL: Qwen3-VL via OpenRouter         │   │                                      │
  │   model: qwen/qwen3-vl-235b-a22b-      │   │  TOOL: Cerebras K2 Think             │
  │   instruct                             │   │   (~2000 tok/s; OpenAI-compatible    │
  │                                        │   │    chat-completions; sponsor-        │
  │  WHAT IT DOES:                         │   │    eligible IFM K2 CORE track)       │
  │   Pulls 5 evenly-spaced frames from    │   │                                      │
  │   the MP4 (cv2 → ffmpeg fallback),     │   │  WHAT IT DOES:                       │
  │   sends them as image_url parts to     │   │   Reads prerendered/<clip>/          │
  │   the chat-completions endpoint, asks  │   │   activity.json (the TRIBE V2 per-   │
  │   for a JSON object describing scene,  │   │   second per-region brain-encoded    │
  │   actions, temporal sequence, and      │   │   data layer, baked offline).        │
  │   spatial relationships.               │   │   Pre-aggregates per-network mean,   │
  │                                        │   │   peak time, dominance count, and    │
  │   NO EMOTION CLAIMS. Pure observation. │   │   cross-network co-activation in    │
  │                                        │   │   one pass.                          │
  │  INPUTS: 5 frames + system + user      │   │                                      │
  │   text instruction.                    │   │   Fires 7 parallel K2 calls — one    │
  │                                        │   │   per Yeo7 network (visual,          │
  │  OUTPUT: vision_report.json            │   │   somatomotor, dorsal_attention,     │
  │   { scene_summary, actions[],          │   │   ventral_attention, limbic,         │
  │     temporal_sequence[],               │   │   frontoparietal, default_mode).     │
  │     spatial_relationships[],           │   │   Each uses the existing             │
  │     emotional_tone (descriptive only)} │   │   backend/prompts/{network}.md as    │
  │                                        │   │   the system prompt. Each emits a    │
  │  WHY:                                  │   │   3-line reading: Reading /          │
  │   Action-data baseline. This is what   │   │   Confidence / Cite.                 │
  │   the manager / user would see WITH-   │   │                                      │
  │   OUT our engine. We preserve it as    │   │  OUTPUT: swarm_readings.json         │
  │   §A of the empathy-layer document.    │   │   { regions: { <network>: {          │
  │                                        │   │     reading, confidence, cite } } }  │
  │  LATENCY: ≤ 10s for 30s clip           │   │                                      │
  │  CACHE: backend/prerendered/<clip>/    │   │  WHY:                                │
  │   vision_report.json                   │   │   The activity.json numbers alone    │
  │  STUB FALLBACK: descriptive default    │   │   are not human-readable. The swarm  │
  │   if OPENROUTER_API_KEY missing.       │   │   translates per-network mean        │
  │                                        │   │   activation into per-region         │
  │                                        │   │   semantic readings that Stage 2     │
  │                                        │   │   can synthesize.                    │
  │                                        │   │                                      │
  │                                        │   │  LATENCY: ≤ 8s (7 parallel calls)    │
  │                                        │   │  CACHE: swarm_readings.json          │
  │                                        │   │                                      │
  └────────────────────┬───────────────────┘   └────────────────────┬─────────────────┘
                       │                                            │
                       │                                            │
                       └─────────────────────┬──────────────────────┘
                                             │
                                             ▼

           ┌──────────────────────────────────────────────────────────────────┐
           │                                                                  │
           │   STAGE 2 — EMPATHY SYNTHESIS  (K2 as moderator)                 │
           │                                                                  │
           │  TOOL: Cerebras K2 Think (moderator role)                        │
           │  PROMPT: backend/prompts/moderator_synthesis.md                  │
           │                                                                  │
           │  WHAT IT DOES:                                                   │
           │   Takes:                                                         │
           │    1. Vision Report (Stage 1A) — what physically happened        │
           │    2. Swarm Readings (Stage 1B) — per-region semantics           │
           │    3. (rounds ≥ 2): prior_score + per_region_miss from the       │
           │       iterative loop's last evaluation — directs the rewrite     │
           │       toward regions where the prior candidate underweighted     │
           │                                                                  │
           │   Generates ONE paragraph (~150-300 words). Literature-grade     │
           │   prose. Honors strict guardrails (see §6).                      │
           │                                                                  │
           │  WHY (THE V2 CHANGE):                                            │
           │   Stage 2 used to run on Anthropic Opus 4.7. We swapped K2 in    │
           │   because (a) the loop fires Stage 2 once per round — Opus       │
           │   latency × 8 rounds was the budget killer; (b) K2 already       │
           │   wrote the readings in Stage 1B, so the moderator role keeps    │
           │   the surface coherent; (c) Opus is reserved for the optional    │
           │   Stage 4 polish.                                                │
           │                                                                  │
           │  OUTPUT: candidate paragraph (string)                            │
           │  LATENCY: ≤ 5s per candidate                                     │
           │                                                                  │
           └────────────────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼

           ┌──────────────────────────────────────────────────────────────────┐
           │                                                                  │
           │   STAGE 3 — ITERATIVE LOOP  (K2 swarm AS EVALUATOR)              │
           │   (the score-climbing reveal — Clair-de-Lune protocol            │
           │    substitute)                                                   │
           │                                                                  │
           │  TOOL: Cerebras K2 Think — same surface as Stages 1B and 2,      │
           │   third role: per-round evaluator swarm.                         │
           │  PROMPT: backend/prompts/evaluator_score.md                      │
           │                                                                  │
           │  WHAT IT DOES (this is the magic, v2 edition):                   │
           │                                                                  │
           │   For round in 1..8:                                             │
           │     1. Take the candidate paragraph from Stage 2.                │
           │     2. Fire 7 parallel K2 evaluator calls — one per Yeo7         │
           │        network. Each evaluator:                                  │
           │          - identifies as that network's specialist               │
           │          - reads the candidate paragraph                         │
           │          - reads its region's expected reading (from             │
           │            swarm_readings.json)                                  │
           │          - outputs:  Score: 0.XX                                 │
           │                      Justification: <one sentence>               │
           │     3. overall_score = mean of the 7 region scores.              │
           │     4. per_region_attribution recorded for the empathy doc.     │
           │     5. If round ≥ 3 AND |Δ| < 0.02 over 2 consecutive rounds    │
           │        OR round == 8: EXIT. Best paragraph = highest-scoring    │
           │        round (defensive against late drops).                    │
           │        Otherwise: feed per_region_miss back to Stage 2 →        │
           │        next candidate.                                          │
           │                                                                  │
           │   Round 1 score: ~0.42                                           │
           │   Round 2 score: ~0.58                                           │
           │   Round 3 score: ~0.65                                           │
           │   Round 5 score: ~0.71                                           │
           │   Round 8 score: ~0.84                                           │
           │   ★ THE SCORE CLIMBING IS THE DEMO'S VISUAL REVEAL ★             │
           │                                                                  │
           │  WHY (THE V2 CHANGE):                                            │
           │   v1.0 used TRIBE V2 forward-direction inference (text →         │
           │   predicted brain pattern → cosine vs. activity target). v2     │
           │   replaces that with K2-swarm-as-evaluator: each region's K2    │
           │   specialist rates how faithfully the paragraph captured its    │
           │   reading. Same shape (per-region scores), no live TRIBE.       │
           │   Cheaper, deterministic, no GPU.                                │
           │                                                                  │
           │  OUTPUT: { best_paragraph, final_score,                          │
           │            round_trajectory[], per_region_attribution }          │
           │  LATENCY: ≤ 60s for 8 full rounds                                │
           │  CACHE: empathy.json + iterative_trajectory.json                 │
           │                                                                  │
           └────────────────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼

           ┌──────────────────────────────────────────────────────────────────┐
           │                                                                  │
           │   STAGE 4 — POLISH (optional, cut-line)                          │
           │                                                                  │
           │  TOOL: Anthropic Claude Opus 4.7  (claude-opus-4-7)              │
           │  ROLE: ~100-word literary polish over Stage 3's best paragraph.  │
           │                                                                  │
           │  This is the ONLY place Opus runs in v2. If the team is behind   │
           │  schedule at 8 PM Saturday, Stage 4 is the FIRST cut. K2's       │
           │  best_paragraph ships as-is.                                     │
           │                                                                  │
           │  LATENCY: ≤ 5s                                                   │
           │                                                                  │
           └────────────────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼

           ┌──────────────────────────────────────────────────────────────────┐
           │                                                                  │
           │   STAGE 5 — FALSIFICATION (embedding proxy)                      │
           │   (the "prove the paragraph is grounded, not confabulated"       │
           │    safety net)                                                   │
           │                                                                  │
           │  TOOL: sentence-transformers/all-MiniLM-L6-v2 (CPU, ~50ms,       │
           │   lazy singleton) +                                              │
           │   a 384 × 7 projection matrix W fit offline from                 │
           │   backend/services/embedding_proxy/training_pairs.yaml           │
           │                                                                  │
           │  WHAT IT DOES (v2 edition):                                      │
           │   1. embed_text(paragraph) → 384-dim vector                      │
           │   2. project_to_yeo7(emb) = emb @ W  → 7-dim Yeo7 vector         │
           │   3. activity_target_vector(activity.json) = mean per network    │
           │   4. similarity = cosine(projected, target)                      │
           │   5. Same projection against control activity.json:              │
           │      control_score = cosine(projected, control_target)           │
           │   6. delta = similarity − control_score                          │
           │   7. verdict = "anchored" if delta > 0.40 else                   │
           │                "generic_plausible"                               │
           │                                                                  │
           │  WHY (THE V2 CHANGE):                                            │
           │   v1.0 ran TRIBE V2 forward-direction on the paragraph text to   │
           │   predict a brain pattern, then cosine'd it against the activity │
           │   target. With live TRIBE off the table, the embedding proxy     │
           │   stands in: the W matrix was fit from 10 hand-paired (text,    │
           │   per-network activation) examples and produces real cosine     │
           │   numbers, deterministic and CPU-only. Same falsification        │
           │   logic; different scorer.                                       │
           │                                                                  │
           │  OUTPUT: { main_score, control_score, delta, verdict }           │
           │  LATENCY: ≤ 200ms                                                │
           │  CACHE: falsification.json                                       │
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

**Same prerendered TRIBE V2 activity.json. Same Qwen vision pass. Same K2 swarm (one shared 7-network roster — no per-scenario specialist swap in v2). Same K2 moderator. Same K2-swarm-as-evaluator iterative loop. Same embedding-proxy falsification. Same empathy-layer document.** Only the input file changes; everything downstream runs unchanged. The frontend reads `scenario` from `/demo/match` and routes the rendered document through `PersonaShell` for workplace vs. consumer accent treatment.

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

### Per-stage latency metrics (for smoke gate — v2)

| Stage | Threshold | Fallback if exceeded |
|---|---|---|
| Stage 1A vision (Qwen3-VL) | ≤ 10s for 30s clip | Pre-baked vision_report.json |
| Stage 1B K2 swarm (7 parallel) | ≤ 8s | Pre-baked swarm_readings.json |
| TRIBE reverse | n/a (PRE-RENDERED only — activity.json on disk) | Disk read |
| Stage 2 K2 moderator (per candidate) | ≤ 5s | Pre-baked paragraph trajectory |
| Stage 3 iterative loop (8 rounds, K2 evaluators) | ≤ 60s | Pre-baked iterative_trajectory.json |
| Stage 4 Opus polish (optional) | ≤ 5s | Cut entirely if behind |
| Stage 5 embedding-proxy falsification | ≤ 200ms | Disk read of falsification.json |
| /demo/k2-region (brain-3D click) | < 50ms post-warmup | Disk read of k2_region_cache.json |
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

**Why pre-cache (v2 reasons):**

1. **Stage 1A vision API can rate-limit.** OpenRouter / Qwen3-VL throughput varies; one bad call breaks BEAT-1.
2. **Iterative loop has 56 K2 calls minimum.** 8 moderator calls + 7×8 = 56 evaluator calls; any single timeout breaks BEAT-3.
3. **Brain-3D interaction must be instant.** Per-region clicks fire `/demo/k2-region` — pre-baking the 7×N grid of K2 readings turns each click into an O(1) cache lookup.
4. **Wi-Fi at venue is unreliable.** Multiple speakers + judges + 100+ teams all hitting venue Wi-Fi.
5. **Demo determinism matters.** Same input twice should produce same output; LLM temperature variance breaks back-to-back judging.
6. **TRIBE V2 was always going to be pre-rendered.** That's not a v2 change — that decision is upstream.

**What gets pre-baked Saturday 8 AM (per-clip):**

```
backend/prerendered/<clip_id>/
  ├── <clip_id>.mp4                  source video
  ├── activity.json                  TRIBE V2 reverse output (offline-baked, the canonical brain artifact)
  ├── scenario.json                  scenario tag + label
  ├── vision_report.json             Stage 1A (Qwen3-VL)
  ├── swarm_readings.json            Stage 1B (K2 per-region readings)
  ├── k2_region_cache.json           7 × N seconds K2 readings — instant brain-3D clicks
  ├── empathy.json                   full pipeline output (vision + readings + best paragraph + trajectory + falsification)
  ├── iterative_trajectory.json      round-by-round score + excerpts for BEAT-3 reveal
  └── falsification.json             main vs control delta + verdict

backend/prerendered/workplace_routine_baseline/activity.json   control for ironside
backend/prerendered/curated_short_film_baseline/activity.json  control for consumer
backend/services/embedding_proxy/projection_map.npy            384 × 7 matrix W (fit once from training_pairs.yaml)
```

The warmup task lives in `backend/services/warmup.py:warmup_clip` and is triggered by `POST /demo/match` as a `BackgroundTask`. Frontend `LoadingStage.vue` polls `GET /demo/warmup-status/{clip_id}` until `ready: true` before transitioning to Main.

**Demo-day operating mode:** Saturday 8 AM the warmup runs once per clip and the resulting JSON is committed to the repo. On stage, those JSON files are already on disk — every endpoint becomes a disk read. Live attempt runs in the background; if it lands cleanly, swap in. If not, the pre-cache IS the demo. Honest framing throughout.

---

## 9. The Stack (every tool, every model ID, every cost — v2)

| Layer | Tool | Model ID / endpoint | Cost | Why this tool |
|---|---|---|---|---|
| **Stage 1A — Vision** | Qwen3-VL via OpenRouter | `qwen/qwen3-vl-235b-a22b-instruct` | $0.20 in / $0.88 out per M tokens | Beats GPT-5 on OCR; competitive vision; Anthropic vision is reportedly weaker per Johnny. |
| **TRIBE V2 — Brain encoding** | Meta TRIBE V2 (PRE-RENDERED) | activity.json on disk; baked offline | Free (CC-BY-NC-4.0; non-commercial; attribution required) | Live inference is dropped from v2. activity.json files are the canonical artifact. |
| **Stage 1B / Stage 2 / Stage 3 — K2 (3 roles)** | Cerebras K2 Think | `https://api.k2think.ai/v1` (OpenAI-compatible chat-completions) | Free (sponsor-eligible; IFM K2 CORE track) | ~2000 tok/s. Three roles on the same surface: per-region specialists (Stage 1B), moderator synthesis (Stage 2), per-region evaluators (Stage 3 iterative loop). `asyncio.Semaphore(6)` gates the Stage 3 evaluator fan-out. |
| **Stage 4 — Polish (optional)** | Anthropic Claude Opus 4.7 | `claude-opus-4-7` (Messages API) | $5 in / $25 out per M tokens (+35% tokenizer bloat) | ~100-word literary polish over the K2 best paragraph. Cut-line; first to drop if behind. |
| **Stage 5 — Falsification proxy** | sentence-transformers/all-MiniLM-L6-v2 | local CPU; 384-dim | Free | Sentence-embedding stand-in for live TRIBE forward. Lazy singleton; ~50ms per call. Projection W (384 × 7) fit offline from `training_pairs.yaml`. |
| **Frontend** | Vue 3 `<script setup>` + Three.js | (browser-side rendering) | Free | 3D cortical mesh + iterative-loop visualization at ≥30 FPS on demo laptop. PersonaShell wrapper switches workplace/consumer accent treatment. |

**Total demo cost per 90s run:** ≈$0.02 (Qwen vision + optional Opus polish). K2 + embedding proxy are free. Even 50 demo runs across pavilion judging ≈ $1.00 total.

---

## 10. The Team Lanes (who builds what — v2)

| Lane | Owner | Primary deliverables |
|---|---|---|
| **LANE-J** (Embedding proxy + bake scripts; TRIBE forward DROPPED) | Junsoo Kim | `services/embedding_proxy/` (training pairs + lstsq fit + projection_map.npy); `services/falsification.py`; control activity.json synthesis (`workplace_routine_baseline`, `curated_short_film_baseline`); scenario.json bakes; pre-cache verification on Saturday 8 AM |
| **LANE-K** (K2 swarm + moderator + iterative loop + cache + warmup) | Jacob Cho | `services/swarm_runner.py` (Stage 1B); `services/empathy_synthesis.py` (Stage 2 K2 moderator); `services/iterative_loop.py` (Stage 3 K2 evaluators + plateau exit); `services/session_cache.py` + `services/warmup.py` + `services/guardrails.py`; new prompts (`moderator_synthesis.md`, `evaluator_score.md`); endpoints `/demo/empathy`, `/demo/iterative-trajectory`, `/demo/falsification`, `/demo/warmup-status` |
| **LANE-O** (Stage 1A + frontend + integration) | Johnny Sheng | Rewrote `services/vision_client.py` for OpenRouter + Qwen3-VL; `frontend/src/App.vue` 5-stage routing (landing → loading → main → iterative-reveal → empathy-document); `IterativeRevealStage.vue`, `EmpathyDocumentStage.vue`, `RoundScoreBar.vue`, `PersonaShell.vue`; `LoadingStage.vue` warmup-gating; main.py glue |
| **LANE-E** (Packaging + UI polish + storytelling) | Emilie Duran | Empathy-layer document UI typography (Crimson Pro / serif for §B paragraph); cinematic Acts 1+4 launch video; sponsor swap-slides (4 variants — `caltech/pitch-deck/app/sponsor/[sponsor]/page.tsx` already wired with literals); voiceover WAV; Devpost; Round 1 + Round 2 pitch decks; FAQ ammunition deck; pre-cache assembly test (Sat 6 PM) |

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
| **THIS FILE** (`caltech/architecture-overview.md`) | The cohesive overview (v2 — post-TRIBE-cut). Start here. |
| `caltech/build-plan-locked.md` | The v2 build plan with file-level lane assignments, contracts, and the cache + warmup spec. Companion to this overview. |
| `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` | Engineering-grade spec (v2 update applied). 60 functional requirements split per lane. JSON schemas for every data contract. Build checklists. Smoke tests with thresholds. |
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

**Video → matched to prerendered TRIBE activity.json → Qwen describes the scene + K2 swarm reads each brain region → K2 moderator writes a candidate paragraph → K2 swarm rates it region by region across up to 8 rounds → optional Opus polish → embedding-proxy falsification against a control clip → empathy-layer document.**

**Same engine. Two demo scenarios. Pre-cached for reliability — warmup runs once on `/demo/match` and every subsequent UI interaction reads from cache.** Manager / user reads the paragraph instead of action data alone. Decision becomes empathy-aware. The corner-cut doesn't happen.

Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.
