"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type Variants,
} from "motion/react";
import { BEAM_IN_ANGLE, FAN_ANGLE, FAN_SPREAD, SPECTRUM, toDeg } from "@/lib/beam";
import {
  getIntroPhase,
  getSceneLevel,
  markAllLoaded,
  markLoaded,
  setIntroPhase,
  setSceneLevel,
  useIntroPhase,
  useLoadProgress,
} from "@/lib/intro";
import { easeInOutQuint, easeOutExpo } from "@/lib/motion";

/** Shortest the sequence may run, so the light has time to land. */
const MIN_MS = 1750;
/** Longest we wait for assets before letting the visitor in regardless. */
const MAX_MS = 6500;

function leaveIntro(fast: boolean) {
  if (getIntroPhase() !== "play") return;
  setIntroPhase("exit");
  const duration = fast ? 0.8 : 1.2;
  animate(getSceneLevel(), 1, {
    duration,
    ease: easeInOutQuint,
    onUpdate: setSceneLevel,
  });
  window.setTimeout(() => setIntroPhase("done"), duration * 1000 + 200);
}

const letters = "PRISM".split("");

const wordmark: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.5 } },
  out: { transition: { staggerChildren: 0.035 } },
};

const letter: Variants = { hidden: {}, show: {}, out: {} };

function channel(direction: -1 | 0 | 1): Variants {
  return {
    hidden: {
      opacity: 0,
      x: `${direction * 0.24}em`,
      y: direction === 0 ? "0.08em" : "0em",
      filter: "blur(14px)",
    },
    show: {
      opacity: 1,
      x: "0em",
      y: "0em",
      filter: "blur(0px)",
      transition: { duration: 1.15, ease: easeOutExpo },
    },
    out: {
      opacity: 0,
      x: `${direction * 0.32}em`,
      y: direction === 0 ? "-0.06em" : "0em",
      filter: "blur(10px)",
      transition: { duration: 0.55, ease: [0.4, 0, 1, 1] },
    },
  };
}

const channels = [
  { color: "#ff0000", variants: channel(-1) },
  { color: "#00ff00", variants: channel(0) },
  { color: "#0000ff", variants: channel(1) },
];

