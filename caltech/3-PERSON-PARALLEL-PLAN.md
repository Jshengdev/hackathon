# 3-Person Build Plan — Verify-and-Report

**Last updated:** 2026-04-25 23:50 PST
**Status:** R-DOCS in flight; this doc is the contract for what each dev does after R-DOCS lands.

The mandate for **Jacob** and **Junsu**: go step-by-step through every component you own, verify what's built vs not built, what's broken vs not broken, and report it with **real test commands + real terminal output**. Don't refactor speculatively — refactor only what verification proves is broken.

The mandate for **Johnny**: get the demo working end-to-end and ship the pitch deck. You're downstream of Jacob + Junsu's verification — once they sign off that the system works, you make it look like a demo.

---

## §0 What's already done (don't redo this)

- 9 audit reports + 3 deepdives in `caltech/audits/` (5,124 lines) — every gap has been cataloged.
- `caltech/REFACTOR-PLAN.md` — synthesized 5-phase plan with acceptance gates.
- `refactor/POST-AUDIT-ORCHESTRATION.md` — discipline rules (max effort, yap-alignment, no hardcoding).
- `caltech/NEW-ARCHITECTURE.md` — canonical v2 pipeline.
- `CLAUDE.md` (root) — repo navigation map.
- `R-DOCS` shard editing the 4 source-of-truth docs (PRD + architecture).
- 2 new clips staged: `30s_ironsite2/`, `30s_ironsite3/` (activity.json + scenario.json present; mp4 to be dropped).

---

## §1 Roles

| Dev | Lane | Owns | Mandate |
|---|---|---|---|
| **Jacob Cho** | Backend debugging | `backend/services/` + `backend/main.py` + `backend/prompts/` + `backend/prerendered/<clip>/` artifacts | Walk every backend module, confirm it does what the v2 PRD says it does, log every gap as BROKEN with a verification command + real output |
| **Junsu** | Frontend debugging | `frontend/src/` (App, stages, components, composables, api, utils) | Walk every frontend stage + component, confirm it consumes the right backend payload + renders without inline mocks, log every gap as BROKEN with browser/curl evidence |
| **Johnny Sheng** | Demo + pitch deck | `caltech/pitch-deck/` + demo clips + sponsor assets + Devpost copy + 90-second demo runbook | Once Jacob + Junsu sign off, produce the demo polish: cinematic acts, voiceover, sponsor swap-slides, rehearsal recording, Devpost write-up |

---

## §2 The verify-and-report loop (every dev follows this)

