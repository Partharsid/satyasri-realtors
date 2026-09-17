import type { Metadata } from "next";
import { ShieldCheck, Handshake, TrendingUp, MapPin } from "lucide-react";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Satyasri Realtors — a registered real estate consultant based in Hyderabad, trusted for transparent dealings and best value across Telangana and Andhra Pradesh.",
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container">
        {/* Hero strip */}
        <div className="gradient-hero rounded-3xl p-10 md:p-14 text-white mb-16 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg,rgba(255,255,255,.15) 0,rgba(255,255,255,.15) 1px,transparent 0,transparent 50%)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden
          />
          <div className="relative z-10 max-w-2xl">
            <p className="text-orange-300 font-semibold text-xs uppercase tracking-widest mb-3">
              About Us
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-poppins)] mb-4">
              Satyasri Realtors
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              {BUSINESS.tagline} — a {BUSINESS.category} operating across Hyderabad, Telangana and
              Andhra Pradesh with integrity at every step.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <p className="section-label mb-2">Our Story</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-[var(--font-poppins)] text-[var(--color-secondary)] mb-4">
              Built on Trust & Transparency
            </h2>
            <div className="space-y-4 text-[var(--color-text-muted)] leading-relaxed">
              <p>
                Satyasri Realtors is a registered real estate consultancy that has been helping
                families, investors, and businesses find the right property at the right value.
                Led by <strong className="text-[var(--color-text)]">{BUSINESS.contact.consultant}</strong>,
                we specialize in residential and commercial properties across Hyderabad&apos;s key
                corridors — Kondapur, Gachibowli, Hi-Tech City — and investment-grade land
                parcels in Andhra Pradesh.
              </p>
              <p>
                We believe in doing fewer deals, better. That means no overselling, no hidden
                charges, and no wasted site visits — just straightforward guidance that puts the
                client&apos;s best interest first.
              </p>
            </div>
          </div>
          <div className="card p-8 bg-[var(--color-surface)]">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Service Area", value: "Hyderabad & AP" },
                { label: "Consultant", value: BUSINESS.contact.consultant },
                { label: "Services", value: "Buy • Sell • Rent • Invest" },
                { label: "Registration", value: "Registered RE Consultant" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className="font-medium text-[var(--color-text)] text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: ShieldCheck,
              title: "Trusted Service",
              body: "Complete integrity — no hidden costs, no misleading claims. Every client gets our full, undivided attention.",
              color: "#0f2d5c",
            },
            {
              icon: Handshake,
              title: "Transparent Dealings",
              body: "All terms laid out clearly upfront. You understand every detail before you sign anything.",
              color: "#e8541e",
            },
            {
              icon: TrendingUp,
              title: "Best Value",
              body: "Deep market knowledge ensures the best possible outcome — whether you're buying, selling, renting, or investing.",
              color: "#2d9e6b",
            },
          ].map(({ icon: Icon, title, body, color }) => (
            <div key={title} className="card p-7 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `${color}15` }}
              >
                <Icon size={26} style={{ color }} />
              </div>
              <h3 className="font-bold font-[var(--font-poppins)] mb-2 text-[var(--color-secondary)]">
                {title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Service areas */}
        <div className="card p-8">
          <h2 className="font-bold font-[var(--font-poppins)] text-xl text-[var(--color-secondary)] mb-5">
            Areas We Serve
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Kondapur", "Gachibowli", "Hi-Tech City", "Madhapur",
              "Banjara Hills", "Jubilee Hills", "Hyderabad",
              "Nellore", "Andhra Pradesh", "Telangana"
            ].map((area) => (
              <span key={area} className="flex items-center gap-1.5 tag !text-sm">
                <MapPin size={12} /> {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
