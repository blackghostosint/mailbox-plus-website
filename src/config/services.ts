import {
    Package, Shield, Truck, Globe, Printer, Palette, Star, Users, Mail, Archive,
    FileText, Scissors, FolderOpen, Layers, Lock, MapPin, Fingerprint,
    Box, Clock, NotebookText
} from "lucide-react";
import { Service } from "../types/services";
import { getServiceImageUrl } from "../lib/storage";
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
        pageTitle: "Pack & Ship in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Pack & Ship in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "shipping, packing, FedEx, UPS, USPS, DHL, Concord Township, Lake County",
        heroTitle: "Pack & Ship Services",
        heroSubtitle: "Professional shipping solutions with FedEx, UPS, USPS, DHL and more.",
        heroImage: getServiceImageUrl("/images/pack-ship.webp"),
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
        pageTitle: "Artwork Shipping in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Artwork Shipping in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "artwork shipping, fine art shipping, packing paintings, Concord Township, Lake County",
        heroTitle: "Artwork Shipping Services",
        heroSubtitle: "Expert packing and shipping solutions for paintings, sculptures, and fine art.",
        heroImage: getServiceImageUrl("/images/artwork-shipping.webp"),
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
        buttonLink: "/contact-us",
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
        pageTitle: "Bicycle Shipping in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Bicycle Shipping in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "bicycle shipping, bike box, shipping bicycles, Concord Township, Lake County",
        heroTitle: "Bicycle Shipping Experts",
        heroSubtitle: "Professional packing and shipping services for bicycles of all sizes.",
        heroImage: getServiceImageUrl("/images/bicycle-shipping.webp"),
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
        pageTitle: "Golf Club Shipping in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Golf Club Shipping in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "golf club shipping, sports equipment shipping, Concord Township, Lake County",
        heroTitle: "Golf Club Shipping",
        heroSubtitle: "Ship your golf clubs safely and conveniently worldwide.",
        heroImage: getServiceImageUrl("/images/golf-club-shipping.webp"),
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
        pageTitle: "FedEx Shipping in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local FedEx Shipping in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "fedex shipping, concord township, lake county",
        heroTitle: "FedEx Shipping Services",
        heroSubtitle: "Ship your packages with the speed and reliability of FedEx.",
        heroImage: getServiceImageUrl("/images/fedex-shipping.webp"),
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
        pageTitle: "UPS Authorized Shipper Outlet in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local UPS Authorized Shipper Outlet in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "ups shipping, concord township, lake county",
        heroTitle: "UPS Shipping Services",
        heroSubtitle: "Full-service UPS Authorized Shipping Outlet for your convenience.",
        heroImage: getServiceImageUrl("/images/ups-shipping.webp"),
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
        pageTitle: "USPS Postal Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local USPS Postal Services in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "usps, postal services, concord township, lake county",
        heroTitle: "USPS Postal Services",
        heroSubtitle: "Access all the services of the United States Postal Service right here in Concord Township.",
        heroImage: getServiceImageUrl("/images/usps-services.webp"),
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
        pageTitle: "DHL Express in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local DHL Express in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "dhl shipping, concord township, lake county",
        heroTitle: "DHL Express Shipping",
        heroSubtitle: "Fast international shipping with DHL Express.",
        heroImage: getServiceImageUrl("/images/dhl-express.webp"),
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
        id: "package-drop-offs",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Package Drop-Offs",
        slug: "/pack-ship/package-drop-offs",
        pageTitle: "Package Drop-Offs in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Package Drop-Offs in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "package drop-offs, fedex, ups, usps, dhl, concord township",
        heroTitle: "Package Drop-Offs",
        heroSubtitle: "Drop off your pre-labeled packages for free with all major carriers.",
        heroImage: getServiceImageUrl("/images/package-drop-offs.webp"),
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
        pageTitle: "Custom Box Making in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Custom Box Making in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "custom boxes, packaging, concord township, lake county",
        heroTitle: "Custom Box Making",
        heroSubtitle: "We create custom-sized boxes for items that don't fit standard packaging.",
        heroImage: getServiceImageUrl("/images/custom-box-making.webp"),
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

