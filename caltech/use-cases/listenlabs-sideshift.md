---
title: "Use Case — Listen Labs 'Simulate Humanity' + Sideshift/YC Consumer Overlay (Demo Scenario B)"
status: updated 2026-04-25 to reflect Ironsight/Listen Labs PRD rename + one-size-fits-all framing
sponsors: [Listen Labs (CORE primary $3K + interview), Sideshift (CORE substrate), Best Use of AI (HARD TARGET), Creativity, K2/IFM, YC stretch]
track_role: Listen Labs CORE primary; Sideshift CORE via vault-as-substrate; Best AI hard-target enacts YEA/NAY rubric
demo_scenario: B (consumer day-to-day visual data — see `./two-demo-scenarios.md`)
companion_scenario: A (workplace footage — see `./ironside.md`)
prompt_we_are_answering: |
  "Build a simulation of humans or societies. Model how people think, argue,
  change their minds, and influence each other in complex, unpredictable ways."
  — Listen Labs "Simulate Humanity" challenge, HackTech 2026
prize: $3,000 grand prize + Listen Labs interview
canonical_prd: _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md
codename: Empathy Layer
one_size_fits_all_engine: |
  This document is one of two demo scenarios on the same overarching engine. Same
  TRIBE V2 + two-stage agent pipeline + iterative-scoring loop. Different data source
  (consumer day-to-day visual data — primarily Reels/TikTok feed screen-recording).
  Different data-processing parameters (specialist roster weighted toward emotional /
  social / default-mode / language). Different beneficiary story (B2C user-facing
  daily-journal that writes itself; vault is the user's; future-Obsidian knowledge
  graph accumulation).
ladders_to:
  - caltech/prd-final.md §6 Listen Labs + Sideshift swap-slides
  - _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md (canonical PRD — Listen Labs + Ironsight covered together)
  - caltech/validation-findings/2026-04-25-capability-inventory-summary.md (SynthDebate rationale)
  - caltech/use-cases/two-demo-scenarios.md (scenario contract)
companion_use_cases:
  - ./two-demo-scenarios.md (canonical two-scenario contract)
  - ./ironside.md (Scenario A — workplace footage; same engine)
  - ./empathy-layer-hero-output.md (strategic hero-output framing)
  - ./empathy-layer-prd-simplified.md (build-clarity simplified pipeline spec)
  - ./yc-partner-stress-test.md (defensibility evaluation)
  - ./outsider-advantage-check.md (founder-market-fit honest reframe)
