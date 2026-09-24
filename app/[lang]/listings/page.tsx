import Link from "next/link";
import { notFound } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import SearchBar from "@/components/SearchBar";
import { PhotoHero } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import { fill, getDictionary, href, isLocale } from "@/lib/i18n";
import { getListings } from "@/lib/data";
import { filterListings, readFilters } from "@/lib/filter";
import { pageMeta } from "@/lib/seo";
import { AREAS, AREA_KEYS, SITE } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/listings">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return pageMeta(lang, "/listings", t.listings.metaTitle, t.listings.metaDescription, "/media/photos/interior-living.jpg");
}

export default async function ListingsPage({ params, searchParams }: PageProps<"/[lang]/listings">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const filters = readFilters(await searchParams);
  const all = await getListings();
  const results = filterListings(all, filters);
  const active = Object.values(filters).some(Boolean);

  // Locations outside the six area pages (e.g. Nellore land) still get a filter option.
  const otherAreas = [...new Set(all.filter((l) => !l.area_key && l.location_area).map((l) => l.location_area!))];

  // Available first, then sold/rented.
  const ordered = [...results].sort((a, b) => Number(a.status !== "available") - Number(b.status !== "available"));

  return (
    <>
      <PhotoHero image="/media/photos/interior-living.jpg" label={t.listings.label} title={t.listings.heading}>
        <p>{t.listings.metaDescription}</p>
      </PhotoHero>

      <section className="sticky top-16 z-20 border-b border-mist bg-mist-soft/95 backdrop-blur md:top-20">
        <div className="wrap py-4">
          <details className="group md:hidden" open={active}>
            <summary className="flex cursor-pointer list-none items-center justify-between py-1 text-[14px]">
              <span>{t.listings.filters}{active ? " •" : ""}</span>
              <span className="text-pewter">{results.length === 1 ? t.listings.countOne : fill(t.listings.count, { n: results.length })}</span>
            </summary>
            <div className="pt-4">
              <SearchBar action={href(lang, "/listings")} t={t.listings} values={filters} variant="page" otherAreas={otherAreas} />
            </div>
          </details>
          <div className="hidden md:block">
            <SearchBar action={href(lang, "/listings")} t={t.listings} values={filters} variant="page" otherAreas={otherAreas} />
          </div>
        </div>
      </section>

      <section className="wrap py-12 md:py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-[14px] text-pewter" aria-live="polite">
            {results.length === 1 ? t.listings.countOne : fill(t.listings.count, { n: results.length })}
          </p>
          {active ? (
            <Link href={href(lang, "/listings")} className="text-[14px] underline underline-offset-4 hover:text-brand-deep">
              {t.listings.clear}
            </Link>
          ) : null}
        </div>

        {ordered.length ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {ordered.map((l, i) => (
              <ListingCard key={l.id} listing={l} lang={lang} t={t} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="rounded-card bg-mist-soft p-8 md:p-12">
            <h2 className="heading">{t.listings.empty}</h2>
            <p className="mt-4 max-w-[600px] text-pewter">{t.listings.emptyHint}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <WhatsAppIcon size={17} /> {t.cta.whatsapp}
              </a>
              <a href={SITE.phoneHref} className="btn btn-outline">{SITE.phoneDisplay}</a>
              <Link href={href(lang, "/listings")} className="btn btn-outline">{t.listings.clear}</Link>
            </div>
          </div>
        )}

        <nav aria-label={t.nav.areas} className="hairline mt-20 pt-8">
          <span className="label mb-4">{t.nav.areas}</span>
          <ul className="flex flex-wrap gap-2">
            {AREA_KEYS.map((k) => (
              <li key={k}>
                <Link href={href(lang, `/locations/${k}`)} className="pill !bg-transparent border border-mist !px-4 !py-2 !text-[13px] hover:border-ink">
                  {AREAS[k].name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </>
  );
}
