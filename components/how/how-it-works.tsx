"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { Check } from "@/components/icons";
import { Reveal, RevealItem } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";
import { AnswerPanel, ConnectPanel, IndexPanel } from "./panels";

const steps = [
  {
    title: "Connect your sources",
    body: "Point Prism at the places your team already writes: wikis, drives, ticket queues, chat and email. Connectors are read-only and can be revoked in one click.",
    points: ["Set up in minutes, nothing to migrate", "Read-only by design", "Pick exactly which spaces are included"],
    label: "Connect",
    Panel: ConnectPanel,
  },
  {
    title: "Prism maps knowledge and access",
    body: "Every document is split into passages and tagged with who is allowed to see it. Duplicates are merged and old versions retired, so the freshest source wins.",
    points: ["Permission-aware index", "Duplicate and stale-copy detection", "Changes re-indexed within minutes"],
    label: "Index",
    Panel: IndexPanel,
  },
  {
    title: "Ask anywhere, get cited answers",
    body: "Ask from the web app, your team chat or the browser sidebar. Answers arrive in seconds with a citation on every sentence, and anything uncertain is flagged.",
    points: ["Web, chat and browser", "A citation on every sentence", "Low-confidence answers flagged"],
    label: "Answer",
    Panel: AnswerPanel,
  },
];

function PanelFrame({
  label,
  index,
  children,
  className,
}: {
  label: string;
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-ink-900/80 p-2 shadow-[0_40px_120px_-40px_rgba(125,108,255,0.45)]",
        className,
      )}
    >
      <div className="flex items-center justify-between px-3 pt-1.5 pb-2.5" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
        </span>
        <span className="font-mono text-[10.5px] tracking-[0.16em] text-fog uppercase">
          Step {String(index + 1).padStart(2, "0")} · {label}
        </span>
      </div>
      <div className="relative min-h-[22rem] rounded-[22px] border border-white/[0.05] bg-ink-950/60 p-4 sm:p-5 lg:h-[calc(100%-2.25rem)]">
        {children}
      </div>
    </div>
  );
}

/** On small screens each step carries its own panel, animating as it scrolls in. */
function InlinePanel({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const { Panel, label } = steps[index];
  return (
    <div ref={ref} className="mt-8 lg:hidden">
      <PanelFrame label={label} index={index}>
        <Panel active={inView} />
      </PanelFrame>
    </div>
  );
}

export function HowItWorks() {
  const track = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start center", "end center"],
  });
  const rail = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length)));
    setActive(next);
  });

  const ActivePanel = steps[active].Panel;

  return (
    <section id="how" aria-labelledby="how-title" className="relative py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/3 h-[60%] bg-[radial-gradient(50%_50%_at_75%_50%,rgba(125,108,255,0.10),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="how-title"
          align="left"
          eyebrow="How it works"
          title={
            <>
              From scattered files to{" "}
              <span className="text-spectrum">trusted answers</span> in three steps.
            </>
          }
          lede="No new place to write things down. Prism learns from what already exists and keeps learning as it changes."
        />

        <div className="mt-16 lg:mt-20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:gap-20">
          <ol ref={track} className="relative">
            <div aria-hidden="true" className="absolute top-3 bottom-3 left-[17px] hidden w-px bg-white/[0.08] lg:block">
              <motion.div
                className="h-full w-full origin-top bg-linear-to-b from-sp-red via-sp-cyan to-sp-violet"
                style={{ scaleY: rail }}
              />
            </div>

            {steps.map((step, i) => (
              <li
                key={step.title}
                className="relative pb-20 last:pb-0 lg:flex lg:min-h-[64vh] lg:items-center lg:pb-0 lg:pl-16"
                aria-current={active === i ? "step" : undefined}
              >
                <Reveal stagger={0.08} amount={0.4} className="relative w-full">
                  <RevealItem className="mb-5 flex items-center gap-4 lg:absolute lg:top-0 lg:-left-16 lg:mb-0">
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full border font-mono text-[11px] transition-all duration-500",
                        active === i
                          ? "border-white/40 bg-snow text-ink-950 shadow-[0_0_30px_-4px_rgba(174,164,255,0.8)]"
                          : "border-white/12 bg-ink-900 text-mist",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.2em] text-fog uppercase lg:hidden">
                      {step.label}
                    </span>
                  </RevealItem>
                  <RevealItem
                    as="h3"
                    variant="soft"
                    className="font-display text-[clamp(1.7rem,2.8vw,2.5rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-snow"
                  >
                    {step.title}
                  </RevealItem>
                  <RevealItem as="p" className="mt-4 max-w-lg text-[1.02rem] leading-relaxed text-mist">
                    {step.body}
                  </RevealItem>
                  <RevealItem as="ul" className="mt-6 space-y-2.5">
                    {step.points.map((point) => (
                      <li key={point} className="flex items-center gap-3 text-[15px] text-snow/90">
                        <span className="flex size-5 items-center justify-center rounded-full bg-white/[0.06] text-iris">
                          <Check className="size-3" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </RevealItem>
                  <InlinePanel index={i} />
                </Reveal>
              </li>
            ))}
          </ol>

          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-15.5rem)] h-[31rem]">
              <PanelFrame label={steps[active].label} index={active} className="h-full">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    className="h-full"
                    initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                    transition={{ duration: 0.5, ease: easeOutExpo }}
                  >
                    <ActivePanel active />
                  </motion.div>
                </AnimatePresence>
              </PanelFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
