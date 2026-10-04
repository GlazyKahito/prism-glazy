"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, Sparkle } from "@/components/icons";
import { easeOutExpo } from "@/lib/motion";
import { useLive } from "./use-live";

const QUESTION = "What changed in our refund policy this quarter?";
const SOURCES = ["Handbook", "Support wiki", "#billing-ops"];
const ANSWER = [
  { text: "Annual plans can now be refunded within 30 days of renewal, up from 14.", cite: 1 },
  { text: "Monthly plans are unchanged.", cite: 2 },
  { text: "Refunds above $5,000 still need sign-off from Finance.", cite: 3 },
];

type Phase = "idle" | "typing" | "searching" | "answer";

export function AskMock() {
  const { ref, live, reduced } = useLive();
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (!live) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };
    const run = (offset: number) => {
      let t = offset;
      at(t, () => {
        setTyped(0);
        setPhase("typing");
      });
      for (let i = 1; i <= QUESTION.length; i++) {
        t += QUESTION[i - 1] === " " ? 70 : 38;
        at(t, () => setTyped(i));
      }
      at((t += 450), () => setPhase("searching"));
      at((t += 1400), () => setPhase("answer"));
      at((t += 4600), () => run(0));
    };
    run(300);
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [live]);

  const shownTyped = reduced ? QUESTION.length : typed;
  const shownPhase: Phase = reduced ? "answer" : phase;

  return (
    <div ref={ref} className="relative flex h-full min-h-[310px] flex-col p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-1.5" aria-hidden="true">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-[10.5px] tracking-wide text-fog">prism · ask</span>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <Search className="size-4 shrink-0 text-iris" />
        <p className="min-w-0 flex-1 truncate text-[14px] text-snow sm:text-[15px]">
          {shownPhase === "idle" ? (
            <span className="text-fog">Ask Prism anything…</span>
          ) : (
            <>
              {QUESTION.slice(0, shownTyped)}
              {shownPhase === "typing" && (
                <span aria-hidden="true" className="ml-px inline-block h-[1.05em] w-px translate-y-[0.15em] animate-caret bg-snow" />
              )}
            </>
          )}
        </p>
        <kbd className="hidden rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-fog sm:inline">⌘K</kbd>
      </div>

      <div className="relative mt-4 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {shownPhase === "searching" && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="space-y-3"
            >
              <p className="font-mono text-[11px] tracking-wide uppercase shimmer-text">
                Reading {SOURCES.join(" · ")}
              </p>
              {[92, 78, 64].map((w) => (
                <div key={w} className="h-2.5 rounded-full bg-white/[0.06]" style={{ width: `${w}%` }} />
              ))}
            </motion.div>
          )}

          {shownPhase === "answer" && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
            >
              <div className="mb-2.5 flex items-center gap-2 font-mono text-[10.5px] tracking-wide text-fog uppercase">
                <Sparkle className="size-3.5 text-iris" />
                Answer · 3 sources · 1.4s
              </div>
              <p className="text-[13.5px] leading-relaxed text-mist sm:text-[14px]">
                {ANSWER.map((part, i) => (
                  <motion.span
                    key={part.cite}
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.35, duration: 0.6 }}
                  >
                    <span className="text-snow">{part.text}</span>
                    <sup className="mx-0.5 inline-flex h-4 min-w-4 -translate-y-px items-center justify-center rounded-[5px] bg-iris/20 px-1 font-mono text-[9.5px] text-iris">
                      {part.cite}
                    </sup>{" "}
                  </motion.span>
                ))}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
