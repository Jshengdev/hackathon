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
    # Trailing-answer conventions. IFM K2 frequently writes "Thus final answer."
    # on its own line before the actual answer.
    for marker in (
        "Thus final answer.", "Thus final answer:",
        "Final answer.", "Final answer:",
        "FINAL ANSWER:", "FINAL ANSWER.",
        "Answer:", "ANSWER:",
    ):
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

        # K2 IFM Think v2 is a reasoning model that emits long preamble before
        # the final answer (no <think> tags). Defenses:
        #   1. Append a directive that re-asserts the output contract.
        #   2. Append the user message with a "BEGIN FINAL ANSWER NOW" marker
        #      so we have a reliable splitter even if the model doesn't write
        #      "Final answer:" itself.
        #   3. Generous budget — measured: clean K2 calls use ~250 tokens;
        #      runaway-reasoning calls hit 3000+. Min 3500 keeps demo reliable.
        #   4. Temperature 0.3 — same prompt should converge on roughly the
        #      same final answer instead of diverging into fresh tangents.
        system_with_directive = (
            system
            + "\n\nOUTPUT CONTRACT (NON-NEGOTIABLE):\n"
            "- Do NOT think out loud. Do NOT echo this prompt's format spec.\n"
            "- Do NOT write 'We need to', 'Let me think', 'Potential pitfalls', 'The user is asking', or any meta-commentary.\n"
            "- After your reasoning (if any), write the literal token 'FINAL ANSWER:' on its own line, then the three lines requested. Stop immediately after the third line."
        )
        user_with_marker = (
            user
            + "\n\nWrite 'FINAL ANSWER:' then the three lines. Nothing else."
        )
        budget = max(max_tokens * 8, 3500)

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
                        {"role": "user", "content": user_with_marker},
                    ],
                    "max_tokens": budget,
                    "temperature": 0.3,
                },
            )
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]
            return _strip_reasoning(content)
