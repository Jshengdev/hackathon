from __future__ import annotations
import os
import re
import httpx
from dotenv import load_dotenv

load_dotenv()

# K2 Think is a reasoning model — it can emit chain-of-thought either inline
# or wrapped in <think>...</think> tags before the final answer. Strip those
# wrappers so the swarm UI shows just the final sentence.
_THINK_TAG_RE = re.compile(r"<think>.*?</think>", re.DOTALL | re.IGNORECASE)


def _strip_reasoning(text: str) -> str:
    # Full <think>...</think> blocks (when both tags are present)
    text = _THINK_TAG_RE.sub("", text)
    # K2 Think often emits the reasoning *bare* and only closes with </think>
    # — so split on the closing tag and keep what follows.
    if "</think>" in text:
        text = text.rsplit("</think>", 1)[1]
    text = text.strip()
    # Trailing-answer conventions
    for marker in ("Final answer:", "FINAL ANSWER:", "Answer:", "ANSWER:"):
        idx = text.rfind(marker)
        if idx != -1:
            text = text[idx + len(marker):].strip()
    return text


class K2Client:
    def __init__(self):
        self.base_url = os.getenv("K2_BASE_URL", "https://api.cerebras.ai/v1")
        self.api_key = os.getenv("K2_API_KEY", "")
        self.model = os.getenv("K2_MODEL", "k2-think-v2")
        self.timeout = float(os.getenv("K2_TIMEOUT", "45.0"))

    async def chat(self, system: str, user: str, max_tokens: int = 80) -> str:
        if not self.api_key:
            return "[K2_API_KEY not set]"

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
                    "temperature": 0.7,
                },
            )
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]
            return _strip_reasoning(content)
