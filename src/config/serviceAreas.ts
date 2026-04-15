import { Service } from "../types/services";
import { getServiceImageUrl } from "../lib/storage";

export const serviceAreas: Service[] = [
  {
    id: "concord-township",
    category: "core",
    serviceName: "Concord Township Services",
    slug: "concord-township",
    canonicalUrl: "/service-area/concord-township",
    priorityServices: ["pack-ship", "mailbox-rental", "fedex-shipping"],
    city: "Concord Township",
    pageTitle: "Shipping & Printing in Concord Township, Ohio",
    metaDescription:
      "Mailbox Plus proudly serves Concord Township, Ohio, with expert shipping, custom packaging, printing, and mailbox rentals—all in one convenient location. Trusted by local families and small businesses since 2024.",
    keywords:
      "Concord Township shipping, Concord Township printing, mailbox rentals Concord Township, UPS Concord Township, FedEx Concord Township, DHL Concord Township, Lake County business services, Gristmill Village shipping, Concord printing",
    heroTitle: "Serving Concord Township",
    heroSubtitle: "Your local shipping, printing & business service experts.",
    heroImage: getServiceImageUrl("/images/concord-township.webp"),
    content: [
      {
        heading: "Your Go-To Shipping Center in Concord Township",
        body: "Mailbox Plus is proud to be a cornerstone of the Concord Township community, offering a reliable and friendly hub for all your shipping, printing, and business needs. Located in the heart of the township, we are dedicated to providing exceptional service to our neighbors with the convenience and care you deserve."
      },
      {
        heading: "Trusted by Concord Township",
        body: "From families to small businesses, Concord Township residents rely on Mailbox Plus for secure shipping, custom packaging, printing, and more. Whether you’re sending important documents, creating custom marketing materials, or managing day-to-day business mail, our team makes it easy and reliable."
      },
      {
        heading: "Serving Concord Township, Ohio — A Community with Deep Roots",
        body: "Rooted in the history of the Connecticut Western Reserve, Concord Township was officially established in 1822 and named in honor of the famed Revolutionary War battle. From its early days as a frontier farming settlement, the township played a role in national history—its 1798 tavern once serving as a stop on the Underground Railroad. As transportation routes developed through the 20th century, Concord evolved from quiet farmland into a thriving residential and commercial hub."
      },
      {
        heading: "Where Heritage Meets Growth",
        body: "Today, Concord Township stands as one of Lake County’s fastest-growing communities, balancing small-town charm with modern amenities. The township’s scenic parks, strong schools, and close-knit neighborhoods make it an ideal place to live and work. With Gristmill Village and nearby Mentor Avenue serving as local business anchors, Concord continues to flourish as both a community and a commerce destination."
      },
      {
        heading: "Your Local Shipping & Printing Partner",
        body: "At Mailbox Plus, we’re proud to support Concord Township with professional shipping, printing, and business solutions. Whether you’re sending packages through UPS, FedEx, USPS, or DHL, designing marketing materials, or renting a secure mailbox, our Gristmill Village location—next to Pub Frato—makes it simple to get expert service close to home."
      }
    ],
    features: [
      { title: "Convenient Location", description: "Next to Pub Frato in Gristmill Village" },
      { title: "Full Carrier Access", description: "UPS, FedEx, USPS & DHL — all under one roof" },
      { title: "Community Focused", description: "Proudly serving Concord Township and Lake County since 2024" }
    ],
    faqs: [
      {
        id: "faq-concord-1",
        question: "Do you offer package pickup in Concord Township?",
        answer: "Yes, we offer package pickup for all major carriers, including UPS, FedEx, DHL, and USPS, right here in Concord Township.",
        isFeatured: true
      },
      {
        id: "faq-concord-2",
        question: "How far are you from Concord Township center?",
        answer: "We are conveniently located in Gristmill Village, just a short drive from the center of Concord Township, making it easy to drop off packages or use our services."
      }
    ]
  },
  {
    id: "mentor",
    category: "core",
    serviceName: "Mentor Services",
    slug: "mentor",
    canonicalUrl: "/service-area/mentor",
    priorityServices: ["pack-ship", "business-cards", "digital-fingerprinting"],
    city: "Mentor",
    pageTitle: "Shipping & Printing in Mentor, Ohio",
    metaDescription:
      "From bulk mailings to secure package shipping, Mailbox Plus supports Mentor residents and businesses with reliable shipping, printing, and mailbox services.",
    keywords:
      "Mentor shipping, Mentor printing, business services, UPS shipping Mentor, FedEx Mentor, DHL Mentor, mailbox rentals Mentor, Headlands Beach shipping, Great Lakes Mall business printing",
    heroTitle: "Serving Mentor",
    heroSubtitle: "Your trusted partner for shipping & business services.",
    heroImage: getServiceImageUrl("/images/mentor.webp"),
    content: [
      {
        heading: "Serving the Vibrant City of Mentor",
        body: "As a bustling hub of commerce and community, Mentor deserves a shipping and printing partner that can keep up. Mailbox Plus is committed to supporting Mentor's residents and businesses with top-tier services, from custom printing projects to international shipping, all with a local touch."
      },
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
      { title: "Local Expertise", description: "Deep roots in Lake County since 2024" },
      { title: "Full Carrier Access", description: "UPS, FedEx, USPS & DHL — all in one place" },
      { title: "Community Focused", description: "Proudly serving Mentor’s growing business community" }
    ],
    faqs: [
      {
        id: "faq-mentor-1",
        question: "Can I get documents notarized at your location near Mentor?",
        answer: "Absolutely! We offer convenient notary services for Mentor residents. Stop by during our business hours, and we'll be happy to assist you with your legal and official documents.",
        isFeatured: true
      },
      {
        id: "faq-mentor-2",
        question: "What are your hours for customers coming from Mentor?",
        answer: "We are open Monday through Saturday. Our extended hours are designed to accommodate the busy schedules of our Mentor customers, whether you're coming from work or home."
      }
    ]
  },
  {
    id: "painesville",
    category: "core",
    serviceName: "Painesville Services",
    slug: "painesville",
    canonicalUrl: "/service-area/painesville",
    priorityServices: ["pack-ship", "document-printing", "notary-services"],
    city: "Painesville",
    pageTitle: "Shipping & Printing in Painesville, Ohio",
    metaDescription:
      "Mailbox Plus proudly serves Painesville, Ohio, with expert shipping, printing, and mailbox rental services. From courthouse professionals to Lake Erie families, we deliver trusted business solutions rooted in local care.",
    keywords:
      "Painesville shipping, Painesville printing, mailbox rentals Painesville, UPS Painesville, FedEx Painesville, DHL Painesville, Lake County business services, downtown Painesville shipping, Lake Erie printing",
    heroTitle: "Serving Painesville",
    heroSubtitle: "Reliable shipping and printing solutions for the Painesville community.",
    heroImage: getServiceImageUrl("/images/painesville.webp"),
    content: [
      {
        heading: "Your Trusted Partner in Historic Painesville",
        body: "In a city as rich in history and community as Painesville, Mailbox Plus is honored to provide modern shipping and business solutions. We cater to the needs of Painesville's diverse community, from college students to legal professionals, with a commitment to excellence."
      },
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
      { title: "Community Focused", description: "Serving Lake County since 2024" },
      { title: "All Major Carriers", description: "UPS, FedEx, USPS & DHL access in one stop" },
      { title: "Trusted by Local Professionals", description: "Supporting Lake County offices, schools, and small businesses" }
    ],
    faqs: [
      {
        id: "faq-painesville-1",
        question: "Do you handle student shipping for Lake Erie College in Painesville?",
        answer: "Yes, we are a popular choice for Lake Erie College students who need to ship belongings, textbooks, and care packages. We offer packing supplies and expert advice to ensure your items arrive safely.",
        isFeatured: true
      },
      {
        id: "faq-painesville-2",
        question: "Is your location far from downtown Painesville?",
        answer: "Not at all! We are just a short and convenient drive from downtown Painesville, making it easy for you to access our full range of services without the hassle."
      }
    ]
  },
  {
    id: "eastlake",
    category: "core",
    serviceName: "Eastlake Services",
    slug: "eastlake",
    canonicalUrl: "/service-area/eastlake",
    priorityServices: ["pack-ship", "mailbox-rental"],
    city: "Eastlake",
    pageTitle: "Shipping & Printing in Eastlake, Ohio",
    metaDescription:
      "Mailbox Plus proudly serves Eastlake, Ohio with dependable shipping, printing, and mailbox services. From small businesses to Lake Erie homeowners, we deliver fast, friendly solutions you can trust.",
    keywords:
      "Eastlake shipping, Eastlake printing, mailbox rentals Eastlake, UPS Eastlake, FedEx Eastlake, DHL Eastlake, Lake County business services, Chagrin River shipping, Lake Erie printing",
    heroTitle: "Serving Eastlake",
    heroSubtitle: "Your local experts in shipping and business services.",
    heroImage: getServiceImageUrl("/images/eastlake.webp"),
    content: [
      {
        heading: "Connecting Eastlake to the World",
        body: "From the shores of Lake Erie to the bustling neighborhoods, Eastlake is a community on the move, and Mailbox Plus is here to help you connect. We offer comprehensive shipping and printing services to meet the demands of both residents and businesses in Eastlake."
      },
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
      { title: "Community Focused", description: "Supporting Lake County’s local families and small businesses since 2024" }
    ],
    faqs: [
      {
        id: "faq-eastlake-1",
        question: "Can you ship large or fragile items from Eastlake?",
        answer: "Yes, we specialize in custom packing and shipping for large, fragile, and valuable items. Whether it's artwork, electronics, or sports equipment, we ensure it's packed securely for transit from Eastlake.",
        isFeatured: true
      },
      {
        id: "faq-eastlake-2",
        question: "How can Eastlake businesses benefit from your services?",
        answer: "We offer a suite of business services, including mailbox rentals with a real street address, document shredding, and high-quality printing for marketing materials, all designed to support the growth of Eastlake businesses."
      }
    ]
  },
  {
    id: "willoughby",
    category: "core",
    serviceName: "Willoughby Services",
    slug: "willoughby",
    canonicalUrl: "/service-area/willoughby",
    priorityServices: ["pack-ship", "flyers-brochures"],
    city: "Willoughby",
    pageTitle: "Shipping & Printing in Willoughby, Ohio",
    metaDescription:
      "Mailbox Plus proudly supports Willoughby, Ohio with expert shipping, custom packaging, printing, and mailbox rentals. From historic downtown to busy business corridors, we deliver trusted, local solutions.",
    keywords:
      "Willoughby shipping, Willoughby printing, mailbox rentals Willoughby, UPS Willoughby, FedEx Willoughby, DHL Willoughby, Lake County business services, downtown Willoughby shipping, Erie Street printing",
    heroTitle: "Serving Willoughby",
    heroSubtitle: "Professional services tailored to Willoughby residents.",
    heroImage: getServiceImageUrl("/images/willoughby.webp"),
    content: [
      {
        heading: "Modern Services for Historic Willoughby",
        body: "With its charming downtown and vibrant community, Willoughby is a special place to live and work. Mailbox Plus is proud to offer modern, convenient shipping and printing services that respect the city's historic roots while supporting its forward momentum."
      },
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
      { title: "Community Commitment", description: "Proudly serving Lake County since 2024" }
    ],
    faqs: [
      {
        id: "faq-willoughby-1",
        question: "Do you offer printing services for Willoughby's small businesses?",
        answer: "Yes, we provide a wide range of printing services, including business cards, flyers, banners, and more, all with a quick turnaround to help Willoughby's small businesses make a great impression.",
        isFeatured: true
      },
      {
        id: "faq-willoughby-2",
        question: "What shipping carriers do you offer for Willoughby residents?",
        answer: "We offer a full range of shipping options through UPS, FedEx, DHL, and USPS, giving Willoughby residents the flexibility to choose the best service for their needs and budget."
      }
    ]
  },
  {
    id: "wickliffe",
    category: "core",
    serviceName: "Wickliffe Services",
    slug: "wickliffe",
    canonicalUrl: "/service-area/wickliffe",
    priorityServices: ["pack-ship", "custom-box-making"],
    city: "Wickliffe",
    pageTitle: "Shipping & Printing in Wickliffe, Ohio",
    metaDescription:
      "Mailbox Plus proudly serves Wickliffe, Ohio, with professional shipping, printing, and mailbox services. From local businesses to Lake County families, we deliver friendly, reliable solutions built on community trust.",
    keywords:
      "Wickliffe shipping, Wickliffe printing, mailbox rentals Wickliffe, UPS Wickliffe, FedEx Wickliffe, DHL Wickliffe, Lake County business services, Worden Road shipping, Lakeland Boulevard printing",
    heroTitle: "Serving Wickliffe",
    heroSubtitle: "Your neighborhood shipping and printing experts.",
    heroImage: getServiceImageUrl("/images/wickliffe.webp"),
    content: [
      {
        heading: "Your Community Partner in Wickliffe",
        body: "As a proud part of the Lake County community, Mailbox Plus is dedicated to serving the residents and businesses of Wickliffe. We offer a friendly, reliable, and convenient solution for all your shipping, printing, and business service needs."
      },
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
      { title: "Rooted in Community", description: "Proudly serving Lake County since 2024" }
    ],
    faqs: [
      {
        id: "faq-wickliffe-1",
        question: "Can I drop off pre-paid packages from Wickliffe at your location?",
        answer: "Yes, we accept pre-paid drop-offs for UPS, FedEx, DHL, and USPS, making it easy for Wickliffe residents to get their packages on their way without any extra hassle.",
        isFeatured: true
      },
      {
        id: "faq-wickliffe-2",
        question: "Do you sell packing and shipping supplies near Wickliffe?",
        answer: "We have a wide selection of packing and shipping supplies available in our store, from boxes and tape to bubble wrap and packing peanuts, all conveniently located for our Wickliffe customers."
      }
    ]
  },
  {
    id: "madison",
    category: "core",
    serviceName: "Madison Services",
    slug: "madison",
    canonicalUrl: "/service-area/madison",
    priorityServices: ["pack-ship", "shipping-insurance"],
    city: "Madison",
    pageTitle: "Shipping & Printing in Madison, Ohio",
    metaDescription:
      "Mailbox Plus proudly serves Madison, Ohio, with professional shipping, printing, and mailbox services. From small businesses to Lake Erie homeowners, we deliver trusted, local solutions with speed and reliability.",
    keywords:
      "Madison shipping, Madison printing, mailbox rentals Madison, UPS Madison, FedEx Madison, DHL Madison, Lake County business services, Grand River shipping, Route 20 printing",
    heroTitle: "Serving Madison",
    heroSubtitle: "Comprehensive shipping and business services for Madison.",
    heroImage: getServiceImageUrl("/images/madison.webp"),
    content: [
      {
        heading: "Supporting the Heart of Madison",
        body: "In the heart of Ohio's wine country, Madison is a community with a unique blend of agriculture and small-town charm. Mailbox Plus is here to support Madison's residents and businesses with reliable shipping and printing services that are as dependable as the seasons."
      },
      {
        heading: "Madison's Shipping Experts",
        body: "Madison businesses and families choose Mailbox Plus for reliable shipping, printing, and mailbox rental services."
      },
      {
        heading: "Serving Madison, Ohio — A Community Built on Tradition",
        body: "Founded in 1811 and rich with agricultural heritage, Madison Township has grown from fertile farmland into one of Lake County’s most vibrant residential and business communities. With its blend of rural charm and modern convenience, Madison offers an inviting mix of wineries, parks, and small businesses that form the backbone of local life."
      },
      {
        heading: "A Destination for Growth and Connection",
        body: "From scenic vineyards along Vrooman Road to the beautiful shores of Lake Erie at Madison Township Park, the area continues to thrive as a welcoming destination for both families and entrepreneurs. With easy access via I-90 and Route 20, Madison connects residents to Cleveland, Erie, and the entire Western Reserve region — all while keeping its small-town heart."
      },
      {
        heading: "Your Local Shipping & Printing Partner",
        body: "At Mailbox Plus, we proudly serve the Madison community with fast, dependable services — from UPS, FedEx, USPS, and DHL shipping to professional printing, packaging, and mailbox rentals. Whether you're shipping wine bottles from a local vineyard, mailing marketing materials for your business, or sending care packages to family, we make it simple, secure, and stress-free."
      }
    ],
    features: [
      { title: "Quality Assurance", description: "Insured and secure handling for all shipments" },
      { title: "Full Carrier Access", description: "UPS, FedEx, USPS & DHL — all under one roof" },
      { title: "Local Commitment", description: "Proudly serving Madison and Lake County since 2024" }
    ],
    faqs: [
      {
        id: "faq-madison-1",
        question: "Do you offer services for Madison's wineries and local businesses?",
        answer: "Yes, we can help Madison's wineries and local businesses with everything from shipping products to printing marketing materials. We understand the unique needs of local entrepreneurs.",
        isFeatured: true
      },
      {
        id: "faq-madison-2",
        question: "How far is your location from Madison?",
        answer: "We are located a convenient drive from Madison, offering a great alternative to crowded post offices and providing a full suite of services in one friendly location."
      }
    ]
  },
  {
    id: "perry",
    category: "core",
    serviceName: "Perry Services",
    slug: "perry",
    canonicalUrl: "/service-area/perry",
    priorityServices: ["pack-ship", "professional-packing"],
    city: "Perry",
    pageTitle: "Shipping & Printing in Perry, Ohio",
    metaDescription:
      "Mailbox Plus proudly serves Perry, Ohio, with reliable shipping, packaging, and printing services. From local farms to families and small businesses, we deliver trusted solutions with hometown care.",
    keywords:
      "Perry shipping, Perry printing, mailbox rentals Perry, UPS Perry, FedEx Perry, DHL Perry, Lake County business services, Perry Township shipping, North Perry printing, Lake Erie packaging",
    heroTitle: "Serving Perry",
    heroSubtitle: "Your local partner for shipping and printing needs.",
    heroImage: getServiceImageUrl("/images/perry.webp"),
    content: [
      {
        heading: "Committed to the Perry Community",
        body: "With its rich agricultural heritage and strong sense of community, Perry is a place we are proud to serve. Mailbox Plus provides the residents and businesses of Perry with dependable shipping, printing, and mailbox services, all delivered with a personal touch."
      },
      {
        heading: "Perry Community Support",
        body: "From Perry’s small businesses to individual shippers, Mailbox Plus provides the services you need with a personal touch."
      },
      {
        heading: "Serving Perry, Ohio — A Community with Deep Roots",
        body: "Settled in the early 1800s, Perry Township is a proud Lake County community known for its fertile farmland, family-owned vineyards, and strong local traditions. With a perfect blend of rural charm and modern opportunity, Perry continues to grow while preserving the values that define its heritage."
      },
      {
        heading: "A Lakeside Community Built for Business",
        body: "Perry’s proximity to Lake Erie and easy access to Route 20 and I-90 make it a convenient home for residents and small enterprises alike. The area’s mix of agriculture, light industry, and family businesses gives Perry a balanced economy and a welcoming, community-focused spirit."
      },
      {
        heading: "Your Local Shipping & Printing Partner",
        body: "At Mailbox Plus, we proudly support Perry residents and business owners with dependable shipping, professional printing, and mailbox rental services. Whether you’re sending packages through UPS, FedEx, USPS, or DHL, mailing farm documents, or designing marketing materials for your business, our nearby Concord Township location makes it easy to get the job done right — with friendly, reliable service every time."
      }
    ],
    features: [
      { title: "Community Commitment", description: "Dedicated to serving Lake County communities" },
      { title: "Full Carrier Access", description: "UPS, FedEx, USPS & DHL — all in one convenient stop" },
      { title: "Trusted Local Partner", description: "Supporting Perry residents and small businesses since 2024" }
    ],
    faqs: [
      {
        id: "faq-perry-1",
        question: "Can you help with shipping for items from Perry's local farms or nurseries?",
        answer: "Absolutely! We can pack and ship a wide variety of items, including products from local farms and nurseries. We'll ensure your goods are packed securely to arrive in great condition.",
        isFeatured: true
      },
      {
        id: "faq-perry-2",
        question: "Is it easy to get to your store from Perry?",
        answer: "Yes, our location is easily accessible from Perry, providing a convenient one-stop shop for all your shipping and business needs without having to travel far from home."
      }
    ]
  },
  {
    id: "kirtland",
    category: "core",
    serviceName: "Kirtland Services",
    slug: "kirtland",
    canonicalUrl: "/service-area/kirtland",
    priorityServices: ["pack-ship", "copies"],
    city: "Kirtland",
    pageTitle: "Shipping & Printing in Kirtland, Ohio",
    metaDescription:
      "Mailbox Plus proudly serves Kirtland, Ohio, with professional shipping, printing, and mailbox services. From local businesses to families, we deliver dependable solutions rooted in community care and Lake County pride.",
    keywords:
      "Kirtland shipping, Kirtland printing, mailbox rentals Kirtland, UPS Kirtland, FedEx Kirtland, DHL Kirtland, Lake County business services, Holden Arboretum, Chapin Forest, Historic Kirtland, LDS Temple",
    heroTitle: "Serving Kirtland",
    heroSubtitle: "Your local partner for shipping and printing needs.",
    heroImage: getServiceImageUrl("/images/kirtland.webp"),
    content: [
      {
        heading: "Serving Historic Kirtland with Pride",
        body: "Kirtland's unique history and natural beauty make it a special place in Northeast Ohio. Mailbox Plus is honored to serve the Kirtland community with modern, reliable shipping and printing services that meet the needs of its residents and visitors."
      },
      {
        heading: "Kirtland Community Support",
        body: "From Kirtland's small businesses to individual shippers, Mailbox Plus provides the services you need with a personal touch."
      },
      {
        heading: "Serving Kirtland, Ohio — Where History Meets Natural Beauty",
        body: "Founded in the early 1800s, Kirtland is one of Lake County’s most historically significant communities, best known as the early headquarters of the Church of Jesus Christ of Latter-day Saints and home to the first Latter-day Saints Temple, built in 1836. Surrounded by scenic hills, forests, and creeks, Kirtland blends its spiritual heritage with an enduring sense of community and pride."
      },
      {
        heading: "A City Surrounded by Nature & Innovation",
        body: "Kirtland is home to some of Northeast Ohio’s most beautiful destinations, including the **Holden Arboretum**, **Chapin Forest Reservation**, and the **Lake Metroparks Farmpark**, which celebrates the region’s agricultural roots. With a mix of historic landmarks, small businesses, and natural beauty, Kirtland offers both residents and visitors a balance of tranquility and opportunity."
      },
      {
        heading: "Your Local Shipping & Printing Partner",
        body: "At Mailbox Plus, we proudly support Kirtland residents and business owners with fast, professional shipping, printing, and mailbox services. Whether you’re sending parcels through UPS, FedEx, USPS, or DHL, producing marketing materials for a local event, or managing business mail, our nearby Concord Township location makes it easy to get reliable, friendly service whenever you need it."
      }
    ],
    features: [
      { title: "Community Commitment", description: "Dedicated to serving Lake County communities" },
      { title: "Full Carrier Access", description: "UPS, FedEx, USPS & DHL — all in one convenient stop" },
      { title: "Rooted in Local Heritage", description: "Proudly serving Kirtland’s historic and natural community since 2024" }
    ],
    faqs: [
      {
        id: "faq-kirtland-1",
        question: "Do you offer any special services for tourists or visitors in Kirtland?",
        answer: "We can help visitors ship souvenirs and other items home, so you don't have to worry about packing them in your luggage. We make it easy to send a piece of Kirtland to your loved ones.",
        isFeatured: true
      },
      {
        id: "faq-kirtland-2",
        question: "What are the benefits of a mailbox rental for Kirtland residents?",
        answer: "A private mailbox rental offers a secure, professional address for your mail and packages, available during business hours. It's a great solution for home-based businesses or frequent travelers in Kirtland."
      }
    ]
  },
  {
    id: "chardon",
    category: "core",
    serviceName: "Chardon Services",
    slug: "chardon",
    canonicalUrl: "/service-area/chardon",
    priorityServices: ["pack-ship", "packaging-supplies"],
    city: "Chardon",
    pageTitle: "Shipping & Printing in Chardon, Ohio",
    metaDescription:
      "Mailbox Plus proudly serves Chardon, Ohio, with professional shipping, printing, and mailbox services. From historic downtown businesses to local families, we deliver fast, friendly, and reliable solutions year-round.",
    keywords:
      "Chardon shipping, Chardon printing, mailbox rentals Chardon, UPS Chardon, FedEx Chardon, DHL Chardon, Geauga County business services, Chardon Square, snowbelt shipping, Chardon packaging",
    heroTitle: "Serving Chardon",
    heroSubtitle: "Comprehensive shipping and business services for Chardon.",
    heroImage: getServiceImageUrl("/images/chardon.webp"),
    content: [
      {
        heading: "Your Partner in the Heart of Geauga County",
        body: "As the heart of Geauga County, Chardon is a vibrant community that deserves the best in local services. Mailbox Plus is proud to extend our shipping and printing expertise to the residents and businesses of Chardon, with a focus on reliability and customer care."
      },
      {
        heading: "Chardon's Shipping Experts",
        body: "Chardon businesses and families choose Mailbox Plus for reliable shipping, printing, and mailbox rental services."
      },
      {
        heading: "Serving Chardon, Ohio — The Heart of the Snowbelt",
        body: "Founded in 1812, Chardon stands proudly atop Ohio’s snowbelt as the highest-elevation city in Northeast Ohio. Known for its historic square, charming shops, and welcoming community, Chardon offers a perfect balance of small-town tradition and modern business energy."
      },
      {
        heading: "A City Rooted in History and Community",
        body: "As the seat of Geauga County, Chardon’s heritage runs deep — from its early days as a frontier town to its role today as a hub for local entrepreneurship and regional events like the annual Maple Festival. With scenic parks, strong schools, and a thriving downtown, Chardon continues to attract families and small businesses alike."
      },
      {
        heading: "Your Local Shipping & Printing Partner",
        body: "At Mailbox Plus, we proudly support Chardon residents, professionals, and small businesses with secure shipping, expert packaging, and professional printing services. Whether you’re mailing documents, shipping snow gear, or sending custom marketing materials, our nearby Concord Township location makes it easy to get dependable, friendly service every time."
      }
    ],
    features: [
      { title: "Quality Assurance", description: "Insured and secure handling for all shipments" },
      { title: "Full Carrier Access", description: "UPS, FedEx, USPS & DHL — all in one convenient stop" },
      { title: "Community Connection", description: "Supporting Chardon and Geauga County since 2024" }
    ],
    faqs: [
      {
        id: "faq-chardon-1",
        question: "Can you handle large or heavy shipments from Chardon?",
        answer: "Yes, we are equipped to handle large and heavy items with our freight shipping options. Whether it's furniture, equipment, or a large order, we can get it shipped from Chardon.",
        isFeatured: true
      },
      {
        id: "faq-chardon-2",
        question: "Do you offer graphic design services for businesses in Chardon?",
        answer: "We offer professional graphic design services to help you create stunning marketing materials, from logos and business cards to brochures and banners, all designed to make your Chardon business stand out."
      }
    ]
  },
  {
    id: "fairport-harbor",
    category: "core",
    serviceName: "Fairport Harbor Services",
    slug: "fairport-harbor",
    canonicalUrl: "/service-area/fairport-harbor",
    priorityServices: ["pack-ship", "postage-stamps"],
    city: "Fairport Harbor",
    pageTitle: "Shipping & Printing in Fairport Harbor, Ohio",
    metaDescription:
      "Mailbox Plus proudly serves Fairport Harbor, Ohio, with reliable shipping, printing, and mailbox services. From lakefront residents to local businesses, we deliver friendly, dependable service rooted in community care.",
    keywords:
      "Fairport Harbor shipping, Fairport Harbor printing, mailbox rentals Fairport Harbor, UPS Fairport Harbor, FedEx Fairport Harbor, DHL Fairport Harbor, Lake County business services, Lake Erie shipping, Fairport Lighthouse, Grand River packaging",
    heroTitle: "Serving Fairport Harbor",
    heroSubtitle: "Your neighborhood shipping and printing experts.",
    heroImage: getServiceImageUrl("/images/Fairport_Harbor.webp"),
    content: [
      {
        heading: "Serving the Lakeside Village of Fairport Harbor",
        body: "With its beautiful lakefront and rich maritime history, Fairport Harbor is a gem on the shores of Lake Erie. Mailbox Plus is delighted to serve the residents and businesses of this charming village with a full range of shipping and printing services."
      },
      {
        heading: "Fairport Harbor Community Services",
        body: "Fairport Harbor residents rely on Mailbox Plus for everything from package shipping to business card printing."
      },
      {
        heading: "Serving Fairport Harbor, Ohio — A Historic Lakefront Village",
        body: "Founded in 1812 at the mouth of the Grand River, Fairport Harbor is one of Lake County’s most scenic and historic waterfront communities. Known for its maritime heritage, iconic lighthouse, and Finnish cultural roots, this close-knit village blends lakefront beauty with small-town hospitality."
      },
      {
        heading: "A Waterfront Community with Strong Traditions",
        body: "Home to landmarks like the **Fairport Harbor Marine Museum and Lighthouse**, **Headlands Dunes State Nature Preserve**, and a bustling marina district, Fairport Harbor attracts visitors and families year-round. Its walkable downtown, community festivals, and lake access make it a local gem along the Lake Erie shoreline."
      },
      {
        heading: "Your Local Shipping & Printing Partner",
        body: "At Mailbox Plus, we’re proud to serve Fairport Harbor’s residents, artists, and small-business owners with dependable shipping, printing, and mailbox services. Whether you’re mailing lakefront art, shipping local goods, or managing business correspondence, our nearby Concord Township location provides fast, friendly service with trusted carrier options including UPS, FedEx, USPS, and DHL."
      }
    ],
    features: [
      { title: "Personalized Service", description: "Tailored solutions for Fairport Harbor customers" },
      { title: "Full Carrier Access", description: "UPS, FedEx, USPS & DHL — all in one convenient stop" },
      { title: "Rooted in Community", description: "Proudly serving Fairport Harbor and Lake County since 2024" }
    ],
    faqs: [
      {
        id: "faq-fairport-harbor-1",
        question: "Can I ship internationally from Fairport Harbor using your services?",
        answer: "Yes, we offer international shipping with DHL, FedEx, and UPS, making it easy to send packages to friends, family, and business partners around the world from Fairport Harbor.",
        isFeatured: true
      },
      {
        id: "faq-fairport-harbor-2",
        question: "Do you have options for fragile or valuable items from Fairport Harbor?",
        answer: "We offer specialized packing services and insurance options to ensure that your fragile and valuable items are protected during transit. Ship with confidence from Fairport Harbor."
      }
    ]
  },
  {
    id: "geneva",
    category: "core",
    serviceName: "Geneva Services",
    slug: "geneva",
    canonicalUrl: "/service-area/geneva",
    priorityServices: ["pack-ship", "fedex-shipping"],
    city: "Geneva",
    pageTitle: "Shipping & Printing in Geneva, Ohio",
    metaDescription:
      "Mailbox Plus proudly serves Geneva, Ohio, with professional shipping, printing, and mailbox services. From Lake Erie wineries to downtown businesses, we deliver trusted local service with national carrier options.",
    keywords:
      "Geneva shipping, Geneva printing, mailbox rentals Geneva, UPS Geneva, FedEx Geneva, DHL Geneva, Ashtabula County business services, Geneva-on-the-Lake, wine country shipping, Lake Erie printing",
    heroTitle: "Serving Geneva",
    heroSubtitle: "Professional services tailored to Geneva residents.",
    heroImage: getServiceImageUrl("/images/Geneva_Ohio.webp"),
    content: [
      {
        heading: "Supporting the Spirit of Geneva",
        body: "From the bustling strip of Geneva-on-the-Lake to the serene vineyards, Geneva is a community with a unique spirit. Mailbox Plus is proud to support the businesses and residents of Geneva with reliable shipping, printing, and mailbox services."
      },
      {
        heading: "Geneva Business Support",
        body: "From bulk mailings to secure shipping, Mailbox Plus helps Geneva businesses thrive with our comprehensive service offerings."
      },
      {
        heading: "Serving Geneva, Ohio — In the Heart of Wine Country",
        body: "Founded in 1816, Geneva stands as one of Ashtabula County’s most charming and historic communities. Known for its fertile vineyards and Lake Erie shoreline, Geneva proudly anchors Ohio’s wine country, with dozens of award-winning wineries and small businesses that attract visitors year-round."
      },
      {
        heading: "A Destination for Community and Commerce",
        body: "From the scenic Geneva State Park and marina to the lively strip of Geneva-on-the-Lake, the region blends natural beauty with a spirit of entrepreneurship. Local farms, artisans, and small businesses give the area its distinct flavor — supported by a strong community that values service and reliability."
      },
      {
        heading: "Your Local Shipping & Printing Partner",
        body: "At Mailbox Plus, we proudly support Geneva residents, wineries, and small businesses with dependable shipping, professional printing, and mailbox services. Whether you’re shipping wine accessories, mailing marketing materials, or managing small-business logistics, our nearby Concord Township location offers full-service carrier access — UPS, FedEx, USPS, and DHL — with friendly, expert care."
      }
    ],
    features: [
      { title: "Local Knowledge", description: "Understanding Geneva's unique needs" },
      { title: "Full Carrier Access", description: "UPS, FedEx, USPS & DHL — all under one roof" },
      { title: "Rooted in Community", description: "Proudly serving Geneva and Ashtabula County since 2024" }
    ],
    faqs: [
      {
        id: "faq-geneva-1",
        question: "Do you offer wine shipping services for the Geneva area?",
        answer: "Yes, we are experienced in packing and shipping wine, and we can help you send your favorite local vintages to friends and family. We offer a variety of packing options to ensure your wine arrives safely.",
        isFeatured: true
      },
      {
        id: "faq-geneva-2",
        question: "Can you help with marketing materials for my Geneva business?",
        answer: "We can help you design and print a wide range of marketing materials, including brochures, flyers, and direct mail campaigns, to help you reach more customers in the Geneva area."
      }
    ]
  }
  ,
  {
    id: "leroy-township",
    category: "core",
    serviceName: "Leroy Township Services",
    slug: "leroy-township",
    canonicalUrl: "/service-area/leroy-township",
    priorityServices: ["pack-ship", "mailbox-rental"],
    city: "Leroy Township",
    pageTitle: "Shipping & Printing in Leroy Township, Ohio",
    metaDescription: "Mailbox Plus proudly serves Leroy Township, Ohio with expert shipping, custom packaging, printing, and mailbox rentals.",
    keywords: "Leroy Township shipping, Leroy Township printing, mailbox rentals Leroy Township",
    heroTitle: "Serving Leroy Township",
    heroSubtitle: "Your local shipping, printing & business service experts.",
    heroImage: getServiceImageUrl("/images/leroy-township.webp"),
    content: [],
    features: [],
    faqs: []
  },
  {
    id: "mayfield",
    category: "core",
    serviceName: "Mayfield Services",
    slug: "mayfield",
    canonicalUrl: "/service-area/mayfield",
    priorityServices: ["pack-ship", "mailbox-rental"],
    city: "Mayfield",
    pageTitle: "Shipping & Printing in Mayfield, Ohio",
    metaDescription: "Mailbox Plus proudly serves Mayfield, Ohio with expert shipping, custom packaging, printing, and mailbox rentals.",
    keywords: "Mayfield shipping, Mayfield printing, mailbox rentals Mayfield",
    heroTitle: "Serving Mayfield",
    heroSubtitle: "Your local shipping, printing & business service experts.",
    heroImage: getServiceImageUrl("/images/mayfield.webp"),
    content: [],
    features: [],
    faqs: []
  },
  {
    id: "auburn-township",
    category: "core",
    serviceName: "Auburn Township Services",
    slug: "auburn-township",
    canonicalUrl: "/service-area/auburn-township",
    priorityServices: ["pack-ship", "mailbox-rental"],
    city: "Auburn Township",
    pageTitle: "Shipping & Printing in Auburn Township, Ohio",
    metaDescription: "Mailbox Plus proudly serves Auburn Township, Ohio with expert shipping, custom packaging, printing, and mailbox rentals.",
    keywords: "Auburn Township shipping, Auburn Township printing, mailbox rentals Auburn Township",
    heroTitle: "Serving Auburn Township",
    heroSubtitle: "Your local shipping, printing & business service experts.",
    heroImage: getServiceImageUrl("/images/auburn-township.webp"),
    content: [],
    features: [],
    faqs: []
  }
];
