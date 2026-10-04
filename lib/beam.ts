/**
 * Shared light geometry. The WebGL scene, the static SVG poster and the
 * opening sequence all draw the same beam, so they agree on these angles.
 * Angles are in radians, measured on screen.
 */

/**
 * The white beam falls steeply onto the prism from the upper left, so in the
 * hero it never crosses the copy. (Positive would mean rising from lower left.)
 */
export const BEAM_IN_ANGLE = -0.86;

/** The spectrum leaves the prism leaning slightly downward. */
export const FAN_ANGLE = 0.09;

/** Half-angle of the spectral fan. */
export const FAN_SPREAD = 0.17;

export const toDeg = (radians: number) => (radians * 180) / Math.PI;

/** Spectrum stops, red to violet. */
export const SPECTRUM = [
  "#ff5c7c",
  "#ff9d52",
  "#ffdd66",
  "#6ef2b0",
  "#55d4ff",
  "#7a86ff",
  "#bd8aff",
] as const;
