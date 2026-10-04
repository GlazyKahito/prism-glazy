"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";

type BentoCardProps = {
  title: string;
  body: string;
  icon: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  /** Visual sits above the copy (default) or beside it on wide cards. */
  layout?: "stack" | "split";
};

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.1, ease: easeOutExpo },
  },
};

export function BentoCard({
  title,
  body,
  icon,
  className,
  children,
  layout = "stack",
}: BentoCardProps) {
  const ref = useRef<HTMLElement>(null);

  // A soft light that follows the pointer across the card.
  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.article
      ref={ref}
      variants={card}
      onPointerMove={onPointerMove}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[28px] border border-white/[0.07] bg-linear-to-b from-white/[0.05] to-white/[0.012] p-2",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(174,164,255,0.11), transparent 65%)",
        }}
      />
      <div
        className={cn(
          "relative flex flex-1 flex-col",
          layout === "split" && "lg:flex-row-reverse lg:items-stretch",
        )}
      >
        <div
          className={cn(
            "relative flex-1 overflow-hidden rounded-[22px] border border-white/[0.05] bg-ink-900/70",
            layout === "split" && "lg:min-w-0 lg:basis-[58%]",
          )}
        >
          {children}
        </div>
        <div
          className={cn(
            "px-4 pt-5 pb-4 sm:px-5",
            layout === "split" && "lg:flex lg:basis-[42%] lg:flex-col lg:justify-end lg:pr-6 lg:pb-6",
          )}
        >
          <div className="mb-3 inline-flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-iris">
            {icon}
          </div>
          <h3 className="font-display text-[1.35rem] leading-tight font-semibold tracking-[-0.02em] text-snow">
            {title}
          </h3>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-mist">{body}</p>
        </div>
      </div>
    </motion.article>
  );
}
