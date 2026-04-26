"""Vision LLM client.

Wraps a vision-capable LLM (default: Anthropic Claude) and turns an MP4 into a
structured "vision report" JSON describing what is happening in the clip.

Strategy for keeping this demo-reliable:
  1. Extract 5 evenly-spaced frames from the video as JPEG bytes (cv2 →
     ffmpeg fallback → black-frame stub) so we never have to upload a full
     MP4 to the model.
  2. Send the frames + a structured prompt asking for a JSON report.
  3. Cache the result to backend/prerendered/{clip_id}/vision_report.json so
     subsequent calls are instant.

If no API key is configured we still emit a stub report flagged with
`"stub": true` so the frontend can render something.
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
        # ffmpeg -i ... -vf "select='not(mod(n\,K))'" doesn't work without total
        # count. Instead, use -vf "fps=N/D" with total duration, or just use
        # thumbnail filter. Simpler: use -vf select with even time-stamps.
        # Easiest: -vf "fps=N/duration" requires duration. We use the
        # `thumbnail` + `-frames:v` combo which is fast and predictable.
        cmd = [
            "ffmpeg",
            "-y",
            "-i",
            str(video_path),
            "-vf",
            f"thumbnail,scale=640:-1",
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
    "You are a careful visual-scene analyst. You will receive a few evenly-"
    "spaced frames from a short video clip. Describe what is happening in "
    "the clip and infer the task or activity the people in it are performing. "
    "Respond ONLY with a single valid JSON object matching the schema given "
    "in the user message. Do not wrap it in markdown fences. Do not add prose."
)


def _build_user_prompt(clip_id: str) -> str:
    return (
        f'Clip ID: "{clip_id}". Below are 5 frames from the clip in temporal order.\n'
        "Return a JSON object with EXACTLY these keys:\n"
        "{\n"
        '  "clip_id": string,\n'
        '  "task_type": short snake_case label (e.g. "construction_site_navigation"),\n'
        '  "scene_summary": one or two sentence overview,\n'
        '  "actions": array of {t_start (seconds, integer), t_end, verb, description},\n'
        '  "objects": array of strings,\n'
        '  "people": array of {role, count},\n'
        '  "environment": short string,\n'
        '  "emotional_tone": short string,\n'
        '  "raw_analysis": one long paragraph describing the clip\n'
        "}\n"
        "Times in `actions` should be reasonable estimates over a ~30 second clip.\n"
        "Return JSON ONLY. No commentary, no markdown."
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
        # naive bracket counting (good enough for well-formed model JSON)
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
# Stub fallbacks (no API key)
# ---------------------------------------------------------------------------

def _stub_report(clip_id: str, reason: str) -> dict:
    return {
        "clip_id": clip_id,
        "task_type": "unknown_clip",
        "scene_summary": (
            f"[stub vision report — {reason}] A short video clip whose contents "
            "could not be analyzed because no vision model was configured."
        ),
        "actions": [
            {"t_start": 0, "t_end": 10, "verb": "observe",
             "description": "Subject views the clip from start."},
            {"t_start": 10, "t_end": 20, "verb": "track",
             "description": "Continuous engagement through the middle of the clip."},
            {"t_start": 20, "t_end": 30, "verb": "conclude",
             "description": "Final segment of the clip."},
        ],
        "objects": [],
        "people": [],
        "environment": "unspecified",
        "emotional_tone": "neutral",
        "raw_analysis": (
            "Vision analysis unavailable. Configure VISION_API_KEY to enable "
            "frame-level scene description for this clip."
        ),
        "stub": True,
        "error": reason,
    }


# ---------------------------------------------------------------------------
# Provider calls
# ---------------------------------------------------------------------------

async def _call_anthropic(
    api_key: str,
    model: str,
    system: str,
    user: str,
    frames: list[bytes],
    timeout: float = 60.0,
) -> str:
    if httpx is None:
        raise RuntimeError("httpx not available")
    content: list[dict] = []
    for jpg in frames:
        b64 = base64.standard_b64encode(jpg).decode("ascii")
        content.append({
            "type": "image",
            "source": {"type": "base64", "media_type": "image/jpeg", "data": b64},
        })
    content.append({"type": "text", "text": user})
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": model,
                "max_tokens": 2000,
                "system": system,
                "messages": [{"role": "user", "content": content}],
            },
        )
        resp.raise_for_status()
        data = resp.json()
        # Anthropic returns content as a list of {type, text} blocks.
        blocks = data.get("content", [])
        for b in blocks:
            if b.get("type") == "text":
                return b.get("text", "")
        return ""


async def _call_openai(
    api_key: str,
    model: str,
    system: str,
    user: str,
    frames: list[bytes],
    timeout: float = 60.0,
) -> str:
    if httpx is None:
        raise RuntimeError("httpx not available")
    user_content: list[dict] = [{"type": "text", "text": user}]
    for jpg in frames:
        b64 = base64.standard_b64encode(jpg).decode("ascii")
        user_content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{b64}"},
        })
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "max_tokens": 2000,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user_content},
                ],
            },
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


async def _call_gemini(
    api_key: str,
    model: str,
    system: str,
    user: str,
    frames: list[bytes],
    timeout: float = 60.0,
) -> str:
    if httpx is None:
        raise RuntimeError("httpx not available")
    parts: list[dict] = [{"text": user}]
    for jpg in frames:
        b64 = base64.standard_b64encode(jpg).decode("ascii")
        parts.append({"inline_data": {"mime_type": "image/jpeg", "data": b64}})
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={api_key}"
    )
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(
            url,
            headers={"Content-Type": "application/json"},
            json={
                "system_instruction": {"parts": [{"text": system}]},
                "contents": [{"role": "user", "parts": parts}],
                "generationConfig": {"maxOutputTokens": 2000},
            },
        )
        resp.raise_for_status()
        data = resp.json()
        try:
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            return ""


# ---------------------------------------------------------------------------
# Public client
# ---------------------------------------------------------------------------

class VisionClient:
    """Async vision client with caching + provider abstraction."""

    def __init__(self):
        self.api_key = os.getenv("VISION_API_KEY", "")
        self.provider = os.getenv("VISION_PROVIDER", "anthropic").lower().strip()
        # Sensible per-provider default models.
        default_model = {
            "anthropic": "claude-sonnet-4-5",
            "openai": "gpt-4o",
            "gemini": "gemini-1.5-flash",
        }.get(self.provider, "claude-sonnet-4-5")
        self.model = os.getenv("VISION_MODEL", default_model)
        self.timeout = float(os.getenv("VISION_TIMEOUT", "60.0"))

    @staticmethod
    def cache_path(clip_dir: Path) -> Path:
        return clip_dir / "vision_report.json"

    async def analyze_video(self, video_path: Path, clip_id: str) -> dict:
        """Return a vision report for the clip. Reads cache first."""
        clip_dir = video_path.parent
        cache = self.cache_path(clip_dir)
        if cache.exists():
            try:
                return json.loads(cache.read_text(encoding="utf-8"))
            except Exception:
                pass  # corrupted cache → re-generate

        if not self.api_key:
            report = _stub_report(clip_id, "no API key")
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

        system = _VISION_SYSTEM
        user = _build_user_prompt(clip_id)

        try:
            if self.provider == "anthropic":
                raw = await _call_anthropic(
                    self.api_key, self.model, system, user, frames, self.timeout
                )
            elif self.provider == "openai":
                raw = await _call_openai(
                    self.api_key, self.model, system, user, frames, self.timeout
                )
            elif self.provider == "gemini":
                raw = await _call_gemini(
                    self.api_key, self.model, system, user, frames, self.timeout
                )
            else:
                report = _stub_report(clip_id, f"unknown provider: {self.provider}")
                self._save(cache, report)
                return report
        except Exception as e:
            report = _stub_report(clip_id, f"vision API call failed: {e}")
            self._save(cache, report)
            return report

        parsed = _coerce_json(raw)
        if not parsed:
            report = _stub_report(clip_id, "vision model returned non-JSON")
            report["raw_response_tail"] = raw[-500:] if raw else ""
            self._save(cache, report)
            return report

        # Force the clip_id we know so callers can rely on it.
        parsed["clip_id"] = clip_id
        parsed.setdefault("stub", False)
        self._save(cache, parsed)
        return parsed

    @staticmethod
    def _save(path: Path, payload: dict) -> None:
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        except Exception:
            # Caching is best-effort; never let it crash the request.
            pass
