"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./icons";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";

export type MenuItem = { href: string; label: string; desc: string; image: string };

type Props = {
  lang: Locale;
  homeHref: string;
  items: MenuItem[];
  labels: { menu: string; close: string; language: string; call: string; whatsapp: string; skip: string };
  phoneHref: string;
  phoneDisplay: string;
  whatsapp: string;
};

export default function Header({ lang, homeHref, items, labels, phoneHref, phoneDisplay, whatsapp }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the menu is open; Escape closes it.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const switchTo = (next: Locale) => {
    const parts = (pathname || "/").split("/");
    parts[1] = next;
    return parts.join("/") || `/${next}`;
  };

  const light = !solid && !open;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2">
        {labels.skip}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          light ? "border-b border-transparent" : "border-b border-mist bg-paper/92 backdrop-blur-md"
        } ${open ? "!border-transparent !bg-transparent !backdrop-blur-none" : ""}`}
      >
        <div className="wrap flex h-16 items-center justify-between md:h-20">
          <Link href={homeHref} onClick={() => setOpen(false)} aria-label="SatyaSri Realtors — home" className="relative z-10">
            <Logo tone={light || open ? "light" : "dark"} />
          </Link>

          <div className="relative z-10 flex items-center gap-2">
            <a
              href={phoneHref}
              className={`btn hidden !min-h-10 !px-4 !py-2.5 lg:inline-flex ${light || open ? "btn-outline-light" : "btn-outline"}`}
            >
              <Phone size={15} strokeWidth={1.6} aria-hidden />
              {phoneDisplay}
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={labels.whatsapp}
              className="btn btn-whatsapp !min-h-10 !px-3.5 !py-2.5 md:!px-4"
            >
              <WhatsAppIcon size={17} />
              <span className="hidden md:inline">{labels.whatsapp}</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className={`btn !min-h-10 !gap-2.5 !px-4 !py-2.5 ${open ? "bg-paper text-ink hover:bg-mist" : "btn-dark"}`}
            >
              <span className="text-[12px] font-medium tracking-[0.08em] uppercase">{open ? labels.close : labels.menu}</span>
              {open ? <X size={16} strokeWidth={1.6} aria-hidden /> : <Menu size={16} strokeWidth={1.6} aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu: Aker-style photo cards on Char */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label={labels.menu}
        hidden={!open}
        className="fixed inset-0 z-40 overflow-y-auto overflow-x-hidden bg-char text-paper"
      >
        <div className="wrap pb-16 pt-24 md:pt-28">
          <nav>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
              {items.map((item) => {
                const active = pathname === item.href || (item.href !== homeHref && pathname?.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-center gap-4 rounded-card bg-iron p-2.5 pr-5 transition-colors hover:bg-[#303030]"
                    >
                      <span className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-[6px] md:w-28">
                        <Image src={item.image} alt="" fill sizes="112px" className="photo-zoom object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[17px] ${active ? "text-brand" : ""}`}>{item.label}</span>
                        <span className="mt-1 block truncate text-[12px] text-mist/75">{item.desc}</span>
                      </span>
                      <ArrowRight size={16} strokeWidth={1.4} aria-hidden className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-10 flex flex-col gap-6 border-t border-iron pt-8 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="label !text-smoke">{labels.language}</span>
              <div className="mt-3 flex gap-2">
                {LOCALES.map((l) => (
                  <Link
                    key={l}
                    href={switchTo(l)}
                    onClick={() => setOpen(false)}
                    hrefLang={LOCALE_LABELS[l].htmlLang}
                    lang={LOCALE_LABELS[l].htmlLang}
                    aria-current={l === lang ? "true" : undefined}
                    className={`pill !px-4 !py-2 !text-[13px] ${l === lang ? "!bg-paper !text-ink" : "!bg-transparent border border-iron !text-paper hover:border-smoke"}`}
                  >
                    {LOCALE_LABELS[l].name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={phoneHref} className="btn btn-outline-light">
                <Phone size={15} strokeWidth={1.6} aria-hidden /> {phoneDisplay}
              </a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <WhatsAppIcon size={17} /> {labels.whatsapp}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
