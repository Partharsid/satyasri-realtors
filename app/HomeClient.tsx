"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck,
  Handshake,
  TrendingUp,

  Phone,
  Star,
  Building2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { BUSINESS } from "@/data/business";
import ListingCard from "@/components/ListingCard";
import LeadForm from "@/components/LeadForm";
import type { Listing } from "@/data/listings";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function HomeClient({ featured }: { featured: Listing[] }) {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#081c3a]">
        {/* Full-bleed background image with dark overlay */}
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000')" }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#081c3a] via-[#081c3a]/80 to-transparent" />

        {/* Soft radial accent — gold warmth on right */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 80% 55%, rgba(201,162,39,0.15) 0%, transparent 70%)",
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
                Buy • Sell • Rent Properties<br />in Hyderabad
              </motion.h1>
              <motion.p
                className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed font-medium"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={1}
              >
                Trusted Since 2009. Genuine property listings, transparent transactions, and personalized service across Telangana and Andhra Pradesh.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-3 mb-10"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={2}
              >
                <a href={`tel:${BUSINESS.contact.phone}`} className="btn-primary">
                  <Phone size={16} /> Call Now
                </a>
                <a href={BUSINESS.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-outline-white border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white">
                  WhatsApp Us
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
                    <Icon size={14} className="text-[#C9A227]" />
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
                color: "#C9A227",
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

      {/* ── TESTIMONIALS ── */}
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
          <div className="max-w-2xl">
            <div className="card p-8 flex flex-col sm:flex-row items-center gap-6 bg-[#f8f7f4]">
              <div className="flex-1">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={20} className="fill-[#C9A227] text-[#C9A227]" />
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#0f2d5c]">See our reviews on Google</h3>
                <p className="text-muted mb-4">
                  We take pride in our transparent dealings and trusted service. Read what our clients have to say about their experience with Satyasri Realtors on Google.
                </p>
                <a href={BUSINESS.contact.googleMaps} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                  Read Reviews on Google <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM FEED ── */}
      <section className="section bg-surface">
        <div className="container">
          <motion.div
            className="mb-10 flex justify-between items-end flex-wrap gap-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-poppins)]"
                style={{ color: "var(--color-secondary)" }}>
                Follow Us on Instagram
              </h2>
              <p className="text-muted mt-2">@satyasrirealtors</p>
            </div>
            <a href={BUSINESS.contact.instagram} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              View Profile
            </a>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=600"
            ].map((src, i) => (
              <a
                key={i}
                href={BUSINESS.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-all"
              >
                <Image
                  src={src}
                  alt="Instagram post"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-[#081c3a] relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000')" }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(201,162,39,0.15) 0%, transparent 70%)",
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

            {/* Audit Link */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={3}
              className="mt-6"
            >
              <a
                href="/audit.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#C9A227] hover:text-white hover:underline transition-colors"
              >
                View our Compliance Audit Report &rarr;
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
