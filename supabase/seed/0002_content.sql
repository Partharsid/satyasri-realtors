-- SatyaSri Realtors — content seed (2026-09-25). Safe to re-run.

-- ── Listings: structured price, area pages, representative photos ──────────
update public.listings set
  area_key = null,
  price_value = 2600000, price_unit = 'acre', sort_order = 3,
  images = '["/media/photos/land-plots.jpg","/media/photos/land-fields.jpg"]'::jsonb,
  thumbnail = '/media/photos/land-plots.jpg',
  location_city = coalesce(location_city, 'Nellore District'),
  location_state = coalesce(location_state, 'Andhra Pradesh')
where slug = 'land-sitharamapuram-nellore-105-acres';

update public.listings set
  area_key = 'kondapur',
  price_value = 52000, price_unit = 'month', sort_order = 1,
  -- the brief never states furnishing for this flat
  specs_furnishing = null,
  images = '["/media/photos/interior-living.jpg","/media/photos/interior-kitchen.jpg","/media/photos/interior-bedroom.jpg","/media/photos/interior-lounge.jpg"]'::jsonb,
  thumbnail = '/media/photos/interior-living.jpg',
  features = '["Side balcony & front foyer (grill enclosed)","Modular kitchen with stove & chimney unit","Aquaguard water filtration system installed","Wash area behind kitchen","Spacious living room & dining area","All 3 bedrooms with working A/C units","2 bathrooms with geyser units installed","BGL gas pipeline connection directly to the unit","Monthly maintenance ₹4,000–5,000; tenant pays gas, electricity & water"]'::jsonb
where slug = '3bhk-aditya-heights-kondapur';

update public.listings set
  area_key = 'gachibowli',
  price_value = 75000, price_unit = 'month', sort_order = 2,
  images = '["/media/photos/interior-lounge.jpg","/media/photos/interior-bedroom.jpg","/media/photos/interior-kitchen.jpg"]'::jsonb,
  thumbnail = '/media/photos/interior-lounge.jpg'
where slug = '3bhk-ramky-towers-gachibowli';

-- ── Reviews: verbatim from the Google Business Profile (5.0★, 24 reviews) ──
delete from public.reviews where source = 'Google';
insert into public.reviews (author, body, rating, year, source, sort_order) values
('Vinit Monga', $$Mr Mahesh is a star broker in Gachibowli. He has helped us with many options at Ramky Towers Gachibowli and eventually helped us buy an apartment there. His brokerage charges are very competitive. He is very diligent in followups on all 3 sides, buyer, seller and government authorities. He knows bank loan processes very well.$$, 5, 2026, 'Google', 1),
('Shipra Mishra', $$We worked with Mahesh to sell our apartment in Gachibowli. Our experience has been top notch. He is someone you can trust and he will not let you down. He is honest, trustworthy and always gets you connected to buyers. He is very transparent and especially as someone, who is not in Hyderabad, you can be rest assured that he will represent you well and provide you with all pros and cons.$$, 5, 2026, 'Google', 2),
('Amod', $$We worked with Mahesh to sell our apartment in Miyapur, and our experience was excellent. He handled the entire process very efficiently and ensured all the registration work was completed smoothly during our short visit to India. We were so satisfied that we are now working with him again to sell another property of ours in Hyderabad.$$, 5, 2025, 'Google', 3),
('Arjun Krishna Kumar', $$I had a very smooth experience with Mahesh to prepare and put our flat on rent in Hyderabad. He helped us from the start and found multiple prospective tenants. He also took care of the paperwork and visited the flat multiple times in person to ensure it was ready. I highly recommend Mahesh.$$, 5, 2025, 'Google', 4),
('Jignesh Desai', $$I have taken Mahesh’s property services twice in the past. He is very professional, trustworthy, and helpful. Both times, he provided excellent service and guided me very well. Highly recommended for property-related services.$$, 5, 2026, 'Google', 5),
('Tarun Maheshwari', $$Professional and very helpful end to end service from property search and selection through to registration. My experience was excellent and would highly recommend Mahesh to anyone looking for property consulting services.$$, 5, 2024, 'Google', 6),
('Deb', $$I am extremely grateful for the outstanding service provided by Shree and Mahesh. Not only did they secure a fantastic deal for me, but their dedication went far beyond expectations. They skillfully negotiated with the owner and were instrumental in coordinating with the plumber, electrician, carpenter, and other professionals.$$, 5, 2024, 'Google', 7),
('Likhit C', $$We had a GREAT experience with mahesh. Excellent service, he got us the tenant within two weeks.$$, 5, 2025, 'Google', 8),
('Shubhranshu Shekhar', $$Finding a 2BHK flat in Hyderabad can be a daunting task with limited inventory and intense competition. However, our experience was made seamless thanks to the exceptional efforts of our agent 'Shree'. He meticulously managed the entire process, from signing the agreement to handing over the keys, ensuring every detail was taken care of.$$, 5, 2024, 'Google', 9),
('Siddarth Ravishankar', $$Excellent service by Mahesh, who helped me with purchase of an apartment.$$, 5, 2025, 'Google', 10);

