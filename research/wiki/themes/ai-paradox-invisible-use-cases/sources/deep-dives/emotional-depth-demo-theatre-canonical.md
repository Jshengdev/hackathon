---
file-type: source
status: in-progress
last-verified: 2026-04-25
supports-decisions: []
cites-sources:
  - "TreeHacks 2026 winners scrape (../../../../scrapes/treehacks-2026-winners.md)"
  - "001-hak-systems-thinking.md"
  - "002-algorithmic-culture-flattening.md"
  - "003-trends-slop-and-the-comment-section-in-flesh.md"
  - "004-multi-agent-alignment-actor-auditor-mediator.md"
  - "005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md"
  - "006-tribe-v2-meta-trimodal-brain-encoder.md"
  - "Andy Raskin — The Greatest Sales Deck I've Ever Seen (Mission.org / Medium, 2016)"
  - "Donald Norman — Emotional Design: Why We Love (or Hate) Everyday Things (Basic Books, 2004)"
  - "Aarron Walter — Designing for Emotion (A Book Apart, 2011)"
  - "Dieter Rams — Ten Principles for Good Design (Vitsoe, c. 1980)"
  - "Emma Coats — Pixar's 22 Rules of Storytelling (Twitter, 2011)"
  - "Kenn Adams — The Story Spine (1991)"
  - "Donald Miller — Building a StoryBrand (HarperCollins, 2017)"
  - "Dacher Keltner & Jonathan Haidt — 'Approaching Awe' (2003); Keltner, Awe (Penguin, 2023)"
  - "Greater Good Science Center — 'Why Do We Feel Awe?' (Berkeley)"
  - "MLH Hackathon Organizer Guide — Judging Plan + Judging Criteria"
  - "Michael Seibel — How to Pitch Your Seed Stage Startup (YC / SaaStr)"
  - "Eugene M. Schwartz — Breakthrough Advertising (1966)"
  - "Drew Houston — Dropbox MVP demo on Hacker News (2007)"
  - "Steve Jobs — Macworld iPhone keynote (Jan 9, 2007)"
  - "Airbnb — original 2009 pitch deck"
  - "OpenAI — ChatGPT public launch (Nov 30, 2022)"
cross-links:
  - "themes/ai-paradox-invisible-use-cases/README.md"
  - "themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/006-tribe-v2-meta-trimodal-brain-encoder.md"
  - "themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/004-multi-agent-alignment-actor-auditor-mediator.md"
  - "themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md"
  - "projects/greenchain.md"
  - "projects/jarvis.md"
  - "projects/bridge.md"
  - "scrapes/treehacks-2026-winners.md"
  - "patterns/grounded-citation.md"
  - "patterns/spatial-sidecar.md"
---

# Emotional depth in product / hackathon demos — canonical reference

> **Scope of this file.** A source page (Karpathy LLM-wiki style): a catalog of which specific emotions winning hackathon demos triggered, the mechanics that triggered them, and the canonical primary-source frameworks behind those mechanics. Builds the emotional vocabulary the PRD will draw from when the team designs the 90-second demo arc. Per Johnny's Socratic protocol: **does not propose the project, the architecture, or the demo**. Surfaces options; never ranks them.

---

## 1. The 30-second answer

A hackathon demo lands emotionally when it lets the judge *feel something specific* in a moment they did not see coming, in a way they could not have predicted from the project's name. Not "interest" (interest is a thinking state); not "appreciation" (appreciation is a politeness state); a felt physiological shift — a held breath, a leaned-forward laugh, a quiet "oh." The five emotions worth deliberately engineering for in a 90-second demo are **awe** (vastness + accommodation per Keltner), **surprise** (expectation violation per Berlyne / Rescorla-Wagner), **recognition** (the "they see me" signal per StoryBrand), **hope** (the Promised Land per Raskin), and **comfort/safety** (the un-black-box guarantee per the audit-grade citation pattern). The single most-overlooked failure mode is **over-explanation** — talking the judge *out of* an emotion they were already starting to feel. (See §8.) The mechanics that reliably trigger each emotion are concrete and copyable; they're cataloged in §3, with the four-act arc that sequences them in §4.

---

## 2. The emotion taxonomy that matters for our theme

Eight emotions that have credible academic or canonical sources behind them, are achievable inside a 90-second hackathon demo, and connect to the AI-paradox theme. Each gets: definition + source, mechanic, verified example, theme connection.

### 2.1 Awe

