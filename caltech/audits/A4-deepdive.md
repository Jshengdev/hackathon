# A4 — Deep-dive (falsification field naming + LoadingStage silent-fail)

**Worktree:** `worktrees/A4-frontend-empathy-wiring`
**Mode:** read-only (no source modified per CONSTRAINTS rule 5)
**Date:** 2026-04-25
**Scope:** Two follow-up dives requested after the §10 escalations in `audits/A4-frontend-empathy-wiring.md`.

---

## DEEP-DIVE 1 — Falsification field-name divergence

**Question:** Should `{main_score, control_score, delta}` (backend) move to `{main_paragraph_score, control_paragraph_score, falsification_delta}` (CONTRACTS C2), or vice versa?

### 1.a · Frequency analysis (every reader / writer of these field names)

`grep -rn` ran across `backend/`, `frontend/src/`, `caltech/`, `_bmad-output/`, and the worktree's `CONTRACTS.md`. Tally split into **live demo path** (what runs Saturday) and **offline harness + docs**:

#### Live demo path (`backend/services/*` + `backend/main.py` + `frontend/src/*`)

All four sites already agree on the **short-form** names (`main_score`, `control_score`, `delta`):

| File:line | Role | Field names |
|---|---|---|
| `backend/services/falsification.py:15-23` | canonical compute (the source of truth) — emits 4 keys | `main_score`, `control_score`, `delta`, `verdict` |
| `backend/services/warmup.py:198-202` | fallback shape on compute exception | `main_score: 0.0`, `control_score: 0.0`, `delta: 0.0`, `verdict: "unknown"` |
| `backend/main.py:375-392` | passes the `falsif` dict through to `empathy.falsification` and `/demo/falsification/{clip_id}` | (passthrough — no key reads) |
| `frontend/src/stages/EmpathyDocumentStage.vue:108` | only frontend reader; renders `verdictLine` | `f.delta`, `f.main_score`, `f.control_score`, `f.verdict` |

**Live readers/writers using short-form: 4 sites. Live readers/writers using long-form: 0.**

#### Offline harness (`caltech/engine/*`) — does not run during the demo

| File:line | Field names |
|---|---|
| `caltech/engine/falsification.py:34-79` (`FalsificationCheck` dataclass) | `main_video_id`, `control_video_id`, `main_paragraph_score`, `control_paragraph_score`, `falsification_delta` |
| `caltech/engine/test_loop_offline.py:171-177` | reads long-form |
| `caltech/engine/test_runner_offline.py:109-114` | reads long-form |
| `caltech/engine/HANDOFF_CONTRACT.md:98-117` | documents long-form |

This harness is the **historical origin** of the long-form names. CONTRACTS C2 was clearly imported from `HANDOFF_CONTRACT.md`. The harness is decoupled from the live `backend/` and is not consumed by any frontend code (verified — `grep -rn 'caltech/engine' frontend/` → 0 hits, `grep -rn 'caltech.engine' backend/` → 0 hits).

#### Docs

| File:line | Names used | Notes |
|---|---|---|
| `worktrees/A4-frontend-empathy-wiring/CONTRACTS.md:54` | **long-form** | the violator — the only doc binding to the long-form for the live demo |
| `caltech/architecture-overview.md:270-284` | short-form (`main_score`, `control_score`, `delta`) | aligned with backend |
| `caltech/NEW-ARCHITECTURE.md:74` | short-form | aligned with backend |
| `caltech/build-plan-locked.md:288-289` | short-form | aligned with backend |
| `caltech/3-person-build-plan.md:99` | short-form (`main_score, control_score, delta, verdict`) | aligned with backend |
| `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` | **mixed** — §6.6 example (lines 568-574) uses long-form; §3 prose / formula (lines 280-282, 397-398) uses short-form | internally inconsistent |
| `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md:500, 670-671, 818` | mixed | strategic PRD; already marked stale per CONSTRAINTS §6 |
| `caltech/engine/HANDOFF_CONTRACT.md:98-117` | long-form | offline-harness contract — does not bind the live demo |
| `caltech/pitch-deck/PITCH-STORY.md:493-494` | long-form | pitch artifact, not load-bearing on the demo path |

#### Break-cost matrix (per choice)

