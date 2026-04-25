# MiroFish Reference — Brain Swarm Visualization

Source repo: https://github.com/666ghj/MiroFish
Purpose: steal useful patterns for a Three.js brain visualization with swarm agents attracted to fMRI/EEG activity hotspots.

---

## What MiroFish Is

Multi-agent social simulation engine. Users upload seed documents → LLM extracts entities → agents get personas → agents simulate Twitter/Reddit interactions over N rounds → report is generated. The visualization is a D3 force-directed knowledge graph, **not** a spatial agent simulation.

**TL;DR for us**: It's a backend swarm orchestration system with a polling API and a D3 graph frontend. We steal the backend patterns; we replace the frontend entirely with Three.js.

---

## Parts Worth Stealing

### 1. Agent Profile Schema
Defined in `backend/app/services/oasis_profile_generator.py`.

Each agent carries:
```json
{
  "agent_id": 42,
  "username": "agent_042",
  "persona": "Detailed behavioral description — guides decision making",
  "age": 28,
  "gender": "female",
  "mbti": "INTJ",
  "profession": "neuroscientist",
  "interested_topics": ["memory", "attention", "hippocampus"],
  "karma": 150,
  "follower_count": 80
}
```
**Adapt for brain swarm**: swap `interested_topics` → `affinity_regions` (list of brain region names the agent is drawn to). Keep `persona` for LLM-driven agent commentary if you want narrative output alongside the visualization.

---

### 2. Per-Round Action Log Format
Defined in `backend/app/services/simulation_runner.py`. JSONL file, one entry per agent action per round.

```json
{"round_num": 5, "timestamp": "2024-01-01T00:00:05Z", "agent_id": 42,
 "agent_name": "agent_042", "action_type": "MOVE_TO_REGION",
 "action_args": {"target_region": "prefrontal_cortex", "activation": 0.87},
 "result": {"position": [12.3, 44.1, -8.7]}, "success": true}
```
**Adapt**: rename `action_type` values to spatial actions: `MOVE_TO_HOTSPOT`, `IDLE`, `DISPERSE`, `CLUSTER`. Extend `result` with `position: [x,y,z]` and `velocity: [vx,vy,vz]` in MNI or normalized brain-space coordinates.

---

### 3. SimulationState Pattern
Defined in `backend/app/services/simulation_manager.py`.

```python
@dataclass
class SimulationState:
    simulation_id: str
    status: SimulationStatus  # Enum: created|preparing|running|completed|failed
    current_round: int
    entities_count: int
    created_at: str
    updated_at: str

    def to_dict(self) -> dict: ...       # full internal state
    def to_simple_dict(self) -> dict: ...  # stripped API response
```
**Steal directly** — clean enum-driven state machine is exactly what you need for `idle → loading_brain → spawning → running → paused → completed`.

---

### 4. TaskManager (Background Async Progress)
Defined in `backend/app/models/task.py`.

Singleton, thread-safe, UUID-keyed tasks with `progress` (0–100), `progress_detail` dict, and auto-cleanup of old tasks. Used for long-running async jobs (profile generation, graph building).

**Adapt for brain loading**: Use this pattern for loading NIfTI brain meshes, computing activation maps, and generating agent personas — all happen async on startup before visualization begins.

```python
task = task_manager.create_task("brain_init")
task_manager.update_task(task_id, progress=30, message="Parsing NIfTI volume...")
```

---

### 5. Polling API Shape
Defined in `backend/app/api/simulation.py`.

The endpoints we care about (adapt the names):

| MiroFish endpoint | Our equivalent |
|---|---|
| `GET /<sim_id>/run-status` | `GET /brain/status` — current round, active hotspots |
| `GET /<sim_id>/agent-stats` | `GET /brain/agent-stats` — per-agent position + state |
| `GET /<sim_id>/timeline` | `GET /brain/timeline` — rounds summary + activation history |
| `POST /start` | `POST /brain/start` |
| `POST /stop` | `POST /brain/stop` |

**Upgrade**: replace polling with WebSocket for smooth real-time particle updates at 30–60 fps. MiroFish polls every ~1s; particles need sub-100ms updates.

---

### 6. D3 Force Simulation Concepts → Three.js Equivalents
Defined in `frontend/src/components/GraphPanel.vue`.

MiroFish uses D3 for 2D graph layout. We replace this entirely with Three.js but the physics concepts translate:

