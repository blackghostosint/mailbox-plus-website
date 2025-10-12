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
                body: "Some items just don’t fit in standard boxes. We build custom solutions to fit your shipment perfectly."
            },
            {
                heading: "Protect Your Items",
                body: "Custom packaging ensures your items are secure during shipping."
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
        heroImage: getServiceImageUrl("/images/flyers-brochures.jpg"),
        content: [
            {
                heading: "Promote Your Business",
                body: "Flyers and brochures remain one of the most cost-effective ways to share your message with the community."
            },
            {
                heading: "Professional Quality",
                body: "Our print partners provide full-color, double-sided printing on premium paper stocks."
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
