---
title: "PRFAQ: Caltech HackTech 2026 — un-blackbox the algorithm's reach into your thinking"
status: drafting
created: 2026-04-25
updated: 2026-04-25
stage: 2-press-release
project_name: caltech-hacktech-2026
inputs:
  - caltech/yaps/2026-04-25-prfaq-canvas/00-raw-yap.md
  - caltech/yaps/2026-04-25-prfaq-canvas/01-high-signal-extracts.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/README.md
  - research/wiki/decisions/README.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md
  - caltech/CONSOLIDATION-REPORT.md
socratic_protocol: ENFORCED — Decision 004. Claude reflects, surfaces, sharpens. Johnny names.
---

# {Headline — TBD, Stage 2}

## {Subheadline — TBD, Stage 2}

**Pasadena, CA — 2026-04-26** — {Opening — TBD, Stage 2}

---

## Locked from Stage 1 (Ignition)

### Customer (the one human the press release narrates)

**The Gen-Z teen / typical AI-native who has never had a reference frame for anything other than the algorithm shaping their own opinions.**

- They were raised on the algorithm. They have no "before."
- Their thoughts converge with the feed and they cannot tell which thoughts are theirs.
- They are the demo audience for the entire pitch — every sponsor close lands on this human first.

### Problem

Algorithms have flattened how everyone's neurons fire. Everyone's thoughts converge along the paths the recommender shaped, and they will never be able to deviate from those converging paths because they don't know the convergence is happening.

### Stakes

- Loss of human autonomy at the cognitive level — the user can't see their own thinking, so they can't tell which thoughts are theirs vs. converged from the feed.
- Convergence of society — when everyone's neurons fire the same way, true creativity (which requires divergence) collapses.
- Generation-scale: the demo persona has *no reference frame* outside the algorithm; this isn't "people who used to think for themselves." This is people who never got the chance.

### Solution concept (the architecture, named verbatim by Johnny)

**Input — locked (2026-04-25 turn):** *Screen recording of the user scrolling their own Instagram Reels / TikTok feed.* TRIBE V2 streams per-time-step (1Hz) brain-activation predictions across the session. The convergence of their feed becomes a measurable, visible pattern.

Video stream → **TRIBE V2** per-time-step per-region brain-activation JSON → **K2 swarm** splits into N agents, each tied 1:1 to a brain region (each agent IS a specialist for that brain part) → **cross-region communication** (agents talk to each other; the cross-talk is the "sauce" — locked 2026-04-25) → per-region + cross-region semantic inference → **aggregation** into "how the brain would have inferred it" → **Visualization:** 3D brain in space + 3D knowledge graph in space *mapped to brain regions* (two layers, NOT painted on cortex) + clickable specialist-reasoning tree per region.

### Output shape — LOCKED (2026-04-25 turn) — "Spotify Wrapped of Your Brain"

**Hero artifact:** a Spotify-Wrapped-style personalized data narrative of what the user's brain did during their feed scroll. Card-by-card, swipeable, shareable, designed for social-share export. Reference pattern: `caltech/research-context/004-spotify-wrapped-as-format.md`.