For every component / file / endpoint / panel you own, run this loop:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. READ what the spec says it should do                     │
│    (PRD §, NEW-ARCHITECTURE.md, your audit's recommendation)│
│                                                             │
│ 2. RUN the verification command (real curl / pytest /       │
│    grep / browser drive — NEVER speculate)                  │
│                                                             │
│ 3. CAPTURE the real terminal/browser output                 │
│                                                             │
│ 4. CLASSIFY:                                                │
│    ✅ BUILT + WORKING — output matches spec                 │
│    🟡 BUILT but BROKEN — exists but output diverges         │
│    🔴 NOT BUILT — code path missing entirely                │
│    🟣 SPEC AMBIGUOUS — escalate to orchestrator             │
│                                                             │
│ 5. WRITE the verification entry (template below)            │
│                                                             │
│ 6. IF BROKEN: queue the fix as a numbered task in your      │
│    own task list. Do NOT fix yet — finish the audit first.  │
└─────────────────────────────────────────────────────────────┘
```

### Verification entry template

Each entry lands in `caltech/audits/V-<dev>-<component>.md`:

```markdown
## V<N>.<seq> — <component name>

**Owner:** Jacob | Junsu | Johnny
**Spec source:** PRD §<X> / NEW-ARCHITECTURE.md §<Y> / caltech/audits/A<N>.md
**Status:** ✅ BUILT+WORKING | 🟡 BROKEN | 🔴 NOT BUILT | 🟣 AMBIGUOUS

**What spec says:** [1-2 sentences]

**Verification command:**
```
$ <real command>
```

**Actual output:**
```
<real terminal output, paste verbatim — first 20 lines max>
```

**Conclusion:** [pass/fail with one line of why]

**If broken — queued fix:** Task <ID> · [one-line description] · est <time>

**If not built — recommendation:** [build now / build later / cut from scope]
```

The verification entries become the QA gate. Johnny reads them to know if the demo can ship.

---

## §3 Jacob — Backend verification walkthrough

### Domain
- All Python files under `backend/services/`, `backend/main.py`, `backend/prompts/`
- All `prerendered/<clip>/*.json` artifacts (verify they're present + valid + non-stub)
- Every `/demo/*` HTTP endpoint + the `/ws` WebSocket
- The K2, Anthropic, OpenRouter, embedding-proxy integrations

### Pre-work (read first, in order)

1. `CLAUDE.md` (root nav)
2. `caltech/NEW-ARCHITECTURE.md` (v2 pipeline)
3. `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` §3 + §4 + §6 (after R-DOCS merges)
4. **Your assigned audit reports** — read these in order:
   - `caltech/audits/A1-prerender-cache.md` + `A1-deepdive.md` — cache + falsification fix
   - `caltech/audits/A2-stub-fallbacks.md` — silent-stub catalog (this is your bible)
   - `caltech/audits/A3-swarm-loop-merge.md` + `A3-deepdive.md` — Stage 4 Opus polish
   - `caltech/audits/A6-qa-eval-harness.md` — eval recipes you'll run

### Verification steps (do in order; one entry per step)

| # | Component | Verification command | Expected if BUILT+WORKING |
|---|---|---|---|
| **J.1** | Backend boots | `cd backend && .venv/bin/python -m uvicorn main:app --port 8000` | "Application startup complete" + listens :8000 |
| **J.2** | `.env` keys wired | `grep -E "^(K2_API_KEY\|VISION_API_KEY)=" backend/.env \| sed 's/=.*$/=***/'` | Both keys present (not empty) |
| **J.3** | Clip resolution | `curl -s http://localhost:8000/demo/clips \| jq '.clips[].clip_id'` | All 4 clips listed (`30s_ironsite`, `30s_ironsite2`, `30s_ironsite3`, `30s_twitter`) |
| **J.4** | activity.json shape | `jq '.atlas, .n_vertices, (.frames \| length)' backend/prerendered/30s_ironsite/activity.json` | `"yeo7"`, 20484, 31 |
| **J.5** | Stage 1A vision (Qwen3-VL via OpenRouter) | `time curl -s http://localhost:8000/demo/vision-report/30s_ironsite \| jq '.stub'` | `false` + 5-15s latency on cold; cache hit on warm |
| **J.6** | Stage 1B K2 swarm (`services/swarm_runner.py`) | `python -c "import asyncio, json; from services.swarm_runner import run_swarm; r=asyncio.run(run_swarm(json.load(open('prerendered/30s_ironsite/activity.json')), '30s_ironsite')); print({k:v.get('reading','EMPTY')[:80] for k,v in r['regions'].items()})"` | Each of 7 networks returns a real reading (no `EMPTY` strings, no `[K2 error]`) |
| **J.7** | Stage 2 K2 moderator (`services/empathy_synthesis.py`) | `curl -s http://localhost:8000/demo/empathy/30s_ironsite \| jq '.best_paragraph \| length'` | > 200 chars of real prose |
| **J.8** | Stage 3 iterative loop (`services/iterative_loop.py`) | `curl -s http://localhost:8000/demo/iterative-trajectory/30s_ironsite \| jq '.round_trajectory \| length'` | 1-8 rounds; scores monotonic-ish |
| **J.9** | Stage 4 Opus polish (`services/empathy_polish.py`, gated) | `OPUS_POLISH=1 curl -s http://localhost:8000/demo/empathy/30s_ironsite \| jq '.polished_paragraph'` | Non-null, ~100 words, literary tone — OR `null` (cut-line ok if A3-deepdive ship-path not yet built) |
| **J.10** | Stage 5 falsification (`services/falsification.py`) | `curl -s http://localhost:8000/demo/falsification/30s_ironsite \| jq '.delta, .verdict'` | `delta > 0.4` + `"anchored"` — **NOT** `delta=0.0 + "generic_plausible"` (the demo-blocking bug per A1+A3) |
| **J.11** | Region popup (`POST /demo/k2-region`) | `curl -s -X POST http://localhost:8000/demo/k2-region -H 'Content-Type: application/json' -d '{"clip_id":"30s_ironsite","network":"visual","t":4}' \| jq '.text, .confidence, .cite'` | All three populated, no `[K2 error]` |
| **J.12** | No-stub compliance | `grep -rn '"stub":\s*True\|return _stub_report' backend/services/` | Returns 0 lines (post-R2) |
| **J.13** | Guardrail truthiness bug | Read `services/empathy_synthesis.py` — locate the `pass_guardrail_pre_flight(text) and ...` call site; verify it actually evaluates the function call result, not a truthy reference | A1-deepdive describes the exact line. Confirmed fixed = call returns bool, not function object |
| **J.14** | Control activity for falsification | `ls backend/prerendered/workplace_routine_baseline/activity.json backend/prerendered/curated_short_film_baseline/activity.json` | Both files present |
| **J.15** | Embedding proxy projection map | `python -c "import numpy as np; W=np.load('backend/services/embedding_proxy/projection_map.npy'); print(W.shape, W.mean())"` | `(384, 7)` and reasonable mean |
| **J.16** | WebSocket emits real events | Open WS to `ws://localhost:8000/ws` after `POST /brain/start` and capture 3 frames | Each frame has `{t, regions, top_region, agents, ...}` populated |

### Deliverable
- `caltech/audits/V-jacob-backend.md` with 16 verification entries
- A summary at the top: `BUILT_AND_WORKING: [list], BROKEN: [list with task IDs queued], NOT_BUILT: [list]`

### Fix priority queue (run after verification done)
- **P0** — anything `delta=0.0` falsification (J.10) — demo-blocking
- **P0** — any `[K2 error]` in J.6 / J.11 — silent failure that A2 catalogues
- **P1** — Stage 4 Opus polish missing (J.9) — A3-deepdive recommends ship
- **P1** — guardrail truthiness bug (J.13)
- **P2** — code-quality lint (long lines, debug prints, bare excepts) — A9 §4

---

## §4 Junsu — Frontend verification walkthrough

### Domain
- All Vue components / stages / composables under `frontend/src/`
- Every backend payload the frontend consumes
- Every visible UI surface (real data only — no inline mocks per CONSTRAINTS §7)

### Pre-work (read first, in order)

1. `CLAUDE.md` (root nav) — design tokens at the bottom
2. `caltech/pitch-deck/DESIGN.md` — Clay design system (canonical colors, fonts, shadows)
3. `caltech/NEW-ARCHITECTURE.md` §5 — frontend dashboard layout (greenchain × icarus)
4. **Your assigned audit reports:**
   - `caltech/audits/A4-frontend-empathy-wiring.md` + `A4-deepdive.md` — what the frontend actually does today
   - `caltech/audits/A8-brain-dashboard-redesign.md` — dashboard target

### Verification steps

| # | Component | Verification command | Expected if BUILT+WORKING |
|---|---|---|---|
| **U.1** | Frontend dev server boots | `cd frontend && npm run dev` | Vite ready on `:3000` |
| **U.2** | Each Vue file compiles | `for f in frontend/src/components/*.vue frontend/src/stages/*.vue; do curl -sI "http://localhost:3000/src/${f#frontend/src/}" \| head -1; done` | All HTTP 200 |
| **U.3** | Routing | Drive browser through Landing → Loading → Main → IterativeReveal → EmpathyDocument (per A4 audit's 5-stage flow) | Each stage transitions; no console errors |
| **U.4** | `LandingStage.vue` upload mechanic | Drop `30s_ironsite.mp4` filename into upload zone | Resolves to clip_id; advances to LoadingStage |
| **U.5** | `LoadingStage.vue` real-data gating (per A4-deepdive Dive 2) | Stop the backend mid-load | Loading should show `'✗ Vision FAILED · {status}'` red — NOT fake `'✓ ready'` |
| **U.6** | `MainStage.vue` brain visuals | Render with backend up | Brain mesh + atmosphere halo + 2 orbit rings + agent edges + region cross-talk arc all visible |
| **U.7** | `RegionPopup.vue` payload | Click a brain region | Popup shows greenchain telemetry chrome (eyebrow, dashed divider, cite); fields populated from real `/demo/k2-region` payload |
| **U.8** | `IterativeLoop.vue` real trajectory | Reach IterativeReveal stage | Round-by-round score climbs; paragraph excerpt swaps; refines-back arrow visible past R1; auto-replays |
| **U.9** | `IterativeLoop.vue` consumes real backend (per A4 §5) | `grep -n "const trajectory" frontend/src/stages/*.vue frontend/src/components/IterativeLoop.vue` | NO inline mock arrays in shipping code (only fixture imports gated `import.meta.env.DEV`) |
| **U.10** | `EmpathyDocumentStage.vue` consumes `/demo/empathy/{clip}` | Open the empathy-document stage, check Network tab | Single fetch to `/demo/empathy/30s_ironsite`; rendered §A vision + §B paragraph + §C falsification |
| **U.11** | EmpathyDocument soft-fallback (per A4-deepdive Dive 2) | Stop backend; reload empathy stage | Should show `'REAL DATA MISSING'` red badge — NOT fluent `'(empathy paragraph not yet generated)'` |
| **U.12** | Design system compliance | `grep -rn '#[0-9a-fA-F]\{6\}' frontend/src/` | All hex colors live in `frontend/src/utils/design-tokens.js` (post-refactor) — references Clay tokens from pitch-deck |
| **U.13** | Long-line lint | `awk '$0 ~ /.{121}/' frontend/src/**/*.vue \| wc -l` | < 5 violations |
| **U.14** | Console clean | Open DevTools console + drive through full flow | 0 errors, only expected info logs |
| **U.15** | Three.js FPS on demo laptop | Open Three.js stats overlay during MainStage | ≥ 30 FPS sustained |

### Deliverable
- `caltech/audits/V-junsu-frontend.md` with 15 verification entries
- Summary: BUILT_AND_WORKING / BROKEN / NOT_BUILT lists

### Fix priority queue
- **P0** — fake-success log bug (U.5) — A4-deepdive Dive 2
- **P0** — soft-fallback "still computing" placeholder (U.11) — CONSTRAINTS §7
- **P1** — IterativeLoop inline mock removal (U.9)
- **P1** — design-token consolidation (U.12)
- **P2** — long lines (U.13)

---

## §5 Johnny — Demo + pitch deck

### Domain
- `caltech/pitch-deck/` (Next.js — separate project)
- Demo clip curation (which clips run on stage; potentially `30s_ironsite2` as falsification control per A1-deepdive)
- Demo runbook + cinematic acts + voiceover + sponsor swap-slides + Devpost
- Coordination with Jacob + Junsu: gates Johnny's work

### Pre-work

1. Read `caltech/3-PERSON-PARALLEL-PLAN.md` (this doc) start to finish
2. Read `caltech/demo-script.md` (existing demo runbook)
3. Read `caltech/narration-script-3min.md`
4. Read `caltech/video-story.md` (cinematic acts)
5. Read both yap files Johnny dictated himself: `caltech/yaps/2026-04-25-team-execution-status/00-raw-yap.md` (latest team state)

### Tasks

| # | Task | Output | Acceptance | Deps |
|---|---|---|---|---|
| **JS.1** | Read Jacob's `V-jacob-backend.md` once it lands. Confirm: zero P0 broken items remain on backend lane | "Backend ready ✅" or "Backend BLOCKED — wait for fixes" | Jacob's V-report has 0 P0 broken | Jacob's V-report |
| **JS.2** | Read Junsu's `V-junsu-frontend.md`. Same gate | Frontend status | Junsu's V-report has 0 P0 broken | Junsu's V-report |
| **JS.3** | Demo clip selection — which 2-3 clips run on stage? Decide: `30s_ironsite` (workplace), `30s_twitter` (consumer), and either `30s_ironsite2` (falsification control) or held in reserve | `caltech/demo-clip-selection.md` | Confirmed by all 3 devs | none |
| **JS.4** | Drop matching `.mp4` files into `backend/prerendered/{30s_ironsite2,30s_ironsite3}/` if `ironsite2` is selected as demo content | `has_video: true` in `/demo/clips`; full pipeline runs on cold warmup | none | JS.3 |
| **JS.5** | Sponsor swap-slides (4 variants: Ironsight CORE, Listen Labs CORE, Sideshift CORE, YC stretch). Pre-render each as PDF + slide-deck variant | `caltech/pitch-deck/sponsor/{ironsight,listenlabs,sideshift,yc}/` 4 PDFs | Each 1-page deck shows the empathy-layer pitch tailored to that sponsor | none |
| **JS.6** | Cinematic acts (Acts 1+4) per `video-story.md` §6. Shoot Friday evening; assemble Saturday morning | `caltech/cinematic/acts-1-and-4.mp4` + raw footage | 60s total, watchable on first viewing | none |
| **JS.7** | Voiceover (Maya + Guide registers per video-story.md §7) | `caltech/voiceover/{maya,guide}.wav` | Clean reads; matches narration-script-3min.md timings | none |
| **JS.8** | 3-minute Round 2 launch video. Assembles cinematic acts + dashboard screen-recording + voiceover | `caltech/launch-video.mp4` | Rendered in 1080p; under 3 min | JS.6 + JS.7 + Junsu's dashboard ready |
| **JS.9** | Pitch deck Round 1 (5 min) + Round 2 (3 min) | `caltech/pitch-deck/app/{round-1,round-2}/page.tsx` updated; PDF exports | Slides match the v2 architecture (no stale Stage 2 Opus / live TRIBE claims) | R-DOCS merged |
| **JS.10** | Devpost write-up (MindPad/TerraLink template per `research-context/008`) | `caltech/devpost.md` | Mentions every sponsor track, every locked decision, every demo beat | JS.8 + JS.9 |
| **JS.11** | FAQ ammunition deck (Q1-Q5 customer + Q-INT-1..15 hostile-judge per existing PRD §13) | `caltech/faq-ammunition.md` | Polished verbatim before Friday 8 PM smoke gate | none |
| **JS.12** | Pre-cache assembly test (Saturday 6 PM): run entire 90s on pre-recorded only, no live API calls | One-line pass/fail in `caltech/pre-cache-test.md` | Demo runs offline-only | C.7 (Dev C cache pre-bake) |
| **JS.13** | Dress rehearsal — three Gen-Z teens watch the demo (per YC stress-test recommendation) | Notes in `caltech/dress-rehearsal-notes.md` | All three understand the value prop in first viewing | JS.8 |
| **JS.14** | Devpost submit Saturday 11 PM | Live submission URL | URL captured in `caltech/submission.md` | All other JS tasks |

### Deliverable
- All Johnny's task outputs in `caltech/` per the table above
- One status doc: `caltech/DEMO-DAY-STATUS.md` updated continuously through Saturday

### Critical path for Johnny
JS.1 + JS.2 (verification gates) → JS.3 (clip selection) → JS.6 + JS.7 (cinematic + VO) → JS.8 (launch video, depends on Junsu's dashboard) → JS.10 (Devpost) → JS.14 (submit).

---

## §6 Definition-of-done per dev

| Dev | DoD |
|---|---|
| **Jacob Cho** | All 16 J.* verification entries written. All P0 broken items in backend fixed. `bash refactor/eval/grep-recipes.sh` (Dev C builds, Jacob runs) returns clean. `curl /demo/empathy/30s_ironsite` returns full real document with `falsification.delta > 0.40`. |
| **Junsu** | All 15 U.* verification entries written. All P0 broken items in frontend fixed. Manual drive-through Landing → IterativeReveal → EmpathyDocument shows real data at every stage. No inline mock arrays in shipping code. |
| **Johnny Sheng** | All 14 JS.* tasks complete. `caltech/DEMO-DAY-STATUS.md` shows green across the board. Devpost submitted. Cinematic + dashboard recording committed. Three Gen-Z dress-rehearsal viewers understood the demo. |

---

## §7 Sequencing — when each dev starts what

```
T+0      R-DOCS lands
         Jacob:  J.1, J.2 (boot + env keys)
         Junsu:  U.1, U.2 (boot + compile)
         Johnny: read this doc; queue JS.5 (sponsor decks)

T+30     Jacob: J.3..J.16 (full backend walkthrough)
         Junsu: U.3..U.15 (full frontend walkthrough)
         Johnny: JS.5 + JS.11 (FAQ deck) — both don't need backend ready

T+90     Jacob: V-jacob-backend.md lands → fix P0 items
         Junsu: V-junsu-frontend.md lands → fix P0 items
         Johnny: JS.1 + JS.2 read both V-reports; JS.3 clip selection

T+150    Jacob + Junsu: P0 fixes done; eval gate runs clean
         Johnny: JS.4 mp4 drops; JS.6 cinematic shoot; JS.7 VO record

T+240    Johnny: JS.8 launch video assembly (depends on Junsu's dashboard)
         Jacob + Junsu: P1 fixes in remaining time

Saturday 6 PM    JS.12 pre-cache assembly test runs
Saturday 8 PM    FREEZE — no more code
Saturday 8-11 PM Johnny: JS.9 deck final, JS.10 Devpost, JS.13 dress rehearsal
Saturday 11 PM   JS.14 Devpost submit
```

---

## §8 What if a verification entry surfaces a "spec ambiguous" case?

If Jacob or Junsu hits something where the PRD/architecture doesn't clearly say what should happen:

1. Write the entry as `🟣 SPEC AMBIGUOUS`.
2. Tag it `[ESCALATE]` in the verification report.
3. Don't fix yet.
4. Slack the orchestrator (this main session) with the ambiguity question.
5. Orchestrator resolves + updates the standing QA document (PRD or NEW-ARCHITECTURE.md) so the next dev doesn't hit the same ambiguity.

The standing QA document evolves through resolved escalations, not through individual dev guesses.

---

## §9 Daily standup format (3 min, async slack thread)

Each dev posts:
1. **Yesterday I closed:** `J.4`, `J.5`, `J.6` (or whatever)
2. **Today I'm closing:** `J.7`, `J.8`
3. **Blocking:** "waiting for J.10 fix → blocks U.10" (or "none")
4. **Latest verification output:** [paste 5-line output of last test]

Don't discuss design choices in standup. Standup = "did the gate pass yes/no."

---

## §10 What this session has NOT done (so you know what's still owed)

- ❌ R-DOCS hasn't merged yet — wait for the 4 source-of-truth doc edits before reading them as canonical
- ❌ R-STRUCT not started — `caltech/engine/`, `junsoo/`, `feesh/` still in repo root
- ❌ R1 not started — `falsification.delta` is still 0.0 on demo runs (Jacob's J.10 will catch this)
- ❌ R2 not started — `_stub_report` still leaks (Jacob's J.12 will catch this)
- ❌ R8 not started — dashboard collapse is the biggest frontend change (Junsu's verification will determine if it ships before demo day or post-demo)
- ❌ B-pass not run — wait for refactor execution to settle

What this session DID do: catalog every gap, lock every decision, write the spec for every refactor, queue the worktrees + tmux windows, start R-DOCS.

The next session is execution. This doc is the contract.
