"use client";

import { motion, type Variants } from "motion/react";
import { easeOutExpo } from "@/lib/motion";

type Tag = "div" | "ul" | "ol" | "li" | "article" | "header" | "p" | "h2" | "h3" | "span";

const tags = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  article: motion.article,
  header: motion.header,
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
  span: motion.span,
};

type RevealProps = {
  as?: Tag;
  className?: string;
  children: React.ReactNode;
  /** Seconds between each child's entrance. */
  stagger?: number;
  delay?: number;
  /** Share of the element that must be visible before it plays. */
  amount?: number;
  id?: string;
};

/** A group whose `RevealItem` children enter one after another when scrolled into view. */
export function Reveal({
  as = "div",
  className,
  children,
  stagger = 0.08,
  delay = 0,
  amount = 0.2,
  id,
}: RevealProps) {
  const Tag = tags[as];
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </Tag>
  );
}

const itemVariants = {
  rise: {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: easeOutExpo } },
  },
  soft: {
    hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.1, ease: easeOutExpo },
    },
  },
  scale: {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.1, ease: easeOutExpo },
    },
  },
} satisfies Record<string, Variants>;

type RevealItemProps = {
  as?: Tag;
  className?: string;
  children?: React.ReactNode;
  variant?: keyof typeof itemVariants;
  id?: string;
};

export function RevealItem({
  as = "div",
  className,
  children,
  variant = "rise",
  id,
}: RevealItemProps) {
  const Tag = tags[as];
  return (
    <Tag id={id} className={className} variants={itemVariants[variant]}>
      {children}
    </Tag>
  );
}
