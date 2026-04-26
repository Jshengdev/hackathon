---
title: Product Requirements Document — Caltech HackTech 2026 (Demo + Product)
project_name: hackathon
scope: |
  This PRD defines the actual demo and product being built for Caltech HackTech 2026 — the
  hackathon slice end-to-end. The 90-second on-stage demo is the user-facing artifact; the
  product behind it is the TRIBE-V2 + K2-swarm + Opus + 3D-viz architecture that runs the
  demo and represents the deployable product surface (with documented hackathon-vs-production
  scope cuts where they apply).

  COMPANION FILE: caltech/video-story.md is the visualization/launch-video narrative wrapper
  (the 3-minute Round 2 launch video Emilie shoots). That file covers the cinematic
  storytelling layer ABOUT the product. THIS file covers the product itself.
author: Johnnysheng (PM/Integration); Junsoo Kim (TRIBE V2); Jacob Cho (K2 swarm); Emilie Duran (Packaging)
date: 2026-04-25
workflowType: prd
releaseMode: single-release
freeze: 2026-04-26 8 PM PDT
submit: 2026-04-26 11 PM PDT
hardDeadline: 2026-04-27 9 AM PDT
classification:
  projectType: web_app_demo (frontend-heavy real-time AI pipeline + 3D visualization; product is the actual running system, demo is its 90-second on-stage execution)
  domain: ai_neuroscience_consumer (Best Use of AI hard target; Creativity; Listen Labs; Sideshift; Ironside)
  complexity: high
  projectContext: greenfield (48 person-hour build window; brownfield team-context: locked decisions, PRFAQ, prd-final.md, demo-script, narration-script all extant)
inputDocuments:
  - caltech/PRD-INPUT-BUNDLE.md
  - caltech/prd-final.md
  - caltech/prd.md
  - caltech/prfaq.md
  - caltech/demo-script.md
  - caltech/narration-script-3min.md
  - caltech/emilie-brief.md
  - caltech/CONSOLIDATION-REPORT.md
  - caltech/HANDOFF.md
  - caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md
  - caltech/validation-findings/2026-04-25-capability-inventory-summary.md
  - caltech/validation-findings/2026-04-25-treehacks-pattern-search.md
  - caltech/validation-findings/2026-04-25-team-gap-fillers.md
  - caltech/validation-findings/2026-04-25-blockers-reclassified-pitch-vs-product.md
  - caltech/validation-findings/2026-04-25-phase-2-party-mode-pass-1.md
  - caltech/research-context/004-spotify-wrapped-as-format.md
  - caltech/research-context/005-bereal-as-anti-curation-pattern.md
  - caltech/research-context/007-johnny-public-corpus-tribe-posts.md
  - caltech/research-context/008-devpost-exemplars-mindpad-terralink.md
  - caltech/tasks-by-person/junsoo-tribe-v2.md
  - caltech/tasks-by-person/jacob-agent-swarms.md
  - caltech/tasks-by-person/johnny-orchestration.md
  - caltech/tasks-by-person/emilie-storytelling-research.md
  - caltech/context/yaps/2026-04-25-pivot-best-use-of-ai-hard-target-cultural-flattening-frame.md
  - caltech/yaps/2026-04-25-prfaq-canvas/01-high-signal-extracts.md
  - caltech/yaps/2026-04-25-empowerment-synthesis/01-high-signal-extracts.md
  - caltech/yaps/2026-04-25-listenlabs-conversation/01-high-signal-extracts.md
  - caltech/yaps/2026-04-25-future-angle-bci-superhumanitarian/01-high-signal-extracts.md
  - caltech/yaps/2026-04-25-execution-layer-search/01-high-signal-extracts.md
  - caltech/yaps/2026-04-25-capability-first-pivot/01-high-signal-extracts.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/README.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md
  - research/wiki/decisions/README.md (16 decisions)
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
documentCounts:
  briefs: 1
  research: 8
  brainstorming: 7
  projectDocs: 30+
crossLinks:
  prdFinalReference: caltech/prd-final.md
  demoScript: caltech/demo-script.md
  narrationScript: caltech/narration-script-3min.md
  videoStory: caltech/video-story.md
---

# Product Requirements Document — Caltech HackTech 2026 (Demo + Product)

**Author:** Johnny Sheng (PM/Integration), Junsoo Kim (TRIBE V2), Jacob Cho (K2 swarm), Emilie Duran (Packaging)
**Date:** 2026-04-25
**Scope of this file:** The actual **demo and product** being built — the hackathon slice end-to-end. Pipeline (TRIBE V2 → K2 swarm → Opus → 3D viz), output cards, Land-card mechanic, integration contracts, smoke-test gates, freeze + submit timeline.
**Companion file:** [`caltech/video-story.md`](../../caltech/video-story.md) — the visualization/launch-video narrative wrapper (3-minute Round 2 launch video). That file covers cinematic storytelling ABOUT the product; this file covers the product itself.
**Reference draft:** [`caltech/prd-final.md`](../../caltech/prd-final.md) (lean version) — this is the comprehensive BMAD-format companion.

> **[TBD-FINAL-PASS]** product name, headline, sponsor close wording. Per "draft everything at the very end" doctrine.

---

## Executive Summary

### Vision Alignment

We are building a runnable consumer-product surface for *augmented introspection* — and a 90-second on-stage demo that exercises it end-to-end. The product takes a Gen-Z user's screen-recording of their Reels/TikTok feed, runs it through Meta FAIR's TRIBE V2 brain-encoding model (1Hz, ~20,000 cortical-vertex predictions on the fsaverage5 mesh), fans the per-region activation stream into a K2-Think swarm of region-specialist agents (one agent per brain region, ~1,300 tok/s on Cerebras), lets those agents talk to each other (cross-region communication is the load-bearing architectural distinction from prior debate-triad winners), synthesizes the cross-region output through a Claude Opus depth layer, and renders the result as a Spotify-Wrapped-style 5-card output anchored on an "Inverted-Brain-Search Land card" — click a grayed-out brain region, see content **formats** that would activate it, never recommendations.

The product target is the Gen-Z AI-native teen (born ~2008-2010) who has never had a reference frame outside the algorithm. The transformation we promise is Johnny's verbatim doctrine: *"Return human autonomy with the ability to see your thoughts."*

**Hackathon-vs-production scope cut.** The product is real and runnable; the hackathon slice is the 90-second on-stage demo of it. Per the demo-over-execution doctrine (Decision 011) and smallest-possible-circle doctrine: the 90-second demo IS the smallest viable shipment unit of the product. Live-with-pre-cache fallback strategy applies — we attempt the product live; per-component pre-cached fallbacks ensure the demo always lands. Production-only scope (consented streaming pipeline, multi-user social product, full reverse-search backend at scale, mobile app) is explicitly parked — see Out-of-Scope below.

### What Makes This Special

**The product enacts the answer to the "Best Use of AI" track question** rather than describing it. The YEA/NAY rubric (locked) — *make invisible processes visible / surface options the user judges / menial high-throughput work at scale (K2 swarm) / synthesize across signals (Opus)* on the YEA side; *recommend / harvest data without consent / replace user judgment / present-as-human* on the NAY side — is the explicit ethical position the architecture demonstrates beat-by-beat.

**The "no recommendation" positioning is structural, not rhetorical.** Johnny verbatim: *"We don't want to recommend anything to you because that's how the algorithm works. We want to give you accessible information using AI so that you can make good judgments."* The Land card surfaces content **formats** (long-form essays, poetry, language-learning, wordplay) that would activate a region the user's feed never touched — no closed-loop optimization for engagement, no vendor-side optimization at all. Inversion of the recommender, not iteration on it.

**The credibility chip is shipped, dated, public.** Johnny's Synthetic Synesthesia work — 60 seconds of Clair de Lune in, 90.4% emotion-center match across 20,484 cortical vertices out, falsified against triumphant music / rain / aggressive speech — is primary-source evidence the methodology works *before* the team writes any new code. Last year's Renaissance Research winner had no comparable precedent.

**The architectural differentiation from Renaissance Research is structural, not cosmetic.** Brain-encoding-as-grounding (vs. text-only). N-specialists-per-region (vs. fixed three-role debate triad). User's own brain-fire pattern as the auditor (vs. another LLM). Reels-input video (vs. search-box text). By 0:10 of the demo, the sensory and epistemic frame is unambiguously different.

