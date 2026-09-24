import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { ArrowLink, PhotoHero, SectionHeading } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import { fill, getDictionary, href, isLocale, LOCALES } from "@/lib/i18n";
import { getListings } from "@/lib/data";
import { AREAS, AREA_KEYS, isAreaKey, mapEmbed, SITE, SITE_URL, whatsappLink } from "@/lib/site";
import { jsonLd, pageMeta } from "@/lib/seo";

export const revalidate = 600;
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => AREA_KEYS.map((area) => ({ lang, area })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/locations/[area]">) {
  const { lang, area } = await params;
  if (!isLocale(lang) || !isAreaKey(area)) return {};
  const t = getDictionary(lang);
  const name = AREAS[area].name;
  return pageMeta(lang, `/locations/${area}`, fill(t.areas.metaTitle, { area: name }), fill(t.areas.metaDescription, { area: name }), AREAS[area].image);
}

export default async function AreaPage({ params }: PageProps<"/[lang]/locations/[area]">) {
  const { lang, area } = await params;
  if (!isLocale(lang) || !isAreaKey(area)) notFound();
  const t = getDictionary(lang);
  const info = AREAS[area];
  const copy = t.areas.items[area];
  const listings = (await getListings()).filter((l) => l.area_key === area);
  const others = AREA_KEYS.filter((k) => k !== area);

  const placeLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${info.name}, Hyderabad`,
    description: copy.overview,
    url: `${SITE_URL}/${lang}/locations/${area}`,
    containedInPlace: { "@type": "City", name: "Hyderabad" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(placeLd)} />
      <PhotoHero image={info.image} label={`${t.areas.label} · Hyderabad`} title={info.name} tall />

      <section className="section-gap">
        <div className="wrap grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <span className="label mb-3">{t.areas.overviewLabel}</span>
            <p className="lede text-[19px] text-[#1a1a1a] md:text-[21px]">{copy.overview}</p>
          </div>
          <div className="md:col-span-5">
            <span className="label mb-3">{t.areas.highlightsLabel}</span>
            <ol>
              {copy.highlights.map((h, i) => (
                <li key={h} className="hairline grid grid-cols-[40px_1fr] py-4">
                  <span className="pt-0.5 text-[12px] text-pewter tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[17px]">{h}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="wrap">
          <SectionHeading title={fill(t.areas.propertiesHeading, { area: info.name })} size="md" className="mb-10" />
          {listings.length ? (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} lang={lang} t={t} />
              ))}
            </div>
          ) : (
            <div className="rounded-card bg-mist-soft p-8">
              <p className="max-w-[640px] text-[17px]">{fill(t.areas.noProperties, { area: info.name })}</p>
            </div>
          )}
          <div className="mt-10">
            <ArrowLink href={`${href(lang, "/listings")}?area=${area}`}>{t.cta.viewAll}</ArrowLink>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="wrap grid gap-3 md:grid-cols-2">
          <div className="relative min-h-[360px] overflow-hidden rounded-card bg-mist">
            <iframe
              title={fill(t.areas.mapHeading, { area: info.name })}
              src={mapEmbed(info.mapQuery)}
              className="absolute inset-0 h-full w-full border-0 grayscale-[.3]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="flex flex-col justify-between rounded-card bg-char p-6 text-paper md:p-10">
            <div>
              <span className="label mb-3 !text-mist/80">{t.nav.contact}</span>
              <h2 className="heading">{fill(t.areas.ctaHeading, { area: info.name })}</h2>
              <p className="mt-4 max-w-md text-[15px] text-mist/85">{t.listings.emptyHint}</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              <a href={whatsappLink(`Hi SatyaSri Realtors, I'm looking for a property in ${info.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <WhatsAppIcon size={17} /> {t.cta.whatsapp}
              </a>
              <a href={SITE.phoneHref} className="btn btn-outline-light">
                <Phone size={15} strokeWidth={1.6} aria-hidden /> {t.cta.call}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-mist bg-mist-soft section-gap">
        <div className="wrap">
          <SectionHeading label={t.home.areasLabel} title={t.home.areasHeading} size="md" className="mb-10" />
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {others.map((k) => (
              <li key={k}>
                <Link href={href(lang, `/locations/${k}`)} className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-char">
                  <Image src={AREAS[k].image} alt="" fill sizes="(min-width:768px) 20vw, 50vw" className="photo-zoom object-cover opacity-75" />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute inset-x-4 bottom-4 flex items-center justify-between text-paper">
                    <span className="text-[17px] font-light">{AREAS[k].name}</span>
                    <ArrowRight size={16} strokeWidth={1.4} aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
