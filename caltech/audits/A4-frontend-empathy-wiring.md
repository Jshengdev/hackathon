# A4 — Frontend ↔ EmpathyDocument wiring audit

**Worktree:** `worktrees/A4-frontend-empathy-wiring`
**Branch:** `audit/A4-frontend-empathy-wiring`
**Audit date:** 2026-04-25
**Mode:** read-only (no code changes per CONSTRAINTS rule 5)

**Scope:** Catalog every place the live demo's frontend touches (or *should* touch) the `/demo/empathy`, `/demo/iterative-trajectory`, `/demo/falsification`, and `/demo/k2-region` endpoints; document the inline-mock and silent-stub violations; recommend a migration order to land the new EmpathyDocument shape without breaking the running demo.

**Verification commands run** (every claim below is grounded in a command that actually executed in this worktree):

| # | Command | Why |
|---|---|---|
| V1 | `ls frontend/src/{stages,components,api}` | Stage / component inventory |
| V2 | `grep -n fetchComparison frontend/src/{api,stages,components}/**` | Confirm broken import |
| V3 | `grep -rn 'import.meta.env.DEV\|MOCK_\|process.env' frontend/src/` | Find any dev-gated mocks (zero matches) |
| V4 | `grep -rn 'trajectory\|paragraphExcerpt\|paragraph_excerpt\|round_trajectory' frontend/src/` | Trace key-name divergence |
| V5 | `grep -rn '@app\.get\|@app\.post' backend/` | Confirm live backend route surface |
| V6 | Read `backend/services/{falsification,iterative_loop}.py` + `backend/main.py:355–516` | Capture actual emitted payload shapes |
| V7 | `ls backend/prerendered/30s_ironsite/` | Confirm cache reality (only `comparison.json` legacy artifact present; no `empathy.json` / `falsification.json` baked yet) |

The wiring story underneath the audit is short: **the production route flow already consumes `/demo/empathy/{clip_id}` and `/demo/iterative-trajectory/{clip_id}` end-to-end through `EmpathyDocumentStage.vue` and `IterativeRevealStage.vue`.** The two big violations are (a) `ComparisonStage.vue` is dead code that imports a function that doesn't exist and ships a hand-written 8-round paragraph trajectory, and (b) `LoadingStage.vue` swallows fetch errors and ticks the "✓ ready" log line as if every stage succeeded.

---

## §1 · Stage call graph (every stage in `frontend/src/stages/`)

`App.vue:35` defines the live route order: **`landing → loading → main → iterative-reveal → empathy-document`**. `ComparisonStage.vue` is **not in the route map** and is unreachable through the running app. Every stage is consumed via the `:is="stageComponent"` switch in `App.vue:4–12`.

