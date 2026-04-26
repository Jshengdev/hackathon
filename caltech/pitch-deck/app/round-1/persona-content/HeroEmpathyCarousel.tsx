"use client";

// Reads the current persona from deck-level context. The persona's
// `heroExampleKey` selects which simulation to render. Left/right arrows
// at the deck level swap personas globally — this component just reflects
// the current state.

import { usePersona, PERSONA_META } from "../../components/Deck";
import { EmpathyDocument } from "../../components/SlideKit";
import { HERO_EXAMPLES } from "./hero-examples";

export default function HeroEmpathyCarousel() {
  const { persona } = usePersona();
  const meta = PERSONA_META[persona];
  const v =
    HERO_EXAMPLES.find((e) => e.key === meta.heroExampleKey) ?? HERO_EXAMPLES[0];

  return (
    <div className="flex flex-col gap-3 items-end">
      <EmpathyDocument
        scenarioLabel={v.scenarioLabel}
        visionReport={v.visionReport}
        empathyParagraph={v.empathyParagraph}
        similarity={v.similarity}
        falsificationDelta={v.falsificationDelta}
      />
      <div className="flex items-center gap-3 mt-1">
        <span className="kicker" style={{ color: "var(--accent)" }}>
          ← →
        </span>
        <span className="kicker">
          {meta.shortLabel} emphasis · {v.key} simulation
        </span>
      </div>
    </div>
  );
}
