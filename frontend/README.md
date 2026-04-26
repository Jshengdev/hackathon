# `frontend/` — Empathy Layer Vue 3 + Three.js demo

**Owner:** Junsu
**Mandate:** verify what's built vs broken, log with real browser/Vitest output. Refactor only what verification proves is broken.

---

## What this is

The frontend is a Vue 3 + Vite + Three.js single-page demo. It takes a video clip, drives through a multi-stage flow (landing → loading → main with brain visual → iterative-reveal → empathy document), and renders the backend's `EmpathyDocument` as a 3-section output (Vision Report / Empathy Paragraph / Falsification Evidence).

**The frontend is downstream of the backend.** Every panel reads from a real backend endpoint (no inline mocks in shipping code per CONSTRAINTS §7).

**The dashboard target** (per A8 audit + `caltech/NEW-ARCHITECTURE.md` §5) is a single-page collapse of the current 4-stage flow into one dashboard with brain-as-hero center and ringed panels (greenchain layout × icarus 3D hover anchors). That's R8 territory — verify current state first, then collapse.

---

## Repo map

```
frontend/
├── package.json
├── vite.config.js                   ← proxies /demo/* + /prerendered/* to :8000
├── index.html
├── src/
│   ├── main.js                      ← Vue mount point
│   ├── App.vue                      ← stage router (current: 5-stage flow)
│   ├── stages/
│   │   ├── LandingStage.vue         ← upload zone + clip selector
│   │   ├── LoadingStage.vue         ← progress streams (vision + TRIBE)
│   │   │                              ⚠ has fake-success-log bug per A4-deepdive Dive 2
│   │   ├── MainStage.vue            ← brain visual + video + region popup
│   │   ├── IterativeRevealStage.vue ← circular loop visualization (round-by-round score climb)
│   │   ├── EmpathyDocumentStage.vue ← §A vision + §B paragraph + §C falsification
│   │   │                              ⚠ has soft-fallback violations per A4-deepdive Dive 2
│   │   └── ComparisonStage.vue      ← LEGACY (route already cut per A4); has inline mock
│   │                                  → R-STRUCT will archive
│   ├── components/
│   │   ├── BrainScene.vue           ← Three.js fsaverage5 mesh + atmosphere halo +
│   │   │                              orbit rings + agent edges + region cross-talk arc
│   │   ├── RegionPopup.vue          ← greenchain telemetry chrome (eyebrow + dashed
│   │   │                              divider + cite line)
│   │   ├── IterativeLoop.vue        ← circular SVG loop visualization
│   │   │                              (greenchain pattern × icarus reveal)
│   │   ├── AnalysisPanel.vue        ← legacy without/with-TRIBE comparison panel
│   │   │                              → may archive after dashboard collapse
│   │   └── (R8 will add: PanelGrid, ScenarioChip, PersonaSwitcher, etc.)
│   ├── composables/
│   │   └── useActivityPlayback.js   ← drives currentTime through activity.json frames
│   ├── api/
│   │   └── index.js                 ← fetch helpers: fetchClips, fetchEmpathyDocument,
│   │                                   fetchVisionReport, fetchActivity,
│   │                                   fetchIterativeTrajectory, fetchFalsification,
│   │                                   postK2Region
│   └── utils/
│       ├── colors.js                ← NETWORK_COLORS map + networkHex(name) helper
│       └── (post-refactor: design-tokens.js — pulls from caltech/pitch-deck/DESIGN.md)
└── README.md                        ← this file
```

---

## Boot the frontend

```bash
cd frontend
npm install                           # one-time
npm run dev                           # runs on http://localhost:3000
```

Vite dev server proxies:
- `/demo/*` → `http://localhost:8000/demo/*`
- `/prerendered/*` → `http://localhost:8000/prerendered/*`
- `/brain/*` → `http://localhost:8000/brain/*`
- `/ws` → `ws://localhost:8000/ws`

So you can hit any backend endpoint directly from the frontend.

---

## Stage flow today (5 stages — to be collapsed by R8)

```
/                               LandingStage
  ↓ user picks clip
/loading/:clip_id               LoadingStage  ← polls /demo/warmup-status
  ↓ both pipelines complete
/main/:clip_id                  MainStage     ← brain visual + video; region click → RegionPopup
  ↓ next →
/iterative/:clip_id             IterativeRevealStage  ← shows IterativeLoop component;
                                                        round-by-round trajectory
  ↓ next →
/empathy/:clip_id               EmpathyDocumentStage  ← final §A/§B/§C document
```

R8 will collapse this into a single `/dashboard/:clip_id` with Loading as a brief overlay.

---

## Backend endpoints frontend consumes

| Endpoint | Stage that consumes | Notes |
|---|---|---|
| `GET /demo/clips` | LandingStage | clip list |
| `POST /demo/match` | LandingStage → LoadingStage | resolves filename → clip_id |
| `GET /demo/warmup-status/{clip_id}` | LoadingStage | poll until `ready: true` |
| `GET /demo/vision-report/{clip_id}` | EmpathyDocumentStage | §A |
| `GET /demo/activity/{clip_id}` | MainStage / BrainScene | drives mesh activations |
| `GET /demo/empathy/{clip_id}` | EmpathyDocumentStage | hero output (full doc) |
| `GET /demo/iterative-trajectory/{clip_id}` | IterativeRevealStage | round_trajectory[] |
| `GET /demo/falsification/{clip_id}` | EmpathyDocumentStage | §C |
| `POST /demo/k2-region` | MainStage / RegionPopup | popup on hover/click |
| `WS /ws` | MainStage (live mode) | per-frame swarm events |
| `GET /brain/mesh` | BrainScene | fsaverage5 + Yeo7 labels |

