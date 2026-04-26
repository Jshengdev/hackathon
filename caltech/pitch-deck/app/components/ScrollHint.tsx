export default function ScrollHint() {
  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-mute" style={{ color: "var(--mute)" }}>
      <span className="sans text-xs tracking-[0.2em] uppercase">Scroll to explore</span>
      <svg width="22" height="34" viewBox="0 0 22 34" fill="none" aria-hidden>
        <rect x="1" y="1" width="20" height="32" rx="10" stroke="currentColor" strokeWidth="1.2" />
        <rect className="wheel-tick" x="9.5" y="7" width="3" height="7" rx="1.5" fill="var(--olive)" />
      </svg>
    </div>
  );
}
