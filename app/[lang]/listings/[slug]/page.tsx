import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, MapPin, Phone } from "lucide-react";
import Gallery from "@/components/Gallery";
import LeadForm from "@/components/LeadForm";
import ListingCard from "@/components/ListingCard";
import SaveButton from "@/components/SaveButton";
import ShareButton from "@/components/ShareButton";
import { PhotoHero, SectionHeading } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import { fill, getDictionary, href, isLocale, LOCALES } from "@/lib/i18n";
import { getListing, getListings } from "@/lib/data";
import { formatPrice, isRepresentative } from "@/lib/format";
import { AREAS, AREA_KEYS, isAreaKey, mapEmbed, SITE, SITE_URL, whatsappLink } from "@/lib/site";
import { jsonLd, pageMeta } from "@/lib/seo";
import PageTransition from "@/components/motion/PageTransition";

export const revalidate = 600;

export async function generateStaticParams() {
  const listings = await getListings();
  return LOCALES.flatMap((lang) => listings.map((l) => ({ lang, slug: l.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/listings/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const l = await getListing(slug);
  if (!l) return {};
  return pageMeta(lang, `/listings/${slug}`, l.title, l.summary ?? l.description?.slice(0, 160) ?? "", l.thumbnail ?? undefined);
}

export default async function ListingPage({ params }: PageProps<"/[lang]/listings/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const [l, all] = await Promise.all([getListing(slug), getListings()]);
  if (!l) notFound();

  const price = formatPrice(l, t.listings);
  const images = (l.images?.length ? l.images : l.thumbnail ? [l.thumbnail] : []).filter(Boolean);
  const representative = images.some(isRepresentative);
  const url = `${SITE_URL}/${lang}/listings/${l.slug}`;
  const place = l.location_full_address || [l.location_area, l.location_city, l.location_state].filter(Boolean).join(", ");
  const mapQuery = l.area_key && isAreaKey(l.area_key) ? `${l.location_area ?? ""} ${AREAS[l.area_key].mapQuery}` : place;
  const wa = whatsappLink(fill(t.listing.whatsappMessage, { title: l.title, url }));
  const unavailable = l.status === "sold" || l.status === "rented";

  const specs = [
    [t.listing.area, l.specs_area],
    [t.listing.bedrooms, l.specs_bedrooms],
    [t.listing.bathrooms, l.specs_bathrooms],
    [t.listing.facingLabel, l.specs_facing],
    [t.listing.floor, l.specs_floor],
    [t.listing.furnishing, l.specs_furnishing],
    [t.listing.parking, l.specs_parking],
    [t.listing.availability, l.specs_availability],
    [t.listing.tenants, l.specs_tenant_restriction],
  ].filter(([, v]) => v !== null && v !== undefined && v !== "") as [string, string | number][];

  const related = all
    .filter((x) => x.slug !== l.slug && x.status === "available")
    .sort((a, b) => Number(b.area_key === l.area_key) - Number(a.area_key === l.area_key) || Number(b.transaction === l.transaction) - Number(a.transaction === l.transaction))
    .slice(0, 3);

  const listingLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: l.title,
    description: l.description ?? l.summary ?? undefined,
    url,
    image: images.map((src) => (src.startsWith("http") ? src : `${SITE_URL}${src}`)),
    datePosted: l.created_at,
    ...(l.price_value != null
      ? {
          offers: {
            "@type": "Offer",
            price: l.price_value,
            priceCurrency: "INR",
            availability: unavailable ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
            businessFunction: l.transaction === "Sale" ? "http://purl.org/goodrelations/v1#Sell" : "http://purl.org/goodrelations/v1#LeaseOut",
            ...(l.price_unit !== "total" ? { priceSpecification: { "@type": "UnitPriceSpecification", price: l.price_value, priceCurrency: "INR", unitText: l.price_unit === "month" ? "MON" : l.price_unit.toUpperCase() } } : {}),
            seller: { "@id": `${SITE_URL}/#business` },
          },
        }
      : {}),
    contentLocation: {
      "@type": "Place",
      name: place,
      address: { "@type": "PostalAddress", addressLocality: l.location_area ?? undefined, addressRegion: l.location_state ?? "Telangana", addressCountry: "IN" },
    },
  };
  const crumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: `${SITE_URL}/${lang}` },
      { "@type": "ListItem", position: 2, name: t.nav.listings, item: `${SITE_URL}/${lang}/listings` },
      { "@type": "ListItem", position: 3, name: l.title, item: url },
    ],
  };

  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(listingLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(crumbsLd)} />

      <PhotoHero
        image={l.thumbnail ?? "/media/photos/interior-living.jpg"}
        label={`${t.listings.transaction[l.transaction] ?? l.transaction} · ${t.listings.types[l.type] ?? l.type}${unavailable ? ` · ${t.listings.status[l.status]}` : ""}`}
        title={l.title}
        compact
        viewName={`listing-${l.slug}`}
      >
        <p className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="text-[28px] font-light text-paper md:text-[34px]">
            {price.amount}
            <span className="text-[16px] text-mist/80">{price.unit}</span>
          </span>
          {place ? (
            <span className="flex items-center gap-1.5 text-[14px]">
              <MapPin size={14} strokeWidth={1.5} aria-hidden /> {place}
            </span>
          ) : null}
        </p>
      </PhotoHero>

      <div className="wrap pt-6">
        <Link href={href(lang, "/listings")} className="arrow-link text-[14px] text-pewter hover:text-ink">
          <ArrowLeft size={15} strokeWidth={1.5} aria-hidden /> {t.nav.listings}
        </Link>
      </div>

      <div className="wrap grid gap-12 pb-20 pt-6 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-8">
          <Gallery
            images={images}
            title={l.title}
            photosLabel={fill(t.listing.photos, { n: images.length })}
            note={representative ? t.listing.photosNote : undefined}
          />

          <section className="mt-12">
            <h2 className="heading-sm mb-6">{t.listing.details}</h2>
            <dl className="grid grid-cols-2 gap-x-6 sm:grid-cols-3" data-reveal="stagger">
              {specs.map(([k, v]) => (
                <div key={k} className="hairline py-4">
                  <dt className="label">{k}</dt>
                  <dd className="mt-1.5 text-[17px]">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {l.description ? (
            <section className="mt-12">
              <h2 className="heading-sm mb-4">{t.listing.about}</h2>
              <p className="lede max-w-[680px] text-[17px] text-[#1a1a1a]">{l.description}</p>
            </section>
          ) : null}

          {l.features?.length ? (
            <section className="mt-12">
              <h2 className="heading-sm mb-4">{t.listing.features}</h2>
              <ul className="grid gap-x-8 sm:grid-cols-2" data-reveal="stagger">
                {l.features.map((f) => (
                  <li key={f} className="hairline flex gap-3 py-3 text-[15px]">
                    <Check size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-brand" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {l.amenities?.length ? (
            <section className="mt-12">
              <h2 className="heading-sm mb-4">{t.listing.amenities}</h2>
              <ul className="flex flex-wrap gap-2" data-reveal="stagger">
                {l.amenities.map((a) => (
                  <li key={a} className="pill !px-4 !py-2 !text-[13px]">{a}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {mapQuery ? (
            <section className="mt-12">
              <h2 className="heading-sm mb-4">{t.listing.location}</h2>
              <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-mist">
                <iframe
                  title={`${t.listing.location}: ${l.title}`}
                  src={mapEmbed(mapQuery)}
                  className="absolute inset-0 h-full w-full border-0 grayscale-[.3]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          ) : null}
        </div>

        <aside className="lg:col-span-4">
          <div className="rounded-card border border-mist p-5 lg:sticky lg:top-28 md:p-6">
            <p className="text-[26px] font-light text-brand-deep">
              {price.amount}
              <span className="text-[14px] text-pewter">{price.unit}</span>
            </p>
            <h2 className="mt-4 text-[18px]">{t.listing.enquire}</h2>
            <p className="mt-1.5 text-[14px] text-pewter">{t.listing.enquireBody}</p>
            <div className="mt-5 grid gap-2">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
                <WhatsAppIcon size={17} /> {t.cta.whatsappEnquiry}
              </a>
              <a href={SITE.phoneHref} className="btn btn-dark w-full">
                <Phone size={15} strokeWidth={1.6} aria-hidden /> {SITE.phoneDisplay}
              </a>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 [&>button]:w-full">
              <SaveButton slug={l.slug} labels={{ save: t.cta.save, saved: t.cta.saved }} variant="pill" />
              <ShareButton title={l.title} url={url} labels={{ share: t.cta.share, copied: t.cta.copied }} />
            </div>
            <div className="hairline mt-6 pt-6">
              <LeadForm
                t={t.form}
                lang={lang}
                source={`listing:${l.slug}`}
                property={l.title}
                defaultRequirement={l.transaction === "Sale" ? "buy" : "rent"}
                areas={AREA_KEYS.map((k) => AREAS[k].name)}
                otherAreasLabel={t.listings.otherAreas}
                whatsapp={wa}
                stack
              />
            </div>
          </div>
        </aside>
      </div>

      {related.length ? (
        <section className="border-t border-mist bg-mist-soft section-gap">
          <div className="wrap">
            <SectionHeading title={t.listing.related} size="md" className="mb-10" />
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" data-reveal="stagger">
              {related.map((r) => (
                <ListingCard key={r.id} listing={r} lang={lang} t={t} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageTransition>
  );
}
