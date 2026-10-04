"use client";

import { useSyncExternalStore } from "react";

export type HeroMode = "pending" | "webgl" | "static";

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

let cached: Exclude<HeroMode, "pending"> | null = null;

function canCreateContext(strict: boolean) {
  try {
    const canvas = document.createElement("canvas");
    const options: WebGLContextAttributes | undefined = strict
      ? { failIfMajorPerformanceCaveat: true }
      : undefined;
    const gl =
      (canvas.getContext("webgl2", options) as WebGL2RenderingContext | null) ??
      (canvas.getContext("webgl", options) as WebGLRenderingContext | null);
    if (!gl) return false;

    if (strict) {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = info
        ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
        : "";
      if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return false;
      }
    }

    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function detect(): Exclude<HeroMode, "pending"> {
  const override = new URLSearchParams(window.location.search).get("hero");
  if (override === "static") return "static";
  if (override === "3d") return canCreateContext(false) ? "webgl" : "static";

  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return "static";
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) {
    return "static";
  }
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return "static";

  return canCreateContext(true) ? "webgl" : "static";
}

export function getHeroMode(): HeroMode {
  if (cached === null) cached = detect();
  return cached;
}

/** Called when the WebGL scene fails at runtime, so we fall back for good. */
export function downgradeHeroMode() {
  cached = "static";
  listeners.forEach((listener) => listener());
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useHeroMode(): HeroMode {
  return useSyncExternalStore(subscribe, getHeroMode, () => "pending");
}
