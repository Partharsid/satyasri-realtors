import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : "supabase2.partharsid.dev";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  images: {
    formats: ["image/avif", "image/webp"],
    // Property photos uploaded from /admin live in Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/media/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
    ];
  },
  async redirects() {
    // Old public paths from the previous site: one permanent hop to the closest page (Search Console showed
    // these as 404/403 or multi-hop redirect chains, wasting whatever Google had learned about them).
    const to = (destination: string, ...sources: string[]) => sources.map((source) => ({ source, destination, permanent: true as const }));
    return [
      ...to("/en", "/audit.pdf", "/sign-in", "/cart", "/login", "/register"),
      ...to("/en/about", "/about", "/testimonial", "/our-partner"),
      ...to("/en/services", "/how-it-work", "/how-it-works", "/service", "/services-list"),
      ...to("/en/listings", "/all-locations", "/search-home", "/gallery", "/case", "/case/:path*", "/properties", "/property/:path*"),
      ...to("/en/blog", "/news", "/blog-list"),
      ...to("/en/locations/kondapur", "/gated-community-plots-in-kondapur-a-perfect-blend-of-luxury-and-safety"),
      ...to("/en/privacy", "/privacy", "/privacy-policy"),
      ...to("/en/contact", "/contact-us"),
    ];
  },
};

export default nextConfig;
