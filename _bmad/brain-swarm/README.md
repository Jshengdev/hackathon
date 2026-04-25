# Brain Swarm Visualizer

Live, MiroFish-style swarm visualization driven by **TRIBE v2** fMRI predictions on the **fsaverage5 cortical surface**, with **K2-based** per-Yeo7-network agents narrating the brain state in real time.

```
video.mp4 ──► junsoo/infer_pipeline.sh ──► preds.npz + activity.json ──┐
                                                                        │ (auto-copied
                                                                        │  into backend/data/)
                                                                        ▼
                                            ┌─────────────────────────────────┐
                                            │  backend (FastAPI, this dir)    │
                                            │  • brain_mesh: fsaverage5 +     │
                                            │    Yeo7 (via junsoo/atlas.py)   │
                                            │  • swarm: 7 region agents +     │
                                            │    ~93 boids wanderers          │
                                            │  • orchestrator: K2 fan-out     │
                                            │    using junsoo/papers/prompts/ │
                                            │  • WebSocket: 1 Hz tick         │
                                            └────────────────┬────────────────┘
                                                             │ ws://:8000/ws
                                                             ▼
                                            ┌─────────────────────────────────┐
                                            │  frontend (Vue 3 + Three.js)    │
                                            │  http://localhost:5173          │
                                            └─────────────────────────────────┘
```

## What patterns this borrows from MiroFish

The reference is `_bmad/MIROFISH-REFERENCE.md`. Patterns adopted in this codebase:

| MiroFish pattern | Where in our code |
|---|---|
| **Two-tier agent design** (region + wanderer) | `backend/services/swarm.py` — `region_agents` (1 per Yeo7 net) + `wanderers` (93 boids) |
| **Boids physics** (separate / cohere / attract to hotspots) | `backend/services/swarm.py:_update_wanderers` |
| **Region agents speak via LLM** | `backend/services/orchestrator.py` — K2 fan-out, one prompt per network |
| **REST + polling-style state** | `backend/main.py` — `GET /brain/status`, `GET /brain/mesh` |
| **WebSocket upgrade over polling** | `backend/main.py:simulation_loop` broadcasts at 1 Hz |
| **Synthetic fallback when data missing** | `services/activity_reader.py:_generate_synthetic` and `services/brain_mesh.py:use_mock` |

What we **didn't** take: Zep memory, Twitter/Reddit personas, file-based IPC, document → graph extraction. (See MIROFISH-REFERENCE.md § "What NOT to Take".)

## Quick start (local dev)

### 1. Backend (FastAPI)

```bash
cd _bmad/brain-swarm/backend

# Once: create venv + install
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Once: provision K2 credentials (Cerebras Inference)
cp .env.example .env
# then edit .env to set K2_API_KEY (and optionally K2_BASE_URL / K2_MODEL)

# Boot
python main.py
# → uvicorn on http://0.0.0.0:8000 (auto-reload on file change)
```

The startup log will tell you what loaded:
- `BrainMesh: loaded fsaverage5 ...` (real) vs `BrainMesh: generating mock UV-sphere brain...` (no nilearn)
- `ActivityReader: loaded preds (T, 20484)` vs `ActivityReader: no preds.npz — using synthetic`
- `Orchestrator: loaded 7/7 grounded network prompts + moderator=grounded` (best case)

`GET http://localhost:8000/brain/status` shows the same info live: `data_source`, `mesh_source`, `stimulus_label`, `n_frames`, `n_agents`.

### 2. Frontend (Vue 3 + Three.js)

```bash
cd _bmad/brain-swarm/frontend
npm install
npm run dev
# → Vite dev server on http://localhost:5173
```

Open the page, click ▶ Start, watch the brain mesh light up with the 7 Yeo networks colored by activation while wanderer particles flock to hotspots. The speech panel shows per-network observations and moderator synthesis as K2 returns.

### 3. End-to-end with a real video

Three options for getting `preds.npz` + `activity.json` into `backend/data/`:

