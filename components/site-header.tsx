"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Close, Menu } from "@/components/icons";
import { Wordmark } from "@/components/logo";
import { cn } from "@/lib/cn";
import { useIntroPhase } from "@/lib/intro";
import { easeOutExpo } from "@/lib/motion";
import { nav } from "@/lib/site";

export function SiteHeader() {
  const phase = useIntroPhase();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={phase === "play" ? { opacity: 0, y: -16 } : { opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: phase === "play" ? 0 : 0.45, ease: easeOutExpo }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <div
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border pr-2 pl-4 transition-[background-color,border-color,box-shadow] duration-500 sm:pl-5",
          scrolled || open
            ? "border-white/10 bg-ink-900/70 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <a href="#top" aria-label="Prism, back to top" className="rounded-full">
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3.5 py-2 text-[14px] text-mist transition-colors hover:bg-white/[0.06] hover:text-snow"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href="#cta"
            className="hidden rounded-full px-3.5 py-2 text-[14px] text-mist transition-colors hover:text-snow sm:inline-flex"
          >
            Book a demo
          </a>
          <a
            href="#pricing"
            className="inline-flex h-10 items-center rounded-full bg-snow px-4 text-[14px] font-semibold text-ink-950 transition hover:bg-white"
          >
            Get started
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-full text-snow transition-colors hover:bg-white/[0.08] md:hidden"
          >
            {open ? <Close className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="mx-auto mt-2 max-w-6xl origin-top rounded-3xl border border-white/10 bg-ink-900/90 p-2 backdrop-blur-xl md:hidden"
          >
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3.5 font-display text-lg text-snow transition-colors hover:bg-white/[0.06]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#cta"
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3.5 font-display text-lg text-snow transition-colors hover:bg-white/[0.06]"
                >
                  Book a demo
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
