---
title: "Build Plan — Locked Architecture v2 (post-TRIBE-cut)"
status: 2026-04-25 evening — supersedes earlier scoping
anchors:
  - _bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md (engineering spec)
  - caltech/use-cases/two-demo-scenarios.md (scenario contract)
locks:
  - TRIBE V2 is pre-rendered only — no live forward or reverse inference, ever
  - Stage 1 (vision) and the without-TRIBE pass are out — Qwen3-VL is the only vision pass
  - K2 runs the swarm agents (per-region specialists) AND the iterative loop scorer
  - Claude Opus 4.7 is reserved for final polish only — NOT in the iterative loop
  - Falsification numbers are real (embedding-proxy computed), not hand-baked
  - Both scenarios ship: ironside (workplace) + consumer (twitter / listen labs)
  - No Listen-Labs-specific swarm; one shared specialist roster for both scenarios
---

# Build Plan — Locked Architecture v2

## §1. Pipeline (the new spine)

```
                     [INPUT: uploaded video, matched to prerendered clip]
                                          │
                ┌─────────────────────────┴─────────────────────────┐
                │                                                   │
                ▼                                                   ▼
      ┌────────────────────────┐                      ┌──────────────────────────┐
      │  STAGE 1A: Qwen3-VL    │                      │  STAGE 1B: K2 swarm      │
      │  (OpenRouter)          │                      │  (7 parallel calls)      │
      │                        │                      │                          │
      │  Input: video frames   │                      │  Input: activity.json    │
      │  Prompt: describe      │                      │    (prerendered TRIBE)   │
      │   what happened —      │                      │   + backend/prompts/     │
      │   actions, env,        │                      │   {network}.md per agent │
      │   tools, sequence,     │                      │                          │
      │   spatial relations.   │                      │  Output per region:      │
      │   NO emotion claims.   │                      │   reading (1-2 sent),    │
      │                        │                      │   confidence, citation   │
      │  Output:               │                      │                          │
      │   vision_report.json   │                      │  Output aggregated:      │
      │                        │                      │   swarm_readings.json    │
      └────────┬───────────────┘                      └────────┬─────────────────┘
               │                                               │
               └────────────────────┬──────────────────────────┘
                                    ▼
                  ┌──────────────────────────────────────┐
                  │  STAGE 2: Empathy Synthesis          │
                  │  (K2, moderator role)                │
                  │                                      │
                  │  Prompt: backend/prompts/            │
                  │    moderator.md (combine vision      │
                  │    context + per-region readings     │
                  │    into ONE paragraph)               │
                  │                                      │
                  │  Output: candidate_paragraph #N      │
                  └────────────────┬─────────────────────┘
                                   │
                                   ▼
                  ┌──────────────────────────────────────┐
                  │  STAGE 3: Iterative Scoring Loop     │
                  │  (K2 swarm again, evaluator role)    │
                  │                                      │
                  │  For each round (up to 8):           │
                  │   a. K2 swarm reads candidate;       │
                  │      each agent rates how well       │
                  │      the paragraph captures its      │
                  │      region's reading (0..1)         │
                  │   b. Aggregate → round_score         │
                  │   c. Plateau (Δ<0.02 over 2 rounds)  │
                  │      OR round==8 → exit              │
                  │   d. Else: feed per-region miss back │
                  │      to Stage 2 → next candidate     │
                  │                                      │
                  │  Output:                             │
                  │   best_paragraph                     │
                  │   final_score                        │
                  │   round_trajectory[]                 │
                  │   per_region_attribution             │
                  └────────────────┬─────────────────────┘
                                   │
                                   ▼
                  ┌──────────────────────────────────────┐
                  │  STAGE 4: Final Polish (optional)    │
                  │  Claude Opus 4.7                     │
                  │                                      │
                  │  Input: best_paragraph + persona     │
                  │  Output: magazine-grade prose        │
                  │  Cut-line: skip if behind schedule;  │
                  │  K2 output ships as-is.              │
                  └────────────────┬─────────────────────┘
                                   │
                                   ▼
                  ┌──────────────────────────────────────┐
                  │  STAGE 5: Falsification (proxy)      │
                  │                                      │
                  │  embedding_proxy(paragraph) → 7-dim  │
                  │    network vector                    │
                  │  similarity      = cos(proxy, main)  │
                  │  falsif_delta    = main - control    │
                  │                                      │
                  │  Output: falsification.json (§6.6)   │
                  └────────────────┬─────────────────────┘
                                   │
                                   ▼
                       [EMPATHY-LAYER DOCUMENT]
                       §A Vision Report (Stage 1A)
                       §B Empathy Paragraph (Stage 4)
                       §C Falsification Evidence (Stage 5)
                       Persona modes: workplace / consumer / pavilion
```

