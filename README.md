# SatyaSri Realtors — satyasri.com

Website and admin panel for **SatyaSri Realtors**, a registered real estate consultant in Kondapur, Hyderabad (since 2009).

- **Stack:** Next.js 16 (App Router, `proxy.ts`), React 19, Tailwind CSS 4, Supabase (Postgres + Auth + Storage)
- **Design:** Aker style from Refero, adapted to the logo orange. See [`DESIGN.md`](DESIGN.md).
- **Languages:** English, Telugu, Hindi (`/en`, `/te`, `/hi`). UI copy lives in `lib/i18n/dictionaries/`.
- **Hosting:** Coolify on the OCI main-server (app `satyasri-realtors`), behind Cloudflare.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000 → redirects to /en
```

```bash
npm run build   # production build
npm run lint
```

## Project map

```
app/
  [lang]/                 public site (one root layout per locale)
    page.tsx              home
    listings/             list + filters, [slug] detail
    locations/[area]/     6 neighbourhood pages
    services, about, contact, blog, saved
  admin/                  admin panel (own root layout, English only)
    actions.ts            server actions (admin-only, allow-listed emails)
    ui/                   dashboard panels
  api/lead/route.ts       enquiry form → Supabase + Telegram + Sheets + email
  sitemap.ts, robots.ts, manifest.ts, icon.svg, apple-icon.png, favicon.ico
components/               shared UI (Header, Footer, ListingCard, LeadForm, …)
lib/
  site.ts                 business facts (phone, address, areas) — single source of truth
  data.ts                 cached Supabase reads for public pages
  i18n/                   locales + dictionaries
supabase/
  migrations/             schema (run in order)
  seed/                   content seed
public/brand/             logo SVGs, app icons
public/media/             hero video, poster, photography, OG image
```

## Managing content (no code needed)

Sign in at **https://satyasri.com/admin** with an allow-listed email.

| Tab | What it does |
|---|---|
| Leads | Every enquiry from the site. Set status (new, contacted, closed, spam), add notes, export CSV, call or WhatsApp in one tap. |
| Properties | Add, edit or delete listings, upload photos (the first photo is the cover), mark Sold or Rented, feature on the home page. |
| Journal | Write blog articles in Markdown, with a cover image, preview and publish toggle. |
| Reviews | Google reviews shown on the site. Copy them word for word from the Google Business Profile. |
| Settings | RERA number, founder photo, public email, Google rating and review count. |

Changes appear on the site within seconds (cache tags are refreshed on save).

### Admin access

Writes are allowed only for emails in the `public.admins` table, because the Supabase instance is shared and being signed in is not enough. To add someone:

1. Supabase Studio → Authentication → **Add user** (email + password, auto-confirm).
2. SQL editor: `insert into public.admins (email) values ('person@example.com');`

## Enquiries (lead delivery)

`POST /api/lead` validates the form (with a honeypot and a rate limit of 5 per 10 minutes per IP), then sends to **Supabase `leads`**, **Telegram**, **Google Sheets** and **Resend email** in parallel. The visitor sees success if any channel worked. Failures are logged as `[lead] … failed`.

## Database

Apply `supabase/migrations/*.sql` in order, then `supabase/seed/*.sql`, via Supabase Studio → SQL editor. The migrations are idempotent.

## Deploy (Coolify)

The app builds with Nixpacks from `master`. Auto-deploy is **off**, so deploy manually:

```bash
curl -X POST -H "Authorization: Bearer $COOLIFY_TOKEN" \
  "https://coolify.partharsid.dev/api/v1/deploy?uuid=c3h6yuqfahfnpsxn8414n2lk"
```

Environment variables are set in Coolify (see `.env.example`). `NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them. SSL is handled by Cloudflare.

## Media credits

Hero video: Pexels #15612409 (Financial District, Hyderabad). Photography: Unsplash. Both are free for commercial use. Listing photos are marked "representative" until the owner's photos are uploaded.
