import { ArrowUpRight } from "@/components/icons";
import { Wordmark } from "@/components/logo";
import { Reveal, RevealItem } from "@/components/reveal";
import { nav, site } from "@/lib/site";

const columns = [
  { title: "Product", links: nav.slice(0, 3) },
  {
    title: "Help",
    links: [
      { href: "#faq", label: "FAQ" },
      { href: "#cta", label: "Book a demo" },
      { href: "#top", label: "Back to top" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] pt-20">
      <Reveal stagger={0.08} amount={0.2} className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <RevealItem>
            <Wordmark />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-mist">
              Answers your team can trust, from the docs you already have.
            </p>
          </RevealItem>
          {columns.map((column) => (
            <RevealItem key={column.title}>
              <h2 className="font-mono text-[11px] tracking-[0.2em] text-fog uppercase">{column.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-[15px] text-mist transition-colors hover:text-snow">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </div>

        <RevealItem className="mt-16 flex flex-col gap-4 border-t border-white/[0.06] py-8 text-[14px] text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>
            Prism is a concept product designed and built by{" "}
            <a
              href={site.studio.url}
              className="inline-flex items-center gap-0.5 font-medium text-snow underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
            >
              {site.studio.name}
              <ArrowUpRight className="size-3.5" />
            </a>
            .
          </p>
          <p className="font-mono text-[11px] tracking-wide uppercase">© 2026 Prism · A concept site</p>
        </RevealItem>
      </Reveal>

      <div aria-hidden="true" className="pointer-events-none relative mx-auto -mb-[0.24em] max-w-[100rem] px-2 text-center select-none">
        <p className="bg-linear-to-b from-white/[0.14] to-white/0 bg-clip-text font-display text-[27vw] leading-[0.8] font-bold tracking-[-0.06em] text-transparent">
          Prism
        </p>
      </div>
    </footer>
  );
}
