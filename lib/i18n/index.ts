import "server-only";
import en from "./dictionaries/en";
import te from "./dictionaries/te";
import hi from "./dictionaries/hi";
import type { Locale } from "./config";

const dictionaries = { en, te, hi };

export function getDictionary(lang: Locale) {
  return dictionaries[lang];
}

export type { Dictionary } from "./dictionaries/en";
export * from "./config";
