import {
    Package, Shield, Truck, Globe, Printer, Palette, Star, Users, Mail, Archive,
    FileText, Scissors, FolderOpen, Layers, ClipboardList, Lock, MapPin, Fingerprint,
    NotebookText, Box, Clock
} from "lucide-react";
import { Service } from "../types/services";
import { getServiceImageUrl } from "../lib/supabase";
import {
    generalShippingFaqs,
    generalCopyPrintFaqs,
    generalHomeBusinessFaqs,
    packShipFaqs,
    artworkShippingFaqs,
    bicycleShippingFaqs,
    golfClubShippingFaqs,
    fedexShippingFaqs,
    upsShippingFaqs,
    uspsServicesFaqs,
    dhlExpressFaqs,
    internationalShippingFaqs,
    packageDropOffsFaqs,
    customBoxMakingFaqs,
    professionalPackingFaqs,
    packagingSuppliesFaqs,
    packageReceivingFaqs,
    postageStampsFaqs,
    businessCardsFaqs,
    flyersBrochuresFaqs,
    documentPrintingFaqs,
    postersPrintingFaqs,
    graphicDesignFaqs,
    postcardPrintingFaqs,
    copiesFaqs,
    mailboxRentalFaqs,
    digitalMailboxRentalFaqs,
    everyDoorDirectMailFaqs,
    shreddingFaqs,
    documentScanningFaqs,
    faxServicesFaqs,
    notaryServicesFaqs,
    digitalFingerprintingFaqs,
    insuranceFaqs
} from "./faqs";

