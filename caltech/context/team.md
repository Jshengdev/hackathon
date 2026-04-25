# Team Profile (Index)

**Status:** Per-person profiles live in `context/team/`. This file is the at-a-glance index. Full profiles supersede inferences.

## Composition: 4 people (3 technical, 1 non-technical)

| Name | Profile file | Self-stated lane preference | Anti-preferences |
|---|---|---|---|
| **Johnny Sheng** (you / lead) | [`team/johnny.md`](team/johnny.md) + [`team/johnny-public-corpus.md`](team/johnny-public-corpus.md) | Two profile files: (a) inspirations he champions, drawn from figbuild repo; (b) his own published thinking + hands-on TRIBE V2 experiments (Synthetic Synesthesia, DMN floor/bounce). Coined frameworks: ideometry, diamonds, becoming-vs-consuming, ingredients-list-for-content. Toolkit: Claude Code ↔ Figma MCP pipelines, BMAD orchestration, multi-life context databases. | _TBD — to be confirmed by Johnny directly_ |
| **Junsoo Kim** *(team also calls him "Junsu"; earlier transcripts said "Junu" — voice-to-text artifact)* | [`team/junsoo.md`](team/junsoo.md) | USC CS junior, came from physics. Aiming for PhD at Sven Koenig's IDM Lab on MAPF / multi-agent path-finding. Currently in Icarus Lab on LLM↔PDDL bridge. Deep relevant experience: egocentric video → VLM supervision pipelines (3D scene recon, grasp annotation, trajectory extraction), multi-agent LLM coordination, KG-grounded LLM reasoning, black-box LLM behavior probing. | ❌ Application work / CRUD / "build another LangChain agent." Wants to move PAST LLM-side toward classical planning |
| **Jacob Cho** | [`team/jacob.md`](team/jacob.md) | **Agent orchestration / infrastructure / systems / backend** — wants to be technical founder on a hard architecture piece | ❌ Frontend (done with it). ❌ Model/research lead (not a researcher). ❌ Pitcher / front-man role |
| **Emilie Duran** *(earlier files spelled it "Emily" — single-L was wrong)* | [`team/emilie.md`](team/emilie.md) | USC sophomore at Iovine and Young Academy, Presidential Scholar, 3.9 GPA. Designer / founder / content creator / storyteller — NOT engineer. Founded Perfit (AI B2B fashion), Marketing+Design at Nova Intelligence, Stylar AI (6M views), Claude Campus Ambassador, UX Lead at Annenberg Media. Acting credits + 100k+ social. Owns demo video execution, story packaging, on-camera narration, visual sauce. Figma primary, some Framer; willing to try Three.js/p5.js but new to them. | ❌ ML pipeline ownership. Not autonomous on AI API integration — needs support |

## Important Corrections From Profile Submissions
- **Jacob is NOT frontend.** Earlier inference (from "Jacob make a quick demo" overheard during brainstorm) miscast him as frontend / quick demos. His own profile explicitly: *"Don't suggest frontend. I've done it. I'm trying to leave it."* He wants agent-orchestration / infra. Update any prior assumptions accordingly.

---

## 🔒 LOCKED ROLE ASSIGNMENTS (per Johnny, 2026-04-25)

> "Three of us are technical and when it comes to difficult implementation and specific innovative ideas, leave them to Johnny. When it comes to execution to get something to work, leave that up to Jacob and Junsoo who are well-versed in agentic orchestration and up to their skill sets. And for Emilie, help her do the entire packaging process."

### Johnny — Difficult implementation + innovative ideas
- Owns the *hard* implementation pieces
- Owns the *novel / innovative* parts of the architecture
- Pulls in his hands-on TRIBE V2 experience (`team/johnny-public-corpus.md`)
- Drives the directional thinking / unblocks ambiguous build choices

### Jacob + Junsoo — Execution & agentic orchestration
- Get things actually working
- Own the swarm / agent orchestration plumbing
- Both have agentic orchestration experience (Jacob: Fetch.AI uAgents + Nucleus; Junsoo: multi-agent LLM coordination + LangChain orchestration)
- "Up to their skill sets" — they can self-route within this lane
- *(Note: respect Junsoo's stated anti-pref against pure "build another LangChain agent" work — frame the swarm work in terms of the agentic orchestration challenge, not as application LLM-wrapper work)*
- *(Note: respect Jacob's anti-pref against frontend / pitching — keep him in the orchestration/infra/systems lane)*

### Emilie — Entire packaging process
- **Devpost** writeup
- **Design guidelines + color palette**
- **Launch video** — produced as if our project is a real startup
- All polish / story / visual sauce
- **Quality bar:** product must "pass the startup test" — look and feel like a fundable consumer/dev product, not a hackathon hack

---

## Implications For Build / PRD Splitting
- **Innovation tasks** → Johnny lane (he unblocks novel architectural calls)
- **Implementation tasks** → Jacob + Junsoo lane (split between them based on skill fit at PRD-split time)
- **Packaging tasks** → Emilie lane (Devpost, design system, launch video, brand)
- PRD splitter should bucket tasks into these three lanes

## Open
- [ ] Sleep plan, hard time-blocks, API account inventory still TBD
- [ ] Cross-file name corrections (do at next consolidation pass):
  - earlier files reference **"Junu"** → should be **"Junsoo"** / **"Junsu"**
  - earlier files reference **"Emily Duran"** → should be **"Emilie Duran"** (single-L was wrong)
  - Johnny's lane preference & anti-prefs for THIS hackathon still TBD as a direct statement

## Naming Variants Logged
- **"Junu"** (in earlier transcripts) = voice-to-text artifact for "Junsu"
- **"Junsu"** (verbal) = colloquial form
- **"Junsoo Kim"** = formal name from his profile
- All three refer to the same teammate (Junsoo Kim)
---
- **"Emily Duran"** = misspelling in earlier captures
- **"Emilie Duran"** = correct spelling
- Same person


## Working Style Signals
- Team is comfortable with **late-night, long-form Socratic discussion** to lock direction
- They use **AI tooling aggressively** (Claude as collaborator, hackathon orchestrator, voice-to-text capture, generated PRDs)
- Strong preference for **professional / startup-aesthetic outputs** over "art project" stylization
- Comfortable taking unconventional strategic bets (tech-first vs. problem-first) with eyes open
- Willing to **pivot mid-weekend** if Listen Labs talk reveals better angle
- Reasonable **risk appetite**: betting on unproven combinations of models (TRIBE V2 + K2 untested in this configuration)

## Implied Strengths Across the Team
- AI/ML research depth ✓
- Front-end / 3D / interactive demos ✓
- Design + product polish ✓
- Process / orchestration / context engineering ✓
- Storytelling (Emily as design+narrative lead) ✓

## Implied Weaknesses / Gaps
- **No one explicitly identified as backend / API integration / infra ops** — Johnny may carry both context engineering AND infra
- **No domain expert in construction / industrial work** — making us heavily dependent on Ironside's office hours for problem framing
- **No explicit deal-side / customer-conversation lead** — could limit Palohouse/YC pitch quality unless Emily takes it on

## Open Questions for Team Profile (TBD)
- [ ] Sleep plan — sleeping on-site Friday/Saturday night, or going home?
- [ ] Who has API accounts (OpenAI, Anthropic, Gemini, Cerebras, etc.)?
- [ ] Anyone has prior side-project code or assets we can leverage (3JS Lava Lab world might be reusable)?
- [ ] What's everyone's school/work commitment level — willing to commit post-hackathon (Palohouse criterion)?
- [ ] Any hard time-out blocks Saturday/Sunday?
