"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SlideFrame from "./SlideFrame";
import NavDots from "./NavDots";
import ProgressBar from "./ProgressBar";
import SpeakerNotes, { NOTES } from "./SpeakerNotes";

export type Slide = {
  id: string;
  render: () => React.ReactNode;
};

const SPONSOR_CLOSES: Record<
  string,
  { brand: string; killLine: string; ask: string }
> = {
  ironside: {
    brand: "ironside",
    killLine: "for the worker — not the surveiller.",
    ask: "ironside core · $5K · same engine, different input.",
  },
  listenlabs: {
    brand: "listen labs",
    killLine: "the iterative loop IS the simulation.",
    ask: "listen labs core · $3K + interview · brain-grounding is the insight.",
  },
  sideshift: {
    brand: "sideshift",
    killLine: "know what knows you.",
    ask: "sideshift core · b2c overlay · the user owns the vault.",
  },
  yc: {
    brand: "y combinator",
    killLine: "the design pattern before the cognitive interface becomes invisible.",
    ask: "yc stretch · today reels · tomorrow brain chips · same trade.",
  },
};

function readQuery() {
  if (typeof window === "undefined") {
    return { sponsor: null as string | null, presenter: false };
  }
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("p");
  const sponsor = raw && SPONSOR_CLOSES[raw] ? raw : null;
  const presenter = params.get("presenter") === "1";
  return { sponsor, presenter };
}

function SponsorClose({ sponsorKey }: { sponsorKey: string }) {
  const data = SPONSOR_CLOSES[sponsorKey];
  if (!data) return null;
  return (
    <div className="flex flex-col items-start justify-center gap-10 max-w-5xl enter">
      <p
        className="kicker"
        style={{ color: "var(--accent)", letterSpacing: "0.32em" }}
      >
        sponsor close · {data.brand}
      </p>
      <h2 className="display-mono leading-[0.95] lowercase">
        <span className="block ink text-5xl md:text-[6rem]">
          humans are not machines.
        </span>
        <span className="block grad text-4xl md:text-[4.5rem] mt-3">
          the empathy layer is what ai gives back.
        </span>
      </h2>
      <p
        className="mono italic text-xl md:text-2xl ink lowercase max-w-3xl"
      >
        {data.killLine}
      </p>
      <div className="rule w-24" />
      <p className="mono text-base md:text-lg smoke lowercase">{data.ask}</p>
      <a
        href={`/sponsor/${sponsorKey}`}
        className="mono text-sm ink lowercase"
        style={{ textDecoration: "underline" }}
      >
        open /sponsor/{sponsorKey}
      </a>
    </div>
  );
}

export default function Deck({ slides }: { slides: Slide[] }) {
  const deckRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState<{
    sponsor: string | null;
    presenter: boolean;
  }>({ sponsor: null, presenter: false });
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    setQuery(readQuery());
  }, []);

  const effectiveSlides = useMemo<Slide[]>(() => {
    if (!query.sponsor || slides.length === 0) return slides;
    const last = slides[slides.length - 1];
    const swapped: Slide = {
      id: `${last.id}-sponsor-${query.sponsor}`,
      render: () => <SponsorClose sponsorKey={query.sponsor as string} />,
    };
    return [...slides.slice(0, -1), swapped];
  }, [slides, query.sponsor]);

  const total = effectiveSlides.length;

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
  }, [effectiveSlides]);

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

  const showProgress =
    query.presenter ||
    (typeof process !== "undefined" && process.env.NODE_ENV === "development");

  const activeId = effectiveSlides[active]?.id ?? "";

  return (
    <>
      {showProgress && (
        <ProgressBar
          currentSlide={active}
          totalSlides={total}
          startedAt={startedAtRef.current}
        />
      )}
      <NavDots total={total} active={active} onJump={handleJump} />
      <div ref={deckRef} className="deck">
        {effectiveSlides.map((slide, i) => (
          <SlideFrame key={slide.id} id={slide.id} index={i} total={total}>
            {slide.render()}
          </SlideFrame>
        ))}
      </div>
      <SpeakerNotes slideId={activeId} notes={NOTES} />
    </>
  );
}
