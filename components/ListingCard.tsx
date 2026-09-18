"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Ruler, Bed, Bath, ArrowRight, MessageCircle, Heart } from "lucide-react";
import type { Listing } from "@/data/listings";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("satyasri_saved_listings") || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSaved(saved.includes(listing.slug));
    } catch (e) {
      console.error(e);
    }
  }, [listing.slug]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const saved = JSON.parse(localStorage.getItem("satyasri_saved_listings") || "[]");
      let newSaved;
      if (saved.includes(listing.slug)) {
        newSaved = saved.filter((s: string) => s !== listing.slug);
        setIsSaved(false);
      } else {
        newSaved = [...saved, listing.slug];
        setIsSaved(true);
      }
      localStorage.setItem("satyasri_saved_listings", JSON.stringify(newSaved));
    } catch (err) {
      console.error(err);
    }
  };

  const whatsappMessage = `Hi, I am interested in ${listing.title} (ID: ${listing.slug}) listed at ${listing.price}.`;
  const whatsappUrl = `https://wa.me/919014224408?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Link href={`/listings/${listing.slug}`} className="card block group overflow-hidden relative">
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
          <span className="tag bg-[var(--color-secondary)] text-white !text-xs !uppercase shadow-sm">
            {listing.transaction}
          </span>
          <span className="tag !text-xs !uppercase bg-white/90 shadow-sm">{listing.type}</span>
        </div>
        {listing.isFeatured && (
          <span className="absolute top-3 right-3 bg-[#C9A227] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Featured
          </span>
        )}
        <button
          onClick={toggleSave}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-[#0f2d5c] hover:text-[#C9A227] transition-colors"
          aria-label="Save property"
        >
          <Heart size={16} className={isSaved ? "fill-[#C9A227] text-[#C9A227]" : ""} />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 pb-4">
        <h3 className="font-semibold font-[var(--font-poppins)] text-[var(--color-text)] text-base leading-snug mb-1 group-hover:text-[#C9A227] transition-colors line-clamp-2">
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
              {listing.specs.facing}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between border-t border-[#e5e0d8] pt-4 mt-1">
          <span className="price-badge bg-[#0f2d5c] shadow-none">{listing.price}</span>
          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
              aria-label="WhatsApp Enquiry"
            >
              <MessageCircle size={15} />
            </a>
            <span className="text-[#C9A227] flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">
              Details <ArrowRight size={15} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
