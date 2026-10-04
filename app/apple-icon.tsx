import { ImageResponse } from "next/og";
import { markSvg, svgDataUri } from "@/lib/brand-art";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#07070c" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={svgDataUri(markSvg(180))} width={180} height={180} alt="" />
      </div>
    ),
    size,
  );
}
