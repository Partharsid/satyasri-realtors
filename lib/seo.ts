import type { Metadata } from "next";
import { LOCALES, LOCALE_LABELS, type Locale } from "./i18n/config";
import { SITE_URL } from "./site";

/** Canonical + hreflang alternates for a path that exists in every locale. */
export function alternates(lang: Locale, path: string): Metadata["alternates"] {
  const p = path === "/" ? "" : path;
  return {
    canonical: `${SITE_URL}/${lang}${p}`,
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [LOCALE_LABELS[l].htmlLang, `${SITE_URL}/${l}${p}`])),
      "x-default": `${SITE_URL}/en${p}`,
    },
  };
}

/** Page metadata with localized OG fields and alternates. */
export function pageMeta(lang: Locale, path: string, title: string, description: string, image?: string): Metadata {
  return {
    title,
    description,
    alternates: alternates(lang, path),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}${path === "/" ? "" : path}`,
      locale: LOCALE_LABELS[lang].ogLocale,
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
  };
}

export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
