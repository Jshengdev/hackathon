"use client";

// CALTECH HACKTECH 2026 — LIVE EMPATHY-LAYER DOCUMENT
//
// Fetches GET http://localhost:8000/demo/empathy/{clipId} (FastAPI backend,
// CORS allow_origins=["*"]) and renders the actual empathy document in the
// same three-section structure as <EmpathyDocument /> in SlideKit.tsx.
//
// Source-of-truth shape — backend/main.py::_ensure_empathy:
//   { clip_id, scenario, scenario_label,
//     vision_report: { scene_summary, actions[], spatial_relationships? },
//     swarm_readings: { regions: { [region]: { reading, confidence, cite } } },
//     best_paragraph, polished_paragraph,
//     final_score,
//     round_trajectory: [{ round, score, paragraph_excerpt }],
//     per_region_attribution: { [region]: { candidate_match, target, justification? } },
//     falsification: { main_score, control_score, delta, verdict } }

import { use, useEffect, useState } from "react";
import { Kicker } from "../../components/SlideKit";
import RedDot from "../../components/RedDot";

type VisionReport = {
  scene_summary?: string;
  actions?: string[];
  spatial_relationships?: string[];
};

type RegionReading = { reading: string; confidence: string; cite: string | null };

type SwarmReadings = { regions: Record<string, RegionReading> };

type RoundTrajectoryEntry = { round: number; score: number; paragraph_excerpt: string };

type PerRegionAttribution = Record<
  string,
  { candidate_match: number; target: number; justification?: string }
>;

type Falsification = {
  main_score: number;
  control_score: number;
  delta: number;
  verdict: string;
};

type Empathy = {
  clip_id: string;
  scenario: string;
  scenario_label: string;
  vision_report: VisionReport;
  swarm_readings: SwarmReadings;
  best_paragraph: string;
  polished_paragraph: string | null;
  final_score: number;
  round_trajectory: RoundTrajectoryEntry[];
  per_region_attribution: PerRegionAttribution;
  falsification: Falsification;
};

const BACKEND_URL = "http://localhost:8000";

