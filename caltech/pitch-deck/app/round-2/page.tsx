"use client";

// CALTECH HACKTECH 2026 — ROUND 2 DECK · 3-min · 8 slides · v3 MASTER CUT
//
// Beat-synced to caltech/pitch-story-v3-next-level.md §2 (1:30 master cut).
// 8 slides compress the 5 BEATs + cold open + close. Sarah/Lisa healthcare is
// the master scenario. Hero reveal = score climb (BEAT-3). Hero artifact =
// empathy paragraph (BEAT-4). Decision reversal closes the arc (BEAT-5).

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
  // 01 · cold open · johnny on camera (–0:05 → 0:08)
  {
    id: "cold-open",
    render: () => (
      <>
        <RedDot top="7%" left="7%" />
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>cold open · johnny on camera</Kicker>
          <h1 className="display-mono ink text-[3.5rem] md:text-[6rem] leading-[0.92] lowercase">
            somewhere right now,
            <br />
            <span className="grad">a manager is looking at a number.</span>
          </h1>
          <AnchorQuote attribution="johnny — locked">
            thirty minutes. over threshold. and they&apos;re about to send a message. they don&apos;t
            know what happened in that room. ai can watch that footage. it can describe every
            action and tool every second. but it cannot tell you how that person felt doing it.
            that gap is where bad decisions live. we built the missing layer.
          </AnchorQuote>
        </div>
        <ScrollHint />
      </>
    ),
  },

  // 02 · BEAT-1 · the gap (0:08–0:30)
  {
    id: "the-gap",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
            <Kicker>beat-1 · the gap</Kicker>
            <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.95] lowercase">
              <span className="ink">ai can see.</span>
              <br />
              <span className="grad">it cannot tell you what it meant.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-xl">
              dashboard glows: <span className="mono">duration: 1,800s · flag: OVER_THRESHOLD</span>.
              the manager&apos;s hand hovers over the keyboard. every company in the world is making
              decisions about humans using data that was never designed to understand humans.
            </p>
            <p className="mono italic text-base ink">
              the action data was right. the decision was wrong.
            </p>
          </div>
          <div className="lg:col-span-5 justify-self-end">
            <BrainBlock variant="vision-vs-brain" seed={11} size={440} />
          </div>
        </div>
      </>
    ),
  },

  // 03 · BEAT-2 · the brain layer (0:30–0:50)
  {
    id: "brain-layer",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-6 flex flex-col gap-8 max-w-xl">
            <Kicker>beat-2 · the brain layer</Kicker>
            <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.92] lowercase">
              <span className="ink">what her brain was doing</span>{" "}
              <span className="grad">while she did it.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-md">
              meta&apos;s tribe v2 predicts per-second neural response across roughly twenty thousand
              cortical points. eight k2 specialist agents interpret each region in parallel —
              prefrontal, emotional-processing, default-mode, salience-tracking. hover-bridges
              cross-talk between regions. what the action data missed, the brain pattern captures.
            </p>
          </div>
          <div className="lg:col-span-6 justify-self-end">
            <BrainBlock variant="vision-vs-brain" seed={42} size={500} />
          </div>
        </div>
      </>
    ),
  },

  // 04 · BEAT-3 · score climbs · HERO REVEAL (0:50–1:25)
  {
    id: "score-climb",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-6 flex flex-col gap-8 max-w-xl">
            <Kicker>beat-3 · hero reveal · 4-second silence</Kicker>
            <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.92] lowercase">
              <span className="ink">round one: 0.42.</span>
              <br />
              <span className="grad">round eight: 0.84.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-md">
              eight rounds of iterative scoring. each round, claude writes a new paragraph
              describing what the nurse felt. tribe v2 scores it against the actual brain pattern
              from the footage. the swarm tells us which regions we missed. the score climbs.
            </p>
            <p className="mono italic text-base ink">
              the same protocol that matched clair de lune to 90.4% — run in reverse.
            </p>
          </div>
          <div className="lg:col-span-6 justify-self-end">
            <BrainBlock variant="score-climb" seed={84} size={500} />
          </div>
        </div>
      </>
    ),
  },

  // 05 · BEAT-4 · the paragraph · the artifact (1:25–2:05)
  {
    id: "paragraph",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-5 flex flex-col gap-7 max-w-md">
            <Kicker>beat-4 · the paragraph</Kicker>
            <h2 className="display-mono text-4xl md:text-[5rem] leading-[0.95] lowercase">
              <span className="ink">she did not rush.</span>
              <br />
              <span className="ink">she did not check out.</span>
              <br />
              <span className="grad">she held space.</span>
            </h2>
            <p className="mono italic text-sm smoke leading-relaxed">
              anchored. not confabulated.
            </p>
          </div>
          <div className="lg:col-span-7 justify-self-end">
            <EmpathyDocument
              scenarioLabel="oncology clinic · 30-min patient visit · sarah / lisa"
              visionReport="nurse entered room. sat 30 min. adjusted IV. held patient&apos;s hand. left. flag = OVER_THRESHOLD."
              empathyParagraph={
                <>
                  she entered the room and her vital-attention signature shifted immediately — the
                  prefrontal sharpness of triage softened into something quieter, more accommodating.
                  for the first twelve minutes her emotional-processing specialist sustained
                  engagement; she was reading the patient&apos;s grief, not just monitoring it. then
                  a long stretch of default-mode dominance — minutes 18 through 22 — being present
                  with someone, not waiting for them to finish. the final eight minutes returned to
                  focused care, prefrontal-engaged, holding the patient&apos;s hand.{" "}
                  <em>she did not rush. she did not check out. she held space.</em>
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

  // 06 · BEAT-5 · the decision reverses (2:05–2:25)
  {
    id: "decision-reverses",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-10 enter">
          <Kicker>beat-5 · the decision reverses</Kicker>
          <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase max-w-3xl">
            <span className="ink">the manager doesn&apos;t send the message.</span>{" "}
            <span className="grad">the corner-cut doesn&apos;t happen.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
            <div className="surface-card-dashed p-6 md:p-8 flex flex-col gap-3">
              <p className="kicker" style={{ color: "var(--red)" }}>
                action-data report
              </p>
              <p className="mono text-sm smoke leading-relaxed">
                action: held hand
                <br />
                duration: 1,800s
                <br />
                status: OVER_THRESHOLD
                <br />
                recommendation: cut to 10 min
              </p>
            </div>
            <div className="surface-card-feature p-6 md:p-8 flex flex-col gap-3">
              <p className="kicker" style={{ color: "var(--accent)" }}>
                empathy document
              </p>
              <p className="serif text-base ink leading-relaxed">
                she held space.
              </p>
              <p className="mono text-xs smoke">
                similarity: 0.84 · falsification: 0.27 · anchored
              </p>
            </div>
          </div>
          <p className="mono italic text-lg ink mt-2">
            the patient stays. the nurse stays.
          </p>
        </div>
      </>
    ),
  },

  // 07 · two scenarios · one engine (2:25–2:45)
  {
    id: "two-scenarios",
    render: () => (
      <>
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>two scenarios · one engine</Kicker>
          <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase max-w-3xl ink">
            same engine. <span className="grad">different input.</span>
          </h2>
          <ul
            className="flex flex-col divide-y w-full max-w-3xl"
            style={{ borderColor: "var(--hair)" }}
          >
            {[
              {
                k: "workplace",
                h: "/sponsor/ironside",
                note: "ironside pavilion · the manager reads the empathy document before cutting lisa's time. the corner-cut doesn't happen.",
              },
              {
                k: "consumer",
                h: "/sponsor/sideshift",
                note: "sideshift / listen labs · maya reads her own day back. she wasn't watching — she was being watched-at. know what knows you.",
              },
            ].map((s) => (
              <li
                key={s.k}
                className="grid grid-cols-12 gap-4 items-baseline py-5"
                style={{ borderColor: "var(--hair)" }}
              >
                <a href={s.h} className="contents group">
                  <span
                    className="kicker col-span-3 md:col-span-2"
                    style={{ color: "var(--accent)" }}
                  >
                    open →
                  </span>
                  <span className="mono text-2xl ink col-span-9 md:col-span-3 lowercase group-hover:text-[var(--accent)] transition-colors">
                    {s.k}
                  </span>
                  <span className="sans text-sm smoke col-span-12 md:col-span-7">
                    {s.note}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mono italic text-base smoke">
            we surface evidence. the human in the loop judges. we never recommend behavior.
          </p>
        </div>
      </>
    ),
  },

  // 08 · title-card close (2:45–3:00)
  {
    id: "close",
    render: () => (
      <>
        <RedDot top="8%" left="8%" />
        <RedDot bottom="8%" right="8%" />
        <div className="flex flex-col items-center justify-center gap-8 text-center enter max-w-5xl mx-auto">
          <Kicker>title card · hard cut from black</Kicker>
          <h2 className="display-mono leading-[0.95] lowercase">
            <span className="block text-4xl md:text-6xl smoke">humans are not</span>
            <span className="block grad text-7xl md:text-[9rem]">machines.</span>
          </h2>
          <p className="mono italic text-2xl md:text-3xl ink mt-4 max-w-3xl">
            the empathy layer is what ai gives back.
          </p>
          <div className="rule w-24 my-6" />
          <p className="kicker" style={{ color: "var(--accent)", letterSpacing: "0.32em" }}>
            caltech hacktech 2026 · johnny · junsoo · jacob · emilie
          </p>
        </div>
      </>
    ),
  },
];

export default function RoundTwo() {
  return <Deck slides={slides} />;
}
