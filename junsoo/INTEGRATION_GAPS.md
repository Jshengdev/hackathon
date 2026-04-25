# Integration gaps after pulling jacob → junsoo

After merging `origin/jacob @ 9be66d0` and the path-fix + narration-tune commits, here's the actual end-to-end picture and what's still missing for a working demo.

## What we have now (post-merge)

```
                ┌──────────────────────┐
                │  junsoo/             │  ← TRIBE v2 inference + research-grounded
                │  - run_inference.py  │     swarm prompts
                │  - aggregate.py      │
                │  - atlas.py          │
                │  - papers/CONTEXT.md │
                │  - papers/prompts/   │  (8 prompt files)
                │  - infer_pipeline.sh │  ← copies activity.json into backend/data/
                └──────────┬───────────┘
                           │  preds.npz + activity.json
                           ▼
                ┌──────────────────────────────────────────┐
                │  _bmad/brain-swarm/backend/  (FastAPI)   │
                │  - main.py                  : app wire-up │
                │  - services/brain_mesh.py   : fsaverage5 │  ← imports junsoo/atlas.py
                │  - services/activity_reader.py: JSON read│  ← reads junsoo's activity.json
                │  - services/swarm.py        : boids sim  │
                │  - services/orchestrator.py : K2 calls   │  ← loads junsoo/papers/prompts/
                │  - services/k2_client.py    : Cerebras   │
                └──────────┬───────────────────────────────┘
                           │  WebSocket: vertex activations + agents + speech
                           ▼
                ┌──────────────────────────────────────────┐
                │  _bmad/brain-swarm/frontend/   (Vue 3)   │
                │  - App.vue / BrainScene.vue : Three.js   │
                │  - api/index.js             : REST + WS  │
                └──────────────────────────────────────────┘
```

The wiring is **mostly there**. ActivityReader reads `data/preds.npz` + `data/activity.json`, BrainMesh imports `junsoo/atlas.py` to project Yeo7 labels, Orchestrator loads `junsoo/papers/prompts/<network>.md` for grounded voices. With Jacob's resilient-startup fix, the backend boots even without nilearn (UV-sphere mock). Path-resolution bug (`parents[3]` → `parents[4]`) is fixed.

## What we are missing — ranked

### 🔴 Demo-critical (must fix before showing anything)

1. **`backend/.env` with a real `K2_API_KEY`** — the K2 client returns the literal string `"[K2_API_KEY not set]"` if missing. All swarm narration will be that string. Check `.env.example`; copy to `.env` and set the Cerebras key.
2. **`brain-swarm/backend/requirements.txt` is missing `nilearn` deps for the atlas** — wait, it has `nilearn>=0.10.0`, but our `junsoo/atlas.py` imports `from nilearn import datasets, surface`. That should work — but only after `backend/.venv` is built fresh. **Verify** `pip install -r requirements.txt` succeeds end-to-end on the deploy box.
3. **Frontend `node_modules` not installed on demo box** — `cd _bmad/brain-swarm/frontend && npm install` and `npm run dev` (Vite). No script documents this.
4. **No README at `_bmad/brain-swarm/`** — nobody on the team can boot the stack without reading 4 source files. Need a 30-line "how to run".

### 🟡 Pipeline integrity (silent failures otherwise)

