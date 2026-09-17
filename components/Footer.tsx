import Link from "next/link";
import { Share2, Camera, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { BUSINESS } from "@/data/business";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[var(--color-secondary)] text-white">
      {/* Main footer */}
      <div className="container py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg gradient-cta flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">SR</span>
            </div>
            <span className="font-bold text-lg font-[var(--font-poppins)]">
              Satyasri <span className="text-[var(--color-primary-light)]">Realtors</span>
            </span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-5">
            {BUSINESS.tagline}. {BUSINESS.category} — serving Hyderabad and beyond with honesty and expertise.
          </p>
          <div className="flex gap-3">
            <a
              href={BUSINESS.contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--color-primary)] flex items-center justify-center transition-colors"
            >
              <Share2 size={16} />
            </a>
            <a
              href={BUSINESS.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--color-primary)] flex items-center justify-center transition-colors"
            >
              <Camera size={16} />
            </a>
            <a
              href={BUSINESS.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-green-500 flex items-center justify-center transition-colors"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-semibold font-[var(--font-poppins)] mb-4 text-white/90">Quick Links</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              { label: "Home", href: "/" },
              { label: "Listings", href: "/listings" },
              { label: "About Us", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[var(--color-primary-light)] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold font-[var(--font-poppins)] mb-4 text-white/90">Our Services</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {["Property Buying", "Property Selling", "Renting", "Investment Consulting", "Registered Consulting"].map(
              (s) => (
                <li key={s} className="hover:text-[var(--color-primary-light)] transition-colors cursor-default">
                  {s}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold font-[var(--font-poppins)] mb-4 text-white/90">Contact Us</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-2">
              <MapPin size={15} className="shrink-0 mt-0.5 text-[var(--color-primary-light)]" />
              <span>{BUSINESS.address.full}</span>
            </li>
            <li>
              <a
                href={`tel:${BUSINESS.contact.phone}`}
                className="flex gap-2 items-center hover:text-[var(--color-primary-light)] transition-colors"
              >
                <Phone size={15} className="text-[var(--color-primary-light)]" />
                {BUSINESS.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${BUSINESS.contact.email}`}
                className="flex gap-2 items-center hover:text-[var(--color-primary-light)] transition-colors"
              >
                <Mail size={15} className="text-[var(--color-primary-light)]" />
                {BUSINESS.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/50">
          <p>© {year} {BUSINESS.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Trusted Service</span>
            <span>•</span>
            <span>Transparent Dealings</span>
            <span>•</span>
            <span>Best Value</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
