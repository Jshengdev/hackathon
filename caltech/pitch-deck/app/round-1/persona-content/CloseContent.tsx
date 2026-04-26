"use client";

// SLIDE 14 — CLOSE content. Humanity stake · persona-aware tagline.
// Persona-aware: YES (PersonaCloseTagline swaps the middle paragraph).

import { Kicker } from "../../components/SlideKit";
import PersonaCloseTagline from "./PersonaCloseTagline";

export default function CloseContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-7 text-center enter max-w-5xl mx-auto">
      <img
        src="/images/amy-logo.png"
        alt="amy — short for amygdala"
        style={{
          maxWidth: 280,
          width: "100%",
          height: "auto",
          borderRadius: 10,
          boxShadow:
            "rgba(0, 0, 0, 0.10) 0px 1px 1px, rgba(0, 0, 0, 0.04) 0px -1px 1px inset",
        }}
      />
      <h2 className="display-mono leading-[0.95] lowercase">
        <span className="block ink text-4xl md:text-[5.5rem]">
          this isn&apos;t about industries.
        </span>
        <span className="block grad text-4xl md:text-[5.5rem] mt-2">
          it&apos;s about whether humans get to keep thinking.
        </span>
      </h2>
      <PersonaCloseTagline />
      <p className="mono italic text-xl md:text-2xl ink max-w-3xl">
        we turned the lights on. now everyone gets to see.
      </p>
      <div className="rule w-24 my-2" />
      <Kicker>caltech hacktech 2026 · johnny · junsoo · jacob · emilie</Kicker>
    </div>
  );
}
