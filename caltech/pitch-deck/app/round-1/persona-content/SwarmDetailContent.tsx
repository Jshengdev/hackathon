"use client";

// SLIDE 07 — SWARM DETAIL content. 7 networks, 7 specialists, in parallel.
// Universal across personas. Verbatim from yappage Msg 09–10.

import { Kicker, BrainBlock } from "../../components/SlideKit";

export default function SwarmDetailContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
      <div className="lg:col-span-6 flex flex-col gap-8 max-w-xl">
        <Kicker>the engine · stage 1B</Kicker>
        <h2 className="display-mono text-5xl md:text-7xl leading-[0.95] lowercase">
          <span className="ink">seven networks.</span>
          <br />
          <span className="grad">seven specialists.</span>
          <br />
          <span className="ink">in parallel.</span>
        </h2>
        <p className="sans text-base md:text-lg smoke leading-relaxed">
          the k2 swarm reads the 7 yeo networks — visual, somatomotor,
          dorsal-attention, ventral-attention (salience), limbic
          (emotional-processing), frontoparietal (prefrontal control),
          default-mode. hover-bridges connect specialists across rounds. each
          region answers its own question.
        </p>
        <p className="sans text-sm smoke max-w-md leading-relaxed">
          what was the prefrontal cortex contributing? what was the
          emotional-processing center doing? what the action data missed —
          the brain pattern captures.
        </p>
      </div>
      <div className="lg:col-span-6 justify-self-end">
        <BrainBlock variant="vision-vs-brain" seed={37} size={500} />
      </div>
    </div>
  );
}
