"use client";

// SLIDE 12 — TWO SCENARIOS · use case showcase. Three before/after pairs
// (construction · healthcare · design/education). Universal across personas;
// the speaker emphasizes whichever row the audience cares about most.

import { Kicker } from "../../components/SlideKit";

const USE_CASES = [
  {
    industry: "construction",
    img: "/images/construction-workers.jpg",
    actionData: "worker stalled. duration over threshold. flag.",
    amy: "vigilance peaked at hour 3. threat-detection sustained. decision-fatigue marker rising.",
    outcome: "rotate, don't penalize.",
  },
  {
    industry: "healthcare",
    img: "/images/hospital-handholding.jpg",
    actionData: "30-minute visit. threshold breach. flag.",
    amy: "patient receiving terminal diagnosis. nurse held space. clinical-quality outcome preserved.",
    outcome: "keep the visit. cut nothing.",
  },
  {
    industry: "design / education",
    img: "/images/exhaustion-desk.jpg",
    actionData: "students sat through full lecture. attendance check.",
    amy: "by minute 6, 70% prefrontal disengagement. limbic spikes after each volume rise.",
    outcome: "fix the room, not the students.",
  },
];

export default function TwoScenariosContent() {
  return (
    <div className="flex flex-col items-start gap-8 enter w-full">
      <div className="flex flex-col gap-3 max-w-3xl">
        <Kicker>the use case · the call changes</Kicker>
        <h2 className="display-mono text-5xl md:text-[5.5rem] leading-[1.0] lowercase">
          <span className="ink">three industries.</span>{" "}
          <span className="grad">three call reversals.</span>
        </h2>
      </div>

      <div className="flex flex-col w-full max-w-6xl gap-4">
        {/* Header row */}
        <div className="hidden md:grid grid-cols-12 gap-6 px-2">
          <span className="col-span-2 kicker">industry</span>
          <span className="col-span-3 kicker" style={{ color: "var(--red)" }}>
            action data alone
          </span>
          <span className="col-span-4 kicker" style={{ color: "var(--accent)" }}>
            with amy
          </span>
          <span className="col-span-3 kicker">the manager's call</span>
        </div>

        {USE_CASES.map((c) => (
          <div
            key={c.industry}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center surface-card"
            style={{ padding: "16px 18px" }}
          >
            <div className="md:col-span-2 flex items-center gap-3">
              <div
                style={{
                  width: 60,
                  height: 60,
                  flexShrink: 0,
                  overflow: "hidden",
                  borderRadius: 8,
                }}
              >
                <img
                  src={c.img}
                  alt={c.industry}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <p className="mono text-sm ink lowercase">{c.industry}</p>
            </div>
            <p className="md:col-span-3 mono text-sm smoke leading-relaxed">
              {c.actionData}
            </p>
            <p className="md:col-span-4 sans text-sm ink leading-relaxed">
              {c.amy}
            </p>
            <p className="md:col-span-3 mono italic text-sm" style={{ color: "var(--accent)" }}>
              → {c.outcome}
            </p>
          </div>
        ))}
      </div>

      <p className="mono italic text-base md:text-lg smoke max-w-3xl mt-2">
        same engine. three call reversals. manipulation only works in the dark
        — we turned the lights on.
      </p>
    </div>
  );
}