export const services: Service[] = [
    // ---------------------------
    // CORE
    // ---------------------------
    {
        id: "pack-ship",
        category: "core",
    city: "Concord Township",
        serviceName: "Pack & Ship",
        slug: "/pack-ship",
        pageTitle: "Pack & Ship in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Professional packing and shipping services in Concord Township, serving Lake County including Painesville, Mentor, and Eastlake.",
        keywords: "shipping, packing, FedEx, UPS, USPS, DHL, Concord Township, Lake County",
        heroTitle: "Pack & Ship Services",
        heroSubtitle: "Professional shipping solutions with FedEx, UPS, USPS, DHL and more.",
        heroImage: getServiceImageUrl("/images/pack-ship.jpg"),
        content: [
            {
                heading: "Your Local Shipping Experts",
                body: "Mailbox Plus provides trusted shipping solutions for individuals and businesses throughout Lake County. With multiple carrier options, you can choose the speed and service that best fits your needs."
            },
            {
                heading: "Convenience & Flexibility",
                body: "Our one-stop location means you don’t have to visit multiple carrier stores. Bring your packages here and we’ll help you find the best rate and option available."
            }
        ],
        features: [
            { icon: Package, title: "All Major Carriers", description: "Ship with FedEx, UPS, USPS, or DHL from one convenient location." },
            { icon: Shield, title: "Expert Packing", description: "Our trained staff use professional materials to ensure safe delivery." },
            { icon: Truck, title: "Fast & Reliable", description: "Multiple speed options from overnight to economy ground service." }
        ],
        faqs: packShipFaqs
    },

    // ---------------------------
    // PACK & SHIP
    // ---------------------------
    {
        id: "artwork-shipping",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "Artwork Shipping",
        slug: "/pack-ship/artwork-shipping",
        pageTitle: "Artwork Shipping in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Professional artwork packing and shipping for paintings, sculptures, and antiques in Concord Township and Lake County.",
        keywords: "artwork shipping, fine art shipping, packing paintings, Concord Township, Lake County",
        heroTitle: "Artwork Shipping Services",
        heroSubtitle: "Expert packing and shipping solutions for paintings, sculptures, and fine art.",
        heroImage: getServiceImageUrl("/images/artwork-shipping.jpg"),
        content: [
            {
                heading: "Expert Art Handling",
                body: "We understand the unique challenges of transporting artwork. From canvases to sculptures, our packing methods are tailored to protect every piece."
            },
            {
                heading: "Trusted by Collectors & Galleries",
                body: "Our team regularly works with private collectors, galleries, and artists to ensure their valuable items are packed and shipped with the highest standards."
            },
            {
                heading: "Professional Artwork Shipping in Concord Township, Ohio",
                body: `At Mailbox Plus, we specialize in the careful, professional packing and shipping of fine artwork throughout Concord Township, Lake County, and beyond. Whether you're an artist, collector, or gallery owner, our team provides white-glove service using archival-grade materials, custom-fit crates, and shock-resistant packaging. Each shipment is designed to protect the integrity of your art—from oil paintings and framed prints to sculptures and antiques—during domestic and international transport.

Our shipping experts coordinate with trusted carriers including FedEx, UPS, DHL, and USPS, ensuring your art arrives safely and on time. We also offer specialized insurance coverage for high-value pieces, so you can ship with confidence. As part of the local art community, we understand the value of craftsmanship, preservation, and presentation—and treat every item with the care it deserves.

If you're searching for <strong>artwork shipping near Concord Township</strong>, or need <strong>professional fine art packing in Lake County</strong>, visit us today or schedule a free consultation. We'll handle every detail—so your masterpiece arrives ready to impress.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Package, title: "Custom Crating", description: "We design custom crates for delicate artwork." },
            { icon: Shield, title: "Insured Shipments", description: "Third-party insurance covers valuable art pieces." },
            { icon: Globe, title: "Worldwide Delivery", description: "Safe international shipping with customs assistance." }
        ],
        faqs: [...generalShippingFaqs, ...artworkShippingFaqs],
        cta: {
        title: "Ready to ship your artwork?",
        subtitle: "Custom packing, insurance, and careful handling—done locally.",
        buttonText: "Schedule a Consult",
        buttonLink: "/contact",
        variant: "brand",
        align: "left"
        }
    },
    {
        id: "bicycle-shipping",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "Bicycle Shipping",
        slug: "/pack-ship/bicycle-shipping",
        pageTitle: "Bicycle Shipping in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Professional bicycle packing and shipping services in Concord Township and Lake County.",
        keywords: "bicycle shipping, bike box, shipping bicycles, Concord Township, Lake County",
        heroTitle: "Bicycle Shipping Experts",
        heroSubtitle: "Professional packing and shipping services for bicycles of all sizes.",
        heroImage: getServiceImageUrl("/images/bicycle-shipping.jpg"),
        content: [
            {
                heading: "Shipping Bikes Made Simple",
                body: "Whether you're a cycling enthusiast or sending a bike to a loved one, we take care of the entire process from packing to shipping."
            },
            {
                heading: "E-Bike & Specialty Handling",
                body: "We can accommodate e-bikes and specialty bikes with safe packaging and compliance for battery shipments."
            },
            {
                heading: "Bicycle Shipping Experts in Concord Township, Ohio",
                body: `At Mailbox Plus, we make shipping your bicycle simple, safe, and stress-free. Whether you're sending your road bike across the country for a race, shipping an e-bike to a new owner, or returning a mountain bike from repair, our expert team handles every detail with care. We use high-quality bike boxes, protective foam, and frame stabilizers to ensure your ride arrives in perfect condition.

We ship through trusted carriers including UPS, FedEx, DHL, and USPS, giving you the best balance of speed and value. You can even track your shipment every step of the way. Need help packing? Our team can disassemble handlebars, pedals, and accessories, then reassemble your bike's packaging for a professional fit that meets carrier standards.

As your local bicycle shipping partner in Concord Township and Lake County, we're proud to help cyclists, clubs, and shops move bikes safely nationwide. If you're searching for <strong>"bike shipping near Concord Township"</strong> or <strong>"ship my bicycle in Lake County"</strong>, visit Mailbox Plus today — we'll handle the packing, labeling, and shipping, so you can focus on the ride ahead.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Package, title: "Custom Bike Boxes", description: "We provide reinforced bike boxes for safe transit." },
            { icon: Shield, title: "Protection Guaranteed", description: "Expert packing ensures frames and wheels stay secure." },
            { icon: Truck, title: "Domestic & International", description: "We ship bikes anywhere in the US or worldwide." }
        ],
        faqs: [...generalShippingFaqs, ...bicycleShippingFaqs]
    },
    {
        id: "golf-club-shipping",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "Golf Club Shipping",
        slug: "/pack-ship/golf-club-shipping",
        pageTitle: "Golf Club Shipping in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Professional golf club packing and shipping services in Concord Township and Lake County.",
        keywords: "golf club shipping, sports equipment shipping, Concord Township, Lake County",
        heroTitle: "Golf Club Shipping",
        heroSubtitle: "Ship your golf clubs safely and conveniently worldwide.",
        heroImage: getServiceImageUrl("/images/golf-club-shipping.jpg"),
        content: [
            {
                heading: "Safe Shipping for Your Clubs",
                body: "Whether you’re traveling for a tournament or sending clubs to a destination, we pack and ship them securely."
            },
            {
                heading: "Trusted by Golfers",
                body: "We've shipped golf bags and club sets for recreational players and professionals alike."
            },
            {
                heading: "Golf Club Shipping Experts in Concord Township, Ohio",
                body: `At Mailbox Plus, we specialize in safely packing and shipping golf clubs, bags, and equipment for players throughout Concord Township, Lake County, and beyond. Whether you're heading to a tournament, shipping clubs to a vacation destination, or returning gear to a manufacturer, we make the process simple, affordable, and secure.

Our expert team uses reinforced boxes, shaft guards, bubble wrap, and cushioning materials designed to protect your clubs from impact or pressure during transit. We work with trusted carriers including UPS, FedEx, DHL, and USPS to offer the best balance of price and delivery speed—so your gear arrives on time and ready to play.

As your local shipping partner, we understand how important your clubs are. We offer insurance options for added peace of mind and handle all the labeling, documentation, and drop-off logistics for you. If you're searching for **"golf club shipping near Concord Township"** or need **safe golf bag delivery in Lake County**, visit Mailbox Plus today. Let us handle your shipment from tee to green—so you can focus on your next round.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Package, title: "Custom Packing", description: "We provide reinforced boxes for golf clubs." },
            { icon: Shield, title: "Insured Options", description: "Coverage available for valuable sets." },
            { icon: Globe, title: "Ship Anywhere", description: "Domestic and international golf club shipping." }
        ],
        faqs: [...generalShippingFaqs, ...golfClubShippingFaqs]
    },
    {
        id: "fedex-shipping",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "FedEx Shipping",
        slug: "/pack-ship/fedex-shipping",
        pageTitle: "FedEx Shipping in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Authorized FedEx shipping center in Concord Township, serving Lake County communities.",
        keywords: "fedex shipping, concord township, lake county",
        heroTitle: "FedEx Shipping Services",
        heroSubtitle: "Ship your packages with the speed and reliability of FedEx.",
        heroImage: getServiceImageUrl("/images/fedex-shipping.jpg"),
        content: [
            {
                heading: "Convenient FedEx Drop-Off",
                body: "We are your neighborhood FedEx Authorized ShipCenter. Bring your labeled packages or let us prepare them for you."
            },
            {
                heading: "Flexible Shipping Options",
                body: "Choose from FedEx Express, Ground, and International services depending on your delivery timeline and budget."
            },
            {
                heading: "Your Trusted FedEx Shipping Partner in Concord Township, Ohio",
                body: `At Mailbox Plus, we’re proud to be your local <strong>Authorized FedEx Shipping Center</strong>—serving Concord Township, Lake County, and surrounding communities. Whether you’re sending important business documents, e-commerce packages, or personal gifts, our team ensures your shipment is packed, labeled, and processed according to FedEx’s professional standards.

We offer the full range of <strong>FedEx Express, Ground, and International</strong> services to meet your needs. From overnight document delivery to secure international shipping, our experts can help you choose the best option for your destination, timeline, and budget. Every package is packed with care using high-quality materials that protect against vibration, compression, and handling stress.

As part of our commitment to exceptional service, we provide <strong>real-time tracking, shipment insurance, and on-site packing assistance</strong>—so you can ship with confidence. Whether you’re searching for <em>FedEx drop-off near Concord Township</em> or need <em>FedEx printing and shipping services in Lake County</em>, Mailbox Plus makes the process fast, easy, and reliable.

Visit us today and experience the convenience of working with a local FedEx partner that truly cares about your packages—and your peace of mind.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Truck, title: "Fast Delivery", description: "Overnight and 2-day shipping available." },
            { icon: Shield, title: "Reliable Handling", description: "Your shipments are handled with care." },
            { icon: Globe, title: "International Reach", description: "Ship worldwide with customs support." }
        ],
        faqs: [...generalShippingFaqs, ...fedexShippingFaqs]
    },
    {
        id: "ups-authorized-shipper-outlet",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "UPS Authorized Shipper Outlet",
        slug: "/pack-ship/ups-authorized-shipper-outlet",
        pageTitle: "UPS Authorized Shipper in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Authorized UPS shipping outlet in Concord Township, offering ground, express, and international services.",
        keywords: "ups shipping, concord township, lake county",
        heroTitle: "UPS Shipping Services",
        heroSubtitle: "Full-service UPS Authorized Shipping Outlet for your convenience.",
        heroImage: getServiceImageUrl("/images/ups-shipping.jpg"),
        content: [
            {
                heading: "Ship with UPS Confidence",
                body: "As a UPS Authorized Shipper, we offer all the services of a UPS Store without the long drive."
            },
            {
                heading: "Flexible Options for Businesses",
                body: "Ground, Next Day Air, and International services available to meet your business shipping needs."
            },
            {
                heading: "Authorized UPS Shipping Center in Concord Township, Ohio",
                body: `Mailbox Plus is your trusted <strong>Authorized UPS Shipping Center</strong>—serving Concord Township, Lake County, and nearby communities with reliable packing and shipping solutions. Whether you're sending business documents, heavy packages, or time-sensitive materials, our trained staff ensures your shipment meets <strong>UPS packaging and handling standards</strong> for safety and speed.

We offer a full suite of <strong>UPS services</strong> including <em>UPS Ground, 2nd Day Air, Next Day Air, and International</em> options. Our experts help you choose the best method for your timeline and budget while guaranteeing secure packaging that protects your items in transit. Every box is prepared with professional materials designed to reduce impact, vibration, and compression damage.

As a local business in Gristmill Village, we take pride in providing fast, friendly, and accurate UPS drop-off and shipping assistance. You'll enjoy the convenience of <strong>on-site packing, printed shipping labels, tracking, and optional insurance coverage</strong>—all handled in one stop.

If you're looking for <em>UPS shipping near Concord Township</em> or need <em>an authorized UPS drop-off location in Lake County</em>, visit Mailbox Plus today. We'll handle your package with care, so you can ship with confidence.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Truck, title: "Ground & Air", description: "Reliable UPS Ground and Next Day Air shipping." },
            { icon: Shield, title: "Authorized Outlet", description: "Same UPS services with local convenience." },
            { icon: Package, title: "Drop-Offs Welcome", description: "Bring your pre-labeled UPS packages for free drop-off." }
        ],
        faqs: [...generalShippingFaqs, ...upsShippingFaqs]
    },
    {
        id: "usps-services",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "USPS Postal Services",
        slug: "/pack-ship/usps-services",
        pageTitle: "USPS Services in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Full-service USPS services including Priority Mail, First-Class, and international shipping in Concord Township.",
        keywords: "usps, postal services, concord township, lake county",
        heroTitle: "USPS Postal Services",
        heroSubtitle: "Access all the services of the United States Postal Service right here in Concord Township.",
        heroImage: getServiceImageUrl("/images/usps-services.jpg"),
        content: [
            {
                heading: "Skip the Post Office Line",
                body: "We offer the same USPS shipping services without the hassle of the post office."
            },
            {
                heading: "Mail & Package Services",
                body: "From stamps to international shipments, we cover all your USPS needs."
            },
            {
              heading: "Official USPS Postal Services in Concord Township, Ohio",
              body: `Mailbox Plus is your convenient, locally owned hub for <strong>USPS postal and shipping services</strong> in Concord Township and Lake County. As an authorized provider, we handle everything from <strong>First-Class Mail</strong> and <strong>Priority Mail</strong> to <em>Certified Mail, Flat Rate Boxes, and International Shipping</em>—all in one friendly location.

Avoid the long lines at the post office. Our team provides fast, accurate service with expert packing, custom labeling, and on-the-spot postage for envelopes, boxes, and parcels of all sizes. We help individuals and businesses alike save time and ship with confidence using trusted <strong>United States Postal Service</strong> options.

Whether you need to send a single letter or manage regular mailings, Mailbox Plus offers <strong>secure USPS drop-off, tracking assistance, and bulk mailing support</strong> right here in your community.

If you’re searching for <em>USPS services near Concord Township</em> or need <em>postal shipping in Lake County, Ohio</em>, stop by Mailbox Plus today. We’ll take care of your mail from start to finish—quickly, efficiently, and with a smile.`,
              isFullWidth: true
            }
        ],
        features: [
            { icon: Mail, title: "First-Class Mail", description: "Affordable shipping for letters and small packages." },
            { icon: Truck, title: "Priority Mail", description: "Fast and reliable USPS Priority Mail shipping." },
            { icon: Globe, title: "International Service", description: "Ship globally with USPS international options." }
        ],
        faqs: [...generalShippingFaqs, ...uspsServicesFaqs]
    },
    {
        id: "dhl-express",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "DHL Express",
        slug: "/pack-ship/dhl-express",
        pageTitle: "DHL Express in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Ship internationally with DHL Express from Concord Township, serving Lake County.",
        keywords: "dhl shipping, concord township, lake county",
        heroTitle: "DHL Express Shipping",
        heroSubtitle: "Fast international shipping with DHL Express.",
        heroImage: getServiceImageUrl("/images/dhl-express.jpg"),
        content: [
            {
                heading: "Ship Worldwide with DHL",
                body: "DHL Express specializes in international delivery, making it the go-to choice for global shipments."
            },
            {
                heading: "Trusted Worldwide Carrier",
                body: "DHL is known for its reliability and global network."
            },
            {
                heading: "DHL Express International Shipping in Concord Township, Ohio",
                body: `At Mailbox Plus, we proudly serve as your local access point for <strong>DHL Express international shipping</strong>—helping residents and businesses in Concord Township and Lake County send packages quickly and securely around the world. Whether you’re shipping documents to Europe, products to Asia, or gifts overseas, our team ensures every shipment is <strong>professionally packed, labeled, and customs-ready</strong> before it leaves our store.

DHL is recognized worldwide for its speed, reliability, and global reach. We offer <strong>DHL Express Worldwide</strong> and <strong>DHL Express Envelope</strong> services, with expert guidance on <em>customs forms, international restrictions, and packaging requirements</em>. Every shipment comes with detailed tracking and delivery confirmation, giving you peace of mind from drop-off to destination.

Our shipping specialists at Mailbox Plus can also combine DHL with other carriers like FedEx, UPS, or USPS to provide the most cost-effective solution for your timeline and budget.

If you’re searching for <em>DHL Express shipping near Concord Township</em> or need <em>international delivery in Lake County, Ohio</em>, stop by Mailbox Plus today. We’ll help you send your packages anywhere in the world—safely, efficiently, and with the care only a local expert can provide.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Globe, title: "Global Network", description: "Ship to over 220 countries worldwide." },
            { icon: Shield, title: "Secure Delivery", description: "DHL ensures safe and fast delivery." },
            { icon: Package, title: "Express Options", description: "Choose express services for urgent packages." }
        ],
        faqs: [...generalShippingFaqs, ...dhlExpressFaqs]
    },
    {
        id: "international-shipping",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "International Shipping",
        slug: "/pack-ship/international-shipping",
        pageTitle: "International Shipping in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "International shipping services with FedEx, UPS, USPS, and DHL from Concord Township, Lake County.",
        keywords: "international shipping, customs, concord township, lake county",
        heroTitle: "International Shipping",
        heroSubtitle: "Ship packages worldwide with expert customs documentation support.",
        heroImage: getServiceImageUrl("/images/international-shipping.jpg"),
        content: [
            {
                heading: "We Handle Customs",
                body: "International shipping doesn’t have to be complicated. We guide you through forms and regulations to ensure smooth delivery."
            },
            {
                heading: "Multiple Carriers Available",
                body: "Choose from FedEx, UPS, USPS, or DHL for the best international option."
            },
            {
                heading: "International Shipping Services in Concord Township, Ohio",
                body: `Mailbox Plus specializes in <strong>international shipping and customs preparation</strong> for individuals and businesses throughout Concord Township and Lake County, Ohio. Whether you're sending personal gifts overseas, exporting commercial products, or shipping important documents abroad, our experts make it easy to <strong>ship worldwide with confidence</strong>.

We partner with trusted global carriers—<strong>FedEx, UPS, DHL, and USPS</strong>—to provide flexible delivery options, real-time tracking, and transparent pricing. Every international shipment is carefully packed, labeled, and documented according to customs requirements to prevent delays or additional fees.

Our team also assists with <strong>customs forms, declarations, and country-specific restrictions</strong>, ensuring your package meets all international regulations before leaving our store. From Europe to Asia, South America to Australia, we'll help you find the most efficient and cost-effective route for your shipment.

If you're searching for <em>international shipping near Concord Township</em> or need <em>expert help with customs paperwork in Lake County, Ohio</em>, Mailbox Plus is here to help. Stop by today to explore global shipping solutions and let our professionals handle every detail—so your packages arrive safely, wherever they need to go.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Globe, title: "Worldwide Reach", description: "Access to over 220 countries and territories." },
            { icon: ClipboardList, title: "Customs Documentation", description: "We help prepare customs forms to prevent delays." },
            { icon: Truck, title: "Carrier Choice", description: "Select from FedEx, UPS, USPS, or DHL." }
        ],
        faqs: [...generalShippingFaqs, ...internationalShippingFaqs]
    },
    {
        id: "package-drop-offs",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "Package Drop-Offs",
        slug: "/pack-ship/package-drop-offs",
        pageTitle: "Package Drop-Offs in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Free package drop-off services for FedEx, UPS, USPS, and DHL in Concord Township.",
        keywords: "package drop-offs, fedex, ups, usps, dhl, concord township",
        heroTitle: "Package Drop-Offs",
        heroSubtitle: "Drop off your pre-labeled packages for free with all major carriers.",
        heroImage: getServiceImageUrl("/images/package-drop-offs.jpg"),
        content: [
            {
                heading: "Convenient Drop-Offs",
                body: "Already have a prepaid label? Drop off your packages here for FedEx, UPS, USPS, and DHL at no extra cost."
            },
            {
                heading: "Save Time & Gas",
                body: "Avoid long drives to carrier hubs and drop your packages at one local location."
            },
            {
                heading: "Convenient Package Drop-Offs in Concord Township, Ohio",
                body: `Mailbox Plus makes it simple and stress-free to drop off your pre-labeled packages for <strong>FedEx, UPS, DHL, and USPS</strong>. As an authorized drop-off location serving Concord Township and Lake County, we provide a secure and convenient way to handle your outgoing shipments—whether for business, online sales, or personal returns.

For returns, please note that <strong>a return shipping label is required</strong> on all packages. If you need your label printed, our team can help—<strong>label printing is available for just $2.00 per label</strong>. Unfortunately, <strong>we cannot process Amazon QR code returns at this time</strong>. However, <strong>FedEx QR code returns work successfully about 90% of the time</strong> for most eCommerce stores.

Once your package is labeled and sealed, simply drop it off with us. We'll scan it, verify the carrier, and ensure it's placed in the correct pickup area for daily carrier collection. Our staff makes sure your packages are processed securely and shipped on time.

Mailbox Plus also accepts <strong>Amazon, eBay, and prepaid returns</strong> with standard labels—making us your one-stop local destination for all carrier drop-offs.

If you're looking for <em>package drop-off near Concord Township</em> or need <em>authorized returns and shipping services in Lake County, Ohio</em>, visit Mailbox Plus today. We'll handle your shipment with care and help you get it where it needs to go.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Package, title: "All Carriers Accepted", description: "FedEx, UPS, USPS, and DHL drop-offs welcome." },
            { icon: Truck, title: "Free Service", description: "No charge for package drop-offs." },
            { icon: MapPin, title: "Local Convenience", description: "Located right in Concord Township." }
        ],
        faqs: [...generalShippingFaqs, ...packageDropOffsFaqs]
    },
    {
        id: "custom-box-making",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "Custom Box Making",
        slug: "/pack-ship/custom-box-making",
        pageTitle: "Custom Box Making in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Custom box making services for oversized, irregular, or fragile items in Concord Township.",
        keywords: "custom boxes, packaging, concord township, lake county",
        heroTitle: "Custom Box Making",
        heroSubtitle: "We create custom-sized boxes for items that don't fit standard packaging.",
        heroImage: getServiceImageUrl("/images/custom-box-making.jpg"),
        content: [
            {
                heading: "Made-to-Fit Packaging",
                body: "Some items just don't fit in standard boxes. We build custom solutions to fit your shipment perfectly."
            },
            {
                heading: "Protect Your Items",
                body: "Custom packaging ensures your items are secure during shipping."
            },
            {
                heading: "Custom Box Making Services in Concord Township, Ohio",
                body: `At Mailbox Plus, we specialize in <strong>custom box design and fabrication</strong>—perfect for safely shipping items that don't fit standard packaging sizes. From artwork and antiques to oversized products and fragile collectibles, our experts create made-to-measure boxes that ensure your shipment is <strong>secure, professional, and carrier-compliant</strong>.

Each box is designed for your item's exact dimensions and shipping method, using high-quality corrugated materials for maximum protection. We also offer <strong>foam inserts, double-wall boxes, and reinforced corners</strong> to keep even the most delicate pieces safe during transit.

For customers who prefer a hands-on approach, we've developed an <strong>online custom box calculator</strong> available at <a href="https://boxsize.cc/" target="_blank" rel="noopener noreferrer" style="color: #2DA0ED; font-weight: bold;">https://boxsize.cc/</a>. This free tool allows you to <em>design, measure, and visualize your own box layout at home</em> before bringing it in for professional assembly or packing assistance.

Whether you're a small business shipping products or an individual preparing a one-of-a-kind item, Mailbox Plus offers <strong>custom box solutions built for precision and protection</strong>.

If you're searching for <em>custom box making near Concord Township</em> or need <em>custom packaging in Lake County, Ohio</em>, visit Mailbox Plus today. We'll help you pack it right—the first time.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Box, title: "Custom Sizes", description: "Boxes built to fit your unique item." },
            { icon: Shield, title: "Secure Protection", description: "Keeps fragile or irregular items safe." },
            { icon: Package, title: "On-Demand Service", description: "We create boxes while you wait." }
        ],
        faqs: [...generalShippingFaqs, ...customBoxMakingFaqs]
    },
    {
        id: "professional-packing",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "Professional Packing",
        slug: "/pack-ship/professional-packing",
        pageTitle: "Professional Packing in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Expert packing services with bubble wrap, foam, and custom boxes in Concord Township.",
        keywords: "professional packing, secure shipping, concord township, lake county",
        heroTitle: "Professional Packing",
        heroSubtitle: "Let our experts pack your items for maximum protection.",
        heroImage: getServiceImageUrl("/images/professional-packing.jpg"),
        content: [
            {
                heading: "Safe Packing, Every Time",
                body: "Our trained team knows how to pack fragile, heavy, and oversized items for safe shipping."
            },
            {
                heading: "Save Time & Stress",
                body: "Bring your items in and let us handle the packing so you can relax."
            },
            {
                heading: "Professional Packing Services in Concord Township, Ohio",
                body: `At Mailbox Plus, we take the stress out of shipping with our <strong>professional packing services</strong>—trusted by residents and businesses throughout Concord Township and Lake County. Whether you're shipping fragile glassware, valuable artwork, electronics, or oversized equipment, our trained staff uses proven methods and high-quality materials to ensure every package is <strong>secure, protected, and carrier-approved</strong>.

We provide <strong>custom packing solutions</strong> that match your item's size, weight, and fragility. From double-boxing and foam cushioning to bubble wrap and reinforced corners, every detail is handled with care. Our packing experts also specialize in <em>insurance-eligible packaging</em> to help you safeguard valuable shipments during transit.

For those who need specialized assistance, we offer <strong>on-site packing consultations</strong> and guidance on the best shipping materials for your needs. Whether you're preparing one item or managing a large shipment, we'll design the right packing plan for your timeline and budget.

If you're searching for <em>professional packing near Concord Township</em> or need <em>expert shipping preparation in Lake County, Ohio</em>, stop by Mailbox Plus today. We'll handle your items as if they were our own—packed to perfection and ready for safe delivery.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Shield, title: "Expert Team", description: "Professionally trained packers." },
            { icon: Package, title: "Quality Materials", description: "We use bubble wrap, foam, and sturdy boxes." },
            { icon: Star, title: "Proven Methods", description: "Techniques designed to minimize risk of damage." }
        ],
        faqs: [...generalShippingFaqs, ...professionalPackingFaqs]
    },
    {
        id: "packaging-supplies",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "Packaging Supplies",
        slug: "/pack-ship/packaging-supplies",
        pageTitle: "Packaging Supplies in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Boxes, bubble wrap, tape, and shipping supplies available at Mailbox Plus in Concord Township.",
        keywords: "shipping supplies, boxes, tape, bubble wrap, concord township",
        heroTitle: "Packaging Supplies",
        heroSubtitle: "Everything you need to pack and ship your items.",
        heroImage: getServiceImageUrl("/images/packaging-supplies.jpg"),
        content: [
            {
                heading: "One Stop for Supplies",
                body: "We carry boxes, tape, bubble wrap, and more—all the supplies you need to pack at home."
            },
            {
                heading: "Convenient & Affordable",
                body: "Avoid the big-box stores and pick up your supplies right where you ship."
            },
            {
                heading: "Quality Packaging Supplies in Concord Township, Ohio",
                body: `At Mailbox Plus, we stock a full range of <strong>professional packaging supplies</strong> to help you prepare shipments of any size, shape, or fragility. Serving Concord Township, Lake County, and surrounding communities, our shop carries everything you need to <strong>pack, protect, and ship your items securely</strong>.

Our inventory includes <strong>boxes, bubble wrap, tape, mailing tubes, padded envelopes, foam sheets, and packing peanuts</strong>—plus specialty options like <em>double-wall cartons, poster tubes, and custom-fit inserts</em>. Whether you're sending a gift across the country or shipping commercial goods, we provide durable materials that meet <strong>carrier-grade standards</strong> for UPS, FedEx, DHL, and USPS.

Need guidance? Our experts can help you choose the right materials for your shipment to ensure maximum protection and compliance with shipping carrier requirements. We also offer <strong>custom box making and professional packing services</strong> for irregular or delicate items that require extra care.

If you're looking for <em>packaging supplies near Concord Township</em> or need <em>shipping boxes and packing materials in Lake County, Ohio</em>, stop by Mailbox Plus today. We'll make sure your package is packed right—from supplies to shipping.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Package, title: "Variety of Boxes", description: "Multiple sizes and styles available." },
            { icon: Shield, title: "Protective Materials", description: "Bubble wrap, foam, and peanuts for safe shipping." },
            { icon: Scissors, title: "Everything Else", description: "Tape, labels, and more for your convenience." }
        ],
        faqs: [...generalShippingFaqs, ...packagingSuppliesFaqs]
    },

    // ---------------------------
    // COPY & PRINT
    // ---------------------------
    {
        id: "business-cards",
        category: "copy-print",
    city: "Concord Township",
        serviceName: "Business Cards",
        slug: "/copy-print/business-cards",
        pageTitle: "Business Card Printing in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Order professional business cards with high-quality printing in Concord Township, serving Lake County communities.",
        keywords: "business cards, printing, Concord Township, Lake County",
        heroTitle: "Professional Business Cards",
        heroSubtitle: "Make a lasting first impression with custom-designed business cards.",
        heroImage: getServiceImageUrl("/images/business-cards.jpg"),
        content: [
            {
                heading: "Why Business Cards Still Matter",
                body: "In the digital age, a well-designed business card remains one of the most effective tools for building professional connections."
            },
            {
                heading: "Design Options & Quality Printing",
                body: "We work with top print suppliers to deliver business cards that reflect your brand. Choose from matte, glossy, and premium finishes."
            },
            {
                heading: "Professional Business Card Printing in Concord Township, Ohio",
                body: `Make a lasting first impression with <strong>custom business cards professionally printed at Mailbox Plus</strong> in Concord Township, Ohio. We help entrepreneurs, small businesses, and professionals throughout Lake County create <strong>high-quality, full-color business cards</strong> that reflect their brand, mission, and style.

Our design and printing team offers <strong>matte, glossy, and premium cardstock finishes</strong>, along with specialty upgrades such as <em>spot UV, raised lettering, double-sided prints, and custom-cut corners</em>. Whether you need 100 cards or 10,000, we ensure crisp detail, vibrant color, and fast turnaround times.

Don’t have a design yet? We can help you create one from scratch or polish your existing layout for print. Every card is printed using <strong>professional-grade printers and durable materials</strong> to make sure your brand stands out with confidence and clarity.

If you’re searching for <em>business card printing near Concord Township</em> or need <em>custom business cards in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you design and print cards that open doors, start conversations, and make your business unforgettable.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Users, title: "Custom Design", description: "Work with our staff or upload your own design." },
            { icon: Palette, title: "Premium Materials", description: "Choose from multiple card stocks and finishes." },
            { icon: Star, title: "Fast Turnaround", description: "Get your cards quickly, ready for your next meeting." }
        ],
        faqs: [...generalCopyPrintFaqs, ...businessCardsFaqs]
    },
    {
        id: "flyers-brochures",
        category: "copy-print",
    city: "Concord Township",
        serviceName: "Flyers & Brochures",
        slug: "/copy-print/flyers-brochures",
        pageTitle: "Flyers & Brochures Printing in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Professional flyer and brochure printing in Concord Township, serving Lake County.",
        keywords: "flyers, brochures, printing, concord township",
        heroTitle: "Flyer & Brochure Printing",
        heroSubtitle: "High-quality printed materials for marketing, events, and promotions.",
        heroImage: getServiceImageUrl("/images/flyers_brochures.jpg"),
        content: [
            {
                heading: "Promote Your Business",
                body: "Flyers and brochures remain one of the most cost-effective ways to share your message with the community."
            },
            {
                heading: "Professional Quality",
                body: "Our print partners provide full-color, double-sided printing on premium paper stocks."
            },
            {
                heading: "Flyer and Brochure Printing Services in Concord Township, Ohio",
                body: `Promote your business, event, or product with <strong>professional flyer and brochure printing</strong> from Mailbox Plus in Concord Township, Ohio. We help businesses and organizations across Lake County design and print <strong>eye-catching marketing materials</strong> that deliver your message clearly and effectively.

Our print specialists offer a variety of <strong>sizes, paper weights, and finishes</strong>—including <em>glossy, matte, tri-fold, and double-sided layouts</em>—so you can customize your flyers and brochures to match your brand and purpose. From small business promotions to community events and real estate listings, we ensure every print looks sharp, vibrant, and ready to impress.

Need help with design? Our team can assist with <strong>layout creation, color optimization, and brand consistency</strong> to ensure your materials look polished and professional. We print in both small and bulk quantities with fast turnaround times and affordable pricing.

If you’re searching for <em>flyer printing near Concord Township</em> or need <em>custom brochure printing in Lake County, Ohio</em>, stop by Mailbox Plus today. We’ll help you turn your ideas into professional marketing pieces that get noticed and get results.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Printer, title: "High-Resolution Printing", description: "Sharp, full-color graphics every time." },
            { icon: Palette, title: "Custom Designs", description: "Flexible templates or upload your own design." },
            { icon: Layers, title: "Variety of Finishes", description: "Glossy, matte, and specialty options." }
        ],
        faqs: [...generalCopyPrintFaqs, ...flyersBrochuresFaqs]
    },
    /*
    {
        id: "document-finishing",
        category: "copy-print",
    city: "Concord Township",
        serviceName: "Document Finishing",
        slug: "/copy-print/document-finishing",
        pageTitle: "Document Finishing in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Document finishing services including binding, laminating, and stapling in Concord Township.",
        keywords: "document finishing, laminating, binding, Concord Township, Lake County",
        heroTitle: "Document Finishing Services",
        heroSubtitle: "Professional finishing options for your important documents.",
        heroImage: getServiceImageUrl("/images/document-finishing.jpg"),
        content: [
            {
                heading: "Add a Professional Touch",
                body: "We provide finishing services such as laminating, binding, and stapling to make your documents stand out."
            }
        ],
        features: [
            { icon: Layers, title: "Laminating", description: "Protect documents with durable lamination." },
            { icon: ClipboardList, title: "Binding", description: "Choose spiral or comb binding for reports." },
            { icon: Star, title: "Quality Finishes", description: "Give your projects a polished, professional look." }
        ],
        faqs: [...generalCopyPrintFaqs, ...documentFinishingFaqs]
    },
    */
    {
        id: "document-printing",
        category: "copy-print",
    city: "Concord Township",
        serviceName: "Document Printing",
        slug: "/copy-print/document-printing",
        pageTitle: "Document Printing in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Professional document printing services for business and personal use in Concord Township.",
        keywords: "document printing, business printing, Concord Township, Lake County",
        heroTitle: "Document Printing",
        heroSubtitle: "High-quality document printing for all your needs.",
        heroImage: getServiceImageUrl("/images/document-printing.jpg"),
        content: [
            {
                heading: "Professional Document Printing",
                body: "From single-page documents to large reports, we provide high-quality printing services for businesses and individuals."
            },
            {
                heading: "Fast Turnaround",
                body: "Most printing jobs are completed the same day, so you can get your documents when you need them."
            },
            {
                heading: "Document Printing Services in Concord Township, Ohio",
                body: `Mailbox Plus provides fast, affordable, and high-quality <strong>document printing services</strong> for residents, students, and businesses throughout Concord Township and Lake County, Ohio. Whether you need to print <strong>resumes, presentations, contracts, forms, or reports</strong>, we make it simple to get crisp, professional results—right when you need them.

Our on-site printers produce <strong>black-and-white and full-color documents</strong> with a variety of finishing options, including <em>stapling, hole-punching, collating, and binding</em>. We can print directly from email, USB drive, cloud storage, or hard copy, and every print job is handled with care and confidentiality.

Mailbox Plus also offers <strong>bulk printing, scanning, and faxing services</strong> for small offices, local professionals, and community organizations. Need quick turnaround? Most document printing jobs are completed the same day or while you wait.

If you’re searching for <em>document printing near Concord Township</em> or need <em>professional printing and copying services in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you print it right—the first time.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Printer, title: "Color & B/W", description: "Full-color or black and white printing options." },
            { icon: FileText, title: "Multiple Formats", description: "Print documents, reports, presentations, and more." },
            { icon: Star, title: "Professional Quality", description: "Sharp, crisp printing on premium paper." }
        ],
        faqs: [...generalCopyPrintFaqs, ...documentPrintingFaqs]
    },
    {
        id: "posters-printing",
        category: "copy-print",
    city: "Concord Township",
        serviceName: "Posters Printing",
        slug: "/copy-print/posters-printing",
        pageTitle: "Poster Printing in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Large-format poster printing services in Concord Township for events, promotions, and displays.",
        keywords: "poster printing, large format printing, Concord Township, Lake County",
        heroTitle: "Poster Printing",
        heroSubtitle: "Eye-catching posters for events, promotions, and presentations.",
        heroImage: getServiceImageUrl("/images/posters-printing.jpg"),
        content: [
            {
                heading: "Stand Out with Custom Posters",
                body: "Our large-format poster printing services deliver vibrant, professional results for any occasion."
            },
            {
                heading: "Multiple Sizes Available",
                body: "Choose from standard sizes or request custom dimensions to fit your specific needs."
            },
            {
                heading: "Large Format Poster Printing in Concord Township, Ohio",
                body: `Make a bold statement with <strong>custom poster printing</strong> from Mailbox Plus in Concord Township, Ohio. We specialize in creating <strong>vibrant, high-resolution posters</strong> for businesses, schools, events, and organizations throughout Lake County—perfect for promotions, presentations, displays, and special occasions.

Our print team uses <strong>professional-grade printers and premium photo-quality paper</strong> to ensure your posters look sharp, colorful, and durable. Choose from a variety of <em>sizes, finishes, and materials</em>, including glossy, matte, and laminated options. We can print everything from a single poster to a full campaign run, all with fast turnaround times.

Need help designing your poster? Our in-store experts can assist with <strong>layout, sizing, and color matching</strong> to make sure your artwork stands out and communicates your message clearly.

If you’re searching for <em>poster printing near Concord Township</em> or need <em>large-format printing services in Lake County, Ohio</em>, stop by Mailbox Plus today. We’ll help you create professional posters that get attention—whether you’re advertising a sale, promoting an event, or decorating your space.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Printer, title: "Large Format", description: "Print posters in various sizes up to 36 inches wide." },
            { icon: Palette, title: "Vibrant Colors", description: "Full-color printing with rich, eye-catching graphics." },
            { icon: Star, title: "Quality Materials", description: "Choose from glossy, matte, or premium paper stocks." }
        ],
        faqs: [...generalCopyPrintFaqs, ...postersPrintingFaqs]
    },
    {
        id: "graphic-design",
        category: "additional-services",
    city: "Concord Township",
        serviceName: "Graphic Design",
        slug: "/copy-print/graphic-design",
        pageTitle: "Graphic Design in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Professional graphic design services for business cards, flyers, and more.",
        keywords: "graphic design, marketing design, Concord Township, Lake County",
        heroTitle: "Graphic Design Services",
        heroSubtitle: "Custom designs that make your business stand out.",
        heroImage: getServiceImageUrl("/images/graphic-design.jpg"),
        content: [
            {
                heading: "Design That Works",
                body: "Our designers create professional layouts for business cards, flyers, brochures, and more."
            }
        ],
        features: [
            { icon: Palette, title: "Custom Designs", description: "Designs tailored to your business." },
            { icon: Users, title: "Collaborative Process", description: "Work with us to create your ideal look." },
            { icon: Star, title: "Polished Results", description: "Professional graphics that get noticed." }
        ],
        faqs: [...generalCopyPrintFaqs, ...graphicDesignFaqs]
    },
    {
        id: "postcard-printing",
        category: "copy-print",
    city: "Concord Township",
        serviceName: "Postcard Printing",
        slug: "/copy-print/postcard-printing",
        pageTitle: "Postcard Printing in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Custom postcard printing for business and personal use.",
        keywords: "postcard printing, marketing postcards, Concord Township, Lake County",
        heroTitle: "Postcard Printing",
        heroSubtitle: "Affordable, high-quality postcard printing for any occasion.",
        heroImage: getServiceImageUrl("/images/postcard-printing.jpg"),
        content: [
            {
                heading: "Send Your Message",
                body: "Postcards are a cost-effective way to reach customers and promote your brand."
            },
            {
                heading: "Design Options & Quality Printing",
                body: "We work with top print suppliers to deliver postcards that reflect your brand. Choose from matte, glossy, and premium finishes."
            },
            {
                heading: "Custom Postcard Printing in Concord Township, Ohio",
                body: `Reach customers, friends, and the community with <strong>custom postcard printing</strong> from Mailbox Plus in Concord Township, Ohio. We create <strong>high-quality, full-color postcards</strong> that are perfect for direct mail campaigns, event promotions, thank-you cards, and special announcements—all printed locally for fast turnaround and professional results.

Our printing team offers a range of <strong>sizes, finishes, and paper stocks</strong> to fit your message and style. Choose from <em>standard, glossy, matte, or premium heavyweight cards</em>, all printed with sharp detail and vibrant color. Whether you’re sending 25 postcards or 2,500, we ensure every card reflects your brand’s quality and attention to detail.

Need mailing help? We also provide <strong>address printing, EDDM (Every Door Direct Mail) preparation, and USPS delivery coordination</strong> to make your postcard marketing effortless and effective.

If you’re searching for <em>postcard printing near Concord Township</em> or need <em>custom mailer design and printing in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you design, print, and mail postcards that get noticed and deliver results.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Printer, title: "Full-Color Printing", description: "Bright, eye-catching postcards." },
            { icon: Layers, title: "Quality Paper", description: "Choose from matte or glossy finishes." },
            { icon: Star, title: "Fast Turnaround", description: "Get your postcards quickly." }
        ],
        faqs: [...generalCopyPrintFaqs, ...postcardPrintingFaqs]
    },
    {
        id: "copies",
        category: "copy-print",
    city: "Concord Township",
        serviceName: "Copies",
        slug: "/copy-print/copies",
        pageTitle: "Copy Services in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "High-volume copy services available in Concord Township, Lake County.",
        keywords: "copy services, document copies, concord township, lake county",
        heroTitle: "Copy Services",
        heroSubtitle: "Quick, affordable copies for personal or business use.",
        heroImage: getServiceImageUrl("/images/copies.jpg"),
        content: [
            {
                heading: "Affordable Copying",
                body: "Make black-and-white or color copies in any quantity you need."
            },
            {
                heading: "Bulk Discounts",
                body: "Save more when you print larger volumes."
            },
            {
                heading: "Fast and Affordable Copy Services in Concord Township, Ohio",
                body: `Mailbox Plus provides quick, reliable, and high-quality <strong>copy and duplication services</strong> for individuals, students, and businesses across Concord Township and Lake County, Ohio. Whether you need a few pages or hundreds of copies, our professional-grade printers ensure <strong>crisp, clean, and accurate reproductions</strong> every time.

We offer both <strong>black-and-white and full-color copying</strong> with flexible options for <em>single-sided, double-sided, collated, and stapled copies</em>. Our team can also help you scale documents, adjust formatting, or reproduce large quantities for presentations, training materials, flyers, and handouts.

Mailbox Plus also provides <strong>document scanning, faxing, and binding services</strong>—so you can handle all your document needs in one stop. Whether it’s business forms, personal paperwork, or school projects, we make sure your copies are handled with care, speed, and precision.

If you’re searching for <em>copy services near Concord Township</em> or need <em>professional printing and duplication in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you copy it right the first time—fast, easy, and affordable.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Printer, title: "Color & B/W Copies", description: "Flexible copy options for any need." },
            { icon: Layers, title: "High Volume", description: "We handle bulk orders quickly." },
            { icon: Star, title: "Quality Guaranteed", description: "Clear, sharp copies every time." }
        ],
        faqs: [...generalCopyPrintFaqs, ...copiesFaqs]
    },

    // ---------------------------
    // HOME & BUSINESS
    // ---------------------------
    {
        id: "mailbox-rental",
        category: "mailbox-rentals",
        city: "Concord Township",
        serviceName: "Mailbox Rental",
        slug: "/home-business/mailbox-rental",
        pageTitle: "Mailbox Rental in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Secure mailbox rental services with a real street address in Concord Township, serving Lake County.",
        keywords: "mailbox rental, secure address, Concord Township, Lake County",
        heroTitle: "Secure Mailbox Rentals",
        heroSubtitle: "Get a private, secure mailbox with a real street address.",
        heroImage: getServiceImageUrl("/images/mailbox-rental.jpg"),
        content: [
            {
                heading: "A Real Address for Your Mail",
                body: "Unlike a standard PO Box, our mailbox rentals provide you with a real street address, making it easier for package deliveries and business use."
            },
            {
                heading: "Safe & Secure Access",
                body: "Enjoy peace of mind with 24/7 secure access and professional staff to handle your deliveries."
            },
            {
                heading: "Secure Mailbox Rentals in Concord Township, Ohio",
                body: `Keep your mail and packages safe with <strong>secure mailbox rentals</strong> from Mailbox Plus in Concord Township, Ohio. Whether for personal, business, or seasonal use, our private mailboxes provide a professional address and reliable delivery from <strong>all major carriers—UPS, FedEx, USPS, and DHL</strong>.

We offer two flexible mailbox plans:
• <strong>$20.00 per month</strong> for our basic mailbox service, which includes up to five (5) packages per month, with a <strong>$5.00 per package fee after the fifth</strong>.
• <strong>$25.00 per month mailbox service with electronic notification</strong>, which includes ten (10) packages per month and a <strong>$5.00 per package fee after the tenth</strong>.

Mailbox access is available during our <strong>regular business hours</strong>, and rentals are available in convenient <strong>3-month, 6-month, and 12-month terms</strong>. Whether you’re looking to protect deliveries, separate business mail, or simplify shipping logistics, our secure mailboxes are an ideal solution.

To open a mailbox, you’ll need to complete <strong>USPS Form 1583</strong>, which authorizes Mailbox Plus as your Commercial Mail Receiving Agency (CMRA). The setup is quick and easy:

1. <strong>Complete USPS Form 1583</strong>
   Fill in your personal or business details, including your current address and any authorized recipients. Each additional person (such as family members or business associates) will need to provide their own identification.

2. <strong>Provide Two Forms of Identification</strong>
   • One primary photo ID (such as a <em>passport, driver’s license, military ID, or green card</em>).
   • One secondary ID showing your current address (such as a <em>lease, utility bill, voter registration card, or insurance policy</em>).

3. <strong>Sign and Submit</strong>
   Bring your completed Form 1583 and IDs to Mailbox Plus. Remember, <strong>the form must be submitted</strong> before we can legally accept mail on your behalf.

With secure mail handling, privacy protection, and convenient carrier access, our mailbox rentals are a smart choice for anyone looking to prevent lost deliveries and avoid porch theft.

If you’re searching for <em>mailbox rentals near Concord Township</em> or need <em>secure mail and package receiving in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you set up your private mailbox quickly, affordably, and legally.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Lock, title: "Private Mailbox", description: "Your mail stays secure and confidential." },
            { icon: Package, title: "Package Receiving", description: "We sign for packages so you never miss a delivery." },
            { icon: MapPin, title: "Convenient Location", description: "Located in Concord Township, serving all of Lake County." }
        ],
        faqs: [...generalHomeBusinessFaqs, ...mailboxRentalFaqs]
    },
    {
        id: "digital-mailbox-rental",
        category: "mailbox-rentals",
        city: "Concord Township",
        serviceName: "Digital Mailbox Rental",
        slug: "/home-business/digital-mailbox-rental",
        pageTitle: "Digital Mailbox Rental in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Manage your mail online with a secure digital mailbox service.",
        keywords: "digital mailbox rental, virtual mailbox, Concord Township, Lake County",
        heroTitle: "Digital Mailbox Rental",
        heroSubtitle: "Access your mail and packages from anywhere online.",
        heroImage: getServiceImageUrl("/images/digital-mailbox-rental.jpg"),
        content: [
            {
                heading: "Virtual Mailbox Access",
                body: "Get notifications, scan your mail, and forward packages all from your phone or computer."
            },
            {
                heading: "Remote Access",
                body: "Manage your mail from anywhere."
            },
            {
                heading: "Digital Mailbox Rentals in Concord Township, Ohio",
                body: `Manage your mail and packages from anywhere with <strong>digital mailbox rentals</strong> from Mailbox Plus in Concord Township, Ohio. Our virtual mailbox solutions make it easy to <strong>view, forward, scan, and manage your mail online</strong>—whether you're traveling, running a business, or working remotely.

Mailbox Plus partners with industry-leading digital mailbox providers, including <strong>iPostal1</strong>, <strong>Anytime Mailbox</strong>, and <strong>PostScan Mail</strong>, giving you flexible and secure access to your mail 24/7 through your computer or mobile device. With these services, you can:
• View envelopes and packages online in real time.
• Request mail scanning or forwarding to any address.
• Store mail digitally for easy organization.
• Receive notifications when new mail or packages arrive.

Each digital mailbox plan provides a unique <strong>Concord Township street address</strong>—not a P.O. Box—allowing you to receive packages from all major carriers, including UPS, FedEx, USPS, and DHL.

This service is ideal for small business owners, frequent travelers, snowbirds, and anyone who values convenience and privacy.

If you're searching for <em>digital mailbox rentals near Concord Township</em> or need <em>virtual mail management in Lake County, Ohio</em>, visit Mailbox Plus today. We'll help you choose the digital mailbox platform that best fits your needs and set you up with secure, online access to your physical mail—anytime, anywhere.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Mail, title: "Mail Scanning", description: "View your mail online securely." },
            { icon: Globe, title: "Remote Access", description: "Manage your mail from anywhere." },
            { icon: Lock, title: "Secure Service", description: "Your mail and data stay protected." }
        ],
        faqs: [...generalHomeBusinessFaqs, ...digitalMailboxRentalFaqs]
    },
    {
        id: "every-door-direct-mail",
        category: "document-services",
        city: "Concord Township",
        serviceName: "Every Door Direct Mail (EDDM)",
        slug: "/home-business/every-door-direct-mail",
        pageTitle: "Every Door Direct Mail in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Affordable Every Door Direct Mail campaigns with USPS.",
        keywords: "EDDM, direct mail, Concord Township, Lake County",
        heroTitle: "Every Door Direct Mail",
        heroSubtitle: "Reach your local community with cost-effective mail campaigns.",
        heroImage: getServiceImageUrl("/images/every-door-direct-mail.jpg"),
        content: [
            {
                heading: "Grow Your Business",
                body: "EDDM helps you target local neighborhoods with affordable bulk mailings."
            },
            {
                heading: "Convenience & Flexibility",
                body: "EDDM is easy to use and cost-effective."
            },
            {
                heading: "Every Door Direct Mail Services in Concord Township, Ohio",
                body: `<strong>Every Door Direct Mail (EDDM)</strong> from Mailbox Plus makes it easy and affordable to reach potential customers in your local area—without needing a mailing list. Serving Concord Township and Lake County, Ohio, we help businesses design, print, and deliver targeted mail campaigns through the <strong>United States Postal Service (USPS)</strong>.

With EDDM, you can <strong>choose specific postal routes</strong> and deliver your postcards, flyers, or brochures directly to every home and business in that area. It’s a powerful way to promote <em>local sales, events, grand openings, and seasonal offers</em>—perfect for small businesses, restaurants, realtors, and service providers.

Mailbox Plus handles the entire process from start to finish, including:
• <strong>Design and printing</strong> of postcards and mailers
• <strong>Sorting and bundling</strong> for USPS route delivery
• <strong>Filing and paperwork assistance</strong> with the USPS EDDM program
• <strong>Drop-off coordination</strong> with the local post office

We ensure your marketing materials meet USPS size and format requirements while maximizing your reach and minimizing postage costs.

If you’re searching for <em>Every Door Direct Mail services near Concord Township</em> or need <em>local business mail marketing in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you plan, print, and deliver your message straight into your customers’ hands.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Mail, title: "Bulk Mailing", description: "Send to entire ZIP codes or routes." },
            { icon: Users, title: "Targeted Reach", description: "Focus on specific neighborhoods." },
            { icon: Star, title: "Affordable", description: "Save money compared to traditional mailing lists." }
        ],
        faqs: [...generalHomeBusinessFaqs, ...everyDoorDirectMailFaqs]
    },
    {
        id: "package-receiving",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "Package Receiving",
        slug: "/pack-ship/package-receiving",
        pageTitle: "Package Receiving in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Never miss a delivery with our secure package receiving service.",
        keywords: "package receiving, mail handling, Concord Township, Lake County",
        heroTitle: "Package Receiving",
        heroSubtitle: "Let us sign for and securely store your packages.",
        heroImage: getServiceImageUrl("/images/package-receiving.jpg"),
        content: [
            {
                heading: "Safe & Secure",
                body: "We accept packages from all carriers and keep them safe until you pick them up."
            },
            {
                heading: "Convenient & Affordable",
                body: "For occasional deliveries, we offer a straightforward $10.00 per package setup, or choose our UNLIMITED Package Receiving Plan for just $30.00 per month—perfect for individuals and small businesses that receive regular shipments."
            },
            {
                heading: "Secure Package Receiving Services in Concord Township, Ohio",
                body: `Mailbox Plus provides reliable and secure <strong>package receiving services</strong> for residents, small businesses, and travelers throughout Concord Township and Lake County. If you need a safe place to receive deliveries when you’re not home or want to protect your packages from theft, our service makes it simple to <strong>receive, hold, and pick up shipments safely and on your schedule</strong>.

We accept deliveries from all major carriers—<strong>UPS, FedEx, USPS, and DHL</strong>—and sign for them on your behalf. Every package is logged, stored in a secure area, and ready for pickup at your convenience. For occasional deliveries, we offer a straightforward <strong>$10.00 per package setup</strong>, or choose our <strong>UNLIMITED Package Receiving Plan for just $30.00 per month</strong>—a perfect solution for individuals and small businesses that receive regular shipments.

This service is also an excellent way to <strong>protect against the growing porch pirate theft problem</strong> affecting neighborhoods across Ohio and the rest of the United States. By having your packages delivered directly to Mailbox Plus, you ensure that your items are <strong>kept safe, secure, and out of sight</strong> until you’re ready to pick them up.

Our customers receive <strong>real-time delivery notifications</strong> and personalized assistance from our friendly local team. Whether you’re searching for <em>package receiving near Concord Township</em> or need <em>secure delivery holding in Lake County, Ohio</em>, Mailbox Plus offers affordable, flexible solutions designed to keep your deliveries safe and your peace of mind intact.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Package, title: "All Carriers", description: "FedEx, UPS, USPS, and DHL accepted." },
            { icon: Shield, title: "Secure Storage", description: "We keep your packages safe." },
            { icon: Clock, title: "Convenient Pickup", description: "Pick up packages during store hours." }
        ],
        faqs: [...generalShippingFaqs, ...packageReceivingFaqs]
    },
    {
        id: "postage-stamps",
        category: "pack-ship",
    city: "Concord Township",
        serviceName: "Postage Stamps",
        slug: "/pack-ship/postage-stamps",
        pageTitle: "Postage Stamps in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Buy USPS postage stamps at Mailbox Plus.",
        keywords: "postage stamps, USPS stamps, Concord Township, Lake County",
        heroTitle: "Postage Stamps",
        heroSubtitle: "Convenient access to USPS stamps without the post office trip.",
        heroImage: getServiceImageUrl("/images/postage-stamps.jpg"),
        content: [
            {
                heading: "Quick & Easy",
                body: "Pick up individual stamps or full books for personal or business use."
            },
            {
                heading: "Postage Stamps and Mailing Services in Concord Township, Ohio",
                body: `Mailbox Plus is your convenient local source for <strong>postage stamps, mailing supplies, and USPS shipping services</strong> in Concord Township and Lake County. Whether you need to send a single letter, pay a bill, or mail a bulk set of invitations, our store makes it easy to get the exact postage you need—without waiting in long post office lines.
    
    We carry <strong>Forever Stamps, commemorative stamps, and standard USPS postage options</strong> for both domestic and international mail. Our staff can help you calculate postage rates, weigh envelopes, and prepare your items for shipment through the <strong>United States Postal Service</strong>.
    
    Mailbox Plus also offers <strong>envelopes, shipping labels, and packaging supplies</strong> to make your mailing process simple and efficient. Whether it’s personal correspondence or business mail, we’re here to help you get it there quickly and correctly.
    
    If you’re searching for <em>postage stamps near Concord Township</em> or need <em>mailing supplies and USPS services in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll handle your postage needs with friendly, local service—and help make sending mail easier than ever.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Mail, title: "USPS Stamps", description: "Official USPS postage stamps." },
            { icon: Star, title: "Convenient", description: "Buy while shipping your packages." },
            { icon: Package, title: "Books & Sheets", description: "Available in multiple quantities." }
        ],
        faqs: [...generalShippingFaqs, ...postageStampsFaqs]
    },
    {
        id: "shredding",
        category: "document-services",
        city: "Concord Township",
        serviceName: "Shredding Services",
        slug: "/home-business/shredding",
        pageTitle: "Document Shredding in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Secure shredding services for personal and business documents in Concord Township.",
        keywords: "shredding, document destruction, concord township, lake county",
        heroTitle: "Secure Shredding",
        heroSubtitle: "Protect your personal information with our shredding services.",
        heroImage: getServiceImageUrl("/images/shredding.jpg"),
        content: [
            {
                heading: "Why Shred Documents?",
                body: "Prevent identity theft and protect sensitive information by securely shredding your documents."
            },
            {
                heading: "Convenient & Affordable",
                body: "Drop off your documents and we’ll handle the rest with secure shredding."
            }
        ],
        features: [
            { icon: Scissors, title: "Confidential Destruction", description: "Your documents are securely shredded." },
            { icon: Shield, title: "Privacy Protection", description: "Protects against identity theft and fraud." },
            { icon: Archive, title: "Bulk Shredding", description: "We can handle small or large quantities." }
        ],
        faqs: [...generalHomeBusinessFaqs, ...shreddingFaqs]
    },
    {
        id: "document-scanning",
        category: "document-services",
        city: "Concord Township",
        serviceName: "Document Scanning",
        slug: "/home-business/document-scanning",
        pageTitle: "Document Scanning in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Document scanning and digital archiving services in Concord Township.",
        keywords: "document scanning, digital files, concord township, lake county",
        heroTitle: "Document Scanning",
        heroSubtitle: "Convert your paper documents into digital files.",
        heroImage: getServiceImageUrl("/images/document-scanning.jpg"),
        content: [
            {
                heading: "Go Paperless",
                body: "Digitize your important documents for easier storage and access."
            },
            {
                heading: "Secure Storage",
                body: "Your files are scanned with care and stored digitally."
            }
        ],
        features: [
            { icon: FileText, title: "Digital Files", description: "Scan to PDF, JPEG, or other formats." },
            { icon: Shield, title: "Secure Handling", description: "We handle your documents with confidentiality." },
            { icon: FolderOpen, title: "Easy Organization", description: "Organize and access files digitally." }
        ],
        faqs: [...generalHomeBusinessFaqs, ...documentScanningFaqs]
    },
    {
        id: "fax-services",
        category: "document-services",
        city: "Concord Township",
        serviceName: "Fax Services",
        slug: "/home-business/fax-services",
        pageTitle: "Fax Services in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Send and receive faxes at Mailbox Plus in Concord Township.",
        keywords: "fax services, send fax, concord township, lake county",
        heroTitle: "Fax Services",
        heroSubtitle: "Send and receive faxes securely and quickly.",
        heroImage: getServiceImageUrl("/images/fax-services.jpg"),
        content: [
            {
                heading: "Send Faxes Easily",
                body: "Whether for business or personal needs, we help you send documents anywhere."
            },
            {
                heading: "Receive Faxes at Our Location",
                body: "Use our store as your fax number and pick up documents securely."
            }
        ],
        features: [
            { icon: Printer, title: "Send & Receive", description: "Full fax services available." },
            { icon: Shield, title: "Secure Transmission", description: "Your information is kept private." },
            { icon: MapPin, title: "Local Access", description: "Conveniently send and receive in Concord Township." }
        ],
        faqs: [...generalHomeBusinessFaqs, ...faxServicesFaqs]
    },
    {
        id: "notary-services",
        category: "additional-services",
        city: "Concord Township",
        serviceName: "Notary Services",
        slug: "/home-business/notary-services",
        pageTitle: "Notary Public in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Professional notary services in Concord Township, Lake County.",
        keywords: "notary services, notary public, concord township, lake county",
        heroTitle: "Notary Public Services",
        heroSubtitle: "Certified notary available for all your important documents.",
        heroImage: getServiceImageUrl("/images/notary-services.jpg"),
        content: [
            {
                heading: "Notarize with Confidence",
                body: "We notarize contracts, affidavits, powers of attorney, and more."
            },
            {
                heading: "Professional & Secure",
                body: "Our certified notary ensures documents are handled legally and securely."
            }
        ],
        features: [
            { icon: NotebookText, title: "Certified Notary", description: "Licensed and approved notary services." },
            { icon: Shield, title: "Legal Assurance", description: "Documents notarized properly." },
            { icon: Users, title: "Trusted Service", description: "We serve individuals and businesses." }
        ],
        faqs: [...generalHomeBusinessFaqs, ...notaryServicesFaqs]
    },

    // ---------------------------
    // SPECIALTY
    // ---------------------------
    {
        id: "digital-fingerprinting",
        category: "additional-services",
    city: "Concord Township",
        serviceName: "Digital Fingerprinting",
        slug: "/specialty/digital-fingerprinting",
        pageTitle: "Digital Fingerprinting in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Fast and reliable digital fingerprinting services in Concord Township, serving Lake County.",
        keywords: "digital fingerprinting, livescan, background check, Concord Township, Lake County",
        heroTitle: "Digital Fingerprinting",
        heroSubtitle: "Quick, secure fingerprinting for background checks and licensing.",
        heroImage: getServiceImageUrl("/images/digital-fingerprinting.jpg"),
        content: [
            {
                heading: "Why Choose Digital Fingerprinting?",
                body: "Our advanced LiveScan technology captures fingerprints electronically for faster results and fewer errors."
            },
            {
                heading: "Approved & Trusted",
                body: "We are an approved provider for state and federal background checks, making the process simple and secure."
            }
        ],
        features: [
            { icon: Fingerprint, title: "LiveScan Technology", description: "Fast, digital fingerprint capture with no messy ink." },
            { icon: Shield, title: "Secure Processing", description: "Your data is transmitted securely to the proper authorities." },
            { icon: Truck, title: "Quick Results", description: "Most fingerprint submissions are processed within days." }
        ],
        faqs: digitalFingerprintingFaqs
    },
{
        id: "insurance",
        category: "additional-services",
    city: "Concord Township",
        serviceName: "Shipping Insurance",
        slug: "/specialty/insurance",
        pageTitle: "Shipping Insurance in Concord Township, Lake County, Ohio | Mailbox Plus",
        metaDescription: "Protect high-value packages with our third-party Marsh shipping insurance. Serving Concord Township, Mentor, Painesville, Eastlake, and all of Lake County.",
        keywords: "shipping insurance, package insurance, Marsh insurance, Concord Township, Mentor, Painesville, Eastlake, Lake County",
        heroTitle: "Peace of Mind Shipping Insurance",
        heroSubtitle: "Extra protection for your valuable shipments with Marsh third-party coverage.",
        heroImage: getServiceImageUrl("/images/insurance.jpg"),
        content: [
            {
                heading: "Protect What Matters Most",
                body: "At Mailbox Plus in Concord Township, we know your packages aren’t just boxes—they’re valuable, sometimes irreplaceable items. That’s why we offer affordable shipping insurance and package protection options with every major carrier: FedEx, UPS, USPS, and DHL."
            },
            {
                heading: "Why Add Insurance?",
                body: "Peace of mind, full-value protection, and affordable options. Insurance covers loss, theft, or damage during transit. We’ll help you select the right coverage for your shipment."
            },
            {
                heading: "What’s Covered?",
                body: "Shipping insurance protects against loss, theft, missing shipments, and transit damage. Coverage levels vary by carrier and declared value—our staff will walk you through your best options."
            },
            {
                heading: "Professional Packing + Insurance",
                body: "Insurance is strongest when paired with professional packaging. Our trained experts use double-wall boxes, bubble wrap, foam inserts, and custom crating so your claim is valid and your shipment arrives safely."
            },
            {
                heading: "Commonly Insured Shipments",
                body: "Electronics, fine art, antiques, collectibles, jewelry, important documents, high-value e-commerce sales, and specialty items like golf clubs, bicycles, and instruments."
            },
            {
                heading: "How to File a Claim",
                body: "If the unexpected happens, we’ll assist you through the claims process. Typically you’ll need the tracking number, proof of value, photos of damage (if applicable), and original packaging."
            },
            {
                heading: "Serving Our Community",
                body: "We proudly serve Concord Township, Mentor, Painesville, Eastlake, and all of Lake County, Ohio. Whether you’re a business shipping daily or a neighbor sending a one-time package, we’ll make sure your items are safe, insured, and delivered."
            },
            {
                heading: "Get Started Today",
                body: "Don’t take chances with your valuables. Stop by Mailbox Plus and ask about our shipping insurance options. Located in Gristmill Village, next to Pub Frato in Concord Township."
            }
        ],
        features: [
            { icon: Shield, title: "Third-Party Protection", description: "Coverage provided through Marsh, a trusted insurer." },
            { icon: Package, title: "High Value Coverage", description: "Insure shipments valued up to $50,000." },
            { icon: Star, title: "Peace of Mind Guarantee", description: "We’ll handle your package with care—and insure it too." }
        ],
        faqs: insuranceFaqs // create just like your digitalFingerprintingFaqs
    }

];
