"use client";

// CALTECH HACKTECH 2026 — ROUND 2 DECK · 3-min · 8 slides
//
// Compressed YC pitch order, beat-synced to caltech/narration-script-3min.md.
// Plain language. Specific numbers. Voice anchors verbatim from Johnny's corpus.

import Deck, { type Slide } from "../components/Deck";
import RedDot from "../components/RedDot";
import ScrollHint from "../components/ScrollHint";
import { Kicker, BrainBlock, AnchorQuote } from "../components/SlideKit";

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

  // 02 · problem + why now (0:08–0:35)
  {
    id: "problem-now",
    render: () => (
      <>
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>0:08–0:35 · problem · why now</Kicker>
          <h2 className="display-mono text-5xl md:text-[7.5rem] leading-[0.95] lowercase">
            <span className="ink">today reels.</span>
            <br />
            <span className="grad">in five years brain chips.</span>
          </h2>
          <p className="sans text-base md:text-lg smoke max-w-xl">
            teens born after 2008 have never seen the internet without a recommender on top. the same
            companies are building neural interfaces. the playbook will repeat unless someone writes a
            different one. tribe v2 weights shipped in 2025. the tools to do it exist now.
          </p>
        </div>
      </>
    ),
  },

  // 03 · solution (0:35–0:55)
  {
    id: "solution",
    render: () => (
      <>
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>0:35–0:55 · solution</Kicker>
          <h2 className="display-mono leading-[0.98] lowercase">
            <span className="block text-3xl md:text-5xl smoke">use ai. see what it&apos;s</span>
            <span className="block grad text-6xl md:text-[8.5rem]">doing to you.</span>
            <span className="block text-3xl md:text-5xl mt-4 smoke">choose what comes next.</span>
          </h2>
          <p className="sans text-base md:text-lg smoke max-w-xl">
            the platforms read your brain to sell you ads. we read your brain to show you what they&apos;re
            doing to it.
          </p>
        </div>
      </>
    ),
  },

  // 04 · demo (0:55–2:35)
  {
    id: "demo",
    render: () => (
      <>
        <div className="flex flex-col gap-8 enter w-full">
          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <Kicker>0:55–2:35 · demo · 90s</Kicker>
            <p className="kicker" style={{ color: "var(--accent)" }}>
              live or pre-cached
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-10">
            <div
              className="lg:col-span-8 relative w-full overflow-hidden rounded-[2px]"
              style={{ aspectRatio: "16/9" }}
            >
              <video
                src="/clips/glasses-scan.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <ol className="lg:col-span-4 flex flex-col divide-y" style={{ borderColor: "var(--hair)" }}>
              {[
                { t: "0:00–0:15", b: "reels scroll. cortical mesh ignites." },
                { t: "0:15–0:45", b: "k2 swarm fans out. bridges visible on hover." },
                { t: "0:45–1:15", b: "feed-shaped vs baseline brain. side by side." },
                { t: "1:15–1:30", b: "wrapped collapses into the land card." },
              ].map((s, i) => (
                <li
                  key={s.t}
                  className="grid grid-cols-12 gap-3 items-baseline py-4"
                  style={{ borderColor: "var(--hair)" }}
                >
                  <span className="kicker col-span-2 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="kicker col-span-10 md:col-span-4">{s.t}</p>
                  <p className="sans text-sm smoke col-span-12 md:col-span-6 leading-snug">{s.b}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </>
    ),
  },

  // 05 · land card (2:15–2:35)
  {
    id: "land-card",
    render: () => (
      <>
        <RedDot top="14%" left="11%" />
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
          <div className="lg:col-span-7 flex flex-col gap-8 max-w-xl">
            <Kicker>2:15–2:35 · land card</Kicker>
            <h2 className="display-mono text-5xl md:text-[7rem] leading-[0.92] lowercase">
              <span className="ink">your brain.</span>
              <br />
              <span className="grad">your data. your choice.</span>
            </h2>
            <p className="mono italic text-xl md:text-2xl smoke leading-snug max-w-md">
              not recommendations. ingredients.
            </p>
          </div>
          <div className="lg:col-span-5 justify-self-end">
            <BrainBlock variant="divergence" seed={42} size={460} />
          </div>
        </div>
      </>
    ),
  },

  // 06 · proof + best use of AI (2:35–2:48)
  {
    id: "proof",
    render: () => (
      <>
        <div className="flex flex-col items-start gap-10 enter">
          <Kicker>2:35–2:48 · best use of ai · proof shipped</Kicker>
          <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-12 w-full">
            <div className="lg:col-span-7">
              <p className="numeral ink text-[7rem] md:text-[12rem] leading-[0.9]">
                90.4<span className="text-[4rem] md:text-[6rem] align-top accent">%</span>
              </p>
              <p className="sans text-base md:text-lg smoke max-w-md mt-4">
                60s of clair de lune in. emotion-region brain pattern out. eight rounds. shipped 2026-03.
              </p>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <p className="kicker" style={{ color: "var(--accent)" }}>
                  yea
                </p>
                <ul className="flex flex-col gap-1.5 mono text-sm ink lowercase">
                  <li>show what you can&apos;t see</li>
                  <li>surface options</li>
                  <li>boring high-volume work</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <p className="kicker" style={{ color: "var(--red)" }}>
                  nay
                </p>
                <ul className="flex flex-col gap-1.5 mono text-sm smoke lowercase">
                  <li>recommend</li>
                  <li>extract without consent</li>
                  <li>replace judgment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    ),
  },

  // 07 · sponsor swap (2:48–2:55)
  {
    id: "sponsor-slot",
    render: () => (
      <>
        <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
          <Kicker>2:48–2:55 · sponsor swap</Kicker>
          <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase max-w-3xl ink">
            swap me with the sponsor in the room.
          </h2>
          <ul
            className="flex flex-col divide-y w-full max-w-2xl"
            style={{ borderColor: "var(--hair)" }}
          >
            {[
              { k: "listen labs", href: "/sponsor/listenlabs" },
              { k: "sideshift", href: "/sponsor/sideshift" },
              { k: "y combinator", href: "/sponsor/yc" },
              { k: "ironside", href: "/sponsor/ironside" },
            ].map((s) => (
              <li
                key={s.k}
                className="grid grid-cols-12 gap-4 items-baseline py-4"
                style={{ borderColor: "var(--hair)" }}
              >
                <a href={s.href} className="contents group">
                  <span
                    className="kicker col-span-3 md:col-span-2"
                    style={{ color: "var(--accent)" }}
                  >
                    open →
                  </span>
                  <span className="mono text-xl ink col-span-9 md:col-span-10 lowercase group-hover:text-[var(--accent)] transition-colors">
                    {s.k}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </>
    ),
  },

  // 08 · close (2:55–3:00)
  {
    id: "close",
    render: () => (
      <>
        <RedDot top="8%" left="8%" />
        <RedDot bottom="8%" right="8%" />
        <div className="flex flex-col items-center justify-center gap-8 text-center enter max-w-5xl mx-auto">
          <Kicker>2:55–3:00</Kicker>
          <h2 className="display-mono leading-[0.95] lowercase">
            <span className="block text-4xl md:text-6xl smoke">manipulation only works</span>
            <span className="block grad text-7xl md:text-[9rem]">in the dark.</span>
          </h2>
          <p className="mono italic text-2xl md:text-3xl ink mt-4">
            we just turned the lights on.
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