**Two roles for K2:**
1. **Stage 1B — Specialist swarm.** 7 parallel calls, one per Yeo7 network, using the existing `backend/prompts/{network}.md` files. Reads `activity.json` frame data → "what each brain area is reading."
2. **Stage 2 + Stage 3 — Moderator + Evaluator.** Aggregates the swarm into a paragraph; then re-fires the swarm to score that paragraph each iterative round.

**Two roles for Qwen3-VL:**
1. **Stage 1A only.** Pure vision context — what physically happened. No emotion, no cognitive state. That's the swarm's job.

**Claude Opus 4.7:**
- Stage 4 polish only. Cut first if behind.

---

## §2. What's already built vs. what's new

| Component | State | Action |
|---|---|---|
| `backend/prerendered/{30s_ironsite,30s_twitter}/activity.json` | exists | **keep as-is** |
| `backend/services/k2_client.py` | exists, used by `/demo/k2-region` | **reuse** |
| `backend/prompts/{visual,somatomotor,...}.md` (7 region prompts) | exist, science-grade | **reuse for swarm** |
| `backend/prompts/moderator.md` | exists | **reuse for synthesis** |
| `backend/services/vision_client.py` (Anthropic Claude vision) | exists | **rewrite to use Qwen via OpenRouter** |
| `backend/services/comparison.py` (without/with-TRIBE one-shot) | exists | **delete or repurpose — we kill the without-TRIBE pass** |
| `backend/services/orchestrator.py` (per-frame K2 fan-out) | exists | **inspect — likely the spine of new swarm code** |
| Iterative scoring loop | does NOT exist | **build** |
| Empathy synthesis (Stage 2) | does NOT exist | **build** |
| Embedding-proxy scorer for falsification | does NOT exist | **build** |
| Frontend `IterativeRevealStage.vue` (BEAT-3 hero animation) | does NOT exist | **build** |
| Frontend `EmpathyDocumentStage.vue` (3-section render) | does NOT exist | **build** |
| Scenario tag on prerendered clips | does NOT exist | **add `scenario.json` per clip** |
| Control activity.json (workplace_routine_baseline, curated_short_film_baseline) | do NOT exist | **synthesize from existing activity.json + Gaussian noise; honest stub** |
| Pitch-deck `/sponsor/[id]` pages | exist, hardcoded literals | **leave hardcoded for slide deck; live demo is separate** |

---

## §3. Lane assignments (file-level)

### LANE-K (K2 + iterative loop) — backend orchestration

**Files to create:**
```
backend/services/
  swarm_runner.py         # parallel 7-region K2 calls (Stage 1B); reuses k2_client
  empathy_synthesis.py    # Stage 2 — K2 moderator combines Qwen vision + swarm
  iterative_loop.py       # Stage 3 — K2-swarm-as-evaluator, plateau exit
  embedding_proxy.py      # Stage 5 — sentence-transformer → 7-dim → cosine
  falsification.py        # Stage 5 wrapper — main vs control delta
  guardrails.py           # forbidden-claim regex (PRD §5)
  
backend/prompts/
  moderator_synthesis.md  # NEW prompt: vision + swarm → paragraph
  evaluator_score.md      # NEW prompt: per-region score 0..1 of candidate
```

**Endpoints to add (in `backend/main.py`):**
```
POST /demo/empathy/{clip_id}            # full pipeline run; cache to empathy.json
GET  /demo/empathy/{clip_id}            # cached result (uses prerendered/.../empathy.json)
GET  /demo/iterative-trajectory/{clip_id}  # round-by-round JSON for BEAT-3
GET  /demo/falsification/{clip_id}      # similarity + delta for §C of doc
```

**Existing endpoint to delete:**
```
GET  /demo/comparison/{clip_id}    # without-TRIBE pass killed per user lock
```
(Delete `services/comparison.py` too once nothing imports it.)

