import Link from "next/link";

// CALTECH HACKTECH 2026 — HOSTILE-JUDGE FAQ
//
// Q-INT-1 through Q-INT-10 verbatim from caltech/pitch-deck/presenter-notes.md
// (Hostile-judge FAQ ammunition section). Every answer anchors a v3 LOCKED line
// where possible. Async surface judges + sponsors can read between sessions.

type FaqEntry = { id: string; q: string; a: string; anchor?: string };

const faqs: FaqEntry[] = [
  {
    id: "q-int-1",
    q: "Is this real or is it a mock?",
    anchor: "§9 honesty paragraph, verbatim.",
    a:
      "Here's what's real and what's stand-in. The brain pattern — TRIBE V2 reverse — was generated offline before the build. We're not running it live; we're not pretending to. The iterative-loop scoring uses K2 specialists evaluating the paragraph against each region's reading — semantic, falsifiable, real. The cosine-similarity number you see in §C uses a sentence-embedding proxy fit from hand-paired text-activation examples. It's a stand-in for live TRIBE forward inference, which is the production path. The falsification logic — main vs. control, cosine delta — is identical to the methodology that produced our 90.4% Clair de Lune match in published work. We're not lying about results. We're showing you a speed-run of the process while running one in the background.",
  },
  {
    id: "q-int-2",
    q: "What are the actual TRIBE numbers?",
    a:
      "Canonical numbers, per technical PRD §4.4: roughly twenty thousand cortical vertices on fsaverage5, drawn from roughly twenty-five deeply-scanned subjects in Meta's Algonauts release. We never claim seventy thousand voxels or seven hundred subjects — those are inflated marketing figures we explicitly do not use. Our forbidden-claim list pins the canonical numbers in writing.",
  },
  {
    id: "q-int-3",
    q: "Why K2 and not just Claude for everything?",
    a:
      "At Claude latency, eight rounds times seven evaluators times scoring per round does not fit a consumer-product latency budget. K2 runs about two thousand tokens per second — the iterative loop only works at that speed. Claude Opus does the synthesis step where prose quality matters more than throughput. K2 swarms the parallel evaluator step where throughput matters more than prose. The split is engineered, not aesthetic.",
  },
  {
    id: "q-int-4",
    q: "How do you know the paragraph isn't confabulated?",
    a:
      "The similarity score IS the falsifier. We score the winning paragraph against a control video — different person, different context, same engine. The drop is the proof. In the demo: similarity zero point eight six on the actual visit, zero point two seven against the control. That delta is what anchored, not confabulated means. Same falsification methodology as our 90.4% Clair de Lune work, where we falsified against triumphant music, rain, and aggressive speech.",
  },
  {
    id: "q-int-5",
    q: "Isn't reverse inference scientifically invalid?",
    a:
      "Yes — Poldrack 2006. Activating a region does not mean the subject experienced the function the region is named for. We never claim that. We use observational language only — emotional-processing specialist sustained engagement, not she felt that emotion. The forbidden-claim list is enforced by regex pre-flight in backend/services/guardrails.py. Banned phrases are rejected before the document is finalized. Reverse inference is the failure mode we engineer against, not toward.",
  },
  {
    id: "q-int-6",
    q: "What about the inflated voxel and subject counts you may have seen elsewhere?",
    a:
      "Those are inflated marketing numbers from third-party coverage. Canonical TRIBE V2 release: roughly twenty thousand cortical vertices on fsaverage5, roughly twenty-five deeply-scanned subjects. We pin the smaller, accurate figure in every artifact and refuse the inflated one. The forbidden-claim discipline is not just about reverse inference — it covers every number we cite.",
  },
  {
    id: "q-int-7",
    q: "How does this scale beyond the demo?",
    a:
      "Live TRIBE forward inference is the production path. The embedding-similarity proxy is the demo-day stand-in for that forward call — fit from hand-paired text-activation examples, identical falsification logic, faster to render under stage lights. Scaling to live is a swap of the inference call, not a re-architecting. The iterative-loop, the swarm, the falsification check, the document — none of that changes.",
  },
  {
    id: "q-int-8",
    q: "Who is this actually for?",
    a:
      "The manager, B2B. The user, B2C. The engine is one. Same architecture, swap the input file. The manager reads the empathy document about a worker before deciding to cut a corner. The user reads the empathy document about themselves at the end of a Reels session. Same engine. Different input. The architecture does not care who the reader is.",
  },
  {
    id: "q-int-9",
    q: "Why won't this become surveillance?",
    a:
      "The product enacts the YEA rubric — surfaces evidence, never recommends, the user or manager always judges. There is no behavior recommendation in the document, ever. The forbidden-claim list rejects any sentence that crosses into prescription. Manipulation only works in the dark. We turned the lights on. The architecture is the answer to the surveillance question, not a sentence in our pitch deck.",
  },
  {
    id: "q-int-10",
    q: "Why is this the right team?",
    a:
      "Johnny's published Clair de Lune work — 90.4% match against the emotion-center, falsified against triumphant music, rain, and aggressive speech — IS the methodology this product runs in inverse. The same person who shipped the forward direction is running the reverse. Founder-market-fit and methodology-credibility are the same artifact. Junsoo owns the brain JSON pipeline and the falsification baselines. Jacob orchestrates the K2 swarm. Emilie owns the document UI and launch video. Forty-eight hours.",
  },
];

