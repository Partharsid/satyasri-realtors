import "server-only";
import { publicClient, TAGS } from "./supabase/clients";

export type ListingType = "Apartment" | "Villa" | "Land" | "Commercial";
export type Transaction = "Sale" | "Rent" | "Lease";
export type ListingStatus = "available" | "sold" | "rented" | "hidden";
export type PriceUnit = "total" | "month" | "acre" | "sqyd" | "sqft";

/** A row of `public.listings` (column names as stored). */
export interface ListingRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  price: string | null;
  price_value: number | null;
  price_unit: PriceUnit;
  type: ListingType;
  transaction: Transaction;
  status: ListingStatus;
  isFeatured: boolean;
  sort_order: number;
  area_key: string | null;
  thumbnail: string | null;
  images: string[] | null;
  location_area: string | null;
  location_city: string | null;
  location_state: string | null;
  location_full_address: string | null;
  specs_area: string | null;
  specs_bedrooms: number | null;
  specs_bathrooms: number | null;
  specs_facing: string | null;
  specs_floor: string | null;
  specs_furnishing: string | null;
  specs_parking: string | null;
  specs_availability: string | null;
  specs_tenant_restriction: string | null;
  features: string[] | null;
  amenities: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover: string | null;
  published: boolean;
  published_at: string | null;
  updated_at: string;
}

export interface Review {
  id: string;
  author: string;
  body: string;
  rating: number;
  year: number | null;
  source: string;
}

export type Settings = Record<string, string>;

const LISTING_ORDER = { column: "sort_order", ascending: true } as const;

// Rows created by the previous site point at SVG placeholders that no longer exist.
const LEGACY_PLACEHOLDERS: Record<string, string> = {
  "/images/placeholder-apartment.jpg": "/media/photos/interior-living.jpg",
  "/images/placeholder-land.jpg": "/media/photos/land-plots.jpg",
};
const fixImage = (src: string | null) => (src && LEGACY_PLACEHOLDERS[src]) || src;

export async function getListings(): Promise<ListingRow[]> {
  const { data, error } = await publicClient(TAGS.listings)
    .from("listings")
    .select("*")
    .neq("status", "hidden")
    .order(LISTING_ORDER.column, { ascending: LISTING_ORDER.ascending })
    .order("created_at", { ascending: false });
  if (error) console.error("[data] listings:", error.message);
  return ((data as ListingRow[] | null) ?? []).map((l) => ({
    ...l,
    thumbnail: fixImage(l.thumbnail),
    images: [...new Set((l.images ?? []).map((s) => fixImage(s)!).filter(Boolean))],
  }));
}

export async function getListing(slug: string): Promise<ListingRow | null> {
  const all = await getListings();
  return all.find((l) => l.slug === slug) ?? null;
}

export async function getPosts(): Promise<BlogPost[]> {
  const { data, error } = await publicClient(TAGS.blog)
    .from("blog_posts")
    .select("id,slug,title,excerpt,content,cover,published,published_at,updated_at")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) console.error("[data] blog:", error.message);
  return (data as BlogPost[] | null) ?? [];
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}

export async function getReviews(): Promise<Review[]> {
  const { data, error } = await publicClient(TAGS.reviews)
    .from("reviews")
    .select("id,author,body,rating,year,source")
    .eq("visible", true)
    .order("sort_order", { ascending: true });
  if (error) console.error("[data] reviews:", error.message);
  return (data as Review[] | null) ?? [];
}

export async function getSettings(): Promise<Settings> {
  const { data, error } = await publicClient(TAGS.settings).from("settings").select("key,value");
  if (error) console.error("[data] settings:", error.message);
  return Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));
}