| Decision | Live-path edits | Cached-data invalidation | Doc edits |
|---|---|---|---|
| **A. Move backend → long-form** | 4 sites (`backend/services/falsification.py:20-22`, `backend/services/warmup.py:198-202`, `backend/services/session_cache.py` invalidates 1 entry, `frontend/src/stages/EmpathyDocumentStage.vue:108`) | **Every cached `empathy.json` and `falsification.json` already on disk under `backend/prerendered/<clip>/` becomes stale.** `_ensure_empathy()` (backend/main.py:355) reads cached files via `read_cached(...)` and won't regenerate unless caches are nuked. Saturday warm-bake re-runs would fix it, but there's a regression window. | 5 docs adopt long-form everywhere (architecture-overview, NEW-ARCHITECTURE, build-plan-locked, 3-person-build-plan, technical PRD §3 / §4) |
| **B. Move CONTRACTS → short-form** | **0 live-path edits.** | **0 cache invalidation.** Every existing `empathy.json` / `falsification.json` on disk stays valid. | 3 doc edits: `CONTRACTS.md:54` line, `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md:568-574` (§6.6 JSON example), `caltech/engine/HANDOFF_CONTRACT.md:98-117` (offline-harness reference; optional — could leave it pinned to the engine names). The pitch-deck `PITCH-STORY.md` and stale strategic PRD do not need to flip — they're outside the contract surface. |

### 1.b · Decision: **Pick B — update the spec, not the code.**

Rationale:

1. **The live demo path already agrees.** Backend emits short-form, frontend reads short-form, every cached JSON on disk uses short-form, every architecture doc downstream of the v2 cut (`caltech/{architecture-overview, NEW-ARCHITECTURE, build-plan-locked, 3-person-build-plan}`) uses short-form. CONTRACTS C2 is the outlier.
2. **Long-form added two extra fields** (`main_video_id`, `control_video_id`). These are nowhere in the live path. Adding them as part of a "rename to long-form" is a feature addition, not a rename — and it doesn't unblock the demo. Defer to post-demo if anyone wants them.
3. **Cache invalidation is the silent killer.** Every `empathy.json` baked between now and demo would have to be re-warmed if backend keys change. The Saturday 8 AM warm-bake budget is already tight (per `caltech/build-plan-locked.md:333-345`). Don't burn it on a rename.
4. **Don't-be-a-blocker rule** (CONSTRAINTS §0 + rule 6): a contract that no live consumer satisfies is worth less than the working code it claims to govern. Update the contract.

### 1.c · Exact diff spec

> **Audit-only — no edits applied. R-DOCS shard executes.**

#### File 1 of 3 — `worktrees/A4-frontend-empathy-wiring/CONTRACTS.md`

Replace line 54:

```diff
- "falsification": { "main_video_id": "...", "control_video_id": "...", "main_paragraph_score": 0.84, "control_paragraph_score": 0.27, "falsification_delta": 0.57, "verdict": "anchored" },
+ "falsification": { "main_score": 0.84, "control_score": 0.27, "delta": 0.57, "verdict": "anchored" },
```

Plus add a one-line rationale comment above (lines 39-41 area):

```diff
+ Note: v2 demo path uses the compact key set { main_score, control_score, delta, verdict }
+ to match the live emit shape from backend/services/falsification.py. Long-form names
+ { main_paragraph_score, control_paragraph_score, falsification_delta } + the *_video_id
+ pair belong to the offline harness in caltech/engine/ and are out of scope for the
+ live demo contract.
```

#### File 2 of 3 — `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md`

§6.6 (lines 568-575) is the JSON example. Replace:

```diff
- {
-   "main_video_id": "demo-input-1.mp4",
-   "control_video_id": "workplace_routine_baseline.mp4",
-   "main_paragraph_score": 0.84,
-   "control_paragraph_score": 0.27,
-   "falsification_delta": 0.57,
-   "verdict": "anchored"  // delta > 0.40 = anchored; ≤ 0.40 = generic-plausible (red flag)
- }
+ {
+   "main_score": 0.84,
+   "control_score": 0.27,
+   "delta": 0.57,
+   "verdict": "anchored"  // delta > 0.40 = anchored; ≤ 0.40 = generic_plausible (red flag)
+ }
```

The §3 prose (lines 280-282) and the formula block (lines 397-398) already use short-form — leave them. Verdict-string note: backend emits `generic_plausible` (underscore), not `generic-plausible` (hyphen). Update the comment to match.

#### File 3 of 3 — `caltech/engine/HANDOFF_CONTRACT.md`

