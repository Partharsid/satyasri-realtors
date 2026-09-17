# Satyasri Realtors — Website

Production-quality business website for **Satyasri Realtors**, a Registered Real Estate Consultant based in Hyderabad, India.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Resend · Google Sheets API · Telegram Bot API

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# → Edit .env.local and fill in all values (see credential setup below)

# 3. Start the dev server
npm run dev
# → Open http://localhost:3000
```

### Build & Lint

```bash
npm run build   # production build — must pass with 0 errors
npm run lint    # ESLint check — must pass clean
```

---

## Adding New Property Listings

**No code knowledge needed.** Open `data/listings.ts` and add a new object to the `listings` array at the top. Follow the existing three listings as a template — every field is documented with a comment.

```ts
{
  slug: "unique-url-slug",          // becomes /listings/unique-url-slug
  title: "Property Title",
  type: "Apartment",                // Land | Apartment | Villa | Commercial
  transaction: "Rent",              // Sale | Rent
  price: "₹XX,000/month",
  priceNumeric: 00000,              // numeric value for sorting
  location: { area: "...", city: "Hyderabad", state: "Telangana" },
  summary: "One-line card summary",
  description: "Full detail page description",
  specs: { area: "...", bedrooms: 3, ... },
  features: ["Feature 1", "Feature 2"],
  images: ["/images/your-photo.jpg"],
  thumbnail: "/images/your-photo.jpg",
  isFeatured: true,
}
```

Drop property images into `public/images/` and reference them by that path.

---

## Credential Setup

### 1. Google Sheets (lead storage)

1. Go to [Google Cloud Console](https://console.cloud.google.com) → create a new project
2. Enable **Google Sheets API**
3. IAM & Admin → Service Accounts → Create Service Account → grant no roles
4. Create a JSON key for the service account → download it
5. Create a Google Sheet with headers in row 1: `Timestamp | Name | Phone | Email | Message | Property | Source | Website`
6. Share the Sheet with the **service account email** (`client_email` in the JSON) as **Editor**
7. Copy `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
8. Copy `private_key` → `GOOGLE_PRIVATE_KEY` (keep the `-----BEGIN/END-----` lines; replace literal newlines with `\n`)
9. Copy the Sheet ID from its URL → `GOOGLE_SHEET_ID`

### 2. Email via Resend

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain (`satyasri.com`) — follow their DNS instructions
3. API Keys → Create API Key → copy → `RESEND_API_KEY`
4. Set `RESEND_FROM_DOMAIN=satyasri.com` and `EMAIL_TO=mahesh@satyasri.com`

### 3. Telegram Bot

1. Open Telegram → message **@BotFather** → `/newbot` → follow prompts
2. Copy the token → `TELEGRAM_BOT_TOKEN`
3. Send `/start` to your bot in the chat/group where you want lead alerts
4. Visit `https://api.telegram.org/bot<TOKEN>/getUpdates` in your browser
5. Find `"chat": {"id": ...}` → copy that number → `TELEGRAM_CHAT_ID`
   - For a group/channel it will be a negative number like `-1001234567890`

### 4. Google Analytics (optional)

1. Go to [analytics.google.com](https://analytics.google.com) → Admin → Data Streams → add a Web stream for `satyasri.com`
2. Copy the **Measurement ID** (`G-XXXXXXXXXX`) → `NEXT_PUBLIC_GA_MEASUREMENT_ID`
3. Leave blank to disable analytics entirely

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time — follow prompts)
vercel

# Production deploy
vercel --prod
```

Then in the Vercel dashboard:
- **Settings → Environment Variables** — add every variable from `.env.example` with their real values
- **Settings → Domains** — add `satyasri.com` and `www.satyasri.com`

Vercel auto-deploys from the main branch on every push. Zero additional config required.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL, no trailing slash |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | GA4 Measurement ID — omit to disable |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Yes* | Service account `client_email` |
| `GOOGLE_PRIVATE_KEY` | Yes* | Service account `private_key` |
| `GOOGLE_SHEET_ID` | Yes* | Target Google Sheet ID |
| `RESEND_API_KEY` | Yes* | Resend API key |
| `RESEND_FROM_DOMAIN` | Yes* | Verified Resend sender domain |
| `EMAIL_TO` | No | Lead notification email (default: `mahesh@satyasri.com`) |
| `TELEGRAM_BOT_TOKEN` | Yes* | Telegram bot token from @BotFather |
| `TELEGRAM_CHAT_ID` | Yes* | Chat/group/channel ID for lead alerts |

\* The lead form still works if any channel fails — `Promise.allSettled` ensures one failure never blocks the others. If all three fail, the user is shown the WhatsApp number as fallback.

---

## Project Structure

```
satyasri-realtors/
├── app/
│   ├── layout.tsx          # Root layout — fonts, Navbar, Footer, WhatsApp FAB, GA
│   ├── page.tsx            # Home page
│   ├── not-found.tsx       # Custom 404
│   ├── sitemap.ts          # Auto-generated sitemap
│   ├── robots.ts           # robots.txt
│   ├── globals.css         # Brand palette, utility classes
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── contact/page.tsx
│   ├── listings/
│   │   ├── page.tsx        # All listings (server component)
│   │   ├── ListingsClient.tsx  # Client-side filter UI
│   │   └── [slug]/page.tsx # Individual listing detail page
│   └── api/contact/route.ts  # Lead capture API (Sheets + Email + Telegram)
├── components/
│   ├── Navbar.tsx          # Sticky nav with mobile menu + click-to-call
│   ├── Footer.tsx
│   ├── WhatsAppFAB.tsx     # Floating WhatsApp button
│   ├── ListingCard.tsx     # Property card used in grids
│   └── LeadForm.tsx        # React Hook Form + Zod + honeypot
├── data/
│   ├── listings.ts         # ← ADD NEW PROPERTIES HERE
│   └── business.ts         # Business name, contacts, address
└── public/
    └── images/             # ← DROP PROPERTY PHOTOS HERE
```
