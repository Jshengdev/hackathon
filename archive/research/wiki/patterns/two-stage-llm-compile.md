---
file-type: pattern
status: verified
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/007-agent-swarms-as-coordination-pattern.md
  - ../decisions/008-k2-think-as-speed-engine.md
cites-sources:
  - ../projects/bridge.md
  - ../projects/greenchain.md
cross-links:
  - witnessed-dissent.md
  - per-item-parallel-llm-evaluation.md
  - robust-json-from-llms.md
  - ../tools/k2-think.md
  - ../projects/bridge.md
  - ../projects/greenchain.md
---

# Two-stage LLM compile

**A generalist LLM drafts intent in prose; a specialist reasoner compiles that prose into a constrained DSL; a sandboxed interpreter executes only the DSL.**

```
user prose ──► [Generalist LLM]   prose plan
                  (Gemini Flash,
                   GPT-4o-mini)
                       │
                       ▼
              ──► [Specialist LLM]   constrained DSL string
                  (K2 Think v2,
                   Claude Sonnet,
                   o3-mini)
                       │
                       ▼
              ──► [Whitelist interpreter]   side effects
                  (eval with empty globals
                   + prefix allow-list,
                   or AST walk)
```

## When to reach for it

- Intent is fuzzy and human-shaped, but execution must be safe and deterministic.
- A single end-to-end prompt either hallucinates code or refuses ambiguity — splitting the work fixes both.
- Robotics, browser automation, IDE actions, financial transactions, infra ops, medical workflows, anywhere the action surface is small but the input surface is vast.

## Why it works

Generalist LLMs (Gemini Flash, GPT-4o-mini) are great at decomposing fuzzy human language into ordered steps but bad at strict structured output. Specialist reasoning models (K2 Think, Claude Sonnet, o3-mini) are great at constrained structured output but worse at intent inference. Stacking them in series — prose → DSL — gives you the strengths of both at near-Flash latency, because the specialist call is short.

The whitelist interpreter is the third leg. The DSL is small and fixed; the interpreter only resolves names from a known dict; you can safely `eval()` (or AST-walk) the result.

## Real-code citations

- [`projects/bridge.md`](../projects/bridge.md) — Gemini 2.5 Flash → K2 Think v2 → 4-function DSL (`move_to / grasp / lift / place`) → `eval` with empty globals + prefix allow-list. Three of the four operative pieces fit in `llm.py` + `main.py` (~80 LOC combined).

## Gotchas / failure modes

- **DSL too large** → the interpreter can't enumerate, you fall back to AST parsing or `exec()`. Keep the function surface ≤ ~10.
- **Specialist starts explaining** → strip fenced code blocks (`````python` / ``````) defensively before parsing. BRIDGE does this with two `.replace()` calls.
- **Generalist hallucinates objects** the DSL doesn't know → resolve target names through a typed dict and let the interpreter raise; do *not* fall back to a "best guess" coordinate.
- **Cap the output** at a sane step count (BRIDGE caps at 3) so a runaway plan can't take stage time or break things.
- **Authentication for two providers** doubles your `.env` surface and adds two failure modes per request — fine in a hack, watch for it in prod.

## Variants worth knowing

- **Three-stage compile:** generalist plan → specialist intent classifier → specialist per-item evaluator. GreenChain's K2 cascade (`projects/greenchain.md` → `patterns/per-item-parallel-llm-evaluation.md`) is essentially this with the per-item step parallelized.
- **Stage 1 = same model, lower temperature:** instead of two providers, run the same model with a planner prompt at temp 0.7 then a compiler prompt at temp 0.0. Cheaper but loses the cross-provider diversity.

## Theme alignment

- **AI paradox / invisible use cases** — the two-stage compile is a primitive ancestor of the actor/auditor specialization-of-roles in **witnessed dissent**. Generalist Actor talks to user; specialist Auditor compiles claims into a constrained format the user can verify. The DSL surface area = the auditable surface area; small + fixed + named.

## Anti-theme alignment

- **Specialist that explains in prose instead of compiling** = trends slop wearing a constrained-output mask. Strip fenced code blocks and reject prose padding (cf. `robust-json-from-llms.md`).
- **DSL too large to enumerate** forces parser-based interpretation; the safety guarantee collapses and the un-black-box claim ("you can verify the action surface") becomes a lie.

## Cross-links

- [`projects/bridge.md`](../projects/bridge.md)
- [`projects/greenchain.md`](../projects/greenchain.md) (variant: cascade)
- [`patterns/robust-json-from-llms.md`](robust-json-from-llms.md)
- [`tools/k2-think.md`](../tools/k2-think.md)
