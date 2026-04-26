"use client";

// CALTECH HACKTECH 2026 — ROUND 1 DECK · v5 PERSONA-ORDERED
// ─────────────────────────────────────────────────────────────────────────────
// THIS IS A THIN ORCHESTRATOR. The actual slide content lives in:
//
//   app/round-1/slides/01-title.tsx ── 14-close.tsx        (thin slide wrappers)
//   app/round-1/persona-content/                            (all on-screen copy + AMY + persona logic)
//
// SOURCE OF TRUTH for narrative direction:
//   yappage/2026-04-26-conversation-log.md      (verbatim Johnny dictation)
//   yappage/2026-04-26-distilled-by-persona.md  (per-audience hard-hitters)
//
// ── PERSONA ORDERINGS (← → swap) ────────────────────────────────────────────
// Per yappage Msg 11 ("one cohesive story · slightly altered version per
// audience · who they are as people, what they're looking for, how technical
// they are, and the EMPHASIS"), and Msg 14 ("three different versions or
// three different sections and three different ordering"):
//
// Each persona gets its own slide ORDER, not just per-slide content variants.
// The slide library is the same — what differs is which slide leads, which
// concept lands first, and which beat carries the close. Reasoning per
// persona is documented inline below.
//
// SPONSOR CLOSE SWAP (?p=<sponsor>) — independent of persona. Replaces the
// LAST slide via the SponsorClose mechanic in app/components/Deck.tsx.

import Deck, { type Slide, type Persona } from "../components/Deck";

import title from "./slides/01-title";
import hook from "./slides/02-hook";
import stakes from "./slides/03-stakes";
import thesis from "./slides/04-thesis";
import tribeV2 from "./slides/05-tribe-v2";
import architecture from "./slides/06-architecture";
import swarmDetail from "./slides/07-swarm-detail";
import scoreClimb from "./slides/08-score-climb";
import proof from "./slides/09-proof";
import heroOutput from "./slides/10-hero-output";
import falsification from "./slides/11-falsification";
import twoScenarios from "./slides/12-two-scenarios";
import pavilionMap from "./slides/13-pavilion-map";
import close from "./slides/14-close";

// IRONSIGHT — story-led, concrete-first, worker-on-stage.
// Reasoning: this audience thinks in physical scenes. Lead with the
// industries (where the construction worker lives). Land the empathy gap
// fast through the manager's eyes. Surface the architecture as the engine
// that closes the gap. Prove on construction footage. Close on the win-win.
// (yappage Msg 11: "use the construction example itself · the empowerment
// gap · win-win for workers, managers, and the company".)
const IRONSIGHT_ORDER: Slide[] = [
  title,
  stakes,        // concrete: three industries, construction lands hardest
  hook,          // the black box managers are using to manage humans
  thesis,        // the inversion
  tribeV2,       // what unlocked it
  architecture,  // the engine
  swarmDetail,   // the seven specialists doing the work
  proof,         // construction · spatial intel
  heroOutput,    // construction sim + AMY
  twoScenarios,  // laziness vs high-stress · the call changes
  scoreClimb,    // the rigor (8 rounds)
  falsification, // the rigor 2 (cosine doesn't lie)
  pavilionMap,
  close,         // empowerment win-win
];

// LISTEN LABS — concept-led, simulation-first, autonomy-stake.
// Reasoning: this audience thinks abstractly about modeling cognition. Hit
// them with the visceral hook (taste isn't yours), then immediately the
// conceptual unlock (TRIBE V2 as new substrate), then the load-bearing point
// (the swarm IS the simulation, neurons firing, not text personas), then the
// iterative loop, then proof on Reels.
// (yappage Msg 11: "instead of talking about how people normally simulate
// personas through text, we're trying to simulate how neurons fire · the
// iterative loop IS the simulation · reclaim autonomy".)
const LISTEN_LABS_ORDER: Slide[] = [
  title,
  hook,          // taste isn't yours · the visceral
  tribeV2,       // the conceptual unlock — substrate of human simulation
  swarmDetail,   // the swarm IS the simulation (load-bearing)
  scoreClimb,    // 8 rounds of iterative simulation
  thesis,        // the inversion · same machinery in reverse
  stakes,        // briefly · consumer is the lead industry here
  proof,         // Reels · the visible flatline
  heroOutput,    // Maya sim + AMY
  architecture,  // the full pipeline
  falsification,
  twoScenarios,
  pavilionMap,
  close,         // generation autonomy
];

// AI INTERACTION (best-of-ai) — value-led, taste-first, philosophy-up-front.
// Reasoning: this audience cares about HOW AI is being used. Lead with the
// thesis (the inversion · ai is meant to augment, not replace). Then the
// hook (convergence is killing creativity). Then design as the lead
// industry. Tool reveal. Proof on autumn leaves. Close on taste persists.
// (yappage Msg 11: "best use of AI · taste is the one skill that persists
// beyond AI · never making decisions for you · the divergent thought stays
// yours".)
const AI_INTERACTION_ORDER: Slide[] = [
  title,
  thesis,        // lead with the philosophy / the inversion
  hook,          // convergence is killing creativity
  stakes,        // design / taste leads
  tribeV2,
  architecture,
  proof,         // autumn leaves vs. your design
  heroOutput,    // design sim + AMY
  swarmDetail,
  scoreClimb,
  falsification,
  twoScenarios,
  pavilionMap,
  close,         // taste persists beyond AI
];

const SLIDES_BY_PERSONA: Record<Persona, Slide[]> = {
  ironsight: IRONSIGHT_ORDER,
  "listen-labs": LISTEN_LABS_ORDER,
  "best-of-ai": AI_INTERACTION_ORDER,
};

export default function RoundOne() {
  return <Deck slides={SLIDES_BY_PERSONA} />;
}
