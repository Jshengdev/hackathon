# Theme — AI paradox / restoring humanity in the age of algorithms

> **Status:** active anchor for HackTech 2026 ideation. This file is the **lock document** — single source of truth for what we're exploring, why, what we know so far, and what we still need to figure out. Everything else in the wiki connects back here.

---

## Johnny's problem statement (verbatim, the anchor)

> *"I would love to solve the problem of how algorithms are erasing culture and ruining the lives of the current generation. Most people start to fix problems we have as individuals, but nobody realized there's something invisible taking away everything human about us. So the impact we're trying to solve is restoring humanity in an age of AI and redefining what the renaissance looks like — so that it can truly be a world where the two can work: technology and human ingenuity. One that can still create and design culture, whereas one can help with the productivity. Trying to find that balance where we un-black-box some sort of technology and we do some sort of stimulation of some Socratic version."*

— Johnny, 2026-04-25

### Distilled

- **Problem:** invisible algorithmic systems are eroding the next generation's autonomy, taste, judgment, and sense of self — without consent or visibility.
- **Impact target:** restore the human half of a human/AI partnership; redefine what a digital Renaissance looks like when both halves are working.
- **Mechanism hint:** **un-black-box** the algorithm; offer a **Socratic** interaction surface so the user develops the theory of their own use rather than being fed the answer.

---

## Interaction protocol — Socratic, not prescriptive

Johnny's instruction, also verbatim:

> *"You cannot tell me what the idea is. I have to tell you what the idea is and you have to just repeat it back to me. But you can help guide me getting closer and closer and closer to what exactly I'm trying to get about."*

**What this means for Claude in every conversation under this theme:**

- Reflect what Johnny says back to him sharper, structured, in his own framing.
- Surface tensions, gaps, and contradictions — don't resolve them with a recommendation.
- Ask Socratic questions: *what would have to be true for this to work? what's the test that would falsify it? what's the smallest version of this that would prove the bet?*
- Index sources, patterns, projects, sponsors that touch the theme — **point him toward** evidence, **don't choose for him**.
- Never propose the project, the architecture, or the demo. He proposes; Claude checks.
- Distinct from the rest of the wiki: under this theme, Claude is the librarian and the foil, not the architect.

---

## Theme vs. hypothesis (Johnny's two-track framing)

