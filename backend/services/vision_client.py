"""Vision LLM client.

Wraps a vision-capable LLM (default: OpenRouter + Qwen3-VL) and turns an MP4
into a structured "vision report" JSON describing what physically happens in
the clip (Stage 1A of the locked architecture, build-plan-locked.md §1).

Strategy for keeping this demo-reliable:
  1. Extract 5 evenly-spaced frames from the video as JPEG bytes (cv2 →
     ffmpeg fallback → black-frame stub) so we never have to upload a full
     MP4 to the model.
  2. Send the frames + a structured prompt asking for a JSON report.
  3. Cache the result to backend/prerendered/{clip_id}/vision_report.json so
     subsequent calls are instant.

If no API key is configured we still emit a stub report flagged with
`"stub": true` so the frontend can render something. Stubs are also cached
so subsequent calls don't re-attempt.

Output schema (build-plan-locked §4.1):
    {
      "scene_summary": str,
      "actions": list[str],
      "temporal_sequence": list[{"t_s": int, "event": str}],
      "spatial_relationships": list[str],
      "emotional_tone": str,        # descriptive only — neutral/tense/calm/...
      "stub": bool,
      "error": str | None
    }
"""
from __future__ import annotations

import asyncio
import base64
import json
import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Optional

try:
    # Prefer cv2 — single-call frame extraction, no external binary needed.
    import cv2  # type: ignore
    _HAS_CV2 = True
except Exception:
    cv2 = None  # type: ignore
    _HAS_CV2 = False

try:
    import httpx  # already a dep via k2_client
except Exception:
    httpx = None  # type: ignore


# ---------------------------------------------------------------------------
# Frame extraction
# ---------------------------------------------------------------------------

def _extract_frames_cv2(video_path: Path, n: int = 5) -> list[bytes]:
    """Pull `n` evenly-spaced JPEG frames from a video using cv2."""
    cap = cv2.VideoCapture(str(video_path))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    if total <= 0:
        cap.release()
        return []
    frames: list[bytes] = []
    # Sample at the centers of n equal slices, not the endpoints — last frame
    # is often a black/credits frame in real-world clips.
    indices = [int((i + 0.5) * total / n) for i in range(n)]
    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ok, frame = cap.read()
        if not ok:
            continue
        ok, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
        if ok:
            frames.append(buf.tobytes())
    cap.release()
    return frames


def _extract_frames_ffmpeg(video_path: Path, n: int = 5) -> list[bytes]:
    """Fallback: shell out to ffmpeg to extract n frames as JPEGs."""
    if shutil.which("ffmpeg") is None:
        return []
    with tempfile.TemporaryDirectory() as tmp:
        out_pattern = str(Path(tmp) / "frame_%03d.jpg")
        cmd = [
            "ffmpeg",
            "-y",
            "-i",
            str(video_path),
            "-vf",
            "thumbnail,scale=640:-1",
            "-frames:v",
            str(n),
            out_pattern,
        ]
        try:
            subprocess.run(cmd, capture_output=True, check=False, timeout=60)
        except Exception:
            return []
        frames: list[bytes] = []
        for p in sorted(Path(tmp).glob("frame_*.jpg")):
            try:
                frames.append(p.read_bytes())
            except Exception:
                pass
        return frames[:n]


def extract_frames(video_path: Path, n: int = 5) -> list[bytes]:
    """Best-effort frame extraction. Returns [] if everything fails."""
    if not video_path.exists():
        return []
    if _HAS_CV2:
        try:
            frames = _extract_frames_cv2(video_path, n)
            if frames:
                return frames
        except Exception:
            pass
    return _extract_frames_ffmpeg(video_path, n)


# ---------------------------------------------------------------------------
# Prompting
# ---------------------------------------------------------------------------

_VISION_SYSTEM = (
    "You are a careful video describer. You will see N frames sampled across "
    "a short clip. Describe what physically happens — actions, environment, "
    "tools, temporal sequence, spatial relationships. NO emotion claims. NO "
    "cognitive-state claims. Use observational language only. Output ONLY a "
    "JSON object — no markdown fences, no commentary."
)


_USER_INSTRUCTIONS = (
    "Output JSON matching this schema EXACTLY:\n"
    "{\n"
    '  "scene_summary": "1-2 sentence factual summary of the clip",\n'
    '  "actions": ["array of distinct physical actions observed"],\n'
    '  "temporal_sequence": [\n'
    '    {"t_s": <integer second within clip>, "event": "<short description>"}\n'
    "  ],\n"
    '  "spatial_relationships": ["array of spatial-relationship phrases"],\n'
    '  "emotional_tone": "neutral | tense | calm | playful | focused | uncertain"\n'
    "}"
)


