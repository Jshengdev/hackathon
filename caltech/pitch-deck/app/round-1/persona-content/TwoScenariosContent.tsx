"use client";

// SLIDE 12 — TWO SCENARIOS content. Laziness vs. high-stress · democratization.
// Universal across personas (the laziness/stress example reads across all
// audiences; persona only changes the verbal emphasis).
// Verbatim from yappage Msg 09–10.

import { Kicker } from "../../components/SlideKit";

export default function TwoScenariosContent() {
  return (
    <div className="flex flex-col items-start gap-10 enter">
      <div className="flex flex-col gap-4 max-w-3xl">
        <Kicker>the example · the call changes</Kicker>
        <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
          <span className="ink">looks like laziness.</span>{" "}
          <span className="grad">was high-stress.</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 w-full max-w-6xl items-center">
        <div className="md:col-span-4">
          <img
            src="/images/exhaustion-desk.jpg"
            alt="exhausted worker at desk"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 12,
              boxShadow:
                "rgba(0, 0, 0, 0.10) 0px 1px 1px, rgba(0, 0, 0, 0.04) 0px -1px 1px inset",
            }}
          />
        </div>
        <div className="md:col-span-4 flex flex-col gap-3">
          <p
            className="kicker"
            style={{ color: "var(--red)", letterSpacing: "0.32em" }}
          >
            action data alone
          </p>
          <p className="display-mono text-xl md:text-2xl ink lowercase">
            worker stalled. duration over threshold. flag.
          </p>
          <p className="sans text-sm smoke leading-relaxed">
            the manager sees a lazy worker. the message gets sent.
          </p>
        </div>
        <div className="md:col-span-4 flex flex-col gap-3">
          <p
            className="kicker"
            style={{ color: "var(--accent)", letterSpacing: "0.32em" }}
          >
            with amy
          </p>
          <p className="display-mono text-xl md:text-2xl ink lowercase">
            sustained cognitive load. high-stress environment.
          </p>
          <p className="sans text-sm smoke leading-relaxed">
            threat-detection peaked for 40 minutes. not sustainable. the
            manager doesn&apos;t send the message.
          </p>
        </div>
      </div>
      <p className="display-mono text-3xl md:text-4xl ink lowercase max-w-4xl">
        same engine. infinite scenarios.
      </p>
      <p className="mono italic text-base md:text-lg smoke max-w-3xl">
        manipulation only works in the dark. we turned the lights on.
      </p>
    </div>
  );
}
