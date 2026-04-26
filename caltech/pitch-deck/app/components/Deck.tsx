"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SlideFrame from "./SlideFrame";
import NavDots from "./NavDots";
import ProgressBar from "./ProgressBar";
import SpeakerNotes, { NOTES } from "./SpeakerNotes";

export type Slide = {
  id: string;
  render: () => React.ReactNode;
};

// ── Persona-emphasis system ──────────────────────────────────────────────────
// One cohesive deck. ← → at the deck level cycles the EMPHASIS for the
// audience the presenter is speaking to. Slides that consume `usePersona()`
// re-render their persona-aware regions; the spine stays constant.
//
// Order matters: best-of-ai is the universal default → ironsight is the
// productivity / spatial-intel positioning → listen-labs is the
// simulation / autonomy positioning. Cycles back to best-of-ai.
export type Persona = "best-of-ai" | "ironsight" | "listen-labs";

export const PERSONA_ORDER: Persona[] = ["best-of-ai", "ironsight", "listen-labs"];

export const PERSONA_META: Record<
  Persona,
  {
    label: string;
    shortLabel: string;
    emphasis: string;
    heroExampleKey: "design" | "construction" | "consumer";
    closeTagline: string;
  }
> = {
  "best-of-ai": {
    label: "ai interaction",
    shortLabel: "ai interaction",
    emphasis:
      "creativity is the one skill that persists · the divergent thought stays yours",
    heroExampleKey: "design",
    closeTagline:
      "ai is meant to augment human creativity, not replace it. taste persists beyond ai — only if it stays accessible. now it does.",
  },
  ironsight: {
    label: "ironsight",
    shortLabel: "ironsight",
    emphasis:
      "spatial intelligence · empathy at the worksite · empowerment, not surveillance",
    heroExampleKey: "construction",
    closeTagline:
      "the empowerment gap was real. now managers can use ai without giving up empathy. win-win for workers, managers, and the company.",
  },
  "listen-labs": {
    label: "listen labs",
    shortLabel: "listen labs",
    emphasis:
      "simulating thought · un-blackbox the algorithm · reclaim autonomy",
    heroExampleKey: "consumer",
    closeTagline:
      "an entire generation lost the ability to think for themselves because the algorithm decided what fired in their brain. we just handed back the controls.",
  },
};

const PersonaCtx = createContext<{ persona: Persona }>({ persona: "best-of-ai" });
export const usePersona = (): { persona: Persona } => useContext(PersonaCtx);

// ── Sponsor-close swap (existing) ───────────────────────────────────────────
// Sponsor swap REPLACES the last slide via ?p=<sponsor>. Independent of
// persona — sponsor is a venue-specific final-slide swap; persona is a
// deck-wide emphasis. Both can coexist.
const SPONSOR_CLOSES: Record<
  string,
  { brand: string; killLine: string; ask: string }
> = {
  ironside: {
    brand: "ironside",
    killLine: "your worker's experience becomes spatial data.",
    ask: "ironside core · $5K + pilot conversation · cortical signal as a new sensing modality on top of the camera.",
  },
  listenlabs: {
    brand: "listen labs",
    killLine: "the iterative loop IS the simulation. same engine, infinite scenarios.",
    ask: "listen labs core · $3K + interview slot · biological signal as the substrate of human simulation.",
  },
  sideshift: {
    brand: "sideshift",
    killLine: "know what knows you.",
    ask: "sideshift core · b2c overlay · the user owns the vault. an ingredients-list for content.",
  },
  yc: {
    brand: "y combinator",
    killLine: "the future-obsidian — your inner life as a longitudinal dataset, owned by you.",
    ask: "yc stretch · today video. tomorrow direct neural data. design pattern before the interface goes invisible.",
  },
};