This is the offline-harness contract. Two paths:

- **Path A (recommended):** leave as-is. Add a header note: "this contract governs `caltech/engine/`'s offline harness only. The live demo's contract is `worktrees/.../CONTRACTS.md` C2."
- **Path B:** flip it to short-form anyway. Cost: 4 line edits + breaking the offline `test_loop_offline.py` and `test_runner_offline.py` tests. Avoid unless the engine harness is being removed.

#### Docs that DO NOT need updates

| File | Why |
|---|---|
| `caltech/architecture-overview.md` | Already uses short-form (lines 270-284). No change. |
| `caltech/NEW-ARCHITECTURE.md` | Already uses short-form (line 74). No change. |
| `caltech/build-plan-locked.md` | Already uses short-form (lines 288-289). No change. |
| `caltech/3-person-build-plan.md` | Already uses short-form (line 99). No change. |
| `caltech/pitch-deck/PITCH-STORY.md` | Pitch artifact, not contract surface. Leave unless it's quoted in the deck verbatim. |
| `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` | Already marked stale (CONSTRAINTS §6). R-DOCS rewrites whole-file later. |

#### Verification command after edits

```bash
# Should return ZERO hits inside the live-demo paths after edit:
grep -rn "main_paragraph_score\|control_paragraph_score\|falsification_delta" \
  worktrees/A4-frontend-empathy-wiring/CONTRACTS.md \
  _bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md \
  caltech/architecture-overview.md \
  caltech/NEW-ARCHITECTURE.md
```

---

## DEEP-DIVE 2 — LoadingStage silent-fail violation

**Question:** Lines 156-169 / 187-202 / 204-217 ship `'✓ Vision report ready'` and `'✓ Activity loaded'` even when the fetch threw. CONSTRAINTS rule 2 calls this a silent fallback. Spec the gating fix and check whether other stages have the same pattern.

### 2.a · Exact failure paths in `LoadingStage.vue`

Re-read against the source-of-truth file:

#### Path 1 — `runVision()` (lines 138-170)

```text
138:  async function runVision() {
...
155:    try {
156:      visionResult = await fetchVisionReport(props.clipId)
157:    } catch (e) {
158:      console.error('vision-report fetch failed', e)
159:      visionResult = null              ← silent: caller cannot tell
160:    }
...
166:    clearInterval(tick)
167:    visionProgress.value = 1           ← bar reaches 100% even on failure
168:    visionDone.value = true            ← .is-done border (green) regardless
169:    pushLog(visionLogs, '✓ Vision report ready')   ← FAKE-SUCCESS LOG
170:  }
```

Failure surface: **none.** `console.error` is invisible to the user. The bar fills, the border turns green, the log appends a checkmark, and the phase rail advances.

#### Path 2 — `runTribe()` (lines 172-202)

Identical structure; lines 188-193 swallow the fetch error to `tribeResult = null`, lines 198-201 emit `tribeProgress.value = 1`, `tribeDone.value = true`, `pushLog(tribeLogs, '✓ Activity loaded')`.

#### Path 3 — `waitForWarmup()` (lines 204-217)

```text
204:  async function waitForWarmup(maxMs = 90000, intervalMs = 1500) {
...
207:      try {
208:        const status = await fetchWarmupStatus(props.clipId)
209:        if (status?.ready) return true
210:      } catch (e) {
211:        // Endpoint may not exist on older backends — proceed without gating.
212:        return false
213:      }
...
```

First fetch failure → silent return `false` → `onMounted` (lines 219-224) ignores the return value entirely (`await waitForWarmup()` discards), waits 600ms, then emits `done` with `{ vision: visionResult, activity: tribeResult }` even when both are `null` and the warmup never confirmed. Path proceeds **always**.

#### Path 4 — `onMounted` (lines 219-224)

```text
219:  onMounted(async () => {
220:    await Promise.all([runVision(), runTribe()])
221:    await waitForWarmup()
222:    await new Promise(r => setTimeout(r, 600))
223:    emit('done', { vision: visionResult, activity: tribeResult })
224:  })
```

Emits `done` regardless of whether `visionResult` or `tribeResult` is `null`, regardless of warmup status. Downstream `App.vue:onLoadingDone` (App.vue:84-88) accepts the `null`s and routes to `MainStage` with `activityData={}`-ish data. `MainStage` then renders an empty brain.

### 2.b · Gating fix — exact diff with TDD-style failing test first

