# Swarm contract — locked JSON schemas between lanes

Per `future_plan.md`: each of the 4 lanes (TRIBE pipeline, swarm core, synthesis, story+demo) must work against a **mock of its neighbor**. This file is the source of truth for what those mocks look like.

## Lane diagram (recap)

```
[junsoo/ TRIBE pipeline]  ─────►  activity.json frame  ─────► [orchestrator agents]  ─────► observation  ─────► [moderator]  ─────► narration
       (Lane L2)                       (contract A)                  (Lane L4a)            (contract B)         (Lane L4b)         (contract C)
                                                                                                                                     │
                                                                                                                                     ▼
                                                                                                                              [frontend speech panel]
                                                                                                                                   (Lane L5/L6)
```

Lock these four contracts; rebuild any lane behind them.

---

## Contract A — Frame in (TRIBE → orchestrator)

Source: `junsoo/aggregate.py` writes the JSON; `_bmad/brain-swarm/backend/services/activity_reader.py` reads + normalizes it.

**Per-frame shape consumed by `Orchestrator.run_frame(network_frame, t, queue)`:**

```json
{
  "t_s": 4,
  "top_region": "visual",
  "regions": {
    "visual":            0.62,
    "somatomotor":       0.05,
    "dorsal_attention":  0.31,
    "ventral_attention": 0.12,
    "limbic":            0.04,
    "frontoparietal":    0.18,
    "default_mode":     -0.07
  },
  "stimulus": "What brings you to the land of the gatekeepers?"
}
```

Rules:
- `regions` keys are exactly the seven Yeo7 names (snake_case as above).
- `regions` values are floats. **Pre-normalization they may be negative or > 1**; ActivityReader applies per-network min-max to push them to `[0,1]` before the orchestrator sees them.
- `top_region` is recomputed against normalized values (so it tracks the highest *normalized* activation, not the raw mean).
- `stimulus` is optional. If present, it's the transcript word/sentence at this timestep (when TRIBE's `segments` carry text). The orchestrator passes it through to every K2 prompt so agents reason about *what the subject is hearing/seeing*, not just numbers.
- `t_s` is integer seconds from stimulus start (TRIBE returns 1 Hz, already HRF-corrected by 5 s).

**Mock for downstream lanes** (paste into a fixture):
```python
SAMPLE_FRAME = {
    "t_s": 4, "top_region": "visual",
    "regions": {"visual": 0.92, "somatomotor": 0.10, "dorsal_attention": 0.71,
                "ventral_attention": 0.18, "limbic": 0.05,
                "frontoparietal": 0.34, "default_mode": 0.08},
    "stimulus": "She turned and saw him at the door.",
}
```

---

## Contract B — Per-network observation (one agent → moderator)

Source: `_bmad/brain-swarm/backend/services/orchestrator.py:run_frame` produces a string from each fired network's K2 call.

**Internal shape** (passed inside Python, not over the wire):
```python
observations: dict[str, str]
# e.g.
{
    "visual":           "Bright onset — face territory firing on what looks like a person at the door.",
    "ventral_attention": "Sudden change just landed — something unexpected entered the scene.",
}
```

**Moderator user message format** (what the K2 moderator call sees):
```
Network observations at t=4s:
visual: <observation text>
ventral_attention: <observation text>
All activations: visual=0.92, somatomotor=0.10, ...
Current stimulus: "She turned and saw him at the door."
```

Rules:
- Keys are Yeo7 names that fired this tick (1–3 per frame, capped by `SWARM_MAX_PARALLEL`).
- Values are short LLM observations (≤ 140 K2 tokens; one to two sentences).
- A network only fires on the **rising edge** — when it newly crosses `SWARM_SPIKE_THRESHOLD` (default 0.60). Sustained-high stretches don't re-fire.

---

## Contract C — Speech queue messages (orchestrator → frontend)

Source: `_bmad/brain-swarm/backend/services/orchestrator.py:run_frame` puts messages on `speech_queue`; `main.py:simulation_loop` drains it into the per-tick WS broadcast.

