"use client";

import { motion, type Variants } from "motion/react";
import {
  ArrowUp,
  Chat,
  Check,
  Code,
  Doc,
  Folder,
  Mail,
  Sparkle,
  Ticket,
} from "@/components/icons";
import { PrismMark } from "@/components/logo";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";

type PanelProps = { active: boolean };

const list: Variants = {
  off: {},
  on: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};

const rise: Variants = {
  off: { opacity: 0, y: 14 },
  on: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
};

/* ------------------------------------------------------------------ */

const sources = [
  { name: "Handbook", icon: Doc },
  { name: "Shared drive", icon: Folder },
  { name: "Ticket desk", icon: Ticket },
  { name: "Team chat", icon: Chat },
  { name: "Inbox", icon: Mail },
  { name: "Code", icon: Code },
];

export function ConnectPanel({ active }: PanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10.5px] tracking-[0.16em] text-fog uppercase">Sources</p>
        <p className="font-mono text-[10.5px] tracking-[0.16em] text-sp-green uppercase">6 of 6 connected</p>
      </div>
      <motion.ul
        className="mt-4 grid flex-1 grid-cols-2 gap-2.5 sm:grid-cols-3"
        initial="off"
        animate={active ? "on" : "off"}
        variants={list}
      >
        {sources.map((source) => {
          const Icon = source.icon;
          return (
            <motion.li
              key={source.name}
              variants={rise}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 lg:gap-6"
            >
              <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-ink-800 text-mist">
                <Icon className="size-[18px]" />
              </span>
              <span>
                <span className="block text-[13.5px] text-snow">{source.name}</span>
                <span className="mt-1 flex items-center gap-1 font-mono text-[10px] tracking-wide text-sp-green uppercase">
                  <Check className="size-3.5" />
                  Connected
                </span>
              </span>
            </motion.li>
          );
        })}
      </motion.ul>
      <p className="mt-4 font-mono text-[10.5px] tracking-[0.16em] text-fog uppercase">
        Read-only access · Revocable any time
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const incoming = ["Billing policy v3.docx", "Refunds FAQ", "Laptop request flow", "Q3 board deck"];
const outputs = [
  { label: "Passages", value: "48,210", width: "92%", color: "from-sp-red to-sp-orange" },
  { label: "Access rules", value: "1,312", width: "64%", color: "from-sp-yellow to-sp-green" },
  { label: "Duplicates merged", value: "2,045", width: "46%", color: "from-sp-cyan to-sp-violet" },
];

export function IndexPanel({ active }: PanelProps) {
  return (
    <div className="flex h-full flex-col">
      <p className="font-mono text-[10.5px] tracking-[0.16em] text-fog uppercase">Building the index</p>
      <div className="mt-4 flex flex-1 flex-col items-stretch gap-5 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <motion.ul
          initial="off"
          animate={active ? "on" : "off"}
          variants={list}
          className="grid grid-cols-2 gap-2 sm:flex sm:flex-col"
        >
          {incoming.map((name) => (
            <motion.li
              key={name}
              variants={rise}
              className="flex items-center gap-2 truncate rounded-xl border border-white/[0.07] bg-white/[0.025] px-2.5 py-2 text-[12px] text-mist"
            >
              <Doc className="size-3.5 shrink-0 text-fog" />
              <span className="truncate">{name}</span>
            </motion.li>
          ))}
        </motion.ul>

        <div className="relative flex flex-col items-center gap-2">
          <span
            aria-hidden="true"
            className="absolute top-1/2 right-full hidden h-px w-6 -translate-y-1/2 bg-linear-to-r from-transparent to-white/50 sm:block"
          />
          <motion.span
            className="flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-ink-850 sm:size-16"
            animate={
              active
                ? { boxShadow: ["0 0 30px -10px rgba(174,164,255,0.5)", "0 0 60px -6px rgba(174,164,255,0.9)", "0 0 30px -10px rgba(174,164,255,0.5)"] }
                : { boxShadow: "0 0 30px -10px rgba(174,164,255,0.4)" }
            }
            transition={{ duration: 2.4, repeat: active ? Infinity : 0, ease: "easeInOut" }}
          >
            <PrismMark className="size-8 sm:size-9" />
          </motion.span>
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-full hidden h-px w-6 -translate-y-1/2 bg-linear-to-r from-white/50 via-sp-yellow/60 to-sp-violet/0 sm:block"
          />
        </div>

        <ul className="flex flex-col gap-4">
          {outputs.map((output, i) => (
            <li key={output.label}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[11.5px] text-fog">{output.label}</span>
                <span className="font-display text-[15px] font-semibold text-snow tabular-nums">{output.value}</span>
              </div>
              <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.span
                  className={cn("block h-full origin-left rounded-full bg-linear-to-r", output.color)}
                  style={{ width: output.width }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: active ? 1 : 0 }}
                  transition={{ duration: 1.2, delay: active ? 0.6 + i * 0.25 : 0, ease: easeOutExpo }}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 font-mono text-[10.5px] tracking-[0.16em] text-fog uppercase">
        Every passage carries its original permissions
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const steps = [
  { text: "Open the IT request form and pick “New hardware”.", cite: 1 },
  { text: "Your manager approves it in the same thread.", cite: 2 },
  { text: "Standard laptops ship within five working days.", cite: 3 },
];
const citations = ["IT handbook", "#it-help · pinned", "Procurement form"];

export function AnswerPanel({ active }: PanelProps) {
  return (
    <motion.div
      className="flex h-full flex-col gap-3"
      initial="off"
      animate={active ? "on" : "off"}
      variants={{ off: {}, on: { transition: { staggerChildren: 0.35, delayChildren: 0.15 } } }}
    >
      <motion.p
        variants={rise}
        className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-white/[0.07] px-4 py-2.5 text-[13.5px] text-snow"
      >
        How do I get a new laptop?
      </motion.p>
      <motion.div
        variants={rise}
        className="rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.025] p-4"
      >
        <p className="mb-3 flex items-center gap-2 font-mono text-[10.5px] tracking-wide text-fog uppercase">
          <Sparkle className="size-3.5 text-iris" />
          Prism · 1.8s
        </p>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={step.cite} className="flex gap-2.5 text-[13.5px] leading-relaxed text-mist">
              <span className="font-mono text-[11px] leading-[1.55rem] text-fog">{i + 1}.</span>
              <span>
                <span className="text-snow">{step.text}</span>
                <sup className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-[5px] bg-iris/20 px-1 font-mono text-[9.5px] text-iris">
                  {step.cite}
                </sup>
              </span>
            </li>
          ))}
        </ol>
      </motion.div>
      <motion.ul variants={rise} className="flex flex-wrap gap-2">
        {citations.map((c, i) => (
          <li
            key={c}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11.5px] text-mist"
          >
            <span className="font-mono text-[10px] text-iris">{i + 1}</span>
            {c}
          </li>
        ))}
      </motion.ul>
      <motion.div
        variants={rise}
        aria-hidden="true"
        className="mt-auto flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] py-2.5 pr-2.5 pl-4"
      >
        <span className="flex-1 truncate text-[13px] text-fog">Ask a follow-up…</span>
        <span className="hidden font-mono text-[10px] tracking-wide text-fog uppercase sm:inline">Web · Chat · Browser</span>
        <span className="flex size-7 items-center justify-center rounded-lg bg-snow text-ink-950">
          <ArrowUp className="size-3.5" />
        </span>
      </motion.div>
    </motion.div>
  );
}
