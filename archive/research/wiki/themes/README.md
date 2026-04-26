# Themes

This is the **directional** part of the wiki — the "what should we build" half. `projects/`, `patterns/`, `stacks/`, `tools/` describe what *has* been built; `themes/` describes the conceptual ground we want our HackTech 2026 project to occupy.

Each theme has its own folder:

```
themes/
└── <theme-slug>/
    ├── README.md         ← rolling synthesis: framing, key concepts, project-pick implications
    └── sources/          ← raw inputs (transcripts, articles, talks, papers, tweets) we're synthesizing from
        ├── 001-<title>.md
        ├── 002-<title>.md
        └── ...
```

## How to add a source

Drop the raw content into `sources/NNN-<short-slug>.md`. At the top of the file, write:

- A 3–5 bullet "key extracts" section (the load-bearing claims, terms, citations).
- A "how this maps to the theme" section (1–3 lines).
- The full source content below, verbatim.

Then update the theme's `README.md` if the new source meaningfully shifts the synthesis.

## Index

- **[AI paradox / restoring humanity in the age of algorithms](ai-paradox-invisible-use-cases/README.md)** ← **active anchor for HackTech 2026 ideation; lock document.** Algorithms are erasing the human half of culture, taste, judgment, and self-knowledge — invisibly. Restoring that half is the goal. Three sources covering software craft, consumer culture, and strategic judgment; shared underlying engine; Socratic interaction protocol with Claude; live-thread changelog.
