// src/data/shippingPartners.ts
import { getServiceImageUrl } from "../lib/supabase";

export interface ShippingPartner {
  name: string;
  logoUrl: string;
  website: string;
}

export const shippingPartners: ShippingPartner[] = [
  {
    name: "Oscar Giovanni Salon & Spa",
    logoUrl: getServiceImageUrl("/images/Oscar_Giovanni_Salon.webp"),
    website: "https://oscargiovannisalon.com/",
  },
  {
    name: "Pub Frato",
    logoUrl: getServiceImageUrl("/images/Pub-Frato.webp"),
    website: "https://pubfrato.com/concord/",
  },
  {
    name: "Sunny Street Cafe",
    logoUrl: getServiceImageUrl("/images/sunny_street.webp"),
    website: "https://sunnystreetconcord.hrpos.heartland.us/menu",
  },
  {
    name: "First Federal Lakewood - Concord",
    logoUrl: getServiceImageUrl("/images/first-federal-lakewood.webp"),
    website: "https://www.ffl.bank/",
  },
  {
    name: "Sophia Boutique",
    logoUrl: getServiceImageUrl("/images/sophia_boutique.webp"),
    website: "https://www.sophia.boutique/",
  },
  // Add more partners as needed
];
