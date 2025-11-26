import {
    Lock, Package, MapPin, Mail, Globe, Star, Truck
} from "lucide-react";
import { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";
import {
    generalHomeBusinessFaqs,
    mailboxRentalFaqs,
    digitalMailboxRentalFaqs
} from "../faqs";

export const mailboxRentalServices: Service[] = [
    // ---------------------------
    // MAILBOX RENTALS
    // ---------------------------
    {
        id: "mailbox-rental",
        category: "mailbox-rentals",
        city: "Concord Township",
        serviceName: "Mailbox Rental",
        slug: "/home-business/mailbox-rental",
        pageTitle: "Mailbox Rental in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Secure private mailbox rentals in Concord Township with a real street address. Package receiving from all carriers (UPS, FedEx, USPS, DHL) and 24/7 access options.",
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
        metaDescription: "Digital mailbox services in Concord Township. View and manage your postal mail online from anywhere. Scanning, forwarding, and shredding options available.",
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
        id: "private-mailbox-rental-concord-township",
        category: "mailbox-rentals",
        city: "Concord Township",
        serviceName: "Private Mailbox Rental",
        slug: "/private-mailbox-rental-concord-township",
        pageTitle: "Private Mailbox Rental in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Rent a private mailbox in Concord Township for security and privacy. Real street address for your business or personal mail. Package acceptance included.",
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
        metaDescription: "Virtual mailbox solutions in Concord Township. manage your physical mail digitally. Perfect for travelers, businesses, and remote workers.",
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
        metaDescription: "Reliable mail forwarding from Concord Township, Ohio. We can forward your mail and packages anywhere in the world via UPS, FedEx, DHL, or USPS.",
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
    }
];
