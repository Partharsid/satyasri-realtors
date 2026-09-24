"use client";

import { useSyncExternalStore } from "react";

const KEY = "satyasri:saved";
const EVENT = "satyasri:saved-change";
const EMPTY: string[] = [];

let cache: { raw: string | null; list: string[] } = { raw: null, list: EMPTY };

function read(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY; // storage blocked (private mode, disabled site data)
  }
  if (raw === cache.raw) return cache.list;
  let list = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    list = Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : EMPTY;
  } catch {
    list = EMPTY;
  }
  cache = { raw, list };
  return list;
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSaved() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleSaved(slug: string) {
  const list = read();
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(EVENT));
}
