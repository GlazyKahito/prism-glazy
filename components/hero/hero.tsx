"use client";

import { motion, type Variants } from "motion/react";
import { ArrowRight } from "@/components/icons";
import { useIntroPhase } from "@/lib/intro";
import { easeOutExpo, fadeUp } from "@/lib/motion";
import { HeroStage } from "./hero-stage";
import { TrustedRow } from "./trusted-row";

const lines = [
  { words: ["Messy", "docs", "in."], spectral: false },
  { words: ["Clear", "answers", "out."], spectral: true },
] as const;

// Each word of the spectral line carries its own slice of the gradient,
// so the colour runs continuously across the line.
const spectralSlices = [
  "linear-gradient(100deg,#ffb3c0,#ffc999 60%,#ffe2a0)",
  "linear-gradient(100deg,#ffe9a6,#b5f5d2 45%,#a9e6ff)",
  "linear-gradient(100deg,#b4dcff,#c3b8ff 55%,#e2c4ff)",
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
};

const headline: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.42em", filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 1.15, ease: easeOutExpo },
  },
};

export function Hero() {
  const phase = useIntroPhase();
  const state = phase === "play" ? "hidden" : "show";

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden"
    >
      <HeroBackdrop />
      <HeroStage />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col px-5 sm:px-8">
        <div className="pt-[calc(50svh-2.5rem)] lg:flex lg:flex-1 lg:items-center lg:pt-24">
          <motion.div
            initial="hidden"
            animate={state}
            variants={container}
            className="max-w-[36rem] lg:max-w-[43rem]"
          >
            <motion.a
              variants={fadeUp}
              href="#features"
              className="group mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1 pr-3.5 pl-1 text-[13px] text-mist backdrop-blur-md transition-colors hover:border-white/20 hover:text-snow"
            >
              <span className="rounded-full bg-white/90 px-2 py-0.5 font-mono text-[10.5px] tracking-wide text-ink-950 uppercase">
                Concept
              </span>
              Cited, permission-aware answers
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </motion.a>

            <motion.h1
              id="hero-title"
              variants={headline}
              className="font-display text-[clamp(2.4rem,8vw,4.25rem)] leading-[0.96] font-semibold tracking-[-0.04em] text-snow lg:text-[clamp(2.4rem,min(5.6vw,9.8vh),5.6rem)]"
            >
              {lines.map((line, lineIndex) => (
                <span key={lineIndex} className="block">
                  {line.words.map((text, i) => (
                    <span key={text} className="inline-block whitespace-pre">
                      <motion.span
                        variants={word}
                        className="inline-block pb-[0.06em]"
                        style={
                          line.spectral
                            ? {
                                backgroundImage: spectralSlices[i],
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent",
                              }
                            : undefined
                        }
                      >
                        {text}
                      </motion.span>
                      {i < line.words.length - 1 ? " " : ""}
                    </span>
                  ))}
                </span>
              ))}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-[33rem] text-[1.05rem] leading-relaxed text-mist sm:text-lg"
            >
              Prism reads your wikis, drives, tickets and threads, then answers
              in plain language. Every sentence links to the paragraph it came
              from, and nobody sees a source they couldn&apos;t open themselves.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#pricing"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-snow px-6 text-[15px] font-semibold text-ink-950 shadow-[0_10px_40px_-10px_rgba(174,164,255,0.75)] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_50px_-12px_rgba(174,164,255,0.95)]"
              >
                Start free trial
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#how"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 text-[15px] font-medium text-snow backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.08]"
              >
                See how it works
              </a>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-5 font-mono text-[11.5px] tracking-wide text-fog uppercase"
            >
              14-day trial · No card required
            </motion.p>
          </motion.div>
        </div>

        <TrustedRow state={state} />
      </div>
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_72%_42%,rgba(125,108,255,0.16),transparent_70%),radial-gradient(40%_40%_at_10%_90%,rgba(90,215,255,0.06),transparent_70%)]" />
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(70%_60%_at_60%_40%,#000,transparent_75%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-ink-950" />
    </div>
  );
}