| Stage | API calls | Props expected | Renders | Inline mocks |
|---|---|---|---|---|
| **LandingStage** (`landing`) | `postDemoMatch(filename)` | none | dropzone → emits `matched` with `{clip_id, scenario, scenarioLabel}` | none |
| **LoadingStage** (`loading`) | `fetchVisionReport(clipId)`, `fetchActivity(clipId)`, `fetchWarmupStatus(clipId)` | `clipId` | dual progress streams + phase-rail; emits `done` with `{vision, activity}` | **`VISION_LOGS`/`TRIBE_LOGS` lines 95–106 are scripted UI labels (cosmetic — not data)**; **silent fallback on fetch error: `visionResult = null` / `tribeResult = null` then ticks `'✓ ready'`** (CONSTRAINTS #2 violation, see §3 / §7) |
| **MainStage** (`main`) | `videoUrl(clipId)` (synthesizes `/prerendered/...` URL), `postK2Region({clipId, network, t})` | `clipId`, `activityData`, `scenario` | `BrainScene` (left) + `<video>` (right) + `RegionPopup` | none in shipping data; on K2 region failure renders **fallback message** "Could not reach K2 — try again in a moment." (no status code; mild §7 violation) |
| **IterativeRevealStage** (`iterative-reveal`) | `fetchIterativeTrajectory(clipId)` | `clipId`, `scenario` | `RoundScoreBar` driven by `round_trajectory[]`; emits `reveal-done` | none — does **not** use `IterativeLoop.vue` (it uses `RoundScoreBar`). Visible error: "preview unavailable" with skip button. |
| **EmpathyDocumentStage** (`empathy-document`) | `fetchEmpathyDocument(clipId)` | `clipId`, `scenario`, `scenarioLabel` | `PersonaShell` + §A vision report + §B empathy paragraph + §C falsification verdict + collapsibles for trajectory & per-region | none — but **reads `f.delta`/`f.main_score`/`f.control_score`**, which match the backend output but **NOT** CONTRACTS C2 (`falsification_delta`/`main_paragraph_score`/`control_paragraph_score`). See §3 + §6. |
| **ComparisonStage** *(orphan)* | imports `fetchComparison` which **does not exist in `api/index.js`** | `clipId`, `activityData` | dual `AnalysisPanel` + `IterativeLoop` | **`trajectory` const at lines 63–72 is a hand-written 8-round mock** (CONSTRAINTS #4 violation) |

**Confirmed gaps vs. the canonical pipeline (`caltech/NEW-ARCHITECTURE.md` §1, §4):**
- No frontend consumer calls `fetchFalsification(clipId)` directly. `falsification` is read as an embedded field on the empathy doc instead. Acceptable per §A in the canonical doc ("falsification.json is also exposed standalone for debugging") — note as informational, not a violation.
- The K2 swarm activity feed (`WS /ws`) and the Stage-1B `swarm_readings.json` are **not consumed by any stage** today (App.vue has no WS client; only the simulation `broadcast(...)` server stub exists). Out of scope for A4 (this is brain-dashboard / live-swarm — covered by A8), but note: `MainStage.vue` has no live agent-edge animation despite the architecture diagram calling for it. Flag for the brain-dashboard shard.

---

## §2 · Inline mock violations in shipping code

`grep -rn 'import.meta.env.DEV' frontend/src/` returns **zero hits.** This means every mock listed below is shipping unconditionally — there is no DEV gate anywhere.

| File | Lines | Violation | Proposed real-fetch replacement |
|---|---|---|---|
| `frontend/src/stages/ComparisonStage.vue` | **63–72** | `const trajectory = [{round:1,score:0.42,paragraphExcerpt:'Worker walked …'}, … 8 rounds]` (hand-written) | If we keep the comparison view: `await fetchIterativeTrajectory(clipId)`, then transform `r.paragraph_excerpt` → `r.paragraphExcerpt` at the seam (or fix `IterativeLoop.vue` to read snake_case — see §5). If we don't keep the comparison view: **delete this file outright** (recommended; see §9). |
| `frontend/src/stages/ComparisonStage.vue` | **58, 114** | `import { fetchComparison } from '../api/index.js'` — `fetchComparison` is **not exported** from `api/index.js`, and there is **no `/demo/comparison` backend route** (`grep '@app\.' backend/main.py` confirms only `/demo/{clips,activity,vision-report,match,warmup-status,empathy,iterative-trajectory,falsification,k2-region}`). The cache folder still has a legacy `comparison.json` from before the cut, but nothing serves it. | Delete `ComparisonStage.vue` + its lone `IterativeLoop` consumer entry. Or, if the side-by-side view is wanted post-pitch: synthesize `comparison.without_tribe`/`comparison.with_tribe` from `empathy.vision_report` (without) and `empathy.best_paragraph + empathy.per_region_attribution` (with). New endpoint not needed. |
| `frontend/src/components/IterativeLoop.vue` | **161–168** | The `trajectory` prop's **default value** is the same 8-round mock paragraph. This is a fallback that fires whenever no parent passes `:trajectory`, masking a missing-data condition. | Default to `() => []`. Render an explicit empty-state ("REAL DATA MISSING — no round trajectory") instead of fluent fake rounds. Component is currently only consumed by the orphan ComparisonStage, so the change is low-risk. |
| `frontend/src/stages/LoadingStage.vue` | **95–106** | `VISION_LOGS = ['Extracting frames…', 'Calling Claude vision…', …]` and `TRIBE_LOGS = ['Loading TRIBE predictions…', …]` are **scripted log lines that animate even if the backend call already returned or failed**. | These are *cosmetic* — they drive the per-stream typewriter feed, not data. Per CONSTRAINTS #2 they're acceptable as long as a real failure renders a visible failure surface. **They become a violation in combination with the silent-fail handlers at lines 156–169 / 187–202** (the success log `'✓ Vision report ready'` / `'✓ Activity loaded'` is appended even when the fetch threw). Recommendation: gate the success-line on `visionResult != null` / `tribeResult != null`, and emit `'✗ Vision FAILED · {status}'` (red) on error. |

---

## §3 · API function inventory (`frontend/src/api/index.js`)

Every export, its endpoint, its consumers, and the live shape it returns. Verified by reading `backend/main.py:222–516`.

| Export | Method/Path | Consumed by | Returns (verified live) | Notes |
|---|---|---|---|---|
| `fetchMesh()` | `GET /brain/mesh` | `BrainScene.vue` | `{vertices, faces, networks}` | OK |
| `startSim()` | `POST /brain/start` | (none in stages — dev-only via `BrainScene` callsite) | void | OK |
| `stopSim()` | `POST /brain/stop` | (none) | void | OK |
| `fetchStatus()` | `GET /brain/status` | (none) | `{...}` | OK |
| `postDemoMatch(filename)` | `POST /demo/match {filename}` | `LandingStage` | `{clip_id, video_url, activity_url, n_frames, has_video, scenario, scenarioLabel}` | OK; matches CONTRACTS C5. **Note:** `scenarioLabel` is camelCase here but `scenario_label` is snake_case in `_ensure_empathy()`. EmpathyDocumentStage uses the camelCase one from match payload. |
| `fetchVisionReport(clipId)` | `GET /demo/vision-report/{clip_id}` | `LoadingStage` | `{scene_summary, actions, …}` (from `services/vision_client.analyze_video`) | OK |
| `fetchActivity(clipId)` | `GET /demo/activity/{clip_id}` | `LoadingStage` | `activity.json` per CONTRACTS C1 | OK |
| `postK2Region({clipId, network, t})` | `POST /demo/k2-region` | `MainStage` | `{network, t, text, confidence, cite, raw}` (or on K2 failure: `{network, t, text:"[K2 call failed: …]", confidence:"", cite:null, stub:true, error:...}` with **HTTP 200**) | **§7 + §6 violation:** the `stub: true` error path returns 200 with a stubbed `text` field. RegionPopup renders that bracketed text as if it were a real reading. CONSTRAINTS #2: should return 5xx OR an `error` payload that the popup recognizes and renders as `K2 CALL FAILED · {status}` red badge. |
| `fetchEmpathyDocument(clipId)` | `GET /demo/empathy/{clip_id}` | `EmpathyDocumentStage` | `{clip_id, scenario, scenario_label, vision_report, swarm_readings, best_paragraph, polished_paragraph, final_score, round_trajectory, per_region_attribution, falsification}` | OK; `polished_paragraph` is `null` until Stage 4 Opus polish runs. See §4 + §6. |
| `fetchIterativeTrajectory(clipId)` | `GET /demo/iterative-trajectory/{clip_id}` | `IterativeRevealStage` | `{clip_id, round_trajectory, final_score, best_paragraph}` | OK; `round_trajectory[i] = {round, score, paragraph_excerpt}` only — see §5. |
| `fetchFalsification(clipId)` | `GET /demo/falsification/{clip_id}` | **(no consumer)** | `{main_score, control_score, delta, verdict}` | Unused — `falsification` is read as embedded field on `empathy.value` instead. Keep export (debug surface) but call out: **no stage proves the standalone endpoint is healthy.** |
| `fetchWarmupStatus(clipId)` | `GET /demo/warmup-status/{clip_id}` | `LoadingStage` | `{ready: bool, stages_done: [...]}` | OK; **but `LoadingStage:waitForWarmup` line 211 silently swallows missing-endpoint errors** — see §7. |
| `videoUrl(clipId)` | (synthesizer) `/prerendered/{clip_id}/{clip_id}.mp4` | `MainStage` | URL string | OK |

**No-consumer surfaces** (defensive imports only): `fetchFalsification`, `fetchStatus`, `startSim`, `stopSim`. Acceptable.

---

## §4 · Empathy endpoint integration plan (ComparisonStage migration)

**TL;DR — there is nothing to migrate in the live route.** `EmpathyDocumentStage.vue` (the one stage in the live App.vue route) **already** calls `fetchEmpathyDocument(clipId)` against `/demo/empathy/{clip_id}` and renders all three §A/§B/§C sections. The "ComparisonStage consumes `/demo/comparison`" line in `SHARD.md` is **stale** — that stage was already cut from the route map and its data fetch is broken (`fetchComparison` undefined; `/demo/comparison` endpoint not in `backend/main.py`). The shipping live demo today goes `landing → loading → main → iterative-reveal → empathy-document`.

So the integration plan is two parallel paths, not one:

### §4.A · Remove the dead path (recommended)

`ComparisonStage.vue` is unreachable + broken. Two-line patch (R-shard, not this audit):

1. Delete `frontend/src/stages/ComparisonStage.vue`.
2. Delete `frontend/src/components/IterativeLoop.vue` **OR** keep it for a future re-introduction, but replace its mock default-prop with `() => []` and fix the `paragraphExcerpt` ↔ `paragraph_excerpt` casing (see §5). Component is otherwise architecturally aligned with the v2 `round_trajectory[]` shape.

### §4.B · Patch the live consumers (the actual A4 deliverable)

| Patch site | Current | Required (per CONTRACTS C2 + canonical doc §4) |
|---|---|---|
| `EmpathyDocumentStage.vue:108` | `delta = ${(f.delta ?? 0).toFixed(2)} (main ${(f.main_score ?? 0).toFixed(2)} − control ${(f.control_score ?? 0).toFixed(2)}) · verdict: ${f.verdict}` — matches **backend** (`compute_falsification`) but **not** CONTRACTS C2 | **Decision needed**: either (i) update backend `services/falsification.py:19–24` to emit `falsification_delta`/`main_paragraph_score`/`control_paragraph_score` per CONTRACTS C2 and rename frontend reads, or (ii) update CONTRACTS C2 to match backend (fewest moving parts). Today, frontend + backend agree; only the spec is out of sync. **Flag for orchestrator.** |
| `EmpathyDocumentStage.vue:95` | `empathy.value?.polished_paragraph || empathy.value?.best_paragraph` | Correct. Backend emits `polished_paragraph: None` until Stage 4 (Opus polish) runs. CONTRACTS C2 doesn't list `polished_paragraph` — extend the contract to include it (recognized in backend `_ensure_empathy:381–393`). Fallback to `best_paragraph` is the correct cut-line behavior per CONSTRAINTS #3 ("Cut entirely if behind 8 PM Saturday — K2's `best_paragraph` ships as-is"). |
| `EmpathyDocumentStage.vue:99` | `empathy.value?.round_trajectory \|\| []` | OK; per C3 frontend can ignore unknown additive fields like `specialist_readings`/`cross_region_edges`. |
| `EmpathyDocumentStage.vue:101–103` | `Object.entries(per_region_attribution).map(([network, v]) => ({ network, ...v }))` then renders `row.candidate_match`, `row.target`, `row.justification` | Backend `iterative_loop.evaluate_paragraph` emits `{network, score, justification}` per region (via the evaluator-swarm output). **Schema mismatch:** frontend expects `candidate_match`/`target`/`justification`; backend emits `score`/`justification` only. The `target` and `candidate_match` columns will render `0.00` for every row because those keys never exist in the payload. **Action:** either backend extends `evaluate_paragraph` to emit `{candidate_match, target, justification}`, or frontend renames its renderer to read `score` (no `target` reference). See §5 for the full schema diff table. |

**Concrete patch outline (R-shard, not this audit):**

```text
A. backend/services/falsification.py
   Decide: rename to (falsification_delta, main_paragraph_score, control_paragraph_score)
   per CONTRACTS C2, OR update CONTRACTS C2 to match current keys.
   Add main_video_id / control_video_id (currently absent — clip ids must be passed in).

B. backend/services/iterative_loop.py:178–185
   round_trajectory[].entry currently {round, score, paragraph_excerpt}.
   Per CONTRACTS C2/C3 the schema is additive: add specialist_readings + cross_region_edges
   if/when emit-time data is available. Frontend already tolerates missing keys.

C. backend/services/iterative_loop.py:evaluate_paragraph (per-region)
   Emit {candidate_match, target, justification} per network so EmpathyDocumentStage's
   attribution table renders meaningful columns. Currently per-network entries are {score,
   justification} — both `candidate_match` and `target` columns render 0.00.

D. frontend/src/stages/EmpathyDocumentStage.vue:108
   No-op until backend lands the rename above. Today the frontend matches backend, neither
   matches CONTRACTS C2.

E. frontend/src/api/index.js
   Tag all 4xx/5xx error throws with the HTTP status so consuming components can render
   "K2 CALL FAILED · 401" red badges (CONSTRAINTS #2). Today every fetch throws a generic
   Error and the message gets buried.
```

---

## §5 · IterativeLoop schema gap

**Component:** `frontend/src/components/IterativeLoop.vue`.
**Live consumer in route:** none. **Dead consumer:** `ComparisonStage.vue` (unreachable).

Side-by-side: what the component reads vs. what the backend emits vs. what CONTRACTS C2/C3 specify.

| Field | `IterativeLoop.vue` reads | Backend `round_trajectory[i]` emits | CONTRACTS C2/C3 | Status |
|---|---|---|---|---|
| `round` | `r.round` (line 113, 161) | `round` (snake/non-cased — int) | `round` | ✅ match |
| `score` | `r.score` (line 192) | `score` (rounded to 4dp) | `score` | ✅ match |
| paragraph excerpt | **`r.paragraphExcerpt`** (camelCase, line 193) | **`paragraph_excerpt`** (snake_case, `iterative_loop.py:184`) | `paragraph_excerpt` | ❌ **CASE MISMATCH** |
| specialist readings | not read | not emitted | `specialist_readings: {...}` | gap (additive — both sides missing; defer until live swarm emits) |
| cross-region edges | not read | not emitted | `cross_region_edges: [...]` | gap (additive — both sides missing) |

**Cause of mismatch:** the component was authored against `caltech/engine/runner.py:EmpathyDocument` (camelCase), not the v2 backend (snake_case). The mock default at `IterativeLoop.vue:161–168` masks the bug because it uses camelCase too — so dev-mode renders fine.

**Recommended fix (R-shard):**
1. `IterativeLoop.vue:193` → `r.paragraph_excerpt ?? r.paragraphExcerpt ?? ''` (one-line bridge that tolerates both shapes during the rename window).
2. Replace the prop's default value with `() => []` and render an empty-state (CONSTRAINTS #2/#7).
3. Once `specialist_readings`/`cross_region_edges` start showing up in `round_trajectory[]`, surface them as the per-round inset (the icarus-style anchored hover card pattern referenced in canonical doc §5).

---

## §6 · RegionPopup contract — current vs desired

**Component:** `frontend/src/components/RegionPopup.vue`.
**Producer:** `frontend/src/stages/MainStage.vue` (forwards `POST /demo/k2-region` response).
**Backend route:** `backend/main.py:433–516` (`@app.post("/demo/k2-region")`).

### Current (verified)

| Field | Backend emits (success) | Backend emits (K2 failure) | MainStage forwards | RegionPopup consumes |
|---|---|---|---|---|
| `network` | ✓ string | ✓ | `network` ← prop | `props.network` |
| `t` | ✓ int | ✓ | `t` ← prop | `props.t` |
| `text` | ✓ string (parsed Reading line) | `"[K2 call failed: <exception>]"` | `res.text \|\| res.narration \|\| res.message` | `props.text` |
| `confidence` | ✓ string ("high"/"medium"/"low" via `_parse_observation`) | `""` | `res.confidence \|\| ''` | `props.confidence` (mapped to label + bar ratio; falls back to neutral 0.5 if unknown) |
| `cite` | ✓ string (citation, brackets stripped) | `null` | `res.cite \|\| res.citation \|\| ''` | `props.cite` (renders `cite · {cite || 'unattributed'}`) |
| `raw` | ✓ string (full K2 reply text) | absent | unused | unused |
| `stub` | absent | `true` | unused | unused |
| `error` | absent | exception string | unused | unused |
| `runtimeSec` | **absent** | absent | not set on popup state | `props.runtimeSec` (renders `t={t}s · {n}s` when set; falls back to `t={t}s` only) |

### Required

| Field | Why |
|---|---|
| **`runtime_sec`** | RegionPopup is built to render call latency (`runtimeLabel` computed at line 99–103). Currently always renders `t={t}s · ` — the latency leg is silenced. Backend must measure `time.perf_counter()` around `get_k2_client().chat(...)` and emit `runtime_sec` (snake_case to match the rest of the API surface). MainStage maps to camelCase prop (`runtimeSec: res.runtime_sec`). |
| **`error` payload + non-2xx HTTP** on K2 failure | CONSTRAINTS #2: "❌ NOT acceptable: silently returning a hand-written stub paragraph that looks like real K2 output." Today the failure path returns 200 with `text: "[K2 call failed: …]"` + `stub: true`. The popup renders the bracketed text in its normal styling. **Required:** either return HTTP 502/503 with `{error: "k2_unavailable", network, status, body}` per CONSTRAINTS rule 2 canonical shape, or keep 200 but extend RegionPopup to read `props.error` / `props.stub` and render a `K2 CALL FAILED · {status}` red badge (red = `--red: #fc7981` per CONSTRAINTS §6.5). |
| **`runtime_sec`** propagation in `MainStage.vue:133–139` | Prop is plumbed but never set. Add `runtimeSec: res.runtime_sec` to the success branch. |
| **`status` (HTTP code)** propagation when MainStage's catch-clause fires | Today the catch shows "Could not reach K2 — try again in a moment." with no status. Surface `e.message` (the `api/index.js` error format already includes the status: `'k2-region failed: ${r.status}'`). |

### Concrete diff outline (R-shard)

```text
backend/main.py:487–498  (k2_region failure branch)
  + import time
  + start = time.perf_counter()
    text = await get_k2_client().chat(...)
  + runtime = time.perf_counter() - start
    on success: include "runtime_sec": round(runtime, 3)
    on failure: HTTP 502 with {"error":"k2_unavailable","network":...,"clip_id":...,"detail":...}
                (NOT 200 + stub:true text)

frontend/src/api/index.js:postK2Region
  - if (!r.ok) throw new Error(`k2-region failed: ${r.status}`)
  + if (!r.ok) {
  +   const body = await r.text().catch(()=> '')
  +   throw Object.assign(new Error('k2-region failed'), { status: r.status, body })
  + }

frontend/src/stages/MainStage.vue:121–148  (onRegionClicked)
  catch (e) → popup.text = 'K2 CALL FAILED'  // visible
              popup.confidence = `· ${e.status || 'network'}`  // status badge
              popup.cite = ''
              popup.runtimeSec = null
              popup.errored = true            // new prop drives red styling

frontend/src/components/RegionPopup.vue
  + props: { errored: { type: Boolean, default: false } }
  + class binding: { 'is-errored': errored } → red border + red telemetry-fill
```

---

## §7 · Error-state coverage per stage

For every stage and every fetch, what does the user see on backend 4xx / 5xx / network error?

| Stage | Fetch | Today's behavior on failure | Verdict vs. CONSTRAINTS #2 + #7 |
|---|---|---|---|
| **LandingStage** | `postDemoMatch` | Catch sets `error.value = "Couldn't match \"${filename}\"."` and `dropzone.has-error` red border. **No HTTP status surfaced.** | ⚠️ visible but not graded — should also include `e.message` (which `api/index.js` formats as `'demo/match failed: ${r.status}'`). |
| **LoadingStage** | `fetchVisionReport` | `console.error(...)`, `visionResult = null`, then **`visionDone = true`** + log push **`'✓ Vision report ready'`**. Phase rail completes as if success. | ❌ **CONSTRAINTS #2 violation.** This is the textbook "silent stub disguised as success" — the green check is a lie. |
| **LoadingStage** | `fetchActivity` | Identical: `tribeResult = null`, `tribeDone = true`, pushes `'✓ Activity loaded'`. | ❌ same violation. |
| **LoadingStage** | `fetchWarmupStatus` | First failure (likely 404 if endpoint absent on older backends) → returns `false` from `waitForWarmup` and **proceeds without gating**. Comment at line 211 says "Endpoint may not exist on older backends — proceed without gating." | ❌ **CONSTRAINTS #2 + PRD §3 violation.** Pre-warmup contract requires polling until `ready: true`. The fallback masks a real cache-warm failure. **Mitigating factor (don't-be-a-blocker rule):** if the endpoint genuinely doesn't exist on demo-day backend, gating would freeze the UI. Recommendation: keep the bypass but emit a visible "WARMUP UNAVAILABLE" yellow banner (CONSTRAINTS §6.5 lemon-500) so it's *known* not silent. |
| **MainStage** | `postK2Region` | Catch sets `popup.text = 'Could not reach K2 — try again in a moment.'` — visible, but rendered in normal styling. **No HTTP status.** Backend's own 200+stub failure path bypasses this entirely. | ⚠️ partially visible; needs red-badge styling + status code. See §6. |
| **IterativeRevealStage** | `fetchIterativeTrajectory` | Catch sets `error.value = 'preview unavailable'` + skip button. Empty trajectory: `'no trajectory available'`. Both render in red `.err`. | ✅ acceptable — visible failure with skip CTA. Could improve by surfacing status. |
| **EmpathyDocumentStage** | `fetchEmpathyDocument` | Catch sets `error.value = 'could not load empathy document'` rendered in red. **No status.** | ✅ acceptable; recommend appending `e.message`. |
| **MainStage / BrainScene** | `fetchMesh` (BrainScene mounts) | not audited (out of A4 scope) | n/a |

**Summary verdict:** The two real violations are `LoadingStage.runVision`/`runTribe` (silent ticks of `'✓ ready'` after a swallowed throw) and `LoadingStage.waitForWarmup` (silent bypass on missing endpoint). The K2-region 200+stub backend response is the third violation, but it's a backend issue mirrored in the frontend.

---

## §8 · Scenario routing recommendation (Ironsight ↔ Listen Labs)

### Today's flow

1. `LandingStage.vue:106` — `postDemoMatch(filename)` returns `{scenario, scenarioLabel}` (camelCase).
2. `App.vue:73–82` (`onMatched`) — stores `scenario` and `scenarioLabel` in `App.vue` state. Defaults `scenario` to `'consumer'` if missing.
3. `App.vue:54–71` (`stageProps`) — passes `scenario` to `MainStage`, `IterativeRevealStage`, `EmpathyDocumentStage` (it's NOT passed to `LoadingStage`, which is fine — Loading is scenario-agnostic).
4. `EmpathyDocumentStage.vue:88–90` — maps `scenario === 'ironside' → 'workplace'`, anything else → `'consumer'`. Forwards as `personaMode` to `PersonaShell`.
5. `PersonaShell.vue:8–14` — accepts `'workplace'`, `'consumer'`, or `'pavilion'`. Sets `--accent` and `--serif` CSS vars.
6. `MainStage` and `IterativeRevealStage` accept `scenario` as a prop but **do not read it** — purely cosmetic plumbing.

### Issues found (verified by reading `backend/prerendered/30s_ironsite/scenario.json`)

- The cached `scenario.json` literal value is `"ironside"` (no T). The frontend matches on that spelling. Canonical doc / CONTRACTS C1 / PRD §6.7 use `"ironsight_workplace"` (with T, suffixed). **Three incompatible spellings live in the codebase right now: `ironside` (cache + frontend match), `ironsight` (architecture-overview / pitch-deck), `ironsight_workplace` (PRD §6.7 + CONTRACTS C1 example).** Until the orchestrator picks one, every consumer must alias.
- `PersonaShell` supports `'pavilion'` (the Listen Labs simulation use-case in the canonical doc §1) but **no caller ever sets it.** The match payload only ever produces `ironside` or `consumer`. Listen Labs simulation framing currently has no entry point.
- `scenario_label` (snake) vs `scenarioLabel` (camel) — `_ensure_empathy()` writes snake, `match_clip_with_warmup()` writes camel. EmpathyDocumentStage uses the camel version (from match), not the empathy-doc version. Works today but fragile.

### Recommendation (orchestrator decision; not a code change in A4)

1. **Pick one canonical spelling for the scenario enum** — propose `ironsight | consumer | pavilion` (matches canonical doc §1, drops the `_workplace` suffix). Update `backend/services/warmup.py:_load_scenario` defaults, every cache `scenario.json`, the PRD §6.7 example, and the EmpathyDocumentStage check.
2. **Add a `pavilion` scenario clip** in `backend/prerendered/` so Listen Labs framing can be demoed. Today there's no path to render PersonaShell's pavilion mode.
3. **Plumb `scenario` from EmpathyDocumentStage into the empathy-paragraph prompt seam** — Stage 4 Opus polish reads scenario to choose the persona-shell framing. Currently the entire backend `_ensure_empathy()` pipeline takes scenario through `synthesize(...)` (`iterative_loop.py:163`), but Stage 4 is `polished_paragraph: None` everywhere because Opus isn't wired to the live route. When Stage 4 lands, it should accept scenario as a kwarg.
4. **Pass `scenario` to `IterativeRevealStage` so the round-by-round excerpt can be styled per persona** — currently the prop is accepted but unused.

---

## §9 · Migration order (don't break the running demo)

The seam is `frontend/src/api/index.js`. Refactor outward from the seam.

| Order | File | Change | Risk if done out of order | Verification |
|---|---|---|---|---|
| **1** | `frontend/src/api/index.js` | Tag all `throw new Error(...)` with `{ status, body }` so consumers can render status codes. Confirm `fetchEmpathyDocument`, `fetchIterativeTrajectory`, `fetchK2Region` all surface the HTTP status. **No new exports yet.** | Zero — additive change to error metadata. | `grep -n 'throw new Error' frontend/src/api/index.js` — every line should be replaced with the status-tagged form. |
| **2** | `frontend/src/stages/LoadingStage.vue` | Stop ticking `'✓ ready'` on a swallowed throw; emit `'✗ vision FAILED · {status}'` red log instead. Make `waitForWarmup` failure render a yellow banner instead of silent bypass. | Without Step 1, status code isn't available. | Manual: kill backend → reload landing → verify red `'✗'` log appears in stream feed; phase-rail does NOT advance to `done`. |
| **3** | `frontend/src/stages/MainStage.vue` + `frontend/src/components/RegionPopup.vue` | Accept `errored` prop; surface `K2 CALL FAILED · {status}` with red border. Plumb `runtimeSec` from response. | Without Step 1, status is unknown. Without backend §6 fix, success path still has no `runtime_sec`. | Manual: click any brain region → popup shows `t=Xs · Ys` runtime. Kill backend → click region → red badge `K2 CALL FAILED · 502`. |
| **4** | `backend/main.py:487–516` (`k2_region`) | (a) Wrap K2 call in `time.perf_counter()` and emit `runtime_sec`. (b) On K2 failure return HTTP 502 + canonical `{error, network, clip_id}` payload — **not** 200 with `stub: true, text: '[K2 call failed: …]'`. | Frontend Step 3 will render `K2 CALL FAILED` even on success if the backend keeps the 200+stub path. | `curl -X POST localhost:8000/demo/k2-region -d '{"clip_id":"30s_ironsite","network":"visual","t":0}'` → success returns `runtime_sec`; with K2 unauthorized → returns 502, not 200. |
| **5** | `frontend/src/stages/EmpathyDocumentStage.vue` + `backend/services/falsification.py` | Coordinated: pick CONTRACTS C2 names OR keep current names; flip both sides together. Add `main_video_id`/`control_video_id` to backend. Frontend renames `f.delta`/`f.main_score`/`f.control_score` accordingly. Decide on `polished_paragraph` (extend C2 to include it). | If only one side changes, EmpathyDocumentStage's §C verdict line goes blank. | Reload `/demo/empathy/30s_ironsite` → §C renders verdict line and per-region table with non-zero `target` column. |
| **6** | `backend/services/iterative_loop.py:evaluate_paragraph` | Emit `{candidate_match, target, justification}` per network so EmpathyDocumentStage's attribution table renders meaningful columns. | Without this, the `target` column is permanently `0.00` even after step 5. | Reload → table cells under "target" are non-zero. |
| **7** | `frontend/src/stages/ComparisonStage.vue` + `frontend/src/components/IterativeLoop.vue` | **Delete `ComparisonStage.vue`** (orphan + broken import). For `IterativeLoop.vue`: replace mock default with `() => []`, fix `paragraphExcerpt` → `paragraph_excerpt` reader, leave the file in place for future use (canonical doc §5 calls for it in the brain-hero panel). | Deleting ComparisonStage is safe (not in App.vue route map). Deleting `IterativeLoop` would break ComparisonStage if it weren't already deleted. | `grep -rn ComparisonStage frontend/src/` → zero hits after delete. App still routes through `iterative-reveal` → `empathy-document` cleanly. |
| **8** | Scenario rename (orchestrator-coordinated) | Pick `ironsight \| consumer \| pavilion`. Update every `scenario.json`, frontend matcher, and PRD §6.7. Add a pavilion clip. | Out-of-order rename leaves matched-clip → empty PersonaShell. | Drop `30s_ironsite.mp4` → scenario chip says `ironsight`; drop a pavilion clip → PersonaShell renders pavilion accent. |

**Don't-be-a-blocker note:** if any of the above can't land before demo, `LoadingStage`'s silent fallbacks should be **converted, not removed**. CONSTRAINTS rule 2 — log + surface — is the canonical conversion target. Leaving them as silent ticks is the actual violation; flipping them to a visible "REAL DATA MISSING" badge is acceptable even if Stage 5/6/7 slip.

---

## §10 · Status

- ✅ Audit report written: `worktrees/A4-frontend-empathy-wiring/audits/A4-frontend-empathy-wiring.md`
- ✅ All 9 SHARD.md required sections present (§1–§9; §10 = status as required)
- ✅ Every recommendation cites a frontend file path with line number
- ✅ Every backend reference cites a `backend/main.py` or `backend/services/*.py` line number verified by grep + Read
- ✅ Zero source files modified (CONSTRAINTS rule 5 honored)
- ⚠️ Three cross-shard escalations flagged for the orchestrator:
  1. **Falsification key naming** — backend (`main_score/control_score/delta`) ↔ CONTRACTS C2 (`main_paragraph_score/control_paragraph_score/falsification_delta`) divergence. Pick one.
  2. **Scenario enum spelling** — three incompatible spellings (`ironside`, `ironsight`, `ironsight_workplace`) in cache + frontend + PRD. Pick one.
  3. **Per-region attribution schema** — frontend reads `candidate_match`/`target`/`justification`; backend `evaluate_paragraph` emits `score`/`justification`. Currently the `target` column is dead weight. Decide whether to extend backend or shrink the table.
