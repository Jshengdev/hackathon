// Three example simulations consumed by the hero-output slide.
// `HeroEmpathyCarousel` selects which one to render based on the active
// persona. Future edits: replace placeholder paragraphs with real moderator
// outputs from demo runs. Keep the keys (`consumer` / `construction` /
// `design`) — they're referenced by `PERSONA_META[persona].heroExampleKey`
// in `app/components/Deck.tsx`.

import type { ReactNode } from "react";

export type HeroExample = {
  key: "consumer" | "construction" | "design";
  scenarioLabel: string;
  visionReport: string;
  empathyParagraph: ReactNode;
  similarity: number;
  falsificationDelta: number;
};

export const HERO_EXAMPLES: HeroExample[] = [
  {
    key: "consumer",
    scenarioLabel: "consumer · 5 reels scrolled · maya, 17",
    visionReport:
      "user opened instagram. 5 reels viewed: trending dance, ai fashion ad, true-crime clip, relatable-sadness post, food video. duration: 4 min 12s.",
    empathyParagraph: (
      <>
        the first reel hit the visual cortex hard but barely touched the
        prefrontal — passive consumption from second one. by reel three, the
        default-mode network — the part of her that&apos;s just <em>her</em> —
        was firing in the same convergent pattern as ten thousand other
        18-year-olds we&apos;ve sampled. the algorithm is steering toward a
        shared average; she has stopped contributing to her own taste. the
        salience signal is sharp on emotional triggers, dull on novelty.{" "}
        <em>she is being shaped, not choosing.</em>
      </>
    ),
    similarity: 0.82,
    falsificationDelta: 0.31,
  },
  {
    key: "construction",
    scenarioLabel: "construction · 40-min site walk · ironsight footage",
    visionReport:
      "worker traversed platform 12x. paused 3x. picked up 4 tools. duration over standard threshold. flag = SLOW.",
    empathyParagraph: (
      <>
        threat-detection sustained at peak from minute 4 onward — not a brief
        spike but a 40-minute continuous burn. visual attention narrowed,
        prefrontal control engaged but increasingly costly. memory networks lit
        up around the second-floor edge — reading prior incidents in this exact
        spot. the worker isn&apos;t slow; he is calibrating against an
        environment the camera can&apos;t see.{" "}
        <em>extending this shift is not a productivity gain.</em>
      </>
    ),
    similarity: 0.84,
    falsificationDelta: 0.29,
  },
  {
    key: "design",
    scenarioLabel: "design / taste · 90s lecture clip · loud professor",
    visionReport:
      "lecturer raised voice 4x. classroom of 28 students. ambient noise: 78 dB. duration: 90s.",
    empathyParagraph: (
      <>
        ventral attention spiked with each volume rise — the room flinched
        together. the limbic system stayed activated for 4–7 seconds after each
        peak, longer than the lecture continued. by minute 6 the prefrontal
        began to disengage entirely; students were still in the room but no
        longer learning. the design of the space — acoustics, layout, lighting
        — is shaping the cognitive load.{" "}
        <em>this isn&apos;t bad teaching. it&apos;s bad design.</em>
      </>
    ),
    similarity: 0.79,
    falsificationDelta: 0.34,
  },
];
