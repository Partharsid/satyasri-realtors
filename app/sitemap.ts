import type { MetadataRoute } from "next";
import { getListings, getPosts } from "@/lib/data";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { AREA_KEYS, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

// Real dates only: Google ignores <lastmod> from sites that stamp "now" on everything.
// Bump this when the page templates/copy change meaningfully.
const SITE_UPDATED = new Date("2026-11-13T00:00:00Z");

type Entry = MetadataRoute.Sitemap[number];

/** One entry per language version, each pointing at all alternates (what Google recommends for hreflang). */
function entries(path: string, lastModified: Date, priority: number, changeFrequency: Entry["changeFrequency"]): Entry[] {
  const p = path === "/" ? "" : path;
  const languages = {
    ...Object.fromEntries(LOCALES.map((l) => [LOCALE_LABELS[l].htmlLang, `${SITE_URL}/${l}${p}`])),
    "x-default": `${SITE_URL}/en${p}`,
  };
  return LOCALES.map((l: Locale) => ({
    url: `${SITE_URL}/${l}${p}`,
    lastModified,
    changeFrequency,
    priority: l === "en" ? priority : Math.max(priority - 0.1, 0.1),
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listings, posts] = await Promise.all([getListings(), getPosts()]);
  const statics = ["/", "/listings", "/services", "/about", "/contact", "/blog"].flatMap((p) => entries(p, SITE_UPDATED, p === "/" ? 1 : 0.8, "weekly"));
  const areas = AREA_KEYS.flatMap((k) => entries(`/locations/${k}`, SITE_UPDATED, 0.8, "weekly"));
  const props = listings.flatMap((l) => entries(`/listings/${l.slug}`, new Date(l.updated_at), l.status === "available" ? 0.9 : 0.4, "weekly"));
  // Blog posts are English-only.
  const blog: Entry[] = posts.map((p) => ({ url: `${SITE_URL}/en/blog/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: "monthly", priority: 0.6 }));
  return [...statics, ...areas, ...props, ...blog];
}
