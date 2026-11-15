# Google Business Profile — auto-post new listings

**What it does:** when a new *available* listing is saved in `/admin`, the site publishes a "What's new" post on the SATYASRI REALTORS
Google Business Profile: photo, title, area, BHK/size, price, a **Learn more** button to the listing page, and the WhatsApp number.
Code: `lib/gbp.ts`, hook in `app/admin/actions.ts` (`saveListing`). It is **off** until the five `GBP_*` variables exist, and it never
blocks saving a property if Google is down.

**What it cannot do:** Google Business Profile has no "property listings" feature (no API for it, and Merchant Center does not take real
estate), so a listing can only appear as a **post**. Posts show on the profile in Search/Maps for ~6 months, then drop off.
Sold/rented listings are not removed automatically (Google posts can only be deleted by their resource name — extend later if needed).

## One-time setup (needs the Google account that manages the profile — Mahesh's)

1. **Request Business Profile API access** (Google approves this manually, usually a few days to a couple of weeks):
   Google Cloud console → new project `satyasri-gbp` → submit the form at
   https://support.google.com/business/contact/api_default ("Business Profile API access"), using the profile's website
   `https://satyasri.com` and the business email. After approval, enable **My Business API** (and *Business Profile Performance*, optional).
2. **OAuth client:** APIs & Services → OAuth consent screen (External, add Mahesh's Google account as a test user) →
   Credentials → Create OAuth client ID → type **Desktop app** → copy the client id/secret.
3. **Get the refresh token** (sign in as Mahesh when the link opens):
   ```
   GBP_CLIENT_ID=... GBP_CLIENT_SECRET=... node scripts/gbp-auth.mjs url
   # open the URL, approve; the browser lands on http://localhost:8085/?code=XXXX  (page will not load — copy the code)
   GBP_CLIENT_ID=... GBP_CLIENT_SECRET=... node scripts/gbp-auth.mjs code XXXX
   ```
4. **Find the ids:** with an access token, `GET https://mybusinessaccountmanagement.googleapis.com/v1/accounts` →
   `GBP_ACCOUNT_ID` (number after `accounts/`); then
   `GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts/{id}/locations?readMask=name,title` →
   `GBP_LOCATION_ID` (number after `locations/`, for SATYASRI REALTORS; store code 15894694154167330547).
5. **Set the five variables** (`GBP_CLIENT_ID`, `GBP_CLIENT_SECRET`, `GBP_REFRESH_TOKEN`, `GBP_ACCOUNT_ID`, `GBP_LOCATION_ID`) in the
   production environment of the site, redeploy, then add a test listing.

Photos must be public JPG/PNG at least 400×300 px (the site's listing images are).