5. **`infer_pipeline.sh` assumes cwd=`junsoo/`** — it does `cd` nowhere and uses `BACKEND_DATA_DIR=../_bmad/brain-swarm/backend/data`. If run from repo root it copies into the wrong place. Either document the cwd assumption or `cd "$(dirname "$0")"` at top.
6. **Backend never reloads `activity.json`** — `ActivityReader.load()` runs once on startup. After `infer_pipeline.sh` drops new files, the backend keeps using the old data until restart. Either: (a) add a `POST /brain/reload` endpoint, (b) hot-reload uvicorn (already enabled when run with `__main__`), or (c) document the restart step.
7. **Synthetic fallback in `activity_reader.py` is silent** — if `preds.npz` is missing it generates a synthetic 120-frame loop with no warning to the frontend. The HUD shows "running" but the brain is fake. Add a flag in `/brain/status` like `"data_source": "real" | "synthetic"`.
8. **`aggregate.py` outputs raw mean activations** (range can be negative or >1), but `activity_reader._normalize` uses sigmoid squeeze on raw vertex preds, not on the per-network means. So the JSON `regions` values and the vertex-derived `regions` values are on **different scales**. Two paths:
   - Make `ActivityReader.get_network_frame()` always derive from normalized vertex data (ignore the JSON's `regions`).
   - Or normalize the JSON values too in `_normalize_frames()`.
   Currently the orchestrator's `SPIKE_THRESHOLD = 0.60` is calibrated for normalized [0,1] data, so JSON-fed runs may never spike.

### 🟠 Prompt grounding (research polish)

9. **Orchestrator only uses 7 network prompts; `papers/prompts/moderator.md` is unused** — `MODERATOR_SYSTEM` is hard-coded inline in `orchestrator.py`. Should `_load_prompt("moderator")` and use the rich version (mode classification table, valence inference, boundary handling).
10. **Network agents see `t={t}s` and the cross-network values, but not the stimulus text** — `aggregate.py` already attaches `frame["stimulus"]` (transcript snippet) when segments are available. Pass it into the user message so agents can reason about *what the subject is hearing/seeing*, not just activations.
11. **`SPIKE_THRESHOLD` and `MAX_NETWORKS_PER_FRAME` hard-coded** — tune via env vars so demo-day calibration doesn't require code edits.

### 🟢 Story & demo polish (nice to haves)

12. **No way to see the full moderator narrative** — moderator text is pushed into `speech_queue` but the frontend only shows recent items in a transient panel. Add a transcript log.
13. **No way to upload a video from the frontend → run TRIBE → load the results** — `POST /brain/upload` saves the file and returns a *suggestion string* `"next: python ../../junsoo/run_inference.py …"`. There's no actual run trigger. For demo, manual two-shell flow is fine; for autonomy, wire `BackgroundTasks` to call `infer_pipeline.sh`.
14. **No subtitle/event overlay tied to VAN spikes** — `papers/prompts/ventral_attention.md` says the VAN agent is the "event-boundary detector" and should emit boundary calls. The frontend doesn't yet visualize boundaries (a flash, a divider in the speech panel, etc.). Easy win for demo theatre.
15. **No swarm contract doc** — `junsoo/future_plan.md` proposes a `swarm_contract.md` with locked JSON schemas between lanes. It's not written. With the integration converging, lock it now.

## Suggested next 90 minutes

| Priority | Task | Owner | ETA |
|---|---|---|---|
| 🔴 | Set `K2_API_KEY` in `.env` and verify swarm narration works locally | Tech B | 5 min |
| 🔴 | Write `_bmad/brain-swarm/README.md` (boot steps, env vars, restart-after-pipeline) | Tech C | 15 min |
| 🟡 | Fix scale mismatch between aggregate.py JSON and ActivityReader normalization (gap #8) | Junsoo | 20 min |
| 🟡 | Add `POST /brain/reload` so we don't need to restart after each `infer_pipeline.sh` run | Tech B | 10 min |
| 🟠 | Wire `papers/prompts/moderator.md` into orchestrator (gap #9) | Junsoo | 5 min |
| 🟠 | Pass `frame.stimulus` text into network-agent user message (gap #10) | Junsoo | 10 min |
| 🟢 | VAN-spike visual marker on frontend (gap #14) | Tech C + non-tech | 20 min |

## Files to read for full context

- `junsoo/papers/CONTEXT.md` — the *why* (research grounding)
- `junsoo/future_plan.md` — the 4-person build plan + JSON contract
- `_bmad/brain-swarm/backend/main.py` — the wire-up
- `_bmad/brain-swarm/backend/services/orchestrator.py` — the K2 swarm logic
- `_bmad/brain-swarm/backend/services/activity_reader.py` — the bridge from JSON → swarm
