/** Indian-style number formatting: 7500000 → "75,00,000". */
export function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

/** Compact rupee amount: 2600000 → "₹26 L", 12500000 → "₹1.25 Cr", 52000 → "₹52,000". */
export function rupeesCompact(n: number) {
  if (n >= 1_00_00_000) return `₹${trim(n / 1_00_00_000)} Cr`;
  if (n >= 1_00_000) return `₹${trim(n / 1_00_000)} L`;
  return `₹${inr(n)}`;
}

function trim(x: number) {
  return x.toFixed(2).replace(/\.?0+$/, "");
}

type PriceLabels = { perMonth: string; perAcre: string };

/**
 * Display price. Prefers the structured value; falls back to the free-text
 * `price` column so older rows keep rendering.
 */
export function formatPrice(
  l: { price: string | null; price_value: number | null; price_unit: string },
  labels: PriceLabels,
) {
  if (l.price_value == null) return { amount: l.price ?? "", unit: "" };
  const amount = l.price_unit === "month" ? `₹${inr(l.price_value)}` : rupeesCompact(l.price_value);
  const unit =
    l.price_unit === "month" ? labels.perMonth
    : l.price_unit === "acre" ? labels.perAcre
    : l.price_unit === "sqyd" ? "/sq yd"
    : l.price_unit === "sqft" ? "/sq ft"
    : "";
  return { amount, unit };
}

export function readingMinutes(markdown: string) {
  return Math.max(1, Math.round(markdown.split(/\s+/).length / 200));
}

/** Stock photos shipped with the site are marked as representative in the UI. */
export function isRepresentative(src: string | null | undefined) {
  return !!src && src.startsWith("/media/photos/");
}
