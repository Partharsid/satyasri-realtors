import type { Metadata } from "next";
import Link from "next/link";
import { Building2, TrendingUp, Home, Star, ArrowRight, CheckCircle, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services | Satyasri Realtors",
  description:
    "Satyasri Realtors offers expert property buying, selling, rental, leasing, and investment consulting across Hyderabad.",
};

const services = [
  {
    icon: Building2,
    title: "Property Buying",
    tagline: "Find your perfect home with zero guesswork.",
    description:
      "We guide you through every step of buying a property — from shortlisting options that match your budget and requirements, to site visits, legal verification, negotiation, and registration. No surprises, no wasted time.",
    points: [
      "Curated shortlists based on your requirements & budget",
      "Site visits and honest assessment",
      "Legal due diligence support",
      "Negotiation and final documentation",
    ],
    color: "#0f2d5c",
    cta: "Find a Property",
    href: "/listings?transaction=Sale",
  },
  {
    icon: TrendingUp,
    title: "Property Selling",
    tagline: "Get the best price — fast and hassle-free.",
    description:
      "Looking to sell? We market your property to the right buyers, manage inquiries, handle negotiation, and see the transaction through to completion — so you get maximum value with minimum stress.",
    points: [
      "Free property valuation",
      "Targeted buyer outreach",
      "Negotiation on your behalf",
      "End-to-end transaction support",
    ],
    color: "#C9A227",
    cta: "List Your Property",
    href: "/contact?subject=Sell",
  },
  {
    icon: Home,
    title: "Property Rental",
    tagline: "Premium residential rentals across prime locations.",
    description:
      "Whether you're a tenant looking for the right home or an owner wanting reliable tenants, we handle the search, matching, background checks, and lease formalities efficiently and professionally.",
    points: [
      "Verified rental listings in prime locations",
      "Tenant screening and matching",
      "Rental agreement support",
      "Owner & tenant mediation",
    ],
    color: "#2d9e6b",
    cta: "Browse Rentals",
    href: "/listings?transaction=Rent",
  },
  {
    icon: Briefcase,
    title: "Leasing",
    tagline: "Commercial spaces for your business growth.",
    description:
      "We help businesses secure the ideal commercial space — offices, retail outlets, or warehouses. We negotiate favorable lease terms and manage the documentation process so you can focus on your business.",
    points: [
      "Commercial property sourcing",
      "Lease term negotiation",
      "Documentation and compliance",
      "Strategic location advisory",
    ],
    color: "#081c3a",
    cta: "Find Commercial Space",
    href: "/listings?transaction=Lease",
  },
  {
    icon: Star,
    title: "Investment Consultation",
    tagline: "Turn the right land or property into long-term returns.",
    description:
      "We advise on high-potential investment properties — land parcels near infrastructure corridors, upcoming residential hotspots, and commercial real estate — backed by local market intelligence.",
    points: [
      "Market intelligence and trend analysis",
      "Investment-grade property sourcing",
      "ROI projections and risk assessment",
      "Long-term portfolio planning",
    ],
    color: "#7c3aed",
    cta: "Discuss Investment",
    href: "/contact?subject=Invest",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-label mb-2">What We Do</p>
          <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-poppins)] text-[var(--color-secondary)]">
            Our Services
          </h1>
          <p className="text-[var(--color-text-muted)] mt-3 max-w-xl mx-auto">
            End-to-end real estate services across Hyderabad —
            tailored to buyers, sellers, tenants, businesses, and investors.
          </p>
        </div>

        {/* Services */}
        <div className="space-y-8">
          {services.map(({ icon: Icon, title, tagline, description, points, color, cta, href }, i) => (
            <div
              key={title}
              className={`card p-8 grid md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${color}15` }}
                >
                  <Icon size={28} style={{ color }} />
                </div>
                <h2 className="text-2xl font-bold font-[var(--font-poppins)] text-[var(--color-secondary)] mb-1">
                  {title}
                </h2>
                <p className="font-medium mb-4" style={{ color }}>{tagline}</p>
                <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">{description}</p>
                <Link href={href} className="btn-primary !inline-flex">
                  {cta} <ArrowRight size={15} />
                </Link>
              </div>
              <div
                className="rounded-2xl p-6 bg-white"
                style={{ border: `1px solid ${color}30`, boxShadow: `0 4px 20px ${color}10` }}
              >
                <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color }}>
                  What&apos;s included
                </p>
                <ul className="space-y-3">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-[var(--color-text)]">
                      <CheckCircle size={16} style={{ color }} className="shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}