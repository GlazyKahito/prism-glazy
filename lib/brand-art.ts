import { BEAM_IN_ANGLE, FAN_ANGLE, FAN_SPREAD, SPECTRUM, toDeg } from "./beam";

/** Rounded equilateral triangle, apex up, centred on (cx, cy). */
function trianglePath(cx: number, cy: number, radius: number, corner: number) {
  const pts = [0, 1, 2].map((i) => {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 3;
    return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius];
  });
  const toward = (from: number[], to: number[], d: number) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const len = Math.hypot(dx, dy);
    return [from[0] + (dx / len) * d, from[1] + (dy / len) * d];
  };
  let path = "";
  pts.forEach((p, i) => {
    const a = toward(p, pts[(i + 2) % 3], corner);
    const b = toward(p, pts[(i + 1) % 3], corner);
    path += `${i === 0 ? "M" : "L"}${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)} `;
  });
  return `${path}Z`;
}

const stops = SPECTRUM.map(
  (c, i) => `<stop offset="${(i / (SPECTRUM.length - 1)).toFixed(3)}" stop-color="${c}"/>`,
).join("");

/** The prism, beam and spectrum as a standalone SVG string, for the social image and icons. */
export function prismArtSvg(width: number, height: number, cx: number, cy: number, radius: number) {
  const fanLength = width;
  const fanHalf = Math.tan(FAN_SPREAD) * fanLength;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs>
<radialGradient id="g" cx="${cx}" cy="${cy}" r="${radius * 2.6}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#8f7dff" stop-opacity="0.45"/><stop offset="0.5" stop-color="#5b4dd6" stop-opacity="0.12"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="b" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.6" stop-color="#fff" stop-opacity="0.4"/><stop offset="1" stop-color="#fff"/></linearGradient>
<linearGradient id="f" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient>
<linearGradient id="ff" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="0.4" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="m" maskUnits="userSpaceOnUse" x="0" y="${-fanLength}" width="${fanLength}" height="${fanLength * 2}"><rect x="0" y="${-fanLength}" width="${fanLength}" height="${fanLength * 2}" fill="url(#ff)"/></mask>
<linearGradient id="w" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.95"/><stop offset="0.14" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="face" x1="0.15" y1="0" x2="0.85" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="0.5" stop-color="#c9c2ff" stop-opacity="0.07"/><stop offset="1" stop-color="#fff" stop-opacity="0.14"/></linearGradient>
<linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.95"/><stop offset="0.5" stop-color="#d7d0ff" stop-opacity="0.35"/><stop offset="1" stop-color="#fff" stop-opacity="0.8"/></linearGradient>
<filter id="s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${radius * 0.05}"/></filter>
<filter id="s2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${radius * 0.02}"/></filter>
</defs>
<circle cx="${cx}" cy="${cy}" r="${radius * 2.6}" fill="url(#g)"/>
<g transform="translate(${cx} ${cy}) rotate(${-toDeg(BEAM_IN_ANGLE)})">
<rect x="${-width * 1.5}" y="${-radius * 0.13}" width="${width * 1.5}" height="${radius * 0.26}" fill="url(#b)" opacity="0.3" filter="url(#s)"/>
<rect x="${-width * 1.5}" y="-1.5" width="${width * 1.5}" height="3" fill="url(#b)"/>
</g>
<g transform="translate(${cx} ${cy}) rotate(${toDeg(FAN_ANGLE)})">
<g mask="url(#m)">
<polygon points="0,-4 ${fanLength},${-fanHalf} ${fanLength},${fanHalf} 0,4" fill="url(#f)" opacity="0.85" filter="url(#s2)"/>
<polygon points="0,-4 ${fanLength},${-fanHalf} ${fanLength},${fanHalf} 0,4" fill="url(#w)"/>
</g>
</g>
<path d="${trianglePath(cx, cy, radius, radius * 0.17)}" fill="#08080e" opacity="0.75"/>
<path d="${trianglePath(cx + radius * 0.13, cy - radius * 0.085, radius * 0.86, radius * 0.15)}" fill="none" stroke="#fff" stroke-opacity="0.16" stroke-width="${Math.max(1, radius * 0.008)}"/>
<path d="${trianglePath(cx, cy, radius, radius * 0.17)}" fill="url(#face)"/>
<path d="${trianglePath(cx, cy, radius, radius * 0.17)}" fill="none" stroke="url(#edge)" stroke-width="${Math.max(1.2, radius * 0.012)}"/>
</svg>`;
}

/** A compact mark for favicons. */
export function markSvg(size: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#15131f"/><stop offset="1" stop-color="#07070c"/></linearGradient>
<linearGradient id="sp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b81"/><stop offset="0.35" stop-color="#ffdd6e"/><stop offset="0.65" stop-color="#5ad7ff"/><stop offset="1" stop-color="#b98cff"/></linearGradient>
</defs>
<rect width="32" height="32" rx="8" fill="url(#bg)"/>
<path d="M16 7.2c.5 0 .9.3 1.2.7l7.3 12.8c.6 1-.1 2.2-1.2 2.2H8.7c-1.1 0-1.8-1.2-1.2-2.2l7.3-12.8c.3-.4.7-.7 1.2-.7z" fill="none" stroke="#fff" stroke-width="1.8"/>
<path d="M3 18.2 15 16.4" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>
<path d="M17.4 16.3 29 12.6v7.6z" fill="url(#sp)"/>
</svg>`;
}

export function svgDataUri(svg: string) {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
