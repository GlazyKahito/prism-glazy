"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Alert, Check, Doc, Lock } from "@/components/icons";
import { cn } from "@/lib/cn";
import { useLive } from "./use-live";

const docs = [
  { title: "Onboarding guide", team: "Everyone", open: true },
  { title: "Q3 board deck", team: "Leadership", open: false },
  { title: "Salary bands 2026", team: "People team", open: false },
];

export function PermissionsMock() {
  const { ref, live } = useLive();
  const [enforced, setEnforced] = useState(true);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!live || touched) return;
    const id = window.setInterval(() => setEnforced((v) => !v), 2800);
    return () => window.clearInterval(id);
  }, [live, touched]);

  return (
    <div ref={ref} className="flex h-full min-h-[270px] flex-col p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[12.5px] text-mist">
          <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-full bg-linear-to-br from-sp-cyan/70 to-sp-violet/70 font-mono text-[10px] text-ink-950">
            C
          </span>
          Asking as <span className="text-snow">Contractor</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enforced}
          aria-label="Respect source permissions"
          onClick={() => {
            setTouched(true);
            setEnforced((v) => !v);
          }}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-500",
            enforced ? "border-sp-green/40 bg-sp-green/25" : "border-white/15 bg-white/[0.08]",
          )}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
            className={cn(
              "absolute size-[18px] rounded-full shadow",
              enforced ? "right-[3px] bg-sp-green" : "left-[3px] bg-mist",
            )}
          />
        </button>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {docs.map((doc) => {
          const hidden = !doc.open && enforced;
          const exposed = !doc.open && !enforced;
          return (
            <li
              key={doc.title}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-500",
                exposed ? "border-sp-orange/30 bg-sp-orange/[0.06]" : "border-white/[0.06] bg-white/[0.015]",
              )}
            >
              <Doc className={cn("size-4 shrink-0", hidden ? "text-fog/60" : "text-mist")} />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-[13px] transition-[filter,color] duration-500",
                  hidden ? "text-fog blur-[3px] select-none" : "text-snow",
                )}
              >
                {doc.title}
              </span>
              <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] tracking-wide text-fog uppercase">
                {hidden ? <Lock className="size-3.5" /> : null}
                {doc.team}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-4" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={enforced ? "on" : "off"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex items-center gap-2 text-[12.5px]",
              enforced ? "text-sp-green" : "text-sp-orange",
            )}
          >
            {enforced ? <Check className="size-4" /> : <Alert className="size-4" />}
            {enforced
              ? "2 restricted sources left out of this answer"
              : "Without permissions, this answer would quote 2 private docs"}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
