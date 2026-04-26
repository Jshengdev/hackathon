---
file-type: yap
status: reflection (Socratic — Johnny named, Claude reflects)
last-verified: 2026-04-25
locked-by: Johnny verbatim → Claude reflection
cross-links:
  - ./00-raw-yap.md
  - ../../tasks-by-person/jacob-agent-swarms.md
  - ../../tasks-by-person/junsoo-tribe-v2.md
  - ../../tasks-by-person/emilie-storytelling-research.md
  - ../../tasks-by-person/johnny-orchestration.md
---

# High-signal extracts — 2026-04-25 PRFAQ canvas turn

Johnny named these. Claude's only job is to surface them sharper, not to rank or extend.

## A. The transformation (what the demo proves)

> *"return human autonomy with the ability to see your thoughts"*

The before/after a person experiences in 90 seconds:
- **Before:** the algorithm shapes how their neurons fire — they don't know which thoughts are theirs vs. converged-from-the-feed
- **After:** they see their own thinking as a tree they can click into — and they see the comparison between "their assumption" and "how their thought has already been shaped"

## B. The architecture, named (Johnny's own framing)

1. **Input:** a video (the content that hits a brain)
2. **TRIBE V2 layer:** outputs a JSON file of brain-region activations, separated by part. *Not semantic data natively — fire intensity per region.*
3. **Swarm split:** activations divided across N agents, each prompted as a *"great specialist for that part of the brain"* (Johnny's exact phrase)
4. **Per-region inference:** each agent makes an interpretation of what the person was thinking about, given the video as context
5. **Aggregation:** results converge into "how the brain would have inferred it"
6. **Visualization:** a brain in 3D space, with a knowledge graph in 3D space mapped to where the brain is located. Reasoning points fire from each section. Clickable tree — *"the skill tree of what this section was thinking about and that section was thinking about"*
7. **The compare move (productized payoff):** feed it different content → compare the thoughts you had the first time vs. the thoughts you have now → *"that reflects on how your thought has already been shaped"*

## C. The metaphor for why this is non-trivial (Johnny's exact words)

> *"do so as an independent simulation of a neuron traveling across your brain — each thing communicates with each other to determine the construction of a brain with the path. It's like we're reconstructing how a thought travels across your brain."*

Higher-level frame Johnny gave for "yapping about it" (vs. the implementation reality of orchestration):
> reconstructing how a thought travels across your brain

## D. The multi-track positioning play (one video, three endings)

Johnny's named structure:
- **Single shared spine:** same problem statement, same beginning, same middle
- **Three swappable closes** (last 1–2 slides only):
  - **Ironside angle:** *"we gave your machine the ability to feel emotions and process the video"* — brain encoding as a 2nd modality stream the pixel-only pipeline lacks
  - **Listen Labs angle:** *"true creativity of mankind requires people to be aware of what's going on so they can branch out"* — solving convergence of society
  - **Sideshift / B2C angle:** *"the new BeReal — BeReal was fighting against fake social media; this could be fighting against the algorithm"*
- **K2:** *"very general, K2 is fine right"* — covered by the core architecture; no separate close needed
- **Best Use of AI:** the core thesis itself ("show what every part of the thinking is doing") IS the universal-track wrapper

## E. The pitch line (Ironside-flavored, Johnny's own phrasing)

> *"we gave whatever the video data the ability to feel emotions as another source of input that can make it so that it emulates what a human might be going to based on what they see and what they do"*

Note the verb tense — *"emulates what a human might be going to."* This is the decision-foreshadowing claim.

## F. What Johnny explicitly cut / parked

- **Visualizing on the brain itself** — *"It wouldn't be on the brain itself"* — the brain is in 3D space, but the knowledge graph is a separate 3D layer mapped to the brain. Two layers, not one.
- **Citing brain-science papers per region** — *"I doubt there's a research paper that does entirely how brain works"* — explicitly accepted that per-region specialist agents will infer, not cite. (Live with this; counter the inevitable judge question separately.)
- **Solo-hero one-output** — *"instead of just one output from here, it's like you can click on a tree"* — the tree is the un-black-box surface

## G. Tensions Johnny did NOT resolve in this yap (held, will return to)

These are *open*. Claude does not answer them:

1. **The compare-move scope.** Johnny said *"I think we need to productize it a little bit more"* about the "feed it new content and compare" move. Open: is the compare move IN the demo, or is it the V2 / B2C surface?
2. **Whose video?** Generic content vs. the user's own viewing history vs. a curated test set. Each opens a different demo arc.
3. **T1 (TRIBE numbers) on the slides.** Johnny will need to commit to canonical-reference numbers (~20K vertices, ~25 trained subjects) when the deck is built — not the marketing 70K/700.
4. **T2 (Auditor's external referent).** *"How the brain would have inferred it"* uses TRIBE as the external grounding — but TRIBE predicts corpus-mean response. So if the algorithm flattened everyone's neurons and TRIBE was trained on that flattened distribution, the auditor inherits the same bias. Open: what makes the brain-grounded inference *not* "Filter World with extra steps"? **This is the FAQ-ammunition question; Johnny will need a sentence-level answer before pitch.**
5. **Renaissance differentiation.** Johnny's structure has N specialists (per brain region) — that's structurally similar to Renaissance's N=3 debate triad, just with N>3 and a non-text grounding. Open: is "specialists per brain region instead of three abstract perspectives" a *visible* differentiator in the first 10 seconds, or does it look the same on stage? **Decide before the visualization is locked.**

## H. Soft-locks proposed for the live-thread (Johnny to confirm)

These are candidates for promotion to `decisions/` if Johnny says "lock it":

- **SL-1.** Demo input = a video. Output = a 3D brain + 3D knowledge graph + clickable specialist-reasoning tree.
- **SL-2.** "Specialist per brain region" is the swarm-fan-out unit (not "three roles" debate triad). N is set by the brain region partition, not by N=3.
- **SL-3.** One spine + three swappable closes. Ironside / Listen Labs / Sideshift each get the last 1–2 slides only. K2 covered by core. Best Use of AI = universal wrapper.
- **SL-4.** The "compare move" (re-feed different content, show drift) is an open option — IN-demo or V2-only — not yet locked.
- **SL-5.** The phrase Johnny will use to describe this on stage:
  > *"reconstructing how a thought travels across your brain"*

  Provisional headline candidate; not the press-release headline yet (Socratic — Johnny names that).
