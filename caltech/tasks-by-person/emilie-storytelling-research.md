---
file-type: tasks-by-person
status: scaffold (extracted from PRFAQ canvas yap 2026-04-25; not yet a locked PRD slice)
last-verified: 2026-04-25
locked-by: Johnny verbatim PRFAQ canvas yap
cross-links:
  - ../yaps/2026-04-25-prfaq-canvas/01-high-signal-extracts.md
  - ../../research/wiki/decisions/011-demo-over-execution.md
  - ../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md
  - ../context/team/emilie.md
  - ../ideation/03-pitch-hooks.md
---

# Emilie — Storytelling + research (one spine, three swappable closes)

> **Source:** Johnny's verbatim PRFAQ canvas yap, 2026-04-25. Scaffolding only.

## What Johnny named you'll be doing

The packaging that wins multiple sponsor tracks off a single demo. Concretely:

### Core deliverable: ONE shared script + THREE swappable closes

Same problem statement, same beginning, same middle. Last 1–2 slides change per sponsor. Per Johnny:
- **Ironside close:** *"we gave your machine the ability to feel emotions and process the video"* — brain encoding as a 2nd modality stream the pixel-only pipeline lacks
- **Listen Labs close:** *"the true creativity of mankind requires people to be aware of what's going on so they can branch out"* — solving convergence of society
- **Sideshift / B2C close:** *"the new BeReal — BeReal was fighting against fake social media; this could be fighting against the algorithm"*
- **K2:** covered by the core architecture; no separate close needed
- **Best Use of AI:** the universal wrapper — *"show what every part of the thinking is doing"*

Johnny's exact framing: *"in pitch deck it'll just be change the last one or two slides to match different use case and then we win every single sponsor track."*

### The recording structure Johnny named

> *"I'm recording my laptop so those three videos would be one video technically — or the video can be the same, same problem statement, everything is the same beginning, middle, but then the end is just like to tie it all together — 'this is what it is for you, or this is what it is for you, and this is what it is for you.'"*

Practically: one master cut + three alt closes. When sponsor X comes to the table, you play the version with their close.

## High-signal extracts from the yap (your story spine)

- **Hook (the harm):** algorithms have flattened how everyone's neurons fire — *"everyone's neurons fire the same way and you'll never be able to deviate from these converging paths"*
- **Body (the system in motion):** video → brain → swarm of region-specialists → 3D brain + 3D knowledge graph + clickable reasoning tree
- **Surprise (the wow):** *"reconstructing how a thought travels across your brain"* — the visualization moment when the judge sees thought-as-path
- **Land (the transformation):** *"return human autonomy with the ability to see your thoughts"* + comparison move (*"the comparison reflects on how your thought has already been shaped"*)

## Research you own (per Decision 003 + the lane assignment)

- **Why this matters now** (the cultural-moment framing for the press release)
- **Sponsor-specific framing depth:** what each sponsor is *actually* judging on — not just their public brief
- **The "Best Use of AI" judging rubric** — how past winners (Renaissance Research, the TreeHacks 2026 winners) were scored
- **The Listen Labs Saturday 11 AM talk attendance** — Johnny flagged this is mandatory; you should be there with the team

## Open questions for you to bring back

- **Q-E1.** Hero quote for the press release. The 1-sentence "if this product launched, the customer headline would be ___." Johnny will name; you sharpen.
- **Q-E2.** Which BeReal-style hook actually closes for Sideshift? *"Fighting against fake social media → fighting against the algorithm"* is the seed; the pitch line itself needs one polish pass.
- **Q-E3.** Listen Labs angle has to land on a *specific social phenomenon* (per their narrow brief) — not vague "society sim." Does "convergence of how people think under recommender feeds" qualify? You'll need to confirm at the Saturday talk.
- **Q-E4.** Renaissance Research won this exact prize last year with three colored streams of LLM reasoning. Our version has N specialists per brain region. **What's visible in the first 10 seconds that makes a judge NOT pattern-match to Renaissance?** This is your responsibility because it's a story-and-staging question, not a code question.
- **Q-E5.** What's the hero shot? (The single image that lands on Devpost cover + slide 1.)

## What's NOT yet your problem

- The TRIBE V2 inference pipeline (Junsoo)
- The K2 swarm orchestration (Jacob)
- The architecture defenses (Johnny)

## NEW — Vibe-code / Figma deliverable (locked 2026-04-25 yap)

Johnny named: *"if you make something pretty basic in Figma, or if you want to vibe-code, you could probably vibe-code a pretty cute interface, and hopefully we just map the boxes to have data that comes out from our output."*

Build a **box-mapped Figma mockup** (or vibe-coded HTML) of the Spotify-Wrapped-of-Your-Brain interface. Johnny's lane will map TRIBE/swarm output into your boxes. You don't need to wire any data — just the visual frame.

### Cards to mock (provisional, from Johnny's verbatim list)

