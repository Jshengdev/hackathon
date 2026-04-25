# Per-item parallel LLM evaluation

**Instead of one mega-prompt asking the model to filter / score / annotate a list, fan out one focused call per item with a bounded `asyncio.Semaphore`. Cheaper, more accurate, more robust.**

## When to reach for it

You have N items (manufacturers, candidates, search results, papers, code-review hunks, ...) and you want the LLM to make a yes/no or keep/remove decision on each based on a shared user prompt.

The temptation is to dump the whole list and the prompt into one call. Don't.

## The pattern

```python
semaphore = asyncio.Semaphore(6)   # cap concurrent provider calls

async def evaluate_one(item):
    async with semaphore:
        try:
            result = await call_llm_for_one(prompt, scenario_summary, item)
        except ProviderError:
            warnings.append(f"Preserved {item.name} because evaluation failed.")
            return item.id, True   # FAIL-OPEN: keep on error
    return item.id, result.decision == "keep"

decisions = await asyncio.gather(*(evaluate_one(it) for it in items))
keep_ids = {iid for iid, keep in decisions if keep}
```

Three deliberate choices:

1. **`asyncio.Semaphore(6)`** — bounded fan-out. Six is a reasonable default; lower if your provider rate-limits.
2. **`asyncio.gather`** — runs in parallel; total latency ≈ slowest single call, not sum of calls.
3. **Fail-open default** — on provider error, return `True` (keep). The user's intent was filtering down; preserving on error is the safer side.

## Why it works

A single mega-prompt asks the model to (a) understand the user's intent, (b) understand each item's attributes, (c) hold all N items in attention simultaneously, (d) emit a structured decision array. Each item dilutes attention on every other. With per-item calls:

- The model only has to reason about one item at a time → spatial-attention argument from VLMs (`patterns/localize-and-zoom.md`) generalizes to text reasoning too.
- Each call returns trivially small JSON (`{decision, message, reason}`) → easier to validate, recover, log.
- Failures are localized — one item bad doesn't break the batch.
- You get a per-item audit trail for free (the `reason` field).
- You can parallelize — `asyncio.gather` over 50 items at concurrency 6 finishes in ~9 batches × ~1.5s/call ≈ 14s total, vs. one mega-call taking 20–60s and being less reliable.

## Real-code citations

- [`projects/greenchain.md`](../projects/greenchain.md) — `edit_scenario_with_k2` in `backend/scenario_editing.py`. K2 Think v2 cascade: one intent-classifier call, then `Semaphore(6)` over per-manufacturer keep/remove. Each per-item call uses `patterns/robust-json-from-llms.md` for the actual transport.

## Gotchas / failure modes

- **Provider rate limits.** Even at concurrency 6, bursty hackathons can hit per-minute quotas. Add a tenacity retry with exponential backoff inside `evaluate_one` if needed.
- **Cost.** N items × full prompt = N × per-token cost. For huge lists, batch in groups of 5–10 and use a list-aware prompt for each batch. Per-item is the right default for ≤ 100 items; switch above that.
- **Cross-item reasoning is impossible.** If the user prompt is "show me only the top 3 by certifications" — that requires global reasoning. Per-item evaluation can't do it. Use it for "show me only manufacturers that satisfy X" prompts (filter), not "rank these" prompts (sort).
- **Order of returned `decisions`** — `asyncio.gather` preserves order, but the upstream `apply_filtered_scenario` should not assume it; use IDs.
- **Fail-open vs. fail-closed.** GreenChain fail-opens on filter (keep). For a "select one" task, fail-closed (skip) is safer. Match the default to the user's intent.

## Cross-links

- [`projects/greenchain.md`](../projects/greenchain.md)
- [`patterns/robust-json-from-llms.md`](robust-json-from-llms.md)
- [`tools/k2-think.md`](../tools/k2-think.md)
