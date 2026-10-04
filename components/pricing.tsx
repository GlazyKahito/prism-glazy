"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "@/components/icons";
import { Reveal, RevealItem } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";

type Billing = "monthly" | "yearly";

const tiers = [
  {
    name: "Starter",
    blurb: "For small teams finding their feet.",
    price: { monthly: 0, yearly: 0 },
    unit: "free forever",
    cta: "Start free",
    featured: false,
    features: [
      "Up to 5 people",
      "3 connected sources",
      "1,000 documents",
      "Cited answers in the web app",
      "Community support",
    ],
  },
  {
    name: "Team",
    blurb: "For teams that run on shared knowledge.",
    price: { monthly: 18, yearly: 15 },
    unit: "per person / month",
    cta: "Start 14-day trial",
    featured: true,
    features: [
      "Unlimited sources",
      "50,000 documents",
      "Permission-aware answers",
      "Chat and browser apps",
      "Usage and gap analytics",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    blurb: "For organisations with strict controls.",
    price: null,
    unit: "annual agreement",
    cta: "Talk to sales",
    featured: false,
    features: [
      "Everything in Team",
      "SSO and SCIM provisioning",
      "EU or US data residency",
      "Audit logs and retention rules",
      "Dedicated success manager",
    ],
  },
] as const;

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="pricing-title"
          eyebrow="Pricing"
          title="Simple plans that grow with you."
          lede="Start free, upgrade when Prism becomes the first place your team looks."
        />

        <Reveal amount={0.6} className="mt-10 flex justify-center">
          <RevealItem>
            <div
              role="radiogroup"
              aria-label="Billing period"
              className="relative inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1"
            >
              {(["monthly", "yearly"] as const).map((option) => {
                const selected = billing === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setBilling(option)}
                    onKeyDown={(event) => {
                      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
                        event.preventDefault();
                        const next = billing === "monthly" ? "yearly" : "monthly";
                        setBilling(next);
                        const group = event.currentTarget.parentElement;
                        group?.querySelector<HTMLButtonElement>(`[data-option="${next}"]`)?.focus();
                      }
                    }}
                    tabIndex={selected ? 0 : -1}
                    data-option={option}
                    className={cn(
                      "relative z-10 inline-flex h-10 items-center gap-2 rounded-full px-5 text-[14px] font-medium capitalize transition-colors duration-300",
                      selected ? "text-ink-950" : "text-mist hover:text-snow",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="billing-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-snow"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    {option}
                    {option === "yearly" && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 font-mono text-[10px] tracking-wide uppercase transition-colors",
                          selected ? "bg-ink-950/10 text-ink-950" : "bg-sp-green/15 text-sp-green",
                        )}
                      >
                        −17%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </RevealItem>
        </Reveal>

        <Reveal stagger={0.12} amount={0.15} className="mt-12 grid items-stretch gap-4 lg:grid-cols-3">
          {tiers.map((tier) => (
            <RevealItem
              key={tier.name}
              as="article"
              variant="scale"
              className={cn(
                "relative flex flex-col rounded-[28px] p-7 sm:p-8",
                tier.featured
                  ? "ring-spectrum bg-[radial-gradient(120%_80%_at_50%_0%,rgba(125,108,255,0.18),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] shadow-[0_40px_120px_-50px_rgba(125,108,255,0.8)]"
                  : "border border-white/[0.07] bg-linear-to-b from-white/[0.04] to-white/[0.01]",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-snow">{tier.name}</h3>
                {tier.featured && (
                  <span className="rounded-full bg-snow px-2.5 py-1 font-mono text-[10px] tracking-wide text-ink-950 uppercase">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-2 text-[14.5px] text-mist">{tier.blurb}</p>

              <div className="mt-8 flex h-16 items-end gap-2">
                {tier.price === null ? (
                  <span className="font-display text-[3.2rem] leading-none font-semibold tracking-[-0.04em] text-snow">
                    Custom
                  </span>
                ) : (
                  <>
                    <span className="font-display text-[3.2rem] leading-none font-semibold tracking-[-0.04em] text-snow">
                      $
                      <span className="relative inline-flex overflow-hidden">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={tier.price[billing]}
                            initial={{ y: "60%", opacity: 0 }}
                            animate={{ y: "0%", opacity: 1 }}
                            exit={{ y: "-60%", opacity: 0 }}
                            transition={{ duration: 0.45, ease: easeOutExpo }}
                            className="inline-block tabular-nums"
                          >
                            {tier.price[billing]}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                    </span>
                    <span className="pb-1.5 text-[13px] leading-tight text-fog">
                      {tier.unit}
                      {tier.price.monthly > 0 && (
                        <span className="block">{billing === "yearly" ? "billed yearly" : "billed monthly"}</span>
                      )}
                    </span>
                  </>
                )}
                {tier.price === null && <span className="pb-1.5 text-[13px] text-fog">{tier.unit}</span>}
              </div>

              <a
                href="#cta"
                className={cn(
                  "group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition duration-300",
                  tier.featured
                    ? "bg-snow text-ink-950 hover:bg-white hover:shadow-[0_12px_40px_-12px_rgba(174,164,255,0.9)]"
                    : "border border-white/12 bg-white/[0.04] text-snow hover:border-white/25 hover:bg-white/[0.08]",
                )}
              >
                {tier.cta}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>

              <ul className="mt-8 space-y-3 border-t border-white/[0.07] pt-7">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[14.5px] text-mist">
                    <Check className={cn("mt-0.5 size-4 shrink-0", tier.featured ? "text-iris" : "text-fog")} />
                    {feature}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </Reveal>

        <p className="mt-8 text-center font-mono text-[11px] tracking-wide text-fog uppercase">
          Prices are illustrative · Prism is a concept product
        </p>
      </div>
    </section>
  );
}
