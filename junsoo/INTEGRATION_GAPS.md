# Integration gaps — status log

After merging `origin/jacob @ 9be66d0` into local junsoo and three rounds of integration work, here's the post-integration end-to-end picture and what's still open.

**Last updated**: covers merges through `b659884` (run-inference endpoint + grounded moderator + nilearn API compat) plus this session's activity_reader rewrite, README, swarm contract, and wiring smoke test.

## End-to-end architecture (post-integration)

```
                ┌──────────────────────┐
                │  junsoo/             │  ← TRIBE v2 inference + research-grounded
                │  - run_inference.py  │     swarm prompts + JSON contract
                │  - aggregate.py      │
                │  - atlas.py          │  ← (b659884) updated for current nilearn API
                │  - papers/CONTEXT.md │
                │  - papers/prompts/   │  (8 prompt files, all loaded by orchestrator)
                │  - infer_pipeline.sh │  ← cd-safe, copies to backend/data/
                │  - swarm_contract.md │  ← NEW — locked JSON schemas between lanes
                └──────────┬───────────┘
                           │  preds.npz + activity.json
                           ▼
                ┌──────────────────────────────────────────┐
                │  _bmad/brain-swarm/backend/  (FastAPI)   │
                │  - main.py: /brain/{mesh,status,start,   │
                │     stop,upload,run-inference,reload,ws} │
                │  - services/brain_mesh.py: fsaverage5    │
                │     w/ jacob's UV-sphere mock fallback   │
                │  - services/activity_reader.py: reads    │
                │     preds.npz + activity.json,           │
                │     normalizes JSON regions to [0,1],    │
                │     exposes data_source + reload()       │
                │  - services/swarm.py: 7 region agents    │
                │     + 93 wanderer boids                  │
                │  - services/orchestrator.py: K2 fan-out  │
                │     w/ grounded moderator + stimulus +   │
                │     env-var thresholds                   │
                │  - smoke_test_swarm.py: K2-mocked        │
                │     wiring check                          │
                │  - README.md                              │
                └──────────┬───────────────────────────────┘
                           │  WebSocket: 1 Hz {t, activations[20484],
                           │  agents, network_activations, top_region, speech[]}
                           ▼
                ┌──────────────────────────────────────────┐
                │  _bmad/brain-swarm/frontend/   (Vue 3)   │
                │  - App.vue / BrainScene.vue : Three.js   │
                │  - api/index.js             : REST + WS  │
                └──────────────────────────────────────────┘
```

The wiring is **complete end-to-end** modulo the K2 401 (auth) and a few nice-to-haves. ActivityReader normalizes both vertex preds and JSON regions to `[0,1]`. Orchestrator loads all 7 grounded prompts + grounded moderator. The frame's stimulus transcript reaches every K2 call. Backend reloads without restart. Wiring is verifiable offline via `smoke_test_swarm.py`.

## Status by gap

### 🔴 Demo-critical
| # | Item | Status |
|---|---|---|
| 1 | `K2_API_KEY` in `.env` | **Open** — key set but Cerebras returns 401. Likely needs different `K2_BASE_URL` (IFM-prefixed keys may use a different endpoint than `api.cerebras.ai/v1`) or different `K2_MODEL` than `k2-think-v2`. Check Cerebras console. |
| 2 | `requirements.txt` includes nilearn | **Closed** — was already there; verified by `b659884` end-to-end boot. |
| 3 | Frontend `npm install` | **Open** — manual demo-day step (documented in README). |
| 4 | `_bmad/brain-swarm/README.md` | **Closed** — written this session. |

### 🟡 Pipeline integrity
| # | Item | Status |
|---|---|---|
| 5 | `infer_pipeline.sh` cwd assumption | **Closed** in `b659884` — `cd "$(dirname "$0")"` at top. |
| 6 | Backend reload of `activity.json` | **Closed** in `b659884` — `POST /brain/reload` + `activity_reader.reload()`. |
| 7 | Synthetic-fallback silence | **Closed** this session — `data_source` exposed in `/brain/status`: `synthetic` / `json_only` / `preds_npz_only` / `preds_npz_with_json`. |
| 8 | Scale mismatch (raw means vs sigmoid-normalized) | **Closed** this session — `_normalize_region_frames` per-region min-max → `[0,1]`. SPIKE_THRESHOLD=0.60 now actually fires on JSON-fed runs. |

### 🟠 Prompt grounding
| # | Item | Status |
|---|---|---|
| 9 | `papers/prompts/moderator.md` unused | **Closed** in `b659884` — orchestrator now `_load_moderator_prompt()` from disk. |
| 10 | Stimulus text not passed to agents | **Closed** in `b659884` — orchestrator passes `frame.stimulus` to every K2 user message. |
| 11 | `SPIKE_THRESHOLD` / `MAX_NETWORKS_PER_FRAME` hard-coded | **Closed** in `b659884` — env vars `SWARM_SPIKE_THRESHOLD` / `SWARM_MAX_PARALLEL`. |

### 🟢 Story & demo polish
| # | Item | Status |
|---|---|---|
| 12 | Persistent moderator transcript on frontend | **Open** — current speech panel is transient. Quick win: append to a separate "transcript" reactive list, never evict. |
| 13 | Frontend upload → run TRIBE → reload | **Closed** in `b659884` — `POST /brain/run-inference` calls `infer_pipeline.sh` and reloads. Frontend just needs an upload button to wire it through. |
| 14 | VAN-spike visual marker on frontend | **Open** — `ventral_attention.md` calls itself the "boundary detector". Frontend should flash / draw a divider when VAN spikes. |
| 15 | `swarm_contract.md` | **Closed** this session — contracts A/B/C/D locked, with mocking guidance per lane. |

## What's *actually* still open

3 items, all small:

1. **K2 auth (401)** — non-code; needs the right `K2_BASE_URL` + `K2_MODEL` for the issued key. Try: `K2_BASE_URL=https://api.cerebras.ai/v1`, model name like `llama-3.3-70b` or `qwen-3-32b` (Cerebras' standard catalog) to first confirm credentials work, then swap in K2 once that's nailed down.
2. **Frontend transcript log** (#12) — append-only reactive list next to the transient speech panel.
3. **Frontend VAN-spike marker** (#14) — flash the brain or pulse a "▌" divider in the speech panel when `network_activations.ventral_attention > 0.7`.

## How to verify the wiring without running anything live

```bash
# 1. Pure-Python aggregator JSON shape (no nilearn, no GPU, no K2):
cd junsoo && python smoke_test.py

# 2. Orchestrator wiring with mocked K2:
cd _bmad/brain-swarm/backend && python smoke_test_swarm.py
```

The second test confirms (a) all 7 grounded prompts + grounded moderator load from `junsoo/papers/prompts/`, (b) stimulus text reaches every K2 call, (c) JSON region normalization pulls negative/>1 values into [0,1], (d) rising-edge spike detection prevents per-tick re-billing, (e) `data_source` reflects the inputs.

## Files to read for full context

- `_bmad/brain-swarm/README.md` — boot steps, env vars, MiroFish patterns we adopted
- `junsoo/swarm_contract.md` — locked JSON between lanes
- `junsoo/papers/CONTEXT.md` — the *why* (research grounding)
- `junsoo/future_plan.md` — 4-person build plan
- `_bmad/MIROFISH-REFERENCE.md` — original reference patterns we borrowed from
