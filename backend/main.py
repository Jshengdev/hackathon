from __future__ import annotations
import asyncio
import json
import os
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

load_dotenv()

from services.brain_mesh import BrainMesh
from services.activity_reader import ActivityReader
from services.swarm import SwarmSimulation
from services.orchestrator import Orchestrator, _parse_observation
from services.k2_client import K2Client
from services.vision_client import VisionClient
from services.swarm_runner import run_swarm
from services.empathy_synthesis import synthesize as synthesize_empathy
from services.iterative_loop import run_iterative_loop
from services.falsification import compute_falsification
from services.session_cache import read_cached, write_cached
from services.warmup import warmup_clip, get_warmup_status

app = FastAPI(title="Brain Swarm Visualizer")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

DATA_DIR = Path(os.getenv("DATA_DIR", "./data"))

# ---------------------------------------------------------------------------
# Prerendered static mount — serves MP4s + activity.json so the frontend can
# `<video src="/prerendered/{clip_id}/{clip_id}.mp4">` directly.
# Resolves to backend/prerendered/.
# ---------------------------------------------------------------------------
PRERENDERED_DIR = (Path(__file__).parent / "prerendered").resolve()
print(f"[prerendered] mounting {PRERENDERED_DIR} (exists={PRERENDERED_DIR.exists()})")
if PRERENDERED_DIR.exists():
    app.mount(
        "/prerendered",
        StaticFiles(directory=str(PRERENDERED_DIR)),
        name="prerendered",
    )

PROMPTS_DIR = (Path(__file__).parent / "prompts").resolve()

YEO7_NETWORKS = {
    "visual", "somatomotor", "dorsal_attention", "ventral_attention",
    "limbic", "frontoparietal", "default_mode",
}

# Lazy clients — instantiated on first use so startup is fast.
_vision_client: Optional[VisionClient] = None
_k2_client: Optional[K2Client] = None


def get_vision_client() -> VisionClient:
    global _vision_client
    if _vision_client is None:
        _vision_client = VisionClient()
    return _vision_client


def get_k2_client() -> K2Client:
    global _k2_client
    if _k2_client is None:
        _k2_client = K2Client()
    return _k2_client

brain_mesh: Optional[BrainMesh] = None
activity_reader: Optional[ActivityReader] = None
swarm: Optional[SwarmSimulation] = None
orchestrator: Optional[Orchestrator] = None

connected: list[WebSocket] = []
speech_queue: asyncio.Queue = asyncio.Queue()
_sim_task: Optional[asyncio.Task] = None
_running = False
_current_t = 0


@app.on_event("startup")
async def startup():
    global brain_mesh, activity_reader, swarm, orchestrator
    brain_mesh = BrainMesh()
    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(None, brain_mesh.load)
    except Exception as e:
        print(f"WARNING: brain mesh load failed ({e}). Using mock sphere.")
        brain_mesh.use_mock()

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    activity_reader = ActivityReader(DATA_DIR)
    activity_reader.load()

    swarm = SwarmSimulation(brain_mesh)
    swarm.init_agents()

    orchestrator = Orchestrator()


@app.get("/brain/mesh")
def get_mesh():
    return brain_mesh.to_dict()


@app.get("/brain/status")
def get_status():
    return {
        "running": _running,
        "t": _current_t,
        "n_frames": activity_reader.n_frames,
        "n_agents": swarm.n_agents,
        "data_source": activity_reader.data_source,
        "stimulus_label": activity_reader.stimulus_label,
    }


@app.post("/brain/reload")
def reload_activity():
    """Re-read preds.npz + activity.json from disk. Use after running
    infer_pipeline.sh manually to pick up new data without restarting."""
    return {"ok": True, **activity_reader.reload()}


@app.post("/brain/start")
async def start_sim():
    global _running, _sim_task
    if not _running:
        _running = True
        _sim_task = asyncio.create_task(simulation_loop())
    return {"ok": True}


@app.post("/brain/stop")
async def stop_sim():
    global _running
    _running = False
    return {"ok": True}


@app.post("/brain/upload")
async def upload_video(file: UploadFile = File(...)):
    """Save a video file. Caller can then POST /brain/run-inference with this filename."""
    upload_path = DATA_DIR / "input" / file.filename
    upload_path.parent.mkdir(parents=True, exist_ok=True)
    upload_path.write_bytes(await file.read())
    return {
        "saved": str(upload_path),
        "next": {
            "endpoint": "/brain/run-inference",
            "payload": {"video_filename": file.filename},
        },
    }


