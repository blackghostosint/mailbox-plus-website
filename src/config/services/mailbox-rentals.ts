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
                heading: "Digital Freedom: Your Mail, Anywhere",
                body: "Stop letting physical mail tie you down. With a digital mailbox from Mailbox Plus, you can manage your postal mail from any device. We receive your mail at our secure Concord Township facility, scan the envelopes, and you decide the rest. Whether you're traveling, running a remote business, or just want a paperless lifestyle, our virtual solutions give you 24/7 control."
            },
            {
                heading: "Premium Digital Mail Features",
                body: `<div class="grid gap-6 md:grid-cols-3 my-8">
                    <div class="p-5 rounded-2xl bg-white/50 border border-white/80 shadow-sm">
                        <div class="font-bold text-[#0855B1] mb-2 text-lg italic">Scan & View</div>
                        <p class="text-sm leading-relaxed text-slate-600 font-medium">Instantly view high-resolution scans of your envelopes and requested documents through your secure portal.</p>
                    </div>
                    <div class="p-5 rounded-2xl bg-white/50 border border-white/80 shadow-sm">
                        <div class="font-bold text-[#0855B1] mb-2 text-lg italic">Forward & Shred</div>
                        <p class="text-sm leading-relaxed text-slate-600 font-medium">Consolidate packages for forwarding or request secure shredding of sensitive documents with a single click.</p>
                    </div>
                    <div class="p-5 rounded-2xl bg-white/50 border border-white/80 shadow-sm">
                        <div class="font-bold text-[#0855B1] mb-2 text-lg italic">Real-Time Alerts</div>
                        <p class="text-sm leading-relaxed text-slate-600 font-medium">Receive push notifications the moment your mail or packages arrive at our Concord Township location.</p>
                    </div>
                </div>
                <p>We partner with leading providers like <a href="https://ipostal1.com/mailboxplusohio" target="_blank" rel="noopener noreferrer" class="text-[#0855B1] font-semibold underline">iPostal1</a>, <a href="https://mailboxplusofohiollc.anytimemailbox.com/signup" target="_blank" rel="noopener noreferrer" class="text-[#0855B1] font-semibold underline">Anytime Mailbox</a>, and <a href="https://app.postscanmail.com/registration?plan=19527&store=1400&address=2489&expand=true&by_store=true" target="_blank" rel="noopener noreferrer" class="text-[#0855B1] font-semibold underline">PostScan Mail</a> to give you the most flexible virtual mailbox experience in Lake County.</p>`
            },
            {
                heading: "Not a P.O. Box",
                body: "Every digital mailbox plan provides a unique <strong>Concord Township street address</strong>. This means you can receive packages from all major carriers, including UPS, FedEx, and DHL, which standard P.O. Boxes often reject."
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
                heading: "The Security of a Physical Presence",
                body: "A private mailbox at Mailbox Plus is more than just a place to store mail—it's a <strong>complete mail management solution</strong>. Whether you're a home-based business looking for a professional image or a resident concerned about porch theft, our secure facility and professional staff ensure your items are handled with care and discretion."
            },
            {
                heading: "Why Upgrade to Private Mailbox Rental?",
                body: `<div class="overflow-x-auto my-6">
                    <table class="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm bg-white/40">
                        <thead class="bg-slate-100/60">
                            <tr>
                                <th class="p-4 font-semibold text-slate-900">Feature</th>
                                <th class="p-4 font-semibold text-slate-900">Standard P.O. Box</th>
                                <th class="p-4 font-semibold text-[#0855B1]">Mailbox Plus Private</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr>
                                <td class="p-4 text-slate-700 font-medium">Address Type</td>
                                <td class="p-4 text-slate-600 italic">Box Number Only</td>
                                <td class="p-4 text-slate-900 font-bold">Real Street Address</td>
                            </tr>
                            <tr>
                                <td class="p-4 text-slate-700 font-medium">Carrier Access</td>
                                <td class="p-4 text-slate-600 italic">USPS Only</td>
                                <td class="p-4 text-slate-900 font-bold">UPS, FedEx, DHL, USPS</td>
                            </tr>
                            <tr>
                                <td class="p-4 text-slate-700 font-medium">Package Security</td>
                                <td class="p-4 text-slate-600 italic">Limited Sizes</td>
                                <td class="p-4 text-slate-900 font-bold">Standard Signing Incl.</td>
                            </tr>
                            <tr>
                                <td class="p-4 text-slate-700 font-medium">Privacy</td>
                                <td class="p-4 text-slate-600 italic">Standard</td>
                                <td class="p-4 text-slate-900 font-bold">Elite Protection</td>
                            </tr>
                        </tbody>
                    </table>
                </div>`
            },
            {
                heading: "Maximum Convenience",
                body: "Stop driving to the store just to find an empty box. We offer <strong>mail notification services</strong> so you know exactly when your important documents or high-value packages have arrived. From business registration to personal privacy, we provide the stability of a physical location with the flexibility of modern service."
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
                heading: "The Modern Way to Manage Physical Mail",
                body: "Perfect for digital nomads, frequent travelers, and small business owners, our <strong>Virtual Mailbox service</strong> bridges the gap between physical mail and your digital life. Your mail arrives at our Concord Township facility, and we instantly provide a digital preview, allowing you to manage your post from anywhere in the world."
            },
            {
                heading: "How Your Virtual Mailbox Works",
                body: `<div class="grid gap-4 md:grid-cols-4 my-8">
                    <div class="p-5 rounded-2xl bg-[#0855B1]/5 border border-[#0855B1]/10">
                        <div class="text-2xl font-bold text-[#0855B1] mb-2">01</div>
                        <div class="font-bold text-slate-900 mb-1">We Receive</div>
                        <p class="text-xs text-slate-600 leading-relaxed">Mail arrives at our secure Lake County facility.</p>
                    </div>
                    <div class="p-5 rounded-2xl bg-[#0855B1]/5 border border-[#0855B1]/10">
                        <div class="text-2xl font-bold text-[#0855B1] mb-2">02</div>
                        <div class="font-bold text-slate-900 mb-1">We Scan</div>
                        <p class="text-xs text-slate-600 leading-relaxed">We scan the envelope and upload it to your portal.</p>
                    </div>
                    <div class="p-5 rounded-2xl bg-[#0855B1]/5 border border-[#0855B1]/10">
                        <div class="text-2xl font-bold text-[#0855B1] mb-2">03</div>
                        <div class="font-bold text-slate-900 mb-1">You Decide</div>
                        <p class="text-xs text-slate-600 leading-relaxed">Tell us to scan contents, forward, or shred.</p>
                    </div>
                    <div class="p-5 rounded-2xl bg-[#0855B1]/5 border border-[#0855B1]/10">
                        <div class="text-2xl font-bold text-[#0855B1] mb-2">04</div>
                        <div class="font-bold text-slate-900 mb-1">We Action</div>
                        <p class="text-xs text-slate-600 leading-relaxed">We execute your request quickly and securely.</p>
                    </div>
                </div>`
            },
            {
                heading: "Unmatched Privacy & Security",
                body: "By choosing a virtual mailbox in Concord Township, you gain the benefit of a professional street address while keeping your actual location private. Every piece of mail is handled by our trained staff and stored in a restricted area until you decide its final destination. No more cluttered mailboxes or missed packages while you're away."
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
                heading: "Reliable Mail Forwarding Across the Globe",
                body: "Moving temporarily? Traveling for the season? Or just need your business mail at your current location? Mailbox Plus provides <strong>seamless mail forwarding</strong> from Concord Township to anywhere in the world. We bundle your mail into consolidated shipments to save you money and ensure you never miss a critical document."
            },
            {
                heading: "Flexible Forwarding & Management",
                body: `<div class="grid gap-6 md:grid-cols-2 my-8">
                    <div class="p-6 rounded-3xl bg-white/60 border border-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-[#0855B1]/10 flex items-center justify-center text-[#0855B1]">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 class="font-bold text-slate-900 text-lg">Scheduled or On-Demand</h3>
                        </div>
                        <p class="text-sm text-slate-600 leading-relaxed font-medium">Choose a frequency that works for you—weekly, bi-weekly, or monthly. Or simply call us when you're ready for a bundle. You have total control.</p>
                    </div>
                    <div class="p-6 rounded-3xl bg-white/60 border border-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-[#0855B1]/10 flex items-center justify-center text-[#0855B1]">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                            <h3 class="font-bold text-slate-900 text-lg">Consolidated Savings</h3>
                        </div>
                        <p class="text-sm text-slate-600 leading-relaxed font-medium">We can repack multiple envelopes and packages into a single box to significantly reduce your shipping costs while ensuring security.</p>
                    </div>
                </div>`
            },
            {
                heading: "Mailbox Plus vs. Standard USPS Forwarding",
                body: `<div class="overflow-x-auto my-6">
                    <table class="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm bg-white/40">
                        <thead class="bg-slate-100/60">
                            <tr>
                                <th class="p-4 font-semibold text-slate-900">Feature</th>
                                <th class="p-4 font-semibold text-[#0855B1]">Mailbox Plus</th>
                                <th class="p-4 font-semibold text-slate-900">USPS Forwarding</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr>
                                <td class="p-4 text-slate-700 font-medium">Package Forwarding</td>
                                <td class="p-4 text-slate-900 font-bold">Yes (All Carriers)</td>
                                <td class="p-4 text-slate-600 italic">Limited / Pricey</td>
                            </tr>
                            <tr>
                                <td class="p-4 text-slate-700 font-medium">Frequency Control</td>
                                <td class="p-4 text-slate-900 font-bold">Custom/On-Demand</td>
                                <td class="p-4 text-slate-600 italic">Automatic/Bulk</td>
                            </tr>
                            <tr>
                                <td class="p-4 text-slate-700 font-medium">Carrier Options</td>
                                <td class="p-4 text-slate-900 font-bold">UPS, FedEx, DHL, USPS</td>
                                <td class="p-4 text-slate-600 italic">USPS Only</td>
                            </tr>
                            <tr>
                                <td class="p-4 text-slate-700 font-medium">Local Reliability</td>
                                <td class="p-4 text-slate-900 font-bold">Lake County Staff</td>
                                <td class="p-4 text-slate-600 italic">Automated System</td>
                            </tr>
                        </tbody>
                    </table>
                </div>`
            },
            {
                heading: "Serving Lake County Travelers",
                body: "Don't let your mail pile up while you're away. Residents of <strong>Concord Township, Ohio</strong>, Mentor, Painesville, and Willoughby trust Mailbox Plus to manage their mail forwarding needs with professionalism and care. Our service is a core benefit for all private mailbox holders, finding the fastest and most cost-effective way to get your mail to your doorstep, wherever you are."
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
