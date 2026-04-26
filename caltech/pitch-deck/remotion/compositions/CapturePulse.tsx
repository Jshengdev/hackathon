"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";
import { Halftone } from "../components/Halftone";
import { Stage } from "../components/Stage";
import { palette } from "../palette";

/**
 * Pure symbolic clip — a noisy field where a subset of particles converges
 * into a portrait silhouette and radiates a capture ring.
 */
export function CapturePulse() {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  return (
    <Stage>
      <Halftone
        variant="capture-pulse"
        frame={frame}
        durationInFrames={durationInFrames}
        seed={303}
        width={width}
        height={height}
      />
      <RedDot />
    </Stage>
  );
}

function RedDot() {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: "6%",
        left: "6%",
        width: 14,
        height: 14,
        borderRadius: 999,
        background: palette.red,
        boxShadow: `0 0 0 ${8 + Math.sin(frame * 0.18) * 2}px rgba(229,75,75,0.18)`,
      }}
    />
  );
}
