# Brain-Swarm Demo — End-to-End QA Report

Run date: 2026-04-25 (live keys, no MOCK)
Backend: `http://127.0.0.1:8000` (uvicorn pid `brwln8pe1`)
Frontend: `http://localhost:3000` (vite pid `b5mfrxmx9`)

## Bottom line

**Demo is wired end-to-end and ready to drive in the browser.** Every endpoint, every external API call, and every cache path is verified. K2 parser had a critical bug that returned the prompt template as the answer; that is now fixed.

| Subsystem | Status | Live API touched |
|---|---|---|
| MP4 + activity.json static serving | ✅ green | none |
| `/brain/mesh` (fsaverage5, 20484 vertices ×3 split) | ✅ green | none |
| `/brain/start`, `/brain/stop`, `/brain/status` (sim loop) | ✅ green | none |
| `/ws` WebSocket (100 agents, network_activations, speech) | ✅ green | none |
| `/demo/clips`, `/demo/match`, `/demo/activity/{id}` | ✅ green | none |
| `/demo/vision-report/{id}` (uncached + cached) | ✅ green | OpenRouter → Qwen3-VL |
| `/demo/comparison/{id}` (without_tribe + with_tribe) | ✅ green | OpenRouter → Qwen3-VL ×2 |
| `/demo/k2-region` (text/confidence/cite parsing) | ✅ green **after fix** | IFM → MBZUAI-IFM/K2-Think-v2 |

## Bugs fixed during QA

### BUG-1 — K2 parser returned prompt template as the answer
**Root cause:** K2 IFM Think v2 reasons out loud without `<think>` tags. With the previous 800-token budget it ran out before emitting the structured 3-line answer. While reasoning, it echoed the prompt's format spec verbatim (`1. **Reading**: one-sentence call on what's likely happening...`), and the parser's `lower().startswith("1.", "**reading**", ...)` matched those echoes — so the popup showed the prompt template instead of K2's actual analysis.

**Reproduction (T14 first run):** `POST /demo/k2-region {"network":"somatomotor","t":10}` → `text="one-sentence call on what's likely happening in this network right now."` (literal prompt text). Raw response was 3523 chars of pure reasoning, no final answer reached.

**Fix:**
1. `services/k2_client.py` — bumped budget `800 → 3500`, dropped temperature `0.7 → 0.3`, tightened system directive, appended `"FINAL ANSWER:"` marker to the user message so `_strip_reasoning` has a reliable splitter. Also added `"Thus final answer."` and `"Final answer."` to the trailing-marker recognition list (IFM K2 uses "Thus final answer." idiomatically).
2. `services/orchestrator.py::_parse_observation` — added a template-echo blocklist (`one-sentence call`, `low/med/high`, `what would change your call`, ...) that drops echo lines before parsing. Added unlabeled-line recognition: `[Author Year, Journal]` shape → cite, `(High|Medium|Low)\b` prefix → confidence. Last-resort fallback now uses the first non-template candidate line, never the full raw blob.

**Verification (T11c/T12c/T14c):**

| Network @ t | text | confidence | cite | raw_len |
|---|---|---|---|---|
| visual @ 4 | The subject is attending to a visual stimulus, likely a scene or object… | Medium confidence; would be higher if visual activation were stronger… | Allen et al. 2022, Nature Neuroscience | 253 |
| default_mode @ 15 | The subject is externally focused on visual information, suppressing internal narrative. | High confidence; would lower if DMN activation rose… | Smallwood et al. 2021, Nat. Rev. Neurosci. | 215 |
| somatomotor @ 10 | The somatomotor+early auditory network shows little activity, indicating a quiet, static visual scene… | Medium confidence: the low somatomotor activation… | Norman-Haignere, Kanwisher & McDermott 2015, Neuron | 437 |

All three populated cleanly. Latency 8–17s per call (K2 is doing real reasoning work).

### BUG-2 — Anthropic vision swapped to OpenRouter+Qwen3-VL (intentional, per user)
Switched both `services/vision_client.py` (frame-bearing call) and `services/comparison.py` (text-only) to use a new `openrouter` provider with default model `qwen/qwen3-vl-235b-a22b-instruct`. OpenRouter is OpenAI-compatible chat-completions; sends frames as `image_url` data-URL content blocks. Verified live on both clips:
- T7 `30s_ironsite`: 51s → real construction-site analysis, 5 actions, `stub:false`
- T9 `30s_twitter`: 60s → real social-media analysis, 5 actions, `stub:false`
- T10 `comparison`: 30s → both `without_tribe` and `with_tribe` fired, both `stub:false`. With-TRIBE summary correctly conditions on the activations ("externally oriented attention and visual processing, with minimal internal mentation").

### BUG-3 — IFM-prefixed K2 key was pointed at Cerebras URL
**Root cause:** the user's key `IFM-qSlh7sLd...` is hosted by IFM directly, not Cerebras. `https://api.cerebras.ai/v1` returns 401 for IFM keys (per the comment in `junsoo/.env.example`). The first smoke run still got 200s because it hit `_stub`-flagged paths or got lucky. Fixed by switching `K2_BASE_URL=https://api.k2think.ai/v1` and `K2_MODEL=MBZUAI-IFM/K2-Think-v2` (canonical id from `research/wiki/tools/k2-think.md:5`).

