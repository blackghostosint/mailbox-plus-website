import { Package, Shield, Truck } from "lucide-react";
import { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";
import { packShipFaqs } from "../faqs";

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
    }
];