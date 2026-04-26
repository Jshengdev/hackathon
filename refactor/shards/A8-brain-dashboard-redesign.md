# SHARD A8 — Brain dashboard redesign audit (greenchain layout × icarus 3D hover anchors)

You are an audit-only Claude instance. Do NOT modify code.

## Skills to load before starting
- `frontend-design:frontend-design` — production-grade frontend structure.
- `superpowers:writing-plans` — convert audit findings into an executable redesign plan.
- `superpowers:verification-before-completion` — claims must be backed by code reads.

## The user's design pivot

The current 4-stage flow (Landing → Loading → Main → Comparison) splits the demo into separate screens. The user wants instead a **single-page dashboard** where everything happens together — like greenchain's dashboard — with the brain as the hero (replacing greenchain's globe) and surrounding panels for swarm activity / iterative loop / falsification / Opus output.

The hover interaction must match icarus's pattern: click-and-drag rotation of the brain via PresentationControls, with each Yeo7 network mapped to an anchor that reveals an insight card when hovered (with safe-triangle cursor-transit so the card doesn't flicker shut when the user moves toward it).

## Read first

Mandatory reading (visual references and exact implementation patterns to borrow):

- `research/sponsors/k2-think/clones/greenchain/backend/CLAUDE.md` — the full architecture mental model for the dashboard.
- `research/sponsors/k2-think/clones/greenchain/docs/screenshots/dashboard.png` — the layout reference. Note: globe-hero center, AI Assistant right, Risk Heatmap top-right, Filter chips top, Country selector + Compliance Hub left columns, Active Routes panel bottom.
- `research/sponsors/k2-think/clones/greenchain/docs/screenshots/launch-transition.png` — pre-load transition style (simple sphere + dot-grid + status text).
- `research/sponsors/k2-think/clones/greenchain/frontend/components/dashboard/interactive-globe.tsx` — the globe component (rotation, atmosphere, orbit ellipses, route arcs with strokeDashoffset reveal). Adapt these mechanics to the brain.

- `/Users/johnnysheng/code/icarus/web/src/three/Scene.tsx` — R3F Canvas + OrthographicCamera + PresentationControls + 4-light stack + Sparkles + PostEffects.
- `/Users/johnnysheng/code/icarus/web/src/three/RoomModel.tsx` — FURNITURE_POS world-position map per anchor (mirror this for Yeo7 networks).
- `/Users/johnnysheng/code/icarus/web/src/three/AnchorHoverZone.tsx` — DOM-based magnetic hover zones inside PresentationControls.
- `/Users/johnnysheng/code/icarus/web/src/three/InsightHtml.tsx` — HTML insight cards floating at world positions with safe-triangle transit.
- `/Users/johnnysheng/code/icarus/web/src/three/CameraRig.tsx` — subtle parallax bob.
- `/Users/johnnysheng/code/icarus/web/src/three/PostEffects.tsx` — bloom + vignette + grain finish.

