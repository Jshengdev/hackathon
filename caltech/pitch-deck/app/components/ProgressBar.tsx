"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  currentSlide: number;
  totalSlides: number;
  startedAt?: number;
}

function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ProgressBar({
  currentSlide,
  totalSlides,
  startedAt,
}: ProgressBarProps) {
  const [elapsedLabel, setElapsedLabel] = useState<string>(() =>
    startedAt ? formatElapsed(Date.now() - startedAt) : "",
  );

  useEffect(() => {
    if (!startedAt) return;
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      if (t - last > 250) {
        setElapsedLabel(formatElapsed(Date.now() - startedAt));
        last = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [startedAt]);

  const safeTotal = Math.max(1, totalSlides);
  const ratio = Math.min(1, Math.max(0, (currentSlide + 1) / safeTotal));

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none select-none"
      style={{ height: 14 }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "var(--hair)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 1,
          width: `${ratio * 100}%`,
          background:
            "linear-gradient(90deg, var(--accent-soft), var(--accent))",
          transition: "width 220ms ease-out",
        }}
      />
      <div
        className="mono"
        style={{
          position: "absolute",
          top: 4,
          right: 10,
          fontSize: 10,
          letterSpacing: "0.16em",
          color: "var(--mute)",
          textTransform: "lowercase",
        }}
      >
        slide {currentSlide + 1}/{totalSlides}
        {startedAt ? ` · ${elapsedLabel}` : ""}
      </div>
    </div>
  );
}
