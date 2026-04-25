# Frontier-tech inspiration wiki

A growing reference of hackathon-winning projects, broken down so we can lift their **patterns**, **tool combos**, and **unique sauce** when picking and building our own HackTech 2026 entry.

This is **not** a sponsor-specific dump (that lives in `../sponsors/`). This is the cross-cutting library: same project shows up here from both an "architecture" and a "tools" angle, indexed so we can ask questions like _"who's used K2 + Dedalus together?"_ or _"what does a 2-stage LLM compile look like in real code?"_.

## Folder layout

```
wiki/
├── README.md          ← you are here (the index)
├── projects/          ← per-project teardowns (source of truth for each)
├── patterns/          ← cross-project architecture patterns
├── stacks/            ← recurring full-stack combos that ship in 24-36h
└── tools/             ← per-tool notes (API surface, gotchas, integration patterns)
```

Each `projects/<slug>.md` is the canonical deep-dive. The pattern / stack / tool files are **synthesis** — they cite the projects but don't restate them.

## How to add a new project

1. Johnny pastes the Devpost text **+ the GitHub URL** into chat. (Devpost prose is the *pitch*. The repo is the *truth*. The gold is in the gap between them.)
2. Claude:
   - Clones the repo to `../sponsors/<sponsor>/clones/<slug>/` (gitignored) — or `wiki/clones/<slug>/` if no sponsor link.
   - **Reads the actual code** to verify the Devpost prose against reality. Writes a "claimed vs. verified" table in the project entry — every Devpost claim gets ✅ verified / ⚠️ partial / ❌ aspirational, with the file/function that proves it.
   - Writes `projects/<slug>.md` from the **per-project template** below.
   - Updates / creates relevant `patterns/`, `stacks/`, `tools/` files — cross-link both directions.
   - If a sponsor is involved, drops a thin pointer in `../sponsors/<sponsor>/analysis/<slug>.md` linking back here.
3. Update the **Index** below with one line per addition.

**No GitHub URL?** Still write the entry — but mark every "needle" as *claimed, unverified*. Diagrams and Devpost prose alone are inspiration, not implementation evidence. Re-verify if a repo surfaces later.

## Per-project template

```markdown
# <Project name>

- **Hackathon / event:**
- **Year / date:**
- **Prize won (if known):**
- **Sponsor tracks involved:**
- **Devpost / press / video / repo:**
- **Local clone:** `../sponsors/<sponsor>/clones/<slug>/`

## Pitch (one sentence)

## What's actually in the repo (verified vs. claimed)
- One line per major Devpost claim with ✅ verified / ⚠️ partial / ❌ aspirational

## The unique sauce (what made it stand out)
2–4 bullets. The thing nobody else did.

## Implementation needles (actual code patterns)
For each: what file, what it does, why it works. Quote 5–20 lines of code if it makes the pattern click.

## Capability stack
LLMs / models / APIs / infra / hardware — every meaningful piece.

## Why it won (or why it would win)
Demo theatrics, judge-fit, narrative hook.

## Reusable for us at HackTech 2026?
- ✅ angle:
- ⚠️ risk:
- 🚫 saturated:

## Cross-links
- Patterns: `patterns/<x>.md`, `patterns/<y>.md`
- Stacks: `stacks/<z>.md`
- Tools: `tools/<a>.md`, `tools/<b>.md`
```

## Per-pattern / stack / tool template (lighter)

```markdown
# <Name>

**One-line summary.**

## When to reach for it
## Why it works
## Real-code citations
- `projects/<slug>.md` — quote the specific snippet/file
## Gotchas / failure modes
## Cross-links
```

## Index

### Projects
- [BRIDGE](projects/bridge.md) — HackPrinceton 2026, language-to-action robotics. K2 Think v2 + Gemini + PyBullet. Repo verified.
- [GreenChain](projects/greenchain.md) — HackPrinceton 2026, supply-chain emissions comparator. Dedalus agent swarm + K2 Think v2 + Claude Sonnet 4.6 + Gemini/Gemma + XGBoost. Repo verified.
- [Jarvis](projects/jarvis.md) — construction-headcam intelligence (Localize-and-Zoom + spatial sidecar + grounded report + voice agent). Gemini + MiDaS + MediaPipe + YOLOv8. **No repo yet — needles are claimed-only.**

### Patterns
- [Two-stage LLM compile](patterns/two-stage-llm-compile.md) — generalist drafts in prose, specialist reasoner compiles to constrained DSL.
- [Robust JSON from LLMs](patterns/robust-json-from-llms.md) — strict Pydantic + brace-balanced extraction + retry-with-correction loop.
- [Per-item parallel LLM evaluation](patterns/per-item-parallel-llm-evaluation.md) — `asyncio.Semaphore` fan-out instead of one mega-prompt.
- [Localize-and-Zoom](patterns/localize-and-zoom.md) — defeat VLM spatial blindness by re-querying on a raw-resolution crop.
- [Spatial sidecar (fuse-then-reason)](patterns/spatial-sidecar.md) — cheap perception models → JSON evidence file → LLM reasons over the JSON.
- [Grounded citation](patterns/grounded-citation.md) — every output claim points back to a specific source artifact.

### Tools
- [K2 Think v2](tools/k2-think.md) — MBZUAI reasoning model, OpenAI-compatible chat-completions API, used as the structured-reasoning specialist.

### Queued (indexed in projects/patterns but not yet written; create on demand)
- `patterns/sandboxed-untrusted-input.md` (cited from GreenChain — Dedalus Machines as the untrusted-fetch boundary)
- `patterns/client-side-rescore.md` (cited from GreenChain — toggle rescoring without re-hitting backend)
- `patterns/claude-md-as-brief.md` (cited from GreenChain — `backend/CLAUDE.md` as the single team+LLM brief)
- `stacks/agent-swarm-ml-viz.md` (Dedalus + Claude + XGBoost + Three.js/D3 + FastAPI SSE)
- `tools/dedalus-labs.md`
- `tools/pybullet.md`