**Smoke gates owned: #2, #6, #7.**

### LANE-O (Stage 1 vision + frontend)

**Backend:**
```
backend/services/
  vision_client.py        # REWRITE: OpenRouter + qwen/qwen3-vl-235b-a22b-instruct
  
backend/main.py
  GET /demo/vision-report/{clip_id}   # already exists; just swaps provider internally
```

**Frontend:**
```
frontend/src/api/index.js
  + fetchEmpathyDocument(clipId)
  + fetchIterativeTrajectory(clipId)
  + fetchFalsification(clipId)
  
frontend/src/App.vue
  + scenario routing: read scenario from /demo/match payload
  + new stage map: landing → loading → main → iterative-reveal → empathy-document
  
frontend/src/stages/
  IterativeRevealStage.vue       # BEAT-3 hero — round score climbs 0.42 → 0.84
  EmpathyDocumentStage.vue       # 3-section render (PRD §11)
  
frontend/src/components/
  RoundScoreBar.vue              # fillable bar, animates round-by-round
  PersonaShell.vue               # workplace/consumer/pavilion CSS variant
```

**Smoke gates owned: #3, #4, #6, #8.**

### LANE-J (Junsoo, what's left)

TRIBE V2 work is OUT. Remaining LANE-J asks:

1. **Embedding proxy implementation** (in `embedding_proxy.py`) — fits a 7-dim per-network projection from existing activity.json so the iterative loop has SOMETHING to score against if the K2-swarm-as-evaluator falters.
2. **Control activity.json synthesis** (`backend/scripts/bake_control_clips.py`) — read existing activity.json, shuffle frames + add Gaussian noise to break the structural pattern → write `prerendered/workplace_routine_baseline/activity.json` and `prerendered/curated_short_film_baseline/activity.json`. Document honestly: "control = perturbed-frame baseline, not a separately-recorded clip."
3. **Scenario tag bake** (`backend/scripts/bake_scenario_tags.py`) — write `prerendered/{clip_id}/scenario.json` with `{scenario, label}` per clip.
4. **Backstop reviewer for LANE-K** — once iterative loop is wired, sanity-check the round trajectory math + per-region attribution.

**Smoke gates owned: #7** (falsification delta ≥ 0.40).

### LANE-E (Emilie, packaging)

Outside this repo mostly. Code-side asks:
- Voiceover WAV in `caltech/pitch-deck/public/audio/`.
- Magazine typography for empathy paragraph in `EmpathyDocumentStage.vue` (provide CSS / font picks).
- Saturday 6 PM pre-cache assembly test.

---

## §4. Data contracts (the only ones that matter post-TRIBE-cut)

### 4.1 Stage 1A → Stage 2 (Qwen vision_report)
```json
{
  "scene_summary": "string",
  "actions": ["worker climbs scaffolding", "tool placement at edge"],
  "temporal_sequence": [{"t_s": 0, "event": "..."}],
  "spatial_relationships": ["worker right of beam", "..."],
  "emotional_tone": "neutral|tense|calm|...",   // descriptive, NOT inferred
  "stub": false
}
```

### 4.2 Stage 1B → Stage 2 (K2 swarm readings)
```json
{
  "clip_id": "30s_ironsite",
  "frame_window": "aggregated across all 31 frames",
  "regions": {
    "visual":            {"reading": "...", "confidence": "high|medium|low", "cite": "..."},
    "somatomotor":       {"reading": "...", ...},
    "dorsal_attention":  {"reading": "...", ...},
    "ventral_attention": {"reading": "...", ...},
    "limbic":            {"reading": "...", ...},
    "frontoparietal":    {"reading": "...", ...},
    "default_mode":      {"reading": "...", ...}
  }
}
```

### 4.3 Stage 2 → Stage 3 (candidate_paragraph)
Plain string. Round metadata tracked in the iterative loop's state, not the candidate itself.

