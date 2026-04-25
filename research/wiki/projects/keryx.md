---
file-type: project
status: partial
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/006-tribe-v2-as-special-mode.md
  - ../decisions/009-ironside-pipeline-mirror.md
cites-sources:
  - ../scrapes/treehacks-2026-winners.md
  - https://devpost.com/software/keryx-k49dta
  - https://github.com/WubbLord/treehacks-26
cross-links:
  - ../patterns/spatial-sidecar.md
  - ../patterns/localize-and-zoom.md
  - ../patterns/grounded-citation.md
  - ../patterns/robust-json-from-llms.md
  - ../decisions/006-tribe-v2-as-special-mode.md
  - ../decisions/009-ironside-pipeline-mirror.md
  - mira.md
  - 4sight.md
---

# Keryx

> **Lookalike-risk teardown:** Same architectural family as Mira (VLM-grounded spatial memory built once, queried later by an agent), but Keryx replaces the SfM point cloud with a **pose-indexed photo database** and replaces the multi-view raycast with a **VLM-as-navigator policy loop**. The world model is *flatter* and *cheaper* than Mira's — and the unique sauce is that the "world" the VLM operates on is an interpolated keyframe lookup, not a renderable 3D scene.

- **Hackathon / event:** TreeHacks 2026 (Stanford, Feb 13–15)
- **Year / date:** 2026
- **Prize won:** **Human Capital Fellowship ($50K/person)** [scrape row 39]
- **Sponsor tracks involved:** Modal (vLLM + GPUs), Poke (MCP)
- **Devpost / press / video / repo:** https://devpost.com/software/keryx-k49dta · repo: https://github.com/WubbLord/treehacks-26
- **Local clone:** `../../sources/repos/keryx/`

## Pitch (one sentence)

Drone flies a building, BASALT VIO + Apple Depth Pro turn the footage into a pose-indexed frame database, then parallel Qwen3-VL-30B agents on Modal H200s "navigate" that frozen world by emitting JSON move/found actions until one of them sees the queried object — and a Poke/MCP tool exposes the whole thing as `explore_building(query)`.

## What's actually in the repo (verified vs. claimed)

The most interesting **claim-vs-verified gap** is that the deployed REST surface (`/sessions` POST + `/sessions/:id/stream` GET) referenced by both the frontend and the MCP **does not exist in the repo** — only the legacy single-POST SSE endpoint does.

| Devpost / scrape claim | Reality |
|---|---|
| Drones map buildings in minutes → AI-operable world model | ⚠️ Drone capture is real (BASALT VIO ships in `data/run_full_pipeline.py:228-381`: calibration → cam0/cam1 mirror → `basalt_vio` → `trajectory_postprocessed.csv`). The "world model" served to the VLM is a `(t, x, y, z, yaw, jpeg)` table — not a navigable 3D scene. |
| Apple Depth Pro for novel-view synthesis | ⚠️ Real but **not wired into the agent loop.** `ml-depth-pro/view_transform_modal.py:150-250` runs Depth Pro on Modal H200, builds intrinsics (`build_K` line 60), reprojects via depth+rotation+translation, inpaints holes (`reproject_novel_view` line 80). Standalone Modal function. The agents (`agents/agents.py:230-238`) only ever fetch the **closest pre-extracted JPEG** from `GetImage.getImageRemote`. Depth Pro is a parallel branch that didn't reach the demo path. |
| Qwen3-VL navigable world model | ✅ `agents/agents.py:22-29` registers Qwen3-VL-30B-A3B-Thinking-FP8 (default) and 2B fallback. vLLM serves on H200 (`AgentRunner.setup:162-172`). 15-step JSON-action loop (`MAX_STEPS = 15`, line 31). |
| Modal vLLM endpoints make it deployable | ✅ `agents/agents.py:67-78` builds image with `vllm>=0.11.0`, pre-downloads FP8 checkpoint into a Modal Volume (`download_model:56`), boots vLLM with `enable_prefix_caching=True, max_model_len=16384, dtype="half"` (lines 165-171). |
| FastAPI streaming endpoint with SSE | ✅ `agents/agents.py:675-823` — `stream_agents` is `@modal.fastapi_endpoint(method="POST")` returning `StreamingResponse(media_type="text/event-stream")` with CORS preflight. |
| Poke + MCP integration | ✅ `poke-mcp/server.py:18-147` — `FastMCP("Keryx")` exposes one tool, `explore_building(query, num_agents)`, that POSTs `/sessions`, consumes SSE, forwards events into MCP `ctx.info` / `ctx.report_progress`. |
| OpenCV, PyTorch in the stack | ✅ Both in `view_transform_modal.py:17,22`. The **agent path** uses neither — pure vLLM + Pillow downscale. |
| Assistive agents navigate to food/elevator | ✅ System prompt (`agents/agents.py:84-143`) frames the agent as "building-exploration"; `main()` example: `"find the nearest bathroom"` (line 833). |
| `/sessions` REST split (used by frontend + MCP) | ❌ **Not in the repo.** `poke-mcp/server.py:38` posts to `https://zhangbrwubb--keryx-agents-api.modal.run/sessions`; `frontend/src/api/agentStream.ts:121,152` calls the same prefix. The repo only ships the legacy single-POST `stream_agents` (`agents/agents.py:677`). Session-id router exists only in deployment. |
| Drone "in minutes" | ❓ Unverifiable from repo. Latency depends on video length × BASALT VIO speed, not advertised in code. |

