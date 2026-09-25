/**
 * Business facts — the single source of truth for contact details.
 * Values here are verified against the Google Business Profile (2026-09-25).
 * Things the client edits often (RERA no., founder photo, public email)
 * live in the `settings` table and are editable from /admin.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://satyasri.com").replace(/\/$/, "");

const PHONE = "9014224408";

export const SITE = {
  name: "SatyaSri Realtors",
  shortName: "SatyaSri",
  legalCategory: "Registered Real Estate Consultant",
  since: 2009,
  founder: "Mahesh Kumar",
  phone: PHONE,
  phoneDisplay: "+91 90142 24408",
  phoneHref: `tel:+91${PHONE}`,
  whatsapp: `https://wa.me/91${PHONE}`,
  // Email inbox is not set up yet — shown only once `public_email` is set in /admin.
  address: {
    street: "House No. 1-57/384, A Block, Sri Ram Nagar",
    locality: "Kondapur, Serilingampalle (Mandal)",
    city: "Hyderabad",
    region: "Telangana",
    postalCode: "500084",
    country: "IN",
    full: "House No. 1-57/384, A Block, Kondapur, Sri Ram Nagar, Serilingampalle (Mandal), Hyderabad, Telangana 500084",
  },
  geo: { lat: 17.4630821, lng: 78.3563309 },
  hours: { opens: "09:30", closes: "20:30", days: "Mon–Sun" },
  maps: {
    // Google Business Profile listing (5.0★, 24 reviews) — also where "read all reviews" goes.
    place: "https://maps.google.com/?cid=11119575845609808611",
    embed: "https://www.google.com/maps?q=SATYASRI+REALTORS,+Kondapur,+Hyderabad&z=16&output=embed",
  },
  social: {
    facebook: "https://www.facebook.com/SatyasriRealtors/",
    instagram: "https://www.instagram.com/satyasrirealtors",
  },
} as const;

export function whatsappLink(message?: string) {
  return message ? `${SITE.whatsapp}?text=${encodeURIComponent(message)}` : SITE.whatsapp;
}

export const AREA_KEYS = [
  "hitech-city",
  "gachibowli",
  "kondapur",
  "financial-district",
  "kokapet",
  "manikonda",
] as const;
export type AreaKey = (typeof AREA_KEYS)[number];

export const AREAS: Record<AreaKey, { name: string; image: string; mapQuery: string }> = {
  "hitech-city": { name: "Hitech City", image: "/media/photos/area-hitech-city.jpg", mapQuery: "HITEC City, Hyderabad" },
  gachibowli: { name: "Gachibowli", image: "/media/photos/area-gachibowli.jpg", mapQuery: "Gachibowli, Hyderabad" },
  kondapur: { name: "Kondapur", image: "/media/photos/area-kondapur.jpg", mapQuery: "Kondapur, Hyderabad" },
  "financial-district": { name: "Financial District", image: "/media/photos/area-financial-district.jpg", mapQuery: "Financial District, Nanakramguda, Hyderabad" },
  kokapet: { name: "Kokapet", image: "/media/photos/area-kokapet.jpg", mapQuery: "Kokapet, Hyderabad" },
  manikonda: { name: "Manikonda", image: "/media/photos/area-manikonda.jpg", mapQuery: "Manikonda, Hyderabad" },
};

export function isAreaKey(v: string): v is AreaKey {
  return (AREA_KEYS as readonly string[]).includes(v);
}

export function mapEmbed(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
}