### 4.4 Stage 3 → empathy.json (full pipeline output)
```json
{
  "clip_id": "30s_ironsite",
  "scenario": "ironside",
  "scenario_label": "ironsight · construction site · scaffolding sequence",
  "vision_report": { /* §4.1 */ },
  "swarm_readings": { /* §4.2 */ },
  "best_paragraph": "...",
  "polished_paragraph": "...",        // null if Stage 4 skipped
  "final_score": 0.84,
  "round_trajectory": [
    {"round": 1, "score": 0.42, "paragraph_excerpt": "..."},
    {"round": 8, "score": 0.84, "paragraph_excerpt": "..."}
  ],
  "per_region_attribution": {
    "default_mode":         {"candidate_match": 0.91, "target": 0.87},
    "prefrontal_engagement":{"candidate_match": 0.78, "target": 0.81}
  },
  "falsification": {
    "main_score": 0.84,
    "control_score": 0.27,
    "delta": 0.57,
    "verdict": "anchored"
  }
}
```

### 4.5 Embedding proxy contract (the math)
```python
def proxy_score(text: str, target_activity: dict) -> tuple[float, dict]:
    """
    1. Embed text via sentence-transformer (e.g. all-MiniLM-L6-v2, 384-dim).
    2. Project to 7-dim Yeo7 space via a linear map W (shape 384 × 7).
       W is fit ONCE (offline) from prerendered activity.json files using
       a simple least-squares solve on hand-paired (text, mean_activation)
       examples — write 4-6 paired examples per scenario into a YAML.
    3. target_vec = mean activation per region across activity['frames'].
    4. similarity = cosine(W @ embed(text), target_vec)
    5. per_region_attribution = elementwise (W @ embed(text)) vs target_vec
    """
```

**Why this works as a TRIBE-forward stand-in:**
- Deterministic, fast (~50ms), no GPU.
- Trajectory is real (different paragraphs → different scores).
- Honest framing: "iterative-loop scoring is a sentence-embedding proxy of TRIBE forward — proper TRIBE forward is the production path; this is the demo-day stand-in."

---

## §5. Build sequence (Friday tonight → Saturday 8 AM bake)

```
T-0  Friday 8 PM  ─── smoke gate #1 (TRIBE reverse, already passing — pre-rendered)
                ├── LANE-K: swarm_runner.py + moderator_synthesis prompt        (1.5h)
                ├── LANE-O: rewrite vision_client.py for OpenRouter             (1.0h)
                └── LANE-J: bake_scenario_tags.py + bake_control_clips.py       (0.5h)
                
T+2  Friday 10 PM  ── smoke #2 dry-run: K2 swarm Stage 1B end-to-end
                ├── LANE-K: empathy_synthesis.py (K2 moderator)                 (1.0h)
                ├── LANE-K: embedding_proxy.py + bake projection map            (1.5h)
                └── LANE-O: scenario routing in App.vue                         (0.5h)
                
T+4  Saturday midnight ── smoke #6: vision-report Qwen call works
                ├── LANE-K: iterative_loop.py + plateau math                    (1.5h)
                ├── LANE-K: falsification.py + guardrails.py                    (1.0h)
                └── LANE-O: IterativeRevealStage.vue + RoundScoreBar.vue       (2.5h)
                
T+8  Saturday 4 AM ── full pipeline live test on both clips
                ├── LANE-K: /demo/empathy + /demo/iterative-trajectory          (1.0h)
                ├── LANE-O: EmpathyDocumentStage.vue + PersonaShell.vue         (1.5h)
                └── LANE-J: smoke #7 falsification delta verification           (0.5h)
                
T+10 Saturday 6 AM ── pre-cache assembly: bake empathy.json for both clips
                
T+12 Saturday 8 AM ── pre-cache freeze; all bake JSON committed
                ├── prerendered/30s_ironsite/{empathy,iterative_trajectory,falsification,scenario}.json
                ├── prerendered/30s_twitter/{empathy,iterative_trajectory,falsification,scenario}.json
                ├── prerendered/workplace_routine_baseline/activity.json
                └── prerendered/curated_short_film_baseline/activity.json
```

---

## §6. Pre-cache asset bundle (Saturday 8 AM checklist)

