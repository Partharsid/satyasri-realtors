import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SatyaSri Realtors",
    short_name: "SatyaSri",
    description: "Buy, sell and rent property across West Hyderabad — registered real estate consultant in Kondapur since 2009.",
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1c1c1c",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
