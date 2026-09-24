"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { TAGS } from "@/lib/supabase/clients";
import { AREA_KEYS } from "@/lib/site";
import { slugify } from "@/lib/slug";
import { requireAdmin } from "./auth";

export type Result = { ok: true; id?: string } | { ok: false; error: string };

async function admin() {
  const ctx = await requireAdmin();
  if (!ctx.isAdmin) throw new Error("Your account is not on the admin list.");
  return ctx.supabase;
}

function fail(e: unknown): Result {
  return { ok: false, error: e instanceof Error ? e.message : String(e) };
}

const opt = (max = 300) => z.string().trim().max(max).optional().transform((v) => (v ? v : null));
const list = z.array(z.string().trim().min(1).max(300)).max(40).default([]);

// ── Listings ────────────────────────────────────────────────────────────────
const ListingInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().max(90).optional(),
  title: z.string().trim().min(3).max(160),
  summary: opt(400),
  description: opt(5000),
  type: z.enum(["Apartment", "Villa", "Land", "Commercial"]),
  transaction: z.enum(["Sale", "Rent", "Lease"]),
  status: z.enum(["available", "sold", "rented", "hidden"]),
  price: opt(80),
  price_value: z.coerce.number().int().nonnegative().max(1e11).nullable().optional(),
  price_unit: z.enum(["total", "month", "acre", "sqyd", "sqft"]),
  isFeatured: z.boolean(),
  sort_order: z.coerce.number().int().min(-1000).max(1000).default(0),
  area_key: z.enum(AREA_KEYS).nullable().optional(),
  location_area: opt(80),
  location_city: opt(80),
  location_state: opt(80),
  location_full_address: opt(300),
  specs_area: opt(60),
  specs_bedrooms: z.coerce.number().int().min(0).max(20).nullable().optional(),
  specs_bathrooms: z.coerce.number().int().min(0).max(20).nullable().optional(),
  specs_facing: opt(40),
  specs_floor: opt(40),
  specs_furnishing: opt(40),
  specs_parking: opt(60),
  specs_availability: opt(60),
  specs_tenant_restriction: opt(60),
  features: list,
  amenities: list,
  images: z.array(z.string().url().or(z.string().startsWith("/"))).max(30).default([]),
});
export type ListingInput = z.input<typeof ListingInput>;

export async function saveListing(input: ListingInput): Promise<Result> {
  try {
    const supabase = await admin();
    const v = ListingInput.parse(input);
    const { id, ...row } = v;
    const record = {
      ...row,
      slug: slugify(v.slug || v.title),
      price_value: v.price_value ?? null,
      area_key: v.area_key ?? null,
      specs_bedrooms: v.specs_bedrooms ?? null,
      specs_bathrooms: v.specs_bathrooms ?? null,
      thumbnail: v.images[0] ?? null,
    };
    const q = id
      ? supabase.from("listings").update(record).eq("id", id).select("id").single()
      : supabase.from("listings").insert(record).select("id").single();
    const { data, error } = await q;
    if (error) throw new Error(error.code === "23505" ? "Another property already uses this URL slug." : error.message);
    updateTag(TAGS.listings);
    return { ok: true, id: data.id };
  } catch (e) {
    return fail(e);
  }
}

