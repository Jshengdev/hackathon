---
title: "PRD-FINAL — Caltech HackTech 2026"
status: deployment-ready (hackathon-demo scope; final wording polish deferred per doctrine)
created: 2026-04-25
project_name: caltech-hacktech-2026
target_tracks: Best Use of AI (hard target) · Creativity · Listen Labs · Sideshift · Ironside · IFM K2 (core) · YC (stretch)
budget: 12h × 4 people = 48 person-hours
freeze: Saturday 2026-04-26 8 PM PDT
submit: Saturday 2026-04-26 11 PM PDT (10h buffer to Sunday 9 AM hard deadline)
authoritative_for: end-to-end project specification — story + architecture + I/O contracts + sponsor strategy
supersedes: caltech/prd.md (draft v1) — this is the lean deployment-ready version
cross-links:
  - ./prfaq.md
  - ./demo-script.md
  - ./narration-script-3min.md
  - ./tasks-by-person/
  - ./validation-findings/2026-04-25-capability-inventory-summary.md
  - ../research/wiki/decisions/README.md
---

# PRD-FINAL — un-blackbox the algorithm's reach into your thinking

> **[TBD-FINAL-PASS]** product name, headline, sponsor close wording. Per "draft everything at the very end" doctrine.

---

## §0. Anchor (5 sentences + doctrines)

The five sentences every builder keeps visible. Verbatim Johnny doctrine — non-negotiable.

1. **Transformation.** *"Return human autonomy with the ability to see your thoughts."*
2. **Persona.** Gen-Z teen who has never had a reference frame outside the algorithm. Every artifact narrated *to* this human.
3. **Hero mechanic.** Inverted-Brain-Search Land card (click grayed-out region → content **options**, NOT recommendations). BEAT-4 = demo's center of gravity.
4. **Headline direction.** *"You can't see how the algorithm shapes your thinking. We made it visible."* [TBD-FINAL-PASS]
5. **Demo is 90 seconds, not the product.** A snippet representation. Pre-cache hard parts. Don't describe a production system.

**Doctrines (LOCKED).**

| Doctrine | Bind |
|---|---|
| Socratic protocol (Decision 004) | Claude reflects, never proposes. Johnny names; team executes. |
| Pitch-vs-product | Block on pitch-issues only. Product-issues parked. |
| Smallest possible circle | Minimum-viable shipment unit. The 90s demo IS the unit. |
| No recommendation | Surface options. User judges. |
| Demo-over-execution (Decision 011) | Visualization > engineering depth. |
| Draft at the end | Polish wording last. Use `[TBD-FINAL-PASS]` markers anywhere wording is open. |

**Multi-track gamble (acknowledged).** Johnny verbatim: *"This is the worst way to come up with ideas... but name another scenario where you're able to fit every single sponsored track into one idea. It's a huge gamble — it's the hackathon method."* Track coverage is a known-cost bet, not an accident.

---

## §1. Open items — deferred to Johnny (NOT closed by this PRD)

| # | Item | Owner | Deadline | Default if not picked |
|---|---|---|---|---|
| 1 | Visualization stack (Three.js / R3F / Plotly3D) | Johnny | Friday 2 PM | R3F |
| 2 | Inverted-brain-search implementation (a/b/c) | Johnny | Friday 5 PM | Pre-cache hand-curated for demo input |
| 3 | Final product name | Johnny | Saturday 6 PM | [TBD-FINAL-PASS] from candidate set |
| 4 | Final headline | Johnny | Saturday 6 PM | Current direction lock |
| 5 | T2 stance (own / counter) | Johnny | FAQ time | Hold as tension; answer Q-INT-4 with within-subject framing |
| 6 | Compare-move scope | Johnny | TBD | V2-only / parked |
| 7 | YC monetization path (a hosted / b local-first) | Johnny | Saturday 6 PM | Both held as named options |
| 8 | On-device-vs-cloud lock | Johnny | Friday | Held privately (not pitch) |
| 9 | **Adaptation pick (impacts BEAT-4 scope)** | Johnny | ASAP | **Adaptation 2 (Shareable Brain Card) + SynthDebate-on-Brain** — see §9 |
| 10 | Opus-final-synthesis layer + design-consciousness primes deepening | Johnny | Carry-forward | Not blocking ship |