**Net:** agent loop, vLLM Modal deploy, BASALT VIO pipeline, and MCP tool are real and wired. Apple Depth Pro is real but disconnected. The session-API the demo actually used isn't checked in.

## The unique sauce (what made it stand out)

1. **World model = sorted-list lookup, not a renderer.** `GetImage` (`agents/app.py:141-201`) loads trajectory + gyro + JPEGs into one `self.db: list[dict]`; `_find_best` (line 187) linear-scans scoring `pos_dist + 0.05 * ang_dist`. No scene graph, no point cloud, no NeRF, no splat. The drone footage *is* the world model. Price: you can only "go" where the drone went.
2. **Pose-conditioned navigation affordances.** `_check_allowed` (`agents/app.py:203-243`) searches the frame DB within 0.15m + yaw ±45° to return a `{forward, backward, left, right, turnLeft, turnRight}` bitmask. Injected into every prompt (`agents/agents.py:268-272`) — continuous SLAM reduced to a discrete graph the VLM can reason over.
3. **Two-tier "found" validation.** System prompt (`agents/agents.py:128-140`) requires `confidence` + `evidence: [≥2 items]`. `_validate_found_action` (line 615-634) hard-rejects `found` missing `confidence == "high"` or <2 evidence strings; agent rotates 20° on rejection (line 296-305). Structural defense against VLM over-confidence — closer to **witnessed dissent** than "trust the model."
4. **Trajectory-as-summary memory.** Each step appends a one-line history string (`agents/agents.py:317-320`); next prompt re-uses single-image structure but appends trajectory text into the system prompt (line 248-254). Keeps per-call context to one image while preserving narrative memory.
5. **Parallel-search-with-cancellation.** `stream_agents` (`agents/agents.py:686-797`) spawns N agents with different yaw offsets (line 693: second agent faces backward). First validated `found` flips a shared `modal.Dict` cancel flag (line 51, set line 772) that all others poll on each step (line 218-224).
6. **MCP as the assistive surface.** `poke-mcp/server.py:21-32` makes the 30B-VLM-on-H200 swarm look like one function call: `explore_building("where is the nearest bathroom")`. SSE step events become MCP `ctx.info` / `ctx.report_progress` (line 88-127). **Cleanest "VLM-spatial-search-as-MCP-tool" reference in the wiki.**

## Implementation needles (actual code patterns)

### 1. How the VLM is wired into the "3D world model" (`agents/agents.py:230-275`)

```python
# inside AgentRunner.send_agent, per step
result = self.get_image_cls().getImageRemote.remote(x, y, z, yaw)   # Modal-to-Modal
img_b64 = base64.b64encode(result["image"]).decode("ascii")
allowed = result["allowed"]                                          # nav affordances bitmask

messages = [
    {"role": "system", "content": [{"type": "text", "text": sys_text}]},
    {"role": "user", "content": [
        {"type": "image_url",
         "image_url": {"url": f"data:image/png;base64,{img_b64}"}},
        {"type": "text",
         "text": f"Position: ({result['x']:.2f}, {result['y']:.2f}, {result['z']:.2f}), "
                 f"yaw={yaw:.1f}. Step {step}/{MAX_STEPS}. Allowed: {json.dumps(allowed)}"},
    ]},
]
outputs = self.llm.chat(messages, sampling_params=sampling)
```

**The wire:** the VLM never *sees* a 3D world. It sees one JPEG plus a string of legal directions. The "3D world model" is whatever `_find_best` (a linear scan over a Python list, `agents/app.py:187-201`) chose to render this turn. The only 3D in the loop is the (x, y, z, yaw) tuple in the prompt text.

### 2. How downstream agents query the world model

`GetImage` exposes two entry points: `getImage` (public HTTPS via `@modal.fastapi_endpoint()`, `app.py:245`) returns base64 JPEG; `getImageRemote` (`@modal.method()`, `app.py:275`) returns raw bytes for in-cluster Modal callers. The agent uses `getImageRemote` (`agents/agents.py:230-231`); the frontend's manual mode uses `getImage`. The **MCP tool doesn't query the world model directly** — it queries the agent stream, which queries the world model on the LLM's behalf:

