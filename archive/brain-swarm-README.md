# Brain Swarm Visualizer — boot guide

Real-time, MiroFish-inspired swarm visualization driven by **TRIBE v2** fMRI predictions on the **fsaverage5 cortical surface**, with **K2-based** per-Yeo7-network agents narrating brain state in real time. This README gets a teammate from `git clone` to a running stack. For architecture / research grounding see [Reference](#reference) at the bottom.

---

## TL;DR — fastest path to "something on screen"

You can boot the stack in **3 minutes** with synthetic data — no TRIBE, no GPU, no K2 key needed.

```bash
# Terminal 1 — backend
cd _bmad/brain-swarm/backend
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python main.py                # → http://localhost:8000

# Terminal 2 — frontend
cd _bmad/brain-swarm/frontend
npm install
npm run dev                   # → http://localhost:5173
```

Open http://localhost:5173, click ▶ Start, watch the mock brain pulse with synthetic activations. Works offline. Used for UI dev. Add real TRIBE data and a K2 key later for the full demo (sections 3–4 below).

---

## 1. Prerequisites

| | Required for | Install |
|---|---|---|
| **Python ≥ 3.11** | backend | `brew install python@3.11` (mac) or `apt install python3.11 python3.11-venv` |
| **Node ≥ 18** | frontend | `brew install node` |
| **ffmpeg** | TRIBE inference (audio extraction) | `brew install ffmpeg` |
| **git-lfs** | TRIBE model weights | `brew install git-lfs && git lfs install` |
| **NVIDIA GPU + drivers** | TRIBE inference *only* | run `nvidia-smi` to check |
| **HuggingFace account** | gated `meta-llama/Llama-3.2-3B` (TRIBE dep) | request access at https://huggingface.co/meta-llama/Llama-3.2-3B then `huggingface-cli login` |
| **Cerebras account + key** | live K2 narration | https://cloud.cerebras.ai (model `k2-think-v2`) |

Disk: ~15 GB total for TRIBE + Llama + V-JEPA2 + DINOv2 weights. Backend without TRIBE is a few hundred MB.

You only need a GPU and HF/Cerebras accounts for the *full* demo path. Synthetic + frontend work without any of them.

---

## 2. Cold boot — backend

The backend is `_bmad/brain-swarm/backend/`. Run from there.

### 2.1 First-time setup

```bash
cd _bmad/brain-swarm/backend

# Create venv (only Python 3.11+; nilearn 0.10 wants modern numpy)
python3.11 -m venv .venv
source .venv/bin/activate

# Install
pip install -r requirements.txt
# Confirms: fastapi, uvicorn, numpy, nilearn, nibabel, httpx, scipy, ...

# Provision K2 credentials (skip if doing synthetic-only first run)
cp .env.example .env
# Edit .env to set K2_API_KEY. Other vars are optional (see § 5).
```

### 2.2 Boot

```bash
python main.py
```

You'll see startup logs in this order:

```
BrainMesh: loading fsaverage5 inflated surface...    ← real fsaverage5 (good)
  20484 verts, 40960 faces                            ← if you see ~5K verts, mesh fell back to mock
  Loaded Yeo7 labels: [0, 1, 2, 3, 4, 5, 6, 7]
  Networks: ['visual', 'somatomotor', ...]

ActivityReader: no preds.npz — using synthetic activations    ← expected on fresh boot
ActivityReader: no activity.json — network values derived from vertex data

Orchestrator: loaded 7/7 grounded network prompts + moderator=grounded from .../junsoo/papers/prompts
                                                              ↑
                                       If "0/7", the path resolution to junsoo/ broke.
                                       Confirm junsoo/ is at repo root and parents[4] in
                                       services/brain_mesh.py + services/orchestrator.py
                                       resolves correctly.

INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2.3 Verify the backend is alive

```bash
# Status — confirms what loaded
curl http://localhost:8000/brain/status
# {"running":false,"t":0,"n_frames":120,"n_agents":100,
#  "data_source":"synthetic","mesh_source":"fsaverage5","stimulus_label":""}

# Mesh — first call returns ~6 MB JSON (vertex coords + faces)
curl -s http://localhost:8000/brain/mesh | python3 -c "import json,sys;d=json.load(sys.stdin);print({k:type(v).__name__ for k,v in d.items()})"
# {'vertices': 'list', 'faces': 'list', 'n_vertices': 'int', 'n_left': 'int', 'networks': 'dict'}
```

If both calls work, backend is healthy. Do not start the simulation loop yet — wait until frontend is up.

### 2.4 Smoke test the wiring (offline, no K2)

```bash
python smoke_test_swarm.py
```

Expected: 3/3 sections pass, ending with `SMOKE TEST PASSED — orchestrator wiring is intact.` Use this any time you change `orchestrator.py` or `activity_reader.py` to confirm you didn't break the contract.

---

## 3. Cold boot — frontend

```bash
cd _bmad/brain-swarm/frontend
npm install
npm run dev
```

Vite serves on **http://localhost:5173**. Open it, you'll see:

- **HUD top-left**: ▶ Start button, WebSocket status dot, top-region label, frame counter
- **Brain scene** (Three.js): inflated fsaverage5 mesh colored by Yeo7 networks; should rotate with mouse drag (OrbitControls)
- **Speech panel bottom-right**: empty until you start the simulation

Click **▶ Start**, you should see:
- Vertices light up in waves driven by `ActivityReader._generate_synthetic` (round-robin sinusoidal pulses)
- 100 agents (7 region + 93 wanderer) move; wanderers flock toward hot centroids
- Speech messages appear *only if* K2 is reachable (otherwise the orchestrator runs but every observation is the literal string `"[K2_API_KEY not set]"`)

---

## 4. Hooking up real TRIBE data

Three modes, ranked from cheapest to most demo-realistic.

### Mode A — Synthetic only
Default if there's no `preds.npz` or `activity.json` in `backend/data/`. Round-robin pulses across the 7 networks. Good enough for UI dev.

### Mode B — Manual TRIBE → backend handoff (recommended for hackathon dev)

```bash
# In a third terminal (separate from backend/frontend):
cd junsoo
bash infer_pipeline.sh path/to/video.mp4
# Pipeline does:
#   1. run_inference.py  — TRIBE v2 → preds.npz   (needs GPU; ~3 min on a single video)
#   2. aggregate.py      — preds.npz → activity.json (CPU; <1s)
#   3. cp into ../_bmad/brain-swarm/backend/data/   (auto)

# Tell the running backend to pick up the new files (no restart needed):
curl -X POST http://localhost:8000/brain/reload
# {"ok":true,"n_frames":53,"data_source":"preds_npz_with_json","stimulus_label":"path/to/video.mp4"}
```

The frontend's next tick will reflect the real activations. **No backend restart, no frontend reload required.**

If TRIBE crashed, scroll the `infer_pipeline.sh` log — most failures are HF auth (gated Llama) or out-of-memory. See [Troubleshooting](#troubleshooting).

### Mode C — Upload + run via API (synchronous)

For when you want the backend to drive everything:

```bash
# Upload the video first
curl -F "file=@video.mp4" http://localhost:8000/brain/upload
# {"saved":"data/input/video.mp4","next":{"endpoint":"/brain/run-inference","payload":{"video_filename":"video.mp4"}}}

# Run TRIBE — BLOCKS for minutes while the GPU works. Auto-reloads on success.
curl -X POST http://localhost:8000/brain/run-inference \
  -H 'Content-Type: application/json' \
  -d '{"video_filename":"video.mp4"}'
```

Don't do this on demo day if you can avoid it — pre-cache via Mode B and just `curl /brain/reload` to swap clips live.

### Restart-after-pipeline cheat sheet

You almost never need to actually restart `python main.py`. The flow is:

```
new TRIBE run drops files → curl POST /brain/reload → frontend ticks now reflect new data
```

Restart the **backend** only when you change Python code (uvicorn auto-reloads when `__main__` is used; if you ran via `uvicorn main:app` directly, add `--reload`).
Restart the **frontend** only if Vite HMR fails (rare).
Restart neither for new TRIBE data — that's what `/brain/reload` is for.

---

## 5. Environment variables

All have defaults; only `K2_API_KEY` is required for live narration. Set in `.env` (which is git-ignored).

| Var | Default | Purpose |
|---|---|---|
| `K2_API_KEY` | (empty) | Cerebras key. Without it, narrations become the literal string `"[K2_API_KEY not set]"`. |
| `K2_BASE_URL` | `https://api.cerebras.ai/v1` | OpenAI-compatible chat endpoint. |
| `K2_MODEL` | `k2-think-v2` | Model id. |
| `K2_TIMEOUT` | `45.0` | Seconds. K2 Think emits chain-of-thought before the final answer; needs more headroom than chat models. |
| `DATA_DIR` | `./data` | Where backend reads `preds.npz` + `activity.json`, and where uploads are saved. |
| `SWARM_SPIKE_THRESHOLD` | `0.60` | Network must exceed this normalized value to fire a K2 call. Lower = more chatty (and more $). |
| `SWARM_MAX_PARALLEL` | `3` | Cap on parallel K2 calls per tick. |

---

## 6. Endpoint reference

```
GET  /brain/mesh           ← mesh + per-network metadata; ~6 MB JSON, called once on frontend boot
GET  /brain/status         ← runtime state: {running, t, n_frames, n_agents, data_source, mesh_source, stimulus_label}
POST /brain/start          ← start the 1 Hz simulation loop
POST /brain/stop           ← stop it
POST /brain/reload         ← re-read preds.npz + activity.json from DATA_DIR
POST /brain/upload         ← multipart upload of a video file → DATA_DIR/input/
POST /brain/run-inference  ← run TRIBE pipeline on uploaded video (blocking), then auto-reload
                              body: {"video_filename": "..."}
WS   /ws                   ← per-tick broadcast at 1 Hz:
                              { t, activations[20484], agents[100],
                                network_activations{7}, top_region, speech[0..N] }
```

**Speech message shape (region vs moderator):**

Region-type speech messages now include a `cite` field with the modern review-paper reference grounding that network's voice. The orchestrator parses K2's 3-line output (Reading / Confidence / Cite) into separate fields so the frontend can style citations distinctly. Moderator messages keep the original 2-field shape (freeform synthesis sentence).

```json
// type: "region"
{ "network": "visual", "text": "Bright onset...", "confidence": "high; ...",
  "cite": "[Allen et al. 2022, Nature Neuroscience]", "t": 4, "type": "region" }
// type: "moderator"
{ "network": "moderator", "text": "...", "t": 4, "type": "moderator" }
```

---

## 7. Troubleshooting

### Backend startup

| Symptom | Cause | Fix |
|---|---|---|
| `BrainMesh: generating mock UV-sphere brain` | nilearn / fsaverage5 cache missing | `pip install -r requirements.txt` again; first call to `nilearn.datasets.fetch_surf_fsaverage` downloads the mesh (one-time). Mock sphere works for dev. |
| `Orchestrator: loaded 0/7 grounded prompts` | path to `junsoo/` resolved wrong | Run `git ls-files junsoo/papers/prompts/` from repo root — should list 8 files. If yes, check `services/brain_mesh.py:7` and `services/orchestrator.py:18` use `parents[4]` (not `parents[3]`). |
| `ImportError: nilearn` | venv didn't pick up requirements | `source .venv/bin/activate && pip install -r requirements.txt` |
| Port 8000 in use | another process | `lsof -ti:8000 \| xargs kill` |

### Live narration

| Symptom | Cause | Fix |
|---|---|---|
| Every speech bubble says `"[K2_API_KEY not set]"` | `.env` missing or not loaded | Confirm `_bmad/brain-swarm/backend/.env` exists and contains `K2_API_KEY=…`. Backend reads via `python-dotenv`; restart needed if you edit `.env`. |
| K2 calls return 401 | wrong base URL or model for the issued key | First confirm the key works with a known-good Cerebras model (e.g. set `K2_MODEL=llama-3.3-70b` temporarily). If still 401, key is bad. If 200, swap back to `k2-think-v2` — model id is the issue. |
| K2 calls timeout | model is slow / network slow | Bump `K2_TIMEOUT=60` in `.env`. K2 Think is a CoT model, defaults already give it 45s. |
| Speech bubbles contain `<think>...</think>` | CoT-stripping regex didn't catch the format | `services/k2_client.py:_strip_reasoning` — adjust if K2 emits reasoning in a new shape. |

### Pipeline (Mode B / C)

| Symptom | Cause | Fix |
|---|---|---|
| `infer_pipeline.sh` exits at step 1 with HF gated error | no HuggingFace auth for Llama-3.2-3B | `huggingface-cli login` with a token that has access to `meta-llama/Llama-3.2-3B`. Request access at https://huggingface.co/meta-llama/Llama-3.2-3B |
| `infer_pipeline.sh` step 2 errors with `nilearn` API issue | atlas.py against an old nilearn | Already fixed in `b659884` — confirm `junsoo/atlas.py` uses `n_networks=` and `thickness=` kwargs (not legacy `thick_7`). |
| `/brain/reload` returns `data_source: "synthetic"` after pipeline ran | `BACKEND_DATA_DIR` mis-resolved during pipeline | `infer_pipeline.sh` cd's to its own dir; if you set `BACKEND_DATA_DIR` env, make sure the path is correct. Check `_bmad/brain-swarm/backend/data/` for `preds.npz` + `activity.json`. |
| TRIBE step OOMs | small GPU | TRIBE v2 needs ~16 GB VRAM for default model. Vultr's `vcgps-a100` works. |

### Frontend

| Symptom | Cause | Fix |
|---|---|---|
| Status dot stays red | WebSocket can't connect | Confirm backend is on `:8000`. CORS is wide-open; not a CORS issue. Try `wscat -c ws://localhost:8000/ws`. |
| Brain doesn't render, mesh API hangs | first `/brain/mesh` call is large | Wait ~5 s on first load; it's ~6 MB. |
| Particles sit motionless | simulation loop not running | Click ▶ Start. Confirm `GET /brain/status` returns `running: true`. |

---

## 8. Reference

### Architecture

```
video.mp4 ──► junsoo/infer_pipeline.sh ──► preds.npz + activity.json ──┐
                                                                        │ (auto-copied
                                                                        │  into backend/data/)
                                                                        ▼
                                            ┌─────────────────────────────────┐
                                            │  backend (FastAPI, this dir)    │
                                            │  • brain_mesh: fsaverage5 +     │
                                            │    Yeo7 (via junsoo/atlas.py)   │
                                            │  • activity_reader: normalizes  │
                                            │    JSON regions to [0,1]        │
                                            │  • swarm: 7 region agents +     │
                                            │    93 boids wanderers           │
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

### MiroFish patterns adopted

Reference: `_bmad/MIROFISH-REFERENCE.md`. What we borrowed:

| MiroFish pattern | Where in our code |
|---|---|
| Two-tier agent design (region + wanderer) | `services/swarm.py` — 7 region agents (one per Yeo7 net) + 93 wanderer boids |
| Boids physics (separate / cohere / attract to hotspots) | `services/swarm.py:_update_wanderers` |
| Region agents speak via LLM | `services/orchestrator.py` — K2 fan-out, one prompt per network |
| WebSocket upgrade over polling | `main.py:simulation_loop` broadcasts at 1 Hz |
| Synthetic fallback when data missing | `services/activity_reader.py:_generate_synthetic`, `services/brain_mesh.py:use_mock` |

What we deliberately skipped (per § "What NOT to Take" in MIROFISH-REFERENCE.md): Zep memory, Twitter/Reddit OASIS personas, file-based IPC, document-to-graph extraction.

### File map

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
│       └── k2_client.py            ← Cerebras client + K2 Think CoT-stripping
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.js, App.vue
        ├── api/index.js            ← REST + WS client
        └── components/BrainScene.vue  ← Three.js scene, brain mesh, particles, HUD
```

### Related docs

- `junsoo/papers/CONTEXT.md` — the *why* (research grounding for each Yeo7 agent)
- `junsoo/papers/prompts/<network>.md` — the 7 grounded agent prompts + moderator
- `junsoo/swarm_contract.md` — locked JSON schemas between lanes (use these for mocking)
- `junsoo/INTEGRATION_GAPS.md` — current open items
- `_bmad/MIROFISH-REFERENCE.md` — original reference patterns
