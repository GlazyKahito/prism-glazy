"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "@/components/icons";
import { easeOutExpo } from "@/lib/motion";
import { useLive } from "./use-live";

export function UnsureMock() {
  const { ref, inView, reduced } = useLive();
  const on = inView || reduced;

  return (
    <div ref={ref} className="flex h-full min-h-[270px] flex-col justify-center gap-3 p-4 sm:p-6">
      <motion.div
        className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-white/[0.07] px-4 py-2.5 text-[13.5px] text-snow"
        initial={{ opacity: 0, y: 10 }}
        animate={on ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: easeOutExpo }}
      >
        Who signed the 2019 freight contract?
      </motion.div>

      <motion.div
        className="max-w-[92%] rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.025] p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={on ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.5, ease: easeOutExpo }}
      >
        <p className="text-[13.5px] leading-relaxed text-mist">
          <span className="text-snow">I can&apos;t confirm that.</span> The only match is an unsigned draft, so
          I won&apos;t guess a name.
        </p>

        <div className="mt-3.5 flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-wide text-fog uppercase">Confidence</span>
          <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
            <motion.span
              className="absolute inset-y-0 left-0 origin-left rounded-full bg-linear-to-r from-sp-red to-sp-orange"
              style={{ width: "24%" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: on ? 1 : 0 }}
              transition={{ duration: 1.2, delay: 1, ease: easeOutExpo }}
            />
          </span>
          <span className="font-mono text-[11px] text-sp-orange tabular-nums">24%</span>
        </div>

        <motion.p
          className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-snow"
          initial={{ opacity: 0 }}
          animate={on ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          Ask the owner: Legal Ops
          <ArrowUpRight className="size-3.5 text-iris" />
        </motion.p>
      </motion.div>
    </div>
  );
}
