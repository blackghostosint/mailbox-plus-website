import { Service } from "../types/services";

export const serviceAreas: Service[] = [
  {
    id: "concord-township",
    slug: "concord-township",
    pageTitle: "Shipping & Printing in Concord Township, Ohio",
    metaDescription:
      "Mailbox Plus proudly serves Concord Township with reliable shipping, printing, mailbox rentals, and business services.",
    keywords: ["Concord Township shipping", "Concord Township printing", "business services"],
    heroTitle: "Serving Concord Township",
    heroSubtitle: "Your local shipping, printing & business service experts.",
    heroImage: "/images/concord-township-hero.jpg",
    content: [
      {
        heading: "Trusted by Concord Township",
        text: "From families to small businesses, Concord Township residents rely on Mailbox Plus for secure shipping, custom packaging, printing, and more."
      }
    ],
    features: [
      { title: "Convenient Location", description: "Next to Pub Frato in Gristmill Village" },
      { title: "Full Carrier Access", description: "UPS, FedEx, USPS, and DHL available" }
    ],
    faqs: [] // you could even reuse generalShippingFaqs if you want
  },
  {
    id: "mentor",
    slug: "mentor",
    pageTitle: "Shipping & Printing in Mentor, Ohio",
    metaDescription:
      "Mailbox Plus offers professional shipping, printing, and mailbox services to the Mentor community.",
    keywords: ["Mentor shipping", "Mentor printing", "business services"],
    heroTitle: "Serving Mentor",
    heroSubtitle: "Your trusted partner for shipping & business services.",
    heroImage: "/images/mentor-hero.jpg",
    content: [
      {
        heading: "Helping Mentor Businesses Grow",
        text: "From Every Door Direct Mail campaigns to bulk shipping discounts, Mailbox Plus supports Mentor businesses and residents alike."
      }
    ],
    features: [
      { title: "Local Expertise", description: "Deep roots in Lake County since 2010" }
    ],
    faqs: []
  }
];
