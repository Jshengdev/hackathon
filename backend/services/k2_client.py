from __future__ import annotations
import os
import re
import time
import itertools
import httpx
from dotenv import load_dotenv

load_dotenv()

# Per-call telemetry — every K2 hit logs a single line so we can tail
# /tmp/uvicorn-rerun.log and see exactly which Cerebras endpoint fired,
# how long it took, and where the budget went.
_K2_CALL_SEQ = itertools.count(1)

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

    async def chat(
        self,
        system: str,
        user: str,
        max_tokens: int = 80,
        tag: str = "?",
    ) -> str:
        if not self.api_key:
            return "[K2_API_KEY not set]"
        call_id = next(_K2_CALL_SEQ)
        # Identify the caller from the system prompt's first line if no tag given.
        # (swarm_runner, moderator, evaluator, k2-region all pass distinct prompts.)
        if tag == "?" and system:
            first = system.strip().splitlines()[0][:40].replace("\n", " ")
            tag = first

        # K2 IFM Think v2 is a reasoning model that emits long preamble before
        # the final answer (no <think> tags). Defenses:
        #   1. Append a directive that re-asserts the output contract.
        #   2. Append the user message with a "BEGIN FINAL ANSWER NOW" marker
        #      so we have a reliable splitter even if the model doesn't write
        #      "Final answer:" itself.
        #   3. Generous budget — measured: clean K2 calls use ~250 tokens;
        #      runaway-reasoning calls hit 3000+. Min 3500 keeps demo reliable.
        #      (We tested 1500 — output truncates before FINAL ANSWER and
        #      api.k2think.ai is ~50 tok/s regardless, so a smaller budget
        #      doesn't actually save wall-clock, it just kills quality.)
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

        endpoint = f"{self.base_url}/chat/completions"
        in_chars = len(system_with_directive) + len(user_with_marker)
        t_start = time.perf_counter()
        print(
            f"[k2 #{call_id:04d}] FIRE  POST {endpoint} model={self.model} "
            f"budget={budget} mt_hint={max_tokens} in={in_chars}c tag={tag!r}",
            flush=True,
        )
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(
                    endpoint,
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
        except Exception as e:
            dt = time.perf_counter() - t_start
            print(
                f"[k2 #{call_id:04d}] ERROR {dt:.2f}s tag={tag!r} err={type(e).__name__}: {e}",
                flush=True,
            )
            raise
        dt = time.perf_counter() - t_start
        try:
            resp.raise_for_status()
        except Exception as e:
            print(
                f"[k2 #{call_id:04d}] HTTP  status={resp.status_code} dt={dt:.2f}s tag={tag!r} body={resp.text[:200]!r}",
                flush=True,
            )
            raise
        body = resp.json()
        content = body["choices"][0]["message"]["content"]
        finish = body["choices"][0].get("finish_reason", "?")
        usage = body.get("usage") or {}
        prompt_toks = usage.get("prompt_tokens", "?")
        comp_toks = usage.get("completion_tokens", "?")
        # token rate = completion_tokens / dt — useful to verify api.k2think.ai
        # is the throttling layer (~50 tok/s) vs. our prompt being too long.
        try:
            rate = f"{int(comp_toks) / dt:.0f}t/s"
        except Exception:
            rate = "?"
        stripped = _strip_reasoning(content)
        truncated = "TRUNC" if finish in ("length", "max_tokens") else "OK"
        print(
            f"[k2 #{call_id:04d}] DONE  {dt:.2f}s {truncated} finish={finish} "
            f"in_tok={prompt_toks} out_tok={comp_toks} rate={rate} "
            f"raw={len(content)}c stripped={len(stripped)}c tag={tag!r}",
            flush=True,
        )
        return stripped
