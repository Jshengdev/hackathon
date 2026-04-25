---
file-type: pattern
status: verified
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/008-k2-think-as-speed-engine.md
cites-sources:
  - ../projects/greenchain.md
cross-links:
  - per-item-parallel-llm-evaluation.md
  - two-stage-llm-compile.md
  - witnessed-dissent.md
  - ../tools/k2-think.md
  - ../projects/greenchain.md
---

# Robust JSON from LLMs

**Three layers stacked: strict Pydantic + brace-balanced extractor + retry-with-correction loop. ~30 lines, parses anything, never trusts the wrapper.**

## When to reach for it

Any time an LLM is supposed to return structured output and you can't tolerate it occasionally returning prose, fenced markdown, or extra keys. Especially: tool-use loops, agent runtimes, scenario editors, any LLM-as-API-server pattern.

## The three layers

### Layer 1 — Strict Pydantic v2 with `extra="forbid"`

```python
class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")

class ScenarioEditIntentPayload(StrictModel):
    message: str
    op: Literal["filter", "undo", "reject"]
    undo_steps: int = Field(default=1, ge=1)
```

Every model in the contract inherits `StrictModel`. Bonus keys raise. Wrong types raise. `Literal[...]` is your friend.

### Layer 2 — Brace-balanced JSON extractor

The model will sometimes wrap JSON in ```` ```json ```` fences, prepend a sentence, or both. A regex isn't safe (strings can contain braces). Walk the text:

```python
def _extract_json_object_text(raw_content: str) -> str:
    text = raw_content.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        if lines and lines[0].startswith("```"): lines = lines[1:]
        if lines and lines[-1].strip() == "```":  lines = lines[:-1]
        text = "\n".join(lines).strip()
    if text.startswith("{"):
        return text
    start = text.find("{")
    if start == -1: raise ValueError("no JSON object")
    depth, in_string, escape = 0, False, False
    for i in range(start, len(text)):
        c = text[i]
        if in_string:
            if escape: escape = False
            elif c == "\\": escape = True
            elif c == '"': in_string = False
            continue
        if c == '"': in_string = True
        elif c == "{": depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0: return text[start:i+1]
    raise ValueError("unterminated JSON object")
```

Handles fenced blocks, leading prose, escape sequences, nested objects.

### Layer 3 — Retry-with-correction loop

On parse failure, append the raw assistant turn AND a user turn explaining the error back into the conversation, then retry. The model self-corrects more often than you'd expect.

```python
for attempt in range(1, 4):
    response = await client.post(url, headers=headers, json=request_body)
    content = response.json()["choices"][0]["message"]["content"]
    try:
        return ResponseModel.model_validate(json.loads(_extract_json_object_text(content)))
    except Exception as exc:
        parse_error = str(exc)
    if attempt < 3:
        conversation += [
            {"role": "assistant", "content": content},
            {"role": "user",      "content": f"Your previous response was invalid. Problem: {parse_error}. Return only valid JSON matching the required response schema."},
        ]
raise ProviderError(f"Failed after 3 attempts. Last error: {parse_error}")
```

## Why it works

Layer 1 catches schema drift loudly (better than letting bad data flow through). Layer 2 recovers from common formatting mistakes the model makes when it's "almost right." Layer 3 leverages the model's in-context-learning ability — once it sees the parse error, attempt 2 is usually clean.

You **don't need provider-side structured-output features** (OpenAI's `response_format`, Gemini's schema mode) — this works with any chat-completions endpoint, including K2 Think v2's, where structured output isn't yet a first-class feature.

## Real-code citations

- [`projects/greenchain.md`](../projects/greenchain.md) — `_call_k2_json` in `backend/scenario_editing.py` is the exact 3-attempt retry loop. `_extract_json_object_text` is the brace-balanced walker. All payloads inherit from `StrictModel`.

## Gotchas / failure modes

- **Don't retry forever.** 3 attempts is right. If the model fails 3 times, your prompt is wrong (not the model).
- **Don't lower temperature to 0** as the only fix. Temperature 0.1 + this loop is more robust than temperature 0 + no loop, because temperature 0 can lock the model into a wrong-but-confident response with no path out.
- **Watch for `content` being a list of parts** (some providers do this). GreenChain handles it: `if isinstance(content, list): content = "".join(p.get("text","") for p in content if isinstance(p, dict))`.
- **The retry user message must be terse.** Long error explanations make the model "explain" rather than "fix." "Your previous response was invalid. Problem: <error>. Return only valid JSON." is the right shape.

## Theme alignment

- **AI paradox / invisible use cases** — every Auditor diff in the witnessed-dissent pattern needs to be a *structured object* the UI can render, not prose. This pattern is the load-bearing parser for that structured stream. Without it, the swarm's disagreement degrades into unparseable monologue.

## Anti-theme alignment

- **Letting structured-output drift through to the UI silently** (no Pydantic strict-validation) lets trends slop leak into the demo as "the model said something that looked plausible." The discipline that catches schema drift loudly is the discipline that catches surface-confidence-decoupled-from-validity.

## Cross-links

- [`projects/greenchain.md`](../projects/greenchain.md)
- [`patterns/per-item-parallel-llm-evaluation.md`](per-item-parallel-llm-evaluation.md) (uses this as the inner call)
- [`tools/k2-think.md`](../tools/k2-think.md)
