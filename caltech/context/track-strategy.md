# Track Strategy — Locked Decisions

**Status:** Locked by team lead Johnny, late Friday 2026-04-24.
**Source:** Direct verbal lock-in (yap dump).
**Note:** Tech stack is **NOT** locked — these are *track commitments*. The architecture is a set of *directions* (see `architecture.md`).

---

## 🎯 Sponsored Tracks We Are Going For

### CORE — Build everything around these

| Track | Role in Project | Notes |
|---|---|---|
| **IFM K2 Think V2** | **Core backend processing layer** | We need K2 for *fast inference speed*. Not for "smart" reasoning tasks — for **quick, menial tasks done very quickly, at scale**. Speed is the thesis, not depth. |
| **Ironside** | **Main pipeline we are building** | Their data, their problem domain. Egocentric video → spatial reasoning. The pipeline is built around them. |
| **Listen Labs** | **Main solution we are trying to execute** | The "human simulation" framing is the solution-side angle. |

### STRETCH — Layer on if it fits naturally

| Track | Strategy | Notes |
|---|---|---|
| **Sideshift** | **Position as: "works for consumers but also works for developers — almost a dev tool"** | Hybrid B2C / dev-tool positioning. Only pursue if the natural framing supports it. |
| **YC** | **Back-propagation** — after idea is locked, **look backwards** to find the right pre-2021 YC company that fits the build, then frame as "modern AI-native version of [that company]" | NOT a driver of the idea. A wrapper applied at the end. *(Note: official YC brief says pre-2022; Johnny verbally said pre-2021. Confirm at YC submission portal — events.ycombinator.com/yc-hacktech-2026)* |

### DROPPED

| Track | Reason |
|---|---|
| **Palohouse** | "We don't want that trash." Dropped. |

---

## 🏆 Main (Hackathon-Wide) Tracks

| Track | Status |
|---|---|
| **Best Use of AI** | ✅ **Definitely going for.** |
| **Creativity** | ✅ **Definitely going for.** |
| **Cybersecurity / Safety** | ⚠️ **Probably no.** Arguable if we really really wanted to, but default = no. |
| **"Not So Sexy"** | ❓ **Undecided.** "Yeah yeah I don't know." |

---

## 📊 Total Track Targets (current count)

- **Sponsored core:** 3 (K2, Ironside, Listen Labs)
- **Sponsored stretch:** 2 (Sideshift, YC)
- **Sponsored dropped:** 1 (Palohouse)
- **Main definitely:** 2 (Best AI, Creativity)
- **Main maybe:** 1–2 (Cybersecurity, Not So Sexy)

**Floor target:** 5 tracks (3 sponsored core + 2 main definitely)
**Ceiling target:** 9 tracks if everything lands

---

## 🛠️ Process Plan (stated)

### PRD-Driven Build
- Create a **PRD** the team can fully tackle, split among each other, divide work
- Use BMAD `prd-splitter` workflow per HANDOFF.md

### Work Budget
- **~12 hours of work** total
- **Split across 4 people**
- (Note: this is "actual build hours" — separate from the ~36hr nominal hackathon window)

### Research Phase Coming Up (before PRD)
Areas the team plans to research deeply:
1. **Hackathon-winning intel** — what wins, judging patterns, past winners
2. **Reference repos** — leap repos, related projects
3. **TRIBE V2** — deep research
4. **Mirofish** — deep research
5. **Connect findings** with `team/johnny-public-corpus.md` (Johnny's prior TRIBE V2 hands-on experience)

### Resource Strategy
- **Open source is very beneficial** for the research necessary
- Will figure them out soon enough

---

## 📌 What's Locked vs. What's Open

### LOCKED
- ✅ Track targeting (above)
- ✅ K2 = backend speed layer
- ✅ Ironside = main pipeline
- ✅ Listen Labs = solution framing
- ✅ Palohouse dropped
- ✅ Process: PRD-driven build, 12hr × 4 people

### OPEN (to be resolved by upcoming research + ideation)
- ⏳ Tech stack — currently DIRECTIONS, not locked
- ⏳ Specific problem statement
- ⏳ User-facing artifact (dashboard, demo style, UX layer)
- ⏳ The YC company we'll back-propagate to
- ⏳ Whether Sideshift / Cybersecurity / Not-So-Sexy actually get layered in
- ⏳ Theme / narrative wrapper
- ⏳ Specific role assignments per teammate

---

_This file is a track-commitment lock document. Tech stack remains directional in `architecture.md`. Specific problem statement remains open until idea-generator workflow runs._
