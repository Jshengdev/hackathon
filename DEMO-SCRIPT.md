# amy — live demo script

A clean pass over the yappage. Same beats, tightened for stage delivery, with stage directions in *italics* and the technical hooks loaded in. Aim ~3 minutes spoken. Lean into the **bolded** lines.

---

## 0. Open (5 sec)

*[On the landing screen.]*

> "Hey, this is **amy** — short for **amygdala**. We built it because every company makes decisions about humans using data that was never designed to understand humans. A nurse spends thirty minutes with a dying patient and the dashboard sees an overrun. amy is the layer that fills in the *why*."

---

## 1. Drop the clip (10 sec)

*[Drag a bodycam mp4 onto the dropzone — the police one is the strongest opener.]*

> "We drop in a 30-second clip — this one's a police bodycam at a barricade line. Anything here. Construction, classroom, social-feed scrolling. We've got seven prerendered scenarios across workplace and consumer."

---

## 2. Loading screen — three pipelines (15 sec)

*[Loading stage opens. Vision bar fills, then amy neural prediction, then K2 swarm specialists tick on one by one.]*

> "Three pipelines run in parallel.
>
> First, **Qwen3-VL** writes the vision report — that's the action-data baseline, what the dashboard would have seen without us.
>
> Second, **Meta's TRIBE V2** — predicts second-by-second neural response across about **20,000 cortical points** on the fsaverage5 brain mesh. We treat it as a stored neural baseline; think Spotify pre-computing recommendations. Heavy upstream inference, lightweight live playback.
>
> And third, our **K2 swarm on Cerebras** — about 2,000 tokens per second, seven specialists firing in parallel, **one per Yeo7 brain region**."

---

## 3. Brain stage — the dashboard (25 sec)

*[Click into MainStage. Brain is rotating, regions labeled, edges firing between them.]*

> "Now we're on the brain. Every dot is a vertex; every region label is one of the seven networks — visual, somatomotor, dorsal attention, ventral attention, limbic, frontoparietal, default mode. The lines firing between them are our seven specialists talking to each other in real time. The brighter the connection, the higher the activation in that pair right now."

*[Click a region — say limbic.]*

> "And if you click any of these — this is the **K2 specialist for that region**, reading what its part of the cortex was processing at this exact second. Each one is its own agent, anchored to its own slice of the brain."

*[Close the popup. Point to the right panels.]*

> "On the right we've got the iterative refinement ring — Claude writing candidate paragraphs and the swarm scoring them — and the analysis panel showing the Opus synthesis as it lands."

---

## 4. Iterative refinement — the falsifier (30 sec)

*[Let the ring animate. Cosine climbs round by round.]*

> "This is the part that makes amy a measurement instead of a style trick.
>
> The methodology comes from a published paper — the **Clair de Lune** work last spring, which matched a neural fingerprint to **90.4% across 20,484 vertices** in the emotion center. We run it in reverse. **The brain pattern is the source**, and Claude has to write a paragraph that scores high against it.
>
> Three rounds. Each round, Claude writes a candidate; the seven K2 specialists score it forward against the actual brain pattern; cosine climbs. **The score climbing IS the falsifier.** Any LLM can write *'she felt anxious'* — the question is whether that paragraph would score 0.85 against the actual brain trace of the actual video. Across our demo set we're hitting **0.85 to 0.95**, in under sixty seconds, for about three cents a run."

---

## 5. Falsification — proof it's anchored (15 sec)

*[Final score lands. Move to the empathy document.]*

> "And then the last check. We score the same paragraph against a **control video** — different scene, same person. If amy's writing generic LLM filler, both scores will be high. The delta will be zero.
>
> On our hero clips we're getting deltas of **0.18 to 0.21** — proof the description is anchored to *this* scene and not generic empathy prose."

---

## 6. The empathy document (20 sec)

*[Scroll through the doc.]*

> "This is the full document. Section A is the vision report — Qwen's literal account, what physically happened.
>
> Section B is the **empathy layer** — Claude Opus 4.7's paragraph, polished from the iterative loop and grounded in the brain trace. Brain-pattern similarity right there: 0.86 against the actual cortical activation.
>
> And Section C is the falsification evidence — the per-region attribution, round-by-round trajectory, and the verdict against control."

---

## 7. The chat layer (30 sec) — *the lean-in moment*

*[Scroll to §D, the empathy chat.]*

> "And here's the new part. The empathy doc ships with an **Opus 4.7 chat layer** — viewers can ask follow-ups, anchored to the cached brain trace."

*[Type:]* `what was the cop most likely feeling around the badge contact?`

*[Wait for the streaming answer.]*

> "Opus answers in calibrated language. *'Most consistent with focused, trained engagement,'* *'the limbic specialist stayed quiet through the confrontation,'* *'visual and dorsal-attention dominate from t=18 onward.'* Every claim is anchored to a network and a timestamp.
>
> And critically — *[point to the yellow banner]* — there's a permanent ethics banner. **These are interpretive reads, not definitive accounts of what someone felt.** We use K2 for the fast inference because it's two thousand tokens a second on Cerebras; we use Opus 4.7 here because the chat layer needs the deepest reasoning model we can run."

---

## 8. Why this matters — the close (15 sec)

*[Lean back to camera.]*

> "The line between *predicting neural response* and *reverse-inferring feelings* is the whole game. Without the cosine climbing and the falsification delta, this is a horoscope. With them, it's a measurement.
>
> That's amy. The empathy layer for video — grounded in the brain's actual signal, not invented emotion."

*[End on the brain still rotating.]*

---

## Cheat sheet — numbers to memorize

| Beat | Number |
|---|---|
| Cortical points predicted | **~20,000** (vertices on fsaverage5) |
| Brain regions / specialists | **7** (Yeo7 networks) |
| K2 throughput | **~2,000 tok/s on Cerebras** |
| Iterative loop rounds | **3** |
| Demo cosine range | **0.85 → 0.95** |
| Falsification delta | **0.18 – 0.21** |
| Total run time | **under 60 seconds** |
| Cost per run | **~3 cents** |
| Clair de Lune original | **90.4% across 20,484 vertices** |

## Stage-direction recap

1. Land + drop file
2. Watch loading streams stage in (vision → amy → K2 swarm)
3. Brain rotates — click a region → show K2 specialist popup
4. Right rail: cosine ring climbs across 3 rounds
5. Press Next when ring settles
6. Reveal stage: round 1/2 → 2/2 → final 0.86
7. Empathy doc: scroll vision → empathy → falsification
8. Chat layer: ask the question, point to ethics banner
9. Close with the *predicting vs reverse-inferring* line

## Recovery moves if something breaks

- **Brain doesn't render** → it's the WebGL context; switch to a clip you've already loaded once.
- **Cosine ring stuck at 0** → you hit the precached-bug filter; advance with Next, the final number is in the right rail.
- **Chat hangs** → say "Opus is doing the heavy reasoning; let me show you the cached version" and just narrate from the Opus polish on screen.
- **No mp4 dropped** → the dropzone accepts a click; pick `30s_ironsite.mp4` from your Downloads.
