// src/data/shippingPartners.ts

export interface ShippingPartner {
  name: string;
  logoUrl: string;
  website: string;
}

export const shippingPartners: ShippingPartner[] = [
  {
    name: "Oscar Giovanni Salon & Spa",
    logoUrl: "/images/Oscar_Giovanni_Salon.jpg",
    website: "https://oscargiovannisalon.com/",
  },
  {
    name: "Pub Frato",
    logoUrl: "/images/Pub-Frato.jpg",
    website: "https://pubfrato.com/concord/",
  },
  {
    name: "Sunny Street Cafe",
    logoUrl: "/images/sunny_street.jpg",
    website: "https://sunnystreetconcord.hrpos.heartland.us/menu",
  },
  {
    name: "First Federal Lakewood - Concord",
    logoUrl: "/images/first-federal-lakewood.jpg",
    website: "https://www.ffl.bank/",
  },
  {
    name: "Sophia Boutique",
    logoUrl: "/images/sophia_boutique.webp",
    website: "https://www.sophia.boutique/",
  },
  // Add more partners as needed
];