- **Definition (Keltner & Haidt, 2003).** *"the feeling of being in the presence of something vast that transcends your understanding of the world"* (per Greater Good Science Center summary, [greatergood.berkeley.edu](https://greatergood.berkeley.edu/article/item/why_do_we_feel_awe)). Two core dimensions: **vastness** (something immense or expansive) and **accommodation** (a need to update one's mental model to fit what was just experienced).
- **Categories Keltner names.** *"awe is elicited especially by nature, art, and impressive individuals or feats, including acts of great skill or virtue."* (Greater Good)
- **Effect.** *"awe — more so than emotions like pride or amusement — leads people to cooperate, share resources, and sacrifice for others."* (Greater Good) Research finding: shrinks the self, expands the felt-collective.
- **Mechanic.** Show a thing that is *bigger than the judge expected the project's surface area could be*. The vastness can be **scale** (a 70,000-voxel brain map; an 11-hour autonomous agent run), **physicality** (a real cane that physically steers a blind user; a drone that maps a building), or **virtuosity** (a broom that becomes a guitar; an LLVM backend compiling C into a Google Sheet).
- **Verified example.** TreeHacks 2026 #6 [Freak in the Sheets](https://devpost.com/software/freak-in-the-sheets-7jl542) — "LLVM backend that compiles real software to a Google Sheet" — won "Most Technically Complex" + Human Capital Fellowship ($50K/person). The vastness is the gap between *what a Google Sheet is in the audience's head* and *what they're being told it just did*. Accommodation is forced; awe lands.
- **Theme connection.** Tribe V2 (source 006) lets the demo pre-screen content and visualize the predicted neural response across 70K voxels — that visualization *is* a vastness device, the kind Keltner studies. "Augmented intelligence" framed as *augmenting the human's understanding of their own brain's response to the stimulus* is an awe-shape claim, not a productivity-shape claim.

### 2.2 Surprise

- **Definition (Berlyne; Rescorla-Wagner).** Surprise is the felt response to an *expectation violation* — the gap between a prediction the brain made and the outcome it observed. *"Organisms only learn when events violate their expectations"* (Rescorla-Wagner model of classical conditioning, summarized in research literature on surprise and novelty, [PMC3858647](https://pmc.ncbi.nlm.nih.gov/articles/PMC3858647/)).
- **Distinguished from novelty.** *"Novelty refers to unfamiliarity — how frequently a stimulus has been encountered — while surprise refers to unexpectedness: the degree to which an outcome violates predictions in a given context."* (PMC review.) Hackathon demos usually have novelty (unfamiliar tech); the *surprise* mechanic is engineering a moment where the *judge's own active prediction* is broken on stage.
- **Effect on memory.** *"Expectation violation before or during learning has been shown to trigger an adaptive encoding mechanism, resulting in better memory for unexpected events."* (Surprise research literature.) The judge will *remember* a surprise three weeks from now; they will not remember an unsurprising explanation.
- **Mechanic.** "The toggle." Set up an implicit prediction the judge has been making across the first 30 seconds of the demo, then break it with a single user-driven gesture in front of them.
- **Verified example.** GreenChain (HackPrinceton 2026) — **the sea→air transport-mode toggle**. The judge has been watching ranked supplier scores. The demo flips the transport mode dropdown from "sea" to "air" and *the emissions number multiplies ~55× in front of their eyes*. From the project teardown: *"Sea → air → emissions multiply ~55x in front of the judge. Single best demo moment in the project."* (`projects/greenchain.md`, line 211.) Mechanic: the GLEC factor table is `{sea: 0.011, air: 0.602, ...}` — a 55× ratio, baked client-side, no network round-trip on the action the judge plays with.
- **Theme connection.** Surprise is the felt-version of "trends slop" inverted: the trends-slop failure mode (source 003) is that AI gives the corpus mean — a *zero-surprise* output. A demo where AI's intervention produces a *measurable surprise* (a number changes, an alternative gets surfaced, a previously-silenced voice becomes audible) is the embodied refutation of that failure mode.

### 2.3 Recognition

- **Definition (StoryBrand, Donald Miller).** Recognition is the moment the user / judge feels *"this story is about me — they understand my problem at the layer I actually feel it"*. Miller's framework: *"The Hero of your brand story is not you. The Hero is your Customer. You are the Guide."* (per [Gravity Global summary](https://www.gravityglobal.com/blog/complete-guide-storybrand-framework)). The customer's problem must be specified at three layers: **external** (what's literally happening), **internal** (how it feels), and **philosophical** (why it matters).
- **Effect.** Recognition collapses skepticism. The judge stops auditing whether the problem exists; they start auditing whether *this* solution would work for *them*.
- **Mechanic.** "The kill" — open the demo on a surface so familiar the judge already has private opinions about it. The Bloom team did not say "AI for eldercare"; they showed *a familiar voice-call interface* with grandma's voice on the other end and a family dashboard. The demo is recognition-first because the artifact is recognizable-first.
- **Verified example.** FaceTimeOS (mentioned in Johnny's PRD framing for the recognition mechanic) — uses the iOS FaceTime call interface as the surface; recognition is automatic because *every judge has used FaceTime*. TreeHacks 2026 analog: [Sunday](https://devpost.com/software/sunday-94odas) — "iMessage-native AI concierge." Won Anthropic Best Use of Claude Agent SDK. Surface is iMessage; emotion is recognition; the un-explained product behavior arrives in a familiar wrapper.
- **Theme connection.** Source 002 names the cleanest one-liner of the AI-paradox theme: *"How do you know what you like? How do you know who you are if you have always had an algorithm telling you what to like and who to be and who everyone else is?"* That is a *recognition* sentence. A demo that lets the judge *recognize their own captured agency* in a single beat — e.g., "here is what your algorithm chose for you in the last 24 hours; here is what you would have chosen if you'd known" — converts the theme from essay to felt experience.

### 2.4 Hope

- **Definition (Raskin's "Promised Land" + Schwartz's awareness ladder).** Hope is the felt response to a credible vision of *"a future state that solves the pain you have right now."* Andy Raskin's framework (Mission.org, [The Greatest Sales Deck I've Ever Seen](https://medium.com/the-mission/the-greatest-sales-deck-ive-ever-seen-4f4ef3391ba0)): *"What is the Promised Land our customers will see / feel / experience as a result of our product?"* Schwartz, *Breakthrough Advertising*: *"No sentence can be effective if it contains only facts. It must also contain emotion, image, logic and promise."*
- **Effect.** Hope unlocks engagement. A judge who feels hope leans into the demo's plausibility; a judge who doesn't feel it leans away.
- **Mechanic.** "Tease the Promised Land before the product." Raskin's step 3, verbatim: *"Present a 'teaser' vision of the desired future state prospects will achieve — what Raskin calls the Promised Land — before introducing product details."* In demo terms: show the *outcome* state (the dashboard with the diff highlighted; the slop-vs-authentic neural response side-by-side; the federated incident report) before showing the underlying machinery.
- **Verified example.** Drew Houston's 2007 Dropbox MVP demo video (per Hacker News thread #16563381 + Houston's own X retrospective). The video did not show the engineering — it showed *the Promised Land*: a file changes on one machine, instantly the other machine has it. Beta waitlist went from 5,000 to 75,000 overnight. Hope at scale.
- **Theme connection.** Johnny's "augmented human intelligence — should be the way humans actually interact with AI in a sense that it actually creates human ingenuity, spawns the human renaissance" (Live thread, 2026-04-25) is a Promised-Land sentence. The demo's hope-beat is whatever artifact lets the judge see *the user being more human at the end of using the product than at the start*.

### 2.5 Anger

- **Definition.** Anger is the felt response to a perceived injustice or violation of a value the audience already holds. It is the emotion an *audit* triggers when the audited thing is bad enough to deserve the audit.
- **Mechanic.** "The witnessed dissent" — show the auditor catching the actor doing something the judge already finds objectionable. The friction *between* agents, made visible, IS the anger trigger because it externalizes the user's own latent objection.
- **Verified example.** Hak's audit-based content (source 001) does this with prose: he describes a Lovable-built app with a 7,000-line file, no rate limiting, no logs — and the indignation lands because the audience already believes those things matter. In demo form: the actor-auditor visible diff (per source 004's three-agent architecture) shows the auditor *flagging* the actor's claim in real time, with the dissenting evidence on screen. The judge feels the anger the auditor is encoding.
- **Theme connection.** Source 003: *"AI is the internet comment section taking flesh."* That sentence works because it is *anger-shaped* — it asks the audience to be angry that the most consequential decision-making layer of the modern economy is *that*. A demo that visualizes the corpus-mean output of a frontier model, side-by-side with the *correct* output the user would have given, makes the anger about trends slop irrefutable in two seconds.

### 2.6 Comfort / safety

- **Definition (Walter, Norman, Rams).** Comfort is the felt response to perceived reliability — the user / judge *trusts the system not to surprise them in the wrong direction*. Walter's hierarchy of needs (per [NN/g summary](https://www.nngroup.com/articles/theory-user-delight/)): functional → reliable → usable → pleasurable. Reliability is the second floor; nothing above it works without it. Norman's *Emotional Design* (per [Wikipedia](https://en.wikipedia.org/wiki/Emotional_Design)): the **behavioral level** is where the user feels the system either earning or losing trust through use. Rams's principles include *"Good design is honest"* and *"Good design is unobtrusive"* (per [Design Museum](https://designmuseum.org/discover-design/all-stories/what-is-good-design-a-quick-look-at-dieter-rams-ten-principles)).
- **Mechanic.** "The grounded citation chip" — every claim the system makes is one click from the source it came from. Comfort is *audibility* in the literal sense: the user can audit if they want to, and the system does not punish them for trying.
- **Verified example.** TreeHacks 2026 #13 [Tribune](https://devpost.com/software/tribune) — "every policy diff cites the voice that asked for it." Won Anthropic Human Flourishing 1st. The mechanic is structurally identical to GreenChain's emission-citations and Jarvis's clip-citation chips: a hover or click reveals the underlying evidence. The demo theatre is the moment a judge clicks a cited claim and *the source plays back*.
- **Theme connection.** Source 003: *"a bad idea that sounds bad, you could deal with that. But a bad idea that sounds brilliant — that's a $250 million lawsuit."* Comfort is the architectural answer: every brilliant-sounding sentence is one click from its underlying validity. The cited-source chip is the un-black-box made visible. Cross-link: `patterns/grounded-citation.md`.

### 2.7 Pride

- **Definition (StoryBrand; Coats).** Pride is the felt response to *the user being the protagonist of the story the demo is telling*. Miller's StoryBrand: customer = hero, product = guide. Coats's Pixar rule #16 (per [Aerogramme Studio](https://www.aerogrammestudio.com/2013/03/07/pixars-22-rules-of-storytelling/)): *"What are the stakes? Give us reason to root for the character."* The character the audience roots for in a demo is **the user** — never the team.
- **Mechanic.** "The cited testimony" — show real impact delivered to a real third-party named human, with the artifact of that impact on screen. Not "we built X." Rather: "here is the thing X did for someone you can name."
- **Verified example.** TreeHacks 2026 #12 [Project Lend](https://devpost.com/software/project-lend) — "Autonomous food bank — AI + robotics sourced and shipped 50+ lbs to Palo Alto shelters during the hackathon itself." Won Anthropic Human Flourishing 1st. The pride beat is the photograph of the food *arriving* at a shelter, during the hackathon, while the demo is happening. The user-as-protagonist is the shelter recipient; the demo team and the agent are the guides.
- **Theme connection.** Johnny's framing: *"restoring humanity in an age of AI."* A pride beat in our demo is the moment the judge sees the user *being more themselves* as a result of the system — the hand-rolled choice the algorithm wouldn't have made; the unique sentence the slop wouldn't have written; the curated playlist that doesn't sound like the Spotify Top 100. The user-as-protagonist is the human whose taste/judgment/agency has been restored.

### 2.8 Disgust

- **Definition.** Disgust is the felt response to a stimulus the audience perceives as low-quality, derivative, slop-shaped — a violation of a craft standard. Source 002: *"Pinterest is a runner up for the worst platform right now as I'm personally convicting them of a crime against humanity for having like 90% of their content AI generated."*
- **Mechanic.** "The slop side-by-side" — show the corpus-mean AI output beside the human (or AI-augmented-human) alternative. The disgust is the felt-recognition that *the slop is what the user has been getting served*, and the alternative is what they had been denied.
- **Verified example.** Source 003's framing of trends slop is itself the demo: *"Imagine you took every Reddit thread, and I mean every single one, every LinkedIn post, including the ones from people who are open to work, every Medium article written by a guy with 11 subscribers, every Substack essay, every TED talk, every half literate Facebook comment, and you threw it all into a blender, and you poured it into a suit and gave it a microphone. Welcome to AI."* That sentence works because it makes the audience disgusted at what they had, three minutes ago, been treating as a tool.
- **Theme connection.** This is the emotion the AI-paradox theme leans on hardest. Combined with source 006 (Tribe V2 measures predicted neural response), a demo could literally show *the brain's predicted response to a slop video next to the brain's predicted response to authentic content* — converting the disgust from rhetoric into measurable visualization. (See §7.)

---

## 3. Mechanics catalog — concrete demo techniques that reliably trigger emotion

Each mechanic gets: name, what it is, the emotion it triggers, the source it pulls from, a verified example, a one-line note on the failure mode if mishandled.

### 3.1 The toggle (surprise via expectation violation)

**What.** A user-controlled UI affordance whose interaction produces an outcome the judge *predicted incorrectly* in their head 5 seconds earlier.
**Trigger.** Surprise (§2.2).
**Source.** Berlyne / Rescorla-Wagner expectation-violation literature; GreenChain teardown (`projects/greenchain.md` §6, "Client-side toggle rescore").
**Verified example.** GreenChain transport-mode toggle (sea → air, ~55× emission spike), client-side recompute, no spinner.
**Failure mode.** If the judge can *see* the outcome before the toggle happens (e.g., a busy chart that already shows the "after" state), the surprise is killed.

### 3.2 The kill (recognition via familiar surface)

**What.** Open the demo on a UI the judge has used before in their own life — iMessage, FaceTime, Gmail, Notion, Spotify — and route the agent behavior *through* that familiar surface.
**Trigger.** Recognition (§2.3).
**Source.** Norman's visceral level (familiarity → instant comfort); StoryBrand's "you are the guide, the user is the hero" (the user already knows the surface).
**Verified example.** TreeHacks 2026 #38 Sunday — iMessage as the agent interface. TreeHacks 2026 #54 [Concierge](https://devpost.com/software/concierge-1tjlf5) — Poke + iMessage. The recognition is immediate because *no one needs to learn the UI*.
**Failure mode.** If you bolt agent behavior onto a familiar surface but the surface is a screenshot mock-up rather than the real thing, the recognition reverses into uncanny-valley.

### 3.3 The wow object (awe via physicality)

**What.** A real, physical, in-room artifact that *moves* during the demo — a robot arm, a drone, a cane, a smart mirror, a thermal printer that spits out a photo while the judge watches.
**Trigger.** Awe (§2.1).
**Source.** Keltner's awe categories include *"impressive individuals or feats, including acts of great skill or virtue"* — physical mastery in front of the audience qualifies.
**Verified example.** TreeHacks 2026 grand-prize-1 [Shepherd](https://devpost.com/software/raising-cane) — *"Motorized smart cane using iPhone LiDAR + CV that physically steers blind users away from obstacles."* The cane *moves* in the room. The teardown summary of why it won, from the scrape: *"a real physical thing that moves during the demo wins."* (`scrapes/treehacks-2026-winners.md`, lines 195–196.) Also TreeHacks 2026 #4 [diffuji](https://devpost.com/software/diffuji), a thermal-print instant camera, won Most Creative + Neo "Most Likely to Become a Product."
**Failure mode.** If the physical thing fails on stage and the team has no fallback video, the awe inverts into cringe. Always have a 30-second pre-recorded backup loop.

### 3.4 The grounded citation chip (comfort/safety via auditability)

**What.** Every claim the system surfaces in the demo is rendered with a small visible chip (timestamp, source URL, voice clip ID, frame number) the judge can hover or click. The hover/click *plays back* the underlying evidence.
**Trigger.** Comfort/safety (§2.6).
**Source.** Norman's behavioral + reflective levels; Walter's hierarchy ("reliable" floor); `patterns/grounded-citation.md`.
**Verified example.** Tribune (every diff cites a voice clip), Jarvis (every metric cites `[event_id, timestamp, clip]`), GreenChain (every emission factor cites EPA / Ember / GLEC), TreeHacks 2026 #41 [Edamame](https://devpost.com/software/m-4f2iwy) (every answer cites the Slack thread / Drive doc / GitHub commit it came from), TreeHacks 2026 #64 [Synapse](https://devpost.com/software/a-p1lt2h) ("atomic-claim verification with provenance trail").
**Failure mode.** If the chips are present but never *demonstrated* by the team during the demo — i.e., the judge has to take it on faith that the click works — the comfort beat is left on the table.

### 3.5 The cited testimony (pride via real impact)

**What.** Show a real, named, third-party human whose life was *measurably* changed by the system, with the artifact of that change visible on screen during the demo.
**Trigger.** Pride (§2.7).
**Source.** Miller's StoryBrand (customer-as-hero); Coats rule #16 ("give us reason to root for the character").
**Verified example.** Project Lend's actually-delivered food (50+ lbs shipped to Palo Alto shelters *during the hackathon itself*, photographed in real time). TreeHacks 2026 #5 [Mira](https://devpost.com/software/mira-w65b0a) — Ray-Ban Meta eldercare; the demo shows the elder's caregiver dashboard updating with a real medical event the elder narrated.
**Failure mode.** If the "real impact" is a future-tense projection ("if a million users adopted this..."), it is not a pride beat — it is a hope beat (still useful, see §3.10), but it does not deliver pride.

### 3.6 The witnessed dissent (recognition + comfort via visible argument)

**What.** Two or more agents *visibly disagree* on screen. The auditor flags the actor; the diff is rendered. The mediator (per source 004) optionally resolves it. The user sees the system reasoning *with itself* in real time.
**Trigger.** Recognition + comfort (and a flash of anger if the actor was wrong about something the user finds objectionable).
**Source.** Source 004 (multi-agent actor/auditor/mediator); `patterns/per-item-parallel-llm-evaluation.md` (the primitive form); checks-and-balances analogy from Federalist Papers (cited in source 004).
**Verified example.** TreeHacks 2026 #42 [aimogus](https://devpost.com/software/aimogus) — Among Us simulation evaluating LLM deception + alignment interventions. The visible disagreement *is* the demo. TreeHacks 2026 #59 [Arena](https://devpost.com/software/arena-lz2m84) — "Agents *compete* to write the frontend that best serves you." The competition is the surface.
**Failure mode.** If the disagreement is staged-looking (always resolves the same way; the auditor "wins" 100% of the time), the witnessed-dissent is theatre and the comfort is shallow. The dissent has to look like it could have gone either way.

### 3.7 The 0.3-second mirror (recognition of collapsed agency)

**What.** A UI element that shows the user, side-by-side: *(a)* what they would have done in 0.3s on autopilot, *(b)* what 5–30s of system-mediated consideration produces. Restoring the **mind-as-gap** that source 005 names.
**Trigger.** Recognition — specifically of the user's own collapsed agency.
**Source.** Source 005 (Kurzgesagt mind-as-gap); per source 005: *"A pretty wild idea is that minds might have originally evolved to control your movements. To create a gap between all of your sensory input, and your motor output."*
**Verified example.** No exact 1:1 hackathon analog yet (this is a synthesis the theme research surfaces; treat as derived rather than verified). Closest precedent: TreeHacks 2026 #53 [4sight](https://devpost.com/software/4sight-neoslb) — *"biometric monitor predicts when you'll make bad decisions, intervenes."* The intervention is structurally a gap-restorer.
**Failure mode.** If the "5-second considered" output looks indistinguishable from the "0.3-second autopilot" output, the mirror has nothing to show. The mechanic depends on the gap being *visibly* productive.

### 3.8 The slop side-by-side (disgust via comparison)

**What.** Render the AI corpus-mean output (or algorithmic-feed output) side-by-side with the augmented-human or genuinely-curated alternative. Let the judge feel which one they had been consuming.
**Trigger.** Disgust (§2.8) → resolves into hope (§2.4) when the alternative is shown.
**Source.** Source 002 ("Pinterest as a graveyard of ultra saturated finely detailed garbage"); source 003 (trends slop framing); source 006 (Tribe V2 makes the comparison *measurable* on the brain side, see §7).
**Verified example.** No direct hackathon implementation in the TreeHacks 2026 set. Adjacent: TreeHacks 2026 #50 [ADapt](https://devpost.com/software/adapt-ujvn5e) localizes a master video to per-audience variants — the implicit comparison is "one slop video for everyone" vs. "tuned variants per audience." Industry analog: the New York Times' "before/after AI summary" experiments in news interfaces.
**Failure mode.** If the "slop" example is *too* obviously bad (cherry-picked), the audience discounts the comparison as a strawman.

### 3.9 The reveal-by-counting (surprise via recategorization, per Steve Jobs)

**What.** Steve Jobs's iPhone 2007 mechanic: *"a widescreen iPod, a revolutionary mobile phone, and a breakthrough internet communicator"* — three devices, three repeats, then *"these are not three separate devices; they are one device."* The audience has been counting; the count was wrong.
**Trigger.** Surprise (recategorization variant of expectation violation) → awe.
**Source.** Steve Jobs Macworld 2007 keynote (per [9to5Mac analysis](https://9to5mac.com/2022/01/09/steve-jobs-original-iphone-announcement-15-years/), [European Rhetoric transcript](http://www.european-rhetoric.com/analyses/ikeynote-analysis-iphone/transcript-2007/)).
**Verified example.** Jobs's iPhone reveal is the canonical case. The transcript shows him repeating "an iPod, a phone, an internet communicator. An iPod, a phone, an internet communicator" — the audience claps for the third device, then realizes it's the same product.
**Failure mode.** Requires three elements that *each* sound like complete products on their own. Forced trios fall flat.

### 3.10 The Promised Land tease (hope via outcome-first framing)

**What.** Open the demo on the *outcome state* — the dashboard with the win highlighted, the report already generated, the harm already prevented — and only then back-fill the machinery.
**Trigger.** Hope (§2.4).
**Source.** Andy Raskin's strategic narrative framework, step 3 ([The Greatest Sales Deck I've Ever Seen](https://medium.com/the-mission/the-greatest-sales-deck-ive-ever-seen-4f4ef3391ba0)).
**Verified example.** Drew Houston's 2007 Dropbox MVP video. The video does not explain the synchronization architecture; it shows the file appearing on the second computer. Also TreeHacks 2026 #20 [Mobius](https://devpost.com/software/mobius-the-first-ai-agent-to-build-a-unicorn) — the outcome ("AI builds an entire unicorn-shaped startup") is asserted before any description of the agent loop.
**Failure mode.** If the Promised Land is too abstract (a screen that says "the future of work"), it's not Raskin's tease — it's an unsupported claim. The teaser must show a *specific, concrete artifact* of the post-product world.

### 3.11 The shrinking self (awe via vastness, per Keltner)

**What.** Visualize a scale that the audience cannot mentally hold — 70,000 voxels, 11 hours of agent autonomy, 3,000 commits per hour, 50 sites federated, 1.1B-relationship knowledge graph.
**Trigger.** Awe (§2.1, vastness dimension).
**Source.** Keltner's awe research (vastness + accommodation).
**Verified example.** TreeHacks 2026 #36 [Longshot](https://devpost.com/software/longshot) — *"Burned $5,500 running 100+ coding agents at 1,200 commits/hr to build Minecraft in one shot."* Won Modal Sandbox Challenge. The numbers ARE the awe device. TreeHacks 2026 #37 [RescueRX](https://devpost.com/software/rescuerx) — *"97k-entity / 5.87M-relationship knowledge graph."* Tribe V2 (source 006): 70K voxels × 700 subjects.
**Failure mode.** Numbers without *visualization* are forgettable. The vastness has to be *felt* visually — a globe pulsing, a force-graph filling the frame, a count ticking up.

### 3.12 The user-becomes-the-demo (recognition via real-time inclusion)

**What.** Pull a judge or audience member into the demo's input stream. Take their voice, their image, their location, their data — and process it live.
**Trigger.** Recognition (the judge sees themselves on screen) → surprise (the system did something to them they didn't predict).
**Source.** Norman's visceral level (the judge's own face is the most attention-grabbing image in any frame); Coats rule #15 (*"if you were your character, in this situation, how would you feel?"* — the demo enforces this by making the judge *be* the character).
**Verified example.** TreeHacks 2026 #1 Shepherd — the demo invites the audience to wave their arms in front of the cane; the cane reacts. TreeHacks 2026 #17 [jiggle wiggle](https://devpost.com/software/jiggle-wiggle) — the AI movement coach watches whoever is in front of the camera, including a judge if they stand up.
**Failure mode.** Privacy. Asking a judge to upload data that doesn't get cleanly deleted poisons the demo. Always show the deletion happening.

### 3.13 The before/after kill shot (Coats rule #19 inverted)

**What.** Coats rule #19: *"Coincidences to get characters into trouble are great; coincidences to get them out of it are cheating."* Demo translation: introduce the user's pain via a *concrete, specific* moment of harm (the trouble they fell into), then show the system delivering them out of it via *non-coincidental, mechanical* causation. The "out" beat must look like the system did it on purpose, not like it got lucky.
**Trigger.** Recognition + hope.
**Source.** Coats Pixar Rule #19 ([Aerogramme Studio](https://www.aerogrammestudio.com/2013/03/07/pixars-22-rules-of-storytelling/)).
**Verified example.** TreeHacks 2026 #11 [ShadowGuard](https://devpost.com/software/shadowguard-l6yv7p) — the demo shows a doctor about to email a patient's PHI externally (the trouble); the firewall redacts it inline (the mechanical out). The "out" feels engineered, not lucky.
**Failure mode.** If the demo's "out" beat looks like a coincidence (the system happened to catch this one case), the trust collapses. The mechanism has to be visibly general.

### 3.14 The stakes name (pride / hope via Coats rule #16)

**What.** Coats rule #16: *"What are the stakes? Give us reason to root for the character."* In demo terms: name what is *lost* if the system doesn't exist, in the user's voice, with specificity. ("If this surgical safety net doesn't catch the missing gauze, a 73-year-old grandmother goes home with it inside her.")
**Trigger.** Pride (rooting-for); hope (relief at the imagined catch).
**Source.** Coats rule #16; Schwartz's awareness ladder (the more-aware the audience, the less you have to spell it out — calibrate the stakes language to the audience).
**Verified example.** TreeHacks 2026 #8 [HeartStart](https://devpost.com/software/heartstart) — the stakes are named in the project title. CPR-on-cardiac-arrest names what is at stake (a life, in seconds). TreeHacks 2026 #11 ShadowGuard names the stake as "PHI leaving the hospital."
**Failure mode.** Abstract stakes ("we're transforming the future of work") trigger nothing. Specific stakes ("if this fails, this named person experiences this named harm") trigger pride and hope.

### 3.15 The two-second silence (visceral attention reset, per Norman)

**What.** A deliberate beat of silence, of black screen, of un-narrated motion — anywhere from 1 to 3 seconds — placed immediately after a surprise or awe beat. Lets the judge *finish feeling* before the next claim arrives.
**Trigger.** Norman's visceral level — silence is the audio equivalent of negative space. Gives the felt-emotion room to land.
**Source.** Norman's *Emotional Design* on the visceral level; the production discipline of every Pixar short film.
**Verified example.** Cannot tag a specific hackathon demo for this; it is a craft variable in *all* good demos. The closest analogue is the way Steve Jobs *paused* between repetitions in the iPhone reveal.
**Failure mode.** Most hackathon teams over-narrate. Eliminating 4 seconds of voice-over and replacing them with 4 seconds of UI motion is one of the highest-leverage demo edits available.

### 3.16 The one-question voice handoff (recognition + hope via the agent answering)

**What.** End the demo by speaking *to* the system rather than about it. The judge hears the system answer a question they themselves wanted to ask.
**Trigger.** Recognition (the system understood the question) + hope (the system can answer questions like this in production).
**Source.** Coats rule #15 + StoryBrand (let the judge *be* the user for the final 10 seconds).
**Verified example.** Jarvis (`projects/jarvis.md`, §"Why it would win"): *"upload an MP4 → see the dashboard populate → ask the voice agent a question."* The voice question IS the closing beat. TreeHacks 2026 #14 [Bloom](https://devpost.com/software/bloom-dvjpea) — the demo ends on the family member asking the voice agent a question about grandma; the agent answers with cited evidence.
**Failure mode.** If the voice handoff is scripted and the judge can tell, recognition collapses. Take a real question from the audience.

---

## 4. The 4-act demo arc + emotional beats

The HookBodySurpriseLand structure mapped to specific emotions per act, sequenced for a 90-second demo.

### Source: Andy Raskin, *The Greatest Sales Deck I've Ever Seen* (Mission.org / Medium, 2016)

The five-step strategic narrative Raskin extracted from the Zuora deck (verbatim per the source):

1. **Name a Big, Relevant Change in the World.** *"Name the undeniable shift in the world that creates both (a) big stakes and (b) huge urgency for your prospect."*
2. **Show There'll Be Winners and Losers.** Demonstrate how the change will create *"big winners and big losers,"* showing prospects both the highly positive future of adapting and the unacceptably negative future of inaction.
3. **Tease the Promised Land.** *"Present a 'teaser' vision of the desired future state prospects will achieve — what Raskin calls the Promised Land — before introducing product details."*
4. **Introduce Features as 'Magic Gifts'.** Position product capabilities as tools helping prospects reach their goal, framing them like *"the lightsaber, wizardry and spells"* in epic narratives.
5. **Present Evidence You Can Deliver.** *"Provide proof through customer success stories or product demos showing you've already helped similar prospects reach the Promised Land."*

Raskin's load-bearing line on what attracts attention, citing Robert McKee: *"what attracts human attention is change."*

### The 4-act version, with emotional beats per act

The HackTech-style 90-second demo can be sliced four ways. Each act is given an intended emotional arc and the sources / mechanics that deliver it.

| Act | Seconds | Beat | Intended emotion | Mechanic |
|---|---|---|---|---|
| **1. Hook** | 0–20 | Name the undeniable shift; name the harm. | Anger (or disgust) | Slop side-by-side (§3.8) or Stakes name (§3.14). Quote source 003 anger-shaped framing if useful. |
| **2. Body** | 20–55 | Show the system doing the work, in the user's surface, with grounded citations visible. | Recognition + comfort/safety | The kill (§3.2) + grounded citation chip (§3.4) + witnessed dissent (§3.6). |
| **3. Surprise** | 55–75 | The toggle / reveal-by-counting / wow-object moment. The single load-bearing surprise the demo is built around. | Surprise → awe | The toggle (§3.1), reveal-by-counting (§3.9), wow object (§3.3), or shrinking self (§3.11). |
| **4. Land** | 75–90 | Promised Land artifact; cited testimony; one-question voice handoff. End on the judge wanting more. | Hope + pride | Promised Land tease (§3.10) + cited testimony (§3.5) + one-question voice handoff (§3.16). |

Coats's Story Spine (Kenn Adams's original 1991 version, popularized via Pixar) maps onto the same arc:

> *"Once upon a time there was ___. Every day, ___. One day ___. Because of that, ___. Because of that, ___. Until finally ___."* (Pixar Rule #4, Emma Coats; Adams's original is *"Once upon a time" / "every day" / "but then one day" / "and because of that... and so..." / "until finally" / "and ever since that day"* per [SessionLab](https://www.sessionlab.com/methods/story-spine).)

Sliced into the demo arc:

- **Once upon a time / every day** = the world before the system existed (act 1: Hook)
- **One day** = the surface the user came to with their problem (act 2: Body opens)
- **Because of that, because of that** = the system's machinery doing its work (act 2: Body continues)
- **Until finally** = the surprise / load-bearing reveal (act 3: Surprise)
- **And ever since that day** = the Promised Land state (act 4: Land)

Both frameworks (Raskin and Adams/Coats) compress to the same shape: world-with-pain → introduction-of-system → demonstrated-difference → world-after.

---

## 5. TreeHacks 2026 emotional teardown

For each of fifteen winners from the scrape (`scrapes/treehacks-2026-winners.md`), the dominant emotion their demo most likely triggered, the mechanic that delivered it, and a quote (from the scrape's pitch column or the project's Devpost framing) that captures why it landed. Caveat: dominant-emotion calls are inferred from project descriptions + winning track + scrape teardown, not from watching every demo video; they are best-leads, not certainties.

### 5.1 Shepherd — grand prize 1, OpenEvidence Healthcare grand prize

- **Dominant emotion:** awe (physicality) + pride (named user as protagonist).
- **Mechanic:** wow object (§3.3) + cited testimony (§3.5).
- **Quote (scrape):** *"Motorized smart cane using iPhone LiDAR + CV that physically steers blind users away from obstacles, with GPS voice nav."*
- **Why it landed (per scrape):** *"a real physical thing that moves during the demo wins."* The cane's physical steering is the awe; the named user is the blind person whose autonomy is restored.

### 5.2 Robosurge — grand prize 2

- **Dominant emotion:** awe (vastness — one surgeon replacing a 10-person team) + hope (Promised Land of remote care).
- **Mechanic:** shrinking self (§3.11) + Promised Land tease (§3.10).
- **Quote (scrape):** *"'Cursor for surgery' — VR + AI-controlled robotic arms let one surgeon operate remotely, replacing a 10-person team."*
- **Why it landed:** the comparison "10-person team → 1" is the awe-shape claim; "Cursor for surgery" is the recognition-shape framing (every judge has used Cursor).

### 5.3 ChromaChord — grand prize 3, Suno Best Musical Hack

- **Dominant emotion:** recognition (musicians know the chord-suggestion problem) + comfort (24-D chroma vector grounds the suggestions in theory, not vibes).
- **Mechanic:** the kill (§3.2 — DAW-adjacent surface) + grounded citation (§3.4 — citations to chord theory).
- **Quote:** *"Real-time chord suggestions from 24-D chroma vector theory, plus track generation."*
- **Why it landed:** the music is *audible* during the demo — Norman's visceral level — and the theoretical grounding makes the suggestions feel earned rather than guessed.

### 5.4 diffuji — Most Creative + Neo "Most Likely to Become a Product"

- **Dominant emotion:** awe (physicality of the printed photo) + surprise (the photo is *half-real, half-dreamed*).
- **Mechanic:** wow object (§3.3) + the toggle implicitly (the gap between input photo and dreamed output).
- **Quote:** *"Diffusion-powered instant camera printing half-real / half-dreamed thermal photos."*
- **Why it landed:** thermal printer = the moment of the artifact arriving in the room.

### 5.5 Mira — Most Impactful + OpenAI AI Track 1st

- **Dominant emotion:** comfort/safety (caregiver dashboard always knows where the elder is) + pride (the elder is the named protagonist).
- **Mechanic:** grounded citation chip (§3.4 — every alert cites the depth-anchored frame) + cited testimony (§3.5 — the elder's caregiver dashboard is on screen).
- **Quote (scrape):** *"Eldercare AI on Ray-Ban Meta glasses: 3D scene reconstruction + medical reasoning + caregiver dashboard."*
- **Why it landed:** the spatial-VLM stack (Grounded SAM 2 + Grounding DINO + MapAnything) is the awe-shape stack; the eldercare framing is the pride-shape claim.

### 5.6 Freak in the Sheets — Most Technically Complex + Human Capital Fellowship

- **Dominant emotion:** awe (the "this should not be possible" beat) → laughter.
- **Mechanic:** shrinking self (§3.11) + reveal-by-counting (§3.9) — "C compiles to LLVM compiles to ... a Google Sheet."
- **Quote:** *"LLVM backend that compiles real software to a Google Sheet."*
- **Why it landed:** the gap between the audience's mental model of a Google Sheet and the demonstrated reality of one is so wide that accommodation is forced.

### 5.7 Project Lend — Anthropic Human Flourishing 1st

- **Dominant emotion:** pride (real food delivered to real shelters during the hackathon) + hope (this could scale).
- **Mechanic:** cited testimony (§3.5) — *"sourced and shipped 50+ lbs to Palo Alto shelters during the hackathon itself."*
- **Quote (scrape):** *"Autonomous food bank — AI + robotics sourced and shipped 50+ lbs to Palo Alto shelters during the hackathon itself."*
- **Why it landed:** the demo could show the photograph of the food *arriving*. The claim is past-tense, not future-tense.

### 5.8 Tribune — Anthropic Human Flourishing 1st

- **Dominant emotion:** comfort/safety (every claim cited to a constituent voice clip) + recognition (every voter knows the feeling of being unheard by city council).
- **Mechanic:** grounded citation chip (§3.4) — *"every change cites a constituent."*
- **Quote (scrape):** *"'GitHub for democracy' — scrapes city council agendas, AI-phones residents, generates policy diffs where every change cites a constituent."*
- **Why it landed:** the audit-grade citation makes the demo's central claim ("we represent voices") clickable in real time.

### 5.9 Bloom — Anthropic Human Flourishing 1st + Decagon Best Conversation Assistant

- **Dominant emotion:** pride (the elder is the protagonist) + recognition (any judge with aging parents recognizes the problem).
- **Mechanic:** the kill (§3.2 — voice-call interface) + cited testimony (§3.5 — the family dashboard).
- **Quote:** *"Voice-first AI caretaker for seniors: cognitive monitoring (early-dementia signal), wearable health, family dashboard."*
- **Why it landed:** voice-first surface bypasses the need to learn an interface; eldercare framing triggers the universal recognition of caring for aging family.

### 5.10 Mobius — YC "Iconic Company" 1st + Modal Sandbox Challenge

- **Dominant emotion:** awe (vastness — 11+ hours, 3,000+ turns) → fear (the agent did this autonomously).
- **Mechanic:** shrinking self (§3.11) + reveal-by-counting (the count of agent turns).
- **Quote:** *"Autonomous agent runs 11+ hours, 3,000+ turns, builds a full-stack startup from zero (engineering + marketing + legal)."*
- **Why it landed:** the timescale ("11+ hours") and the count ("3,000+ turns") together produce a claim the audience cannot mentally hold.

### 5.11 Maestro — Suno Best Musical Hack (also covered in EdTech Innovation Hub press)

- **Dominant emotion:** awe (turning a *broom* into an instrument) + recognition (the universal "I tried to play air guitar as a kid" memory).
- **Mechanic:** wow object (§3.3) + recategorization-style surprise (§3.9 — broom is now a guitar).
- **Quote:** *"Turn a broom into a playable guitar — CV + hand tracking + posture coach + AI music gen."*
- **Why it landed:** the everyday-object-becomes-something-else beat. Per [EdTech Innovation Hub](https://www.edtechinnovationhub.com/news/stanford-team-wins-treehacks-with-ai-system-that-turns-a-broom-into-a-playable-instrument), the framing was "playing the air guitar made real."

### 5.12 The Orchestration Co. of Palo Alto — Interaction Co. (Poke)

- **Dominant emotion:** awe (visionOS spatial control room) + recognition (the office metaphor — every judge has supervised humans).
- **Mechanic:** wow object (§3.3 — the headset) + the kill (§3.2 — desks-as-agents metaphor).
- **Quote (scrape):** *"Vision Pro AR control room where agents are 3D desks. Custom MCP tools spin up Modal sandboxes on demand. The killer-toggle interaction (look at desk → focus that agent) is the kind of 'wow' moment HackTech judges remember."* (lines 184–185)
- **Why it landed:** the spatial metaphor turns abstract agents into something the judge can see arranged in 3D.

### 5.13 Sentinel — Best Hardware Hack

- **Dominant emotion:** awe (vastness of the autonomous build) + comfort (it actually shipped a working OS).
- **Mechanic:** shrinking self (§3.11 — "from scratch in 24h") + cited testimony (§3.5 — the working bare-metal OS is the artifact).
- **Quote:** *"Full-stack AI agent that ships a working bare-metal OS to Raspberry Pi from scratch in 24h."*

### 5.14 ShadowGuard — OpenEvidence Healthcare Grand Prize

- **Dominant emotion:** anger (the doctor was about to leak PHI) → comfort (the firewall caught it).
- **Mechanic:** before/after kill shot (§3.13) + grounded citation chip (§3.4 — every redaction cites the rule it triggered).
- **Quote:** *"Network-layer AI firewall that detects + redacts PHI in real time before it leaves the hospital."*

### 5.15 Synapse — Perplexity Best Use of Sonar

- **Dominant emotion:** comfort/safety (every claim verifiable) + recognition (any reader of news knows the trust crisis).
- **Mechanic:** grounded citation chip (§3.4) — *"break content into atomic claims, verify each, show provenance."*
- **Quote:** *"'Claim-level truth forensics' — break content into atomic claims, verify each, show provenance."*

---

## 6. What Johnny's verbatim language reveals

Pulled from the README's Live thread (`themes/ai-paradox-invisible-use-cases/README.md`), Johnny's anchor problem statement, and the cross-source vocabulary the theme has accumulated. Each line gets one note on the emotion it is reaching for + how the demo could activate it.

- **"Restoring humanity in an age of AI"** (anchor problem statement, 2026-04-25). Reaching for: **pride** + **hope**. Demo activation: end on the user being more themselves than at the start (the cited testimony, §3.5).
- **"Redefining what the renaissance looks like"** (anchor problem statement). Reaching for: **awe** (a worldview shift). Demo activation: the shrinking-self mechanic (§3.11) — show a vastness scale (countless artists, countless voices) the system enables.
- **"Un-black-box"** (anchor). Reaching for: **comfort/safety**. Demo activation: grounded citation chip (§3.4); witnessed dissent (§3.6).
- **"Socratic version" / "Socratic interaction surface"** (anchor + interaction protocol). Reaching for: **recognition** (the user feels seen rather than told). Demo activation: the system asks the user a question and shows it remembering the answer; one-question voice handoff (§3.16).
- **"Fighting back against the things where AI can be used terribly and irresponsibly"** (Live thread, 2026-04-25). Reaching for: **anger**. Demo activation: slop side-by-side (§3.8); witnessed dissent visible diff against trends-slop output (§3.6).
- **"Augmented human intelligence"** (Live thread). Reaching for: **hope** + **pride**. Demo activation: the Promised Land tease (§3.10), where the artifact shown is the user's own work *amplified* (not generated for them).
- **"Spawns the human renaissance"** (Live thread). Reaching for: **awe**. Demo activation: the wow object (§3.3) made of human creative output that would not have existed without the system.
- **"Challenges a lot of previous beliefs"** (Live thread). Reaching for: **surprise** + **recognition**. Demo activation: the toggle (§3.1) where the toggle is *the audience's prior belief about what AI can/cannot do*.
- **"Each sponsor should be intrigued and in love with what we have"** (Live thread). Reaching for: **awe** (vastness/virtuosity) + **comfort** (it actually works). Demo activation: a load-bearing capability per sponsor, each with a citation chip the sponsor's reps can click.
- **"Hollowed-out feeling toward ourselves"** (source 002 vocabulary, theme README). Reaching for: **recognition** (of the user's own collapsed agency). Demo activation: the 0.3-second mirror (§3.7).
- **"Trends slop" / "comment section in flesh"** (source 003 vocabulary). Reaching for: **disgust** → **anger**. Demo activation: slop side-by-side (§3.8), ideally with the brain-response visualization (§7).
- **"Filter World"** (source 002, citing Chayka). Reaching for: **recognition** (of the user's own confinement). Demo activation: show the user the algorithm's last 24-hour selection alongside what the user would have chosen if they'd known.
- **"Polyphony"** (synthesized from source 005's "voices, ideas, and perspectives from countless others"). Reaching for: **awe** + **pride**. Demo activation: visualize the *plurality* of voices the system surfaces, not the *singleness* of its answer.
- **"Secret universe"** (source 005's framing of the mind). Reaching for: **awe**. Demo activation: the demo respects the inaccessibility of the user's inner world; explicitly does not claim to read it (per source 006's caution that Tribe V2 predicts response to *external* stimuli, not inner state).
- **"The digital Renaissance is here"** (synthesized from source 002's "we are literally living in a digital Renaissance" + Johnny's redefining-the-renaissance frame). Reaching for: **hope**. Demo activation: the Promised Land tease (§3.10) framed as a scene that already happened in the demo, not a future projection.

---

## 7. The Tribe V2 emotional payload

Tribe V2 (source 006) is the most direct *emotion-as-feature* instrument the team has access to. Architecturally per the source: feed it video + audio + text → it predicts how a human brain would respond across **70,000 voxels** of fMRI activity. Critically, per the source: *"Does NOT read your private thoughts. Predicts brain reactions to external stimuli, not internal monologue, intention, emotion-from-the-inside."* Stay precise on this.

The demo theatre Tribe V2 enables is structurally new. A non-exhaustive list of demo-able artifacts a Tribe-V2-grounded system could put on screen:

- **Brain-response side-by-side.** Render the predicted neural-response heatmap to a piece of trends-slop content beside the predicted heatmap to a piece of authentic / curated content. The visual difference IS the case for the project. This is the slop side-by-side (§3.8) made literal — disgust converted from rhetoric to measurable visualization.
- **Modality-attribution color map.** Per source 006: *"By assigning text, audio, and video scores to red, green, and blue channels, we get this detailed, functional map of the cortex."* The demo can show *which modality* of the slop is doing the brain-flattening work — useful for the auditor to surface the cause, not just the effect.
- **Pre-publish neural pre-screen.** A creator iterates a piece of content; the dashboard updates the predicted brain response in seconds (per source 006's note that fMRI temporal resolution caps the model's latency at ~5s). The hope beat (§3.10): the creator's revised piece looks measurably more *alive* than the slop baseline.
- **"You would have felt this" mirror.** For a piece of content the user is about to consume, show the predicted neural response *they* would have. This is the un-black-box (§2.6 comfort mechanic) made literal — the user can audit what the algorithm was about to do to them.
- **Functional-network reverse-engineering as trust signal.** Per source 006: Tribe V2's last-layer ICA components *"align almost perfectly with the major functional networks of the human brain"* — primary auditory, language, motion, default-mode, visual. The demo can render the ICA components themselves: comfort via the system's congruence with biology.

Cautions, restated from source 006 so the demo doesn't overreach:
- **Reverse-inference risk.** A region lighting up does not mean the user is feeling X. *"Just a brain region activates doesn't mean you know the psychological state behind it."* (Thomas Zoega Ramsoy via source 006.) Don't make UX claims that depend on reverse inference.
- **Non-commercial license.** Hackathon-stage demo is fine; do not claim commercial deployment.
- **Privacy framing.** UN Special Rapporteur Ana Brian Nougrères has flagged brain-prediction tech for manipulation potential. Frame the demo as *creator pre-screening their own content* (good version) rather than *advertisers pre-screening targeting* (bad version) explicitly.

Cross-link: `themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/006-tribe-v2-meta-trimodal-brain-encoder.md`.

---

## 8. Anti-patterns that kill emotional resonance

Each anti-pattern names a failure mode + the emotion it kills + the source for why.

- **Over-explanation kills awe.** If the team narrates *how* the wow object works in the same beat the wow object is moving, the audience cannot accommodate (Keltner's second dimension). Let the awe land in silence (§3.15) for two seconds before naming the mechanism.
- **Hedging kills hope.** Phrases like *"in a real production system..."*, *"with more time we would..."*, *"this is a prototype but..."* — every one of these signals the team does not yet believe their own Promised Land. Strip them. Per Michael Seibel ([SaaStr](https://www.saastr.com/the-y-combinator-guide-to-perfectly-pitching-your-seed-stage-startup-with-michael-seibel/)): *"Lead with strength."*
- **Generic 'AI for X' kills recognition.** Per Seibel's Two-Sentence Rule: the pitch must be impossible to misunderstand. *"AI for healthcare"* is impossible to *understand* — there is no specific user, no specific pain, no specific surface. Recognition requires specificity: a person, a moment, a concrete artifact.
- **Too many features kills comfort.** Walter's hierarchy: reliability is the floor of delight. A demo that shows seven features in 90 seconds shows zero of them reliably. One load-bearing feature, demonstrated to completion, generates more trust than seven half-shown features.
- **Future-tense claims kill pride.** Pride is past-tense ("the system *did* this for this person"). Future-tense claims ("this will help millions...") are forecasts, not pride beats. Project Lend's photographed-shelter-delivery is past-tense; that is why it lands.
- **Coincidence-out-of-trouble kills trust.** Coats rule #19, applied to demos: if the system's "out" beat looks lucky rather than mechanical, the audience believes the demo was cherry-picked. The "out" must look general and engineered.
- **Surface novelty without substance kills surprise.** A "wow" moment that the audience cannot trace back to a real mechanic produces a one-second hit of surprise that decays into skepticism in the next 30 seconds. The toggle (§3.1) works because GreenChain's GLEC factor table is real and the 55× ratio is inspectable. Surprise without substance is uncanny-valley surprise.
- **Asking the judge to take notes kills attention.** Norman's behavioral level: cognitive load competes with felt-response. Anything the demo asks the judge to *do mentally* (memorize, calculate, decode jargon) starves the emotional channel.
- **Bad audio kills everything.** The visceral level (Norman) is multi-sensory and *immediate*. A demo with crackly audio loses the audience in the first three seconds — before any of the engineered mechanics get a chance to land.
- **Apologizing for the demo kills trust.** ("Sorry, the wifi is being weird..." / "I'll have to type fast because we ran out of time...") — every apology is a retraction of the system's reliability claim. If something breaks, narrate around it as if it were planned.
- **Leading with the team / the tech stack kills the user-as-hero frame.** Donald Miller's StoryBrand: the customer is the hero, the brand is the guide. A demo that opens with *"we used K2 Think + Dedalus + Modal + ..."* puts the team's tools on stage instead of the user's pain. Open on the user.
- **Closing on the team's roadmap kills the Land beat.** The Land (act 4) is where hope and pride get sealed. Closing on *"things we'd build next"* shifts the audience back into evaluation mode and bleeds the felt-emotion away.

---

## 9. The minimum 90-second emotional storyboard template

Second-by-second slot template the team fills in once Johnny names the demo. Each slot names: visual + audio + intended emotion + source mechanic.

| Time | Visual | Audio | Intended emotion | Source mechanic |
|---|---|---|---|---|
| 0–3 | Cold open: an artifact of the *world-with-pain* (a screenshot of the slop feed; a frame of comprehension-debt code; a transcript of trends-slop advice). | Silence, or one ambient cue. | Recognition (the judge sees the world they live in). | Stakes name (§3.14). |
| 3–10 | Caption / spoken line: name the harm in one sentence, in the user's voice. | Voice-over: *"Every day, [user] is told what to like, what to think, what to ship. Until..."* | Anger or disgust. | Story Spine (every day → one day) + slop side-by-side (§3.8). |
| 10–20 | Cut to the user surface — the familiar UI (iMessage, FaceTime, Notion, browser tab). | Voice-over: *"Today, [user] does [specific action]."* | Recognition. | The kill (§3.2). |
| 20–35 | The system surface populates with cited evidence; citation chips visible; auditor's diff visible. | Voice-over names ONE thing, then silence; UI plays. | Comfort/safety. | Grounded citation chip (§3.4) + witnessed dissent (§3.6). |
| 35–55 | Sustained body — the system does its work; clicks reveal evidence; a single chip is hovered to show the underlying source. | Minimal voice-over; let the UI breathe. | Comfort + building hope. | Grounded citation chip in action. |
| 55–60 | **Setup** for the surprise: the user is about to do the toggle / press the button / trigger the reveal. | Voice-over: *"Watch this."* | Anticipation. | Pre-toggle setup (§3.1, §3.9). |
| 60–70 | **The surprise:** toggle / reveal / wow-object motion. UI changes dramatically, or the physical thing moves. | Brief reaction sound; let the moment sit. | Surprise → awe. | The toggle (§3.1) / reveal-by-counting (§3.9) / wow object (§3.3). |
| 70–73 | **Two-second silence** for the awe to land. | None (or ambient). | Awe sustaining. | Two-second silence (§3.15). |
| 73–82 | The Promised Land artifact: the dashboard showing the user's *augmented* output, the cited testimony of the named beneficiary. | Voice-over: *"And ever since that day, [user] is [more themselves / no longer fooled / not alone]."* | Hope + pride. | Promised Land tease (§3.10) + cited testimony (§3.5). |
| 82–90 | One-question voice handoff: someone in the audience (or a judge) asks the system a question; system answers with a cited reply. | The judge's voice + the system's voice. | Pride + recognition. | One-question voice handoff (§3.16). |

Cross-cutting constraints to fill in *after* Johnny names the demo:
- **Load-bearing surprise** at 60–70s must be ONE beat. Not two. (Two surprises in a single demo dilute each other.)
- **Story Spine** must be writable in one breath: *"Once upon a time [domain]. Every day [user pain]. One day [user encounters system]. Because of that [the body]. Until finally [the surprise]. And ever since that day [the Promised Land]."* If the team can't write that paragraph, the demo is not yet specified.
- **Closing line** must contain a verb in past or present tense. Future-tense kills pride (§8).
- **Backup loop** for any wow-object beat must be pre-recorded (§3.3 failure mode).

---

## 10. Verbatim quote vault

Twelve quotes from primary sources, preserved verbatim with citation, ready for the PRD's framing pages.

1. **Don Norman, *Emotional Design*** (per [Wikipedia summary of *Emotional Design*](https://en.wikipedia.org/wiki/Emotional_Design), p. 101): *"technology should bring more to our lives than the improved performance of tasks: it should be richness and enjoyment"*.

2. **Don Norman, on the visceral level** (per [Wikipedia](https://en.wikipedia.org/wiki/Emotional_Design)): *"attractive products work better because they can engage multiple senses to evoke emotional responses"*.

3. **Aarron Walter, *Designing for Emotion*** (per [NN/g summary](https://www.nngroup.com/articles/theory-user-delight/)): the hierarchy of user needs places **functional → reliable → usable → pleasurable**, with the load-bearing principle that *"a product can be delightful only if it is usable"* and reliability is the floor of every higher delight.

4. **Dieter Rams, *Ten Principles for Good Design*** (per [Design Museum](https://designmuseum.org/discover-design/all-stories/what-is-good-design-a-quick-look-at-dieter-rams-ten-principles)), three of the ten relevant to demo emotional resonance:
   - *"Good design makes a product understandable."*
   - *"Good design is honest."*
   - *"Good design is unobtrusive."*
   Plus the umbrella principle: *"less, but better."*

5. **Emma Coats, Pixar Rule #4 (Story Spine)** (per [Aerogramme Studio](https://www.aerogrammestudio.com/2013/03/07/pixars-22-rules-of-storytelling/)): *"Once upon a time there was ___. Every day, ___. One day ___. Because of that, ___. Because of that, ___. Until finally ___."*

6. **Emma Coats, Pixar Rule #16** (per [Aerogramme Studio](https://www.aerogrammestudio.com/2013/03/07/pixars-22-rules-of-storytelling/)): *"What are the stakes? Give us reason to root for the character."*

7. **Emma Coats, Pixar Rule #19** (per [Aerogramme Studio](https://www.aerogrammestudio.com/2013/03/07/pixars-22-rules-of-storytelling/)): *"Coincidences to get characters into trouble are great; coincidences to get them out of it are cheating."*

8. **Andy Raskin, *The Greatest Sales Deck I've Ever Seen*** ([Mission.org / Medium, 2016](https://medium.com/the-mission/the-greatest-sales-deck-ive-ever-seen-4f4ef3391ba0)): *"Name the undeniable shift in the world that creates both (a) big stakes and (b) huge urgency for your prospect."* And later, citing Robert McKee: *"what attracts human attention is change."*

9. **Dacher Keltner & Jonathan Haidt, definition of awe** (per [Greater Good Science Center, Berkeley](https://greatergood.berkeley.edu/article/item/why_do_we_feel_awe)): *"the feeling of being in the presence of something vast that transcends your understanding of the world."* And: *"awe — more so than emotions like pride or amusement — leads people to cooperate, share resources, and sacrifice for others."*

10. **Donald Miller, *Building a StoryBrand*** (per [Gravity Global](https://www.gravityglobal.com/blog/complete-guide-storybrand-framework)): *"The Hero of your brand story is not you. The Hero is your Customer. You are the Guide."* Operative principle: *"If you confuse, you lose."*

11. **Eugene M. Schwartz, *Breakthrough Advertising*** (1966, per multiple summaries including [SolidGrowth](https://www.solidgrowth.com/book/breakthrough-advertising)): *"No sentence can be effective if it contains only facts. It must also contain emotion, image, logic and promise."*

12. **Pieter Hintjens, on software philosophy** (per [Goodreads author notes](https://www.goodreads.com/author/show/6463940.Pieter_Hintjens) on the ZeroMQ founder's writing): *"the real physics of software is the physics of people, specifically about our limitations when it comes to complexity and our desire to work together to solve large problems in pieces."* (Paraphrase from Hintjens's collected writing; verify against original *Social Architecture* / *The Psychopath Code* primary text before quoting in PRD.)

Bonus quote (theme-internal, not strictly primary-source but load-bearing for our work):

13. **Source 003 (`003-trends-slop-and-the-comment-section-in-flesh.md`)**, the load-bearing one-liner: *"It's not so much a thinking product as it is a presentation product."* And: *"a bad idea that sounds bad, you could deal with that. But a bad idea that sounds brilliant — that's a $250 million lawsuit."*

14. **Source 005 (`005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md`)**, the polyphony framing: *"your secret mind isn't just yours, but a collaborative creation between you and all the human minds that came before."*

15. **Source 002 (`002-algorithmic-culture-flattening.md`)**, the autonomy question — the cleanest sentence the theme has produced for triggering recognition: *"How do you know what you like? How do you know who you are if you have always had an algorithm telling you what to like and who to be and who everyone else is?"*

---

## Notes on provenance and verification

- **Primary verbatim sources:** Pixar 22 Rules (Coats), Story Spine (Adams via Coats), Awe definition (Keltner & Haidt via Greater Good), Story Spine fields (SessionLab summary of Adams), Andy Raskin's strategic narrative steps (Mission.org), MLH judging plan (MLH guide). All web-fetched on 2026-04-25 during this research session.
- **Inferred framings (best lead, not verified):** Per-winner emotional teardowns in §5 are inferred from the scrape's pitch column + winning-track signal, not from watching every demo video. Treat as best-leads; re-verify against actual demo recordings before using in the PRD.
- **Synthesis (not literally cited):** §3.7 (the 0.3-second mirror) is a synthesis of source 005's mind-as-gap framing applied to the AI-paradox theme; no exact 1:1 hackathon precedent at TreeHacks 2026. §6 connects Johnny's verbatim language to the taxonomy in §2 — the connections are inferential.
- **Caveats:** Don Norman's exact wording for the three levels was attempted via [Interaction Design Foundation primary article](https://www.interaction-design.org/literature/article/norman-s-three-levels-of-design) but the WebFetch for that URL returned a domain-safety error. Quotes used in §10 are from the [Wikipedia Emotional Design summary](https://en.wikipedia.org/wiki/Emotional_Design) and from secondary verifications. Re-verify Norman's exact wording from the book itself before final PRD use.
- **Scope discipline:** Per Johnny's Socratic protocol, this file does not propose the project, the architecture, or the demo. It catalogs techniques + frameworks. The 90-second template in §9 is a *form* the team fills in; it does not name the content.
