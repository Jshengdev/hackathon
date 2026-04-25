from __future__ import annotations
import asyncio
import json
import os
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from services.brain_mesh import BrainMesh
from services.activity_reader import ActivityReader
from services.swarm import SwarmSimulation
from services.orchestrator import Orchestrator

app = FastAPI(title="Brain Swarm Visualizer")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

DATA_DIR = Path(os.getenv("DATA_DIR", "./data"))

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
    """Run TRIBE V2 + aggregator on an uploaded video, then reload the
    simulation's activity buffer. Synchronous — blocks until preds.npz and
    activity.json land in data/. Expect a few minutes for ~1-minute video on
    a GPU box.

    Body: {"video_filename": "sintel.mp4"} — must already be uploaded via /brain/upload.
    """
    video_filename = payload.get("video_filename")
    if not video_filename:
        return {"ok": False, "error": "video_filename required"}

    video_path = (DATA_DIR / "input" / video_filename).resolve()
    if not video_path.exists():
        return {"ok": False, "error": f"video not found at {video_path}"}

    junsoo_dir = Path(__file__).parents[3] / "junsoo"
    script = junsoo_dir / "infer_pipeline.sh"
    if not script.exists():
        return {"ok": False, "error": f"pipeline script not found at {script}"}

    proc = await asyncio.create_subprocess_exec(
        "bash", str(script), str(video_path),
        cwd=str(junsoo_dir),
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.STDOUT,
    )
    stdout, _ = await proc.communicate()
    log = stdout.decode(errors="replace")

    if proc.returncode != 0:
        return {
            "ok": False,
            "returncode": proc.returncode,
            "log_tail": log[-1500:],
        }

    return {
        "ok": True,
        **activity_reader.reload(),
        "log_tail": log[-500:],
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
