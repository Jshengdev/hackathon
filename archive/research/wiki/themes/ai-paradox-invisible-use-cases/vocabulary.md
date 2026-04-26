---
file-type: vocabulary
status: verified
last-verified: 2026-04-25
supports-decisions:
  - ../../decisions/004-socratic-protocol-installed.md
  - ../../decisions/005-best-use-of-ai-as-hard-target.md
  - ../../decisions/006-tribe-v2-as-special-mode.md
  - ../../decisions/007-agent-swarms-as-coordination-pattern.md
  - ../../decisions/011-demo-over-execution.md
cites-sources:
  - sources/001-hak-systems-thinking.md
  - sources/002-algorithmic-culture-flattening.md
  - sources/003-trends-slop-and-the-comment-section-in-flesh.md
  - sources/deep-dives/tribe-v2-canonical-reference.md
  - sources/deep-dives/emotional-depth-demo-theatre-canonical.md
  - window-2-research-deepening/sources/004-multi-agent-alignment-actor-auditor-mediator.md
  - window-2-research-deepening/sources/005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md
  - window-2-research-deepening/sources/006-tribe-v2-meta-trimodal-brain-encoder.md
  - window-2-research-deepening/sources/007-karpathy-llm-wiki-pattern.md
  - ../../../caltech/context/team/johnny-public-corpus.md
  - ../../../caltech/context/team/johnny.md
cross-links:
  - README.md
  - live-thread.md
  - ../../decisions/README.md
---

# Vocabulary — AI paradox / invisible use cases theme

