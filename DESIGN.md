# SatyaSri Realtors — Design System

Based on the **Aker** style from Refero Styles
(https://styles.refero.design/style/4aa6d64c-fa61-4b21-8ad6-3d7130ed5161, "darkroom gallery wall"),
adapted to the SatyaSri logo. Everything here overrides the old navy/gold theme.

> Monumental whisper-weight type over muted, full-bleed Hyderabad photography and video.
> White gallery walls, near-monochrome UI, one warm accent — the logo orange.

## SatyaSri adaptations of Aker

| Aker | SatyaSri | Why |
|---|---|---|
| Ember `#b75928` (sole accent) | **Brand Orange `#F0531C`** (logo) for fills, marks and large text; **Orange Deep `#C2410C`** for small text/links | Match the logo; `#F0531C` fails AA for small text on white, `#C2410C` passes (5.2:1) |
| Proxima Nova (paid) | **Montserrat** 300/400/500/600 (Aker's own suggested substitute) + **Noto Sans Telugu / Noto Sans Devanagari** for తెలుగు / हिन्दी | Free, and multilingual |
| Lora serif accent | Lora 400, body passages only, ≤18px | unchanged |
| Brand wordmark "AKER" at 168px | "SatyaSri" wordmark at up to 168px (clamp down on mobile) | unchanged treatment |
| Hero = still photo | Hero = **muted background video** (poster image fallback, respects `prefers-reduced-motion`) | Client request |
| Nav = single hidden pill | Dark pill menu **plus** always-visible Call + WhatsApp actions | Leads come from WhatsApp/calls — never hide them |
| Pine / Tide / Cedar / Coral surfaces | Kept for occasional feature cards only | unchanged |

## Colors

| Name | Value | Role |
|---|---|---|
| Ink | `#000000` | Primary text, hairlines, icons on light |
| Charcoal (logo text) | `#2B2B2B` | Wordmark on light, headings alternative |
| Paper | `#ffffff` | Page canvas, text on dark photography |
| Char | `#1c1c1c` | Nav pill, dark panels, filled dark buttons |
| Midnight | `#070707` | Deepest surfaces, overlays |
| Iron | `#262626` | Mid-dark panels |
| Slate | `#38464a` | Cool dark surface |
| Mist | `#e5e4e4` | Light cards, hairline borders on white |
| Smoke | `#8d8d8d` | Helper text, metadata, section labels |
| Pewter | `#666666` | Secondary body text |
| **Brand Orange** | `#F0531C` | Single accent: price highlights, key CTA fill, marks, one highlight per section max |
| **Orange Deep** | `#C2410C` | Accent as small text / links on white |
| Pine | `#193f32` | Feature card surface |
| Tide | `#002934` | Feature card surface |
| Driftwood | `#537179` | Decorative strokes |
| Cedar | `#776157` | Earth-tone card variant |
| Action Fill | `#494949` | Neutral filled action / selected control |

Rules: one chromatic accent only (orange). No gradients. No drop shadows — depth comes from photography and surface contrast.

## Typography

- **Montserrat** — all UI. Weight **300** for display and big section headings (62–80px, wordmark up to 168px). 400–500 body/labels. 600 only for small emphasis labels. Never 600/700 at display sizes.
- **Lora** 400 — editorial body passages only, 15–18px, never headings.
- Telugu/Hindi: Noto Sans Telugu / Noto Sans Devanagari, same weights, line-height +0.1.

| Role | Size | Line height | Tracking | Weight |
|---|---|---|---|---|
| body | 15px | 1.5 | 0.15px | 400 |
| subheading | 18px | 1.5 | 0.18px | 400 |
| heading-sm | 22px | 1.25 | -0.44px | 400 |
| heading | 36px | 1.2 | -0.72px | 300 |
| heading-lg | 62px | 1.1 | -1.55px | 300 |
| display | 168px | 0.8 | -4.2px | 300 |

Display letter-spacing -0.025em; mid headings -0.02em; body +0.01em. Scale down with `clamp()` on mobile.

## Spacing, radius, layout

- Spacing scale: 4, 5, 6, 8, 10, 12, 13, 14, 16, 19, 20, 22, 24, 32, 48, 64.
- Radius: cards/images **8px**; small 3.2px; buttons **80px**; badges/pills/nav 1584px (never on cards/images).
- Page max-width 1200px; section gap 80px; card padding 16px (24px on feature cards); element gap 16px.
- Rhythm: alternate full-bleed photo bands (100vw, no radius) with white max-width content sections.
- Editorial text left-aligned, max ~600px. No centered paragraph stacks.

## Components

- **Full-bleed hero** — 100vw × 100svh muted video (poster fallback). Wordmark "SatyaSri" in Paper weight 300 bottom-left; short intro paragraph top-left (15px Paper, max 400px); Call Now + WhatsApp actions.
- **Navigation pill** — fixed top-right, Char bg, 32–40px high, full radius, "SATYASRI" 12px/500 + hamburger. Opens a full-screen Char menu of 2-column image cards (4:3 photo left, title 15px Paper, description 12px Mist, → icon).
- **Text-arrow button** — ghost, 13–15px/400 + trailing →; pill-outlined variant for emphasis (80px radius, 19px × 16px padding).
- **Filled dark button** — Char fill, Paper 13px/500, 80px radius. **Orange filled button** reserved for the single primary conversion action (WhatsApp enquiry).
- **Section label** — 12px/400 Smoke, 6–8px above heading, left-aligned.
- **Section heading** — 36–62px weight 300, tracking -0.02em.
- **Two-column feature card** — left: Mist card with label + 36–48px/300 heading + text-arrow button; right: full-bleed photo card with Paper text overlay. 8px radius.
- **Numbered list** — "01" in 12px Smoke + 18px/400 label, 1px Mist hairline above each row, 24px vertical padding. Used for services / process.
- **Pill badge** — Mist bg + Ink text (or transparent + Paper on dark), 12px/500, 6–8 × 14px padding.
- **Property card** — 8px-radius 4:3 photo, pill badges (Rent/Sale, type) over image, price in Orange Deep, title 18px/400, location 13px Pewter, spec row (area · beds · facing · parking) with 1px Mist hairline above, favourite heart, WhatsApp text-arrow.
- **Image thumbnail card** — 8px radius, 4:3, dark overlay, Paper title + Mist subtitle.

## Imagery

Photography/video is the dominant element (50–70% of viewport in section openers). Muted, slightly desaturated cityscape, skyline, aerial and residential-community shots of Hyderabad (Hitech City, Gachibowli, Financial District). Warm earth tones welcome — they echo the orange. No illustrations, no 3D renders, no abstract graphics. All media self-hosted and optimised (AVIF/WebP images, H.264 + WebM video ≤ ~4 MB, poster JPG).

## Don'ts

- No gradients, no box-shadows, no extra accent hues.
- No bold display type.
- No centered body paragraphs.
- No pill radius on cards or images.
- Never hide Call / WhatsApp behind the menu.
