-- SatyaSri Realtors — rebuild migration (2026-09-25)
-- Idempotent: safe to re-run. Apply on top of 0001_init.sql.

-- ── Admin allow-list ────────────────────────────────────────────────────────
-- Only emails listed here may write listings, blog posts, reviews, settings,
-- storage objects, or read leads. Being "authenticated" is not enough: this
-- Supabase instance is shared, so anyone could sign up for an account.
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

insert into public.admins (email) values
  ('partharsid@gmail.com'),
  ('mahesh@satyasri.com')
on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "Admins can read admins" on public.admins;
create policy "Admins can read admins" on public.admins for select using (public.is_admin());

-- ── updated_at helper ───────────────────────────────────────────────────────
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Listings ────────────────────────────────────────────────────────────────
alter table public.listings add column if not exists status text not null default 'available';
alter table public.listings add column if not exists area_key text;
alter table public.listings add column if not exists price_value bigint;
alter table public.listings add column if not exists price_unit text not null default 'total';
alter table public.listings add column if not exists sort_order integer not null default 0;

alter table public.listings drop constraint if exists listings_status_check;
alter table public.listings add constraint listings_status_check
  check (status in ('available', 'sold', 'rented', 'hidden'));
alter table public.listings drop constraint if exists listings_price_unit_check;
alter table public.listings add constraint listings_price_unit_check
  check (price_unit in ('total', 'month', 'acre', 'sqyd', 'sqft'));

drop trigger if exists listings_touch on public.listings;
create trigger listings_touch before update on public.listings
  for each row execute function public.touch_updated_at();

drop policy if exists "Public can view active listings" on public.listings;
drop policy if exists "Admins can insert listings" on public.listings;
drop policy if exists "Admins can update listings" on public.listings;
drop policy if exists "Admins can delete listings" on public.listings;
create policy "Public can view listings" on public.listings for select
  using (status <> 'hidden' or public.is_admin());
create policy "Admins can insert listings" on public.listings for insert with check (public.is_admin());
create policy "Admins can update listings" on public.listings for update using (public.is_admin());
create policy "Admins can delete listings" on public.listings for delete using (public.is_admin());

-- ── Leads ───────────────────────────────────────────────────────────────────
alter table public.leads add column if not exists message text;
alter table public.leads add column if not exists property text;
alter table public.leads add column if not exists lang text;
alter table public.leads add column if not exists notes text;

alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check
  check (status in ('new', 'contacted', 'closed', 'spam'));

drop policy if exists "Admins can view leads" on public.leads;
drop policy if exists "Admins can update leads" on public.leads;
drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can view leads" on public.leads for select using (public.is_admin());
create policy "Admins can update leads" on public.leads for update using (public.is_admin());
create policy "Admins can delete leads" on public.leads for delete using (public.is_admin());
-- Inserts happen only from the /api/lead route with the service-role key.

-- ── Blog ────────────────────────────────────────────────────────────────────
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null default '',
  cover text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.blog_posts enable row level security;

drop trigger if exists blog_touch on public.blog_posts;
create trigger blog_touch before update on public.blog_posts
  for each row execute function public.touch_updated_at();

drop policy if exists "Public can read published posts" on public.blog_posts;
drop policy if exists "Admins manage posts" on public.blog_posts;
create policy "Public can read published posts" on public.blog_posts for select
  using (published or public.is_admin());
create policy "Admins manage posts" on public.blog_posts for all
  using (public.is_admin()) with check (public.is_admin());

-- ── Reviews (curated from Google) ───────────────────────────────────────────
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  body text not null,
  rating smallint not null default 5 check (rating between 1 and 5),
  year smallint,
  source text not null default 'Google',
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;

drop policy if exists "Public can read visible reviews" on public.reviews;
drop policy if exists "Admins manage reviews" on public.reviews;
create policy "Public can read visible reviews" on public.reviews for select
  using (visible or public.is_admin());
create policy "Admins manage reviews" on public.reviews for all
  using (public.is_admin()) with check (public.is_admin());

-- ── Site settings (key/value, editable in /admin) ───────────────────────────
create table if not exists public.settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.settings enable row level security;

drop policy if exists "Public can read settings" on public.settings;
drop policy if exists "Admins manage settings" on public.settings;
create policy "Public can read settings" on public.settings for select using (true);
create policy "Admins manage settings" on public.settings for all
  using (public.is_admin()) with check (public.is_admin());

insert into public.settings (key, value) values
  ('rera_number', ''),
  ('founder_photo', ''),
  ('public_email', ''),
  ('google_rating', '5.0'),
  ('google_review_count', '24')
on conflict (key) do nothing;

-- ── Storage: property images ────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('properties', 'properties', true)
on conflict (id) do nothing;

drop policy if exists "Public can view property images" on storage.objects;
drop policy if exists "Admins can upload property images" on storage.objects;
drop policy if exists "Admins can update property images" on storage.objects;
drop policy if exists "Admins can delete property images" on storage.objects;
create policy "Public can view property images" on storage.objects for select
  using (bucket_id = 'properties');
create policy "Admins can upload property images" on storage.objects for insert
  with check (bucket_id = 'properties' and public.is_admin());
create policy "Admins can update property images" on storage.objects for update
  using (bucket_id = 'properties' and public.is_admin());
create policy "Admins can delete property images" on storage.objects for delete
  using (bucket_id = 'properties' and public.is_admin());
