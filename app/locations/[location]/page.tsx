import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import listings from "@/data/listings";
import ListingCard from "@/components/ListingCard";
import { BUSINESS } from "@/data/business";

const locations = [
  {
    slug: "hitech-city",
    name: "Hitech City",
    // TODO(market-overview-hitech-city): Client to provide actual market overview
    overview: "Hitech City is the premier IT hub of Hyderabad, offering a dynamic mix of premium residential apartments, commercial spaces, and excellent connectivity. Ideal for IT professionals and high-yield investments.",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30450.413289063255!2d78.3601550993952!3d17.44754502809055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dc8c5d69df%3A0x19688beb557fa0ee!2sHITEC%20City%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  },
  {
    slug: "gachibowli",
    name: "Gachibowli",
    // TODO(market-overview-gachibowli): Client to provide actual market overview
    overview: "Gachibowli is a major corporate and residential suburb. Known for its sports village, educational institutions, and luxury gated communities, it is a highly sought-after location for families.",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30453.649641775195!2d78.33719491684617!3d17.437346853746654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93ea5e4b6d3d%3A0x6b4f74d081b2382!2sGachibowli%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  },
  {
    slug: "kondapur",
    name: "Kondapur",
    // TODO(market-overview-kondapur): Client to provide actual market overview
    overview: "Kondapur offers the perfect balance of convenience and lifestyle. Situated close to Hitech City and Gachibowli, it features excellent supermarkets, hospitals, and mid-to-high-end residential options.",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30448.243501633515!2d78.34440810168305!3d17.466042455110462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93a2eb620bf7%3A0x9d3ebc3619cd30bc!2sKondapur%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  },
  {
    slug: "financial-district",
    name: "Financial District",
    // TODO(market-overview-financial-district): Client to provide actual market overview
    overview: "The Financial District is Hyderabad's premium business and luxury residential zone. Home to multinational banking and IT giants, properties here command high rental yields and long-term appreciation.",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15228.910543781256!2d78.33644083315367!3d17.414068300000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb94541bf77bbd%3A0x9f2f81dd6eef24f5!2sFinancial%20District%2C%20Nanakramguda%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  },
  {
    slug: "kokapet",
    name: "Kokapet",
    // TODO(market-overview-kokapet): Client to provide actual market overview
    overview: "Kokapet is the fastest-growing luxury residential destination in Hyderabad. With massive infrastructure developments like the Neopolis layout, it is the top choice for ultra-luxury villas and high-rise apartments.",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30456.973491956556!2d78.31422709939517!3d17.39499872809054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb94ebb6421379%3A0xa193740fcb6400c2!2sKokapet%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  },
  {
    slug: "manikonda",
    name: "Manikonda",
    // TODO(market-overview-manikonda): Client to provide actual market overview
    overview: "Manikonda is a thriving residential suburb offering great affordability without compromising on connectivity to major IT parks. It is popular among young professionals and families.",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30456.12658826955!2d78.3752538993952!3d17.40243462809055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb96e492211e03%3A0xe541cdd1082c57f7!2sManikonda%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  },
];

export function generateStaticParams() {
  return locations.map((loc) => ({
    location: loc.slug,
  }));
}

export function generateMetadata({ params }: { params: { location: string } }): Metadata {
  const loc = locations.find((l) => l.slug === params.location);
  if (!loc) return { title: "Location Not Found" };
  return {
    title: `Properties in ${loc.name} | Satyasri Realtors`,
    description: `Explore premium properties for sale and rent in ${loc.name}, Hyderabad with Satyasri Realtors.`,
  };
}

export default function LocationPage({ params }: { params: { location: string } }) {
  const loc = locations.find((l) => l.slug === params.location);

  if (!loc) {
    notFound();
  }

  // Filter listings by this location (simple substring match on location string)
  const areaListings = listings.filter((l) =>
    `${l.location.area} ${l.location.city} ${l.location.state}`.toLowerCase().includes(loc.name.toLowerCase())
  );

  return (
    <div className="pt-28 pb-16">
      <div className="container">
        {/* Header / Overview */}
        <div className="bg-[#0f2d5c] rounded-3xl p-10 md:p-14 text-white mb-12">
          <p className="text-[#C9A227] font-semibold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <MapPin size={14} /> Location Profile
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-poppins)] mb-4">
            {loc.name}, Hyderabad
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-3xl mb-8">
            {loc.overview}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={`tel:${BUSINESS.contact.phone}`} className="btn-primary">
              <Phone size={16} /> Contact Us About {loc.name}
            </a>
            <a href={BUSINESS.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-outline-white border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white">
              WhatsApp Enquiry
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content - Featured Properties */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold font-[var(--font-poppins)] text-[var(--color-secondary)] mb-6">
              Featured Properties in {loc.name}
            </h2>

            {areaListings.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {areaListings.map((listing) => (
                  <ListingCard key={listing.slug} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="card p-10 text-center bg-surface">
                <p className="text-muted mb-4">
                  We have many off-market properties in {loc.name} that are not listed online.
                </p>
                <Link href={`/contact?subject=Properties in ${loc.name}`} className="btn-secondary">
                  Request {loc.name} Listings
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar - Map */}
          <div>
            <div className="card p-1 overflow-hidden sticky top-28">
              <iframe
                src={loc.mapUrl}
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${loc.name}`}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}