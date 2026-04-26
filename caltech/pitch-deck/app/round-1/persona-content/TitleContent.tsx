"use client";

// SLIDE 01 — TITLE content. Universal across personas.
//
// Header rewrite (Msg 14): drop the "humans are not machines / ai forgot"
// + the johnny-attribution AnchorQuote. New framing pulled from Johnny's
// hints: convergent thinking · ai abused · empathy is the missing layer
// to close the gap between humans + ai interaction.
//
// Also includes the ← → swap prompt — first time the audience meets the
// persona-swap mechanism. Subtle but discoverable.

import { Kicker } from "../../components/SlideKit";
import ScrollHint from "../../components/ScrollHint";

export default function TitleContent() {
  return (
    <>
      <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
        <Kicker>caltech hacktech 2026 · ironsight · listen labs · ai interaction</Kicker>
        <h1 className="display-mono leading-[0.95] lowercase">
          <span className="block ink text-[3rem] md:text-[5.5rem]">
            the way we use ai
          </span>
          <span className="block grad text-[3rem] md:text-[5.5rem] mt-1">
            is killing what makes us human.
          </span>
        </h1>
        <p className="sans text-base md:text-xl smoke max-w-2xl leading-relaxed">
          convergence is the price of personalization. the empathy layer is the
          missing piece — what closes the gap between humans and the machines
          we built. how ai stops replacing us and starts interacting with us.
        </p>
        <div
          className="flex items-center gap-3 mt-2"
          style={{
            padding: "8px 14px",
            border: "1px solid var(--oat-border)",
            borderRadius: 999,
            background: "color-mix(in srgb, var(--accent) 6%, transparent)",
          }}
        >
          <span
            className="mono"
            style={{
              color: "var(--accent)",
              fontSize: 12,
              letterSpacing: "0.18em",
            }}
          >
            ← →
          </span>
          <span
            className="kicker"
            style={{ color: "var(--ink)" }}
          >
            press to swap audience emphasis · top-right shows current
          </span>
        </div>
      </div>
      <ScrollHint />
    </>
  );
}
