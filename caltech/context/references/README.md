# References — Source Material Library

**Purpose:** Single source of truth for everything relevant to the build.
Drop URLs, paper PDFs, repo links, code excerpts, and notes here so the team has a unified place to pull from.

**Master rule (per Johnny's lock-in):** *"If anything we do maps to the references it becomes really good information for us."*

---

## Folder Layout (suggested — restructure as needed)

```
references/
├── README.md                       (this file — index)
├── past-winners/                   ← Devpost + GitHub teardown of how prior winners implemented sponsor tech
│   ├── ironside-prior-winners.md
│   ├── k2-ifm-prior-winners.md
│   ├── listenlabs-prior-winners.md
│   └── general-hacktech-winners.md
├── tribe-v2/                       ← TRIBE V2 docs, paper, GitHub, Johnny's prior experiments
├── mirofish/                       ← Mirofish swarm-of-agents repo notes
├── k2/                             ← K2 Think V2 API docs (we now have API access)
├── ironside/                       ← Ironside dataset notes (now requested)
└── hackathon-winning-patterns/     ← General research on what wins hackathons
```

---

## Status Tracker

### API / Data Access
| Resource | Status | Notes |
|---|---|---|
| **K2 Think V2 API key** | ✅ ACQUIRED | Added 2026-04-25 |
| **Ironside dataset** | ✅ REQUESTED | Awaiting delivery (via Discord) |
| **TRIBE V2** | ⏳ open source — pull from Facebook Research repo |
| **Mirofish** | ⏳ open source — find authoritative repo |
| **Cerebras inference** | (covered by K2 API) |

### Research Streams To Run
1. **Past Hacktech / sponsor-prior winners** — Devpost + GitHub teardown
2. **TRIBE V2 deep dive** — pair with Johnny's `team/johnny-public-corpus.md` hands-on findings
3. **Mirofish deep dive**
4. **General hackathon-winning patterns** — what makes judges say "this one"

---

## Research Strategy (per Johnny)

**The "steal the exact implementation" approach:**
> "We do past winner intel but specific searches into the Devpost and the GitHub repo itself and how they implemented the said sponsor and STEAL the exact implementation of what they did."

**Translation:**
- For each sponsor track we're targeting (K2/IFM, Ironside, Listen Labs, Sideshift), find prior hackathon projects that won that sponsor's prize
- Pull the Devpost writeup AND the GitHub repo
- Reverse-engineer **exactly how they used the sponsor's tech** — not just what the project did, but what API calls / patterns / framings they used
- Map findings back to our build directions
- "If anything we do maps to the references it becomes really good information for us"

---

## What To Capture Per Reference

When dropping anything in here, include:
- **Source:** URL / paper / repo
- **Why it's relevant:** which sponsor / track / architecture component it speaks to
- **Key extracted insight:** the one thing that maps to our build
- **Code/pattern excerpt:** if applicable, the specific API call / pattern / config to "steal"

---

## Open Slots
_(populate as research happens)_