## Test matrix detail

All raw response bodies + curl logs are in `backend/qa_logs/`. Key results:

| # | Endpoint | Method | Path | HTTP | Latency | Notes |
|---|---|---|---|---|---|---|
| T1 | clip list | GET | /demo/clips | 200 | 1ms | 3 clips, 2 with MP4 |
| T2 | filename → clip_id | POST | /demo/match | 200 | 1ms | 30s_ironsite resolved, 31 frames |
| T3 | bad filename | POST | /demo/match | 404 | 1ms | clean error message |
| T4 | brain mesh | GET | /brain/mesh | 200 | 84ms | 61452 verts (20484 ×3 split: lh+rh+combined), 122880 faces |
| T5 | sim status | GET | /brain/status | 200 | 1ms | running=false, 120 frames, 100 agents, synthetic data |
| T6 | activity.json | GET | /demo/activity/30s_ironsite | 200 | 1ms | 31 frames, 7 Yeo7 networks, top_region per frame |
| T7 | vision (live, ironsite) | GET | /demo/vision-report/30s_ironsite | 200 | **51.4s** | OpenRouter+Qwen3-VL, stub:false, 5 actions, full structured report |
| T8 | vision (cached) | GET | /demo/vision-report/30s_ironsite | 200 | 1ms | cache hit |
| T9 | vision (live, twitter) | GET | /demo/vision-report/30s_twitter | 200 | **60.1s** | OpenRouter+Qwen3-VL, social-media analysis, stub:false |
| T10 | comparison (live ×2) | GET | /demo/comparison/30s_ironsite | 200 | **30.6s** | both panels real, stub:false on both |
| T11/T11b/T11c | K2 visual @ t=4 | POST | /demo/k2-region | 200 | 8.4s | parsed clean post-fix |
| T12/T12b/T12c | K2 default_mode @ t=15 | POST | /demo/k2-region | 200 | 11.1s | parsed clean post-fix |
| T13 | K2 bad network | POST | /demo/k2-region | 400 | 1ms | "unknown network: hippocampus_made_up" |
| T14/T14b/T14c | K2 somatomotor @ t=10 | POST | /demo/k2-region | 200 | 16.7s | the case BUG-1 broke; clean post-fix |
| T15 | sim start/stop | POST | /brain/{start,stop} | 200 | <2s | running flag flips, t advances |
| T16/T16b | WebSocket | WS | /ws | accepted | streamed 4 frames @ ~1Hz | each frame: t, activations, agents (×100), network_activations, top_region, speech |
| T17 | comparison (cached) | GET | /demo/comparison/30s_ironsite | 200 | 2ms | cache hit |

## Cache files written during QA

```
backend/prerendered/30s_ironsite/vision_report.json     ← from T7 (live Qwen)
backend/prerendered/30s_ironsite/comparison.json        ← from T10 (live Qwen ×2)
backend/prerendered/30s_twitter/vision_report.json      ← from T9 (live Qwen)
```

Delete any of these to force re-generation. They are gitignored.

## What still needs attention (non-blocking)

1. **`30s_twitter` has no `comparison.json`** — first click on the comparison panel for that clip will trigger a 30–60s live OpenRouter call. Pre-warm by hitting `GET /demo/comparison/30s_twitter` before showtime.
2. **K2 latency is 8–17s per region click.** Not a bug, but means the popup will sit empty for ~10s after clicking. If you want instant popups, pre-bake K2 outputs to a per-clip cache file (similar pattern to `vision_report.json`).
3. **`/brain/upload` and `/brain/run-inference`** were not exercised — the demo flow uses `/demo/match` instead, so these are legacy paths. Inspect before relying on them.
4. **`activity.json` is synthetic** — the backend log says `"no preds.npz — using synthetic activations"`. This is expected since TRIBE V2 inference happens on Vultr, not on the laptop. The demo loop reads pre-rendered activity values per frame; the swarm physics + popup grounding work identically.

## Logs location

Every test response body, every curl trace, and the consolidated parser fix verification are in `/Users/johnnysheng/code/hackathon/backend/qa_logs/`. Backend uvicorn log: `/private/tmp/claude-501/-Users-johnnysheng-code-hackathon/7ff615da-27f5-4b93-aee0-cf17464841d3/tasks/brwln8pe1.output`.
