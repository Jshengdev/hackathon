"use client";

// SLIDE 03 — STAKES content. Three industries, same black box.
// Universal across personas (cards stay; speaker emphasizes the active
// persona's industry verbally). Verbatim from yappage Msg 10.

import { Kicker } from "../../components/SlideKit";

const INDUSTRIES = [
  {
    k: "design / taste",
    v: "a loud professor. a stressful lecture hall. the environment shapes how you think and what you can learn — but no system measures it. design and packaging shape humans, and we ship them blind.",
  },
  {
    k: "construction",
    v: "managers optimize for sheer productivity. the model shows which brain regions fired most often during the work — and they map to higher cortisol, sustained stress. optimize emotions, not minutes.",
  },
  {
    k: "consumer",
    v: "the platforms engineer which parts of your brain fire to keep you scrolling — and you can’t adjust the weights. you can’t even see them. we democratize that access.",
  },
];

export default function StakesContent() {
  return (
    <div className="flex flex-col items-start gap-12 enter">
      <div className="flex flex-col gap-4 max-w-3xl">
        <Kicker>the stakes · three industries · same gap</Kicker>
        <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
          <span className="ink">three industries.</span>{" "}
          <span className="grad">same black box.</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {INDUSTRIES.map((c) => (
          <div
            key={c.k}
            className="surface-card flex flex-col gap-3"
            style={{ padding: "24px 28px" }}
          >
            <p className="kicker" style={{ color: "var(--accent)" }}>
              {c.k}
            </p>
            <p className="mono text-sm smoke leading-relaxed">{c.v}</p>
          </div>
        ))}
      </div>
      <p className="sans text-base md:text-lg smoke max-w-3xl leading-relaxed">
        ai describes what humans did. it cannot model the cognitive-emotional
        state underneath. so managers read reports built on what the camera saw
        and cut corners that destroy what their company actually wants. workers
        stop being humans. they become productivity numbers.
      </p>
      <p className="display-mono text-3xl md:text-5xl ink lowercase">
        humans are not machines.
      </p>
    </div>
  );
}
