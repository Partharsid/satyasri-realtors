import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { Phone } from "lucide-react";
import { PhotoHero } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import { DEFAULT_LOCALE, getDictionary, href, isLocale } from "@/lib/i18n";
import { SITE } from "@/lib/site";

export default async function NotFound() {
  const value = await rootLang();
  const lang = isLocale(value) ? value : DEFAULT_LOCALE;
  const t = getDictionary(lang);
  return (
    <>
      <PhotoHero image="/media/photos/city-night.jpg" label="404" title={t.notFound.heading} tall>
        <p>{t.notFound.body}</p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href={href(lang, "/listings")} className="btn bg-paper text-ink hover:bg-mist">{t.cta.viewAll}</Link>
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            <WhatsAppIcon size={17} /> {t.cta.whatsapp}
          </a>
          <a href={SITE.phoneHref} className="btn btn-outline-light">
            <Phone size={15} strokeWidth={1.6} aria-hidden /> {t.cta.call}
          </a>
        </div>
      </PhotoHero>
    </>
  );
}