---

## §2. Persona

**Gen-Z AI-native teen.** Born ~2008-2010. Raised on the algorithm. Has never had a reference frame outside it. Their thoughts converge with their feed and they cannot tell which thoughts are theirs.

**Felt-friction sentence (Johnny's published voice):** *"If a headline is engineered to make you angry, the only way to know is to notice your own reaction after it already got you."*

**Why this persona over alternatives** (per `validation-findings/2026-04-25-team-gap-fillers.md`): rejected creator-only (too narrow for Listen Labs), junior-dev (comprehension-debt frame too narrow), strategic decision-maker (no BeReal/Sideshift hook). Gen-Z teen wins because it covers most sponsor closes and is the honest story for Listen Labs.

---

## §3. Problem + Stakes

**Problem (Johnny verbatim):** *"Algorithms have flattened how everyone's neurons fire. Everyone's thoughts converge along paths the recommender shaped, and they will never be able to deviate from those converging paths because they don't know the convergence is happening."*

**Stakes — the trilemma** (capability-first articulation):

| Path | Data-cost | AI-benefit | Agency |
|---|---|---|---|
| All-in | All given up | Maximum personalization | Lost (self-repeating cycle) |
| Refuse | Preserved | None | Preserved but irrelevant |
| **Empowerment (ours)** | Yours | Yes | Preserved + informed |

**Future-vision extension (story-tense, not use-case-tense):** Today = Reels. Tomorrow = BCI. Same trade. Same trap. The product is the design pattern for human-AI partnership before the cognitive interface becomes invisible.

**Signature thesis line (Johnny published):** *"Manipulation only works in the dark. What happens to the internet when the lights come on?"*

---

## §4. Solution Architecture (LOCKED — 4-layer pipeline)

```
[INPUT]            Reels/TikTok feed screen recording (B2C / Listen Labs / Sideshift)
                   OR egocentric construction-worker video (Ironside)
                   — input source IS the persona switch; same product
   ↓
[BRAIN ENCODING]   TRIBE V2 inference @ 1Hz, 5s HRF lag
                   ~20,000-vertex cortical activation predictions on fsaverage5 mesh
                   (NOT 70K voxels — canonical reference; T1 lock)
   ↓
[SWARM SPLIT]      K2 swarm of N agents tied 1:1 to brain regions
                   Each agent IS a "specialist for that part of the brain"
   ↓
[CROSS-REGION]     Agents talk to each other (the "sauce")
                   2-pass minimum: hypothesis → cross-eval → synthesis
                   Produces edges between region-outputs (the bridges)
   ↓
[OPUS SYNTHESIS]   Claude Opus on aggregated swarm output:
                   "what does this MEAN for THIS user, how to display, what problem this solves"
                   (the depth layer K2 explicitly is NOT)
   ↓
[VISUALIZATION]    3D brain (fsaverage5) + 3D knowledge graph in separate spatial layers
                   (NOT painted on cortex — Johnny explicitly cut)
                   + clickable per-region specialist tree
                   + hover-bridges (grayed by default; light up on focus)
   ↓
[OUTPUT]           5 Spotify-Wrapped-style cards (see §5)
                   + Adaptation 2 shareable export + SynthDebate-on-Brain (see §9)
```

**Architectural locks:**
- **Specialist per brain region** (NOT three-role debate triad — explicit non-overlap with Renaissance Research lookalike)
- **Cross-region communication YES** — the cross-talk is the operational distinction from static fan-out
- **Hover-bridge mechanic** — grayed by default; light up on user hover within radius (Victor's required kill-shot move)
- **Two-layer viz** — 3D brain + 3D knowledge graph in separate spatial layers
- **Live-with-pre-cache fallback** — try live; per-component swap to pre-cached if any beat fails

**Product reframe (Quinn validation pass 2 — LOCKED):** the product is **NOT** "a brain-reading app." It IS *augmented introspection that uses neuroscience as the interface.*

---

## §5. Output Shape — 5 Spotify-Wrapped-style cards

Format reference only — NOT product name (trademark caveat held).

| # | Card | Content | Notes |
|---|---|---|---|
| 1 | Top Brain Regions | Function names ("emotion processing," "future planning," "social sense") not anatomy. Anatomy as small footnote. | Sally UX fix: "amygdala" reads as homework for a 17-year-old. |
| 2 | Top Content Categories | *"You can't lie about what you consume anymore."* | Comparison must DISAGREE with intuition or it has no surprise. |
| 3 | Cohort Comparison | E.g., *"You're MORE converged than 88% of peers."* | Hand-tuned 10-profile mock cohort for demo. FAQ pre-script: *"production scales with consented data."* |
| 4 | Brain Map (3D) | Hero shot for shareable-card export | Magazine-cover beautiful (Emilie's Nova-quality bar). |
| **5 (HERO)** | **Inverted-Brain-Search Land card** | Click grayed-out region → content **formats** that activate it (long-form essays, poetry, language-learning, etc.) | **NOT recommendation.** Surfaces options; user judges. |

---

## §6. Demo Skeleton — see [`demo-script.md`](./demo-script.md) for shot-by-shot

| Beat | Time | Mechanic | Owner of fallback |
|---|---|---|---|
| BEAT-0 | pre-demo (off-timer) | Sponsor close swap-in (1-2 slides per sponsor) | Emilie (3 variants pre-rendered) |
| BEAT-1 | 0:00–0:15 | Hook — Reels scroll + live cortical mesh. Recognition + Awe. | Emilie cuts 15s mesh+Reels MP4 Friday |
| BEAT-2 | 0:15–0:45 | Body — swarm specialists + hover-bridges. Surprise setup. | Jacob bakes 30s bridge MP4 |
| BEAT-3 | 0:45–1:15 | Surprise — feed-shaped vs. baseline-shaped brain toggle. Awe + Hope. | Junsoo bakes 20s side-by-side MP4 |
| BEAT-4 | 1:15–1:30 | Land/Hero — Wrapped cards collapse to inverted-brain-search. Pride + Comfort. | All cards pre-rendered |
| BEAT-5 | slide swap (off-timer) | Sponsor close (Listen Labs / Ironside / Sideshift) | All 3 variants pre-rendered |

**Round 2 narration (3 min):** see `narration-script-3min.md` (Sophia + Quinn + Maya validation rewrites already applied). Budget: 35s Black Mirror Act 1 + 20s Act 2 transition + 100s Act 3 demo + 25s Act 4 close.

---

## §7. Sponsor Strategy — one spine, swappable closes

### The unified empowerment spine (NEW LOCK 2026-04-25)

> *"Personalization is currently coerced. Disadvantage or data-extraction. We give you the third option — see it, choose it, own it."*

**Core positioning (Johnny verbatim):** *"Your Spotify is no longer your music tastes. Your YouTube is no longer yours. Your Reels — you can't select any of that. You're either at a disadvantage, or you give up your data. We offer a third option: you can use AI, but you should be able to see what they're doing to you and make the choice. That's the empowerment angle."*

**Movement-shift framing:** category-creator on the new direction of human-AI partnership — not "another AI tool."

### Best Use of AI — the YEA/NAY rubric (LOCKED — the product enacts the answer)

| YEA — when AI should be used | NAY — when AI should NOT be used |
|---|---|
| Make invisible processes visible | Recommend / prescribe / optimize for engagement |
| Surface options the user judges | Harvest data without consent |
| Menial high-throughput work (K2 swarm) | Replace user judgment |
| Synthesize across signals (Opus) | Present as human / mislead via simulation |

### Track coverage

| Track | Status | One-line strategy |
|---|---|---|
| **Best Use of AI** | 🎯 hard target | Product enacts YEA/NAY rubric. |
| **Creativity** | ✅ definite | Cortical viz + hover-bridges + Wrapped output. |
| **K2 / IFM** | ✅ core | Speed (~1300 tok/s) is the architectural unlock — swarm fan-out infeasible at Claude latency in 90s. |
| **Listen Labs** | ✅ core | *"You simulate humans. We simulate humanity — the human-AI partnership of the future."* SynthDebate-on-Brain explicit fit. |
| **Sideshift** | ✅ core | *"Consumer tool for capturing your data — for you."* Wrapped export = viral mechanic. |
| **Ironside** | ✅ core (use-case LOCKED) | Cognitive-emotional state inference per construction-action. Same engine, different input. |
| **YC** | ✅ stretch (NAMED) | *"Future Obsidian — knowledge graph is your brain's response shape."* Two monetization paths held. |
| **Palohouse** | ❌ dropped | Decision 015. |

### Per-sponsor swap-slide one-liners ([TBD-FINAL-PASS] for full polish)

- **Listen Labs.** *"You simulate humans. We simulate humanity — the loop where AI surfaces convergence and the user finds what's outside it."*
- **Sideshift.** *"A consumer tool for capturing data — your data, for you. The first surface that gives you visibility into what's being harvested, scoped to your brain's response."*
- **YC.** *"The future Obsidian — except your knowledge graph is your brain's response shape, not your typed notes. Database FOR you, not the database that sells you."*
- **Ironside.** *"Egocentric video tells you what was done. Brain encoding tells you what state of mind it took to do it well. Same engine, ethos preserved — for the worker, not the surveiller."*

**K2:** Covered by core architecture (speed is load-bearing for swarm fan-out at scale).
**Best Use of AI:** Universal wrapper. The YEA/NAY rubric IS the answer.

---

## §8. Per-Person Silos — I/O Contracts (LIVE: team is executing right now)

| Person | Lane | INPUT | OUTPUT | Friday-night smoke test |
|---|---|---|---|---|
| **Junsoo Kim** | TRIBE V2 + Ironside angle | Screen-recording video (Reels for B2C; egocentric construction for Ironside swap) | brain-activation JSON @ 1Hz: `{time_s, region_id, activation, vertices[]}` + Ironside side-by-side MP4 | TRIBE inference latency on 30s clip on demo GPU. Threshold: < 30s. Fallback: pre-cache. |
| **Jacob Cho** | K2 swarm + cross-talk | Junsoo's per-region brain JSON | swarm-output JSON: per-region interpretations + cross-region edges with weights | 10 concurrent K2 calls, 30s window. Threshold: zero timeouts. Fallback: pre-cached swarm outputs. |
| **Johnny Sheng** | Innovation + 3D viz + 3-parallel-Claude orchestration | Jacob's swarm JSON + Junsoo's TRIBE stream | Integrated frontend: 3D brain + 3D knowledge graph + hover-bridges + Land card backend | 3D rendering FPS ≥ 30 on demo laptop. Fallback: mesh decimation or pre-baked camera motion. |
| **Emilie Duran** | Entire packaging | Locked content (cards, sponsor lines, headline pick) | 5-card Figma mockup + launch video MP4 + Devpost writeup + 3 sponsor slides + voiceover WAV | Renaissance differentiation rehearsal: first 60s to a "Renaissance scorer" — no pattern-match within 10s. |

**Multi-Claude orchestration (Johnny):** Tier 1 (5 build worktrees) + Tier 2 (9 packaging worktrees) — see `tmux-spawn-all.sh`.

**Integration philosophy:** clean I/O per beat. Integration is plumbing.

---

## §9. Adaptation Pick — DEFAULT (flagged for Johnny override)

Per `validation-findings/2026-04-25-capability-inventory-summary.md`:

**Adaptation 2 (Shareable Brain Card, 3-4h) + SynthDebate-on-Brain (4-5h) = 7-9h within budget. Maximum sponsor-track coverage.**

### Adaptation 2 — Shareable Brain Card
1:1 aspect-ratio image (Instagram Story shape) showing user's brain-consumption fingerprint. Top 5 activated regions, top 3 dormant, formats consumed/avoided. *"My brain this week — what about yours?"* + shareable link. Card seeds viral loop. Doubles as Sideshift viral-mechanic.

### SynthDebate-on-Brain — the synthesis pick
**Primitive chain:** TRIBE encoding + witnessed dissent (actor/auditor/mediator) + behavioral prediction + war-game on synthetic profiles.

**How it works:** TRIBE V2 encodes user's brain → K2 generates 100 synthetic agents matching the user's brain-archetype → swarm war-games opinion dynamics on the same content over 5 rounds → user sees their predicted susceptibility-to-opinion-shift with 100 brains-like-them debating in real time.

**Why it's the synthesis pick:**
- ✅ Listen Labs explicit fit (multi-agent opinion dynamics)
- ✅ K2 structurally required (100 agents × 5 rounds × 200 tok = 100K tok; only K2's ~1300 tok/s fits in 90s)
- ✅ Empowerment-aligned (user sees susceptibility, chooses how to react)
- ✅ Doesn't replace locked spec — adds an execution layer downstream of Wrapped output
- ✅ Solves Johnny's "stats-are-not-enough" critique with predicted-population-dynamics

**Demo BEAT-4 extension:** instead of Land card being the final hero, add a 10-15s SynthDebate beat showing how susceptible the user's brain-archetype is to opinion-shift on the content they just consumed.

**KEY DISCOVERY for FAQ ammunition:** Cortex.buzz (built on TRIBE V2) is the *attention-engineering* application of the same model already deployed. We INVERT it. Strengthens *"big tech uses brain models for X; we use the same model for not-X"* with a NAMED comparable.

---

## §10. Forbidden Claims (per TRIBE canonical reference + Poldrack 2006 + Quinn pass 2)

- ❌ **Reverse inference.** Never claim "amygdala fired = user felt fear." Use *"responded to attention-grabbing cues."* / *"observed measurable response to..."* — NEVER *"because content was designed to make you feel"* / *"the part that's you"* / *"fires because [emotion]"*.
- ❌ **Sub-second predictions.** TRIBE is 1Hz with 5s HRF lag.
- ❌ **Clinical claims.** *"Content discovery, not clinical diagnosis."*
- ❌ **Population-norm comparisons.** Within-subject contrast only — never *"your brain vs. average healthy brain."* Always *"your brain on your feed vs. your brain on something else."*
- ❌ **Inflated TRIBE numbers.** Never say 70K vertices / 700 subjects. Canonical: ~20,000 vertices on fsaverage5, ~25 trained subjects.
- **License: CC BY-NC 4.0** — non-commercial only; FAQ pre-script: *"research-stage; commercial path TBD."*

---

## §11. FAQ Ammunition (story-ammunition pre-scripts; final wording deferred)

### Customer FAQ
- **Q1.** *"What's different vs. a wellness app or screen-time tracker?"* → Not measuring time/usage; measuring brain-pattern shape.
- **Q2.** *"Is this another AI tool that tells me what to do?"* → No. *"We don't recommend; we surface options. You judge."*
- **Q3.** *"How accurate is the brain reading?"* → Uses TRIBE V2 (Meta FAIR). ~20K-vertex predictions. Predicts response patterns, not felt emotions.
- **Q4.** *"Can I share this with my friends?"* → Yes — Adaptation 2 Shareable Brain Card. Sideshift angle.
- **Q5.** *"Will this work on my actual feed?"* → Demo runs on screen-recording. Production scales with consented streaming.

### Internal FAQ — story-ammunition for hostile judges
- **Q-INT-1. Renaissance Research differentiation.** *"They ran a debate triad. We run specialists per brain region (N=many, brain-grounded), with the user's own brain as the auditor. Different epistemology, different visual signature, different answer to T2."*
- **Q-INT-2. TRIBE numbers honesty.** *"~20,000 cortical-surface vertices on fsaverage5, trained on ~25 deeply-scanned subjects. The 70K figure is a marketing variant; we use canonical numbers."*
- **Q-INT-3. Reverse inference.** *"We don't claim activation = felt emotion. The Land card is content discovery via inverse pattern lookup, not clinical diagnosis."*
- **Q-INT-4. T2 — auditor's external referent.** *"We make Filter World visible. We don't claim to fix it. The user's own brain-fire pattern across diverse content is the signal — TRIBE is the lens, not the auditor itself."*
- **Q-INT-5. "We don't recommend" vs. Land card.** *"The Land card surfaces content **formats** that would activate a region. The user picks. No optimization for engagement; no closed loop. Inversion of recommender, not iteration on it."*
- **Q-INT-6. K2-could-be-Claude.** *"At Claude latency, swarm fan-out at this scale doesn't fit 90s. K2's ~1300 tok/s is the architectural unlock. SynthDebate (100 agents × 5 rounds = 100K tok) is structurally K2-only."*
- **Q-INT-7. License (CC BY-NC).** *"Research-stage. Commercial path TBD via Meta legal."*
- **Q-INT-8. Spotify Wrapped trademark.** *"Format reference only. Product name is [TBD-FINAL-PASS]."*
- **Q-INT-9. Cohort data source.** *"Demo cohort is hand-tuned mock; production scales with consented user data. Per-percentile math is real against the mock."*
- **Q-INT-10. Listen Labs concrete viz.** *"BEAT-3 side-by-side cortical heatmap toggle IS the convergence visualization. SynthDebate sim is the explicit answer to their multi-agent opinion-dynamics brief."*
- **Q-INT-11. Sideshift dev-tool fit.** *"Ingredients-list API. Creators embed it. Same pattern as FDA labeling integration — this is the labeling layer for content."*
- **Q-INT-12. Ironside fit.** *"Brain encoding adds the salience signal pixel-only VLMs miss. Junsoo's prior egocentric-video supervision pipeline work is the credibility chip."*
- **Q-INT-13. The 90s walkthrough.** See [`demo-script.md`](./demo-script.md). Every team member must perform this from memory.
- **Q-INT-14. Cross-talk soup.** Junsoo's black-box LLM behavior probing methodology validates cross-talk produces semantically distinct outputs. Plus one hand-tuned demo example (Jacob owns).
- **Q-INT-15 (NEW). Cortex.buzz.** *"Cortex.buzz is the attention-engineering application of TRIBE V2. We INVERT it — same model, opposite direction. Manipulation only works in the dark."*

---

## §12. Friday-Night Smoke Tests (gate — run 8-11 PM)

Failure on any → mandatory mitigation immediately. Per Pre-mortem.

| # | Test | Owner | Threshold | Fallback |
|---|---|---|---|---|
| 1 | TRIBE latency baseline (30s clip on demo GPU) | Junsoo | < 30s | Pre-cache |
| 2 | K2 swarm load (10 concurrent calls, 30s window) | Jacob | Zero timeouts | Pre-cached swarm outputs |
| 3 | Renaissance differentiation rehearsal | Emilie + Johnny | No pattern-match within 10s | Re-cut first 10s |
| 4 | 3D rendering FPS (fsaverage5 + knowledge graph) | Johnny | ≥ 30 FPS | Mesh decimation / pre-bake camera motion |
| 5 | Wi-Fi contingency (full demo on phone hotspot) | Emilie + Johnny | Zero API timeouts | Full backup MP4 |
| 6 | Swarm output coherence (8-region outputs) | Jacob | < 50% semantic overlap | Harden region-specific prompts |
| 7 | Figma-to-data contract | Emilie + Jacob | No box overflow | Adjust card layouts |
| 8 | Demo determinism (2 back-to-back runs) | Johnny | < 5% variance | Temp=0, lock seeds, or pre-record |

**Saturday 8 AM pre-cache assets due** (Junsoo / Jacob / Emilie respective MP4s; Emilie all sponsor slides + voiceover WAV).

**Saturday 6 PM pre-cache assembly test** — Emilie runs entire 90s on pre-recorded only. If that works, live is bonus.

---

## §13. Verdict — Strengths, Risks, Final-Pass Items

### Strengths
- **Founder credibility chip is shipped, dated, public.** Johnny's Synthetic Synesthesia (90.4% Clair de Lune emotion-center match across 20,484 vertices) is primary-source evidence the methodology works *before* the team writes new code. Renaissance had no comparable.
- **Renaissance differentiation is structural, not cosmetic.** Brain-encoding-as-grounding + N-specialists-per-region + user-as-auditor + Reels-input-not-text. Sensory and epistemic frame is non-overlapping (see demo-script Renaissance differentiation table).
- **Multi-track strategy is structurally sound.** One spine, swappable closes; input-source-as-persona-switch makes closes MECE.
- **Per-person silos = clean I/O.** Junsoo TRIBE → Jacob swarm → Johnny viz → Emilie packaging. Integration is plumbing.
- **Engineering budget feasible.** ~35-42 person-hours of 48 budgeted. 6-13h headroom.
- **Doctrine binding consistent.** Socratic + pitch-vs-product + smallest-circle + no-recommendation + demo-over-execution + draft-at-end form a coherent operating system.

### Risks (open)
- **Renaissance pattern-match in first 10s** — Smoke test #3 is the real gate.
- **TRIBE latency on demo GPU** — single largest schedule risk. Pre-cache fallback IS the answer; smoke test #1 confirms.
- **Inverted-brain-search Land card execution** — Q-J6 + hand-curated demo suggestions critical. Pre-cache for the specific demo input video.
- **Cross-talk soup** — defense is Junsoo's empirical method + Jacob's hand-tuned demo example. If cross-talk doesn't visibly diverge, K2 swarm reads as decoration.
- **Listen Labs talk Saturday 11 AM** — mandatory attendance.

### Final-pass items deferred to end (Saturday 6 PM polish window)
- Press-release headline (final wording from candidate set)
- Product name (final pick from Johnny's vocabulary: *Lights On, Daylight, Mirror, Brainline, Ingredients, Garden Mode*)
- Each sponsor close (final wording from seed lines)
- BEAT-4 user quote (in 17-year-old voice)
- FAQ answers (story-ammunition lines polished from question-only state)

---

## §14. References

- [`./prfaq.md`](./prfaq.md) — full PRFAQ canvas (Stage 1 locked)
- [`./demo-script.md`](./demo-script.md) — authoritative 90s shot-by-shot
- [`./narration-script-3min.md`](./narration-script-3min.md) — 3-min Round 2 spine (validation rewrites applied)
- [`./tasks-by-person/`](./tasks-by-person/) — 4 per-person epics (live)
- [`./validation-findings/2026-04-25-capability-inventory-summary.md`](./validation-findings/2026-04-25-capability-inventory-summary.md) — Adaptation 2 + SynthDebate-on-Brain rationale
- [`./PRD-INPUT-BUNDLE.md`](./PRD-INPUT-BUNDLE.md) — source bundle this PRD compresses from
- [`../research/wiki/decisions/README.md`](../research/wiki/decisions/README.md) — 16 locked decisions
- [`../research/wiki/themes/ai-paradox-invisible-use-cases/`](../research/wiki/themes/ai-paradox-invisible-use-cases/) — theme + sources + window-2 deepening
