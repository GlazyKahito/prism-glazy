"use client";

import { Component, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useInView } from "motion/react";
import { cn } from "@/lib/cn";
import { downgradeHeroMode, useHeroMode } from "@/lib/hero-mode";
import { markLoaded } from "@/lib/intro";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { PrismPoster } from "./prism-poster";

const PrismScene = dynamic(
  () =>
    import("./prism-scene").then((mod) => {
      markLoaded("scene");
      return mod.PrismScene;
    }),
  { ssr: false },
);

class SceneBoundary extends Component<
  { onError: () => void; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The hero's visual layer. Mobile: a band across the top of the hero.
 * Desktop: the full first screen, with the prism sitting right of centre.
 */
export function HeroStage() {
  const mode = useHeroMode();
  const reduced = usePrefersReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mode === "static") {
      markLoaded("scene");
      markLoaded("gpu");
    }
  }, [mode]);

  const handleReady = useCallback(() => {
    setReady(true);
    markLoaded("gpu");
  }, []);

  const handleError = useCallback(() => {
    downgradeHeroMode();
    markLoaded("scene");
    markLoaded("gpu");
  }, []);

  const showScene = mode === "webgl";

  return (
    <div
      ref={stage}
      aria-hidden="true"
      className="hero-stage pointer-events-none absolute inset-x-0 top-0 h-[50svh] [mask-image:linear-gradient(180deg,#000_78%,transparent)] lg:h-svh lg:[mask-image:none]"
    >
      <div
        className={cn(
          "hero-poster absolute inset-0 transition-opacity duration-1000 ease-out",
          showScene && ready ? "opacity-0" : "opacity-100",
        )}
      >
        <PrismPoster className="absolute top-0 left-1/2 aspect-[4/1] h-full w-auto max-w-none -translate-x-1/2 scale-[1.12] lg:left-[70%] lg:scale-100" />
      </div>

      {showScene && (
        <SceneBoundary onError={handleError}>
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-[1200ms] ease-out",
              ready ? "opacity-100" : "opacity-0",
            )}
          >
            <PrismScene animate={!reduced} active={inView} onReady={handleReady} />
          </div>
        </SceneBoundary>
      )}
    </div>
  );
}
