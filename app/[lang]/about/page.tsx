import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLink, PhotoHero, SectionHeading } from "@/components/ui";
import { ReviewCard } from "@/components/Reviews";
import { GoogleIcon } from "@/components/icons";
import { fill, getDictionary, href, isLocale } from "@/lib/i18n";
import { getReviews, getSettings } from "@/lib/data";
import { AREAS, AREA_KEYS, SITE, SITE_URL } from "@/lib/site";
import { jsonLd, pageMeta } from "@/lib/seo";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return pageMeta(lang, "/about", t.about.metaTitle, t.about.metaDescription, "/media/photos/city-lake-buddha.jpg");
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const [settings, reviews] = await Promise.all([getSettings(), getReviews()]);

  const founderLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.founder,
    jobTitle: "Founder & Real Estate Consultant",
    worksFor: { "@id": `${SITE_URL}/#business` },
    ...(settings.founder_photo ? { image: settings.founder_photo } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(founderLd)} />
      <PhotoHero image="/media/photos/city-lake-buddha.jpg" label={t.about.label} title={t.about.heading} tall>
        <p>{t.about.intro}</p>
      </PhotoHero>

      {/* Story */}
      <section className="section-gap">
        <div className="wrap grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading label={t.about.storyLabel} title={t.about.storyHeading} size="md" />
          </div>
          <div className="md:col-span-7">
            <p className="lede text-[19px] text-[#1a1a1a]">{t.about.story}</p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="pb-20 md:pb-28">
        <div className="wrap grid gap-3 md:grid-cols-2">
          <div className="relative min-h-[440px] overflow-hidden rounded-card bg-char">
            {settings.founder_photo ? (
              <Image src={settings.founder_photo} alt={SITE.founder} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
            ) : (
              <>
                <Image src="/media/photos/area-kondapur.jpg" alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover opacity-60" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-36 place-items-center rounded-full border border-paper/40 bg-char/60 text-[46px] font-light tracking-[-0.02em] text-paper backdrop-blur-sm">
                    MA
                  </span>
                </span>
              </>
            )}
          </div>
          <div className="flex flex-col justify-between rounded-card bg-mist p-6 md:p-10">
            <div>
              <span className="label mb-3">{t.about.founderLabel}</span>
              <h2 className="heading">{SITE.founder}</h2>
              <p className="mt-1 text-[14px] text-pewter">{t.about.founderRole}</p>
              <p className="lede mt-6 max-w-[540px] text-[17px] text-[#1a1a1a]">{t.about.founderBio}</p>
            </div>
            <div className="mt-10 flex items-end justify-between gap-4">
              <div className="text-[13px] text-pewter">
                <p>{SITE.legalCategory}</p>
                {settings.rera_number ? <p className="mt-1">{t.common.rera} {settings.rera_number}</p> : null}
              </div>
              <Image src="/brand/icon.svg" alt="" width={56} height={40} />
            </div>
          </div>
        </div>
      </section>

      {/* Mission / vision / values */}
      <section className="relative isolate overflow-hidden bg-tide text-paper section-gap">
        <div className="wrap grid gap-12 md:grid-cols-2">
          <div>
            <span className="label mb-3 !text-mist/75">{t.about.missionLabel}</span>
            <p className="text-[24px] font-light leading-snug md:text-[30px]">{t.about.mission}</p>
          </div>
          <div>
            <span className="label mb-3 !text-mist/75">{t.about.visionLabel}</span>
            <p className="text-[24px] font-light leading-snug md:text-[30px]">{t.about.vision}</p>
          </div>
        </div>
        <div className="wrap mt-16">
          <span className="label mb-4 !text-mist/75">{t.about.valuesLabel}</span>
          <ol className="grid gap-x-8 md:grid-cols-3">
            {t.about.values.map((v, i) => (
              <li key={v.title} className="border-t border-paper/20 py-6">
                <span className="text-[12px] text-mist/70 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-[20px] font-light">{v.title}</h3>
                <p className="mt-2 text-[14px] text-mist/80">{v.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Areas + property types */}
      <section className="section-gap">
        <div className="wrap grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <span className="label mb-4">{t.about.areasLabel}</span>
            <ul className="flex flex-wrap gap-2">
              {AREA_KEYS.map((k) => (
                <li key={k}>
                  <Link href={href(lang, `/locations/${k}`)} className="pill !px-5 !py-2.5 !text-[15px] !font-normal transition-colors hover:!bg-char hover:!text-paper">
                    {AREAS[k].name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] text-pewter">{t.about.areasNote}</p>
          </div>
          <div className="md:col-span-5">
            <span className="label mb-4">{t.about.propertyTypesLabel}</span>
            <ul>
              {t.about.propertyTypes.map((p) => (
                <li key={p} className="hairline py-3 text-[18px] font-light">{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Reviews excerpt */}
      {reviews.length ? (
        <section className="border-t border-mist bg-mist-soft section-gap">
          <div className="wrap">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading label={t.home.reviewsLabel} title={t.home.reviewsHeading} size="md" />
              <span className="flex items-center gap-2 text-[14px]">
                <GoogleIcon size={18} /> {settings.google_rating || "5.0"} · {fill(t.common.reviews, { n: settings.google_review_count || "24" })}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {reviews.slice(0, 3).map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
            <div className="mt-8">
              <ArrowLink href={SITE.maps.place} external>{t.home.reviewsCta}</ArrowLink>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