export default function Faq() {
  return (
    <main className="min-h-screen flex justify-center px-6 md:px-12 py-16 md:py-24">
      <div className="w-full max-w-3xl flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <p className="kicker">caltech hacktech 2026 · empathy layer engine</p>
          <h1 className="display-mono ink text-4xl md:text-5xl leading-[0.98] lowercase">
            frequently asked, honestly answered.
          </h1>
          <p className="sans text-base smoke max-w-[70ch] leading-relaxed">
            ten questions a hostile judge has asked or will ask. anchored verbatim in the v3
            kill-line glossary and the §9 honesty paragraph. no hedging.
          </p>
        </header>

        <div className="rule" />

        <div className="flex flex-col">
          {faqs.map((entry, i) => (
            <section
              key={entry.id}
              className="flex flex-col gap-3 py-8 md:py-10"
              style={
                i === 0
                  ? undefined
                  : { borderTop: "1px solid var(--hair)" }
              }
            >
              <p className="kicker" style={{ color: "var(--accent)" }}>
                {entry.id}
              </p>
              <h2 className="serif italic text-2xl md:text-3xl ink leading-[1.18] max-w-[70ch]">
                {entry.q.toLowerCase()}
              </h2>
              {entry.anchor ? (
                <p className="kicker" style={{ color: "var(--mute)" }}>
                  anchor · {entry.anchor.toLowerCase()}
                </p>
              ) : null}
              <p className="sans text-base smoke leading-relaxed max-w-[70ch]">{entry.a}</p>
            </section>
          ))}
        </div>

        <div className="rule" />

        <footer className="flex flex-col gap-3 pb-4">
          <p className="kicker">return to deck</p>
          <ul className="flex flex-col divide-y" style={{ borderColor: "var(--hair)" }}>
            <li className="py-3">
              <Link
                href="/round-1"
                className="grid grid-cols-12 gap-4 items-baseline group"
              >
                <span
                  className="kicker col-span-3 md:col-span-2"
                  style={{ color: "var(--accent)" }}
                >
                  open →
                </span>
                <p className="mono text-lg ink col-span-9 md:col-span-3 lowercase group-hover:text-[var(--accent)] transition-colors">
                  round 1
                </p>
                <p className="sans text-sm smoke col-span-12 md:col-span-7">
                  5-min · 13 slides · healthcare master
                </p>
              </Link>
            </li>
            <li className="py-3">
              <Link
                href="/round-2"
                className="grid grid-cols-12 gap-4 items-baseline group"
              >
                <span
                  className="kicker col-span-3 md:col-span-2"
                  style={{ color: "var(--accent)" }}
                >
                  open →
                </span>
                <p className="mono text-lg ink col-span-9 md:col-span-3 lowercase group-hover:text-[var(--accent)] transition-colors">
                  round 2
                </p>
                <p className="sans text-sm smoke col-span-12 md:col-span-7">
                  3-min · 8 slides · beat-synced
                </p>
              </Link>
            </li>
          </ul>
        </footer>
      </div>
    </main>
  );
}
