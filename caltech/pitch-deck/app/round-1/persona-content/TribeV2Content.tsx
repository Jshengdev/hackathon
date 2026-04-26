"use client";

// SLIDE 05 — TRIBE V2 content. The brain encoder explainer.
// Universal across personas. Source: technical PRD v2.1 + Meta FAIR docs.

import { Kicker } from "../../components/SlideKit";

export default function TribeV2Content() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
      <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
        <Kicker>the unlock · what is tribe v2</Kicker>
        <h2 className="display-mono text-5xl md:text-7xl leading-[0.95] lowercase">
          <span className="ink">meta shipped</span>
          <br />
          <span className="grad">a brain encoder.</span>
        </h2>
        <p className="sans text-base md:text-lg smoke max-w-xl leading-relaxed">
          tribe v2 is a model from meta fair (the research lab behind llama).
          feed it any video, sound, or text — and it predicts the brain
          pattern that brain would produce.{" "}
          <span className="ink">no scanner needed.</span>
        </p>
        <p className="sans text-sm smoke max-w-xl leading-relaxed">
          trained on real brain recordings from ~25 human subjects across
          thousands of hours of video. open-source on huggingface. the same
          machinery corporations already use for engagement research, sitting
          in public.
        </p>
        <p className="mono italic text-base smoke">
          for the first time, every video has a brain attached to it.
        </p>
      </div>
      <div className="lg:col-span-5 justify-self-end">
        <div
          className="surface-card-feature flex flex-col gap-4"
          style={{ padding: "28px 32px", minWidth: 360 }}
        >
          <p className="kicker" style={{ color: "var(--accent)" }}>
            tribe v2 · meta fair · 2026
          </p>
          <p className="numeral text-5xl ink">~20K</p>
          <p className="kicker">cortical points predicted per second</p>
          <div className="rule" />
          <p className="mono text-sm smoke">input: video / sound / text</p>
          <p className="mono text-sm smoke">output: brain activation</p>
          <p className="mono text-sm smoke">runtime: pre-rendered offline</p>
          <p className="mono text-sm" style={{ color: "var(--accent)" }}>
            license: cc-by-nc-4.0
          </p>
          <div className="rule" />
          <p className="kicker">our role: invert it.</p>
        </div>
      </div>
    </div>
  );
}
