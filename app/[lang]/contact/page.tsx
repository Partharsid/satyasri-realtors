import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import { PhotoHero } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getSettings } from "@/lib/data";
import { AREAS, AREA_KEYS, SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const revalidate = 600;

const REQUIREMENTS = ["buy", "rent", "sell", "rentOut", "lease", "invest"];

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return pageMeta(lang, "/contact", t.contact.metaTitle, t.contact.metaDescription, "/media/photos/service-consult.jpg");
}

export default async function ContactPage({ params, searchParams }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const sp = await searchParams;
  const req = typeof sp.req === "string" && REQUIREMENTS.includes(sp.req) ? sp.req : "buy";
  const settings = await getSettings();

  const qr = await QRCode.toString(SITE.whatsapp, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#000000", light: "#ffffff" } });

  const rows = [
    { Icon: MapPin, label: t.contact.officeLabel, value: SITE.address.full, href: SITE.maps.place, external: true },
    { Icon: Phone, label: t.contact.phoneLabel, value: SITE.phoneDisplay, href: SITE.phoneHref },
    ...(settings.public_email ? [{ Icon: Mail, label: t.contact.emailLabel, value: settings.public_email, href: `mailto:${settings.public_email}` }] : []),
    { Icon: Clock, label: t.contact.hoursLabel, value: `${t.common.open} · ${t.common.hours}` },
  ];

  return (
    <>
      <PhotoHero image="/media/photos/service-consult.jpg" label={t.contact.label} title={t.contact.heading}>
        <p>{t.contact.intro}</p>
      </PhotoHero>

      <section className="section-gap">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <dl>
              {rows.map(({ Icon, label, value, href: h, external }) => (
                <div key={label} className="hairline grid grid-cols-[28px_1fr] gap-x-3 py-5">
                  <Icon size={18} strokeWidth={1.4} className="mt-0.5 text-brand" aria-hidden />
                  <div>
                    <dt className="label">{label}</dt>
                    <dd className="mt-1.5 text-[17px] leading-snug">
                      {h ? (
                        <a href={h} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="hover:text-brand-deep">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <WhatsAppIcon size={17} /> {t.cta.whatsapp}
              </a>
              <a href={SITE.phoneHref} className="btn btn-dark">
                <Phone size={15} strokeWidth={1.6} aria-hidden /> {t.cta.call}
              </a>
              <a href={SITE.maps.place} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                {t.cta.getDirections} <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden />
              </a>
            </div>

            <div className="mt-10 flex items-center gap-5 rounded-card bg-mist-soft p-5">
              <div className="size-28 shrink-0 rounded-[6px] bg-paper p-2.5 [&>svg]:h-full [&>svg]:w-full" role="img" aria-label={t.contact.scanLabel} dangerouslySetInnerHTML={{ __html: qr }} />
              <div>
                <p className="text-[15px]">{t.contact.scanLabel}</p>
                <p className="mt-1.5 text-[13px] text-pewter">{t.contact.scanBody}</p>
              </div>
            </div>
          </div>

          <div id="enquiry" className="scroll-mt-28 lg:col-span-7">
            <div className="rounded-card border border-mist p-5 md:p-8">
              <h2 className="heading mb-6">{t.contact.formHeading}</h2>
              <LeadForm
                t={t.form}
                lang={lang}
                source="contact"
                defaultRequirement={req}
                areas={AREA_KEYS.map((k) => AREAS[k].name)}
                otherAreasLabel={t.listings.otherAreas}
                whatsapp={SITE.whatsapp}
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-label={t.contact.officeLabel} className="relative h-[420px] bg-mist md:h-[520px]">
        <iframe
          title={`${SITE.name} — ${t.contact.officeLabel}`}
          src={SITE.maps.embed}
          className="absolute inset-0 h-full w-full border-0 grayscale-[.3]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
