import Link from "next/link";

const decks = [
  {
    href: "/round-1",
    k: "round 1",
    b: "5-min · 13 slides · healthcare master · ironside variant via /sponsor/ironside",
  },
  { href: "/round-2", k: "round 2", b: "3-min · 8 slides · beat-synced" },
];

const sponsors = [
  { href: "/sponsor/ironside", k: "ironsight", note: "primary · $5K · spatial-intel brief" },
  { href: "/sponsor/listenlabs", k: "listen labs", note: "$3K + interview · simulate humanity" },
  { href: "/sponsor/sideshift", k: "sideshift", note: "b2c overlay · daily journal" },
  { href: "/sponsor/yc", k: "y combinator", note: "stretch · future-obsidian" },
];

const live = [
  {
    href: "/empathy/30s_ironsite",
    k: "live empathy doc",
    note: "fetch from localhost:8000 · §a vision · §b paragraph · §c falsification",
  },
  {
    href: "/title",
    k: "title card",
    note: "3-line close · humans are not machines · second-screen surface",
  },
  {
    href: "/faq",
    k: "hostile-judge faq",
    note: "q-int-1..10 verbatim · async ammunition for sponsors",
  },
];

export default function Index() {
  return (
    <main className="min-h-screen flex items-center justify-center px-10 py-20">
      <div className="max-w-3xl w-full flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <p className="kicker">caltech hacktech 2026 · empathy layer engine</p>
          <h1 className="display-mono ink text-5xl md:text-7xl leading-[0.92] lowercase">
            humans are not machines.
            <br />
            <span className="grad">ai forgot.</span>
          </h1>
          <p className="sans text-base md:text-lg smoke max-w-xl">
            video → qwen vision + prerendered tribe v2 → k2 swarm → k2 moderator → k2 swarm-as-evaluator
            (8 rounds) → embedding-proxy falsification → empathy-layer document. one engine answers
            ironsight&apos;s spatial-intel brief and listen labs&apos;s simulate-humanity brief.
          </p>
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
                <p className="mono text-xl md:text-2xl ink col-span-9 md:col-span-4 lowercase group-hover:text-[var(--accent)] transition-colors">
                  {r.k}
                </p>
                <p className="kicker col-span-12 md:col-span-6">{r.b}</p>
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
                  <span
                    className="kicker col-span-3 md:col-span-2"
                    style={{ color: "var(--accent)" }}
                  >
                    open →
                  </span>
                  <p className="mono text-lg ink col-span-9 md:col-span-3 lowercase group-hover:text-[var(--accent)] transition-colors">
                    {s.k}
                  </p>
                  <p className="sans text-sm smoke col-span-12 md:col-span-7">{s.note}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <p className="kicker">live demo + reference</p>
          <ul className="flex flex-col divide-y" style={{ borderColor: "var(--hair)" }}>
            {live.map((s) => (
              <li key={s.href} className="py-3">
                <Link href={s.href} className="grid grid-cols-12 gap-4 items-baseline group">
                  <span
                    className="kicker col-span-3 md:col-span-2"
                    style={{ color: "var(--accent)" }}
                  >
                    open →
                  </span>
                  <p className="mono text-lg ink col-span-9 md:col-span-3 lowercase group-hover:text-[var(--accent)] transition-colors">
                    {s.k}
                  </p>
                  <p className="sans text-sm smoke col-span-12 md:col-span-7">{s.note}</p>
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
