# TODO — handoff to next person

This is a brain-visualization demo: upload an MP4 → watch a 3D brain swarm sync to the video → see a side-by-side LLM analysis with vs without TRIBE V2 neural context.

It's wired end-to-end, but **needs API keys before it can talk** (every LLM endpoint currently returns stub fallbacks).

---

## 1. Set up `.env`

Create the file at this exact path:

```
backend/.env
```

Copy from the template:

```bash
cd backend
cp .env.example .env
```

Then fill in these keys:

### Required

| Variable | What it does | Where to get it |
|---|---|---|
| `K2_API_KEY` | Cerebras key for **K2 Think** — powers the per-region narration popups when you click a brain region. Without this, every popup says `[K2 call failed: 401]`. | https://cloud.cerebras.ai → API Keys |
| `VISION_API_KEY` | Anthropic key for **Claude vision** — used for (a) the loading-screen vision report, (b) the WITHOUT-TRIBE vs WITH-TRIBE comparison panels in stage 4. | https://console.anthropic.com → API Keys |

### Optional / has defaults

| Variable | Default | Notes |
|---|---|---|
| `K2_BASE_URL` | `https://api.cerebras.ai/v1` | Don't change unless Cerebras rotates their endpoint |
| `K2_MODEL` | `k2-think-v2` | If 401-ing, try `llama-3.3-70b` first to validate the key, then swap back |
| `K2_TIMEOUT` | `45.0` | Seconds |
| `VISION_PROVIDER` | `anthropic` | Or `gemini` / `openai` if you want to swap providers |
| `VISION_MODEL` | `claude-sonnet-4-5` | Match the provider |
| `VISION_TIMEOUT` | `60.0` | Seconds — vision calls are slower |
| `DATA_DIR` | `./data` | Legacy, only used by the old `/brain/upload` flow |

### Sample `.env` (drop in your keys)

```
K2_API_KEY=csk-your_cerebras_key_here
VISION_API_KEY=sk-ant-your_anthropic_key_here
VISION_PROVIDER=anthropic
VISION_MODEL=claude-sonnet-4-5
```

---

## 2. Install dependencies

### Backend (Python)

```bash
cd backend
pip install -r requirements.txt
```

**Optional but recommended:**
- `pip install nilearn nibabel` — gives you the real **20,484-vertex** fsaverage5 brain mesh. Without these, backend falls back to a synthetic 4,800-vertex sphere (looks worse but functional).
- `pip install opencv-python-headless` — used to extract video frames for the Claude vision call. If missing, falls back to `ffmpeg` subprocess; if that's also missing, vision returns a stub.

### Frontend (Node)

```bash
cd frontend
npm install
```

---

## 3. Run it

Two terminals:

```bash
# Terminal 1 — backend
cd backend
python -m uvicorn main:app --port 8000

# Terminal 2 — frontend
cd frontend
npm run dev
```

Open **http://localhost:3000** in a browser.

Vite proxies `/demo/*` and `/prerendered/*` to backend on `:8000` automatically.

---

## 4. Test the demo flow

1. Drag-drop or click-upload one of these (filename is what matters — backend just looks up the prerendered clip):
   - `30s_ironsite.mp4`
   - `30s_twitter.mp4`
2. Loading screen should show two progress bars (Vision + TRIBE), both finish in ~3-5s
3. Stage 3: brain (left) + video (right). **Press play on video** — swarm should sync to `video.currentTime`. **Click a region sphere** on the brain → popup with K2 narration + paper citation
4. Click "Next →" → comparison view. Top-right = LLM analysis WITHOUT TRIBE context, bottom-right = WITH TRIBE neural context

---

## 5. Quick smoke checks

```bash
# Backend up + finds clips
curl http://localhost:8000/demo/clips

# MP4 served
curl -I http://localhost:8000/prerendered/30s_ironsite/30s_ironsite.mp4

# K2 prompt loads + makes a real call (will 401 without K2_API_KEY)
curl -X POST http://localhost:8000/demo/k2-region \
  -H "Content-Type: application/json" \
  -d '{"clip_id":"30s_ironsite","network":"visual","t":4}'
```

---

## 6. Known gotchas

- **Stub responses without keys**: every LLM endpoint returns a `{"stub": true}` fallback if the key is missing. Frontend renders fine but text is meaningless. Set both keys before demoing.
- **Cached LLM responses**: `backend/prerendered/{clip}/vision_report.json` and `comparison.json` get written on first call to save cost. They're gitignored. Delete them to force regeneration.
- **`example_clip` has no MP4** — that's fixture data only, ignore it.
- **`caltech/pitch-deck/`** is a SEPARATE project (the public deck). The brain-swarm demo lives in `frontend/` + `backend/`. Don't confuse them.
- **`_bmad/`, `research/`, `archive/`** are docs/history. Not load-bearing for the demo. Safe to ignore.

---

## 7. File map

```
hackathon/
├── frontend/                   ← Vue 3 + Vite + Three.js demo
│   └── src/
│       ├── App.vue             ← stage router
│       ├── stages/             ← LandingStage, LoadingStage, MainStage, ComparisonStage
│       └── components/         ← BrainScene, RegionPopup, AnalysisPanel
├── backend/                    ← FastAPI
│   ├── main.py                 ← endpoints + WS
│   ├── prerendered/            ← MP4s + activity.json per clip
│   ├── prompts/                ← K2 system prompts (one per Yeo7 network)
│   ├── atlas.py                ← Yeo7 surface labels for fsaverage5
│   ├── services/
│   │   ├── orchestrator.py     ← parallel K2 calls on network spikes
│   │   ├── k2_client.py        ← Cerebras client (CoT-stripped)
│   │   ├── vision_client.py    ← Claude/Gemini/OpenAI vision
│   │   ├── comparison.py       ← LLM with vs without TRIBE
│   │   ├── brain_mesh.py       ← fsaverage5 + Yeo7 (or mock fallback)
│   │   ├── activity_reader.py  ← reads activity.json + normalizes
│   │   └── swarm.py            ← boids physics for the 100 agents
│   ├── .env.example            ← template — copy to .env
│   └── requirements.txt
├── archive/                    ← planning docs, old TRIBE pipeline, ipynbs
└── TODO.md                     ← this file
```
