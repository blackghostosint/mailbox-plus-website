import { Package, Shield, Truck, Printer, FileText, Palette, Star } from "lucide-react";
import { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";
import { packShipFaqs, generalCopyPrintFaqs } from "../faqs";

export const coreServices: Service[] = [
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
        metaDescription: "Expert Pack & Ship services in Concord Township, Ohio. We ship via FedEx, UPS, USPS, and DHL. Custom packing, estate shipping, and freight services available.",
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
    {
        id: "copy-print",
        category: "core",
        city: "Concord Township",
        serviceName: "Copy & Print",
        slug: "/copy-print",
        pageTitle: "Copy and Print Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Professional Copy & Print services in Concord Township. High-quality business cards, flyers, brochures, and document printing. Fast turnaround and local service.",
        keywords: "copy, print, business cards, flyers, banners, Concord Township, Lake County",
        heroTitle: "Copy & Print Services",
        heroSubtitle: "Professional printing services from business cards to large format banners. High-quality results with fast turnaround times.",
        heroImage: getServiceImageUrl("/images/document-printing.webp"),
        content: [
            {
                heading: "Our Printing Services",
                body: "From everyday copying to professional marketing materials, we provide comprehensive printing solutions for all your needs."
            }
        ],
        features: [
            { icon: Printer, title: "Professional Quality", description: "High-resolution printing with vibrant colors" },
            { icon: FileText, title: "All Document Types", description: "From business cards to large format posters" },
            { icon: Palette, title: "Design Services", description: "Professional graphic design available" },
            { icon: Star, title: "Fast Turnaround", description: "Quick service for urgent printing needs" }
        ],
        faqs: generalCopyPrintFaqs
    }
];