---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions:
  - 001-tech-first-stack-strategy.md
  - 002-track-commitments-locked.md
  - 007-agent-swarms-as-coordination-pattern.md
cites-sources:
  - caltech/context/sponsors/ifm-k2.md
  - caltech/context/track-strategy.md
  - caltech/context/yaps/2026-04-24-strategy-pivot-tech-first-stack.md
  - research/wiki/tools/k2-think.md
cross-links:
  - 007-agent-swarms-as-coordination-pattern.md
  - 009-ironside-pipeline-mirror.md
  - ../tools/k2-think.md
  - ../patterns/two-stage-llm-compile.md
  - ../patterns/per-item-parallel-llm-evaluation.md
  - ../patterns/robust-json-from-llms.md
---

# 008 — K2 Think as the speed engine

## Decision

K2 Think v2 (`MBZUAI-IFM/K2-Think-v2`, ~70B params, ~1,300 tok/s on Cerebras) is the **backend speed layer** for the agent swarm — fast inference for many parallel reasoning tasks OR thousand-step sequential decomposition. **NOT the "smart reasoning" specialist primarily** — speed is the thesis.

## Date locked

2026-04-24 (late Friday team brainstorm) — refined Saturday after IFM personal conversation.

## Locked by

Johnny + team (verbatim from `track-strategy.md`):
> "We need K2 for fast inference speed. Not for 'smart' reasoning tasks — for quick, menial tasks done very quickly, at scale. Speed is the thesis, not depth." [source: `caltech/context/track-strategy.md` lines 14–15]

## Why

- **K2 runs at ~1,300 tokens/sec on Cerebras** — claimed ~10× Claude inference speed [source: `caltech/context/sponsors/ifm-k2.md` lines 81–82].
- The team has decided on a swarm coordination pattern (decision 007) — swarms need many parallel inference calls. At normal LLM speeds the architecture is intractable; at K2 throughput, the whole 3-step swarm chain runs in seconds.
- IFM judges' explicit signal: "core part of your product, not a side API call" — they will test that K2 is doing work that fundamentally requires its speed advantage [source: `caltech/context/sponsors/ifm-k2.md` lines 87–92].
- Existing wiki patterns already validate K2's API surface: BRIDGE uses K2 for the constrained-DSL compile; GreenChain uses K2 in a 2-pass cascade with `asyncio.Semaphore(6)` for per-item parallel evaluation. Both confirm K2 is judge-friendly when paired with a constrained-output story [source: `research/wiki/tools/k2-think.md` + `research/wiki/projects/greenchain.md`].

## What this opens

- "While GPT-5 thinks, K2 fires 1,300 tokens/sec — we run a thousand-step swarm in the time GPT-5 thinks once" — the demo's underdog/speed wedge (Pattern E in `02-winner-cross-comparison.md`).
- IFM impact-over-tech pitch axis: pair the speed advantage with a $1B+ TAM problem (impact-first framing).
- Unlocks fan-out swarm architectures the team couldn't ship with normal LLMs at hackathon-window deadline pressure.

## What this closes

- K2 as the *user-facing* reasoning surface — that conflates depth (K2 isn't the depth specialist for our use) with speed (which is what we want it for).
- Single-call K2 demos — judges will sniff "you wanted the K2 track, so you made up a swarm job."
- Latency-sensitive UX where K2's 70B-on-Cerebras throughput floor matters less than per-call latency.

## Reversibility

Reversible only if: (a) WhatsApp signup → API key fails (✅ acquired 2026-04-25), or (b) the swarm coordination pattern is dropped (would require backing out decision 007).

## Open question (not resolved per protocol)

**A5 from `501-party-mode-roundtable.md` (Wei Park, K2 PM persona):** *"What is K2 Think's actual job — verifier (cheap), reasoner-in-the-trace (expensive), or mediator (load-bearing)? Be specific. So when does K2 actually fire? Once per session? Once per disagreement? Once per content piece pre-published? The answer to that question is the answer to whether K2 is load-bearing or theatre."*

## Trace

- `caltech/context/sponsors/ifm-k2.md` — full sponsor brief + WhatsApp signup workflow + IFM personal conversation impact-over-tech signal.
- `caltech/context/track-strategy.md` lines 14–15 + 86 — track lock-in + "K2 = backend speed layer" line.
- `caltech/context/yaps/2026-04-24-strategy-pivot-tech-first-stack.md` lines 29–34 — K2 swarm-engine framing.
- `research/wiki/tools/k2-think.md` — full integration template (lift the `_call_k2_json` pattern from GreenChain).
- `research/wiki/patterns/per-item-parallel-llm-evaluation.md` + `robust-json-from-llms.md` — production-shaped K2 patterns.