**The multi-track gamble is acknowledged and structurally sound.** Johnny verbatim: *"This is the worst way to come up with ideas... but name another scenario where you're able to fit every single sponsored track into one idea. It's a huge gamble — it's the hackathon method."* One spine (empowerment), input-source-as-persona-switch (Reels for B2C / Listen Labs / Sideshift; egocentric construction video for Ironside), four sponsor-specific 1-slide swaps. K2 is structurally required (swarm fan-out at this scale doesn't fit 90s at Claude latency); TRIBE V2 + brain-encoding is intrinsic, not bolted on.

**The synthesis pick — Adaptation 2 (Shareable Brain Card) + SynthDebate-on-Brain — solves Johnny's "stats are not enough" critique** with a predicted-population-dynamics artifact that uses TRIBE+K2 load-bearing. SynthDebate uses 100 synthetic agents whose brain-response profiles match the user, war-gamed over 5 rounds; only K2's ~1,300 tok/s fits 100K tokens in 90s. Listen Labs fit is explicit (multi-agent opinion dynamics is their stated track brief). Cortex.buzz (the *attention-engineering* TRIBE V2 application) is named comparable for FAQ ammunition: *"Big tech uses brain models for X; we use the same model for not-X. Manipulation only works in the dark."*

## Project Classification

- **Project Type:** Web app + real-time AI pipeline. Front-end is 3D visualization on Three.js / R3F (browser-based desktop demo); back-end is TRIBE V2 inference + K2 Cerebras swarm orchestration + Claude Opus synthesis. The product is what's running; the on-stage 90s demo is the user-facing slice. Live-with-pre-cache fallback is the operating mode (snippet representation when live fails).
- **Domain:** AI / Neuroscience / Consumer (Best Use of AI hard target; Creativity, Listen Labs, Sideshift, IFM K2 core; Ironside core via input-source persona switch; YC stretch).
- **Complexity:** High. Three reasons: (1) Brain-encoding model integration (TRIBE V2 license CC BY-NC 4.0, canonical-reference forbidden-claim guardrails, out-of-distribution degradation behavior). (2) Multi-track sponsor strategy demands one product surface enact four distinct sponsor narratives with measurable architectural fit. (3) Live AI pipeline on stage with 90-second budget under hostile-judge scrutiny requires both live-attempt and per-component pre-cache fallbacks orchestrated under freeze. The product is non-trivially deep; the demo is the timed slice.
- **Project Context:** Greenfield from a code standpoint (build window opens at hackathon start; budget ~48 person-hours). Brownfield from a planning standpoint — 16 locked decisions, PRFAQ Stage 1, prd.md draft v1, demo-script.md, narration-script-3min.md, validation-findings × 5, capability-inventory with SynthDebate recommendation, all extant and feeding this PRD.

### Two-Demo-Scenarios Contract (LOCKED 2026-04-25)

The product ships **two demo input scenarios on the same engine** (per Decision 010 input-source-as-persona-switch + Johnny verbatim 2026-04-25):

| Scenario | Input source | Persona | Sponsor closes hit | Doc |
|---|---|---|---|---|
| **A** — Job-Site Data Layer | Egocentric construction-worker video | Construction safety manager + the worker | Ironside (CORE) | [`caltech/use-cases/ironside.md`](../../caltech/use-cases/ironside.md) |
| **B** — Consumer Day-to-Day Data Layer | Reels/TikTok feed screen-recording | Maya, Gen-Z teen | Listen Labs (CORE) + Sideshift (CORE via vault) + Best AI (HARD TARGET) + Creativity + K2/IFM + YC stretch | [`caltech/use-cases/listenlabs-sideshift.md`](../../caltech/use-cases/listenlabs-sideshift.md) |

**Same TRIBE V2 + K2 swarm + Opus + 3D viz pipeline runs unchanged across both inputs.** Scenario B is the primary live demo (BEAT-1 through BEAT-4 ext). Scenario A swaps in for Ironside pavilion only (pre-baked 20s side-by-side MP4). Canonical contract: [`caltech/use-cases/two-demo-scenarios.md`](../../caltech/use-cases/two-demo-scenarios.md).

**New user-facing vocabulary locked 2026-04-25 (Johnny verbatim):**
- **brainrot** — Gen-Z native term for algorithmic neural convergence (Scenario B user-facing copy; replaces academic phrasing in voiceover/cards/Devpost)
- **algorithm breaking out argument** — user-facing term for SynthDebate output (the specific argument that would flip the user, surfaced for immunization not weaponization)
- **data layer** — TRIBE V2's per-second per-region brain-activation JSON framed as data-infrastructure (used in both scenarios — Ironside pavilion + technical sections)

### Demo-vs-Product Layer Cake (the scope hierarchy this PRD covers)

| Layer | What it is | Where it's defined | Hackathon scope? |
|---|---|---|---|
| **Product** | The runnable consumer surface — TRIBE V2 → K2 swarm → Opus → 3D viz → Wrapped output → Land card. Real architecture, real I/O contracts, real per-region specialists, real cross-region 2-pass protocol. Browser-based desktop demo target. | THIS PRD §3-§5, §7-§8 (Solution architecture, Output shape, Per-person silos), Functional Requirements §FR1-§FR53 | ✅ YES — built end-to-end within 48 person-hours |
| **Demo (90s on-stage execution)** | The 90-second BEAT-1-through-BEAT-5 timed slice of the product running live for a judge. The product IS the demo running for 90 seconds. | THIS PRD §6 (Demo skeleton), `caltech/demo-script.md` (shot-by-shot) | ✅ YES — the user-facing artifact judges score |
| **Launch video (3-min Round 2)** | Cinematic narrative ABOUT the product — Acts 1+4 cinematic + Act 3 demo footage + Act 4 close. Pre-rendered MP4 for Round 2 pitch + Devpost embed. | `caltech/video-story.md` (NOT this PRD), `caltech/narration-script-3min.md` | ✅ YES — Emilie owns; covered by COMPANION file |
| **Production product (post-hackathon)** | Consented user data pipeline; multi-user social product; full reverse-search backend at scale; mobile app. | This PRD §Out of Scope, Vision section | ❌ NO — explicitly parked |

**Reading discipline.** This file describes the actual demo + product (layers 1+2). The launch-video story (layer 3) lives in `caltech/video-story.md` and is the visualization wrapper Emilie shoots from. Production-only scope (layer 4) is parked. When this PRD says "demo," we mean the 90s on-stage slice of the actual product running. When it says "product," we mean the runnable architecture behind the demo.

---

## Success Criteria

### User Success

The user (judge experiencing the 90-second demo) succeeds when, in order, they:

1. **Recognize the surface (BEAT-1, 0:00–0:15).** They see the Reels feed scrolling and recognize it instantly — no explanation needed. The cortical mesh appears beside it and they recognize it as neuroscience-credible without anyone saying "this is your brain."
2. **Feel awe (BEAT-1 → BEAT-2, 0:10–0:20).** The cortical-vertex render is dense enough that the vastness of the brain is felt as vastness, not as decoration. ~20,000 vertices on fsaverage5 visibly rendered at ≥30 FPS on demo laptop.
3. **See cross-region cross-talk on demand (BEAT-2, 0:20–0:30).** When a user (or Emilie's hand on screen) hovers over a region, bridges between regions light up with reasoning fragments flowing along the edges. Bridges grayed by default; light up on focus. The swarm's responsiveness becomes visible only on user gesture (Victor's required kill-shot move).
4. **Feel the convergence as measurable (BEAT-2 → BEAT-3, 0:30–0:55).** Three different feed scrolls visibly activate the same brain regions in the same sequence. The pattern repeats hauntingly. The judge can SEE Listen Labs' "convergence of society" claim as a measurable visual phenomenon, not as rhetoric.
5. **Feel the surprise of within-subject divergence (BEAT-3, 0:55–1:10).** Same brain, different input (curated short film). Same regions, completely different firing pattern. The lock the algorithm set wasn't structural — it was learned. *Per Quinn validation pass 2: within-subject contrast only; never population-norm comparisons.*
6. **Land on Pride + Comfort with the inverted-brain-search hero gesture (BEAT-4, 1:15–1:30).** The Wrapped cards swipe through. Card 5 is the Land card. The user clicks a grayed-out region (e.g., Broca's Area / language production). A suggestion card appears with content **formats** that would activate it — long-form essays, poetry, linguistic deep-dives, language-learning, wordplay games. **No links. No "go buy this."** Then the positioning voiceover lands: *"We don't want to recommend anything to you because that's how the algorithm works. We want to give you accessible information using AI so that you can make good judgments."*
7. **Optional Adaptation-2 takeaway: walk away with a shareable Brain Card** — 1:1 aspect-ratio Instagram-Story shape, top 5 activated regions, top 3 dormant, formats consumed/avoided, *"My brain this week — what about yours?"* + shareable link.
8. **Optional SynthDebate-on-Brain ten-second beat** (if scope allows): user sees a 100-agent synthetic-population debate on the same content their brain just consumed. Output: opinion-stability metric, susceptibility-to-disagreement signal, the argument that flipped 60% of brains-like-theirs.

The "aha moment" is BEAT-4. Specifically: the click on a grayed-out region. That single gesture is the demo's center of gravity per Johnny's hero-mechanic lock. If that gesture lands, the demo lands.

### Business Success

The hackathon "business" is sponsor-track-prize coverage and downstream career narrative. The PRD measures:

- **Best Use of AI track win (hard target).** Validation: the YEA/NAY rubric is mentioned by judges or scoring matches the rubric.
- **Creativity track win (definite).** Validation: 3D cortical viz + hover-bridges + Wrapped output mentioned in scoring.
- **K2/IFM core track win.** Validation: K2 is structurally required; ~1,300 tok/s on Cerebras enables swarm fan-out within 90s budget; 100K-token SynthDebate sim also K2-only. Judge mentions speed/scale.
- **Listen Labs core track win.** Validation: BEAT-3 toggle visualizes generational convergence; SynthDebate-on-Brain is explicit fit for their multi-agent opinion-dynamics brief. Judge mentions "synthetic profiles" or "opinion dynamics."
- **Sideshift core track win.** Validation: shareable Brain Card seeds viral mechanic; positioning is "consumer tool for capturing your data — for you."
- **Ironside core track win.** Validation: same engine swap-applied to egocentric construction video; cognitive-emotional-state inference per construction action surfaces job-fit / training-depth / risk-classification signal.
- **YC stretch (named target).** Validation: future-Obsidian framing — knowledge graph is the user's brain-response shape, not typed notes. Two monetization paths held: (a) hosted "FOR you" / (b) local-first pay-once.
- **Career-narrative wins** (per Decision 003 lane locks): Junsoo's TRIBE+swarm cross-talk protocol spec is publishable, IDM-Lab-relevant. Jacob's K2 swarm + cross-region observability pattern is the resume narrative he wants. Johnny's 3-parallel-Claude orchestration is a methodology demo. Emilie's launch-video and packaging quality bar is *"pass the startup test."*

### Technical Success

- **TRIBE V2 inference latency on demo GPU** for a 30-second clip: < 30 seconds on Friday-night smoke test #1. Below threshold = pre-cache mandatory for BEAT-1 input.
- **K2 swarm load test:** 10 concurrent specialist calls in a 30-second window with zero timeouts on Friday-night smoke test #2. Below threshold = pre-cache mandatory for BEAT-2.
- **Renaissance differentiation rehearsal:** show first 60s to a teammate playing "I scored Renaissance last year" — no pattern-match within 10s. Below threshold = re-cut first 10s.
- **3D rendering FPS on demo laptop:** ≥ 30 FPS for fsaverage5 mesh + knowledge graph layer. Below threshold = mesh decimation OR pre-baked camera motion.
- **Wi-Fi contingency:** full demo runs on phone hotspot with zero API timeouts. Below threshold = full backup MP4.
- **Swarm output coherence:** 8-region outputs share < 50% semantic overlap (i.e., specialists ARE producing semantically distinct outputs, not collapsing to corpus mean). Below threshold = harden region-specific prompts.
- **Demo determinism:** 2 back-to-back runs on the same input show < 5% variance in narrative output. Below threshold = temp=0, lock seeds, or pre-record output.
- **Figma-to-data contract:** Jacob exports mock JSON; Emilie imports to Figma cards; no box overflow. Below threshold = adjust card layouts.
- **Pre-cache assembly test (Saturday 6 PM):** Emilie runs entire 90s using only pre-recorded assets. Pass = live is bonus; fail = re-cut pre-cache MP4s.

### Measurable Outcomes

- **Hard demo-day metric.** 4/4 emotional beats (Recognition / Awe / Surprise / Pride+Comfort) land in 90s on a sample-of-3 informal smoke test Friday night. Self-audit table at bottom of `demo-script.md` is the rubric.
- **Hard sponsor metric.** ≥ 4 of 6 targeted sponsor tracks (Best AI, Creativity, K2, Listen Labs, Sideshift, Ironside) score the project in their top 3.
- **Founder-credibility metric.** The Clair de Lune precedent (90.4% match across 20,484 vertices, 8 iterative rounds) is named verbatim in either the 3-min Round 2 narration OR the FAQ ammunition during judging.
- **Engineering-budget metric.** Total person-hours consumed ≤ 48 (12h × 4 people; Decision 016). Track via per-person daily check-in.
- **Submission metric.** Devpost submission complete by Saturday 11 PM PDT (10h buffer to Sunday 9 AM hard deadline; Decision 012).

---

## Product Scope

> **Single-release scope** (hackathon submission Saturday 11 PM PDT). Per BMAD step-08 critical rule: phasing is NOT automatic; user (Johnny) has not requested phased delivery; all in-scope items ship in this single release.

### MVP — Minimum Viable Product (the runnable product + its 90-second on-stage demo)

The MVP has two parallel deliverable streams: (A) the **product** (what's actually running) and (B) the **demo + packaging** (what the judge experiences). Both ship as the single hackathon submission.

**A. Product (what's actually running — the architectural slice)**

1. **TRIBE V2 inference pipeline.** Video-in (screen-recording MP4) → per-second per-region brain-activation JSON `{time_s, region_id, activation, vertices[]}` on fsaverage5 mesh. Junsoo owns. Live target: < 30s latency on 30s clip on demo GPU.
2. **K2 swarm orchestration.** Per-region specialist agent fan-out. Round 1 hypothesis + Round 2 cross-eval (cross-region 2-pass). Aggregator JSON `{per_region_specialist_output, cross_region_edges_with_weights}`. Jacob owns. Live target: 10 concurrent specialist calls in 30s with zero timeouts.
3. **Claude Opus depth-synthesis layer.** Aggregated swarm output → Wrapped card narrative text + Land card grayed-region suggestion content. Johnny + Jacob owns.
4. **3D visualization frontend.** Three.js / R3F (Open Item #1 pick by Friday 2 PM). fsaverage5 cortical mesh (~20K vertices) at ≥ 30 FPS. 3D knowledge-graph layer in separate spatial layer (NOT painted on cortex). Hover-bridge mechanic (grayed default → light on focus within radius, with reasoning fragments flowing along edges). Clickable per-region specialist tree. Within-subject toggle (BEAT-3 same-brain-different-input). 5-card Wrapped output swipe-stack. Land card with grayed-region click → hand-curated suggestion card. Johnny owns via 3-parallel-Claude orchestration (`.worktrees/johnny-vis-brain` + `.worktrees/johnny-vis-graph` + `.worktrees/johnny-orch-glue`).
5. **Adaptation 2 — Shareable Brain Card export.** 1:1 aspect-ratio image (Instagram Story shape) of user's Wrapped state with shareable-link wrapping. Default-included (3-4h within budget headroom; flagged for Johnny override per §Open Items #9).
6. **SynthDebate-on-Brain layer.** 100 synthetic agents matching user's brain-archetype war-game opinion dynamics on the same content over 5 rounds. Output: opinion-stability metric, susceptibility-to-disagreement signal. Default-included (4-5h within budget headroom; flagged for Johnny override). K2 structurally required — 100K-token sim only fits 90s at K2 speed.
7. **Pipeline orchestration glue + fallback swap logic.** `.worktrees/johnny-orch-glue` Claude builds TRIBE → swarm → Opus → viz integration + demo runbook + per-component pre-cache fallback swap logic + mock contracts allowing per-worktree development.
8. **Ironside-swap input source.** Same TRIBE → K2 → viz pipeline can ingest egocentric construction-worker video and emit cognitive-emotional-state inference per construction action. Junsoo bakes the side-by-side MP4 for BEAT-5 Ironside variant.

**B. Demo + Packaging (what the judge experiences)**

9. **90-second on-stage demo (BEAT-0 through BEAT-5).** The product running live for a judge.
   - **BEAT-0 (off-timer).** Sponsor close swap-in slide (4 variants pre-rendered: Listen Labs / Sideshift / Ironside / YC). Emilie owns.
   - **BEAT-1 (0:00–0:15).** Live cortical mesh + Reels split-screen. Live OR pre-cached 15s MP4 fallback.
   - **BEAT-2 (0:15–0:45).** K2 swarm specialist labels + hover-bridges + reasoning fragments. Live OR pre-cached 30s bridge MP4 fallback.
   - **BEAT-3 (0:45–1:15).** Within-subject side-by-side cortical meshes + summary stats overlay. Pre-cached recommended (latency-heavy live).
   - **BEAT-4 (1:15–1:30).** 5 Wrapped cards swipe → Card 5 Land card → click grayed region → suggestion card with content **formats** (no links, no recommendations). Hand-curated suggestions for demo input video.
   - **BEAT-5 (off-timer).** Sponsor-specific close slide.
10. **3-minute Round 2 launch video.** Cinematic Acts 1+4 + Act 3 demo footage + Act 4 close. Emilie owns. **Detailed shoot script lives in `caltech/video-story.md` (the visualization wrapper companion file), NOT in this PRD.**
11. **Devpost writeup.** MindPad / TerraLink structural template (per `research-context/008`). Emilie.
12. **Pitch-deck slides.** Round 1 (5-min) + Round 2 (3-min). `pkg-pitch-deck` Tier-2 worktree.
13. **FAQ ammunition deck.** Q1-Q5 customer + Q-INT-1 through Q-INT-15 hostile-judge, each pre-scripted with verbatim answer text. Per YC review §Recommendations: polish from seed-state to verbatim BEFORE Friday smoke gate, not Saturday.
14. **Friday-night 8-test smoke gate** (8-11 PM Friday). Per-test pass/fail thresholds + fallback specs (see Technical Success).
15. **Saturday 8 AM pre-cache asset bundle.** Per-beat MP4s + card images + sponsor slides + voiceover WAV. Per-person owners.
16. **Saturday 6 PM pre-cache assembly test.** Emilie runs entire 90s on pre-recorded only. Pass = live is bonus.
17. **Saturday 8 PM feature freeze** (Decision 012). Saturday 8-11 PM = launch video assembly + Devpost upload + pitch deck final. Saturday 11 PM submit.

### Adaptation-2 + SynthDebate (recommended pick — flagged for Johnny override per §1 Open Item #9)

Adds:
- **Adaptation 2 (Shareable Brain Card, 3-4h).** 1:1 image export of the user's Wrapped state, shareable-link wrapped. Doubles as Sideshift viral mechanic.
- **SynthDebate-on-Brain (4-5h).** 100 synthetic agents matching user's brain-archetype war-game opinion dynamics on the same content over 5 rounds. Output overlays as a BEAT-4 extension (10-15s). Listen Labs explicit fit; K2 structurally required (100K tokens at K2 speed only).

Cost: 7-9h within 6-13h headroom. **Default-included; flagged for Johnny override.**

### Nice-to-Have (within MVP single release; deprioritize if time-pressed)

- Polished sponsor-specific close-line wording (final wording deferred per "draft-at-end" doctrine; current state is seed lines). Wording polish belongs to `caltech/video-story.md` §12 + `caltech/prd-final.md` §7 — this PRD references but does not own.
- Final product name from Johnny's vocabulary candidate set (*Lights On, Daylight, Mirror, Brainline, Ingredients, Garden Mode*). [TBD-FINAL-PASS] Saturday 6 PM. Required across product UI labels + demo on-screen text + launch video end-card.
- Final headline from candidate set (current direction lock: *"You can't see how the algorithm shapes your thinking. We made it visible."*). Required across product hero copy + demo on-screen text + launch video Act 4 tagline.
- BEAT-4 user quote in product UI / demo voiceover (currently held as seed).

### Out of Scope (explicitly parked)

- Production-level brain-recording / consented user data pipeline. Demo runs on screen-recording; production scales with consented streaming. (FAQ pre-script.)
- Multi-user social product (sharing-circle, friend-graph, etc.). Adaptation 2 share-card seeds the viral loop; the social product is post-hackathon.
- Mobile app. The demo is desktop-browser-based (3D viz fidelity).
- Real-time inverted-brain-search reverse-lookup backend at production scale. Demo uses hand-curated suggestions for the demo input video. Q-J6 implementation pick (Friday 5 PM): (a) reverse-lookup precomputed library / (b) generate / (c) search API.
- Auditor's external referent fully resolved (T2 from window-2 elicitation pass). Held as tension; FAQ Q-INT-4 has answer ammunition (*"the user's own brain-fire pattern across diverse content is the signal — TRIBE is the lens, not the auditor itself"*).
- Multi-modal input beyond Reels-screen-recording + egocentric construction video (no audio-only, no still-image, no text feeds).
- Any clinical claim, reverse-inference claim, or sub-second prediction (forbidden per TRIBE canonical reference + Poldrack 2006).

### Vision (Future, post-hackathon)

The demo is the snippet representation of a future product where:
- **Today:** cortical interpretation of Reels feeds gives users back agency over their algorithmic exposure.
- **Tomorrow:** the same architecture extends to BCI inputs as the cognitive interface becomes invisible. The trilemma escalates; the third option (use AI + see it + choose) remains the same.
- **Monetization paths held (Johnny picks at end):** (a) hosted database FOR the user — your data, you're the customer not the product; (b) local-first pay-once — model + brain-data on-device, long-term moat is local-first compute.

Per Decision 010: B2C-primary, B2B-overlay (input-source-as-persona-switch). Same architecture. Two surfaces. One honest problem statement. Multi-modal expansion (text feeds, audio podcasts, music) is post-hackathon.

---

## User Journeys

### Persona 1 — Maya, the Gen-Z AI-native teen (PRIMARY USER, demo persona)

**Backstory.** Maya is 17, born 2008, lives in suburban California, scrolls Reels for ~2.5 hours a day. Her Spotify is full of songs she's never heard the names of — they just play. Her Reels feed shows her trending dances, AI fashion advice, true-crime, and "relatable sadness." She's tried to "use TikTok less" three times and given up. She doesn't have a "before" reference — she's never known an internet without recommendation algorithms. The felt-friction sentence (Johnny published): *"If a headline is engineered to make you angry, the only way to know is to notice your own reaction after it already got you."*

**Opening scene.** Maya opens the product on a friend's laptop. She uploads (or screen-records) 90 seconds of her Reels feed.

**Rising action.** A 3D cortical mesh appears next to her feed. As she scrolls, the brain lights up — emotion centers, default-mode network, visual cortex. She watches her own neural response in real-time. Specialist labels appear by region: *"Threat-detection node," "Memory-recall node," "Social-signal pattern."*

**Climax.** She hovers over a region. Bridges light up between regions, and reasoning fragments flow along the edges. She sees the same regions firing in the same sequence across three different scrolls. She sees the *pattern repeat*. Then a side-by-side mesh appears — same brain, different input (a hand-curated short film) — and the pattern is completely different. The lock wasn't structural. It was learned.

**Resolution.** Five Wrapped cards swipe through: *Top Brain Regions, Top Content Categories, Cohort Comparison, Brain Map, Land card.* The Land card shows her brain with most regions grayed out. She clicks Broca's Area (language production — a region her feed never activated). The system shows her content **formats** that would activate it — long-form essays, poetry, language-learning, wordplay. The voiceover lands: *"We don't want to recommend anything to you because that's how the algorithm works."* She has the choice. The system does not push her toward any specific piece. She walks away with a Shareable Brain Card. *"My brain this week — what about yours?"*

**Capabilities revealed.** Video screen-recording upload; live brain-encoding inference visualization; per-region specialist agent surface; cross-region hover-bridge interaction; within-subject toggle (feed vs. baseline); 5-card Wrapped output; inverted-brain-search Land card with content-format suggestions (no links, no recommendations); shareable card export; positioning voiceover.

### Persona 2 — Diego, the Listen Labs / Sideshift judge (DEMO-DAY USER — primary judge persona)

**Backstory.** Diego is a Listen Labs research engineer evaluating ~30 hackathon projects in 6 hours. He's seen Renaissance Research win this prize last year with a 3-LLM debate triad. He's looking for: (a) a measurable social-phenomenon visualization, (b) novel synthetic-profile use cases, (c) genuine empowerment positioning that doesn't read as marketing.

**Opening scene.** Diego sits down at the team's table. Emilie cues the 90-second demo. The product name and tagline appear briefly. Then BEAT-1 starts.

**Rising action.** Diego sees Reels (recognition) + cortical mesh (awe). By 0:10 he can tell this is NOT Renaissance — different sensory frame, different epistemology. He sees the swarm specialists in BEAT-2. He sees the hover-bridges respond to user gesture. He sees *the same brain pattern repeat across three different scrolls* in BEAT-2 → BEAT-3. He sees the within-subject toggle in BEAT-3 — same brain, different input, completely different pattern.

**Climax.** BEAT-4 hits. Wrapped cards swipe. Land card appears. The hand on screen clicks a grayed region. Suggestion card appears. *"We don't want to recommend anything to you because that's how the algorithm works."* Diego sees the explicit non-prescription. The architecture IS the answer to the YEA/NAY question. If SynthDebate extension is shown, he sees 100 synthetic agents debate the content over 5 rounds — explicit Listen Labs multi-agent-opinion-dynamics fit.

**Resolution.** BEAT-5 sponsor close (Listen Labs variant). Emilie or Johnny closes: *"You simulate humans. We simulate humanity — the loop where AI surfaces convergence and the user finds what's outside it. Next-gen synthetic-profile use case."* Q&A. Cortex.buzz comes up — team has the FAQ ammunition: *"Cortex.buzz is the attention-engineering application of TRIBE V2. We INVERT it."* Diego scores. Team continues to next judge.

**Capabilities revealed.** Sponsor-swap slides (4 variants); cinematic Acts 1+4 launch video; FAQ ammunition deck (15 questions pre-scripted); sponsor-specific 1-line close lines; live demo (or pre-cache fallback); team narration training (every member can perform 90s from memory).

### Persona 3 — Junsoo, the team's TRIBE V2 + Ironside-angle defense engineer (BUILDER USER)

**Backstory.** Junsoo is the team member with hands-on TRIBE V2 experience (per `caltech/context/team/junsoo.md` + Decision 006). He owns the video → brain-activation JSON pipeline AND the Ironside-angle defense (his shipped egocentric-video pipeline IS the credibility chip for that sponsor close).

**Opening scene.** Friday afternoon. Junsoo runs `python tribe-pipeline.py demo-input.mp4`. Output: per-region activation JSON @ 1Hz on the 30s test clip. He times it.

**Rising action.** Friday-night smoke test #1 — TRIBE inference latency on demo GPU < 30s threshold. He hits 24s. PASS. He prepares the BEAT-1 fallback MP4 anyway (per live-with-pre-cache strategy). Saturday 8 AM, the 20s side-by-side MP4 for BEAT-3 is baked. He prepares the Ironside-version pre-baked side-by-side comparison MP4 (egocentric construction video → cognitive-emotional state inference per action).

**Climax.** Demo-day. BEAT-1 runs live. BEAT-3 runs from his pre-baked side-by-side MP4. Judge asks Q-INT-2 ("TRIBE numbers honesty"). Junsoo: *"~20,000 cortical-surface vertices on fsaverage5, trained on ~25 deeply-scanned subjects. The 70K figure is a marketing variant; we use canonical numbers."* Judge asks Q-INT-12 (Ironside fit). Junsoo references his own prior egocentric-video supervision pipeline work — credibility chip lands.

**Resolution.** Architecture defense holds. Forbidden-claim guardrails respected throughout (no reverse inference, no sub-second predictions, no clinical claims, no inflated numbers).

**Capabilities revealed.** TRIBE V2 inference pipeline (1Hz, fsaverage5, ~20K vertices); JSON contract (`{time_s, region_id, activation, vertices[]}` per second); pre-bake-side-by-side script for BEAT-3; Ironside-version egocentric-video pipeline; cross-region communication protocol formal specification (PDDL/Icarus Lab work); black-box LLM behavior probing methodology to validate cross-talk doesn't collapse to corpus mean.

### Persona 4 — Emilie, the integrated packaging owner (BUILDER USER, end-to-end ownership)

**Backstory.** Emilie owns the entire packaging process per Decision 003 and Johnny 2026-04-25 mandate. Quality bar: *"pass the startup test."* Reference precedent: Nova Intelligence launch video. She has the Claude Campus Ambassador craft as the pitch-translation lane for non-technical sponsor judges.

**Opening scene.** Friday early evening. Emilie loads the locked Wrapped card data shape from Jacob/Johnny. She opens Figma. She loads the brand system from `tier-2-epics/pkg-brand-system.md`.

**Rising action.** Friday: wireframes only — polish defers to Saturday per ship-velocity principle 7. Friday-night smoke test #3 — Renaissance differentiation rehearsal — she shows first 60s to Junsoo (playing "I scored Renaissance scorer"). No pattern-match within 10s. PASS. Saturday morning: cinematic Acts 1+4 shoot complete. Saturday afternoon: design polish, hero shot, launch video assembly, Devpost copy. She renders Card 1 with **function names** not anatomical names (Sally's UX fix). She renders Card 3 with the comparison that disagrees with intuition (e.g., *"You're MORE converged than 88% of your peers"*).

**Climax.** Saturday 6 PM. Pre-cache assembly test — she runs entire 90s using only pre-recorded assets. PASS. Live version is bonus. Saturday 8 PM feature freeze. Saturday 8-11 PM: launch video final assembly + Devpost upload + pitch deck final. Saturday 11 PM submit.

**Resolution.** Demo-day. Sunday morning pitch rehearsals. Round 1 (5-min) and Round 2 (3-min) cuts both ready. Cinematic Acts 1+4 land. Demo Act 3 footage runs. YEA/NAY rubric closing slide.

**Capabilities revealed.** 5-card Figma mockup (locked data-source mapping per box); launch video MP4 (cinematic Acts 1+4 + demo Act 3 + close Act 4); Devpost writeup (MindPad/TerraLink structural template); 4 sponsor-close slides; on-camera narration + voiceover; pre-cache assembly orchestration; design system + color palette; launch-video-quality bar; 3-minute Round 2 cut + 5-minute Round 1 cut.

### Persona 5 — Johnny, PM / integration / 3-parallel-Claude orchestrator (BUILDER USER, hard innovation lane)

**Backstory.** Johnny owns hard innovation + difficult implementation per Decision 003. His slice further fans out into 3 parallel Claude instances under his management (`.worktrees/johnny-vis-brain` + `.worktrees/johnny-vis-graph` + `.worktrees/johnny-orch-glue`).

**Opening scene.** Friday 2 PM. Visualization stack pick: Three.js or React Three Fiber. Friday 5 PM: Q-J6 inverted-brain-search implementation pick — hand-curated suggestions for demo input video, regardless of which production option Johnny picks for downstream.

**Rising action.** Three sibling Claude instances spawn. Vis-brain Claude builds the 3D cortical mesh rendering (fsaverage5 + live activation glow + smooth rotation). Vis-graph Claude builds the 3D knowledge-graph layer mapped to brain + hover-bridges (grayed → light) + clickable specialist tree. Orch-glue Claude builds TRIBE → swarm → viz pipeline integration + demo runbook + fallback swap logic + mock contracts. Sync at integration checkpoints.

**Climax.** Saturday 6 PM Johnny picks final headline (from candidate set) and final product name (from his vocabulary). Saturday 8 PM feature freeze. Demo-day: he handles integration narration during Q&A, including the architectural defenses (Renaissance differentiation staging, T2 stance, reverse-inference reframe scripts).

**Resolution.** Integration is plumbing per the I/O contracts — Junsoo's brain JSON → Jacob's swarm JSON → Johnny's viz integration → Emilie's packaging.

**Capabilities revealed.** 3D viz stack (Three.js or R3F); hover-bridge mechanic implementation; inverted-brain-search Land card backend; multi-Claude orchestration via worktrees + tmux; integration-checkpoint coordination; final-pick discipline (Saturday 6 PM headline + product name).

### Persona 6 — Jacob, the K2 swarm + cross-talk demo owner (BUILDER USER)

**Backstory.** Jacob owns K2 swarm fan-out (one specialist per brain region) + cross-region communication (2-pass minimum: hypothesis → cross-eval → synthesis) + ONE hand-tuned cross-talk demo example (actor/auditor/mediator visibly divergent outputs on demo input). Lane lock per Decision 003: execution + agentic orchestration. Career narrative: K2 swarm + cross-region observability + Nucleus-shaped production pattern is the resume narrative he wants.

**Opening scene.** Friday afternoon. Jacob spins up K2 Cerebras endpoint. Tests one specialist call.

**Rising action.** Round 1: each specialist outputs hypothesis. Round 2: each specialist re-evaluates given other specialists' outputs (cross-talk). Aggregator: "how the brain would have inferred it" payload. Edge weights: how much region-B's output shifted by region-A's input → bridges. K2 integration template: asyncio.Semaphore(6), Pydantic strict + brace-balanced JSON extractor, 3-attempt retry, timeout 120s. Friday-night smoke test #2 — 10 concurrent K2 calls, 30s window, zero timeouts. PASS.

**Climax.** Demo-day BEAT-2. Hover-bridges light up. Reasoning fragments flow. Judge asks Q-INT-14 (cross-talk soup defense). Jacob references his hand-tuned demo example: visibly divergent outputs across 8 regions on the demo input. Q-INT-6 (K2-could-be-Claude) — at Claude latency, swarm fan-out at this scale doesn't fit 90s; SynthDebate (100 agents × 5 rounds = 100K tokens) is structurally K2-only.

**Resolution.** K2 architectural-required defense lands.

**Capabilities revealed.** K2 swarm fan-out template (asyncio.Semaphore + Pydantic + brace-balanced JSON + retry); cross-region 2-pass protocol; per-region specialist prompt template; aggregator payload; edge-weight computation; ONE hand-tuned demo example; SynthDebate population sim (100 agents × 5 rounds × 200 tokens = 100K tokens) if Adaptation 2 + SynthDebate selected.

### Journey Requirements Summary

The journeys collectively reveal the following capability set (which feeds Functional Requirements):

- **Demo-day capabilities:** video upload / screen-recording capture; 3D cortical mesh rendering with live activation glow; per-region specialist agent surface; cross-region hover-bridge interaction; within-subject brain toggle; 5-card Wrapped output (function-named, not anatomy-named); inverted-brain-search Land card with hand-curated content-format suggestions; positioning voiceover; sponsor-swap slides (4 variants); shareable Brain Card export; (optional) SynthDebate-on-Brain 100-agent population sim overlay.
- **Pipeline capabilities:** TRIBE V2 inference (1Hz, fsaverage5, ~20K vertices) with `{time_s, region_id, activation, vertices[]}` JSON; K2 swarm fan-out (one specialist per brain region) with cross-region 2-pass protocol; aggregator + edge-weight computation for hover-bridges; Opus depth-synthesis layer for Wrapped card text; pre-bake side-by-side MP4 for BEAT-3; pre-cache fallback per beat.
- **Packaging capabilities:** 5-card Figma mockup with locked data-source mapping; cinematic Acts 1+4 launch video; demo Act 3 footage; pitch deck (Round 1 5-min + Round 2 3-min); 4 sponsor close slides; Devpost writeup (MindPad/TerraLink template); voiceover WAV; Renaissance differentiation rehearsal pass.
- **Architectural-defense capabilities:** FAQ ammunition deck (15 questions pre-scripted); cross-talk soup empirical-method defense; Cortex.buzz comparable framing; reverse-inference forbidden-claim guardrails respected throughout.

---

## Domain-Specific Requirements

> Domain complexity is HIGH. The neuroscience + AI demo space requires explicit forbidden-claim guardrails; the multi-track sponsor strategy requires sponsor-fit alignment; the hackathon-demo context requires live-failure fallback discipline.

### Compliance & Regulatory

- **TRIBE V2 license: CC BY-NC 4.0.** Non-commercial only. Hackathon is non-commercial; commercial path is TBD via Meta legal. FAQ pre-script: *"research-stage; commercial path TBD."*
- **No clinical claims.** *"Content discovery, not clinical diagnosis."* No medical-device framing. No therapeutic claims.
- **No reverse inference (Poldrack 2006).** Never claim "amygdala fired = user felt fear." Use observational language: *"responded to attention-grabbing cues" / "observed measurable response."* NEVER *"because content was designed to make you feel" / "the part that's you" / "fires because [emotion]."*
- **No sub-second predictions.** TRIBE is 1Hz with 5s HRF lag. Do not animate as if predictions are millisecond-resolution.
- **Within-subject contrast only.** Never population-norm comparisons. Always *"your brain on your feed vs. your brain on something else."* Never *"your brain vs. average healthy brain."* (Quinn validation pass 2.)
- **No inflated TRIBE numbers.** Canonical: ~20,000 vertices on fsaverage5, ~25 trained subjects. Never say 70K voxels / 700 subjects (T1 lock per `tribe-v2-canonical-reference.md`).
- **Spotify Wrapped trademark.** Format reference only; product name [TBD-FINAL-PASS] from Johnny's vocabulary candidates. Never name product *"Spotify Wrapped of Your Brain"* publicly.
- **Sponsor-attribution honesty.** When citing IFM K2 / Listen Labs / Sideshift / Ironside / YC, frame their tools as load-bearing or as named-comparable; don't overclaim formal partnership.

### Technical Constraints

- **Demo runs on demo-day GPU.** Bring your own laptop or use venue laptop — confirm in advance. TRIBE inference + 3D rendering both fight for GPU. Friday-night smoke tests #1 and #4 are the gates.
- **K2 Think API rate limits.** Test the 10-concurrent-call limit Friday night (smoke test #2). If hit, harden retry logic + fallback to pre-cached swarm output.
- **Wi-Fi unreliability at venue.** Smoke test #5 — full demo on phone hotspot. Backup MP4 mandatory.
- **3D rendering FPS.** ≥ 30 FPS on demo laptop with fsaverage5 mesh + knowledge graph. Mesh decimation OR pre-baked camera motion fallback.
- **Live latency budget.** 90 seconds end-to-end. Per-beat live attempts must not exceed budget. Per-component pre-cache fallback applies.
- **Demo determinism.** 2 back-to-back runs same input — < 5% variance. Temp=0 + locked seeds OR pre-recorded output.

### Integration Requirements

- **TRIBE V2 → K2 swarm contract.** Per-second JSON: `{time_s: int, region_id: str, activation: float, vertices: array}`. Junsoo provides; Jacob consumes.
- **K2 swarm → visualization contract.** Per-region specialist outputs + cross-region edges with weights. Jacob provides; Johnny consumes.
- **Visualization → Wrapped output contract.** Aggregate brain-fire pattern + content-category inference + age-cohort comparison. Johnny + Jacob → Emilie.
- **Wrapped output → SynthDebate (if scope) contract.** User's brain-archetype profile → 100 synthetic agents. Jacob owns.
- **Pre-cache fallback contracts.** Each beat's live computation has a corresponding MP4 (or static asset for BEAT-4 cards). Per-beat owners bake by Saturday 8 AM.
- **Ironside swap contract.** Same TRIBE → K2 → viz pipeline runs on egocentric construction-worker video. Junsoo bakes pre-recorded side-by-side MP4 for BEAT-5 Ironside variant.

### Risk Mitigations

- **TRIBE latency on demo GPU.** Pre-cache fallback IS the answer. Smoke test #1 confirms whether live or pre-cache is the demo-day mode.
- **K2 rate-limit / timeout.** Pre-cached swarm outputs ready. Smoke test #2 is the gate. Hand-tuned demo example (Jacob owns) protects against cross-talk soup.
- **Renaissance pattern-match.** Smoke test #3 — first 60s to "Renaissance scorer," no match within 10s. Re-cut first 10s if pattern-match detected.
- **Inverted-brain-search Land card execution.** Hand-curate suggestions for the demo input video. Pre-cache the suggestion card as static image. Q-J6 implementation pick (Friday 5 PM) only matters for production scale — demo uses curated suggestions.
- **Cross-talk soup.** Defense = Junsoo's empirical black-box LLM behavior probing methodology + Jacob's hand-tuned demo example showing visibly divergent outputs per region.
- **Demo-day Wi-Fi failure.** Full backup MP4 of entire 90s.
- **Sponsor close mismatch (judging same demo in different sponsor pavilions).** 4 pre-rendered swap slides + 4 close lines + per-pavilion mental-rehearsal protocol.
- **Validation-pass-2 already applied.** Sophia inciting-incident rewrite, Quinn reverse-inference strip, Maya shame-before-agency restructure already in `narration-script-3min.md`. Don't re-run validation; consume findings as input.

---

## Innovation & Novel Patterns

### Detected Innovation Areas

**Innovation #1 — TRIBE V2 + agent swarm composition.** Two architectural anchors locked separately (Decision 006 + Decision 007), composed for the first time in this product. TRIBE V2 has been used by Cortex.buzz for *attention-engineering* (the inverse direction) but no public team has paired it with a brain-region-specialist agent swarm + cross-region communication for *augmented introspection*. Innovation surface: brain pattern + N specialists + cross-talk = semantic interpretation per region with edge-weighted bridges, beating raw brain data. Reference: `caltech/validation-findings/2026-04-25-capability-inventory-summary.md`.

**Innovation #2 — Inverted recommender as core mechanic.** Recommenders pick content for you. The Land card asks YOU to pick a *brain region you didn't use*, then surfaces content **formats** that would activate it — without recommending any specific piece. No closed-loop optimization for engagement. The Recommender's epistemology inverted: instead of "what will you click," it surfaces "what would diversify your neural activation." Conceptually distinct from BeReal (anti-curation through scarcity) and from Pol.is (consensus-forging) and from Mozilla RegretsReporter (regret-cataloguing). The closest comparable is *no public product* — this is a category-creator move.

**Innovation #3 — Within-subject toggle as the auditor's external referent.** T2 (the auditor's external-referent question, surfaced in `wiki/window-2-research-deepening/501-party-mode-roundtable.md`) is the hardest open question. The architecture's answer is structural: the auditor IS the user's own brain-fire pattern across diverse content. We make Filter World *visible* with the user's own neural divergence as the audit signal. We don't claim to fix it. The within-subject contrast (BEAT-3 toggle) IS the auditor.

**Innovation #4 — SynthDebate-on-Brain (recommended adaptation).** TRIBE-grounded synthetic-population opinion-dynamics simulation. 100 agents whose brain-response profiles match the user, war-gamed over 5 rounds. Output: opinion-stability metric, susceptibility-to-disagreement signal, the argument that flipped 60% of brains-like-theirs. Listen Labs explicit fit (their stated track brief is multi-agent opinion dynamics). K2 structurally required (100K-token sim only fits 90s at K2 speed).

**Innovation #5 — Input-source-as-persona-switch.** Same architecture; Reels-screen-recording (B2C / Listen Labs / Sideshift) OR egocentric construction-worker video (Ironside). Multi-track sponsor coverage from a single product surface. Most multi-sponsor hackathon entries are decorative; this one is structurally MECE.

### Market Context & Competitive Landscape

- **Cortex.buzz (named comparable, FAQ ammunition).** Commercial product built on TRIBE V2; offers content-audit-as-a-service (attention-engineering direction). License status unverified — likely violating CC BY-NC 4.0. Strengthens our framing: *"Big tech uses brain models for X; we use the same model for not-X. Manipulation only works in the dark."*
- **Renaissance Research (HackTech 2025 winner — lookalike risk).** 3-LLM debate triad. Different epistemology, different visual signature, different answer to T2 (per FAQ Q-INT-1). Our differentiation is structural; first 10s of demo must visibly differentiate or pattern-match risk hits.
- **MindPad / TerraLink (TreeHacks 2026 winners — Devpost structural templates).** See `research-context/008-devpost-exemplars-mindpad-terralink.md` for Devpost writeup pattern reference.
- **Memento (HackTech / TreeHacks lookalike risk).** Per `research/wiki/projects/memento.md` — 🔴 HIGH lookalike risk teardown. Same family as Renaissance.
- **BeReal (anti-curation reference).** `research-context/005-bereal-as-anti-curation-pattern.md`. Different mechanism (scarcity) but same anti-algorithmic-curation thesis. Sideshift fit reference.
- **Spotify Wrapped (output-shape reference).** `research-context/004-spotify-wrapped-as-format.md`. Format reference only — NOT product name. Trademark caveat held.
- **Past Best Use of AI hackathon winners (TreeHacks 2026 sweep).** Per `research/wiki/scrapes/treehacks-2026-winners.md` (64 winners, 60 with public repos): vertical-agent stacks (15) and spatial/VLM-grounded (8) are dominant winning archetypes. We are spatial-VLM-grounded by way of brain-encoded perception, plus vertical-agent-stack by way of region-specialist swarm.

### Validation Approach

- **Friday-night smoke-test gate** (8 tests, see Technical Success). Each gate has a binary pass/fail threshold and a fallback if failed.
- **Renaissance differentiation rehearsal** (smoke test #3) — non-team-member plays "I scored Renaissance," tells team if pattern-match within 10s.
- **Self-audit table** at bottom of `demo-script.md` — confirms 4 emotional beats land in 90s. Run at Saturday 6 PM pre-cache assembly test.
- **Pre-cache assembly test** (Saturday 6 PM) — Emilie runs entire 90s on pre-recorded only. If pass, live is bonus.
- **Adaptation 2 + SynthDebate validation** — capability-inventory-summary.md already validates the architectural fit; team confirms scope inclusion at Saturday 8 AM pre-cache deadline.
- **Cortex.buzz license-violation framing** — FAQ ammunition tested verbally during pitch rehearsals Sunday morning.

### Risk Mitigation

- **Innovation #1 (TRIBE+swarm).** Risk: cross-talk soup (specialists collapse to corpus mean). Mitigation: Junsoo's black-box LLM behavior probing + Jacob's hand-tuned demo example showing semantically distinct per-region outputs.
- **Innovation #2 (inverted recommender).** Risk: judges read it as "recommendation engine with extra steps." Mitigation: voiceover lands the explicit positioning *"we don't want to recommend anything"*; suggestion card shows content **formats** not pieces; no link to "go buy this."
- **Innovation #3 (within-subject toggle).** Risk: judges expect population-norm comparison. Mitigation: Q-INT-4 FAQ ammunition; Quinn pass 2 voiceover language; BEAT-3 stats card shows same-subject contrast explicitly.
- **Innovation #4 (SynthDebate).** Risk: scope creep blows budget. Mitigation: 4-5h estimate within 6-13h headroom; default-included but flagged for Johnny override; if cut, Adaptation-2 share-card alone remains.
- **Innovation #5 (input-as-persona-switch).** Risk: judges think the team is "trying to satisfy too many sponsors, muddying value prop." Mitigation: per the multi-track-gamble doctrine, accept the critique — *"name another scenario where you can fit every sponsored track into one idea"*; the trilemma + empowerment spine is a single thesis with swappable evidence, not four separate products.

---

## Web App Demo (Project-Type) Specific Requirements

### Project-Type Overview

This is a hackathon-demo web application with a real-time AI inference pipeline. The user-facing surface is browser-based 3D rendering (Three.js or React Three Fiber per Open Item #1). The back-end is a TRIBE V2 inference service + K2 Think (Cerebras endpoint) swarm orchestration + Claude Opus depth-synthesis layer. The architecture is one-shot demo-only: no auth, no persistence beyond the session, no multi-tenant model.

The core distinction from a production web app: live-with-pre-cache fallback is the operating mode. Every live computation has a corresponding pre-cached MP4 / static-image fallback. Per-component swap, not all-or-nothing.

### Technical Architecture Considerations

- **Front-end stack.** React + Three.js OR React Three Fiber (Johnny picks Friday 2 PM). 3D cortical mesh on fsaverage5 mesh data; 3D knowledge-graph layer in separate spatial layer (NOT painted on cortex per Johnny's explicit cut). Hover-bridge mechanic implemented as graph-edges with raycasting + radius-based highlight on hover. Wrapped card UI as a framework-agnostic swipe-stack overlay.
- **Pipeline orchestration.** Live mode: video stream → TRIBE V2 inference (Junsoo's pipeline) → JSON @ 1Hz → K2 swarm fan-out (Jacob's asyncio.Semaphore(6) + Pydantic + brace-balanced JSON + 3-attempt retry, timeout 120s) → cross-region 2-pass → Opus aggregator → Wrapped card data → frontend render.
- **Pre-cache mode.** Same pipeline, output dumped to disk as MP4 / JSON / static-image; demo plays back from pre-cached assets.
- **Fallback orchestration glue.** `.worktrees/johnny-orch-glue` Claude builds the integration + demo runbook + per-component fallback swap logic + mock contracts.
- **Hand-curated suggestions for BEAT-4 Land card.** Bypass production reverse-search backend for demo. Static suggestion card per grayed-out region option.
- **Multi-Claude orchestration for build.** 14 worktrees total: 5 build (`.worktrees/johnny-vis-brain`, `.worktrees/johnny-vis-graph`, `.worktrees/johnny-orch-glue`, `.worktrees/junsoo-tribe-v2`, `.worktrees/jacob-agent-swarms`) + 9 packaging (Tier-2 epics in `caltech/tier-2-epics/`). Spawn pattern: `git worktree add` + `tmux new-window -n <lane> 'cd <worktree> && claude'`. See `tmux-spawn-all.sh`.

### Implementation Considerations

- **Endpoints / API surfaces (demo-only).** `/tribe-infer` (POST video chunk → JSON activation per region per second). `/k2-swarm` (POST activation JSON → per-region specialist outputs + cross-region edges). `/opus-synthesis` (POST aggregated swarm → Wrapped card text). All same-origin or behind a thin proxy; no auth.
- **Authentication / authorization.** None. Demo-only.
- **Data formats.** JSON for inter-component contracts. MP4 for pre-cache fallbacks. PNG for static cards.
- **Rate limits.** Respect K2 (Cerebras) endpoint rate limits per smoke test #2. Internal asyncio.Semaphore(6) caps fan-out parallelism.
- **Versioning.** Single demo build. No semver.
- **SDK.** None.
- **Front-end performance.** 3D rendering FPS ≥ 30 on demo laptop (smoke test #4). Use OffscreenCanvas if available; fall back to mesh decimation; final fallback is pre-baked camera motion.
- **Privacy.** Demo input is screen-recording uploaded by user OR egocentric construction footage. No PII collected. No persistence. No analytics.

---

## Project Scoping (single-release)

### Strategy & Philosophy

Lean MVP via the *smallest-possible-circle* doctrine + *demo-over-execution* (Decision 011). The 90-second demo IS the smallest viable shipment unit. Visualization > engineering depth. Live-with-pre-cache fallback is the operating mode (try live; per-component swap to pre-cached if any beat fails).

- **MVP philosophy:** Experience-MVP (one slice end-to-end, well enough that judges believe the rest exists).
- **Resource requirements:** 4 people × 12h = 48 person-hours total budget (Decision 016). Budget allocation:
  - Junsoo (TRIBE + Ironside angle): ~10h
  - Jacob (K2 swarm + cross-talk + SynthDebate): ~12h
  - Johnny (innovation + 3D viz + 3-Claude orchestration + integration): ~12h (with 3 sibling Claudes effectively multiplying throughput)
  - Emilie (entire packaging + cinematic shoot + launch video + Devpost + decks): ~12h
  - Headroom: ~2h. Reserve for SynthDebate (4-5h) brings effective consumed: ~35-42h with 6-13h spare.

### Complete Feature Set

**Core User Journeys Supported (single release):**
1. Maya — Gen-Z teen experiencing the 90s demo (BEAT-1 through BEAT-5 with optional SynthDebate extension).
2. Diego — Listen Labs / Sideshift judge evaluating the demo + sponsor close + FAQ.
3. Junsoo — TRIBE V2 builder + Ironside-angle defender.
4. Emilie — packaging owner end-to-end.
5. Johnny — PM / integration / 3-parallel-Claude orchestrator.
6. Jacob — K2 swarm + cross-talk + SynthDebate builder.

**Must-Have Capabilities (ALL must ship to be useful):**
- 90-second 5-beat demo end-to-end (live + per-component pre-cache).
- 3D cortical mesh + knowledge-graph layer rendering ≥ 30 FPS.
- Hover-bridge mechanic responsive to user gesture.
- Within-subject toggle (BEAT-3) showing same-brain-different-input divergence.
- 5-card Wrapped output with function-named cards + Land card hero.
- Inverted-brain-search hand-curated suggestion card per grayed region.
- Adaptation 2 Shareable Brain Card export (1:1 IG-Story shape).
- Voiceover with positioning statement + Best Use of AI YEA/NAY rubric closing.
- 3-min Round 2 narration video (cinematic Acts 1+4 + demo Act 3 + close Act 4).
- 4 sponsor-swap close slides (Listen Labs / Sideshift / Ironside / YC).
- Devpost writeup (MindPad/TerraLink template).
- 5-min Round 1 + 3-min Round 2 pitch decks.
- FAQ ammunition deck (15 questions pre-scripted per §FAQ).
- Friday-night 8-test smoke gate.
- Saturday 8 AM pre-cache assets bundle.
- Saturday 6 PM pre-cache assembly test.
- Saturday 8 PM feature freeze.
- Saturday 11 PM Devpost submit.

**Nice-to-Have Capabilities (within MVP single release):**
- SynthDebate-on-Brain 100-agent population-sim BEAT-4 extension (default-included; 4-5h; cuttable if other items overrun).
- Polished sponsor-specific close-line wording (current state is seed lines; final wording deferred to Saturday 6 PM).
- Final product name pick (Saturday 6 PM).
- Final headline pick (Saturday 6 PM).
- BEAT-4 user quote in 17-year-old voice (currently held as seed).

### Risk Mitigation Strategy

- **Technical risks.** Per `validation-findings/2026-04-25-phase-2-party-mode-pass-1.md` Pre-mortem. Mitigated by 8-test Friday-night smoke gate + per-component pre-cache fallback + Saturday 8 AM pre-cache asset bundle + Saturday 6 PM full-pre-cache assembly test.
- **Market risks.** Renaissance pattern-match risk mitigated by smoke test #3 + structural-differentiation FAQ ammunition (Q-INT-1). Multi-track-gamble risk acknowledged per doctrine; mitigated by single-spine + 4-swap structure (one product, multiple persona inputs).
- **Resource risks.** 6-13h budget headroom absorbs single-component overrun. SynthDebate (4-5h) is the cut-line if budget tight. Three-parallel-Claude orchestration multiplies Johnny's throughput on the visualization slice. Pre-cache discipline ensures even total-failure-mode demo still lands (Saturday 6 PM full-pre-cache test is the final gate).

---

## Functional Requirements

> The capability contract. UX designs only what's listed here; epics implement only what's listed here; if it's not here, it does not exist in the demo.

### Capability Area 1 — Brain-Encoding Pipeline

- **FR1.** Junsoo's pipeline can ingest a 30-90s screen-recording video file (MP4, H.264, ≥ 720p) and output per-second per-region brain-activation JSON conforming to schema `{time_s: int, region_id: str, activation: float, vertices: array}`.
- **FR2.** Pipeline can produce activation predictions at 1Hz with 5-second HRF lag respected (no sub-second predictions).
- **FR3.** Pipeline can emit ~20,000 cortical-vertex predictions on the fsaverage5 mesh per second.
- **FR4.** Pipeline can run on demo-day GPU with < 30s latency on a 30-second clip (smoke test #1 threshold).
- **FR5.** Pipeline can serve pre-recorded JSON output as a fallback when live latency exceeds budget.
- **FR6.** Pipeline can ingest egocentric construction-worker video as the Ironside-swap input source and output the same JSON schema.

### Capability Area 2 — K2 Swarm + Cross-Region Communication

- **FR7.** Jacob's K2 swarm can fan out N specialist-agent calls (one per brain region) given per-region activation JSON.
- **FR8.** Swarm can complete Round 1 (each specialist outputs hypothesis given its region's activation) within 30 seconds for 8-region demo input.
- **FR9.** Swarm can complete Round 2 (each specialist re-evaluates given other specialists' outputs — cross-talk) within 30 seconds.
- **FR10.** Swarm can output aggregator JSON with `{per_region_specialist_output, cross_region_edges_with_weights}`.
- **FR11.** Swarm can produce semantically distinct per-region outputs (< 50% semantic overlap across 8 regions; smoke test #6 threshold).
- **FR12.** Swarm can serve pre-recorded swarm output as a fallback when live K2 calls timeout or rate-limit.
- **FR13.** Swarm can run a SynthDebate sub-procedure: 100 synthetic agents whose brain-response profiles match the user, war-gamed over 5 rounds (Adaptation 2 + SynthDebate scope, default-included flagged for override).

### Capability Area 3 — Visualization Stack (3D Brain + Knowledge Graph)

- **FR14.** Frontend can render the fsaverage5 cortical mesh with ~20,000 vertices visible at ≥ 30 FPS on demo laptop.
- **FR15.** Frontend can paint per-region activation glow on the mesh in sync with brain-activation JSON stream (live or pre-recorded).
- **FR16.** Frontend can render a 3D knowledge-graph layer in spatial space separate from (NOT painted on) the cortical mesh.
- **FR17.** Frontend can render hover-bridges between brain regions, grayed-out by default, lighting up on user hover within radius.
- **FR18.** Frontend can render reasoning fragments flowing along bridge edges when bridges are lit.
- **FR19.** Frontend can render a clickable per-region specialist tree showing hypothesis + cross-eval text per region.
- **FR20.** Frontend can render a within-subject toggle showing two cortical meshes side-by-side (same brain, different input) with summary stats overlay.
- **FR21.** Frontend can swipe through 5 Wrapped cards (Top Brain Regions / Top Content Categories / Cohort Comparison / Brain Map / Land card).
- **FR22.** Frontend can render the Land card with grayed-out brain regions and respond to a click with a content-format suggestion card.

### Capability Area 4 — Wrapped Output Shape

- **FR23.** Card 1 (Top Brain Regions) uses function names ("emotion processing," "future planning," "social sense") as primary label; anatomical names as small footnote.
- **FR24.** Card 2 (Top Content Categories) renders content categories ranked by activation contribution; copy reads with brutal-honesty register.
- **FR25.** Card 3 (Cohort Comparison) uses hand-tuned 10-profile mock cohort for demo; comparison must disagree with intuition (e.g., *"You're MORE converged than 88% of peers"*).
- **FR26.** Card 4 (Brain Map) renders a 3D hero shot suitable for shareable export.
- **FR27.** Card 5 (Land card) renders grayed-out regions, accepts user click on a grayed region, and renders a suggestion card showing content **formats** that would activate that region (NOT recommendations of specific pieces, NOT links to buy/play).
- **FR28.** Adaptation 2: system can export the Wrapped state as a 1:1 aspect-ratio image (Instagram Story shape) with shareable-link wrapping, suitable for "My brain this week — what about yours?" social mechanic.

### Capability Area 5 — Demo Orchestration & Fallback

- **FR29.** Demo runbook can sequence BEAT-0 through BEAT-5 with absolute time anchors (0:00 / 0:15 / 0:45 / 1:15 / 1:30 + sponsor-swap off-timer).
- **FR30.** Each beat can attempt live execution; if live fails or budget exceeded, runbook can swap to pre-cached MP4 or static asset for that beat without all-or-nothing failure.
- **FR31.** Pre-cache asset bundle (BEAT-1 mesh+Reels MP4 / BEAT-2 bridge MP4 / BEAT-3 side-by-side MP4 / BEAT-4 5-card images / BEAT-5 4 sponsor close slides / voiceover WAV) is ready by Saturday 8 AM.
- **FR32.** Demo can run end-to-end on pre-cached only, validated by Saturday 6 PM assembly test.
- **FR33.** Demo can run on phone hotspot (Wi-Fi contingency).
- **FR34.** Sponsor-swap can hot-swap BEAT-0 and BEAT-5 slides per sponsor pavilion (Listen Labs / Sideshift / Ironside / YC).

### Capability Area 6 — Storytelling & Packaging Surfaces

> Detailed shoot-script for the 3-minute launch video lives in `caltech/video-story.md` (the visualization wrapper companion). FR35-FR36 below specify the launch video's *delivery contract* that this PRD requires; the shoot direction itself is owned by that companion file.

- **FR35.** 3-minute Round 2 launch video MP4 is delivered (16:9 1080p primary; 9:16 1080p social; 16:9 4K archive) per `caltech/video-story.md` §11 delivery checklist. Source script: `narration-script-3min.md`. Acts 1+4 cinematic (~60s combined) + Act 3 demo footage (~100s) + Act 2 architecture preview (~20s).
- **FR36.** Launch video and product on-screen text honor validation-pass-2 rewrites (Sophia inciting-incident, Quinn reverse-inference strip, Maya shame-before-agency restructure).
- **FR37.** 5-minute Round 1 pitch deck extends the 3-minute spine with deeper architecture detail. `pkg-pitch-deck` Tier-2 worktree owns.
- **FR38.** Devpost writeup follows MindPad/TerraLink structural template (per research-context/008).
- **FR39.** FAQ ammunition deck contains pre-scripted answers for Q1-Q5 (customer FAQ) + Q-INT-1 through Q-INT-15 (internal/hostile-judge FAQ). **Per YC review: polish from seed-state to verbatim BEFORE Friday 8 PM smoke gate.**
- **FR40.** Every team member can perform the 90s demo from memory.

### Capability Area 7 — Sponsor Strategy & Architectural Defense

- **FR41.** Best Use of AI rubric (YEA/NAY) is rendered as a closing slide and referenced in voiceover.
- **FR42.** Listen Labs swap slide names the multi-agent opinion-dynamics fit (or SynthDebate-on-Brain explicit fit if scope includes).
- **FR43.** Sideshift swap slide names the consumer-tool-for-data + shareable Brain Card viral mechanic.
- **FR44.** Ironside swap slide demonstrates the egocentric-construction-video swap with cognitive-emotional-state inference per action.
- **FR45.** YC swap slide names the future-Obsidian framing + two monetization paths held (hosted / local-first).
- **FR46.** Cross-talk soup defense (Junsoo black-box probing methodology + Jacob hand-tuned demo example) is rehearsed and FAQ-deployable.
- **FR47.** Renaissance differentiation rehearsal (smoke test #3) passes with no pattern-match within 10s.

### Capability Area 8 — Friday-Night Smoke-Test Gate & Saturday Pre-Cache Discipline

- **FR48.** All 8 Friday-night smoke tests run between 8-11 PM Friday with binary pass/fail thresholds and per-test fallback specs.
- **FR49.** Saturday 8 AM pre-cache asset bundle is complete and committed to repo.
- **FR50.** Saturday 6 PM pre-cache assembly test passes (full 90s on pre-recorded only).
- **FR51.** Saturday 8 PM feature freeze enforced; no new features after this gate.
- **FR52.** Saturday 8-11 PM final assembly: launch video + Devpost upload + pitch deck final.
- **FR53.** Saturday 11 PM Devpost submit complete (10h buffer to Sunday 9 AM hard deadline).

---

## Non-Functional Requirements

### Performance

- **NFR1.** Demo end-to-end runs in ≤ 90 seconds for the live-attempt path (BEAT-1 through BEAT-4, exclusive of BEAT-0 and BEAT-5 which are off-timer).
- **NFR2.** TRIBE V2 inference completes a 30-second clip in < 30 seconds on demo GPU (smoke test #1).
- **NFR3.** K2 swarm completes 10 concurrent specialist calls within 30 seconds with zero timeouts (smoke test #2).
- **NFR4.** 3D rendering sustains ≥ 30 FPS on demo laptop with fsaverage5 mesh + knowledge graph layer (smoke test #4).
- **NFR5.** Demo determinism: 2 back-to-back runs on same input show < 5% variance in narrative output (smoke test #8).
- **NFR6.** SynthDebate (if in scope) completes 100 agents × 5 rounds × ~200 tokens (~100K tokens total) within ~10 seconds (K2 ~1,300 tok/s nominal).

### Privacy & Compliance

- **NFR7.** No PII collected. Demo input is user-supplied screen-recording or pre-recorded test asset. No analytics, no telemetry.
- **NFR8.** TRIBE V2 license CC BY-NC 4.0 respected — non-commercial demo; commercial path TBD.
- **NFR9.** No clinical claims. *"Content discovery, not clinical diagnosis."*
- **NFR10.** No reverse-inference language anywhere in voiceover, slides, or Devpost copy.
- **NFR11.** No sub-second prediction claims; TRIBE is 1Hz with 5s HRF lag respected.
- **NFR12.** Within-subject contrast only; no population-norm comparisons.
- **NFR13.** No inflated TRIBE numbers — canonical ~20K vertices / ~25 subjects only.

### Reliability

- **NFR14.** Each demo beat (BEAT-1 through BEAT-5) has a corresponding pre-cached fallback asset. Fallback can swap per-component without all-or-nothing failure.
- **NFR15.** Wi-Fi-loss contingency: full backup MP4 of entire 90-second demo runs on phone hotspot.
- **NFR16.** Pre-cache assembly test (Saturday 6 PM) passes — entire demo runnable from pre-recorded assets.
- **NFR17.** Sponsor-swap reliability: BEAT-0 + BEAT-5 hot-swap completes in < 5 seconds without breaking live demo state.

### Accessibility & UX

- **NFR18.** Wrapped Card 1 uses function names as primary, anatomical names as footnote (Sally UX fix — "amygdala" reads as homework for a 17-year-old).
- **NFR19.** Card 3 cohort-comparison must DISAGREE with intuition or it has no surprise (Sally UX fix).
- **NFR20.** Hover-bridge interaction supports both mouse hover (pointer device) and touch hover (touchscreen demo laptop) within radius detection.
- **NFR21.** Voiceover register honors Acts 1 + 4 cinematic (Black Mirror / Severance / Mr. Robot sound-design reference) and Acts 2 + 3 warmer-guide register (StoryBrand customer-as-hero).
- **NFR22.** Color palette + typography honors `tier-2-epics/pkg-brand-system.md` brand system.

### Integration

- **NFR23.** TRIBE V2 → K2 contract: per-second JSON `{time_s, region_id, activation, vertices[]}`. Schema-validated on producer side; consumer fails gracefully on schema mismatch.
- **NFR24.** K2 → visualization contract: per-region specialist outputs + cross-region edges with weights. Pydantic strict + brace-balanced JSON extractor + 3-attempt retry on K2 side.
- **NFR25.** Pre-cache fallback contracts: per-beat MP4 / static asset committed to repo by Saturday 8 AM with documented swap-trigger conditions.
- **NFR26.** Multi-Claude worktree orchestration: 14 worktrees synced at integration checkpoints; mock contracts allow per-worktree development without blocking.

### Observability (demo-day operational)

- **NFR27.** Demo runbook includes per-beat live/pre-cache decision logged for post-event retrospective.
- **NFR28.** K2 swarm structured-log per call (region_id, latency, retry-count, fallback-triggered) for cross-talk soup post-mortem and SynthDebate sim audit.

### Sponsor & Strategic Alignment

- **NFR29.** Best Use of AI YEA/NAY rubric is the explicit closing slide; product enacts the rubric.
- **NFR30.** Empowerment positioning is the unified spine across all four sponsor swaps; closing-line wording per `prd-final.md` §7 (final polish [TBD-FINAL-PASS] Saturday 6 PM).
- **NFR31.** Forbidden-claims discipline (per Domain Requirements) is enforced in every voiceover line, slide title, and Devpost paragraph.

---

## Open Items Deferred to Johnny (NOT closed by this PRD)

| # | Item | Owner | Deadline | Default if not picked |
|---|---|---|---|---|
| 1 | Visualization stack (Three.js / R3F / Plotly3D) | Johnny | Friday 2 PM | R3F |
| 2 | Inverted-brain-search implementation (a/b/c) | Johnny | Friday 5 PM | Hand-curated for demo input |
| 3 | Final product name | Johnny | Saturday 6 PM | [TBD-FINAL-PASS] from candidate set |
| 4 | Final headline | Johnny | Saturday 6 PM | Current direction lock |
| 5 | T2 stance (own / counter) | Johnny | FAQ time | Hold tension; Q-INT-4 within-subject framing |
| 6 | Compare-move scope | Johnny | TBD | V2-only / parked |
| 7 | YC monetization path (hosted / local-first) | Johnny | Saturday 6 PM | Both held |
| 8 | On-device-vs-cloud lock | Johnny | Friday | Held privately (not pitch) |
| 9 | Adaptation pick (impacts BEAT-4 scope) | Johnny | ASAP | **Adaptation 2 + SynthDebate-on-Brain** (default-included) |
| 10 | Opus-final-synthesis layer + design-consciousness primes deepening | Johnny | Carry-forward | Not blocking ship |

---

## Critical-Path Timeline (PRD-Builder synthesis from `tasks-by-person/` + smoke-tests + freeze)

> Companion artifact: see also `caltech/prd-final.md` §12 + `caltech/demo-script.md` PER-BEAT I/O CONTRACTS.

### Friday 2026-04-25

| Time (PDT) | Milestone | Owner | Blocker if missed |
|---|---|---|---|
| 2:00 PM | Visualization stack pick | Johnny | Vis-brain + Vis-graph Claudes blocked |
| 5:00 PM | Q-J6 inverted-brain-search implementation pick | Johnny | BEAT-4 backend stub blocked |
| 6:00 PM | Cinematic Acts 1+4 shoot scheduled / starting | Emilie | Launch video Act 1+4 blocked Saturday |
| 8:00 PM | Friday-night 8-test smoke gate begins | All | Demo-day mode unknown |
| 11:00 PM | All 8 smoke tests complete; per-test fallbacks decided | All | Demo brittleness un-mitigated |

### Saturday 2026-04-26

| Time (PDT) | Milestone | Owner | Blocker if missed |
|---|---|---|---|
| 8:00 AM | Pre-cache asset bundle complete (per-beat MP4 / 5 card images / 4 sponsor slides / voiceover WAV) | All per-beat owners | BEAT fallbacks unavailable |
| 11:00 AM | Listen Labs talk attendance | Emilie + team | Sponsor relationship signal missed |
| 2:00 PM | Junsoo TRIBE latency confirmed (live or pre-cache mode locked) | Junsoo | BEAT-1 mode unknown |
| 2:00 PM | Jacob K2 swarm load-test confirmed | Jacob | BEAT-2 mode unknown |
| 4:00 PM | Emilie cinematic Acts 1+4 shot complete (per `caltech/video-story.md` §6) | Emilie | Launch video assembly blocked |
| 5:00 PM | Johnny sibling-Claude integration checkpoint (TRIBE → swarm → viz integrated) | Johnny | Product runnable state unknown |
| 6:00 PM | Final headline + product name picked | Johnny | Product UI labels + demo on-screen text + launch video Act 4 tagline finalization blocked |
| 6:00 PM | Pre-cache assembly test (full 90s on pre-recorded) | Emilie | Demo total-fallback-mode untested |
| 8:00 PM | Feature freeze (Decision 012) | All | Scope churn risks submission |
| 8:00 PM – 11:00 PM | Launch video assembly + Devpost upload + pitch deck final | Emilie | Submission risk |
| 11:00 PM | Devpost submit | Emilie | 10h buffer to Sunday 9 AM hard deadline lost |

### Sunday 2026-04-27

| Time (PDT) | Milestone | Owner | Blocker if missed |
|---|---|---|---|
| 7:00 AM – 9:00 AM | Pitch rehearsals (Round 1 5-min + Round 2 3-min) | All | Performance quality varies |
| 9:00 AM | Devpost hard deadline | (already submitted Sat 11 PM) | n/a |
| morning | Round 1 judging (5-min pitch) | Team | First round elimination |
| afternoon | Round 2 judging (3-min pitch) | Team | Final round elimination |
| afternoon | Sponsor pavilion judging | Team (rotating) | Sponsor track scoring |

### PRD-Builder's own deliverable timeline

| Deliverable | Status |
|---|---|
| `caltech/prd-final.md` (lean reference) | ✅ COMPLETE |
| `_bmad-output/planning-artifacts/prd.md` (this BMAD-format PRD — demo + product) | ✅ COMPLETE (this file; realigned post-user-clarification to demo+product scope) |
| `caltech/video-story.md` (production-ready visualization wrapper / launch-video shoot script) | ✅ COMPLETE (companion file) |
| `_bmad-output/planning-artifacts/yc-defensibility-review.md` (YC defensibility validation) | ✅ COMPLETE (1686 words; HIGH hackathon-defensibility, 55-65% Best-Use-of-AI win-prob) |
| Final lock-in pass with user (section-by-section confirm of video-story + PRD) | ⏳ IN PROGRESS |

---

## References

- [`caltech/prd-final.md`](../../caltech/prd-final.md) — lean reference PRD (companion to this document)
- [`caltech/PRD-INPUT-BUNDLE.md`](../../caltech/PRD-INPUT-BUNDLE.md) — source bundle this PRD compresses from (§0-§11)
- [`caltech/prd.md`](../../caltech/prd.md) — draft v1 (553 lines; this PRD supersedes for BMAD workflow)
- [`caltech/prfaq.md`](../../caltech/prfaq.md) — Stage 1 PRFAQ (locked)
- [`caltech/demo-script.md`](../../caltech/demo-script.md) — authoritative 90s shot-by-shot
- [`caltech/narration-script-3min.md`](../../caltech/narration-script-3min.md) — 3-min Round 2 spine (validation rewrites applied)
- [`caltech/emilie-brief.md`](../../caltech/emilie-brief.md) — packaging brief
- [`caltech/tasks-by-person/`](../../caltech/tasks-by-person/) — 4 per-person epics (live execution)
- [`caltech/tier-2-epics/`](../../caltech/tier-2-epics/) — 5 packaging tier-2 epics
- [`caltech/validation-findings/2026-04-25-capability-inventory-summary.md`](../../caltech/validation-findings/2026-04-25-capability-inventory-summary.md) — Adaptation 2 + SynthDebate-on-Brain rationale
- [`caltech/validation-findings/2026-04-25-treehacks-pattern-search.md`](../../caltech/validation-findings/2026-04-25-treehacks-pattern-search.md) — 5 capability-grounded adaptations
- [`caltech/validation-findings/2026-04-25-team-gap-fillers.md`](../../caltech/validation-findings/2026-04-25-team-gap-fillers.md) — corpus-to-blockers mapping
- [`caltech/validation-findings/2026-04-25-blockers-reclassified-pitch-vs-product.md`](../../caltech/validation-findings/2026-04-25-blockers-reclassified-pitch-vs-product.md)
- [`caltech/validation-findings/2026-04-25-phase-2-party-mode-pass-1.md`](../../caltech/validation-findings/2026-04-25-phase-2-party-mode-pass-1.md) — 6-agent Pre-mortem
- [`research/wiki/themes/ai-paradox-invisible-use-cases/README.md`](../../research/wiki/themes/ai-paradox-invisible-use-cases/README.md) — theme lock + Socratic protocol
- [`research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md`](../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md) — TRIBE V2 corrected facts
- [`research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md`](../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md) — 8-emotion taxonomy + 16-mechanic catalog
- [`research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md`](../../research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md) — ~120 terms in 6 buckets
- [`research/wiki/decisions/README.md`](../../research/wiki/decisions/README.md) — 16 locked decisions
- [`research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/500-elicitation-qa-pass.md`](../../research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/500-elicitation-qa-pass.md) — T1 source
- [`research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/501-party-mode-roundtable.md`](../../research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/501-party-mode-roundtable.md) — T2 source

---

## Workflow Status

**PRD complete.** All 11 BMAD steps executed in single autonomous pass per user instruction (override of per-step menu halts). Ready for:
1. **Video story drafting** (`caltech/video-story.md`) — immediate next step.
2. **Section-by-section lock-in pass with user** — final step before validation.
3. **YC defensibility validation** (`yc-sv-development-framework` skill) — defensibility check, hackathon-scoped.
4. **Implementation readiness validation** (`bmad-check-implementation-readiness` skill) — optional pre-build gate.

**The polished PRD serves as the foundation for all subsequent product development activities. All design, architecture, and development work should trace back to the requirements and vision documented in this PRD — update it as needed as planning continues.**
