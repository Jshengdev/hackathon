"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SlideFrame from "./SlideFrame";
import NavDots from "./NavDots";

export type Slide = {
  id: string;
  render: () => React.ReactNode;
};

export default function Deck({ slides }: { slides: Slide[] }) {
  const deckRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const total = slides.length;

  const handleJump = useCallback((i: number) => {
    const deck = deckRef.current;
    if (!deck) return;
    const target = deck.children[i] as HTMLElement | undefined;
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    const sections = Array.from(deck.querySelectorAll<HTMLElement>("section[data-index]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.55) {
            const idx = Number((e.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      { root: deck, threshold: [0.55, 0.75] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [slides]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleJump(Math.min(active + 1, total - 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        handleJump(Math.max(active - 1, 0));
      } else if (e.key === "Home") {
        handleJump(0);
      } else if (e.key === "End") {
        handleJump(total - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, total, handleJump]);

  return (
    <>
      <NavDots total={total} active={active} onJump={handleJump} />
      <div ref={deckRef} className="deck">
        {slides.map((slide, i) => (
          <SlideFrame key={slide.id} id={slide.id} index={i} total={total}>
            {slide.render()}
          </SlideFrame>
        ))}
      </div>
    </>
  );
}