| D3 concept | Three.js / boids equivalent |
|---|---|
| `charge force: -400` (repulsion) | Separation force between agents |
| `link force: baseDistance + edgeCount*50` | Cohesion radius around brain region |
| `collision force: 50px radius` | Minimum separation between particles |
| `gravity: 0.04 toward center` | Attraction force toward activation hotspot |
| `alphaTarget(0.3).restart()` | Increase simulation energy on new brain event |

---

## What NOT to Take

- **Zep Cloud memory** — graph memory system for agent conversations, irrelevant
- **Twitter/Reddit OASIS framework** — entire social platform simulation layer
- **Graph building from documents** — NLP pipeline for extracting entities from text
- **Report generation agent** — LLM post-processing, not needed for visualization
- **File-based IPC** (`ipc_commands/` / `ipc_responses/`) — too slow; use WebSocket
- **Multi-platform dual simulation** — Twitter + Reddit parallelism pattern

---

## Proposed Architecture for Brain Swarm Visualizer

```
┌─────────────────────────────────────────────┐
│  Frontend (Three.js + Vue 3 + Vite)         │
│  - fsaverage5 brain mesh (GIfTI → Buffer-   │
│    Geometry, left + right hemispheres)       │
│  - Vertex color shader driven by activation  │
│  - InstancedMesh: ~85 wanderer particles    │
│  - Larger meshes: ~15 region agents         │
│  - Region highlight glow on high density    │
│  - Agent trail LineSegments                 │
│  - Region agent speech bubbles (LLM text)   │
│  - WebSocket client for live updates        │
└──────────────────┬──────────────────────────┘
                   │ WebSocket
                   │  frame: { activations[20K], agents[{id,pos,vel,state}],
                   │           region_speech: [{region, text}] }
┌──────────────────▼──────────────────────────┐
│  Backend (Python FastAPI)                   │
│                                             │
│  TRIBE V2 pre-processing (run once):        │
│    video.mp4 → model.predict() →            │
│    preds (T × 20K) saved as .npy            │
│                                             │
│  Simulation loop (1 Hz tick, interpolated): │
│    load preds[t] → compute hotspot list     │
│    wanderer boids: separate/align/cohere    │
│      + attract to hotspot centroids         │
│    region agents: check own-parcel mean     │
│      activation → if spike → queue LLM call │
│    broadcast frame over WebSocket           │
│                                             │
│  LLM commentary (K2 Think V2, async):       │
│    region_name + activation_level → K2 →   │
│    short narration text → push to frontend  │
│                                             │
│  REST: /upload /start /stop /status         │
│  TaskManager for TRIBE V2 preprocessing     │
│  SimulationState lifecycle                  │
└─────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  TRIBE V2 (offline / pre-run)               │
│  Input: video.mp4 (+ auto audio + text)     │
│  Output: preds.npy (T × ~20K floats)        │
│  Mesh: fsaverage5 GIfTI (nilearn)           │
│  Parcellation: Schaefer-100 (nilearn)       │
└─────────────────────────────────────────────┘
```

---

## TRIBE V2 Output Format (Authoritative)

Source: `research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md`

```python
preds, segments = model.predict(events=df)
preds.shape  # (n_timesteps, n_vertices) — e.g. (120, ~20000)
# n_timesteps = video duration in seconds (1 Hz = 1 prediction/second)
# n_vertices  ≈ 20,000 on fsaverage5 cortical surface mesh
# values      = predicted BOLD signal per vertex, offset 5s for HRF lag
```

**What this means for the visualization:**
- The brain mesh IS the `fsaverage5` surface — TRIBE V2's `PlotBrain(mesh="fsaverage5")` and nibabel/nilearn both expose this mesh as vertices + faces
- Each second, we get 20K scalar activation values — drive vertex colors + agent attraction from these directly
- Pre-process the video first (TRIBE V2 is not truly real-time) → store activation tensor → then play back at 1 fps with interpolation in Three.js

**Synthetic fallback**
If TRIBE V2 is unavailable at demo time: generate per-region sinusoidal waves with noise, sampled at fsaverage5 parcellation centroids. Drop-in compatible.

## Brain Mesh Source

Use the `fsaverage5` mesh that ships with the TribeV2/nilearn package:
```python
from nilearn import datasets
fsaverage = datasets.fetch_surf_fsaverage('fsaverage5')
# gives: pial_left, pial_right (GIfTI files) → load into Three.js via BufferGeometry
```
~10K vertices per hemisphere = ~20K total. Performant in Three.js with `InstancedMesh` for agents.

---

## Agent Swarm Behavior Design