> Per CONSTRAINTS rule 5, this audit does **not** apply the diff. Per the TDD discipline requested, the diff is paired with the failing test that catches the violation **before** the fix lands.

#### Step 0 — Pre-requisite: install a test runner

`frontend/package.json` (verified — only `vue`, `three`, `vite`, `@vitejs/plugin-vue` are listed) has **no test runner today.** R-shard step 0 must add Vitest (Vite-native, ~2 min):

```diff
"devDependencies": {
+   "@vue/test-utils": "^2.4.0",
+   "vitest": "^1.6.0",
+   "@vitest/ui": "^1.6.0",
+   "happy-dom": "^14.0.0",
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.3.0"
},
"scripts": {
    "dev": "vite",
    "build": "vite build",
+   "test": "vitest run",
+   "test:watch": "vitest",
    "preview": "vite preview"
}
```

Add `vitest.config.js` with `environment: 'happy-dom'` so Vue components mount.

#### Step 1 — RED: the failing test

`frontend/tests/LoadingStage.spec.js` (new file):

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LoadingStage from '../src/stages/LoadingStage.vue'
import * as api from '../src/api/index.js'

describe('LoadingStage failure surfacing (CONSTRAINTS rule 2)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers()
  })

  it('does NOT log "Vision report ready" when fetchVisionReport rejects with 500', async () => {
    const err = Object.assign(new Error('vision-report failed: 500'), { status: 500 })
    vi.spyOn(api, 'fetchVisionReport').mockRejectedValue(err)
    vi.spyOn(api, 'fetchActivity').mockResolvedValue({ frames: [] })
    vi.spyOn(api, 'fetchWarmupStatus').mockResolvedValue({ ready: true })

    const wrapper = mount(LoadingStage, { props: { clipId: '30s_ironsite' } })

    // Drive past the artificial minMs (3500ms vision + 4200ms tribe)
    await vi.advanceTimersByTimeAsync(8000)
    await flushPromises()

    const html = wrapper.html()
    expect(html).not.toContain('✓ Vision report ready')   // fake-success log
    expect(html).toMatch(/✗ Vision FAILED · 500/)          // visible failure surface
    expect(wrapper.emitted('done')).toBeUndefined()        // must NOT auto-advance
  })

  it('does NOT emit "done" when both fetches fail', async () => {
    vi.spyOn(api, 'fetchVisionReport').mockRejectedValue(new Error('boom'))
    vi.spyOn(api, 'fetchActivity').mockRejectedValue(new Error('boom'))
    vi.spyOn(api, 'fetchWarmupStatus').mockResolvedValue({ ready: true })

    const wrapper = mount(LoadingStage, { props: { clipId: '30s_ironsite' } })
    await vi.advanceTimersByTimeAsync(8000)
    await flushPromises()

    expect(wrapper.emitted('done')).toBeUndefined()
  })

  it('renders WARMUP UNAVAILABLE banner when warmup endpoint is missing', async () => {
    vi.spyOn(api, 'fetchVisionReport').mockResolvedValue({ scene_summary: 'ok' })
    vi.spyOn(api, 'fetchActivity').mockResolvedValue({ frames: [{ regions: {} }] })
    const warmErr = Object.assign(new Error('warmup-status failed: 404'), { status: 404 })
    vi.spyOn(api, 'fetchWarmupStatus').mockRejectedValue(warmErr)

    const wrapper = mount(LoadingStage, { props: { clipId: '30s_ironsite' } })
    await vi.advanceTimersByTimeAsync(8000)
    await flushPromises()

    expect(wrapper.html()).toMatch(/WARMUP UNAVAILABLE/)
    // don't-be-a-blocker: still emits done so demo flow doesn't freeze
    expect(wrapper.emitted('done')).toBeDefined()
  })
})
```

**Verify RED before writing any production code:**

```bash
cd frontend && npm test -- LoadingStage.spec.js
# expected: 3 failing tests
#   ✗ does NOT log "Vision report ready" when fetchVisionReport rejects with 500
#       — html() contains '✓ Vision report ready' (it shouldn't)
#       — html() does not match /✗ Vision FAILED · 500/
#   ✗ does NOT emit "done" when both fetches fail
#       — emitted('done') is defined (it shouldn't be)
#   ✗ renders WARMUP UNAVAILABLE banner when warmup endpoint is missing
#       — html() does not match /WARMUP UNAVAILABLE/
```

#### Step 2 — GREEN: the production diff

`frontend/src/stages/LoadingStage.vue`:

```diff
@@ lines 78-82 (script imports + state) @@
+ const visionError = ref(null)   // {status, message} | null — drives '✗ Vision FAILED · {status}'
+ const tribeError  = ref(null)
+ const warmupSkipped = ref(false)   // true → render yellow "WARMUP UNAVAILABLE" banner

