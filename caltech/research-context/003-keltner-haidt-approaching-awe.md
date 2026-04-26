---
file-type: research-context
status: raw
source-type: academic-paper
last-verified: 2026-04-25
where-cited: PRFAQ Stage 2 — Awe mechanic via TRIBE V2 cortical-vertex visualization
---

# Keltner & Haidt — Approaching Awe

**Source:** Dacher Keltner & Jonathan Haidt, *"Approaching awe, a moral, spiritual, and aesthetic emotion"* (Cognition and Emotion, 2003); Keltner, *Awe: The New Science of Everyday Wonder* (Penguin, 2023). Greater Good Science Center summary: https://greatergood.berkeley.edu/article/item/why_do_we_feel_awe

**One-line claim:** Awe is *"the feeling of being in the presence of something vast that transcends your understanding of the world."* Two core dimensions: vastness + accommodation (need to update mental model to fit what was experienced).

**Why we cited it:** The TRIBE V2 cortical-vertex visualization (~20K vertices on `fsaverage5`) IS named as a vastness device in our demo-theatre canonical. The brain-region heatmap during the live-during portion of our hook beat is engineering Keltner-style awe explicitly.

**Effect Keltner names:** *"Awe — more so than emotions like pride or amusement — leads people to cooperate, share resources, and sacrifice for others. Research finding: shrinks the self, expands the felt-collective."* (Greater Good summary)

**For our arc:** if the hook beat shows live brain activation across a cortical surface during a Reels scroll, the vastness mechanic fires automatically as long as the rendering resolution is high enough that the judge sees the *complexity* of what their brain is doing — not a 12-region cartoon, the actual surface mesh.

**Implementation note (engineering):** the awe mechanic depends on rendering quality. A low-poly 12-region simplification kills vastness. Render the actual `fsaverage5` mesh at native resolution. This is Junsoo's lane — flag the rendering-fidelity question.

**Promotion target:** Already cited in `research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md` §2.1.

**Status:** referenced; resurfaces as engineering constraint on the visualization rendering fidelity.
