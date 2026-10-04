import { ImageResponse } from "next/og";
import { markSvg, prismArtSvg, svgDataUri } from "@/lib/brand-art";
import { site } from "@/lib/site";

export const alt = "Prism. Messy docs in, clear answers out. A concept AI product by GLAZY.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number, text: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!match) return null;
    const response = await fetch(match[1]);
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null;
  }
}

const HEAD_1 = "Messy docs in.";
const HEAD_2 = "Clear answers out.";
const SUB = "AI answers your team can trust: cited to the source and filtered by who can see it.";
const LABEL = "PRISM";
const FOOT = `A concept product by ${site.studio.name}`;

export default async function OpengraphImage() {
  const [display, sans] = await Promise.all([
    loadGoogleFont("Funnel Display", 600, HEAD_1 + HEAD_2 + LABEL + "Prism"),
    loadGoogleFont("Instrument Sans", 500, SUB + FOOT + "CONCEPT"),
  ]);

  const fonts = [
    display && { name: "Display", data: display, weight: 600 as const, style: "normal" as const },
    sans && { name: "Sans", data: sans, weight: 500 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 600 | 500; style: "normal" }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#050508",
          color: "#f5f5f8",
          fontFamily: "Sans",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={svgDataUri(prismArtSvg(1200, 630, 1000, 292, 138))}
          width={1200}
          height={630}
          alt=""
          style={{ position: "absolute", inset: 0 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, rgba(5,5,8,0.92) 0%, rgba(5,5,8,0.6) 45%, rgba(5,5,8,0) 70%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={svgDataUri(markSvg(48))} width={48} height={48} alt="" />
            <span style={{ fontFamily: "Display", fontSize: 34, letterSpacing: "-0.02em" }}>Prism</span>
            <span
              style={{
                marginLeft: 8,
                padding: "6px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.9)",
                color: "#050508",
                fontSize: 15,
                letterSpacing: "0.08em",
              }}
            >
              CONCEPT
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Display",
                fontSize: 84,
                lineHeight: 0.98,
                letterSpacing: "-0.045em",
              }}
            >
              <span>{HEAD_1}</span>
              <span style={{ color: "#c9c0ff" }}>{HEAD_2}</span>
            </div>
            <p style={{ marginTop: 28, fontSize: 27, lineHeight: 1.4, color: "#c3c3d1", maxWidth: 640 }}>{SUB}</p>
          </div>

          <span style={{ fontSize: 20, color: "#8e8ea2" }}>{FOOT}</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