@app.post("/brain/run-inference")
async def run_inference(payload: dict):
    """DEPRECATED. Live TRIBE inference is no longer supported in this build —
    we use prerendered activity.json files in backend/prerendered/. Use the
    /demo/match flow instead."""
    return {
        "ok": False,
        "error": "live inference disabled — use /demo/match with a prerendered clip",
        "available_clips_endpoint": "/demo/clips",
    }


# ---------------------------------------------------------------------------
# /demo/* — prerendered-clip demo flow
# ---------------------------------------------------------------------------

def _clip_dir(clip_id: str) -> Path:
    """Return the prerendered/<clip_id>/ directory, validating against
    directory traversal."""
    if not clip_id or "/" in clip_id or "\\" in clip_id or clip_id.startswith("."):
        raise HTTPException(status_code=400, detail="invalid clip_id")
    d = (PRERENDERED_DIR / clip_id).resolve()
    # Make sure d is actually under PRERENDERED_DIR (defense in depth).
    try:
        d.relative_to(PRERENDERED_DIR)
    except ValueError:
        raise HTTPException(status_code=400, detail="invalid clip_id")
    return d


def _load_scenario(clip_dir: Path) -> dict:
    """Read prerendered/<clip_id>/scenario.json. Defaults to consumer."""
    scenario_path = clip_dir / "scenario.json"
    if scenario_path.exists():
        try:
            blob = json.loads(scenario_path.read_text(encoding="utf-8"))
            if isinstance(blob, dict) and "scenario" in blob:
                return {
                    "scenario": blob.get("scenario", "consumer"),
                    "label": blob.get("label", clip_dir.name),
                }
        except Exception:
            pass
    return {"scenario": "consumer", "label": clip_dir.name}


def _resolve_video_path(clip_dir: Path, clip_id: str) -> Optional[Path]:
    """Find a sibling MP4 for the clip. Falls back to None if none exists
    yet — the demo still works because vision_client will write a stub."""
    candidates = [
        clip_dir / f"{clip_id}.mp4",
        clip_dir / "clip.mp4",
        clip_dir / "video.mp4",
    ]
    for c in candidates:
        if c.exists():
            return c
    # Last resort: any *.mp4 in the directory.
    mp4s = list(clip_dir.glob("*.mp4"))
    return mp4s[0] if mp4s else None


@app.get("/demo/clips")
def list_demo_clips():
    """List clip_ids that have an activity.json available."""
    if not PRERENDERED_DIR.exists():
        return {"clips": []}
    clips = []
    for sub in sorted(PRERENDERED_DIR.iterdir()):
        if not sub.is_dir():
            continue
        activity = sub / "activity.json"
        if not activity.exists():
            continue
        video = _resolve_video_path(sub, sub.name)
        scenario = _load_scenario(sub)
        clips.append({
            "clip_id": sub.name,
            "has_video": video is not None,
            "video_url": f"/prerendered/{sub.name}/{video.name}" if video else None,
            "activity_url": f"/prerendered/{sub.name}/activity.json",
            "scenario": scenario["scenario"],
            "scenarioLabel": scenario["label"],
        })
    return {"clips": clips}


# /demo/match is defined below as match_clip_with_warmup.


