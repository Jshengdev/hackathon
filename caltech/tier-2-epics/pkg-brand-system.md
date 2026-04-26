---
file-type: tier-2-epic
status: spec — fresh-Claude-spawn-ready
worktree: .worktrees/pkg-brand-system
owner: Emilie + brand-system Claude
duration_estimate: 3-4 person-hours (Saturday morning + early afternoon)
last-verified: 2026-04-25
---

# Tier-2 Epic — Brand / Design System

> Spawn pattern: `git worktree add .worktrees/pkg-brand-system && tmux new-window -n pkg-brand 'cd .worktrees/pkg-brand-system && claude'`

## Mission

Define the visual identity that unifies the 3-min video, Wrapped cards, Devpost, pitch deck, and landing page into ONE shipping-startup-grade product surface.

## INPUT (read these in order)

1. `caltech/emilie-brief.md` (your operator brief — start here)
2. `caltech/prd.md` §1 + §3 + §6 (positioning + architecture + sponsor strategy)
3. `caltech/context/team/johnny.md` (the anti-patterns from Johnny's published corpus — load-bearing constraints)
4. `caltech/research-context/004-spotify-wrapped-as-format.md` (output-shape format reference)

## DELIVERABLES

### 1. Color palette (3-5 colors)
- 2 cool neutrals (background + surface)
- 1 signal accent (used for activation gradients on the brain mesh)
- Optional: 1 warm secondary for emphasis
- Document: `palette.json` with hex + tailwind tokens + when-to-use

### 2. Typography pairing
- Display font (headline + tagline) — recommend Inter Display, Söhne, Suisse, Tiempos, ABC Diatype
- Body font (paragraph + UI) — Inter, IBM Plex Sans, or display's body weight
- Document: `typography.json` with font names + weights + sizes (display: 48/72/96, body: 14/16/18) + line-height + letter-spacing

### 3. Logo concepts (3 directions, pick one)
- Option seeds from Johnny's vocabulary: *Lights On / Daylight / Mirror / Brainline / Ingredients / Garden Mode*
- Each concept: wordmark + monogram
- Final pick: vector SVG + 3 sizes (favicon 32px, badge 128px, hero 512px)

### 4. Wrapped-card design tokens
- Card dimensions (mobile: 9:16; presentation: 16:9 export option)
- Spacing: 16/24/32 grid; radii: 16/24/32; shadow: subtle layered (no harsh drops)
- Gradient style for brain-region heatmaps (hot-pink-to-yellow per `demo-script.md`, OR cooler dichroic — make the call)
- Animation: card-enter (fade+rise 200ms cubic-bezier), card-swipe (300ms), data-pulse (1Hz sync with TRIBE timing)

### 5. Brain-render visual treatment
- Cortical mesh aesthetic: fire colormap (hot-pink-to-yellow, neuroscience-credible) OR bioluminescent-cool (more cinematic, less clinical)
- Activation glow: radial blur + emissive
- Idle state: dark gray translucent
- 3D knowledge-graph node + edge style (idle: gray translucent; hover: light up with reasoning fragment label)

### 6. Slide-deck design system
- Master slide template (16:9, brand colors applied)
- 5 layout templates: title / data / quote / architecture-diagram / sponsor-close
- Buzzword-callout style for slide titles: *Superhumanitarian / Empowerment / Save the Next Generation* (per Johnny's deck-only vocabulary)

## ANTI-PATTERNS LOCKED (per `caltech/context/team/johnny.md`)

❌ NO fitness-app aesthetics (no rings, streaks, scores)
❌ NO dashboard look (no big-number tiles, no traffic-light KPIs)
❌ NO borrowed aesthetics — *"Our taste. Our sauce."*
❌ NO startup-polish-for-its-own-sake
❌ NO art-project stylization
❌ NO tracker-app look — *"if it looks like a fitness app, delete it"*

## REFERENCES (mood board)

- Black Mirror Series 6 title cards (Acts 1+4 of video)
- Spotify Wrapped 2024 (card format)
- BeReal "year in moments" (anti-curation honesty)
- Apple Wellness / Screen Time (clean data-viz without judgment)
- Notion / Linear / Granola (typography + spacing vocabulary)
- Anthropic Console (AI-product-feels-trustworthy register)
- Perplexity Threads (knowledge-graph node style)

## OUTPUT FORMAT

```
.worktrees/pkg-brand-system/
├── palette.json
├── typography.json
├── logo/
│   ├── concept-1/ (vector + raster)
│   ├── concept-2/
│   └── concept-3/
├── wrapped-cards/
│   ├── tokens.json
│   └── card-template.fig (or HTML/CSS)
├── brain-render/
│   ├── colormap-spec.md
│   └── reference-frames/
├── slide-deck/
│   ├── master-template.fig
│   └── layout-variants/
└── README.md (brand bible — how to use everything)
```

## SUCCESS CRITERIA

A stranger looks at any single artifact (Wrapped card, deck slide, landing page, video frame) and recognizes it as the same product. The brand passes the *"startup test"* — fundable consumer product feel, not hackathon hack.

## DEPENDENCIES

- INPUT: positioning + locked vocabulary from PRD
- BLOCKS: pkg-pitch-deck, pkg-landing-page, pkg-social-content, pkg-devpost (visual assembly)
- DEADLINE: Saturday 2 PM (so dependents can start by 3 PM)
