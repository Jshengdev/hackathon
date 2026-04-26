---
file-type: validation-findings
status: in-progress (5/6 agents complete; red-team pending)
last-verified: 2026-04-25
locked-by: PRFAQ Stage 2 validation pass 1
sources:
  - Mary (analyst) — narrative integrity attack
  - Winston (architect) — feasibility under 12hr × 4 attack
  - Sally (UX) — Gen-Z recognition + flow attack
  - Victor (innovation) — Best Use of AI win-condition attack
  - Pre-mortem — Saturday-night failure analysis
  - Red-team (PENDING) — hostile judge attack
cross-links:
  - ../prfaq.md
  - ../yaps/2026-04-25-prfaq-canvas/01-high-signal-extracts.md
---

# Phase 2 — Party-mode validation pass 1 (consolidated findings)

## Verdicts at a glance

| Persona | Verdict | One-line |
|---|---|---|
| **Mary (analyst)** | NO — press-release-not-ready | Persona doesn't recognize themselves as having the problem; sponsor closes overlap; Renaissance unaddressed |
| **Winston (architect)** | YES with cuts | 35-42h of 48 budget; 6-13h headroom; three Friday gates required |
| **Sally (UX)** | WITH-FIXES | 3 non-negotiable card fixes; hero interaction has 5 edge cases |
| **Victor (innovation)** | MEDIUM → HIGH on one move | Make swarm RESPONSIVENESS to brain visible; that's the kill-shot vs Renaissance |
| **Pre-mortem** | 5 demo-killers ranked | TRIBE latency / Renaissance lookalike / K2 rate-limit / 3D FPS / Wi-Fi |
| **Red-team** | PENDING | — |

## What Johnny's 2026-04-25 turn locks ALREADY answer

The three locks Johnny named in the live message land on multiple attacks simultaneously:

### 1. Live-first with mandatory pre-cache fallback (LOCKED)

**Answers:**
- Pre-mortem demo-killer #1 (TRIBE latency): Friday 9 PM smoke test → if &gt;30s, swap to pre-cached Saturday morning. Live-first preserves the awe; fallback prevents the loading-screen failure.
- Pre-mortem demo-killer #3 (K2 rate-limit): cache K2 outputs Sunday morning; live-first if endpoint holds, fallback if not.
- Pre-mortem demo-killer #5 (Wi-Fi): backup MP4 of the full pipeline as the absolute floor.
- Winston's gate #3 (K2 latency measured Friday 3 PM, pre-cached Sunday): aligned.

**Still open:** *who* triggers the fallback at the demo table, and *when*. Need a written runbook for the demo runner.

### 2. Hover-bridge connection mechanic (LOCKED — BEAT-3 visualization)

**Answers:**
- Victor's #1 chess move ("make swarm responsiveness to brain VISIBLE"): hover-to-illuminate IS the visible causality moment. User hovers a brain region → the bridges emanating from it light up → judge sees the swarm responding to that region's activation.
- Sally's edge case #1 (spatial cognition failure for clicking regions blindly): hover surfaces affordance *before* commit. User explores by hover, commits by click.
- Sally's "demo screen vs product screen gap": hover is interaction-driven, doesn't need voiceover narration. Mechanism explains itself.
- Mary's K2-load-bearing concern: bridges *are* the K2 output, visualized. K2's cross-region communication isn't decorative — it's literally the thing that lights up.
- Pre-mortem #6 (swarm outputs indistinguishable): if bridges-on-hover show *different content per region pair*, the differentiation becomes visible at the visualization layer (not the prompt layer).

**Still open:** what the bridge label / on-hover content actually says (Q-J5 + Q-J6 still in flight).

### 3. Input-source-as-persona-switch (LOCKED)

**Answers:**
- Mary's MECE failure on sponsor closes: now the closes are MECE on *input source*, not on framing. Listen Labs/Sideshift run Reels input; Ironside runs construction-worker video. Same engine, different inputs = visibly different demos.
- Mary's Ironside-aspirational concern: now Ironside IS the input swap, not a footnote. The Ironside close demo physically switches the input source on stage.