function readQuery() {
  if (typeof window === "undefined") {
    return {
      sponsor: null as string | null,
      presenter: false,
      persona: "best-of-ai" as Persona,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("p");
  const sponsor = raw && SPONSOR_CLOSES[raw] ? raw : null;
  const presenter = params.get("presenter") === "1";
  const personaRaw = params.get("persona");
  const persona: Persona =
    personaRaw === "ironsight" || personaRaw === "listen-labs"
      ? personaRaw
      : "best-of-ai";
  return { sponsor, presenter, persona };
}

// Discreet persona indicator — top-right corner, low visual weight.
// Hover reveals the emphasis line. Otherwise just label + 3 dots.
function PersonaPill({ persona }: { persona: Persona }) {
  const meta = PERSONA_META[persona];
  return (
    <div
      className="fixed z-[55] flex flex-col gap-1 items-end group"
      style={{
        top: 14,
        right: 14,
        padding: "4px 8px",
        opacity: 0.55,
        transition: "opacity 200ms ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
    >
      <div className="flex items-center gap-2">
        <span
          className="kicker"
          style={{
            color: "var(--warm-charcoal)",
            letterSpacing: "0.18em",
            fontSize: 10,
          }}
        >
          {meta.label}
        </span>
        <div className="flex items-center gap-[3px]">
          {PERSONA_ORDER.map((p) => (
            <span
              key={p}
              aria-label={p}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background:
                  p === persona ? "var(--accent)" : "var(--oat-border)",
                transition: "background 120ms ease",
              }}
            />
          ))}
        </div>
      </div>
      <p
        className="sans opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          fontSize: 10,
          lineHeight: 1.4,
          color: "var(--warm-charcoal)",
          maxWidth: 280,
          textAlign: "right",
        }}
      >
        {meta.emphasis}
      </p>
    </div>
  );
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

// Slides can be supplied as a static array OR as a per-persona ordering map.
// When a map is supplied, the active persona selects which ordering renders —
// so ← → swaps both the EMPHASIS and the SLIDE SEQUENCE per audience.
type SlidesProp = Slide[] | Record<Persona, Slide[]>;

export default function Deck({ slides }: { slides: SlidesProp }) {
  const deckRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState<{
    sponsor: string | null;
    presenter: boolean;
  }>({ sponsor: null, presenter: false });
  const [persona, setPersona] = useState<Persona>("best-of-ai");
  const startedAtRef = useRef<number>(Date.now());
  const lastActiveIdRef = useRef<string | null>(null);

  useEffect(() => {
    const q = readQuery();
    setQuery({ sponsor: q.sponsor, presenter: q.presenter });
    setPersona(q.persona);
  }, []);

  const personaSlides = useMemo<Slide[]>(() => {
    if (Array.isArray(slides)) return slides;
    return slides[persona] ?? slides["best-of-ai"];
  }, [slides, persona]);

  const effectiveSlides = useMemo<Slide[]>(() => {
    if (!query.sponsor || personaSlides.length === 0) return personaSlides;
    const last = personaSlides[personaSlides.length - 1];
    const swapped: Slide = {
      id: `${last.id}-sponsor-${query.sponsor}`,
      render: () => <SponsorClose sponsorKey={query.sponsor as string} />,
    };
    return [...personaSlides.slice(0, -1), swapped];
  }, [personaSlides, query.sponsor]);

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

  // When the slide ARRAY changes (persona swap with per-persona orderings),
  // try to keep the user on the same slide ID — if it exists in the new
  // ordering. Otherwise scroll to top so they see the new sequence from start.
  useEffect(() => {
    const oldId = lastActiveIdRef.current;
    if (!oldId) return;
    const newIdx = effectiveSlides.findIndex((s) => s.id === oldId);
    if (newIdx >= 0) {
      // Stay on the equivalent slide in the new order.
      requestAnimationFrame(() => handleJump(newIdx));
    } else {
      requestAnimationFrame(() => handleJump(0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSlides]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
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
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPersona((prev) => {
          const i = PERSONA_ORDER.indexOf(prev);
          return PERSONA_ORDER[(i + 1) % PERSONA_ORDER.length];
        });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPersona((prev) => {
          const i = PERSONA_ORDER.indexOf(prev);
          return PERSONA_ORDER[(i - 1 + PERSONA_ORDER.length) % PERSONA_ORDER.length];
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, total, handleJump]);

  const showProgress =
    query.presenter ||
    (typeof process !== "undefined" && process.env.NODE_ENV === "development");

  const activeId = effectiveSlides[active]?.id ?? "";
  const personaSuffixedActiveId = `${activeId}::${persona}`;

  // Track the active slide ID so the persona-swap effect above can preserve
  // the user's spot in the new ordering when slides change.
  useEffect(() => {
    lastActiveIdRef.current = activeId;
  }, [activeId]);

  return (
    <PersonaCtx.Provider value={{ persona }}>
      <PersonaPill persona={persona} />
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
      <SpeakerNotes
        slideId={
          NOTES[personaSuffixedActiveId] !== undefined
            ? personaSuffixedActiveId
            : activeId
        }
        notes={NOTES}
      />
    </PersonaCtx.Provider>
  );
}