```python
# poke-mcp/server.py:37-49
resp = await client.post(f"{AGENT_API_URL}/sessions",
    json={"query": query, "num_agents": num_agents,
          "start_x": 0.0, "start_y": 0.0, "start_z": 0.0, "start_yaw": 0.0})
session_id = resp.json()["session_id"]
# then GET /sessions/{session_id}/stream and forward SSE → ctx.info / ctx.report_progress
```

Three concentric layers: **Poke MCP → keryx-agents-api `/sessions` → `stream_agents` SSE → vLLM agent loop → `GetImage.getImageRemote` → frame DB.** Each boundary is a Modal endpoint or `modal.Cls.from_name` lookup (`agents/agents.py:172`). A different downstream agent (Claude Code, Cursor, custom UI) drops in via either the MCP tool or the `/sessions` HTTP API — both JSON-in / SSE-out.

### 3. Modal vLLM endpoint setup (`agents/agents.py:48-78, 151-172`)

```python
model_vol   = modal.Volume.from_name("keryx-model-cache", create_if_missing=True)
cancel_dict = modal.Dict.from_name("keryx-cancel", create_if_missing=True)

def download_model():                                       # runs at image-build time
    from huggingface_hub import snapshot_download
    snapshot_download(MODEL_ID, local_dir=f"{MODEL_DIR}/{MODEL_ID}")

agent_image = (modal.Image.debian_slim(python_version="3.11")
    .pip_install("vllm>=0.11.0", "transformers", "qwen-vl-utils==0.0.14",
                 "Pillow", "torch", "huggingface_hub")
    .run_function(download_model, volumes={MODEL_DIR: model_vol}))   # bake weights

@app.cls(image=agent_image, gpu="H200", volumes={MODEL_DIR: model_vol},
         timeout=600, scaledown_window=300)
class AgentRunner:
    @modal.enter()
    def setup(self):
        from vllm import LLM
        self.llm = LLM(model=f"{MODEL_DIR}/{MODEL_ID}", trust_remote_code=True,
                       max_model_len=16384, dtype="half", enable_prefix_caching=True)
        self.get_image_cls = modal.Cls.from_name("keryx", "GetImage")
```

**Why it matters:** weights baked into a Modal `Volume` at image-build time → only cold-start cost is vLLM loading FP8 from local SSD. `scaledown_window=300` keeps H200 warm 5 minutes — cold-starting a 30B FP8 vLLM is the longest single op. `enable_prefix_caching=True` is load-bearing: the system prompt + accumulated `## Trajectory so far` lines are mostly stable across 15 steps, so vLLM re-uses the K/V cache for the prefix and only pays for the new image + new pose-text suffix.

## Capability stack

| Layer | Choice |
|---|---|
| Drone capture | iPhone-class video (`data/video.MP4`) + IMU (`data/gyro.csv`) — no specific drone HW in repo |
| VIO / SLAM | BASALT (`data/run_full_pipeline.py:228-355`) |
| Frame extraction | ffmpeg @ 10fps on Modal (`agents/extract_frames.py:34-41`) |
| World-model server | `keryx.GetImage` Modal class (`agents/app.py:140-294`) — pose-indexed frame DB in RAM |
| Depth (**disconnected**) | Apple Depth Pro on Modal H200 (`ml-depth-pro/view_transform_modal.py:150-250`) |
| VLM | Qwen3-VL-30B-A3B-Thinking-FP8 default, 2B fallback (`agents/agents.py:22-28`) |
| VLM serving | Modal H200 + vLLM 0.11+, FP8, `enable_prefix_caching=True` (`agents/agents.py:165-171`) |
| Agent loop | Single image / step, JSON actions, trajectory-as-text memory, 15-step cap (`agents/agents.py:176-337`) |
| Parallelism | `send_agent.spawn` × N, shared `modal.Dict` cancellation (`agents/agents.py:702-797`) |
| Streaming | SSE via Starlette `StreamingResponse` on `@modal.fastapi_endpoint` (`agents/agents.py:675-809`) |
| Session API | `/sessions` POST + `/sessions/:id/stream` GET — **deployed only, not in repo** |
| MCP | `FastMCP("Keryx")` one tool `explore_building` (`poke-mcp/server.py:18-147`) |
| Frontend | React + Vite + TypeScript (`frontend/src/routes/`) |

## Why the Fellowship and not a track prize

The Fellowship rewards founder potential. The BASALT VIO integration + Modal vLLM deploy + MCP wrapper is a full-stack hardware-to-AI-to-tool-call arc by a small team — that's the signal. The project itself is **architecturally simpler** than Mira (no point cloud, no triangulation, no Gemini, no dashboard), which probably explains why it didn't take a track prize.

