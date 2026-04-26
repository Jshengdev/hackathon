---
title: "PRD — Caltech HackTech 2026 — un-blackbox the algorithm's reach into your thinking"
status: draft v1 (validation pending — double-pass party-mode + advanced-elicitation queued)
created: 2026-04-25
updated: 2026-04-25
project_name: caltech-hacktech-2026
target_track: Best Use of AI (hard target) + Creativity + Listen Labs + Ironside + Sideshift
build_budget: 12 hours × 4 people = 48 person-hours
freeze: Saturday 2026-04-26 8 PM PDT
submit: Saturday 2026-04-26 11 PM PDT (10h buffer before Sunday 9 AM hard deadline)
authoritative_for: end-to-end project specification — story + architecture + I/O contracts + sponsor strategy
cross-links:
  - ./prfaq.md
  - ./demo-script.md
  - ./tasks-by-person/
  - ./validation-findings/
  - ./research-context/
  - ../research/wiki/decisions/
inputs:
  - ../research/wiki/themes/ai-paradox-invisible-use-cases/README.md
  - ../research/wiki/decisions/README.md
  - ../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md
  - ../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md
  - ./yaps/2026-04-25-prfaq-canvas/
  - ./context/team/
  - ./research-context/007-johnny-public-corpus-tribe-posts.md
---

# PRD — un-blackbox the algorithm's reach into your thinking

## 0. The 5 sentences a builder must keep visible while reading

Per Johnny verbatim doctrine — these are non-negotiables. Every section laddered to them.

1. **The transformation:** *"Return human autonomy with the ability to see your thoughts."*
2. **The persona:** Gen-Z teen who has never had a reference frame outside the algorithm. Every screenshot, every card, every voiceover is narrated *to* this human.
3. **The hero mechanic:** The Inverted-Brain-Search Land card (click grayed-out region → content **options** that would activate it, NOT recommendations) is BEAT-4, the demo's center of gravity.
4. **Headline direction (final wording deferred):** *"You can't see how the algorithm shapes your thinking. We made it visible."*
5. **The demo is 90 seconds, not the product:** A *snippet representation* — one slice running end-to-end, well enough that judges believe the rest exists. Pre-cache hard parts. Don't describe a production system; describe what the judge **sees and hears** in 90 seconds.

## 0a. Doctrines (lock — must honor)

| Doctrine | Source | Bind |
|---|---|---|
| **Socratic protocol** | Decision 004 + Johnny verbatim | Claude reflects, never proposes. Johnny names; team executes. |
| **Pitch-vs-product** | Johnny verbatim 2026-04-25 | Validation findings that block the *story* are blockers; findings that block the *full product* are parked. |
| **Smallest possible circle** | Johnny published corpus | Ruthless minimum-viable unit of shipment. The 90s demo IS the smallest possible circle. |
| **No recommendation** | Johnny verbatim | The product surfaces options, doesn't recommend. *"That's how the algorithm works."* The user makes the judgment. |
| **Demo-over-execution** | Decision 011 | Visualization > engineering depth. If full product takes a month, 90s of narrative clarity wins. |
| **Draft everything at the very end** | Johnny verbatim 2026-04-25 | Press-release wording, FAQ wording, sponsor closes, headline — all polished after skeleton is locked. |

---

## 1. Customer / Persona — locked

### Who

**Gen-Z AI-native teen.** Born ~2008-2010, raised on the algorithm. Has never had a reference frame outside it. Their thoughts converge with their feed and they cannot tell which thoughts are theirs.

### The three-layer problem (StoryBrand)

