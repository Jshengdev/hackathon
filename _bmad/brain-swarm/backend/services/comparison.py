"""TRIBE-vs-no-TRIBE comparison.

Two analysis passes against the same vision report — one blind, one with
per-second Yeo7 network activations from TRIBE — so the demo can show how
neural priors change the LLM's interpretation.

Both passes use the same vision-model API (defaults to Anthropic Claude). We
do NOT call K2 here: K2 is reserved for the per-region/per-paper grounded
calls in /demo/k2-region. Comparison is whole-clip narrative, which the
generalist model handles more cleanly.

Results land in junsoo/prerendered/{clip_id}/comparison.json:
    {"without_tribe": {...}, "with_tribe": {...}}
"""
from __future__ import annotations

import asyncio
import json
import os
import re
from pathlib import Path
from typing import Optional

try:
    import httpx
except Exception:
    httpx = None  # type: ignore


# ---------------------------------------------------------------------------
# Output schema + JSON coercion
# ---------------------------------------------------------------------------

_BASE_KEYS = [
    "summary",
    "emotional_assessment",
    "cognitive_processes",
    "attention_focus",
    "predictions",
]

_JSON_FENCE_RE = re.compile(r"```(?:json)?\s*(\{.*?\})\s*```", re.DOTALL | re.IGNORECASE)


def _coerce_json(text: str) -> Optional[dict]:
    if not text:
        return None
    m = _JSON_FENCE_RE.search(text)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass
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
# Activity summary helpers
# ---------------------------------------------------------------------------

def _summarize_activity(activity: dict) -> dict:
    """Compute summary stats over an activity.json blob.

    Produces a compact description that the LLM can reason over without us
    pasting all 30 frames into the prompt.
    """
    frames = activity.get("frames", []) or []
    if not frames:
        return {"n_frames": 0}

    networks = sorted({k for f in frames for k in (f.get("regions") or {})})
    # Per-network mean + peak time
    means: dict[str, float] = {}
    peaks: dict[str, dict] = {}
    for net in networks:
        vals = [(i, float(f.get("regions", {}).get(net, 0.0))) for i, f in enumerate(frames)]
        if not vals:
            continue
        means[net] = sum(v for _, v in vals) / len(vals)
        peak_idx, peak_val = max(vals, key=lambda x: x[1])
        peaks[net] = {"t": peak_idx, "value": round(peak_val, 3)}

    # Dominant network per frame and where each network "wins"
    dominance: dict[str, list[int]] = {n: [] for n in networks}
    for i, f in enumerate(frames):
        regions = f.get("regions") or {}
        if not regions:
            continue
        top = max(regions, key=lambda k: regions[k])
        if top in dominance:
            dominance[top].append(i)

    # VAN spike timestamps — useful event-boundary signal
    van_spikes: list[int] = []
    if "ventral_attention" in networks:
        # Use a dynamic threshold: mean + 1*sd, or fall back to 0.6 if no sd.
        van_vals = [float(f.get("regions", {}).get("ventral_attention", 0.0)) for f in frames]
        if van_vals:
            mu = sum(van_vals) / len(van_vals)
            sd = (sum((v - mu) ** 2 for v in van_vals) / len(van_vals)) ** 0.5
            thresh = max(0.6, mu + sd) if sd > 0 else 0.6
            van_spikes = [i for i, v in enumerate(van_vals) if v >= thresh]

    # DMN/DAN balance — mean(DMN) - mean(DAN). Positive = internally focused.
    dmn_dan_balance = None
    if "default_mode" in means and "dorsal_attention" in means:
        dmn_dan_balance = round(means["default_mode"] - means["dorsal_attention"], 3)

    return {
        "n_frames": len(frames),
        "networks": networks,
        "mean_activation": {k: round(v, 3) for k, v in means.items()},
        "peaks": peaks,
        "dominance_count": {k: len(v) for k, v in dominance.items()},
        "van_spike_seconds": van_spikes,
        "dmn_dan_balance": dmn_dan_balance,
    }


