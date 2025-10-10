// src/data/shippingPartners.ts

export interface ShippingPartner {
  name: string;
  logoUrl: string;
  website: string;
}

export const shippingPartners: ShippingPartner[] = [
  {
    name: "Acme Packaging Solutions",
    logoUrl: "/images/partners/acme.png",
    website: "https://www.acmepackaging.com",
  },
  {
    name: "Bluebird Crafts",
    logoUrl: "/images/partners/bluebird.png",
    website: "https://www.bluebirdcrafts.com",
  },
  {
    name: "Hudson Outdoor Gear",
    logoUrl: "/images/partners/hudson.png",
    website: "https://www.hudsonoutdoor.com",
  },
  // Add more partners as needed
];