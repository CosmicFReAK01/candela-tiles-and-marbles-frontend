import { ENV } from "./env";

/**
 * Global Site & Brand Configuration
 */
export const SITE_CONFIG = {
  name: "Candela Tiles & Marbles",
  shortName: "Candela",
  tagline: "Master Architectural Surfaces & Luxury Fixtures",
  description:
    "Curators of ultra-luxury Italian marble slabs, architectural porcelain, master bathroom suites, and precision culinary surfaces in Mumbai & Navi Mumbai.",
  url: ENV.SITE_URL,
  phone: ENV.CONCIERGE_PHONE,
  whatsapp: ENV.WHATSAPP_NUMBER,
  email: ENV.CONCIERGE_EMAIL,
  currency: {
    code: "INR",
    symbol: "₹",
    locale: "en-IN",
  },
  showrooms: [
    {
      name: "Navi Mumbai Experience Centre",
      address: "Plot 14, MIDC Industrial Area, Turbhe, Navi Mumbai — 400705",
      phone: "+91 98200 11223",
      timing: "Mon – Sat: 10:00 AM – 8:00 PM",
      mapUrl: "https://maps.google.com",
    },
    {
      name: "Bhiwandi Master Slab Yard & Logistics Hub",
      address: "Warehouse Complex Bay A2, Mankoli Naka, Bhiwandi — 421302",
      phone: "+91 98200 33445",
      timing: "Mon – Sat: 9:00 AM – 7:00 PM",
      mapUrl: "https://maps.google.com",
    },
  ],
  socials: {
    instagram: "https://instagram.com/candelatiles",
    linkedin: "https://linkedin.com/company/candelatiles",
    pinterest: "https://pinterest.com/candelatiles",
  },
} as const;
