"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Chat, Doc, Folder, Shield } from "@/components/icons";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";
import { useLive } from "./use-live";

const sources = [
  {
    icon: Doc,
    place: "Handbook",
    title: "Billing policy v3",
    quote: "“Annual subscriptions may be refunded within 30 days of the renewal date.”",
    meta: "§4.2 · updated 3 days ago",
  },
  {
    icon: Folder,
    place: "Support wiki",
    title: "Refunds FAQ",
    quote: "“Monthly plans: no change to the existing 7-day window.”",
    meta: "Monthly plans · updated last week",
  },
  {
    icon: Chat,
    place: "#billing-ops",
    title: "Thread from Finance",
    quote: "“Anything over $5k still comes to us before it goes out.”",
    meta: "Pinned message · yesterday",
  },
];

export function CitedMock() {
  const { ref, live } = useLive();
  const [auto, setAuto] = useState(0);
  const [pinned, setPinned] = useState<number | null>(null);
  const active = pinned ?? auto;

  useEffect(() => {
    if (!live || pinned !== null) return;
    const id = window.setInterval(() => setAuto((i) => (i + 1) % sources.length), 2600);
    return () => window.clearInterval(id);
  }, [live, pinned]);

  const chip = (n: number) => (
    <button
      type="button"
      onMouseEnter={() => setPinned(n)}
      onMouseLeave={() => setPinned(null)}
      onFocus={() => setPinned(n)}
      onBlur={() => setPinned(null)}
      aria-label={`Source ${n + 1}: ${sources[n].title}`}
      className={cn(
        "mx-0.5 inline-flex h-[18px] min-w-[18px] -translate-y-px items-center justify-center rounded-md px-1 align-middle font-mono text-[10px] transition-colors duration-300",
        active === n ? "bg-iris text-ink-950" : "bg-white/[0.08] text-mist",
      )}
    >
      {n + 1}
    </button>
  );

  return (
    <div ref={ref} className="flex h-full min-h-[420px] flex-col gap-4 p-4 sm:p-5">
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
        <p className="mb-2 font-mono text-[10.5px] tracking-wide text-fog uppercase">Prism</p>
        <p className="text-[14px] leading-relaxed text-mist">
          <span className="text-snow">Annual plans are refundable for 30 days after renewal</span>
          {chip(0)}. Monthly plans keep their 7-day window{chip(1)}, and anything above $5,000 needs Finance
          {chip(2)}.
        </p>
      </div>

      <ul className="flex flex-1 flex-col gap-2">
        {sources.map((source, i) => {
          const Icon = source.icon;
          const on = active === i;
          return (
            <li
              key={source.title}
              onMouseEnter={() => setPinned(i)}
              onMouseLeave={() => setPinned(null)}
              className={cn(
                "rounded-2xl border p-3.5 transition-[border-color,background-color] duration-500",
                on ? "border-iris/40 bg-iris/[0.07]" : "border-white/[0.06] bg-white/[0.015]",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-[10.5px] transition-colors duration-500",
                    on ? "bg-iris text-ink-950" : "bg-white/[0.06] text-fog",
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-snow">{source.title}</p>
                  <p className="flex items-center gap-1.5 truncate text-[12px] text-fog">
                    <Icon className="size-3.5 shrink-0" />
                    {source.place}
                  </p>
                </div>
              </div>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: easeOutExpo }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-[12.5px] leading-relaxed text-mist">
                      <span className="border-l-2 border-iris/60 pl-2.5">{source.quote}</span>
                    </p>
                    <p className="mt-2 pl-3 font-mono text-[10px] tracking-wide text-fog uppercase">{source.meta}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.015] px-3.5 py-3">
        <span className="flex items-center gap-2 text-[12px] text-mist">
          <Shield className="size-4 text-sp-green" />
          All 3 sources visible to you
        </span>
        <span className="shrink-0 rounded-lg border border-white/10 px-2 py-1 font-mono text-[10px] tracking-wide text-fog uppercase">
          Copy
        </span>
      </div>
    </div>
  );
}
