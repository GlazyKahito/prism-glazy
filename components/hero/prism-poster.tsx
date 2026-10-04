import { BEAM_IN_ANGLE, FAN_ANGLE, FAN_SPREAD, SPECTRUM, toDeg } from "@/lib/beam";

/**
 * Static version of the hero: the same prism, beam and spectrum drawn in SVG.
 * It is the poster while WebGL loads and the whole hero on devices without it.
 * The SVG is centred on the prism; one viewBox unit is 1/1000 of stage height.
 */

function roundedTrianglePath(radius: number, corner: number) {
  const points = [0, 1, 2].map((i) => {
    const angle = -Math.PI / 2 + (i * Math.PI * 2) / 3;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius] as const;
  });
  const toward = (from: readonly number[], to: readonly number[], length: number) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const d = Math.hypot(dx, dy);
    return [from[0] + (dx / d) * length, from[1] + (dy / d) * length];
  };
  let path = "";
  points.forEach((point, i) => {
    const prev = points[(i + 2) % 3];
    const next = points[(i + 1) % 3];
    const a = toward(point, prev, corner);
    const b = toward(point, next, corner);
    path += `${i === 0 ? "M" : "L"}${a[0].toFixed(1)} ${a[1].toFixed(1)} `;
    path += `Q${point[0].toFixed(1)} ${point[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)} `;
  });
  return `${path}Z`;
}

const R = 270;
const body = roundedTrianglePath(R, 52);
const inner = roundedTrianglePath(R * 0.8, 40);
const fanLength = 2100;
const fanHalf = Math.tan(FAN_SPREAD) * fanLength;

export function PrismPoster({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="-2000 -500 4000 1000"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="pp-glow">
          <stop offset="0" stopColor="#8f7dff" stopOpacity="0.4" />
          <stop offset="0.45" stopColor="#5b4dd6" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pp-beam" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="pp-fan" x1="0" y1="0" x2="0" y2="1">
          {SPECTRUM.map((color, i) => (
            <stop key={color} offset={i / (SPECTRUM.length - 1)} stopColor={color} />
          ))}
        </linearGradient>
        <linearGradient id="pp-fan-fade" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pp-fan-white" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.12" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="pp-fan-mask" maskUnits="userSpaceOnUse" x="0" y="-1000" width={fanLength} height="2000">
          <rect x="0" y="-1000" width={fanLength} height="2000" fill="url(#pp-fan-fade)" />
        </mask>

        {/* Glass body: deep indigo with a bright refracted core. */}
        <linearGradient id="pp-body" x1="0.2" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor="#3a2f8f" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#1d1858" stopOpacity="0.92" />
          <stop offset="1" stopColor="#0d0b26" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="pp-core" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stopColor="#fff4ea" stopOpacity="0.85" />
          <stop offset="0.25" stopColor="#c9b8ff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#6a5cff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pp-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff5c7c" stopOpacity="0" />
          <stop offset="0.35" stopColor="#ff5c7c" stopOpacity="0.8" />
          <stop offset="0.5" stopColor="#ffdd66" stopOpacity="0.5" />
          <stop offset="0.7" stopColor="#55d4ff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#7a86ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pp-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#c6bcff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#7fdcff" stopOpacity="0.95" />
        </linearGradient>
        <clipPath id="pp-clip">
          <path d={body} />
        </clipPath>
        <filter id="pp-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="pp-softer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <circle r="760" fill="url(#pp-glow)" />

      {/* White light falling onto the prism */}
      <g transform={`rotate(${-toDeg(BEAM_IN_ANGLE)})`}>
        <rect x="-780" y="-34" width="780" height="68" fill="url(#pp-beam)" opacity="0.3" filter="url(#pp-soft)" />
        <rect x="-780" y="-3" width="780" height="6" fill="url(#pp-beam)" />
      </g>

      {/* Dispersed spectrum */}
      <g transform={`rotate(${toDeg(FAN_ANGLE)})`}>
        <g mask="url(#pp-fan-mask)">
          <polygon
            points={`0,-10 ${fanLength},${-fanHalf} ${fanLength},${fanHalf} 0,10`}
            fill="url(#pp-fan)"
            opacity="0.82"
            filter="url(#pp-softer)"
          />
          <polygon points={`0,-10 ${fanLength},${-fanHalf} ${fanLength},${fanHalf} 0,10`} fill="url(#pp-fan-white)" />
        </g>
      </g>

      {/* The prism */}
      <g transform="rotate(4)">
        <path d={body} fill="url(#pp-body)" />
        <g clipPath="url(#pp-clip)">
          <ellipse cx="-10" cy="40" rx="190" ry="120" fill="url(#pp-core)" filter="url(#pp-soft)" />
          <rect x={-R} y="120" width={R * 2} height="46" fill="url(#pp-band)" opacity="0.55" filter="url(#pp-softer)" transform="rotate(-6)" />
          <path d={inner} transform="translate(18 10)" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="3" filter="url(#pp-softer)" />
        </g>
        <path d={body} fill="none" stroke="url(#pp-rim)" strokeWidth="10" opacity="0.35" filter="url(#pp-softer)" />
        <path d={body} fill="none" stroke="url(#pp-rim)" strokeWidth="2.5" />
        <path
          d={`M${(-R * 0.62).toFixed(1)} ${(R * 0.18).toFixed(1)} L${(-R * 0.18).toFixed(1)} ${(-R * 0.62).toFixed(1)}`}
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.5"
          filter="url(#pp-softer)"
        />
      </g>
    </svg>
  );
}
