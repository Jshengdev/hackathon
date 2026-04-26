"""Stage 1 — Vision-classification client (Qwen3-VL via OpenRouter).

Async wrapper for Stage 1 of the Empathy Layer Engine. Takes a video path
+ scenario name, returns a strict-schema VisionReport. Live calls go to
OpenRouter (Qwen3-VL); MOCK_VISION=1 returns hand-baked reports for known
fixture names so the rest of the pipeline is testable offline.

We deliberately do NOT import from junsoo/report_card/ — caltech/engine/ is
self-contained. Pattern (httpx + dotenv + raise-on-missing-key) follows
junsoo/report_card/k2_caller.py, copied not imported.

Env:
    OPENROUTER_API_KEY     required for live calls
    OPENROUTER_BASE_URL    default https://openrouter.ai/api/v1
    OPENROUTER_VISION_MODEL default qwen/qwen3-vl-235b-a22b-instruct
    MOCK_VISION=1          skip HTTP, return baked fixture report
"""
from __future__ import annotations

import base64
import json
import os
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict

# Search order: caltech/.env, repo-root .env, default upward search.
_CALTECH_DIR = Path(__file__).resolve().parents[1]
_REPO_ROOT = _CALTECH_DIR.parent
load_dotenv(_CALTECH_DIR / ".env")
load_dotenv(_REPO_ROOT / ".env")
load_dotenv()

DEFAULT_MODEL = "qwen/qwen3-vl-235b-a22b-instruct"
DEFAULT_BASE_URL = "https://openrouter.ai/api/v1"


class VisionReport(BaseModel):
    """Strict Stage 1 output schema. extra='forbid' so drift is caught early."""

    model_config = ConfigDict(extra="forbid")

    scene_summary: str
    actions: list[str]
    temporal_sequence: list[dict]
    spatial_relationships: list[dict]


# Hand-baked reports for fixture videos. Keys are matched against the
# video filename stem (case-insensitive). MOCK_VISION=1 picks from this map
# and falls back to a generic report if the stem is unknown — the goal is
# offline testability, not realism.
_MOCK_REPORTS: dict[str, dict[str, Any]] = {
    "ironsight_warehouse_demo": {
        "scene_summary": (
            "Warehouse worker scans inventory shelf, hesitates, then re-scans "
            "a single item before moving on."
        ),
        "actions": ["scan_shelf", "hesitate", "rescan_item", "advance_to_next_aisle"],
        "temporal_sequence": [
            {"t": 0.0, "event": "scanner_raised"},
            {"t": 4.2, "event": "scan_failed_indicator"},
            {"t": 6.8, "event": "rescan_attempted"},
            {"t": 9.1, "event": "advance_step"},
        ],
        "spatial_relationships": [
            {"subject": "worker", "object": "shelf_unit_3B", "relation": "in_front_of"},
            {"subject": "scanner", "object": "barcode_label", "relation": "aimed_at"},
        ],
    },
    "sideshift_consumer_demo": {
        "scene_summary": (
            "Person at kitchen counter pours coffee, glances at phone, sets cup down "
            "without drinking, returns to phone."
        ),
        "actions": ["pour_coffee", "glance_phone", "set_cup_down", "scroll_phone"],
        "temporal_sequence": [
            {"t": 0.0, "event": "pour_start"},
            {"t": 3.5, "event": "phone_glance"},
            {"t": 5.0, "event": "cup_placed_untouched"},
            {"t": 7.4, "event": "scroll_resume"},
        ],
        "spatial_relationships": [
            {"subject": "person", "object": "counter", "relation": "leaning_on"},
            {"subject": "phone", "object": "cup", "relation": "held_above"},
        ],
    },
}

_GENERIC_MOCK: dict[str, Any] = {
    "scene_summary": "Generic mock vision report (no fixture match).",
    "actions": ["unknown_action"],
    "temporal_sequence": [{"t": 0.0, "event": "scene_start"}],
    "spatial_relationships": [
        {"subject": "subject", "object": "environment", "relation": "within"}
    ],
}


def _baked_report_for(video_path: Path) -> VisionReport:
    stem = video_path.stem.lower()
    payload = _MOCK_REPORTS.get(stem, _GENERIC_MOCK)
    return VisionReport.model_validate(payload)


def _frame_to_data_url(video_path: Path) -> str:
    """Read the file bytes and return a base64 data URL.

    MVP: send the raw video bytes as an image_url data URL. Multi-frame
    sampling (decord / pyav) is the better play but adds heavy deps; the
    OpenRouter Qwen3-VL endpoint accepts multiple image_url blocks, so the
    upgrade path is "decode N frames, send N blocks".

    TODO(live): replace with proper frame sampling — e.g. decord every 2s,
    base64 each, append as separate {"type": "image_url"} blocks.
    """
    raw = video_path.read_bytes()
    b64 = base64.b64encode(raw).decode("ascii")
    # Best-effort mime guess — Qwen accepts video/* in some configs but
    # safe-default here is image/jpeg-style framing. Live integration must
    # confirm the exact accepted mime.
    return f"data:video/mp4;base64,{b64}"


class VisionClassifier:
    """Stage 1 client. async classify(video, scenario) -> VisionReport."""

    def __init__(self) -> None:
        self.base_url = os.getenv("OPENROUTER_BASE_URL", DEFAULT_BASE_URL)
        self.api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.model = os.getenv("OPENROUTER_VISION_MODEL", DEFAULT_MODEL)
        self.timeout = float(os.getenv("OPENROUTER_TIMEOUT", "30.0"))
        self.mock = os.getenv("MOCK_VISION", "") == "1"

    async def classify(
        self,
        video_path: Path,
        scenario: str,
        prompt_path: Path | None = None,
    ) -> VisionReport:
        """Run Stage 1.

        prompt_path: file containing the vision prompt (Agent 4 owns the
        content). Required for live; optional in mock mode.
        """
        if self.mock:
            return _baked_report_for(video_path)

        if not self.api_key:
            # Raise rather than return a placeholder — silent placeholder
            # corrupts downstream synthesis. (Same lesson as k2_caller.py.)
            raise RuntimeError(
                "OPENROUTER_API_KEY not set in environment / .env — required "
                "for live VisionClassifier.classify()."
            )

        if prompt_path is None:
            raise RuntimeError(
                "prompt_path is required for live mode (Agent 4 owns prompt content)."
            )
        prompt_text = Path(prompt_path).read_text(encoding="utf-8")

        data_url = _frame_to_data_url(video_path)
        user_content = [
            {"type": "text", "text": f"Scenario: {scenario}\n\n{prompt_text}"},
            {"type": "image_url", "image_url": {"url": data_url}},
        ]

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": [{"role": "user", "content": user_content}],
                    "temperature": 0.2,
                    "response_format": {"type": "json_object"},
                },
            )
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]

        # Qwen3-VL is asked for JSON; parse + schema-validate.
        try:
            parsed = json.loads(content)
        except json.JSONDecodeError as exc:
            raise RuntimeError(
                f"Stage 1 returned non-JSON content: {content[:200]!r}"
            ) from exc
        return VisionReport.model_validate(parsed)
