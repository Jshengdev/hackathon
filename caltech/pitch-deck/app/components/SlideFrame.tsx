"use client";

import type { ReactNode } from "react";
import { forwardRef } from "react";

type Props = {
  id: string;
  index: number;
  total: number;
  children: ReactNode;
  padded?: boolean;
};

const SlideFrame = forwardRef<HTMLElement, Props>(function SlideFrame(
  { id, index, total, children, padded = true },
  ref,
) {
  return (
    <section
      id={id}
      ref={ref}
      className="relative w-full overflow-hidden"
      data-index={index}
      style={{ minHeight: "100vh" }}
    >
      <div
        className={`relative mx-auto w-full max-w-[1440px] ${padded ? "px-10 md:px-16 lg:px-24" : ""} py-16 md:py-20 min-h-screen flex flex-col justify-center`}
      >
        {children}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-5 right-6 sans text-xs tracking-widest text-mute select-none"
        style={{ color: "var(--mute)" }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </section>
  );
});

export default SlideFrame;
