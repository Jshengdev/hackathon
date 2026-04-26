"use client";

// SLIDE 11 — FALSIFICATION content. Within-subject contrast · cosine
// doesn't lie. Universal across personas (the methodology is the same;
// only the example varies via persona on slides 9 and 10).

import { Kicker } from "../../components/SlideKit";

export default function FalsificationContent() {
  return (
    <div className="flex flex-col items-start gap-12 enter">
      <Kicker>falsification rigor · the methodology travels</Kicker>
      <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase max-w-4xl">
        <span className="ink">same subject.</span>{" "}
        <span className="grad">two scenes.</span>{" "}
        <span className="ink">within-subject contrast.</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
        <div
          className="surface-card-feature flex flex-col gap-3"
          style={{ padding: "24px 28px" }}
        >
          <p className="kicker" style={{ color: "var(--accent)" }}>
            main · paragraph vs. its own scene
          </p>
          <p className="mono text-sm smoke leading-relaxed">
            paragraph generated from this scene&apos;s brain pattern. scored
            against the same scene&apos;s pattern.
          </p>
          <p className="numeral text-4xl ink">0.86</p>
          <p className="kicker">similarity · anchored</p>
        </div>
        <div
          className="surface-card flex flex-col gap-3"
          style={{ padding: "24px 28px" }}
        >
          <p className="kicker" style={{ color: "var(--warm-charcoal)" }}>
            control · same paragraph, different scene
          </p>
          <p className="mono text-sm smoke leading-relaxed">
            same paragraph. scored against a different scene&apos;s brain
            pattern. the drop proves the paragraph belongs to its scene, not
            boilerplate.
          </p>
          <p className="numeral text-4xl" style={{ color: "var(--accent)" }}>
            0.27
          </p>
          <p className="kicker">falsification delta</p>
        </div>
      </div>
      <p className="sans text-base md:text-lg smoke max-w-3xl leading-relaxed">
        within-subject only — no population-norm comparisons. the same
        paragraph scored against a different scene&apos;s brain pattern
        collapses. that drop is the falsification. cosine distance
        doesn&apos;t lie. the paragraph belongs to <em>this</em> scene, not
        generically to humans.
      </p>
    </div>
  );
}
