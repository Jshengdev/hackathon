import type { CSSProperties } from "react";

type Props = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size?: number;
  line?: { toX: string; toY: string; thickness?: number };
};

export default function RedDot({
  top,
  left,
  right,
  bottom,
  size = 18,
  line,
}: Props) {
  const wrap: CSSProperties = {
    position: "absolute",
    top,
    left,
    right,
    bottom,
    width: size,
    height: size,
  };
  return (
    <div style={wrap} className="pointer-events-none">
      {line && (
        <div
          style={{
            position: "absolute",
            top: size / 2,
            left: size / 2,
            width: line.toX,
            height: line.thickness ?? 1,
            background: "var(--red-soft)",
            opacity: 0.6,
            transformOrigin: "0 0",
            transform: `rotate(${line.toY})`,
          }}
        />
      )}
      <div
        className="red-dot"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "var(--red)",
          boxShadow: "0 0 0 4px color-mix(in srgb, var(--red) 12%, transparent)",
        }}
      />
    </div>
  );
}