-- ── Blog: starter articles (general guidance, no invented prices/stats) ────
insert into public.blog_posts (slug, title, excerpt, cover, published, published_at, content) values
('renting-a-flat-in-gachibowli-kondapur-checklist',
 'Renting a flat in Gachibowli or Kondapur: a practical checklist',
 'What to confirm before you pay a token advance — from maintenance charges and gas connections to parking, lease terms and move-in inspections.',
 '/media/photos/interior-living.jpg', true, now() - interval '9 days',
$$Gachibowli and Kondapur sit right next to Hyderabad's IT corridor, which is why good flats here move quickly. Moving fast is fine — skipping checks is not. This is the list we walk every tenant through before a token advance changes hands.

## 1. Know the full monthly cost, not just the rent

Rent is only one line. Ask for these in writing:

- **Society maintenance** — is it included in the rent or paid separately to the association?
- **Utilities** — electricity, water and piped gas are usually paid by the tenant. Check whether meters are individual.
- **Deposit** — how many months, and the conditions for getting it back.
- **Brokerage** — agree on it upfront so there are no surprises on signing day.

## 2. Check what "furnished" actually means

"Semi-furnished" can mean anything from a few lights and fans to wardrobes, a modular kitchen, geysers and ACs. Make an item-by-item list and attach it to the agreement, with the condition of each item noted.

## 3. Test the essentials during the visit

- Run every tap and the geyser; check water pressure on your floor.
- Switch on each AC for a few minutes.
- Ask whether the building has a piped gas line (common in newer gated communities) or uses cylinders.
- Check mobile signal and broadband providers available in the building.
- Look at the power backup — full, partial (lifts and common areas), or none.

## 4. Parking, pets and house rules

Gated communities often have rules on visitor parking, pets, move-in timings and "family only" occupancy. Confirm these before committing — especially the number of covered car parks allotted to the flat.

## 5. The rental agreement

A standard agreement covers rent, deposit, lock-in period, notice period, annual escalation, and who handles which repairs. Read the lock-in and notice clauses carefully; they decide what happens if your plans change.

## 6. Move-in inspection

On the day you receive the keys, photograph every room, meter reading and existing damage, and share them with the owner. It makes the deposit refund straightforward when you move out.

---

Looking for a flat in Gachibowli, Kondapur or Hitech City? Tell us your budget and must-haves and we will shortlist homes that actually match — and handle the paperwork from agreement to handover.$$),

('selling-property-in-hyderabad-while-living-abroad',
 'Selling your Hyderabad property while living abroad: how it works',
 'Many of our sellers live outside Hyderabad or outside India. Here is how a sale can move forward without you being here for every step.',
 '/media/photos/service-signing.jpg', true, now() - interval '5 days',
$$A large share of the owners we work with don't live in Hyderabad any more — some are in other Indian cities, many are abroad. Selling from a distance is very doable when the steps are planned around your visit (or your representative).

## Step 1 — Get the paperwork ready early

Buyers and their banks will ask for the title documents, the previous sale deed chain, approved building plan, property tax receipts, the society NOC and recent utility bills. Gathering these first saves weeks later.

## Step 2 — Price it on real comparables

The right asking price comes from recent transactions in the same community or street — not from listing portals, which show asking prices. A local consultant who closes deals in the area can tell you what similar flats actually sold for.

## Step 3 — Let someone local run the showings

Presenting the property well matters: cleaning, small repairs, and being available for visits at short notice. Having a trusted person on the ground to open the flat, show it and answer questions keeps the momentum going.

## Step 4 — Negotiation and agreement of sale

Once a buyer is found, the terms — price, advance, timelines, what stays in the flat — go into an agreement of sale. If the buyer is taking a home loan, the bank's legal and technical verification happens at this stage.

## Step 5 — Registration

Registration happens at the Sub-Registrar office. If you cannot be present, you can appoint a representative through a properly executed Power of Attorney — for owners abroad this involves the Indian embassy or consulate, so plan it in advance. Many owners instead time a short visit to India for the registration day itself.

## Step 6 — Handover

After registration and payment, the keys, society records and utility transfers are handed over to the new owner.

---

We have helped owners sell apartments in Gachibowli, Miyapur and across West Hyderabad while they were away — coordinating visits, buyers, banks and registration. If you are planning a sale, send us the property details on WhatsApp and we will outline the process for your case.$$),

('hitech-city-financial-district-kokapet-where-to-live',
 'Hitech City, Financial District or Kokapet: choosing where to live in West Hyderabad',
 'A quick guide to the West Hyderabad neighbourhoods we work in every day — what each is known for and who it suits.',
 '/media/photos/area-hitech-city.jpg', true, now() - interval '2 days',
$$West Hyderabad has grown around its technology and business districts, and each neighbourhood has a slightly different character. Here is how we describe them to clients who are new to the city.

## Hitech City

The original IT hub around HITEC City and Cyber Towers. Excellent connectivity via the Metro and major roads, lots of offices, malls and restaurants within minutes. Suits people who want to live close to work and don't mind a busy, urban setting.

## Gachibowli

Home to many large tech campuses, the stadium complex and established gated communities. A strong choice for families who want larger apartments with amenities, and quick access to both Hitech City and the Financial District.

## Kondapur

A residential neighbourhood between Hitech City and Gachibowli with a mix of gated communities and independent buildings. Popular with working professionals because of the range of options and its central position in the IT corridor.

## Financial District

Built around large office parks near Nanakramguda. Newer high-rise residential projects, wide roads and access to the Outer Ring Road. Suits people working in the district itself or commuting towards the airport side of the city.

## Kokapet

One of the newer high-rise growth areas west of the Financial District, near the Outer Ring Road. Known for new launches and premium towers — worth considering for buyers looking at newer construction and longer-term growth.

## Manikonda

A well-established residential area close to Gachibowli and the Financial District, with a wide range of apartments and independent homes and a more lived-in, neighbourhood feel.

---

Every client's shortlist is different — commute, school, budget and lifestyle all matter. Tell us what you need and we will suggest the areas and properties that fit, across all of West Hyderabad.$$)
on conflict (slug) do nothing;
