"use client";

// SLIDE 06 — ARCHITECTURE content. Top-down 6-step pipeline.
// Universal across personas. Verbatim from yappage Msg 10.

import { Kicker } from "../../components/SlideKit";

const STEPS = [
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
    b: "score the winning paragraph against a control clip. drop proves it&apos;s anchored. cosine distance doesn&apos;t lie.",
  },
];

export default function ArchitectureContent() {
  return (
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
        {STEPS.map((s) => (
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
        action data tells you what they did. the empathy layer tells you what
        it took.
      </p>
    </div>
  );
}