@@ lines 155-160 (runVision catch) @@
   try {
     visionResult = await fetchVisionReport(props.clipId)
   } catch (e) {
     console.error('vision-report fetch failed', e)
-    visionResult = null
+    visionResult = null
+    visionError.value = { status: e?.status ?? 'network', message: e?.message || 'unknown' }
   }

@@ lines 166-170 (post-vision) @@
   clearInterval(tick)
-  visionProgress.value = 1
-  visionDone.value = true
-  pushLog(visionLogs, '✓ Vision report ready')
+  visionProgress.value = visionError.value ? visionProgress.value : 1
+  visionDone.value = !visionError.value
+  if (visionError.value) {
+    pushLog(visionLogs, `✗ Vision FAILED · ${visionError.value.status}`)
+  } else {
+    pushLog(visionLogs, '✓ Vision report ready')
+  }
 }

@@ lines 188-193 (runTribe catch) — mirror the vision change @@
   try {
     tribeResult = await fetchActivity(props.clipId)
   } catch (e) {
     console.error('activity fetch failed', e)
     tribeResult = null
+    tribeError.value = { status: e?.status ?? 'network', message: e?.message || 'unknown' }
   }

@@ lines 198-201 (post-tribe) @@
   clearInterval(tick)
-  tribeProgress.value = 1
-  tribeDone.value = true
-  pushLog(tribeLogs, '✓ Activity loaded')
+  tribeProgress.value = tribeError.value ? tribeProgress.value : 1
+  tribeDone.value = !tribeError.value
+  if (tribeError.value) {
+    pushLog(tribeLogs, `✗ Activity FAILED · ${tribeError.value.status}`)
+  } else {
+    pushLog(tribeLogs, '✓ Activity loaded')
+  }
 }

@@ lines 204-217 (waitForWarmup) @@
 async function waitForWarmup(maxMs = 90000, intervalMs = 1500) {
   const start = performance.now()
   while (performance.now() - start < maxMs) {
     try {
       const status = await fetchWarmupStatus(props.clipId)
       if (status?.ready) return true
     } catch (e) {
-      // Endpoint may not exist on older backends — proceed without gating.
-      return false
+      // Endpoint may not exist on older backends. Don't-be-a-blocker: continue,
+      // but render a visible "WARMUP UNAVAILABLE" surface so the bypass is known,
+      // not silent (CONSTRAINTS rule 2).
+      warmupSkipped.value = true
+      return false
     }
     await new Promise(r => setTimeout(r, intervalMs))
   }
   return false
 }

@@ lines 219-224 (onMounted) @@
 onMounted(async () => {
   await Promise.all([runVision(), runTribe()])
   await waitForWarmup()
+  // Gate auto-advance on at least one stream succeeding. If both failed, hold the
+  // user on this stage with the visible failure logs + retry surface — never silently
+  // forward null payloads to MainStage.
+  if (visionError.value && tribeError.value) {
+    return  // stays on Loading; user sees the two ✗ FAILED logs
+  }
   await new Promise(r => setTimeout(r, 600))
   emit('done', { vision: visionResult, activity: tribeResult })
 })
```

Plus add a template block above the streams (around line 32):

```html
<div v-if="warmupSkipped" class="warmup-skipped" role="status">
  WARMUP UNAVAILABLE — proceeding without cache gate
</div>
```

…and a stylesheet rule mapped to `--lemon-500: #fbbd41` per CONSTRAINTS §6.5 design tokens (yellow = "known but not blocking").

#### Step 3 — Verify GREEN

```bash
cd frontend && npm test -- LoadingStage.spec.js
# expected: 3 passing tests + zero warnings
```

#### Step 4 — REFACTOR

Two streams duplicate the same try / catch / gate pattern. Extract:

```javascript
async function runStream({ logs, progress, done, errorRef, fetcher, minMs, doneLabel, failLabelPrefix }) {
  // …unified body…
}
```

Keep tests green throughout.

#### Why this satisfies CONSTRAINTS rule 2

