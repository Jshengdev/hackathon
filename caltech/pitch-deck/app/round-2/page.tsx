"use client";

// CALTECH HACKTECH 2026 — ROUND 2 DECK · 3-min · 8 slides · IRONSIGHT-ANCHORED
//
// Beat-synced to caltech/architecture-overview.md §11. Hero reveal = score climb
// (BEAT-3). Hero output = empathy-layer document (BEAT-4). Sarah / Lisa nurse
// story is the load-bearing pitch.

import Deck, { type Slide } from "../components/Deck";
import RedDot from "../components/RedDot";
import ScrollHint from "../components/ScrollHint";
import {
  Kicker,
  BrainBlock,
  AnchorQuote,
  EmpathyDocument,
} from "../components/SlideKit";

const slides: Slide[] = [
  // 01 · title (0:00–0:08)
  {
    id: "title",
    render: () => (
      <>
        <RedDot top="7%" left="7%" />
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>0:00–0:08</Kicker>
          <h1 className="display-mono ink text-[3.5rem] md:text-[6rem] leading-[0.92] lowercase">
            humans are not machines.
            <br />
            <span className="grad">ai forgot.</span>
          </h1>
          <AnchorQuote attribution="johnny, empathy-layer epiphany">
            we can&apos;t treat humans like machines. we need a layer that predicts what paragraph
            aligns with what&apos;s actually happening.
          </AnchorQuote>
        </div>
        <ScrollHint />
      </>
    ),
  },

  // 02 · problem (0:08–0:30)
  {
    id: "problem",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
            <Kicker>0:08–0:30 · problem</Kicker>
            <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.95] lowercase">
              <span className="ink">ai sees</span>{" "}
              <span className="grad">what they did.</span>
              <br />
              <span className="ink">it can&apos;t see</span>{" "}
              <span className="grad">what it took.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-xl">
              a vlm flags a 30-min nurse visit as over-threshold. the manager cuts it to ten. the
              patient was being told they have cancer. action data optimization destroys the outcome
              the company actually wants.
            </p>
          </div>
          <div className="lg:col-span-5 justify-self-end">
            <BrainBlock variant="vision-vs-brain" seed={11} size={440} />
          </div>
        </div>
      </>
    ),
  },

  // 03 · solution (0:30–0:55)
  {
    id: "solution",
    render: () => (
      <>
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>0:30–0:55 · solution</Kicker>
          <h2 className="display-mono leading-[1.0] lowercase">
            <span className="block text-3xl md:text-5xl smoke">a brain-grounded</span>
            <span className="block grad text-6xl md:text-[8rem]">empathy layer.</span>
            <span className="block text-3xl md:text-5xl mt-4 smoke">video in. paragraph out.</span>
          </h2>
          <p className="sans text-base md:text-lg smoke max-w-xl">
            tribe v2 + k2 swarm + claude opus + the iterative-scoring loop from clair de lune, run
            in reverse. eight rounds. one paragraph. evidence the manager can audit.
          </p>
        </div>
      </>
    ),
  },

  // 04 · demo · iterative loop hero reveal (0:55–1:35)
  {
    id: "score-climb",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-6 flex flex-col gap-8 max-w-xl">
            <Kicker>0:55–1:35 · hero reveal</Kicker>
            <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.92] lowercase">
              <span className="ink">eight rounds.</span>
              <br />
              <span className="grad">the score climbs.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-md">
              tribe v2 scores each candidate paragraph forward. cosine similarity against the actual
              video&apos;s brain pattern. plateau at round 8. <span className="accent">0.42 → 0.84.</span>
            </p>
          </div>
          <div className="lg:col-span-6 justify-self-end">
            <BrainBlock variant="score-climb" seed={84} size={500} />
          </div>
        </div>
      </>
    ),
  },

  // 05 · hero output · empathy-layer document (1:35–2:15)
  {
    id: "hero-output",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-5 flex flex-col gap-7 max-w-md">
            <Kicker>1:35–2:15 · hero output</Kicker>
            <h2 className="display-mono text-5xl md:text-[6rem] leading-[0.95] lowercase">
              <span className="ink">she did not rush.</span>
              <br />
              <span className="grad">she held space.</span>
            </h2>
            <p className="sans text-base smoke leading-relaxed">
              the dashboard would have cut the visit to ten minutes. the document changes the call.
            </p>
            <p className="mono italic text-base smoke">
              the corner-cut doesn&apos;t happen.
            </p>
          </div>
          <div className="lg:col-span-7 justify-self-end">
            <EmpathyDocument
              scenarioLabel="oncology clinic · 30-min patient visit"
              visionReport="nurse entered room. sat 30 min. adjusted IV. held patient&apos;s hand. left. flag = OVER_THRESHOLD."
              empathyParagraph={
                <>
                  her vital-attention signature shifted as she entered the room. emotional-processing
                  sustained for the first twelve minutes — reading the patient&apos;s grief, not just
                  monitoring it. minutes 18–22 sat in default-mode dominance — being present, not
                  waiting. <em>she did not rush. she did not check out. she held space.</em>
                </>
              }
              similarity={0.86}
              falsificationDelta={0.27}
            />
          </div>
        </div>
      </>
    ),
  },

  // 06 · proof + best use of AI (2:15–2:35)
  {
    id: "proof",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-10 enter">
          <Kicker>2:15–2:35 · proof shipped · best use of ai</Kicker>
          <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-12 w-full">
            <div className="lg:col-span-7">
              <p className="numeral ink text-[7rem] md:text-[12rem] leading-[0.9]">
                90.4<span className="text-[4rem] md:text-[6rem] align-top accent">%</span>
              </p>
              <p className="sans text-base md:text-lg smoke max-w-md mt-4">
                clair de lune. 60s in. 8 rounds. emotion-region match. shipped 2026-03. same loop,
                run in reverse, is the engine.
              </p>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <p className="kicker" style={{ color: "var(--accent)" }}>
                  yea
                </p>
                <ul className="flex flex-col gap-1.5 mono text-sm ink lowercase">
                  <li>surface evidence</li>
                  <li>let the human judge</li>
                  <li>synthesize signals</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <p className="kicker" style={{ color: "var(--red)" }}>
                  nay
                </p>
                <ul className="flex flex-col gap-1.5 mono text-sm smoke lowercase">
                  <li>recommend</li>
                  <li>diagnose</li>
                  <li>reverse-infer feelings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    ),
  },

  // 07 · sponsor swap slot (2:35–2:50)
  {
    id: "sponsor-slot",
    render: () => (
      <>
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>2:35–2:50 · sponsor swap</Kicker>
          <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase max-w-3xl ink">
            one engine. four briefs.
          </h2>
          <ul
            className="flex flex-col divide-y w-full max-w-3xl"
            style={{ borderColor: "var(--hair)" }}
          >
            {[
              { k: "ironsight", h: "/sponsor/ironside", note: "primary $5K · spatial-intel brief answered structurally" },
              { k: "listen labs", h: "/sponsor/listenlabs", note: "$3K + interview · the iterative loop is the simulation" },
              { k: "sideshift", h: "/sponsor/sideshift", note: "b2c overlay · the journal that writes itself" },
              { k: "y combinator", h: "/sponsor/yc", note: "stretch · obsidian, but the graph is your brain" },
            ].map((s) => (
              <li
                key={s.k}
                className="grid grid-cols-12 gap-4 items-baseline py-4"
                style={{ borderColor: "var(--hair)" }}
              >
                <a href={s.h} className="contents group">
                  <span
                    className="kicker col-span-3 md:col-span-2"
                    style={{ color: "var(--accent)" }}
                  >
                    open →
                  </span>
                  <span className="mono text-xl ink col-span-9 md:col-span-3 lowercase group-hover:text-[var(--accent)] transition-colors">
                    {s.k}
                  </span>
                  <span className="sans text-sm smoke col-span-12 md:col-span-7">{s.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </>
    ),
  },

  // 08 · close (2:50–3:00)
  {
    id: "close",
    render: () => (
      <>
        <RedDot top="8%" left="8%" />
        <RedDot bottom="8%" right="8%" />
        <div className="flex flex-col items-center justify-center gap-8 text-center enter max-w-5xl mx-auto">
          <Kicker>2:50–3:00</Kicker>
          <h2 className="display-mono leading-[0.95] lowercase">
            <span className="block text-4xl md:text-6xl smoke">humans are not</span>
            <span className="block grad text-7xl md:text-[9rem]">machines.</span>
          </h2>
          <p className="mono italic text-2xl md:text-3xl ink mt-4 max-w-3xl">
            the empathy layer is what ai gives back.
          </p>
          <div className="rule w-24 my-6" />
          <p className="kicker" style={{ color: "var(--accent)", letterSpacing: "0.32em" }}>
            johnny · junsoo · jacob · emilie
          </p>
        </div>
      </>
    ),
  },
];

export default function RoundTwo() {
  return <Deck slides={slides} />;
}
