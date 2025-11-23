import {
    Palette, Users, Star, NotebookText, Shield, Clock, Truck, Lock, Printer
} from "lucide-react";
import { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";
import {
    generalCopyPrintFaqs,
    graphicDesignFaqs,
    generalHomeBusinessFaqs,
    notaryServicesFaqs
} from "../faqs";

export const additionalServices: Service[] = [
    // ---------------------------
    // ADDITIONAL SERVICES
    // ---------------------------
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