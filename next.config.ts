import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow SVG files to be served as images during development
  // (placeholder images are SVGs named .jpg for simplicity)
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add any external image domains here when real property photos come from a CDN
    remotePatterns: [],
  },
};

export default nextConfig;