export default function EmpathyLive({ params }: { params: Promise<{ clipId: string }> }) {
  const { clipId } = use(params);
  const [doc, setDoc] = useState<Empathy | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`${BACKEND_URL}/demo/empathy/${clipId}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Empathy;
        if (!cancelled) setDoc(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "fetch failed");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [clipId]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-10 py-20">
        <div className="max-w-2xl flex flex-col gap-3">
          <Kicker>empathy / {clipId.toLowerCase()}</Kicker>
          <p className="sans text-sm smoke">
            could not load empathy document — is the backend running on localhost:8000?
          </p>
          <p className="kicker" style={{ color: "var(--mute)" }}>
            error · {error.toLowerCase()}
          </p>
        </div>
      </main>
    );
  }

  if (!doc) {
    return (
      <main className="min-h-screen flex items-center justify-center px-10 py-20">
        <div className="max-w-2xl flex flex-col gap-2">
          <Kicker>empathy / {clipId.toLowerCase()}</Kicker>
          <p className="kicker">loading empathy document…</p>
        </div>
      </main>
    );
  }

  const isIronside = doc.scenario === "ironside" || doc.scenario === "construction";
  const scenarioAccent = isIronside ? "var(--accent-deep)" : "var(--accent)";
  const heroParagraph = doc.polished_paragraph?.trim() || doc.best_paragraph || "";
  const visionActions = doc.vision_report.actions ?? [];
  const visionSummary = doc.vision_report.scene_summary ?? "";
  const spatial = doc.vision_report.spatial_relationships ?? [];
  const regionEntries = Object.entries(doc.swarm_readings?.regions ?? {});
  const attributionEntries = Object.entries(doc.per_region_attribution ?? {});
  const trajectory = doc.round_trajectory ?? [];

  return (
    <main className="min-h-screen flex justify-center px-6 md:px-12 py-16 md:py-20 relative">
      <RedDot top="6%" left="6%" />
      <div className="w-full max-w-3xl flex flex-col gap-10 enter">
        <header className="flex flex-col gap-3">
          <Kicker>empathy / {clipId.toLowerCase()}</Kicker>
          <h1
            className="display-mono ink text-3xl md:text-4xl leading-[1.0] lowercase"
            style={{ color: scenarioAccent }}
          >
            {doc.scenario_label.toLowerCase()}
          </h1>
          <p className="sans text-sm smoke max-w-xl">
            live document fetched from the empathy-layer engine. three sections — vision report,
            empathy paragraph, falsification evidence.
          </p>
        </header>

        {/* §A — Vision Report */}
        <section
          className="surface-card-feature flex flex-col gap-3"
          style={{ padding: "24px 28px" }}
        >
          <p className="kicker" style={{ color: scenarioAccent }}>
            §a · vision report
          </p>
          {visionSummary ? (
            <p className="mono text-sm smoke leading-relaxed">{visionSummary}</p>
          ) : null}
          {visionActions.length > 0 ? (
            <ul className="flex flex-col gap-1.5 mt-1">
              {visionActions.map((action, i) => (
                <li
                  key={`${i}-${action.slice(0, 24)}`}
                  className="mono text-sm smoke leading-relaxed"
                >
                  · {action}
                </li>
              ))}
            </ul>
          ) : null}
          {spatial.length > 0 ? (
            <div
              className="flex flex-col gap-1 pt-2"
              style={{ borderTop: "1px solid var(--hair)" }}
            >
              <p className="kicker">spatial relationships</p>
              <ul className="flex flex-col gap-1">
                {spatial.map((rel, i) => (
                  <li
                    key={`${i}-${rel.slice(0, 24)}`}
                    className="mono text-xs smoke leading-relaxed"
                  >
                    · {rel}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        {/* §B — Empathy Paragraph (hero) */}
        <section
          className="surface-card-feature flex flex-col gap-4"
          style={{ padding: "32px 36px" }}
        >
          <p className="kicker" style={{ color: scenarioAccent }}>
            §b · empathy layer
          </p>
          <p className="serif italic text-lg md:text-2xl ink leading-relaxed">{heroParagraph}</p>
          <div
            className="grid grid-cols-2 gap-4 pt-3"
            style={{ borderTop: "1px solid var(--hair)" }}
          >
            <div className="flex flex-col gap-1">
              <p className="kicker">brain-pattern similarity</p>
              <p className="numeral text-3xl md:text-4xl ink">{doc.final_score.toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="kicker">scenario</p>
              <p className="mono text-base ink lowercase">{doc.scenario}</p>
            </div>
          </div>
        </section>

        {/* §C — Falsification Evidence + per-region attribution + trajectory */}
        <section
          className="surface-card-feature flex flex-col gap-5"
          style={{ padding: "28px 32px" }}
        >
          <p className="kicker" style={{ color: scenarioAccent }}>
            §c · falsification evidence
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <p className="kicker">main score</p>
              <p className="numeral text-2xl ink">{doc.falsification.main_score.toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="kicker">control score</p>
              <p className="numeral text-2xl smoke">
                {doc.falsification.control_score.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="kicker">delta</p>
              <p className="numeral text-2xl" style={{ color: scenarioAccent }}>
                {doc.falsification.delta.toFixed(2)}
              </p>
            </div>
          </div>

          <p className="mono text-sm ink lowercase">
            verdict · {doc.falsification.verdict.toLowerCase()}
          </p>

          {attributionEntries.length > 0 ? (
            <div
              className="flex flex-col gap-2 pt-3"
              style={{ borderTop: "1px solid var(--hair)" }}
            >
              <p className="kicker">per-region attribution</p>
              <ul className="flex flex-col divide-y" style={{ borderColor: "var(--hair)" }}>
                {attributionEntries.map(([region, attr]) => (
                  <li key={region} className="grid grid-cols-12 gap-3 items-baseline py-2">
                    <p className="mono text-sm ink col-span-12 md:col-span-3 lowercase">
                      {region}
                    </p>
                    <p className="numeral text-sm smoke col-span-4 md:col-span-2">
                      {attr.candidate_match.toFixed(2)}
                    </p>
                    <p className="numeral text-sm smoke col-span-4 md:col-span-2">
                      target {attr.target.toFixed(2)}
                    </p>
                    <p className="sans text-xs smoke col-span-12 md:col-span-5 leading-relaxed">
                      {attr.justification ?? ""}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {regionEntries.length > 0 ? (
            <details className="flex flex-col gap-2">
              <summary className="kicker cursor-pointer" style={{ color: scenarioAccent }}>
                swarm readings · {regionEntries.length} regions
              </summary>
              <ul
                className="flex flex-col gap-3 mt-3 pt-3"
                style={{ borderTop: "1px solid var(--hair)" }}
              >
                {regionEntries.map(([region, r]) => (
                  <li key={region} className="flex flex-col gap-1">
                    <p className="kicker">
                      {region.toLowerCase()} · {r.confidence.toLowerCase()}
                    </p>
                    <p className="sans text-sm smoke leading-relaxed">{r.reading}</p>
                    {r.cite ? (
                      <p className="kicker" style={{ color: "var(--mute)" }}>
                        cite · {r.cite.toLowerCase()}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}

          {trajectory.length > 0 ? (
            <details className="flex flex-col gap-2">
              <summary className="kicker cursor-pointer" style={{ color: scenarioAccent }}>
                round trajectory · {trajectory.length} rounds
              </summary>
              <ul
                className="flex flex-col gap-2 mt-3 pt-3"
                style={{ borderTop: "1px solid var(--hair)" }}
              >
                {trajectory.map((step) => (
                  <li
                    key={step.round}
                    className="grid grid-cols-12 gap-3 items-baseline"
                  >
                    <p className="kicker col-span-2">round {step.round}</p>
                    <p className="numeral text-sm ink col-span-2">{step.score.toFixed(2)}</p>
                    <p className="sans text-xs smoke col-span-8 leading-relaxed">
                      {step.paragraph_excerpt}
                    </p>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </section>

        <p className="kicker" style={{ color: "var(--mute)" }}>
          source · localhost:8000/demo/empathy/{clipId.toLowerCase()}
        </p>
      </div>
    </main>
  );
}