# Try hard to pull JSON out of an LLM response that may have stray prose
# or markdown fences around it. We don't rely on json mode because we want
# this to work across providers.
_JSON_FENCE_RE = re.compile(r"```(?:json)?\s*(\{.*?\})\s*```", re.DOTALL | re.IGNORECASE)


def _coerce_json(text: str) -> Optional[dict]:
    if not text:
        return None
    # 1. Markdown fence
    m = _JSON_FENCE_RE.search(text)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass
    # 2. Raw object — find first { and matching closing }
    try:
        start = text.index("{")
        depth = 0
        for i in range(start, len(text)):
            c = text[i]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return json.loads(text[start : i + 1])
    except Exception:
        return None
    return None


# ---------------------------------------------------------------------------
# Stub fallbacks (no API key / extraction failure)
# ---------------------------------------------------------------------------

def _stub_report(clip_id: str, reason: str, n_frames: int = 0) -> dict:
    """Return a §4.1-shaped stub vision report so callers always have something
    to render. Uses sensible defaults; marks `stub: true` and surfaces the
    failure reason in `error`.
    """
    return {
        "scene_summary": (
            f"[stub vision report — {reason}] Short video clip; no live vision "
            "model was invoked, so this description is a placeholder."
        ),
        "actions": [
            "subject enters frame",
            "continuous activity through the middle of the clip",
            "scene resolves at the end of the clip",
        ],
        "temporal_sequence": [
            {"t_s": 0, "event": "clip begins"},
            {"t_s": 10, "event": "mid-clip activity"},
            {"t_s": 20, "event": "late-clip activity"},
            {"t_s": 29, "event": "clip ends"},
        ],
        "spatial_relationships": [
            "subject roughly centered in frame",
            "background context visible behind subject",
        ],
        "emotional_tone": "neutral",
        "stub": True,
        "error": reason,
        # keep clip_id + frame count for downstream debug, harmless extras
        "clip_id": clip_id,
        "n_frames_sampled": n_frames,
    }


# ---------------------------------------------------------------------------
# Provider call — OpenRouter + Qwen3-VL (OpenAI-compatible chat/completions)
# ---------------------------------------------------------------------------

async def _call_openrouter(
    api_key: str,
    model: str,
    system: str,
    user: str,
    frames: list[bytes],
    timeout: float = 60.0,
) -> str:
    """Fire a multimodal chat-completions call at OpenRouter.

    Body shape matches OpenAI vision: messages[1].content is a list with N
    image_url entries (data: URLs) followed by a final text block carrying the
    JSON-schema instructions.
    """
    if httpx is None:
        raise RuntimeError("httpx not available")

    user_content: list[dict] = []
    for jpg in frames:
        b64 = base64.standard_b64encode(jpg).decode("ascii")
        user_content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{b64}"},
        })
    user_content.append({"type": "text", "text": user})

    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                # OpenRouter recommends these for attribution / rate-limit tier.
                "HTTP-Referer": "https://hackathon.local",
                "X-Title": "empathy-layer-engine",
            },
            json={
                "model": model,
                "max_tokens": 1500,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user_content},
                ],
            },
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


# ---------------------------------------------------------------------------
# Schema normalization
# ---------------------------------------------------------------------------

_VALID_TONES = {"neutral", "tense", "calm", "playful", "focused", "uncertain"}