@app.get("/demo/activity/{clip_id}")
def get_demo_activity(clip_id: str):
    """Return the prerendered activity.json contents directly."""
    clip_dir = _clip_dir(clip_id)
    activity_path = clip_dir / "activity.json"
    if not activity_path.exists():
        raise HTTPException(status_code=404, detail="activity.json not found")
    try:
        return json.loads(activity_path.read_text(encoding="utf-8"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"failed to parse activity.json: {e}")


@app.get("/demo/vision-report/{clip_id}")
async def get_vision_report(clip_id: str):
    """Return the cached vision report, generating it if missing."""
    clip_dir = _clip_dir(clip_id)
    if not (clip_dir / "activity.json").exists():
        raise HTTPException(status_code=404, detail="clip not found")
    video = _resolve_video_path(clip_dir, clip_id)
    # vision_client handles missing video → stub fallback
    video_path = video if video else (clip_dir / f"{clip_id}.mp4")
    report = await get_vision_client().analyze_video(video_path, clip_id)
    return report


_CONTROL_FOR = {
    "ironside": "workplace_routine_baseline",
    "consumer": "curated_short_film_baseline",
}


def _load_activity(clip_id: str) -> dict:
    activity_path = _clip_dir(clip_id) / "activity.json"
    if not activity_path.exists():
        raise HTTPException(status_code=404, detail=f"no activity.json for '{clip_id}'")
    return json.loads(activity_path.read_text(encoding="utf-8"))


def _load_control_activity(scenario: str, main_activity: dict) -> dict:
    control_id = _CONTROL_FOR.get(scenario)
    if control_id:
        ctrl_path = (PRERENDERED_DIR / control_id / "activity.json")
        if ctrl_path.exists():
            return json.loads(ctrl_path.read_text(encoding="utf-8"))
    return main_activity


@app.post("/demo/match")
async def match_clip_with_warmup(payload: dict, background_tasks: BackgroundTasks):
    """Match an uploaded filename to a prerendered clip_id, then kick off
    the warmup background task so subsequent /demo/* calls are cached."""
    filename = (payload or {}).get("filename")
    if not filename:
        raise HTTPException(status_code=400, detail="filename required")
    clip_id = Path(filename).stem
    clip_dir = _clip_dir(clip_id)
    activity_path = clip_dir / "activity.json"
    if not activity_path.exists():
        raise HTTPException(status_code=404, detail=f"no prerendered clip for '{clip_id}'")
    try:
        n_frames = len(json.loads(activity_path.read_text(encoding="utf-8")).get("frames") or [])
    except Exception:
        n_frames = 0
    video = _resolve_video_path(clip_dir, clip_id)
    scenario = _load_scenario(clip_dir)

    background_tasks.add_task(warmup_clip, PRERENDERED_DIR, clip_id)

    return {
        "clip_id": clip_id,
        "video_url": f"/prerendered/{clip_id}/{video.name}" if video else None,
        "activity_url": f"/prerendered/{clip_id}/activity.json",
        "n_frames": n_frames,
        "has_video": video is not None,
        "scenario": scenario["scenario"],
        "scenarioLabel": scenario["label"],
    }


@app.get("/demo/warmup-status/{clip_id}")
async def warmup_status(clip_id: str):
    _clip_dir(clip_id)
    return await get_warmup_status(PRERENDERED_DIR, clip_id)


async def _ensure_swarm_readings(clip_id: str) -> dict:
    cached = read_cached(PRERENDERED_DIR, clip_id, "swarm_readings")
    if cached is not None:
        return cached
    activity = _load_activity(clip_id)
    result = await run_swarm(activity, clip_id)
    write_cached(PRERENDERED_DIR, clip_id, "swarm_readings", result)
    return result


async def _ensure_vision_report(clip_id: str) -> dict:
    cached = read_cached(PRERENDERED_DIR, clip_id, "vision_report")
    if cached is not None:
        return cached
    clip_dir = _clip_dir(clip_id)
    video = _resolve_video_path(clip_dir, clip_id) or (clip_dir / f"{clip_id}.mp4")
    return await get_vision_client().analyze_video(video, clip_id)


async def _ensure_empathy(clip_id: str) -> dict:
    cached = read_cached(PRERENDERED_DIR, clip_id, "empathy")
    if cached is not None:
        return cached

    scenario = _load_scenario(_clip_dir(clip_id))
    main_activity = _load_activity(clip_id)

    vision_report, swarm_readings = await asyncio.gather(
        _ensure_vision_report(clip_id),
        _ensure_swarm_readings(clip_id),
    )

    loop_result = await run_iterative_loop(
        vision_report=vision_report,
        swarm_readings=swarm_readings,
        scenario=scenario["scenario"],
    )

    control_activity = _load_control_activity(scenario["scenario"], main_activity)
    falsif = compute_falsification(
        loop_result.get("best_paragraph") or "",
        main_activity,
        control_activity,
    )

    best_paragraph = loop_result.get("best_paragraph") or ""
    round_trajectory = loop_result.get("round_trajectory") or []
    per_region_attribution = loop_result.get("per_region_attribution") or {}

    synthesis_document: Optional[dict] = None
    try:
        from services.empathy_polish import synthesize_document

        synthesis_document = await synthesize_document(
            clip_id=clip_id,
            scenario=scenario["scenario"],
            vision_report=vision_report,
            activity=main_activity,
            swarm_readings=swarm_readings,
            round_trajectory=round_trajectory,
            per_region_attribution=per_region_attribution,
            falsification=falsif,
            best_paragraph=best_paragraph,
            clip_dir=_clip_dir(clip_id),
        )
    except Exception as e:
        print(f"[empathy_polish] unexpected error clip={clip_id} err={type(e).__name__}: {e}")
        synthesis_document = None

    polished_paragraph = (
        synthesis_document.get("synthesis_paragraph")
        if isinstance(synthesis_document, dict)
        else None
    )

    empathy = {
        "clip_id": clip_id,
        "scenario": scenario["scenario"],
        "scenario_label": scenario["label"],
        "vision_report": vision_report,
        "swarm_readings": swarm_readings,
        "best_paragraph": best_paragraph,
        "polished_paragraph": polished_paragraph,
        "final_score": loop_result.get("final_score"),
        "round_trajectory": round_trajectory,
        "per_region_attribution": per_region_attribution,
        "falsification": falsif,
        "synthesis_document": synthesis_document,
    }
    write_cached(PRERENDERED_DIR, clip_id, "empathy", empathy)
    return empathy


@app.get("/demo/empathy/{clip_id}")
async def get_empathy(clip_id: str):
    _clip_dir(clip_id)
    return await _ensure_empathy(clip_id)


@app.get("/demo/iterative-trajectory/{clip_id}")
async def get_iterative_trajectory(clip_id: str):
    _clip_dir(clip_id)
    cached = read_cached(PRERENDERED_DIR, clip_id, "iterative_trajectory")
    if cached is not None:
        return cached
    empathy = await _ensure_empathy(clip_id)
    trajectory = {
        "clip_id": clip_id,
        "round_trajectory": empathy.get("round_trajectory") or [],
        "final_score": empathy.get("final_score"),
        "best_paragraph": empathy.get("best_paragraph"),
    }
    write_cached(PRERENDERED_DIR, clip_id, "iterative_trajectory", trajectory)
    return trajectory


@app.get("/demo/falsification/{clip_id}")
async def get_falsification(clip_id: str):
    _clip_dir(clip_id)
    cached = read_cached(PRERENDERED_DIR, clip_id, "falsification")
    if cached is not None:
        return cached
    empathy = await _ensure_empathy(clip_id)
    falsif = empathy.get("falsification") or {}
    write_cached(PRERENDERED_DIR, clip_id, "falsification", falsif)
    return falsif


@app.get("/demo/per-vertex/{clip_id}")
async def get_per_vertex(clip_id: str):
    """Stub today — no clip has per_vertex.bin baked yet. Frontend probes once per clip and falls back to network-weight matmul on 404."""
    clip_dir = _clip_dir(clip_id)
    if not (clip_dir / "activity.json").exists():
        raise HTTPException(status_code=404, detail="clip not found")
    bin_path = clip_dir / "per_vertex.bin"
    manifest_path = clip_dir / "per_vertex.json"
    if not bin_path.exists() or not manifest_path.exists():
        raise HTTPException(status_code=404, detail="no per-vertex data baked")
    try:
        manifest = json.loads(manifest_path.read_text())
        n_frames = int(manifest["n_frames"])
        n_vertices = int(manifest["n_vertices"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"failed to parse per_vertex.json: {e}")
    return FileResponse(
        str(bin_path),
        media_type="application/octet-stream",
        headers={
            "X-N-Frames": str(n_frames),
            "X-N-Vertices": str(n_vertices),
            "X-Dtype": "float32",
            "X-Byte-Order": "little",
        },
    )


@app.post("/demo/k2-region")
async def k2_region(payload: dict):
    """Run K2 with a paper-grounded prompt for a given region at a timestamp.

    Body: {"clip_id": str, "network": str, "t": int}
    Returns: {network, text, cite, t}
    """
    clip_id = (payload or {}).get("clip_id")
    network = (payload or {}).get("network")
    t = (payload or {}).get("t")
    if not clip_id or not network or t is None:
        raise HTTPException(status_code=400, detail="clip_id, network, and t are required")
    if network not in YEO7_NETWORKS:
        raise HTTPException(status_code=400, detail=f"unknown network: {network}")
    try:
        t_int = int(t)
    except Exception:
        raise HTTPException(status_code=400, detail="t must be an integer")

    clip_dir = _clip_dir(clip_id)
    activity_path = clip_dir / "activity.json"
    if not activity_path.exists():
        raise HTTPException(status_code=404, detail="clip not found")

    # Cache lookup — k2_region_cache.json is baked during warmup with one entry
    # per (network, t). Hits are instant; misses fall through to a live K2 call.
    region_cache = read_cached(PRERENDERED_DIR, clip_id, "k2_region_cache") or {}
    cached_entry = region_cache.get(f"{network}_t{t_int}")
    if cached_entry and cached_entry.get("text"):
        return {
            "network": network,
            "t": t_int,
            "text": cached_entry.get("text", ""),
            "confidence": cached_entry.get("confidence", ""),
            "cite": cached_entry.get("cite"),
            "raw": cached_entry.get("raw", cached_entry.get("text", "")),
            "cached": True,
        }

    try:
        activity = json.loads(activity_path.read_text(encoding="utf-8"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"failed to parse activity.json: {e}")

    frames = activity.get("frames") or []
    if not frames:
        raise HTTPException(status_code=500, detail="activity.json has no frames")
    frame = frames[t_int % len(frames)]
    regions: dict = frame.get("regions") or {}

    # Load the network's grounded system prompt.
    prompt_path = PROMPTS_DIR / f"{network}.md"
    if prompt_path.exists():
        system_prompt = prompt_path.read_text(encoding="utf-8")
    else:
        system_prompt = (
            f"You are the {network} network. React in 1-2 sentences to your "
            "activation, grounded in published neuroscience."
        )
    others = ", ".join(
        f"{k}={v:.2f}" for k, v in regions.items() if k != network
    )
    user = (
        f"Your activation: {regions.get(network, 0.0):.2f}.\n"
        f"Other networks: {others}.\n"
        f"Time: t={t_int}s in clip '{clip_id}'.\n"
        "Output the three lines exactly as specified in your system prompt."
    )

    try:
        text = await get_k2_client().chat(
            system_prompt, user, max_tokens=200,
            tag=f"region:{network}_t{t_int}",
        )
    except Exception as e:
        return {
            "network": network,
            "t": t_int,
            "text": f"[K2 call failed: {e}]",
            "confidence": "low",
            "cite": None,
            "stub": True,
            "error": str(e),
        }

    # Parse the 3-line output the prompts produce: Reading / Confidence / Cite.
    parsed = _parse_observation(text)
    cite = parsed.get("cite") or None
    if cite:
        # Strip wrapping brackets if present so the frontend can render however it likes.
        cite = cite.strip()
        if cite.startswith("[") and cite.endswith("]"):
            cite = cite[1:-1].strip()

    # Normalize confidence to one of {high, medium, low}. K2 sometimes omits
    # this line or emits a verbose phrase; pick the first known token if
    # present, otherwise default to "medium" so the popup's confidence bar
    # always renders rather than collapsing to a neutral mid-rail.
    raw_conf = (parsed.get("confidence") or "").strip().lower()
    if "high" in raw_conf:
        confidence = "high"
    elif "low" in raw_conf:
        confidence = "low"
    elif "medium" in raw_conf or "med" in raw_conf:
        confidence = "medium"
    else:
        confidence = "medium"

    return {
        "network": network,
        "t": t_int,
        "text": parsed.get("reading") or text.strip(),
        "confidence": confidence,
        "cite": cite,
        "raw": text,
    }


@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected.append(websocket)
    try:
        while True:
            await asyncio.sleep(30)
    except WebSocketDisconnect:
        pass
    finally:
        if websocket in connected:
            connected.remove(websocket)


async def broadcast(data: dict):
    msg = json.dumps(data)
    dead = []
    for ws in connected:
        try:
            await ws.send_text(msg)
        except Exception:
            dead.append(ws)
    for ws in dead:
        if ws in connected:
            connected.remove(ws)


async def simulation_loop():
    global _current_t
    _current_t = 0
    while _running:
        vertex_activations = activity_reader.get_vertex_frame(_current_t)
        network_frame = activity_reader.get_network_frame(_current_t)

        swarm_result = swarm.update(vertex_activations, brain_mesh)

        # Fire K2 orchestration without blocking the 1 Hz tick
        asyncio.create_task(
            orchestrator.run_frame(network_frame, _current_t, speech_queue)
        )

        pending_speech: list[dict] = []
        while not speech_queue.empty():
            pending_speech.append(speech_queue.get_nowait())

        await broadcast({
            "t": _current_t,
            "activations": vertex_activations.tolist(),
            "agents": swarm_result["agents"],
            "network_activations": network_frame.get("regions", {}),
            "top_region": network_frame.get("top_region", ""),
            "speech": pending_speech,
        })

        _current_t = (_current_t + 1) % max(1, activity_reader.n_frames)
        await asyncio.sleep(1.0)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
