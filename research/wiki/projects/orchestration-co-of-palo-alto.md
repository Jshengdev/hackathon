---
file-type: project
status: verified
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/007-agent-swarms-as-coordination-pattern.md
  - ../decisions/011-demo-over-execution.md
cites-sources:
  - https://devpost.com/software/the-orchestration-company-of-palo-alto
  - https://github.com/FO214/treehacks
  - https://github.com/soooooooot/treehacks-agent-repo
  - ../scrapes/treehacks-2026-winners.md
cross-links:
  - ../patterns/witnessed-dissent.md
  - ../patterns/spatial-sidecar.md
  - ../patterns/per-item-parallel-llm-evaluation.md
  - ../decisions/007-agent-swarms-as-coordination-pattern.md
  - ../decisions/011-demo-over-execution.md
---

# The Orchestration Co. of Palo Alto

- **Hackathon / event:** TreeHacks 2026 (Stanford), row 55 in `../scrapes/treehacks-2026-winners.md:72`
- **Prize won:** **Interaction Co. (Poke) track winner** — explicit Poke MCP integration in `sources/repos/orchestration-co/README.md:89-99`
- **Sponsor tracks involved:** Poke (Interaction Co.), Modal (sandbox compute), Anthropic (Claude Agent SDK), Browserbase + Stagehand (smoke test), Vercel (preview deploys), OpenAI (STT/TTS), Cloudflare (tunnel)
- **Devpost / repo:** [Devpost](https://devpost.com/software/the-orchestration-company-of-palo-alto) · primary [FO214/treehacks](https://github.com/FO214/treehacks) · companion (the "victim repo" the agents fix) [soooooooot/treehacks-agent-repo](https://github.com/soooooooot/treehacks-agent-repo)
- **Local clones:** `../sources/repos/orchestration-co/` and `../sources/repos/orchestration-co-agent/`

## Pitch (one sentence)

A visionOS app that turns multiple Claude Code agents into 3D characters at desks in an AR control room — the user looks at a desk to focus that agent, palm-opens to record voice instructions to Poke, and watches each agent thinking → working → testing as Modal sandboxes spin up on demand and surface a live Browserbase replay floating above the character's head.

## What's actually in the repo (verified vs. claimed)

This one *over-delivers* on the Devpost prose. Three real sub-systems wired together:

| Devpost claim | Reality |
|---|---|
| Vision Pro AR control room with agents-as-desks | ✅ `treehacks26/treehacks26/ImmersiveView.swift:114-127` builds a 3×3 floor grid; `:686-765` spawns characters per WebSocket event into the next free slot |
| "Look at desk → focus agent" interaction | ⚠️ Realised as **gaze-anchored root + palm-snap**, not per-desk gaze. `ImmersiveView.swift:281-307` snaps the whole grid to where the user is looking; `HandTrackingManager` open-palm gesture toggles reposition mode (`:341-354` + `AppModel.swift`) |
| Custom MCP tools spinning up Modal sandboxes on demand | ✅ `poke-mcp/server.py:447-463` builds the Modal image; `:527-630` `run_modal_agent` clones repo → drops to non-root `agent` user → runs `claude-agent-sdk` inline (`:468-524` `AGENT_SCRIPT`) |
| Voice via Poke + chat.db poller | ✅ `voice-server.mjs` + `server/main.py:149-196` `/ws/poke` bridges hand_open/hand_close to OpenAI STT → Poke webhook → chat.db tail → OpenAI TTS |
| Browserbase smoke test of the agent's PR | ✅ `poke-mcp/server.py:262-436` runs Stagehand against the Vercel preview, extracts a structured PASS/FAIL verdict, posts back as PR comment |
| Live diagram on the AR whiteboard | ✅ `ImmersiveView.swift:155-183` loads `diagram.png` as a textured plane in front of the whiteboard — the system architecture is *literally* the demo backdrop |

The "victim repo" is a one-page Next.js Valentines popup (`../sources/repos/orchestration-co-agent/app/page.tsx:1-80`). It exists so the agent can be told "make the popups red" and you can *see* the change land in a Vercel preview floating above the desk. Demo theatre is the point.

## The unique sauce (what made it stand out)

1. **Spatial slot allocation as the scheduler.** `ImmersiveView.swift:65-68` keeps a `Set<Int>` pool of 9 grid positions; `:687-713` allocates / frees slots as agents enter/leave. The 3D world IS the scheduler — concurrency is bounded by visible desks. `per-item-parallel-llm-evaluation.md` rendered as physical scarcity.
2. **Out-of-order-tolerant state machine.** `enum AgentState { thinking, working, testing }` (`:18-22`) advances on webhook events posted from MCP (`poke-mcp/server.py:575,616` → `server/main.py:203-217` `/internal/event` → `event_bus` broadcast). If a later event arrives first, the character spawns directly in that state (`:24` doc).
3. **The webview-as-witness.** On `testing`, `ImmersiveView.swift:669-684` attaches a SwiftUI `WebView` 1m above the character (`:680`) showing the *Browserbase replay* — the user watches a second AI (Stagehand) audit the first AI's PR in real time, above the agent that wrote it. Closest TreeHacks 2026 implementation of `../patterns/witnessed-dissent.md` we have code for.
4. **Whiteboard mini-map.** `:507-537` `syncWhiteboardIndicators` paints a coloured dot on the whiteboard per running agent in the same 3×3 layout as the desks — system load readable without turning your head.
5. **Cloudflare tunnel + `APIConfig.baseURL`** (`setup-tunnel.sh`, `TUNNEL-SETUP.md`) — the AVP-on-hotel-WiFi unblock.

## Why it (probably) won the Poke track

This team made the Poke SMS bridge into a *spatial* surface: user speaks at the AR room, Poke replies are TTS'd back into 3D space, visible result is a swarm materialising at desks. The most expensive-feeling Poke integration possible without Poke shipping a headset.

## Lookalike-risk for our HackTech build

**Closest precedent for `witnessed-dissent.md`** — but the mechanism differs in a load-bearing way. Their dissent is **actor (Claude Agent SDK in Modal) vs. auditor (Stagehand on Browserbase)** rendered as **two separate spatial artifacts** (the character + the floating replay). It works because:

- The two agents have **structurally different objectives** (one writes code, one drives a browser) — passes the "same model, different prompts is theatre" test in `witnessed-dissent.md:84`.
- Disagreement is **rendered as space**, not text. The replay video is *physically above* the agent that produced it.
- The verdict (`PASS`/`FAIL` from `poke-mcp/server.py:355-372`) is grounded in an external referent (rendered Vercel preview), not another LLM's opinion.

**Where it bites us:** copying "agent at desk + floating webview" verbatim means judges who saw this on Feb 14 pattern-match in 5 seconds — surprise beat lost. We must differentiate on either (a) the **disagreement's substance** (their Stagehand emits PASS/FAIL on one PR; ours must render the *diff* on something the user cares about) or (b) the **spatial metaphor** (their grammar is desks + replay; ours could be physical conflict between entities, a courtroom, a printing-press galley — anything but a 3×3 office floor).

## What this forecloses

- **"Agent-as-3D-character watched in AR" is now a known move.** Doing it again, even better, is incremental. Judges have already seen the wow.
- **Modal-sandbox-per-task as the demo's reveal moment.** Same — the spawn is no longer surprising in 2026. We can still *use* it (it's the right primitive for `decisions/007-agent-swarms-as-coordination-pattern.md`), but it can't be the surprise beat in our 4-act arc.
- **PR creation + Browserbase smoke test as the closing flourish.** This is now the canonical Poke-track ending. If we go for Poke, we need a different closer — the "look, it merged itself" moment is depleted.

