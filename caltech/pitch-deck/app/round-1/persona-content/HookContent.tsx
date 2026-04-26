"use client";

// SLIDE 02 — HOOK content. AI is a black box · your taste is your taste (ironic)
// Universal across personas. Verbatim from yappage Msg 09–10.

import { Kicker } from "../../components/SlideKit";

export default function HookContent() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
        <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
          <Kicker>the hook · the black box</Kicker>
          <h2 className="display-mono text-5xl md:text-7xl leading-[0.95] lowercase">
            <span className="ink">ai is a</span>{" "}
            <span className="grad">black box.</span>
            <br />
            <span className="ink">your taste is your taste.</span>
          </h2>
          <p className="sans text-base md:text-lg smoke max-w-xl leading-relaxed">
            algorithmic personalization sells you convenience. the price is
            your privacy — and eventually your humanity. the things you consume
            aren&apos;t things you chose. you converge to the best average they
            engineered for.
          </p>
          <p className="sans text-sm smoke max-w-xl leading-relaxed">
            writers using chatgpt all converge to the same essay. a manager
            chatgpts the best way to organize their team and slots every worker
            into the same one-size-fits-all box. you can&apos;t see any of it.
          </p>
        </div>
        <div className="lg:col-span-5 justify-self-end">
          <div
            className="surface-card-feature flex flex-col gap-3"
            style={{ padding: "28px 32px", minWidth: 360 }}
          >
            <p className="kicker" style={{ color: "var(--accent)" }}>
              what happens in the dark
            </p>
            <p className="mono text-sm smoke">you see content →</p>
            <p className="mono text-sm smoke">your brain fires →</p>
            <p className="mono text-sm smoke">the algorithm predicts →</p>
            <p className="mono text-sm" style={{ color: "var(--red)" }}>
              more of that gets pushed.
            </p>
            <div className="rule" />
            <p className="kicker">you never see the loop.</p>
          </div>
        </div>
      </div>
    </>
  );
}
