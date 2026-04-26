---
file-type: tool
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources: []
cross-links:
  - ../index.md
  - ../README.md
  - ../../../caltech/context/sponsors/
---

# `tools/` — per-tool API surface + integration template + gotchas

Each `<slug>.md` is a tool/API integration reference. Lift-this code template, model strings, request shape, license, gotchas, latency notes. The PRD-builder reaches here when "how do we actually call X?" comes up.

## Naming + schema

- `<slug>.md` — lowercase-hyphenated tool name (e.g. `k2-think.md`).
- `file-type: tool` in frontmatter.
- Required sections: when-to-reach-for-it (vs alternatives) · when-NOT-to-reach-for-it · real-code citations (which projects use it) · integration template (lift-this snippet) · sponsor leverage angles · gotchas.

## When to read

- "What's the K2 API surface?" → `k2-think.md`
- "How do I call this tool from the actor agent?" → integration template
- "What breaks at scale with this tool?" → gotchas

## When to write

- A new tool gets a file here when ≥ 1 project teardown references it AND the team is considering using it. Don't write speculative tool entries.

## Open gaps (named, not blocking)

| Tool | Where info currently lives | Should it be here? |
|---|---|---|
| **TRIBE V2** | `themes/.../sources/deep-dives/tribe-v2-canonical-reference.md` (source-shape, not tool-shape) | Yes — should mirror as `tools/tribe-v2.md` once the PRD-builder needs the integration template (right now the deep-dive serves both functions) |
| **Listen Labs** | `caltech/context/sponsors/listenlabs.md` (sponsor brief) | Yes — needs a `tools/listen-labs.md` with the actual voice-API surface once architecture commits a Listen-Labs hook |
| **Ironside** | `caltech/context/sponsors/ironsite.md` + `decisions/009-ironside-pipeline-mirror.md` (architectural decision) | Maybe — Ironside isn't an API we call; it's a pipeline shape we mirror. Tools/-style entry only if we end up calling Ironside SaaS |
| **Dedalus / Modal / Browserbase / etc.** | scattered across project teardowns | Promote to `tools/` when committed |

## Index

See [Tools section of `index.md`](../index.md#tools--per-tool-api--integration--gotchas). Currently 1: `k2-think.md`.
