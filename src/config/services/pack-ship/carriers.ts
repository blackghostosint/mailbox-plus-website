import {
    Truck, Shield, Globe, Mail, Package, Star
} from "lucide-react";
import { Service } from "../../../types/services";
import { getServiceImageUrl } from "../../../lib/storage";
import {
    generalShippingFaqs,
    fedexShippingFaqs,
    upsShippingFaqs,
    uspsServicesFaqs,
    dhlExpressFaqs,
    postageStampsFaqs
} from "../../faqs";

export const carrierServices: Service[] = [
    {
        id: "fedex-shipping",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "FedEx Shipping",
        slug: "/pack-ship/fedex-shipping",
        pageTitle: "FedEx Shipping in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Authorized FedEx ShipCenter in Concord Township. Express, Ground, and International shipping services. Packing, labeling, and drop-offs available.",
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
        metaDescription: "UPS Authorized Shipping Outlet in Concord Township. Ship UPS Ground, Next Day Air, and International. Drop off pre-labeled packages for free.",
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
        metaDescription: "Official USPS postal services in Concord Township. Buy stamps, send Priority Mail, and ship packages without the long post office lines.",
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
        metaDescription: "DHL Express Service Point in Concord Township. Fast and reliable international shipping. We help with customs forms and packaging.",
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
        id: "postage-stamps",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Postage Stamps",
        slug: "/pack-ship/postage-stamps",
        pageTitle: "Postage Stamps in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Buy postage stamps in Concord Township. Forever stamps, international stamps, and metered mail services available. Skip the post office wait.",
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
    }
];
