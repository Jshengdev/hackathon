"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";
import { Halftone } from "../components/Halftone";
import { Stage } from "../components/Stage";
import { palette } from "../palette";

/**
 * Pure symbolic clip — floor grid in perspective; glass tiles rise from floor
 * anchors and settle into orbit, then constellation links draw between them.
 */
export function RoomUnfold() {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  return (
    <Stage>
      <Halftone
        variant="room-unfold"
        frame={frame}
        durationInFrames={durationInFrames}
        seed={17}
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
        bottom: "6%",
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
