import type { Metadata } from "next";
import { MapPin, Target, Eye } from "lucide-react";
import { BUSINESS } from "@/data/business";


export const metadata: Metadata = {
  title: "About Us | Satyasri Realtors",
  description:
    "Trusted real estate agency in Hyderabad since 2009 specializing in residential and commercial properties across Kondapur, Gachibowli, and nearby areas.",
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container">
        {/* Hero strip */}
        <div className="bg-[#081c3a] rounded-3xl p-10 md:p-14 text-white mb-16 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 70% 65% at 80% 55%, rgba(201,162,39,0.15) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-2xl">
            <p className="text-[#C9A227] font-semibold text-xs uppercase tracking-widest mb-3">
              About Us
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-poppins)] mb-4">
              Satyasri Realtors
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Trusted real estate agency in Hyderabad since 2009, specializing in residential and commercial properties with genuine listings and transparent transactions.
            </p>
          </div>
        </div>

        {/* Company Story & Founder */}
        <div className="grid md:grid-cols-12 gap-12 mb-16 items-start">
          <div className="md:col-span-8">
            <p className="section-label mb-2">Our Story</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-[var(--font-poppins)] text-[var(--color-secondary)] mb-6">
              Serving Hyderabad Since 2009
            </h2>
            <div className="space-y-4 text-[var(--color-text-muted)] leading-relaxed">
              <p>
                Satyasri Realtors is a trusted real estate agency in Hyderabad specializing in both residential and commercial properties. We offer comprehensive services across buying, selling, renting, leasing, and property investment.
              </p>
              <p>
                Whether you are looking for apartments, villas, open plots, or commercial properties, our deep local market expertise ensures you find exactly what you need. We pride ourselves on offering genuine property listings, completely transparent transactions, and highly personalized service.
              </p>
              <p>
                Our commitment is to put the client&apos;s best interest first — guiding you through every step of your real estate journey with honesty and professionalism.
              </p>
            </div>
          </div>

          {/* Founder Profile */}
          <div className="md:col-span-4 card p-6 bg-[var(--color-surface)] text-center flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 bg-gray-200 relative">
              {/* TODO(founder-photo): Replace with actual photo of Mahesh Kumar Aerwa */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span className="text-sm font-medium px-2">Photo Placeholder</span>
              </div>
            </div>
            <h3 className="font-bold text-lg text-[var(--color-secondary)] font-[var(--font-poppins)]">
              {BUSINESS.contact.consultant}
            </h3>
            <p className="text-sm text-[#C9A227] font-semibold mb-3">Founder & Consultant</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Guiding clients with integrity, transparent dealings, and market expertise since 2009.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="card p-8 border-t-4 border-t-[#0f2d5c]">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[#0f2d5c]/10 text-[#0f2d5c]">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold font-[var(--font-poppins)] text-[var(--color-secondary)] mb-3">
              Our Mission
            </h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              To deliver seamless and transparent real estate experiences by providing genuine property options, expert market guidance, and personalized solutions tailored to our clients&apos; unique needs.
            </p>
          </div>
          <div className="card p-8 border-t-4 border-t-[#C9A227]">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[#C9A227]/10 text-[#C9A227]">
              <Eye size={24} />
            </div>
            <h3 className="text-xl font-bold font-[var(--font-poppins)] text-[var(--color-secondary)] mb-3">
              Our Vision
            </h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              To be the most trusted and preferred real estate partner in Hyderabad, known for setting the highest standards of integrity, customer satisfaction, and long-term value creation in the industry.
            </p>
          </div>
        </div>

        {/* Service areas */}
        <div className="card p-8 bg-[var(--color-surface)]">
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div>
              <h2 className="font-bold font-[var(--font-poppins)] text-xl text-[var(--color-secondary)] mb-2">
                Areas We Serve
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm mb-4 md:mb-0 max-w-md">
                We focus on high-growth, premium corridors across Hyderabad and the Financial District.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                "Kondapur", "Gachibowli", "Hitech City", "Kokapet", "Financial District", "Manikonda"
              ].map((area) => (
                <span key={area} className="flex items-center gap-1.5 tag !bg-white border border-[#e5e0d8] shadow-sm">
                  <MapPin size={12} className="text-[#C9A227]" /> {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}