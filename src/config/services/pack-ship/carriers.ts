import Truck from '~icons/lucide/truck';
import Shield from '~icons/lucide/shield';
import Globe from '~icons/lucide/globe';
import Mail from '~icons/lucide/mail';
import Package from '~icons/lucide/package';
import Star from '~icons/lucide/star';
import type { Service } from "../../../types/services";
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
                heading: "Trusted FedEx Partner",
                body: "At Mailbox Plus, we’re proud to be your local <strong>Authorized FedEx Shipping Center</strong>—serving Concord Township and Lake County. Our team ensures your shipment is packed, labeled, and processed according to FedEx’s professional standards."
            },
            {
                heading: "Global & Domestic Reach",
                body: "We offer the full range of <strong>FedEx Express, Ground, and International</strong> services. From overnight document delivery to secure international shipping, we help you choose the best option for your destination and budget."
            },
            {
                heading: "Professional Shipping Standards",
                body: "Every package is packed with care using high-quality materials that protect against vibration and compression. We provide <strong>real-time tracking, shipment insurance, and on-site packing assistance</strong> for your peace of mind."
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
                heading: "Local UPS Shipping Hub",
                body: "Mailbox Plus is your <strong>Authorized UPS Shipping Center</strong>—serving Concord Township with reliable packing and shipping solutions. Our staff ensures your shipment meets <strong>UPS packaging and handling standards</strong> for safety and speed."
            },
            {
                heading: "Comprehensive UPS Services",
                body: "We offer a full suite of services including <em>UPS Ground, 2nd Day Air, Next Day Air, and International</em> options. Our experts help you choose the best method for your budget while guaranteeing secure packaging."
            },
            {
                heading: "Convenient One-Stop Shop",
                body: "As a local business in Gristmill Village, we provide fast UPS drop-off and shipping assistance. Enjoy <strong>on-site packing, printed labels, tracking, and insurance coverage</strong> all in one stop."
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
                heading: "Convenient USPS Hub",
                body: "Mailbox Plus is your hub for <strong>USPS postal and shipping services</strong> in Concord Township. As an authorized provider, we handle <strong>First-Class Mail</strong>, <strong>Priority Mail</strong>, and <em>Certified Mail</em> in one friendly location."
            },
            {
                heading: "Efficient Mailing Support",
                body: "Avoid the long lines at the post office. Our team provides fast, accurate service with expert packing, custom labeling, and on-the-spot postage for envelopes and parcels of all sizes."
            },
            {
                heading: "Small Business & Personal Solutions",
                body: "Whether you need to send a single letter or manage regular mailings, we offer <strong>secure USPS drop-off, tracking assistance, and bulk mailing support</strong> right here in your community."
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
                heading: "Global Express Service Point",
                body: "At Mailbox Plus, we serve as your local access point for <strong>DHL Express international shipping</strong>—helping you send packages quickly and securely around the world via the same 220-country network as any DHL location."
            },
            {
                heading: "Expert International Readiness",
                body: "Our team ensures every shipment is <strong>professionally packed and customs-ready</strong>. We provide expert guidance on <em>customs forms, international restrictions, and packaging requirements</em> for DHL Express Worldwide."
            },
            {
                heading: "Peace of Mind Worldwide",
                body: "Every DHL shipment comes with detailed tracking and delivery confirmation. We can also combine DHL with other carriers like FedEx or UPS to provide the most cost-effective solution for your budget."
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
                heading: "Local Postage & Mailing",
                body: "Mailbox Plus is your local source for <strong>postage stamps and mailing supplies</strong> in Concord Township. Get the exact postage you need for personal or business mail—without waiting in long post office lines."
            },
            {
                heading: "Stamps & Custom Metering",
                body: "We carry <strong>Forever Stamps and standard USPS postage options</strong> for domestic and international mail. Our staff can help you calculate exact rates, weigh envelopes, and prepare your items for shipment."
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
