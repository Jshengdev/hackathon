---
title: "The Two Demo Scenarios — Same Engine, Swap Input + Data-Processing"
status: updated 2026-04-25 to reflect Ironsight/Listen Labs PRD rename + one-size-fits-all framing
purpose: |
  Canonical contract document for the two demo scenarios the team will ship.
  Same TRIBE V2 + two-stage agent pipeline + iterative-scoring loop. Different data
  sources per scenario. Different data-processing parameters per scenario (specialist
  roster + Opus synthesis prompt swap via prompt registry). Different beneficiary
  stories per scenario. SAME OVERARCHING ENGINE.

  Per Decision 010 (B2C-primary + B2B-overlay), per Johnny verbatim 2026-04-25
  ("two demo scenarios we are going to have be inputs"), and per the renamed canonical
  PRD at _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md.

canonical_prd: _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md
codename: Empathy Layer
one_size_fits_all_problem: |
  Today's AI describes what humans did and parses what humans said — but it cannot
  model the cognitive-emotional state underneath. Same gap, two layers: cognitive
  state behind spatial action (Ironsight) and cognitive shift behind verbal agreement
  (Listen Labs).
one_size_fits_all_solution: |
  A brain-grounded empathy translation engine. Two-stage agent pipeline + TRIBE V2
  + iterative-scoring loop produces a falsifiable paragraph describing what the
  human felt during the captured video. Same engine. Multiple data sources. Different
  processing parameters per scenario. Different stories per beneficiary.
companion_docs:
  - ./ironside.md (Scenario A deep dive)
  - ./listenlabs-sideshift.md (Scenario B deep dive)
  - ../prd-final.md §6 input-source-as-persona-switch lock
  - ../demo-script.md (90s on-stage execution)
locks_referenced:
  - Decision 010 (B2C-primary + B2B-overlay positioning)
  - Decision 006 + 007 (TRIBE V2 + agent swarms architectural anchors)
  - prd-final.md §3 (4-layer architecture)
  - prd-final.md §7 (sponsor strategy: one spine, swappable closes)
new_vocabulary_locked:
  - "brainrot" (Gen-Z user-facing term for algorithmic neural convergence — Johnny verbatim 2026-04-25)
  - "algorithm breaking out argument" (user-facing term for the SynthDebate output showing the user the argument that would flip them — Johnny verbatim 2026-04-25)
  - "data layer" (the per-second per-region brain-activation JSON output of TRIBE V2 — frames the engine as data-infrastructure, not a single-purpose tool)
---

# The Two Demo Scenarios — Same Engine, Swap Input

> **Johnny verbatim 2026-04-25:** *"the two demo scenarios we are going to have be inputs, are the ironsite one which is tracking the data layer for videos from the job site, and then on the other end, its going to be processing visual data from a consumers day to day life. something more human tasks like the scrolling and brainrot and the algorithm breaking out argument."*

## §1. The contract

**One engine. Two demo inputs. Two persona surfaces. Multi-track sponsor coverage falls out structurally.**

```
                    [SAME ENGINE — UNCHANGED]
                    TRIBE V2 → K2 swarm → Opus → 3D viz
                    ↑                                  ↑
        [SCENARIO A INPUT]                   [SCENARIO B INPUT]
        Egocentric job-site                  Consumer day-to-day
        video (Ironside)                     visual data
                                             (Listen Labs / Sideshift /
                                              Best AI / Creativity / K2 / YC)
```

## §2. Scenario A — Ironside Job-Site Data Layer

| Dimension | Spec |
|---|---|
| **Input source** | Egocentric construction-worker video (POV camera, 30-90s clip from job-site footage) |
| **User persona** | Construction safety manager reviewing 50h/month of egocentric footage per worker |
| **Beneficiary** | The construction worker (per locked positioning *"for the worker, not the surveiller"*) |
| **What the engine outputs** | Cognitive-emotional state inference per construction action: job-fit signal, training-depth recommendation, risk-classification flag |
| **The "data layer" framing** | TRIBE V2's per-second per-region brain-activation JSON IS the data layer Ironside's pixel-only pipeline lacks. We add the modality — they keep their pipeline (Auto-Classifier → Narration → Observer-as-Judge per Decision 009) |
| **Sponsor closes hit** | Ironside (CORE) |
| **Where it lives in the demo** | BEAT-5 swap-slide variant (off-timer); pre-baked 20s side-by-side MP4 ready for Ironside pavilion judging |
| **Detailed use-case doc** | [`./ironside.md`](./ironside.md) — Define / Develop / Showcase per Ironside's brief |

### Scenario A elevator (locked verbatim from `prd-final.md` §7)

> *"Egocentric video tells you what was done. Brain encoding tells you what state of mind it took to do it well. Same engine, ethos preserved — for the worker, not the surveiller."*

## §3. Scenario B — Consumer Day-to-Day Visual Data Layer