Our current frontend code:
- `frontend/src/components/BrainScene.vue` — already has fsaverage5 mesh, atmosphere halo, orbit rings, agent edges, region cross-talk arc. Three.js (NOT R3F — we're Vue not React).
- `frontend/src/components/RegionPopup.vue` — current popup; rebuild as InsightCard.
- `frontend/src/components/IterativeLoop.vue` — circular SVG loop visual.
- `frontend/src/components/AnalysisPanel.vue` — without/with TRIBE comparison panels.
- `frontend/src/stages/{Landing,Loading,Main,Comparison}Stage.vue` — the 4-stage flow being collapsed.

## Critical constraint

We are **Vue 3 + Three.js**, not React + R3F. Borrow the mechanics, NOT the framework. Translate every R3F pattern into Vue 3 + Three.js terms:
- `<Canvas>` → manual Three.js scene init in `BrainScene.vue` (already done).
- `<OrthographicCamera>` → `THREE.OrthographicCamera`.
- `<PresentationControls>` → custom click-drag handler with quaternion damping, OR keep `OrbitControls` constrained to azimuth ±36°.
- `<AnchorHoverZone>` → DOM div absolutely-positioned via projected world-coords (like icarus does inside PresentationControls). Need a per-frame screen-position update.
- `<InsightHtml>` → Vue component portal'd to `document.body`, positioned absolutely at the projected anchor screen pos.
- `Sparkles` → `THREE.Points` cloud.
- `PostEffects` → manual `EffectComposer` with `UnrealBloomPass` + custom vignette/grain shaders.

## Investigate

1. **Layout audit.** Read `frontend/src/App.vue` and the 4 stages. Document exactly what state lives where, what gets passed between stages, and which transitions can be collapsed into a single dashboard.

2. **Brain-as-hero feasibility.** `BrainScene.vue` currently renders fsaverage5 mesh full-screen in the active stage. For the dashboard layout, the brain needs to take ~50-60% of viewport center while panels take the surrounding 40-50%. Document what camera/positioning changes are required and whether the existing `layout="left-half"` prop can be extended to `layout="dashboard-center"`.

3. **Yeo7 anchor positions.** The 7 Yeo7 networks have centroids — read `backend/services/brain_mesh.py` to find them. Document the world-coord positions per network. These become the anchor positions for the icarus-style hover zones.

4. **Hover zone mechanic translation.** Icarus uses an HTML overlay div per anchor, positioned via `projectVector(worldPos, camera)` per frame, sized by `ANCHOR_RADIUS` in screen pixels. Document how to do this in Vue 3 + Three.js: which lifecycle hook updates positions, how to handle resize, how to apply safe-triangle transit between anchor and card.

5. **Dashboard panel inventory.** Sketch the panels that will surround the brain. Per panel: data source (which backend endpoint), refresh cadence (one-shot vs polled vs WS-streamed), placement (top-left / top-right / right-center / bottom-right / bottom-left). Minimum panel set:
   - **Scenario chip** (top-left) — current clip + scenario badge (Ironside / Listen Labs)
   - **Vision Report** (left column) — Stage 1A Qwen3-VL output
   - **K2 Swarm activity** (top-right) — live per-network specialist readings as they fire (WS or poll)
   - **Iterative Loop** (right column, mid) — the existing IterativeLoop.vue component
   - **Opus Final Paragraph** (right column, bottom) — Stage 4 polish output, prominent typography
   - **Falsification Evidence** (bottom strip) — delta + verdict + per-region attribution
   - **Persona shell switcher** (top-right corner) — workplace / consumer / pavilion mode
   - **Region insight card** (floating, anchored to brain) — the icarus-style hover card

6. **Streaming readiness.** Greenchain uses SSE for live updates. Our backend has `/ws` for the WebSocket; document its current event shape and whether it's sufficient for live swarm-activity feed in the dashboard.

7. **Loading/transition strategy.** Greenchain has a separate launch-transition screen. We've got LoadingStage with progress streams. Decide: collapse Loading into a brief brain-warm overlay on the same dashboard page, OR keep Loading as a transition before the dashboard reveals. Recommend one with rationale.

8. **PostEffects + atmosphere consolidation.** BrainScene.vue already has atmosphere halo, orbit rings, central-fissure shading. Audit whether these need to be augmented with bloom + vignette + grain (icarus PostEffects) for a cinematic finish, or if the current Three.js material + three-line gradients are sufficient.

9. **Real-data wiring (no fallbacks).** Per CONSTRAINTS.md §7, every panel must consume real backend data and surface "REAL DATA MISSING" red badge in PROD if the source is empty. Document for each panel: backend endpoint, schema, error-state.

10. **Migration risk.** What breaks during the 4-stage → 1-dashboard collapse? Identify state-flow changes, route changes, prop drilling that gets simpler/messier.

## Report (write to `refactor/audits/A8-brain-dashboard-redesign.md`)

Required sections:

- **Current state map** — current 4-stage flow with per-stage data sources and transitions.
- **Target dashboard layout** — ASCII or markdown table showing the panel grid, brain center, anchor positions. Include greenchain screenshot reference + which panels match which greenchain analog.
- **Vue 3 + Three.js translation table** — for every icarus R3F pattern named in this shard, the Vue 3 + Three.js equivalent (component, lifecycle hook, libraries needed). Be specific.
- **Yeo7 anchor positions** — table per network with world-coord centroid, proposed screen-pixel hover radius, recommended insight-card side (left/right of brain).
- **Panel inventory + endpoints** — table per panel: name, data endpoint, polling/WS, placement, error-state surface.
- **Streaming feed design** — how live K2 swarm specialist firings reach the swarm-activity panel during the iterative loop.
- **Loading transition recommendation** — overlay-on-dashboard vs separate-stage with rationale.
- **PostEffects recommendation** — bloom/vignette/grain audit; what's needed, what's overkill.
- **Real-data wiring matrix** — every panel × every potential failure mode × surfaced UI state.
- **Migration plan** — step-by-step refactor order so the demo runs at every commit.
- **Risk callouts** — what breaks; what gets ugly; what needs eval coverage.
- **Open questions for orchestrator** — unilateral decisions to escalate.

Do NOT write code. Do NOT migrate stages. Just the report.

## Acceptance

Report at `refactor/audits/A8-brain-dashboard-redesign.md` with all 12 sections. Vue 3 ↔ R3F translation table covers every icarus pattern. Yeo7 anchor coords are extracted from real code (not guessed). Panel inventory has every panel mapped to a real backend endpoint or marked as needing one.