def _normalize_report(parsed: dict, clip_id: str, n_frames: int) -> dict:
    """Coerce the parsed model output into the locked §4.1 schema."""
    # scene_summary
    summary = parsed.get("scene_summary")
    if not isinstance(summary, str) or not summary.strip():
        summary = "Short clip; no scene summary returned by the vision model."

    # actions — accept list[str] or list[dict] (legacy shape) and flatten
    raw_actions = parsed.get("actions") or []
    actions: list[str] = []
    if isinstance(raw_actions, list):
        for a in raw_actions:
            if isinstance(a, str) and a.strip():
                actions.append(a.strip())
            elif isinstance(a, dict):
                desc = a.get("description") or a.get("verb") or a.get("event")
                if isinstance(desc, str) and desc.strip():
                    actions.append(desc.strip())
    if not actions:
        actions = ["activity observed in clip"]

    # temporal_sequence — list[{t_s:int, event:str}]
    raw_seq = parsed.get("temporal_sequence") or []
    temporal: list[dict] = []
    if isinstance(raw_seq, list):
        for item in raw_seq:
            if not isinstance(item, dict):
                continue
            try:
                t_s = int(item.get("t_s", item.get("t", 0)))
            except Exception:
                t_s = 0
            event = item.get("event") or item.get("description") or ""
            if isinstance(event, str) and event.strip():
                temporal.append({"t_s": t_s, "event": event.strip()})
    if not temporal:
        temporal = [{"t_s": 0, "event": "clip begins"}]

    # spatial_relationships — list[str]
    raw_spatial = parsed.get("spatial_relationships") or []
    spatial: list[str] = []
    if isinstance(raw_spatial, list):
        for s in raw_spatial:
            if isinstance(s, str) and s.strip():
                spatial.append(s.strip())
    if not spatial:
        spatial = ["subjects positioned within the frame"]

    # emotional_tone — descriptive only, force into known vocabulary if close
    tone = parsed.get("emotional_tone") or "neutral"
    if isinstance(tone, str):
        tone_l = tone.strip().lower().split()[0] if tone.strip() else "neutral"
        tone = tone_l if tone_l in _VALID_TONES else (tone.strip() or "neutral")
    else:
        tone = "neutral"

    return {
        "scene_summary": summary.strip(),
        "actions": actions,
        "temporal_sequence": temporal,
        "spatial_relationships": spatial,
        "emotional_tone": tone,
        "stub": False,
        "error": None,
        # debug extras — harmless to downstream consumers
        "clip_id": clip_id,
        "n_frames_sampled": n_frames,
    }


# ---------------------------------------------------------------------------
# Public client
# ---------------------------------------------------------------------------

class VisionClient:
    """Async vision client with caching + OpenRouter Qwen3-VL provider.

    Reads env on construction:
      - VISION_API_KEY  : required for live calls; missing = stub fallback
      - VISION_MODEL        : OpenRouter model slug (default qwen3-vl-235b)
      - VISION_TIMEOUT      : httpx timeout in seconds (default 60.0)
    """

    def __init__(self):
        self.api_key = os.getenv("VISION_API_KEY", "").strip()
        self.model = os.getenv(
            "VISION_MODEL", "qwen/qwen3-vl-235b-a22b-instruct"
        ).strip() or "qwen/qwen3-vl-235b-a22b-instruct"
        self.timeout = float(os.getenv("VISION_TIMEOUT", "60.0"))

    @staticmethod
    def cache_path(clip_dir: Path) -> Path:
        return clip_dir / "vision_report.json"

    async def analyze_video(self, video_path: Path, clip_id: str) -> dict:
        """Return a vision report for the clip. Reads cache first.

        Always returns a dict matching build-plan-locked §4.1 (with `stub` and
        `error` flags). Always writes the result to the cache, including stubs,
        so subsequent calls are instant and don't re-attempt failed providers.
        """
        clip_dir = video_path.parent
        cache = self.cache_path(clip_dir)
        if cache.exists():
            try:
                return json.loads(cache.read_text(encoding="utf-8"))
            except Exception:
                pass  # corrupted cache → re-generate

        if not self.api_key:
            report = _stub_report(clip_id, "VISION_API_KEY not set")
            self._save(cache, report)
            return report

        if not video_path.exists():
            report = _stub_report(clip_id, f"video not found at {video_path}")
            self._save(cache, report)
            return report

        # Extract frames in a worker thread (cv2/ffmpeg are blocking).
        loop = asyncio.get_event_loop()
        frames = await loop.run_in_executor(None, extract_frames, video_path, 5)
        if not frames:
            report = _stub_report(clip_id, "frame extraction failed")
            self._save(cache, report)
            return report

        try:
            raw = await _call_openrouter(
                self.api_key,
                self.model,
                _VISION_SYSTEM,
                _USER_INSTRUCTIONS,
                frames,
                self.timeout,
            )
        except Exception as e:
            report = _stub_report(
                clip_id, f"OpenRouter vision call failed: {e}", n_frames=len(frames)
            )
            self._save(cache, report)
            return report

        parsed = _coerce_json(raw)
        if not parsed:
            report = _stub_report(
                clip_id, "vision model returned non-JSON", n_frames=len(frames)
            )
            report["raw_response_tail"] = raw[-500:] if raw else ""
            self._save(cache, report)
            return report

        report = _normalize_report(parsed, clip_id, len(frames))
        self._save(cache, report)
        return report

    @staticmethod
    def _save(path: Path, payload: dict) -> None:
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        except Exception:
            # Caching is best-effort; never let it crash the request.
            pass
