"use client";

// SLIDE 15 — SWARM ARCHITECTURE content. Embeds the standalone HTML diagram
// at public/diagrams/swarm-architecture.html (inline SVG, on-brand). Stays
// constant across personas (architecture is universal).

import { Kicker } from "../../components/SlideKit";

export default function SwarmArchitectureContent() {
  return (
    <div className="flex flex-col gap-4 enter w-full max-w-[1180px] mx-auto">
      <div className="flex flex-col gap-2 max-w-3xl">
        <Kicker>the architecture · visual · swarm agent</Kicker>
        <p className="sans text-sm md:text-base smoke leading-relaxed">
          one diagram for the whole engine. video splits into vision + brain encoder,
          swarm reads in parallel, moderator writes, evaluators iterate, falsifier
          verifies. open in a new tab for the full-resolution version.
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
          src="/images/swarm-architecture.png"
          alt="Swarm agent architecture · 6-stage pipeline"
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
        href="/diagrams/swarm-architecture.html"
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
