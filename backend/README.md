# `backend/` — Empathy Layer FastAPI service

**Owner:** Jacob Cho
**Mandate:** verify what's built vs broken, log with real test commands + real terminal output. Refactor only what verification proves is broken.

---

## What this is

The backend is a FastAPI service orchestrating the Empathy Layer pipeline. It takes a clip_id, walks the pre-rendered TRIBE V2 brain pattern through 5 stages of K2 + Anthropic + sentence-transformer calls, and returns an `EmpathyDocument` JSON to the frontend.

**TRIBE V2 is NOT run live.** The runtime never invokes TRIBE in any direction. `backend/prerendered/<clip_id>/activity.json` IS the canonical brain artifact (TRIBE V2 was used offline to produce it).

Pipeline (each stage cited per `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` v2.1):

```
INPUT (clip_id) → backend/prerendered/<clip_id>/
                    │
   ┌────────────────┴────────────────┐
   ▼                                 ▼
Stage 1A — Qwen3-VL (vision_client)  Stage 1B — K2 swarm (swarm_runner)
   │                                 │
   └─────────┬───────────────────────┘
             ▼
   Stage 2 — K2 moderator (empathy_synthesis)
             │  ↻ feeds back per round
             ▼
   Stage 3 — K2 evaluator swarm (iterative_loop)
             │  best_paragraph + round_trajectory
             ▼
   Stage 4 — Opus 4.7 polish (empathy_polish, gated OPUS_POLISH=1)
             │
             ▼
   Stage 5 — Embedding-proxy falsification (falsification + embedding_proxy)
             │
             ▼
   EmpathyDocument → /demo/empathy/{clip_id}
```

---

## Repo map

```
backend/
├── main.py                          ← FastAPI app, all /demo/* + /brain/* + /ws routes
├── atlas.py                         ← fsaverage5 + Yeo7 surface-label utilities
├── smoke_test_swarm.py              ← legacy smoke test (still useful)
├── .env                             ← K2_API_KEY (IFM-prefixed → api.k2think.ai),
│                                       VISION_API_KEY (OpenRouter → Qwen3-VL).
│                                       NEVER commit this file.
├── .env.example                     ← committed template
├── requirements.txt                 ← Python deps; install via .venv/bin/pip
├── .venv/                           ← virtualenv; created via `python3 -m venv .venv`
│                                       (gitignored)
├── services/
│   ├── vision_client.py             ← Stage 1A: Qwen3-VL via OpenRouter
│   ├── swarm_runner.py              ← Stage 1B: 7 parallel K2 specialist calls
│   ├── empathy_synthesis.py         ← Stage 2: K2 moderator (was Opus in v1)
│   ├── iterative_loop.py            ← Stage 3: K2-evaluator-swarm iterative loop
│   ├── empathy_polish.py            ← Stage 4: Opus 4.7 polish (gated OPUS_POLISH=1)
│   │                                   ⚠ NOT YET BUILT per A3 audit — verify J.9
│   ├── falsification.py             ← Stage 5: cosine via embedding proxy
│   ├── embedding_proxy/
│   │   ├── __init__.py              ← embed_text + project_to_yeo7 + proxy_score
│   │   ├── projection_map.npy       ← W matrix (384 × 7) fit offline
│   │   └── training_pairs.yaml      ← seed pairs for re-fit
│   ├── k2_client.py                 ← K2 IFM Think v2 wrapper (with reasoning-strip)
│   ├── orchestrator.py              ← legacy single-region call (still used by /demo/k2-region)
│   ├── brain_mesh.py                ← fsaverage5 inflated mesh + Yeo7 labels
│   ├── activity_reader.py           ← reads activity.json + normalizes
│   ├── session_cache.py             ← in-process O(1) cache (warm path)
│   ├── warmup.py                    ← BackgroundTask: pre-bake every Layer-1 cache
│   │                                   on POST /demo/match
│   └── swarm.py                     ← boids-physics for the 100 brain agents (visual)
├── prompts/                         ← K2 system prompts
│   ├── visual.md
│   ├── somatomotor.md
│   ├── dorsal_attention.md
│   ├── ventral_attention.md
│   ├── limbic.md
│   ├── frontoparietal.md
│   ├── default_mode.md
│   ├── moderator.md                 ← legacy single-region moderator
│   ├── moderator_synthesis.md       ← Stage 2 K2 moderator system prompt
│   └── evaluator_score.md           ← Stage 3 K2 evaluator system prompt
├── prerendered/                     ← per-clip cache (source of truth, committed)
│   ├── 30s_ironsite/                ← workplace · construction
│   │   ├── 30s_ironsite.mp4
│   │   ├── activity.json            ← TRIBE V2 (canonical brain output)
│   │   ├── scenario.json            ← {scenario, label}
│   │   ├── vision_report.json       ← Stage 1A cached
│   │   └── (post-warmup: swarm_readings.json, k2_region_cache.json,
│   │                     empathy.json, falsification.json)
│   ├── 30s_twitter/                 ← consumer · feed scroll
│   ├── 30s_ironsite2/               ← NEW: workplace variant 2 (mp4 not yet dropped)
│   ├── 30s_ironsite3/               ← NEW: workplace variant 3 (mp4 not yet dropped)
│   └── README.md                    ← per-clip cache layout doc
├── qa_logs/                         ← prior QA outputs + screenshots (read-only history)
└── README.md                        ← this file
```

