"use client";

type Props = {
  total: number;
  active: number;
  onJump: (i: number) => void;
};

export default function NavDots({ total, active, onJump }: Props) {
  return (
    <nav
      aria-label="slide navigation"
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5"
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => onJump(i)}
            className="group flex items-center justify-center w-3 h-3"
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: isActive ? 10 : 5,
                height: isActive ? 10 : 5,
                background: isActive ? "var(--smoke)" : "var(--mute)",
                opacity: isActive ? 1 : 0.55,
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}
