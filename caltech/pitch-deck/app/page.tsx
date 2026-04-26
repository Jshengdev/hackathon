import Link from "next/link";

const decks = [
  { href: "/round-1", k: "round 1", b: "5-min · 12 slides" },
  { href: "/round-2", k: "round 2", b: "3-min · 8 slides" },
];

const sponsors = [
  { href: "/sponsor/listenlabs", k: "listen labs" },
  { href: "/sponsor/sideshift", k: "sideshift" },
  { href: "/sponsor/yc", k: "y combinator" },
  { href: "/sponsor/ironside", k: "ironside" },
];

export default function Index() {
  return (
    <main className="min-h-screen flex items-center justify-center px-10 py-20">
      <div className="max-w-3xl w-full flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <p className="kicker">caltech hacktech 2026</p>
          <h1 className="display-mono ink text-5xl md:text-7xl leading-[0.92] lowercase">
            you can&apos;t see how the algorithm shapes your thinking.
            <br />
            <span className="grad">we made it visible.</span>
          </h1>
        </div>

        <div className="rule" />

        <ul className="flex flex-col divide-y" style={{ borderColor: "var(--hair)" }}>
          {decks.map((r) => (
            <li key={r.href} className="py-5">
              <Link
                href={r.href}
                className="grid grid-cols-12 gap-6 items-baseline group"
              >
                <span
                  className="kicker col-span-3 md:col-span-2"
                  style={{ color: "var(--accent)" }}
                >
                  open →
                </span>
                <p className="mono text-xl md:text-2xl ink col-span-9 md:col-span-6 lowercase group-hover:text-[var(--accent)] transition-colors">
                  {r.k}
                </p>
                <p className="kicker col-span-12 md:col-span-4">{r.b}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4">
          <p className="kicker">sponsor swaps · 1 slide each</p>
          <ul className="flex flex-col divide-y" style={{ borderColor: "var(--hair)" }}>
            {sponsors.map((s) => (
              <li key={s.href} className="py-3">
                <Link href={s.href} className="grid grid-cols-12 gap-4 items-baseline group">
                  <span className="kicker col-span-3 md:col-span-2" style={{ color: "var(--accent)" }}>
                    open →
                  </span>
                  <p className="mono text-lg ink col-span-9 md:col-span-10 lowercase group-hover:text-[var(--accent)] transition-colors">
                    {s.k}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rule" />

        <p className="sans text-sm smoke">
          ↑ ↓ space pageup pagedn home end. or click the dots on the right.
        </p>
      </div>
    </main>
  );
}
