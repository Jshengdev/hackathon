> ⚠️ **[STALE — pre-3-person split]** Lane assignments superseded by `caltech/3-PERSON-PARALLEL-PLAN.md` (Jacob backend / Junsu frontend / Johnny demo). Kept as historical packaging brief.


---
title: "Emilie — Hackathon Packaging Brief"
status: scaffold (Johnny review pending; Emilie owns final execution)
created: 2026-04-25
updated: 2026-04-25
project_name: caltech-hacktech-2026
owner: Emilie Duran
mandate: "entire packaging process" (per Johnny lock 2026-04-25)
quality_bar: "pass the startup test" — fundable consumer product, not hackathon hack
cross-links:
  - ./narration-script-3min.md (the spine — read this first)
  - ./demo-script.md (90s embedded demo)
  - ./prd.md (full project spec)
  - ./context/team/emilie.md (your profile)
---

# Emilie — Your Hackathon Packaging Brief

> Hey. This is the scaffold for everything you own. It's not the final answer — it's the floor you build *up* from. You're the only person on this team with the eye, the craft, and the 6M-view track record to make this not look like a hackathon hack. The brief tells you what's locked and what's yours.

## Read these first (in order, ~30 min total)

1. **`narration-script-3min.md`** — the 3-min Round 2 pitch + demo video spine. **THIS IS YOUR PRIMARY DOCUMENT.** All your deliverables ladder to it.
2. **`demo-script.md`** — the 90s embedded demo (Act 3 of the narration script).
3. **`prd.md` §6** (Sponsor Strategy) — the per-sponsor close lines you'll need slide variants for.
4. *(Optional, if you have time)* **`yaps/2026-04-25-empowerment-synthesis/01-high-signal-extracts.md`** — Johnny's voice + vocabulary; useful for tone calibration.

---

## Your deliverables (the full list)

### 🎬 1. The 3-Minute Demo Video (highest priority — produces in this order)

**What:** A cinematic 3-minute video that doubles as (a) the Devpost submission video and (b) the Round 2 pitch backbone.

**Source spine:** `narration-script-3min.md` — beat-by-beat with visual cues, voiceover blocks, and time codes already locked.

