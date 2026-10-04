"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Refresh } from "@/components/icons";
import { easeOutExpo } from "@/lib/motion";
import { useLive } from "./use-live";

const bars = [22, 30, 26, 38, 34, 46, 40, 52, 48, 61, 55, 64, 58, 70, 66, 78, 72, 84, 76, 88, 82, 94, 86, 100];
const steps = [3, 1, 4, 2, 5, 2, 3, 1];

const sources = [
  { name: "Handbook", detail: "1,204 pages", state: "synced", when: "12s ago" },
  { name: "Support wiki", detail: "3,881 articles", state: "syncing", when: "" },
  { name: "Ticket desk", detail: "18,240 tickets", state: "synced", when: "1m ago" },
];

export function SyncMock() {
  const { ref, inView, live } = useLive();
  const [count, setCount] = useState(48213);

  useEffect(() => {
    if (!live) return;
    let i = 0;
    const id = window.setInterval(() => {
      setCount((c) => c + steps[i % steps.length]);
      i += 1;
    }, 1500);
    return () => window.clearInterval(id);
  }, [live]);

  return (
    <div ref={ref} data-paused={!inView} className="flex h-full min-h-[270px] flex-col gap-4 p-4 sm:flex-row sm:p-5">
      <div className="flex flex-1 flex-col justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between font-mono text-[10.5px] tracking-wide text-fog uppercase">
          Documents indexed
          <span className="flex items-center gap-1.5 text-sp-green">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-sp-green" />
            Live
          </span>
        </div>
        <p className="mt-2 font-display text-[2.1rem] leading-none font-semibold tracking-[-0.03em] text-snow tabular-nums">
          {count.toLocaleString("en-US")}
        </p>
        <div aria-hidden="true" className="mt-4 flex h-16 items-end gap-[3px]">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className="flex-1 origin-bottom rounded-[2px] bg-linear-to-t from-iris-deep/50 to-iris"
              style={{ height: `${h}%`, opacity: 0.35 + (i / bars.length) * 0.65 }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: inView ? 1 : 0 }}
              transition={{ duration: 0.9, delay: inView ? i * 0.025 : 0, ease: easeOutExpo }}
            />
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] tracking-wide text-fog uppercase">Changes picked up · last 24h</p>
      </div>

      <ul className="flex flex-1 flex-col justify-center gap-2">
        {sources.map((s) => (
          <li key={s.name} className="rounded-xl border border-white/[0.06] bg-white/[0.015] px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[13px] text-snow">{s.name}</span>
              {s.state === "synced" ? (
                <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] text-sp-green uppercase">
                  <Check className="size-3.5" />
                  {s.when}
                </span>
              ) : (
                <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] text-iris uppercase">
                  <Refresh className="size-3.5 animate-[orbit_2.4s_linear_infinite]" />
                  Syncing
                </span>
              )}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-[11.5px] text-fog">{s.detail}</span>
              {s.state === "syncing" && (
                <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <span className="absolute inset-y-0 left-0 w-1/3 animate-[indeterminate_1.6s_ease-in-out_infinite] rounded-full bg-linear-to-r from-transparent via-iris to-transparent" />
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