Johnny named this distinction explicitly: there is a **main theme** (the broad area we're exploring) and a **main hypothesis** (the specific bet we make about what to build). Keep them separate; the theme is the field, the hypothesis is the play.

### The theme (settled — the field we're playing in)

Algorithms are erasing the human half of culture, taste, judgment, and self-knowledge — invisibly, at scale, across software craft, consumer culture, and strategic decision-making. Restoring that human half is the goal.

### The hypothesis (open — the play we'll make)

**TBD.** The hypothesis is what Johnny is converging on. Claude does not write it; Claude reflects iterations of it back. When Johnny states a candidate hypothesis, log it in the [Live thread](#live-thread) below with a date stamp.

---

## What we know so far (compressed)

Three sources, three angles, one underlying engine.

| Source | Domain | The invisible cost they name |
|---|---|---|
| [`001-hak-systems-thinking.md`](sources/001-hak-systems-thinking.md) | Software craft (Hak / AgentiveStack) | **Comprehension debt.** Code is the *shadow*; the program lives in the head; AI generates the shadow on demand and we stop building the theory. Juniors lost the forcing function that turned them into seniors. |
| [`002-algorithmic-culture-flattening.md`](sources/002-algorithmic-culture-flattening.md) | Consumer culture & taste (anonymous YouTuber, citing Chayka's *Filter World* + Mina Lee) | **Filter World.** Personal style flattens, real curation dies, serendipity collapses. *"How do you know what you like or who you are if an algorithm has always told you?"* |
| [`003-trends-slop-and-the-comment-section-in-flesh.md`](sources/003-trends-slop-and-the-comment-section-in-flesh.md) | Strategic judgment & decision-making (commentary on Krafton/Subnautica + Inc journalist + Harvard 30K-data-point study) | **Trends slop.** LLM output clusters around the corpus mean regardless of context; "AI is the internet comment section taking flesh"; presentation product, not thinking product; *"a bad idea that sounds brilliant — that's a $250M lawsuit."* |

### Cross-source vocabulary (the words we now have)

**Failure-mode words:** comprehension debt · jagged frontier · trends slop · Filter World · singularity of nothing-new · hollowed-out feeling toward ourselves · presentation product · probabilistic translator (not deterministic compiler)

**Generation-and-craft words:** seniority-biased technological change · forcing function · the curriculum on purpose · fast-food analogy · fitness analogy · deliberately-trained minority

**Architectural-fix words:** real curation (vs. algorithmic curation) · grounded citation · un-black-box · Socratic surface · the conductor (vs. the orchestra)

### Where this connects to the rest of the wiki

- **Patterns (already-written) that match the un-black-box / restore-judgment direction:**
  - [`patterns/grounded-citation.md`](../../patterns/grounded-citation.md) — every output points back to a verifiable artifact. Architectural answer to trends slop.
  - [`patterns/spatial-sidecar.md`](../../patterns/spatial-sidecar.md) — let cheap deterministic perception do the perception; let the LLM reason over JSON, not pixels. Architectural answer to "presentation product, not thinking product."
  - [`patterns/two-stage-llm-compile.md`](../../patterns/two-stage-llm-compile.md) — small constrained DSL + safe interpreter. Architectural answer to "AI is a probabilistic translator."
- **Projects (already-written) that show the pattern in shipped form:**
  - [`projects/jarvis.md`](../../projects/jarvis.md) — VLMs *describe* but don't *understand*; engineering (sidecar + Localize-and-Zoom) recovers what prompting can't. Same shape as the theme's argument.
  - [`projects/greenchain.md`](../../projects/greenchain.md) — every emission number cited to EPA/Ember/GLEC. Refusal of trends slop in product form.
- **Scrapes:**
  - [`../../scrapes/treehacks-2026-winners.md`](../../scrapes/treehacks-2026-winners.md) — 64 winners, 60 with public repos. Headline: *spatial / vision / VLM-grounded* (8) and *vertical agent stacks* (15) are dominant winning archetypes — both architectural shapes that are *anti-trends-slop* by design.
- **Sponsors / competitors lock document:**
  - [`../../../sponsors/_2026-sponsorship-footprint.md`](../../../sponsors/_2026-sponsorship-footprint.md) — *(not yet populated; the discovery agent failed mid-run with an Anthropic overload error and needs a re-dispatch).*
  - Per-sponsor inboxes: [`../../../sponsors/k2-think/`](../../../sponsors/k2-think/), [`../../../sponsors/listen-labs/`](../../../sponsors/listen-labs/), [`../../../sponsors/ironsight/`](../../../sponsors/ironsight/).

---

## Open questions (for Johnny to answer; Claude only sharpens)

These are the questions a hypothesis would need to answer. Claude does not answer them.

1. **Whose humanity, specifically?** "The current generation" is broad. Is the user a Gen-Z teenager? A creator? A junior dev? A small-business owner? A parent of a kid being algorithmically raised? The architecture changes by user.
2. **Which algorithmic system, specifically?** Recommendation feeds (TikTok / Spotify / Pinterest)? AI assistants (ChatGPT / Cursor)? Strategic-judgment AI (the trends-slop case)? Cultural-creation AI (the AI-influencer case)? Each opens a different play.
3. **What does "restored" look like in 24 hours of demo?** What can a judge press a button on and feel the *return* of agency / taste / judgment / culture? Without that moment, the theme stays an essay.
4. **What does "un-black-box" mean operationally?** Showing the user the algorithm's input → reasoning → output? Letting them edit the algorithm? Replacing it with a transparent surrogate? Auditing it from outside? Each is a different product.
5. **What does "Socratic" mean operationally?** The product asks the user questions to shape its own behavior? The user asks the product questions and the product reflects rather than answers? The product surfaces the user's own past choices as a mirror? Each is a different UX.
6. **Where do the sponsors fit?** K2 Think (reasoning specialist), Listen Labs (voice — verify), Ironsight (spatial reasoning — verify). Which sponsor's sauce is *intrinsic* to the hypothesis, not bolted on?
7. **What's the "demo theatre" moment?** GreenChain had the sea→air toggle (55× emission jump). FaceTimeOS had the consumer-surface familiarity. Jarvis had the click-to-clip citation chip. What's the moment that makes a judge *feel* the theme?

---

## Live thread (changelog — append, don't rewrite)

Every meaningful shift in framing, hypothesis, or evidence gets one line here with a date. This is the conversation log of the search.

- **2026-04-25** — Theme bootstrapped with the Hak / AgentiveStack source on systems thinking + the broken junior pipeline. Initial framing: AI paradox / invisible use cases / generation-without-guardrails.
- **2026-04-25** — Source 002 added (algorithmic culture / *Filter World* / *Death of Personal Style*). Theme broadens from dev-craft to consumer-culture. New named concepts: Filter World, real curation vs. algorithmic curation, attention colonization, singularity of nothing-new.
- **2026-04-25** — Johnny articulates the **anchor problem statement**: "restore humanity in the age of AI; redefine the renaissance; un-black-box; Socratic." Shifts from open ideation to a directional commitment.
- **2026-04-25** — Johnny installs the **Socratic interaction rule**: Claude reflects, never proposes the idea. Saved as feedback memory.
- **2026-04-25** — Source 003 added (Krafton CEO + trends slop + "comment section in flesh"). Theme triangulates across software / culture / strategic judgment. Shared underlying engine named: surface confidence decoupled from underlying validity.
- **2026-04-25** — TreeHacks 2026 winners scrape lands (64 projects, 60 with repos). Headline: spatial / VLM-grounded (8) + vertical agent stacks (15) are dominant winning archetypes. Multi-site context federation **not present** in any winner — wide open.
- **2026-04-25** — Johnny sharpens the **hypothesis frame** (still hypothesis, not idea): "Base it off of the AI slop thing. Hard target the best use of AI — and the best use of AI is fighting back against the things where AI can be used terribly and irresponsibly. Not out of ethics, not out of being good people — out of sheer impact. **Augmented human intelligence** should be the way humans actually interact with AI in a sense that it actually creates human ingenuity, spawns the human renaissance, and challenges a lot of previous beliefs and things that aren't really good about society. Each sponsor should be intrigued and in love with what we have." Direction is set; specific idea still TBD.
- *(next entries land here as Johnny iterates the hypothesis or new sources arrive)*

---

## Queued source-hunts (what we still want)

To keep widening the evidence base for the theme:

- **Youth-and-AI specifically.** Common Sense Media reports, MIT/Stanford youth-AI literacy work, longform on Gen-Alpha + AI-native childhood. (Hak addresses juniors-in-tech; we need 10-year-olds-with-Claude.)
- **The "designed to do XYZ" framing.** Essays articulating what this generation is *for* / *built to do*. Andreessen / a16z youth pieces, Tyler Cowen, Patrick Collison, Balaji writings, Naval threads, Sam Altman essays.
- **Counter-arguments worth steelmanning.** Anything pushing back on the "AI breaks the junior pipeline" frame, or arguing the next abstraction layer *is* trustworthy.
- **The verified versions of the claims in source 003.** The Delaware Krafton/Unknown Worlds ruling (court filings, primary press); the Harvard "trends slop" 30,000-data-point study (find the actual paper, name the authors).
- **Live attempts at "un-black-boxing" recommenders.** Mozilla's RegretsReporter, projects that fork TikTok-for-You algorithms, Pol.is, Bluesky's open feed-algorithm marketplace. Document what's been tried and what failed.
- **Sources on "what the AI-native generation does well."** Not just what they've lost — what they've gained. (We don't want a one-sided thesis.)

To add a source: drop the raw content into `sources/NNN-<short-slug>.md` with the standard frontmatter (key extracts → how it maps → full content). Then add a one-line entry to the [Live thread](#live-thread) above.
