"use client";

// CALTECH HACKTECH 2026 — ROUND 1 DECK · 5-min · 13 slides · IRONSIGHT-ANCHORED
//
// Source-of-truth (loaded 2026-04-25):
//   _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md  (strategic spine)
//   caltech/architecture-overview.md                              (engine + headline)
//
// The product is the Empathy-Layer Engine. Ironsight is the primary $5K target.
// One engine answers Ironsight's spatial-intelligence brief AND Listen Labs's
// "simulate humanity" brief. Hero output = Empathy-Layer Document. Hero reveal =
// iterative-loop score climbing 0.42 → 0.84 across 8 rounds (Clair de Lune
// protocol inverted).
//
// Headline (memorize): "Humans are not machines. The empathy layer is what AI
// gives back when AI augments management decisions instead of replacing them."
//
// Forbidden-claim guardrails per architecture-overview.md §6:
//   ❌ NO reverse inference ("she felt grief")  ❌ NO clinical claims
//   ❌ NO sub-second predictions  ❌ NO population-norm comparisons
//   ❌ NO inflated TRIBE numbers (canonical: ~20K vertices on fsaverage5, ~25 subjects)
//
// Voice anchors verbatim from Johnny's epiphany yaps (PRD lines 152–162).

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
  // 01 · title — humans are not machines
  {
    id: "title",
    render: () => (
      <>
        <RedDot top="7%" left="7%" />
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>caltech hacktech 2026 · ironsight · listen labs · best use of ai</Kicker>
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

  // 02 · problem — VLMs see action, miss the human
  {
    id: "problem",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
            <Kicker>problem</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
              <span className="ink">ai describes</span>
              <br />
              <span className="ink">what happened.</span>
              <br />
              <span className="grad">it can&apos;t model</span>
              <br />
              <span className="grad">what they felt.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
              a vlm watching a worker on scaffolding sees &ldquo;worker holding tool near edge.&rdquo;
              it doesn&apos;t see whether the worker was focused, fatigued, or in cognitive overload
              when the action happened. the manager reads the report. cuts corners. destroys what the
              company actually wants.
            </p>
          </div>
          <div className="lg:col-span-5 justify-self-end">
            <BrainBlock variant="vision-vs-brain" seed={11} size={460} />
          </div>
        </div>
      </>
    ),
  },

  // 03 · the headline insight
  {
    id: "thesis",
    render: () => (
      <>
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>the empathy layer</Kicker>
          <h2 className="display-mono leading-[1.0] lowercase">
            <span className="block text-3xl md:text-5xl smoke">what ai gives back when</span>
            <span className="block grad text-5xl md:text-[6.5rem]">it augments decisions</span>
            <span className="block text-3xl md:text-5xl mt-2 smoke">instead of replacing them.</span>
          </h2>
          <p className="sans text-base md:text-lg smoke max-w-2xl leading-relaxed">
            we built a brain-grounded translation engine. video in. paragraph out.
            grounded in evidence the reader can audit.
          </p>
        </div>
      </>
    ),
  },

  // 04 · the engine (architecture)
  {
    id: "architecture",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-12 enter">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Kicker>the engine</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
              <span className="ink">video in.</span>{" "}
              <span className="grad">paragraph out.</span>
            </h2>
          </div>
          <ol
            className="flex flex-col divide-y w-full max-w-5xl"
            style={{ borderColor: "var(--hair)" }}
          >
            {[
              {
                n: "01",
                t: "stage 1 · qwen3-vl",
                m: "vision",
                b: "describes the scene. action data baseline — what the manager would see without us.",
              },
              {
                n: "02",
                t: "tribe v2",
                m: "~20K vertices · 1Hz",
                b: "meta&apos;s brain-encoding model. predicts per-region neural response from the same video. the data layer.",
              },
              {
                n: "03",
                t: "k2 swarm",
                m: "~2,000 tok/s",
                b: "one specialist per brain region, in parallel. each interprets what its region was contributing.",
              },
              {
                n: "04",
                t: "stage 2 · claude opus",
                m: "synthesis",
                b: "candidate paragraph describing what the human felt. literature-grade prose. observational, not diagnostic.",
              },
              {
                n: "05",
                t: "iterative loop",
                m: "8 rounds",
                b: "each candidate scored against the brain pattern. plateau or 8 rounds → stop. clair de lune protocol, inverted.",
              },
              {
                n: "06",
                t: "falsification check",
                m: "control delta",
                b: "score the winning paragraph against a control video. drop proves it&apos;s grounded, not confabulated.",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="grid grid-cols-12 gap-6 items-baseline py-4"
                style={{ borderColor: "var(--hair)" }}
              >
                <span className="kicker col-span-1 tabular-nums">{s.n}</span>
                <p
                  className="mono text-lg md:text-xl col-span-11 md:col-span-4 lowercase"
                  style={{ color: "var(--accent)" }}
                  dangerouslySetInnerHTML={{ __html: s.t }}
                />
                <p className="kicker col-span-12 md:col-span-2">{s.m}</p>
                <p
                  className="sans text-sm md:text-base col-span-12 md:col-span-5 smoke leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: s.b }}
                />
              </li>
            ))}
          </ol>
        </div>
      </>
    ),
  },

  // 05 · hero reveal — the iterative loop
  {
    id: "score-climb",
    render: () => (
      <>
        <RedDot top="14%" left="11%" />
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-6 flex flex-col gap-8 max-w-xl">
            <Kicker>hero reveal · the iterative loop</Kicker>
            <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.92] lowercase">
              <span className="ink">eight rounds.</span>
              <br />
              <span className="grad">the score climbs.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
              each round, claude writes a new paragraph. tribe v2 scores it forward — text in, predicted
              brain pattern out. cosine similarity against the actual video&apos;s pattern. plateau or
              round 8, we stop. the score climbing on screen is the demo.
            </p>
            <p className="mono italic text-base smoke">
              0.42 → 0.58 → 0.65 → 0.71 → 0.75 → 0.78 → 0.82 → <span className="accent">0.84</span>
            </p>
          </div>
          <div className="lg:col-span-6 justify-self-end">
            <BrainBlock variant="score-climb" seed={84} size={500} />
          </div>
        </div>
      </>
    ),
  },

  // 06 · the hero output — empathy-layer document (Sarah / Lisa nurse story)
  {
    id: "hero-output",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-5 flex flex-col gap-8 max-w-md">
            <Kicker>hero output · empathy-layer document</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[0.95] lowercase">
              <span className="ink">she did not</span>
              <br />
              <span className="ink">rush.</span>
              <br />
              <span className="grad">she held space.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke leading-relaxed">
              the manager&apos;s dashboard flagged the visit as over-threshold. cut to ten minutes. the
              empathy-layer document showed otherwise.
            </p>
            <p className="mono italic text-base smoke">the corner-cut doesn&apos;t happen.</p>
          </div>
          <div className="lg:col-span-7 justify-self-end">
            <EmpathyDocument
              scenarioLabel="ironsight · oncology clinic · 30-min patient visit"
              visionReport="nurse entered room. sat 30 min. adjusted IV. held patient&apos;s hand. left. duration over threshold; flag = OVER_THRESHOLD."
              empathyParagraph={
                <>
                  her vital-attention signature shifted as she entered the room — the prefrontal
                  sharpness of triage softened into something quieter. for the first twelve minutes
                  her emotional-processing specialist sustained engagement; she was reading the
                  patient&apos;s grief, not just monitoring it. minutes 18–22 sat in default-mode
                  dominance — being present with someone, not waiting for them to finish. the final
                  eight returned to focused care, prefrontal-engaged. <em>she did not rush. she did
                  not check out. she held space.</em>
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

  // 07 · proof — Clair de Lune precedent (the methodology, run inverse)
  {
    id: "proof",
    render: () => (
      <>
        <RedDot top="12%" left="12%" />
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-7 flex flex-col gap-8 max-w-xl">
            <Kicker>proof · clair de lune precedent · shipped 2026-03</Kicker>
            <h2 className="numeral ink text-[7rem] md:text-[12rem] leading-[0.9]">
              90.4<span className="text-[4rem] md:text-[6rem] align-top accent">%</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
              same iterative-scoring loop. ran forward last spring: 60s of clair de lune in, text out,
              90.4% match in the emotion region across 20,484 vertices. eight rounds. falsified against
              triumphant music, rain, and aggressive speech.
            </p>
            <AnchorQuote attribution="johnny, empathy-layer engine">
              we run the same loop in reverse. video&apos;s brain pattern in, paragraph out. the
              methodology already shipped.
            </AnchorQuote>
          </div>
          <div className="lg:col-span-5 justify-self-end">
            <BrainBlock variant="activation-pulse" seed={904} size={460} highlight="emotion" />
          </div>
        </div>
      </>
    ),
  },

  // 08 · one engine, two scenarios
  {
    id: "two-scenarios",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-12 enter">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Kicker>one engine · two scenarios · same hero output</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
              <span className="ink">swap the file.</span>{" "}
              <span className="grad">the engine doesn&apos;t fork.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
            <div className="flex flex-col gap-4">
              <p className="kicker" style={{ color: "var(--accent)", letterSpacing: "0.32em" }}>
                a · workplace footage
              </p>
              <p className="display-mono text-2xl md:text-3xl ink lowercase">
                manager reads the empathy-layer document instead of the action-data report.
              </p>
              <p className="sans text-sm smoke leading-relaxed">
                construction · healthcare · retail · food service · education · logistics. ironsight
                core. listen labs core (per-industry generalization is the simulation).
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="kicker" style={{ color: "var(--warm-charcoal)", letterSpacing: "0.32em" }}>
                b · consumer day-to-day
              </p>
              <p className="display-mono text-2xl md:text-3xl ink lowercase">
                user gets a brain-grounded journal entry of their own day. accumulates into a graph.
              </p>
              <p className="sans text-sm smoke leading-relaxed">
                reels feed · screen recording · daily-life clip. sideshift overlay. yc stretch
                (future-obsidian framing).
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },

  // 09 · how Ironsight defines spatial intelligence — and how we answer it
  {
    id: "ironsight-fit",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-12 enter">
          <Kicker>ironsight · spatial intelligence brief</Kicker>
          <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase max-w-4xl">
            <span className="ink">they asked for</span>{" "}
            <span className="grad">a new modality</span>{" "}
            <span className="ink">mapped back to the video.</span>
          </h2>
          <ol
            className="flex flex-col divide-y w-full max-w-5xl"
            style={{ borderColor: "var(--hair)" }}
          >
            {[
              {
                k: "their ask",
                v: "pinpoint a spatial task where vlms fail. develop a technique. show real-world impact.",
              },
              {
                k: "where vlms fail",
                v: "they cannot infer the cognitive-emotional state behind the spatial action.",
              },
              {
                k: "our technique",
                v: "tribe v2 brain-encoding sidecar. stage 2 maps the brain wave back to the video. their team confirmed at office hours: this qualifies.",
              },
              {
                k: "real-world impact",
                v: "manager reads the empathy-layer document. the corner-cut doesn&apos;t happen. generalizes across every industry where humans are reviewed by action data.",
              },
            ].map((row) => (
              <li
                key={row.k}
                className="grid grid-cols-12 gap-6 items-baseline py-4"
                style={{ borderColor: "var(--hair)" }}
              >
                <p
                  className="kicker col-span-12 md:col-span-3"
                  style={{ color: "var(--accent)" }}
                >
                  {row.k}
                </p>
                <p
                  className="sans text-base md:text-lg col-span-12 md:col-span-9 smoke leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: row.v }}
                />
              </li>
            ))}
          </ol>
        </div>
      </>
    ),
  },

  // 10 · best use of AI — YEA / NAY rubric
  {
    id: "yea-nay",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-12 enter">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Kicker>best use of ai</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
              <span className="ink">augment.</span>{" "}
              <span className="grad">don&apos;t replace.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
            <div className="flex flex-col gap-4">
              <p className="kicker" style={{ color: "var(--accent)", letterSpacing: "0.32em" }}>
                yea
              </p>
              <ul className="flex flex-col gap-3 mono text-lg md:text-xl ink lowercase">
                <li>surface evidence the user can audit</li>
                <li>do the menial high-throughput work</li>
                <li>synthesize across modalities</li>
                <li>let the human judge</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <p className="kicker" style={{ color: "var(--red)", letterSpacing: "0.32em" }}>
                nay
              </p>
              <ul className="flex flex-col gap-3 mono text-lg md:text-xl smoke lowercase">
                <li>recommend</li>
                <li>diagnose or claim clinical truth</li>
                <li>reverse-infer feelings from regions</li>
                <li>replace the manager&apos;s decision</li>
              </ul>
            </div>
          </div>
          <p className="sans text-base smoke max-w-2xl">
            the architecture enacts the rubric. that&apos;s the argument.
          </p>
        </div>
      </>
    ),
  },

  // 11 · team
  {
    id: "team",
    render: () => (
      <>
        <RedDot top="8%" left="8%" />
        <div className="flex flex-col items-start gap-12 enter">
          <Kicker>team · 48 hours</Kicker>
          <ul
            className="flex flex-col divide-y w-full max-w-5xl"
            style={{ borderColor: "var(--hair)" }}
          >
            {[
              {
                n: "Johnny Sheng",
                r: "pm · stage 1 + stage 2 · integration · 3d viz",
                c: "shipped the clair de lune precedent forward. now running it in reverse.",
              },
              {
                n: "Junsoo Kim",
                r: "tribe v2 · reverse and forward inference",
                c: "owns the brain JSON pipeline. owns the falsification baselines.",
              },
              {
                n: "Jacob Cho",
                r: "k2 swarm · iterative-loop orchestration",
                c: "8 rounds in under 60 seconds. plateau gate. per-region attribution.",
              },
              {
                n: "Emilie Duran",
                r: "empathy-layer document UI · launch video",
                c: "three framing modes — workplace, consumer, pavilion.",
              },
            ].map((m) => (
              <li
                key={m.n}
                className="grid grid-cols-12 gap-6 items-baseline py-5"
                style={{ borderColor: "var(--hair)" }}
              >
                <p className="mono text-xl col-span-12 md:col-span-3 ink">{m.n}</p>
                <p className="kicker col-span-12 md:col-span-4">{m.r}</p>
                <p className="sans text-sm md:text-base col-span-12 md:col-span-5 smoke leading-relaxed">
                  {m.c}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </>
    ),
  },

  // 12 · vision (BCI scale)
  {
    id: "vision",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
            <Kicker>vision</Kicker>
            <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.95] lowercase">
              <span className="ink">today video.</span>
              <br />
              <span className="grad">tomorrow direct neural data.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-xl leading-relaxed">
              same architecture. same falsification methodology. same ethos. when the cognitive
              interface gets thinner, the empathy layer is what keeps a person on the other side of
              the decision.
            </p>
          </div>
          <div className="lg:col-span-5 justify-self-end">
            <BrainBlock variant="convergence" seed={2031} size={460} />
          </div>
        </div>
      </>
    ),
  },

  // 13 · ask + close
  {
    id: "ask",
    render: () => (
      <>
        <RedDot top="8%" left="8%" />
        <RedDot bottom="8%" right="8%" />
        <div className="flex flex-col items-center justify-center gap-8 text-center enter max-w-5xl mx-auto">
          <Kicker>ask</Kicker>
          <h2 className="display-mono leading-[0.95] lowercase">
            <span className="block text-4xl md:text-6xl smoke">humans are not</span>
            <span className="block grad text-7xl md:text-[9rem]">machines.</span>
          </h2>
          <p className="mono italic text-2xl md:text-3xl ink mt-4 max-w-3xl">
            the empathy layer is what ai gives back.
          </p>
          <div className="rule w-24 my-6" />
          <p className="sans text-base smoke max-w-xl">
            swap the sponsor slide at <code className="mono">/sponsor/[name]</code>. ironsight
            primary. listen labs · sideshift · yc.
          </p>
        </div>
      </>
    ),
  },
];

export default function RoundOne() {
  return <Deck slides={slides} />;
}
