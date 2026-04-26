---
file-type: tier-2-epic
status: spec — fresh-Claude-spawn-ready
worktree: .worktrees/pkg-landing-page
owner: Emilie + landing-page Claude
duration_estimate: 3 person-hours (Saturday afternoon)
last-verified: 2026-04-25
---

# Tier-2 Epic — Landing Page

## Mission

A static one-pager that judges, sponsors, and viral-scrollers reach when they scan the QR code on the demo slide or click through from social. Vercel-deployable. Mobile-first.

## INPUT

1. `caltech/emilie-brief.md` §6
2. `caltech/prd.md` §1, §3, §6
3. `caltech/narration-script-3min.md` (the demo video embeds here)
4. `.worktrees/pkg-brand-system/` (typography, colors, tokens)
5. `.worktrees/pkg-demo-video/final-cut.mp4` (when available)

## SECTIONS (in order, mobile-scrollable)

### Hero (above fold)
- Final headline (locked at end)
- Product name
- Subheadline: *"Use AI. See what it's doing to you. Choose."*
- One CTA: "Watch 3 min" → autoplay video on click
- Background: subtle cortical-mesh animation (low-fi loop, no audio)

### What it does (3 bullets, icon + headline + 1-line)
- 🧠 **See your brain on the algorithm.** TRIBE V2 + K2 swarm visualizes how each piece of content shapes your neural response.
- 🔓 **Audit the AI auditing you.** Hover any region; the swarm's reasoning lights up. Two layers un-black-boxed.
- 🌱 **Branch out, on your terms.** Click a region your feed never touched. See what would activate it. We don't recommend — we surface.

### Demo embed
- Inline 3-min demo video (the cinematic + demo cut from `pkg-demo-video`)
- Captions enabled by default

### How it works (architecture-as-pipeline visual)
- 4 layers stacked: TRIBE V2 → unique inference → K2 swarm → Opus synthesis → Visualization
- Each layer: name + 1-line + small icon
- Reference: TerraLink Devpost shape (per `research-context/008-devpost-exemplars-mindpad-terralink.md`)

### Why now (the future-vision argument)
- Two-column: Today (Reels) | Tomorrow (BCI)
- Same trilemma, escalating stakes
- Closing line: *"We're building the design pattern for human-AI partnership before the cognitive interface becomes invisible."*

### Real verification — the Clair de Lune chip
- One callout block: 90.4% emotion-center match, 8 iterative rounds, falsified against control stimuli
- Link to Johnny's public post

### Sponsor logos (footer above)
- IFM K2, Listen Labs, Ironside, Sideshift, YC, MLH
- All grayscale; subtle hover for color

### Footer
- Team names + LinkedIns
- Devpost link
- GitHub link
- Sign-up / waitlist (optional — Substack-style email field)

## TECHNICAL SPEC

- Stack: Next.js + Tailwind (or Astro if Emilie prefers static-first)
- Vercel deploy
- Mobile-first, breakpoints at 640 / 768 / 1024 / 1280
- Performance budget: <100KB JS, <200KB CSS, video lazy-loaded
- Lighthouse: 95+ on mobile (Performance / Accessibility / Best Practices / SEO)

## OUTPUT FORMAT

```
.worktrees/pkg-landing-page/
├── app/page.tsx (or src/index.astro)
├── public/
│   ├── demo-video.mp4 (symlink or copy)
│   └── og-image.png
├── components/
│   ├── Hero.tsx
│   ├── FeatureBullets.tsx
│   ├── DemoEmbed.tsx
│   ├── ArchPipeline.tsx
│   ├── WhyNow.tsx
│   ├── ClairDeLuneChip.tsx
│   ├── SponsorLogos.tsx
│   └── Footer.tsx
├── tailwind.config.ts (uses pkg-brand-system tokens)
├── vercel.json
└── README.md
```

## SUCCESS CRITERIA

- Loads in <2s on mobile 4G
- All 4 sponsor logos visible
- Demo video plays inline without leaving page
- Empowerment angle visible above fold
- Brand-system consistent (matches pitch deck + Wrapped cards)
- Devpost screenshot-friendly (the page itself becomes a Devpost asset)

## DEPENDENCIES

- INPUT: brand-system tokens (Saturday 2 PM)
- INPUT: demo video final cut (Saturday 5 PM)
- BLOCKS: Devpost asset upload (landing page screenshot)
- DEADLINE: Saturday 7 PM