| Rule 2 clause | How the gating fix satisfies it |
|---|---|
| "❌ NOT acceptable: silently returning a hand-written stub paragraph that looks like real K2 output" | The fake `'✓ ready'` checkmark on a swallowed throw is the moral equivalent. After the fix, a swallowed throw renders `'✗ Vision FAILED · 500'` (red) and blocks auto-advance. |
| "✅ Acceptable: logging the failure structurally AND returning an error-tagged payload that the frontend renders as a visible 'K2 CALL FAILED · 401' red badge" | `visionError.value = {status, message}` is the structured tag; the `✗` log is the visible surface. |
| "✅ Acceptable: schema-defaulted empty payloads when a stage genuinely produced no data" | If both streams failed, we *don't* emit `done` with `null` — we hold on Loading. We do NOT pretend the empty payload is real data. |
| "Don't-be-a-blocker" | Single-stream failure (e.g., vision ok, activity fails) still emits `done` with the partial payload. The MainStage / EmpathyDocumentStage downstream decide whether their data is sufficient. Both already have their own visible-failure surfaces (per the main A4 audit §7). |

### 2.c · Cross-check — does `EmpathyDocumentStage.vue` have the same pattern?

Re-audited `frontend/src/stages/EmpathyDocumentStage.vue:73-123`:

| Surface | Verdict |
|---|---|
| `onMounted` catch (lines 114-123) sets `error.value = 'could not load empathy document'`, renders `<div v-else-if="error" class="error">{{ error }}</div>` (template lines 4-6) in red `.error` styling. | **Acceptable.** Visible failure, no fake-success. **Improvement (low priority):** append `e.message` so the HTTP status surfaces as `'could not load empathy document — empathy fetch failed: 500'`. |
| `empathyParagraph` computed (line 94-96) falls back to `'(empathy paragraph not yet generated)'` when both `polished_paragraph` and `best_paragraph` are missing. | **⚠️ Soft violation.** This renders fluent prose ("paragraph not yet generated") that a judge could mistake for a real "still computing" state when the actual cause is a backend bug or empty payload. **Recommendation:** `'REAL DATA MISSING — best_paragraph absent from /demo/empathy/<clip>'` in red, gated behind PROD (CONSTRAINTS rule 7: "every component with a fallback render path must, in PROD mode, show an explicit 'REAL DATA MISSING' surface"). DEV mode can keep the friendlier copy. |
| `verdictLine` computed (line 105-109) returns `'falsification: pending'` when `falsification` is null. | **⚠️ Soft violation.** Same pattern. The string "pending" implies a transient, recoverable state. If the falsification block is genuinely missing because `compute_falsification` threw, this hides it. **Recommendation:** check `empathy.value?.falsification === undefined` (genuine absence) vs `=== null` (explicitly cleared) — render `'REAL DATA MISSING — falsification block missing'` in red for the absence case. |
| `vision.scene_summary` template fallback `'(no scene summary)'` (line 15) | Same pattern, very mild. Keep — vision report can legitimately have no summary on dev clips. |
| `attributionRows` computed (line 100-103) | If `per_region_attribution` is `{}`, the `<details>` block hides itself via `v-if="attributionRows.length"`. Acceptable — silent absence is not the same as silent fake. |
| `trajectory` computed (line 99) | Same pattern as attributionRows — `v-if="trajectory.length"` hides the block. Acceptable. |

**Cross-check verdict:** `EmpathyDocumentStage` does NOT replicate `LoadingStage`'s fake-`✓` violation. It has two **soft violations** where missing-data fallbacks read as friendly placeholder copy. Both should be flipped to "REAL DATA MISSING" in PROD per CONSTRAINTS rule 7. Treat as P2 (post-LoadingStage fix) — not blocking demo, but worth the 4-line patch.

#### TDD spec for the EmpathyDocumentStage soft violations (P2)

Add to `frontend/tests/EmpathyDocumentStage.spec.js`:

