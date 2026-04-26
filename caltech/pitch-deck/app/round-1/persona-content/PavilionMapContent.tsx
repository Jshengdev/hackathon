"use client";

// SLIDE 13 — PAVILION MAP content. Sponsor coverage · pre-rendered swap-slides.
// Universal across personas. The /sponsor/[sponsor] routes are independent
// of the persona system.

import { Kicker } from "../../components/SlideKit";

const PAVILIONS = [
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
];

export default function PavilionMapContent() {
  return (
    <div className="flex flex-col items-start gap-12 enter">
        <Kicker>pavilion coverage · pre-rendered swap-slides</Kicker>
        <h2 className="display-mono text-5xl md:text-7xl leading-[1.0] lowercase max-w-4xl">
          <span className="ink">same master cut.</span>{" "}
          <span className="grad">different close per pavilion.</span>
        </h2>
        <ul
          className="flex flex-col divide-y w-full max-w-5xl"
          style={{ borderColor: "var(--hair)" }}
        >
          {PAVILIONS.map((row) => (
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
  );
}
