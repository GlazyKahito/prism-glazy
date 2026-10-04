import { Faq } from "@/components/faq";
import { Features } from "@/components/features/features";
import { FinalCta } from "@/components/final-cta";
import { Hero } from "@/components/hero/hero";
import { HowItWorks } from "@/components/how/how-it-works";
import { IntroOverlay } from "@/components/intro/intro-overlay";
import { Pricing } from "@/components/pricing";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  description: site.description,
  creator: { "@type": "Organization", name: site.studio.name, url: site.studio.url },
};

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <div id="page">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-full bg-snow px-4 py-2 text-sm font-semibold text-ink-950 transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">
          <Hero />
          <Features />
          <HowItWorks />
          <Pricing />
          <Faq />
          <FinalCta />
        </main>
        <SiteFooter />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
