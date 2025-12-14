import {
    Users,
    Star,
    NotebookText,
    Shield,
    Clock,
    Truck,
    Printer
} from "lucide-react";
import { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";
import {
    generalHomeBusinessFaqs,
    notaryServicesFaqs
} from "../faqs";

export const additionalServices: Service[] = [
    // ---------------------------
    // ADDITIONAL SERVICES
    // ---------------------------
    // Nuuly Returns service removed

    {
        id: "notary-services",
        category: "additional-services",
        city: "Concord Township",
        serviceName: "Notary Services",
        slug: "/home-business/notary-services",
        canonicalUrl: "https://mailboxplus.com/home-business/notary-services",
        pageTitle: "Notary Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Certified Notary Public in Concord Township. Walk-in notary services for legal documents, affidavits, contracts, and more. No appointment necessary.",
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
        canonicalUrl: "https://mailboxplus.com/fedex-easy-returns",
        pageTitle: "FedEx Easy Returns in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Convenient FedEx Easy Returns in Concord Township. Drop off your pre-labeled or QR code returns quickly. We pack and ship for you.",
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
        canonicalUrl: "https://mailboxplus.com/amazon-returns",
        pageTitle: "Amazon Return Guide in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Guide to Amazon Returns in Concord Township. Learn how to easily return your Amazon packages at Mailbox Plus. Printing and packing help available.",
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
        canonicalUrl: "https://mailboxplus.com/business-services-concord-township",
        pageTitle: "Business Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Essential business services in Concord Township: shipping, printing, mailbox rentals, notary, and more. Your local office away from the office.",
        keywords: "business services, Concord Township, Mailbox Plus",
        heroTitle: "Essential Business Services in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus is the one-stop shop for all your business services in Concord Township, Ohio.",
        heroImage: getServiceImageUrl("/images/pack-ship.webp"),
        content: [
            {
                heading: "Essential Business Services in Concord Township: Mailbox Plus",
                body: `<p>Mailbox Plus is the one-stop shop for all your <strong>business services in Concord Township, Ohio</strong>.</p>
                <p>We provide the essential tools you need to run your business efficiently, without the overhead of a large office.</p>
                <p>From <strong>UPS, FedEx, USPS, and DHL</strong> shipping to private mailbox rentals, notary public, and document shredding, we have you covered. Our team acts as your personal support staff, helping you tackle your to-do list so you can focus on what matters most.</p>`
            },
            {
                heading: "Your Local Business Support Center",
                body: `<ul>
                    <li><strong>Efficiency:</strong> Get multiple errands done in one quick trip.</li>
                    <li><strong>Reliability:</strong> Count on us for secure handling of your mail and packages.</li>
                    <li><strong>Professionalism:</strong> Enhance your business image with our high-quality services.</li>
                    <li><strong>Flexibility:</strong> We offer solutions tailored to small businesses and home offices.</li>
                    <li><strong>Cost-Effective:</strong> Save money by only paying for the services you need.</li>
                    <li><strong>Local Partner:</strong> We are invested in the success of the Concord Township business community.</li>
                </ul>`
            },
            {
                heading: "Comprehensive Business Solutions",
                body: `<ul>
                    <li><strong>Mailbox Rentals:</strong> Get a prestigious street address and secure 24-hour access to your mail.</li>
                    <li><strong>Notary Public:</strong> On-site notary services to legalize your important documents.</li>
                    <li><strong>Document Shredding:</strong> Securely destroy sensitive files and protect your business data.</li>
                    <li><strong>Fax & Scan:</strong> Send and receive faxes or digitize your paper records.</li>
                </ul>`
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
        canonicalUrl: "https://mailboxplus.com/amazon-returns-drop-off-concord-township",
        pageTitle: "Amazon Returns Drop Off in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Fast Amazon returns drop-off in Concord Township. Bring your pre-paid UPS label packages to Mailbox Plus for quick, hassle-free returns.",
        keywords: "Amazon returns drop off, Concord Township, Mailbox Plus",
        heroTitle: "Easy Amazon Returns Drop Off in Concord Township: Mailbox Plus",
        heroSubtitle: "Need to return an Amazon package? Mailbox Plus is your convenient Amazon returns drop-off location in Concord Township, Ohio.",
        heroImage: getServiceImageUrl("/images/ups-shipping.webp"),
        content: [
            {
                heading: "Easy Amazon Returns Drop Off in Concord Township: Mailbox Plus",
                body: `<p>Need to return an Amazon package? Mailbox Plus is your convenient <strong>Amazon returns drop-off location in Concord Township, Ohio</strong>.</p>
                <p>We accept eligible Amazon returns that have a pre-paid UPS shipping label. Skip the long lines at other stores and enjoy a quick, hassle-free drop-off experience. While you're here, check out our other services including <strong>FedEx, USPS, and DHL shipping</strong>, packing supplies, and more.</p>`
            },
            {
                heading: "Why Drop Off Amazon Returns at Mailbox Plus?",
                body: `<ul>
                <li><strong>Fast & Easy:</strong> We scan your label and get you on your way in seconds.</li>
                <li><strong>No Long Lines:</strong> Avoid the crowds often found at The UPS Store.</li>
                <li><strong>Convenient Location:</strong> Right here in Concord Township, close to home.</li>
                <li><strong>Friendly Service:</strong> Our staff is happy to help with any shipping questions.</li>
                <li><strong>Receipt Provided:</strong> We'll give you a drop-off receipt for your records.</li>
                <li><strong>More Services:</strong> Buy a box or tape if you need to pack your return.</li>
                </ul>`
            },
            {
                heading: "Return & Shipping Services",
                body: `<ul>
                <li><strong>Amazon Drop-Offs:</strong> Accepting Amazon returns with pre-paid UPS shipping labels.</li>
                <li><strong>Packing Assistance:</strong> Need a box? We sell packaging supplies to get your return ready.</li>
                <li><strong>Label Printing:</strong> Email us your label and we can print it for you (small fee may apply).</li>
                <li><strong>Multi-Carrier Shipping:</strong> We also ship via FedEx, USPS, and DHL for your other needs.</li>
                </ul>`
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
    },
    {
        id: "nuuly-returns",
        category: "additional-services",
        city: "Concord Township",
        serviceName: "Nuuly Returns",
        slug: "/nuuly-returns",
        canonicalUrl: "https://mailboxplus.com/nuuly-returns",
        pageTitle: "Nuuly Returns in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Easy Nuuly clothing rental returns in Concord Township. Drop off your Nuuly bag at Mailbox Plus - authorized UPS drop-off location. Fast, convenient service.",
        keywords: "nuuly returns, clothing rental returns, UPS drop off, concord township, lake county",
        heroTitle: "Nuuly Returns Drop-Off",
        heroSubtitle: "Convenient Nuuly clothing rental returns at your local UPS authorized drop-off location.",
        heroImage: getServiceImageUrl("/images/nuulyreturns.webp"),
        content: [
            {
                heading: "Fast & Easy Nuuly Returns",
                body: "Returning your Nuuly clothing rental is simple at Mailbox Plus. Just bring your prepaid Nuuly bag with the UPS return label attached, and we'll handle the rest."
            },
            {
                heading: "Why Choose Mailbox Plus for Nuuly Returns?",
                body: `<ul>
                    <li><strong>Authorized UPS Drop-Off:</strong> We're an official UPS drop-off location, ensuring your Nuuly return is scanned and processed immediately.</li>
                    <li><strong>Same-Day Processing:</strong> Drop off your Nuuly bag and get it scanned right away so you can unlock your next box faster.</li>
                    <li><strong>Receipt Provided:</strong> We'll give you a receipt confirming your return has been scanned by UPS.</li>
                    <li><strong>No Long Lines:</strong> Skip the crowded UPS Store - we offer faster, friendly service.</li>
                    <li><strong>Local & Convenient:</strong> Located in Concord Township, serving all of Lake County.</li>
                </ul>`
            },
            {
                heading: "Nuuly Returns in Concord Township, Ohio",
                body: `Mailbox Plus is your local, convenient solution for <strong>Nuuly clothing rental returns</strong> in Concord Township and Lake County, Ohio. As an <strong>authorized UPS drop-off location</strong>, we accept Nuuly returns with prepaid UPS labels and provide immediate scanning to help you unlock your next Nuuly box as quickly as possible.

Nuuly is a popular monthly clothing rental subscription from URBN (the parent company of Anthropologie, Free People, and Urban Outfitters), allowing you to rent six items per month for a flat fee. When you're ready to return your items, simply pack them in the reusable Nuuly bag, attach the prepaid UPS return label, and drop it off at Mailbox Plus.

Our team will <strong>scan your return immediately</strong> and provide you with a <strong>UPS receipt for your records</strong>. This ensures your return is tracked and processed quickly, so you can access your next clothing selection without delay.

Whether you're searching for <em>Nuuly returns near Concord Township</em> or need a <em>fast UPS drop-off in Lake County, Ohio</em>, Mailbox Plus offers the friendly, efficient service you need. Visit us today and experience hassle-free Nuuly returns!`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Truck, title: "Authorized UPS Location", description: "Official UPS drop-off point for Nuuly returns." },
            { icon: Clock, title: "Same-Day Scanning", description: "Get your return scanned immediately." },
            { icon: Users, title: "Friendly Service", description: "Personal assistance from our local team." }
        ],
        faqs: [
            {
                question: "Can I drop off my Nuuly returns at Mailbox Plus?",
                answer: "Yes! We are an authorized UPS drop-off location and accept all Nuuly returns with prepaid UPS labels. Just bring your sealed Nuuly bag and we'll scan it right away."
            },
            {
                question: "Do I need to print a label for my Nuuly return?",
                answer: "No, Nuuly includes a prepaid UPS return label with each delivery. Simply attach it to your Nuuly bag before dropping it off. If you've lost your label, you can print a new one from your Nuuly account."
            },
            {
                question: "Will I get a receipt for my Nuuly return?",
                answer: "Yes! We provide a UPS receipt showing that your return has been scanned and accepted. This serves as proof of your return."
            },
            {
                question: "How quickly will my next Nuuly box unlock after I return my items?",
                answer: "Once we scan your return at our location, UPS processes it immediately. Nuuly typically unlocks your next box within minutes of the UPS scan. You can also use Nuuly's 'Check My Return' feature to expedite the process."
            },
            {
                question: "What if I forgot to attach the label to my Nuuly bag?",
                answer: "No problem! If you have the label with you, we can attach it for you. If you don't have it, you can print a new one from your Nuuly account and bring it back, or we can print it for a small $2.00 fee."
            },
            {
                question: "Do you charge for Nuuly returns?",
                answer: "No, drop-offs for prepaid packages are free at Mailbox Plus. If you need us to print your return label, there's a $2.00 printing fee."
            }
        ]
    }
];
