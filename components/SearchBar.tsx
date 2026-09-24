import { Search } from "lucide-react";
import { AREAS, AREA_KEYS } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export type ListingFilters = {
  for?: string;
  type?: string;
  area?: string;
  budget?: string;
  beds?: string;
};

/**
 * Plain GET form to /[lang]/listings — works without JavaScript.
 * Used as the quick search on the home page and the filter bar on /listings.
 */
export default function SearchBar({
  action,
  t,
  values = {},
  variant = "home",
  otherAreas = [],
}: {
  action: string;
  t: Dictionary["listings"];
  values?: ListingFilters;
  variant?: "home" | "page";
  otherAreas?: string[];
}) {
  const sel = "field !min-h-12 !rounded-[6px] !border-mist !bg-paper";
  const lbl = "mb-1.5 block text-[12px] text-pewter";
  return (
    <form action={action} method="get" className={`grid gap-3 ${variant === "home" ? "md:grid-cols-[auto_1fr_1fr_1fr_auto]" : "sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_1fr_auto]"} items-end`}>
      <fieldset>
        <legend className={lbl}>{t.purpose}</legend>
        <div className="flex h-12 rounded-full bg-mist p-1">
          {[
            ...(variant === "page" ? [{ v: "", label: t.any }] : []),
            { v: "sale", label: t.buy },
            { v: "rent", label: t.rent },
          ].map((o) => (
            <label key={o.v} className="relative flex-1 cursor-pointer">
              <input type="radio" name="for" value={o.v} defaultChecked={(values.for ?? (variant === "home" ? "sale" : "")) === o.v} className="peer sr-only" />
              <span className="flex h-full items-center justify-center rounded-full px-4 text-[14px] md:px-5 text-pewter transition-colors peer-checked:bg-char peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-brand">
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`type-${variant}`} className={lbl}>{t.type}</label>
        <select id={`type-${variant}`} name="type" defaultValue={values.type ?? ""} className={sel}>
          <option value="">{t.any}</option>
          {Object.entries(t.types).map(([v, label]) => (
            <option key={v} value={v}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`area-${variant}`} className={lbl}>{t.area}</label>
        <select id={`area-${variant}`} name="area" defaultValue={values.area ?? ""} className={sel}>
          <option value="">{t.any}</option>
          {AREA_KEYS.map((k) => (
            <option key={k} value={k}>{AREAS[k].name}</option>
          ))}
          {otherAreas.length ? (
            <optgroup label={t.otherAreas}>
              {otherAreas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </optgroup>
          ) : null}
        </select>
      </div>

      <div>
        <label htmlFor={`budget-${variant}`} className={lbl}>{t.budget}</label>
        <select id={`budget-${variant}`} name="budget" defaultValue={values.budget ?? ""} className={sel}>
          <option value="">{t.any}</option>
          <optgroup label={t.rent}>
            {t.budgets.rent.map((b) => (
              <option key={`r${b.value}`} value={`rent:${b.value}`}>{b.label}</option>
            ))}
          </optgroup>
          <optgroup label={t.buy}>
            {t.budgets.buy.map((b) => (
              <option key={`b${b.value}`} value={`sale:${b.value}`}>{b.label}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {variant === "page" ? (
        <div>
          <label htmlFor="beds-page" className={lbl}>{t.beds}</label>
          <select id="beds-page" name="beds" defaultValue={values.beds ?? ""} className={sel}>
            <option value="">{t.any}</option>
            {["1", "2", "3", "4"].map((n) => (
              <option key={n} value={n}>{n === "4" ? "4+ BHK" : `${n} BHK`}</option>
            ))}
          </select>
        </div>
      ) : null}

      <button type="submit" className="btn btn-dark h-12 !px-6">
        <Search size={16} strokeWidth={1.6} aria-hidden />
        {t.apply}
      </button>
    </form>
  );
}
