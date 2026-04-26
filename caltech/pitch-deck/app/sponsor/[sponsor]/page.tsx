"use client";

// CALTECH HACKTECH 2026 — SPONSOR SWAP SLIDES
//
// Re-anchored to the empathy-layer engine per:
//   _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md
//   caltech/architecture-overview.md
//
// Ironsight is the primary $5K target. Listen Labs is core ($3K + interview).
// Sideshift is the B2C overlay. YC is the stretch (future-Obsidian for journal
// accumulation). One engine answers all four briefs.

import { use, type ReactNode } from "react";
import { notFound } from "next/navigation";
import RedDot from "../../components/RedDot";
import { Kicker, BrainBlock, AnchorQuote, EmpathyDocument } from "../../components/SlideKit";
import type { BrainVariant } from "../../components/BrainCanvas";

type FitRow = { ask: string; answer: string };

type SponsorContent = {
  brand: string;
  title: string;
  anchor: string;
  brief: string; // verbatim sponsor brief
  fit: FitRow[]; // their ask → our structural answer
  ask: string;
  visual:
    | { kind: "brain"; variant: BrainVariant; seed: number; highlight?: string }
    | {
        kind: "empathy";
        scenarioLabel: string;
        visionReport: string;
        empathyParagraph: ReactNode;
        similarity: number;
        falsificationDelta: number;
      };
};

const sponsors: Record<string, SponsorContent> = {
  ironside: {
    brand: "Ironsight",
    title: "video tells you what they did. the empathy layer tells you what it took.",
    anchor: "you confirmed it at office hours: a new modality mapped back to the video qualifies.",
    brief:
      "can you teach a machine to truly understand the physical world? today&apos;s ai can see, but doesn&apos;t comprehend. it recognizes objects but misses the critical spatial relationship that humans understand intuitively. pinpoint a key spatial task where current models fail. develop an innovative technique. showcase the impact on a real-world problem.",
    fit: [
      {
        ask: "spatial task where vlms fail",
        answer:
          "vlms cannot infer the cognitive-emotional state behind the spatial action. confabulation when asked to rank fatigue, focus, overload from egocentric footage.",
      },
      {
        ask: "innovative technique",
        answer:
          "tribe v2 brain-encoding sidecar. spatial-sidecar pattern. stage 2 maps the new modality (brain wave) back to the video as a paragraph the manager can read.",
      },
      {
        ask: "real-world impact",
        answer:
          "construction safety, healthcare, retail, food service, logistics. manager reads the empathy-layer document instead of action data alone. the corner-cut doesn&apos;t happen.",
      },
    ],
    ask: "ironsight core · $5K · the spatial-intelligence brief answered structurally.",
    visual: {
      kind: "empathy",
      scenarioLabel: "ironsight · construction site · scaffolding sequence",
      visionReport:
        "worker on scaffolding tier 3. tool in hand. movement near edge logged at t+47s. duration 8m12s. flag = NEAR_EDGE.",
      empathyParagraph: (
        <>
          his visual-attention specialist held tight on the lower platform — fixated on a beam joint
          that the action log treated as routine. salience-tracking ran high through the entire
          sequence; this is what scanning a hazard looks like. the &ldquo;near-edge&rdquo; flag the
          dashboard raised is the same brain pattern as <em>seeing the danger before stepping into
          it.</em> the worker did the safe thing. the action log called it the unsafe one.
        </>
      ),
      similarity: 0.81,
      falsificationDelta: 0.31,
    },
  },

  listenlabs: {
    brand: "Listen Labs",
    title: "the iterative loop is the multi-agent simulation.",
    anchor: "you care about the insight, not the stack. the insight is brain-grounded.",
    brief:
      "can you simulate how humans really think? humans don&apos;t just process information — they argue, persuade, change their minds, and influence each other in complex, unpredictable ways. today&apos;s ai can mimic language, but can it model the messy reality of human cognition and social dynamics? pick any slice of human or social behavior and simulate it. we care about the insight, not the stack.",
    fit: [
      {
        ask: "simulate humans / society",
        answer:
          "8 candidate paragraphs compete across rounds for brain-pattern match. per-industry generalization (construction · healthcare · retail · consumer) demonstrates simulation across humanity.",
      },
      {
        ask: "ground in something real",
        answer:
          "within-subject brain contrast. cosine similarity is the falsifier. control-footage delta proves the description is anchored to this scene specifically, not generically plausible.",
      },
      {
        ask: "insight, not stack",
        answer:
          "no text-only sim distinguishes genuine cognitive-emotional shift from surface agreement. brain-grounding does. that&apos;s the insight.",
      },
    ],
    ask: "listen labs core · $3K + interview · simulate humanity, then prove it.",
    visual: { kind: "brain", variant: "swarm-bridges", seed: 314 },
  },

  sideshift: {
    brand: "Sideshift",
    title: "your day, written by your own brain.",
    anchor: "consumer overlay of the same engine. video in. journal entry out.",
    brief:
      "consumer-data agency. give people the surface to see what their digital life is doing to them — and choose differently.",
    fit: [
      {
        ask: "data agency",
        answer:
          "user uploads their own footage. vault is theirs. no persistence beyond session unless they choose. the empathy layer reads the user&apos;s own day back to them.",
      },
      {
        ask: "consumer surface",
        answer:
          "shareable brain card export — 1:1 ig-story shape of the empathy-layer document. daily entries accumulate into a knowledge graph the user owns.",
      },
      {
        ask: "post-recommender posture",
        answer:
          "the system never recommends. it surfaces evidence. the user judges. that&apos;s the entire architecture.",
      },
    ],
    ask: "sideshift core · b2c overlay · the journal that writes itself.",
    visual: { kind: "brain", variant: "feed-grid", seed: 271 },
  },

  yc: {
    brand: "Y Combinator",
    title: "obsidian, but the graph is your brain.",
    anchor: "a database for you, not the database that sells you.",
    brief:
      "consumer cognitive infrastructure. local-first moat. the tam is the smartphone-to-bci transition.",
    fit: [
      {
        ask: "category creator",
        answer:
          "every empathy-layer document is a daily entry in a graph the user owns. cortex.buzz uses tribe v2 to engineer attention. we run it the other way.",
      },
      {
        ask: "moat",
        answer:
          "founder-market-fit + methodology credibility chip are the same artifact: clair de lune 90.4% match. local-first by design — your brain pattern doesn&apos;t leave the device.",
      },
      {
        ask: "tam",
        answer:
          "everyone moving from smartphones to brain interfaces. the empathy layer is the design pattern for that transition.",
      },
    ],
    ask: "yc stretch · personal cognitive infrastructure for the post-platform era.",
    visual: { kind: "brain", variant: "cortical-mesh", seed: 707, highlight: "default-mode" },
  },
};

