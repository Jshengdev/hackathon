"use client";

// SLIDE 08 — SCORE CLIMB content. 3 rounds · the iterative loop reveal.

import { Kicker, BrainBlock } from "../../components/SlideKit";

export default function ScoreClimbContent() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
        <div className="lg:col-span-6 flex flex-col gap-7 max-w-xl">
          <Kicker>surprise · the hero reveal</Kicker>
          <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.92] lowercase">
            <span className="ink">three rounds.</span>
            <br />
            <span className="grad">the score climbs.</span>
          </h2>
          <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
            each round, the swarm scores the paragraph against the brain
            pattern. plateau exit. the paragraph rewrites itself toward the
            actual cortical signal.
          </p>
          <p className="mono italic text-base md:text-lg smoke">
            0.71 → 0.78 → <span className="accent">0.84</span>
          </p>
        </div>
        <div className="lg:col-span-6 justify-self-end">
          <BrainBlock variant="score-climb" seed={84} size={500} />
        </div>
      </div>
    </>
  );
}
