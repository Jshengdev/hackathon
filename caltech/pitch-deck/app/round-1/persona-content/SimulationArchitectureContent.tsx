"use client";

// SLIDE 17 — SIMULATION ARCHITECTURE content. Embeds the standalone HTML
// deep-dive into Stage 2 (the K2 swarm simulation). Companion piece to
// SwarmArchitectureContent (which is the full pipeline overview).
// Universal across personas — this is the technical heart of the architecture.

import { Kicker } from "../../components/SlideKit";

export default function SimulationArchitectureContent() {
  return (
    <div className="flex flex-col gap-4 enter w-full max-w-[1180px] mx-auto">
      <div className="flex flex-col gap-2 max-w-3xl">
        <Kicker>the architecture · zoom-in · k2 swarm simulation</Kicker>
        <p className="sans text-sm md:text-base smoke leading-relaxed">
          stage 2 deep dive. 8 specialist agents in parallel, each one
          simulating a cortical region's interpretation of the brain pattern.
          ~24 distinct thought processes per clip. only k2's throughput +
          low-hallucination floor closes the loop in human time.
        </p>
      </div>
      <div
        className="w-full flex items-center justify-center"
        style={{
          border: "1px solid var(--oat-border)",
          borderRadius: 12,
          overflow: "hidden",
          background: "var(--warm-cream)",
          padding: 8,
          boxShadow:
            "rgba(0, 0, 0, 0.10) 0px 1px 1px, rgba(0, 0, 0, 0.04) 0px -1px 1px inset",
        }}
      >
        <img
          src="/images/simulation-architecture.png"
          alt="Simulation architecture · 8 agents · ~24 thought processes · stage 2 deep-dive"
          style={{
            maxWidth: "100%",
            maxHeight: "78vh",
            width: "auto",
            height: "auto",
            display: "block",
            objectFit: "contain",
          }}
        />
      </div>
      <a
        href="/diagrams/simulation-architecture.html"
        target="_blank"
        rel="noreferrer"
        className="kicker"
        style={{ color: "var(--accent)", textDecoration: "underline", alignSelf: "flex-start" }}
      >
        open full diagram →
      </a>
    </div>
  );
}
