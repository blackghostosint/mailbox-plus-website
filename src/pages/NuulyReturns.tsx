import React from "react";
import { motion } from "framer-motion";
import {
    Shirt,
    RotateCcw,
    PackageCheck,
    MapPin,
    Clock,
    CheckCircle,
    ArrowRight,
    Truck,
    Box
} from "lucide-react";
import { Meta, Breadcrumbs, JsonLd } from "../components";
import { CTASection } from "../components/sections/CTA";
import { CompetitorAlternativeSection } from "../components/sections/CompetitorAlternative";
import { siteConfig } from "../config/siteConfig";
import { getServiceSchema, getWebPageSchema } from "../utils/schema";
import { getServiceImageUrl } from "../lib/storage";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "../components/ui/accordion";
import { SmartImage } from "../components/SmartImage";
import { InternalLink } from "../components/ui/InternalLink";

// Local definition of service data to ensure standalone functionality
const nuulyServiceData = {
    id: "nuuly-returns",
    serviceName: "Nuuly Returns Drop-Off",
    pageTitle: "Nuuly Returns Drop-Off in Concord Township, OH | Mailbox Plus",
    metaDescription: "Fast, easy Nuuly returns in Concord Township, OH. Drop off your Nuuly rental bag at Mailbox Plus. We scan, receipt, and ship via UPS. No boxing needed.",
    slug: "/nuuly-returns",
    category: "shipping" as const,
    shortDescription: "Drop off your Nuuly rentals here.",
    heroTitle: "Nuuly Returns Made Easy",
    heroSubtitle: "Simply drop off your Nuuly reusable bag. We handle the rest.",
    heroImage: getServiceImageUrl("/images/nullyreturns.webp"),
    keywords: "Nuuly returns Concord OH, Nuuly drop off Mentor, clothing rental returns Painesville, UPS drop off for Nuuly, Mailbox Plus Nuuly"
};

