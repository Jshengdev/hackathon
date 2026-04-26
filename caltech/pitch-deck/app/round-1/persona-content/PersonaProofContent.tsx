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
      <div className="lg:col-span-7 flex flex-col gap-8 max-w-xl">
        <Kicker>proof · construction · spatial intel</Kicker>
        <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.92] lowercase">
          <span className="ink">camera saw motion.</span>
          <br />
          <span className="grad">brain saw threat.</span>
        </h2>
        <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
          the vision model alone described what happened:{" "}
          <span className="mono ink">
            &quot;worker walked across platform, paused, continued.&quot;
          </span>{" "}
          with the cortical layer added, the same scene resolves differently:
          threat-detection sustained at peak for 40 minutes. attention narrowed.
          memory networks lit on the second-floor edge.
        </p>
        <p className="mono italic text-base ink">
          the camera couldn&apos;t see the hazard. the brain pattern did.
        </p>
        <p className="sans text-sm smoke max-w-md leading-relaxed">
          that&apos;s spatial intelligence — not more pixels, but a new modality
          layered onto the camera. the worker&apos;s experience becomes spatial
          data.
        </p>
      </div>
    );
  }

  if (persona === "listen-labs") {
    return (
      <div className="lg:col-span-7 flex flex-col gap-8 max-w-xl">
        <Kicker>proof · the algorithm un-blackboxed</Kicker>
        <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.92] lowercase">
          <span className="ink">five reels in.</span>
          <br />
          <span className="grad">your taste flatlines.</span>
        </h2>
        <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
          we fed five instagram reels through the engine. by reel three the
          default-mode network — the part of you that&apos;s just <em>you</em>{" "}
          — was firing in the same convergent pattern as ten thousand other
          18-year-olds. the algorithm steers toward a shared average; the user
          stops contributing to their own taste.
        </p>
        <p className="mono italic text-base ink">
          you can finally see the loop you&apos;ve been inside.
        </p>
        <p className="sans text-sm smoke max-w-md leading-relaxed">
          this is what &quot;simulating humanity&quot; looks like when it&apos;s
          grounded in brains, not text. neurons fire. the loop iterates. the
          divergent thought becomes available again.
        </p>
      </div>
    );
  }

  // best-of-ai (default · ai interaction · creativity-emphasis · not sexy)
  return (
    <div className="lg:col-span-7 flex flex-col gap-8 max-w-xl">
      <Kicker>proof · design · taste persists beyond ai</Kicker>
      <h2 className="display-mono text-5xl md:text-[6.5rem] leading-[0.92] lowercase">
        <span className="ink">autumn leaves</span>{" "}
        <span className="grad">vs. your design.</span>
      </h2>
      <p className="sans text-base md:text-lg smoke max-w-md leading-relaxed">
        feed the engine a reference: a video of autumn leaves, something smooth,
        something you want your design to feel like. then feed it your draft.
        the cosine similarity between the two brain patterns tells you whether
        you got the feeling across — before any human sees it. taste, made
        measurable.
      </p>
      <p className="mono italic text-base ink">
        a tool to translate a feeling into a design without losing the feeling.
      </p>
      <p className="sans text-sm smoke max-w-md leading-relaxed">
        ai stops generating-for-you and starts simulating-for-you. you keep the
        divergent thought. the engine just shows you whether your work lands the
        way you intended.
      </p>
    </div>
  );
}
