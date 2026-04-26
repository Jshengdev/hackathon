"use client";

// SLIDE 16 — WEBSITE ARCHITECTURE content. Embeds the standalone HTML
// diagram at public/diagrams/website-architecture.html. Layered diagram of
// the site itself — browser → vue 3 frontend → fastapi backend → services
// → pre-rendered data → external APIs. Universal across personas.

import { Kicker } from "../../components/SlideKit";

export default function WebsiteArchitectureContent() {
  return (
    <div className="flex flex-col gap-4 enter w-full max-w-[1180px] mx-auto">
      <div className="flex flex-col gap-2 max-w-3xl">
        <Kicker>the architecture · visual · website</Kicker>
        <p className="sans text-sm md:text-base smoke leading-relaxed">
          what we shipped. vue 3 dashboard, fastapi backend, k2 + opus + qwen
          orchestration, all reading pre-rendered tribe v2 artifacts off disk
          for stage reliability. zero runtime tribe gpu.
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
          src="/images/website-architecture.png"
          alt="Website architecture · 6-layer stack from browser to external APIs"
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
        href="/diagrams/website-architecture.html"
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
