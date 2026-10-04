"use client";

import { motion, type Variants } from "motion/react";
import { easeOutExpo } from "@/lib/motion";

// Fictional teams, drawn as type. No real company marks.
const marks = [
  { name: "quillstack", className: "font-display font-semibold tracking-[-0.04em] lowercase" },
  { name: "ORBITWELL", className: "font-mono text-[0.82em] tracking-[0.28em]" },
  { name: "Fernhollow", className: "font-sans italic font-medium tracking-[-0.01em]" },
  { name: "tidewright", className: "font-display font-light tracking-[0.02em] lowercase" },
  { name: "PINEGRID", className: "font-display font-bold tracking-[0.06em]" },
  { name: "Vellum & Vine", className: "font-sans font-semibold tracking-[-0.03em]" },
];

const row: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 1.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
};

export function TrustedRow({ state }: { state: "hidden" | "show" }) {
  return (
    <motion.div
      initial="hidden"
      animate={state}
      variants={row}
      className="mt-14 pb-10 lg:mt-0 lg:pb-12"
    >
      <motion.p
        variants={item}
        className="mb-5 font-mono text-[11px] tracking-[0.18em] text-fog uppercase"
      >
        Trusted by teams who live in their docs
      </motion.p>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:gap-x-12">
        {marks.map((mark) => (
          <motion.li
            key={mark.name}
            variants={item}
            className={`text-[1.05rem] text-snow/55 transition-colors duration-300 hover:text-snow/90 sm:text-lg ${mark.className}`}
          >
            {mark.name}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