```
backend/prerendered/{30s_ironsite,30s_twitter}/
  ├── {clip_id}.mp4              [exists]
  ├── activity.json              [exists]
  ├── scenario.json              [LANE-J — bake_scenario_tags.py]
  ├── vision_report.json         [LANE-O — Qwen one-shot]
  ├── swarm_readings.json        [LANE-K — swarm_runner one-shot]
  ├── empathy.json               [LANE-K — full pipeline run]
  ├── iterative_trajectory.json  [LANE-K — extracted from empathy.json]
  └── falsification.json         [LANE-K — extracted from empathy.json]

backend/prerendered/workplace_routine_baseline/
  └── activity.json              [LANE-J — bake_control_clips.py]

backend/prerendered/curated_short_film_baseline/
  └── activity.json              [LANE-J — bake_control_clips.py]

backend/services/embedding_proxy/
  └── projection_map.npy         [LANE-J — W matrix, 384×7, fit once]
```

---

## §7. Subagent fan-out (when ready)

Three parallel agents, isolated by file:

| Agent | Owns | Blocks until |
|---|---|---|
| **agent-K** (LANE-K) | `services/{swarm_runner,empathy_synthesis,iterative_loop,embedding_proxy,falsification,guardrails}.py` + new endpoints in `main.py` + new prompts | needs LANE-J's projection_map.npy + control activity.json (mocks OK during dev) |
| **agent-O-vision** (LANE-O backend) | `services/vision_client.py` rewrite, `services/openrouter.py` if extracted | independent |
| **agent-O-frontend** (LANE-O frontend) | `frontend/src/{App.vue, api/index.js, stages/Iterative*, stages/Empathy*, components/Round*, components/Persona*}.{vue,js}` | needs agent-K's endpoint contracts (can mock during dev — contracts in §4 above) |

LANE-J work (3 small bake scripts + projection map fit) ships as a precondition before agent-K can fully test, but is small enough to do directly without an agent.

---

## §7.5. Session cache + warmup policy (the brain-3D interaction lock)

**Goal:** during the live demo, every brain-region click + every scrub of the video = instant. No live K2/Qwen/Opus call should ever block a UI interaction.

**Two cache layers:**

```
LAYER 1 — disk cache (persistent, survives restart)
  backend/prerendered/{clip_id}/
    ├── vision_report.json           # Qwen one-shot
    ├── swarm_readings.json          # K2 swarm aggregate (Stage 1B)
    ├── empathy.json                 # full pipeline result
    ├── iterative_trajectory.json    # round-by-round (extracted from empathy.json)
    ├── falsification.json           # similarity + delta
    └── k2_region_cache.json         # NEW — dict of "{network}_t{n}" → K2 reading
                                     #   pre-baked for all 7 networks × N seconds
                                     #   so /demo/k2-region clicks are O(1) lookups

LAYER 2 — in-process memory cache (survives until uvicorn restart)
  services/session_cache.py
    SESSION_CACHE: dict[str, dict] = {}
      keyed by clip_id, value = parsed JSON of every Layer 1 file
    First hit per clip_id → load from disk into memory
    Subsequent hits → memory only (no disk I/O)
    Memory cleared on uvicorn restart; disk survives
```

**Warmup flow (the new contract):**

1. Frontend calls `POST /demo/match` (existing).
2. **Match handler kicks off a `BackgroundTask`** that pre-computes any missing Layer 1 files for that clip_id:
   - if `vision_report.json` missing → Qwen call → write
   - if `swarm_readings.json` missing → K2 swarm 7-call → write
   - if `k2_region_cache.json` missing → K2 swarm × N seconds → write
   - if `empathy.json` missing → full pipeline → write
3. Frontend polls **`GET /demo/warmup-status/{clip_id}`** which returns:
   ```json
   {"ready": false, "completed": ["vision_report"], "pending": ["swarm_readings", "k2_region_cache", "empathy"]}
   ```
   When all four exist on disk, `ready: true`.
4. Frontend transitions Loading → Main only when `ready: true`.

**Read-path policy for all `/demo/*` endpoints:**

```python
def _read_cached(clip_id: str, key: str) -> dict | None:
    # 1. memory hit?
    if (mem := SESSION_CACHE.get(clip_id, {}).get(key)) is not None:
        return mem
    # 2. disk hit?
    path = PRERENDERED_DIR / clip_id / f"{key}.json"
    if path.exists():
        data = json.loads(path.read_text())
        SESSION_CACHE.setdefault(clip_id, {})[key] = data
        return data
    # 3. cold — caller must compute + write
    return None
```

**Specific endpoint behavior post-warmup:**

