# Sponsor research workflow

Goal: for each of our three priority HackTech 2026 sponsors — **Ironsight**, **Listen Labs**, **K2 Think** — figure out exactly how teams have used their tech to win at past hackathons, then extract the specific implementation patterns we can reuse.

## Why these three

These are the sponsors whose tracks/APIs we're seriously considering for our own stack at HackTech 2026. (Spellings as the user provided — verify against the official HackTech 2026 sponsor list when scraping.)

## How this folder is organized

```
sponsors/
├── README.md                    ← you are here
├── ironsight/
│   ├── SOURCES.md               ← Johnny drops links + notes here
│   ├── analysis/                ← Claude writes per-project teardowns here
│   └── clones/                  ← cloned winning-project repos (gitignored)
├── listen-labs/
│   ├── SOURCES.md
│   ├── analysis/
│   └── clones/
└── k2-think/
    ├── SOURCES.md
    ├── analysis/
    └── clones/
```

Each `clones/` subdir is **gitignored** in the outer `hackathon` repo (see `.gitignore`) so we don't vendor third-party code into our own history. Clone freely; nothing leaks into commits.

## The loop

```
[1] Johnny drops sources into <sponsor>/SOURCES.md
        │
[2] Claude scrapes the linked Devpost / blog / video / docs,
    clones any GitHub repos into <sponsor>/clones/,
    and writes a per-project teardown into <sponsor>/analysis/<project>.md
        │
[3] Claude rolls per-project findings up into
    <sponsor>/analysis/_synthesis.md (patterns, needles, do/don't)
        │
[4] Once all three sponsors are done, Claude writes
    research/sponsors/_cross-sponsor-synthesis.md — the spec input
    we'll use when picking and architecting the actual project.
```

## Per-project teardown template (what `analysis/<project>.md` looks like)

```
# <Project name>

- **Hackathon / event:**
- **Year / date:**
- **Prize won:**
- **Sponsor track this fits:** (Ironsight / Listen Labs / K2 Think)
- **Devpost / press / video / repo links:**

## One-sentence pitch

## How they used the sponsor tech (the needle)
- Specific API endpoints / SDKs / models / pricing tier
- The integration shape (webhook? client lib? raw HTTP? agent loop?)
- What the sponsor tech did that pure-LLM couldn't
- Failure modes they had to design around

## Full capability stack
(LLM, voice, vision, browser, hardware, infra, etc.)

## Why it won
(Demo theatrics, judge fit, narrative hook, technical wow.)

## Reusable for us at HackTech 2026?
- ✅ angle:
- ⚠️ risk:
- 🚫 saturated:
```

## Conventions for SOURCES.md

Drop links with whatever context you have. No formatting required — bullets, raw URLs, dumps from chat all fine. Examples:

```
- https://devpost.com/software/foo — TreeHacks 2025 grand prize, used Listen Labs voice
- https://github.com/bar/baz — repo for above
- ironsight blog post about a project they highlighted: https://...
- "I saw a YC interview where the founder mentioned X" — go dig
```
