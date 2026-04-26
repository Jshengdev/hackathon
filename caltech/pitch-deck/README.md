# caltech pitch-deck

Pitch deck for the Caltech HackTech 2026 entry. Backs the 5-min Round 1 + 3-min Round 2 pitches and the Acts 1 + 4 video.

Mirrors the architecture of `lstud/workshop/apps/shpatial-deck` (Johnny's Reality Shift deck). Stack: Next.js 16 + React 19 + Tailwind 4 + Remotion 4 + p5-wrapper.

---

## quick start

```bash
cd /Users/johnnysheng/code/hackathon/caltech/pitch-deck
pnpm install        # or npm install
pnpm dev            # → http://localhost:3000
```

Routes:

| route | what | slides |
|---|---|---|
| `/` | landing index | nav links to all decks |
| `/round-1` | 5-min depth deck | 13 |
| `/round-2` | 3-min punchy deck | 8 |
| `/sponsor/listenlabs` | sponsor swap variant | 1 |
| `/sponsor/sideshift` | sponsor swap variant | 1 |
| `/sponsor/yc` | sponsor swap variant | 1 |
| `/sponsor/ironside` | sponsor swap variant | 1 |

Keyboard nav (round-1 / round-2): `↑ ↓` `Space` `PageUp/PageDown` `Home` `End`. Click the right-side dots to jump.

---

## what's locked vs. [TBD-FINAL-PASS]

**LOCKED (per `caltech/prd-final.md` + `caltech/narration-script-3min.md`):**
- The transformation: *"Return human autonomy with the ability to see your thoughts."*
- Headline direction: *"You can't see how the algorithm shapes your thinking. We made it visible."*
- Hero mechanic: Inverted-Brain-Search Land card (click a grayed region → content formats, not recommendations)
- 4-layer architecture: TRIBE V2 → K2 swarm → Claude Opus → 3D viz
- 90s demo beats (BEAT-1 through BEAT-4)
- YEA/NAY rubric for Best Use of AI
- Clair de Lune 90.4% credibility chip
- Anchor quotes from Johnny's published corpus (`research-context/007-johnny-public-corpus-tribe-posts.md`)
- 4 sponsor swap one-liners (verbatim from PRD §6)

**[TBD-FINAL-PASS] — Sat 6 PM lock per Johnny's "draft everything at end" doctrine:**
- Final headline polish
- Product name (candidates: Lights On / Daylight / Mirror / Brainline / Ingredients / Garden Mode)
- Per-sponsor close-line wording polish
- Per-sponsor specific ask wording
- BEAT-4 user-quote register (chorus vs single 17-yo)
- Demo MP4 swap (currently uses `/clips/glasses-scan.mp4` placeholder)

The `<TBD>` chips on slides flag these inline.

---

## visual register

- **Palette:** ivory `#f7f5f0` + deep indigo `#3730a3` + muted sepia `#6b5d4c`. Cortical activation gradient (warm pink → amber) defined as `--activation-warm` / `--activation-hot` for the brain visuals.
- **Type:** DM Mono (display + monospace anchor quotes, italic for emotional) / DM Sans (chrome). Locked from spatial reference.
- **Negative space:** 60%+ blank canvas per slide. Single emotional beat per slide.
- **Anti-patterns LOCKED:** no fitness-app aesthetics · no dashboard look · no borrowed aesthetics · no art-project stylization · no scores / KPIs / leaderboards / streaks.

> ⚠️  **Palette open question:** `caltech/tier-2-epics/pkg-brand-system.md` flags two candidates for the cortical-mesh activation gradient — *fire (hot-pink → amber, neuroscience-credible)* OR *bioluminescent-cool (cinematic)*. The current palette uses a hybrid: cool indigo for chrome + warm pink-to-amber for activation. **Flag for Johnny.**

---

## architecture

```
app/
├── page.tsx                       # landing index (server component, links to decks)
├── layout.tsx                     # root layout · DM Mono + DM Sans fonts
├── globals.css                    # palette tokens · typography · animations
├── round-1/page.tsx               # 13-slide deck (use-client) · 5-min Round 1
├── round-2/page.tsx               # 8-slide deck (use-client) · 3-min Round 2
├── sponsor/[sponsor]/page.tsx     # dynamic 1-slide variant per sponsor
└── components/
    ├── Deck.tsx                   # NEW — shared deck shell (NavDots + scroll + keyboard)
    ├── SlideKit.tsx               # NEW — Kicker / HalftoneBlock / VideoBlock / AnchorQuote / TBD
    ├── SlideFrame.tsx             # slide section wrapper (max-w 1440 · counter)
    ├── NavDots.tsx                # right-side click-to-jump nav
    ├── ScrollHint.tsx             # bottom-center scroll cue
    ├── RedDot.tsx                 # absolute-positioned accent dot (live indicator)
    ├── Halftone.tsx               # client-side wrapper around HalftoneCanvas
    └── HalftoneCanvas.tsx         # p5.js generative halftones (15 variants)
remotion/                          # video-export pipeline (mirrors shpatial)
public/clips/                      # 7 placeholder MP4s — replace with HackTech assets
scripts/screenshot.mjs             # playwright screenshot capture per route
```

---

## adding a slide

In the relevant route file (e.g. `app/round-1/page.tsx`), append to the `slides` array:

```tsx
{
  id: "my-slide",
  render: () => (
    <>
      <RedDot top="10%" left="10%" />
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 enter">
        <div className="flex flex-col gap-6 max-w-xl">
          <Kicker>section label</Kicker>
          <h2 className="display-mono ink text-5xl md:text-7xl leading-[0.95] lowercase">
            heading <span className="grad">accent.</span>
          </h2>
          <AnchorQuote attribution="source">italic quote here.</AnchorQuote>
        </div>
        <div className="justify-self-end">
          <HalftoneBlock variant="constellation" seed={42} size={500} />
        </div>
      </div>
    </>
  ),
},
```

Halftone variants available: `portrait`, `glasses`, `plant`, `hand`, `room`, `vault`, `feed-grid`, `silhouette`, `dissolve`, `particles`, `empty-frame`, `constellation`, `spiral`, `orbit`, `scatter`.

---

## screenshots

```bash
pnpm dev            # in one terminal
node scripts/screenshot.mjs  # in another — captures slide-NN.png to ./screenshots
```

The script loops through `/round-1`, `/round-2`, and each `/sponsor/*` route. Output filenames: `round-1-NN.png`, `round-2-NN.png`, `sponsor-listenlabs-01.png`, etc.

---

## remotion video export

Carried over from shpatial. `remotion/Root.tsx` defines 7 compositions (1920×1080@30fps). Per-slide animations use `useCurrentFrame()` + `interpolate()`.

```bash
pnpm remotion              # studio at :3001
pnpm remotion:render       # outputs MP4 to ./remotion-out
```

The `remotion/palette.ts` is hand-mirrored from `app/globals.css` — keep in sync when palette changes.

---

## handoff notes

- Source-of-truth doctrines (per `caltech/prd-final.md` + activation prompt):
  - Socratic protocol — reflect, never propose new directions
  - Pitch-vs-product — block ONLY on pitch issues
  - Smallest possible circle
  - Demo-over-execution
  - Draft everything at the end — `[TBD-FINAL-PASS]` markers visible
  - Now-vs-future split

- The `<TBD>` chip is rendered in `SlideKit.tsx` so every placeholder is grep-able and visually distinct on the slide.
- Reach: pitch deck for Round 1+2 freeze is **Saturday 8 PM PDT** per the activation prompt.

— see `presenter-notes.md` for per-slide talking points + 30s elevator versions.
