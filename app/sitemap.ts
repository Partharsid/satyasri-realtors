import type { MetadataRoute } from "next";
import { getListings, getPosts } from "@/lib/data";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/config";
import { AREA_KEYS, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

function entry(path: string, lastModified: Date, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) {
  const p = path === "/" ? "" : path;
  return {
    url: `${SITE_URL}/en${p}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [LOCALE_LABELS[l].htmlLang, `${SITE_URL}/${l}${p}`])) },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listings, posts] = await Promise.all([getListings(), getPosts()]);
  const now = new Date();
  const statics = ["/", "/listings", "/services", "/about", "/contact", "/blog"].map((p) => entry(p, now, p === "/" ? 1 : 0.8, "weekly"));
  const areas = AREA_KEYS.map((k) => entry(`/locations/${k}`, now, 0.8, "weekly"));
  const props = listings.map((l) => entry(`/listings/${l.slug}`, new Date(l.updated_at), l.status === "available" ? 0.9 : 0.4, "weekly"));
  // Blog posts are English-only.
  const blog = posts.map((p) => ({ url: `${SITE_URL}/en/blog/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: "monthly" as const, priority: 0.6 }));
  return [...statics, ...areas, ...props, ...blog];
}
