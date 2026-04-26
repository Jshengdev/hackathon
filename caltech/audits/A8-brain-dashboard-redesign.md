# A8 — Brain dashboard redesign audit

**Shard:** A8-brain-dashboard-redesign
**Worktree:** `worktrees/A8-brain-dashboard-redesign/`
**Mode:** audit-only (no code changes)
**Date:** 2026-04-25
**Author:** audit Claude (Opus 4.7)

**Verification commands run:**
- `Read` of every Vue stage + component cited below
- `Read` of `backend/main.py` (579 lines), `services/brain_mesh.py`, `services/swarm_runner.py`, `services/falsification.py`, `services/warmup.py`
- `grep -rn "fetchComparison" frontend/src` → `ComparisonStage.vue:58, 114` (imported, not exported anywhere)
- `grep -rn "import.meta.env" frontend/src` → empty
- `head -c 800 backend/prerendered/30s_ironsite/activity.json` → confirms shape + presence of negative region values
- `ls backend/prerendered/30s_ironsite/` → `30s_ironsite.mp4`, `activity.json`, `scenario.json` only (no warmup output committed)
- `Read` of `icarus/web/src/three/{Scene,RoomModel,AnchorHoverZone,InsightHtml,CameraRig,PostEffects}.tsx`
- `head -120 research/sponsors/k2-think/clones/greenchain/backend/CLAUDE.md`

Bracketed claims are followed by file:line citations. Where a claim is "would" rather than "is", the verification command is named.

---

## 1. Current state map (5-stage flow, not 4)

The shard description says "4-stage flow (Landing → Loading → Main → Comparison)" but `App.vue:35` registers FIVE stages:

```
landing → loading → main → iterative-reveal → empathy-document
```

`ComparisonStage.vue` exists in `src/stages/` but is **not registered** in `App.vue`'s `stageMap` (`App.vue:45-51`). It is dead code that would not render even if invoked, because it imports a function that does not exist:

- `frontend/src/stages/ComparisonStage.vue:58` — `import { fetchComparison } from '../api/index.js'`
- `frontend/src/api/index.js` — defines `postDemoMatch`, `fetchVisionReport`, `fetchActivity`, `postK2Region`, `fetchEmpathyDocument`, `fetchIterativeTrajectory`, `fetchFalsification`, `fetchWarmupStatus`, `videoUrl`, `fetchMesh`, `startSim`, `stopSim`, `fetchStatus`. **No `fetchComparison`.**
- Backend has no `/demo/comparison` route either (`grep` of `main.py`: no match).

So the actual flow being collapsed is 5 stages, and ComparisonStage's existing layout (brain-left × {AnalysisPanel, IterativeLoop, AnalysisPanel}-right) is the **closest in-repo precedent for the dashboard target** but it carries broken plumbing.

| Stage | File | Data sources | Transition trigger | What it owns |
|---|---|---|---|---|
| `landing` | `LandingStage.vue` | `POST /demo/match` via `postDemoMatch(file.name)` | `emit('matched', payload)` → App sets `clip_id`, `scenario`, `scenarioLabel`, advances to `loading` | dropzone, orbital backdrop, vignette, brand chrome |
| `loading` | `LoadingStage.vue` | `GET /demo/vision-report/{clip_id}`, `GET /demo/activity/{clip_id}`, `GET /demo/warmup-status/{clip_id}` (poll, 1.5s) | `emit('done', {vision, activity})` after both fetches **AND** warmup ready (90s timeout) | dual progress streams, phase rail, orbital backdrop |
| `main` | `MainStage.vue` | `videoUrl(clipId)` (static `/prerendered/...mp4`), `postK2Region` on click | `emit('next')` → manual user button | brain (`layout="left-half"`) + video + scrubber, modal `RegionPopup` on Yeo7 click |
| `iterative-reveal` | `IterativeRevealStage.vue` | `GET /demo/iterative-trajectory/{clip_id}` | `emit('reveal-done')` after auto-stepping rounds 1..N | `RoundScoreBar`, paragraph excerpt fade |
| `empathy-document` | `EmpathyDocumentStage.vue` | `GET /demo/empathy/{clip_id}` | terminal | full document (§A vision / §B paragraph / §C falsification + per-region attribution + collapsed trajectory), wrapped in `PersonaShell` |

State that crosses stage boundaries (App.vue:39–42): `clipId`, `scenario`, `scenarioLabel`, `activityData` (passed down to MainStage), `visionReport` (fetched but never consumed by Main — only used to gate the loading transition).

**Stage-specific local state that disappears today and must survive the collapse:**
- `MainStage.currentTime` — drives `BrainScene.activityData[idx]`. Lives in MainStage. Must move to dashboard root or a `useClipPlayback()` composable.
- `MainStage.popup` — region click → K2 popup. Today it's a centered modal. Must become an anchored hover card per icarus.
- `IterativeRevealStage.currentScore`/`prevScore`/`currentRound`/`excerpt` — driven by a `setTimeout` step. In the dashboard, `IterativeLoop.vue` already animates the trajectory autonomously when handed `props.trajectory`, so this scaffolding largely disappears.
- `EmpathyDocumentStage.empathy` — the full payload. Same fetch survives; layout changes from "scroll doc" to "embedded panel".

---