def _format_per_second_table(activity: dict, max_rows: int = 40) -> str:
    """Compact per-second table the LLM can read top-to-bottom."""
    frames = activity.get("frames", []) or []
    if not frames:
        return "(no frames)"
    networks = sorted({k for f in frames for k in (f.get("regions") or {})})
    short = {
        "visual": "VIS",
        "somatomotor": "SM",
        "dorsal_attention": "DAN",
        "ventral_attention": "VAN",
        "limbic": "LIM",
        "frontoparietal": "FPCN",
        "default_mode": "DMN",
    }
    header = "t_s  " + "  ".join(short.get(n, n[:4]) for n in networks)
    lines = [header]
    for i, f in enumerate(frames[:max_rows]):
        regions = f.get("regions") or {}
        row = f"{i:>3}  " + "  ".join(f"{regions.get(n, 0.0):+.2f}" for n in networks)
        lines.append(row)
    if len(frames) > max_rows:
        lines.append(f"... ({len(frames) - max_rows} more frames omitted)")
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Provider call (Anthropic / OpenAI / Gemini — text-only, no images)
# ---------------------------------------------------------------------------

async def _call_anthropic(
    api_key: str, model: str, system: str, user: str, timeout: float = 60.0
) -> str:
    if httpx is None:
        raise RuntimeError("httpx not available")
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
                "messages": [{"role": "user", "content": user}],
            },
        )
        resp.raise_for_status()
        for b in resp.json().get("content", []):
            if b.get("type") == "text":
                return b.get("text", "")
        return ""


async def _call_openai(
    api_key: str, model: str, system: str, user: str, timeout: float = 60.0
) -> str:
    if httpx is None:
        raise RuntimeError("httpx not available")
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": model,
                "max_tokens": 2000,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
            },
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


async def _call_gemini(
    api_key: str, model: str, system: str, user: str, timeout: float = 60.0
) -> str:
    if httpx is None:
        raise RuntimeError("httpx not available")
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
                "contents": [{"role": "user", "parts": [{"text": user}]}],
                "generationConfig": {"maxOutputTokens": 2000},
            },
        )
        resp.raise_for_status()
        try:
            return resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            return ""


async def _llm_call(system: str, user: str) -> str:
    """Dispatch to the configured vision/comparison model. Reuses VISION_*
    env vars so frontend devs only need to set one API key."""
    api_key = os.getenv("VISION_API_KEY", "")
    provider = os.getenv("VISION_PROVIDER", "anthropic").lower().strip()
    default_model = {
        "anthropic": "claude-sonnet-4-5",
        "openai": "gpt-4o",
        "gemini": "gemini-1.5-flash",
    }.get(provider, "claude-sonnet-4-5")
    model = os.getenv("VISION_MODEL", default_model)
    timeout = float(os.getenv("VISION_TIMEOUT", "60.0"))

    if not api_key:
        raise RuntimeError("no API key (VISION_API_KEY)")
    if provider == "anthropic":
        return await _call_anthropic(api_key, model, system, user, timeout)
    if provider == "openai":
        return await _call_openai(api_key, model, system, user, timeout)
    if provider == "gemini":
        return await _call_gemini(api_key, model, system, user, timeout)
    raise RuntimeError(f"unknown provider: {provider}")


# ---------------------------------------------------------------------------
# Stub fallbacks
# ---------------------------------------------------------------------------

def _stub(reason: str, *, with_tribe: bool, vision_report: dict) -> dict:
    summary = vision_report.get("scene_summary", "(no scene summary)")
    base = {
        "summary": f"[stub — {reason}] {summary}",
        "emotional_assessment": vision_report.get("emotional_tone", "neutral"),
        "cognitive_processes": [
            "perception",
            "attention",
            "memory_retrieval",
        ],
        "attention_focus": "Whatever the most salient on-screen object is.",
        "predictions": [
            "Subject continues observing the scene.",
            "No major reorientation expected.",
        ],
        "stub": True,
        "error": reason,
    }
    if with_tribe:
        base["neural_signatures"] = {
            "note": "stub — no API key configured",
            "dominant_networks": [],
        }
    return base


# ---------------------------------------------------------------------------
# Prompt builders
# ---------------------------------------------------------------------------

_SCHEMA_BLOCK_BASE = (
    "{\n"
    '  "summary": one or two sentence overall psychological/cognitive read,\n'
    '  "emotional_assessment": short string,\n'
    '  "cognitive_processes": array of short strings (e.g. "working_memory", "social_inference"),\n'
    '  "attention_focus": short string describing what is being attended to,\n'
    '  "predictions": array of strings — short forward predictions about what likely happens next or what the subject is likely to do/feel\n'
    "}"
)

_SCHEMA_BLOCK_TRIBE = (
    "{\n"
    '  "summary": one or two sentence overall psychological/cognitive read informed by the neural data,\n'
    '  "emotional_assessment": short string grounded in limbic activation,\n'
    '  "cognitive_processes": array of short strings,\n'
    '  "attention_focus": short string,\n'
    '  "predictions": array of strings,\n'
    '  "neural_signatures": {\n'
    '    "dominant_networks": array of {network, evidence (one sentence)},\n'
    '    "van_event_boundaries": array of integers (seconds) where ventral attention spiked,\n'
    '    "dmn_dan_pattern": short string ("externally_focused" / "internally_focused" / "mixed"),\n'
    '    "interpretation": one paragraph tying the neural pattern to the scene\n'
    '  }\n'
    "}"
)

