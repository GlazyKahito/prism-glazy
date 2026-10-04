"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "@/components/icons";
import { Reveal, RevealItem } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";
import { site } from "@/lib/site";

const faqs = [
  {
    q: "Where does Prism get its answers from?",
    a: "Only from the sources you connect. Prism finds the passages that answer a question, writes a short reply from them and cites each one. If nothing relevant exists, it tells you instead of filling the gap.",
  },
  {
    q: "Can people see documents they don't have access to?",
    a: "No. Every passage keeps the permissions of the document it came from, and answers are assembled per person. If you couldn't open the original file, Prism won't quote it to you.",
  },
  {
    q: "What happens when Prism isn't sure?",
    a: "It shows a confidence level, explains what it found, and points you to the owner of the relevant space. Low-confidence questions also show up in analytics so gaps in your docs get fixed.",
  },
  {
    q: "Is our data used to train models?",
    a: "No. Your content is used to answer your team's questions and nothing else. You can disconnect a source at any time and its passages are removed from the index.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams connect their first sources in under ten minutes. Indexing runs in the background and answers improve as more of your workspace is added.",
  },
  {
    q: "Is Prism a real product?",
    a: `Not yet. Prism is a concept designed and built by ${site.studio.name} to show what a modern AI product launch site can look like.`,
  },
];

function Item({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <div className="border-b border-white/[0.08]">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-display text-[1.15rem] font-medium tracking-[-0.01em] text-snow sm:text-[1.3rem]">
            {q}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
              open
                ? "rotate-45 border-white/30 bg-snow text-ink-950"
                : "border-white/12 text-mist group-hover:border-white/25 group-hover:text-snow",
            )}
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pr-12 pb-6 text-[1rem] leading-relaxed text-mist">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-28 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            id="faq-title"
            align="left"
            eyebrow="FAQ"
            title="Questions, answered."
            lede="The things teams ask before they let a new tool read their docs."
          />
        </div>
        <Reveal stagger={0.07} amount={0.15} className="border-t border-white/[0.08]">
          {faqs.map((item, i) => (
            <RevealItem key={item.q}>
              <Item q={item.q} a={item.a} defaultOpen={i === 0} />
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
