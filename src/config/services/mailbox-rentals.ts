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
                heading: "Your Professional Street Address",
                body: "Stop relying on a PO Box or putting your home address at risk. A private mailbox at Mailbox Plus provides a <strong>real street address</strong> in Concord Township, Ohio. This allows you to receive packages from <strong>all major carriers—UPS, FedEx, USPS, and DHL</strong>—and build a professional image for your home-based business."
            },
            {
                heading: "Transparent Pricing & Standardized Sizes",
                body: `<div class="overflow-x-auto my-6">
                    <table class="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm">
                        <thead class="bg-slate-100/80">
                            <tr>
                                <th class="p-4 font-semibold text-slate-900">Mailbox Size</th>
                                <th class="p-4 font-semibold text-slate-900">Monthly Price</th>
                                <th class="p-4 font-semibold text-slate-900">Package Inclusion</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr>
                                <td class="p-4 text-slate-700">Small Box</td>
                                <td class="p-4 font-bold text-[#0855B1]">$25.00</td>
                                <td class="p-4 text-slate-600">5 pkgs included</td>
                            </tr>
                            <tr>
                                <td class="p-4 text-slate-700">Large Box</td>
                                <td class="p-4 font-bold text-[#0855B1]">$35.00</td>
                                <td class="p-4 text-slate-600">5 pkgs included</td>
                            </tr>
                            <tr class="bg-blue-50/30">
                                <td class="p-4 text-slate-700 font-semibold">12-Month Prepay</td>
                                <td class="p-4 font-bold text-[#0855B1]">$300.00</td>
                                <td class="p-4 text-slate-600">Best Value</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="text-sm text-slate-500 italic mt-2">Note: Additional packages beyond the monthly inclusion are \$5.00 each. Rentals available in 3, 6, and 12-month terms.</p>`
            },
            {
                heading: "Quick & Easy Setup (USPS Form 1583)",
                body: `<p class="mb-4">Setting up your secure mailbox is a straightforward legal process. As a CMRA, we require two forms of ID and a completed USPS Form 1583 to begin accepting your mail.</p>
                <div class="grid gap-6 md:grid-cols-3">
                    <div class="p-5 rounded-2xl bg-white/50 border border-white/80">
                        <div class="font-bold text-[#0855B1] mb-2 text-lg">1. Complete Form</div>
                        <p class="text-sm leading-relaxed text-slate-600 font-medium">Fill in your personal/business details on USPS Form 1583. Each authorized recipient needs their own ID check.</p>
                    </div>
                    <div class="p-5 rounded-2xl bg-white/50 border border-white/80">
                        <div class="font-bold text-[#0855B1] mb-2 text-lg">2. Provide ID</div>
                        <p class="text-sm leading-relaxed text-slate-600 font-medium">Bring one primary photo ID (Passport, DL) and one secondary ID showing your address (Lease, Utility Bill).</p>
                    </div>
                    <div class="p-5 rounded-2xl bg-white/50 border border-white/80">
                        <div class="font-bold text-[#0855B1] mb-2 text-lg">3. Submit & Start</div>
                        <p class="text-sm leading-relaxed text-slate-600 font-medium">Bring these to Mailbox Plus. Once verified, we can legally accept and protect your mail and packages instantly.</p>
                    </div>
                </div>`
            }
        ],
        features: [
            { icon: MapPin, title: "Real Street Address", description: "Standard physical address, perfect for business identity." },
            { icon: Package, title: "All-Carrier Acceptance", description: "We accept and sign for UPS, FedEx, USPS, and DHL." },
            { icon: Lock, title: "Secure & Private", description: "Your mail is held safely behind our counter icons." }
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
