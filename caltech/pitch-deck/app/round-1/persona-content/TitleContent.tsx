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
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 enter w-full">
        <div className="lg:col-span-7 flex flex-col items-start gap-8 max-w-2xl">
          <Kicker>caltech hacktech 2026 · ironsight · listen labs · ai interaction</Kicker>
          <h1 className="display-mono leading-[0.95] lowercase">
            <span className="block ink text-[2.75rem] md:text-[4.5rem]">
              the way we use ai
            </span>
            <span className="block grad text-[2.75rem] md:text-[4.5rem] mt-1">
              is killing what makes us human.
            </span>
          </h1>
          <p className="sans text-base md:text-xl smoke leading-relaxed">
            the empathy layer that gives vision-language models human-centered
            data — so the people managing them stop deciding with half the
            picture.
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
        <div className="lg:col-span-5 flex items-center justify-center">
          <img
            src="/images/amy-logo.png"
            alt="amy — short for amygdala"
            className="w-full h-auto"
            style={{
              borderRadius: 12,
              boxShadow:
                "rgba(0, 0, 0, 0.10) 0px 1px 1px, rgba(0, 0, 0, 0.04) 0px -1px 1px inset",
            }}
          />
        </div>
      </div>
      <ScrollHint />
    </>
  );
}
