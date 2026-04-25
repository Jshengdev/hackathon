# Window-2 — Research Deepening — Coordination Note + Thesis Snapshot

## Coordination model (between the two parallel Claude windows)

- **Window 1** (other Claude session) — works on branch `research/ideation-sweep` in worktree `.worktrees/research-ideation-sweep/`. Scope: TBD by that window; treat any of *its* writes under `research/wiki/` as authoritative for *its* topic.
- **Window 2** (this session) — works on branch `caltech/ideation/window-2` in worktree `.worktrees/caltech-ideation-window-2/`. Scope:
  - Breadth ideation **research deepening** (BMAD elicitation + party mode + academic-research-skills deep-research mode + YC-framework stress-test + sponsor-fit cross-comparison) under the **AI-paradox theme**.
  - Pitch hooks + front-facing concepts.
  - Writes ONLY into:
    - `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/` (this folder)
    - `research/wiki/scrapes/` (only new scrape files, never editing window-1's)
    - `caltech/ideation/` (if/when we create that path for non-wiki ideation artifacts)
- **Merge plan:** when both windows wrap, `git merge` both feature branches into `main`. Folder-level isolation means no file-level conflicts expected.

## Updated thesis snapshot (verbatim from Johnny + structured)

> *"Best Use of AI = redefining what proper AI use looks like in an unregulated, scary AI world. AI for the most people, used properly, ethically, sustainably — non-blackboxed so people can trust it." With B2C-primary + B2B-overlay positioning, and one honest problem statement that rings true to all 5 sponsors.*

### Sponsor mapping (Johnny's 5-sponsor lens)

| Sponsor | The hook this hypothesis offers |
|---|---|
| **K2 Think** | Societal impact + uniqueness — K2 as the audit-grade reasoning engine that makes the un-black-boxing operational |
| **Ironside** *(spelling per Johnny — verify "Ironsight" vs "Ironside")* | Innovative spatial-computing solution — make the invisible visible literally, in 3D / spatial UX |
| **Listen Labs** | Human-layer problem — voice / listening is the most human interaction channel; centers the human in the AI loop |
| **Best Use of AI** *(track-level prize, not a vendor)* | The thesis itself — redefining proper use, ethics, sustainability |
| **Creativity** *(track-level prize, not a vendor)* | Freaky tech (TRIBE V2 curveball — capture what TRIBE V2 means as a separate note) |

### Distilled axes

- **Positioning:** B2C-primary, B2B-overlay (consumer surface that rides the same architecture into enterprise).
- **Mechanism:** non-black-box, ethical, sustainable, "AI for the most people."
- **Frame:** redefining proper AI use in an unregulated environment — *not* an ethics pitch, an *impact* + *competitive-positioning* pitch.
- **Constraint:** one honest problem statement that rings true to all 5 sponsor lenses simultaneously (no Frankenstein sponsor-track tacked-on language).

## Open thesis-stress-tests (queued for elicitation passes)

- **Socratic** pass on the thesis: *what would have to be true for this to be the right bet? what's the cheapest version that proves the bet? what's the test that would falsify it?*
- **Pre-mortem** pass: *if at the demo we lose, what's the most likely root cause from this thesis frame? from the sponsor mapping? from the B2C/B2B positioning?*
- **Red team** pass: *steelman the strongest argument that this thesis is wrong / has been done / is unfundable / is not actually anti-slop.*
- **First principles** pass: *strip the thesis to atomic claims; verify each independently; reconstruct.*
- **YC-framework** stress-test: *who's the user, what's the pain, what's the wedge, what's the moat, what's the demo, what's the founder-market fit?*

## Live-thread reference

The full theme lock document (with Johnny's anchor problem statement, Socratic interaction protocol, theme-vs-hypothesis split, cross-source vocabulary, and the cross-window live-thread changelog) lives at:

→ [`../../README.md`](../README.md) *(theme root)*