**Per-message shape on the queue (and inside WS `speech[]`):**
```json
{ "network": "visual", "text": "...", "confidence": "...",
  "cite": "[Allen et al. 2022, Nature Neuroscience]", "t": 4, "type": "region" }
{ "network": "moderator", "text": "...", "t": 4, "type": "moderator" }
```

Rules:
- `type` is `"region"` for per-network voices, `"moderator"` for synthesis. Frontend uses this to style differently.
- `network` for moderator messages is the literal string `"moderator"` (frontend key for color lookup).
- `t` is the tick that produced the message; *not* the wall-clock time the WS pushed it (K2 latency may push delivery later than `t`).
- **Region messages include `cite` and `confidence`** — the orchestrator parses K2's 3-line output (Reading / Confidence + caveats / Cite) from each `junsoo/papers/prompts/<network>.md`. `text` is the Reading line only; `confidence` and `cite` are split out so the frontend can render the paper reference (e.g. `[Allen et al. 2022, Nature Neuroscience]`) next to the narration. Both fall back to empty strings if K2's output deviates from the 3-line format.
- Moderator messages do **not** carry `cite`/`confidence` — its prompt is freeform.

---

## Contract D — Per-tick WebSocket frame (backend → frontend)

Source: `_bmad/brain-swarm/backend/main.py:simulation_loop` calls `broadcast(...)` at 1 Hz.

**Shape** (one JSON per tick on `ws://localhost:8000/ws`):
```json
{
  "t": 4,
  "activations": [/* 20484 floats in [0,1] */],
  "agents": [
    { "id": 0, "type": "region",   "pos": [12.3, 44.1, -8.7], "network": "visual",  "active": true  },
    { "id": 7, "type": "wanderer", "pos": [3.1, -22.0, 17.5], "network": "",        "active": false },
    ...
  ],
  "network_activations": { "visual": 0.62, "somatomotor": 0.05, ... },
  "top_region": "visual",
  "speech": [ /* 0..N messages from the speech_queue this tick */ ]
}
```

Rules:
- `activations` length is always `brain_mesh.n_vertices` (20484 real, ~4800 mock UV-sphere).
- `agents` is one entry per region agent (7) + wanderer (`N_WANDERERS=93`) — total 100.
- `pos` is 3D in mm, in fsaverage5-inflated coordinate space (right hemi offset +10 mm in X to prevent overlap).
- `speech` may be empty most ticks (only fires when networks cross the spike threshold).

---

## How to mock each lane

**If you're building L4a (swarm core)** — mock Contract A:
```python
import json
fake_frames = json.load(open("junsoo/papers/sample_activity.json"))["frames"]
for t, frame in enumerate(fake_frames):
    await orchestrator.run_frame(frame, t, queue)
```

**If you're building L4b (synthesis / moderator)** — mock Contract B:
```python
fake_obs = {
    "visual": "Bright scene onset.",
    "ventral_attention": "Something just changed.",
}
moderator_text = await k2.chat(MODERATOR_PROMPT, build_user_msg(fake_obs, regions, t, stimulus))
```

**If you're building L5/L6 (frontend)** — mock Contract D:
Use `_bmad/brain-swarm/backend/services/activity_reader.py:_generate_synthetic` (already drives the WS when no real data exists). The frontend doesn't need TRIBE or K2 to run; it just needs the WS payload shape above.

---

## When to update this file

When you change any of the four contracts above. Bumping `SWARM_SPIKE_THRESHOLD` is fine without a contract update; changing the *shape* of `regions` (e.g. switching to Yeo17 → 17 keys) is not. The latter requires:
1. Updating Contract A here
2. Updating `junsoo/papers/prompts/` to add the missing networks
3. Updating `BrainMesh.YEO7_NAMES` in `services/brain_mesh.py`
4. Updating `NETWORK_COLORS` in `frontend/src/components/BrainScene.vue`
