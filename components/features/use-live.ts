"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * For the little product mock-ups: they only animate while on screen,
 * and show their finished state when the visitor prefers reduced motion.
 */
export function useLive<T extends Element = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduced = usePrefersReducedMotion();
  return { ref, inView, reduced, live: inView && !reduced };
}