export default function SponsorSwap({ params }: { params: Promise<{ sponsor: string }> }) {
  const { sponsor } = use(params);
  const content = sponsors[sponsor];
  if (!content) notFound();

  return (
    <main className="min-h-screen flex items-center justify-center px-10 md:px-16 lg:px-24 py-16 md:py-20 relative">
      <RedDot top="7%" left="7%" />
      <div className="relative mx-auto w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-12 items-start gap-16 enter">
        {/* Left column: title, brief, fit table, ask */}
        <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
          <Kicker>sponsor swap · {content.brand.toLowerCase()}</Kicker>
          <h1 className="display-mono ink text-4xl md:text-5xl leading-[1.0] lowercase">
            {content.title}
          </h1>

          <AnchorQuote attribution={`${content.brand} brief`}>{content.anchor}</AnchorQuote>

          {/* Verbatim brief block — small, in oat-bordered card */}
          <div className="surface-card-dashed p-4 md:p-5 max-w-xl">
            <p className="kicker mb-2">verbatim brief</p>
            <p
              className="sans text-sm smoke leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.brief }}
            />
          </div>

          {/* Fit table */}
          <ul className="flex flex-col divide-y" style={{ borderColor: "var(--hair)" }}>
            {content.fit.map((row) => (
              <li
                key={row.ask}
                className="grid grid-cols-12 gap-4 items-baseline py-3"
                style={{ borderColor: "var(--hair)" }}
              >
                <p
                  className="kicker col-span-12 md:col-span-4"
                  style={{ color: "var(--accent)" }}
                >
                  {row.ask}
                </p>
                <p
                  className="sans text-sm md:text-base col-span-12 md:col-span-8 smoke leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: row.answer }}
                />
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-1.5">
            <p className="kicker" style={{ color: "var(--accent)" }}>
              ask
            </p>
            <p className="mono text-base md:text-lg ink lowercase">{content.ask}</p>
          </div>
        </div>

        {/* Right column: hero artifact (empathy doc OR brain visual) */}
        <div className="lg:col-span-5 justify-self-end">
          {content.visual.kind === "empathy" ? (
            <EmpathyDocument
              scenarioLabel={content.visual.scenarioLabel}
              visionReport={content.visual.visionReport}
              empathyParagraph={content.visual.empathyParagraph}
              similarity={content.visual.similarity}
              falsificationDelta={content.visual.falsificationDelta}
            />
          ) : (
            <BrainBlock
              variant={content.visual.variant}
              seed={content.visual.seed}
              size={460}
              highlight={content.visual.highlight}
            />
          )}
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
