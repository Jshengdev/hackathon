"use client";

// SLIDE 04 — THESIS content. The inversion: they use it to manipulate, we
// reversed it. Universal across personas. Verbatim from yappage Msg 09–10.

import { Kicker, AnchorQuote } from "../../components/SlideKit";

export default function ThesisContent() {
  return (
    <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
      <Kicker>the thesis · the inversion</Kicker>
      <h2 className="display-mono leading-[0.95] lowercase">
        <span className="block ink text-4xl md:text-[5.5rem]">
          they use it to manipulate.
        </span>
        <span className="block grad text-4xl md:text-[5.5rem] mt-2">
          we reversed it.
        </span>
      </h2>
      <p className="sans text-base md:text-lg smoke max-w-2xl leading-relaxed">
        corporations already use brain-encoding research to maximize
        engagement — scoring whether a piece of content fires the exact regions
        tied to high cravings, then pushing more of it. we ran the same
        machinery in reverse.
        <span className="ink"> to understand humans, not hijack them.</span>
      </p>
      <p className="sans text-sm smoke max-w-2xl leading-relaxed">
        this is how ai is supposed to be used — sustainably, ethically, in
        tandem with humans — not racing to automate every task that&apos;s
        inherently based on human creativity. the missing piece was the human
        data layer. we just opened it up.
      </p>
      <AnchorQuote attribution="johnny, locked headline">
        ai is not meant to replace human thinking. it&apos;s meant to augment it.
      </AnchorQuote>
    </div>
  );
}
