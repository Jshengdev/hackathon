---
file-type: project
status: verified
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/006-tribe-v2-as-special-mode.md
  - ../decisions/008-k2-think-as-speed-engine.md
cites-sources:
  - ../scrapes/treehacks-2026-winners.md
  - https://devpost.com/software/4sight-neoslb
  - https://github.com/kl527/4sight
cross-links:
  - ../patterns/spatial-sidecar.md
  - ../patterns/per-item-parallel-llm-evaluation.md
  - mira.md
  - jarvis.md
---

# 4sight

> **Lookalike-risk teardown:** Cleanest 2026 reference for stitching consumer wearable biometrics + egocentric VLM + Cloudflare-edge agent loop into one fear-driven nudging product. Reads like Tribe-V2's "ambient signal → intervention" with a Bangle.js watch instead of EEG and iMessage instead of an avatar. Any "wearable + agent + nudge" angle for HackTech 2026 will pattern-match against this immediately.

- **Hackathon / event:** TreeHacks 2026 (Stanford, Feb 13–15)
- **Prize won:** **Cloudflare Best Use ($250K credits)** — scrape row 53
- **Sponsor tracks:** Cloudflare (Workers + Containers + D1), Modal, OpenAI, Poke, Meta Wearables
- **Devpost / repo:** https://devpost.com/software/4sight-neoslb · https://github.com/kl527/4sight
- **Local clone:** `/Users/johnnysheng/code/hackathon/research/sources/repos/4sight/`

## Pitch (one sentence)

A "Duolingo-guilt-trip-for-your-lifespan" agent: Bangle.js PPG/accel + Ray-Ban first-person video → on-device XGBoost risk + Modal Gemma 3 4B captions → a Cloudflare cron fires fear-driven iMessage nudges via Poke every 60s ("that burrito just cost you 45 minutes").

## What's actually in the repo (verified vs claimed)

- ✅ **Bangle.js 2 biometrics** (`firmware/4sight.js:1-957`) — Espruino PPG @ 25Hz + accel @ 12.5Hz, 1-min binary windows (54B PPG / 154B accel Q13), BLE NUS chunked X10-framed JSON with watchdog/ack/backoff.
- ✅ **Ray-Bans CV** (`backend/app/routers/vision.py:36-125`) — `WebSocket /vision/stream`, 1s chunk buffers.
- ✅ **Gemma 3 4B via Modal** (`backend/modal/gemma3_vlm_app.py:11-275`) — `Gemma3VLMSession` on L40S, `min_containers: 1`, FA2, 6 frames/chunk, 64 max-new-tokens, *stateful 6-caption rolling history* in every prompt.
- ✅ **CF Containers + D1 + Workers + cron** (`backend/worker/wrangler.jsonc:1-43`) — Container = DO hosting FastAPI; D1 `foresight-biometrics`; cron `* * * * *`.
- ✅ **XGBoost risk model** — trained in `biometric_model/risk.py`; runs *on-device in React Native* via pure-TS tree walker (`4sight/features/risk-prediction/xgboost-engine.ts:1-40`).
- ✅ **Poke iMessage** (`backend/worker/src/index.ts:330-354`) — POST `poke.com/api/v1/inbound-sms/webhook`, only on `decision === "yes"`.
- ⚠️ **"Agent" on gpt-4o-mini** (`worker/src/index.ts:268-300`) — actually a *cron* calling once/min with JSON-schema `{decision, reasoning, nudge}`. Not a long-lived agent.
- ❌ **Screen Time API, HeyGen avatar** — not in repo. Pitch-only; Wizard-of-Oz suspected.

## The unique sauce

1. **The "agent loop" is a 1-minute Worker cron, not an agent** (`worker/src/index.ts:212-223`). No Claude Agent SDK, no while-true loop. Just `* * * * *` batching last-60s rows and asking gpt-4o-mini *one* structured-output question. Whole "agent" = 150 lines of TS.
2. **Two-tier inference: on-device XGBoost for risk, cloud VLM for context.** PPG/accel → HRV in RN, scored locally by pure-TS XGBoost. Only output JSON ships to edge. Ray-Ban frames stream to a stateful Modal Gemma session. The two streams meet in D1 — *never* in a single model.
3. **Worker-as-fan-in: WebSocket relay that *intercepts* container outputs** (`worker/src/index.ts:115-189`). Stands up a `WebSocketPair`, forwards client↔container traffic, and on every container→client message JSON-parses and fires an out-of-band D1 insert if `caption` is present. Container stays 100% stateless.
4. **`INSERT OR IGNORE` on `window_id` + bullet-injected prior captions.** Migrations use `UNIQUE(window_id)` — BLE-drop replays silently dedup. `gemma3_vlm_app.py:176-182` injects the last 6 captions as "Recent prior observations" into every prompt — temporal coherence without a memory store.

## Implementation needles

### Data flow: device → edge → VLM → user

