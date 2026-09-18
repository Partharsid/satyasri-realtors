"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { BUSINESS } from "@/data/business";

const locationsMenu = [
  { label: "Hitech City", href: "/locations/hitech-city" },
  { label: "Gachibowli", href: "/locations/gachibowli" },
  { label: "Kondapur", href: "/locations/kondapur" },
  { label: "Financial District", href: "/locations/financial-district" },
  { label: "Kokapet", href: "/locations/kokapet" },
  { label: "Manikonda", href: "/locations/manikonda" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Listings", href: "/listings" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

/** Satyasri Realtors building/skyline icon — gold, matches brand brief */
function SatyasriLogoIcon({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background rounded square */}
      <rect width="40" height="40" rx="9" fill="#C9A227" />
      {/* Building skyline — white icon on gold */}
      {/* Left short building */}
      <rect x="5" y="20" width="7" height="14" rx="1" fill="white" opacity="0.9" />
      {/* Left building window */}
      <rect x="7" y="23" width="3" height="3" rx="0.5" fill="#C9A227" />
      {/* Centre tall building */}
      <rect x="14" y="12" width="12" height="22" rx="1" fill="white" />
      {/* Centre building windows */}
      <rect x="16.5" y="15" width="3" height="3" rx="0.5" fill="#C9A227" />
      <rect x="21" y="15" width="3" height="3" rx="0.5" fill="#C9A227" />
      <rect x="16.5" y="21" width="3" height="3" rx="0.5" fill="#C9A227" />
      <rect x="21" y="21" width="3" height="3" rx="0.5" fill="#C9A227" />
      {/* Centre building roof peak */}
      <polygon points="20,6 14,13 26,13" fill="white" opacity="0.85" />
      {/* Right building */}
      <rect x="28" y="17" width="7" height="17" rx="1" fill="white" opacity="0.9" />
      {/* Right building window */}
      <rect x="30" y="20" width="3" height="3" rx="0.5" fill="#C9A227" />
      {/* Ground line */}
      <rect x="4" y="33.5" width="32" height="1.5" rx="0.75" fill="white" opacity="0.4" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-sm border-b border-[#e5e0d8]"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <SatyasriLogoIcon size={38} />
            <div className="leading-tight">
              <span
                className={`font-bold text-lg font-[var(--font-poppins)] transition-colors block leading-none ${
                  scrolled ? "text-[#0f2d5c]" : "text-white"
                }`}
              >
                Satyasri
                <span className="text-[#C9A227]"> Realtors</span>
              </span>
              <span
                className={`text-[10px] font-medium tracking-wide transition-colors ${
                  scrolled ? "text-[#64748b]" : "text-white/60"
                }`}
              >
                Real Estate Consultant
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-[#1a1a1a] hover:text-[#C9A227]"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Locations Dropdown */}
            <div className="relative group">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  scrolled
                    ? "text-[#1a1a1a] hover:text-[#C9A227]"
                    : "text-white/85 hover:text-white"
                }`}
              >
                Locations
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#e5e0d8] shadow-lg rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {locationsMenu.map((loc) => (
                    <Link
                      key={loc.href}
                      href={loc.href}
                      className="block px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f8f7f4] hover:text-[#C9A227]"
                    >
                      {loc.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.slice(3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-[#1a1a1a] hover:text-[#C9A227]"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${BUSINESS.contact.phone}`}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                scrolled ? "text-[#0f2d5c]" : "text-white"
              }`}
            >
              <Phone size={15} />
              {BUSINESS.contact.phoneDisplay}
            </a>
            <Link href="/contact" className="btn-primary text-sm !py-2 !px-5">
              Get in Touch
            </Link>
          </div>

          {/* Mobile: call button + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`tel:${BUSINESS.contact.phone}`}
              className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                scrolled ? "text-[#0f2d5c]" : "text-white"
              }`}
              aria-label={`Call ${BUSINESS.contact.phoneDisplay}`}
            >
              <Phone size={18} />
            </a>
            <button
              onClick={() => setOpen(!open)}
              className={`p-2 rounded-lg transition-colors ${
                scrolled ? "text-[#0f2d5c]" : "text-white"
              }`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#e5e0d8] shadow-lg max-h-[80vh] overflow-y-auto">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-[#1a1a1a] font-medium hover:bg-[#f8f7f4] hover:text-[#C9A227] transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="px-4 py-2 mt-2">
              <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Locations</p>
              <div className="grid grid-cols-2 gap-2">
                {locationsMenu.map((loc) => (
                  <Link
                    key={loc.href}
                    href={loc.href}
                    onClick={() => setOpen(false)}
                    className="py-2 text-sm text-[#1a1a1a] hover:text-[#C9A227]"
                  >
                    {loc.label}
                  </Link>
                ))}
              </div>
            </div>

            {navLinks.slice(3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-[#1a1a1a] font-medium hover:bg-[#f8f7f4] hover:text-[#C9A227] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-[#e5e0d8] flex flex-col gap-2">
              <a
                href={`tel:${BUSINESS.contact.phone}`}
                className="btn-secondary !rounded-xl text-center"
              >
                <Phone size={16} /> {BUSINESS.contact.phoneDisplay}
              </a>
              <Link
                href="/contact"
                className="btn-primary !rounded-xl text-center"
                onClick={() => setOpen(false)}
              >
                Get in Touch
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
