import type { Metadata } from "next";
import { Phone, Mail, MapPin, ExternalLink, Share2, Camera, MessageCircle } from "lucide-react";
import { BUSINESS } from "@/data/business";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Satyasri Realtors. Call, email, WhatsApp, or fill the form — Mahesh Kumar responds promptly.",
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label mb-2">Get in Touch</p>
          <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-poppins)] text-[var(--color-secondary)]">
            Contact Satyasri Realtors
          </h1>
          <p className="text-[var(--color-text-muted)] mt-3 max-w-xl mx-auto">
            Have a question about a property? Looking to buy, sell, or rent? Reach out and{" "}
            {BUSINESS.contact.consultant} will get back to you promptly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: contact info */}
          <div className="space-y-8">
            {/* Contact cards */}
            {[
              {
                icon: Phone,
                label: "Phone / WhatsApp",
                value: BUSINESS.contact.phoneDisplay,
                href: `tel:${BUSINESS.contact.phone}`,
                color: "#e8541e",
              },
              {
                icon: Mail,
                label: "Email",
                value: BUSINESS.contact.email,
                href: `mailto:${BUSINESS.contact.email}`,
                color: "#0f2d5c",
              },
              {
                icon: MapPin,
                label: "Office Address",
                value: BUSINESS.address.full,
                href: BUSINESS.contact.googleMaps,
                color: "#2d9e6b",
              },
            ].map(({ icon: Icon, label, value, href, color }) => (
              <a
                key={label}
                href={href}
                target={label === "Office Address" ? "_blank" : undefined}
                rel={label === "Office Address" ? "noopener noreferrer" : undefined}
                className="card flex gap-4 p-5 items-start group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}15` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                    {value}
                  </p>
                </div>
                <ExternalLink size={14} className="ml-auto text-[var(--color-text-muted)] shrink-0 mt-1" />
              </a>
            ))}

            {/* Social links */}
            <div className="card p-5">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
                Follow Us
              </p>
              <div className="flex gap-3">
                <a
                  href={BUSINESS.contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                  aria-label="Facebook"
                >
                  <Share2 size={16} /> Facebook
                </a>
                <a
                  href={BUSINESS.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                  aria-label="Instagram"
                >
                  <Camera size={16} /> Instagram
                </a>
                <a
                  href={BUSINESS.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 text-sm font-medium text-green-700 hover:bg-green-50 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden h-60 bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
              {/* TODO: Replace with verified Google Maps embed iframe for the office address */}
              <div className="text-center p-6">
                <MapPin size={32} className="text-[var(--color-primary)] mx-auto mb-2" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  {BUSINESS.address.line1} {BUSINESS.address.line2}
                  <br />
                  {BUSINESS.address.city} — {BUSINESS.address.pin}
                </p>
                <a
                  href={BUSINESS.contact.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  View on Google Maps ↗
                </a>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="card p-7">
            <h2 className="font-bold font-[var(--font-poppins)] text-xl mb-6 text-[var(--color-secondary)]">
              Send Us a Message
            </h2>
            <LeadForm sourcePage="Contact Page" />
          </div>
        </div>
      </div>
    </div>
  );
}
