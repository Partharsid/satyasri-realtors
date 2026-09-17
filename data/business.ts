/**
 * Site-wide constants — business info from satyasri-realtors-website-content.md
 * Do not invent or modify values here; update only when client confirms changes.
 */

export const BUSINESS = {
  name: "Satyasri Realtors",
  tagline: "Your Trusted Real Estate Partner",
  category: "Registered Real Estate Consultant",
  services: ["Buy", "Sell", "Rent", "Invest"],
  trustBadges: ["Trusted Service", "Transparent Dealings", "Best Value"],
  contact: {
    phone: "9014224408",
    phoneDisplay: "+91 90142 24408",
    email: "mahesh@satyasri.com",
    website: "www.satyasri.com",
    whatsapp: "https://wa.me/919014224408",
    facebook: "https://www.facebook.com/SatyasriRealtors/",
    instagram: "https://www.instagram.com/satyasrirealtors",
    // TODO: Verify this Google Maps link destination with the client
    googleMaps: "https://share.google/kObWcG3sxgp4qUhuI",
    consultant: "Mahesh Kumar",
  },
  address: {
    line1: "Aditya Heights, Near Hi-Tech City,",
    line2: "Opp. Botanical Gardens, White Fields, Kondapur,",
    city: "Hyderabad",
    state: "Telangana",
    pin: "500084",
    country: "India",
    // NOTE: Confirm with client if this is the registered office address
    // or if it is only the Kondapur property listing address.
    full: "Aditya Heights, Near Hi-Tech City, Opp. Botanical Gardens, White Fields, Kondapur, Hyderabad – 500084, Telangana, India",
  },
} as const;
