"use client";

// SLIDE 03 — STAKES content. Three industries, same black box.
// Universal across personas (cards stay; speaker emphasizes the active
// persona's industry verbally). Verbatim from yappage Msg 10.

import { Kicker } from "../../components/SlideKit";

const INDUSTRIES = [
  {
    k: "construction",
    v: "managers optimize for sheer productivity. the brain pattern shows sustained cortisol the camera can't see. optimize emotions, not minutes.",
    img: "/images/construction-workers.jpg",
    imgAlt: "construction workers on site",
  },
  {
    k: "healthcare",
    v: "a nurse spends 30 minutes with a dying patient. the dashboard sees an overrun. the action was right; the decision was wrong.",
    img: "/images/hospital-handholding.jpg",
    imgAlt: "patient hand-holding moment",
  },
  {
    k: "consumer",
    v: "the platforms engineer which parts of your brain fire to keep you scrolling — and you can't adjust the weights. you can't even see them.",
    img: "/images/hospital-lobby.jpg",
    imgAlt: "busy modern workplace lobby",
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
            className="surface-card flex flex-col overflow-hidden"
            style={{ padding: 0 }}
          >
            <div
              style={{
                width: "100%",
                height: 160,
                overflow: "hidden",
              }}
            >
              <img
                src={c.img}
                alt={c.imgAlt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div className="flex flex-col gap-3" style={{ padding: "20px 24px 24px" }}>
              <p className="kicker" style={{ color: "var(--accent)" }}>
                {c.k}
              </p>
              <p className="mono text-sm smoke leading-relaxed">{c.v}</p>
            </div>
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
