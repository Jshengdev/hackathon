"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type BrainCanvas from "./BrainCanvas";

const Inner = dynamic(() => import("./BrainCanvas"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="rounded-sm"
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: 560,
        background: "color-mix(in srgb, var(--accent) 4%, transparent)",
      }}
    />
  ),
});

export default function Brain(props: ComponentProps<typeof BrainCanvas>) {
  return <Inner {...props} />;
}