- **Card 1 — Top brain regions** (analog: top artist). Big bold region name, illustrative graphic, one-sentence "this is the part of your brain that fired most"
- **Card 2 — Top content categories** (analog: top genre). Ranked list of what subjects the user converged on
- **Card 3 — Age-cohort comparison** (analog: *"my age group was 81"*). One percentile number framed beautifully
- **Card 4 — Brain map summary**. The 3D brain still / hero shot, regions colored by activation level
- **Card 5 — The Land card — inverted brain search.** Click a grayed-out region → "here's content that would activate this part of your brain" (3 suggestions, no recommendation framing — *"we don't want to recommend anything to you. We want to give you accessible information so you can make good judgments."*)
- **Card 6 (optional) — shareable summary**. Designed for export to Stories / TikTok

### Visual language reference

- Spotify Wrapped 2024 (look at any year — the format is consistent)
- BeReal "your year in moments"
- Apple Screen Time wellness recap
- Notion / Linear / Granola design vocabulary for typography

### What the boxes have to expose (Johnny's lane fills these)

Each card needs a labeled `data-source` field that maps to a swarm output. E.g., Card 1's "top region" pulls from `swarm.output.region_ranking[0]`. Document the box-to-data mapping when you ship the mockup.

## NEW — your prior corpus directly fills 3 pitch blockers (2026-04-25 sync)

Per the team-profile + corpus gap-filler analysis (`caltech/validation-findings/2026-04-25-team-gap-fillers.md`), your shipped track record gives you primary ownership of three otherwise-unanswered deliverables:

### 1. The 90-second shot-by-shot — your craft

Acting (PopMart × Vivo commercial) + dance choreography + Stylar AI 6M-view content + Nova Intelligence launch video work — you've shipped 90-second-arc content at scale. Adapting Johnny's Clair de Lune structure into the demo arc is your job.

**Adapt this template (Johnny's published 60s arc structure):**
- Setup → fed 60s of content into the brain
- Methodology → iterative scoring against target fingerprint
- Result → headline number (90.4% match)
- Falsifiability beat → tested against control stimuli, pattern only matches the target
- Tagline → *"if the song disappears and the feeling remains, what was the music really?"*

Port to consumer-feed input: feed → brain → swarm reacts → control toggle (algorithmic vs. non-algorithmic) → reveal — *"manipulation only works in the dark."*

### 2. The Listen Labs viz shape — your translation lane

Your Nova Intelligence work (booth design, launch video, LinkedIn content, data sheets — *"making technical B2B products feel approachable and visually compelling"*) is the bridge between Johnny's already-shipped 20,484-vertex cortical-heatmap visualization and a Listen-Labs-judge-friendly form. The shape is proven (per Johnny's Clair de Lune work); your job is translation.

### 3. The Sideshift consumer share-card — your 6M-view track record

Stylar AI shipped at 6M views — you know what plays as a consumer-AI shareable. The Sideshift close as *"the ingredients-list API for content; creators embed it"* (per Johnny's published "ingredients list for content" frame) needs a consumer-facing share-card that goes viral. **You are the only person on the team who has shipped that.**

## The "startup test" quality bar (per Johnny's locked mandate)

The launch video, Devpost, design system, and landing page have to clear: *"if a stranger looked at the Devpost + launch video + landing page, they should believe it's a real shipping company."* Reference your Nova Intelligence work — same bar, same craft.

## Pitch-translation lane (Claude Campus Ambassador overlap)

When sponsor judges (Listen Labs / Ironside / Sideshift) approach the table and aren't deeply technical, you're the translator. Your Claude Campus Ambassador experience explicitly trained for this — translating AI for non-technical audiences. Pre-script per-sponsor-close talking points so the rest of the team can hand off to you when the judge isn't following the K2/TRIBE depth.

## Schedule guard (per ship-velocity principle 7)

**Polish goes LAST.** Friday night = wireframes, hooks, candidate close lines. Saturday afternoon = polish, hero shot, launch video, Devpost copy. **Do not commit final design Friday night** — the demo case won't be working yet.

## Lane tools

- v0 for any UI components
- Figma / Canva for slides
- Claude / GPT for hook iteration
- The pitch-hooks ideation file at `caltech/ideation/03-pitch-hooks.md` has 15 hooks + 12 closes + the lean-forward audit rubric — **harvest vocabulary, ignore rankings** (Socratic-protocol caveat)

## What you are NOT cleared to do until Johnny locks the PRFAQ

Wait for orchestration green-light. Pre-work allowed:
- Read the emotional-depth deep-dive at `research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md` (8 emotions × 16 mechanics, 90s template)
- Read `caltech/ideation/03-pitch-hooks.md` for vocabulary harvest (NOT recommendations)
- Read the Renaissance Research teardown at `research/wiki/projects/renaissance-research.md` — the closest prior-art lookalike
- Sketch the one-spine + three-closes outline in your own words; bring it to the next sync
