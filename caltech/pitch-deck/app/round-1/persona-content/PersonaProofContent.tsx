"use client";

// Persona-aware proof slide body. Each persona gets the proof example
// most relevant to their hire of the engine:
//   best-of-ai → design / taste (cosine match against a reference video)
//   ironsight  → construction (cortical layer adds threat-detection signal)
//   listen-labs → consumer (default-mode convergence visible in the feed)
//
// The slide's right-side BrainBlock is rendered by 09-proof.tsx and stays
// constant across personas; this component only swaps the left-column copy.

import { usePersona } from "../../components/Deck";
import { Kicker } from "../../components/SlideKit";

export default function PersonaProofContent() {
  const { persona } = usePersona();

  if (persona === "ironsight") {
    return (
      <div className="lg:col-span-7 flex flex-col gap-7 max-w-xl">
        <Kicker>proof · construction · spatial intel</Kicker>
        <h2 className="display-mono text-5xl md:text-[6rem] leading-[0.92] lowercase">
          <span className="ink">camera saw motion.</span>
          <br />
          <span className="grad">brain saw threat.</span>
        </h2>
        <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
          vision alone said{" "}
          <span className="mono ink">
            &quot;worker walked across platform, paused, continued.&quot;
          </span>{" "}
          with the cortical layer: threat-detection peaked 40 minutes straight.
        </p>
        <p className="sans text-sm smoke max-w-md leading-relaxed">
          falsification here = same paragraph against a different worker&apos;s
          footage scores low. the reading belongs to <em>this</em> site, not to
          construction in general. that&apos;s the spatial-intel claim Ironsight
          asked for — backed by a cosine number, not a vibe.
        </p>
      </div>
    );
  }

  if (persona === "listen-labs") {
    return (
      <div className="lg:col-span-7 flex flex-col gap-7 max-w-xl">
        <Kicker>proof · the algorithm un-blackboxed</Kicker>
        <h2 className="display-mono text-5xl md:text-[6rem] leading-[0.92] lowercase">
          <span className="ink">five reels in.</span>
          <br />
          <span className="grad">your taste flatlines.</span>
        </h2>
        <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
          by reel three the default-mode network — the part of you that&apos;s
          just <em>you</em> — converges with 10,000 other 18-year-olds.
        </p>
        <p className="mono italic text-base ink">
          you can finally see the loop you&apos;ve been inside.
        </p>
      </div>
    );
  }

  // best-of-ai (default · ai interaction · creativity-emphasis · not sexy)
  return (
    <div className="lg:col-span-7 flex flex-col gap-7 max-w-xl">
      <Kicker>proof · design · taste persists beyond ai</Kicker>
      <h2 className="display-mono text-5xl md:text-[6rem] leading-[0.92] lowercase">
        <span className="ink">autumn leaves</span>{" "}
        <span className="grad">vs. your design.</span>
      </h2>
      <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
        feed amy a reference (autumn leaves, smooth, the feeling you&apos;re
        chasing). feed it your draft. the cosine between brain patterns tells
        you if it lands — before any human sees it.
      </p>
      <p className="mono italic text-base ink">
        feeling, made measurable.
      </p>
    </div>
  );
}