export const NuulyReturns: React.FC = () => {
    const url = `${siteConfig.domain}${nuulyServiceData.slug}`;

    // JSON-LD Data for LocalBusiness specific to this service
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Nuuly Returns Drop-Off Service",
        "provider": {
            "@type": "LocalBusiness",
            "name": "Mailbox Plus",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": siteConfig.contact.address.street,
                "addressLocality": siteConfig.contact.address.city,
                "addressRegion": siteConfig.contact.address.state,
                "postalCode": siteConfig.contact.address.zip,
                "addressCountry": "US"
            }
        },
        "areaServed": [
            "Concord Township",
            "Mentor",
            "Painesville",
            "Chardon",
            "Leroy Township",
            "Lake County"
        ],
        "url": url,
        "description": nuulyServiceData.metaDescription
    };

    const faqs = [
        {
            question: "Do I need to box my Nuuly return?",
            answer: "No! Nuuly rentals are returned in the same reusable zippered bag they arrived in. Just make sure the return label is inserted into the clear plastic sleeve on the bag."
        },
        {
            question: "Is there a charge to drop off my Nuuly bag?",
            answer: "No. If you have your pre-paid UPS return label included with your Nuuly subscription, dropping it off at Mailbox Plus is completely free."
        },
        {
            question: "How do I get my return receipt?",
            answer: "We scan your package immediately upon arrival and provide you with a printed receipt that includes your tracking number. This is your proof of return."
        },
        {
            question: "What if I lost my return label?",
            answer: "You can typically reprint your return label from your Nuuly account online. We can also print it for you if you email the label to us (printing fees may apply)."
        },
        {
            question: "Can I drop off other clothing rentals here?",
            answer: "Yes! In addition to the Nuuly clothing rental program, we accept returns for Rent the Runway, Stitch Fix, and other subscription services that use UPS or FedEx shipping."
        },
        {
            question: "When is the best time to drop off?",
            answer: "We are open 6 days a week with extended hours compared to the post office. Any time during our operating hours is perfect for a quick drop-and-go."
        }
    ];

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-white">
            {/* SEO Metadata */}
            <Meta
                title={nuulyServiceData.pageTitle}
                description={nuulyServiceData.metaDescription}
                keywords={nuulyServiceData.keywords}
                canonical={url}
            />

            {/* Structured Data */}
            <JsonLd schema={getWebPageSchema(siteConfig, { name: nuulyServiceData.pageTitle, description: nuulyServiceData.metaDescription, url })} />
            <JsonLd schema={getServiceSchema(siteConfig, { ...nuulyServiceData, url })} />
            <JsonLd schema={localBusinessSchema} />

            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <Breadcrumbs service={nuulyServiceData} />
            </div>

            {/* Hero Section */}
            <section className="relative bg-[#0855B1] py-16 lg:py-24 text-center overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <SmartImage
                        priority
                        src={nuulyServiceData.heroImage}
                        alt="Nuuly Returns Drop-Off at Mailbox Plus"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
                    >
                        Nuuly Returns Drop-off
                    </motion.h1>
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto mb-8"
                    >
                        The easiest way to return your Nuuly subscription rentals in Concord Township.
                        <br />
                        <span className="font-semibold text-white mt-2 block">
                            Scan, Drop, and Go in Minutes.
                        </span>
                    </motion.p>
                </div>
            </section>

            {/* Section 1: What Is Nuuly? */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-[#111827] mb-4">
                            What Is Nuuly?
                        </h2>
                        <div className="w-20 h-1 bg-[#0855B1] mx-auto rounded-full" />
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center">
                        Nuuly is a popular monthly clothing rental subscription service that lets fashion lovers explore new styles without the commitment of buying. Users rent 6 items every month from hundreds of well-known brands like <strong>Free People</strong>, <strong>Anthropologie</strong>, <strong>Urban Outfitters</strong>, and many vintage labels.
                    </p>
                    <div className="bg-blue-50/50 rounded-xl p-8 border border-blue-100">
                        <p className="text-gray-700 mb-4 font-medium">
                            We make the return leg of your rental journey seamless. As an authorized UPS drop-off point, Mailbox Plus ensures your Nuuly bag is scanned into the system immediately so your return is logged and your next month's box can be unlocked faster.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                            {["Free People", "Anthropologie", "Urban Outfitters", "Levi's", "Madewell"].map(brand => (
                                <span key={brand} className="px-3 py-1 bg-white text-blue-800 text-sm font-semibold rounded-full border border-blue-200 shadow-sm">
                                    {brand}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: How Nuuly Works */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-[#111827] text-center mb-12">How The Nuuly Process Works</h2>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Shirt,
                                title: "1. Rent",
                                desc: "Choose 6 items to rent for the month from thousands of styles."
                            },
                            {
                                icon: MapPin,
                                title: "2. Wear",
                                desc: "Wear them for work, parties, vacations, or just everyday life."
                            },
                            {
                                icon: RotateCcw,
                                title: "3. Return",
                                desc: "Pack items back in the reusable bag and drop off at Mailbox Plus."
                            },
                            {
                                icon: PackageCheck,
                                title: "4. Repeat",
                                desc: "Once scanned, select your next 6 items for the new month."
                            }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow"
                            >
                                <div className="w-14 h-14 bg-[#e6f0fa] text-[#0855B1] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <step.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-[#111827] mb-2">{step.title}</h3>
                                <p className="text-gray-600 leading-snug">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-sm text-gray-500 italic">
                            *Learn more at the official <a href="https://www.nuuly.com/how-it-works" target="_blank" rel="nofollow noreferrer" className="text-[#0855B1] underline">Nuuly How It Works</a> page.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3: Nuuly Returns Drop-Off at Mailbox Plus */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                        >
                            <h2 className="text-3xl font-bold text-[#111827] mb-6">
                                Nuuly Returns Drop-Off in Concord Township
                            </h2>
                            <div className="prose text-gray-700 leading-relaxed mb-6">
                                <p>
                                    Living in <strong>Concord Township, Mentor, Painesville, or Chardon</strong>? You don't need to drive far to return your Nuuly bag. Mailbox Plus is your convenient neighborhood <InternalLink to="/pack-ship/ups-authorized-shipper-outlet">UPS Authorized Shipping Outlet</InternalLink>.
                                </p>
                                <p className="mt-4">
                                    Why wait in line at the post office or deal with crowded corporate stores? We specialize in quick, friendly service so you can get on with your day.
                                </p>
                            </div>
                            <ul className="space-y-4 mb-4">
                                {[
                                    "Zero fees for drop-offs with pre-paid labels",
                                    "Instant receipt and tracking proof",
                                    "Convenient parking right out front",
                                    "Open Saturdays for weekend returns"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <InternalLink
                                    to="/contact-us"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0855B1] hover:bg-[#064494] transition-colors"
                                >
                                    Get Directions <ArrowRight className="ml-2 w-4 h-4" />
                                </InternalLink>
                            </div>
                        </motion.div>

                        <div className="relative h-[400px] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                            <SmartImage
                                src={getServiceImageUrl("mailbox_plus_storefront_hero_image.webp")}
                                alt="Mailbox Plus Storefront in Concord Township"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: What You Need Before Dropping Off */}
            <section className="py-16 bg-[#F0F7FF]">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-[#111827] text-center mb-8">What You Need Before Dropping Off</h2>
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-blue-100">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0855B1] font-bold shrink-0">1</div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">The Nuuly Reusable Bag</h3>
                                    <p className="text-gray-600">Place all your rented items back into the zippered bag they came in. No need for tape or boxes!</p>
                                </div>
                            </div>
                            <div className="w-full h-px bg-gray-100" />
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0855B1] font-bold shrink-0">2</div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">The UPS Return Label</h3>
                                    <p className="text-gray-600">Nuuly includes a return label in your shipment. Insert this label into the clear plastic sleeve on the outside of the bag. If you lost it, print a new one from your Nuuly account or ask us for help.</p>
                                </div>
                            </div>
                            <div className="w-full h-px bg-gray-100" />
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0855B1] font-bold shrink-0">3</div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Zip It Up</h3>
                                    <p className="text-gray-600">Ensure the bag is fully zipped and the security tie (if provided) is in place. That's it—you're ready to drop off!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 5: Local SEO Keyword Block */}
            <section className="py-12 bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Searching for <strong>"Nuuly returns near me"</strong> or <strong>"clothing rental drop off Concord OH"</strong>?
                        We are your local solution. Located conveniently in the Gristmill Village, we serve residents of
                        <span className="font-semibold text-gray-700"> Mentor, Painesville, Leroy Township, Chardon, and Willoughby</span>.
                        Whether you are returning <InternalLink to="/pack-ship/fedex-shipping">FedEx packages</InternalLink>,
                        <InternalLink to="/pack-ship/ups-authorized-shipper-outlet">UPS shipments</InternalLink>, or dropping off your monthly
                        Nuuly styles, Mailbox Plus is the community hub for all your <InternalLink to="/pack-ship">shipping services</InternalLink>.
                    </p>
                </div>
            </section>

            {/* Section 6: Why Choose Mailbox Plus */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[#111827]">Why Choose Mailbox Plus for Nuuly Returns?</h2>
                        <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
                            We offer more than just a drop-off point. We offer a stress-free experience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "No Lines, No Wait", desc: "Get in and out in under 2 minutes." },
                            { title: "Secure Handling", desc: "Your return is scanned instantly in your presence." },
                            { title: "Local & Friendly", desc: "We are a locally owned business that cares about your items." },
                            { title: "Extended Hours", desc: "Open late and on Saturdays for your convenience." },
                            { title: "Easy Parking", desc: "Pull right up to the front door—no mall traffic." },
                            { title: "All Returns Welcome", desc: "We accept all UPS, FedEx, USPS, and DHL returns." }
                        ].map((benefit, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-[#0855B1]" />
                                    <h3 className="font-bold text-gray-900">{benefit.title}</h3>
                                </div>
                                <p className="text-gray-600 text-sm ml-5">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 7: Step-By-Step Procedure */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-[#111827] mb-8">Step-by-Step Return Procedure</h2>
                    <div className="relative">
                        {/* Central Line */}
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200" />

                        <div className="space-y-12">
                            {[
                                { box: "01", title: "Prepare Bag", text: "Place clothes in the Nuuly bag and zip it closed." },
                                { box: "02", title: "Insert Label", text: "Slide the UPS return label into the plastic window." },
                                { box: "03", title: "Visit Us", text: "Bring the bag to Mailbox Plus in Concord Township." },
                                { box: "04", title: "Scan", text: "Hand it to our staff member who will scan the label." },
                                { box: "05", title: "Receipt", text: "Receive your printed drop-off receipt with tracking number." },
                                { box: "06", title: "Unlock", text: "Nuuly is notified of the return, unlocking your next box!" }
                            ].map((step, i) => (
                                <div key={i} className={`relative flex items-center justify-between md:justify-center ${i % 2 === 0 ? 'flex-row-reverse md:flex-row' : ''}`}>

                                    {/* Left Side Content (for even items like 0, 2, 4 -> steps 1, 3, 5? Wait, index 0 is Step 1. User wants 'Prepare Bag' on LEFT.
                                        If index 0 (Step 1) is 'Prepare Bag', it must be on LEFT.
                                        So even indices (0, 2, 4) should have text on START (Left).
                                        Odd indices (1, 3, 5) should have text on END (Right).
                                        
                                        Flex row standard:
                                        [Left Content] [Center] [Right Content]
                                        
                                        For Step 1 (Index 0):
                                        Need: [Text] [Number] [Empty]
                                        
                                        For Step 2 (Index 1):
                                        Need: [Empty] [Number] [Text]
                                     */}

                                    {/* Responsive Mobile View: Standard List */}
                                    <div className="flex md:hidden gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#0855B1] font-bold">
                                            {step.box}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#111827] mb-1">{step.title}</h3>
                                            <p className="text-gray-600">{step.text}</p>
                                        </div>
                                    </div>

                                    {/* Desktop View */}
                                    <div className="hidden md:flex w-full items-center justify-between">
                                        {/* Left Side */}
                                        <div className="w-5/12 flex justify-end px-4">
                                            {i % 2 === 0 && (
                                                <div className="text-right">
                                                    <h3 className="text-xl font-bold text-[#111827] mb-2">{step.title}</h3>
                                                    <p className="text-gray-600">{step.text}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Center Number Bubble */}
                                        <div className="w-2/12 flex justify-center relative z-10">
                                            <div className="w-12 h-12 bg-white border-4 border-[#0855B1] text-[#0855B1] rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                                                {step.box}
                                            </div>
                                        </div>

                                        {/* Right Side */}
                                        <div className="w-5/12 flex justify-start px-4">
                                            {i % 2 !== 0 && (
                                                <div className="text-left">
                                                    <h3 className="text-xl font-bold text-[#111827] mb-2">{step.title}</h3>
                                                    <p className="text-gray-600">{step.text}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 8: FAQ Section */}
            <section className="bg-gray-50 py-16 lg:py-24">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-[#111827] mb-8 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="mb-8 text-center">
                        <p className="text-gray-600">Common questions about the <a href="https://www.nuuly.com/faq" target="_blank" rel="nofollow noreferrer" className="text-[#0855B1] hover:underline">Nuuly clothing rental program</a> returns.</p>
                    </div>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, i) => (
                            <AccordionItem
                                key={i}
                                value={`faq-${i}`}
                                className="bg-white border border-gray-200 rounded-xl shadow-sm px-2"
                            >
                                <AccordionTrigger className="px-4 py-3 text-left font-semibold text-[#0855B1] hover:underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4 text-[#4B5563] leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* Section 9: Visit Us / CTA */}
            <section className="bg-white pb-16">
                <div className="max-w-5xl mx-auto px-6">
                    {/* Internal Links Block */}
                    <div className="mb-16 pt-8 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Explore More Services</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <InternalLink to="/pack-ship" className="hover:text-[#0855B1] underline decoration-gray-300 underline-offset-4">Shipping Services</InternalLink>
                            <span className="text-gray-300">|</span>
                            <InternalLink to="/pack-ship/ups-authorized-shipper-outlet" className="hover:text-[#0855B1] underline decoration-gray-300 underline-offset-4">UPS Shipping Options</InternalLink>
                            <span className="text-gray-300">|</span>
                            <InternalLink to="/pack-ship/fedex-shipping" className="hover:text-[#0855B1] underline decoration-gray-300 underline-offset-4">FedEx Services</InternalLink>
                            <span className="text-gray-300">|</span>
                            <InternalLink to="/pack-ship/usps-services" className="hover:text-[#0855B1] underline decoration-gray-300 underline-offset-4">USPS Post Office Services</InternalLink>
                            <span className="text-gray-300">|</span>
                            <InternalLink to="/pack-ship/package-drop-offs" className="hover:text-[#0855B1] underline decoration-gray-300 underline-offset-4">All Return Services</InternalLink>
                        </div>
                    </div>

                    <CTASection
                        cta={{
                            title: "Ready to return your Nuuly bag?",
                            subtitle: "Visit Mailbox Plus in Concord Township today. Fast, free, and friendly drop-off.",
                            buttonText: "Get Directions to Store",
                            buttonLink: "/contact-us",
                            variant: "brand"
                        }}
                    />
                </div>
            </section>

            {/* Competitor Alternative Section - Good for overall SEO reinforcement */}
            <CompetitorAlternativeSection />
        </div>
    );
};

export default NuulyReturns;
