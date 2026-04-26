"use client";

// CALTECH HACKTECH 2026 — SPONSOR SWAP SLIDES
// One slide per sponsor. Plain language. Specific ask. Verbatim one-liners
// from caltech/prd-final.md §7. Final wording lives in presenter-notes.md.

import { use } from "react";
import { notFound } from "next/navigation";
import RedDot from "../../components/RedDot";
import { Kicker, BrainBlock, AnchorQuote } from "../../components/SlideKit";
import type { BrainVariant } from "../../components/BrainCanvas";

type SponsorContent = {
  brand: string;
  title: string;
  anchor: string;
  body: string;
  ask: string;
  variant: BrainVariant;
  seed: number;
  highlight?: string;
};

const sponsors: Record<string, SponsorContent> = {
  listenlabs: {
    brand: "Listen Labs",
    title: "you simulate humans. we simulate humanity.",
    anchor: "the loop where ai surfaces convergence and the user finds what's outside it.",
    body:
      "you simulate how humans think. we simulate how humans partner with ai while thinking. same tribe v2 engine, run in the opposite direction.",
    ask: "pre-deployment auditing for platforms that care about generational impact.",
    variant: "feed-grid",
    seed: 314,
  },
  sideshift: {
    brand: "Sideshift",
    title: "a consumer tool for capturing data — your data, for you.",
    anchor: "the first surface that shows what's being harvested, scoped to your brain's response.",
    body:
      "an ingredients-list api for content. creators embed it. their audiences see what each piece is built to do before they play it.",
    ask: "the labeling layer for the post-recommender feed.",
    variant: "divergence",
    seed: 271,
  },
  yc: {
    brand: "Y Combinator",
    title: "obsidian, but the graph is your brain.",
    anchor: "a database for you, not the database that sells you.",
    body:
      "your knowledge graph should be your brain's response shape, not a notion sidebar. local-first by design. cortex.buzz uses tribe v2 to engineer attention. we run it the other way.",
    ask: "personal cognitive infrastructure for the post-platform era. ship the category before the hardware does.",
    variant: "cortical-mesh",
    seed: 707,
    highlight: "default-mode",
  },
  ironside: {
    brand: "Ironside",
    title:
      "video tells you what was done. brain encoding tells you what state of mind it took.",
    anchor: "same engine, ethos preserved — for the worker, not the surveiller.",
    body:
      "egocentric video plus brain encoding. the salience signal pixel-only models miss. junsoo's idm-lab pipeline is the prior art.",
    ask: "cognitive-state inference per construction action. the worker owns the output.",
    variant: "activation-pulse",
    seed: 173,
    highlight: "motor",
  },
};

export default function SponsorSwap({ params }: { params: Promise<{ sponsor: string }> }) {
  const { sponsor } = use(params);
  const content = sponsors[sponsor];
  if (!content) notFound();

  return (
    <main className="min-h-screen flex items-center justify-center px-10 md:px-16 lg:px-24 py-16 md:py-20 relative">
      <RedDot top="7%" left="7%" />
      <div className="relative mx-auto w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
        <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
          <Kicker>sponsor swap · {content.brand.toLowerCase()}</Kicker>
          <h1 className="display-mono ink text-4xl md:text-6xl leading-[0.98] lowercase">
            {content.title}
          </h1>
          <AnchorQuote attribution={`prd-final §7 · ${content.brand}`}>{content.anchor}</AnchorQuote>
          <p className="sans text-base md:text-lg smoke max-w-xl leading-relaxed">{content.body}</p>
          <div className="flex flex-col gap-2 mt-2">
            <p className="kicker" style={{ color: "var(--accent)" }}>
              ask
            </p>
            <p className="mono text-base md:text-lg ink lowercase">{content.ask}</p>
          </div>
        </div>
        <div className="lg:col-span-5 justify-self-end">
          <BrainBlock
            variant={content.variant}
            seed={content.seed}
            size={480}
            highlight={content.highlight}
          />
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-5 right-6 sans text-xs tracking-widest text-mute select-none"
        style={{ color: "var(--mute)" }}
      >
        sponsor / {content.brand.toLowerCase()}
      </div>
    </main>
  );
}