```
[Bangle.js 2]    PPG 25Hz + accel 12.5Hz → 1-min binary windows
                 → BLE NUS chunked X10 JSON → phone (firmware/4sight.js:396-635)
[Phone Expo/RN]  feature-extraction → HRV → on-device XGBoost (TS tree walker)
                 → POST {features,riskPrediction} → Worker /biometrics/upload
[Ray-Bans]       WebSocket /vision/stream → Worker → Container
[Worker]         /biometrics/upload, /captions/upload → INSERT OR IGNORE D1
                 /vision/stream → relay to Container; intercept caption acks → D1
                 Container = DO, FastAPI, sleepAfter=5m
[Container]      vision.py buffers 1s chunks → inference_session.infer_chunk(...)
[Modal L40S]     Gemma3VLMSession (warm) → {caption, latency_ms, tokens}
[Cron * * * * *] SELECT last-1-min biometric+caption rows
                 → gpt-4o-mini JSON schema {decision, reasoning, nudge}
                 → if yes: Poke webhook → iMessage; INSERT INTO interventions
```

### How the wearable biometric stream wires into the VLM (Socratic finding)

**It doesn't.** The two streams never meet inside any model — only at the cron-scheduled D1 join, where gpt-4o-mini reads both as JSON rows in a single user message (`worker/src/index.ts:263-266`). The "multimodal" claim is **late-fusion-via-text-LLM-prompt over a SQL window**, not joint embedding. Profoundly cheaper than feeding PPG into a VLM. Reusable insight: when two modalities share a 1-min decision cadence, fuse them in a text-LLM prompt over a SQL window, not in a model.

### How Cloudflare Containers + D1 earn their keep

Worker handles auth + WS proxy + D1 + cron (replaces gateway + scheduler + caption sidecar). Container (DO, `sleepAfter=5m`) keeps FastAPI warm for stateful WS (replaces cold-start-per-session). D1 gives `INSERT OR IGNORE` idempotency + cron joins (replaces Redis/Postgres + migrations + auth). The $250K Cloudflare credits *exactly* subsidize Container DO + D1 + cron — unusually expensive at hackathon scale; the architecture *requires* Cloudflare to be free for the demo math to work.

## Capability stack

Bangle.js 2 (Espruino, BLE NUS) → Expo/RN with on-device pure-TS XGBoost → Meta Ray-Bans frames over WebSocket → Cloudflare Worker + Durable Object Container + D1 + cron → Modal Gemma 3 4B IT on L40S (transformers 4.52.4, FA2) → OpenAI gpt-4o-mini (JSON-schema) → Poke webhook → iMessage.

## Why it won (Cloudflare Best Use)

Showcases Containers + D1 + Worker cron in one product — every primitive earns its keep. Multi-device demo theatre (watch + glasses + phone + delivered iMessage) beats single-laptop. Audit trail (`interventions` with `poke_message`, `poke_sent_at`, `biometric_ids`, `caption_ids`) — every nudge traceable to source rows.

## Lookalike-risk for our HackTech 2026 entry

**HIGH risk** if we propose: wearable biometrics + VLM + AI nudge (= doing 4sight again); "lifespan ticker" / "guilt-trip your behavior" framing; Cloudflare Containers + D1 cron + Modal Gemma stack.

**LOW risk** as a pattern library for a different vertical: late-fusion-via-LLM-prompt over a SQL window; watch + phone-as-feature-extractor + on-device tree + cloud VLM (clinical, athletic, factory, OR); Worker-as-WebSocket-sidecar that intercepts container outputs to persist to D1.

## What this project's existence forecloses

- Wearable-biometric → AI-nudge demos are now table-stakes; we'd need a different vertical (clinical arrhythmia, athletic VO2max, post-op compliance) or a federated angle (cross-user pattern detection, à la Jarvis's expansion).
- Cloudflare Containers + D1 cron + Modal Gemma is now the obvious "I'd like the credits, please" stack — unmodified it reads as derivative.
- gpt-4o-mini as cron-driven decision brain is a known move; K2 Think (per `008-k2-think-as-speed-engine.md`) gives us cited reasoning traces — the audit-grade differentiator 4sight's `interventions.reasoning` field gestures at but can't deliver.

## What's still open

The "agent loop" is a cron — no long-horizon planning, no tool use, no memory beyond the 1-min SQL window + Modal's 6-caption ring. A Dedalus / Claude Agent SDK version would beat it on autonomy claims; our opening to "out-agent" them. HeyGen + Screen Time are pitch-only; likely Wizard-of-Oz in the demo video.

## Cross-links

- Patterns: [`spatial-sidecar.md`](../patterns/spatial-sidecar.md) (risk-features JSON = structured-evidence trick over PPG); [`per-item-parallel-llm-evaluation.md`](../patterns/per-item-parallel-llm-evaluation.md) (the cron is the inverse — single call over batched items).
- Decisions: [`006-tribe-v2-as-special-mode.md`](../decisions/006-tribe-v2-as-special-mode.md) (4sight = Tribe-V2's loop with a watch instead of EEG); [`008-k2-think-as-speed-engine.md`](../decisions/008-k2-think-as-speed-engine.md) (K2 Think replaces gpt-4o-mini at the decision step).
- Siblings: [`mira.md`](mira.md) (same Ray-Ban hardware, opposite VLM strategy); [`jarvis.md`](jarvis.md) (grounded-citation audit trail ≈ 4sight's `interventions` table).
