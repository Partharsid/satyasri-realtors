import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Ruler, Bed, Bath, Home, CheckCircle, ArrowLeft, Car, Users } from "lucide-react";
import Link from "next/link";
import { getListingBySlug } from "@/data/listings";
import listings from "@/data/listings";
import LeadForm from "@/components/LeadForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) return {};
  return {
    title: listing.title,
    description: listing.summary,
    openGraph: {
      title: listing.title,
      description: listing.summary,
      images: [{ url: listing.thumbnail, alt: listing.title }],
    },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();

  // Schema.org structured data for each listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.description,
    price: listing.price,
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.location.city,
      addressRegion: listing.location.state,
      addressCountry: "IN",
    },
    image: listing.images,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pt-24 pb-16">
        <div className="container">
          {/* Back link */}
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-6 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Listings
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: images + details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Main image */}
              <div className="relative w-full h-80 md:h-[420px] rounded-2xl overflow-hidden bg-[var(--color-surface)]">
                <Image
                  src={listing.thumbnail}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>

              {/* Title + badges */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="tag !bg-[var(--color-secondary)] !text-white">
                    {listing.transaction}
                  </span>
                  <span className="tag">{listing.type}</span>
                  {listing.specs.availability && (
                    <span className="tag !bg-green-100 !text-green-800">
                      {listing.specs.availability}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-[var(--font-poppins)] text-[var(--color-secondary)] mb-2">
                  {listing.title}
                </h1>
                <p className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <MapPin size={15} />
                  {listing.location.fullAddress ?? `${listing.location.area}, ${listing.location.city}, ${listing.location.state}`}
                </p>
              </div>

              {/* Specs grid */}
              <div className="card p-6">
                <h2 className="font-semibold font-[var(--font-poppins)] mb-4 text-[var(--color-secondary)]">
                  Property Details
                </h2>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  {listing.specs.area && (
                    <div className="flex items-start gap-2">
                      <Ruler size={16} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                      <div><dt className="text-[var(--color-text-muted)]">Area</dt><dd className="font-medium">{listing.specs.area}</dd></div>
                    </div>
                  )}
                  {listing.specs.bedrooms && (
                    <div className="flex items-start gap-2">
                      <Bed size={16} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                      <div><dt className="text-[var(--color-text-muted)]">Bedrooms</dt><dd className="font-medium">{listing.specs.bedrooms} BHK</dd></div>
                    </div>
                  )}
                  {listing.specs.bathrooms && (
                    <div className="flex items-start gap-2">
                      <Bath size={16} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                      <div><dt className="text-[var(--color-text-muted)]">Bathrooms</dt><dd className="font-medium">{listing.specs.bathrooms}</dd></div>
                    </div>
                  )}
                  {listing.specs.facing && (
                    <div className="flex items-start gap-2">
                      <Home size={16} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                      <div><dt className="text-[var(--color-text-muted)]">Facing</dt><dd className="font-medium">{listing.specs.facing}</dd></div>
                    </div>
                  )}
                  {listing.specs.floor && (
                    <div className="flex items-start gap-2">
                      <Home size={16} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                      <div><dt className="text-[var(--color-text-muted)]">Floor</dt><dd className="font-medium">{listing.specs.floor}</dd></div>
                    </div>
                  )}
                  {listing.specs.furnishing && (
                    <div className="flex items-start gap-2">
                      <Home size={16} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                      <div><dt className="text-[var(--color-text-muted)]">Furnishing</dt><dd className="font-medium">{listing.specs.furnishing}</dd></div>
                    </div>
                  )}
                  {listing.specs.parking && (
                    <div className="flex items-start gap-2">
                      <Car size={16} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                      <div><dt className="text-[var(--color-text-muted)]">Parking</dt><dd className="font-medium">{listing.specs.parking}</dd></div>
                    </div>
                  )}
                  {listing.specs.tenantRestriction && (
                    <div className="flex items-start gap-2">
                      <Users size={16} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                      <div><dt className="text-[var(--color-text-muted)]">Tenant</dt><dd className="font-medium">{listing.specs.tenantRestriction}</dd></div>
                    </div>
                  )}
                </dl>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-semibold font-[var(--font-poppins)] mb-3 text-[var(--color-secondary)]">
                  About this Property
                </h2>
                <p className="text-[var(--color-text-muted)] leading-relaxed">{listing.description}</p>
              </div>

              {/* Features */}
              <div>
                <h2 className="font-semibold font-[var(--font-poppins)] mb-3 text-[var(--color-secondary)]">
                  Key Features
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {listing.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                      <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div>
                  <h2 className="font-semibold font-[var(--font-poppins)] mb-3 text-[var(--color-secondary)]">
                    Community Amenities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities.map((a) => (
                      <span key={a} className="tag">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Map embed placeholder */}
              <div>
                <h2 className="font-semibold font-[var(--font-poppins)] mb-3 text-[var(--color-secondary)]">
                  Location
                </h2>
                <div className="rounded-2xl overflow-hidden h-56 bg-[var(--color-surface)] flex items-center justify-center border border-[var(--color-border)]">
                  {/* TODO: Embed Google Maps iframe for this listing's location */}
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Map embed — {listing.location.area}, {listing.location.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: sticky price + form */}
            <div className="space-y-6">
              <div className="card p-6 sticky top-24">
                <div className="mb-4">
                  <span className="text-2xl font-bold text-[var(--color-primary)] font-[var(--font-poppins)]">
                    {listing.price}
                  </span>
                  {listing.transaction === "Rent" && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      + applicable maintenance charges. Tenant pays utilities.
                    </p>
                  )}
                </div>
                <h3 className="font-semibold font-[var(--font-poppins)] mb-4 text-[var(--color-secondary)]">
                  Enquire About This Property
                </h3>
                <LeadForm
                  prefilledProperty={listing.title}
                  sourcePage={`Listing: ${listing.slug}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
