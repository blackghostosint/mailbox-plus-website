import {
    Mail, Users, Star, Scissors, Shield, Archive, FileText, FolderOpen, Printer, MapPin, Lock, Clock
} from "lucide-react";
import { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";
import {
    generalHomeBusinessFaqs,
    everyDoorDirectMailFaqs,
    shreddingFaqs,
    documentScanningFaqs,
    faxServicesFaqs
} from "../faqs";

export const documentServices: Service[] = [
    // ---------------------------
    // DOCUMENT SERVICES
    // ---------------------------
    {
        id: "every-door-direct-mail",
        category: "document-services",
        city: "Concord Township",
        serviceName: "Every Door Direct Mail (EDDM)",
        slug: "/home-business/every-door-direct-mail",
        pageTitle: "Every Door Direct Mail (EDDM) in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Grow your business with EDDM services in Concord Township. We help with design, printing, and USPS paperwork to reach every home in your target area.",
        keywords: "EDDM, direct mail, Concord Township, Lake County",
        heroTitle: "Every Door Direct Mail",
        heroSubtitle: "Reach your local community with cost-effective mail campaigns.",
        heroImage: getServiceImageUrl("/images/every-door-direct-mail.webp"),
        content: [
            {
                heading: "Grow Your Business",
                body: "EDDM helps you target local neighborhoods with affordable bulk mailings."
            },
            {
                heading: "Convenience & Flexibility",
                body: "EDDM is easy to use and cost-effective."
            },
            {
                heading: "Every Door Direct Mail Services in Concord Township, Ohio",
                body: `<strong>Every Door Direct Mail (EDDM)</strong> from Mailbox Plus makes it easy and affordable to reach potential customers in your local area—without needing a mailing list. Serving Concord Township and Lake County, Ohio, we help businesses design, print, and deliver targeted mail campaigns through the <strong>United States Postal Service (USPS)</strong>.

With EDDM, you can <strong>choose specific postal routes</strong> and deliver your postcards, flyers, or brochures directly to every home and business in that area. It’s a powerful way to promote <em>local sales, events, grand openings, and seasonal offers</em>—perfect for small businesses, restaurants, realtors, and service providers.

Mailbox Plus handles the entire process from start to finish, including:
• <strong>Design and printing</strong> of postcards and mailers
• <strong>Sorting and bundling</strong> for USPS route delivery
• <strong>Filing and paperwork assistance</strong> with the USPS EDDM program
• <strong>Drop-off coordination</strong> with the local post office

We ensure your marketing materials meet USPS size and format requirements while maximizing your reach and minimizing postage costs.

If you’re searching for <em>Every Door Direct Mail services near Concord Township</em> or need <em>local business mail marketing in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you plan, print, and deliver your message straight into your customers’ hands.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Mail, title: "Bulk Mailing", description: "Send to entire ZIP codes or routes." },
            { icon: Users, title: "Targeted Reach", description: "Focus on specific neighborhoods." },
            { icon: Star, title: "Affordable", description: "Save money compared to traditional mailing lists." }
        ],
        faqs: [...generalHomeBusinessFaqs, ...everyDoorDirectMailFaqs]
    },
    {
        id: "shredding",
        category: "document-services",
        city: "Concord Township",
        serviceName: "Shredding Services",
        slug: "/home-business/shredding",
        pageTitle: "Shredding Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Secure document shredding in Concord Township. Protect your identity and business data with our safe, confidential drop-off shredding service.",
        keywords: "shredding, document destruction, concord township, lake county",
        heroTitle: "Secure Shredding",
        heroSubtitle: "Protect your personal information with our shredding services.",
        heroImage: getServiceImageUrl("/images/shredding.webp"),
        content: [
            {
                heading: "Why Shred Documents?",
                body: "Prevent identity theft and protect sensitive information by securely shredding your documents."
            },
            {
                heading: "Convenient & Affordable",
                body: "Drop off your documents and we’ll handle the rest with secure shredding."
            },
            {
                heading: "Secure Document Shredding Services in Concord Township, Ohio",
                body: `<strong>Protect your privacy and prevent identity theft</strong> with professional document shredding from Mailbox Plus in Concord Township, Ohio. We offer <strong>secure shredding for personal, business, and legal documents</strong>, ensuring sensitive information is permanently destroyed in compliance with privacy regulations.

Our shredding process is <strong>safe, fast, and confidential</strong>—ideal for old files, receipts, invoices, financial records, or any documents containing personal information. Drop off your paperwork and we’ll handle it securely from start to finish. All shredded materials are <em>recycled responsibly</em> to help protect both your identity and the environment.

Mailbox Plus partners with certified shredding providers to guarantee your materials are handled according to <strong>industry and government compliance standards</strong>. Whether you need a one-time purge or ongoing shredding support for your business, we make it convenient and affordable.

If you’re searching for <em>secure document shredding near Concord Township</em> or need <em>confidential paper destruction in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you dispose of your sensitive documents safely, securely, and sustainably.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Scissors, title: "Confidential Destruction", description: "Your documents are securely shredded." },
            { icon: Shield, title: "Privacy Protection", description: "Protects against identity theft and fraud." },
            { icon: Archive, title: "Bulk Shredding", description: "We can handle small or large quantities." }
        ],
        faqs: [...generalHomeBusinessFaqs, ...shreddingFaqs]
    },
    {
        id: "document-scanning",
        category: "document-services",
        city: "Concord Township",
        serviceName: "Document Scanning",
        slug: "/home-business/document-scanning",
        pageTitle: "Document Scanning in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Professional document scanning services in Concord Township. Digitize your photos, files, and records for safe, space-saving storage.",
        keywords: "document scanning, digital files, concord township, lake county",
        heroTitle: "Document Scanning",
        heroSubtitle: "Convert your paper documents into digital files.",
        heroImage: getServiceImageUrl("/images/document-scanning.webp"),
        content: [
            {
                heading: "Go Paperless",
                body: "Digitize your important documents for easier storage and access."
            },
            {
                heading: "Secure Storage",
                body: "Your files are scanned with care and stored digitally."
            },
            {
                heading: "Document Scanning Services in Concord Township, Ohio",
                body: `<strong>Preserve, organize, and digitize your important paperwork</strong> with professional document scanning services from Mailbox Plus in Concord Township, Ohio. We provide <strong>secure, high-resolution scanning</strong> for personal, legal, and business documents—helping you convert cluttered paper files into easy-to-access digital copies.

Our team handles everything from <strong>single-page scans to bulk scanning projects</strong>, ensuring every page is captured clearly and confidentially. We can deliver files in your preferred format (PDF, JPEG, TIFF, or searchable PDF) on a flash drive, email, or cloud storage.

Whether you're a business owner archiving records, a homeowner protecting vital documents, or a student organizing notes, Mailbox Plus ensures <strong>fast turnaround and total privacy</strong>. Your originals are returned to you intact, and all digital copies are securely transferred.

If you're searching for <em>document scanning near Concord Township</em> or need <em>secure digital conversion services in Lake County, Ohio</em>, visit Mailbox Plus today. We'll help you protect your records, reduce clutter, and modernize your document storage with ease.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: FileText, title: "Digital Files", description: "Scan to PDF, JPEG, or other formats." },
            { icon: Shield, title: "Secure Handling", description: "We handle your documents with confidentiality." },
            { icon: FolderOpen, title: "Easy Organization", description: "Organize and access files digitally." }
        ],
        faqs: [...generalHomeBusinessFaqs, ...documentScanningFaqs]
    },
    {
        id: "fax-services",
        category: "document-services",
        city: "Concord Township",
        serviceName: "Fax Services",
        slug: "/home-business/fax-services",
        pageTitle: "Fax Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local fax services in Concord Township. Send and receive local, domestic, and international faxes securely and quickly.",
        keywords: "fax services, send fax, concord township, lake county",
        heroTitle: "Fax Services",
        heroSubtitle: "Send and receive faxes securely and quickly.",
        heroImage: getServiceImageUrl("/images/fax-services.webp"),
        content: [
            {
                heading: "Send Faxes Easily",
                body: "Whether for business or personal needs, we help you send documents anywhere."
            },
            {
                heading: "Receive Faxes at Our Location",
                body: "Use our store as your fax number and pick up documents securely."
            },
            {
                heading: "Fax Services in Concord Township, Ohio",
                body: `<strong>Send and receive faxes quickly and securely</strong> with professional fax services from Mailbox Plus in Concord Township, Ohio. Whether you need to transmit <strong>legal documents, forms, applications, or business papers</strong>, we make faxing fast, easy, and reliable—no fax machine required.
    
    Our in-store team can help you <strong>send local, domestic, and international faxes</strong> while ensuring your information remains private and confidential. You’ll receive a printed confirmation sheet for every fax sent, giving you proof of transmission for your records.
    
    We also provide <strong>fax receiving services</strong>—simply have your sender fax their documents to our store, and we’ll securely hold them for pickup. This is a convenient solution for individuals and small businesses who don’t have their own fax equipment but still need a trusted location for document transmission.
    
    If you’re searching for <em>fax services near Concord Township</em> or need <em>secure fax sending and receiving in Lake County, Ohio</em>, stop by Mailbox Plus today. We’ll help you handle your faxing needs quickly, accurately, and confidentially.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Printer, title: "Send & Receive", description: "Full fax services available." },
            { icon: Shield, title: "Secure Transmission", description: "Your information is kept private." },
            { icon: MapPin, title: "Local Access", description: "Conveniently send and receive in Concord Township." }
        ],
        faqs: [...generalHomeBusinessFaqs, ...faxServicesFaqs]
    },
    {
        id: "document-services-concord-township",
        category: "document-services",
        city: "Concord Township",
        serviceName: "Document Services",
        slug: "/document-services-concord-township",
        pageTitle: "Document Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Complete document services in Concord Township: printing, copying, scanning, faxing, notary, and shredding. Your local business support center.",
        keywords: "document services, Concord Township, Mailbox Plus",
        heroTitle: "Professional Document Services in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus is your trusted provider of document services in Concord Township, Ohio.",
        heroImage: getServiceImageUrl("/images/document-printing.webp"),
        content: [
            {
                heading: "Professional Document Services in Concord Township",
                body: `<p class="text-lg leading-relaxed mb-6">
                    Mailbox Plus is your trusted provider of <strong>document services in Concord Township, Ohio</strong>. 
                    Whether you need to print a report, notarize a legal form, or securely shred sensitive files, our experienced team 
                    is here to assist. We offer a full suite of services to help you manage your personal and business paperwork 
                    with ease and confidentiality.
                </p>
                <div class="grid md:grid-cols-2 gap-8 mt-8">
                    <div class="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <h4 class="text-xl font-bold text-blue-900 mb-4">Complete Document Solutions</h4>
                        <ul class="space-y-3">
                            <li class="flex items-center gap-3">
                                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span class="text-gray-700"><strong>Printing & Copying:</strong> High-quality color and B&W.</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span class="text-gray-700"><strong>Notary Services:</strong> Official notarization for legal forms.</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span class="text-gray-700"><strong>Secure Shredding:</strong> Safe destruction of confidential files.</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span class="text-gray-700"><strong>Scanning & Faxing:</strong> Digitize or send files quickly.</span>
                            </li>
                        </ul>
                    </div>
                    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h4 class="text-xl font-bold text-slate-900 mb-4">Why Local Choice Matters</h4>
                        <p class="text-gray-600 leading-relaxed italic">
                            "Skip the office supply store lines and enjoy personalized service right in your neighborhood. 
                            We handle your sensitive documents with the utmost care and confidentiality."
                        </p>
                    </div>
                </div>`,
                isFullWidth: true
            },
            {
                heading: "Why Choose Mailbox Plus for Documents?",
                body: `<div class="grid md:grid-cols-3 gap-6">
                    <div class="p-4 border-l-4 border-blue-500 bg-white shadow-sm">
                        <h5 class="font-bold text-blue-900">Security</h5>
                        <p class="text-sm text-gray-600">Utmost care and confidentiality for all sensitive files.</p>
                    </div>
                    <div class="p-4 border-l-4 border-blue-500 bg-white shadow-sm">
                        <h5 class="font-bold text-blue-900">Expertise</h5>
                        <p class="text-sm text-gray-600">Staff trained for complex print jobs and notary requirements.</p>
                    </div>
                    <div class="p-4 border-l-4 border-blue-500 bg-white shadow-sm">
                        <h5 class="font-bold text-blue-900">Speed</h5>
                        <p class="text-sm text-gray-600">Get your tasks done quickly and get back to your day.</p>
                    </div>
                </div>`
            }
        ],
        features: [
            { title: "Privacy", description: "Discreet & Secure.", icon: Lock },
            { title: "Service Speed", description: "Fast & Efficient.", icon: Clock },
            { title: "Personal Attention", description: "Dedicated Staff.", icon: Users }
        ],
        faqs: [
            {
                question: "What documents can you notarize?",
                answer: "We can notarize most documents, including wills, powers of attorney, and real estate forms. Please bring a valid ID."
            },
            {
                question: "Is your shredding service secure?",
                answer: "Yes, we place your documents in a locked bin until they are securely shredded by a certified service."
            },
            {
                question: "Can you scan multiple pages to one PDF?",
                answer: "Yes, our high-speed scanners can combine multiple pages into a single digital file for easy emailing."
            }
        ]
    }
];
