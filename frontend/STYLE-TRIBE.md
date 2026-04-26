# STYLE-TRIBE.md — Visual language for the Empathy Layer demo

This is the canonical style guide for the **TRIBE V2-inspired reskin** of the
HackTech 2026 Empathy Layer frontend. Every panel, popup, and stage in the
demo should read against the language captured here.

The reference materials live in `/tmp/tribev2-ref/` (TRIBE V2's own landing
page, `index.css`, computed body styles). The reduction below is what we
adopted into `frontend/src/styles/tribe-tokens.css`.

The brand language is deliberately **quiet and scientific**: pure-black
canvas, smoke-gray body type, white headlines, warm-heat activation pops
on the brain mesh, generous negative space. We are imitating a research
preview, not a product launch.

---

## 1. Color tokens

All colors are CSS custom properties on `:root`. Use the variable, not the
hex literal — that way the heat ramp can be retuned in one place if Junsu
tweaks the colormap in `colors.js`.

### Surface

| Token                  | Value     | Use                                   |
| ---------------------- | --------- | ------------------------------------- |
| `--tribe-bg`           | `#000000` | hero / page canvas                    |
| `--tribe-bg-near`      | `#050505` | inset cards, slight depth             |
| `--tribe-bg-card`      | `#0a0a0a` | modal panels, control rails           |
| `--tribe-bg-elevated`  | `#111111` | hover surface for interactive cards   |

> Pure black is correct. Don't fade to navy or charcoal — the warm-heat
> activation gradient only sings against `#000`.

### Ink

