import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Lora, Montserrat, Noto_Sans_Devanagari, Noto_Sans_Telugu } from "next/font/google";
import "../globals.css";
import Header, { type MenuItem } from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import MotionRuntime from "@/components/motion/MotionRuntime";
import { getDictionary, href, isLocale, LOCALES, LOCALE_LABELS } from "@/lib/i18n";
import { getSettings } from "@/lib/data";
import { SITE, SITE_URL } from "@/lib/site";
import { alternates } from "@/lib/seo";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-montserrat", display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400"], variable: "--font-lora", display: "swap" });
const notoTelugu = Noto_Sans_Telugu({ subsets: ["telugu"], weight: ["300", "400", "500", "600"], variable: "--font-noto-telugu", display: "swap", preload: false });
const notoDevanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["300", "400", "500", "600"], variable: "--font-noto-devanagari", display: "swap", preload: false });

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: "#1c1c1c",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: `%s | ${SITE.name}` },
    description: t.meta.description,
    applicationName: SITE.name,
    authors: [{ name: SITE.founder }],
    creator: SITE.name,
    alternates: alternates(lang, "/"),
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: LOCALE_LABELS[lang].ogLocale,
      title: t.meta.title,
      description: t.meta.description,
      url: `${SITE_URL}/${lang}`,
      images: [{ url: "/media/og.jpg", width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description, images: ["/media/og.jpg"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    formatDetection: { telephone: true, address: true },
    other: { "geo.region": "IN-TG", "geo.placename": "Hyderabad", "geo.position": `${SITE.geo.lat};${SITE.geo.lng}` },
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const settings = await getSettings();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const items: MenuItem[] = [
    { href: href(lang, "/"), label: t.nav.home, desc: t.nav.homeDesc, image: "/media/hero-poster.jpg" },
    { href: href(lang, "/listings"), label: t.nav.listings, desc: t.nav.listingsDesc, image: "/media/photos/interior-living.jpg" },
    { href: href(lang, "/locations/kondapur"), label: t.nav.areas, desc: t.nav.areasDesc, image: "/media/photos/area-hitech-city.jpg" },
    { href: href(lang, "/services"), label: t.nav.services, desc: t.nav.servicesDesc, image: "/media/photos/service-keys.jpg" },
    { href: href(lang, "/about"), label: t.nav.about, desc: t.nav.aboutDesc, image: "/media/photos/city-lake-buddha.jpg" },
    { href: href(lang, "/blog"), label: t.nav.blog, desc: t.nav.blogDesc, image: "/media/photos/service-signing.jpg" },
    { href: href(lang, "/saved"), label: t.nav.saved, desc: t.nav.savedDesc, image: "/media/photos/interior-lounge.jpg" },
    { href: href(lang, "/contact"), label: t.nav.contact, desc: t.nav.contactDesc, image: "/media/photos/service-consult.jpg" },
  ];

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE_URL}/#business`,
    name: SITE.name,
    alternateName: "Satyasri Realtors",
    description: t.meta.description,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/icon-512.png`,
    image: `${SITE_URL}/media/og.jpg`,
    telephone: SITE.phoneDisplay.replace(/\s/g, ""),
    ...(settings.public_email ? { email: settings.public_email } : {}),
    foundingDate: String(SITE.since),
    founder: { "@type": "Person", name: SITE.founder },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE.address.street}, ${SITE.address.locality}`,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.maps.place,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],
    areaServed: ["Hitech City", "Gachibowli", "Kondapur", "Financial District", "Kokapet", "Manikonda", "Hyderabad"].map((name) => ({ "@type": "Place", name })),
    // No aggregateRating: Google treats ratings a business publishes about itself as self-serving.
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.maps.place],
    priceRange: "₹₹",
  };

  return (
    <html
      lang={LOCALE_LABELS[lang].htmlLang}
      className={`${montserrat.variable} ${lora.variable} ${notoTelugu.variable} ${notoDevanagari.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-svh">
        {/* Enable motion styles before first paint; reveal everything if the runtime never boots. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');setTimeout(function(){var d=document.documentElement;if(!d.classList.contains('motion-ready'))d.classList.add('motion-fallback')},3500);",
          }}
        />
        <div aria-hidden className="scroll-progress fixed inset-x-0 top-0 z-[60] h-[2px] bg-brand" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }} />
        <Header
          lang={lang}
          homeHref={href(lang, "/")}
          items={items}
          labels={{ menu: t.nav.menu, close: t.nav.close, language: t.nav.language, call: t.cta.call, whatsapp: t.cta.whatsapp, skip: t.nav.skip }}
          phoneHref={SITE.phoneHref}
          phoneDisplay={SITE.phoneDisplay}
          whatsapp={SITE.whatsapp}
        />
        <main id="main" className="pb-[68px] md:pb-0">{children}</main>
        <Footer lang={lang} t={t} settings={settings} />
        <FloatingActions callLabel={t.cta.call} whatsappLabel={t.cta.whatsapp} />
        <MotionRuntime />
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