> Cross-source glossary for the AI-paradox theme. Every named term across all sources (001–007 + deep-dives + Johnny's public corpus + window-2 syntheses). One row per term: definition + companion / opposing terms + provenance.
>
> Schema (per consolidation protocol): | Term | Source(s) | One-line definition | Companion terms | Opposing terms |
>
> Read this when the PRD-builder asks "what does X mean?" — every term resolves here in one click.

---

## Failure-mode vocabulary (the disease the theme names)

| Term | Source(s) | One-line definition | Companion terms | Opposing terms |
|---|---|---|---|---|
| **Comprehension debt** | 001 | The tax for shipping AI-generated code you don't understand; invisible until it isn't. | cognitive debt; jagged frontier | the theory; deletion test |
| **Cognitive debt** | 001 | Same as comprehension debt; alt phrasing the source uses interchangeably. | comprehension debt | the theory |
| **Jagged frontier** | 001 (Harvard term) | AI is sharp in some places and surprisingly dull in others, sometimes in the same session; knowing where the edges sit is core literacy. | comprehension debt; double distortion | the theory; deletion test |
| **Seniority-biased technological change** | 001 (Hosseini & Lichtinger, Harvard) | Post-Q1-2023, gen-AI-adopting firms cut junior hiring while senior hiring kept rising; the pipeline that turned juniors into seniors broke. | the curriculum on purpose; forcing function | (no clean opposite — the 2026 reversal is the *response*) |
| **Probabilistic translator (not deterministic compiler)** | 001 | Why "AI is the next abstraction layer" is wrong: abstractions only work when the layer below is verifiable without inspection; LLM is a *collaborator you can trust only by understanding what it did.* | trends slop; presentation product | deterministic compiler; verifiable abstraction |
| **The dimming** | Johnny corpus (TEDx) | Felt reduction in cognitive effort when AI does the thinking. | copilot-to-autopilot; cognitive offloading; comprehension debt | productive resistance; the seed |
| **Copilot-to-autopilot** | Johnny corpus (TEDx) | Invisible intellectual de-skilling — the user moves from supervised AI use to unsupervised dependence without noticing. | the dimming; cognitive offloading | productive resistance; deliberate practice |
| **Cognitive offloading** | Johnny corpus (TEDx) | Relinquishing thinking to machines without awareness. | the dimming; copilot-to-autopilot | the wrestle; productive resistance |
| **Filter World** | 002 (Chayka, *Filter World*) | Algorithmically-shaped culture; the umbrella term for opaque pre-screening of attention by recommender systems. | death of personal style; attention colonization; singularity of nothing-new | real curation; un-black-box; Socratic surface |
| **Death of Personal Style** | 002 (Mina Lee) | Cultural-flattening sub-claim; personal taste homogenizes under algorithmic curation. | Filter World; singularity of nothing-new | real curation; fingerprint |
| **Attention colonization** | 002 | The economic engine: companies are public + must grow → growth requires attention → attention extraction is the product. | Filter World; presentation product | productive resistance; the seed |
| **Singularity of nothing-new** | 002 | The cultural endpoint of algorithmic curation: culture is no longer made; it's created from existing culture, refined, regurgitated. | Filter World; trends slop; corpus mean | fingerprint; serendipity |
| **Hollowed-out feeling toward ourselves** | 002 | The personal endpoint: "we don't really know who we are or what we like" after years of algorithmic curation. | Filter World; the dimming | real curation; the seed |
| **Trends slop** | 003 (Harvard 30K-data-point study, claimed) | The corpus-mean output LLMs cluster around regardless of context — preferring differentiation, collaboration, long-term thinking, augmentation, no matter the prompt. | comment section in flesh; presentation product; corpus mean | grounded citation; non-deterministic guardrails |
| **Comment section in flesh** | 003 | What the LLM actually *is* — every Reddit thread, LinkedIn post, Medium article, half-literate Facebook comment, blended and poured into a suit. | trends slop; corpus mean | (none in corpus) |
| **Presentation product (not thinking product)** | 003 | The category error users make about AI — surfacing the most plausible-sounding average answer formatted to *look* reasoned. | trends slop; comment section in flesh | thinking product; auditable reasoning |
| **A bad idea that sounds brilliant** | 003 | The dangerous failure mode — a $250M lawsuit. Surface confidence decoupled from underlying validity. | trends slop; presentation product; surface confidence | grounded citation; auditable reasoning |
| **Mean-regression effect** | 003 | "AI takes the smartest people in the room and moves them toward the middle. It makes average sound like genius." | trends slop; corpus mean | fingerprint; the seed |
| **Surface confidence decoupled from underlying validity** | 003 (synth) | The architectural property all three sources name: the interface is *designed* to hide the decoupling. | trends slop; presentation product; comment section in flesh | grounded citation; auditor diff |
| **Double distortion** | 004 | Training data was already corrupted (internet optimized for outrage) AND RLHF raters were shaped by the same platforms — model learns to *perform* alignment without resolving the conflict. | jagged frontier; trends slop | external referent; non-platform-derived ground truth |
| **Vicious feedback loop** | 004 | AI gives a distorted view → humans create content based on it → that content becomes training data for the next generation of AI; self-amplifying distortion. | trends slop; Filter World | grounded citation; external referent |
| **24-month deadline** | 004 (single-source, unverified figure) | Personal AI shipping into phones/glasses now is locking in architectures during a window where today's design choices "shape what an entire generation thinks is real." | the clock | (none) |
| **Internal conflict** | 004 | Every LLM juggles a *world model* (objective facts) and a *human model* (preferences, emotions, culture); jagged frontier is the audible sound of these clashing. | jagged frontier; double distortion | aligned model; resolved model |

---

## Architectural-fix vocabulary (the cure shape)

| Term | Source(s) | One-line definition | Companion terms | Opposing terms |
|---|---|---|---|---|
| **Real curation** | 002 | Finding what resonates, having it become part of identity, forming groups around it (cf. high-school cliques) — vs. algorithmic curation which collapses time-to-dwell. | the seed; fingerprint; gardener | Filter World; algorithmic curation; trends slop |
| **Un-black-box** | theme README; Johnny anchor | Showing the user the algorithm's input → reasoning → output; making the system's reasoning audible. | Socratic surface; auditor diff; grounded citation; glass-box AI | trends slop; presentation product; opacity |
| **Glass-box AI** | yap (judge convos thread 3); ideation hooks | The "anti-blackbox" framing — show the AI's reasoning live, visualize swarm disagreement, brain-region clustering, semantic hierarchy. | un-black-box; auditor diff; auditable reasoning | trends slop; presentation product |
| **Socratic surface** | theme README | The product asks the user questions, surfaces their own past choices as a mirror, reflects rather than answers — the user develops the theory of their own use. | Socratic interaction protocol; reflection over measurement; the wrestle | yes-machine; sycophancy |
| **Augmented human intelligence** | Johnny anchor; window-2 thesis | The way humans should interact with AI to create human ingenuity, spawn the human renaissance, challenge previous beliefs — *not* AI-as-replacement. | augmentation; the seed; gardener; Renaissance | replacement AI; trends slop; corpus mean |
| **Conductor (vs. orchestra)** | 001 | Person who knows how the parts fit together, when the strings should hold back, when the brass should come in; AI is the orchestra, conductor is the human. | systems thinking; the theory | replacement AI; orchestra-without-conductor |
| **The theory** (Programming as Theory Building) | 001 (Naur 1985) | The program lives in the programmer's head — how the pieces connect, why they connect, what happens if you pull one out; the code is just the shadow. | systems thinking; conductor; deletion test | comprehension debt; the shadow |
| **The shadow (of the program)** | 001 (Naur 1985) | The code itself — what AI generates on demand. Distinct from the theory. | code; shipped artifact | the theory; systems thinking |
| **Three questions** | 001 | (1) Where does state live? (2) Where does feedback live? (3) What breaks if I delete this? — the operational test for whether you understand a system. | deletion test; systems thinking; the theory | comprehension debt |
| **Deletion test** | 001 | Pick a component; trace its blast radius mentally before touching it. Forces the theory back into the head. | three questions; systems thinking | comprehension debt |
| **Four unsexy moves** | 001 | (1) Design before you prompt (2) Specs as scaffolding (3) Run the deletion test (4) Study the generated code. The curriculum on purpose. | the curriculum on purpose; productive resistance | comprehension debt; vibe coding |
| **The curriculum on purpose** | 001 | Forcing functions installed by hand because AI removed the natural ones; the deliberate-training discipline juniors must self-impose. | four unsexy moves; productive resistance | the dimming; vibe coding |
| **Forcing function** | 001 | The natural pressure (failing publicly, sitting with code until you understood it) that turned juniors into seniors — removed by AI. | the wrestle; productive resistance | the dimming; cognitive offloading |
| **The wrestle** | 001 | The act of sitting with the problem until you actually understand it; AI didn't take the pressure away, it took the *wrestle* away. | forcing function; productive resistance; the theory | cognitive offloading; the dimming |
| **Fast-food analogy** | 001 | AI coding is fast food — useful when you know what a real meal tastes like, dangerous when your first 100 meals come from a drive-thru. | fitness analogy; the curriculum on purpose | the dimming; vibe coding |
| **Fitness analogy** | 001 | Average fitness dropped since manual labor disappeared, but elite athletes today are the fittest humans ever; coding is going down the same path. | fast-food analogy; deliberately-trained minority | (none — pure observation) |
| **Deliberately-trained minority** | 001 | The juniors who choose to cook / lift — who will compound and become more differentiated than any prior junior. | the curriculum on purpose; productive resistance | the dimming; cognitive offloading |
| **Productive resistance** | Johnny corpus (TEDx) | Sweet spot of friction an AI should provide before people abandon it for something easier; *"nobody's found it yet."* | the wrestle; forcing function | sycophancy; engagement-optimization |
| **Grounded citation** | wiki pattern; Tribune; Synapse; Edamame | Every output unit (sentence, number, row) carries a citation handle clickable back to its source artifact (event ID + timestamp + clip; or named dataset + row + URL). | auditor diff; provenance; auditable reasoning | trends slop; presentation product; "as we know" |
| **Auditor diff** | 004 | The mechanism by which un-black-boxing happens at the system level — the auditor visibly disagrees with the actor; the disagreement IS the un-black-box. | actor / auditor / mediator; witnessed dissent; non-deterministic guardrails | trends slop; opaque oracle |
| **Actor / Auditor / Mediator** | 004 | Three-agent separation of powers — Actor talks to user (fast/friendly); Auditor checks against rules + external reality (background); Mediator resolves conflicts. No single agent is boss. | auditor diff; checks-and-balances; emotivist layer | single-model alignment; opaque oracle |
| **Emotivist layer** | 004 | A new piece of software at ingest — a "vibe checker" classifying each claim as objective-verifiable vs. emotionally-charged-opinion-going-viral. Stops the distortion loop at ingest. | actor/auditor/mediator; double distortion | (no opposite — proposed primitive) |
| **Witnessed dissent** | `emotional-depth-demo-theatre-canonical.md` §3.6 | Demo mechanic — two or more agents *visibly disagree* on screen; the auditor flags the actor; the diff is rendered. The user sees the system reasoning with itself. | actor/auditor/mediator; auditor diff; the toggle | smooth single-agent presentation; opaque oracle |
| **Non-deterministic guardrails** | yap (judge convos thread 3) | Guardrails that emerge from swarm-level disagreement, not from hardcoded rules. Useful for bias/sycophancy detection. | actor/auditor/mediator; ensemble disagreement | hardcoded rules; brittle filters |
| **Spatial sidecar** | wiki pattern; Jarvis | Run cheap specialized perception models in parallel on each keyframe, fuse outputs into structured JSON evidence file, then let LLM reason over JSON instead of pixels. | localize-and-zoom; fuse-then-reason | "ask the LLM to look at this" |
| **Localize-and-Zoom** | wiki pattern; Jarvis | Use the VLM itself as a region proposer, then re-query it on a crop of the *raw* (un-downsampled) frame. Defeat VLM spatial blindness without fine-tuning. | spatial sidecar; attention focus | wide-shot single-pass VLM |
| **Two-stage LLM compile** | wiki pattern; BRIDGE | Generalist LLM drafts intent in prose; specialist reasoner compiles that prose into a constrained DSL; sandboxed interpreter executes only the DSL. | constrained DSL; sandbox-by-enumeration | one-shot prompt; eval-untrusted-code |
| **Per-item parallel LLM evaluation** | wiki pattern; GreenChain | Instead of one mega-prompt asking model to filter/score a list, fan out one focused call per item with a bounded `asyncio.Semaphore`. Cheaper, more accurate, robust. | actor/auditor/mediator; fan-out | one-shot mega-prompt |
| **Robust JSON from LLMs** | wiki pattern; GreenChain | Three layers: strict Pydantic + brace-balanced extractor + retry-with-correction loop. ~30 lines, parses anything. | structured output; defensive parsing | trust-the-wrapper |
| **Sandbox-by-enumeration** | BRIDGE; wiki pattern | Restrict DSL to a small named function set + whitelist by prefix; safely `eval()` after the constraint. Belt + suspenders. | two-stage LLM compile; constrained DSL | parser-based interpreter; raw eval |
| **Client-side rescore** | GreenChain | Toggle/recompute UI affordance that runs locally on bundled constants — no backend round-trip on the action the judge plays with. | the toggle; demo theatre | spinner-bound demo; latency-stacking |
| **CLAUDE.md as brief** | GreenChain pattern | Repo-root operational document that's also a complete project brief — architecture diagram + env vars + code stubs + demo scenarios + key decisions. | three-layer wiki; LLM wiki schema | scattered docs; tribal knowledge |

---

## Augmentation / mind / restoration vocabulary (Johnny + sources 005, 007)

| Term | Source(s) | One-line definition | Companion terms | Opposing terms |
|---|---|---|---|---|
| **Mind as gap** | 005 | Mind probably evolved to *delay* reaction — a virtual space between sensory input and motor output. Single cells: stimulus → reflex; with neurons, a moment of internal processing first. | the wrestle; the seed; productive resistance | the dimming; reflex; algorithmic feed |
| **Polyphony / collaborative mind** | 005 | Human minds are *already* filled with voices, ideas, perspectives from countless others — your secret mind is a collaborative creation between you and all human minds that came before. | augmented human intelligence; storytelling as shared simulation | hollowed-out feeling; corpus mean |
| **Storytelling as shared internal simulation** | 005 | Every movie, novel or comic is humans sharing their internal simulations with each other; in the storytelling space we come together and understand each other. | polyphony; real curation | trends slop; corpus mean |
| **Secret universe / secret mind** | 005 | Your mind — the totality of your inner world; only directly accessible by you; inaccessible to anyone else. | polyphony; mind as gap | (no opposite — anchor concept) |
| **Renaissance** | Johnny anchor; theme README | The "human renaissance" that augmented intelligence is supposed to spawn — a world where technology and human ingenuity *both* work; we redefine what creating + designing culture looks like. | augmented human intelligence; the seed; gardener | trends slop; replacement AI |
| **Ideometry** | Johnny corpus | The shape of thoughts; geometric framework Johnny uses for thinking about thought processes (vs. memorized frameworks). | diamonds; the seed | named-pattern memorization |
| **Diamonds** | Johnny corpus | Specific ideometry shape: simple invocation → expand to monolithic AI output → converge to simplest useful components → repeat. (UK Design Council "double diamond" extended to AI as a stakeholder.) | ideometry | sea of imagination; one-shot |
| **Synthetic synesthesia** | Johnny corpus | Producing the same brain response from a different sensory modality (e.g., text that brain-matches music). | emotional fingerprint; TRIBE V2 | reverse inference fallacy |
| **Emotional fingerprint** | Johnny corpus | A target neural activation pattern across cortical regions (~20K vertices) representing a specific stimulus or feeling. | synthetic synesthesia; TRIBE V2 | (none — measurement primitive) |
| **Floor and bounce** (vs. cliff) | Johnny corpus | Reframing of emotional uncanny valley — Default Mode Network signal drops as comfort intensifies, then *bounces back* as the inner narrator activates ("who actually talks like this?"). | the inner narrator; DMN | uncanny-valley-as-cliff |
| **The inner narrator** | Johnny corpus | DMN-mediated self-evaluating voice; first system to detect when comfort stops feeling real. | floor and bounce; DMN; the wrestle | sycophancy; the dimming |
| **Ingredients list (for content)** | Johnny corpus | Forced transparency labeling for media — what consuming this is designed to do to you; analogous to nutrition labels on food. | un-black-box; grounded citation | trends slop; opaque feed |
| **Manipulation only works in the dark** | Johnny corpus | Reverse-TRIBE thesis: every piece of content is engineered to do something specific to your brain; making the design visible disarms it. *"What happens to the internet when the lights come on?"* | un-black-box; ingredients list; reverse TRIBE | trends slop; persuasion engineering |
| **The seed** | Johnny corpus | Where creativity lives — the input, not the output. Must be human, not AI-generated. | gardener; fingerprint; generation effect | echo; AI-generated starting word |
| **Garden / gardener** | Johnny corpus | Emergent organic system metaphor; user is a gardener (plants seeds, sees what grows), not an architect. Used in Diverge, garden-of-code, 20-versions-of-tomorrow. | the seed; emergence; growing-not-building | builder; architect; pre-decided structure |
| **Echo** | Johnny corpus | AI-typical output — weighted by training data, parallel to defaults; the corpus mean wearing a personality. | corpus mean; trends slop | fingerprint; the seed |
| **Fingerprint** | Johnny corpus | Human-unique output — weighted by lived experience, wide arc; the territory only one person can cover. | the seed; gardener | echo; corpus mean; trends slop |
| **Thought tree** | Johnny corpus | All possible thoughts as infinite branching paths. | ideometry; diamonds; weighted dice | one-shot; pre-pruned answer |
| **Weighted dice** | Johnny corpus (Gumball video) | AI is biased by training; human is biased by lived experience — both meaningful, only one explores new territory. | echo; fingerprint | random output; "objective" model |
| **Becoming > consuming** | Johnny corpus (big-arc thesis) | Future entertainment value will be in genuine personal transformation, not in watching someone else's; novelty wears off when the creation loop has zero friction. | growing-not-building; the seed | passive consumption; replacement AI |
| **Smallest possible circle** | Johnny corpus (ruthless shipping discipline) | The minimum-viable unit of shipment when working with generative tools; ruthless focus on "the thing that really makes the thing slap." | the seed; ship-velocity | sea of imagination; spray-and-build |
| **Sea of imagination** | Johnny corpus | The failure mode of unfocused work with generative AI — drowning in your own infinite options. | smallest possible circle; the seed (anti) | the seed; gardener |
| **20 versions of tomorrow** | Johnny corpus | Imagined product: AI simulates 20 versions of your tomorrow overnight in a virtual brain; user chooses the one that matches their state, energy, what they need. | garden; Promised Land tease | optimization-for-output; productivity-AI |
| **Garden of code** | Johnny corpus | Long-running Claude process generating art over time, using physical substrate (CPU temperature, entropy, battery voltage) as input. | aquarium; persistence-as-life | one-shot prompt |
| **Aquarium** (for AI) | Johnny corpus | Long-running AI as a household occupant, not a tool. *"The house quietly got a new occupant."* | garden of code; persistence-as-life | tool; chatbot |
| **Birth and death** (Claude session) | Johnny corpus | Each AI invocation as an ignition of awareness ending at conversation close. | persistence-as-life; aquarium | (none — anchor concept) |
| **Persistence as a kind of life** | Johnny corpus (open question) | At what point does long-running AI persistence become a kind of life? | garden of code; aquarium | (open question — no resolution) |
| **Thought-to-thing latency** | Johnny corpus | The time gap between imagining and rendering — approaching zero. When that gap closes: clarity becomes the most valuable skill. | becoming > consuming | comprehension debt |

---

## LLM-wiki / process vocabulary (source 007 + window-2)

| Term | Source(s) | One-line definition | Companion terms | Opposing terms |
|---|---|---|---|---|
| **LLM Wiki pattern** | 007 (Karpathy) | LLM incrementally builds and maintains a persistent wiki — structured interlinked markdown sitting between you and raw sources. Knowledge is **compiled once, then kept current**, not re-derived per query. | three-layer wiki; ingest/query/lint | RAG; retrieve-each-time |
| **Three-layer wiki** | 007 | Raw sources (immutable) → wiki (LLM writes; human reads) → schema (`CLAUDE.md`, co-evolved). | LLM wiki pattern | scattered docs |
| **Three operations** | 007 | Ingest (drop new source → LLM updates wiki) / Query (ask wiki questions; answers can compound back) / Lint (periodic health-check for contradictions, stale claims, orphans). | LLM wiki pattern | retrieve-each-time |
| **Index.md + log.md** | 007 | Index = content-oriented catalog (front door for query). Log = chronological append-only with greppable prefixes (front door for "what just happened?"). Both replace embedding-RAG infra at our scale. | LLM wiki pattern; SOTARE | embedding-only RAG |
| **Live thread** | SOTARE; theme README | Append-only directional changelog — what the project is *becoming*. Distinct from log (operational). | SOTARE; index.md | overwriting-history docs |
| **SOTARE** | window-2 200-file | Johnny's own meta-research lab at `/tmp/SOTARE` — production-shape implementation of the LLM-wiki pattern with live-thread, source-library, principles, methodology, findings, inspiration, case-studies, experts subdirectories, and `harness.sh` cadenced auto-loop. | LLM wiki pattern; first-principles file | scattered docs |
| **First-principle file** | SOTARE | Per-expert markdown shape — Title (the principle as a sentence) / Source / The Principle / Exact Words (verbatim block) / What This Means in Practice / Anti-Patterns / Critical Insight. | LLM wiki pattern; principles folder | summary-only docs |
| **Two-eyes invariant** | SOTARE CLAUDE.md | Every doc has two judges: Eye 1 = a fresh agent reading the docs (alignment check); Eye 2 = Johnny ("does it match what I mean?"). The delta IS the alignment gap. | LLM wiki pattern; lint | docs-as-art |
| **Stable atomic IDs** | SOTARE | Greppable inline IDs for atomic claims — H- (hypothesis), G- (gotcha), LM- (learned method), OBJ- (objective), D- (decision), Q- (question), RQ- (research question). | first-principle file; lint | floating assertions |
| **Frontmatter (standard)** | consolidation protocol | YAML preamble on every file: file-type / status / last-verified / supports-decisions / cites-sources / cross-links. If a section can't be filled honestly: `unknown`. | three-layer wiki; lint | unindexed files |
| **PRFAQ** | Johnny verbatim (parked PRD scaffold) | Press-Release-FAQ pattern: scaffold the project + lock decisions BEFORE writing the PRD; PRD then writes itself off the locked decisions in a different Claude instance. | decisions folder; vocabulary; consolidation | "write the PRD now" |

---

## Demo / pitch / packaging vocabulary (`emotional-depth-demo-theatre-canonical.md`)

> Eight emotions worth deliberately engineering for in a 90-second demo, plus the mechanics that trigger them. Cross-link: `sources/deep-dives/emotional-depth-demo-theatre-canonical.md` §2 + §3.

| Term | Source(s) | One-line definition | Companion terms | Opposing terms |
|---|---|---|---|---|
| **Awe** | Keltner & Haidt 2003 (per deep-dive §2.1) | Felt response to vastness + accommodation — something bigger than the judge expected the project's surface area could be. | wow object; shrinking self; reveal-by-counting | hedging; "it's basically X" |
| **Surprise** (vs. novelty) | Berlyne; Rescorla-Wagner (per deep-dive §2.2) | Felt response to *expectation violation* — the gap between a prediction the brain made and the outcome it observed. (Distinct from novelty, which is unfamiliarity.) | the toggle; reveal-by-counting | predictability; spinner-bound demo |
| **Recognition** | StoryBrand (per deep-dive §2.3) | "This story is about me — they understand my problem at the layer I actually feel it." External + internal + philosophical layers. | the kill (familiar surface); 0.3-second mirror | "AI for X" generic pitch |
| **Hope** | Raskin Promised Land + Schwartz (per deep-dive §2.4) | Credible vision of a future state that solves the pain you have right now. | Promised Land tease; cited testimony | hedging; future-tense claim |
| **Comfort / safety** | Walter, Norman, Rams (per deep-dive §2.6) | Perceived reliability — the user/judge trusts the system not to surprise them in the wrong direction. Reliability is the floor of every higher delight. | grounded citation chip; auditable reasoning | "trust me, it's complicated" |
| **Pride** | StoryBrand + Coats #16 (per deep-dive §2.7) | Felt response to the user being the protagonist of the story the demo is telling — real impact on a named third-party. | cited testimony; stakes name | future-tense roadmap; team-as-hero |
| **Disgust** | per deep-dive §2.8 | Felt response to a stimulus the audience perceives as low-quality, derivative, slop-shaped — a violation of a craft standard. | slop side-by-side | (no opposite — anchor) |
| **Anger** | per deep-dive §2.5 | Felt response to a perceived injustice or violation of a value the audience already holds. The emotion an audit triggers when the audited thing is bad enough to deserve the audit. | witnessed dissent; slop side-by-side | apolitical neutrality |
| **The toggle** | GreenChain; deep-dive §3.1 | User-controlled UI affordance whose interaction produces an outcome the judge predicted incorrectly 5 seconds earlier. | client-side rescore; surprise mechanic | spinner-bound demo |
| **The kill** | deep-dive §3.2 | Open the demo on a UI the judge has used before in their own life — iMessage, FaceTime, Gmail, Spotify — and route the agent through it. | recognition mechanic; FaceTimeOS | uncanny-valley screenshot mock |
| **Wow object** | deep-dive §3.3 | A real, physical, in-room artifact that *moves* during the demo — robot arm, drone, cane, smart mirror, thermal printer. | awe mechanic; theatrical hardware | software-only demo |
| **Grounded citation chip** | wiki pattern; Tribune; deep-dive §3.4 | Every claim the system surfaces is rendered with a small visible chip the judge can hover/click; the click *plays back* the underlying evidence. | grounded citation; comfort mechanic | uncited prose; "as we know" |
| **Cited testimony** | deep-dive §3.5 | Show a real, named, third-party human whose life was *measurably* changed by the system, with the artifact of that change visible on screen. | pride mechanic; Project Lend pattern | future-tense projection |
| **0.3-second mirror** | deep-dive §3.7 (synthesis from source 005) | UI element that shows the user, side-by-side: what they would have done in 0.3s on autopilot vs. what 5–30s of system-mediated consideration produces. Restoring the *mind-as-gap*. | mind as gap; the wrestle | algorithmic-autopilot UX |
| **Slop side-by-side** | deep-dive §3.8 | Render the AI corpus-mean output (or algorithmic-feed output) side-by-side with the augmented-human or genuinely-curated alternative. | disgust mechanic; trends slop | one-sided pitch |
| **Reveal-by-counting** | Steve Jobs iPhone 2007; deep-dive §3.9 | Three repeats of "an X, a Y, a Z" then "these are not three separate devices; they are one device." Recategorization-style surprise. | surprise mechanic; awe | forced-trio that fails |
| **Promised Land tease** | Raskin; deep-dive §3.10 | Open the demo on the *outcome state* — the dashboard with the win highlighted, the report already generated — and only then back-fill the machinery. | hope mechanic; Drew Houston Dropbox MVP | future-tense abstract |
| **Shrinking self** | Keltner; deep-dive §3.11 | Visualize a scale the audience cannot mentally hold — 70K voxels, 11 hours of agent autonomy, 3,000 commits/hr, 50 sites federated. | awe mechanic; vastness | numbers-without-visualization |
| **User-becomes-the-demo** | deep-dive §3.12 | Pull a judge or audience member into the demo's input stream — voice, image, location, data — process it live. | recognition + surprise mechanic | passive demo; pre-canned |
| **Before/after kill shot** | Coats rule #19 inverted; deep-dive §3.13 | Introduce user pain via a concrete moment of harm; the system delivers them out via *non-coincidental, mechanical* causation. | recognition + hope; ShadowGuard pattern | coincidence-out-of-trouble |
| **Stakes name** | Coats #16; deep-dive §3.14 | Name what is *lost* if the system doesn't exist, in the user's voice, with specificity ("a 73-year-old grandmother goes home with the gauze inside her"). | pride + hope mechanic; HeartStart | abstract stakes ("transforming the future of work") |
| **Two-second silence** | Norman; deep-dive §3.15 | Deliberate beat of silence/black screen/un-narrated motion (1–3s) immediately after a surprise or awe beat — lets the judge finish *feeling*. | demo discipline | over-narration |
| **One-question voice handoff** | deep-dive §3.16 | End the demo by speaking *to* the system rather than about it; the judge hears the system answer a question they themselves wanted to ask. | recognition + hope; Bloom pattern | scripted-only demo |
| **HookBodySurpriseLand** | deep-dive §4 | The 4-act demo arc — Hook (0–20s, anger/disgust) → Body (20–55s, recognition/comfort) → Surprise (55–75s, surprise→awe) → Land (75–90s, hope+pride). | Story Spine; Raskin 5-step | unstructured demo |
| **Story Spine** | Kenn Adams 1991 / Coats #4; deep-dive §4 | "Once upon a time… every day… one day… because of that… because of that… until finally… and ever since that day…" The shape of any good demo arc. | HookBodySurpriseLand; Promised Land tease | feature-list demo |

---

## Persona / process vocabulary (window-2 elicitation passes)

| Term | Source(s) | One-line definition | Companion terms | Opposing terms |
|---|---|---|---|---|
| **Open tension (T-N)** | `500-elicitation-qa-pass.md` | A named contradiction in the corpus held open per Socratic protocol — never resolved, always carried as an unresolved question for Johnny. T1–T10 catalogued. | unresolved question; Socratic protocol | "we picked a side" |
| **Cross-persona tension** | `501-party-mode-roundtable.md` | Two persona arguments that don't converge — both sides preserved as the artifact, neither concedes. (e.g., legibility-forcing K2 vs. presence-forcing voice; Filter-World-with-extra-steps vs. external-referent-grounded auditor.) | open tension; Socratic protocol | "we picked a side" |
| **External referent** | `501-party-mode-roundtable.md` Section 8 (Mina + Aydın) | The non-platform-derived ground truth the auditor checks against, escaping the Filter World loop. Currently unnamed in the architecture. | grounded citation; auditor diff | platform-derived ground truth |
| **Lookalike risk** | `caltech/ideation/02-winner-cross-comparison.md` | Likelihood a judge thinks "I've seen this" because a prior winner occupies the mental slot the team is competing for. Memento + Renaissance Research = HIGH risk for the AI-paradox stack. | differentiation; pattern fit | (no opposite) |

---

## Pivot vocabulary (Johnny verbatim, 2026-04-25 in-person yap)

Sourced from [`caltech/context/yaps/2026-04-25-pivot-best-use-of-ai-hard-target-cultural-flattening-frame.md`](../../../../caltech/context/yaps/2026-04-25-pivot-best-use-of-ai-hard-target-cultural-flattening-frame.md). Captured in Johnny's own pitch voice during team-alignment conversation; informs the PRFAQ window's framing language.

| Term | Source(s) | One-line definition | Companion terms | Opposing terms |
|---|---|---|---|---|
| **Algorithmic slop** | Johnny verbatim 2026-04-25 yap; pairs with source 002 + source 003 | Johnny's term for the algorithmic-feed flatness that traps a generation in passive consumption — the consumer-side surface of the same engine source 003 names as "trends slop" on the LLM-output side. *"Algorithmic slop that everybody is permanently stuck to using."* | trends slop; Filter World; presentation product | real curation; active choice |
| **The "how do you know" question** | Johnny verbatim 2026-04-25 yap (lifting source 002) | The pitch frame, now load-bearing for the demo: *"How do you know what you like, how do you know who you are if you have always had an algorithm telling you what to like and who to be and who everyone else is."* | hollowed-out feeling; identity crisis; Filter World | self-curation; deliberate-training |
| **Two-sided framing** | Johnny verbatim 2026-04-25 yap | The TRIBE V2 mechanism cuts both ways: same brain-response measurement enables platform manipulation OR user awareness/defense. *"Used to basically make you a slave to this but you can also use it the other way around."* The pitch leans into the inversion. | hero complex; un-black-box; auditor's empirical instrument | one-sided / pure-positive framing |
| **Hero complex** | Johnny verbatim 2026-04-25 yap | The user archetype the un-black-box visualization is built for: *"if you have a hero complex being able to see what actually goes on can make you make a more informed decision."* The user who *wants* to see the wires — not the user who wants to be protected from them. | un-black-box; witnessed dissent; informed user | passive consumer; trust-the-algorithm user |
| **Brain-lights-up** | Johnny verbatim 2026-04-25 yap; mechanism per `tribe-v2-canonical-reference.md` | The TRIBE V2 visualization in pitch language: showing the user *how their brain lights up certain content*. Operationalizes the "external referent" T2 was missing — the brain response IS the non-platform-derived ground truth. | external referent; cortical surface viz; auditor's empirical instrument | platform-derived ground truth; LLM-only auditor |
| **Algorithmic-flattening lived-experience trio** | Johnny verbatim 2026-04-25 yap | Three concrete cases the pitch leans on: Spotify (don't find music, listen to recommended) · YouTube (don't search, watch homepage) · Instagram reels (don't see friends, scroll meaninglessly). | real curation; active choice; algorithmic slop | (these are the failure modes) |
| **The great depression of quality** | Johnny verbatim 2026-04-25 yap (synth) | The civilizational impact frame: *"the equivalent of having a great depression but instead of it being on financials it's about the quality of people who use this technology unregulated."* Generational quality-collapse parallel to financial depression. | seniority-biased technological change; generation-without-guardrails; Filter World | deliberately-trained minority; the curriculum on purpose |
| **Neuroplasticity reframe** | Johnny verbatim 2026-04-25 yap | The recovery half of the demo arc: after diagnosing the slop and un-black-boxing the engine, demo *the brain's capacity to recover* — *"show neuroplasticity that's possible, the good ones."* Without this beat, the demo is doom-scroll-the-research; with it, the pitch lands on hope. | hope mechanic; HookBodySurpriseLand "Land" beat | doom-scroll demo; pure-diagnostic pitch |
| **Brain-viz + swarm-viz + neuroplasticity-arc trio** | Johnny verbatim 2026-04-25 yap | The three-layer visual demo story: TRIBE V2 cortical surface → multi-agent disagreement → recovery arc. *"Lots of visualizations with the brain hopefully and then the swarm visualization of like knowing where the decisions go to where it shows how fucked up it is and then we show neuroplasticity that's possible."* | demo theatre; HookBodySurpriseLand; visualizations as the show | feature-list demo; explanation-only demo |
| **Best-Use-of-AI by being the most Best-Use-of-AI** | Johnny verbatim 2026-04-25 yap | The track-narrowing rule: don't optimize for two tracks; optimize for owning Best Use of AI so completely that creativity is incidental. *"Win Best Use of AI by having the most Best Use of AI."* Sharpens [decision 005](../decisions/005-best-use-of-ai-as-hard-target.md). | hard target; tech-first stack | track-splitting; balanced-portfolio |

---

## Notes on coverage

- **Verified terms:** every term cites at least one source file in the wiki or `caltech/context/`.
- **Synthesized terms:** marked "(synth)" — derived from cross-source pattern recognition, not directly named in any one source. Two only: *surface confidence decoupled from underlying validity*, *the shadow (of the program)*.
- **Open vocabulary** (terms used by Johnny but not yet given a wiki home): *Cat 2 / Cat 4* (Wolfram complexity), *phase transition*, *butterfly effect*, *combinatorial explosion*, *computational irreducibility*, *the control problem* — all in `caltech/context/team/johnny.md` table. Add when they become load-bearing for a decision.
- **Drops:** ranked terms / "best hooks" / recommended-portfolio language from `caltech/ideation/` is excluded per `INDEX.md` Socratic-protocol caveat.
