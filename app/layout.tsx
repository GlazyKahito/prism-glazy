import type { Metadata, Viewport } from "next";
import { Fragment_Mono, Funnel_Display, Instrument_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { site } from "@/lib/site";
import "./globals.css";

const display = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
  display: "swap",
});

const sans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = Fragment_Mono({
  variable: "--font-fragment-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s · Prism",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "AI knowledge base",
    "enterprise search",
    "cited answers",
    "permission-aware search",
    "SaaS landing page",
    "concept",
  ],
  authors: [{ name: site.studio.name, url: site.studio.url }],
  creator: site.studio.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.shortTitle,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.shortTitle,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050508",
  colorScheme: "dark",
};

// Decides, before the first paint, whether the opening sequence plays:
// once per session, never under reduced motion, never on deep links.
// `?intro=1` / `?intro=0` force it either way.
const introGate = `(function(){var d=document.documentElement,p="skip";try{var q=location.search.match(/[?&]intro=(0|1)/),rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches,seen=sessionStorage.getItem("prism:intro-seen");p=!rm&&!seen&&!location.hash?"play":"skip";if(q)p=q[1]==="1"?"play":"skip";}catch(e){}d.setAttribute("data-intro",p);if(p==="play"&&"scrollRestoration" in history){history.scrollRestoration="manual";}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introGate }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
