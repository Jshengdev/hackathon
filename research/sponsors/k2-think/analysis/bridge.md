# BRIDGE — K2 Think pointer

→ Canonical entry: [`../../wiki/projects/bridge.md`](../../../wiki/projects/bridge.md)

**K2 Think role in this project:** the second stage of a two-stage LLM compile. Gemini 2.5 Flash drafts a prose plan; K2 Think v2 (`MBZUAI-IFM/K2-Think-v2`) compiles it into a 4-function Python DSL (`move_to / grasp / lift / place`). A startswith-prefix-whitelist + empty-globals `eval` interpreter runs the result.

**Sponsor-track sauce:** smallest-possible DSL, system-prompt-restricted output, no client-side validator beyond a 4-key dict — production-ugly but hack-ideal. Demonstrates K2 as the "structured constrained output" specialist.

See `wiki/tools/k2-think.md` for the full integration template + gotchas.
