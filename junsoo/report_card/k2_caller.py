"""Junsoo-side K2 caller for the Ironside report-card pipeline.

Adapted from _bmad/brain-swarm/backend/services/k2_client.py — copied (not
imported) to keep the junsoo/ slice self-contained. Two callers, same Cerebras
endpoint, different model param:

    K2ReasoningClient   -> K2 Think (reasoning model) for specialist observations.
                           Strips <think>...</think> wrappers, applies token-budget
                           headroom, asks for direct answer.

    InstructClient      -> Cerebras Llama-3.3-70B-Instruct for the structured-JSON
                           synthesis step. NO reasoning model here — that's the
                           bug documented in orchestrator.py:26-32. Instruct
                           models give us clean JSON without burning tokens on
                           chain-of-thought.

Env vars (shared with the live swarm so a single .env works for both):
    K2_API_KEY      required (Cerebras)
    K2_BASE_URL     default https://api.cerebras.ai/v1
    K2_MODEL        default k2-think-v2 (used by K2ReasoningClient)
    INSTRUCT_MODEL  default llama-3.3-70b (used by InstructClient — same endpoint)
"""
from __future__ import annotations

import os
import re
from pathlib import Path

import httpx
from dotenv import load_dotenv

# Search order:
#   1. junsoo/.env (preferred — lane-local config)
#   2. repo-root .env (fallback for shared keys)
#   3. default upward search from cwd
# Each load_dotenv() only sets vars that aren't already set, so earlier wins.
_JUNSOO_DIR = Path(__file__).resolve().parents[1]
_REPO_ROOT = _JUNSOO_DIR.parent
load_dotenv(_JUNSOO_DIR / ".env")
load_dotenv(_REPO_ROOT / ".env")
load_dotenv()  # default behaviour as last resort

_THINK_TAG_RE = re.compile(r"<think>.*?</think>", re.DOTALL | re.IGNORECASE)


def _strip_reasoning(text: str) -> str:
    """Strip K2 Think's reasoning wrappers / preamble."""
    text = _THINK_TAG_RE.sub("", text)
    if "</think>" in text:
        text = text.rsplit("</think>", 1)[1]
    text = text.strip()
    for marker in ("Final answer:", "FINAL ANSWER:", "Answer:", "ANSWER:"):
        idx = text.rfind(marker)
        if idx != -1:
            text = text[idx + len(marker):].strip()
    return text


class K2ReasoningClient:
    """K2 Think (reasoning) — for specialist observation calls."""

    def __init__(self) -> None:
        self.base_url = os.getenv("K2_BASE_URL", "https://api.cerebras.ai/v1")
        self.api_key = os.getenv("K2_API_KEY", "")
        self.model = os.getenv("K2_MODEL", "k2-think-v2")
        self.timeout = float(os.getenv("K2_TIMEOUT", "45.0"))

    async def chat(self, system: str, user: str, max_tokens: int = 140) -> str:
        if not self.api_key:
            # Raise rather than return a placeholder string — _call_one in
            # run_specialists catches it and produces a properly-tagged
            # "[<spec>: call failed]" entry. Returning a string here would
            # let "[K2_API_KEY not set]" leak through as a real specialist
            # observation and silently corrupt the synthesizer's input.
            raise RuntimeError("K2_API_KEY not set in environment / .env")

        # Same token-budget hack as the live swarm: reasoning model needs
        # headroom to think AND produce final answer. Strip the reasoning out.
        system_with_directive = (
            system
            + "\n\nIMPORTANT: Respond with ONLY the final answer in the format requested. "
            "Do not show your reasoning, do not preface with analysis, do not write 'Let me think'. "
            "Output the requested sentence and stop."
        )
        budget = max(max_tokens * 4, 800)

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_with_directive},
                        {"role": "user", "content": user},
                    ],
                    "max_tokens": budget,
                    "temperature": 0.7,
                },
            )
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]
            return _strip_reasoning(content)


class InstructClient:
    """Cerebras Llama-3.3-70B-Instruct for structured-JSON synthesis.

    Same endpoint as K2 (api.cerebras.ai); different model param. Reasoning
    model is wrong here — see orchestrator.py:26-32 for the K2 Think token-
    budget bug.

    `provider` kwarg is accepted for backwards compatibility with earlier
    callers but only "cerebras" is supported. Other values raise.
    """

    provider = "cerebras"

    def __init__(self, provider: str | None = None) -> None:
        if provider is not None and provider.lower() != "cerebras":
            raise ValueError(
                f"Only 'cerebras' is supported (got {provider!r}). "
                "Anthropic fallback was removed — set up a separate K2 key if "
                "you need redundancy."
            )
        self.base_url = os.getenv("K2_BASE_URL", "https://api.cerebras.ai/v1")
        self.api_key = os.getenv("K2_API_KEY", "")
        self.model = os.getenv("INSTRUCT_MODEL", "llama-3.3-70b")
        self.timeout = float(os.getenv("INSTRUCT_TIMEOUT", "60.0"))

    async def chat_json(
        self,
        system: str,
        user: str,
        max_tokens: int = 1500,
    ) -> str:
        """Returns raw response text (caller parses + retries on JSON failure)."""
        if not self.api_key:
            raise RuntimeError(
                "K2_API_KEY not set in environment / .env — required by "
                "InstructClient (Cerebras endpoint serves the instruct model)."
            )

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                    "max_tokens": max_tokens,
                    "temperature": 0.3,  # low temp for structured JSON
                },
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]
