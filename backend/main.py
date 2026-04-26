from __future__ import annotations
import asyncio
import json
import os
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

load_dotenv()

from services.brain_mesh import BrainMesh
from services.activity_reader import ActivityReader
from services.swarm import SwarmSimulation
from services.orchestrator import Orchestrator, _parse_observation
from services.k2_client import K2Client
from services.vision_client import VisionClient
from services.comparison import run_comparison

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
        clips.append({
            "clip_id": sub.name,
            "has_video": video is not None,
            "video_url": f"/prerendered/{sub.name}/{video.name}" if video else None,
            "activity_url": f"/prerendered/{sub.name}/activity.json",
        })
    return {"clips": clips}


@app.post("/demo/match")
async def match_clip(payload: dict):
    """Match an uploaded filename to a prerendered clip_id.

    Body: {"filename": "30s_ironsite.mp4"}
    Strips the extension and looks for prerendered/<clip_id>/activity.json.
    """
    filename = (payload or {}).get("filename")
    if not filename:
        raise HTTPException(status_code=400, detail="filename required")
    clip_id = Path(filename).stem
    clip_dir = _clip_dir(clip_id)
    activity_path = clip_dir / "activity.json"
    if not activity_path.exists():
        raise HTTPException(status_code=404, detail=f"no prerendered clip for '{clip_id}'")

    # n_frames lookup (cheap — load + count).
    try:
        blob = json.loads(activity_path.read_text(encoding="utf-8"))
        n_frames = len(blob.get("frames") or [])
    except Exception:
        n_frames = 0

    video = _resolve_video_path(clip_dir, clip_id)
    return {
        "clip_id": clip_id,
        "video_url": f"/prerendered/{clip_id}/{video.name}" if video else None,
        "activity_url": f"/prerendered/{clip_id}/activity.json",
        "n_frames": n_frames,
        "has_video": video is not None,
    }


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


@app.get("/demo/comparison/{clip_id}")
async def get_comparison(clip_id: str):
    """Return cached with/without-TRIBE comparison, generating if missing."""
    clip_dir = _clip_dir(clip_id)
    activity_path = clip_dir / "activity.json"
    if not activity_path.exists():
        raise HTTPException(status_code=404, detail="clip not found")

    # Need the vision report first — reuse the same caching pathway.
    video = _resolve_video_path(clip_dir, clip_id)
    video_path = video if video else (clip_dir / f"{clip_id}.mp4")
    vision_report = await get_vision_client().analyze_video(video_path, clip_id)

    try:
        activity = json.loads(activity_path.read_text(encoding="utf-8"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"failed to parse activity.json: {e}")

    cache = clip_dir / "comparison.json"
    return await run_comparison(vision_report, activity, cache)


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
        text = await get_k2_client().chat(system_prompt, user, max_tokens=200)
    except Exception as e:
        return {
            "network": network,
            "t": t_int,
            "text": f"[K2 call failed: {e}]",
            "confidence": "",
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

    return {
        "network": network,
        "t": t_int,
        "text": parsed.get("reading") or text.strip(),
        "confidence": parsed.get("confidence") or "",
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
