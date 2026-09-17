/**
 * PROPERTY LISTINGS DATA FILE
 * ============================================================
 * This is the single source of truth for all property listings.
 * To add a new listing, add a new object to the `listings` array below.
 * Follow the schema defined by the `Listing` type.
 * No code changes are needed anywhere else — the site reads from this file.
 * ============================================================
 */

export type ListingType = "Land" | "Apartment" | "Villa" | "Commercial";
export type TransactionType = "Sale" | "Rent";

export interface Listing {
  /** Unique slug used in the URL: /listings/[slug] */
  slug: string;
  title: string;
  type: ListingType;
  transaction: TransactionType;
  /** Price string as it should display, e.g. "₹26.00 Lakhs per Acre" or "₹52,000/month" */
  price: string;
  /** Numeric value for sorting/filtering (in rupees; for land use per-acre price) */
  priceNumeric: number;
  location: {
    area: string;
    city: string;
    state: string;
    fullAddress?: string;
  };
  /** Short summary shown on listing cards */
  summary: string;
  /** Full description for the listing detail page */
  description: string;
  specs: {
    area?: string;          // e.g. "1,844 Sq. Ft." or "105 Acres"
    bedrooms?: number;
    bathrooms?: number;
    facing?: string;
    floor?: string;
    furnishing?: string;
    parking?: string;
    availability?: string;
    tenantRestriction?: string;
  };
  features: string[];
  amenities?: string[];     // For gated communities
  /** Relative paths under /public/images/ or TODO placeholders */
  images: string[];
  /** Primary thumbnail shown on cards */
  thumbnail: string;
  isFeatured: boolean;
  tags?: string[];
}