## Reusable for us at HackTech 2026?

- ✅ **Webhook → spatial state machine** (`/internal/event` → `event_bus.broadcast` → WS → spatial mutation) is a clean template for any multi-agent viz. `server/main.py:203-217` is 14 lines and replaces a whole pub/sub library.
- ✅ **"Two structurally different agents whose disagreement is rendered as space"** — generalisable to a 2D web canvas (claim card + diff card, physics-repelled when they disagree).
- ✅ **APIConfig + tunnel** for any device→laptop demo — copy `TUNNEL-SETUP.md`.
- ⚠️ **visionOS dependency.** Per `decisions/016-twelve-hour-work-budget-four-people.md` we don't have the budget for Swift. If we want spatial it must be web (Three.js).
- ⚠️ **9-slot ceiling.** Pick a slot count for *narrative* reasons, not engineering ones (`:99` `maxAgents = 9`).

## Open Socratic question for the team

If `witnessed-dissent.md` requires the audience to *witness* the disagreement, what's the difference between Orchestration Co.'s replay-above-the-desk and a `git diff` rendered in a terminal? Is "spatial separation between actor and auditor" doing real perceptual work, or is it a more expensive way to draw two divs side-by-side? If the former, what does AR/3D add that 2D split-screen cannot — and is that delta available to us in a web demo? If the latter, our budget is better spent on the *substance* of the diff (what the auditor saw that the actor missed) than on the geometry of where it's drawn.
