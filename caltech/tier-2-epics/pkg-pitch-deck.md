---
file-type: tier-2-epic
status: spec — fresh-Claude-spawn-ready
worktree: .worktrees/pkg-pitch-deck
owner: Emilie + pitch-deck Claude
duration_estimate: 4-5 person-hours
last-verified: 2026-04-25
---

# Tier-2 Epic — Pitch Decks (Round 1 + Round 2 + Sponsor Variants)

## Mission

Two slide decks backing the live pitches: 5-min Round 1 (depth) + 3-min Round 2 (punch). Plus 4 sponsor-specific swap slides interchangeable on either deck.

## INPUT (read these in order)

1. `caltech/emilie-brief.md` §5 (your operator brief)
2. `caltech/narration-script-3min.md` (Round 2 deck backs this directly)
3. `caltech/prd.md` §1 + §3 + §6 (full positioning + architecture + per-sponsor swap content)
4. `caltech/research-context/008-devpost-exemplars-mindpad-terralink.md` (architecture-as-pipeline visual reference)
5. `.worktrees/pkg-brand-system/` (output of brand-system Claude — typography + colors + slide template)

## ROUND 1 DECK — 5 minutes — 12-15 slides

| # | Slide | Content |
|---|---|---|
| 1 | Title | Headline + 17-year-old voice quote: *"I've tried to think for myself, but every time I do, the algorithm pulls me back."* + product name + team |
| 2 | The trilemma | Two-doors visualization. Path 1 (refuse) / Path 2 (all-in) / Path 3 (ours) — three columns, each with cost / benefit / agency |
| 3 | Today: the convergence problem | Specific platforms named (Spotify / YouTube / Reels). The genitive-is-a-lie pattern. *"You can't see how the algorithm shapes your thinking."* |
| 4 | Tomorrow: same trade in BCI | The future-vision arc. Today's pattern → tomorrow's pattern. *"Today it's Reels. In 5 years it's brain chips."* |
| 5 | The third option | Empowerment angle: use AI + see what it's doing + choose. Category-creator framing. |
| 6 | The 4-layer architecture | Pipeline diagram: TRIBE V2 → unique inference → K2 swarm → Opus synthesis → 3D viz. Concrete metric chips on each layer. |
| 7 | The hover-bridge mechanic | Visual: cross-region swarm comm rendered as bridges, grayed-out by default, light up on hover. *"Two layers un-black-boxed: the algorithm, and the AI's reasoning about you."* |
| 8 | The Wrapped output | The 5 cards (top regions / top categories / cohort / brain map / Land card hero) |
| 9 | The Land card — the hero gesture | Click grayed-out region → content formats that would activate it. *"We don't recommend; we surface."* |
| 10 | The YEA/NAY rubric (Best Use of AI argument) | Table: YEA (make-visible / surface-options / menial-K2 / synthesize-Opus) ‖ NAY (recommend / extract / replace-judgment / mislead). Product enacts YEA, excludes NAY. |
| 11 | Real verification — the Clair de Lune precedent | Founder credibility chip. 90.4% emotion-center match, 8 rounds, falsified against controls. Public-dated, shipped. |
| 12 | The category-creator close | *"This isn't another AI tool. It's the first product in a new direction."* Movement-shift framing. |
| 13 | Sponsor swap slide | (1 of 4 — see swap slides below) |
| 14 | The ask | What we want from this sponsor / track |
| 15 | Team + thanks | Names + LinkedIns + Devpost / GitHub link |

## ROUND 2 DECK — 3 minutes — 6-8 slides

Tighter cut. Backs the `narration-script-3min.md` directly.

| # | Slide | Backs script Act |
|---|---|---|
| 1 | Title | Pre-demo |
| 2 | The trilemma + BCI extension | Act 1 (Black Mirror setup + future flash-forward) |
| 3 | The third option | Act 2 |
| 4 | Demo (live) | Act 3 — the demo runs ON this slide; deck shows minimal frame |
| 5 | The Wrapped + Land card payoff | Act 4 / BEAT-4 hero |
| 6 | YEA/NAY + Clair de Lune chip | Act 4 close |
| 7 | Sponsor swap slide | (1 of 4) |
| 8 | Ask + team | — |

## SPONSOR SWAP SLIDES (4 variants — interchangeable on either deck)

Each follows the format from PRD §6 STRENGTHENED 2026-04-25. Slide structure:

```
[Headline — verbatim from PRD §6 sponsor swap slide]
[Use case — 1 sentence specific use case]
[Real verification — what proves it works today]
[Why this sponsor cares — 1 sentence connecting to their stated brief]
[Visual: 1 supporting image — could be brain-render variant, dataset frame, or quote card]
```

### Listen Labs swap slide
- Headline: *"You simulate humans. We simulate humanity."*
- Use case: Pre-deployment content auditing for platforms that care about generational impact
- Real verification: Clair de Lune 90.4% precedent + 90s embedded demo
- Why ListenLabs cares: extends their roadmap from "simulate humans" to "simulate human-AI feedback loop"

### Sideshift swap slide
- Headline: *"A consumer tool for capturing your data — for you."*
- Use case: Personal-data-vault for the post-recommender era
- Real verification: 90s embedded demo runs on stage
- Why Sideshift cares: viral mechanic + opinionated UI + future-Obsidian-shape product

### YC swap slide
- Headline: *"The future Obsidian — your knowledge graph is your brain's response shape."*
- Use case: Personal cognitive infrastructure for the post-platform era
- Real verification: YEA/NAY rubric enactment + Johnny's TRIBE V2 corpus
- Why YC cares: category-creator, local-first moat, TAM = smartphone-to-BCI transition

### Ironside swap slide
- Headline: *"Egocentric video tells you what was done. Brain encoding tells you what state of mind it took to do it well."*
- Use case: Cognitive-state inference per construction action — for hiring, training, risk classification
- Real verification: Junsoo's shipped egocentric-video → VLM-supervision pipeline
- Why Ironside cares: specific failure-mode + novel modality + mini-research-paper format

## OUTPUT FORMAT

```
.worktrees/pkg-pitch-deck/
├── round-1-deck.fig (or .key / .pptx)
├── round-1-deck.pdf
├── round-2-deck.fig
├── round-2-deck.pdf
├── sponsor-swap-slides/
│   ├── listenlabs.fig
│   ├── sideshift.fig
│   ├── yc.fig
│   └── ironside.fig
├── presenter-notes.md (talking points per slide; 30s elevator versions)
└── README.md
```

## SUCCESS CRITERIA

- Round 1 deck delivers in 5:00 (presenter-tested)
- Round 2 deck delivers in 3:00 (presenter-tested)
- Each sponsor swap slide is interchangeable: drop-in replacement on slide 13 (R1) / slide 7 (R2)
- Every slide carries the brand system from `pkg-brand-system`
- Buzzword-callouts (Superhumanitarian / Empowerment / Save the Next Generation) appear on slide titles, NOT in voiceover

## DEPENDENCIES

- INPUT: brand-system tokens (pkg-brand-system) — block until Saturday 2 PM
- INPUT: locked headline + product name (Johnny — Saturday 6 PM)
- BLOCKS: pitch rehearsal Saturday 7 PM
- DEADLINE: Saturday 8 PM (feature freeze) for both decks final