**Still open:** does the Ironside input swap actually work in 90s, or does running construction-worker video through TRIBE produce OOD garbage (TRIBE was trained on consumer media — `tribe-v2-canonical-reference.md` flags 0.32 → 0.17 score collapse on OOD content)?

## Findings the new locks DON'T address (must-resolve list)

### CRITICAL — fix before press-release headline

**M1. The persona-problem incoherence (Mary).**
The Gen-Z teen doesn't *feel* the algorithmic-convergence problem. They were raised on it; they have no "before." The current PRFAQ writes the problem from an adult observer's perspective, not the persona's. **Resolution path:** the press release needs the persona to articulate a felt friction in their own voice — *not* "my algorithms shaped me," which a 17-year-old wouldn't say. Candidate felt frictions: "I can't tell if I actually like this or if it just keeps showing up"; "everyone in my class watches the same five accounts"; "I tried to make something original and it sounded like a TikTok caption." Johnny names which one (Socratic).

**M2. Card 1 reframing — "amygdala" is homework (Sally).**
Wrapped works because top-artist is iconic + singular. *"Top region: ventromedial prefrontal cortex"* is not shareable. **Resolution path:** swap region names for *function names* in the user-facing card ("emotion processing," "future planning," "social sense") with the anatomical name as a small footnote. Card data unchanged; user-facing label changed.

**M3. Card 3 must earn the surprise (Sally + Mary).**
Currently presents a percentile number. Wrapped works because the comparison *disagrees with intuition*. **Resolution path:** the card has to flip — "you're MORE converged than 88% of your peers" or "you DIVERGE on philosophy content." If we don't have a comparison dataset (Mary's evidence-grounding fail), either remove the card OR pre-generate a 10-profile mock cohort and compute real percentiles against it. **Decide before Saturday.**

**V1. The kill-shot move (Victor).**
Lock: TRIBE V2 as protagonist on screen, K2 swarm as *chorus responding to the brain*. NOT N=100+ debaters. NOT "video instead of papers." The frame is: *"real brain firing → specialists react with disagreement → causality unmistakable."* This is the move that flips MEDIUM → HIGH probability of winning Best Use of AI. **Currently the PRFAQ doesn't explicitly state this framing as the differentiator** — it's implicit. Make it explicit in the press release headline / opening paragraph.

**P1. The 8 Friday-night smoke tests (Pre-mortem).**
Run all 8 by Friday 11 PM. Each has a clear pass/fail criterion and a mandatory mitigation if failed:
1. TRIBE latency baseline (Junsoo)
2. K2 swarm load-test (Jacob)
3. Renaissance differentiation rehearsal (Emilie + Johnny)
4. 3D rendering FPS baseline (Johnny)
5. Wi-Fi contingency test (Emilie + Johnny)
6. Swarm output coherence check (Jacob)
7. Figma-to-data contract lock (Emilie + Jacob)
8. Demo determinism check (Johnny)

### MEDIUM — fix before pitch deck

**M4. The user is missing as voice (Mary).**
Press release narrates *about* Gen-Z, not *by* one. The "user quote" slot in BEAT-4 is open. **Resolution path:** Johnny names the user-quote (real or composite). The voice has to land for a 17-year-old reader.

**M5. K2 placement — Auditor or Mediator? (Mary, via 501 roundtable Wei Park).**
The PRFAQ doesn't lock this. If K2 is the Auditor (verification), it's deep but invisible. If K2 is the Mediator (resolution), it's the visible reasoning chain. **Resolution path:** Johnny picks. The hover-bridge mechanic favors Mediator (the bridges ARE the K2-mediated cross-talk).

**V2. Strategic silences (Victor).**
- Don't show full K2 chain-of-thought per specialist (too dense)
- Don't address T2 / corpus-bias in the demo (FAQ only)
- Don't show all Wrapped cards before BEAT-4 Land

