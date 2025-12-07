import {
    Users,
    Star,
    NotebookText,
    Shield,
    Clock,
    Truck,
    Printer,
    CheckCircle
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
    {
        id: "nuuly-returns",
        category: "additional-services",
        city: "Concord Township",
        serviceName: "Nuuly Returns Drop-Off",
        slug: "/nuuly-returns",
        canonicalUrl: "https://mailboxplus.com/nuuly-returns",
        pageTitle: "Nuuly Returns Drop-Off in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Fast, easy Nuuly returns in Concord Township, OH. Drop off your Nuuly rental bag at Mailbox Plus. We scan, receipt, and ship via UPS. No boxing needed.",
        keywords: "Nuuly returns Concord OH, Nuuly drop off Mentor, Nuuly clothing rental returns, UPS drop off Nuuly, Mailbox Plus Nuuly",
        heroTitle: "Nuuly Returns Made Easy",
        heroSubtitle: "Simply drop off your Nuuly reusable bag. We handle the rest.",
        heroImage: getServiceImageUrl("/images/nuuly-returns.webp"),

        content: [
            {
                heading: "What Is Nuuly?",
                body: `Nuuly is a popular monthly clothing rental subscription service that lets fashion lovers explore new styles without the commitment of buying. Users rent 6 items monthly from brands like <strong>Free People</strong>, <strong>Anthropologie</strong>, <strong>Urban Outfitters</strong>, and many vintage labels.<br><br>
            As an authorized UPS drop-off point, Mailbox Plus ensures your Nuuly bag is scanned immediately so your return is logged and your next month’s box unlocks faster.`
            },
            {
                heading: "How the Nuuly Process Works",
                body: `
            <ol>
                <li><strong>Rent:</strong> Choose 6 items for the month.</li>
                <li><strong>Wear:</strong> Enjoy the clothing for any occasion.</li>
                <li><strong>Return:</strong> Place items back into the reusable Nuuly bag and drop off at Mailbox Plus.</li>
                <li><strong>Repeat:</strong> Once scanned, select your next 6 items.</li>
            </ol>`
            },
            {
                heading: "Nuuly Returns Drop-Off in Concord Township",
                body: `
            Residents of <strong>Concord Township, Mentor, Painesville, and Chardon</strong> can return Nuuly bags quickly at Mailbox Plus—your neighborhood <a href="/pack-ship/ups-authorized-shipper-outlet">UPS Authorized Shipping Outlet</a>.<br><br>
            <ul>
                <li>Zero fees for prepaid UPS drop-offs</li>
                <li>Instant receipt and tracking</li>
                <li>Convenient front-door parking</li>
                <li>Open Saturdays</li>
            </ul>`
            },
            {
                heading: "What You Need Before Dropping Off",
                body: `
            <ol>
                <li><strong>The Nuuly Reusable Bag:</strong> No need for boxes or tape.</li>
                <li><strong>UPS Return Label:</strong> Insert into the bag window. We can print it if needed.</li>
                <li><strong>Zip It Up:</strong> Ensure it's fully closed.</li>
            </ol>`
            },
            {
                heading: "Why Choose Mailbox Plus",
                body: `
            <ul>
                <li>No lines — average drop-off under 2 minutes</li>
                <li>Secure handling and instant scanning</li>
                <li>Local and friendly service</li>
                <li>Extended hours and Saturday availability</li>
                <li>Easy front-door parking</li>
                <li>All UPS, FedEx, USPS, DHL returns accepted</li>
            </ul>`
            },
            {
                heading: "Step-by-Step Return Procedure",
                body: `
            <ol>
                <li>Prepare Bag — place clothes inside and zip.</li>
                <li>Insert Label into the window.</li>
                <li>Bring the bag to Mailbox Plus.</li>
                <li>Staff scans the label.</li>
                <li>Receive your printed receipt.</li>
                <li>Nuuly unlocks your next box.</li>
            </ol>`
            },
            {
                heading: "Local Service Area",
                body: `Searching for <strong>"Nuuly returns near me"</strong> or <strong>"clothing rental return Concord OH"</strong>? Mailbox Plus serves Mentor, Painesville, Leroy Township, Chardon, and Willoughby.`
            }
        ],

        features: [
            { icon: Truck, title: "Fast Drop-Off", description: "Most returns processed in under 2 minutes." },
            { icon: Shield, title: "Secure Return", description: "We scan your label immediately for proof." },
            { icon: CheckCircle, title: "No Box Needed", description: "Nuuly returns stay in the reusable bag." }
        ],

        faqs: [
            {
                question: "Do I need to box my Nuuly return?",
                answer: "No. Use the reusable Nuuly bag—no box required."
            },
            {
                question: "Is there a charge to drop off?",
                answer: "No. Nuuly returns with prepaid UPS labels are free."
            },
            {
                question: "How do I get my return receipt?",
                answer: "We scan the label and print your tracking receipt instantly."
            },
            {
                question: "What if I lost my return label?",
                answer: "You can reprint from your Nuuly account or email it to us for printing."
            },
            {
                question: "Do you accept other clothing rental returns?",
                answer: "Yes—Rent the Runway, Stitch Fix, and any UPS/FedEx-labeled returns."
            }
        ]
    },
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
    }
];