export function IntroOverlay() {
  const phase = useIntroPhase();
  const progress = useLoadProgress();
  const [fast, setFast] = useState(false);
  const started = useRef(0);
  const shown = useMotionValue(0);
  const percent = useTransform(shown, (v) => String(Math.round(v)).padStart(3, "0"));
  const bar = useTransform(shown, (v) => v / 100);

  // Real readiness signals; the 3D stage reports its own.
  useEffect(() => {
    started.current = performance.now();
    if (getIntroPhase() !== "play") return;

    document.fonts?.ready.then(() => markLoaded("fonts"));
    const onLoad = () => markLoaded("window");
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    const safety = window.setTimeout(markAllLoaded, MAX_MS);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(safety);
    };
  }, []);

  // Count up smoothly toward the real figure.
  useEffect(() => {
    const controls = animate(shown, progress, {
      duration: 0.65,
      ease: easeOutExpo,
    });
    return () => controls.stop();
  }, [progress, shown]);

  // Leave once everything is ready and the light has landed.
  useEffect(() => {
    if (phase !== "play" || progress < 100) return;
    const elapsed = performance.now() - started.current;
    const id = window.setTimeout(
      () => leaveIntro(false),
      Math.max(MIN_MS - elapsed, 700),
    );
    return () => window.clearTimeout(id);
  }, [phase, progress]);

  // Keep the page behind out of the tab order and pinned to the top.
  useEffect(() => {
    const page = document.getElementById("page");
    if (getIntroPhase() === "play") {
      page?.setAttribute("inert", "");
      window.scrollTo(0, 0);
    } else {
      page?.removeAttribute("inert");
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFast(true);
        leaveIntro(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  if (phase === "done") return null;

  const playing = phase === "play";
  const exitEase = easeInOutQuint;
  const sweep = { duration: fast ? 0.7 : 1.15, ease: exitEase };

  return (
    <>
      {/* Backdrop and the 2D light. The real 3D prism renders between the two layers. */}
      <motion.div
        aria-hidden="true"
        className="intro-layer fixed inset-0 z-[60] overflow-hidden bg-ink-950 [--px:50%] [--py:25svh] lg:[--px:70%] lg:[--py:50svh]"
        style={{ pointerEvents: playing ? "auto" : "none" }}
        initial={false}
        animate={{ opacity: playing ? 1 : 0 }}
        transition={{ duration: fast ? 0.55 : 1, delay: fast ? 0 : 0.2, ease: exitEase }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_var(--px)_var(--py),rgba(125,108,255,0.14),transparent_70%)]" />

        {/* Incoming white beam */}
        <motion.div
          className="absolute left-0 h-28 -translate-y-1/2 origin-right"
          style={{ top: "var(--py)", width: "var(--px)" }}
          initial={false}
          animate={{
            rotate: playing ? 0 : -toDeg(BEAM_IN_ANGLE),
            opacity: playing ? 1 : 0,
          }}
          transition={{ rotate: sweep, opacity: { duration: fast ? 0.5 : 0.9, delay: fast ? 0 : 0.3 } }}
        >
          <motion.div
            className="absolute inset-0 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.05, delay: 0.12, ease: easeOutExpo }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(100%_50%_at_100%_50%,rgba(255,255,255,0.2),rgba(255,255,255,0.04)_55%,transparent_75%)]" />
            <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-linear-to-r from-transparent via-white/50 to-white shadow-[0_0_14px_rgba(255,255,255,0.65)]" />
          </motion.div>
        </motion.div>

        {/* Dispersed spectrum: its height is set by the spread angle. */}
        <motion.div
          className="absolute -translate-y-1/2 origin-left"
          style={{
            left: "var(--px)",
            top: "var(--py)",
            width: "calc(100% - var(--px) + 12vw)",
            aspectRatio: `1 / ${(2 * Math.tan(FAN_SPREAD)).toFixed(4)}`,
          }}
          initial={false}
          animate={{
            rotate: playing ? 0 : toDeg(FAN_ANGLE),
            opacity: playing ? 1 : 0,
          }}
          transition={{ rotate: sweep, opacity: { duration: fast ? 0.5 : 0.9, delay: fast ? 0 : 0.3 } }}
        >
          <motion.div
            className="absolute inset-0 origin-left"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.85, ease: easeOutExpo }}
            style={{ clipPath: "polygon(0 48.6%, 100% 0, 100% 100%, 0 51.4%)" }}
          >
            <div
              className="absolute inset-0 opacity-80 [mask-image:linear-gradient(90deg,#000_8%,rgba(0,0,0,0.55)_45%,transparent)]"
              style={{ backgroundImage: `linear-gradient(180deg, ${SPECTRUM.join(", ")})` }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-white/90 via-white/0 via-[16%] to-transparent" />
          </motion.div>
        </motion.div>

        {/* Where the light meets the glass */}
        <motion.div
          className="absolute size-[44vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.5),rgba(174,164,255,0.16)_28%,transparent_62%)]"
          style={{ left: "var(--px)", top: "var(--py)" }}
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1, opacity: playing ? 1 : 0 }}
          transition={{ duration: 1.1, delay: 0.75, ease: easeOutExpo }}
        />
      </motion.div>

      {/* Foreground: wordmark, progress and controls. */}
      <div className="intro-layer pointer-events-none fixed inset-0 z-[80]">
        <div className="absolute top-[63svh] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center lg:top-1/2 lg:left-[41%]">
          <span className="sr-only">Prism</span>
          <motion.p
            aria-hidden="true"
            className="flex font-display text-[19vw] leading-none font-semibold tracking-[0.02em] lg:text-[min(8.6vw,8.5rem)]"
            initial="hidden"
            animate={playing ? "show" : "out"}
            variants={wordmark}
          >
            {letters.map((char, i) => (
              <motion.span key={i} variants={letter} className="relative inline-block">
                <span className="invisible">{char}</span>
                {channels.map((c) => (
                  <motion.span
                    key={c.color}
                    variants={c.variants}
                    className="absolute inset-0 mix-blend-screen"
                    style={{ color: c.color }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            className="mt-7 flex items-center gap-4 lg:mt-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: playing ? 1 : 0, y: playing ? 0 : -6 }}
            transition={{ duration: 0.8, delay: playing ? 0.9 : 0, ease: easeOutExpo }}
          >
            <div
              role="progressbar"
              aria-label="Loading Prism"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-px w-36 overflow-hidden bg-white/12 sm:w-44"
            >
              <motion.div className="h-full origin-left bg-spectrum" style={{ scaleX: bar }} />
            </div>
            <span className="w-12 font-mono text-[12px] tracking-[0.12em] text-mist tabular-nums">
              <motion.span>{percent}</motion.span>%
            </span>
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-x-5 bottom-5 flex items-end justify-between font-mono text-[10.5px] tracking-[0.2em] text-fog uppercase sm:inset-x-8 sm:bottom-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: playing ? 1 : 0 }}
          transition={{ duration: 0.8, delay: playing ? 0.4 : 0 }}
        >
          <span>Light in · Answers out</span>
          <span className="hidden sm:inline">A concept by GLAZY</span>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => {
            setFast(true);
            leaveIntro(true);
          }}
          className="pointer-events-auto absolute top-4 right-4 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 font-mono text-[10.5px] tracking-[0.18em] text-mist uppercase backdrop-blur-md transition-colors hover:border-white/25 hover:text-snow sm:top-6 sm:right-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: playing ? 1 : 0 }}
          transition={{ duration: 0.6, delay: playing ? 0.3 : 0 }}
          tabIndex={playing ? 0 : -1}
        >
          Skip intro
          <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-[9.5px] tracking-normal text-fog">
            Esc
          </kbd>
        </motion.button>
      </div>
    </>
  );
}
