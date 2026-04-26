"use client";

// SLIDE 10 — HERO OUTPUT content. Walkable story + persona-driven empathy
// document + AMY chatbot for interrogating the scenario.
//
// Persona-aware: YES (via HeroEmpathyCarousel + AmyChat — both consume
// usePersona() internally).

import { Kicker } from "../../components/SlideKit";
import HeroEmpathyCarousel from "./HeroEmpathyCarousel";
import AmyChat from "./AmyChat";

export default function HeroOutputContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-12 enter">
      <div className="lg:col-span-5 flex flex-col gap-7 max-w-md sticky top-24">
        <Kicker>the output · a story you can walk through</Kicker>
        <h2 className="display-mono text-5xl md:text-7xl leading-[0.95] lowercase">
          <span className="ink">put yourself</span>
          <br />
          <span className="grad">in their shoes.</span>
        </h2>
        <p className="sans text-base md:text-lg smoke leading-relaxed">
          the empathy layer turns the brain reading into a story you can walk
          through yourself. you visualize the environment. you feel what they
          were carrying. then you decide.
        </p>
        <p className="mono italic text-sm smoke">
          and the document is interrogable — ask <span className="ink">amy</span>{" "}
          (the empathy-layer assistant) to surface scenario-specific data the
          paragraph didn&apos;t spell out.
        </p>
        <p className="kicker" style={{ color: "var(--accent)" }}>
          ← → swap audience emphasis · example + amy auto-match
        </p>
        <p className="mono italic text-sm smoke">anchored. not confabulated.</p>
      </div>
      <div className="lg:col-span-7 flex flex-col gap-5">
        <HeroEmpathyCarousel />
        <AmyChat />
      </div>
    </div>
  );
}
