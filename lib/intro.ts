"use client";

import { useSyncExternalStore } from "react";

/**
 * The opening sequence is decided before first paint by an inline script in
 * the root layout, which sets `data-intro` on <html> to "play" or "skip".
 * Everything else (hero reveal, header, the 3D scene) reads the phase from
 * this tiny store so the page can be choreographed around it.
 */

export type IntroPhase = "play" | "exit" | "done";

export const INTRO_STORAGE_KEY = "prism:intro-seen";

let phase: IntroPhase | null = null;
const phaseListeners = new Set<() => void>();

function readInitialPhase(): IntroPhase {
  return document.documentElement.dataset.intro === "play" ? "play" : "done";
}

export function getIntroPhase(): IntroPhase {
  if (phase === null) phase = readInitialPhase();
  return phase;
}

export function setIntroPhase(next: IntroPhase) {
  if (phase === next) return;
  phase = next;
  document.documentElement.dataset.intro = next;
  if (next === "done") {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      // Storage can be unavailable (private mode); the intro simply plays again.
    }
  }
  phaseListeners.forEach((listener) => listener());
}

function subscribePhase(listener: () => void) {
  phaseListeners.add(listener);
  return () => {
    phaseListeners.delete(listener);
  };
}

export function useIntroPhase(): IntroPhase {
  return useSyncExternalStore(subscribePhase, getIntroPhase, () => "play");
}

/* ------------------------------------------------------------------ */
/* Real loading progress: fonts, the 3D chunk, the first GPU frame and */
/* the window load event each carry a share of the percentage.         */
/* ------------------------------------------------------------------ */

export type LoadKey = "fonts" | "scene" | "gpu" | "window";

// Whole percentages, so "everything loaded" is exactly 100.
const weights: Record<LoadKey, number> = {
  fonts: 20,
  scene: 30,
  gpu: 40,
  window: 10,
};

const loaded = new Set<LoadKey>();
let progress = 0;
const progressListeners = new Set<() => void>();

export function markLoaded(key: LoadKey) {
  if (loaded.has(key)) return;
  loaded.add(key);
  progress = [...loaded].reduce((sum, k) => sum + weights[k], 0);
  progressListeners.forEach((listener) => listener());
}

/** Safety valve: never hold the page hostage to a slow asset. */
export function markAllLoaded() {
  (Object.keys(weights) as LoadKey[]).forEach(markLoaded);
}

function subscribeProgress(listener: () => void) {
  progressListeners.add(listener);
  return () => {
    progressListeners.delete(listener);
  };
}

/** Loading progress as a whole percentage, 0–100. */
export function useLoadProgress(): number {
  return useSyncExternalStore(
    subscribeProgress,
    () => progress,
    () => 0,
  );
}

/* ------------------------------------------------------------------ */
/* A mutable value the WebGL scene reads every frame (no React state). */
/* 0 = the intro owns the light, 1 = the hero scene owns it.           */
/* ------------------------------------------------------------------ */

let sceneLevel: number | null = null;

export function getSceneLevel(): number {
  if (sceneLevel === null) sceneLevel = getIntroPhase() === "play" ? 0 : 1;
  return sceneLevel;
}

export function setSceneLevel(value: number) {
  sceneLevel = Math.min(1, Math.max(0, value));
}
