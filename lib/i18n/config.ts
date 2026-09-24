export const LOCALES = ["en", "te", "hi"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, { short: string; name: string; htmlLang: string; ogLocale: string }> = {
  en: { short: "EN", name: "English", htmlLang: "en-IN", ogLocale: "en_IN" },
  te: { short: "తె", name: "తెలుగు", htmlLang: "te-IN", ogLocale: "te_IN" },
  hi: { short: "हि", name: "हिन्दी", htmlLang: "hi-IN", ogLocale: "hi_IN" },
};

export function isLocale(v: string | undefined | null): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

/** Prefix an internal path with the locale: href("te", "/listings") → "/te/listings" */
export function href(lang: Locale, path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

/** Replace {name} placeholders in a dictionary string. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
