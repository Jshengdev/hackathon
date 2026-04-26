"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type HalftoneCanvas from "./HalftoneCanvas";

const Inner = dynamic(() => import("./HalftoneCanvas"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="rounded-sm"
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: 560,
        background: "color-mix(in srgb, var(--smoke) 6%, transparent)",
      }}
    />
  ),
});

export default function Halftone(props: ComponentProps<typeof HalftoneCanvas>) {
  return <Inner {...props} />;
}
