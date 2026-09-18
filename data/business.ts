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
    // TODO(confirm-phone): Client brief mentions 9014202020. Confirm which to use.
    phone: "9014224408",
    phoneDisplay: "+91 90142 24408",
    email: "mahesh@satyasri.com",
    website: "www.satyasri.com",
    whatsapp: "https://wa.me/919014224408",
    facebook: "https://www.facebook.com/SatyasriRealtors/",
    instagram: "https://www.instagram.com/satyasrirealtors",
    // TODO(add-gbp-place-link): Client needs to share exact Google Maps place link
    googleMaps: "https://www.google.com/maps/search/?api=1&query=House+No.+1-57/384,+A+Block,+Kondapur,+Sri+Ram+Nagar,+Serilingampalle,+Hyderabad,+Telangana+500084",
    consultant: "Mahesh Kumar Aerwa",
  },
  address: {
    line1: "House No. 1-57/384, A Block,",
    line2: "Kondapur, Sri Ram Nagar, Serilingampalle (Mandal),",
    city: "Hyderabad",
    state: "Telangana",
    pin: "500084",
    country: "India",
    full: "House No. 1-57/384, A Block, Kondapur, Sri Ram Nagar, Serilingampalle (Mandal), Hyderabad, Telangana 500084",
  },
} as const;
