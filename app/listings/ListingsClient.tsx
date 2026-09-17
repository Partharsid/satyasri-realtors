"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import listings, { type Listing, type ListingType, type TransactionType } from "@/data/listings";
import ListingCard from "@/components/ListingCard";
import { SlidersHorizontal } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

type TypeFilter = ListingType | "All";
type TxFilter = TransactionType | "All";
type CityFilter = string | "All";

interface Props {
  listings: Listing[];
}

const cities = ["All", ...Array.from(new Set(listings.map((l) => l.location.city)))];

export default function ListingsClient({ listings }: Props) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [txFilter, setTxFilter] = useState<TxFilter>("All");
  const [cityFilter, setCityFilter] = useState<CityFilter>("All");

  const filtered = listings.filter((l) => {
    if (typeFilter !== "All" && l.type !== typeFilter) return false;
    if (txFilter !== "All" && l.transaction !== txFilter) return false;
    if (cityFilter !== "All" && l.location.city !== cityFilter) return false;
    return true;
  });

  const FilterChip = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        active
          ? "gradient-cta text-white border-transparent shadow-md"
          : "bg-white text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="pt-28 pb-16">
      <div className="container">
        {/* Header */}
        <div className="mb-10">
          <p className="section-label mb-2">Our Properties</p>
          <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-poppins)] text-[var(--color-secondary)]">
            All Listings
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2">
            {filtered.length} propert{filtered.length === 1 ? "y" : "ies"} found
          </p>
        </div>

        {/* Filters */}
        <div className="card p-5 mb-8">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-[var(--color-secondary)]">
            <SlidersHorizontal size={16} /> Filter Properties
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Transaction */}
            <div className="flex flex-wrap gap-2">
              {(["All", "Sale", "Rent"] as TxFilter[]).map((t) => (
                <FilterChip key={t} label={t === "All" ? "Buy & Rent" : t} active={txFilter === t} onClick={() => setTxFilter(t)} />
              ))}
            </div>
            <div className="w-px bg-[var(--color-border)] mx-1 hidden sm:block" />
            {/* Type */}
            <div className="flex flex-wrap gap-2">
              {(["All", "Apartment", "Land", "Villa", "Commercial"] as TypeFilter[]).map((t) => (
                <FilterChip key={t} label={t === "All" ? "All Types" : t} active={typeFilter === t} onClick={() => setTypeFilter(t)} />
              ))}
            </div>
            <div className="w-px bg-[var(--color-border)] mx-1 hidden sm:block" />
            {/* City */}
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <FilterChip key={c} label={c} active={cityFilter === c} onClick={() => setCityFilter(c)} />
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <p className="text-lg font-medium mb-2">No properties match your filters.</p>
            <button
              onClick={() => { setTypeFilter("All"); setTxFilter("All"); setCityFilter("All"); }}
              className="btn-secondary mt-2"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing, i) => (
              <motion.div
                key={listing.slug}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={i}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
