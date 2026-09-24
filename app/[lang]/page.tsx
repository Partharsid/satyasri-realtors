import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import HeroVideo from "@/components/HeroVideo";
import ListingCard from "@/components/ListingCard";
import SearchBar from "@/components/SearchBar";
import LeadForm from "@/components/LeadForm";
import { ArrowLink, SectionHeading } from "@/components/ui";
import { ReviewsRail } from "@/components/Reviews";
import { PostCard } from "@/components/PostCard";
import { GoogleIcon, WhatsAppIcon } from "@/components/icons";
import { fill, getDictionary, href, isLocale } from "@/lib/i18n";
import { getListings, getPosts, getReviews, getSettings } from "@/lib/data";
import { AREAS, AREA_KEYS, SITE } from "@/lib/site";

export const revalidate = 600;

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const [listings, reviews, posts, settings] = await Promise.all([getListings(), getReviews(), getPosts(), getSettings()]);

  const featured = listings.filter((l) => l.isFeatured && l.status === "available").slice(0, 6);
  const shown = featured.length ? featured : listings.slice(0, 6);
  const years = new Date().getFullYear() - SITE.since;
  const rating = settings.google_rating || "5.0";
  const reviewCount = settings.google_review_count || "24";

  const stats = [
    { value: `${years}+`, label: t.common.yearsLabel },
    { value: rating, label: t.common.googleRating },
    { value: reviewCount, label: fill(t.common.reviews, { n: "" }).trim() },
    { value: String(AREA_KEYS.length), label: t.common.areasServed },
  ];

  const services = (["buy", "sell", "rent", "lease", "invest"] as const).map((k) => t.services.items[k]);

  return (
    <>
      {/* ── Hero: full-bleed muted video, whisper-weight wordmark ─────────── */}
      <section className="relative isolate flex min-h-[calc(100svh-68px)] flex-col justify-between overflow-hidden bg-midnight text-paper md:min-h-[100svh]">
        <HeroVideo poster="/media/hero-poster.jpg" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-85 saturate-[.8]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/10 to-black/75" />

        <div className="wrap pt-28 md:pt-36">
          <p className="max-w-[420px] text-[15px] leading-relaxed text-paper/90 md:text-[16px]">{t.home.heroIntro}</p>
        </div>

        <div className="wrap pb-10 md:pb-14">
          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.3em] text-paper/80 md:text-[13px]">{t.home.heroTagline}</p>
          <h1 className="display -ml-[0.04em]">
            SatyaSri
            <span className="sr-only"> Realtors — {t.meta.title}</span>
          </h1>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={SITE.phoneHref} className="btn bg-paper text-ink hover:bg-mist">
              <Phone size={16} strokeWidth={1.6} aria-hidden /> {t.cta.call} · {SITE.phoneDisplay}
            </a>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <WhatsAppIcon size={17} /> {t.cta.whatsapp}
            </a>
          </div>
        </div>
      </section>

      {/* ── Quick search ─────────────────────────────────────────────────── */}
      <section aria-label={t.home.searchLabel} className="border-b border-mist bg-mist-soft">
        <div className="wrap py-6 md:py-8">
          <SearchBar action={href(lang, "/listings")} t={t.listings} variant="home" />
        </div>
      </section>

      {/* ── Intro statement + verified stats ────────────────────────────── */}
      <section className="section-gap">
        <div className="wrap grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <span className="label mb-3">{t.home.introLabel}</span>
            <h2 className="heading-lg text-balance">{t.home.introHeading}</h2>
          </div>
          <div className="md:col-span-5 md:pt-10">
            <p className="lede text-[#1a1a1a]">{t.home.introBody}</p>
            <div className="mt-8">
              <ArrowLink href={href(lang, "/about")}>{t.home.founderCta}</ArrowLink>
            </div>
          </div>
        </div>
        <dl className="wrap mt-16 grid grid-cols-2 gap-y-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="hairline pr-4 pt-5">
              <dt className="label">{s.label}</dt>
              <dd className="mt-2 text-[44px] font-light leading-none tracking-[-0.03em] md:text-[56px]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Featured properties ──────────────────────────────────────────── */}
      <section className="pb-20 md:pb-28">
        <div className="wrap">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading label={t.home.featuredLabel} title={t.home.featuredHeading} size="md" />
            <ArrowLink href={href(lang, "/listings")}>{t.cta.viewAll}</ArrowLink>
          </div>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((l) => (
              <ListingCard key={l.id} listing={l} lang={lang} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── What we do: photo band + numbered list ───────────────────────── */}
      <section className="relative isolate overflow-hidden bg-midnight text-paper">
        <Image src="/media/photos/city-night.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30" />
        <div className="wrap section-gap grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading label={t.home.servicesLabel} title={t.home.servicesHeading} tone="light" />
            <div className="mt-8">
              <ArrowLink href={href(lang, "/services")} tone="light">{t.nav.services}</ArrowLink>
            </div>
          </div>
          <ol className="md:col-span-7 [&>li>div]:border-iron">
            {services.map((s, i) => (
              <li key={s.title}>
                <div className="grid grid-cols-[48px_1fr] gap-x-4 border-t py-6">
                  <span className="pt-1.5 text-[12px] text-mist/70 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[22px] font-light">{s.title}</h3>
                    <p className="mt-2 max-w-[520px] text-[14px] text-mist/80">{s.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Areas we serve: photo thumbnail cards ────────────────────────── */}
      <section className="section-gap">
        <div className="wrap">
          <SectionHeading label={t.home.areasLabel} title={t.home.areasHeading} className="mb-10" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AREA_KEYS.map((k) => (
              <li key={k}>
                <Link href={href(lang, `/locations/${k}`)} className="group relative block aspect-[4/3] overflow-hidden rounded-card bg-char">
                  <Image src={AREAS[k].image} alt="" fill sizes="(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw" className="photo-zoom object-cover opacity-80" />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute inset-x-5 bottom-5 flex items-end justify-between text-paper">
                    <span>
                      <span className="block text-[26px] font-light leading-tight">{AREAS[k].name}</span>
                      <span className="mt-1 block text-[12px] text-mist/85">{t.areas.items[k].highlights[0]}</span>
                    </span>
                    <ArrowRight size={18} strokeWidth={1.4} aria-hidden className="mb-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Founder: two-column feature cards ────────────────────────────── */}
      <section className="pb-20 md:pb-28">
        <div className="wrap grid gap-3 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-card bg-mist p-6 md:p-10">
            <div>
              <span className="label mb-3">{t.home.founderLabel}</span>
              <h2 className="heading">{t.home.founderHeading}</h2>
              <p className="lede mt-5 max-w-[520px] text-[16px] text-[#1a1a1a] md:text-[17px]">{t.home.founderBody}</p>
            </div>
            <div className="mt-10 flex items-end justify-between">
              <ArrowLink href={href(lang, "/about")}>{t.home.founderCta}</ArrowLink>
              <Image src="/brand/icon.svg" alt="" width={56} height={40} className="opacity-90" />
            </div>
          </div>
          <FounderVisual photo={settings.founder_photo} name={SITE.founder} />
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      {reviews.length ? (
        <section className="border-y border-mist bg-mist-soft section-gap">
          <div className="wrap">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading label={t.home.reviewsLabel} title={t.home.reviewsHeading} size="md" />
              <a href={SITE.maps.place} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 self-start rounded-full bg-paper px-4 py-2.5 text-[14px] md:self-auto">
                <GoogleIcon size={18} />
                <span className="font-medium">{rating}</span>
                <span className="text-pewter">· {fill(t.common.reviews, { n: reviewCount })}</span>
              </a>
            </div>
          </div>
          <ReviewsRail reviews={reviews} />
          <div className="wrap mt-8">
            <ArrowLink href={SITE.maps.place} external>{t.home.reviewsCta}</ArrowLink>
          </div>
        </section>
      ) : null}

      {/* ── Journal ──────────────────────────────────────────────────────── */}
      {posts.length ? (
        <section className="section-gap">
          <div className="wrap">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading label={t.home.journalLabel} title={t.home.journalHeading} size="md" />
              <ArrowLink href={href(lang, "/blog")}>{t.nav.blog}</ArrowLink>
            </div>
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-3">
              {posts.slice(0, 3).map((p) => (
                <PostCard key={p.id} post={p} lang={lang} minRead={t.blog.minRead} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Owner / seeker CTAs ──────────────────────────────────────────── */}
      <section className="pb-20 md:pb-28">
        <div className="wrap grid gap-3 md:grid-cols-2">
          <Link href={`${href(lang, "/contact")}?req=sell#enquiry`} className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-card bg-pine p-6 text-paper md:p-10">
            <div>
              <span className="label mb-3 !text-mist/80">{t.home.ownerLabel}</span>
              <h2 className="heading max-w-md">{t.home.ownerHeading}</h2>
            </div>
            <span className="arrow-link mt-10">
              <span className="border-b border-current/30 pb-0.5">{t.home.ownerCta}</span>
              <ArrowRight size={16} strokeWidth={1.4} aria-hidden />
            </span>
          </Link>
          <Link href={`${href(lang, "/contact")}?req=buy#enquiry`} className="group relative isolate flex min-h-[340px] flex-col justify-between overflow-hidden rounded-card bg-char p-6 text-paper md:p-10">
            <Image src="/media/photos/interior-luxury.jpg" alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="photo-zoom -z-20 object-cover opacity-70" />
            <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/40 to-black/70" />
            <div>
              <span className="label mb-3 !text-mist/85">{t.home.seekerLabel}</span>
              <h2 className="heading max-w-md">{t.home.seekerHeading}</h2>
            </div>
            <span className="arrow-link mt-10">
              <span className="border-b border-current/30 pb-0.5">{t.home.seekerCta}</span>
              <ArrowRight size={16} strokeWidth={1.4} aria-hidden />
            </span>
          </Link>
        </div>
      </section>

      {/* ── Contact band ─────────────────────────────────────────────────── */}
      <section id="enquiry" className="bg-char text-paper section-gap">
        <div className="wrap grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading label={t.home.contactLabel} title={t.home.contactHeading} tone="light" />
            <div className="mt-8 space-y-2 text-[15px] text-mist/90">
              <p>{SITE.address.full}</p>
              <p>{t.common.open} · {t.common.hours}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <a href={SITE.phoneHref} className="btn btn-outline-light"><Phone size={15} strokeWidth={1.6} aria-hidden /> {SITE.phoneDisplay}</a>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><WhatsAppIcon size={17} /> {t.cta.whatsapp}</a>
            </div>
          </div>
          <div className="md:col-span-7">
            <LeadForm
              t={t.form}
              lang={lang}
              source="home"
              areas={AREA_KEYS.map((k) => AREAS[k].name)}
              otherAreasLabel={t.listings.otherAreas}
              whatsapp={SITE.whatsapp}
              tone="dark"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function FounderVisual({ photo, name }: { photo?: string; name: string }) {
  if (photo) {
    return (
      <div className="relative min-h-[420px] overflow-hidden rounded-card bg-mist">
        <Image src={photo} alt={name} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
      </div>
    );
  }
  // Until the founder's photo is uploaded in /admin: an architectural photo card.
  return (
    <div className="relative isolate flex min-h-[420px] items-end overflow-hidden rounded-card bg-char p-6 text-paper md:p-10">
      <Image src="/media/photos/area-kondapur.jpg" alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="-z-10 object-cover opacity-70" />
      <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 to-transparent" />
      <p className="text-[13px] tracking-[0.2em] uppercase text-mist/90">Kondapur · Hyderabad</p>
    </div>
  );
}
