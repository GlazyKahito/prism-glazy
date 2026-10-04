import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // One page and a small Tailwind stylesheet: shipping the CSS inside the HTML
    // removes the render-blocking stylesheet request before the first paint.
    inlineCss: true,
  },
};

export default nextConfig;
