// CALTECH HACKTECH 2026 — TITLE-CARD CINEMATIC
//
// BEAT-5 close, three lines, 1-second gaps. No VO, no audio, no auto-loop.
// Renders silently for second-screen / pavilion projection. CSS animations
// only — no JS timers required.
//
// Source: caltech/pitch-story-v3-next-level.md §2 BEAT-5 Shot 12 (LOCKED).

const lines = [
  "humans are not machines.",
  "the empathy layer is what ai gives back.",
  "caltech hacktech 2026",
];

export default function TitleCard() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-10 py-20"
      style={{ background: "var(--clay-black)", color: "var(--pure-white)" }}
    >
      <div className="flex flex-col items-center gap-12 md:gap-16 text-center max-w-3xl">
        {lines.map((line, i) => (
          <p
            key={line}
            className="display-mono lowercase leading-[1.1] text-3xl md:text-5xl"
            style={{
              opacity: 0,
              animation: `titleFadeIn 1200ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
              animationDelay: `${i * 1000}ms`,
              color: i === 2 ? "var(--accent-soft)" : "var(--pure-white)",
            }}
          >
            {line}
          </p>
        ))}
      </div>

      <style>{`
        @keyframes titleFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