Each agent has:
- `position: Vector3` — in normalized brain space (−1 to 1)
- `velocity: Vector3`
- `affinity_regions: string[]` — which brain regions it's most drawn to
- `state: 'seeking' | 'clustering' | 'idle'`

Per-tick update:
1. Find top-N activation hotspots from brain activity map
2. Filter to agent's `affinity_regions` (or all regions if empty)
3. Compute attraction force toward nearest hotspot (inverse-square falloff)
4. Add boids separation force (avoid other agents within radius r)
5. Add cohesion force toward local cluster centroid
6. Clamp velocity, update position
7. Emit `{agent_id, position, velocity, state, target_region}` over WebSocket

---

## Key Files to Reference When Building

| What you're building | Reference in MiroFish |
|---|---|
| Agent data model | `backend/app/services/oasis_profile_generator.py` |
| Simulation lifecycle state | `backend/app/services/simulation_manager.py` |
| Per-round action JSONL | `backend/app/services/simulation_runner.py` |
| Async task tracking | `backend/app/models/task.py` |
| REST API structure | `backend/app/api/simulation.py` |
| Vue component structure | `frontend/src/views/SimulationRunView.vue` |
| Force physics concepts | `frontend/src/components/GraphPanel.vue` |

---

## Junsoo Pipeline (already built — `junsoo/` at repo root)

Junsoo's code handles the full TRIBE V2 → brain activation pipeline. Our visualization consumes its output.

**Pipeline:**
```
video.mp4  →  run_inference.py  →  preds.npz  (T × 20484 float32)
                                →  aggregate.py  →  activity.json
```

**activity.json format (what we consume):**
```json
{
  "frames": [
    {
      "t_s": 4,
      "top_region": "visual",
      "regions": { "visual": 0.62, "somatomotor": 0.05, "dorsal_attention": 0.31,
                   "ventral_attention": 0.12, "limbic": 0.04,
                   "frontoparietal": 0.18, "default_mode": -0.07 },
      "stimulus": "What brings you to the land of the gatekeepers?"
    }
  ]
}
```

**Key junsoo files:**
- `junsoo/atlas.py` — builds Yeo7 network labels projected onto fsaverage5 (20484 vertices → 7 network ints)
- `junsoo/papers/prompts/*.md` — full research-grounded system prompts for each of the 7 network agents + moderator
- `junsoo/smoke_test.py` — validates the pipeline with synthetic data (no GPU needed)

**Our backend imports junsoo's atlas.py** at runtime from `Path(__file__).parents[3] / "junsoo"`.
If that path fails (junsoo not merged), synthetic labels are used automatically.

---

## Confirmed Design Decisions (from conversation)

- **Brain data source**: TRIBE V2 (`github.com/facebookresearch/tribev2`) is the primary pipeline. Synthetic fallback if unavailable
- **Agent count**: ~100 total
- **Two agent tiers**:
  - **Region agents** (~10–15, larger): each "owns" a specific brain region (visual cortex, auditory cortex, prefrontal cortex, DMN, etc.). Anchored near their region, react visibly to activation. They **speak** — LLM commentary narrating what their region is experiencing
  - **Wanderer agents** (~85–90, smaller): purely visual, no LLM. Flock toward highest activation hotspots via boids
- **Interaction**: no click-to-spike. Regions get visually **highlighted** when many agents cluster there — highlight emerges from swarm density
- **Playback model**: TRIBE V2 pre-processes video → activation tensor (`T × 20K` floats) stored → Three.js plays back at ~1 fps with smooth interpolation between seconds
- **Video context**: analyzing egocentric footage (Ironside dataset) or general video

## Open Questions Still To Resolve

1. **Region agent territories**: which named brain regions map to which fsaverage5 vertex subsets? Best answer: use Schaefer-100 parcellation (ships with nilearn) — 100 parcels, 7 networks. Pick 10–15 to become named region agents
2. **What do region agents say?** (a) K2 Think V2 generates live commentary from activation value + region name; (b) pre-generated labels per threshold; (c) both — pre-cached for demo safety. Which?
3. **Wanderer target selection**: single highest-activation vertex, or probabilistic sampling from top-N hotspot centroids? Probabilistic feels more organic
4. **Three.js render style**: anatomically accurate pial surface (full sulci/gyri detail) or smoothed inflated projection? Pial is impressive; inflated is cleaner
5. **Agent trails**: do wanderers leave glowing trails (LineSegments history buffer) or appear as pure particles?
6. **Existing frontend scaffold**: is there a repo to build into, or starting from scratch?