| Endpoint | Cache key | Cold-call action |
|---|---|---|
| `GET /demo/vision-report/{id}` | `vision_report` | Qwen call (only if warmup hasn't run yet) |
| `GET /demo/empathy/{id}` | `empathy` | full pipeline (only if warmup skipped) |
| `GET /demo/iterative-trajectory/{id}` | `iterative_trajectory` | extract from `empathy` (cheap) |
| `GET /demo/falsification/{id}` | `falsification` | extract from `empathy` (cheap) |
| `POST /demo/k2-region` | `k2_region_cache[{network}_t{n}]` | K2 call → splice into cache file (only if warmup didn't pre-bake this combo) |

**Why pre-bake all 7 × N k2-region combos at warmup:**
- Demo: judge clicks any region at any second → instant return (<10ms).
- Cost: 7 networks × ~30 seconds × ~$0.0003/call ≈ $0.06 per clip warmup. Negligible.
- Latency: 7 × 30 = 210 K2 calls. With `asyncio.Semaphore(6)` parallelism that's ~35 sequential rounds × ~1s = ~35s warmup. Frontend shows "preparing..." while this runs.
- Saturday 8 AM pre-cache freeze: warmup runs offline once and commits the JSON to repo, so demo-day warmup is just a disk read = instant.

**Files this adds (LANE-K):**
```
backend/services/
  session_cache.py        # SESSION_CACHE dict + _read_cached() helper
  warmup.py               # background task: bakes all Layer 1 files for a clip_id
  
backend/main.py
  + on /demo/match: BackgroundTasks.add_task(warmup_clip, clip_id)
  + GET /demo/warmup-status/{clip_id}
```

**Frontend change (LANE-O):**
- `LoadingStage.vue` polls `/demo/warmup-status` instead of jumping straight to Main on match success.

**Session lifecycle:**
- "Session" = process lifetime of the FastAPI server. Memory cache cleared on restart; disk cache persists.
- No explicit session-end / flush endpoint needed — the cache is keyed by clip_id, and clips don't change content.
- If you need a hard refresh during demo: delete the relevant JSON files in `prerendered/{clip_id}/` (skips re-bake of activity.json + MP4 which are source-of-truth assets).

---

## §8. Open questions still on the table

1. **Stage 4 polish — Claude Opus or skip?** If Opus, what prompt? (Suggestion: a 100-word literary-polish pass over the K2 best_paragraph; cut-line if behind.)
2. **Embedding model for proxy.** sentence-transformers `all-MiniLM-L6-v2` is the default — small, fast, CPU-friendly. OK?
3. **Projection-map fit data.** Need 4-6 hand-paired (paragraph, mean-activation-vector) examples per scenario, written into `backend/services/embedding_proxy/training_pairs.yaml`. Want me to draft these?
4. **K2 evaluator prompt.** Should the per-region evaluator output a single 0..1 score, or score + brief justification? (Suggestion: score + 1-sentence justification; surfaces in per_region_attribution for the empathy doc §C.)
5. **Pitch-deck pages.** Leave hardcoded `EmpathyDocument` literals in `caltech/pitch-deck/app/sponsor/[sponsor]/page.tsx`, or wire to live `/demo/empathy/{clip_id}`? Recommend: leave hardcoded — slide deck is a separate surface from the live demo.
6. **Falsification verdict label.** PRD says `delta > 0.40` = "anchored". With proxy scoring, the threshold may need recalibration. Calibrate Saturday 4 AM after smoke #7.

---

## §9. References

- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` — engineering spec (still governs §6 contracts mostly; deviations from PRD called out throughout this doc)
- `caltech/use-cases/two-demo-scenarios.md` — scenario contract
- `caltech/use-cases/listenlabs-sideshift.md` — Scenario B framing
- `caltech/use-cases/ironside.md` — Scenario A framing
- `backend/prompts/moderator.md` — existing moderator prompt (will be adapted)
- `backend/prompts/{network}.md` — existing 7 Yeo7 swarm prompts (kept as-is)

---

**Net change from the technical PRD:** No live TRIBE, ever. K2-swarm-as-evaluator replaces TRIBE forward as the iterative-loop scorer. Embedding proxy replaces TRIBE forward for falsification numbers. Without-TRIBE pass killed. Two scenarios still ship; one shared swarm; Opus is a final-polish cherry only.
