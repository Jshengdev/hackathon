# Future plan — swarm agent infrastructure

How we divide and collaborate on the K2 swarm that consumes TRIBE V2's per-network JSON. Reads on top of `papers/CONTEXT.md` (the why) and `caltech/context/architecture.md` (the wider stack).

## The swarm in three layers (mirroring Mirofish / Ironside 3-step)

```
                    ┌─────────────────────────────┐
                    │  Step A — fan-out (7 agents)│
                    │  one per Yeo network        │
                    │  parallel K2 calls          │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │  Step B — pattern detector  │
                    │  reads CONTEXT.md table     │
                    │  one K2 call                │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │  Step C — moderator         │
                    │  narrates + surfaces dissent│
                    │  one K2 call (5-frame buf)  │
                    └─────────────────────────────┘
```

Per frame: **9 K2 calls total**, 7 of them in parallel. At Cerebras's ~1,300 tok/s this is sub-second per frame — the demo feels live, which is the whole point of K2 being in the stack.

## Division of human labor (4 people)

3 technical + 1 non-technical (per `caltech/HANDOFF.md`). Cleanest split:

| Person | Lane | Owns | Output artifact |
|---|---|---|---|
| **Junsoo** | L2 — TRIBE pipeline | Vultr deploy, FastAPI wrapper, frames-out JSON | `POST /infer → activity.json` |
| **Tech B** | L4a — Swarm core | K2 client, parallel fan-out, 7 network persona prompts grounded in CONTEXT.md citations | `swarm_step_a(frame) → 7 network observations` |
| **Tech C** | L4b — Synthesis | Pattern detector (CONTEXT.md table), moderator with rolling 5-frame buffer, dissent log | `swarm_step_bc(observations, buffer) → narrative + flags` |
| **Non-tech** | L5/L6 — Story + demo | Stimulus curation, live streaming UI, pitch deck story arc, "freaky tech" reveal moment | the visible demo |

The split works because **each lane is independently runnable against a mock of its neighbor**. Tech B doesn't need real TRIBE output to write the visual-cortex prompt — they mock the JSON. Tech C doesn't need the agents to exist — they mock 7 stub responses.

## The collaboration spine — JSON contract

This is the single load-bearing artifact. Lock it on a shared doc before anyone writes prompts. Once locked, every lane runs in its own branch.

### Frame in (from `aggregate.py`, already shipping)
```json
{ "t_s": 4, "top_region": "visual",
  "regions": { "visual": 0.62, "default_mode": 0.18, "...": "..." },
  "stimulus": "What brings you to the land of the gatekeepers?" }
```

### NetworkAgent out (one per network, 7 in parallel)
```json
{ "network": "visual", "activation": 0.62, "rank_among_7": 1,
  "observation": "Bright scene onset — FFA territory firing on a face.",
  "confidence": 0.72,
  "flags": ["scene_change", "face_onset"],
  "citation": "Kanwisher 1997" }
```

### PatternDetector out (one call after fan-out)
```json
{ "patterns": ["external_focus"],
  "contradictions": [],
  "dmn_dan_balance": -0.4,
  "event_boundary": false }
```

### Moderator out (the demo-visible narration)
```json
{ "t_s": 4,
  "narrative": "Subject is looking at a face — visual cortex peaked, attention locked on, no surprise signal. Passive viewing.",
  "confidence": 0.65,
  "dissent": ["VAN flat despite scene change — possible TRIBE miss"],
  "engaged_systems": ["visual", "dorsal_attention"] }
```

## Three sharp design calls

1. **Each agent sees all 7 activations + stimulus, but its system prompt forces it to speak only from its network's voice.** Otherwise the visual agent can't say "I'm spiking but DMN is too — looks like recall, not perception" — which is the *interesting* output. The persona discipline lives in the prompt, not in input filtering.

2. **Stateless agents, stateful moderator.** Agents are pure `frame → observation`; trivial to parallelize, easy to debug. Moderator holds a rolling 5-frame buffer (5 seconds of brain time) so narrative arcs make sense without making the rest of the swarm stateful.

3. **Stick with Yeo 7, not Yeo 17.** 17 is finer but the demo readability dies — "default_a vs default_b" means nothing to a judge. 7 is the literature-anchored unit (Yeo et al. 2011). `aggregate.py --atlas yeo17` already exists if we change our mind.

## Build order

1. **FastAPI wrapper for TRIBE** (Junsoo) — gives the swarm a stable URL.
2. **`swarm_contract.md`** — the schemas above, in the repo, so all 4 people work to it.
3. **`swarm_orchestrator.py` skeleton** — async fan-out scaffold with mock K2 calls. Tech B and Tech C swap in real prompts / calls without touching the orchestrator.
4. **Reference prompt for ONE agent (visual) + ONE moderator** — concrete examples grounded in CONTEXT.md citations, so Tech B and C have a template to copy for the other 6.

Items 3 and 4 are useful even before Vultr is up because they run against synthetic frames — same trick we used for the aggregator smoke test.