**(a) Manual** — for hackathon dev:
```bash
cd junsoo
bash infer_pipeline.sh path/to/video.mp4
# This auto-copies into ../_bmad/brain-swarm/backend/data/
# Then in another terminal:
curl -X POST http://localhost:8000/brain/reload
```

**(b) Via the backend** — synchronous:
```bash
# Upload first
curl -F "file=@video.mp4" http://localhost:8000/brain/upload

# Then run inference (BLOCKS — minutes for ~1-min video on a GPU box)
curl -X POST http://localhost:8000/brain/run-inference \
  -H 'Content-Type: application/json' \
  -d '{"video_filename": "video.mp4"}'
# Reload happens automatically on success.
```

**(c) Headless / no video** — uses synthetic `_generate_synthetic` activations. Frontend runs against round-robin sinusoidal pulses; useful for UI dev without TRIBE / GPU.

## Environment variables

All have sensible defaults; only `K2_API_KEY` is required for live narration.

| Var | Default | Purpose |
|---|---|---|
| `K2_API_KEY` | (empty) | Cerebras key. Without this, all narrations become the literal string `"[K2_API_KEY not set]"`. |
| `K2_BASE_URL` | `https://api.cerebras.ai/v1` | OpenAI-compatible chat endpoint. |
| `K2_MODEL` | `k2-think-v2` | Model id. |
| `DATA_DIR` | `./data` | Where backend reads `preds.npz` + `activity.json`. |
| `SWARM_SPIKE_THRESHOLD` | `0.60` | Network must exceed this normalized value to fire a K2 call. |
| `SWARM_MAX_PARALLEL` | `3` | Cap on parallel K2 calls per tick. |

## Key endpoints

```
GET  /brain/mesh           — mesh + per-network metadata for the frontend
GET  /brain/status         — runtime state: t, n_frames, data_source, mesh_source, ...
POST /brain/start          — start the 1 Hz simulation loop
POST /brain/stop           — stop it
POST /brain/reload         — re-read preds.npz + activity.json without restart
POST /brain/upload         — multipart upload of a video file
POST /brain/run-inference  — run TRIBE pipeline on uploaded video, then reload
WS   /ws                   — per-tick JSON: { t, activations[20484], agents, network_activations, top_region, speech[] }
```

## Smoke tests (no GPU, no K2)

```bash
# 1. Aggregator JSON shape (lives in junsoo/, no nilearn needed):
cd junsoo && python smoke_test.py

# 2. Orchestrator wiring — mocks K2, validates prompt loading + stimulus passing + spike detection:
cd _bmad/brain-swarm/backend && python smoke_test_swarm.py
```

Both are byte-cheap and a useful pre-deploy check.

## File map

```
_bmad/brain-swarm/
├── README.md                       ← you are here
├── backend/
│   ├── main.py                     ← FastAPI app, simulation_loop, WS broadcast
│   ├── requirements.txt
│   ├── .env.example                ← copy to .env, set K2_API_KEY
│   ├── smoke_test_swarm.py         ← K2-mocked wiring check
│   └── services/
│       ├── brain_mesh.py           ← fsaverage5 mesh + Yeo7 labels (via junsoo/atlas.py)
│       ├── activity_reader.py      ← reads preds.npz + activity.json, normalizes to [0,1]
│       ├── swarm.py                ← region + wanderer agents, boids physics
│       ├── orchestrator.py         ← K2 fan-out using junsoo/papers/prompts/<net>.md
│       └── k2_client.py            ← thin OpenAI-compatible client
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.js, App.vue
        ├── api/index.js            ← REST + WS client
        └── components/BrainScene.vue  ← Three.js scene, brain mesh, particles, HUD
```

## Open issues

- **K2 returns 401 with current `.env`** — the IFM-prefixed keys may need a different base URL than `api.cerebras.ai/v1`, or the model id may not be `k2-think-v2`. Check Cerebras console for the right endpoint+model for your key.
- **`POST /brain/run-inference` is synchronous** — for long videos consider TaskManager (the MiroFish pattern in `MIROFISH-REFERENCE.md` § 4) or `BackgroundTasks`.
- **No transcript log on the frontend** — speech messages are transient. For demo theatre, persist them.
