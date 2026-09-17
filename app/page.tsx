"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck,
  Handshake,
  TrendingUp,
  Search,
  Phone,
  Star,
  Building2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { BUSINESS } from "@/data/business";
import listings from "@/data/listings";
import ListingCard from "@/components/ListingCard";
import LeadForm from "@/components/LeadForm";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function HomePage() {
  const featured = listings.filter((l) => l.isFeatured);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden gradient-hero">
        {/* Soft radial accent — orange warmth on right */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 80% 55%, rgba(232,84,30,0.28) 0%, transparent 70%)",
          }}
        />

        <div className="container relative z-10 pt-28 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — all text white on dark hero */}
            <div>
              <motion.h1
                className="text-4xl sm:text-5xl xl:text-[3.5rem] font-bold font-[var(--font-poppins)] text-white leading-[1.1] tracking-tight mb-5"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={0}
              >
                Your Trusted<br />Real Estate Partner
              </motion.h1>
              <motion.p
                className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={1}
              >
                Buying · Selling · Renting · Investing — with transparency
                and trust at every step. Serving Hyderabad and Andhra Pradesh.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-3 mb-10"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={2}
              >
                <Link href="/listings" className="btn-primary">
                  <Search size={16} /> Explore Listings
                </Link>
                <a href={`tel:${BUSINESS.contact.phone}`} className="btn-outline-white">
                  <Phone size={16} /> Call Now
                </a>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                className="flex flex-wrap gap-3"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={3}
              >
                {[
                  { icon: ShieldCheck, label: "Trusted Service" },
                  { icon: Handshake, label: "Transparent Dealings" },
                  { icon: TrendingUp, label: "Best Value" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Icon size={14} className="text-orange-300" />
                    {label}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Quick enquiry card — white bg, clearly separate from dark hero */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#ffffff",
                boxShadow: "0 24px 64px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.15)",
              }}
            >
              <div className="px-7 pt-6 pb-2" style={{ background: "var(--color-secondary)" }}>
                <h2 className="font-bold font-[var(--font-poppins)] text-xl text-white mb-1">
                  Quick Enquiry
                </h2>
                <p className="text-white/60 text-sm mb-4">
                  {BUSINESS.contact.consultant} responds within hours
                </p>
              </div>
              <div className="p-7">
                <LeadForm sourcePage="Home Hero" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ── */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="container">
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-poppins)] mb-3"
              style={{ color: "var(--color-secondary)" }}>
              Featured Listings
            </h2>
            <p style={{ color: "var(--color-text-muted)" }} className="max-w-xl">
              Hand-picked properties across Hyderabad and Andhra Pradesh — vetted, verified, and ready.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((listing, i) => (
              <motion.div
                key={listing.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/listings" className="btn-secondary">
              View All Listings <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container">
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-poppins)] mb-3"
              style={{ color: "var(--color-secondary)" }}>
              Why Choose Satyasri Realtors?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Trusted Service",
                body: "We operate with complete integrity — no hidden costs, no misleading claims, no wasted visits. Every client gets our full attention.",
                color: "#0f2d5c",
              },
              {
                icon: Handshake,
                title: "Transparent Dealings",
                body: "All terms are laid out clearly upfront. You understand every detail before signing anything — that is our commitment.",
                color: "#e8541e",
              },
              {
                icon: TrendingUp,
                title: "Best Value",
                body: "Our deep market knowledge ensures the best possible price — whether you are buying, selling, renting, or investing.",
                color: "#2d9e6b",
              },
            ].map(({ icon: Icon, title, body, color }, i) => (
              <motion.div
                key={title}
                className="card p-7"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${color}12` }}
                >
                  <Icon size={26} style={{ color }} />
                </div>
                <h3 className="text-lg font-bold font-[var(--font-poppins)] mb-2"
                  style={{ color: "var(--color-secondary)" }}>
                  {title}
                </h3>
                <p style={{ color: "var(--color-text-muted)" }} className="text-sm leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES STRIP ── */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="container">
          <motion.div
            className="mb-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-poppins)]"
              style={{ color: "var(--color-secondary)" }}>
              What We Do
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Building2, label: "Buy Property" },
              { icon: TrendingUp, label: "Sell Property" },
              { icon: MapPin, label: "Rent a Home" },
              { icon: Star, label: "Invest Smart" },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                className="card p-6 flex flex-col items-center gap-3 text-center cursor-default"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="w-12 h-12 rounded-xl gradient-cta flex items-center justify-center text-white">
                  <Icon size={22} />
                </div>
                <span className="font-semibold text-sm font-[var(--font-poppins)]"
                  style={{ color: "var(--color-secondary)" }}>
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS PLACEHOLDER ── */}
      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container">
          <motion.div
            className="mb-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-poppins)]"
              style={{ color: "var(--color-secondary)" }}>
              What Our Clients Say
            </h2>
          </motion.div>
          {/* TODO: Client to supply testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="skeleton h-4 w-full mb-2 rounded" />
                <div className="skeleton h-4 w-4/5 mb-2 rounded" />
                <div className="skeleton h-4 w-3/5 mb-5 rounded" />
                <div className="flex items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div>
                    <div className="skeleton h-3 w-24 mb-1.5 rounded" />
                    <div className="skeleton h-3 w-16 rounded" />
                  </div>
                </div>
                <p className="text-xs mt-3 italic" style={{ color: "var(--color-text-muted)" }}>
                  {/* TODO: Add real testimonial content from client */}
                  Client testimonial to be added by Satyasri Realtors.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(232,84,30,0.22) 0%, transparent 70%)",
          }}
        />
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold font-[var(--font-poppins)] text-white mb-4 leading-tight"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              Ready to Find Your Perfect Property?
            </motion.h2>
            <motion.p
              className="text-white/75 mb-8 text-lg max-w-lg"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
            >
              Talk to {BUSINESS.contact.consultant} today. One call is all it takes.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={2}
            >
              <a href={`tel:${BUSINESS.contact.phone}`} className="btn-primary">
                <Phone size={16} /> {BUSINESS.contact.phoneDisplay}
              </a>
              <Link href="/contact" className="btn-outline-white">
                Send an Enquiry
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