**Cards Johnny named (provisional list):**
- **Top brain regions** ranked (analog: top artist) — which regions fired most across your scroll
- **Top content categories** ranked (analog: top genre) — what subjects you converged on, *truthfully* — *"you can't lie about what you consume anymore"*
- **Age-cohort comparison** (analog: *"my age group was 81 or something"*) — your brain-fire pattern vs. your generation's
- **The Land card — the inverted-brain-search mechanic:** click on a *grayed-out* brain region (one your scroll didn't activate). The system suggests content that would activate it. **NOT a recommendation engine** — the explicit positioning is *"we don't want to recommend anything to you because that's how the algorithm works."* It surfaces the option; the user chooses.

### Positioning statement — LOCKED (Johnny verbatim, 2026-04-25)

> *"We don't want to recommend anything to you because that's how the algorithm works. We want to give you accessible information using AI so that you can make good judgments."*

This is the architectural answer to T2 (the Auditor's external referent). The Auditor isn't grounded in another AI's prediction of what's good — it's grounded in **the user's own brain-fire pattern** as the external signal. The system *informs* the user about their own consumption; the user makes the judgment. Differentiates structurally from Filter World ("with extra steps") because there's no closed-loop optimization for engagement.

### Headline phrase — SEED LOCKED 2026-04-25 (final polish deferred to end)

**Headline-direction lock (Johnny verbatim):**
> *"You can't see how the algorithm shapes your thinking. We made it visible."*

This is the **direction** locked, not the final wording. Johnny noted: *"I don't know — something stronger than that, but for now I think that's the general idea of what we are going for."* Final headline draft is **deferred to the end of PRD assembly** — once end-to-end is mapped, the strongest single sentence will be picked from a polished candidate set.

**Candidate set seeded from Johnny's published corpus** (refine at end):
- *"You can't see how the algorithm shapes your thinking. We made it visible."* (current direction lock)
- *"Manipulation only works in the dark. What happens to the internet when the lights come on?"* (Johnny published)
- *"The ingredients list for what's eating your generation's brain."* (Johnny "ingredients list" frame)
- *"Becoming will be more entertaining than consuming — once you can see what's been eating you."* (Johnny "becoming > consuming" thesis)

**Doctrine for headline finalization:** *"Draft everything at the very end. For now we just want to figure out end-to-end so we can create the PRD end-to-end."* Press release wording, FAQ wording, sponsor close wording — all polished at the end, against the locked end-to-end skeleton.

### The "two directions of TRIBE" framing — LOCKED

Both directions are real and demonstrable:
- **Forward:** TRIBE generates content targeting a specific brain pattern. Johnny's Clair de Lune work proved this — 90.4% emotion-center match across 20,484 cortical vertices. *"Synthetic synesthesia."*
- **Reverse:** TRIBE reads incoming content and surfaces what it's designed to do to your brain. *Amygdala activation, prefrontal suppression, emotional hijacking signatures, before you click play.*

**The hackathon product is the reverse direction made consumer-grade.** The forward direction is the FAQ ammunition (*"yes, this could be weaponized; we built the inverse first because manipulation only works in the dark"*).

### The Clair de Lune precedent — LOCKED demo asset

The Clair de Lune story is the team's strongest standalone evidence:
- 60s of music → 20,484-vertex brain fingerprint
- 8 rounds of Claude-generated paragraphs scored by weighted cosine across emotional networks
- 90.4% match in emotion center — paragraph that produces *Clair de Lune's brain shape* with no music in it
- Falsified against triumphant music, rain, aggressive speech — pattern only matches Clair de Lune

This is shipped, dated, public, demonstrable. **Use as the demo's "credibility chip"** — the moment in the pitch where the founder shows a prior result that proves the whole approach works at brain-encoding fidelity. Not the demo itself; the *proof the demo's claims are not vapor.*

### Educational reframe — LOCKED

The product educates the user about their own neuroscience in service of fighting cognitive convergence. Per Johnny: *"trying to educate people with their neuroscience because the problem was that everyone's just a copy of each other and the algorithm feeds them what they want to feed."* Educational without lecturing — same shape as Spotify Wrapped (cute graphics, factual data, light gamification).

---

## DEMO-BEAT SKELETON — locked structural slots

> **Convention.** Every locked idea is tagged with which beat it belongs to. When something locks, the slot it fills must be named. Ideas can be swapped within a slot but not without one. The skeleton has fixed in/out contracts; the contents are interchangeable.

```
[BEAT-0  PRE-DEMO]      ← Sponsor close swap-in (1-2 slides change per sponsor)
[BEAT-1  HOOK]          (0-15s)   Recognition  → familiar surface, no explanation
[BEAT-2  BODY]          (15-45s)  Surprise     → expectation violation set up
[BEAT-3  SURPRISE]      (45-75s)  Awe + Hope   → reasoning made visible
[BEAT-4  LAND / HERO]   (75-90s)  Pride + Comfort → user-as-protagonist transformation
[BEAT-5  CLOSE]         (slides)  Sponsor-specific tagline + ask
```

### Locked content → beat mapping (current state)

| Lock | Beat | Notes |
|---|---|---|
| Customer = Gen-Z AI-native teen | BEAT-1 | The face / voice the Hook narrates |
| Demo input = Reels/TikTok feed screen recording | BEAT-1 | Familiar surface (the kill — §3.2) |
| 10s live brain activity during scroll | BEAT-1 → BEAT-2 transition | Awe via vastness (§2.1 / §3.3 wow object) — render at native fsaverage5 fidelity |
| TRIBE V2 per-second activation stream | BEAT-2 (engine) | Continuous; powers BEAT-2 onward |
| K2 swarm of brain-region specialists w/ cross-region comm | BEAT-2 / BEAT-3 (engine) | Specialists fire in BEAT-2; tree visible by BEAT-3 |
| Knowledge graph mapped to brain (3D layered) + clickable specialist tree | BEAT-3 | Reasoning made visible — §3.6 witnessed dissent shape |
| Spotify Wrapped card-by-card replay | BEAT-3 → BEAT-4 | Cards 1–4 in BEAT-3 (top region / top category / age-cohort / brain map summary) |
| **Inverted-brain-search card (click grayed-out region)** | **BEAT-4 — HERO** | **Climaxes here.** §3.1 toggle (surprise) + §3.7 mirror + Promised Land tease (§3.10). Demo lands on this single gesture. |
| Positioning statement *"give info, don't recommend"* | BEAT-4 voiceover | The line spoken when user hits the hero gesture |
| Sideshift consumer close — share-the-card | BEAT-5 | "this is your brain on the algorithm — share it with your friends, see theirs" |
| Listen Labs close — convergence of society | BEAT-5 | "your brain-pattern = your generation's brain-pattern; here's what we're all converging on" |
| Ironside close — same product, construction-worker video input | BEAT-5 | "now imagine this on egocentric construction footage instead of Reels" |
| K2 close | n/a (covered by core) | Speed enables BEAT-2 / BEAT-3 swarm fan-out |
| Best Use of AI | n/a (universal wrapper) | Whole skeleton IS the answer |

### Open beat-slots (need content)

- **BEAT-1 closing line** — the spoken sentence transitioning Hook → Body. The thing the demo voice says as the brain pattern starts firing on screen.
- **BEAT-2 expectation prediction** — what the judge is implicitly predicting in BEAT-2 that BEAT-3 will violate. Without this, the surprise has nothing to break.
- **BEAT-4 user voice** — the user-as-protagonist quote. A 17-year-old's actual voice (real or composite). Per Donald Miller (StoryBrand): customer is hero, not the team.
- **BEAT-5 sponsor close lines** — the actual one-sentence pitch line for each sponsor (Sideshift / Listen Labs / Ironside). Currently held as seeds, not polished.

### I/O contracts implied by the skeleton

| Beat | INPUT | OUTPUT |
|---|---|---|
| BEAT-1 | screen-recording video file | live cortical-mesh render (fsaverage5) playing alongside |
| BEAT-2 | TRIBE per-second activations | swarm fan-out invocations to K2 |
| BEAT-3 | swarm specialist outputs + cross-region edges | knowledge graph mapped to brain + clickable tree |
| BEAT-4 | aggregate brain-fire pattern + grayed-out region click | inverted-brain content suggestion (Q-J6 implementation TBD) |
| BEAT-5 | locked Wrapped cards + persona-specific close line | static slide swap |

These are the per-person silo boundaries Johnny names: clean in/out per beat, integration is plumbing.

### LOCKED 2026-04-25 — additional mechanics

**Live-vs-precache strategy — LOCKED:** *"Try the lives for now."* Default = live TRIBE inference + live K2 swarm during demo. **Mandatory fallback: pre-recorded full-pipeline run** prepared by Saturday morning, ready to swap in if anything stutters at the demo table. Per Winston's pre-mortem: this is the only acceptable risk profile for this stack.

**Hover-bridge connection mechanic — LOCKED (BEAT-3 visualization):** the cross-region swarm communication renders as **bridges/edges between brain regions**. Bridges are **grayed out by default** to avoid visual mess. On hover (or focus within a radius), bridges within scope **light up** — *the swarm's responsiveness becomes visible only on user gesture.* This is the focus mechanic that:
- solves the visual-mess problem Johnny named
- gives the judge an interactive way to *experience* the cross-region cross-talk
- maps directly to Victor's required "swarm-responding-to-brain" causality moment
- maps to §3.6 witnessed-dissent mechanic (visible argument)

**Pitch-vs-product doctrine — LOCKED 2026-04-25 (Johnny verbatim):**

> *"The blockage here should only be for the sake of pitching it and not for the actual idea of the product. Because this is a hackathon we are trying to sell them a vision and a story and a concept and show them that our way of doing it is the best way possible to do it... we don't need to put in the full entire product thing. It's almost like a small snippet representation of how we process the data, how we can visualise it and what benefit it can now have."*

**What this means operationally:**
- Validation findings that block the PRODUCT are NOT blockers. We're not shipping a product; we're shipping a vision.
- Validation findings that block the PITCH (the story, the demo arc, the snippet that proves the concept) ARE blockers. Resolve those.
- "Research-backed" is the framing tier we operate at. Cite snippets where they exist; don't make exhaustive scientific claims; *speak* with the authority of someone who has read the relevant research, not the rigor of someone publishing it.
- The demo is a **snippet representation** — one small slice of the product running end-to-end, well enough that the judge believes the rest exists.
- The output of this pane: a *story + demo scenarios* polished hard. From those, the team produces video + pitch decks + pitch-tag variants. The product implementation slots into the demo's box-shape.

**Input-source-as-persona-switch — LOCKED:** the same product runs different input sources per persona/sponsor close.

| Sponsor | Input source | Persona |
|---|---|---|
| Listen Labs / Sideshift (B2C) | Reels/TikTok feed screen recording | Gen-Z AI-native teen |
| Ironside (B2B) | Egocentric construction-worker video | Construction-site operator |
| (other) | swappable as long as TRIBE accepts the modality | swappable |

The product's identity is *brain-encoding + swarm + Wrapped output* — the input is the persona switch. One product, multiple demos.

The metaphor Johnny chose for stage:

> *"reconstructing how a thought travels across your brain"*

The transformation Johnny named:

> *"return human autonomy with the ability to see your thoughts"*

### Concept type

Commercial product, B2C-primary with B2B-overlay (Decision 010). Hackathon demo is the proof. Press release is written as if shipped.

### One spine, three swappable closes (Stage 4 / pitch-deck shape)

| Sponsor track | Persona content | Close-line seed (Johnny verbatim) |
|---|---|---|
| **Listen Labs** (primary frame) | Gen-Z teen raised on the algorithm — generational thought convergence | *"true creativity of mankind requires people to be aware of what's going on so they can branch out"* |
| **Ironside** (B2B overlay) | Construction-worker egocentric video → classify more points → useful to Ironside's pipeline | *"we gave your machine the ability to feel emotions and process the video"* — brain encoding as the 2nd modality their pixel-only pipeline lacks |
| **Sideshift** (consumer angle) | Spotify Wrapped of Your Brain as the shareable B2C artifact (folded BeReal thesis into Wrapped frame; see `research-context/005-bereal-as-anti-curation-pattern.md`) | *"un-fck your brain" — see your brain on the algorithm, share the card, branch out by clicking grayed-out regions* |
| **K2** | Covered by core architecture (swarm fan-out IS the demo, not decorative) | n/a |
| **Best Use of AI** | Universal wrapper — the core thesis ("show what every part of the thinking is doing") IS the track answer | n/a |

---

## Stage 2 — The Press Release (in progress)

*Working backwards: write the press release for the day this thing ships, before building it.*

[To be filled in Stage 2 turn-by-turn.]

---

## Stage 3 — Customer FAQ

*[Pending Stage 3.]*

---

## Stage 4 — Internal FAQ

*[Pending Stage 4.]*

---

## Stage 5 — The Verdict

*[Pending Stage 5.]*

---

<!-- coaching-notes-stage-1 -->

**Concept type & rationale:** Commercial product (B2C-primary + B2B-overlay per Decision 010). Hackathon demo as the proof artifact, but the press release written as if shipped. FAQ stages will adapt: not "first 100 customers" but "who picks this up first and why is the transformation real for them." Multi-track sponsor strategy means the FAQ has to survive being read by Listen Labs *and* Ironside *and* Sideshift judges with the same core but different framing.

**Initial assumptions challenged in Stage 1:**

- *"The current generation"* (theme-level) was redirected to a specific persona. Johnny named: Gen-Z teen / AI-native with no reference frame outside the algorithm.
- The customer is **not** *"creators"* (option A) — Johnny rejected that framing despite TRIBE being clean for it. Reason: the broader Gen-Z framing covers more sponsor closes and is the honest story for Listen Labs.
- The customer is **not** *"junior devs"* (option C). Reason: comprehension-debt frame is too narrow for the multi-track strategy.

**Why this direction over alternatives:**

- B over A (creator-only): Listen Labs sponsor close requires *generational social phenomenon*; "creator vs algorithm" is too small a slice to be a "convergence of society" story.
- B over D (decision-makers): Sideshift angle ("BeReal vs the algorithm") demands a consumer-recognizable user; the strategic-judgment user doesn't carry the BeReal hook.

**Subagent findings shaping the framing (Phase 0):**

- T2 (Auditor's external referent) is unresolved — TRIBE predicts corpus-mean BOLD response; if the corpus was shaped by the algorithm, the brain-grounding inherits the bias. **This is the hardest FAQ question and will be the load-bearing internal-FAQ entry.**
- Renaissance Research lookalike (won this exact prize last year with N=3 LLM debate triad). Differentiation visible in 10 seconds is required.
- TRIBE numbers we say on stage: ~20K cortical-surface vertices, ~25 deeply-scanned subjects (T1 — NEVER use marketing 70K/700).
- Reverse inference is forbidden — never claim "brain region X = emotion Y."
- Listen Labs requires a *specific* social phenomenon (not vague "society sim"). The Gen-Z generational-thought-convergence frame qualifies if and only if the demo demonstrably visualizes convergence as a measurable thing.

**User context that doesn't fit the PRFAQ itself:**

- Johnny's standing instruction: Socratic protocol enforced (Decision 004). Claude does not propose; reflects and stress-tests.
- Team lanes: Johnny = innovation + visualization + 3-parallel-Claude orchestration; Jacob = K2 swarm; Junsoo = TRIBE pipeline; Emilie = packaging + storytelling research.
- 12hr × 4 people = 48 person-hours total budget. Feature freeze Saturday 8 PM PDT. Submit Saturday 11 PM.
- "Other personas to expand for development" was named by Johnny as out-of-scope for hackathon — converge to the Gen-Z teen for demo, hold others as post-hackathon expansion.

<!-- /coaching-notes-stage-1 -->
