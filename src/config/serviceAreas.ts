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
  keywords:
    "Mentor shipping, Mentor printing, business services, UPS shipping Mentor, FedEx Mentor, DHL Mentor, mailbox rentals Mentor, Headlands Beach shipping, Great Lakes Mall business printing",
  heroTitle: "Serving Mentor",
  heroSubtitle: "Your trusted partner for shipping & business services.",
  heroImage: getServiceImageUrl("/images/mentor.jpg"),
  content: [
    {
      heading: "Helping Mentor Businesses Grow",
      body: "From Every Door Direct Mail campaigns to bulk shipping discounts, Mailbox Plus supports Mentor businesses and residents alike."
    },
    {
      heading: "Proudly Serving Mentor, Ohio",
      body: "Nestled along the shores of Lake Erie, Mentor is a city where heritage meets growth — and Mailbox Plus is proud to serve its residents and small-business community. Once known as the 'Rose Capital of the Nation' for its flourishing nurseries, Mentor has grown into a thriving retail and business hub anchored by Mentor Avenue, the Great Lakes Mall, and a vibrant network of local entrepreneurs."
    },
    {
      heading: "A City with Rich History & Natural Beauty",
      body: "Founded in 1797 as part of the Connecticut Western Reserve, Mentor is home to the James A. Garfield National Historic Site, the preserved home of America’s 20th President. From the peaceful trails of Mentor Marsh to the sandy stretch of Headlands Beach State Park, this city balances natural beauty with economic vitality — and we’re honored to support its momentum."
    },
    {
      heading: "Your Local Shipping & Printing Partner",
      body: "At Mailbox Plus, we help Mentor businesses and families ship, print, and connect with confidence. Whether you’re sending packages through UPS, FedEx, USPS, or DHL, designing marketing materials, or managing professional documents, our team delivers hometown service with national reach. From neighborhoods near Hopkins Road to lakeside homes by Headlands, we make it easy to pack, print, and post — all in one stop."
    }
  ],
  features: [
    { title: "Local Expertise", description: "Deep roots in Lake County since 2010" },
    { title: "Full Carrier Access", description: "UPS, FedEx, USPS & DHL — all in one place" },
    { title: "Community Focused", description: "Proudly serving Mentor’s growing business community" }
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
    "Mailbox Plus proudly serves Painesville, Ohio, with expert shipping, printing, and mailbox rental services. From courthouse professionals to Lake Erie families, we deliver trusted business solutions rooted in local care.",
  keywords:
    "Painesville shipping, Painesville printing, mailbox rentals Painesville, UPS Painesville, FedEx Painesville, DHL Painesville, Lake County business services, downtown Painesville shipping, Lake Erie printing",
  heroTitle: "Serving Painesville",
  heroSubtitle: "Reliable shipping and printing solutions for the Painesville community.",
  heroImage: getServiceImageUrl("/images/painesville.jpg"),
  content: [
    {
      heading: "Supporting Painesville's Needs",
      body: "From golf club shipping to document services, Mailbox Plus is your go-to for all shipping and business needs in Painesville."
    },
    {
      heading: "Proudly Serving Historic Painesville, Ohio",
      body: "Founded in 1805 along the banks of the Grand River, Painesville has long served as the civic and cultural heart of Lake County. As the county seat, it’s home to the historic Lake County Courthouse Square and some of Ohio’s finest examples of early architecture and community planning."
    },
    {
      heading: "A Community with Character & Connection",
      body: "Painesville’s charm lies in its mix of history and progress — from the stately homes along Washington Street to the growing retail and industrial parks near Richmond Street. The city is also home to Lake Erie College, one of Ohio’s oldest independent institutions, which continues to anchor education and innovation in the region."
    },
    {
      heading: "Your Local Shipping & Printing Partner",
      body: "At Mailbox Plus, we help Painesville residents and businesses ship, print, and connect with confidence. Whether you’re sending parcels through UPS, FedEx, USPS, or DHL, producing marketing materials, or managing sensitive legal documents, our team offers personal service with professional precision — all from our nearby Concord Township location."
    }
  ],
  features: [
    { title: "Community Focused", description: "Serving Lake County since 2010" },
    { title: "All Major Carriers", description: "UPS, FedEx, USPS & DHL access in one stop" },
    { title: "Trusted by Local Professionals", description: "Supporting Lake County offices, schools, and small businesses" }
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
    "Mailbox Plus proudly serves Eastlake, Ohio with dependable shipping, printing, and mailbox services. From small businesses to Lake Erie homeowners, we deliver fast, friendly solutions you can trust.",
  keywords:
    "Eastlake shipping, Eastlake printing, mailbox rentals Eastlake, UPS Eastlake, FedEx Eastlake, DHL Eastlake, Lake County business services, Chagrin River shipping, Lake Erie printing",
  heroTitle: "Serving Eastlake",
  heroSubtitle: "Your local experts in shipping and business services.",
  heroImage: getServiceImageUrl("/images/eastlake.jpg"),
  content: [
    {
      heading: "Eastlake's Trusted Partner",
      body: "Eastlake families and businesses trust Mailbox Plus for secure shipping, professional printing, and reliable mailbox rentals."
    },
    {
      heading: "Serving Eastlake, Ohio — Where the River Meets the Lake",
      body: "Located along the mouth of the Chagrin River, Eastlake is a community deeply connected to its Lake Erie shoreline and hardworking roots. Incorporated in 1948, Eastlake grew from a quiet lakeside neighborhood into a vibrant city known for its parks, marinas, and family-friendly atmosphere."
    },
    {
      heading: "A Community of Innovation and Spirit",
      body: "Eastlake is home to iconic local landmarks like Classic Park — home of the Lake County Captains baseball team — and a rich industrial history tied to the Cleveland Electric Illuminating Company’s Eastlake Power Plant. Today, the city continues to thrive with growing residential areas, thriving small businesses, and easy access to Cleveland via Route 2 and I-90."
    },
    {
      heading: "Your Local Shipping & Printing Partner",
      body: "At Mailbox Plus, we help Eastlake residents and business owners ship, print, and connect with confidence. From packing artwork or golf clubs to designing flyers, postcards, and banners, our team combines local service with national carrier access — including UPS, FedEx, USPS, and DHL. Just a short drive from Eastlake, we’re proud to serve our Lake County neighbors with the care they deserve."
    }
  ],
  features: [
    { title: "Convenient Access", description: "Easy access from Eastlake to our Concord Township location" },
    { title: "Full Carrier Options", description: "UPS, FedEx, USPS & DHL available for all your shipping needs" },
    { title: "Community Focused", description: "Supporting Lake County’s local families and small businesses since 2010" }
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
    "Mailbox Plus proudly supports Willoughby, Ohio with expert shipping, custom packaging, printing, and mailbox rentals. From historic downtown to busy business corridors, we deliver trusted, local solutions.",
  keywords:
    "Willoughby shipping, Willoughby printing, mailbox rentals Willoughby, UPS Willoughby, FedEx Willoughby, DHL Willoughby, Lake County business services, downtown Willoughby shipping, Erie Street printing",
  heroTitle: "Serving Willoughby",
  heroSubtitle: "Professional services tailored to Willoughby residents.",
  heroImage: getServiceImageUrl("/images/willoughby.jpg"),
  content: [
    {
      heading: "Willoughby Business Support",
      body: "From bulk mailings to secure shipping, Mailbox Plus helps Willoughby businesses thrive with our comprehensive service offerings."
    },
    {
      heading: "Proudly Serving Historic Willoughby, Ohio",
      body: "Founded in 1798, Willoughby is one of the oldest communities in Lake County and the only city in the United States to have belonged to six different counties over its history. Its charming downtown — centered on Erie Street — is home to locally owned restaurants, boutiques, and professional offices that reflect the city’s strong community pride."
    },
    {
      heading: "Where History and Modern Business Meet",
      body: "Once a key stop along the stagecoach route between Cleveland and the Western Reserve, Willoughby has evolved into a thriving hub for both families and entrepreneurs. With easy access to major highways, excellent schools, and a vibrant arts scene, it remains one of Northeast Ohio’s most desirable places to live and do business."
    },
    {
      heading: "Your Local Shipping & Printing Partner",
      body: "At Mailbox Plus, we’re proud to serve Willoughby residents and businesses with full-service shipping, printing, and mailbox solutions. Whether you need UPS, FedEx, USPS, or DHL shipping, marketing materials for your Erie Street storefront, or professional document services, our team delivers the convenience and care you expect from a trusted local partner."
    }
  ],
  features: [
    { title: "Local Knowledge", description: "Understanding Willoughby's unique needs" },
    { title: "Full Carrier Access", description: "UPS, FedEx, USPS & DHL in one place" },
    { title: "Community Commitment", description: "Proudly serving Lake County since 2010" }
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
    "Mailbox Plus proudly serves Wickliffe, Ohio, with professional shipping, printing, and mailbox services. From local businesses to Lake County families, we deliver friendly, reliable solutions built on community trust.",
  keywords:
    "Wickliffe shipping, Wickliffe printing, mailbox rentals Wickliffe, UPS Wickliffe, FedEx Wickliffe, DHL Wickliffe, Lake County business services, Worden Road shipping, Lakeland Boulevard printing",
  heroTitle: "Serving Wickliffe",
  heroSubtitle: "Your neighborhood shipping and printing experts.",
  heroImage: getServiceImageUrl("/images/wickliffe.jpg"),
  content: [
    {
      heading: "Wickliffe Community Services",
      body: "Wickliffe residents rely on Mailbox Plus for everything from package shipping to business card printing."
    },
    {
      heading: "Serving Wickliffe, Ohio — A City with Proud Roots",
      body: "Situated along the western edge of Lake County, Wickliffe is a close-knit community known for its strong neighborhoods, excellent schools, and convenient access to Cleveland’s east side. Originally part of the early settlements of the Western Reserve, Wickliffe grew rapidly in the mid-20th century as families sought a suburban lifestyle near Lake Erie."
    },
    {
      heading: "A Community of Tradition and Growth",
      body: "Wickliffe is home to historic landmarks like the **Tudor-style Coulby Mansion**, now serving as City Hall, and the **Our Lady of Mount Carmel Festival**, one of Northeast Ohio’s oldest Italian community celebrations. With beautiful parks, vibrant schools, and a growing business corridor along Euclid Avenue and Lakeland Boulevard, Wickliffe continues to thrive as a welcoming Lake County destination."
    },
    {
      heading: "Your Local Shipping & Printing Partner",
      body: "At Mailbox Plus, we’re proud to serve Wickliffe’s residents, students, and small-business owners with complete shipping and printing solutions. Whether you need UPS, FedEx, USPS, or DHL shipping, custom packaging, marketing materials, or professional document printing, our nearby Concord Township location makes it easy to get expert service close to home."
    }
  ],
  features: [
    { title: "Personalized Service", description: "Tailored solutions for Wickliffe customers" },
    { title: "Full Carrier Access", description: "UPS, FedEx, USPS & DHL all in one stop" },
    { title: "Rooted in Community", description: "Proudly serving Lake County since 2010" }
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
