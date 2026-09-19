import type { Metadata } from "next";
import { Phone, Mail, MapPin, ExternalLink, Share2, Camera, QrCode } from "lucide-react";
import { BUSINESS } from "@/data/business";
import LeadForm from "@/components/LeadForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Us | Satyasri Realtors",
  description:
    "Get in touch with Satyasri Realtors. Call, email, WhatsApp, or fill the form — Mahesh Kumar Aerwa responds promptly.",
};

export default function ContactPage() {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(BUSINESS.contact.whatsapp)}`;

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
          <div className="space-y-6">
            {/* Contact cards */}
            {[
              {
                icon: Phone,
                label: "Phone / WhatsApp",
                value: BUSINESS.contact.phoneDisplay,
                href: `tel:${BUSINESS.contact.phone}`,
                color: "#C9A227",
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
                className="card flex gap-4 p-5 items-start group hover:border-[#C9A227]"
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
                  <p className="text-sm font-medium text-[var(--color-text)] group-hover:text-[#C9A227] transition-colors">
                    {value}
                  </p>
                </div>
                <ExternalLink size={14} className="ml-auto text-[var(--color-text-muted)] shrink-0 mt-1" />
              </a>
            ))}

            {/* QR Code and Socials in one row */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* QR Code */}
              <div className="card p-5 text-center flex flex-col items-center justify-center">
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5 justify-center">
                  <QrCode size={14} /> Scan to WhatsApp
                </p>
                <div className="p-2 bg-white rounded-xl shadow-sm inline-block">
                  <Image
                    src={qrCodeUrl}
                    alt="WhatsApp QR Code"
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Social links */}
              <div className="card p-5 flex flex-col justify-center">
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
                  Follow Us
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={BUSINESS.contact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors bg-white"
                  >
                    <Share2 size={16} /> Facebook
                  </a>
                  <a
                    href={BUSINESS.contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors bg-white"
                  >
                    <Camera size={16} /> Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden h-60 bg-[var(--color-surface)] border border-[var(--color-border)] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30448.243501633515!2d78.34440810168305!3d17.466042455110462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93a2eb620bf7%3A0x9d3ebc3619cd30bc!2sKondapur%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
                className="absolute inset-0"
              />
              {/* Overlay with subtle shadow for aesthetics, clickable through via pointer-events-none on the shadow if needed, but here we just let the map be interactive */}
            </div>
          </div>

          {/* Right: form */}
          <div className="card p-7 shadow-lg border-t-4 border-t-[#C9A227]">
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