## 2. Target dashboard layout (greenchain × icarus translation)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ┌──[scenario chip · ironside · 30s_ironsite]─┐                             │
│ │ ⬤ analyzing · K2 swarm + Opus 4.7          │   ┌────────[persona]────┐ │
│ └────────────────────────────────────────────┘   │ workplace ▾         │ │
│                                                                            │
│ ┌──────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  │
│ │ §A VISION REPORT │  │                      │  │ §1B K2 SWARM ACTIVITY│  │
│ │ scene_summary    │  │                      │  │ visual ⬤ rd 3 firing │  │
│ │ • action 1       │  │                      │  │ somato ⬤ rd 3 idle   │  │
│ │ • action 2       │  │   BRAIN HERO         │  │ dorsal ⬤ rd 3 firing │  │
│ │ • action 3       │  │   (fsaverage5 mesh   │  │ ventral⬤ rd 3 idle   │  │
│ │ • action 4       │  │   + 7 anchored hover │  │ limbic ⬤ rd 3 firing │  │
│ └──────────────────┘  │   zones, drag-rotate │  │ frontal⬤ rd 3 firing │  │
│                       │   ±36° azimuth)      │  │ DMN    ⬤ rd 3 idle   │  │
│ ┌──────────────────┐  │                      │  └──────────────────────┘  │
│ │ §A2 CLIP META    │  │   ◐ floating insight │                            │
│ │ video preview    │  │     card on hover    │  ┌──────────────────────┐  │
│ │ scrubber         │  │     (icarus-style    │  │ §3 ITERATIVE LOOP    │  │
│ │ 0:08 / 0:30      │  │      anchored card)  │  │ ◯ ring · R3/8        │  │
│ └──────────────────┘  │                      │  │ score 0.65 ↑0.07     │  │
│                       │                      │  └──────────────────────┘  │
│                       │                      │  ┌──────────────────────┐  │
│                       │                      │  │ §4 OPUS PARAGRAPH    │  │
│                       │                      │  │ "She moved through   │  │
│                       │                      │  │  the scaffolding…"   │  │
│                       └──────────────────────┘  │  similarity 0.84     │  │
│                                                 └──────────────────────┘  │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ §5 FALSIFICATION  delta=0.57  anchored  ▸ per-region attribution        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

| Greenchain analog (`archive/research/sponsors/k2-think/clones/greenchain/docs/screenshots/dashboard.png`) | Our dashboard panel |
|---|---|
| globe-hero (centered, ringed) | brain-hero (fsaverage5 mesh, atmosphere halo + 2 orbit ellipses already in `BrainScene.vue:170-209`) |
| filter chips top | scenario chip + persona switcher top |
| AI Assistant right column | §3 Iterative Loop + §4 Opus paragraph stacked right |
| Country selector left column | §A vision report + §A2 clip meta stacked left |
| Risk Heatmap top-right | §1B K2 swarm activity panel (live per-network firings) |
| Active Routes panel bottom | §5 Falsification strip |

Brain takes ~50% of viewport center (greenchain reserves similar real estate). The current `BrainScene.vue:452-467` already has a `layout` prop with `left-half` and `full` modes — extending to `dashboard-center` is a 1-call addition.

---

## 3. Vue 3 + Three.js translation table (every icarus R3F primitive named in the shard)

