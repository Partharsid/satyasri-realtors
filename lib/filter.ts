import type { ListingRow } from "./data";
import type { ListingFilters } from "@/components/SearchBar";

export function filterListings(all: ListingRow[], f: ListingFilters) {
  return all.filter((l) => {
    if (f.for === "sale" && l.transaction !== "Sale") return false;
    if (f.for === "rent" && l.transaction === "Sale") return false;
    if (f.type && l.type !== f.type) return false;
    if (f.area && l.area_key !== f.area && l.location_area !== f.area) return false;
    if (f.beds) {
      const n = Number(f.beds);
      const b = l.specs_bedrooms ?? 0;
      if (n >= 4 ? b < 4 : b !== n) return false;
    }
    if (f.budget) {
      const [kind, range] = f.budget.split(":");
      const [min, max] = (range ?? "").split("-").map((x) => (x ? Number(x) : undefined));
      const isRent = l.transaction !== "Sale";
      if ((kind === "rent") !== isRent) return false;
      // Per-acre land prices can't be compared with a total budget.
      if (l.price_value == null || l.price_unit === "acre") return false;
      if (min != null && l.price_value < min) return false;
      if (max != null && l.price_value > max) return false;
    }
    return true;
  });
}

/** Normalise raw searchParams into known string filters. */
export function readFilters(sp: Record<string, string | string[] | undefined>): ListingFilters {
  const one = (k: string) => {
    const v = sp[k];
    const s = Array.isArray(v) ? v[0] : v;
    return s && s.length <= 60 ? s : undefined;
  };
  return { for: one("for"), type: one("type"), area: one("area"), budget: one("budget"), beds: one("beds") };
}
