# 100 — Architectural anchors emerging: Tribe V2 + agent swarms

> **Synthesis of Johnny's directional steer (2026-04-25):** *"I want to lean heavy into Tribe V2 as our special mode, agent swarms obviously, and then basically figure out how to like sort through all the mess of everything here and get things going."*

This file **does not propose the project.** Per the Socratic interaction rule active under this theme, Johnny names the idea; this file just collects what the named anchors mean architecturally and what questions they sharpen.

## What's now anchored (Johnny's commitments so far)

1. **Theme:** restoring humanity in the age of algorithms (anchor lock document at `../README.md`).
2. **Hypothesis frame:** Best Use of AI = redefining proper AI use; B2C-primary + B2B-overlay; non-blackboxed; one honest problem statement that satisfies all 5 sponsor lenses.
3. **Architectural anchor #1 — special mode:** **Tribe V2** (Meta's trimodal brain encoder). See [`sources/006-tribe-v2-meta-trimodal-brain-encoder.md`](sources/006-tribe-v2-meta-trimodal-brain-encoder.md).
4. **Architectural anchor #2 — coordination pattern:** **agent swarms** (multi-agent disagreement-as-feature, per the Actor / Auditor / Mediator triad in [`sources/004-multi-agent-alignment-actor-auditor-mediator.md`](sources/004-multi-agent-alignment-actor-auditor-mediator.md)).
5. **Implicit substrate (per [`sources/005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md`](sources/005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md)):** the human mind is *already* a collaborative polyphony of voices. Whatever we build joins that polyphony.

## What "Tribe V2 as the special mode" gives us, concretely

| Property | What it enables |
|---|---|
| Public model weights, full GitHub codebase, ICLR 2026 paper, interactive demo (non-commercial license) | We can actually run it in the worktree; fine-tune in 1h on new subjects; ship a demo that *uses real Tribe V2* not a toy facsimile |
| Trimodal: video + audio + text | Hits 4 of 5 sponsors at the architecture layer (Listen Labs = audio; Ironside spatial = video; K2 reasoning = text orchestration; Best Use of AI = the brain-prediction grounding itself) |
| 70K-voxel zero-shot prediction at 54% explainable variance | Lets us *measure* what content does to a brain *before* it's deployed — the inverse of trends-slop-by-default |
| Scaling-law confirmed, no plateau in sight | Anything we build inherits the improvement curve (good for the sustainability claim in Johnny's thesis) |
| **Predicts response to external stimuli, NOT internal monologue** | Hard limit. Anything pitched as "reads your mind" is wrong; everything pitched as "predicts how this content will land in a human brain" is in scope |
| Non-commercial license + privacy regulatory environment in flight | Hackathon-fine; product-fine if creator-side / pre-publication; product-risky if consumer-side / passive monitoring |

## What "agent swarms" gives us, concretely

| Property | What it enables |
|---|---|
| Disagreement is the binding force, not a bug (source 004) | Auditor visibly diffs the actor's claims → user *sees* the un-black-boxing in real time. UI feature: "show me where the auditor disagreed" |
| Specialization lets each agent be cheaper / faster / smaller | Actor = consumer-friendly tone (Listen Labs voice fit); Auditor = K2 Think reasoning specialist; Mediator = arbitration logic; Tribe V2 = neural-response check at any/all of the three. Sponsor leverage stacks. |
| Maps onto biological + constitutional templates the source materials cite | Pitch narrative: "we didn't invent this — biology and the US Constitution invented it; the components are finally good enough for the design" |
| Mirrors the human-mind structure (source 005) | The augmented intelligence isn't a new oracle; it's *one more voice joining your existing polyphony*, with the auditor making the new voice's reasoning legible |

## What's NOT yet decided (for Johnny to articulate; Claude reflects, doesn't propose)

These are the load-bearing decisions still open. Each one is a fork in the product:

1. **Where does the user encounter the system?** Browser extension on social feeds? Standalone app? Consumer hardware (Ray-Ban / Vision Pro)? Creator tool? Operating-system layer?
2. **Whose brain is being predicted?** The user's own (personal-tuned)? A demographic representative? A specific other person (e.g., creator pre-checking how target audience will respond)?
3. **What happens when the auditor disagrees with the actor?** Block the output? Annotate it? Show both sides? Defer to user vote? Each is a different un-black-box stance.
4. **What's the demo's "killer toggle"?** GreenChain had sea→air emissions × 55. The TreeHacks 2026 grand-prize winners all had a moment a judge could press. What's ours, given Tribe V2 + swarms?
5. **B2C surface vs. B2B surface — which is the hero?** Johnny said B2C-primary + B2B-overlay. The B2C demo is what wins HackTech; the B2B framing is what makes it sponsor-pitchable as a startup.
6. **Sponsor stacking order.** All 5 sponsor hooks in one architecture is theoretically possible (Tribe V2 trimodal + K2 reasoning + agent swarm + voice surface + spatial render) but each integration adds latency and risk. Which 3 are non-negotiable, which 2 are nice-to-have?

## Live thread micro-update (logged here; will sync to the lock-doc README on next merge)

- **2026-04-25** — Johnny lands the **architectural anchor commitment**: *"Lean heavy into Tribe V2 as our special mode, agent swarms obviously."* Three new sources captured (multi-agent alignment / Kurzgesagt mind / Tribe V2 deep-dive). Theme advances from "we have a vocabulary" → "we have an architectural skeleton." Idea still TBD.

## Cross-window note

When window-1 (`research/ideation-sweep`) and window-2 (`caltech/ideation/window-2`) merge, the lock-doc `README.md`'s Live thread should absorb this micro-update. Other window may also have shifted the thesis frame; resolve by appending both observations chronologically rather than overwriting either.