| Layer | Specification |
|---|---|
| **External** | They scroll their feed. The recommender shapes what they see. |
| **Internal** | *"If a headline is engineered to make you angry, the only way to know is to notice your own reaction after it already got you."* (Johnny's own published phrasing — already in the 17-year-old felt-friction voice.) |
| **Philosophical** | A generation never got the chance to develop autonomy at the cognitive level. The convergence of how a generation thinks IS the convergence of culture. |

### Why this persona over alternatives

Per `validation-findings/2026-04-25-team-gap-fillers.md` Johnny rejected three other personas:
- ❌ Creator-only (too narrow for Listen Labs sponsor close)
- ❌ Junior dev (comprehension-debt frame too narrow for multi-track strategy)
- ❌ Strategic decision-maker (no BeReal/Sideshift hook)

Gen-Z teen wins because: covers most sponsor closes, is the honest story for Listen Labs (generational social phenomenon), and supports the BeReal-style consumer hook for Sideshift.

---

## 2. Problem / Stakes — locked

### Problem

> *"Algorithms have flattened how everyone's neurons fire. Everyone's thoughts converge along paths the recommender shaped, and they will never be able to deviate from those converging paths because they don't know the convergence is happening."* (Johnny verbatim)

### Stakes

- **Cognitive autonomy loss** — the user can't see their own thinking, so they can't tell which thoughts are theirs vs. converged from the feed
- **Convergence of society** — when everyone's neurons fire the same way, true creativity (which requires divergence) collapses
- **Generation-scale** — the demo persona has *no reference frame* outside the algorithm. This isn't *"people who used to think for themselves."* This is people who never got the chance.

### The signature thesis line (Johnny verbatim, public-dated)

> *"Manipulation only works in the dark. What happens to the internet when the lights come on?"*

---

## 3. Solution — locked architecture

### Pipeline (Johnny verbatim, 2026-04-25 PRFAQ canvas yap)

```
[INPUT]                  Reels/TikTok feed screen recording (B2C / Listen Labs / Sideshift)
                         OR egocentric construction-worker video (Ironside)
                         — input source IS the persona switch; same product

         ↓

[BRAIN ENCODING]         TRIBE V2 inference (1 Hz)
                         Output: ~20,000-vertex cortical activation predictions per second
                         (NOT 70K voxels — canonical reference fact, T1 lock)

         ↓

[SWARM SPLIT]            K2 swarm of N agents tied 1:1 to brain regions
                         Each agent IS a "specialist for that part of the brain"
                         (Johnny's exact phrase)

         ↓

[CROSS-REGION COMM]      LOCKED: agents talk to each other (the "sauce")
                         2-pass minimum: hypothesis → cross-eval → synthesis
                         Produces edges between region-outputs (the bridges)

         ↓

[AGGREGATION]            "How the brain would have inferred it"
                         + knowledge-graph edges (cross-talk visualized)

         ↓

[VISUALIZATION]          3D brain (fsaverage5 mesh) + 3D knowledge graph
                         in *separate spatial layers* (NOT painted on cortex)
                         + clickable per-region specialist tree
                         + hover-bridges (grayed-out by default; light up on focus)

         ↓

[OUTPUT — Spotify-Wrapped-style cards]
                         Card 1: Top brain regions
                         Card 2: Top content categories ("can't lie about what you consume")
                         Card 3: Cohort comparison
                         Card 4 (HERO): Inverted-brain-search Land card
```

### Key architectural locks

- **Specialist per brain region** is the swarm-fan-out unit (NOT three-role debate triad — explicit non-overlap with Renaissance Research)
- **Cross-region communication YES** — the cross-talk is the operational distinction from "static parallel fan-out"
- **Hover-bridge mechanic** — bridges grayed by default; light up on user hover within radius. Solves visual mess + makes swarm responsiveness visible (Victor's required kill-shot move).
- **Two-layer visualization** — 3D brain in space + 3D knowledge graph in space *mapped to* brain regions. NOT painted on cortex (Johnny explicitly cut).
- **Live-with-pre-cache fallback** — try live (TRIBE + K2); per-component swap to pre-cached if any beat fails.
- **TRIBE numbers locked at canonical-reference values:** ~20,000 vertices on fsaverage5, ~25 trained subjects, 1Hz, 5s HRF lag. **NEVER inflate to 70K/700 on stage.**

### The positioning statement (Johnny verbatim)

> *"We don't want to recommend anything to you because that's how the algorithm works. We want to give you accessible information using AI so that you can make good judgments."*

This is the architectural answer to the Auditor's external-referent question (T2). The Auditor isn't another AI predicting what's good — it's the user's own brain-fire pattern as the external signal. Filter World *inverted*, not Filter World with extra steps.

### Forbidden claims (per TRIBE canonical reference + Poldrack 2006) — STRENGTHENED 2026-04-25 per Quinn validation pass 2

- **Reverse inference forbidden:** never claim "amygdala fired = user felt fear." Activation patterns, not psychology. **Voiceover language locked:** use *"responded to"* / *"observed"* / *"measurable response to attention-grabbing cues"* — NEVER *"because content was designed to make you feel"* / *"the part that's you"* / *"fires because [emotion]"*.
- **Sub-second predictions forbidden:** TRIBE is 1Hz with 5s HRF lag.
- **No clinical claims** — *"content discovery, not clinical diagnosis."*
- **License: CC BY-NC 4.0** — non-commercial only; FAQ pre-script: *"research-stage; commercial path TBD."*
- **Within-subject contrast only (locked 2026-04-25):** the BEAT-3 toggle compares the same brain on different inputs, NEVER population-normed comparisons. *"Your brain on your feed vs. your brain on something else"* — never *"your brain vs. the average healthy brain."* This is the audit-grounding answer to T2.

### The product reframe (Quinn validation pass 2 — locked)

The product is **NOT** "a brain-reading app." The product **IS** *augmented introspection that uses neuroscience as the interface.* The cortical mesh, the swarm, the hover-bridges, the Wrapped cards — these are the **interface that makes neural divergence legible to a 17-year-old.** Everything serves the introspection; nothing claims clinical authority.

---

## 4. Output Shape — locked

**Spotify-Wrapped-style** (format reference; NOT product name — trademark caveat held).

| Card | Content | Notes |
|---|---|---|
| Card 1 | Top Brain Regions | Use **function names** for user-facing label (*"emotion processing," "future planning," "social sense"*); anatomical names as small footnote. **Sally's UX fix:** "amygdala" reads as homework for a 17-year-old. |
| Card 2 | Top Content Categories | Brutal honesty per Johnny: *"you can't lie about what you consume anymore."* The comparison must disagree with intuition or it has no surprise (Sally's fix). |
| Card 3 | Cohort Comparison | Hand-tuned percentile vs. mock 10-profile cohort for demo (per pitch-vs-product doctrine). FAQ pre-script: *"production scales with consented user data."* |
| Card 4 | Brain Map (still 3D) | Hero shot for share-card export. Magazine-cover beautiful (Emilie's Nova-quality bar). |
| **Card 5 (HERO)** | **Inverted-Brain-Search Land card** | Click grayed-out region → content options that would activate it. **NOT recommendation.** Per Johnny's "20 versions of tomorrow" garden UI metaphor — port shape, scope to brain regions. |

### Product name — TBD, polished at end

Candidates from Johnny's published vocabulary: *Lights On, Daylight, Ingredients, Mirror, Untargeted, Brainline, Garden Mode.* **NOT** "Spotify Wrapped of Your Brain" — format reference only.

---

## 5. Demo Skeleton — see [`demo-script.md`](./demo-script.md)

The 90-second shot-by-shot lives in a separate authoritative file. Summary here:

- **BEAT-0** (pre-demo, off-timer): contextual setup
- **BEAT-1** (0:00–0:15): Hook — Reels scroll + live cortical mesh. *Recognition + Awe.*
- **BEAT-2** (0:15–0:45): Body — swarm specialists + hover-bridges. *Surprise setup.*
- **BEAT-3** (0:45–1:15): Surprise — feed-shaped vs. curated-shaped brain toggle. *Surprise + Awe.*
- **BEAT-4** (1:15–1:30): Land/Hero — Wrapped cards collapse to inverted-brain-search. *Pride + Comfort.*
- **BEAT-5** (slide swap, off-timer): sponsor close (Listen Labs / Ironside / Sideshift).

The demo script's per-beat I/O contracts ARE the per-person silos. See §7 below for the silo mapping.

---

## 6. Sponsor Strategy — one spine, swappable closes (UPDATED 2026-04-25 post-empowerment-synthesis)

### The core positioning — the EMPOWERMENT angle (NEW LOCK 2026-04-25, supersedes "democratization" as the user-facing word)

> *"Your Spotify is no longer your music tastes — it's a recommendation algorithm. Your YouTube, what you consume, is no longer yours. Your Reels — you can't select any of that. You're either at a disadvantage for wanting to maintain who you are as a person, or you give up all your data. We offer a third option: you can use AI, but you should be able to see what they're doing to you and make the choice. That's the empowerment angle."* (Johnny verbatim, 2026-04-25 synthesis)

The product is **empowerment-shaped:** the user is the protagonist; the system informs without prescribing; the data is theirs. Democratization of personalization-awareness is the *mechanism;* empowerment is the *felt experience.* User-facing copy uses "empowerment"; technical / strategic copy uses "democratization."

**The trilemma the product breaks:**
- Status-quo Option 1: Don't use platforms → at a disadvantage
- Status-quo Option 2: Use them → invisibly shaped, data extracted
- **Our Option 3:** Use them AND see them AND choose

**Movement-shift framing (locked):** *"A new direction of how humanity would interact with AI in the future."* Position as a **category-creator** — the first product in the new category, not "another AI tool."

### The BCI / future-vision argument — NEW LOCK 2026-04-25 (the *why-this-matters-now* spine)

The trilemma extends from today (recommender feeds) to tomorrow (BCI). Same pattern, escalating stakes:

| Path | Today (Reels) | Tomorrow (BCI) |
|---|---|---|
| **All-in** | Give up data, AI personalizes, you can't break out | Give up humanity, become superhuman with hollow eyes |
| **Refuse** | Keep data, fall behind | Stay un-augmented, get replaced |
| **Empowerment (ours)** | Use AI, see what it does, choose | Augment intelligence + still make human choices when needed |

> *"Today it's Reels. In five years it's brain chips. The pattern is the same. The choice is the same. We're building the design pattern for human-AI partnership before the cognitive interface becomes invisible."*

This is the **why-this-matters-now argument** for hackathon judges. The product isn't *"a brain-visualization app";* it's *"the prototype of how humans will relate to AI when AI becomes dominant cognitive infrastructure."* Design pattern for the decade, not demo for the weekend.

### "Open source the algorithm" — pitch-line shape (NEW LOCK)

The empowerment angle's pitch-line shape:
> *"It's like open-sourcing the algorithm Instagram uses on you — except we recreate the visibility layer at your edge, not at the platform."*

The core user moment: *"Why is it feeding me these reels? I can enjoy them, but for the greater good of who I am, I want to see and choose differently."*

### The personal-data-vault frame (YC-pitch in one sentence — NEW LOCK)

> *"If every company is storing your data, why can't you store your own? And analyze it yourself."*

The argument: corporations have full pipelines for harvesting + storing + analyzing user data; users have nothing equivalent. Information asymmetry IS power asymmetry. The product flips it.

### Held privately (NOT in pitch — YC-conversation-only context)

Local-first AI is the long-term moat. Per Johnny: *"That's why locally AI is going to be the future, but we're not going to mention that, just some context."* Sponsor judges operate cloud-first; on-device positioning could lose them. Keep local-first for post-pitch YC conversation only.

### Buzzword bank for slide titles (NOT for voiceover)

- **Superhumanitarian** (Johnny's coinage — distinctive, slide-titleable)
- **Empowerment** (umbrella positioning)
- **Save the next generation** (high-stakes framing)

Voiceover register stays cinematic. Slides carry the rhetoric.

**Three layers of un-black-boxing the product enacts:**
1. The personalization (what the algorithm picked for you)
2. The brain-fire pattern (how your neurons responded)
3. **The swarm's reasoning** (why each region's specialist made the inferences it made)

Then: maps all of the above into clean-UX decision-support, *without* recommending.

### The "when AI should and shouldn't" rubric (NEW LOCK — Best Use of AI argument)

The product enacts an explicit position on AI ethics:

| YEA — when AI should be used | NAY — when AI should NOT be used |
|---|---|
| Make invisible processes visible (un-black-boxing) | Recommend / prescribe / optimize for engagement |
| Surface options the user judges | Harvest data without consent |
| Menial high-throughput work (K2 swarm fan-out) | Replace user judgment |
| Synthesize across signals (Opus final layer) | Present as human / mislead via simulation |

This rubric IS the answer to "Best Use of AI." The product itself is the demonstration.

### Tracks targeted (UPDATED)

| Track | Status | Strategy |
|---|---|---|
| **Best Use of AI** | 🎯 hard target | The product enacts the YEA/NAY rubric. *"Highlighting exactly how AI is being used and when you should and shouldn't."* |
| **Creativity** | ✅ definite | Visceral cortical visualization + hover-bridges + Wrapped output clear the Creativity bar. |
| **K2 / IFM** | ✅ core | Speed (~1300 tok/s) is the architectural unlock — at Claude latency, swarm fan-out at this scale doesn't fit 90s. |
| **Listen Labs** | ✅ core (REPOSITIONED) | *"You simulate human-to-human interaction. We simulate humanity — the human-AI partnership where AI identifies convergence and the user chooses to branch out. Next-gen synthetic-profile use case."* |
| **Sideshift** | ✅ core (REPOSITIONED) | *"Democratization of data-control. It's your data; you should see what's being harvested and adjust. The first consumer product giving you that visibility, scoped to your brain's response."* |
| **Ironside** | ✅ core (USE-CASE NOW LOCKED 2026-04-25) | *"Archetypal cognitive-emotional state per construction-action."* Apply our engine to their egocentric construction footage → surface what mental state the worker was in during each action → output: job-fit signal, training-depth recommendation, risk-classification signal. Ethos preserved (un-black-boxing the cognitive state behind manual labor; benefits the worker, not surveillance). |
| **YC** | ✅ stretch with NAMED PRODUCT SHAPE | *"The future Obsidian — except your knowledge graph is your brain-response shape, not your typed notes."* Two monetization paths held as named options: (a) "database FOR you" (hosted, user-owned, you're the customer not the product); (b) local-first one-time-pay (model + brain-data on your device). |
| **Palohouse** | ❌ dropped | Decision 015. |

### Sponsor closes (final wording deferred)

**ListenLabs + Sideshift + YC — ONE positioning, ONE product, SAME spine, SWAPPABLE LOGO + 1-slide swap.**

**Unified empowerment spine (the close all three sponsors share):**
> *"Your Spotify is no longer your music. Your Reels are no longer your taste. Personalization is coerced — disadvantage or data-extraction. We give you the third option: see what's being done to you, and choose. Empowerment in an age where everything is decided for you."*

Sponsor-specific 1-slide swaps on top of the unified spine:

- **ListenLabs swap slide:** *"You simulate humans. We simulate humanity — the human-AI partnership of the future. The novel synthetic-profile use case: not emulating users, but emulating the loop where AI surfaces convergence and the user finds what's outside it."*

- **Sideshift swap slide:** *"A consumer tool for capturing data — your data, for you. Empowerment made consumer-grade. The first surface that gives you visibility into what's being harvested, scoped to your brain's response."*

- **YC swap slide:** *"The future Obsidian — except your knowledge graph is your brain's response shape, not your typed notes. We're the database FOR you, not the database that sells you. Two paths to monetize without becoming the evil one: hosted user-owned-data, or local-first pay-once. Category-creator on the new direction of human-AI interaction."*

- **Ironside swap slide (USE-CASE LOCKED 2026-04-25):** *"Egocentric video tells you what was done. Brain encoding tells you what state of mind it took to do it well. Apply our pipeline to your construction-site footage and we surface the archetypal cognitive-emotional state per action — making job-fit, training depth, and risk classification empirical instead of intuitive. Same engine, ethos preserved: un-black-boxing the cognitive state behind manual labor — for the worker, not the surveiller."*

**K2:** Covered by core architecture (speed is load-bearing for swarm fan-out at scale; demonstrably required for the 90s demo budget).

**Best Use of AI:** Universal wrapper. The YEA/NAY rubric IS the answer to the track question.

---

## 7. Per-Person Epics

Per Decision 003 lane locks + 2026-04-25 corpus gap-filler analysis. Each epic is INPUT/COMPUTE/OUTPUT shaped so the team integrates by plugging interfaces.

### 7.1 — Junsoo Kim — TRIBE V2 + Ironside angle defense

**Lane lock (Decision 003):** Execution + agentic orchestration. Anti-pref: framework-shuffling, application-LangChain-agent work.

**Owns:**
- Video → TRIBE V2 → per-region brain-activation JSON pipeline
- The Ironside close defense (his shipped egocentric-video pipeline IS the credibility chip)
- The cross-region communication protocol formal specification (his PDDL/Icarus Lab work)
- Black-box LLM behavior probing methodology to validate cross-talk doesn't collapse to corpus mean

**INPUT:** screen-recording video file (Reels for B2C; egocentric construction video for Ironside swap)

**COMPUTE:**
- TRIBE V2 inference at 1Hz; partition by brain region (atlas TBD: Glasser 360 or Yeo-7 — Junsoo picks)
- Output JSON: `{ time_s: int, region_id: str, activation: float, vertices: [...] }` per second
- Fallback: pre-record TRIBE output for the demo input video by Saturday 8 AM if live latency exceeds budget

**OUTPUT:** brain-activation JSON stream (live or pre-recorded); plus Ironside-version pre-baked side-by-side comparison MP4

**Friday-night smoke test:** TRIBE inference latency on a 30s clip on demo GPU. If > 30s, mandatory pre-cache.

**Forbidden:** never inflate to 70K/700; never make reverse-inference claims; never run on industrial OOD content without baseline fallback (TRIBE degrades 0.32 → 0.17 OOD).

**PhD-app value:** This work is publishable as multi-agent + brain-encoding bridge research. Sven Koenig's IDM Lab orbit has interest-overlap. Capture protocol spec + empirical divergence results. Letter-of-rec material if cited.

### 7.2 — Jacob Cho — K2 swarm orchestration + cross-talk demo example

**Lane lock (Decision 003):** Execution + agentic orchestration. Anti-pref: frontend, ML/research lead, pitcher.

**Owns:**
- K2 swarm fan-out (one specialist per brain region)
- Cross-region communication implementation (2-pass minimum: hypothesis → cross-eval)
- Real-time data flow (port Nucleus pattern: specialized async agents + Supabase WebSockets to React)
- ONE hand-tuned cross-talk demo example: actor/auditor/mediator visibly divergent outputs on the demo input

**INPUT:** Junsoo's per-region brain-activation JSON

**COMPUTE:**
- N specialists (one per region), each with system prompt: *"You are the specialist for [region X]. This region handles [function]. Given activation pattern, what is this region contributing?"*
- Round 1: each specialist outputs hypothesis
- Round 2: each specialist re-evaluates given other specialists' outputs (cross-talk)
- Aggregator: "how the brain would have inferred it" payload
- Edge weights: how much region-B's output shifted by region-A's input → bridges
- K2 integration template: asyncio.Semaphore(6), Pydantic strict + brace-balanced JSON extractor, 3-attempt retry, timeout 120s

**OUTPUT:** swarm-output JSON (per-region interpretations + cross-region edges with weights)

**Friday-night smoke test:** load-test 10 concurrent K2 calls; if timeouts/rate-limits, pre-cache mandatory.

**Career-narrative win:** the K2 swarm + cross-region comm + observability pattern IS the resume narrative Jacob said he wanted. Production-pattern Nucleus-shaped.

### 7.3 — Johnny Sheng — Innovation + visualization + 3-parallel-Claude orchestration

**Lane lock (Decision 003):** Hard innovation + difficult implementation. Slice further fans out into 3 parallel Claude instances under his management.

**Owns:**
- 3D visualization stack (brain mesh + knowledge graph + clickable specialist tree)
- The hover-bridge mechanic implementation
- The inverted-brain-search Land card backend (Q-J6 implementation pick)
- Architecture defenses (Renaissance differentiation staging, T2 stance, reverse-inference reframe scripts)
- Direction lock for ambiguous build choices
- Final headline pick at end (from candidate set)
- Product name pick (from his vocabulary candidates)

**INPUT:** Jacob's swarm-output JSON + Junsoo's TRIBE activation stream

**COMPUTE — three parallel Claude siblings:**

| Sibling worktree | Owner Claude | Scope |
|---|---|---|
| `.worktrees/johnny-vis-brain` | Vis-brain Claude | 3D cortical mesh rendering (fsaverage5), live activation glow, smooth rotation |
| `.worktrees/johnny-vis-graph` | Vis-graph Claude | 3D knowledge graph layer mapped to brain, hover-bridges (grayed → light), clickable specialist tree |
| `.worktrees/johnny-orch-glue` | Orchestration glue Claude | TRIBE → swarm → viz pipeline integration, demo runbook, fallback swap logic, mock contracts |

Spawn pattern (per multi-Claude orchestration scout):
```bash
git worktree add .worktrees/johnny-vis-brain
git worktree add .worktrees/johnny-vis-graph
git worktree add .worktrees/johnny-orch-glue
tmux new-window -n vis-brain  'cd .worktrees/johnny-vis-brain && claude'
tmux new-window -n vis-graph  'cd .worktrees/johnny-vis-graph && claude'
tmux new-window -n orch-glue  'cd .worktrees/johnny-orch-glue && claude'
```

Sync at integration checkpoints. Each sibling gets shared PRD context + lane-specific scope.

**OUTPUT:** integrated visualization frontend; the demo as a runnable pipeline

**Visualization stack pick:** Three.js or React Three Fiber recommended (per validation pass). Pick by Friday 2 PM.

**Inverted-brain-search Q-J6 pick:** options A (reverse-lookup) / B (swarm-generate) / C (search-API). Pick by Friday 5 PM. Hand-curate suggestions for the demo input video regardless of pick.

**Anti-patterns locked from `johnny.md`** (design constraints): no scores, no dashboards, no labels-during-process, no borrowed aesthetics, no prescription, no rewarding noise, no killing emergence, no hiding failures.

### 7.4 — Emilie Duran — Packaging + storytelling + sponsor closes

**Lane lock (Decision 003 + 2026-04-25 mandate):** Entire packaging process. Quality bar: *"pass the startup test."*

**Owns:**
- 90-second shot-by-shot demo script execution (per [`demo-script.md`](./demo-script.md))
- Spotify-Wrapped-style 5-card Figma mockups (cards 1-4 + Land hero)
- Launch video (startup-quality, per Nova Intelligence precedent)
- Devpost writeup
- Design guidelines + color palette
- 3 sponsor close slides (Listen Labs / Ironside / Sideshift)
- On-camera narration + voiceover
- Pitch-translation lane for non-technical sponsor judges (her Claude Campus Ambassador craft)
- Friday-night Renaissance differentiation rehearsal (verify first 10s doesn't pattern-match)
- Saturday afternoon polish (per ship-velocity principle 7 — polish goes LAST)

**INPUT:** Locked Wrapped card data shape from Jacob/Johnny + sponsor close lines from PRD §6 + final headline pick from Johnny

**COMPUTE:**
- Friday: wireframes only. Polish defers to Saturday.
- Saturday AM: pre-cache fallback assets (15s mesh MP4, 30s bridge MP4, 20s side-by-side MP4, card images, sponsor slides, voiceover WAV)
- Saturday PM: design polish, hero shot, launch video, Devpost copy
- Render Card 1 with **function names** not anatomical names (Sally's UX fix)
- Render Card 3 with **comparison that disagrees with intuition** (e.g., *"You're MORE converged than 88% of your peers"*)

**OUTPUT:** 5-card Figma mockup (locked data-source mapping for each box) + launch video MP4 + Devpost writeup + 3 sponsor-close slides + voiceover audio

**Visual language reference:** Spotify Wrapped, BeReal "year in moments," Apple Wellness, Notion/Linear/Granola design vocabulary.

**Pre-cache assembly test (Saturday 6 PM):** run entire 90s using only pre-recorded assets. If that works, live version is bonus.

---

## 8. FAQ scaffolding (story-ammunition)

Per pitch-vs-product doctrine: questions named here, answers pre-scripted as story-ammunition. Final wording polished at end.

### Customer FAQ

- Q1. *"What's actually different about how this product treats my feed vs. a wellness app or screen-time tracker?"* → not measuring time/usage; measuring brain-pattern shape.
- Q2. *"Is this another AI tool that tells me what to do?"* → no — *"we don't recommend; we surface options. You judge."* (positioning statement.)
- Q3. *"How accurate is the brain reading?"* → uses TRIBE V2 (Meta FAIR research); ~20K-vertex predictions; predicts response patterns, not felt emotions.
- Q4. *"Can I share this with my friends?"* → yes — Wrapped cards are shareable. Sideshift angle.
- Q5. *"Will this work on my actual feed?"* → demo runs on screen-recording; production scales with consented streaming.

### Internal FAQ — story-ammunition for hostile judges

- Q-INT-1. **Renaissance Research differentiation:** *"You ran a debate triad last year. We ran specialists per brain region (N=many, brain-grounded), with the user's own brain as the auditor. Different epistemology, different visual signature, different answer to T2."*
- Q-INT-2. **TRIBE numbers honesty:** *"~20,000 cortical-surface vertices on fsaverage5, trained on ~25 deeply-scanned subjects. The 70K figure is a marketing variant; we use canonical numbers."*
- Q-INT-3. **Reverse inference (Poldrack 2006):** *"We don't claim activation = felt emotion. The Land card is content discovery via inverse pattern lookup, not clinical diagnosis."*
- Q-INT-4. **T2 — auditor's external referent:** *"We make Filter World visible. We don't claim to fix it. The user's own brain-fire-pattern shape across diverse content is the signal — TRIBE is the lens, not the auditor itself."*
- Q-INT-5. **"We don't recommend" vs. Land card:** *"The Land card surfaces content **formats** that would activate a region (long-form essays, poetry, etc.). The user picks. No optimization for engagement; no closed loop. Inversion of recommender, not iteration on it."*
- Q-INT-6. **K2-could-be-Claude legibility:** *"At Claude latency, the swarm fan-out at this scale doesn't fit 90s. K2's ~1300 tok/s is the architectural unlock. We can show the timing — not the demo."*
- Q-INT-7. **License (CC BY-NC):** *"Research-stage. Commercial path is TBD via Meta legal — we have the inquiries open."*
- Q-INT-8. **Spotify Wrapped trademark:** *"Format reference only. Product name is [TBD — final pick from Johnny's vocabulary]."*
- Q-INT-9. **Cohort data source:** *"Demo cohort is hand-tuned mock; production scales with consented user data. Per-percentile math is real against the mock."*
- Q-INT-10. **Listen Labs concrete viz:** *"The convergence visualization IS the side-by-side cortical heatmap toggle in BEAT-3. Same input run on N brains shows generational synchronization; non-algorithmic baseline shows divergence."*
- Q-INT-11. **Sideshift dev-tool fit:** *"Ingredients-list API. Creators embed it. Same pattern as FDA labeling integration — this is the labeling layer for content."*
- Q-INT-12. **Ironside fit:** *"Brain encoding adds the salience signal pixel-only VLMs miss. Junsoo's prior work on egocentric-video supervision pipelines is the credibility chip — he's already shipped this kind of multi-modal grounding."*
- Q-INT-13. **The 90s walkthrough:** see [`demo-script.md`](./demo-script.md). Every team member must be able to perform this from memory.
- Q-INT-14. **Cross-talk soup defense:** Junsoo's black-box LLM behavior probing methodology validates cross-talk produces semantically distinct outputs across regions. Plus one hand-tuned demo example (Jacob owns).

---

## 9. Friday-night smoke tests (gate)

Per Pre-mortem analysis. Run all Friday 8-11 PM. Failure on any → mandatory mitigation immediately.

1. **TRIBE latency baseline** (Junsoo) — 30s clip on demo GPU. Threshold: < 30s. Fallback: pre-cache.
2. **K2 swarm load test** (Jacob) — 10 concurrent specialist calls, 30s window. Threshold: zero timeouts. Fallback: pre-cached swarm outputs.
3. **Renaissance differentiation rehearsal** (Emilie + Johnny) — show first 60s to a teammate playing "I scored Renaissance"; threshold: no pattern-match within 10s.
4. **3D rendering FPS** (Johnny) — fsaverage5 mesh + knowledge graph on demo laptop. Threshold: ≥ 30 FPS. Fallback: mesh decimation or pre-bake camera motion.
5. **Wi-Fi contingency** (Emilie + Johnny) — full demo on phone hotspot. Threshold: zero API timeouts. Fallback: full backup MP4.
6. **Swarm output coherence** (Jacob) — 30s test; compare 8-region outputs. Threshold: < 50% semantic overlap. Fallback: harden region-specific prompts.
7. **Figma-to-data contract** (Emilie + Jacob) — Jacob exports mock JSON; Emilie imports to Figma; check for box overflow. Threshold: no overflow.
8. **Demo determinism** (Johnny) — 2 back-to-back runs same input; threshold: < 5% variance. Fallback: temp=0, lock seeds, or pre-record output.

---

## 10. Verdict — assessment

### Strengths

- **Founder credibility chip is shipped, dated, public.** Johnny's Synthetic Synesthesia (90.4% Clair de Lune emotion-center match) is primary-source evidence the methodology works *before* the team writes any new code. Renaissance had no comparable precedent.
- **Renaissance differentiation is structural, not cosmetic.** Brain-encoding-as-grounding + N-specialists-per-region + user-as-auditor + Reels-input-not-text changes the demo from "watch debate" to "watch brain." Sensory and epistemic frame is non-overlapping.
- **Multi-track strategy is structurally sound.** One spine, three swappable closes; input-source-as-persona-switch makes the closes MECE (one architecture, multiple modalities).
- **Per-person silos are clean I/O contracts.** Junsoo's TRIBE → Jacob's swarm → Johnny's viz → Emilie's packaging. Integration is plumbing, not coordination.
- **Engineering budget is feasible.** ~35-42 person-hours of 48 budgeted. 6-13h headroom. Three Friday-night gates.
- **Doctrine binding is consistent.** Socratic protocol + pitch-vs-product + smallest possible circle + no-recommendation + demo-over-execution + draft-everything-at-end form a coherent operating system.

### Risks (open)

- **Renaissance pattern-match in first 10s** — Mary's narrative-integrity attack still partly open. Mitigated by visual-signature differences and TRIBE-protagonist framing, but Friday-night rehearsal (smoke test #3) is the real gate.
- **TRIBE latency on demo GPU** — single largest schedule risk. Pre-cache fallback IS the answer; smoke test #1 confirms whether live or pre-cache.
- **Inverted-brain-search Land card execution** — Q-J6 pick + hand-curated demo suggestions is critical. Bad suggestion at 1:25-1:28 = demo collapse. Pre-cache for the specific demo input video is the answer.
- **Cross-talk soup** — defense is Junsoo's empirical method + Jacob's hand-tuned demo example. If the demo's cross-talk doesn't visibly diverge per region, the K2 swarm reads as decoration.
- **Listen Labs talk attendance Saturday 11 AM** is mandatory; Emilie + team should attend.

### Final draft items deferred to end

- Press-release headline (final wording from candidate set)
- Product name (final pick from Johnny's vocabulary)
- Each sponsor close (final wording from seed lines)
- User quote (BEAT-4 voiceover, in 17-year-old voice)
- FAQ answers (story-ammunition lines polished from question-only state)

---

## 11. Open items still requiring Johnny

These are the only items the PRD cannot resolve without Johnny:

1. Visualization stack pick (Three.js / R3F / Plotly3D) — Friday 2 PM
2. Q-J6 inverted-brain-search implementation pick — Friday 5 PM
3. Final product name from candidate set — at end
4. Final headline from candidate set — at end
5. T2 stance: own-it transparently or hard-counter — at end (FAQ-time)
6. Compare-move scope (in-demo or V2-only) — current default: V2-only / parked
7. ~~Ironside specific use-case~~ ✅ **CLOSED 2026-04-25** — archetypal cognitive-emotional state per construction-action; see §6 Ironside swap slide
8. ~~YC company back-propagation~~ ✅ **NAMED 2026-04-25** — future-Obsidian / brain-data-graph product shape; two monetization paths held as named options (Johnny picks at end)
9. **YC monetization path pick** — (a) "database FOR you" hosted vs. (b) local-first pay-once. Held as named options. At end.
10. **3-minute Round 2 narration script** — NEW deliverable named by Johnny 2026-04-25 (separate from `demo-script.md` which is the 90s embedded demo). Must be written next per Johnny's stated sequence.

---

## 12. References

- [`./prfaq.md`](./prfaq.md) — full PRFAQ working canvas (decisions log + soft-locks history)
- [`./demo-script.md`](./demo-script.md) — authoritative 90s shot-by-shot
- [`./tasks-by-person/johnny-orchestration.md`](./tasks-by-person/johnny-orchestration.md)
- [`./tasks-by-person/jacob-agent-swarms.md`](./tasks-by-person/jacob-agent-swarms.md)
- [`./tasks-by-person/junsoo-tribe-v2.md`](./tasks-by-person/junsoo-tribe-v2.md)
- [`./tasks-by-person/emilie-storytelling-research.md`](./tasks-by-person/emilie-storytelling-research.md)
- [`./validation-findings/2026-04-25-phase-2-party-mode-pass-1.md`](./validation-findings/2026-04-25-phase-2-party-mode-pass-1.md)
- [`./validation-findings/2026-04-25-blockers-reclassified-pitch-vs-product.md`](./validation-findings/2026-04-25-blockers-reclassified-pitch-vs-product.md)
- [`./validation-findings/2026-04-25-team-gap-fillers.md`](./validation-findings/2026-04-25-team-gap-fillers.md)
- [`./research-context/`](./research-context/) — 7 source pointers (Spotify Wrapped format, BeReal, Raskin, StoryBrand, Keltner, Rescorla-Wagner, Johnny-public-corpus)
- [`../research/wiki/decisions/README.md`](../research/wiki/decisions/README.md) — 16 locked decisions
- [`../research/wiki/themes/ai-paradox-invisible-use-cases/`](../research/wiki/themes/ai-paradox-invisible-use-cases/) — theme + sources + window-2 deepening
