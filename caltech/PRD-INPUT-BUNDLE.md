---
title: "PRD-INPUT BUNDLE — fresh /bmad-create-prd handoff"
status: spawn-ready (consume in a fresh Claude instance per Decision 013)
created: 2026-04-25
updated: 2026-04-25
project_name: caltech-hacktech-2026
purpose: Consolidated input bundle for the fresh PRD-builder pane. Per Johnny verbatim 2026-04-25 ("scope it down and pre-fill it... hackathon-demo-level ready for deployment"). This pane (orchestration / PRFAQ canvas) hands off here.
target_workflow: /bmad-create-prd in a fresh worktree pane
freeze: Saturday 2026-04-26 8 PM PDT
submit: Saturday 2026-04-26 11 PM PDT
---

# PRD-INPUT BUNDLE — Caltech HackTech 2026

> **Read this file FIRST when spawning the fresh PRD-builder pane.** It scopes the PRD work to hackathon-demo-only and points to every artifact already produced. Do NOT re-derive any decision below — they are LOCKED.

---

## 0. The 5 sentences a builder must keep visible (LOCKED — Johnny verbatim doctrine)

1. **The transformation:** *"Return human autonomy with the ability to see your thoughts."*
2. **The persona:** Gen-Z teen who has never had a reference frame outside the algorithm. Every artifact narrated *to* this human.
3. **The hero mechanic:** Inverted-Brain-Search Land card (click grayed-out region → content **options** that would activate it, NOT recommendations). BEAT-4 = demo's center of gravity.
4. **Headline direction (final wording deferred):** *"You can't see how the algorithm shapes your thinking. We made it visible."*
5. **The demo is 90 seconds, not the product** — a *snippet representation*, one slice end-to-end. Pre-cache hard parts. Don't describe a production system.

## 0a. Doctrines (LOCKED)

| Doctrine | Source |
|---|---|
| Socratic protocol — Claude reflects, never proposes | Johnny verbatim, Decision 004 |
| Pitch-vs-product — block on pitch-issues only; product-issues parked | Johnny 2026-04-25 |
| Smallest possible circle — minimum-viable shipment unit | Johnny published corpus |
| No recommendation — surface options, user judges | Johnny verbatim |
| Demo-over-execution — visualization > engineering depth | Decision 011 |
| Draft everything at the very end — skeleton first, polish last | Johnny 2026-04-25 |
| Now-vs-future split — use cases present-tense; story future-tense | Johnny 2026-04-25 |
| Capability-first ideation — list primitives, then compose | Johnny 2026-04-25 (latest) |

## 0b. Multi-track gamble (acknowledged, deliberate)

Johnny verbatim: *"This is the worst way to come up with ideas... but name another scenario where you're able to fit every single sponsored track into one idea. Yes it's a huge gamble — it's the hackathon method."*

**Implication for PRD:** track coverage is a known-cost bet, not an accident. When validation flags "trying to satisfy too many sponsors muddies the value prop," accept the critique — multi-track is the bet.

---

## 1. The product (LOCKED)

### Persona
**Gen-Z AI-native teen, born ~2008-2010.** Raised on the algorithm. No "before" reference frame. Their thoughts converge with the feed and they can't tell which thoughts are theirs.

