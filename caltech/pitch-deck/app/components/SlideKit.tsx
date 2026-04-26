"use client";

import type { ReactNode } from "react";
import Halftone from "./Halftone";
import type { HalftoneVariant } from "./HalftoneCanvas";
import Brain from "./Brain";
import type { BrainVariant } from "./BrainCanvas";

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker">{children}</p>;
}

export function HalftoneBlock({
  variant,
  seed = 7,
  size = 520,
  density = 10,
}: {
  variant: HalftoneVariant;
  seed?: number;
  size?: number;
  density?: number;
}) {
  return (
    <div className="relative flex items-center justify-center">
      <Halftone variant={variant} seed={seed} size={size} density={density} />
    </div>
  );
}

export function BrainBlock({
  variant,
  seed = 7,
  size = 480,
  highlight,
}: {
  variant: BrainVariant;
  seed?: number;
  size?: number;
  highlight?: string;
}) {
  return (
    <div className="relative flex items-center justify-center">
      <Brain variant={variant} seed={seed} size={size} highlight={highlight} />
    </div>
  );
}

export function VideoBlock({ src, size = 520 }: { src: string; size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-[2px]"
      style={{ width: size, height: size }}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

/** Italic anchor-quote line in mono italic — Johnny verbatim slot. */
export function AnchorQuote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <blockquote className="mono italic text-xl md:text-2xl max-w-2xl leading-relaxed smoke">
      {children}
      {attribution ? <footer className="kicker mt-3">— {attribution}</footer> : null}
    </blockquote>
  );
}

/** Clay-style card surface — white on warm-cream, oat border, level-1 elevation. */
export function Card({
  children,
  variant = "card",
  className = "",
}: {
  children: ReactNode;
  variant?: "card" | "feature" | "dashed";
  className?: string;
}) {
  const cls =
    variant === "feature"
      ? "surface-card-feature"
      : variant === "dashed"
        ? "surface-card-dashed"
        : "surface-card";
  return <div className={`${cls} p-6 md:p-8 ${className}`}>{children}</div>;
}

/** Clay-style button-as-link. */
export function Button({
  href,
  children,
  variant = "primary",
  pill = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "white" | "ghost";
  pill?: boolean;
}) {
  const cls = `btn btn-${variant}${pill ? " btn-pill" : ""}`;
  return (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}

/** [TBD-FINAL-PASS] marker rendered inline as a soft sepia chip. */
export function TBD({ note }: { note: string }) {
  return (
    <span
      className="kicker"
      style={{
        color: "var(--accent-soft)",
        background: "color-mix(in srgb, var(--accent-soft) 8%, transparent)",
        padding: "2px 8px",
        borderRadius: "2px",
      }}
    >
      [TBD-FINAL-PASS: {note}]
    </span>
  );
}
