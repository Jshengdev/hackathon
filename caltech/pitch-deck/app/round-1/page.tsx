"use client";

// CALTECH HACKTECH 2026 — ROUND 1 DECK · 5-min · 13 slides · V3 NEXT-LEVEL
//
// Source-of-truth (loaded 2026-04-25 evening):
//   caltech/pitch-story-v3-next-level.md   §3 (Round 1 arc) + §2 (1:30 master cut)
//   caltech/pitch-story-v3-next-level.md   §7 kill-line glossary (verbatim)
//
// Master scenario: Sarah / Lisa healthcare. Construction is the Ironside-pavilion
// variant only — NOT the Round 1 hero. Hero output = empathy-layer document.
// Hero reveal = iterative-loop score climb 0.42 → 0.84 across 8 rounds (the same
// protocol as our 90.4% Clair de Lune match — run in reverse).
//
// LOCKED lines verbatim (Johnny):
//   "Humans are not machines."
//   "The empathy layer is what AI gives back when AI augments management
//    decisions instead of replacing them."
//   "The action data was right. The decision was wrong."
//   "She did not rush. She did not check out. She held space."
//   "Anchored. Not confabulated."
//   "Manipulation only works in the dark. We turned the lights on."
//   "90.4% match against the Clair de Lune emotion-center."
//
// Forbidden-claim discipline (per v3 §10): see canonical doc for the full list.
//   ✅ canonical: ~20K vertices on fsaverage5 · ~25 subjects · 1Hz · within-subject

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
  // 01 · title — humans are not machines / ai forgot
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
          <AnchorQuote attribution="johnny, locked voiceover">
            the action data was right. the decision was wrong. the empathy layer is what closes
            that gap.
          </AnchorQuote>
        </div>
        <ScrollHint />
      </>
    ),
  },

  // 02 · hook — present-tense imminence (somewhere right now)
  {
    id: "hook",
    render: () => (
      <>
        <RedDot top="14%" left="11%" />
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
            <Kicker>recognition · the hook</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
              <span className="ink">somewhere right now,</span>
              <br />
              <span className="ink">a manager is</span>
              <br />
              <span className="grad">looking at a number.</span>
            </h2>
            <AnchorQuote attribution="johnny, locked">
              somewhere right now, a manager is looking at a number. thirty minutes. over
              threshold. and they&apos;re about to send a message.
            </AnchorQuote>
            <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
              they don&apos;t know what happened in that room. they&apos;re about to send a
              message. the bad decision is happening while you watch.
            </p>
          </div>
          <div className="lg:col-span-5 justify-self-end">
            <div
              className="surface-card-feature flex flex-col gap-3"
              style={{ padding: "28px 32px", minWidth: 360 }}
            >
              <p className="kicker" style={{ color: "var(--accent)" }}>
                productivity dashboard · live
              </p>
              <p className="mono text-sm smoke">action: held hand</p>
              <p className="mono text-sm smoke">duration: 1,800s</p>
              <p
                className="mono text-base"
                style={{ color: "var(--red)", letterSpacing: "0.08em" }}
              >
                flag: OVER_THRESHOLD
              </p>
              <div className="rule" />
              <p className="kicker">manager · about to type</p>
            </div>
          </div>
        </div>
      </>
    ),
  },

  // 03 · stakes — three industries, three cold pixel-only AI outputs
  {
    id: "stakes",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-12 enter">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Kicker>indignation · the stakes</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
              <span className="ink">three industries.</span>{" "}
              <span className="grad">same gap.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {[
              {
                k: "healthcare",
                v: "nurse spent 30 min in patient room. exceeded 18 min benchmark. flag.",
              },
              {
                k: "construction",
                v: "worker logged 8 min near-edge. cut to 10.",
              },
              {
                k: "consumer",
                v: "user spent 2.5h scrolling. recommendation: serve longer videos.",
              },
            ].map((c) => (
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
            ai describes what humans did. it cannot model the cognitive-emotional state
            underneath the action. managers read these reports and cut the corners that
            destroy what their company actually wants.
          </p>
          <p className="display-mono text-3xl md:text-5xl ink lowercase">
            humans are not machines.
          </p>
        </div>
      </>
    ),
  },

  // 04 · thesis — action data right, decision wrong
  {
    id: "thesis",
    render: () => (
      <>
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>curiosity · the thesis</Kicker>
          <h2 className="display-mono leading-[1.0] lowercase">
            <span className="block text-3xl md:text-5xl smoke">the action data was right.</span>
            <span className="block ink text-5xl md:text-[6.5rem]">the decision was wrong.</span>
            <span className="block text-3xl md:text-5xl mt-2 grad">
              the empathy layer is what closes that gap.
            </span>
          </h2>
          <p className="sans text-base md:text-lg smoke max-w-2xl leading-relaxed">
            we built the empathy layer. one engine. video of a human taking actions in,
            paragraph out. brain-grounded, falsifiable, never recommends behavior. the
            paragraph surfaces what action data alone was missing. the manager judges.
          </p>
          <AnchorQuote attribution="johnny, locked headline">
            the empathy layer is what ai gives back when ai augments management decisions
            instead of replacing them.
          </AnchorQuote>
        </div>
      </>
    ),
  },

  // 05 · the engine — overview architecture
  {
    id: "architecture",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-12 enter">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Kicker>awe · the engine</Kicker>
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
                t: "qwen3-vl",
                m: "vision · no emotion claims",
                b: "describes the scene observationally — what happened, who moved where, how long.",
              },
              {
                n: "02",
                t: "tribe v2 · prerendered",
                m: "~20K vertices · 1Hz",
                b: "meta&apos;s brain-encoding model. predicts per-second neural response from the same video. activity.json is the data layer.",
              },
              {
                n: "03",
                t: "k2 swarm · 7 specialists",
                m: "yeo7 networks · parallel",
                b: "one specialist per cortical network. each reads its region&apos;s activation pattern. cross-region hover-bridges between rounds.",
              },
              {
                n: "04",
                t: "k2 moderator",
                m: "synthesis",
                b: "combines vision + brain-region readings into one candidate paragraph. observational, not diagnostic.",
              },
              {
                n: "05",
                t: "k2 swarm AS evaluator",
                m: "8 rounds · score climbs",
                b: "the same swarm comes back. each region rates how faithfully the paragraph captured what it was doing. plateau or 8 rounds.",
              },
              {
                n: "06",
                t: "embedding-proxy falsification",
                m: "main vs. control delta",
                b: "score the winning paragraph against a control clip. drop proves it&apos;s anchored. methodology that produced our 90.4% clair de lune match.",
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
          <p className="mono italic text-base md:text-lg smoke max-w-3xl">
            action data tells you what they did. the empathy layer tells you what it took.
          </p>
        </div>
      </>
    ),
  },

  // 06 · stage 1B detail — k2 swarm reads the 7 yeo7 networks
  {
    id: "swarm-detail",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-6 flex flex-col gap-8 max-w-xl">
            <Kicker>the engine · stage 1B</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[0.95] lowercase">
              <span className="ink">seven networks.</span>
              <br />
              <span className="grad">seven specialists.</span>
              <br />
              <span className="ink">in parallel.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke leading-relaxed">
              the k2 swarm reads the 7 yeo networks — visual, somatomotor, dorsal-attention,
              ventral-attention (salience), limbic (emotional-processing), frontoparietal
              (prefrontal control), default-mode. hover-bridges connect specialists across
              rounds. each region answers its own question.
            </p>
            <p className="sans text-sm smoke max-w-md leading-relaxed">
              what was the prefrontal cortex contributing? what was the emotional-processing
              center doing? what the action data missed — the brain pattern captures.
            </p>
          </div>
          <div className="lg:col-span-6 justify-self-end">
            <BrainBlock variant="vision-vs-brain" seed={37} size={500} />
          </div>
        </div>
      </>
    ),
  },

  // 07 · hero reveal — score climbs 0.42 → 0.84 (the 4-second silence)
  {
    id: "score-climb",
    render: () => (
      <>
        <RedDot top="14%" left="11%" />
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-6 flex flex-col gap-8 max-w-xl">
            <Kicker>surprise · the hero reveal</Kicker>
            <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.92] lowercase">
              <span className="ink">eight rounds.</span>
              <br />
              <span className="grad">the score climbs.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
              each round, claude writes a new paragraph describing what the nurse felt.
              tribe v2 scores it against the actual brain pattern from the footage. round
              one — generic, low score. round by round, the paragraph rewrites itself
              toward the brain pattern.
            </p>
            <p className="mono italic text-base md:text-lg smoke">
              0.42 → 0.58 → 0.65 → 0.71 → 0.78 → 0.82 → <span className="accent">0.84</span>
            </p>
            <p className="kicker" style={{ color: "var(--red)" }}>
              production note · 4 seconds of silence here · let the engine improve on screen
            </p>
          </div>
          <div className="lg:col-span-6 justify-self-end">
            <BrainBlock variant="score-climb" seed={84} size={500} />
          </div>
        </div>
      </>
    ),
  },

  // 08 · proof — clair de lune precedent (same protocol, run in reverse)
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
              90.4% match against the clair de lune emotion-center. same iterative-scoring
              loop. ran forward last spring: 60s of clair de lune in, text out, match across
              ~20K vertices. eight rounds. falsified against triumphant music, rain, and
              aggressive speech.
            </p>
            <AnchorQuote attribution="johnny, locked">
              we run the same protocol in reverse. the methodology already shipped.
            </AnchorQuote>
          </div>
          <div className="lg:col-span-5 justify-self-end">
            <BrainBlock variant="activation-pulse" seed={904} size={460} highlight="emotion" />
          </div>
        </div>
      </>
    ),
  },

  // 09 · hero output — the empathy paragraph (Sarah / Lisa, full 4-phase)
  {
    id: "hero-output",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-5 flex flex-col gap-8 max-w-md">
            <Kicker>pride + comfort · the hero output</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[0.95] lowercase">
              <span className="ink">she did not</span>
              <br />
              <span className="ink">rush.</span>
              <br />
              <span className="grad">she held space.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke leading-relaxed">
              the manager&apos;s dashboard flagged sarah&apos;s 30-min visit as
              over-threshold. cut to ten minutes. the empathy-layer document showed
              otherwise.
            </p>
            <p className="mono italic text-base smoke">anchored. not confabulated.</p>
          </div>
          <div className="lg:col-span-7 justify-self-end">
            <EmpathyDocument
              scenarioLabel="healthcare · oncology clinic · sarah · 30-min patient visit"
              visionReport="nurse entered room. sat 30 min. adjusted IV. held patient&apos;s hand. left. duration over threshold; flag = OVER_THRESHOLD."
              empathyParagraph={
                <>
                  she entered the room and her vital-attention signature shifted immediately
                  — the prefrontal sharpness of triage softened into something quieter, more
                  accommodating. for the first twelve minutes her emotional-processing
                  specialist sustained engagement; she was reading the patient&apos;s grief,
                  not just monitoring it. then a long stretch of default-mode dominance —
                  minutes 18 through 22 — the brain-signature of being present with someone,
                  not waiting for them to finish. the final eight minutes returned to focused
                  care, prefrontal-engaged, holding the patient&apos;s hand.{" "}
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

  // 10 · falsification rigor — same nurse, two scenes (methodology travels)
  {
    id: "falsification",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-12 enter">
          <Kicker>falsification rigor · the methodology travels</Kicker>
          <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase max-w-4xl">
            <span className="ink">same nurse.</span>{" "}
            <span className="grad">two scenes.</span>{" "}
            <span className="ink">within-subject contrast.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
            <div
              className="surface-card-feature flex flex-col gap-3"
              style={{ padding: "24px 28px" }}
            >
              <p className="kicker" style={{ color: "var(--accent)" }}>
                main · sarah on the dying patient
              </p>
              <p className="mono text-sm smoke leading-relaxed">
                paragraph generated from the brain pattern of this scene. score against this
                scene&apos;s pattern.
              </p>
              <p className="numeral text-4xl ink">0.86</p>
              <p className="kicker">similarity · anchored</p>
            </div>
            <div
              className="surface-card flex flex-col gap-3"
              style={{ padding: "24px 28px" }}
            >
              <p className="kicker" style={{ color: "var(--warm-charcoal)" }}>
                control · lisa on routine vitals
              </p>
              <p className="mono text-sm smoke leading-relaxed">
                same paragraph. scored against a different visit&apos;s brain pattern. drop
                proves the paragraph belongs to sarah&apos;s scene, not boilerplate.
              </p>
              <p className="numeral text-4xl" style={{ color: "var(--accent)" }}>
                0.27
              </p>
              <p className="kicker">falsification delta</p>
            </div>
          </div>
          <p className="sans text-base md:text-lg smoke max-w-3xl leading-relaxed">
            same falsification protocol that produced our 90.4% clair de lune match. forward
            then. reverse now. within-subject only — no population-norm comparisons.
            the methodology travels.
          </p>
        </div>
      </>
    ),
  },

  // 11 · two scenarios — same engine, different beneficiaries
  {
    id: "two-scenarios",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-12 enter">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Kicker>conviction · two scenarios · one engine</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
              <span className="ink">swap the input.</span>{" "}
              <span className="grad">the engine doesn&apos;t fork.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
            <div className="flex flex-col gap-4">
              <p className="kicker" style={{ color: "var(--accent)", letterSpacing: "0.32em" }}>
                a · workplace · ironside
              </p>
              <p className="display-mono text-2xl md:text-3xl ink lowercase">
                manager reads the empathy paragraph before deciding to cut lisa&apos;s time.
              </p>
              <p className="sans text-sm smoke leading-relaxed">
                action data + brain context → empathy-aware decision. the corner-cut
                doesn&apos;t happen.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="kicker" style={{ color: "var(--warm-charcoal)", letterSpacing: "0.32em" }}>
                b · consumer · listen labs / sideshift / yc
              </p>
              <p className="display-mono text-2xl md:text-3xl ink lowercase">
                maya reads her own day back. her vault. her judgment.
              </p>
              <p className="sans text-sm smoke leading-relaxed">
                brainrot in real time + the algorithm broken open in argument. the user
                immunizes herself.
              </p>
            </div>
          </div>
          <p className="display-mono text-3xl md:text-5xl ink lowercase max-w-4xl">
            same engine. different input. different beneficiaries.
          </p>
          <p className="mono italic text-base md:text-lg smoke max-w-3xl">
            manipulation only works in the dark. we turned the lights on.
          </p>
        </div>
      </>
    ),
  },

  // 12 · pavilion coverage / sponsor map (preserve routing)
  {
    id: "pavilion-map",
    render: () => (
      <>
        <RedDot top="8%" left="8%" />
        <div className="flex flex-col items-start gap-12 enter">
          <Kicker>pavilion coverage · pre-rendered swap-slides</Kicker>
          <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase max-w-4xl">
            <span className="ink">same 1:30 master cut.</span>{" "}
            <span className="grad">different close per pavilion.</span>
          </h2>
          <ul
            className="flex flex-col divide-y w-full max-w-5xl"
            style={{ borderColor: "var(--hair)" }}
          >
            {[
              {
                k: "ironside · primary $5K",
                href: "/sponsor/ironside",
                v: "spatial intelligence · new modality mapped back to the video. the corner-cut doesn&apos;t happen.",
              },
              {
                k: "listen labs · $3K + interview",
                href: "/sponsor/listenlabs",
                v: "simulate humans, then prove it. the iterative loop IS the simulation. brain-grounding is the insight.",
              },
              {
                k: "sideshift · b2c overlay",
                href: "/sponsor/sideshift",
                v: "user owns the data. user owns the result. brain card export is the share surface. know what knows you.",
              },
              {
                k: "yc · stretch",
                href: "/sponsor/yc",
                v: "today video. tomorrow direct neural data. design pattern for human-ai partnership before the interface goes invisible.",
              },
            ].map((row) => (
              <li
                key={row.k}
                className="grid grid-cols-12 gap-6 items-baseline py-5"
                style={{ borderColor: "var(--hair)" }}
              >
                <p
                  className="kicker col-span-12 md:col-span-3"
                  style={{ color: "var(--accent)" }}
                >
                  {row.k}
                </p>
                <p
                  className="sans text-sm md:text-base col-span-12 md:col-span-7 smoke leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: row.v }}
                />
                <a
                  href={row.href}
                  className="mono text-sm col-span-12 md:col-span-2 ink lowercase"
                  style={{ textDecoration: "underline" }}
                >
                  {row.href}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </>
    ),
  },

  // 13 · title-card close — three lines, large, centered
  {
    id: "close",
    render: () => (
      <>
        <RedDot top="8%" left="8%" />
        <RedDot bottom="8%" right="8%" />
        <div className="flex flex-col items-center justify-center gap-10 text-center enter max-w-5xl mx-auto">
          <h2 className="display-mono leading-[0.95] lowercase">
            <span className="block ink text-5xl md:text-[7rem]">
              humans are not machines.
            </span>
          </h2>
          <h2 className="display-mono leading-[0.95] lowercase">
            <span className="block grad text-4xl md:text-[5rem]">
              the empathy layer is what ai gives back.
            </span>
          </h2>
          <div className="rule w-24 my-2" />
          <p className="kicker" style={{ letterSpacing: "0.32em" }}>
            caltech hacktech 2026
          </p>
        </div>
      </>
    ),
  },
];

export default function RoundOne() {
  return <Deck slides={slides} />;
}
