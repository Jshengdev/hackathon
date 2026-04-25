---
file-type: pattern
status: verified
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/008-k2-think-as-speed-engine.md
  - ../decisions/017-ironside-report-card-as-junsoo-wrapper.md
cites-sources:
  - junsoo/report_card/k2_caller.py
  - junsoo/report_card/synthesize.py
  - _bmad/brain-swarm/backend/services/orchestrator.py
  - _bmad/brain-swarm/backend/services/k2_client.py
cross-links:
  - robust-json-from-llms.md
  - per-item-parallel-llm-evaluation.md
  - two-stage-llm-compile.md
  - witnessed-dissent.md
  - spatial-sidecar.md
  - ../tools/k2-think.md
---

# K2 reasoning + instruct synthesis (split the model by job)

**Use a reasoning model (K2 Think) for parallel hypothesis generation, then a fast instruct model (Llama-3.3-Instruct, Haiku) for the structured-JSON synthesis step. Don't let one model do both jobs — reasoning models burn their token budget thinking and emit truncated JSON.**

## When to reach for it

You have a swarm-shaped flow where:
1. Multiple specialists / agents each need to **reason** about partial evidence (good fit for chain-of-thought / reasoning models).
2. A downstream synthesizer must combine those outputs into **strict structured output** (JSON with required keys, numeric scores, categorical enums).

Single-model attempts to do both fail in characteristic ways. This pattern splits the workload.

## Why one model doesn't work

K2 Think is a reasoning model. Given a structured-JSON system prompt, it correctly *reasons through* the rubric — and burns the token budget doing so. The final JSON gets truncated mid-key.

Documented in `_bmad/brain-swarm/backend/services/orchestrator.py:26-32`:

> "deliberately *not* loading the rich `papers/prompts/moderator.md`. That prompt asks for structured JSON output (mode/valence/summary/boundary/flags) plus a long decision rubric. K2 Think is a reasoning model and burns its entire token budget reasoning through that rubric, so the swarm UI silently shows incomplete output."

The team's first fix was to **drop the structured-JSON requirement** (one-sentence moderator instead). That works for the live B2C demo, but loses the auditable structure that B2B judges (Ironside) demand.

## The pattern

```
   ┌─────────────────────────────────┐
   │ Round 1: parallel specialists   │
   │ MODEL = K2 Think (reasoning)    │
   │   - one specialist per agent    │
   │   - each can use chain-of-thought
   │   - output: short prose         │
   │   - strip <think>...</think>    │
   │     wrappers from response      │
   └────────┬────────────────────────┘
            │ N text observations
            ▼
   ┌─────────────────────────────────┐
   │ Round 2: synthesis              │
   │ MODEL = Llama-3.3-70B-Instruct  │
   │         (or Claude Haiku)        │
   │   - sees all N observations     │
   │   - rubric + scoring schema     │
   │   - output: strict JSON         │
   │   - retry-with-feedback on parse fail
   └─────────────────────────────────┘
```

Same Cerebras endpoint serves both — only the `model` field changes. No second API integration required for the primary path.

## Real code (this repo)

`junsoo/report_card/k2_caller.py` ships two clients sharing one `.env`:

```python
class K2ReasoningClient:
    """K2 Think — for specialist observation calls (reasoning OK)."""
    def __init__(self):
        self.model = os.getenv("K2_MODEL", "k2-think-v2")
        # ... appends "respond directly, no preamble" directive
        # ... 4× token-budget headroom; strips <think> wrappers

class InstructClient:
    """Cerebras Llama-3.3 (default) or Anthropic Haiku (fallback) — for JSON synthesis."""
    def __init__(self, provider=None):
        self.provider = provider or os.getenv("INSTRUCT_PROVIDER", "cerebras")
        if self.provider == "cerebras":
            self.model = os.getenv("INSTRUCT_MODEL", "llama-3.3-70b")
        elif self.provider == "anthropic":
            self.model = os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5-20251001")
```

`junsoo/report_card/synthesize.py` retries on parse failure once with feedback, then degrades to a schema-valid placeholder card with `archetype_state="parse_failure"` so the pipeline doesn't abort mid-render.

## Variants

- **Same provider, two models.** Cheapest. Cerebras hosts both K2 Think and Llama-3.3-70B-Instruct; one API key, two `model` strings.
- **Different providers.** Use when one provider has the better reasoning tier and another has the better structured-output tier. Costs an extra integration but improves reliability.
- **Three-stage** (reasoning → instruct → schema validator). Add a third local-only step that re-prompts with feedback if Pydantic / jsonschema rejects. See [`robust-json-from-llms.md`](robust-json-from-llms.md).

## Why it works

- **Right tool for right job.** Reasoning models are slow but deep; instruct models are fast and obedient. Don't ask the deep one to be fast or the fast one to be deep.
- **Separates concerns the model can't separate alone.** A single prompt can't reliably gate "spend tokens reasoning" against "save tokens for output." Two prompts on two models can.
- **Cheap fallback on the synthesis side.** Haiku ($0.80/MT input) is the most reliable JSON-emitter on the market and adds <1s of latency. Worth the budget if Cerebras-Llama hits rate limits mid-demo.

## Gotchas / failure modes

- **`max_tokens` on the reasoning model still matters.** Even with the directive to "respond directly," K2 Think wants to think. Set `max_tokens = 4 × desired_output` and strip `<think>` wrappers post-hoc. (See `K2ReasoningClient.chat` for the exact pattern.)
- **Instruct models still wrap JSON in markdown fences sometimes.** Strip ```` ```json ... ``` ```` before `json.loads`. (See `synthesize._strip_fences`.)
- **`temperature=0.7` is fine for the reasoning step, but use `0.2–0.3` for the synthesis step.** Stochasticity hurts structured output more than it helps.
- **Rate limits compound when fan-out is high.** With 8 specialists × N actions × 2 videos, you can hit Cerebras throttles. Cap parallel calls with a semaphore (default 4 in `run_specialists.py`).
- **Don't import the live-swarm K2 client into junsoo/.** Copy what you need (~30 lines). Cross-lane imports re-create the dependency hell that lane discipline (Decision 003) is meant to prevent.

## Theme-fit

Aligns with **AI Paradox / Invisible Use Cases**: structured outputs let an AI artifact be *audited* — a safety manager reading the report card sees which specialist produced which conclusion, with traceable evidence strings. The synthesis layer's forbidden-claim guardrails (no reverse inference, within-subject framing) are what make the AI useful as augmentation rather than replacement.

## Anti-theme alignment

Avoids the **black-box VLM** anti-pattern: pixel-only perception that confabulates justifications. Instead, structured JSON with cited specialist evidence makes the reasoning trace visible to humans-in-the-loop.

## When NOT to use

- **Single-shot tasks with short structured output.** If you just want JSON from one prompt, use [`robust-json-from-llms.md`](robust-json-from-llms.md) directly — three-layer extractor + retry on a single instruct call.
- **Latency-critical live paths.** Two-stage means two round-trips. For live demo flows requiring sub-second response, pick one model (instruct) and live with shallower reasoning. Pre-render is the right choice when latency budgets are blown — see Decision 017.