| Dimension | Spec |
|---|---|
| **Input source** | Consumer day-to-day visual data — primarily Reels/TikTok feed screen-recording (90s clip of the user's actual scroll); extensible to YouTube watches, Spotify visuals, etc. |
| **User persona** | Maya, Gen-Z teen (born ~2008-2010) experiencing brainrot from the algorithm |
| **Beneficiary** | The user themselves (per locked positioning *"surface options, user judges; we don't recommend"*) |
| **What the engine outputs** | (a) Per-second brain response to the feed (the un-blackbox surface), (b) 5 Wrapped cards + Land card (the empowerment surface), (c) **the algorithm breaking out argument** — SynthDebate-on-Brain shows the user the specific argument that would flip 60% of brains-like-theirs (the immunization surface) |
| **The "brainrot" framing** | User-facing Gen-Z native vocabulary for what the team has been calling "algorithmic neural convergence" / "cultural flattening." Johnny verbatim 2026-04-25 — replaces academic phrasing for consumer copy |
| **The "algorithm breaking out argument" framing** | User-facing vocabulary for the SynthDebate output: *"here's the argument that breaks you out of the algorithm's hold — so you can recognize it when it arrives, not so the system uses it on you."* Johnny verbatim 2026-04-25 |
| **Sponsor closes hit** | Listen Labs (CORE — Simulate Humanity prompt) + Sideshift (CORE — vault substrate) + Best Use of AI (HARD TARGET — YEA/NAY rubric enacted) + Creativity (3D cortical viz + hover-bridges + Wrapped output) + K2 (CORE — speed required for swarm fan-out + 100K-token SynthDebate sim) + YC (STRETCH — future-Obsidian / personal data vault) |
| **Where it lives in the demo** | The full 90s on-stage demo (BEAT-1 through BEAT-4 ext) per `caltech/demo-script.md`. This is the primary scenario — it gets the live runtime; Scenario A swaps in for Ironside pavilion |
| **Detailed use-case doc** | [`./listenlabs-sideshift.md`](./listenlabs-sideshift.md) — leads with Listen Labs "Simulate Humanity" prompt; Sideshift as vault substrate |

### Scenario B elevator (Johnny voice, locked from `listenlabs-sideshift.md` §4)

> *"Listen Labs asked: simulate humans or societies. Model how people think, argue, change their minds, and influence each other. Most answers will be text-grounded LLM-agent sims that report verbal change. We built brain-grounded society simulation. Maya scrolls Reels. Brainrot is what's happening to her brain in real time. We use TRIBE V2 to predict her per-second neural response. K2 generates 100 synthetic agents whose brain-response profiles match her archetype. Five rounds of debate. We measure not just what each agent SAID but how each agent's brain-response pattern SHIFTED. We hand Maya the algorithm breaking out argument — the specific argument that would flip 60% of brains-like-hers — so she can immunize against it, not so the system uses it on her. Brain-grounded society simulation as a consumer surface. Same engine that scans construction-worker brains responding to job-site footage. Different input. Same architecture. Same ethos: surface what's invisible so the human in the loop can judge."*

## §4. Why the two-scenario contract works structurally (not as gimmick)

The team is NOT building two separate products. The team is building **one engine** that ingests video + audio + (where present) language → emits brain-encoded data layer → swarm interprets → user-facing surface.

**The input source IS the persona switch.** Same TRIBE V2 inference. Same K2 region-specialist swarm. Same Opus depth synthesis. Same 3D cortical viz. **Only the input file changes — and per pre-cache discipline, even the input file change is pre-baked for demo-day reliability.**

This makes the multi-track gamble (Decision 002 — 5 sponsored CORE + Best AI hard target + Creativity main) **structurally MECE rather than rhetorically forced.** Two scenarios cover six tracks because the engine is general; the input is the specialization.

| Sponsor | Which scenario answers their brief | Why |
|---|---|---|
| Ironside (CORE) | Scenario A | Job-site egocentric video = their explicit pipeline modality; we add the data layer |
| Listen Labs (CORE) | Scenario B | Consumer feed → SynthDebate brain-grounded society sim |
| Sideshift (CORE) | Scenario B | Consumer data agency — Maya owns her vault; Brain Card export = viral mechanic |
| Best Use of AI (HARD TARGET) | Both scenarios enact the YEA/NAY rubric — surface options, user judges, no recommendation |
| Creativity (DEFINITE) | Both — 3D cortical viz + hover-bridges + Wrapped output |
| K2 / IFM (CORE) | Both — speed is load-bearing for swarm fan-out across both inputs; SynthDebate-on-Brain (100K tokens) only fits 90s at K2 speed |
| YC (STRETCH) | Scenario B with vault substrate — *"future Obsidian for brain-response data"* |

## §5. Demo-day execution plan (which scenario plays where)

| Pavilion / judging context | Primary scenario shown | Swap into | Pre-cache asset |
|---|---|---|---|
| Best Use of AI judging | Scenario B (full 90s) | — | All BEAT MP4s + cards |
| Creativity judging | Scenario B (full 90s) | — | Same |
| Listen Labs pavilion | Scenario B (full 90s + BEAT-4 ext SynthDebate emphasis) | — | All + SynthDebate replay MP4 |
| Sideshift pavilion | Scenario B (full 90s + Adaptation 2 share-card emphasis) | — | All + share-card export demo |
| K2 / IFM pavilion | Scenario B (with K2 speed-requirement called out in voiceover) | — | All |
| Ironside pavilion | Scenario A (90s adapted; per `ironside.md` §3) | Pre-baked side-by-side MP4 | Ironside-variant MP4 + report card image |
| YC pavilion (if applicable) | Scenario B + vault future-Obsidian framing | — | All + vault future-state slide |

**Default: Scenario B is the primary. Scenario A swaps in only for Ironside pavilion.** Both pre-cached by Saturday 8 AM per locked freeze discipline.

## §6. New vocabulary to fold across artifacts

The user's verbatim turn introduced three new pieces of vocabulary that should land consistently across all user-facing copy + voiceover + on-screen text:

| Term | Use where | Replaces / sharpens |
|---|---|---|
| **brainrot** | Scenario B voiceover, Wrapped Card 2 copy, Devpost consumer paragraph, social variants | Replaces academic *"algorithmic neural convergence"* / *"cultural flattening"* in user-facing copy. Keep academic terms in technical docs (PRD, FAQ ammunition for hostile judges). |
| **algorithm breaking out argument** | BEAT-4 ext SynthDebate voiceover, output card text, Devpost section on the empowerment surface | Replaces *"susceptibility-to-disagreement signal"* / *"argument that flipped 60%"* in user-facing copy. Keep technical metric phrasing for hostile-judge FAQ. |
| **data layer** | Ironside pavilion close, BEAT-2 architecture description, Devpost technical section | Frames the TRIBE V2 brain-encoded JSON as data-infrastructure. Sharpens *"brain encoding"* into a B2B-credible noun. Lets Ironside read us as adding to their pipeline rather than competing with it. |

**Cost to fold:** ~30 minutes across `narration-script-3min.md` + `video-story.md` §15 voiceover blocks + Devpost copy + sponsor swap-slides.

## §7. What this LOCKS (so it doesn't drift)

1. **Two demo input sources, not three or more.** No additional persona-switches added during the build window. Scope is fixed at Scenario A + Scenario B.
2. **Same engine end-to-end for both.** No bespoke pipeline for either scenario. Junsoo's TRIBE V2 + Jacob's K2 swarm + Johnny's viz integration runs unchanged across both inputs.
3. **Input-source-as-persona-switch** is the architectural answer to multi-track sponsor coverage (Decision 002 + 010). NOT "one product with two value props" — *"one engine; the input file is the persona."*
4. **Scenario B is the primary live demo.** Scenario A is pre-baked side-by-side for Ironside pavilion only.
5. **The new vocabulary (brainrot / algorithm breaking out argument / data layer)** is locked across user-facing artifacts.
6. **No pivot to a third scenario** without re-opening Decision 002 + 010. Scope is held.

## §8. Cross-references to the locked artifacts

- `caltech/use-cases/ironside.md` — Scenario A Define-Develop-Showcase deep dive
- `caltech/use-cases/listenlabs-sideshift.md` — Scenario B deep dive (Listen Labs prompt-direct lead + Sideshift vault substrate)
- `caltech/use-cases/yc-partner-stress-test.md` — defensibility of the two-scenario product
- `caltech/use-cases/outsider-advantage-check.md` — founder-market-fit honesty + Devora-archetype reframe
- `caltech/prd-final.md` §6-§7 (sponsor strategy + input-source-as-persona-switch lock)
- `caltech/demo-script.md` (90s on-stage execution; primary = Scenario B; BEAT-5 Ironside swap = Scenario A)
- `caltech/video-story.md` (3-min Round 2 launch video; Scenario B as primary visual narrative)
- `_bmad-output/planning-artifacts/prd.md` §FR6 (Ironside-swap input source) + §Stream A (Ironside parallel stream architecture)
- `research/wiki/decisions/010-b2c-primary-b2b-overlay-positioning.md` (the architectural decision this contract instantiates)

## §9. The headline framing for sponsor pavilion + Devpost

> *"We built one engine that ingests video and outputs a brain-encoded data layer. Two demo scenarios prove it: a construction worker's egocentric job-site footage (we add the data layer to Ironside's pipeline), and a Gen-Z teen's Reels feed (we use the data layer to show her brainrot in real time and hand her the algorithm breaking out argument). Same engine. Two inputs. Different beneficiaries. Same ethos: surface what's invisible so the human in the loop can judge."*
