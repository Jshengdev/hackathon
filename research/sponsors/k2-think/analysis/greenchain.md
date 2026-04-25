# GreenChain — K2 Think pointer

→ Canonical entry: [`../../wiki/projects/greenchain.md`](../../../wiki/projects/greenchain.md)

**K2 Think role in this project:** the structured-reasoning specialist for the natural-language scenario editor. Two passes:

1. **Intent classifier** — one K2 call: `{op: "filter" | "undo" | "reject", undo_steps, message}`.
2. **Per-item evaluator** — `asyncio.Semaphore(6)` fan-out, one K2 call per alternate manufacturer: `{decision: "keep" | "remove", reason}`. Fail-open on provider error.

Wrapped in a 3-attempt retry-with-correction loop and a brace-balanced JSON extractor (see `wiki/patterns/robust-json-from-llms.md`). Pydantic v2 with `extra="forbid"` strict-validates every response.

**Sponsor-track sauce:** the team's pitch line — "K2 has to reason about what 'ISO-certified' means in the context of each specific component" — articulates exactly when reasoning models beat keyword-matching. The implementation is the best production-shaped K2 reference we've found so far. Lift the whole `_call_k2_json` function.

See `wiki/tools/k2-think.md` for the full integration template + gotchas.
