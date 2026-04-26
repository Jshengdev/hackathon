"use client";

// SLIDE 12 — TWO SCENARIOS content. Laziness vs. high-stress · democratization.
// Universal across personas (the laziness/stress example reads across all
// audiences; persona only changes the verbal emphasis).
// Verbatim from yappage Msg 09–10.

import { Kicker } from "../../components/SlideKit";

export default function TwoScenariosContent() {
  return (
    <div className="flex flex-col items-start gap-12 enter">
      <div className="flex flex-col gap-4 max-w-3xl">
        <Kicker>the example · the call changes</Kicker>
        <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
          <span className="ink">looks like laziness.</span>{" "}
          <span className="grad">was high-stress.</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
        <div className="flex flex-col gap-4">
          <p
            className="kicker"
            style={{ color: "var(--red)", letterSpacing: "0.32em" }}
          >
            action data alone
          </p>
          <p className="display-mono text-2xl md:text-3xl ink lowercase">
            worker stalled. duration over threshold. flag.
          </p>
          <p className="sans text-sm smoke leading-relaxed">
            the manager sees a lazy worker. the message gets sent. the corner
            gets cut. the worker is judged on what the data couldn&apos;t see.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <p
            className="kicker"
            style={{ color: "var(--accent)", letterSpacing: "0.32em" }}
          >
            with the empathy layer
          </p>
          <p className="display-mono text-2xl md:text-3xl ink lowercase">
            high-stress environment. long sustained cognitive load.
          </p>
          <p className="sans text-sm smoke leading-relaxed">
            what the camera missed: the threat-detection running at peak for
            40 minutes straight. not sustainable for the worker. not
            sustainable for long-term productivity. the manager doesn&apos;t
            send the message.
          </p>
        </div>
      </div>
      <p className="display-mono text-3xl md:text-5xl ink lowercase max-w-4xl">
        same engine. infinite scenarios.
      </p>
      <p className="sans text-base md:text-lg smoke max-w-3xl leading-relaxed">
        this is what democratizing the algorithm looks like. when people use
        ai to make decisions, they should understand what the human is going
        through — not just whatever the llm tells them. ai becomes the
        co-pilot guiding you toward empathy, not the autopilot reducing
        people to cogs.
      </p>
      <p className="mono italic text-base md:text-lg smoke max-w-3xl">
        manipulation only works in the dark. we turned the lights on.
      </p>
    </div>
  );
}
