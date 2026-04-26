"use client";

// SLIDE 06 — ARCHITECTURE content. Top-down 6-step pipeline.
// Universal across personas. Verbatim from yappage Msg 10.

import { Kicker } from "../../components/SlideKit";

const STEPS = [
  {
    n: "01",
    t: "qwen3-vl",
    m: "vision baseline",
    b: "describes what the dashboard would have seen.",
  },
  {
    n: "02",
    t: "tribe v2",
    m: "~20K cortical vertices",
    b: "predicts the brain pattern that brain would produce.",
  },
  {
    n: "03",
    t: "k2 swarm · 8 specialists",
    m: "1 per cortical region · parallel",
    b: "each agent simulates its region's interpretation.",
  },
  {
    n: "04",
    t: "moderator synthesis",
    m: "1 paragraph",
    b: "combines vision + 8 readings into one observational document.",
  },
  {
    n: "05",
    t: "iterative scoring",
    m: "3 rounds · 0.71 → 0.84",
    b: "swarm rescores via cosine similarity, plateau exit.",
  },
  {
    n: "06",
    t: "falsification",
    m: "control delta",
    b: "verifies the signal is anchored to this scene.",
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
