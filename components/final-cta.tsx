"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "@/components/icons";
import { Reveal, RevealItem } from "@/components/reveal";
import { easeOutExpo } from "@/lib/motion";
import { site } from "@/lib/site";

export function FinalCta() {
  const [sent, setSent] = useState(false);

  return (
    <section id="cta" aria-labelledby="cta-title" className="relative px-3 py-16 sm:px-5 sm:py-24">
      <Reveal
        stagger={0.1}
        amount={0.3}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-white/[0.08] bg-ink-900 px-6 py-20 text-center sm:px-12 sm:py-28"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_0%,rgba(125,108,255,0.28),transparent_70%)]" />
          <div className="absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-white/60 to-transparent" />
          <div className="absolute top-0 left-1/2 h-[140%] w-[140%] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_150deg,rgba(255,92,124,0.10)_160deg,rgba(255,221,102,0.10)_170deg,rgba(110,242,176,0.10)_180deg,rgba(85,212,255,0.10)_190deg,rgba(189,138,255,0.10)_200deg,transparent_210deg)]" />
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(60%_60%_at_50%_30%,#000,transparent)]" />
        </div>

        <div className="relative">
          <RevealItem as="p" className="font-mono text-[11px] tracking-[0.2em] text-mist uppercase">
            Ready when you are
          </RevealItem>
          <RevealItem
            as="h2"
            variant="soft"
            id="cta-title"
            className="mx-auto mt-5 max-w-4xl font-display text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance text-snow"
          >
            Your docs already know the answer.{" "}
            <span className="text-spectrum">Let your team find it.</span>
          </RevealItem>
          <RevealItem as="p" className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-mist sm:text-lg">
            Connect a few sources, ask your first question and see where every word of the answer came from.
          </RevealItem>

          <RevealItem className="mx-auto mt-10 max-w-md">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="sent"
                  role="status"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: easeOutExpo }}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-5 text-left"
                >
                  <p className="flex items-center gap-2 text-[15px] font-medium text-snow">
                    <Check className="size-4 text-sp-green" />
                    Thanks, you&apos;re on the list.
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-mist">
                    Prism is a concept, so no email was sent. Want a product site like this one?{" "}
                    <a
                      href={site.studio.url}
                      className="text-snow underline decoration-white/30 underline-offset-4 hover:decoration-white"
                    >
                      Talk to {site.studio.name}
                    </a>
                    .
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSent(true);
                  }}
                  className="flex flex-col gap-2 rounded-[28px] border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-md sm:flex-row sm:rounded-full"
                >
                  <label htmlFor="cta-email" className="sr-only">
                    Work email
                  </label>
                  <input
                    id="cta-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="h-12 min-w-0 flex-1 rounded-full bg-transparent px-5 text-[15px] text-snow placeholder:text-fog focus:outline-none focus-visible:ring-2 focus-visible:ring-iris/70"
                  />
                  <button
                    type="submit"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-snow px-6 text-[15px] font-semibold text-ink-950 transition hover:bg-white hover:shadow-[0_12px_40px_-12px_rgba(174,164,255,0.9)]"
                  >
                    Get early access
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </RevealItem>

          <RevealItem as="p" className="mt-5 font-mono text-[11px] tracking-wide text-fog uppercase">
            Free for up to 5 people · Set up in minutes
          </RevealItem>
        </div>
      </Reveal>
    </section>
  );
}
