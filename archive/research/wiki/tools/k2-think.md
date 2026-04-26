# K2 Think v2

**MBZUAI's reasoning model. OpenAI-compatible chat-completions API. The "structured ambiguous reasoning" specialist in our two-project sample.**

- Canonical model string: `MBZUAI-IFM/K2-Think-v2`
- Base URL: `https://api.k2think.ai/v1` → POST `/chat/completions`
- Auth: `Authorization: Bearer <K2THINK_API_KEY>`, `Content-Type: application/json`, `accept: application/json`
- Request body shape (OpenAI-compatible):
  ```json
  {"model": "MBZUAI-IFM/K2-Think-v2",
   "messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}],
   "stream": false,
   "temperature": 0.1}
  ```
- Response: standard `choices[0].message.content`. Sometimes returns content as a list of parts (`[{"text": "..."}]`); GreenChain handles by joining `part.get("text", "")`.

## When to reach for it (over GPT-5 / Sonnet / Gemini)

- **Structured judgment over ambiguous prompts.** "Should this manufacturer survive a filter that says 'ISO-certified'?" — K2 reasons about what the user *probably* meant rather than keyword-matching.
- **Constrained DSL compilation.** Plan-prose → `move_to(...) / grasp(...) / lift(...)`. K2 produces parse-safe output reliably (BRIDGE relies on this, no retry logic needed in their hack-grade implementation).
- **Per-item parallel evaluation.** One small focused decision per call; K2's structured output stays tight even at concurrency 6.

## When **not** to reach for it

- **Long synthesis.** Multi-section markdown report with tables — Gemma 4 / Sonnet are better and won't over-think.
- **Tool use.** K2's chat-completions endpoint doesn't expose first-class tool/function calling here — use Claude Sonnet via Dedalus or OpenAI Agents SDK.
- **Vision.** No image input on the chat endpoint surface seen in the wild so far. Pair with Gemini for multimodal.

## Real-code citations

- [`projects/bridge.md`](../projects/bridge.md) — `llm.py::k2_compile`: minimal raw-`requests.post` integration. Strips ` ```python ` / ` ``` ` fences, returns the bare DSL string. ~50 LOC.
- [`projects/greenchain.md`](../projects/greenchain.md) — `backend/scenario_editing.py`: full async `httpx` integration with timeout config, retry-with-correction loop, brace-balanced JSON extractor, Pydantic validation. The reference implementation for production-shaped K2 use.

## Integration template (lift this)

```python
import os, json, httpx
from pydantic import BaseModel, ConfigDict, Field

class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")

class Decision(StrictModel):
    decision: str = Field(pattern="^(keep|remove)$")
    reason: str

async def k2_decide(prompt: str, item_payload: dict) -> Decision:
    headers = {
        "Authorization": f"Bearer {os.environ['K2THINK_API_KEY']}",
        "Content-Type":  "application/json",
        "accept":        "application/json",
    }
    body = {
        "model": "MBZUAI-IFM/K2-Think-v2",
        "messages": [
            {"role": "system", "content": "Decide keep/remove. Return JSON only: {\"decision\": \"keep|remove\", \"reason\": \"...\"}"},
            {"role": "user",   "content": json.dumps({"prompt": prompt, "item": item_payload})},
        ],
        "stream": False,
        "temperature": 0.1,
    }
    async with httpx.AsyncClient(timeout=120) as client:
        r = await client.post("https://api.k2think.ai/v1/chat/completions", headers=headers, json=body)
        r.raise_for_status()
    content = r.json()["choices"][0]["message"]["content"]
    if isinstance(content, list):
        content = "".join(p.get("text","") for p in content if isinstance(p, dict))
    # ... pair with patterns/robust-json-from-llms.md for the extractor + retry loop
    return Decision.model_validate(json.loads(content))
```

Wrap the inside of `async with httpx.AsyncClient(...)` in `_call_k2_json` from GreenChain (`patterns/robust-json-from-llms.md`) for production robustness.

## Sponsor leverage at HackTech 2026

K2 Think is a sponsor of HackTech 2026 (verify track + prize amount once `_2026-sponsorship-footprint.md` re-runs successfully). The clearest "best use of K2" angles, given what works in real winning projects:

1. **DSL compiler** for any safety-sensitive action surface (BRIDGE shape).
2. **Two-pass cascade** — intent classifier + per-item evaluator (GreenChain shape).
3. **Audit-grade reasoning** — every K2 call returns a `reason` field that you surface to the user, turning K2's reasoning chain into the product's transparency feature.

## Gotchas

- **Empty `content`** → check for a list-of-parts response shape, not just a string.
- **Fenced code blocks** in output → strip ` ``` ` / ` ```python ` defensively even when you ask for "JSON only."
- **Latency** is provider-dependent and can spike. Always set `timeout` explicitly (GreenChain uses 120s); never rely on httpx defaults.
- **`stream: True`** is documented but neither sample project uses it. If you stream, the JSON-extraction pattern needs adjustment.

## Cross-links

- [`projects/bridge.md`](../projects/bridge.md)
- [`projects/greenchain.md`](../projects/greenchain.md)
- [`patterns/two-stage-llm-compile.md`](../patterns/two-stage-llm-compile.md)
- [`patterns/robust-json-from-llms.md`](../patterns/robust-json-from-llms.md)
- [`patterns/per-item-parallel-llm-evaluation.md`](../patterns/per-item-parallel-llm-evaluation.md)
