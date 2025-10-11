import { Service } from "../types/services";
import { getServiceImageUrl } from "../lib/supabase";

export const serviceAreas: Service[] = [
  {
id: "concord-township",
  category: "core",
  serviceName: "Concord Township Services",
  slug: "concord-township",
  city: "Concord Township",
  pageTitle: "Shipping & Printing in Concord Township, Ohio",
  metaDescription:
    "Mailbox Plus proudly serves Concord Township with expert shipping, custom packaging, printing, and mailbox rentals—all in one convenient location.",
  keywords: "Concord Township shipping, Concord Township printing, business services",
  heroTitle: "Serving Concord Township",
  heroSubtitle: "Your local shipping, printing & business service experts.",
  heroImage: getServiceImageUrl("/images/concord-township.jpg"),
  content: [
    {
      heading: "Trusted by Concord Township",
      body: "From families to small businesses, Concord Township residents rely on Mailbox Plus for secure shipping, custom packaging, printing, and more."
    },
    {
      heading: "A Community with Deep Roots",
      body: "Rooted in the history of the Connecticut Western Reserve, Concord Township was officially established in 1822 and named in honor of the famed Revolutionary War battle. From its early days as a frontier settlement with an agrarian economy, the township grew and played a part in national history, with local landmarks like its 1798 tavern serving as a vital stop on the Underground Railroad. The development of major transportation routes in the 20th century transformed the landscape, shifting Concord from a quiet farming community into the thriving, modern residential hub it is today. Now a key part of Lake County, Concord Township proudly balances its rich heritage with continued growth and development."
    }
  ],
  features: [
    { title: "Convenient Location", description: "Next to Pub Frato in Gristmill Village" },
    { title: "Full Carrier Access", description: "UPS, FedEx, USPS, and DHL available" }
  ],
    faqs: []
  },
  {
    id: "mentor",
    category: "core",
    serviceName: "Mentor Services",
    slug: "mentor",
    city: "Mentor",
    pageTitle: "Shipping & Printing in Mentor, Ohio",
    metaDescription:
      "From bulk mailings to secure package shipping, Mailbox Plus supports Mentor residents and businesses with reliable shipping, printing, and mailbox services.",
    keywords: "Mentor shipping, Mentor printing, business services",
    heroTitle: "Serving Mentor",
    heroSubtitle: "Your trusted partner for shipping & business services.",
    heroImage: getServiceImageUrl("/images/mentor.jpg"),
    content: [
      {
        heading: "Helping Mentor Businesses Grow",
        body: "From Every Door Direct Mail campaigns to bulk shipping discounts, Mailbox Plus supports Mentor businesses and residents alike."
      }
    ],
    features: [
      { title: "Local Expertise", description: "Deep roots in Lake County since 2010" }
    ],
    faqs: []
  },
  {
    id: "painesville",
    category: "core",
    serviceName: "Painesville Services",
    slug: "painesville",
    city: "Painesville",
    pageTitle: "Shipping & Printing in Painesville, Ohio",
    metaDescription:
      "Mailbox Plus provides Painesville with trusted shipping, printing, mailbox rentals, and business services designed for families and local companies.",
    keywords: "Painesville shipping, Painesville printing, business services",
    heroTitle: "Serving Painesville",
    heroSubtitle: "Reliable shipping and printing solutions for the Painesville community.",
    heroImage: getServiceImageUrl("/images/painesville.jpg"),
    content: [
      {
        heading: "Supporting Painesville's Needs",
        body: "From golf club shipping to document services, Mailbox Plus is your go-to for all shipping and business needs in Painesville."
      }
    ],
    features: [
      { title: "Community Focused", description: "Serving Lake County since 2010" }
    ],
    faqs: []
  },
  {
    id: "eastlake",
    category: "core",
    serviceName: "Eastlake Services",
    slug: "eastlake",
    city: "Eastlake",
    pageTitle: "Shipping & Printing in Eastlake, Ohio",
    metaDescription:
      "Eastlake residents count on Mailbox Plus for affordable shipping, custom boxes, printing, and mailbox solutions—backed by fast, friendly service.",
    keywords: "Eastlake shipping, Eastlake printing, business services",
    heroTitle: "Serving Eastlake",
    heroSubtitle: "Your local experts in shipping and business services.",
    heroImage: getServiceImageUrl("/images/eastlake.jpg"),
    content: [
      {
        heading: "Eastlake's Trusted Partner",
        body: "Eastlake families and businesses trust Mailbox Plus for secure shipping, professional printing, and reliable mailbox rentals."
      }
    ],
    features: [
      { title: "Convenient Access", description: "Easy access from Eastlake to our Concord Township location" }
    ],
    faqs: []
  },
  {
    id: "willoughby",
    category: "core",
    serviceName: "Willoughby Services",
    slug: "willoughby",
    city: "Willoughby",
    pageTitle: "Shipping & Printing in Willoughby, Ohio",
    metaDescription:
      "Mailbox Plus proudly supports Willoughby with secure shipping, professional packaging, document printing, and mailbox rental services.",
    keywords: "Willoughby shipping, Willoughby printing, business services",
    heroTitle: "Serving Willoughby",
    heroSubtitle: "Professional services tailored to Willoughby residents.",
    heroImage: getServiceImageUrl("/images/willoughby.jpg"),
    content: [
      {
        heading: "Willoughby Business Support",
        body: "From bulk mailings to secure shipping, Mailbox Plus helps Willoughby businesses thrive with our comprehensive service offerings."
      }
    ],
    features: [
      { title: "Local Knowledge", description: "Understanding Willoughby's unique needs" }
    ],
    faqs: []
  },
  {
    id: "wickliffe",
    category: "core",
    serviceName: "Wickliffe Services",
    slug: "wickliffe",
    city: "Wickliffe",
    pageTitle: "Shipping & Printing in Wickliffe, Ohio",
    metaDescription:
      "From shipping and printing to mailbox rentals, Mailbox Plus serves Wickliffe families and businesses with professional, community-focused service.",
    keywords: "Wickliffe shipping, Wickliffe printing, business services",
    heroTitle: "Serving Wickliffe",
    heroSubtitle: "Your neighborhood shipping and printing experts.",
    heroImage: getServiceImageUrl("/images/wickliffe.jpg"),
    content: [
      {
        heading: "Wickliffe Community Services",
        body: "Wickliffe residents rely on Mailbox Plus for everything from package shipping to business card printing."
      }
    ],
    features: [
      { title: "Personalized Service", description: "Tailored solutions for Wickliffe customers" }
    ],
    faqs: []
  },
  {
    id: "madison",
    category: "core",
    serviceName: "Madison Services",
    slug: "madison",
    city: "Madison",
    pageTitle: "Shipping & Printing in Madison, Ohio",
    metaDescription:
      "Mailbox Plus is Madison’s trusted resource for shipping, packaging, printing, and mailbox services—delivered with speed and reliability.",
    keywords: "Madison shipping, Madison printing, business services",
    heroTitle: "Serving Madison",
    heroSubtitle: "Comprehensive shipping and business services for Madison.",
    heroImage: getServiceImageUrl("/images/madison.jpg"),
    content: [
      {
        heading: "Madison's Shipping Experts",
        body: "Madison businesses and families choose Mailbox Plus for reliable shipping, printing, and mailbox rental services."
      }
    ],
    features: [
      { title: "Quality Assurance", description: "Insured and secure handling for all shipments" }
    ],
    faqs: []
  },
  {
    id: "perry",
    category: "core",
    serviceName: "Perry Services",
    slug: "perry",
    city: "Perry",
    pageTitle: "Shipping & Printing in Perry, Ohio",
    metaDescription:
      "From small parcels to business mailings, Mailbox Plus serves Perry with dependable shipping, custom packaging, printing, and business support.",
    keywords: "Perry shipping, Perry printing, business services",
    heroTitle: "Serving Perry",
    heroSubtitle: "Your local partner for shipping and printing needs.",
    heroImage: getServiceImageUrl("/images/perry.jpg"),
    content: [
      {
        heading: "Perry Community Support",
        body: "From Perry's small businesses to individual shippers, Mailbox Plus provides the services you need with a personal touch."
      }
    ],
    features: [
      { title: "Community Commitment", description: "Dedicated to serving Lake County communities" }
    ],
    faqs: []
  },
  {
    id: "kirtland",
    category: "core",
    serviceName: "Kirtland Services",
    slug: "kirtland",
    city: "Kirtland",
    pageTitle: "Shipping & Printing in Kirtland, Ohio",
    metaDescription:
      "Mailbox Plus provides Kirtland residents and businesses with reliable shipping, printing, and mailbox services backed by local community commitment.",
    keywords: "Kirtland shipping, Kirtland printing, business services",
    heroTitle: "Serving Kirtland",
    heroSubtitle: "Your local partner for shipping and printing needs.",
    heroImage: getServiceImageUrl("/images/kirtland.webp"),
    content: [
      {
        heading: "Kirtland Community Support",
        body: "From Kirtland's small businesses to individual shippers, Mailbox Plus provides the services you need with a personal touch."
      }
    ],
    features: [
      { title: "Community Commitment", description: "Dedicated to serving Lake County communities" }
    ],
    faqs: []
  },
  {
    id: "chardon",
    category: "core",
    serviceName: "Chardon Services",
    slug: "chardon",
    city: "Chardon",
    pageTitle: "Shipping & Printing in Chardon, Ohio",
    metaDescription:
      "From families to small businesses, Mailbox Plus helps Chardon with professional shipping, printing, packaging, and mailbox rental services.",
    keywords: "Chardon shipping, Chardon printing, business services",
    heroTitle: "Serving Chardon",
    heroSubtitle: "Comprehensive shipping and business services for Chardon.",
    heroImage: getServiceImageUrl("/images/chardon.jpg"),
    content: [
      {
        heading: "Chardon's Shipping Experts",
        body: "Chardon businesses and families choose Mailbox Plus for reliable shipping, printing, and mailbox rental services."
      }
    ],
    features: [
      { title: "Quality Assurance", description: "Insured and secure handling for all shipments" }
    ],
    faqs: []
  },
  {
    id: "fairport-harbor",
    category: "core",
    serviceName: "Fairport Harbor Services",
    slug: "fairport-harbor",
    city: "Fairport Harbor",
    pageTitle: "Shipping & Printing in Fairport Harbor, Ohio",
    metaDescription:
      "Fairport Harbor residents trust Mailbox Plus for reliable shipping, printing, mailbox rentals, and custom packaging solutions tailored to their needs.",
    keywords: "Fairport Harbor shipping, Fairport Harbor printing, business services",
    heroTitle: "Serving Fairport Harbor",
    heroSubtitle: "Your neighborhood shipping and printing experts.",
    heroImage: getServiceImageUrl("/images/Fairport_Harbor.jpg"),
    content: [
      {
        heading: "Fairport Harbor Community Services",
        body: "Fairport Harbor residents rely on Mailbox Plus for everything from package shipping to business card printing."
      }
    ],
    features: [
      { title: "Personalized Service", description: "Tailored solutions for Fairport Harbor customers" }
    ],
    faqs: []
  },
  {
    id: "geneva",
    category: "core",
    serviceName: "Geneva Services",
    slug: "geneva",
    city: "Geneva",
    pageTitle: "Shipping & Printing in Geneva, Ohio",
    metaDescription:
      "Mailbox Plus proudly serves Geneva with professional shipping, printing, and mailbox services—supporting local families and businesses every day.",
    keywords: "Geneva shipping, Geneva printing, business services",
    heroTitle: "Serving Geneva",
    heroSubtitle: "Professional services tailored to Geneva residents.",
    heroImage: getServiceImageUrl("/images/Geneva_Ohio.jpg"),
    content: [
      {
        heading: "Geneva Business Support",
        body: "From bulk mailings to secure shipping, Mailbox Plus helps Geneva businesses thrive with our comprehensive service offerings."
      }
    ],
    features: [
      { title: "Local Knowledge", description: "Understanding Geneva's unique needs" }
    ],
    faqs: []
  }
];