**Falsification field names are short-form** (per A4-deepdive Pick B): `main_score`, `control_score`, `delta`, `verdict`. The frontend already uses these — the spec was the outlier and R-DOCS fixed it.

---

## Locked rules (non-negotiable)

1. **No inline mock arrays in shipping code.** Mocks gated behind `import.meta.env.DEV` only. The current `ComparisonStage.vue trajectory = [...]` const is a violation — R-STRUCT archives that whole stage.
2. **Visible failure surfaces.** Every component with a fallback render path must, in PROD mode, show "REAL DATA MISSING" red badge — never a fluent placeholder. Today's offenders (per A4-deepdive Dive 2):
   - `LoadingStage.vue:156-202` — `'✓ ready'` printed even on fetch failure
   - `EmpathyDocumentStage.vue:94-109` — `'(empathy paragraph not yet generated)'` and `'falsification: pending'` are too friendly
3. **Design tokens from `caltech/pitch-deck/DESIGN.md`.** Clay-inspired: `--blueberry-800: #01418d` (accent), `--red: #fc7981` (failure), `--lemon-500: #fbbd41` (highlight), dark navy `#050510` background, Roobert + Space Mono.
4. **Three.js, not R3F.** We're Vue 3 + Three.js. When borrowing icarus's R3F patterns (`<Canvas>`, `<PresentationControls>`, `<AnchorHoverZone>`, `<InsightHtml>`), translate them per A8 §3 table.

---

## Verification mandate (Junsu's task list)

Run the 15-step walkthrough in `caltech/3-PERSON-PARALLEL-PLAN.md` §4. Each step has a real verification command + expected result. Write findings to `refactor/audits/V-junsu-frontend.md` using the template in §2.

**P0 fixes (after verification surfaces them):**
- U.5 LoadingStage fake `'✓ ready'` log on backend failure
- U.11 EmpathyDocumentStage soft fallback `'(empathy paragraph not yet generated)'`

**P1 fixes:**
- U.9 IterativeLoop inline mock removal (already shouldn't be in shipping code)
- U.12 design-token consolidation (move all hex colors to `utils/design-tokens.js`)

**P2 fixes:**
- Long lines, console.log leftovers, dead components

---

## Audit reports relevant to frontend

- `refactor/audits/A4-frontend-empathy-wiring.md` — what frontend actually does today (with surprising find: ComparisonStage already cut from route)
- `refactor/audits/A4-deepdive.md` — field-name resolution + LoadingStage gating fix + EmpathyDocumentStage soft-fallback list
- `refactor/audits/A8-brain-dashboard-redesign.md` — dashboard target (greenchain layout × icarus hover anchors); also picks Option 1 for swarm-readings panel + UnrealBloomPass-only
- `refactor/audits/A9-doc-audit-and-cleanup.md` §5 — frontend lint findings (long lines, console.log, dead components)
- `caltech/pitch-deck/DESIGN.md` — Clay design system (canonical)

---

## Common debug recipes

```bash
# Frontend dev server
cd frontend && npm run dev

# Spot-check a Vue file compiles cleanly
curl -sI http://localhost:3000/src/components/BrainScene.vue | head -1
# Should be HTTP 200; HTTP 500 means Vite has a compile error overlay

# Vitest (install vitest first if missing)
cd frontend && npx vitest --run src/stages/LoadingStage.spec.js

# Inspect real backend payloads frontend will consume
curl -s http://localhost:8000/demo/empathy/30s_ironsite | jq '.'
curl -s http://localhost:8000/demo/iterative-trajectory/30s_ironsite | jq '.'
curl -s http://localhost:8000/demo/falsification/30s_ironsite | jq '.'

# Find inline mocks (CONSTRAINTS §7 violation)
grep -rn "const trajectory.*= \[\|const.*= \[{round" src/stages/ src/components/

# Find hardcoded colors (should all be in design tokens)
grep -rn '#[0-9a-fA-F]\{6\}' src/

# Find debug console.log
grep -rn "console.log\|console.warn" src/ | grep -v "node_modules"

# Long-line lint
find src -type f \( -name "*.vue" -o -name "*.js" -o -name "*.ts" \) \
  -exec awk '$0 ~ /.{121}/ {print FILENAME":"NR" ("length($0)" chars)"}' {} \;
```

---

## Hand-off contracts

**From Jacob (backend):** Junsu consumes Jacob's endpoints. If a panel needs a new field that doesn't exist, file a 1-line ask in `refactor/audits/B-asks.md` — Jacob picks up.

**To Johnny (demo):** Junsu publishes `refactor/audits/V-junsu-frontend.md` with all 15 verification entries. Johnny gates on it: zero P0 broken means demo can ship.

---

## What this README does NOT cover

- Backend internals → see `backend/README.md`
- Demo-day runbook + pitch deck → see `caltech/README.md`
- Architecture rationale → see `caltech/architecture-overview.md` (long-form prose)
- The pipeline as a single doc → see `caltech/NEW-ARCHITECTURE.md`
- Greenchain + icarus design references → see `caltech/NEW-ARCHITECTURE.md` §5 + `research/INDEX.md`

If anything's ambiguous: read those + `refactor/CONSTRAINTS.md`. If still ambiguous, escalate to the orchestrator with `[ESCALATE]` tag in your verification report.