Felt-friction sentence (Johnny's published corpus voice): *"If a headline is engineered to make you angry, the only way to know is to notice your own reaction after it already got you."*

### Problem
Algorithms have flattened how everyone's neurons fire. Specific platforms named: **Spotify, YouTube, Reels.** *"Your Spotify is no longer your music taste — it's a recommendation algorithm. The genitive is a lie."*

### Stakes (the trilemma — capability-first articulation)
| Path | Data-cost | AI-benefit | Agency |
|---|---|---|---|
| All-in | All given up | Maximum personalization | Lost (self-repeating cycle) |
| Refuse | Preserved | None | Preserved but irrelevant |
| **Empowerment (ours)** | Yours | Yes | Preserved + informed |

Future-vision extension (story-tense, not use-case-tense): today=Reels, tomorrow=BCI. Same trade. Same trap.

### Solution architecture (LOCKED — 4-layer pipeline)
```
[INPUT]                  Reels/TikTok feed screen recording (B2C/Listen Labs/Sideshift)
                         OR egocentric construction-worker video (Ironside)
   ↓
[TRIBE V2]               ~20K cortical-vertex activations @ 1Hz, 5s HRF lag, fsaverage5 mesh
   ↓
[K2 SWARM]               N agents tied 1:1 to brain regions; cross-region communication;
                         "specialist for that part of the brain" prompts; ~1300 tok/s on Cerebras
   ↓
[OPUS FINAL SYNTHESIS]   Claude Opus on aggregated swarm output: "what does this MEAN
                         for THIS user, how to display, what problem this solves"
                         (the depth layer K2 explicitly is NOT)
   ↓
[VISUALIZATION]          3D brain (fsaverage5) + 3D knowledge graph (separate spatial layer,
                         NOT painted on cortex) + clickable specialist tree
                         + hover-bridges (grayed by default; light up on focus)
   ↓
[OUTPUT]                 Spotify-Wrapped-style cards + inverted-brain-search Land card
                         Plus iterative-fill mechanic (Adaptation 1 — pending Johnny pick)
                         Plus shareable Brain Card export (Adaptation 2 — pending Johnny pick)
```

### Output shape (LOCKED — Spotify-Wrapped-style format reference; NOT the product name)
| Card | Content (function-named, not anatomy-named per Sally + Quinn validation) |
|---|---|
| 1 | Top brain regions ("emotion processing," "future planning," "social sense") |
| 2 | Top content categories — brutal honesty per Johnny: *"you can't lie about what you consume anymore"* |
| 3 | Cohort comparison — must DISAGREE with intuition (e.g., *"you're MORE converged than 88% of peers"*) |
| 4 | Brain map (still 3D, hero shot for share-export) |
| 5 (HERO) | **Inverted-Brain-Search Land card** — click grayed-out region → content formats that would activate it. NOT recommendations. |

### Positioning statement (LOCKED — Johnny verbatim)
> *"We don't want to recommend anything to you because that's how the algorithm works. We want to give you accessible information using AI so that you can make good judgments."*

### Forbidden claims (LOCKED — per TRIBE canonical reference + Poldrack 2006 + Quinn validation)
- ❌ Reverse inference (no "amygdala fired = user felt fear"). Use observational language: *"responded to attention-grabbing cues."*
- ❌ Sub-second predictions (TRIBE is 1Hz, 5s HRF lag).
- ❌ No clinical claims — *"content discovery, not clinical diagnosis."*
- ❌ Within-subject contrast only — never population-norm comparisons.
- License CC BY-NC 4.0 — FAQ pre-script: *"research-stage; commercial path TBD."*

### Product reframe (per Quinn validation pass 2 — LOCKED)
The product is **NOT** *"a brain-reading app."* The product **IS** *augmented introspection that uses neuroscience as the interface.*

---

## 2. Sponsor strategy (LOCKED — STRENGTHENED 2026-04-25)

### Track coverage
| Track | Status | Strategy |
|---|---|---|
| **Best Use of AI** | 🎯 hard target | YEA/NAY rubric — product enacts the answer |
| **Creativity** | ✅ definite | Cortical viz + hover-bridges + Wrapped clear bar |
| **K2 / IFM** | ✅ core | Speed is load-bearing — swarm fan-out infeasible without K2 |
| **Listen Labs** | ✅ core | "We simulate humanity — the human-AI partnership of the future" |
| **Sideshift** | ✅ core | "Consumer tool for capturing your data — for you" |
| **Ironside** | ✅ core (use-case LOCKED) | Cognitive-state inference per construction action |
| **YC** | ✅ stretch (NAMED) | "Future Obsidian — knowledge graph is your brain's response shape" |
| **Palohouse** | ❌ dropped | Decision 015 |

### YEA/NAY rubric (Best Use of AI argument — LOCKED)
| YEA — when AI should be used | NAY — when AI should NOT be used |
|---|---|
| Make invisible processes visible | Recommend / prescribe / optimize for engagement |
| Surface options the user judges | Harvest data without consent |
| Menial high-throughput work (K2 swarm) | Replace user judgment |
| Synthesize across signals (Opus) | Present as human / mislead via simulation |

The product itself enacts this rubric.

### One spine, swappable closes
**Unified empowerment spine** (ListenLabs + Sideshift + YC share):
> *"Personalization is currently coerced. Disadvantage or data-extraction. We give you the third option — see it, choose it, own it."*

Each sponsor swap-slide structure (4-line capsule):
- Headline
- Use case (one specific scenario)
- Real verification (what proves it works TODAY)
- Why this sponsor cares

Full per-sponsor swap content: see `prd.md` §6.

---

## 3. Demo skeleton (LOCKED — see `demo-script.md` for shot-by-shot)

```
[BEAT-0  PRE-DEMO]      ← Sponsor close swap-in (1-2 slides change per sponsor)
[BEAT-1  HOOK]          (0-15s)   Recognition  → familiar surface (Reels) + cortical mesh awe
[BEAT-2  BODY]          (15-45s)  Surprise     → swarm specialists + hover-bridges visible
[BEAT-3  SURPRISE]      (45-75s)  Awe + Hope   → feed-shape vs. baseline-shape toggle
[BEAT-4  LAND / HERO]   (75-90s)  Pride+Comfort → Wrapped cards + inverted-brain-search
[BEAT-5  CLOSE]         (slides)  Sponsor-specific tagline + ask
```

Live-with-pre-cache fallback strategy: try live; per-component swap to pre-cached if any beat fails.

### 3-min Round 2 narration script
See `narration-script-3min.md`. Budget: 35s Black Mirror cinematic Act 1 + 20s Act 2 transition + 100s Act 3 demo + 25s Act 4 close. **Validation rewrites already applied** (Sophia inciting-incident + Quinn reverse-inference strip + Maya shame-before-agency restructure).

---

## 4. Per-person silos (LOCKED I/O contracts — see `tasks-by-person/`)

| Person | Lane | Owns | INPUT → OUTPUT |
|---|---|---|---|
| Junsoo Kim | TRIBE V2 + Ironside angle defense | Video → brain-activation JSON pipeline | video → brain JSON @ 1Hz |
| Jacob Cho | K2 swarm orchestration + cross-talk demo | Specialist agents + cross-region edges | brain JSON → swarm output JSON + edges |
| Johnny Sheng | Innovation + visualization + 3-parallel-Claude orchestration | 3D viz + Land card backend + arch defenses | swarm JSON → integrated frontend |
| Emilie Duran | Entire packaging | Devpost + brand + launch video + on-camera | locked content → final shippable assets |

Multi-Claude orchestration: Tier 1 (5 build worktrees) + Tier 2 (9 packaging worktrees) — see `tmux-spawn-all.sh`.

---

## 5. Open items still requiring Johnny (NUMBERED for the PRD-builder to track)

1. Visualization stack pick (Three.js / R3F / Plotly3D) — Friday 2 PM
2. Q-J6 inverted-brain-search implementation pick — Friday 5 PM
3. Final product name from candidate set — at end (candidates: *Lights On, Daylight, Mirror, Brainline, Ingredients, Garden Mode*)
4. Final headline from candidate set — at end
5. T2 stance (own / counter) — FAQ-time
6. Compare-move scope — current default V2-only / parked
7. YC monetization path pick — at end (a: hosted FOR you / b: local-first pay-once)
8. On-device-vs-cloud lock — recommended Friday (Quinn pass 2)
9. **Adaptation pick from TreeHacks pattern search — pending** (recommended: 1+2: Iterative Brain-Fill + Shareable Brain Card)
10. Apply Opus-final-synthesis layer + design-consciousness primes to PRD §3 deeper (carry-forward)

---

## 6. The full artifact corpus (the PRD-builder reads from these)

### Primary artifacts (LOCKED state)
- `caltech/prd.md` — end-to-end PRD draft v1 with all locks
- `caltech/demo-script.md` — 90s shot-by-shot demo
- `caltech/narration-script-3min.md` — Round 2 pitch + video spine (validation rewrites applied)
- `caltech/prfaq.md` — full PRFAQ canvas (decisions log + soft-locks history)
- `caltech/emilie-brief.md` — packaging deliverables brief

### Yaps (Johnny verbatim — read in chronological order)
1. `caltech/context/yaps/2026-04-24-opening-team-direction.md`
2. `caltech/context/yaps/2026-04-24-judge-conversations-and-emerging-themes.md`
3. `caltech/context/yaps/2026-04-24-strategy-pivot-tech-first-stack.md`
4. `caltech/context/yaps/2026-04-25-pivot-best-use-of-ai-hard-target-cultural-flattening-frame.md`
5. `caltech/yaps/2026-04-25-prfaq-canvas/` — initial architecture lock + persona
6. `caltech/yaps/2026-04-25-listenlabs-conversation/` — democratization frame; ListenLabs+Sideshift unified
7. `caltech/yaps/2026-04-25-empowerment-synthesis/` — empowerment angle named; YC future-Obsidian; Ironside use-case locked
8. `caltech/yaps/2026-04-25-future-angle-bci-superhumanitarian/` — BCI extension; trilemma at 2 timescales
9. `caltech/yaps/2026-04-25-execution-layer-search/` — multi-method input layer; reverse-engineering thesis
10. `caltech/yaps/2026-04-25-capability-first-pivot/` — primitive-grounded ideation methodology

### Research-context (citations + format references)
- `caltech/research-context/001-andy-raskin-promised-land.md` (Hope mechanic)
- `caltech/research-context/002-donald-miller-storybrand.md` (Recognition + customer-as-hero)
- `caltech/research-context/003-keltner-haidt-approaching-awe.md` (Awe via vastness)
- `caltech/research-context/004-spotify-wrapped-as-format.md` (locked output-shape format)
- `caltech/research-context/005-bereal-as-anti-curation-pattern.md` (anti-curation thesis seed)
- `caltech/research-context/006-rescorla-wagner-surprise.md` (toggle expectation-violation)
- `caltech/research-context/007-johnny-public-corpus-tribe-posts.md` ⭐ ★ Johnny's published TRIBE work — credibility chip
- `caltech/research-context/008-devpost-exemplars-mindpad-terralink.md` ⭐ structural template for Devpost

### Validation findings (read for stress-test priors)
- `caltech/validation-findings/2026-04-25-phase-2-party-mode-pass-1.md` — 6-agent pass 1 (Mary/Winston/Sally/Victor/Pre-mortem/Red-team)
- `caltech/validation-findings/2026-04-25-blockers-reclassified-pitch-vs-product.md` — pitch-vs-product doctrine application
- `caltech/validation-findings/2026-04-25-team-gap-fillers.md` — corpus → blockers mapping; how each teammate's prior work fills gaps
- `caltech/validation-findings/2026-04-25-treehacks-pattern-search.md` ⭐ 5 capability-grounded adaptations on the table; recommended pick = 1+2

### Per-person epics (Tier 1 build)
- `caltech/tasks-by-person/junsoo-tribe-v2.md`
- `caltech/tasks-by-person/jacob-agent-swarms.md`
- `caltech/tasks-by-person/johnny-orchestration.md`
- `caltech/tasks-by-person/emilie-storytelling-research.md`

### Tier 2 packaging epics
- `caltech/tier-2-epics/pkg-brand-system.md`
- `caltech/tier-2-epics/pkg-pitch-deck.md`
- `caltech/tier-2-epics/pkg-landing-page.md`
- `caltech/tier-2-epics/pkg-social-content.md`
- `caltech/tier-2-epics/pkg-tech-writeup.md`

### Wiki backing (the deeper substrate)
- `research/wiki/themes/ai-paradox-invisible-use-cases/` — full theme + sources + window-2 deepening
- `research/wiki/decisions/README.md` — 16 numbered decisions
- `research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md` — TRIBE V2 corrected facts
- `research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md` — demo mechanics catalog
- `research/wiki/decisions/006-tribe-v2-as-special-mode.md`
- `research/wiki/decisions/007-agent-swarms-as-coordination-pattern.md`
- `research/wiki/decisions/008-k2-think-as-speed-engine.md`

---

## 7. PRD reading order for the fresh /bmad-create-prd pane (≤10 files)

If the spawned pane has limited context budget, read in this order:

1. **THIS FILE** (`PRD-INPUT-BUNDLE.md`) — orientation
2. `caltech/prd.md` — the existing PRD draft v1 (source-of-truth for all locks)
3. `caltech/demo-script.md` — the 90s shot-by-shot
4. `caltech/narration-script-3min.md` — the 3-min Round 2 spine
5. `caltech/yaps/2026-04-25-prfaq-canvas/01-high-signal-extracts.md` — initial architecture + persona lock
6. `caltech/yaps/2026-04-25-empowerment-synthesis/01-high-signal-extracts.md` — empowerment frame + Ironside lock
7. `caltech/validation-findings/2026-04-25-treehacks-pattern-search.md` — adaptation candidates
8. `caltech/research-context/007-johnny-public-corpus-tribe-posts.md` — founder credibility chip
9. `caltech/research-context/008-devpost-exemplars-mindpad-terralink.md` — Devpost structural template
10. `caltech/tasks-by-person/` (read all 4) — per-person silos with I/O contracts

---

## 8. Mega-prompt for the fresh /bmad-create-prd pane

> Spawn a fresh Claude pane. Have it read PRD-INPUT-BUNDLE.md first. Then issue this prompt:

```
You are the fresh PRD-builder pane for the Caltech HackTech 2026 hackathon project.
Per Decision 013, this is a different Claude instance from the orchestration / PRFAQ canvas pane.

YOUR JOB: produce a hackathon-demo-deployment-ready PRD by:

1. Read caltech/PRD-INPUT-BUNDLE.md FIRST (full).
2. Read caltech/prd.md (existing draft v1 — source-of-truth for all locks).
3. Read the 8 supporting files in §7 of the bundle.
4. Apply the Socratic protocol — DO NOT propose new directions; only sharpen existing locks.
5. Apply the pitch-vs-product doctrine — block ONLY on pitch-issues; product-issues are parked.
6. Honor the LOCKED state in §1-5 of the bundle. Do NOT re-derive.

YOUR DELIVERABLES (in this order):
A. caltech/prd-final.md — the deployment-ready PRD. Sections:
   - Executive summary (1 page)
   - Customer + persona
   - Problem + stakes (with trilemma + BCI extension)
   - Solution architecture (4-layer pipeline diagram)
   - Output shape (Wrapped-style + Land card hero)
   - Positioning statement + YEA/NAY rubric
   - Demo skeleton (link to demo-script.md)
   - Sponsor strategy (one spine + 4 swap slides)
   - Per-person silos with I/O contracts
   - FAQ (Q-INT-1 through Q-INT-14 from prd.md §8 — answer-polish them)
   - Friday-night smoke tests
   - Verdict / risk register
B. caltech/prd-final-summary.md — 1-page tl;dr for handing to a teammate

YOUR CONSTRAINTS:
- Track Johnny's open items in §5 of the bundle. Do NOT close them — surface them at the top of the PRD as "deferred to end" with owners + deadlines.
- The 5 candidate adaptations in caltech/validation-findings/2026-04-25-treehacks-pattern-search.md need a Johnny pick (recommended: 1+2). Default to "1+2 if Johnny hasn't picked" but flag that this is your default — Johnny can override.
- Keep the PRD scoped to HACKATHON DEMO. Don't write a production-product PRD. Per Johnny: "demo is a snippet representation."
- Final-wording polish (headline, product name, voiceover) is DEFERRED per the doctrine. Use [TBD-FINAL-PASS] markers anywhere wording is open.
- Validation pass 2 has been run; rewrites are already applied to narration-script-3min.md. Don't re-run validation; consume findings as input.

WHEN YOU'RE DONE:
- Return tl;dr to the orchestration pane (this pane).
- Confirm prd-final.md is hackathon-demo-deployment-ready.
- Flag any LOCKS you found ambiguous in the source (so Johnny can clarify before build).
```

---

## 9. Capability inventory results (LANDED 2026-04-25)

Both background research agents complete. Synthesis at `caltech/validation-findings/2026-04-25-capability-inventory-summary.md`.

### Headline finding

**The capability inventory surfaced a 5th adaptation candidate that beats the prior 5:** *SynthDebate-on-Brain* — TRIBE encodes user's brain → K2 generates 100 synthetic agents matching their brain-archetype → swarm war-games opinion dynamics on the same content → user sees their *predicted susceptibility-to-opinion-shift* with 100 brain-like-them debating in real time.

### Why this is the synthesis pick

- ✅ Hits 5/5 sponsor tracks (Listen Labs explicit fit + IFM K2 speed-load-bearing + Sideshift consumer + Creativity + Best Use of AI)
- ✅ K2 IS structurally required (100 agents × 5 rounds × 200 tokens = 100K tokens; only K2's 1300 tok/s fits in 90s)
- ✅ Empowerment-aligned (user sees their susceptibility, chooses how to react)
- ✅ Doesn't replace the locked spec — *adds an execution layer downstream of the Wrapped output*
- ✅ Solves Johnny's "stats-are-not-enough" critique with a *predicted-population-dynamics* artifact

### KEY DISCOVERY: Cortex.buzz exists

A commercial product (cortex.buzz) is built on TRIBE V2 and offers content-audit-as-a-service. License status unverified. **For the pitch:** Cortex.buzz is the *attention-engineering* application of TRIBE already deployed; we INVERT it. Strengthens the *"big tech uses brain models for X; we use the same model for not-X"* reverse-engineering thesis with a NAMED comparable.

### Recommended adaptation pick (UPDATED from prior turn)

**Adaptation 2 (Shareable Brain Card, 3-4h) + SynthDebate-on-Brain (4-5h)** = 7-9h within budget. Maximum sponsor-track coverage.

Replaces prior recommendation of Adaptation 1 (Iterative Brain-Fill) with SynthDebate (which structurally subsumes the iteration insight by simulating a population's iterations instead of forcing the user through them in real time).

The fresh PRD-builder pane should default to this pick if Johnny hasn't explicitly overridden, and flag the SynthDebate addition for Johnny's confirmation.

---

## 10. The handoff signal

When the fresh /bmad-create-prd pane spawns, it has everything it needs:
- All locks in this bundle
- All artifacts in §6
- All open items numbered in §5 (it tracks but doesn't close them)
- The mega-prompt in §8 is its activation prompt

**The orchestration pane (this pane) stops touching the PRD after spawning the fresh pane.** This pane handles: capability research integration, more yaps as Johnny captures them, validation passes if requested, packaging coordination.

Per Decision 013: PRD lives in a different instance. Now it does.

---

## 11. TEAM EXECUTION STATUS (LOCKED 2026-04-25 — Johnny's PM update)

The fresh PRD-builder pane should know what work is already in flight as it writes the PRD:

| Person | Currently doing | Status |
|---|---|---|
| **Junsoo Kim** | Working on TRIBE V2 — getting it to work | 🔵 IN FLIGHT |
| **Jacob Cho** | Working on agent swarms — getting that to work | 🔵 IN FLIGHT |
| **Emilie Duran** | Filming / plotting how we'll film the demo video for the beginning and the storytelling | 🔵 IN FLIGHT |
| **Johnny Sheng** | PM / orchestrating; coordinating everyone for when integration comes | 🔵 IN FLIGHT |

**Implication for the PRD-builder pane:**
- The 4 per-person epics in `caltech/tasks-by-person/` are LIVE — teammates are executing against them right now
- Don't propose changes that invalidate work-in-progress — write the PRD that *describes what they're already building*, with locks already set
- Emilie is filming Acts 1 + 4 (the cinematic Black Mirror setup + close) per the locked `narration-script-3min.md` voiceover blocks
- Junsoo is on TRIBE pipeline; Jacob is on K2 swarm — both per their epic specs
- Johnny is the integration point — PRD should make integration mechanical (clean I/O contracts, mock contracts, fallback strategy)

**Friday-night smoke-test gate is live tonight.** PRD §9 (Friday-night smoke tests) should be the gate the team runs against the in-flight build state. PRD-builder should not soften these tests — they catch demo-day failures.