---

## API surface (live)

| Method | Path | Returns | Used by |
|---|---|---|---|
| GET | `/demo/clips` | clip list with thumbnails | landing UI |
| POST | `/demo/match` `{filename}` | clip_id + warmup task started | upload → resolve |
| GET | `/demo/warmup-status/{clip_id}` | `{ready, stages_done}` | loading poll |
| GET | `/demo/vision-report/{clip_id}` | vision_report.json | dashboard panel |
| GET | `/demo/activity/{clip_id}` | activity.json | brain mesh activations |
| GET | `/demo/empathy/{clip_id}` | full EmpathyDocument | hero output |
| GET | `/demo/iterative-trajectory/{clip_id}` | round_trajectory[] | iterative loop visual |
| GET | `/demo/falsification/{clip_id}` | `{main_score, control_score, delta, verdict}` | bottom strip |
| POST | `/demo/k2-region` `{clip_id, network, t}` | popup payload | brain-region hover |
| WS | `/ws` | per-frame swarm events | live agent edges |
| GET | `/brain/mesh` | fsaverage5 vertices + faces + Yeo7 labels | 3D init |
| GET/POST | `/brain/{status,start,stop,reload}` | sim control | dev/debug |

**Field names are short-form** (per A4-deepdive Pick B): `main_score`, `control_score`, `delta`, `verdict`. NOT the long-form `main_paragraph_score`/etc that older docs reference.

---

## Boot the backend

```bash
cd backend
python3 -m venv .venv               # one-time
.venv/bin/pip install -r requirements.txt   # one-time
.venv/bin/python -m uvicorn main:app --port 8000 --host 127.0.0.1 --reload
```

Healthcheck:
```bash
curl -s http://localhost:8000/demo/clips | jq
# Should return 4-5 clips
```

---

## Environment

**`backend/.env`** must contain (NEVER commit):

```
K2_API_KEY=IFM-...                                # IFM-prefixed → api.k2think.ai
K2_BASE_URL=https://api.k2think.ai/v1
K2_MODEL=MBZUAI-IFM/K2-Think-v2
K2_TIMEOUT=45.0
VISION_API_KEY=sk-or-v1-...                       # OpenRouter → Qwen3-VL (code is hardcoded to OpenRouter)
VISION_MODEL=qwen/qwen3-vl-235b-a22b-instruct
VISION_TIMEOUT=60.0
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_HTTP_REFERER=http://localhost:3000
OPENROUTER_APP_TITLE=brain-swarm-demo
ANTHROPIC_API_KEY=sk-ant-...                      # Stage 4 Opus 4.7 synthesis
ANTHROPIC_MODEL=claude-opus-4-7
OPUS_POLISH=1                                      # 1 to enable; 0 or unset → Stage 4 skipped
```

**IMPORTANT: IFM-prefixed K2 keys MUST hit `api.k2think.ai`, NOT Cerebras.** `api.cerebras.ai/v1` returns 401 for IFM keys. This was the cause of the original parser bug.

---

## Locked rules (non-negotiable)

