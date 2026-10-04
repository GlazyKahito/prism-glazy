import { ImageResponse } from "next/og";
import { markSvg, svgDataUri } from "@/lib/brand-art";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={svgDataUri(markSvg(32))} width={32} height={32} alt="" />
    ),
    size,
  );
}
