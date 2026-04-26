"use client";

// /embed — pavilion side-by-side · deck (left, 60%) + live engine (right, 40%).
// presenter mode for showing the rehearsed pitch alongside the live backend output.
// backend lives at localhost:8000. if it's not running, the right column shows
// a polite reachability hint instead of failing silently.

import Link from "next/link";
import { useEffect, useState } from "react";

const BACKEND = "http://localhost:8000";

type Clip = {
  clip_id: string;
  scenario?: string;
  label?: string;
};

type FetchState =
  | { status: "loading" }
  | { status: "ok"; clips: Clip[] }
  | { status: "error"; message: string };

export default function EmbedPage() {
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [selectedClip, setSelectedClip] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);

    fetch(`${BACKEND}/demo/clips`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`backend ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        const clips: Clip[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.clips)
            ? data.clips
            : [];
        setState({ status: "ok", clips });
        if (clips.length > 0 && clips[0]) setSelectedClip(clips[0].clip_id);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "unknown error";
        setState({ status: "error", message: msg });
      })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      ctrl.abort();
      clearTimeout(timer);
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--ivory)",
      }}
    >
      <header
        style={{
          padding: "20px 32px",
          borderBottom: "1px solid var(--hair)",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div className="kicker">live engine · {BACKEND}</div>
        <div
          className="kicker"
          style={{ color: state.status === "ok" ? "var(--accent)" : "var(--mute)" }}
        >
          {state.status === "loading" && "checking backend…"}
          {state.status === "ok" && `${state.clips.length} clips · ready`}
          {state.status === "error" && "backend not reachable"}
        </div>
      </header>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "60% 40%",
          minHeight: 0,
        }}
      >
        {/* LEFT · deck — round-2 surface */}
        <section
          style={{
            borderRight: "1px solid var(--hair)",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <div
            style={{
              padding: "12px 24px",
              borderBottom: "1px solid var(--hair)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span className="kicker">deck · round 2</span>
            <Link
              href="/round-2"
              className="kicker"
              style={{ color: "var(--accent)" }}
            >
              open in tab →
            </Link>
          </div>
          <iframe
            src="/round-2"
            title="round-2 deck"
            style={{
              flex: 1,
              width: "100%",
              border: "none",
              background: "var(--ivory)",
            }}
          />
        </section>

        {/* RIGHT · live engine — clip browser */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            background: "var(--ivory-hi)",
          }}
        >
          <div
            style={{
              padding: "12px 24px",
              borderBottom: "1px solid var(--hair)",
            }}
          >
            <span className="kicker">live · empathy clips</span>
          </div>

          <div
            style={{
              flex: 1,
              padding: "24px",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {state.status === "loading" && (
              <p
                className="sans"
                style={{ color: "var(--smoke)", fontSize: 14 }}
              >
                pinging {BACKEND}/demo/clips …
              </p>
            )}

            {state.status === "error" && (
              <div
                style={{
                  border: "1px dashed var(--hair-strong)",
                  padding: "20px 24px",
                  borderRadius: "var(--r-card)",
                }}
              >
                <p
                  className="display-mono ink"
                  style={{
                    fontSize: 22,
                    lineHeight: 1.3,
                    marginBottom: 8,
                    textTransform: "lowercase",
                  }}
                >
                  backend not running.
                </p>
                <p
                  className="sans"
                  style={{
                    color: "var(--smoke)",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  start uvicorn on port 8000:
                </p>
                <pre
                  style={{
                    marginTop: 10,
                    padding: "10px 12px",
                    background: "var(--ivory-deep)",
                    border: "1px solid var(--hair)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 12,
                    color: "var(--ink)",
                    overflowX: "auto",
                  }}
                >
                  cd backend && uvicorn services.app:app --port 8000
                </pre>
                <p
                  className="kicker"
                  style={{ marginTop: 12, color: "var(--mute)" }}
                >
                  reason · {state.message}
                </p>
              </div>
            )}

            {state.status === "ok" && state.clips.length === 0 && (
              <p
                className="sans"
                style={{ color: "var(--smoke)", fontSize: 14 }}
              >
                backend up · no clips registered yet.
              </p>
            )}

            {state.status === "ok" && state.clips.length > 0 && (
              <>
                <p
                  className="kicker"
                  style={{ color: "var(--mute)" }}
                >
                  pick a clip · opens /empathy/&lt;id&gt;
                </p>
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    border: "1px solid var(--hair)",
                  }}
                >
                  {state.clips.map((clip) => (
                    <li
                      key={clip.clip_id}
                      style={{
                        borderTop: "1px solid var(--hair)",
                      }}
                    >
                      <Link
                        href={`/empathy/${clip.clip_id}`}
                        onMouseEnter={() => setSelectedClip(clip.clip_id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 16,
                          padding: "14px 16px",
                          textDecoration: "none",
                          background:
                            selectedClip === clip.clip_id
                              ? "var(--ivory-deep)"
                              : "transparent",
                          transition: "background 120ms ease",
                        }}
                      >
                        <span
                          className="display-mono ink"
                          style={{
                            fontSize: 15,
                            textTransform: "lowercase",
                          }}
                        >
                          {clip.clip_id}
                        </span>
                        <span
                          className="kicker"
                          style={{ color: "var(--mute)" }}
                        >
                          {clip.scenario ?? clip.label ?? "→"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    marginTop: 8,
                    padding: "12px 16px",
                    border: "1px solid var(--hair)",
                    background: "var(--ivory)",
                  }}
                >
                  <p className="kicker" style={{ color: "var(--mute)" }}>
                    raw · {BACKEND}/demo/empathy/&lt;id&gt;
                  </p>
                  <p
                    className="sans"
                    style={{
                      marginTop: 6,
                      color: "var(--smoke)",
                      fontSize: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    the deck&apos;s /empathy route consumes that endpoint.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
