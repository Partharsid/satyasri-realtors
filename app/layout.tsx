import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { BUSINESS } from "@/data/business";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.satyasri.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BUSINESS.name} — ${BUSINESS.tagline}`,
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    "Satyasri Realtors — Registered Real Estate Consultant in Hyderabad, India. Buying, Selling, Renting & Investment consulting. Trusted Service • Transparent Dealings • Best Value.",
  keywords: [
    "Satyasri Realtors",
    "real estate Hyderabad",
    "property for rent Hyderabad",
    "flats for rent Kondapur",
    "flats for rent Gachibowli",
    "land for sale Nellore",
    "3 BHK for rent Hyderabad",
    "real estate consultant Hyderabad",
    "Mahesh Kumar real estate",
  ],
  authors: [{ name: BUSINESS.contact.consultant }],
  creator: BUSINESS.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} — ${BUSINESS.tagline}`,
    description:
      "Registered Real Estate Consultant in Hyderabad, India. Buying • Selling • Renting • Investment.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Satyasri Realtors — Your Trusted Real Estate Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} — ${BUSINESS.tagline}`,
    description: "Registered Real Estate Consultant in Hyderabad, India.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: BUSINESS.name,
  description:
    "Registered Real Estate Consultant — Buying, Selling, Renting, and Investment consulting in Hyderabad and Andhra Pradesh.",
  url: siteUrl,
  telephone: BUSINESS.contact.phone,
  email: BUSINESS.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${BUSINESS.address.line1} ${BUSINESS.address.line2}`,
    addressLocality: BUSINESS.address.city,
    addressRegion: BUSINESS.address.state,
    postalCode: BUSINESS.address.pin,
    addressCountry: "IN",
  },
  sameAs: [BUSINESS.contact.facebook, BUSINESS.contact.instagram],
  areaServed: ["Hyderabad", "Telangana", "Nellore", "Andhra Pradesh"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFAB />
        {/* Google Analytics — only loaded when env var is set */}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
