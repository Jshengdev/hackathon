"use client";

// SLIDE 08 — SCORE CLIMB content. 8 rounds · the iterative loop reveal.
// Universal across personas. The 0.42 → 0.84 trajectory is illustrative;
// swap with real demo numbers when available. The 4-second silence is a
// STAGE DIRECTION — let the numbers climb on screen without speaking over.

import { Kicker, BrainBlock } from "../../components/SlideKit";

export default function ScoreClimbContent() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
        <div className="lg:col-span-6 flex flex-col gap-8 max-w-xl">
          <Kicker>surprise · the hero reveal</Kicker>
          <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.92] lowercase">
            <span className="ink">eight rounds.</span>
            <br />
            <span className="grad">the score climbs.</span>
          </h2>
          <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
            each round, the moderator writes a new paragraph. the swarm-as-
            evaluator scores it against the actual brain pattern from the
            footage. round one — generic, low score. round by round, the
            paragraph rewrites itself toward the brain pattern.
          </p>
          <p className="mono italic text-base md:text-lg smoke">
            0.42 → 0.58 → 0.65 → 0.71 → 0.78 → 0.82 →{" "}
            <span className="accent">0.84</span>
          </p>
          <p className="kicker" style={{ color: "var(--red)" }}>
            production note · 4 seconds of silence here · let the engine
            improve on screen
          </p>
        </div>
        <div className="lg:col-span-6 justify-self-end">
          <BrainBlock variant="score-climb" seed={84} size={500} />
        </div>
      </div>
    </>
  );
}
