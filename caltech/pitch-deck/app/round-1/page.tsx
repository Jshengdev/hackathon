"use client";

// CALTECH HACKTECH 2026 — ROUND 1 DECK · 5-min · 12 slides
//
// YC pitch-deck order: company → problem → why now → solution → how it works →
// demo → proof → market → best-use-of-ai → team → vision → ask.
// Voice anchors lifted verbatim from Johnny's published corpus.
// [TBD-FINAL-PASS] tracking lives in presenter-notes.md.

import Deck, { type Slide } from "../components/Deck";
import RedDot from "../components/RedDot";
import ScrollHint from "../components/ScrollHint";
import { Kicker, BrainBlock, AnchorQuote } from "../components/SlideKit";

const slides: Slide[] = [
  // 01 · company (title)
  {
    id: "title",
    render: () => (
      <>
        <RedDot top="7%" left="7%" />
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>caltech hacktech 2026 · best use of ai</Kicker>
          <h1 className="display-mono ink text-[3.5rem] md:text-[6rem] leading-[0.92] lowercase">
            you can&apos;t see how the algorithm shapes your thinking.
            <br />
            <span className="grad">we made it visible.</span>
          </h1>
          <AnchorQuote attribution="17-year-old, gen-z corpus">
            i&apos;ve tried to think for myself, but every time i do, the algorithm pulls me back.
          </AnchorQuote>
        </div>
        <ScrollHint />
      </>
    ),
  },

  // 02 · problem
  {
    id: "problem",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
            <Kicker>problem</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
              <span className="ink">the genitive</span>
              <br />
              <span className="grad">is a lie.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
              your spotify is a recommendation algorithm. your youtube is a recommendation algorithm.
              your reels — you can&apos;t pick any of that. teens born after 2008 have never seen the
              internet without one running.
            </p>
          </div>
          <div className="lg:col-span-5 justify-self-end">
            <BrainBlock variant="feed-grid" seed={11} size={440} />
          </div>
        </div>
      </>
    ),
  },

  // 03 · why now
  {
    id: "why-now",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-12 enter">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Kicker>why now</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
              <span className="ink">the tools to do this</span>
              <br />
              <span className="grad">shipped this year.</span>
            </h2>
          </div>
          <ol className="flex flex-col divide-y w-full max-w-5xl" style={{ borderColor: "var(--hair)" }}>
            {[
              {
                n: "01",
                t: "tribe v2",
                b: "meta released the brain-encoding weights in 2025. cc by-nc 4.0. open for hackathon use.",
              },
              {
                n: "02",
                t: "k2 on cerebras",
                b: "1,300 tokens per second. fast enough to run a swarm of specialists per brain region in real time.",
              },
              {
                n: "03",
                t: "the 2008 cohort",
                b: "they hit 18 this year. they have never seen the internet without a recommender on top.",
              },
              {
                n: "04",
                t: "bci is next",
                b: "the same companies are building neural interfaces. the playbook will repeat unless someone writes a different one.",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="grid grid-cols-12 gap-6 items-baseline py-5"
                style={{ borderColor: "var(--hair)" }}
              >
                <span className="kicker col-span-1 tabular-nums">{s.n}</span>
                <p
                  className="mono text-xl col-span-11 md:col-span-3 lowercase"
                  style={{ color: "var(--accent)" }}
                >
                  {s.t}
                </p>
                <p className="sans text-sm md:text-base col-span-12 md:col-span-8 smoke leading-relaxed">
                  {s.b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </>
    ),
  },

  // 04 · solution
  {
    id: "solution",
    render: () => (
      <>
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>solution</Kicker>
          <h2 className="display-mono leading-[0.98] lowercase">
            <span className="block text-3xl md:text-5xl smoke">use ai. see what it&apos;s</span>
            <span className="block grad text-6xl md:text-[8.5rem]">doing to you.</span>
            <span className="block text-3xl md:text-5xl mt-4 smoke">choose what comes next.</span>
          </h2>
          <p className="sans text-base md:text-lg smoke max-w-xl">
            the platforms read your brain to sell you ads. we read your brain to show you what they&apos;re
            doing to it. you keep the choice.
          </p>
        </div>
      </>
    ),
  },

  // 05 · how it works
  {
    id: "architecture",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-12 enter">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Kicker>how it works</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
              <span className="ink">four layers.</span>{" "}
              <span className="grad">your brain in.</span>
            </h2>
          </div>
          <ol className="flex flex-col divide-y w-full max-w-5xl" style={{ borderColor: "var(--hair)" }}>
            {[
              {
                n: "01",
                t: "tribe v2",
                m: "20,484 vertices · 1Hz",
                b: "predicts cortical activation from the content you scroll.",
              },
              {
                n: "02",
                t: "k2 swarm",
                m: "1,300 tok/s",
                b: "one specialist per brain region. they read the activations and write what each region is responding to.",
              },
              {
                n: "03",
                t: "claude opus",
                m: "synthesis",
                b: "stitches the per-region notes into something a person can read.",
              },
              {
                n: "04",
                t: "3d viz",
                m: "fsaverage5 mesh",
                b: "you see your brain. you decide what comes next.",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="grid grid-cols-12 gap-6 items-baseline py-5"
                style={{ borderColor: "var(--hair)" }}
              >
                <span className="kicker col-span-1 tabular-nums">{s.n}</span>
                <p
                  className="mono text-xl col-span-11 md:col-span-3 lowercase"
                  style={{ color: "var(--accent)" }}
                >
                  {s.t}
                </p>
                <p className="kicker col-span-12 md:col-span-3">{s.m}</p>
                <p className="sans text-sm md:text-base col-span-12 md:col-span-5 smoke leading-relaxed">
                  {s.b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </>
    ),
  },

  // 06 · demo · the land card (hero gesture)
  {
    id: "land-card",
    render: () => (
      <>
        <RedDot top="14%" left="11%" />
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-6 flex flex-col gap-8 max-w-xl">
            <Kicker>demo · the land card</Kicker>
            <h2 className="display-mono text-5xl md:text-[7rem] leading-[0.92] lowercase">
              <span className="ink">pick a region</span>
              <br />
              <span className="grad">you didn&apos;t use.</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
              the system shows what kinds of content would activate it. essays. poetry. language games.
              not specific links.
            </p>
            <p className="mono italic text-xl md:text-2xl smoke">
              not recommendations. ingredients.
            </p>
          </div>
          <div className="lg:col-span-6 justify-self-end">
            <BrainBlock variant="divergence" seed={42} size={500} />
          </div>
        </div>
      </>
    ),
  },

  // 07 · proof · clair de lune
  {
    id: "proof",
    render: () => (
      <>
        <RedDot top="12%" left="12%" />
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-7 flex flex-col gap-8 max-w-xl">
            <Kicker>proof · shipped 2026-03 · public</Kicker>
            <h2 className="numeral ink text-[7rem] md:text-[12rem] leading-[0.9]">
              90.4<span className="text-[4rem] md:text-[6rem] align-top accent">%</span>
            </h2>
            <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
              we fed 60 seconds of clair de lune into tribe v2. asked claude to write text that would
              produce the same brain pattern. eight rounds of iteration. 90.4% match in the emotion
              region. we tested against rain and aggressive speech to make sure it wasn&apos;t just
              hitting emotion in general.
            </p>
            <AnchorQuote attribution="johnny, public post 2026-03">
              if the song disappears and the feeling remains, what was the music?
            </AnchorQuote>
          </div>
          <div className="lg:col-span-5 justify-self-end">
            <BrainBlock variant="activation-pulse" seed={904} size={460} highlight="emotion" />
          </div>
        </div>
      </>
    ),
  },

  // 08 · market
  {
    id: "market",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-12 enter">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Kicker>market</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
              <span className="ink">start with the kids.</span>
              <br />
              <span className="grad">end with the brain interface.</span>
            </h2>
          </div>
          <ol className="flex flex-col divide-y w-full max-w-5xl" style={{ borderColor: "var(--hair)" }}>
            {[
              {
                n: "now",
                t: "gen-z 2008–2010",
                b: "consumer surface. a shareable brain card people send to their friends.",
              },
              {
                n: "next",
                t: "creators and platforms",
                b: "an ingredients-list api creators embed under their feed.",
              },
              {
                n: "then",
                t: "post-bci cognitive infra",
                b: "your knowledge graph is your brain&apos;s response shape. local first.",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="grid grid-cols-12 gap-6 items-baseline py-5"
                style={{ borderColor: "var(--hair)" }}
              >
                <span className="kicker col-span-2 tabular-nums">{s.n}</span>
                <p
                  className="mono text-xl col-span-12 md:col-span-4 lowercase"
                  style={{ color: "var(--accent)" }}
                >
                  {s.t}
                </p>
                <p
                  className="sans text-sm md:text-base col-span-12 md:col-span-6 smoke leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: s.b }}
                />
              </li>
            ))}
          </ol>
        </div>
      </>
    ),
  },

  // 09 · best use of AI
  {
    id: "yea-nay",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-12 enter">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Kicker>best use of ai</Kicker>
            <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase">
              <span className="ink">what ai is for.</span>{" "}
              <span className="grad">what it isn&apos;t.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
            <div className="flex flex-col gap-4">
              <p className="kicker" style={{ color: "var(--accent)", letterSpacing: "0.32em" }}>
                yea
              </p>
              <ul className="flex flex-col gap-3 mono text-lg md:text-xl ink lowercase">
                <li>show you what you can&apos;t see</li>
                <li>surface options you choose between</li>
                <li>do the boring high-volume work</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <p className="kicker" style={{ color: "var(--red)", letterSpacing: "0.32em" }}>
                nay
              </p>
              <ul className="flex flex-col gap-3 mono text-lg md:text-xl smoke lowercase">
                <li>recommend</li>
                <li>extract data without consent</li>
                <li>replace your judgment</li>
                <li>pretend to be a person</li>
              </ul>
            </div>
          </div>
          <p className="sans text-base smoke max-w-2xl">
            every part of this product sits on the yea side. that&apos;s the argument.
          </p>
        </div>
      </>
    ),
  },

  // 10 · team
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
                r: "pm · 3d viz · orchestration",
                c: "shipped synthetic synesthesia. 90.4% clair de lune match.",
              },
              {
                n: "Junsoo Kim",
                r: "tribe v2 · brain encoding",
                c: "idm-lab egocentric video supervision pipeline.",
              },
              {
                n: "Jacob Cho",
                r: "k2 swarm · cross-region bridges",
                c: "specialist-per-region orchestration.",
              },
              {
                n: "Emilie Duran",
                r: "video · narration · figma",
                c: "acts 1 and 4 of the launch video.",
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

  // 11 · vision (BCI scale)
  {
    id: "vision",
    render: () => (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
            <Kicker>vision</Kicker>
            <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.95] lowercase">
              <span className="ink">today reels.</span>
              <br />
              <span className="grad">in five years brain chips.</span>
            </h2>
            <AnchorQuote attribution="johnny, public post 2026-04">
              same trade. same trap. we&apos;re building the alternative now, while you can still see it.
            </AnchorQuote>
          </div>
          <div className="lg:col-span-5 justify-self-end">
            <BrainBlock variant="convergence" seed={2031} size={460} />
          </div>
        </div>
      </>
    ),
  },

  // 12 · ask
  {
    id: "ask",
    render: () => (
      <>
        <RedDot top="8%" left="8%" />
        <RedDot bottom="8%" right="8%" />
        <div className="flex flex-col items-center justify-center gap-8 text-center enter max-w-5xl mx-auto">
          <Kicker>ask</Kicker>
          <h2 className="display-mono leading-[0.95] lowercase">
            <span className="block text-4xl md:text-6xl smoke">manipulation only works</span>
            <span className="block grad text-7xl md:text-[9rem]">in the dark.</span>
          </h2>
          <p className="mono italic text-2xl md:text-3xl ink mt-4">
            we just turned the lights on.
          </p>
          <div className="rule w-24 my-6" />
          <p className="sans text-base smoke max-w-xl">
            swap the sponsor slide at <code className="mono">/sponsor/[name]</code>.
          </p>
        </div>
      </>
    ),
  },
];

export default function RoundOne() {
  return <Deck slides={slides} />;
}
