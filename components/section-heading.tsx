import { cn } from "@/lib/cn";
import { Reveal, RevealItem } from "./reveal";

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  lede,
  align = "center",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal
      as="header"
      stagger={0.1}
      amount={0.6}
      className={cn(
        "max-w-3xl",
        centered && "mx-auto text-center",
        className,
      )}
    >
      <RevealItem
        as="p"
        className={cn(
          "mb-5 inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-mist uppercase",
        )}
      >
        <span aria-hidden="true" className="h-px w-6 bg-spectrum" />
        {eyebrow}
      </RevealItem>
      <RevealItem
        as="h2"
        variant="soft"
        id={id}
        className="font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-snow"
      >
        {title}
      </RevealItem>
      {lede ? (
        <RevealItem
          as="p"
          className={cn(
            "mt-5 text-[1.05rem] leading-relaxed text-pretty text-mist sm:text-lg",
            centered && "mx-auto max-w-2xl",
          )}
        >
          {lede}
        </RevealItem>
      ) : null}
    </Reveal>
  );
}