key_vocabulary:
  - "brainrot" (Gen-Z user-facing term for what the team has been calling "algorithmic neural convergence" / "cultural flattening" — Johnny verbatim 2026-04-25; locked for user-facing copy)
  - "algorithm breaking out argument" (user-facing term for SynthDebate's output: the specific argument that would flip the user, surfaced so the user can immunize against it — Johnny verbatim 2026-04-25)
  - "data layer" (TRIBE V2 brain-encoded JSON — same data-infrastructure noun used in Scenario A)
  - "empathy layer" (the codename for the engine; the translation surface that converts action data into brain-grounded human-readable description)
  - "behavior gap" (the gap between treating users as machines and users actually being humans; what the engine fixes; B2C version: gap between knowing what you consumed and knowing what your consumption did to you)
---

# SynthDebate-on-Brain — Brain-Grounded Society Simulation (Demo Scenario B)

> **Canonical contract:** This is **Scenario B** of the two-demo-scenarios contract (see [`./two-demo-scenarios.md`](./two-demo-scenarios.md)). The PRIMARY live demo scenario. Same engine as Scenario A (Ironside job-site data layer). Different input source: consumer day-to-day visual data — primarily Reels/TikTok feed screen-recording.
>
> **For Listen Labs's "Simulate Humanity" challenge.** Most society simulations model how text-only LLM agents argue. We model how brains-like-yours argue — by grounding each synthetic agent's response profile in a real TRIBE V2 brain-encoding fingerprint derived from the user's own neural response to the content being debated. The simulation is brain-grounded, not text-grounded. Opinion shift is measured against a falsifiable within-subject contrast, not LLM self-report. The user owns their own data (Sideshift vault substrate), the society lives inside their vault, and the system surfaces **brainrot** in real time + hands the user **the algorithm breaking out argument** so they can immunize against it.

---

## §0. Direct response to Listen Labs's six prompt questions

The challenge brief lists six questions. We answer each, structurally, with the same engine:

### 1. *"How do humans change their mind? What triggers a genuine belief shift vs. surface-level agreement?"*

**Our answer:** A genuine belief shift correlates with measurable change in the brain-response pattern across iterative exposure to opposing arguments. Surface-level agreement does not. We measure this directly: each synthetic agent has a brain-response profile (from TRIBE V2 inference on the original content). We expose the agent to 5 rounds of cross-agent argument. We re-score the agent's brain-response profile after each round. **Genuine belief shift = within-agent brain-pattern change above baseline noise; surface agreement = verbal-only change with stable brain-pattern.** We can distinguish the two — text-only sims cannot.

### 2. *"What arguments are actually convincing? Is it logic, emotion, social proof — or something else entirely?"*

**Our answer:** We rank arguments by **per-agent brain-pattern shift produced**, not by verbal acceptance. Across 100 agents × 5 rounds, the simulation outputs an argument-effectiveness leaderboard grounded in measurable shift. We can also decompose: which arguments shift prefrontal-engagement specialists (logic), which shift emotional-processing specialists (emotion), which shift social-pattern specialists (social proof). **The decomposition is novel** — most opinion-dynamics sims report "X% changed minds." We report "X% changed minds AND the shift was driven by [logic | emotion | social proof | something else] based on which brain-region specialists swung."

### 3. *"How does information propagate? Rumors, news, misinformation — model how ideas spread through groups."*

**Our answer:** Round-by-round network propagation. Round 1: each agent forms initial reaction. Round 2: agents see other agents' reactions, revise (or harden). Round 3: agents see population-level reaction distribution, identify swing positions. Round 4: agents debate from established positions. Round 5: stability metric crystallizes. We track which agent-archetypes drove the most others to shift (information propagation through influence-asymmetry). **The propagation model is brain-grounded — not "agent X said Y, agent Z heard Y" but "agent X's argument shifted brain-region specialist W in agent Z."**

### 4. *"Are all humans in a society created equal? How do power dynamics, influence, and asymmetry shape collective behavior?"*

**Our answer:** **No** — and we measure it. Round 3 of the sim explicitly surfaces influence-asymmetry: which 3-5 brain-archetypes (out of 100) drove the majority of opinion shift in the rest. These are the **swing-archetypes**. They have outsized influence not because of any social-status feature (we don't model that), but because their brain-response profile sits at a position that lets their argument resonate with the largest cluster of other archetypes. **Power dynamics emerge from cognitive position, not from asserted hierarchy.** This is empirically falsifiable.

### 5. *"How do you model interactions between different people? Personality, culture, incentives — what drives how agents interact?"*

**Our answer:** Each agent's interaction style is determined by their **brain-response profile across 8 region-specialists** (visual-attention, threat-detection, prefrontal-engagement, default-mode, emotional-processing, social-pattern, salience-tracking, stress-response). An agent with high prefrontal + low emotional weights argues from logic. An agent with high emotional + low prefrontal weights argues from feeling. **The "personality" is not assigned; it's derived from the brain-response fingerprint.** This is more rigorous than character-card-based agent personas common in opinion-dynamics sims.

### 6. *"Can you quantify how accurate your predictions are? Ground your simulation in data. Measure it against something real."*

**Our answer:** Two layers of falsification:

- **Within-subject (demo-day proof, falsifiable):** Same person consumes Content A vs. Content B. The sim predicts brain-response profile for each. We re-run TRIBE V2 inference on the same person's actual response to Content A vs. Content B. Predictions vs. measurements: cosine similarity scored. *This is the same falsification methodology that produced the Clair de Lune 90.4% emotion-center match in Johnny's prior published TRIBE V2 work — falsified against control music (triumphant music, rain — pattern only matches Clair de Lune).*
- **Population-level (production roadmap, sketched):** Argument-effectiveness leaderboard predictions can be A/B tested against real-population opinion shift in deployment. We don't claim to have done this for the hackathon; we claim the architecture supports it.

**This is a load-bearing answer for Listen Labs specifically — their brief explicitly asks "ground it in data; measure against something real."** Within-subject brain contrast is the most rigorous grounding available for opinion-dynamics work. No text-only sim can offer the same.

---

## §1. Define a Problem (per the challenge structure)

### The simulation gap Listen Labs is asking the field to close

Today's opinion-dynamics simulations are **text-grounded**: LLM agents read a prompt, generate text responses, vote, debate, change minds (or claim to). The output is verbal. The mechanism is "what would a plausible person say in response to this argument."

**The failure mode:** verbal acceptance ≠ belief change. The sim cannot distinguish. So the sim cannot answer the question Listen Labs is actually asking — *how do minds REALLY shift?*

Three specific gaps in current society sims:
1. **No ground truth for "did the agent's mind actually shift?"** Sims report verbal change; they cannot measure cognitive change.
2. **No mechanism for personality differentiation beyond character-cards.** "You are a conservative voter" produces stylized agent behavior, not behavior grounded in cognitive variance.
3. **No falsifiability against external signal.** The sim's predictions are evaluated by human reading or by inter-LLM agreement — both are circular.

### Why the user (Maya, the Gen-Z teen) needs this beyond research interest

Maya scrolls Reels. She doesn't see HOW her opinions are being shifted in real time, she doesn't see WHO ELSE is being shifted in the same direction, and she doesn't see WHICH ARGUMENT would flip her on the next topic. She's downstream of opinion-shaping she can't perceive. **The simulation makes her opinion-shift trajectory legible to her — so she can immunize against arguments that would flip her, by knowing in advance what those arguments are.**

This is the inversion: society sims have historically been built FOR researchers studying populations. This sim is built FOR the user being shifted, with population-level data as the audit signal.

### Test prompt that reveals the failure mode in current sims

Ask GPT-5 / Claude Opus / Gemini 2.5 Pro to do the following:

> *"Maya is 17, scrolls Reels 2.5h/day, just consumed [specific political content]. Simulate 100 brain-like-Maya agents debating this content over 5 rounds. Output: opinion-stability metric, which 3 argument types flipped the most agents, which 3 agent-archetypes drove the most others to shift, and the cosine similarity between predicted population-shift and a measured ground truth."*

Today's models produce confabulated narrative. They have no brain-response model. They cannot measure shift. They cannot ground predictions. **The answer they should produce — quantified, decomposed, falsifiable — does not exist as a workflow today.**

---

## §2. Develop a Technique (the architecture)

### SynthDebate-on-Brain pipeline

```
[INPUT]              90s screen-recording of Maya's Reels feed
                     (or any content the user wants to be debated about)
                     Maya's data; her vault; CC BY-NC 4.0 license respected.
                     ← Sideshift consumer-data-agency substrate
   ↓
[BRAIN ENCODING]     TRIBE V2 inference @ 1Hz on fsaverage5 mesh
                     ~20,000-vertex per-second activation predictions
                     for video + audio + (where present) language tracks
                     ← Per-region brain-response fingerprint for THIS user
                       on THIS content
   ↓
[ARCHETYPE DERIVATION]   K2 generates 100 SYNTHETIC AGENT brain-response
                         profiles by sampling from a parameterized
                         distribution centered on Maya's profile but with
                         variance across the 8 region-specialists.
                         ← Each agent has a unique brain-archetype:
                           "agent #34 has Maya's emotional-processing
                            but lower prefrontal-engagement and higher
                            social-pattern weights"
   ↓
[ROUND 1 — INITIAL REACTION]
   100 agents × content exposure → each agent emits initial response
   (response generated by LLM conditioned on agent's brain-archetype)
   ← Per-agent brain-pattern shift logged
   ↓
[ROUND 2 — CROSS-AGENT EXPOSURE]
   Each agent sees 5 randomly sampled OTHER agents' responses.
   Re-emits response.
   ← Per-agent brain-pattern shift re-logged.
   ← Per-agent verbal change vs. brain-pattern change measured.
     Distinguishes "genuine belief shift" from "surface agreement."
   ↓
[ROUND 3 — POPULATION DISTRIBUTION VISIBLE]
   Each agent sees the population-level reaction histogram.
   Identifies swing-position vs. cluster-position.
   ← Influence-asymmetry surfaced: which agent-archetypes
     are at swing-positions; which are at cluster-cores.
   ↓
[ROUND 4 — DEBATE FROM CRYSTALLIZED POSITIONS]
   Agents debate against opposing-cluster agents.
   Per-region brain-pattern shift tracked per round.
   ← Argument-effectiveness ranking emerges:
     which arguments shift which brain-regions in which agent-archetypes.
   ↓
[ROUND 5 — STABILITY METRIC]
   Final brain-pattern profile per agent.
   Compared to Round 1 baseline.
   Population-level opinion-stability metric (0.0 = total shift; 1.0 = no shift).
   ← Final outputs ready for user.
   ↓
[OPUS SYNTHESIS]     Per-content + population report:
                     • Maya's individual brain response (the un-blackbox surface)
                     • 100 brain-archetypes-like-Maya's debate playback
                     • Opinion-stability metric for Maya's archetype
                     • Argument-effectiveness leaderboard
                     • Influence-asymmetry signal: which 3-5 swing-archetypes
                       drove the most shift
                     • THE specific argument that flipped 60% of brains-like-Maya's
                       (so Maya can immunize against it, not so the system can
                        use it on her)
   ↓
[USER SURFACE]       Wrapped 5-card swipe + Land card + SynthDebate replay.
                     Shareable Brain Card export (Sideshift viral mechanic).
                     Maya owns the entire surface; she chooses what to share.
   ↓
[VAULT PERSISTENCE]  Optional: Maya saves the simulation result to her vault.
                     Can re-run on new content. Can compare across content types.
                     Can share specific simulation with friends (organic
                     population growth — friends become real peer-archetypes).
                     ← Sideshift personal-data-vault made literal.
```

### Why this technique is the right answer to Listen Labs's prompt

**The prompt asks for "simulation of humans or societies."** Most teams will build text-grounded LLM-agent sims. We build a brain-grounded sim:

| Dimension | Text-grounded sim (default approach) | SynthDebate-on-Brain (ours) |
|---|---|---|
| **Agent personality** | Character-card prompt ("you are a conservative voter") | Derived from brain-response fingerprint across 8 region-specialists |
| **Belief change measurement** | Verbal self-report by the agent | Within-agent brain-pattern shift across rounds |
| **Distinguishing genuine vs. surface shift** | Cannot — both look like text changes | Verbal change WITH brain-pattern change = genuine; verbal change WITHOUT brain-pattern change = surface |
| **Argument effectiveness ranking** | Based on agent self-report or inter-LLM agreement | Based on which brain-region specialists swung in which agent-archetypes |
| **Influence asymmetry** | Often not modeled; if modeled, by network position | Cognitive-position based — which archetype's argument resonates with the largest cluster of other archetypes |
| **Falsifiability** | Circular (LLM evaluates LLM) | Within-subject brain contrast (same person, different inputs); measurable cosine similarity to TRIBE V2 ground truth |
| **Why K2 is structurally required** | Could run on Claude (smaller scale) | 100 agents × 5 rounds × ~200 tokens = 100K tokens per simulation; only K2 (~1,300 tok/s) fits within consumer-product latency budget |

**The technique honors the brief's asked-for grounding.** Listen Labs explicitly says: *"We care about the insight, not the stack."* Our insight: **brain-grounding makes the simulation falsifiable in a way text-grounding cannot.** That's the structural answer to "ground it in data."

### Why the Sideshift vault matters as substrate

The vault is not a separate product. The vault is the **container** that makes the simulation exist legitimately:
- The user owns their data → they can choose to run a simulation on it
- The user owns the result → they can choose to share, propagate, or delete
- The system never harvests, never sells, never persists beyond session unless user chooses
- Adaptation 2 Brain Card export is the Sideshift consumer surface: *"My brain-archetype this week. 100 brains-like-mine debated this content. The argument that flipped 60%."*

Without the vault frame, the simulation reads as researcher-extraction. With it, the simulation is the user's tool. **The vault is the consumer-product chassis on which the Listen Labs-shaped engine ships.**

### Forbidden-claim guardrails (same as Ironside; non-negotiable)

- ❌ No reverse inference (use observational language: *"agent #34's prefrontal-engagement specialist scored low after Round 3"* not *"agent #34 felt confused"*)
- ❌ No clinical claims — *"opinion-dynamics simulation, not psychological evaluation"*
- ❌ Within-subject contrast only — *"Maya's brain on her feed vs. Maya's brain on something else"* — never population-norm comparison
- ❌ ~20K vertices on fsaverage5; 1Hz; 5s HRF lag; no inflated TRIBE numbers
- ❌ The 100 agents are **synthetic**. Never claim they represent real users. *"100 brain-archetypes-like-Maya's"* not *"100 actual people like Maya."*
- ❌ The argument-flips-60% number is a model prediction. Frame as *"the model predicts X% would shift; production deployment would A/B-test this against real population"* — never claim the prediction is the measurement.

---

## §3. Showcase the Impact

### The 90-second on-stage demo (Listen Labs pavilion variant)

Same 5-beat structure as the locked demo, with BEAT-4 extended to land the SynthDebate explicitly:

| Beat | Time | What plays | Where Listen Labs's prompt lands |
|---|---|---|---|
| **BEAT-1** | 0:00–0:15 | Maya's Reels feed split-screen with cortical mesh glowing (live or pre-cached MP4) | Setup: this is the user; this is her brain on the content. |
| **BEAT-2** | 0:15–0:45 | Region-specialist labels appear; hover-bridges show cross-region cross-talk; reasoning fragments flow | Sets up the per-region brain-archetype concept that drives SynthDebate Round 1. |
| **BEAT-3** | 0:45–1:15 | Within-subject toggle: same brain, different input → completely different pattern | **Falsification methodology lands. This is the answer to "ground it in data."** Same logic as Clair de Lune falsified against control music. |
| **BEAT-4** | 1:15–1:30 | 5 Wrapped cards swipe → Card 5 Land card → click grayed region → suggestion card with content **formats** (no recommendations) | Empowerment surface; no-recommendation positioning. |
| **BEAT-4 ext** | +10–15s | **SYNTHDEBATE-ON-BRAIN replay** — 10×10 grid of stylized brain-icons; round-by-round debate animation; opinion-stability metric crystallizes; *"the argument that flipped 60% of brains-like-yours: [argument text]"* | **THIS is where Listen Labs's prompt lands explicitly. The 5 prompt questions are answered visually in 10-15 seconds.** |
| **BEAT-5** | off-timer | Listen Labs swap-slide (see §4) | Sponsor close. |

### Why the demo executes within the 90s budget (production discipline)

Honoring the live-with-pre-cache fallback per locked product discipline:

- **BEAT-4 ext SynthDebate** runs from pre-cached output for the demo input (Saturday 8 AM bake; Jacob owns)
- Stylized 10×10 brain-icon grid renders as 2D overlay (NOT another 3D scene), using same Three.js scene as cortical mesh
- Round-by-round animation is choreographed (not live-rendered) — agents change color based on pre-computed shift trajectory
- Opinion-stability metric + flipping-argument text are pre-rendered Opus synthesis output

**Live K2 100-agent run** is the production-roadmap claim, not the demo claim. Demo claim: *"this is the architecture; here's the pre-computed run; in production it runs live in 8 seconds at K2 speed."*

### The Listen Labs swap-slide (final BEAT-5 Listen Labs variant)

> *"You build simulations of humans and societies. Most teams answer your brief with text-grounded LLM-agent sims — agents talk, agents vote, agents 'change minds.' We grounded the simulation in real brain-response data. 100 synthetic agents whose brain-response profiles match the user's archetype, war-gaming opinion dynamics on the content the user just consumed. Round-by-round, we measure not just verbal change but brain-pattern shift — distinguishing genuine belief change from surface agreement. We rank arguments by which brain-region specialists they swing. We surface influence-asymmetry by cognitive position, not asserted hierarchy. We falsify the engine using the same within-subject brain-contrast methodology that produced our 90.4% Clair de Lune match in prior published work. The user — Maya, the Gen-Z teen whose feed gave us the input — sees the simulation in her own data vault. She owns the surface. She uses the result to immunize against arguments that would flip her, not so the system can use them on her. Brain-grounded society simulation as a consumer surface. Brain-grounded falsifiability as scientific rigor. Same engine that scans Gen-Z brains responding to Reels. Different output layer. Same architecture."*

---

## §4. Single-paragraph Listen-Labs-prompt-direct elevator pitch (Johnny voice — locked vocabulary)

> *"Listen Labs asked: simulate humans or societies. Model how people think, argue, change their minds, and influence each other. Most answers will be text-grounded LLM-agent sims that report verbal change. We built brain-grounded society simulation. Maya scrolls Reels. **Brainrot** is what's happening to her brain in real time — algorithmic neural convergence she can't see. We use Meta's TRIBE V2 — same model that matched Clair de Lune's neural fingerprint to 90.4% in our prior work — to derive her brain-response profile from her actual feed. That per-second per-region brain-response prediction IS the **data layer** her platforms never give her. K2 generates 100 synthetic agents whose brain-response profiles match her archetype. Five rounds of debate. Per-round, we measure not just what each agent SAID but how each agent's brain-response pattern SHIFTED. Genuine belief change has a brain-signature. Surface agreement does not. We can tell them apart. Argument-effectiveness gets ranked by which brain-region specialists each argument swung — logic shifted prefrontal, emotion shifted limbic, social proof shifted social-pattern. Influence-asymmetry surfaces from cognitive position, not asserted hierarchy. Then we hand Maya the **algorithm breaking out argument** — the specific argument that would flip 60% of brains-like-hers — so she can immunize against it, not so the system uses it on her. The simulation is falsifiable: same person, different inputs, predicted brain-response vs. measured — the same within-subject contrast methodology that falsified our Clair de Lune work against triumphant music and rain. The whole thing lives in Maya's personal data vault. She owns the simulation. We don't recommend behavior. We surface brainrot + the algorithm breaking out argument. She judges. **Same engine that adds the data layer to construction-worker egocentric footage in our other demo scenario — different input, same architecture.** We're not modeling how text-agents argue. We're modeling how brains-like-yours actually shift — and proving it with a measurable signal you can falsify."*

---

## §5. Why Listen Labs should care, in their own brief's terms

| Listen Labs evaluation criterion | What we deliver |
|---|---|
| *Compelling and creative simulation of human behavior* | Brain-grounded agent personalities; per-region specialists drive interaction style; round-by-round measurable shift |
| *Insight, not stack* | Insight: **brain-grounding distinguishes genuine belief change from surface agreement**. No text-only sim can do this. |
| *Quantify accuracy; ground in data; measure against something real* | Within-subject brain contrast (same person, different inputs) — predictions vs. TRIBE V2 ground truth — cosine similarity. Same methodology as Johnny's published 90.4% Clair de Lune match. Production roadmap: A/B against real-population opinion shift. |
| *Model how people argue, change minds, influence each other* | Round-by-round per-agent brain-pattern shift + argument-effectiveness leaderboard + influence-asymmetry detection — all grounded in measurable signal, not LLM self-report |
| *Career opportunity at Listen Labs (Stanford/Caltech/UC Berkeley/Harvard/UPenn alumni; serial entrepreneurs; small team big ambition)* | Junsoo's PhD-relevant brain-encoding pipeline work + Johnny's published TRIBE V2 corpus + Jacob's K2 swarm production-pattern experience map directly to "high-ownership roles defining how we build, ship, and scale from zero to one" |

---

## §6. Hackathon-execution risks specific to this build

| Risk | Mitigation |
|---|---|
| **SynthDebate scope** (4-5h estimate within 6-13h headroom) | Default-included per Open Item #9; flagged for Johnny override. Cut-line if other items overrun: keep BEAT-4 ext as architecture description only + pre-cached MP4 of one example simulation. |
| **100-agent grid rendering** | 2D overlay above cortical mesh, NOT another 3D scene. Stylized brain-icons (10×10 grid). Pre-cache fallback: pre-rendered MP4 of 5-round debate. |
| **Listen Labs scientific-rigor scrutiny — they explicitly evaluate "ground in data; measure against something real"** | Lead with the within-subject falsification methodology in the swap-slide. Cite the Clair de Lune precedent as proof we know how to falsify. Be honest: production-population A/B is roadmap, not demo claim. |
| **"How do you ACTUALLY know agents shifted brain-patterns?"** (the load-bearing scrutiny question) | Honest answer: TRIBE V2 inference on each agent's response text + brain-archetype context produces a predicted brain-response profile. We compare profile-pre to profile-post. **This is a model prediction, not a measurement on a real fMRI.** Frame transparently: *"The agents are synthetic; their brain-response profiles are TRIBE V2 predictions; the shift we measure is the prediction's evolution under the simulated debate. Production validation requires real-population fMRI, which is the research roadmap."* |
| **Listen Labs may push: "is this just an agent sim with brain-encoding bolted on?"** | Honest answer: *"The brain-encoding IS the differentiator — text-only sims cannot distinguish surface from genuine shift; we can. The 'bolt-on' framing misses that the brain-grounding changes what the simulation can MEASURE, not just what it can REPORT."* |
| **The "argument that would flip 60%" output reads as social-engineering enablement** | Frame inverse: *"We show the user the lever someone could pull on them — so they can immunize. Manipulation only works in the dark. We hand the user the manipulation playbook so they can recognize it when it arrives."* This is YEA-side per the locked YEA/NAY rubric: surface options + user judges + not optimizing for engagement. |
| **Two sponsor closes from one demo (Listen Labs + Sideshift) might muddy** | The Listen Labs swap-slide leads. Sideshift is implicitly satisfied via the vault frame (the user owns the simulation result). At Sideshift pavilion, swap to the Sideshift-leading variant. At Listen Labs pavilion, this Listen Labs-leading variant is the primary close. |

---

## §7. Cross-references

- Listen Labs challenge brief (provided by Listen Labs at HackTech 2026): *"Build a simulation of humans or societies. Model how people think, argue, change their minds, and influence each other."*
- `caltech/prd-final.md` §6 Listen Labs swap-slide
- `_bmad-output/planning-artifacts/prd.md` §Layer 8 SynthDebate-on-Brain + §FR13 + §Innovation #4
- `caltech/validation-findings/2026-04-25-capability-inventory-summary.md` — SynthDebate-on-Brain rationale (the recommended adaptation pick)
- `caltech/research-context/007-johnny-public-corpus-tribe-posts.md` — Clair de Lune 90.4% precedent (the credibility chip we cite as falsification methodology proof)
- `research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md` — TRIBE V2 corrected facts (~20K vertices / ~25 subjects / 1Hz / 5s HRF)
- `research/wiki/decisions/006-tribe-v2-as-special-mode.md` + `007-agent-swarms-as-coordination-pattern.md` (architectural anchors)
- `caltech/use-cases/ironside.md` (companion: same engine, different sponsor)

**Net: zero new locks needed.** This document reframes the existing SynthDebate-on-Brain layer (already locked as Adaptation 2 + SynthDebate per Open Item #9) as the direct response to Listen Labs's "Simulate Humanity" challenge brief. It leads with their prompt; answers each of their 6 questions structurally; uses Sideshift only as substrate (the vault that holds the simulation), not as competing positioning.

---

## §8. Open questions for Johnny

1. **Does this lead with Listen Labs strongly enough that Sideshift recedes to "substrate" without being lost?** The doc currently treats Sideshift as the chassis (the vault) and Listen Labs as the engine (the simulation). Tradeoff: Sideshift gets the vault-positioning but loses standalone-product framing. Worth confirming this is the right hierarchy.

2. **Is the "argument that flips 60%" output framed strongly enough as immunization-not-weapon?** Listen Labs's brief invites both readings; Best-Use-of-AI YEA rubric requires the immunization framing. Test: read the elevator pitch §4 aloud; does the immunization angle land?

3. **Do we explicitly cite "we don't have real-population validation; this is architecture proof + within-subject falsification"?** Listen Labs's brief emphasizes scientific rigor. Honest framing protects us; over-claiming would tank the pitch. Currently §6 mitigations name this transparently. Worth keeping in the FAQ ammunition deck.

4. **Is the 10-15s BEAT-4 ext addition worth the engineering cost vs. demo flow risk?** Without it, Listen Labs gets architecture description only. With it, Listen Labs gets the visual surface their brief is asking for. SynthDebate is currently default-included per Open Item #9; this doc reinforces that decision. Confirm or cut.

5. **Does the Listen Labs alumni-network appeal in §5 (last row) read as appropriate or sycophantic?** Their About-Listen blurb mentions Stanford/Caltech/UC Berkeley/Harvard/UPenn alumni + Sequoia-backed startups + IOI/ICPC backgrounds + culture of craft. Junsoo + Johnny + Jacob's profiles map to that. Worth surfacing for the Listen Labs interview-prize pitch, but should NOT lead the technical pitch.

**Pick the ones to address; surface tensions I missed.**