**S1. Hero card air-gapped suggestions (Sally + Pre-mortem #8).**
The inverted-brain-search returning bad suggestions kills the demo. **Resolution path:** pre-cache suggestions for the *specific* input video being demoed. The judge experiences it as live; the team controls the magic. Acceptable for hackathon scope.

**W1. Q-J6 picks from Winston + Pre-mortem.**
Pick by Friday 5 PM:
- (a) reverse-lookup over precomputed library — 2-3h, cheap
- (b) swarm-generate description — 3-4h, more authentic
- (c) search API (YouTube/Spotify) with brain-archetype query — 2-3h, lowest fidelity
**Winston's recommendation:** option C is fastest. **Pre-mortem's recommendation:** pre-cached for the specific demo video. **Hybrid possible:** ship A or C as the implementation; pre-cache for the demo input video as the demo-day fallback.

### LONG-TAIL — acknowledge, don't pre-mitigate

- Spotify Wrapped trademark on the *name* (not the format) — fine for a pitch; rebrand if commercializing
- TRIBE CC BY-NC license — flagged as FAQ ammo, not a build-time block
- "We don't recommend" positioning collapsing under judge questioning — pre-script the rebuttal: *"We surface what would activate the region. The user judges. No optimization for engagement, just transparency."*

## Three "still open" Johnny calls before press-release headline draft

Per Mary + Winston + Sally + Victor + Pre-mortem convergence, three resolutions block the press-release:

1. **Persona's felt-friction sentence** (M1) — what does the 17-year-old say about themselves?
2. **The kill-shot framing made explicit** (V1) — does the press release lead with "your brain reacts → specialists disagree → causality" framing, or with "Spotify Wrapped of your brain" framing? They're complementary; one has to lead.
3. **Q-J6 implementation pick** (W1 + S1 + Pre-mortem #8) — implementation choice + pre-cache strategy locked.

Once these three resolve, the press release draft can begin and survives party-mode pass 2.

## Red-team addendum (LANDED 2026-04-25)

### The 5 ATTACKS THE PRFAQ HAS NO DEFENSE AGAINST (must-resolve)

These are the unanswerable ones per the corpus itself. Johnny must resolve.

**RT-1. T2 — Auditor's external referent.**
*"TRIBE V2 was trained on Gen-Z subjects whose brains were already shaped by the algorithm. Your 'brain-grounded' auditor inherits the bias. How is this not Filter World with extra steps?"*
The 500-elicitation file flags this as load-bearing and writes: **"no counter exists in current material."** Two paths: (a) own the limitation in the FAQ ("we make Filter World *visible*; we don't claim to fix it"), (b) name a non-platform-derived referent (TRIBE training set demographics? specific brain regions known to be culture-invariant? — open).

**RT-2. Cross-talk soup.**
*"Two passes of LLMs talking can produce coherent-sounding nonsense. How do you know the cross-talk isn't trends-slop converging?"* The witnessed-dissent mechanic requires *one worked example* where actor/auditor/mediator outputs visibly diverge on a brain-pattern input — *shown, not described.* The hover-bridge lock helps (bridges visualize the cross-talk) but only if the bridges' on-hover content actually differs meaningfully per region-pair.

**RT-3. Listen Labs visualization specificity.**
*"Generational thought convergence is sayable. Show me the measurable visualization."* — needs ONE concrete shape. Candidate: stadium-light-show pattern (100 brain-fire patterns syncing on the same content). **The PRFAQ has no concrete viz for this.** Without it, Listen Labs sponsor close is sayable, not visible.

**RT-4. Sideshift dev-tool fit.**
*"Sideshift is dev-tools-for-creators. Where's the developer?"* — current PRFAQ has Sideshift as the Spotify Wrapped *consumer share* close. But Sideshift wants integration as their B2B-developer-facing surface. **Either reframe Sideshift close as developer-facing (creator-tool API surface) or drop Sideshift from the stack.** Decision needed.

**RT-5. The 90-second shot-by-shot.**
*"Walk me through 90 seconds. What's on screen at second 5, 30, 60, 85?"* — beat skeleton exists; pixel-by-pixel choreography does not. **This is the gap that survives every other answer.** No matter how good the architecture, if the team can't perform the specific shots in real-time, the demo loses. **Highest-priority deliverable. Must be written before press-release headline.**

### Reverse-inference structural contradiction (CRITICAL — surfaced by RT-3 + RT-5)

The red-team caught what nobody else did: **the Land card itself IS reverse inference.** The Poldrack 2006 caution forbids "amygdala fired = user felt fear" — but the Land card mechanic is *"region X is dormant → here's content that would activate region X"* which is structurally the same forbidden inference, just inverted.

The Ironside close line — *"we gave your machine the ability to feel emotions"* — is also reverse inference and is wrong on multiple levels.

**Resolution paths (Johnny picks):**
- **(a) Reframe the Land card** as "spectrum of content sorted by predicted activation magnitude, no claim about what activation means" — keeps the mechanic, drops the inference claim.
- **(b) Own it transparently** in the FAQ: *"yes, this uses inverse inference; here's why it's appropriate for content discovery (not clinical diagnosis)."* — high-integrity move; can win on it.
- **(c) Drop the Land card** as the hero, replace with another mechanic. (Costly — kills the Renaissance differentiator.)
- **Reframe Ironside close** to drop "feel emotions" language; restate as something like *"your machine sees what a human observer's brain would attend to in this scene — the salience signal pixel-only models miss."*

### Other red-team findings (defended or partially defended)

| Attack | Status | Defense |
|---|---|---|
| RT — Renaissance pattern-match in 60s | PARTIALLY DEFENDED | Hover-bridge lock + Victor's "TRIBE-as-protagonist, swarm-as-chorus-responding-to-brain" framing. Need explicit verbal differentiator in BEAT-1. |
| RT — TRIBE 70K vs 20K honesty | DEFENDED | PRFAQ + Junsoo file already lock canonical numbers. Don't say 70K on stage anywhere. |
| RT — License trap (CC BY-NC) | DEFENDED in concept | FAQ entry needed: "this is research / non-commercial; commercial path TBD via Meta legal." |
| RT — "Spotify Wrapped" trademark | NEEDS RENAMING | Use "Wrapped-style" as format reference; ship product under different name. Open: what's the product name? |
| RT — K2-could-be-Claude legibility | PARTIALLY DEFENDED | Hover-bridge + cross-region cross-talk locked as core (not optimization). Strengthen by: in-demo toggle showing Claude failure mode (timeout / single-stream output) vs. K2's parallelism. |
| RT — Specialist role-play challenge | OPEN | Needs comparative example (single-LLM vs. swarm) showing categorical difference. Q-J5 implementation. |
| RT — Cohort-comparison data | RESOLVABLE | Pre-generate 10-profile mock cohort + compute real percentiles against it. Or drop Card 3. |
| RT — Positioning vs Land card contradiction | OPEN | Resolved together with the reverse-inference reframe (above). |

## Final must-resolve list (consolidated 6-agent pass)

Rolling up Mary + Winston + Sally + Victor + Pre-mortem + Red-team:

### BLOCKERS for press-release headline draft

1. **Persona felt-friction sentence** (M1) — what does the 17-year-old say in their own voice?
2. **Land-card reverse-inference reframe** (RT-3 + Sally hero edge cases) — pick (a/b/c) above
3. **Ironside close reframe** (RT — drops the "feel emotions" reverse-inference language)
4. **Kill-shot framing made explicit** (V1) — TRIBE as protagonist + swarm as chorus, called out in headline
5. **Product name** — not "Spotify Wrapped of Your Brain" (RT trademark); needs original name
6. **T2 stance** (RT-1) — own it or counter it; pick

### BLOCKERS for demo execution

7. **90-second shot-by-shot script** (RT-5) — frame-by-frame, what's on screen at each second
8. **Q-J6 inverted-brain-search implementation** (Winston + Pre-mortem + S1) — pick a/b/c by Friday 5 PM
9. **Cross-talk worked example** (RT-2) — one input + actor/auditor/mediator divergent outputs
10. **Listen Labs concrete viz** (RT-3) — one measurable shape proving generational convergence
11. **Sideshift fit decision** (RT-4) — reframe as dev-tool or drop from stack

### PROCESS — Friday-night smoke tests

12. Run 8 smoke tests Friday 8-11 PM (Pre-mortem checklist) — non-negotiable

### Defended / closed by Johnny's 2026-04-25 locks

- Live-with-pre-cache fallback strategy ✓
- Hover-bridge mechanic addresses visual-mess / Victor's responsiveness / Sally's spatial cognition ✓
- Input-source-as-persona-switch addresses Mary's MECE failure ✓
- TRIBE numbers (T1) ✓
- License trap (FAQ ammo ready) ✓