Whether you're a small business shipping products or an individual preparing a one-of-a-kind item, Mailbox Plus offers <strong>custom box solutions built for precision and protection.</strong>

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
        pageTitle: "Professional Packing in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Professional Packing in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "professional packing, secure shipping, concord township, lake county",
        heroTitle: "Professional Packing",
        heroSubtitle: "Let our experts pack your items for maximum protection.",
        heroImage: getServiceImageUrl("/images/professional-packing.webp"),
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
        pageTitle: "Packaging Supplies in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Packaging Supplies in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "shipping supplies, boxes, tape, bubble wrap, concord township",
        heroTitle: "Packaging Supplies",
        heroSubtitle: "Everything you need to pack and ship your items.",
        heroImage: getServiceImageUrl("/images/packaging-supplies.webp"),
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
        pageTitle: "Business Cards in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Business Cards in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "business cards, printing, Concord Township, Lake County",
        heroTitle: "Professional Business Cards",
        heroSubtitle: "Make a lasting first impression with custom-designed business cards.",
        heroImage: getServiceImageUrl("/images/business-cards.webp"),
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
        pageTitle: "Flyers & Brochures in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Flyers & Brochures in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "flyers, brochures, printing, concord township",
        heroTitle: "Flyer & Brochure Printing",
        heroSubtitle: "High-quality printed materials for marketing, events, and promotions.",
        heroImage: getServiceImageUrl("/images/flyers_brochures.webp"),
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
    {
        id: "document-printing",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Document Printing",
        slug: "/copy-print/document-printing",
        pageTitle: "Document Printing in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Document Printing in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "document printing, business printing, Concord Township, Lake County",
        heroTitle: "Document Printing",
        heroSubtitle: "High-quality document printing for all your needs.",
        heroImage: getServiceImageUrl("/images/document-printing.webp"),
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
        pageTitle: "Posters Printing in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Posters Printing in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "poster printing, large format printing, Concord Township, Lake County",
        heroTitle: "Poster Printing",
        heroSubtitle: "Eye-catching posters for events, promotions, and presentations.",
        heroImage: getServiceImageUrl("/images/posters-printing.webp"),
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
        pageTitle: "Graphic Design in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Graphic Design in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "graphic design, marketing design, Concord Township, Lake County",
        heroTitle: "Graphic Design Services",
        heroSubtitle: "Custom designs that make your business stand out.",
        heroImage: getServiceImageUrl("/images/graphic-design.webp"),
        content: [
            {
                heading: "Design That Works",
                body: "Our designers create professional layouts for business cards, flyers, brochures, and more."
            },
            {
                heading: "Graphic Design Services in Concord Township, Ohio",
                body: `<strong>Bring your ideas to life with professional graphic design services</strong> from Mailbox Plus in Concord Township, Ohio. Whether you need a custom logo, marketing materials, or branded print products, our design experts can create <strong>eye-catching visuals that make your business stand out</strong>.

We specialize in <strong>business cards, flyers, brochures, postcards, posters, and banners</strong>—all designed to reflect your unique brand identity. Our team can work from your existing concept or build something completely new from scratch, ensuring your final design is clean, professional, and print-ready.

At Mailbox Plus, we use <strong>industry-standard design tools and color management practices</strong> to guarantee accuracy across all printed formats. You’ll have the opportunity to review and approve proofs before production to ensure every detail is perfect.

If you’re searching for <em>graphic design near Concord Township</em> or need <em>custom print design services in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you create stunning designs that communicate your message clearly and professionally.`,
                isFullWidth: true
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
        pageTitle: "Postcard Printing in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Postcard Printing in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "postcard printing, marketing postcards, Concord Township, Lake County",
        heroTitle: "Postcard Printing",
        heroSubtitle: "Affordable, high-quality postcard printing for any occasion.",
        heroImage: getServiceImageUrl("/images/postcard-printing.webp"),
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
        pageTitle: "Copies in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Copies in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "copy services, document copies, concord township, lake county",
        heroTitle: "Copy Services",
        heroSubtitle: "Quick, affordable copies for personal or business use.",
        heroImage: getServiceImageUrl("/images/copies.webp"),
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
        pageTitle: "Mailbox Rental in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Mailbox Rental in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "mailbox rental, secure address, Concord Township, Lake County",
        heroTitle: "Secure Mailbox Rentals",
        heroSubtitle: "Get a private, secure mailbox with a real street address.",
        heroImage: getServiceImageUrl("/images/mailbox-rental.webp"),
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
        pageTitle: "Digital Mailbox Rental in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Digital Mailbox Rental in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "digital mailbox rental, virtual mailbox, Concord Township, Lake County",
        heroTitle: "Digital Mailbox Rental",
        heroSubtitle: "Access your mail and packages from anywhere online.",
        heroImage: getServiceImageUrl("/images/digital-mailbox-rental.webp"),
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

Mailbox Plus partners with industry-leading digital mailbox providers, including <a href="https://ipostal1.com/mailboxplusohio" target="_blank" rel="noopener noreferrer" class="text-[#0855B1] underline">iPostal1</a>, <a href="https://mailboxplusofohiollc.anytimemailbox.com/signup" target="_blank" rel="noopener noreferrer" class="text-[#0855B1] underline">Anytime Mailbox</a>, and <a href="https://app.postscanmail.com/registration?plan=19527&store=1400&address=2489&expand=true&by_store=true" target="_blank" rel="noopener noreferrer" class="text-[#0855B1] underline">PostScan Mail</a>, giving you flexible and secure access to your mail 24/7 through your computer or mobile device. With these services, you can:
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
        pageTitle: "Every Door Direct Mail (EDDM) in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Every Door Direct Mail (EDDM) in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "EDDM, direct mail, Concord Township, Lake County",
        heroTitle: "Every Door Direct Mail",
        heroSubtitle: "Reach your local community with cost-effective mail campaigns.",
        heroImage: getServiceImageUrl("/images/every-door-direct-mail.webp"),
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
        pageTitle: "Package Receiving in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Package Receiving in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "package receiving, mail handling, Concord Township, Lake County",
        heroTitle: "Package Receiving",
        heroSubtitle: "Let us sign for and securely store your packages.",
        heroImage: getServiceImageUrl("/images/package-receiving.webp"),
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
        pageTitle: "Postage Stamps in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Postage Stamps in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "postage stamps, USPS stamps, Concord Township, Lake County",
        heroTitle: "Postage Stamps",
        heroSubtitle: "Convenient access to USPS stamps without the post office trip.",
        heroImage: getServiceImageUrl("/images/postage-stamps.webp"),
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
        pageTitle: "Shredding Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Shredding Services in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "shredding, document destruction, concord township, lake county",
        heroTitle: "Secure Shredding",
        heroSubtitle: "Protect your personal information with our shredding services.",
        heroImage: getServiceImageUrl("/images/shredding.webp"),
        content: [
            {
                heading: "Why Shred Documents?",
                body: "Prevent identity theft and protect sensitive information by securely shredding your documents."
            },
            {
                heading: "Convenient & Affordable",
                body: "Drop off your documents and we’ll handle the rest with secure shredding."
            },
            {
                heading: "Secure Document Shredding Services in Concord Township, Ohio",
                body: `<strong>Protect your privacy and prevent identity theft</strong> with professional document shredding from Mailbox Plus in Concord Township, Ohio. We offer <strong>secure shredding for personal, business, and legal documents</strong>, ensuring sensitive information is permanently destroyed in compliance with privacy regulations.

Our shredding process is <strong>safe, fast, and confidential</strong>—ideal for old files, receipts, invoices, financial records, or any documents containing personal information. Drop off your paperwork and we’ll handle it securely from start to finish. All shredded materials are <em>recycled responsibly</em> to help protect both your identity and the environment.

Mailbox Plus partners with certified shredding providers to guarantee your materials are handled according to <strong>industry and government compliance standards</strong>. Whether you need a one-time purge or ongoing shredding support for your business, we make it convenient and affordable.

If you’re searching for <em>secure document shredding near Concord Township</em> or need <em>confidential paper destruction in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you dispose of your sensitive documents safely, securely, and sustainably.`,
                isFullWidth: true
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
        pageTitle: "Document Scanning in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Document Scanning in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "document scanning, digital files, concord township, lake county",
        heroTitle: "Document Scanning",
        heroSubtitle: "Convert your paper documents into digital files.",
        heroImage: getServiceImageUrl("/images/document-scanning.webp"),
        content: [
            {
                heading: "Go Paperless",
                body: "Digitize your important documents for easier storage and access."
            },
            {
                heading: "Secure Storage",
                body: "Your files are scanned with care and stored digitally."
            },
            {
                heading: "Document Scanning Services in Concord Township, Ohio",
                body: `<strong>Preserve, organize, and digitize your important paperwork</strong> with professional document scanning services from Mailbox Plus in Concord Township, Ohio. We provide <strong>secure, high-resolution scanning</strong> for personal, legal, and business documents—helping you convert cluttered paper files into easy-to-access digital copies.

Our team handles everything from <strong>single-page scans to bulk scanning projects</strong>, ensuring every page is captured clearly and confidentially. We can deliver files in your preferred format (PDF, JPEG, TIFF, or searchable PDF) on a flash drive, email, or cloud storage.

Whether you're a business owner archiving records, a homeowner protecting vital documents, or a student organizing notes, Mailbox Plus ensures <strong>fast turnaround and total privacy</strong>. Your originals are returned to you intact, and all digital copies are securely transferred.

If you're searching for <em>document scanning near Concord Township</em> or need <em>secure digital conversion services in Lake County, Ohio</em>, visit Mailbox Plus today. We'll help you protect your records, reduce clutter, and modernize your document storage with ease.`,
                isFullWidth: true
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
        pageTitle: "Fax Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Fax Services in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "fax services, send fax, concord township, lake county",
        heroTitle: "Fax Services",
        heroSubtitle: "Send and receive faxes securely and quickly.",
        heroImage: getServiceImageUrl("/images/fax-services.webp"),
        content: [
            {
                heading: "Send Faxes Easily",
                body: "Whether for business or personal needs, we help you send documents anywhere."
            },
            {
                heading: "Receive Faxes at Our Location",
                body: "Use our store as your fax number and pick up documents securely."
            },
            {
                heading: "Fax Services in Concord Township, Ohio",
                body: `<strong>Send and receive faxes quickly and securely</strong> with professional fax services from Mailbox Plus in Concord Township, Ohio. Whether you need to transmit <strong>legal documents, forms, applications, or business papers</strong>, we make faxing fast, easy, and reliable—no fax machine required.
    
    Our in-store team can help you <strong>send local, domestic, and international faxes</strong> while ensuring your information remains private and confidential. You’ll receive a printed confirmation sheet for every fax sent, giving you proof of transmission for your records.
    
    We also provide <strong>fax receiving services</strong>—simply have your sender fax their documents to our store, and we’ll securely hold them for pickup. This is a convenient solution for individuals and small businesses who don’t have their own fax equipment but still need a trusted location for document transmission.
    
    If you’re searching for <em>fax services near Concord Township</em> or need <em>secure fax sending and receiving in Lake County, Ohio</em>, stop by Mailbox Plus today. We’ll help you handle your faxing needs quickly, accurately, and confidentially.`,
                isFullWidth: true
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
        pageTitle: "Notary Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Notary Services in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "notary services, notary public, concord township, lake county",
        heroTitle: "Notary Public Services",
        heroSubtitle: "Certified notary available for all your important documents.",
        heroImage: getServiceImageUrl("/images/notary-services.webp"),
        content: [
            {
                heading: "Notarize with Confidence",
                body: "We notarize contracts, affidavits, powers of attorney, and more."
            },
            {
                heading: "Professional & Secure",
                body: "Our certified notary ensures documents are handled legally and securely."
            },
            {
                heading: "Notary Public Services in Concord Township, Ohio",
                body: `<strong>Get your important documents notarized quickly and professionally</strong> at Mailbox Plus in Concord Township, Ohio. Our <strong>on-site notary public</strong> is available to verify signatures, witness legal documents, and ensure your paperwork meets all official requirements.

We handle a wide range of documents, including <strong>affidavits, contracts, real estate forms, titles, powers of attorney, and legal declarations</strong>. Whether you need a one-time notarization or ongoing business support, our team provides <strong>accurate, efficient, and confidential notary services</strong>.

You’ll need to bring <strong>valid government-issued photo identification</strong> (such as a driver’s license, state ID, or passport) for all signers. Documents must be signed in the presence of the notary to be legally valid.

Mailbox Plus also offers <strong>printing, copying, and scanning</strong> on-site, so you can prepare, notarize, and duplicate your paperwork in one convenient stop.

If you’re searching for <em>notary services near Concord Township</em> or need <em>professional document notarization in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you complete your notarization accurately, securely, and without delay.`,
                isFullWidth: true
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
        pageTitle: "Digital Fingerprinting in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Digital Fingerprinting in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "digital fingerprinting, livescan, background check, Concord Township, Lake County",
        heroTitle: "Digital Fingerprinting",
        heroSubtitle: "Quick, secure fingerprinting for background checks and licensing.",
        heroImage: getServiceImageUrl("/images/digital-fingerprinting.webp"),
        content: [
            {
                heading: "Why Choose Digital Fingerprinting?",
                body: "Our advanced LiveScan technology captures fingerprints electronically for faster results and fewer errors."
            },
            {
                heading: "Approved & Trusted",
                body: "We are an approved provider for state and federal background checks, making the process simple and secure."
            },
            {
                heading: "Digital Fingerprinting and Background Checks in Concord Township, Ohio",
                body: `<strong>Mailbox Plus is an authorized partner of FastFingerprints</strong>, offering <strong>digital fingerprinting and electronic background check services</strong> for employment, licensing, volunteering, and personal security needs. We make it easy to complete secure fingerprint-based background checks right here in Concord Township, Ohio.

FastFingerprints helps <strong>businesses and families protect themselves</strong> by accelerating the hiring and licensing process with <strong>electronic fingerprinting</strong>—the fastest, most accurate, and most secure method available. This process allows for timely and confident decisions regarding employment, licensing, and volunteer screening.

Individuals who can benefit from digital fingerprint-based background checks include:
Bus drivers, childcare providers, coaches, healthcare professionals, in-home caregivers, nannies, teachers, renters, volunteers, and more.

We offer both <strong>Ohio BCI (Bureau of Criminal Investigation) background checks</strong> and <strong>FBI national background checks</strong>:

• <strong>Ohio BCI Checks</strong> — These state-level checks search the Ohio Attorney General’s criminal database to identify convictions or arrests within Ohio. BCI checks are commonly required for employment, licensing, and volunteer work to ensure safety and compliance.

• <strong>FBI Background Checks</strong> — Nationwide checks that include records from across the United States. Often required for security clearance, adoption, foster care, and employment in sensitive professions such as education and healthcare.

Our digital system uses <strong>Ohio LiveScan technology</strong>, which captures and transmits fingerprints electronically—no ink required. LiveScan offers faster processing times, higher image accuracy, and greater convenience. The fingerprints are digitally submitted to BCI or the FBI for secure background processing.

FastFingerprints and Mailbox Plus provide a seamless, compliant, and confidential experience for every applicant. To schedule your appointment, visit <a href="https://register.fastfingerprints.com/account-entry" target="_blank" rel="noopener noreferrer" class="text-[#0855B1] underline">register.fastfingerprints.com/account-entry</a> and select Mailbox Plus as your service location.

If you’re searching for <em>digital fingerprinting in Concord Township</em> or need <em>BCI or FBI background check services in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you complete your background check quickly, securely, and professionally.`,
                isFullWidth: true
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
        pageTitle: "Shipping Insurance in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Shipping Insurance in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "shipping insurance, package insurance, Marsh insurance, Concord Township, Mentor, Painesville, Eastlake, Lake County",
        heroTitle: "Peace of Mind Shipping Insurance",
        heroSubtitle: "Extra protection for your valuable shipments with Marsh third-party coverage.",
        heroImage: getServiceImageUrl("/images/insurance.webp"),
        content: [
            {
                heading: "Comprehensive Shipping Protection",
                body: `At Mailbox Plus, we provide <strong>complete shipping insurance solutions</strong> that protect your packages from loss or damage while in transit. Whether you’re shipping across the country or overseas, our <strong>full-coverage insurance options</strong> ensure that your shipment value—including materials, labor, and transport costs—is completely protected.`
            },
            {
                heading: "Partnered with Marsh for Trusted Coverage",
                body: `Our <strong>Mailbox Plus Insurance Program</strong> is underwritten by <strong>Marsh</strong>, a global leader in cargo and risk management with more than 45,000 professionals worldwide. Together, we offer <strong>secure, affordable, and transparent shipping protection</strong> for both individuals and businesses—so every package you send is backed by the best in the industry.`
            },
            {
                heading: "Full-Coverage Shipping Insurance in Concord Township, Ohio",
                body: `<strong>Protect every shipment with full-coverage shipping insurance</strong> from Mailbox Plus in Concord Township, Ohio. Through our partnership with <strong>Marsh</strong>—the world’s leading cargo insurance broker and risk adviser—we provide <strong>comprehensive package and cargo protection</strong> for both individuals and businesses. Marsh employs over 45,000 professionals and serves clients in more than 130 countries, offering unmatched expertise in <strong>risk management and logistics protection</strong>.

Unlike basic carrier liability, our <strong>Mailbox Plus Insurance Program</strong> delivers true coverage for your shipments. Standard "declared value" protection from carriers does not cover packaging costs, service markups, or profits, and excludes many causes of loss. Our policy covers shipments <strong>against all risks of physical loss or damage</strong>, including events often excluded from carrier protection such as <strong>Acts of God, theft, terrorism, strikes, riots, and civil commotion</strong>.

Coverage applies to <strong>shipments in transit and while awaiting carrier pickup</strong>—ensuring your cargo is protected from the moment it enters your care until it reaches its final destination. Claims are paid upon documentation, with no need to prove carrier fault or wait for lengthy claim processes.

**Key benefits of Mailbox Plus Shipping Insurance include:**
• Protection for the full value of your shipment—including packaging materials, labor, freight markup, and transportation charges.
• Coverage for shipments handled by multiple carriers and subcontractors.
• Fast and efficient claim resolution regardless of carrier liability.
• Affordable premiums that cost significantly less than carrier-provided coverage.
• Eligibility for both <strong>domestic and international shipments</strong>.

This program also allows retail shipping stores to <strong>extend true insurance coverage to drop-off customers</strong>, turning insurance into a valuable profit center while providing superior customer protection.

Coverage is available up to <strong>$50,000 per shipment</strong> with prior authorization required for higher-value items. Shipments over $1,000 must include <strong>Adult Signature Required</strong> delivery to validate insurance.

Mailbox Plus and Marsh are transforming how the retail shipping industry approaches risk management—offering genuine insurance coverage that safeguards your customers’ property and your business reputation.

If you’re searching for <em>shipping insurance near Concord Township</em> or need <em>cargo and package coverage in Lake County, Ohio</em>, visit Mailbox Plus today to learn how full-coverage insurance can protect every shipment you send.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Shield, title: "Third-Party Protection", description: "Coverage provided through Marsh, a trusted insurer." },
            { icon: Package, title: "High Value Coverage", description: "Insure shipments valued up to $50,000." },
            { icon: Star, title: "Peace of Mind Guarantee", description: "We’ll handle your package with care—and insure it too." }
        ],
        faqs: insuranceFaqs
    },
    {
        id: "fedex-easy-returns",
        category: "additional-services",
        city: "Concord Township",
        serviceName: "FedEx Easy Returns",
        slug: "/fedex-easy-returns",
        pageTitle: "FedEx Easy Returns in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local FedEx Easy Returns in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "fedex easy returns, return qr code, return shipping label, concord township, lake county",
        heroTitle: "FedEx Easy Returns – Fast, Hassle-Free Returns",
        heroSubtitle: "Quick drop-offs, QR code scanning, label printing, and tracking receipts.",
        heroImage: getServiceImageUrl("/images/fedex-easy-returns.webp"),
        content: [], // Custom page implementation will handle content
        features: [], // Custom page implementation will handle features
        faqs: [] // Custom page implementation will handle FAQs
    },
    {
        id: "amazon-returns",
        category: "additional-services",
        city: "Concord Township",
        serviceName: "Amazon Return Guide",
        slug: "/amazon-returns",
        pageTitle: "Amazon Return Guide in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Amazon Return Guide in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "amazon returns, return shipping, pack and ship, concord township, lake county, printable label",
        heroTitle: "How to Return Items to Amazon",
        heroSubtitle: "Local Guide for Lake County, Ohio",
        heroImage: getServiceImageUrl("https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/how-to-return-items-to-amazon-2025-.webp"),
        content: [], // Custom page implementation will handle content
        features: [], // Custom page implementation will handle features
        faqs: [] // Custom page implementation will handle FAQs
    },
    {
        id: "ups-drop-off-alternative-concord-township",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "UPS Drop Off Alternative",
        slug: "/ups-drop-off-alternative-concord-township",
        pageTitle: "UPS Drop Off Alternative in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local UPS Drop Off Alternative including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "UPS drop off, Concord Township, Mailbox Plus, shipping",
        heroTitle: "Convenient UPS Drop Off in Concord Township: Mailbox Plus",
        heroSubtitle: "Looking for a quick and easy UPS drop-off location in Concord Township, Ohio? Mailbox Plus is your local solution.",
        heroImage: getServiceImageUrl("/images/ups-shipping.webp"),
        content: [
             {
                heading: "Convenient UPS Drop Off in Concord Township: Mailbox Plus",
                body: "Looking for a quick and easy <strong>UPS drop-off location in Concord Township, Ohio</strong>? \nMailbox Plus is your local solution. As an authorized shipping outlet, we accept all pre-labeled UPS packages. \nSkip the long lines at The UPS Store and drop off your packages with us in seconds. We also offer \n<strong> FedEx, USPS, and DHL</strong> services, making us the ultimate hub for all your shipping needs."
            },
            {
                heading: "Why Mailbox Plus is Better for Drop Offs",
                body: "• **Speed:** We get you in and out fast so you can get back to your day.\n• **No Waiting:** Avoid the crowds and long lines typical of franchise stores.\n• **Receipts:** We provide a drop-off receipt for tracking and peace of mind.\n• **Multi-Carrier:** We accept drop-offs for FedEx and USPS packages too.\n• **Friendly Staff:** Our team is always ready to help with a smile.\n• **Convenience:** Easy parking and a central location in Concord Township."
            },
            {
                heading: "Your Local Shipping Center",
                body: "• **UPS Services:** Authorized drop-off point for all UPS Ground and Air packages.\n• **FedEx & USPS:** We also accept drop-offs for FedEx and USPS shipments.\n• **Packing Help:** Need to repackage? We have boxes, tape, and bubble wrap for sale.\n• **Label Printing:** We can print your shipping label for you if you don't have a printer."
            }
        ],
        features: [
             { title: "Speed", description: "We get you in and out fast so you can get back to your day.", icon: Clock },
             { title: "No Waiting", description: "Avoid the crowds and long lines typical of franchise stores.", icon: Users },
             { title: "Receipts", description: "We provide a drop-off receipt for tracking and peace of mind.", icon: FileText }
        ],
        faqs: [
            {
                question: "Is there a fee to drop off packages?",
                answer: "No, there is no fee for dropping off pre-labeled UPS packages."
            },
            {
                question: "Do you provide a receipt?",
                answer: "Yes, we will scan your package and provide a receipt for tracking."
            },
            {
                question: "Can I drop off after hours?",
                answer: "No, for security reasons, packages must be dropped off during our business hours."
            }
        ]
    },
    {
        id: "ups-store-alternative-concord-township",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "UPS Store Alternative",
        slug: "/ups-store-alternative-concord-township",
        pageTitle: "UPS Store Alternative in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local UPS Store Alternative including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "UPS Store alternative, Concord Township, Mailbox Plus, shipping",
        heroTitle: "The Best UPS Store Alternative in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus is your locally owned and operated solution for all your shipping, packing, and business service needs.",
        heroImage: getServiceImageUrl("/images/ups-shipping.webp"),
        content: [
            {
                heading: "The Best UPS Store Alternative in Concord Township: Mailbox Plus",
                body: "Looking for a reliable <strong>UPS Store alternative in Concord Township, Ohio</strong>? \nMailbox Plus is your locally owned and operated solution for all your shipping, packing, and business service needs. \nWhile The UPS Store focuses primarily on one carrier, Mailbox Plus offers a multi-carrier advantage, giving you access to \n<strong> UPS, FedEx, USPS, and DHL</strong> services all under one roof. Whether you need to ship a package, \nnotarize a document, or rent a private mailbox, our friendly team provides personalized service that big box stores \noften lack. Skip the long lines and restrictive options—experience the convenience and flexibility of Mailbox Plus \nin Concord Township today."
            },
            {
                heading: "Why Mailbox Plus is the Better Choice",
                body: "• **Faster Service:** We prioritize efficiency so you can get in and out quickly without the long wait times.\n• **No Long Lines:** Avoid the crowds often found at franchise locations.\n• **Local Ownership:** We are part of the Concord Township community and care about our neighbors.\n• **Multi-Carrier Options:** We ship with UPS, FedEx, USPS, and DHL, allowing you to compare rates and delivery speeds.\n• **Transparent Pricing:** No hidden fees or surprises—just honest, competitive rates.\n• **More Services:** From fingerprinting to key duplication, we offer services that go beyond standard shipping."
            },
            {
                heading: "Services We Offer",
                body: "• **Shipping & Packing:** Authorized shipping for UPS, FedEx, USPS, and DHL. Professional packing for fragile and high-value items.\n• **Business Services:** Private mailbox rental, notary public, faxing, scanning, and shredding services.\n• **Printing & Copying:** High-quality color and B&W copies, business cards, flyers, and document finishing.\n• **Specialty Services:** Digital fingerprinting, passport photos, key cutting, and secure document destruction."
            }
        ],
        features: [
            { title: "Faster Service", description: "We prioritize efficiency so you can get in and out quickly.", icon: Clock },
            { title: "Multi-Carrier Options", description: "We ship with UPS, FedEx, USPS, and DHL.", icon: Truck },
            { title: "Local Ownership", description: "We are part of the Concord Township community.", icon: MapPin }
        ],
        faqs: [
            {
                question: "Can I ship FedEx or USPS at Mailbox Plus?",
                answer: "Yes! Unlike The UPS Store, we are an authorized shipping center for FedEx, USPS, UPS, and DHL, giving you more choices."
            },
            {
                question: "Do you offer notary services?",
                answer: "Absolutely. We have a commissioned notary public on-site to help with your legal documents. No appointment needed!"
            },
            {
                question: "Is Mailbox Plus locally owned?",
                answer: "Yes, we are a locally owned and operated independent business in Concord Township, committed to excellent customer service."
            }
        ]
    },
    {
        id: "mail-boxes-etc-alternative-concord-township",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Mail Boxes Etc. Alternative",
        slug: "/mail-boxes-etc-alternative-concord-township",
        pageTitle: "Mail Boxes Etc. Alternative in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Mail Boxes Etc. Alternative including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "Mail Boxes Etc. alternative, Concord Township, Mailbox Plus, shipping",
        heroTitle: "The Best Mail Boxes Etc. Alternative in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus fills the gap as your premier local solution for comprehensive shipping and business services.",
        heroImage: getServiceImageUrl("/images/pack-ship.webp"),
        content: [
            {
                heading: "The Best Mail Boxes Etc. Alternative in Concord Township: Mailbox Plus",
                body: "If you're searching for a <strong>Mail Boxes Etc. alternative in Concord Township, Ohio</strong>, \nlook no further than Mailbox Plus. While the Mail Boxes Etc. brand has largely transitioned, the need for comprehensive \nshipping and business services remains. Mailbox Plus fills that gap as your premier local solution, offering \n<strong> UPS, FedEx, USPS, and DHL</strong> shipping, private mailbox rentals, and professional printing. \nWe provide the personalized care and multi-carrier flexibility that modern businesses and residents demand. \nSkip the confusion and choose the clear local leader: Mailbox Plus."
            },
            {
                heading: "Why Choose Mailbox Plus?",
                body: "• **Faster Service:** We value your time and ensure a quick, efficient experience.\n• **No Long Lines:** Get the services you need without the wait.\n• **Local Ownership:** We are proud members of the Concord Township community.\n• **Multi-Carrier Options:** Access to all major carriers (UPS, FedEx, USPS, DHL) in one place.\n• **Transparent Pricing:** Competitive rates with no hidden fees.\n• **More Services:** Offering everything from notary services to passport photos."
            },
            {
                heading: "Complete Business & Shipping Solutions",
                body: "• **Multi-Carrier Shipping:** We ship everything from letters to freight using UPS, FedEx, USPS, and DHL.\n• **Mailbox Rentals:** Secure private mailboxes with a real street address, perfect for home-based businesses.\n• **Professional Printing:** From business cards to wide-format posters, we handle all your printing needs.\n• **Notary & More:** On-site notary public, faxing, scanning, and secure document shredding."
            }
        ],
        features: [
            { title: "Modern Services", description: "Up-to-date Technology", icon: Star },
            { title: "Carrier Choice", description: "All Major Carriers", icon: Truck },
            { title: "Community Focus", description: "Locally Owned & Operated", icon: Users }
        ],
        faqs: [
            {
                question: "Do you offer the same services as Mail Boxes Etc.?",
                answer: "Yes, and more! We offer comprehensive packing, shipping, printing, and business services with modern efficiency."
            },
            {
                question: "Can I rent a mailbox here?",
                answer: "Yes, we offer private mailbox rentals with a real street address, ensuring security and professionalism for your mail."
            },
            {
                question: "What carriers do you support?",
                answer: "We support all major carriers: UPS, FedEx, USPS, and DHL, giving you the power of choice."
            }
        ]
    },
    {
        id: "fedex-office-alternative-concord-township",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "FedEx Office Alternative",
        slug: "/fedex-office-alternative-concord-township",
        pageTitle: "FedEx Office Alternative in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local FedEx Office Alternative including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "FedEx Office alternative, Concord Township, Mailbox Plus, shipping",
        heroTitle: "The Best FedEx Office Alternative in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus provides the same high-quality packing, shipping, and printing services you expect, but with multi-carrier options.",
        heroImage: getServiceImageUrl("/images/fedex-shipping.webp"),
        content: [
            {
                heading: "The Best FedEx Office Alternative in Concord Township: Mailbox Plus",
                body: "Searching for a <strong>FedEx Office alternative in Concord Township, Ohio</strong>? \nMailbox Plus provides the same high-quality packing, shipping, and printing services you expect, \nbut with the added benefit of being a multi-carrier center. Unlike FedEx Office, which only ships FedEx, \nMailbox Plus allows you to compare options from <strong>FedEx, UPS, USPS, and DHL</strong> to find the best rate \nand delivery speed for your needs. Enjoy personalized service, shorter lines, and a locally owned atmosphere \nthat puts you first."
            },
            {
                heading: "Why Mailbox Plus Beats the Competition",
                body: "• **Faster Service:** Skip the long lines typical of big box stores.\n• **No Long Lines:** We value your time and get you on your way quickly.\n• **Local Ownership:** We are a dedicated part of the Concord Township community.\n• **Multi-Carrier Options:** We aren't limited to just FedEx; we offer UPS, USPS, and DHL too.\n• **Transparent Pricing:** Honest rates with no hidden surprises.\n• **More Services:** From notary public to key duplication, we do it all."
            },
            {
                heading: "Your One-Stop Business Center",
                body: "• **Authorized Shipping:** Official ship center for FedEx, UPS, USPS, and DHL.\n• **Print & Copy:** Professional color and B&W copies, binding, laminating, and business cards.\n• **Office Services:** Notary public, faxing, scanning, and secure document shredding.\n• **Rentals & Returns:** Private mailbox rentals and easy returns for FedEx, Amazon, and more."
            }
        ],
        features: [
            { title: "Carrier Variety", description: "FedEx, UPS, USPS, DHL", icon: Truck },
            { title: "Price Comparison", description: "Shop rates across carriers", icon: Shield },
            { title: "Convenience", description: "Quick In & Out", icon: Clock }
        ],
        faqs: [
            {
                question: "Can I drop off pre-labeled FedEx packages?",
                answer: "Yes! We accept drop-offs for FedEx as well as UPS and USPS packages."
            },
            {
                question: "Do you offer printing services like FedEx Office?",
                answer: "Yes, we offer a full range of copying and printing services, including business cards, flyers, and document finishing."
            },
            {
                question: "Is there a notary on site?",
                answer: "Yes, we have a commissioned notary public available during all business hours."
            }
        ]
    },
    {
        id: "post-office-alternative-concord-township",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Post Office Alternative",
        slug: "/post-office-alternative-concord-township",
        pageTitle: "Post Office Alternative in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Post Office Alternative including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "Post Office alternative, Concord Township, Mailbox Plus, shipping",
        heroTitle: "The Best Post Office Alternative in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus offers all the essential shipping services you need in a friendly, customer-focused environment.",
        heroImage: getServiceImageUrl("/images/usps-services.webp"),
        content: [
            {
                heading: "The Best Post Office Alternative in Concord Township: Mailbox Plus",
                body: "Tired of the long lines and limited hours at the local Post Office? \nMailbox Plus is the premier <strong>Post Office alternative in Concord Township, Ohio</strong>. \nWe offer all the essential shipping services you need—including <strong>USPS, UPS, FedEx, and DHL</strong>—in a friendly, \ncustomer-focused environment. From certified mail to package drop-offs and stamp sales, we handle it all with speed \nand efficiency. Experience the difference of a shipping center that puts you first."
            },
            {
                heading: "Why Choose Mailbox Plus Over the Post Office?",
                body: "• **Faster Service:** We pride ourselves on quick, efficient transactions.\n• **No Long Lines:** Don't waste your lunch break waiting in line.\n• **Local Ownership:** We are a small business dedicated to our Concord Township community.\n• **Multi-Carrier Options:** Unlike the Post Office, we offer UPS, FedEx, and DHL options too.\n• **Transparent Pricing:** We help you find the most cost-effective shipping method.\n• **More Services:** Notary, fax, copy, and shredding services are all available here."
            },
            {
                heading: "Complete Shipping & Postal Services",
                body: "• **USPS Shipping:** Access Priority Mail, Express, First Class, and International shipping.\n• **Private Mailboxes:** Secure mailboxes with a street address, package receiving, and 24/7 access options.\n• **Stamps & Supplies:** Buy stamps and get professional packing supplies without the hassle.\n• **Multi-Carrier Choice:** We also ship via UPS, FedEx, and DHL for when USPS isn't the best fit."
            }
        ],
        features: [
            { title: "Faster Service", description: "We pride ourselves on quick, efficient transactions.", icon: Clock },
            { title: "Carrier Flexibility", description: "USPS, UPS, FedEx, DHL", icon: Truck },
            { title: "Customer Service", description: "Personalized Assistance", icon: Users }
        ],
        faqs: [
            {
                question: "Are your USPS prices the same as the Post Office?",
                answer: "We offer competitive pricing on all USPS services, often matching retail rates for convenience."
            },
            {
                question: "Can I renew my PO Box here?",
                answer: "If you rent a private mailbox with us, yes! We offer secure mailbox rentals with real street addresses."
            },
            {
                question: "Do you offer Certified Mail?",
                answer: "Yes, we can help you send letters via Certified Mail with Return Receipt, just like the Post Office."
            }
        ]
    },
    {
        id: "shipping-center-concord-township",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Shipping Center",
        slug: "/shipping-center-concord-township",
        pageTitle: "Shipping Center in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Shipping Center including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "shipping center, Concord Township, Mailbox Plus, shipping",
        heroTitle: "Your Premier Shipping Center in Concord Township: Mailbox Plus",
        heroSubtitle: "We provide a complete range of shipping and business services to meet the needs of residents and small businesses alike.",
        heroImage: getServiceImageUrl("/images/pack-ship.webp"),
        content: [
            {
                heading: "Your Premier Shipping Center in Concord Township: Mailbox Plus",
                body: "Welcome to Mailbox Plus, the leading <strong>shipping center in Concord Township, Ohio</strong>. \nWe provide a complete range of shipping and business services to meet the needs of residents and small businesses alike. \nAs an authorized shipping outlet for <strong>UPS, FedEx, USPS, and DHL</strong>, we offer you the unique ability to compare rates \nand delivery times across all major carriers. Whether you're sending a care package to college or shipping products for your business, \nour expert team is here to ensure your items arrive safely and on time."
            },
            {
                heading: "Why Mailbox Plus is Concord Township's Top Shipping Choice",
                body: "• **Convenience:** One stop for all your shipping, packing, and business needs.\n• **Choice:** We are the only local center offering UPS, FedEx, USPS, and DHL under one roof.\n• **Local Ownership:** We are your neighbors, dedicated to serving our community with care.\n• **Efficiency:** Fast service means you get back to your day sooner.\n• **Expertise:** Our staff are trained packing and shipping professionals.\n• **Value:** Competitive pricing and the ability to shop around for the best rate."
            },
            {
                heading: "Full-Service Shipping Solutions",
                body: "• **Domestic Shipping:** Ground, Express, and Overnight shipping options to anywhere in the US.\n• **International Shipping:** Reach the world with our global shipping partners: DHL, FedEx, and UPS.\n• **Professional Packing:** We pack it right to protect your items and meet carrier insurance standards.\n• **Package Receiving:** Never worry about porch pirates again with our secure package receiving service."
            }
        ],
        features: [
            { title: "Convenience", description: "One stop for all your shipping needs.", icon: MapPin },
            { title: "Choice", description: "UPS, FedEx, USPS, and DHL under one roof.", icon: Truck },
            { title: "Expertise", description: "Trained packing and shipping professionals.", icon: Star }
        ],
        faqs: [
            {
                question: "What is the latest time I can drop off a package?",
                answer: "Our carrier pickup times vary, but we accept drop-offs during all business hours. Call us for specific cutoff times."
            },
            {
                question: "Can you pack my item for me?",
                answer: "Yes, we offer full-service professional packing to ensure your items are safe during transit."
            },
            {
                question: "Do you ship furniture?",
                answer: "We can handle many large items. Please contact us with the dimensions and weight for a quote."
            }
        ]
    },
    {
        id: "pack-and-ship-services-concord-township",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Pack and Ship Services",
        slug: "/pack-and-ship-services-concord-township",
        pageTitle: "Pack and Ship Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Pack and Ship Services including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "pack and ship services, Concord Township, Mailbox Plus, shipping",
        heroTitle: "Professional Pack and Ship Services in Concord Township: Mailbox Plus",
        heroSubtitle: "When you need expert pack and ship services in Concord Township, Ohio, trust the pros at Mailbox Plus.",
        heroImage: getServiceImageUrl("/images/professional-packing.webp"),
        content: [
            {
                heading: "Professional Pack and Ship Services in Concord Township: Mailbox Plus",
                body: "When you need expert <strong>pack and ship services in Concord Township, Ohio</strong>, trust the pros at Mailbox Plus. \nPacking can be stressful and time-consuming, but our team makes it easy. We use high-quality materials and professional \ntechniques to ensure your items—whether fragile, valuable, or awkward—arrive safely. As an authorized \nshipper for <strong>UPS, FedEx, USPS, and DHL</strong>, we can pack your item and ship it using the carrier that best fits \nyour budget and timeline."
            },
            {
                heading: "Why Choose Mailbox Plus for Packing?",
                body: "• **Expert Packing:** We know exactly how to protect your items for transit.\n• **Peace of Mind:** Our professional packing often qualifies for carrier insurance guarantees.\n• **Convenience:** Bring in your item, and we'll handle the box, bubble wrap, and tape.\n• **Multi-Carrier Shipping:** Once packed, we can ship it via UPS, FedEx, USPS, or DHL.\n• **Time Saving:** Stop hunting for the right size box—we have it all here.\n• **Custom Solutions:** We can build custom boxes for odd-shaped or large items."
            },
            {
                heading: "Complete Packing & Shipping Solutions",
                body: "• **Professional Packing:** From antiques to electronics, we pack it all with care and precision.\n• **Custom Boxing:** We create custom boxes to fit unique items perfectly.\n• **Shipping Supplies:** Purchase boxes, tape, bubble wrap, and peanuts for your DIY packing needs.\n• **Freight Shipping:** Assistance with palletizing and shipping larger freight items."
            }
        ],
        features: [
            { title: "Expert Packing", description: "We know exactly how to protect your items.", icon: Shield },
            { title: "Convenience", description: "We handle the box, bubble wrap, and tape.", icon: Box },
            { title: "Multi-Carrier", description: "Ship via UPS, FedEx, USPS, or DHL.", icon: Truck }
        ],
        faqs: [
            {
                question: "How much does packing cost?",
                answer: "The cost depends on the size, weight, and fragility of the item. Bring it in for a free quote!"
            },
            {
                question: "Can you pack fragile items like glass?",
                answer: "Absolutely. We use specialized materials like bubble wrap, foam, and peanuts to protect fragile items."
            },
            {
                question: "Do you have boxes for moving?",
                answer: "Yes, we sell a variety of box sizes perfect for moving or storage."
            }
        ]
    },
    {
        id: "ups-fedex-usps-dhl-shipping-concord-township",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "UPS, FedEx, USPS, DHL Shipping",
        slug: "/ups-fedex-usps-dhl-shipping-concord-township",
        pageTitle: "UPS, FedEx, USPS, DHL Shipping in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local UPS, FedEx, USPS, and DHL Shipping services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "UPS FedEx USPS DHL shipping, Concord Township, Mailbox Plus",
        heroTitle: "Ship with UPS, FedEx, USPS, and DHL in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus is your all-in-one shipping destination in Concord Township, Ohio.",
        heroImage: getServiceImageUrl("/images/pack-ship.webp"),
        content: [
            {
                heading: "Ship with UPS, FedEx, USPS, and DHL in Concord Township: Mailbox Plus",
                body: "Looking for a place where you can ship with <strong>UPS, FedEx, USPS, and DHL in Concord Township, Ohio</strong>? \nMailbox Plus is your all-in-one shipping destination. Why limit yourself to just one carrier when you can have them all? \nWe are authorized shipping partners for all major carriers, giving you the power to compare rates, delivery speeds, \nand services to find the perfect fit for every package. From overnight documents to international freight, \nwe have the right solution for you."
            },
            {
                heading: "The Power of Choice at Mailbox Plus",
                body: "• **Compare & Save:** We can show you rates from all 4 carriers side-by-side.\n• **One Stop Shop:** No need to drive to multiple stores to ship different packages.\n• **Expert Advice:** Our staff understands the strengths of each carrier and can guide you.\n• **Local Convenience:** Located right here in Concord Township for easy access.\n• **Authorized Center:** We are official partners, ensuring your packages are handled correctly.\n• **Returns Accepted:** We accept drop-offs for all carriers too."
            },
            {
                heading: "Our Shipping Partners",
                body: "• **UPS Shipping:** Reliable ground and air services for domestic and international shipments.\n• **FedEx Shipping:** Fast express and economical ground options for time-sensitive packages.\n• **USPS Shipping:** Priority Mail, First Class, and flat-rate boxes for cost-effective shipping.\n• **DHL International:** The world leader in international shipping for documents and parcels."
            }
        ],
        features: [
            { title: "Compare & Save", description: "Show rates from all 4 carriers side-by-side.", icon: Shield },
            { title: "One Stop Shop", description: "No need to drive to multiple stores.", icon: MapPin },
            { title: "Expert Advice", description: "Our staff can guide you on the best carrier.", icon: Users }
        ],
        faqs: [
            {
                question: "Which carrier is the cheapest?",
                answer: "It depends on the package size, weight, and destination. We can compare them all instantly to find the lowest price."
            },
            {
                question: "Which carrier is the fastest?",
                answer: "FedEx and UPS often offer the fastest express options, but DHL is excellent for international speed."
            },
            {
                question: "Do you take drop-offs for all carriers?",
                answer: "Yes! We accept prepaid drop-off packages for UPS, FedEx, USPS, and DHL."
            }
        ]
    },
    {
        id: "small-business-shipping-concord-township",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Small Business Shipping",
        slug: "/small-business-shipping-concord-township",
        pageTitle: "Small Business Shipping in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Small Business Shipping solutions including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "small business shipping, Concord Township, Mailbox Plus",
        heroTitle: "Small Business Shipping Solutions in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus acts as your off-site logistics department, providing access to UPS, FedEx, USPS, and DHL all in one place.",
        heroImage: getServiceImageUrl("/images/pack-ship.webp"),
        content: [
            {
                heading: "Small Business Shipping Solutions in Concord Township: Mailbox Plus",
                body: "Running a business is hard work, but shipping doesn't have to be. Mailbox Plus specializes in \n<strong>small business shipping in Concord Township, Ohio</strong>. We act as your off-site logistics department, \nproviding access to <strong>UPS, FedEx, USPS, and DHL</strong> all in one place. From sending out orders to managing returns, \nwe help you streamline your shipping process so you can focus on growing your business. \nEnjoy personalized support, volume discounts potential, and a partner who truly cares about your success."
            },
            {
                heading: "Your Business Logistics Partner",
                body: "• **Time Efficiency:** Drop off all your packages for different carriers in one stop.\n• **Cost Savings:** We help you find the most economical shipping method for every order.\n• **Professional Image:** Rent a mailbox for a professional street address, not a PO Box.\n• **Reliability:** Trust us to pack and ship your products safely to your customers.\n• **Support:** We are always here to answer your questions and solve shipping problems.\n• **Local Focus:** We understand the needs of local businesses in Concord Township."
            },
            {
                heading: "Services That Scale With You",
                body: "• **Multi-Carrier Shipping:** Choose the best carrier for each shipment based on price and speed.\n• **Business Printing:** Marketing materials, invoices, and labels printed on demand.\n• **Mailbox Rentals:** Secure package receiving from all carriers to keep your home address private.\n• **Fulfillment Help:** We can help pack and ship your orders during busy seasons."
            }
        ],
        features: [
            { title: "Time Efficiency", description: "Drop off all packages in one stop.", icon: Clock },
            { title: "Cost Savings", description: "Find the most economical shipping method.", icon: Shield },
            { title: "Professional Image", description: "Rent a mailbox for a professional street address.", icon: FileText }
        ],
        faqs: [
            {
                question: "Do you offer business accounts?",
                answer: "We offer personalized services for frequent shippers. Stop in to discuss how we can support your business needs."
            },
            {
                question: "Can I receive shipments from suppliers here?",
                answer: "Yes! With a private mailbox rental, you can receive packages from any carrier, ensuring your inventory arrives safely."
            },
            {
                question: "What about international shipping?",
                answer: "We are experts in international shipping and can help you navigate customs forms to get your products to global customers."
            }
        ]
    },
    {
        id: "usps-drop-off-alternative-concord-township",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "USPS Drop Off Alternative",
        slug: "/usps-drop-off-alternative-concord-township",
        pageTitle: "USPS Drop Off Alternative in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local USPS Drop Off Alternative including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "USPS drop off alternative, Concord Township, Mailbox Plus",
        heroTitle: "Convenient USPS Drop Off & Shipping in Concord Township: Mailbox Plus",
        heroSubtitle: "Skip the long lines at the Post Office and head to Mailbox Plus for quick and easy USPS drop-offs.",
        heroImage: getServiceImageUrl("/images/usps-services.webp"),
        content: [
            {
                heading: "Convenient USPS Drop Off & Shipping in Concord Township: Mailbox Plus",
                body: "Looking for a better <strong>USPS drop-off location in Concord Township, Ohio</strong>? \nSkip the long lines at the Post Office and head to Mailbox Plus. We are an authorized shipping center that makes \ndropping off your USPS packages quick and easy. But we don't just stop at USPS; we also offer \n<strong> UPS, FedEx, and DHL</strong> shipping services, giving you the flexibility to choose the best carrier \nfor every package. Enjoy a friendly, stress-free experience with shorter wait times and personalized service."
            },
            {
                heading: "Why Drop Off at Mailbox Plus?",
                body: "• **Faster Service:** In and out in minutes—no waiting in endless lines.\n• **No Long Lines:** A more convenient alternative to the busy Post Office.\n• **Local Ownership:** Supporting a local business that cares about your satisfaction.\n• **Multi-Carrier Options:** We accept drop-offs for UPS and FedEx too.\n• **Transparent Pricing:** If you need to buy postage, we offer fair and clear rates.\n• **More Services:** Pick up some stamps, rent a mailbox, or get documents notarized while you're here."
            },
            {
                heading: "Your Local Shipping Hub",
                body: "• **USPS Services:** Priority Mail, First Class, Certified Mail, and stamp sales.\n• **Package Drop-Offs:** Accepting pre-labeled packages for USPS, UPS, and FedEx.\n• **Multi-Carrier Shipping:** Compare rates across carriers to save money on your shipments.\n• **Packing Services:** Professional packing to ensure your items arrive safely."
            }
        ],
        features: [
            { title: "Faster Service", description: "In and out in minutes.", icon: Clock },
            { title: "No Long Lines", description: "Convenient alternative to the Post Office.", icon: Users },
            { title: "Multi-Carrier Options", description: "We accept drop-offs for UPS and FedEx too.", icon: Truck }
        ],
        faqs: [
            {
                question: "Can I drop off any USPS package here?",
                answer: "Yes, as long as it has a prepaid label, you can drop it off. We also sell postage for packages that need it."
            },
            {
                question: "Do you sell stamps?",
                answer: "Yes, we sell standard USPS postage stamps."
            },
            {
                question: "Is it faster than the Post Office?",
                answer: "Generally, yes! Our lines are typically much shorter, allowing you to get in and out quickly."
            }
        ]
    },
    {
        id: "usps-package-help-concord-township",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "USPS Package Help",
        slug: "/usps-package-help-concord-township",
        pageTitle: "USPS Package Help in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local USPS Package Help including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "USPS package help, Concord Township, Mailbox Plus",
        heroTitle: "Expert USPS Package Help in Concord Township: Mailbox Plus",
        heroSubtitle: "Need USPS package help in Concord Township, Ohio? Mailbox Plus is here to assist.",
        heroImage: getServiceImageUrl("/images/usps-services.webp"),
        content: [
            {
                heading: "Expert USPS Package Help in Concord Township: Mailbox Plus",
                body: "Need <strong>USPS package help in Concord Township, Ohio</strong>? \nWhether you're unsure about postage, need help packing a fragile item, or want to track a shipment, \nMailbox Plus is here to assist. As an authorized shipping center, we provide expert guidance on all \n<strong> USPS, UPS, FedEx, and DHL</strong> services. Don't struggle with complicated shipping rules or \nwait on hold—come to Mailbox Plus for personal, face-to-face assistance from our knowledgeable staff."
            },
            {
                heading: "Why Get Help at Mailbox Plus?",
                body: "• **Expert Advice:** We know the ins and outs of shipping and can recommend the best options.\n• **No Long Lines:** Get your questions answered quickly without the Post Office wait.\n• **Local Ownership:** We care about our customers and provide a friendly, helpful atmosphere.\n• **Multi-Carrier Solutions:** If USPS isn't the right fit, we can suggest UPS, FedEx, or DHL.\n• **Transparent Pricing:** We'll help you find the most affordable way to ship.\n• **More Services:** From professional packing to insurance, we have you covered."
            },
            {
                heading: "Complete Shipping Assistance",
                body: "• **Packing Services:** Let us pack your items professionally to ensure they arrive safely.\n• **Shipping Options:** We'll help you choose between Priority Mail, Express, Ground, and more.\n• **International Shipping:** Guidance on customs forms and international shipping regulations.\n• **Returns Assistance:** Help with printing labels and returning packages to online retailers."
            }
        ],
        features: [
            { title: "Expert Advice", description: "We know the ins and outs of shipping.", icon: Star },
            { title: "No Long Lines", description: "Get your questions answered quickly.", icon: Clock },
            { title: "Multi-Carrier", description: "We can suggest UPS, FedEx, or DHL.", icon: Truck }
        ],
        faqs: [
            {
                question: "Can you help me pack fragile items?",
                answer: "Yes! We specialize in professional packing for fragile, valuable, and odd-shaped items."
            },
            {
                question: "Do you sell boxes and tape?",
                answer: "Yes, we have a full selection of packaging supplies available for purchase."
            },
            {
                question: "What if I don't know which carrier to use?",
                answer: "No problem! We can compare rates and delivery times for UPS, FedEx, USPS, and DHL to find the best option for you."
            }
        ]
    },
    {
        id: "staples-printing-alternative-concord-township",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Staples Printing Alternative",
        slug: "/staples-printing-alternative-concord-township",
        pageTitle: "Staples Printing Alternative in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Staples Alternative for printing and shipping. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "Staples printing alternative, Concord Township, Mailbox Plus",
        heroTitle: "The Best Staples Printing Alternative in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus offers high-quality document services without the big-box store hassle.",
        heroImage: getServiceImageUrl("/images/document-printing.webp"),
        content: [
            {
                heading: "The Best Staples Printing Alternative in Concord Township: Mailbox Plus",
                body: "Need a <strong>Staples alternative for printing and shipping in Concord Township, Ohio</strong>? \nMailbox Plus offers high-quality document services without the big-box store hassle. Whether you need \nbusiness cards, flyers, or secure shredding, our local team provides the personalized attention your projects deserve. \nWe are also a full-service shipping center for <strong>UPS, FedEx, USPS, and DHL</strong>, making us a one-stop shop \nfor all your business needs. Experience the difference of a locally owned business that puts quality and customer service first."
            },
            {
                heading: "Why Choose Mailbox Plus Over Staples?",
                body: "• **Personalized Attention:** We take the time to ensure your print jobs are perfect.\n• **No Long Lines:** Get your errands done quickly without the crowd.\n• **Local Ownership:** Your business supports the Concord Township community.\n• **Multi-Carrier Shipping:** Unlike Staples (which often limits carrier options), we ship via UPS, FedEx, USPS, and DHL.\n• **Transparent Pricing:** Competitive rates for printing and shipping.\n• **More Services:** We offer notary, fingerprinting, and mailbox rentals too."
            },
            {
                heading: "Printing & Business Services",
                body: "• **Document Services:** Color/B&W copies, laminating, binding, and scanning services.\n• **Print Marketing:** Business cards, flyers, brochures, and postcards to promote your business.\n• **Shipping Center:** Authorized shipping for all major carriers: UPS, FedEx, USPS, DHL.\n• **Secure Shredding:** Safe and secure document destruction to protect your sensitive information."
            }
        ],
        features: [
            { title: "Customer Focus", description: "Personalized Local Service.", icon: Users },
            { title: "Shipping Options", description: "UPS, FedEx, USPS, DHL.", icon: Truck },
            { title: "Efficiency", description: "Fast In & Out.", icon: Clock }
        ],
        faqs: [
            {
                question: "Do you offer the same printing services as Staples?",
                answer: "We offer a wide range of essential business printing services including copies, flyers, and business cards with faster turnaround times."
            },
            {
                question: "Can I ship packages here too?",
                answer: "Yes! We are a comprehensive shipping center for UPS, FedEx, USPS, and DHL."
            },
            {
                question: "Do you offer shredding services?",
                answer: "Yes, we provide secure document destruction to keep your sensitive information safe."
            }
        ]
    },
    {
        id: "office-depot-alternative-concord-township",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Office Depot Alternative",
        slug: "/office-depot-alternative-concord-township",
        pageTitle: "Office Depot Alternative in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Office Depot Alternative for business services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "Office Depot alternative, Concord Township, Mailbox Plus",
        heroTitle: "The Best Office Depot Alternative in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus provides the essential business services you rely on, right in your neighborhood.",
        heroImage: getServiceImageUrl("/images/document-printing.webp"),
        content: [
            {
                heading: "The Best Office Depot Alternative in Concord Township: Mailbox Plus",
                body: "Looking for an <strong>Office Depot alternative in Concord Township, Ohio</strong>? \nMailbox Plus provides the essential business services you rely on, right in your neighborhood. \nFrom professional printing and copying to shipping and mailbox rentals, we offer a more personalized and efficient experience than the big chain stores. \nPlus, as a multi-carrier shipping center, we give you more choices with <strong>UPS, FedEx, USPS, and DHL</strong> all in one location. \nChoose Mailbox Plus for friendly service and expert solutions."
            },
            {
                heading: "Why Mailbox Plus is Your Best Choice",
                body: "• **Faster Service:** We get you in and out quickly, respecting your busy schedule.\n• **No Long Lines:** Avoid the wait times often found at Office Depot.\n• **Local Ownership:** We are a locally owned business invested in our community.\n• **Multi-Carrier Shipping:** Compare rates and services from UPS, FedEx, USPS, and DHL.\n• **Transparent Pricing:** Fair prices for all our services.\n• **More Services:** We offer comprehensive solutions like notary, shredding, and fingerprinting."
            },
            {
                heading: "Comprehensive Business Services",
                body: "• **Printing & Copying:** High-quality copies, business cards, flyers, and document finishing services.\n• **Shipping & Packing:** Authorized shipping center for UPS, FedEx, USPS, and DHL with professional packing.\n• **Mailbox Services:** Secure private mailboxes with package receiving from all carriers.\n• **Office Essentials:** Notary public, faxing, scanning, and secure shredding services."
            }
        ],
        features: [
            { title: "Service Experience", description: "Personal & Efficient.", icon: Star },
            { title: "Shipping Carriers", description: "UPS, FedEx, USPS, DHL.", icon: Truck },
            { title: "Waiting Time", description: "Minimal.", icon: Clock }
        ],
        faqs: [
            {
                question: "What shipping services do you offer?",
                answer: "We offer shipping via UPS, FedEx, USPS, and DHL, allowing you to choose the best option for your needs."
            },
            {
                question: "Can I get documents printed here?",
                answer: "Absolutely! We handle copies, business cards, flyers, and more with professional quality."
            },
            {
                question: "Do you offer notary services?",
                answer: "Yes, our on-site notary is available to assist you with your legal documents."
            }
        ]
    },
    {
        id: "printing-services-concord-township",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Printing Services",
        slug: "/printing-services-concord-township",
        pageTitle: "Printing Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Printing Services including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "printing services, Concord Township, Mailbox Plus",
        heroTitle: "High-Quality Printing Services in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus is your local print shop for everything from business cards and flyers to documents and presentations.",
        heroImage: getServiceImageUrl("/images/document-printing.webp"),
        content: [
            {
                heading: "High-Quality Printing Services in Concord Township: Mailbox Plus",
                body: "Looking for professional <strong>printing services in Concord Township, Ohio</strong>? \nMailbox Plus is your local print shop for everything from business cards and flyers to documents and presentations. \nWe offer high-quality color and black & white printing with fast turnaround times. Whether you're a student, \na small business owner, or just need a few copies, our friendly team is here to help your projects look their best. \nPlus, we can ship your printed materials anywhere with <strong>UPS, FedEx, USPS, and DHL</strong>."
            },
            {
                heading: "Why Print with Mailbox Plus?",
                body: "• **Quality:** We use professional-grade equipment for crisp, clear results.\n• **Speed:** Same-day service available for many print jobs.\n• **Convenience:** Email us your files or bring them in on a USB drive.\n• **Personal Service:** We take the time to check your files and ensure they print correctly.\n• **Full Service:** We can print, bind, laminate, and ship your documents all in one visit.\n• **Local Value:** Competitive pricing without the big box store hassle."
            },
            {
                heading: "Complete Printing Solutions",
                body: "• **Document Printing:** Resumes, reports, presentations, and flyers in color or B&W.\n• **Business Cards:** Make a great first impression with professionally printed business cards.\n• **Finishing Services:** Binding, laminating, stapling, and folding to give your project a polished look.\n• **Digital Services:** Scan documents to email or USB for easy digital archiving."
            }
        ],
        features: [
            { title: "Print Quality", description: "Professional Laser.", icon: Printer },
            { title: "Cost per Page", description: "Efficient / Bulk Rates.", icon: Star },
            { title: "Speed", description: "High Volume Fast.", icon: Clock }
        ],
        faqs: [
            {
                question: "How do I send you my file?",
                answer: "You can email it to us or bring it in on a USB drive."
            },
            {
                question: "Do you print in color?",
                answer: "Yes, we offer full-color and black & white printing on a variety of paper sizes."
            },
            {
                question: "Can you laminate documents?",
                answer: "Yes, we offer laminating services to protect your important documents."
            }
        ]
    },
    {
        id: "document-services-concord-township",
        category: "document-services",
        city: "Concord Township",
        serviceName: "Document Services",
        slug: "/document-services-concord-township",
        pageTitle: "Document Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Document Services including printing, scanning, shredding, and notary. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "document services, Concord Township, Mailbox Plus",
        heroTitle: "Professional Document Services in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus is your trusted provider of document services in Concord Township, Ohio.",
        heroImage: getServiceImageUrl("/images/document-printing.webp"),
        content: [
            {
                heading: "Professional Document Services in Concord Township: Mailbox Plus",
                body: "Mailbox Plus is your trusted provider of <strong>document services in Concord Township, Ohio</strong>. \nWhether you need to print a report, notarize a legal form, or securely shred sensitive files, our experienced team \nis here to assist. We offer a full suite of services to help you manage your personal and business paperwork \nwith ease and confidentiality. Skip the office supply store lines and enjoy personalized service right in your neighborhood."
            },
            {
                heading: "Why Choose Mailbox Plus for Documents?",
                body: "• **Security:** We handle your sensitive documents with the utmost care and confidentiality.\n• **Convenience:** Print, scan, fax, notarize, and shred all in one place.\n• **Expertise:** Our staff is trained to handle complex print jobs and notary requirements.\n• **Speed:** Get your tasks done quickly so you can get back to your day.\n• **Local Focus:** We are proud to serve the document needs of the Concord Township community.\n• **One-Stop Shop:** We also offer shipping and packing services if you need to send your documents."
            },
            {
                heading: "Complete Document Solutions",
                body: "• **Printing & Copying:** High-quality color and B&W reproduction for all your document needs.\n• **Notary Services:** Official notarization for wills, deeds, contracts, and other legal forms.\n• **Secure Shredding:** Safe destruction of confidential documents to prevent identity theft.\n• **Scanning & Faxing:** Digitize your paper files or send them quickly via fax."
            }
        ],
        features: [
            { title: "Privacy", description: "Discreet & Secure.", icon: Lock },
            { title: "Service Speed", description: "Fast & Efficient.", icon: Clock },
            { title: "Personal Attention", description: "Dedicated Staff.", icon: Users }
        ],
        faqs: [
            {
                question: "What documents can you notarize?",
                answer: "We can notarize most documents, including wills, powers of attorney, and real estate forms. Please bring a valid ID."
            },
            {
                question: "Is your shredding service secure?",
                answer: "Yes, we place your documents in a locked bin until they are securely shredded by a certified service."
            },
            {
                question: "Can you scan multiple pages to one PDF?",
                answer: "Yes, our high-speed scanners can combine multiple pages into a single digital file for easy emailing."
            }
        ]
    },
    {
        id: "private-mailbox-rental-concord-township",
        category: "mailbox-rentals",
        city: "Concord Township",
        serviceName: "Private Mailbox Rental",
        slug: "/private-mailbox-rental-concord-township",
        pageTitle: "Private Mailbox Rental in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Private Mailbox Rental including UPS, FedEx, USPS, and DHL package receiving. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "private mailbox rental, Concord Township, Mailbox Plus",
        heroTitle: "Secure Private Mailbox Rental in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus offers more than just a key and a box; we provide a complete mail management solution.",
        heroImage: getServiceImageUrl("/images/mailbox-rental.webp"),
        content: [
            {
                heading: "Secure Private Mailbox Rental in Concord Township: Mailbox Plus",
                body: "Looking for a secure and professional <strong>private mailbox rental in Concord Township, Ohio</strong>? \nMailbox Plus offers more than just a key and a box; we provide a complete mail management solution. \nUnlike a standard PO Box, our mailboxes come with a real street address, allowing you to receive packages from \n<strong> UPS, FedEx, USPS, and DHL</strong>. Whether you run a home-based business or just want extra privacy \nfor your personal mail, our private mailboxes are the perfect answer."
            },
            {
                heading: "Benefits of Renting a Mailbox at Mailbox Plus",
                body: "• **Real Street Address:** Enhance your professional image with a physical address, not a PO Box number.\n• **Package Receiving:** We accept packages from all carriers, so you never miss a delivery.\n• **Security:** Keep your mail safe and your home address private.\n• **Notification:** We can let you know when you have mail, saving you unnecessary trips.\n• **24-Hour Access:** (Optional) Ask about our 24/7 access options for your convenience.\n• **Mail Forwarding:** Traveling? We can forward your mail to you wherever you are."
            },
            {
                heading: "More Than Just a Mailbox",
                body: "• **Package Acceptance:** We sign for your packages so they aren't left unattended on your porch.\n• **Business Address:** Use our address for your business cards, website, and registration.\n• **Mail Forwarding:** We can bundle and ship your mail to you anywhere in the world.\n• **Call-in Check:** Call us to see if you have mail before you drive over."
            }
        ],
        features: [
            { title: "Address Format", description: "Street Address.", icon: MapPin },
            { title: "Package Acceptance", description: "UPS, FedEx, USPS, DHL.", icon: Package },
            { title: "Professional Image", description: "High.", icon: Star }
        ],
        faqs: [
            {
                question: "What does my address look like?",
                answer: "Your address will be our street address with your unit number, e.g., 123 Main St #101."
            },
            {
                question: "How do I know if I have mail?",
                answer: "You can call us during business hours, or we can set up email notifications."
            },
            {
                question: "Can someone else pick up my mail?",
                answer: "Yes, you can authorize other individuals to pick up mail from your box."
            }
        ]
    },
    {
        id: "virtual-mailbox-concord-township",
        category: "mailbox-rentals",
        city: "Concord Township",
        serviceName: "Virtual Mailbox",
        slug: "/virtual-mailbox-concord-township",
        pageTitle: "Virtual Mailbox in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Virtual Mailbox services including digital mail scanning and forwarding. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "virtual mailbox, Concord Township, Mailbox Plus",
        heroTitle: "Digital & Virtual Mailbox Services in Concord Township: Mailbox Plus",
        heroSubtitle: "Welcome to the future of mail management with Mailbox Plus's virtual mailbox services.",
        heroImage: getServiceImageUrl("/images/digital-mailbox-rental.webp"),
        content: [
            {
                heading: "Digital & Virtual Mailbox Services in Concord Township: Mailbox Plus",
                body: "Welcome to the future of mail management with Mailbox Plus's <strong>virtual mailbox services in Concord Township, Ohio</strong>. \nPerfect for travelers, snowbirds, and digital nomads, a virtual mailbox allows you to view and manage your postal mail online \nfrom anywhere in the world. We receive your mail, scan the envelope, and you decide whether to have it opened and scanned, \nforwarded, or shredded. Stay connected to your physical mail without being tied to a physical location."
            },
            {
                heading: "Why Choose a Virtual Mailbox?",
                body: "• **Remote Access:** Check your postal mail from your smartphone or computer 24/7.\n• **Convenience:** No need to drive to the mailbox; we bring the mailbox to you digitally.\n• **Security:** Your physical mail is stored securely until you decide what to do with it.\n• **Efficiency:** Quickly sort through junk mail and important documents with a click.\n• **Professional Address:** Use our street address for your business, even if you work remotely.\n• **Package Management:** We can receive and hold packages for you from all carriers."
            },
            {
                heading: "How It Works",
                body: "• **1. We Receive:** Your mail arrives at our secure Concord Township facility.\n• **2. We Scan:** We scan the front of the envelope and upload it to your secure online portal.\n• **3. You Decide:** Log in and tell us to open & scan, forward, shred, or hold the item.\n• **4. We Action:** We execute your request quickly and professionally."
            }
        ],
        features: [
            { title: "Access", description: "Anywhere, Anytime.", icon: Globe },
            { title: "Instant Notification", description: "Yes (App/Email).", icon: Star },
            { title: "Forwarding", description: "On Demand.", icon: Truck }
        ],
        faqs: [
            {
                question: "Is it safe to scan my mail?",
                answer: "Yes, we use secure, encrypted systems to store your digital mail images, and physical mail is kept in a restricted area."
            },
            {
                question: "Can you deposit checks for me?",
                answer: "Some plans may offer check depositing services. Please inquire for specific details."
            },
            {
                question: "How much does it cost?",
                answer: "We have various plans to fit different needs and budgets. Contact us for current pricing."
            }
        ]
    },
    {
        id: "mail-forwarding-concord-township",
        category: "mailbox-rentals",
        city: "Concord Township",
        serviceName: "Mail Forwarding",
        slug: "/mail-forwarding-concord-township",
        pageTitle: "Mail Forwarding in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Mail Forwarding services including UPS, FedEx, USPS, and DHL shipping. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "mail forwarding, Concord Township, Mailbox Plus",
        heroTitle: "Reliable Mail Forwarding in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus offers reliable mail forwarding in Concord Township, Ohio.",
        heroImage: getServiceImageUrl("/images/mailbox-rental.webp"),
        content: [
            {
                heading: "Reliable Mail Forwarding in Concord Township: Mailbox Plus",
                body: "Whether you're traveling for the winter, moving temporarily, or managing a business remotely, \nMailbox Plus offers reliable <strong>mail forwarding in Concord Township, Ohio</strong>. \nWe ensure you never miss an important document or package. Rent a private mailbox with us, and we can \nbundle your mail and forward it to you anywhere in the world using <strong>UPS, FedEx, USPS, or DHL</strong>. \nStay connected to your mail no matter where life takes you."
            },
            {
                heading: "Why Use Our Mail Forwarding Service?",
                body: "• **Flexibility:** Choose how often you want your mail forwarded (weekly, monthly, or on demand).\n• **Carrier Choice:** We select the most cost-effective or fastest carrier to get your mail to you.\n• **Security:** Your mail stays safe in our secure facility until it's time to ship.\n• **Consolidation:** We can repack your items into one box to save you money on shipping.\n• **Personal Service:** Just call or email us when you're ready for your mail.\n• **Peace of Mind:** Relax knowing your mail is being handled by professionals."
            },
            {
                heading: "Mail Management Solutions",
                body: "• **Private Mailbox Rental:** The foundation of our forwarding service—a secure street address for your mail.\n• **Package Forwarding:** We can receive packages from Amazon, UPS, etc., and forward them to your new location.\n• **International Forwarding:** Living abroad? We can ship your mail and packages internationally via DHL or FedEx.\n• **Mail Holding:** We can hold your mail while you are away and have it ready for pickup when you return."
            }
        ],
        features: [
            { title: "Package Forwarding", description: "Yes (All Carriers).", icon: Package },
            { title: "Control", description: "You Decide When.", icon: Star },
            { title: "Carrier Options", description: "UPS, FedEx, DHL, USPS.", icon: Truck }
        ],
        faqs: [
            {
                question: "How much does forwarding cost?",
                answer: "You pay the cost of shipping plus a small handling fee. We can estimate the cost before we send it."
            },
            {
                question: "Can you forward to a hotel?",
                answer: "Yes, we can forward mail and packages to hotels, temporary addresses, or general delivery."
            },
            {
                question: "Do I need to rent a mailbox?",
                answer: "Yes, mail forwarding is a feature available to our private mailbox holders."
            }
        ]
    },
    {
        id: "business-services-concord-township",
        category: "additional-services",
        city: "Concord Township",
        serviceName: "Business Services",
        slug: "/business-services-concord-township",
        pageTitle: "Business Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Business Services including UPS, FedEx, USPS, and DHL shipping. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "business services, Concord Township, Mailbox Plus",
        heroTitle: "Essential Business Services in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus is the one-stop shop for all your business services in Concord Township, Ohio.",
        heroImage: getServiceImageUrl("/images/pack-ship.webp"),
        content: [
            {
                heading: "Essential Business Services in Concord Township: Mailbox Plus",
                body: "Mailbox Plus is the one-stop shop for all your <strong>business services in Concord Township, Ohio</strong>. \nWe provide the essential tools you need to run your business efficiently, without the overhead of a large office. \nFrom <strong>UPS, FedEx, USPS, and DHL</strong> shipping to private mailbox rentals, notary public, and document shredding, \nwe have you covered. Our team acts as your personal support staff, helping you tackle your to-do list so you can focus on what matters most."
            },
            {
                heading: "Your Local Business Support Center",
                body: "• **Efficiency:** Get multiple errands done in one quick trip.\n• **Reliability:** Count on us for secure handling of your mail and packages.\n• **Professionalism:** Enhance your business image with our high-quality services.\n• **Flexibility:** We offer solutions tailored to small businesses and home offices.\n• **Cost-Effective:** Save money by only paying for the services you need.\n• **Local Partner:** We are invested in the success of the Concord Township business community."
            },
            {
                heading: "Comprehensive Business Solutions",
                body: "• **Mailbox Rentals:** Get a prestigious street address and secure 24-hour access to your mail.\n• **Notary Public:** On-site notary services to legalize your important documents.\n• **Document Shredding:** Securely destroy sensitive files and protect your business data.\n• **Fax & Scan:** Send and receive faxes or digitize your paper records."
            }
        ],
        features: [
            { title: "Cost", description: "Low Monthly Fee.", icon: Star },
            { title: "Staffing", description: "Our Team Helps You.", icon: Users },
            { title: "Equipment", description: "Use Ours (Print/Fax).", icon: Printer }
        ],
        faqs: [
            {
                question: "Can I use your address for my business?",
                answer: "Yes! Our mailbox rentals provide a real street address that you can use for business registration and marketing."
            },
            {
                question: "Do you offer volume discounts?",
                answer: "We may offer discounts for high-volume shipping or printing. Please ask us for details."
            },
            {
                question: "Is the notary always in?",
                answer: "Our notary is typically available during all business hours, but feel free to call ahead to confirm."
            }
        ]
    },
    {
        id: "amazon-returns-drop-off-concord-township",
        category: "additional-services",
        city: "Concord Township",
        serviceName: "Amazon Returns Drop Off",
        slug: "/amazon-returns-drop-off-concord-township",
        pageTitle: "Amazon Returns Drop Off in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Amazon Returns Drop Off including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "Amazon returns drop off, Concord Township, Mailbox Plus",
        heroTitle: "Easy Amazon Returns Drop Off in Concord Township: Mailbox Plus",
        heroSubtitle: "Need to return an Amazon package? Mailbox Plus is your convenient Amazon returns drop-off location in Concord Township, Ohio.",
        heroImage: getServiceImageUrl("/images/ups-shipping.webp"),
        content: [
            {
                heading: "Easy Amazon Returns Drop Off in Concord Township: Mailbox Plus",
                body: "Need to return an Amazon package? Mailbox Plus is your convenient <strong>Amazon returns drop-off location in Concord Township, Ohio</strong>. \nWe accept eligible Amazon returns that have a pre-paid UPS shipping label. Skip the long lines at other stores and enjoy a quick, \nhassle-free drop-off experience. While you're here, check out our other services including \n<strong> FedEx, USPS, and DHL shipping</strong>, packing supplies, and more."
            },
            {
                heading: "Why Drop Off Amazon Returns at Mailbox Plus?",
                body: "• **Fast & Easy:** We scan your label and get you on your way in seconds.\n• **No Long Lines:** Avoid the crowds often found at The UPS Store.\n• **Convenient Location:** Right here in Concord Township, close to home.\n• **Friendly Service:** Our staff is happy to help with any shipping questions.\n• **Receipt Provided:** We'll give you a drop-off receipt for your records.\n• **More Services:** Buy a box or tape if you need to pack your return."
            },
            {
                heading: "Return & Shipping Services",
                body: "• **Amazon Drop-Offs:** Accepting Amazon returns with pre-paid UPS shipping labels.\n• **Packing Assistance:** Need a box? We sell packaging supplies to get your return ready.\n• **Label Printing:** Email us your label and we can print it for you (small fee may apply).\n• **Multi-Carrier Shipping:** We also ship via FedEx, USPS, and DHL for your other needs."
            }
        ],
        features: [
            { title: "Wait Time", description: "Minimal.", icon: Clock },
            { title: "Service", description: "Personal & Friendly.", icon: Users },
            { title: "Flexibility", description: "Accepts UPS, FedEx, USPS.", icon: Truck }
        ],
        faqs: [
            {
                question: "Do I need to print my label?",
                answer: "Yes, please have your label printed and attached to the package. If you don't have a printer, we can print it for a small fee."
            },
            {
                question: "Do you take QR codes?",
                answer: "Currently, we accept packages with pre-printed shipping labels. For QR codes, please check the instructions from Amazon."
            },
            {
                question: "Do I need to box my return?",
                answer: "Yes, items must be boxed and sealed. We sell boxes and tape if you need them!"
            }
        ]
    }
];
