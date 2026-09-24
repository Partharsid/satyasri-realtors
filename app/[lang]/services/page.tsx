import Image from "next/image";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import { NumberedRow, PhotoHero, SectionHeading } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import { getDictionary, isLocale } from "@/lib/i18n";
import { AREAS, AREA_KEYS, SITE, SITE_URL, whatsappLink } from "@/lib/site";
import { jsonLd, pageMeta } from "@/lib/seo";

const SERVICE_KEYS = ["buy", "sell", "rent", "lease", "invest"] as const;
const SERVICE_IMAGES: Record<(typeof SERVICE_KEYS)[number], string> = {
  buy: "/media/photos/interior-living.jpg",
  sell: "/media/photos/service-signing.jpg",
  rent: "/media/photos/service-keys.jpg",
  lease: "/media/photos/service-meeting.jpg",
  invest: "/media/photos/land-plots.jpg",
};

export async function generateMetadata({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return pageMeta(lang, "/services", t.services.metaTitle, t.services.metaDescription, "/media/photos/service-consult.jpg");
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  const servicesLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: SERVICE_KEYS.map((k, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: t.services.items[k].title,
        description: t.services.items[k].body,
        provider: { "@id": `${SITE_URL}/#business` },
        areaServed: "Hyderabad",
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(servicesLd)} />
      <PhotoHero image="/media/photos/service-consult.jpg" label={t.services.label} title={t.services.heading}>
        <p>{t.services.intro}</p>
      </PhotoHero>

      <section className="section-gap">
        <div className="wrap space-y-3">
          {SERVICE_KEYS.map((k, i) => {
            const s = t.services.items[k];
            const flip = i % 2 === 1;
            return (
              <article key={k} id={k} className="grid scroll-mt-28 gap-3 md:grid-cols-2">
                <div className={`relative min-h-[260px] overflow-hidden rounded-card bg-mist md:min-h-[380px] ${flip ? "md:order-2" : ""}`}>
                  <Image src={SERVICE_IMAGES[k]} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-col justify-between rounded-card bg-mist-soft p-6 md:p-10">
                  <div>
                    <span className="label mb-3 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="heading">{s.title}</h2>
                    <p className="mt-5 max-w-[520px] text-[16px] leading-relaxed text-[#1a1a1a]">{s.body}</p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-2">
                    <a href={whatsappLink(`Hi SatyaSri Realtors, I need help with: ${s.title}`)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                      <WhatsAppIcon size={17} /> {t.cta.whatsapp}
                    </a>
                    <a href="#enquiry" className="btn btn-outline">{t.cta.sendEnquiry}</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-mist bg-mist-soft section-gap">
        <div className="wrap grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeading label={t.services.processLabel} title={t.services.processHeading} size="md" />
          </div>
          <ol className="md:col-span-8">
            {t.services.process.map((p, i) => (
              <li key={p.title}>
                <NumberedRow n={i + 1} title={p.title}>{p.body}</NumberedRow>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-20 bg-char text-paper section-gap">
        <div className="wrap grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading label={t.nav.contact} title={t.services.ctaHeading} tone="light" />
            <div className="mt-8 flex flex-wrap gap-2">
              <a href={SITE.phoneHref} className="btn btn-outline-light"><Phone size={15} strokeWidth={1.6} aria-hidden /> {SITE.phoneDisplay}</a>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><WhatsAppIcon size={17} /> {t.cta.whatsapp}</a>
            </div>
          </div>
          <div className="md:col-span-7">
            <LeadForm t={t.form} lang={lang} source="services" areas={AREA_KEYS.map((k) => AREAS[k].name)} otherAreasLabel={t.listings.otherAreas} whatsapp={SITE.whatsapp} tone="dark" />
          </div>
        </div>
      </section>
    </>
  );
}
