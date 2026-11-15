import "server-only";
import { SITE, SITE_URL } from "./site";

/**
 * Google Business Profile — "What's new" posts for new listings.
 *
 * Switched off until all five GBP_* variables are set (see docs/GOOGLE-PROFILE-AUTOMATION.md).
 * Never throws: a Google outage or missing access must not stop an admin saving a property.
 */

export type GbpListing = {
  title: string;
  slug: string;
  transaction: string;
  type: string;
  price: string | null;
  price_unit?: string | null;
  summary: string | null;
  specs_bedrooms?: number | null;
  specs_area?: string | null;
  specs_furnishing?: string | null;
  location_area?: string | null;
  images: string[];
};

const env = () => ({
  clientId: process.env.GBP_CLIENT_ID,
  clientSecret: process.env.GBP_CLIENT_SECRET,
  refreshToken: process.env.GBP_REFRESH_TOKEN,
  account: process.env.GBP_ACCOUNT_ID, // numeric id from accounts.list
  location: process.env.GBP_LOCATION_ID, // numeric id from locations.list
});

export function gbpEnabled() {
  const e = env();
  return Boolean(e.clientId && e.clientSecret && e.refreshToken && e.account && e.location);
}

async function accessToken(): Promise<string> {
  const e = env();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: e.clientId!,
      client_secret: e.clientSecret!,
      refresh_token: e.refreshToken!,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`token: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

function postText(l: GbpListing): string {
  const unit = l.price_unit === "month" ? "/month" : "";
  const lines = [
    `${l.title}`,
    [l.location_area, l.type, l.transaction === "Sale" ? "For sale" : l.transaction === "Rent" ? "For rent" : "For lease"].filter(Boolean).join(" · "),
    [l.specs_bedrooms ? `${l.specs_bedrooms} BHK` : null, l.specs_area, l.specs_furnishing].filter(Boolean).join(" · "),
    l.price ? `Price: ${l.price}${l.price.includes("/") ? "" : unit}` : null,
    l.summary,
    `Site visit and details: WhatsApp ${SITE.phoneDisplay}`,
  ].filter(Boolean) as string[];
  return lines.join("\n").slice(0, 1450);
}

const abs = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);

/** Publish one post for a listing. Returns the post resource name, or null when skipped/failed. */
export async function postListingToGoogle(l: GbpListing): Promise<string | null> {
  if (!gbpEnabled()) return null;
  try {
    const e = env();
    const token = await accessToken();
    const body = {
      languageCode: "en",
      topicType: "STANDARD",
      summary: postText(l),
      callToAction: { actionType: "LEARN_MORE", url: `${SITE_URL}/en/listings/${l.slug}` },
      ...(l.images[0] ? { media: [{ mediaFormat: "PHOTO", sourceUrl: abs(l.images[0]) }] } : {}),
    };
    const res = await fetch(`https://mybusiness.googleapis.com/v4/accounts/${e.account}/locations/${e.location}/localPosts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`localPosts: ${res.status} ${await res.text()}`);
    return ((await res.json()) as { name?: string }).name ?? null;
  } catch (err) {
    console.error("[gbp] could not publish listing post:", (err as Error).message);
    return null;
  }
}
