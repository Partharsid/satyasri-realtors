import Link from "next/link";
import Image from "next/image";
import { MapPin, Ruler, Bed, Bath, ArrowRight } from "lucide-react";
import type { Listing } from "@/data/listings";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.slug}`} className="card block group overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-52 overflow-hidden rounded-t-2xl bg-[var(--color-surface)]">
        <Image
          src={listing.thumbnail}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="tag bg-[var(--color-secondary)] text-white !text-xs !uppercase">
            {listing.transaction}
          </span>
          <span className="tag !text-xs !uppercase">{listing.type}</span>
        </div>
        {listing.isFeatured && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-semibold font-[var(--font-poppins)] text-[var(--color-text)] text-base leading-snug mb-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
          {listing.title}
        </h3>
        <p className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] mb-3">
          <MapPin size={13} />
          {listing.location.area}, {listing.location.city}
        </p>

        {/* Specs chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {listing.specs.area && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-1 rounded-full">
              <Ruler size={11} /> {listing.specs.area}
            </span>
          )}
          {listing.specs.bedrooms && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-1 rounded-full">
              <Bed size={11} /> {listing.specs.bedrooms} BHK
            </span>
          )}
          {listing.specs.bathrooms && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-1 rounded-full">
              <Bath size={11} /> {listing.specs.bathrooms} Bath
            </span>
          )}
          {listing.specs.facing && (
            <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-1 rounded-full">
              {listing.specs.facing} Facing
            </span>
          )}
        </div>

        <div className="flex items-end justify-between">
          <span className="price-badge">{listing.price}</span>
          <span className="text-[var(--color-primary)] flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">
            View Details <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}