| icarus / R3F | Vue 3 + Three.js equivalent | Where in our codebase | Notes |
|---|---|---|---|
| `<Canvas>` (R3F root) | manual `new THREE.WebGLRenderer({antialias, alpha})`, `scene = new THREE.Scene()`, mount to ref'd `<div ref="container">` | `BrainScene.vue:73-87` (already done) | We already drive the loop via `requestAnimationFrame(animate)` in `BrainScene.vue:489-545`. No R3F overhead. |
| `<OrthographicCamera>` (`Scene.tsx:96-102`) | `new THREE.OrthographicCamera(left, right, top, bottom, near, far)` OR keep `THREE.PerspectiveCamera` | currently `THREE.PerspectiveCamera(45, W/H, 0.1, 1000)` at `BrainScene.vue:92` | **Recommend keeping perspective** — the brain is volumetric, ortho would flatten the cortical folds. Icarus uses ortho because the room is a cozy diorama. Different intent. |
| `<PresentationControls>` (drei) — drag rotate within azimuth/polar bounds (`Scene.tsx:153-160`) | one of two paths: (a) keep `OrbitControls` with `minPolarAngle`/`maxPolarAngle`/`minAzimuthAngle`/`maxAzimuthAngle` clamps; (b) custom quaternion drag with spring damping. | currently raw `OrbitControls` at `BrainScene.vue:96-100` | Path (a) is 4 lines and ships today. Path (b) matches icarus's drei spring config (`{mass: 1.2, tension: 140, friction: 30}`) but needs hand-rolled spring. Path (a) is the right call for the demo. |
| Drei `<Html position={worldPos} center>` (`AnchorHoverZone.tsx:32`, `InsightHtml.tsx:65`) | per-frame `vector.project(camera)` → `(x,y)` in NDC → screen pixels → set `style.left`/`style.top` of an absolutely-positioned DOM div | not yet — `RegionPopup.vue` is a centered modal, not anchored | New composable `useWorldAnchor(worldPos)` that runs in the existing `animate()` tick (or its own RAF). Returns reactive `{x, y, visible}`. The CSS2DRenderer at `BrainScene.vue:82-87` is overkill for hover zones — it's rendering 7 region labels currently. We can reuse CSS2DRenderer for the hover zones too, **but** CSS2DRenderer doesn't support `pointer-events` selectively (the whole label layer is `pointer-events: none` per `BrainScene.vue:84-86`); for clickable hover zones we need a parallel non-CSS2D layer. |
| `<AnchorHoverZone>` invisible-circle hitbox (`AnchorHoverZone.tsx:38-54`) | DOM div with `width = radius*2; height = radius*2; margin-left/top = -radius; border-radius: 50%;` portal'd to `document.body`, positioned via `useWorldAnchor` per frame | new component `BrainHoverZone.vue` | Per-anchor screen-pixel radius dictionary mirroring icarus's `ANCHOR_RADIUS` (`Scene.tsx:36-43`). Initial dictionary in §4 below. |
| `<InsightHtml>` floating insight card with safe-triangle transit (`InsightHtml.tsx:75-162`) | `RegionInsightCard.vue` portal'd to `document.body`, anchored via `useWorldAnchor`. Replace icarus's `motion`/`AnimatePresence` with Vue's `<transition name="card-pop">` + CSS keyframes. | rebuild from current `RegionPopup.vue` | Safe-triangle: icarus uses `WRAPPER_W = CARD_W + GAP + 2*BUFFER_AX` and a 320px-tall wrapper rect spanning anchor → card. Vue port: same geometry, mouse-enter on wrapper cancels the hide timer (`Scene.tsx:67-78`). |
| `<CameraRig>` parallax bob (`CameraRig.tsx`) | manual mouse-tracked camera lerp inside our existing `animate()` tick. `target.set(origin.x + pointer.x * amplitudeX, origin.y + pointer.y * amplitudeY, origin.z); camera.position.lerp(target, damping)` | currently absent — would slot into `BrainScene.vue:489-545` | Listen `mousemove` on `container.value`, normalize to `[-1, 1]`, lerp each frame. amplitude 0.28/0.14 (icarus values) is too small for our world-units (icarus is ortho zoom 30-85; we're at distance 230). Scale to `amplitudeX ≈ 8`, `amplitudeY ≈ 4` in our world. **Verify by eye in dev** — the goal is "this is 3D" not "the camera moves". |
| `<Sparkles>` (drei dust motes) | `THREE.Points` with `THREE.PointsMaterial({size, transparent, opacity, blending: AdditiveBlending})` + manual per-frame jitter | We already have 96 wanderers (`BrainScene.vue:294-318`) and an instanced-mesh for them. Sparkles isn't needed — the wanderers ARE the sparkles. | Skip. |
| `<PostEffects>` (`@react-three/postprocessing`'s EffectComposer + Bloom + Vignette + Noise) | `three/addons/postprocessing/EffectComposer.js` + `UnrealBloomPass` + custom `ShaderPass` for vignette + custom `ShaderPass` for grain | not yet | See §8 — recommend bloom only, skip vignette (atmosphere already vignetes) and grain (will fight the wanderer dot field). |
| Drei `<Outlines>`, `<RoundedBox>`, scene texture maker | n/a — we don't have furniture | n/a | Skip. |
| Motion library `<motion.div variants={...}>` | Vue `<transition name>` + CSS keyframes, OR `@vueuse/motion` if a more declarative API is wanted | n/a | Vue's built-in transitions cover the card pop-in (opacity + translateY + scale). |
| `useFrame((s, dt) => ...)` per-frame hook | already done — our `animate()` at `BrainScene.vue:490-545` | n/a | Add new per-frame work (anchor projection, parallax) into the same loop. Don't spawn a second RAF. |

---

## 4. Yeo7 anchor positions

**Source of truth:** centroids are computed at runtime by `backend/services/brain_mesh.py:111-121` (`_build_networks`), as the mean of the fsaverage5 vertex positions whose Yeo7 atlas label matches the network's `label_id`. The right hemisphere is offset `+10.0` mm in X (`brain_mesh.py:58-59`) so the hemispheres don't overlap. Centroids are exposed via `GET /brain/mesh` → `networks[name].centroid` (`brain_mesh.py:138-145` → consumed by `BrainScene.vue:691` via `fetchMesh()` → `buildRegionAgents`).

**This means the centroids are already extracted from real code today** — `BrainScene.vue:264` reads `data.centroid` directly when placing the Yeo7 region spheres. The dashboard's hover-zone anchors should consume the same `meshNetworks.value[name].centroid` array we already store at `BrainScene.vue:694-695`.

I cannot dump the numerical values without running the backend (the centroid depends on which Yeo7 atlas file `atlas.py:load_or_build_labels` builds — synthetic fallback if nilearn fails per `brain_mesh.py:75-80`). But the verification commands are:

```bash
cd backend && uvicorn main:app --port 8000 &
curl -s localhost:8000/brain/mesh | jq '.networks | to_entries | map({network: .key, centroid: .value.centroid})'
```

**Approximate anatomical centroids** (fsaverage5 inflated, MNI mm, hemisphere-merged with R+10mm offset). These are **the expected ranges** the runtime call will return; treat them as ranges to verify, not values to commit:

| Network | label_id | x range (mm) | y range (mm) | z range (mm) | Card side | Proposed screen-pixel hover radius |
|---|---|---|---|---|---|---|
| visual | 1 | ±5 | -90 to -65 | -5 to +5 | left | 70 |
| somatomotor | 2 | ±35 | -25 to +5 | +50 to +70 | right | 70 |
| dorsal_attention | 3 | ±25 | -55 to -35 | +45 to +55 | right | 60 |
| ventral_attention | 4 | ±50 | -10 to +20 | +5 to +25 | right | 60 |
| limbic | 5 | ±25 | +25 to +45 | -25 to -10 | left | 55 |
| frontoparietal | 6 | ±40 | +10 to +30 | +40 to +60 | left | 60 |
| default_mode | 7 | ±5 | -55 to -35 | +25 to +45 | right | 70 |

**Card-side rule:** networks with their centroid on the left half of screen (after camera projection from camera position `(0, 40, 230)`) get card on right; networks on the right half get card on left. Because hemispheres are mirrored about x=0 (with the +10mm right-hem offset), the centroids hover near x ≈ 0 except for somatomotor / VAN / FPN which lateralize. **The card side should be computed once at mesh-load** (per network) using the projected x-coord at the default camera, NOT hardcoded — networks that lateralize differently across atlas builds should still place their card outboard.

**Hover-radius rule:** The Yeo7 region spheres are 4-unit world radius (`BrainScene.vue:262`). At default camera distance 230, that projects to ~12px. We want the hover hitbox to be ~5× the sphere radius (matches icarus's "magnetic" rule for tiny objects like the plant). 60–70px is the right band.

**Output schema for the dashboard composable** `useYeoAnchors()`:
```js
{
  visual:           { centroid: [x,y,z], side: 'right', radius: 70, color: '#ff6b6b' },
  somatomotor:      { centroid: [x,y,z], side: 'right', radius: 70, color: '#4ecdc4' },
  dorsal_attention: { centroid: [x,y,z], side: 'right', radius: 60, color: '#45b7d1' },
  ventral_attention:{ centroid: [x,y,z], side: 'right', radius: 60, color: '#f7dc6f' },
  limbic:           { centroid: [x,y,z], side: 'left',  radius: 55, color: '#bb8fce' },
  frontoparietal:   { centroid: [x,y,z], side: 'left',  radius: 60, color: '#82e0aa' },
  default_mode:     { centroid: [x,y,z], side: 'right', radius: 70, color: '#f0b27a' },
}
```

The colors are already canonical — single source of truth at `frontend/src/utils/colors.js:3-12` (mirrored from `brain_mesh.py:23-31`).

---

## 5. Panel inventory + endpoints

| Panel | Placement | Endpoint(s) | Refresh | Schema (what the panel reads) | Error state surface (PROD) |
|---|---|---|---|---|---|
| Scenario chip | top-left | `POST /demo/match` (already fired in landing) | one-shot at clip-load | `{clip_id, scenario, scenarioLabel}` | If `scenarioLabel` empty → red "REAL DATA MISSING · scenario" badge |
| Persona switcher | top-right | (UI-only; mirrors `scenario` to `personaMode`) | one-shot | `'workplace' \| 'consumer' \| 'pavilion'` per `EmpathyDocumentStage.vue:88-90` | n/a — UI control |
| §A Vision Report | left col, top | `GET /demo/vision-report/{clip_id}` | one-shot at warmup-ready | `{scene_summary: str, actions: str[], stub?: bool, error?: str}` (see `warmup.py:280` for stub shape) | If `stub: true` or `error` present → red badge "VISION FALLBACK · {error}". Today `vision_client.py` writes `{stub: true, error}` on failure (`warmup.py:280`); frontend ignores it (`EmpathyDocumentStage.vue:15` — would render as blank scene_summary). **THIS IS A SILENT-STUB VIOLATION TO FIX.** |
| §A2 Clip meta + video | left col, bottom | `videoUrl(clipId)` static `/prerendered/.../clip.mp4` | one-shot | n/a — `<video>` element | `<video>` 404 → browser shows broken icon. Add `@error` handler that surfaces "VIDEO MISSING" badge. |
| §1B K2 Swarm activity | top-right | `GET /demo/empathy/{clip_id}` (extract `swarm_readings`) **OR** new `GET /demo/swarm-readings/{clip_id}` (warmup writes `swarm_readings.json` per `warmup.py:283-289`) | one-shot at warmup; **animate per-network reveal locally** | `{clip_id, frame_window, regions: {<network>: {reading, confidence, cite}}}` per `swarm_runner.py:131-135` | If any network's `reading` starts with `"[K2 error: "` (set in `swarm_runner.py:114`) → red dot + "K2 FAILED" badge for that row |
| §3 Iterative Loop | right col, mid | `GET /demo/iterative-trajectory/{clip_id}` | one-shot | `{round_trajectory: [{round, score, paragraph_excerpt, specialist_readings?, cross_region_edges?}], final_score, best_paragraph}` | Empty `round_trajectory[]` → "NO TRAJECTORY" badge (per CONSTRAINTS §2: empty array is acceptable; just show "no rounds yet"). Today `IterativeLoop.vue` defaults to a hardcoded 8-round mock if `props.trajectory` is omitted (`IterativeLoop.vue:158-169`) — **VIOLATION** of CONSTRAINTS §4. |
| §4 Opus Paragraph | right col, bottom | `GET /demo/empathy/{clip_id}` (extract `polished_paragraph` ?? `best_paragraph`) | one-shot at warmup | `{best_paragraph: str, polished_paragraph: str \| null, final_score: float, scenario_label: str}` per `main.py:381-393` | `polished_paragraph === null` AND `best_paragraph === null` → red "EMPATHY MISSING" badge. `polished_paragraph === null` alone is the expected case today (Opus polish is the cut-line stage and not yet wired in `_ensure_empathy` per `main.py:388`); show `best_paragraph` with a "K2 best · Opus polish pending" subtitle. |
| §5 Falsification strip | bottom full-width | `GET /demo/falsification/{clip_id}` | one-shot | `{main_score, control_score, delta, verdict, clip_id?, error?}` per `falsification.py:18-23` + `warmup.py:332-334` | If `error` field present → red "FALSIFICATION FAILED · {error}" badge. **Note schema drift:** code emits `{main_score, control_score, delta, verdict}` but C2 contract calls for `{main_paragraph_score, control_paragraph_score, falsification_delta, verdict}`. Frontend `EmpathyDocumentStage.vue:108` already uses the code's keys (`f.delta`, `f.main_score`, `f.control_score`). **Audit finding A8-F1: contract C2 is stale — escalate to orchestrator. Do NOT rename code unilaterally.** |
| Region insight card (floating) | anchored to brain Yeo7 centroid | `POST /demo/k2-region {clip_id, network, t}` (single-region debug) **OR** read from `k2_region_cache.json` baked by `warmup.py:296-304` (7 networks × N seconds) | per-hover (debounced) | `{network, t, text, confidence, cite, raw?}` per `main.py:509-516` | If `text` starts with `"[K2 call failed: "` (set in `main.py:493`) → red badge in card "K2 CALL FAILED · {status}". Today this is rendered as plain text in the modal (`MainStage.vue:142-147`) — needs to become a structured error surface. |

---

## 6. Streaming feed design — live K2 swarm activity

**Current state:** `WS /ws` exists (`main.py:519-530`) but only emits when `simulation_loop()` is running, which requires `POST /brain/start` (`main.py:129-135`). The simulation_loop broadcasts at 1 Hz with shape:

```json
{
  "t": int,
  "activations": [...20484 floats...],
  "agents": [...],
  "network_activations": {"visual": float, ...},
  "top_region": "visual",
  "speech": [...]
}
```

(see `main.py:564-571`)

This is a per-frame brain-tick channel, not a per-K2-call event channel. The dashboard's §1B "K2 Swarm activity" panel wants the **K2 specialist readings** (`reading, confidence, cite` per network), which come from `swarm_runner.run_swarm` and are written to `swarm_readings.json` by warmup (`warmup.py:289`).

**Three options for the swarm-activity panel:**

1. **Static + locally-animated** (RECOMMENDED for the demo). Fetch `swarm_readings` once at warmup-ready. Reveal one network at a time over ~3.5s with a stagger, with the per-network "firing/idle" badge tied to the current `currentTime`'s `network_activations[name]` from `activityData.frames[idx].regions[name]` — i.e., real activation values driving the badge color, real K2 readings driving the text. No new endpoint, no WS dependency.

2. **WS retrofit:** extend the WS broadcast to include a per-network K2 event when the iterative loop fires Stage 1B/2/3. Requires modifying `services/iterative_loop.py` to emit ws messages mid-loop. Latency win is real (you'd see rounds happen live), but the loop itself takes ≤ 60s already and the demo's "single-page everything happens together" framing reads well even when the loop has already converged. **Skip for v1.**

3. **SSE per-clip**: new `GET /demo/swarm-stream/{clip_id}` that yields `event: round\ndata: {...}\n\n` while warmup runs. Greenchain uses this pattern (`archive/research/sponsors/k2-think/clones/greenchain/backend/CLAUDE.md` shows `StreamingResponse` over `/search`). **Skip for v1** unless option 1 reads as static.

**Recommendation:** Option 1 for the dashboard ship. Add a 7-row "specialist readings" view bound to cached `swarm_readings`, with each row pulsing when its network is currently `top_region` per `BrainScene.vue:530`'s tracked frame. **No WS changes** in A8 scope.

---

## 7. Loading transition recommendation

**Recommendation: collapse Loading into a brief brain-warm overlay on the same dashboard page.**

Rationale:
- Greenchain's `launch-transition.png` is a separate page, but greenchain's ML scoring takes seconds — they're filling time. Our warmup writes `vision_report.json` (Qwen3-VL ≤ 10s), `swarm_readings.json` (7 K2 in parallel ≤ 8s), `k2_region_cache.json` (7×N=~217 K2 calls semaphored at 6 → ~30s), `empathy.json` (loop ≤ 60s). **Total cold path ≈ 100s** for a fresh clip. That is too long to hold a brand-screen on; users stare at it and bail.
- **The right framing is "warm brain idles, panels fill in as data lands"**: render the brain hero immediately with `activityData` fetched (≤ 2s), let it run its boids-lite swarm + atmosphere pulse, and have each panel show its own per-panel skeleton state until that panel's source endpoint resolves. Greenchain does this — note the dashboard has globe spinning even before all routes are scored.
- The existing `LoadingStage.vue` is **already hiding fake progress** (`LoadingStage.vue:144-152`) — `visionProgress.value = elapsed / minMs * 0.92` with `minMs = 3500` is a UX-pacer, not real progress. This is a borderline CONSTRAINTS §2 violation: the percentage shown does not reflect actual fetch progress. It's not "fake content," but it's also not "real-data." **In the dashboard collapse, replace this with per-panel skeleton states tied to actual endpoint resolution.**
- For pre-warmed clips (the demo path: `30s_ironsite`, `30s_twitter` will be baked Saturday 8 AM), warmup-ready hits in ~200ms because every cache file already exists (`warmup.py:341-354` — checks file existence per key). The brain mesh fetch (`/brain/mesh`) is the bottleneck at that point (~500ms-1s for 20484-vertex JSON). The dashboard renders, brain swirls into view via the existing `applyLayout` camera tween (`BrainScene.vue:438-449`), panels populate.

**Implementation sketch:** keep an "ANALYZING…" pill at the top-left for ~1.2s on dashboard mount (covers the brain mesh fetch + first frame), then fade out. No separate stage.

---

## 8. PostEffects recommendation

**Recommendation: add UnrealBloomPass only. Skip Vignette and Noise.**

| Pass | Add? | Why |
|---|---|---|
| `UnrealBloomPass` | **YES** | The Yeo7 region spheres + atmosphere have `emissive` already (`BrainScene.vue:141-150` + `262`). Bloom turns "glowing dot" into "glowing dot with a halo," which is what you'd expect for "this network is firing right now." `intensity ≈ 0.6`, `luminanceThreshold ≈ 0.85`, `radius ≈ 0.4`. |
| `Vignette` | **NO** | The atmosphere halo (`BrainScene.vue:170-181`, sphere geo at brain × 1.18, BackSide, AdditiveBlending) is already a brand-correct vignette: it darkens the rim of the brain region, not the screen rim. Adding a screen-space vignette **on top of** the atmosphere would muddy both. The dashboard background is already `#050510` flat dark — the panels themselves frame the brain, no vignette needed. |
| `Noise` (grain) | **NO** | We have 96 wanderers buzzing around the brain (`BrainScene.vue:294-318`). Adding grain on top of moving point sprites creates visual noise on visual noise. Pick one: we have the wanderers. |
| Custom film-grain shader | NO | same as above |

**The shader work is small:** `EffectComposer + RenderPass + UnrealBloomPass`, swap `renderer.render(...)` for `composer.render()`. Keep `CSS2DRenderer.render(...)` after — the labels live in DOM, not WebGL, so they're unaffected by post-processing.

**Risk:** `UnrealBloomPass` needs `renderer.outputColorSpace = THREE.SRGBColorSpace` (default in r150+ but worth verifying). And the atmosphere halo uses `AdditiveBlending` already — bloom on top of additive blends is double-additive and can clip. Tune `luminanceThreshold` empirically (start at 0.85, lower until rim glows).

---

## 9. Real-data wiring matrix (no fallbacks)

Key per CONSTRAINTS §2 + §7: a failure must be **visible**, not disguised. Each panel × failure mode × surface state.

| Panel | Failure mode | Today's behavior | Required PROD surface (per CONSTRAINTS §2) |
|---|---|---|---|
| §A Vision Report | `vision_client.analyze_video` raises | `warmup.py:278-280` writes `{scene_summary: '', stub: true, error: str(e)}` → frontend shows blank `(no scene summary)` (`EmpathyDocumentStage.vue:15`) | Render `{stub:true}` payload as red "VISION FALLBACK · {error}" badge with the error string visible |
| §A Vision Report | endpoint 404 | `LoadingStage.vue:158-160` catches, sets `visionResult = null`, advances anyway | Loading collapses → dashboard mounts → §A panel shows red "REAL DATA MISSING · vision-report" badge |
| §1B K2 Swarm | per-network K2 timeout | `swarm_runner.py:113-114` returns `{reading: "[K2 error: ...]", confidence: "", cite: null}` | That row in the swarm panel renders red dot, `[K2 ERROR]` text, dimmed confidence bar — **not** as a normal-looking reading. |
| §1B K2 Swarm | `swarm_readings.json` missing | `_ensure_swarm_readings` re-runs (`main.py:336-343`) | If re-run fails, the panel shows red "SWARM RE-RUN FAILED · cache miss + K2 down" |
| §3 Iterative Loop | empty `round_trajectory[]` | `IterativeLoop.vue` falls back to **hardcoded 8-round mock** (`IterativeLoop.vue:158-169`). **VIOLATION CONSTRAINTS §4** | Show "NO ROUNDS YET" empty state. Per CONSTRAINTS §2 last bullet, empty arrays are acceptable; what's NOT acceptable is the synthetic 8-round demo paragraph. |
| §3 Iterative Loop | dead `ComparisonStage.vue:63-72` inline mock array | not currently rendered (stage isn't wired) but the import would crash | Remove the mock array OR delete the file in R8 (refactor pass). Audit finding A8-F2. |
| §4 Opus Paragraph | `polished_paragraph === null` (Opus stage cut) | Frontend prefers `polished_paragraph ?? best_paragraph` (`EmpathyDocumentStage.vue:94-96`) | This is the **expected behavior** per NEW-ARCHITECTURE.md §4 (Opus is cut-line). Render `best_paragraph` with subtitle "K2 best · polish pending". Not a violation. |
| §4 Opus Paragraph | both null + `best_paragraph` empty | `(empathy paragraph not yet generated)` placeholder | Replace with red "EMPATHY MISSING · K2 loop produced no paragraph" badge. |
| §5 Falsification | `compute_falsification` raises | `warmup.py:196-204` writes `{main_score: 0, control_score: 0, delta: 0, verdict: "unknown", error: str(e)}` | Render with red "FALSIFICATION FAILED · {error}" badge instead of green/yellow verdict. Today the frontend just renders `verdict: unknown` as the same yellow as `generic_plausible`, which is misleading. |
| §5 Falsification | control_activity missing | `_load_control_activity` falls back to **the main clip's own activity** (`main.py:289-295` and `warmup.py:226-240`). This makes `delta ≈ 0` (paragraph scored against its own data twice) — looks like a "generic" verdict, not a missing-control surface. **SILENT FALLBACK VIOLATION.** | Required surface: when control falls back to main, return `{verdict: "no_control", error: "control_activity missing for scenario=ironside"}`. Render red badge. Audit finding A8-F3. |
| Region insight card | K2 call fails on hover | `main.py:489-498` returns `{text: "[K2 call failed: ...]", stub: true, error: str(e)}`. Frontend `MainStage.vue:140-147` catches into `text: 'Could not reach K2 — try again in a moment.'` | Render `stub: true` payload as red badge in the card with the actual error code. Don't paraphrase the error away. |

---

## 10. Migration plan (refactor sequence so the demo runs at every commit)

This is for the R-pass (R8 refactor shard); audit shard A8 only documents.

```
T0  baseline      — current 5-stage flow works end-to-end on prerendered clips.
T1  scaffold      — add `frontend/src/stages/DashboardStage.vue` (empty shell) +
                    `frontend/src/composables/useWorldAnchor.js` (vector.project per frame).
                    Don't wire into App.vue yet — verify in isolation by mounting via
                    a query-param gate (?dash=1).
T2  brain layout  — extend `BrainScene.vue` `layout` prop with 'dashboard-center';
                    add a camera target tween for it (mirror existing 'left-half' code at
                    BrainScene.vue:452-467). Drop into DashboardStage. Brain renders + responds
                    to existing `activityData` prop.
T3  panels A+A2   — add §A vision panel (consume same fetch as LoadingStage today).
                    Add §A2 video panel (move <video> + scrubber from MainStage.vue:30-52).
                    Wire `currentTime` upward into DashboardStage so it can flow to brain.
T4  panel §1B    — add KSwarmActivity.vue. Fetch swarm_readings from /demo/empathy
                    (extract .swarm_readings) OR add a thin /demo/swarm-readings route
                    (recommended; one-line endpoint that returns the cached blob).
T5  panel §3     — drop existing IterativeLoop.vue into right column.
                    REPLACE its hardcoded `default` trajectory (IterativeLoop.vue:158-169)
                    with `default: () => []` and let the empty state render properly.
                    Wire trajectory from /demo/iterative-trajectory (already fetched today
                    by IterativeRevealStage).
T6  panel §4     — add OpusParagraph.vue. Fetch from /demo/empathy. Render best_paragraph
                    with "polish pending" subtitle when polished_paragraph is null.
T7  panel §5     — add Falsification strip. Move verdict logic from EmpathyDocumentStage.
T8  hover anchors— add 7×BrainHoverZone.vue, anchored via useWorldAnchor to
                    meshNetworks.value[name].centroid. Add RegionInsightCard.vue
                    (rebuild RegionPopup with anchored positioning + safe-triangle).
T9  postFX bloom — add EffectComposer + UnrealBloomPass to BrainScene.vue.
T10 cut over     — wire DashboardStage into App.vue's stageMap. Replace all 4 inner stages
                    (loading + main + iterative-reveal + empathy-document) with a single
                    'dashboard' stage. Keep landing as the entry. Stage indicator becomes
                    a 2-step indicator (landing → dashboard).
T11 cleanup      — delete MainStage.vue, IterativeRevealStage.vue, EmpathyDocumentStage.vue,
                    LoadingStage.vue, ComparisonStage.vue (the dead one), and the unused
                    fetchComparison reference if it surfaced anywhere else.
                    Remove the `default: () => ([...mock 8 rounds...])` from IterativeLoop.vue
                    (constraint §4 violation cleanup).
T12 verify       — every fresh page load on /?clip=30s_ironsite produces:
                    (a) brain visible within 1s
                    (b) all 7 panels render with real data within warmup-ready window
                    (c) no console errors
                    (d) hover any Yeo7 anchor → insight card appears, K2 reading visible,
                        no [K2 error: ...] in PROD
                    (e) playwright scan finds no "STUB"/"FAKE"/"PLACEHOLDER" text on screen.
```

Each Tn is a separate commit. The demo path stays alive at every commit because the cutover at T10 is the only step that touches `App.vue`. T1–T9 are additive.

---

## 11. Risk callouts

**R1 (HIGH) — `IterativeLoop.vue:158-169` hardcoded 8-round trajectory default.** Frontend ships with synthetic K2-output text by default. This is a CONSTRAINTS §4 violation. Even though `ComparisonStage.vue:63-72` (which exercises that default) is dead code, a future `<IterativeLoop />` mount with no prop will render the synthetic mock. **Refactor signal:** change default to `() => []`, render an explicit "no trajectory" empty state. Convert the synthetic excerpt fixture into a story/test in `frontend/tests/__fixtures__/iterative-trajectory.json` and reference it via `import.meta.env.DEV`-gated import only.

**R2 (HIGH) — `falsification.py:18-23` field names diverge from C2 contract.** Code emits `{main_score, control_score, delta, verdict}`. C2 says `{main_paragraph_score, control_paragraph_score, falsification_delta, verdict}`. Frontend `EmpathyDocumentStage.vue:108` already follows the code's keys, not the contract. **Audit finding A8-F1: escalate to orchestrator** — option (a) update C2 to match reality (lighter), option (b) rename code+frontend (heavier, touches multiple shards). Recommend (a).

**R3 (HIGH) — `_load_control_activity` silent fallback (`main.py:289-295`, `warmup.py:226-240`).** When the scenario's control clip is missing, it falls back to the main clip's own activity. This produces `delta ≈ 0` and reads as "generic_plausible," masking what's really "no control was available to compare against." **Audit finding A8-F3:** convert to log+surface — return `{error: "control_activity missing for scenario=...", verdict: "no_control"}` and render red badge. Per the user's standing rule: this is the refactor signal, not a blocker. R8 should fix; A8 documents.

**R4 (MEDIUM) — `LoadingStage.vue:144-152` fake progress percentages.** `visionProgress = elapsed / minMs * 0.92` is UX-pacing, not real progress. Borderline CONSTRAINTS §2: it's not faking content, but it's not real either. The dashboard collapse eliminates this stage entirely; risk evaporates at T10. No need to fix Loading separately.

**R5 (MEDIUM) — `ComparisonStage.vue` is broken dead code.** Imports `fetchComparison` from `api/index.js` which doesn't exist. Not currently rendered (App.vue doesn't reference it). If anyone re-enables it (or a future shard ships it), it crashes. **Recommendation:** delete the file in T11 cleanup; the dashboard panel grid replaces its purpose entirely.

**R6 (MEDIUM) — Negative activation values clamped to invisible.** `activity.json` regions can be negative (`backend/prerendered/30s_ironsite/activity.json` shows `somatomotor: -0.033`, `default_mode: -0.062` at t=0). `BrainScene.vue:323` clamps to `[0,1]` via `Math.max(0, Math.min(1, t))`, so most of the brain reads as "dark/inactive" most of the time — which is technically true (TRIBE outputs are residuals from a baseline) but visually the dashboard hero looks dead. **Out of scope for A8 (this is A1 prerender-cache or A2 stub-fallbacks territory),** but flagging because the dashboard's whole vibe is "see what the brain is doing" and right now the answer is "almost nothing, most of the time." Consider per-clip min/max normalization in the frontend mesh shader, OR flag for upstream TRIBE post-processing in A1.

**R7 (LOW) — `BrainScene.vue` already has CSS2DRenderer for region labels.** The hover anchors will need a parallel DOM layer (CSS2DRenderer doesn't selectively pass `pointer-events`). Two-renderer canvas (WebGL + CSS2D) is fine; adding a third positioned-DOM layer is fine; just be aware of z-index ordering: WebGL bottom, CSS2D labels (pointer-events: none) middle, anchored hover divs (pointer-events: auto) top.

**R8 (LOW) — Vue 3 `<transition>` doesn't have AnimatePresence's "popLayout" mode.** Icarus uses `mode="popLayout"` (`InsightHtml.tsx:75`) so a new card starts fading in while the old one fades out. Vue's `<transition>` only supports `mode="out-in"` and `mode="in-out"`. For card swaps between Yeo7 networks, use `<transition-group>` keyed on `activeAnchor` — that's the closest equivalent. Or just accept a brief fade-out/fade-in stagger; for hover anchors (not a fast-typing interaction) it's fine.

**R9 (LOW) — Eval coverage gap.** No e2e test today asserts "every panel has real data, no STUB text." A6 qa-eval-harness shard owns this. A8 cannot fix it from here, but the migration plan T12 should depend on A6's playwright drive-through being green.

---

## 12. Open questions for orchestrator

**Q1 — Falsification field names: rename C2 contract to match code, OR rename code to match C2?**
Recommendation: update C2 to `{main_score, control_score, delta, verdict}` (what the code + frontend already use). Cost: 4 lines in CONTRACTS.md. Touches: zero shipping code. Alternative: rename in `falsification.py` + `warmup.py` + `main.py` + `EmpathyDocumentStage.vue` — 4 files, multi-shard coordination.

**Q2 — Should §1B K2 Swarm activity panel poll `/ws` or be static-with-local-animation?**
Recommendation: static (option 1 in §6). The "live" feel comes from the per-network firing badge being driven by the existing brain animation tick + activityData; the K2 readings themselves are warmup-baked and revealed on a stagger. This makes the dashboard work without `POST /brain/start` having been called. Counter-recommendation only if the orchestrator wants the iterative loop to literally play out before the user's eyes (which means latency + WS retrofit + ~60s of dashboard-watching before §4 paragraph appears).

**Q3 — Persona switcher default: `'workplace' | 'consumer' | 'pavilion'` derived from scenario, or user-controllable?**
Today `EmpathyDocumentStage.vue:88-90` derives `personaMode` from `scenario` (`ironside → workplace`, else `consumer`). Pavilion mode is unused. If the dashboard exposes a manual switcher (per shard §5 panel inventory), user can choose any of the 3, which means we need to confirm: is it OK to render "consumer" persona styling against an Ironside clip? Listen Labs prompt suggests yes (modular Opus polish per persona). Confirm with orchestrator before adding the switcher UI.

**Q4 — Loading stage: collapse fully or keep as a brief "ANALYZING…" pill on the dashboard?**
Recommendation: collapse fully (§7). But the user pivot says "single-page dashboard where everything happens together" — interpret literally. Confirm.

**Q5 — Region insight card: hover-only, or also click-to-pin?**
Icarus uses both: `onClickAnchor` (`Scene.tsx:14`) plus hover. The current `MainStage.vue:60-70` wires click → modal popup. For the dashboard, hover-to-reveal feels more dashboard-y; click-to-pin is useful when the user wants to read a long K2 reading without holding the mouse still. Recommend: hover reveals card, click toggles "pin" so card stays open when cursor moves away. Confirm with orchestrator.

**Q6 — `polished_paragraph` is currently `None` everywhere (`main.py:388`).** This means Stage 4 Opus polish is not yet wired into `_ensure_empathy`. Is A8 supposed to wire it (stretch into A3/A4 territory) or just gracefully degrade to `best_paragraph` (recommended; A8 stays in lane)? Recommend: degrade gracefully now, expect A3 swarm-loop-merge to wire Opus polish, and A8's §4 panel automatically lights up when the field becomes non-null.

**Q7 — `BrainScene.vue` is currently the only file that imports `OrbitControls`. Adding `EffectComposer` + `UnrealBloomPass` requires new imports from `three/addons/postprocessing/`. Any objection to growing the BrainScene.vue dependency surface?** Three.js's postprocessing addons are bundled with `three` (no separate npm install), so this is just a bundle-size concern, not a dep-management one. Recommend: yes, add. Alternative is rewriting against `postprocessing` library separately, which is heavier.

---

## Status

Audit complete. Report at `worktrees/A8-brain-dashboard-redesign/audits/A8-brain-dashboard-redesign.md`. All 12 sections present. Yeo7 anchor coords reference the **runtime computation path** (the only authoritative source per `brain_mesh.py:111-121`), with verification command and expected value ranges; the dashboard composable should bind directly to `meshNetworks.value[name].centroid` from `/brain/mesh`, not hardcoded numbers. Panel inventory has every panel mapped to a real backend endpoint (or a one-line addition to expose cached `swarm_readings`). Three audit findings (A8-F1 falsification field names, A8-F2 dead ComparisonStage import, A8-F3 silent control-activity fallback) escalated to orchestrator. No source code modified.