export async function setListingStatus(id: string, status: "available" | "sold" | "rented" | "hidden"): Promise<Result> {
  try {
    const supabase = await admin();
    const { error } = await supabase.from("listings").update({ status }).eq("id", z.string().uuid().parse(id));
    if (error) throw new Error(error.message);
    updateTag(TAGS.listings);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteListing(id: string): Promise<Result> {
  try {
    const supabase = await admin();
    const { error } = await supabase.from("listings").delete().eq("id", z.string().uuid().parse(id));
    if (error) throw new Error(error.message);
    updateTag(TAGS.listings);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ── Leads ───────────────────────────────────────────────────────────────────
export async function updateLead(id: string, patch: { status?: string; notes?: string }): Promise<Result> {
  try {
    const supabase = await admin();
    const v = z
      .object({ status: z.enum(["new", "contacted", "closed", "spam"]).optional(), notes: z.string().max(2000).optional() })
      .parse(patch);
    const { error } = await supabase.from("leads").update(v).eq("id", z.string().uuid().parse(id));
    if (error) throw new Error(error.message);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteLead(id: string): Promise<Result> {
  try {
    const supabase = await admin();
    const { error } = await supabase.from("leads").delete().eq("id", z.string().uuid().parse(id));
    if (error) throw new Error(error.message);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ── Blog ────────────────────────────────────────────────────────────────────
const PostInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().max(90).optional(),
  title: z.string().trim().min(3).max(160),
  excerpt: opt(400),
  content: z.string().max(60000),
  cover: opt(500),
  published: z.boolean(),
});
export type PostInput = z.input<typeof PostInput>;

export async function savePost(input: PostInput): Promise<Result> {
  try {
    const supabase = await admin();
    const v = PostInput.parse(input);
    const { id, ...row } = v;
    let published_at: string | null | undefined;
    if (v.published) {
      const existing = id ? (await supabase.from("blog_posts").select("published_at").eq("id", id).single()).data : null;
      published_at = existing?.published_at ?? new Date().toISOString();
    } else {
      published_at = null;
    }
    const record = { ...row, slug: slugify(v.slug || v.title), published_at };
    const { data, error } = id
      ? await supabase.from("blog_posts").update(record).eq("id", id).select("id").single()
      : await supabase.from("blog_posts").insert(record).select("id").single();
    if (error) throw new Error(error.code === "23505" ? "Another article already uses this URL slug." : error.message);
    updateTag(TAGS.blog);
    return { ok: true, id: data.id };
  } catch (e) {
    return fail(e);
  }
}

export async function deletePost(id: string): Promise<Result> {
  try {
    const supabase = await admin();
    const { error } = await supabase.from("blog_posts").delete().eq("id", z.string().uuid().parse(id));
    if (error) throw new Error(error.message);
    updateTag(TAGS.blog);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ── Reviews ─────────────────────────────────────────────────────────────────
const ReviewInput = z.object({
  id: z.string().uuid().optional(),
  author: z.string().trim().min(1).max(80),
  body: z.string().trim().min(3).max(1500),
  rating: z.coerce.number().int().min(1).max(5),
  year: z.coerce.number().int().min(2000).max(2100).nullable().optional(),
  visible: z.boolean(),
  sort_order: z.coerce.number().int().min(-1000).max(1000).default(0),
});
export type ReviewInput = z.input<typeof ReviewInput>;

export async function saveReview(input: ReviewInput): Promise<Result> {
  try {
    const supabase = await admin();
    const { id, ...row } = ReviewInput.parse(input);
    const record = { ...row, year: row.year ?? null, source: "Google" };
    const { data, error } = id
      ? await supabase.from("reviews").update(record).eq("id", id).select("id").single()
      : await supabase.from("reviews").insert(record).select("id").single();
    if (error) throw new Error(error.message);
    updateTag(TAGS.reviews);
    return { ok: true, id: data.id };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteReview(id: string): Promise<Result> {
  try {
    const supabase = await admin();
    const { error } = await supabase.from("reviews").delete().eq("id", z.string().uuid().parse(id));
    if (error) throw new Error(error.message);
    updateTag(TAGS.reviews);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ── Settings ────────────────────────────────────────────────────────────────
const SETTING_KEYS = ["rera_number", "founder_photo", "public_email", "google_rating", "google_review_count"] as const;

export async function saveSettings(values: Record<string, string>): Promise<Result> {
  try {
    const supabase = await admin();
    const rows = SETTING_KEYS.map((key) => ({ key, value: String(values[key] ?? "").trim().slice(0, 500), updated_at: new Date().toISOString() }));
    if (rows.find((r) => r.key === "public_email")?.value && !z.string().email().safeParse(rows.find((r) => r.key === "public_email")!.value).success) {
      throw new Error("Public email is not a valid email address.");
    }
    const { error } = await supabase.from("settings").upsert(rows);
    if (error) throw new Error(error.message);
    updateTag(TAGS.settings);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function signOut() {
  const ctx = await requireAdmin().catch(() => null);
  await ctx?.supabase.auth.signOut();
  redirect("/admin/login");
}