_SYS_NO_TRIBE = (
    "You are a cognitive scientist analyzing a short video clip from the "
    "viewpoint of an observer/subject. You will be given a structured vision "
    "report describing the clip. Produce a compact JSON analysis matching "
    "the schema in the user message. Return ONLY the JSON object — no "
    "markdown fences, no commentary."
)

_SYS_TRIBE = (
    "You are a cognitive neuroscientist. You will be given (a) a structured "
    "vision report of a short video clip, and (b) per-second Yeo 7-network "
    "activations predicted by the TRIBE foundation model (Meta, 2026) plus "
    "summary statistics. Use the neural data to ground your interpretation: "
    "tie cognitive claims to specific networks, highlight where ventral "
    "attention (VAN) spikes mark event boundaries, comment on DMN vs DAN "
    "balance, and flag any sensory-vs-narrative dissociation. Output ONLY a "
    "JSON object matching the schema in the user message — no markdown, no "
    "commentary."
)


def _build_user_no_tribe(vision_report: dict) -> str:
    return (
        "Vision report:\n"
        f"{json.dumps(vision_report, indent=2)}\n\n"
        "Return JSON matching exactly this schema:\n"
        f"{_SCHEMA_BLOCK_BASE}"
    )


def _build_user_with_tribe(vision_report: dict, activity: dict) -> str:
    summary = _summarize_activity(activity)
    table = _format_per_second_table(activity)
    return (
        "Vision report:\n"
        f"{json.dumps(vision_report, indent=2)}\n\n"
        "TRIBE Yeo7 network summary stats:\n"
        f"{json.dumps(summary, indent=2)}\n\n"
        "Per-second Yeo7 activations (signed normalized units):\n"
        f"{table}\n\n"
        "Return JSON matching exactly this schema:\n"
        f"{_SCHEMA_BLOCK_TRIBE}"
    )


# ---------------------------------------------------------------------------
# Public entry points
# ---------------------------------------------------------------------------

async def analyze_without_tribe(vision_report: dict) -> dict:
    """Pure-vision read — no neural data."""
    try:
        raw = await _llm_call(_SYS_NO_TRIBE, _build_user_no_tribe(vision_report))
    except Exception as e:
        return _stub(str(e), with_tribe=False, vision_report=vision_report)
    parsed = _coerce_json(raw)
    if not parsed:
        stub = _stub("LLM returned non-JSON", with_tribe=False, vision_report=vision_report)
        stub["raw_response_tail"] = raw[-500:] if raw else ""
        return stub
    # Make sure all expected keys are present (model sometimes omits "predictions")
    for k in _BASE_KEYS:
        parsed.setdefault(k, "" if k != "predictions" and k != "cognitive_processes" else [])
    parsed.setdefault("stub", False)
    return parsed


async def analyze_with_tribe(vision_report: dict, activity_json: dict) -> dict:
    """TRIBE-grounded read — same model, neural data appended to prompt."""
    try:
        raw = await _llm_call(
            _SYS_TRIBE, _build_user_with_tribe(vision_report, activity_json)
        )
    except Exception as e:
        return _stub(str(e), with_tribe=True, vision_report=vision_report)
    parsed = _coerce_json(raw)
    if not parsed:
        stub = _stub("LLM returned non-JSON", with_tribe=True, vision_report=vision_report)
        stub["raw_response_tail"] = raw[-500:] if raw else ""
        return stub
    for k in _BASE_KEYS:
        parsed.setdefault(k, "" if k not in ("predictions", "cognitive_processes") else [])
    parsed.setdefault("neural_signatures", {})
    parsed.setdefault("stub", False)
    return parsed


async def run_comparison(
    vision_report: dict, activity_json: dict, cache_path: Path
) -> dict:
    """Run both analyses concurrently and cache the result."""
    if cache_path.exists():
        try:
            return json.loads(cache_path.read_text(encoding="utf-8"))
        except Exception:
            pass

    without_t, with_t = await asyncio.gather(
        analyze_without_tribe(vision_report),
        analyze_with_tribe(vision_report, activity_json),
    )
    result = {"without_tribe": without_t, "with_tribe": with_t}
    try:
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    except Exception:
        pass
    return result