const listings: Listing[] = [
  // ─────────────────────────────────────────────
  // LISTING 1: Land for Sale — Sitharamapuram
  // ─────────────────────────────────────────────
  {
    slug: "land-sitharamapuram-nellore-105-acres",
    title: "105 Acres Land for Sale — Sitharamapuram, Nellore",
    type: "Land",
    transaction: "Sale",
    price: "₹26.00 Lakhs per Acre",
    priceNumeric: 2600000,
    location: {
      area: "Sitharamapuram",
      city: "Nellore",
      state: "Andhra Pradesh",
    },
    summary:
      "105 acres of strategic land at the interchange of NH-44 and NH-167B — an outstanding investment opportunity in Nellore District, AP.",
    description:
      "105 Acres of land for sale at Sitharamapuram, Nellore District, Andhra Pradesh, facing National Highway NH-167B (Mydukur to Singarayakonda), in the immediate vicinity of the six-lane green field expressway NH-44 (Bengaluru to Amaravati), and exactly at the inter-change point of NH-44 and NH-167B. A rare opportunity for large-scale commercial, logistics, or investment purposes.",
    specs: {
      area: "105 Acres",
      availability: "Immediate",
    },
    features: [
      "Strategic location at NH-44 × NH-167B interchange",
      "Facing NH-167B (Mydukur to Singarayakonda)",
      "Immediate vicinity of 6-lane green field expressway NH-44 (Bengaluru to Amaravati)",
      "Great investment opportunity",
    ],
    // TODO: Replace with the actual aerial/map image once supplied by client
    images: ["/images/placeholder-land.jpg"],
    thumbnail: "/images/placeholder-land.jpg",
    isFeatured: true,
    tags: ["highway", "investment", "land", "nellore", "andhra-pradesh"],
  },

  // ─────────────────────────────────────────────
  // LISTING 2: 3 BHK Flat for Rent — Aditya Heights, Kondapur
  // ─────────────────────────────────────────────
  {
    slug: "3bhk-aditya-heights-kondapur",
    title: "3 BHK Flat for Rent — Aditya Heights, Kondapur",
    type: "Apartment",
    transaction: "Rent",
    price: "₹52,000/month",
    priceNumeric: 52000,
    location: {
      area: "Kondapur",
      city: "Hyderabad",
      state: "Telangana",
      fullAddress:
        "Aditya Heights, Near Hi-Tech City, Opp. Botanical Gardens, White Fields, Kondapur, Hyderabad – 500084, Telangana, India",
    },
    summary:
      "Spacious west-facing 3 BHK (1,844 sq ft) in Aditya Heights near Hi-Tech City, fully equipped with ACs, modular kitchen, and BGL gas pipeline.",
    description:
      "Well-maintained 3 BHK apartment in Aditya Heights, situated near Hi-Tech City and opposite the Botanical Gardens in Kondapur. The flat measures 1,844 sq ft, is west-facing, and comes equipped with ACs in all bedrooms, geysers in both bathrooms, a modular kitchen with chimney, an Aquaguard water filtration system, and a direct BGL gas pipeline connection. Side balcony and enclosed foyer add to the comfort.",
    specs: {
      area: "1,844 Sq. Ft.",
      bedrooms: 3,
      bathrooms: 2,
      facing: "West",
      furnishing: "Semi-furnished",
      availability: "From November 1",
    },
    features: [
      "Side Balcony & Front Foyer (grill enclosed)",
      "Modular kitchen with stove & chimney unit",
      "Aquaguard water filtration system",
      "Wash area behind kitchen",
      "Spacious living room & dining area",
      "All 3 bedrooms with working A/C units",
      "2 bathrooms with geyser units installed",
      "BGL gas pipeline connection directly to unit",
      "Additional grill-enclosed foyer space",
      "Side balcony with good ventilation",
    ],
    // Additional costs note for the detail page
    // Monthly HOA/maintenance: ₹4,000–5,000; tenant pays utility bills (gas, electricity, water)
    // TODO: Replace placeholders with actual interior photos supplied by client (living room, kitchen, bedroom, balcony)
    images: [
      "/images/placeholder-apartment.jpg",
      "/images/placeholder-apartment.jpg",
      "/images/placeholder-apartment.jpg",
      "/images/placeholder-apartment.jpg",
    ],
    thumbnail: "/images/placeholder-apartment.jpg",
    isFeatured: true,
    tags: ["3bhk", "kondapur", "hitech-city", "apartment", "hyderabad"],
  },

  // ─────────────────────────────────────────────
  // LISTING 3: Premium 3 BHK for Rent — Ramky Towers, Gachibowli
  // ─────────────────────────────────────────────
  {
    slug: "3bhk-ramky-towers-gachibowli",
    title: "Premium 3 BHK — Ramky Towers, Gachibowli",
    type: "Apartment",
    transaction: "Rent",
    price: "₹75,000/month + maintenance",
    priceNumeric: 75000,
    location: {
      area: "Gachibowli",
      city: "Hyderabad",
      state: "Telangana",
    },
    summary:
      "Spacious 2,365 sq ft west-facing 3 BHK in premium gated community Ramky Towers, Gachibowli — world-class amenities, 2 car parks, family only.",
    description:
      "A spacious and light-filled 3 BHK apartment in the prestigious Ramky Towers, Gachibowli. Measuring 2,365 sq ft with a west-facing orientation on a lower floor, this semi-furnished unit offers 2 dedicated car parking spaces. The gated community features a club house, swimming pool, gym, indoor games, basketball court, tennis court, and 24/7 power backup and security. Ideal for families seeking a premium lifestyle close to Hyderabad's prime IT corridor.",
    specs: {
      area: "2,365 Sq. Ft.",
      bedrooms: 3,
      facing: "West",
      floor: "Lower floor",
      furnishing: "Semi-furnished",
      parking: "2 car parking",
      availability: "Ready to move",
      tenantRestriction: "Family only",
    },
    features: [
      "Spacious layout with maximum natural light and ventilation",
      "2 dedicated car parking spots",
      "Premium gated community with 24/7 security",
      "Close to IT hubs, AIG Hospital, schools & shopping",
      "Family-only occupancy",
    ],
    amenities: [
      "Club House",
      "Swimming Pool",
      "Gym",
      "Indoor Games",
      "Basketball Court",
      "Tennis Court",
      "24/7 Power Backup",
    ],
    // TODO: Replace placeholders with actual photos supplied by client (living room, bedroom, kitchen)
    images: [
      "/images/placeholder-apartment.jpg",
      "/images/placeholder-apartment.jpg",
      "/images/placeholder-apartment.jpg",
    ],
    thumbnail: "/images/placeholder-apartment.jpg",
    isFeatured: true,
    tags: ["3bhk", "gachibowli", "premium", "apartment", "hyderabad", "family"],
  },
];

export default listings;

/** Helper: get a listing by slug */
export function getListingBySlug(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}

/** Helper: filter listings */
export function filterListings(filters: {
  type?: ListingType;
  transaction?: TransactionType;
  city?: string;
}): Listing[] {
  return listings.filter((l) => {
    if (filters.type && l.type !== filters.type) return false;
    if (filters.transaction && l.transaction !== filters.transaction)
      return false;
    if (
      filters.city &&
      l.location.city.toLowerCase() !== filters.city.toLowerCase()
    )
      return false;
    return true;
  });
}
