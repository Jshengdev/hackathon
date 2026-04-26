> ⚠️ **[ARCHIVED]** This index lived at `research/INDEX.md`; the entire `research/` tree was moved to `archive/research/` for repo cleanliness. All references in CLAUDE.md + the 3 dev READMEs now point here. Sponsor clones, wiki, papers — all preserved.

# Research INDEX — what lives where + how to use it

Quick navigation for any Claude instance (orchestrator, audit shard, refactor shard) that needs research context. Skim this first; deep-read only what your shard needs.

## Top-level layout

```
research/
├── INDEX.md           ← this file
├── sources/           ← raw cloned source material (papers, third-party repos)
├── sponsors/          ← per-sponsor analysis + cloned reference repos
└── wiki/              ← curated decisions, findings, patterns, project notes
```

## sources/

Raw, verbatim source material. Treat as read-only ground truth.

```
sources/
├── papers/            ← academic PDFs (TRIBE V2, Yeo7 atlas, Allen NSD, etc.)
├── repos/             ← third-party reference codebases cloned for inspection
└── transcripts/       ← office-hours notes, sponsor conversations
```

**Use when:** you need to cite a primary source ("Allen et al. 2022, Nature Neuroscience"), check what a third-party project actually does (vs how someone described it), or recover a quote from a sponsor conversation.

## sponsors/

One folder per sponsor with analysis + clones.

```
sponsors/
├── ironsight/
│   ├── SOURCES.md     ← canonical sponsor brief
│   ├── analysis/      ← our writeups (positioning, fit, asks)
│   └── clones/        ← (empty — Ironsight has no public reference repo)
├── k2-think/
│   ├── SOURCES.md
│   ├── analysis/
│   └── clones/
│       ├── bridge/    ← PyBullet + K2 robotics demo (HackPrinceton)
│       └── greenchain/← Supply-chain comparator (HackPrinceton; K2 dashboard)
└── listen-labs/
    ├── SOURCES.md
    ├── analysis/
    └── clones/        ← (empty)
```

**Use when:**
- **Ironsight pitch alignment:** read `ironsight/SOURCES.md` + `ironsight/analysis/`.
- **K2 sponsor pitch (IFM CORE track):** read `k2-think/SOURCES.md`. The K2 endpoint URL, model id, integration template, and "core part of your product" judging signal all live here.
- **Greenchain dashboard layout (single-page, globe-hero, ringed panels):** read `k2-think/clones/greenchain/backend/CLAUDE.md` + `k2-think/clones/greenchain/docs/screenshots/*.png`. This is the visual reference for our brain dashboard (A8 shard).
- **Bridge / robot-planning K2 example:** read `k2-think/clones/bridge/llm.py` to see the bare K2 API call pattern (no orchestration, no swarms — just a raw HTTPS POST to k2think.ai).
- **Listen Labs theme + simulation deliverable:** read `listen-labs/SOURCES.md` + `listen-labs/analysis/`.

## wiki/

Curated, project-specific knowledge. The most actionable docs.

```
wiki/
├── decisions/         ← numbered DECISION-NN-*.md (locked architectural choices)
├── findings/          ← experimental results + validation evidence
├── patterns/          ← reusable design patterns we've identified
├── projects/          ← per-prior-project writeups (bridge, greenchain, mirofish)
├── tools/             ← tool-by-tool integration templates (k2-think.md, qwen3-vl.md)
└── index.md           ← wiki's own internal index
```

**Use when:**
- **You're about to make a design choice:** check `wiki/decisions/` first — there are ~17 numbered decisions; the relevant one is probably already locked.
  - `008-k2-think-as-speed-engine.md` — why K2 is the speed engine, not the smart engine
  - `017-ironside-report-card-as-junsoo-wrapper.md` — early version of Junsoo's wrapper concept
- **You need a tool integration template:** `wiki/tools/k2-think.md` has the proven `asyncio.gather` + Pydantic-strict + brace-balanced JSON extractor + retry pattern.
- **You want to know what shipped at HackPrinceton:** `wiki/projects/{bridge,greenchain}.md` are post-mortems with what worked and what didn't.

## Other repo locations referenced from here

- **Mirofish swarm pattern reference:** `archive/MIROFISH-REFERENCE.md` (NOT cloned in `research/sponsors/` because it's not a sponsor — it's a reference for swarm-orchestration patterns we steal).
- **Icarus 3D dashboard reference:** `/Users/johnnysheng/code/icarus/web/src/three/` (separate user project; not in this repo). See `caltech/NEW-ARCHITECTURE.md` §5 for the Vue 3 ↔ R3F translation table.
- **Active project work:** `caltech/` (PRD, architecture, use cases, pitch deck) and `backend/` + `frontend/` (the demo code).

## How autonomous Claudes should use this index

1. Read `caltech/NEW-ARCHITECTURE.md` for the canonical pipeline + locked rules (single source of truth).
2. Read `refactor/CONSTRAINTS.md` + `refactor/CONTRACTS.md` for the rules every shard must follow.
3. Read your shard's `SHARD.md` for the specific task.
4. Use this INDEX.md to find supporting material — don't go spelunking in `research/` blind.
5. If you need a primary source citation, drill into `research/sources/papers/`.
6. If you need a layout/UX reference, drill into `research/sponsors/k2-think/clones/greenchain/`.
7. If you need an architectural decision precedent, drill into `research/wiki/decisions/`.

## Maintenance

When you add new research material, update this INDEX.md so the next shard knows where it is. New cloned repos go under `sponsors/<sponsor>/clones/<name>/`. New papers go under `sources/papers/`. New wiki entries follow the existing numbering convention.