| Token                  | Value     | Use                                       |
| ---------------------- | --------- | ----------------------------------------- |
| `--tribe-ink`          | `#ffffff` | display headlines, primary text           |
| `--tribe-ink-soft`     | `#e5e7eb` | secondary headlines                        |
| `--tribe-smoke`        | `#465a69` | **body text** (TRIBE V2's exact body color) |
| `--tribe-smoke-soft`   | `#6b7280` | mid-gray, captions                         |
| `--tribe-mute`         | `#4b5563` | de-emphasized labels                       |
| `--tribe-mute-soft`    | `#374151` | disabled state                             |

Body copy is **not white**. TRIBE's body is `#465a69`, a slate smoke that
sits between dim and readable on `#000`. Use white only for headlines,
active controls, and focused state.

### Hairlines

| Token                  | Value                       | Use                  |
| ---------------------- | --------------------------- | -------------------- |
| `--tribe-hair`         | `rgba(255,255,255,0.08)`    | default border       |
| `--tribe-hair-strong`  | `rgba(255,255,255,0.16)`    | hover border         |
| `--tribe-hair-faint`   | `rgba(255,255,255,0.04)`    | subdivider           |

We separate elements with hairlines, not boxes. A `1px` rule at
`rgba(255,255,255,0.08)` is the most common piece of UI chrome.

### Accent (warm yellow)

| Token                  | Value     | Use                                      |
| ---------------------- | --------- | ---------------------------------------- |
| `--tribe-accent`       | `#f9c850` | hover affordance, focused border         |
| `--tribe-accent-soft`  | `#ffd84a` | brighter peak (rare; legend tip only)    |
| `--tribe-accent-warm`  | `#f9a000` | deeper amber (mid-heat; gradient stop)   |
| `--tribe-accent-line`  | `rgba(249,200,80,0.3)` | accent hairline             |

Use `--tribe-accent` once or twice per screen — not as a fill, but as a
border/outline on the *one* thing the user should look at. If everything
is yellow, nothing is.

### Activation colormap (warm-heat ramp)

| Token             | Value     |
| ----------------- | --------- |
| `--tribe-heat-1`  | `#1a0000` (sub-threshold) |
| `--tribe-heat-2`  | `#5a1100` (low)           |
| `--tribe-heat-3`  | `#d83a00` (mid)           |
| `--tribe-heat-4`  | `#f9a000` (high)          |
| `--tribe-heat-5`  | `#ffd84a` (peak)          |
| `--tribe-heat-6`  | `#ffffff` (hot peak)      |

A composed `--tribe-heat-gradient` linear gradient is exposed for legend
bars and inline swatches. Stops: `0% 18% 42% 64% 82% 100%`.

> The hex stops are calibrated to the screenshots in `/tmp/tribev2-ref/`.
> Do not introduce a "cool stop" on this ramp — TRIBE uses one-tailed warm
> activation only. (Our prior project used a blueberry → pomegranate ramp;
> that is **not** the TRIBE language.)

### Failure / control accent

| Token              | Value     | Use                                     |
| ------------------ | --------- | --------------------------------------- |
| `--tribe-fail`     | `#fc7981` | "FAILED" badges, error border           |
| `--tribe-fail-soft`| `rgba(252,121,129,0.25)` | error glow             |

Per `caltech/CONSTRAINTS.md`, failures must be visible. Don't substitute a
generic gray "loading" state for a real failure — render the badge.

---

## 2. Type tokens

### Families

| Token                | Stack                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `--tribe-font-display` | `"Optimistic Display", "Inter", "Inter Display", system-ui, -apple-system, sans-serif` |
| `--tribe-font-body`    | `"Optimistic Text", "Inter", system-ui, -apple-system, sans-serif`                                                                  |
| `--tribe-font-mono`    | `"JetBrains Mono", "SF Mono", ui-monospace, monospace`                                                                              |

Optimistic is Meta's proprietary face — the .woff2 files are in
`/tmp/tribev2-ref/` for visual reference but are **not** redistributable
in our build. We ship Inter as the public fallback, which renders close
enough to Optimistic Text/Display for the demo. JetBrains Mono is used
for tickers, frame counters, and small labels.

### Scale

| Token                  | Value                          | Use                                       |
| ---------------------- | ------------------------------ | ----------------------------------------- |
| `--tribe-hero-title`   | `clamp(48px, 6vw, 88px)`       | hero H1                                   |
| `--tribe-hero-sub`     | `clamp(15px, 1.1vw, 18px)`     | hero subtitle                             |
| `--tribe-section-title`| `clamp(32px, 3.4vw, 48px)`     | section H2                                |
| `--tribe-body`         | `16px`                         | paragraph                                  |
| `--tribe-body-lh`      | `24px`                         | paragraph line-height                      |
| `--tribe-label`        | `11px`                         | uppercase eyebrow / tag                    |
| `--tribe-mono-small`   | `10px`                         | mono micro-label                           |

### Tracking

- Display: `-0.025em` (tight on big type — TRIBE's H1 reads almost optical)
- Body: `0`
- Uppercase labels: `0.18em` (loose; lets the eyebrows breathe)

### Weight

- Display headlines: 600 (semibold). Optimistic ships `Md`, `SBd`, `Bd` — we
  match the SBd weight in screenshots.
- Body: 400.
- Labels and uppercase tags: 500.

> Headlines are **never bold (700+)**. Semibold + tight tracking is the
> entire visual signature.

---

## 3. Layout patterns

### Hero (LandingStage)

```
┌────────────────────────────────────────────────────────────────────┐
│  TRIBE v2                  ⌐⊜⌐ Meta            Code  Weights  Paper │  ← top rail
│  [a research demo]                                                  │
│                                                                    │
│   [LEFT BRAIN MESH]      An AI Model of the      [RIGHT BRAIN MESH] │  ← hero
│   Actual brain activity      Human Mind           Predicted activity │
│                                                                    │
│                       Drop a clip to begin                          │
│                       [ ↑ Drop an MP4 here ]                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

- Page is centered horizontally and vertically.
- The hero text sits between two **flanking brain meshes** — one
  hemisphere left, one hemisphere right, each with subtle warm-heat
  patches.
- Eyebrow rows (`actual brain activity` / `predicted brain activity`)
  sit above the brains in `--tribe-smoke` at the `--tribe-label` size.
- Subtitle paragraph: 18px body in `--tribe-smoke`, max-width ~520px.
- Single primary CTA (the drop zone), pill-shaped with hairline border.

### Section heading (used by MainStage panels)

```
Mapping Brain Functions: The         ╭───────╮
Challenge of Scale                   │ ▶ ⊞   │  ← optional inline control buttons
For decades, neuroscience has...     ╰───────╯

[body paragraphs in --tribe-smoke]
```

- Section title in `--tribe-font-display`, `--tribe-section-title`,
  `--tribe-ink`, weight 600.
- Body paragraphs immediately under it in `--tribe-smoke`.
- Right side gets the live demo / canvas. Two-column split is
  ~55/45 with a generous 80px gutter on desktop.

### Control panel — horizontal pill tabs

The TRIBE V2 demo controls are rendered as a horizontal strip of pill
tabs (`Predicted | Open | Close | Normal | Inflated`) and a lower row of
secondary tabs (`Performance | In-Silico | Multimodality`).

- Each pill: `padding: 8px 16px`, `border-radius: 9999px`, border-width
  `1px` at `--tribe-hair`, font 13px, ink color.
- Active pill: border becomes `--tribe-ink`, background
  `rgba(255,255,255,0.04)`.
- Hover pill: border becomes `--tribe-accent`, ink stays white.

The `.tribe-pill` utility class in `tribe-tokens.css` already encodes
this — prefer it over re-rolling.

### Legend bar (correlation / activity)

Top-right of the brain canvas in TRIBE:

```
0.0  ▓▓▓▒▒░░░░  0.4
        Correlation
```

- A `--tribe-heat-gradient` strip, 120px × 6px, rounded `2px`.
- Tick labels (`0.0` / `0.4` or `Low` / `High`) in `.tribe-mono` color
  `--tribe-smoke-soft`.
- Caption underneath in `.tribe-label` style (`Correlation`, `Activity`).

---

## 4. Motion

- Duration tokens: `--tribe-dur-fast` (120ms), `--tribe-dur-base`
  (240ms), `--tribe-dur-slow` (480ms).
- Easing: `--tribe-easing` is `cubic-bezier(0.22, 1, 0.36, 1)` — a soft,
  decelerating ease. Use it for hover state changes and stage
  transitions.
- The brain canvas pulses on its own data signal. Don't add competing
  ambient motion (no glowing orbs, no spinning rings) outside of that.

---

## 5. DO / DON'T

**DO**

- Use `--tribe-bg` as the page background. Pure black, every screen.
- Use `--tribe-smoke` for body. White is for the few words you want read
  first.
- Separate sections with hairlines, not boxes.
- Use `--tribe-heat-gradient` only for the brain map and the legend.
- Use `.tribe-pill` for control toggles. They are the demo's primary
  interactive element.
- Lean into negative space. TRIBE's hero has ~40% empty pixels.

**DON'T**

- Don't reintroduce navy (`#050510`), teal (`#4ecdc4`), or our prior
  blueberry `#01418d`. The TRIBE language is monochrome + warm heat.
- Don't add the bg-grid, bg-glow, orbital ellipses, or vignette layers
  from the old LandingStage. They fight the symmetry.
- Don't use bold (700+) for headlines. Semibold (600) only.
- Don't use the warm-heat ramp for any UI surface other than the brain
  map and its legend. Activation color is sacred.
- Don't add drop shadows on cards. Hairlines only.
- Don't use emojis, gradients-on-text, or animated brand dots.

---

## 6. Reuse

- The token file (`frontend/src/styles/tribe-tokens.css`) is imported
  globally from `frontend/src/main.js`, so every Vue component sees the
  vars on `:root` without any per-file import.
- Agent B (BrainScene + colors.js): pull the heat ramp from the
  `--tribe-heat-*` tokens and the `--tribe-heat-gradient` composed
  value, so the 3D canvas, the legend bar, and the popup swatches all
  share the same stops.
- Agent C (MainStage + AnalysisPanel): use `.tribe-pill` for the
  network selector and segmented controls. Use `--tribe-section-title`
  / `--tribe-smoke` for prose blocks.

If you need a token that isn't here, **add it to `tribe-tokens.css`**
rather than introducing a literal hex anywhere downstream. One source of
truth.

---

## 7. Reference shots

- `/tmp/tribev2-ref/landing.png` — full hero with cookie modal
- `/tmp/tribev2-ref/hero.png` — clean hero (the canonical shot)
- `/tmp/tribev2-ref/section-1.png` — "Mapping Brain Functions" section
- `/tmp/tribev2-ref/section-2.png` — "TRIBE v2: a three-stage architecture"
- `/tmp/tribev2-ref/section-3.png` — "Key Improvements"
- `/tmp/tribev2-ref/landing-full.png` — full-page screenshot
- `/tmp/tribev2-ref/styles.json` — computed body styles (locked our
  `--tribe-smoke` to `#465a69`)
- `/tmp/tribev2-ref/index.css` — TRIBE V2's compiled CSS, for hex audits

When in doubt, hold the screenshot up next to the running demo and
match — including the negative space.