```javascript
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import EmpathyDocumentStage from '../src/stages/EmpathyDocumentStage.vue'
import * as api from '../src/api/index.js'

describe('EmpathyDocumentStage missing-data surfaces (CONSTRAINTS rule 7)', () => {
  it('shows REAL DATA MISSING when best_paragraph is null', async () => {
    vi.spyOn(api, 'fetchEmpathyDocument').mockResolvedValue({
      clip_id: '30s_ironsite',
      vision_report: { scene_summary: 'x' },
      best_paragraph: null, polished_paragraph: null,
      final_score: null,
      round_trajectory: [], per_region_attribution: {}, falsification: null,
    })
    const wrapper = mount(EmpathyDocumentStage, { props: { clipId: '30s_ironsite' } })
    await flushPromises()
    expect(wrapper.html()).toContain('REAL DATA MISSING')
    expect(wrapper.html()).not.toContain('not yet generated')   // friendlier-than-real copy
  })

  it('shows REAL DATA MISSING when falsification block is absent', async () => {
    vi.spyOn(api, 'fetchEmpathyDocument').mockResolvedValue({
      clip_id: '30s_ironsite',
      vision_report: { scene_summary: 'x' },
      best_paragraph: 'p', polished_paragraph: null,
      final_score: 0.8,
      round_trajectory: [{round: 1, score: 0.5, paragraph_excerpt: 'p'}],
      per_region_attribution: {},
      falsification: null,
    })
    const wrapper = mount(EmpathyDocumentStage, { props: { clipId: '30s_ironsite' } })
    await flushPromises()
    expect(wrapper.html()).toContain('REAL DATA MISSING')
    expect(wrapper.html()).not.toContain('falsification: pending')
  })
})
```

Production diff (after RED verified):

```diff
@@ EmpathyDocumentStage.vue line 94-96 @@
- const empathyParagraph = computed(() =>
-   empathy.value?.polished_paragraph || empathy.value?.best_paragraph || '(empathy paragraph not yet generated)'
- )
+ const empathyParagraph = computed(() => {
+   const polished = empathy.value?.polished_paragraph
+   const best = empathy.value?.best_paragraph
+   if (polished) return polished
+   if (best) return best
+   return '__MISSING__'  // template renders red "REAL DATA MISSING" surface
+ })
+ const empathyParagraphMissing = computed(() => empathyParagraph.value === '__MISSING__')

@@ EmpathyDocumentStage.vue line 105-109 @@
  const verdictLine = computed(() => {
    const f = empathy.value?.falsification
-   if (!f) return 'falsification: pending'
+   if (!f) return '__MISSING__'
    return `delta = ${(f.delta ?? 0).toFixed(2)} (main ${(f.main_score ?? 0).toFixed(2)} − control ${(f.control_score ?? 0).toFixed(2)}) · verdict: ${f.verdict}`
  })
+ const verdictMissing = computed(() => verdictLine.value === '__MISSING__')
```

Plus a template branch that renders the red "REAL DATA MISSING — <field>" badge when either `*Missing` is true. Pomegranate red `--red: #fc7981` per CONSTRAINTS §6.5.

---

## Summary

| Dive | Decision | Risk | R-shard owner |
|---|---|---|---|
| 1 — Falsification names | **Spec moves to short-form** (CONTRACTS C2 + technical PRD §6.6 + optional offline HANDOFF_CONTRACT). Backend + frontend + caches stay put. | Near-zero — 2 doc edits, no code, no cache invalidation. | R-DOCS |
| 2 — LoadingStage fake-success | **Gate `visionDone`/`tribeDone` on `*Error.value === null`. Replace `'✓'` log with `'✗ FAILED · {status}'` on failure. Block auto-advance when both streams failed. Render yellow "WARMUP UNAVAILABLE" banner when warmup endpoint missing.** TDD: 3 failing tests in `LoadingStage.spec.js`; install Vitest first. | Low — additive UI surfaces + one early-return in `onMounted`. Don't-be-a-blocker preserved (single-stream success still proceeds). | R-FRONTEND |
| 2 cross-check — EmpathyDocumentStage | Two soft violations on missing-data placeholders (`'(empathy paragraph not yet generated)'`, `'falsification: pending'`). P2 patch — flip to "REAL DATA MISSING" red surface in PROD per CONSTRAINTS rule 7. TDD: 2 failing tests in `EmpathyDocumentStage.spec.js`. | Low — pure render-path change. | R-FRONTEND |

All recommendations honor CONSTRAINTS rule 5 (no source modified by this audit) and rule 6 (don't-be-a-blocker). Reports written:
- `worktrees/A4-frontend-empathy-wiring/audits/A4-frontend-empathy-wiring.md` (main audit, prior turn)
- `worktrees/A4-frontend-empathy-wiring/audits/A4-deepdive.md` (this file)
