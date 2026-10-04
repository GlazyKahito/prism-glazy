export const site = {
  name: "Prism",
  url: "https://prism-glazy.vercel.app",
  title: "Prism — Turn messy docs into answers your team can trust",
  shortTitle: "Prism — Answers your team can trust",
  description:
    "Prism reads your wikis, drives, tickets and threads, then answers questions in plain language. Every answer is cited to its source and filtered by who is allowed to see it.",
  studio: {
    name: "GLAZY",
    url: "https://glazy-portfolio.vercel.app",
  },
} as const;

export const nav = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;