1. **TRIBE V2 NEVER runs live.** Pre-rendered `activity.json` only. Cache miss → log + 404, never synthesize.
2. **No silent stubs.** Failures log structurally + return error payload + frontend renders visible "FAILED" badge. Pattern:
   ```python
   logger.error("k2_call_failed", extra={"clip": clip_id, "network": net, "status": status, "body": body[:200]})
   return {"error": "k2_unavailable", "clip_id": clip_id, "network": net}
   ```
3. **Swarm-loop merged.** K2 plays three roles on one surface: Stage 1B specialists, Stage 2 moderator, Stage 3 evaluators.
4. **Opus is Stage 4 only.** Single call, ~140 tokens out, gated `OPUS_POLISH=1`, K2-best fallback.
5. **Field names short-form** (`main_score`, etc — see API surface table above).

---

## Verification mandate (Jacob's task list)

Run the 16-step walkthrough in `caltech/3-PERSON-PARALLEL-PLAN.md` §3. Each step has a real verification command and an expected result. Write your findings to `caltech/audits/V-jacob-backend.md` using the template in `caltech/3-PERSON-PARALLEL-PLAN.md` §2.

**P0 fixes (after verification surfaces them):**
- J.10 falsification `delta=0.0` (demo-blocking — A1 + A3 + A5 all flagged this)
- J.6 / J.11 silent `[K2 error]` placeholders (A2 catalog)
- J.13 empathy guardrail truthiness bug (A1-deepdive)

**P1 fixes:**
- J.9 Stage 4 Opus polish missing (A3-deepdive recommends SHIP)

**P2 fixes:**
- Long lines, debug `print()`, bare `except` (A9 §4-§6)

---

## Audit reports relevant to backend

- `caltech/audits/A1-prerender-cache.md` — cache layout + TRIBE-not-live audit
- `caltech/audits/A1-deepdive.md` — control-clip strategy + guardrail bug exact line
- `caltech/audits/A2-stub-fallbacks.md` — silent-stub catalog with file:line + exact replacement code
- `caltech/audits/A3-swarm-loop-merge.md` — v2 architecture conformance
- `caltech/audits/A3-deepdive.md` — Stage 4 Opus polish SHIP decision + `services/empathy_polish.py` sketch
- `caltech/audits/A6-qa-eval-harness.md` — eval recipes you'll run during verification

---

## Common debug recipes

```bash
# Stage 1B swarm directly on a clip (no HTTP)
.venv/bin/python -c "
import asyncio, json
from services.swarm_runner import run_swarm
activity = json.load(open('prerendered/30s_ironsite/activity.json'))
print(asyncio.run(run_swarm(activity, '30s_ironsite')))
"

# End-to-end empathy
curl -s http://localhost:8000/demo/empathy/30s_ironsite | jq '.best_paragraph, .falsification'

# Force-regenerate cache (delete + re-call)
rm -f prerendered/30s_ironsite/{vision_report,empathy,falsification}.json
curl -X POST http://localhost:8000/demo/match -H "Content-Type: application/json" -d '{"filename":"30s_ironsite.mp4"}'

# Tail uvicorn logs (if running in tmux)
tmux capture-pane -p -t hackathon:orchestrator -S -100

# Stub leak grep
grep -rn '"stub":\s*True\|return _stub_report' services/

# Long-line lint
find . -name "*.py" -not -path "*/__pycache__/*" -not -path "*/.venv/*" \
  -exec awk '$0 ~ /.{121}/ {print FILENAME":"NR" ("length($0)" chars)"}' {} \;
```

---

## Hand-off contracts

**To Junsu (frontend):** the `EmpathyDocument` JSON shape from `/demo/empathy/{clip_id}` is the contract. If you change any field name, ping Junsu same-day. Field names locked per `caltech/CONTRACTS.md` C2 (short-form).

**To Johnny (demo):** you publish `caltech/audits/V-jacob-backend.md` with all 16 verification entries. Johnny gates on it: zero P0 broken means demo can ship.

---

## What this README does NOT cover

- Frontend internals → see `frontend/README.md`
- Demo-day runbook + pitch deck → see `caltech/README.md`
- Architecture rationale → see `caltech/architecture-overview.md` (long-form prose)
- The pipeline as a single doc → see `caltech/NEW-ARCHITECTURE.md`
- The exact PRD requirements → see `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` v2.1

If anything's ambiguous: read those + `caltech/CONSTRAINTS.md`. If still ambiguous, escalate to the orchestrator with `[ESCALATE]` tag in your verification report.
