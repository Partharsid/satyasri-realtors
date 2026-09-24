import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AREAS, AREA_KEYS, SITE } from "@/lib/site";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { Settings } from "@/lib/data";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "./icons";

export default function Footer({ lang, t, settings }: { lang: Locale; t: Dictionary; settings: Settings }) {
  const explore = [
    { href: "/listings", label: t.nav.listings },
    { href: "/services", label: t.nav.services },
    { href: "/about", label: t.nav.about },
    { href: "/blog", label: t.nav.blog },
    { href: "/saved", label: t.nav.saved },
    { href: "/contact", label: t.nav.contact },
  ];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-char text-paper">
      <div className="wrap pb-10 pt-16 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Image src="/brand/logo-full-white.svg" alt="SatyaSri Realtors — Registered Real Estate Consultant" width={180} height={207} className="h-auto w-[150px]" />
            <p className="mt-6 max-w-xs text-[14px] leading-relaxed text-mist/80">{t.footer.tagline}</p>
            {settings.rera_number ? (
              <p className="mt-4 text-[12px] text-mist/70">
                {t.common.rera} {settings.rera_number}
              </p>
            ) : null}
          </div>

          <nav aria-label={t.footer.explore} className="md:col-span-2">
            <span className="label !text-smoke">{t.footer.explore}</span>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={href(lang, l.href)} className="text-mist/90 transition-colors hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.areas} className="md:col-span-2">
            <span className="label !text-smoke">{t.footer.areas}</span>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {AREA_KEYS.map((k) => (
                <li key={k}>
                  <Link href={href(lang, `/locations/${k}`)} className="text-mist/90 transition-colors hover:text-brand">
                    {AREAS[k].name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <span className="label !text-smoke">{t.footer.visit}</span>
            <address className="mt-4 text-[14px] not-italic leading-relaxed text-mist/90">
              {SITE.address.full}
            </address>
            <p className="mt-3 text-[14px] text-mist/90">
              {t.common.open} · {t.common.hours}
            </p>
            <div className="mt-5 flex flex-col gap-2 text-[14px]">
              <a href={SITE.phoneHref} className="w-fit text-paper hover:text-brand">{SITE.phoneDisplay}</a>
              {settings.public_email ? (
                <a href={`mailto:${settings.public_email}`} className="w-fit text-paper hover:text-brand">{settings.public_email}</a>
              ) : null}
              <a href={SITE.maps.place} target="_blank" rel="noopener noreferrer" className="arrow-link w-fit text-paper hover:text-brand">
                {t.cta.getDirections} <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden />
              </a>
            </div>
            <div className="mt-6 flex gap-2">
              {[
                { href: SITE.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon },
                { href: SITE.social.instagram, label: "Instagram", Icon: InstagramIcon },
                { href: SITE.social.facebook, label: "Facebook", Icon: FacebookIcon },
              ].map(({ href: h, label, Icon }) => (
                <a
                  key={label}
                  href={h}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-full border border-iron text-paper transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-iron pt-6 text-[12px] text-mist/60 md:flex-row md:justify-between">
          <p>© {year} {SITE.name}. {t.footer.rights}</p>
          <p>{SITE.legalCategory} · {t.common.since.replace("{year}", String(SITE.since))}</p>
        </div>
      </div>
    </footer>
  );
}