## Lookalike-risk score for our HackTech 2026 entry

**🟡 MEDIUM** — same family as our [decision 009](../decisions/009-ironside-pipeline-mirror.md) Ironside-mirror direction (parallel agent classifiers + structured handoff), but our wedge is **brain-encoding-as-second-modality** ([decision 006](../decisions/006-tribe-v2-as-special-mode.md)), where Keryx has nothing. Risks:

- **Drone-on-stage demo theatre.** Keryx owns "drone fly-through → AI navigates building." If our demo shows drone footage parsed by a VLM, judges pattern-match within 30 seconds. Stage a different physical signature.
- **Modal H200 + vLLM + Qwen-class VLM stack.** Now table stakes for spatial-VLM hackathon work, not a differentiator.
- **MCP-as-tool-surface for a vision agent.** `explore_building(query)` is the cleanest single-tool MCP wrapper around a VLM swarm at this hackathon. If we also ship an MCP tool over a perception swarm, "ours uses brain encoding" must be in the *first sentence*.

Risk is **lower** than Mira — Keryx didn't crack rendering / triangulation. Point-cloud rendering, categorical-VLM-tricks, and evidence-graded citations are still open lanes.

## What this project's existence forecloses

- **"VLM agent navigates a drone-mapped building, exposed as one MCP call"** — Keryx ships it.
- **BASALT VIO + frame DB + pose-indexed lookup** as a novel pattern — now public reference code.
- **`Allowed: {forward: true, ...}` in the prompt as a VLM-as-discrete-graph-navigator trick** — published.
- **vLLM + Modal H200 + prefix caching for a 15-step agent loop** as a Modal sponsor-pitch bullet — already a Modal showcase.

## What's still open (where Keryx leaves money on the table)

- **Apple Depth Pro is in the repo but disconnected from the agent.** Agents see flat JPEGs only. Wiring Depth Pro into the per-step prompt as a depth-summary sidecar (cf. [`patterns/spatial-sidecar.md`](../patterns/spatial-sidecar.md)) would dominate Keryx on the same evidence.
- **No grounded citations.** "Found — confidence high" returns a 1-sentence description and 2 hand-picked strings. No `frame_filename + bbox + timestamp` payload, even though `filename` is available in `GetImage` (`agents/app.py:271, 292`) and partially plumbed through `_result` (`agents/agents.py:507-516`). A [`patterns/grounded-citation.md`](../patterns/grounded-citation.md) overlay closes this.
- **World model is read-only.** No new captures, no incremental updates — same gap [`projects/mira.md`](mira.md) flags.
- **No second-modality stream.** Single image per step. Adding parallel input (depth, IMU-at-capture, audio) is the wedge [decision 009](../decisions/009-ironside-pipeline-mirror.md) bets on; Keryx didn't take it.
- **VLM-as-policy is brittle without a planner.** `_parse_action` (`agents/agents.py:595-613`) silently falls back to "rotate 30°" on JSON failure (line 285-292). Even A* over the affordance graph on top of the same VLM-as-perception would beat Keryx on success rate without changing the visual surface.

## Cross-links

- [`patterns/spatial-sidecar.md`](../patterns/spatial-sidecar.md) — Keryx is the **anti-example**: explicitly does NOT fuse parallel perception. A Keryx + sidecar hybrid is open.
- [`patterns/localize-and-zoom.md`](../patterns/localize-and-zoom.md) — Keryx attacks "wide-shot, small-target" by *moving the camera* instead of cropping. Different attack on the same VLM-spatial-blindness failure mode.
- [`patterns/robust-json-from-llms.md`](../patterns/robust-json-from-llms.md) — `_parse_action` (`agents/agents.py:595-613`) is a clean reference: strip fences, first-`{` to last-`}`, `json.loads`, return `None`.
- [`patterns/grounded-citation.md`](../patterns/grounded-citation.md) — what Keryx **doesn't** do; hooks exist, contract isn't enforced.
- [`projects/mira.md`](mira.md) — sibling: Mira renders from a point cloud, Keryx looks up from a frame list. Same wedge, opposite primitive.
- [`projects/4sight.md`](4sight.md) — sibling wearable-VLM stack (teardown not yet written).
- [`decisions/006-tribe-v2-as-special-mode.md`](../decisions/006-tribe-v2-as-special-mode.md) — TRIBE V2 is the wedge Keryx doesn't have.
- [`decisions/009-ironside-pipeline-mirror.md`](../decisions/009-ironside-pipeline-mirror.md) — Keryx's yaw-offset spawn + first-finder cancellation is a minimal Ironside-mirror swarm.