**Sub-deliverables:**
- **(a) Final voiceover script** (clean, time-coded, pacing-marked)
- **(b) Visual cut list** (shot-by-shot — what's on screen at each second)
- **(c) Music + sound design spec** (Black Mirror references for Act 1 + 4; demo-tone for Act 3)
- **(d) Cinematic Act 1 production** (35s — the dystopian setup)
- **(e) Cinematic Act 4 production** (25s — the hopeful close)
- **(f) Demo footage assembly** (100s — Act 3 — uses real demo footage from Johnny + Jacob + Junsoo's pipeline; live OR pre-cached fallback per `demo-script.md`)
- **(g) Color grade + final assembly + audio mix**
- **(h) Caption track** (accessibility + silent-watch viewers)

**Format specs:**
- 16:9 horizontal (Devpost + presentation default)
- 1080p minimum, 4K preferred for cinematic shots
- ~180 seconds total (no slippage past 3:00)
- Export: MP4 H.264 + WAV separate audio bake
- Optional: 9:16 vertical cut for social (15-30s, hero moment only)

**Voiceover talent:**
- **Johnny's verbatim instruction:** *"a really strong good voiceover."* High-quality matters here.
- **Recommended:** ElevenLabs with careful prompt-engineering (cinematic narrator voice for Acts 1+4; warmer "guide" voice for Acts 2+3). Or hire a voice actor on Fiverr/Voice123 with ~24h turnaround.
- **For the 17-year-old voice opening:** ElevenLabs Gen-Z female (or you record yourself if the inflection works).
- **Reference register:** Black Mirror narrator (Acts 1+4) → Apple keynote presenter (Acts 2+3) → Spotify Wrapped intro (BEAT-4).

### 🎨 2. Brand / Design System

**What:** The visual identity that makes everything (video, deck, Devpost, landing page) feel like ONE product.

**Sub-deliverables:**
- **(a) Color palette** (3-5 colors max — recommend cool neutrals + one signal accent)
- **(b) Typography pairing** (display + body — Inter / Söhne / Suisse / your call)
- **(c) Logo concepts** (3 directions, pick one — wordmark + monogram)
- **(d) Wrapped-card design tokens** (spacing, radii, shadow, gradient style for the brain-region heatmap colormaps)
- **(e) Brain-render visual treatment** (what does our cortical mesh look like aesthetically — fire colormap? cool dichroic? bioluminescent?)
- **(f) 3D knowledge-graph node + edge style** (hover state, idle state, light-up animation curve)

**Visual language references (mood board input):**
- **Black Mirror (Series 6) title cards** — for Act 1 + 4 cinematic register
- **Spotify Wrapped 2024** — for the card-by-card output (Cards 1-4)
- **BeReal "your year in moments"** — for the share-card aesthetic
- **Apple Wellness / Screen Time** — for clean data visualization without judgment
- **Notion / Linear / Granola** — for typography + spacing vocabulary
- **Anthropic Console** — for the AI-product-feels-trustworthy register
- **Perplexity Threads** — for the knowledge-graph node visual style

**Anti-references** (per Johnny's locked anti-patterns from his profile):
- ❌ No fitness-app aesthetics (no rings, no streaks, no scores)
- ❌ No dashboard look (no big number tiles, no traffic-light KPIs)
- ❌ No borrowed aesthetics — *"Our taste. Our sauce."* (verbatim Johnny)
- ❌ No corporate-startup polish-for-its-own-sake
- ❌ No art-project stylization ("look how cool our shaders are")
- ❌ No tracker-app look — *"if it looks like a fitness app, delete it"* (Johnny verbatim)

### 🖥️ 3. Wrapped-Style 5-Card Figma Mockup

**What:** The core product UI — what the user actually sees as output. Used in (a) the demo video Act 3 final beats, (b) the Devpost screenshots, (c) the landing page hero.

**Cards to design:**
1. **Top Brain Regions** — use *function names* not anatomical names ("emotion processing" not "amygdala"); anatomical name as small footnote
2. **Top Content Categories** — brutal honesty per Johnny: *"you can't lie about what you consume anymore"* (e.g., "True Crime, AI Fitness, Relatable Sadness, Trending Dances")
3. **Cohort Brain-Print** — comparison card (e.g., "Gen-Z 2008-2010 | Your neural pattern: 91% match to peers"). **Sally's UX fix locked: comparison must DISAGREE with intuition** — show "you're MORE converged than 88% of peers" or "you DIVERGE on philosophy content," not just a percentile number
4. **Brain Map Summary** — the still 3D brain (hero shot for share-export)
5. **The Land Card (HERO)** — pick a grayed-out region → see content formats that would activate it. Per Johnny's positioning: NOT recommendations, content **formats** (long-form essays, poetry, language-learning, wordplay)

**Box-to-data mapping:** each card has data-source fields that Johnny's lane will wire up. Document these in your Figma file as labeled placeholders.

### 📄 4. Devpost Writeup

**What:** The Devpost project page — the asynchronous reader experience.

**Source template:** `research-context/008-devpost-exemplars-mindpad-terralink.md` — has the structure mapped section-by-section to our content.

**Sub-deliverables:**
- **(a) Inspiration** (civilizational stakes + specific platforms named — Spotify/YouTube/Reels)
- **(b) What it does** (single paragraph + 4 bolded-verb features: Visualize / Decode / Compare / Branch Out)
- **(c) How we built it** (numbered architecture-as-pipeline: TRIBE → unique inference → K2 swarm → Opus synthesis → 3D viz; concrete metrics like "~20K cortical vertices, 1Hz prediction, 90.4% Clair de Lune precedent")
- **(d) Challenges** (4 terse bullets — no defensiveness)
- **(e) Accomplishments** (values-first, not features-first)
- **(f) What we learned** (sentence-form transferable lessons)
- **(g) What's next** (concrete named roadmap items)
- **(h) Built With** (flat tag list)
- **(i) Project tags** (sponsor track sub-submissions: Best Use of AI, Creativity, Listen Labs, Sideshift, Ironside, IFM K2, YC, MLH challenges)
- **(j) Cover image + screenshots** (uses your card mockups + brain-render frame)
- **(k) Demo video embed** (the 3-min video from deliverable #1)

### 🎤 5. Pitch Decks (×2)

**What:** Slide decks backing the live pitches.

**Round 1 — 5-min depth pitch:**
- 12-15 slides
- Deeper architecture detail (the 4-layer pipeline diagrammed)
- Includes the BCI / future-vision argument (per `prd.md` §6)
- Includes the YEA/NAY rubric slide (Best Use of AI argument)
- Includes the Clair de Lune credibility chip slide (Johnny's published precedent)

**Round 2 — 3-min punchy pitch:**
- 6-8 slides
- Backs the 3-min narration script directly
- One slide per Act, plus one sponsor close swap

**Sponsor close swap slides (per `prd.md` §6):**
- Listen Labs swap slide
- Sideshift swap slide
- YC swap slide
- Ironside swap slide

**Deck buzzword bank (per Johnny — OK for slide titles, NOT for voiceover):**
- Superhumanitarian (Johnny's coinage)
- Empowerment
- Save the next generation

### 🌐 6. Landing Page (optional but high-leverage)

**What:** A static one-pager that judges who scan the QR code reach.

**Sub-deliverables:**
- Hero section (headline + tagline + 1 hero shot)
- Demo video embed
- "How it works" section (the 4-layer pipeline as a scrolling visual)
- Sponsor logos
- Sign-up / waitlist (optional)

**Tooling:** Framer or Vercel + your favorite static-site stack. Johnny + Junsoo can wire up if needed.

### 📱 7. Social Content (optional, post-submission)

**What:** Shareable assets for LinkedIn / X / Instagram if we want to drive views.

**Sub-deliverables:**
- LinkedIn announcement post (use Johnny's vocabulary; civilizational-stakes opener)
- X thread (5-7 posts; one per architecture layer)
- 9:16 vertical cut of the hero moment (for Instagram Reels / TikTok — meta given the topic)
- Thumbnail / cover image for the demo video

---

## What's locked (don't change)

| Lock | Source |
|---|---|
| 3-minute total runtime | Johnny verbatim |
| 30-40s cinematic Act 1 + 25s cinematic Act 4 | Johnny verbatim |
| ~100s Act 3 demo content | derived from above |
| Black Mirror tonal opener | Johnny verbatim |
| Specific platforms named (Spotify / YouTube / Reels) | Johnny verbatim |
| Empowerment angle / third option trilemma | Johnny verbatim |
| BCI flash-forward in Act 1 + design-pattern-for-the-decade close in Act 4 | Johnny verbatim 2026-04-25 |
| 4-layer architecture (TRIBE → unique inference → K2 swarm → Opus synthesis → viz) | locked |
| Inverted-brain-search Land card as hero | locked |
| "We don't recommend, we surface options" positioning | Johnny verbatim |
| The Wrapped-style card output shape | locked |
| Hover-bridge mechanic for cross-region visualization | locked |
| Anti-patterns from Johnny's profile (no fitness-app, no scores, no dashboards, no borrowed aesthetics) | Johnny published corpus |

## What's yours (make it better)

| Open | Your call |
|---|---|
| Voiceover talent + register exact pick | yours |
| Music + sound design specifics | yours |
| Color palette (within "no borrowed aesthetics" constraint) | yours |
| Typography pairing | yours |
| Logo concepts | yours |
| Cinematic shot composition | yours |
| Wrapped-card visual styling (within reference-pattern set) | yours |
| Brand voice in deck slides | yours |
| Devpost prose voicing (use Johnny's vocabulary as a register reference) | yours |
| Landing page layout | yours |
| Social content angle + cuts | yours |
| Final headline polish | shared with Johnny |
| Final product name pick | Johnny's call (from a candidate set he'll provide) |

## Story note from Sophia (validation pass 2 just landed)

A storyteller-validation agent flagged ONE specific narrative weakness worth your attention as you build the cinematic Acts:

> **The inciting incident whispers when it should roar.** The 17-year-old voice opens with: *"I don't even know which thoughts are mine anymore."* Sophia's recommended single-line rewrite: *"I've tried to think for myself, but every time I do, the algorithm pulls me back. I've given up trying."*
>
> The reasoning: McKee says inciting incidents must FORCE the protagonist's world to become untenable. Currently the teenager is *invited* to a third option; the rewrite makes her *desperate* for one. The third door becomes a rescue, not a suggestion.

You have full discretion on whether to take this rewrite. If it makes the opening stronger in your read, fold it in. If your instinct disagrees, trust your instinct — you have the storytelling craft and 6M-view track record. This is a flag, not a mandate.

---

## Schedule guard (per ship-velocity principle 7 — POLISH GOES LAST)

| Window | What you do |
|---|---|
| **Friday night** | Wireframes only. Card sketches in Figma. Mood-board reference compile. Voiceover talent picked. Music style locked. **Do NOT polish anything Friday.** |
| **Saturday morning** | Get the demo footage from Johnny/Jacob/Junsoo (live or pre-cached). Begin Act 1 + 4 cinematic shoots/renders. Lock voiceover script for talent. |
| **Saturday afternoon** | Polish phase. Cards finalized. Landing page assembled. Devpost draft written. Color grade demo footage. |
| **Saturday 8 PM** | Feature freeze (per Decision 012). After this, only assembly + final polish. |
| **Saturday 8 PM – 11 PM** | Final video assembly + audio mix. Devpost upload. Pitch deck finalized. |
| **Saturday 11 PM** | Submit (10 hour buffer before Sunday 9 AM hard deadline). |
| **Sunday 9 AM** | Hard deadline. |

## What you need from the rest of the team (and when)

| From | What | By when |
|---|---|---|
| **Johnny** | Final headline + product name pick | Saturday 6 PM |
| **Johnny** | Demo footage / live pipeline ready | Saturday morning |
| **Jacob** | K2 swarm output JSON shape locked (so card data-source fields can wire up) | Friday 6 PM |
| **Junsoo** | TRIBE V2 pre-recorded fallback footage if live latency exceeds budget | Saturday 8 AM |
| **Jacob** | Pre-recorded 30s bridge-animation MP4 (BEAT-2 fallback) | Saturday 8 AM |
| **Junsoo** | Pre-recorded 20s side-by-side meshes MP4 (BEAT-3 fallback) | Saturday 8 AM |
| **Johnny** | Specific Ironside use-case angle confirmation (locked but he should sanity-check) | Saturday 12 PM |
| **Johnny** | YC monetization path pick (database-FOR-you vs. local-first) | Saturday 8 PM (only matters for YC swap slide) |

## Quality bar (Johnny verbatim, locked 2026-04-25)

> **"Pass the startup test."** If a stranger looked at the Devpost + launch video + landing page, they should believe it's a real shipping company.

This is the bar. Not "looks polished for a hackathon." Not "good for a 36-hour build." **Real-shipping-company.**

You have the track record (Perfit founder, Nova Intelligence marketing, Stylar AI 6M-view content, Claude Campus Ambassador). This is your craft. The team is leaning on you to bring everything else up to your level.

## Tooling-support call

Johnny mentioned: *"Emilie can lean on hackathon-packaging tutorials to ramp on Devpost best practices, demo-video formats, launch-video conventions."*

Recommended quick references:
- **Devpost format:** the two exemplars in `research-context/008-devpost-exemplars-mindpad-terralink.md`
- **Demo video pacing:** TreeHacks 2026 winner videos — Mira, Tribune, Synapse all clear our quality bar
- **Cinematic Act 1 / Act 4 references:** Black Mirror Series 6 title sequences; Severance opening credits; Apple Vision Pro launch
- **Wrapped-card animation reference:** Spotify Wrapped 2024 official video walkthrough

## Your superpower (Johnny's read)

> *"She has really good [taste] for the sauce and figuring out the visualization of the demo and telling a story and recording live video and then mic."*

Translation: this brief gets you the scaffold. The taste, the sauce, the story, the recording — that's all you. We're not telling you how to make it good. We're telling you what we need so you have the runway to make it great.

---

## Open items where you'll need to make calls

1. Voiceover talent pick (ElevenLabs vs. hire vs. record yourself — your call)
2. 9:16 vertical social cut yes/no (your call — depends on time)
3. Landing page yes/no (your call — high leverage but optional)
4. Logo direction (3 concepts → pick one)
5. Color palette specifics (within the no-borrowed-aesthetics constraint)
6. Typography pairing
7. Whether to take Sophia's "inciting incident" rewrite suggestion (your call)
8. Music — original vs. licensed vs. royalty-free library
9. Whether to use the buzzword "Superhumanitarian" anywhere visible (deck title? product subtitle? skip?)
10. Caption styling

You've got this.
