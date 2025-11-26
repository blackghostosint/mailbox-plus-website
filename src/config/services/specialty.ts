import {
    Fingerprint, Shield, Truck, Package, Star
} from "lucide-react";
import { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";
import {
    digitalFingerprintingFaqs,
    insuranceFaqs
} from "../faqs";

export const specialtyServices: Service[] = [
    // ---------------------------
    // SPECIALTY
    // ---------------------------
    {
        id: "digital-fingerprinting",
        category: "additional-services", // Keeping original category from file, even though file grouped it under specialty. 
        // Wait, original file had `category: "additional-services"` for digital-fingerprinting but was in SPECIALTY section.
        // I should probably keep the category as is to avoid breaking anything that filters by category string.
        city: "Concord Township",
        serviceName: "Digital Fingerprinting",
        slug: "/specialty/digital-fingerprinting",
        pageTitle: "Digital Fingerprinting in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Authorized digital fingerprinting and background checks (BCI & FBI) in Concord Township. Fast, secure, and inkless LiveScan technology.",
        keywords: "digital fingerprinting, livescan, background check, Concord Township, Lake County",
        heroTitle: "Digital Fingerprinting",
        heroSubtitle: "Quick, secure fingerprinting for background checks and licensing.",
        heroImage: getServiceImageUrl("/images/digital-fingerprinting.webp"),
        content: [
            {
                heading: "Why Choose Digital Fingerprinting?",
                body: "Our advanced LiveScan technology captures fingerprints electronically for faster results and fewer errors."
            },
            {
                heading: "Approved & Trusted",
                body: "We are an approved provider for state and federal background checks, making the process simple and secure."
            },
            {
                heading: "Digital Fingerprinting and Background Checks in Concord Township, Ohio",
                body: `<strong>Mailbox Plus is an authorized partner of FastFingerprints</strong>, offering <strong>digital fingerprinting and electronic background check services</strong> for employment, licensing, volunteering, and personal security needs. We make it easy to complete secure fingerprint-based background checks right here in Concord Township, Ohio.

FastFingerprints helps <strong>businesses and families protect themselves</strong> by accelerating the hiring and licensing process with <strong>electronic fingerprinting</strong>—the fastest, most accurate, and most secure method available. This process allows for timely and confident decisions regarding employment, licensing, and volunteer screening.

Individuals who can benefit from digital fingerprint-based background checks include:
Bus drivers, childcare providers, coaches, healthcare professionals, in-home caregivers, nannies, teachers, renters, volunteers, and more.

We offer both <strong>Ohio BCI (Bureau of Criminal Investigation) background checks</strong> and <strong>FBI national background checks</strong>:

• <strong>Ohio BCI Checks</strong> — These state-level checks search the Ohio Attorney General’s criminal database to identify convictions or arrests within Ohio. BCI checks are commonly required for employment, licensing, and volunteer work to ensure safety and compliance.

• <strong>FBI Background Checks</strong> — Nationwide checks that include records from across the United States. Often required for security clearance, adoption, foster care, and employment in sensitive professions such as education and healthcare.

Our digital system uses <strong>Ohio LiveScan technology</strong>, which captures and transmits fingerprints electronically—no ink required. LiveScan offers faster processing times, higher image accuracy, and greater convenience. The fingerprints are digitally submitted to BCI or the FBI for secure background processing.

FastFingerprints and Mailbox Plus provide a seamless, compliant, and confidential experience for every applicant. To schedule your appointment, visit <a href="https://register.fastfingerprints.com/account-entry" target="_blank" rel="noopener noreferrer" class="text-[#0855B1] underline">register.fastfingerprints.com/account-entry</a> and select Mailbox Plus as your service location.

If you’re searching for <em>digital fingerprinting in Concord Township</em> or need <em>BCI or FBI background check services in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you complete your background check quickly, securely, and professionally.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Fingerprint, title: "LiveScan Technology", description: "Fast, digital fingerprint capture with no messy ink." },
            { icon: Shield, title: "Secure Processing", description: "Your data is transmitted securely to the proper authorities." },
            { icon: Truck, title: "Quick Results", description: "Most fingerprint submissions are processed within days." }
        ],
        faqs: digitalFingerprintingFaqs
    },
    {
        id: "insurance",
        category: "additional-services", // Same here, original file had this category
        city: "Concord Township",
        serviceName: "Shipping Insurance",
        slug: "/specialty/insurance",
        pageTitle: "Shipping Insurance in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Comprehensive shipping insurance in Concord Township. Protect your valuable shipments against loss or damage with our 3rd-party coverage options.",
        keywords: "shipping insurance, package insurance, Marsh insurance, Concord Township, Mentor, Painesville, Eastlake, Lake County",
        heroTitle: "Peace of Mind Shipping Insurance",
        heroSubtitle: "Extra protection for your valuable shipments with Marsh third-party coverage.",
        heroImage: getServiceImageUrl("/images/insurance.webp"),
        content: [
            {
                heading: "Comprehensive Shipping Protection",
                body: `At Mailbox Plus, we provide <strong>complete shipping insurance solutions</strong> that protect your packages from loss or damage while in transit. Whether you’re shipping across the country or overseas, our <strong>full-coverage insurance options</strong> ensure that your shipment value—including materials, labor, and transport costs—is completely protected.`
            },
            {
                heading: "Partnered with Marsh for Trusted Coverage",
                body: `Our <strong>Mailbox Plus Insurance Program</strong> is underwritten by <strong>Marsh</strong>, a global leader in cargo and risk management with more than 45,000 professionals worldwide. Together, we offer <strong>secure, affordable, and transparent shipping protection</strong> for both individuals and businesses—so every package you send is backed by the best in the industry.`
            },
            {
                heading: "Full-Coverage Shipping Insurance in Concord Township, Ohio",
                body: `<strong>Protect every shipment with full-coverage shipping insurance</strong> from Mailbox Plus in Concord Township, Ohio. Through our partnership with <strong>Marsh</strong>—the world’s leading cargo insurance broker and risk adviser—we provide <strong>comprehensive package and cargo protection</strong> for both individuals and businesses. Marsh employs over 45,000 professionals and serves clients in more than 130 countries, offering unmatched expertise in <strong>risk management and logistics protection.</strong>

Unlike basic carrier liability, our <strong>Mailbox Plus Insurance Program</strong> delivers true coverage for your shipments. Standard "declared value" protection from carriers does not cover packaging costs, service markups, or profits, and excludes many causes of loss. Our policy covers shipments <strong>against all risks of physical loss or damage</strong>, including events often excluded from carrier protection such as <strong>Acts of God, theft, terrorism, strikes, riots, and civil commotion</strong>.

Coverage applies to <strong>shipments in transit and while awaiting carrier pickup</strong>—ensuring your cargo is protected from the moment it enters your care until it reaches its final destination. Claims are paid upon documentation, with no need to prove carrier fault or wait for lengthy claim processes.

**Key benefits of Mailbox Plus Shipping Insurance include:**
• Protection for the full value of your shipment—including packaging materials, labor, freight markup, and transportation charges.
• Coverage for shipments handled by multiple carriers and subcontractors.
• Fast and efficient claim resolution regardless of carrier liability.
• Affordable premiums that cost significantly less than carrier-provided coverage.
• Eligibility for both <strong>domestic and international shipments</strong>.

This program also allows retail shipping stores to <strong>extend true insurance coverage to drop-off customers</strong>, turning insurance into a valuable profit center while providing superior customer protection.

Coverage is available up to <strong>$50,000 per shipment</strong> with prior authorization required for higher-value items. Shipments over $1,000 must include <strong>Adult Signature Required</strong> delivery to validate insurance.

Mailbox Plus and Marsh are transforming how the retail shipping industry approaches risk management—offering genuine insurance coverage that safeguards your customers’ property and your business reputation.

If you’re searching for <em>shipping insurance near Concord Township</em> or need <em>cargo and package coverage in Lake County, Ohio</em>, visit Mailbox Plus today to learn how full-coverage insurance can protect every shipment you send.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Shield, title: "Third-Party Protection", description: "Coverage provided through Marsh, a trusted insurer." },
            { icon: Package, title: "High Value Coverage", description: "Insure shipments valued up to $50,000." },
            { icon: Star, title: "Peace of Mind Guarantee", description: "We’ll handle your package with care—and insure it too." }
        ],
        faqs: insuranceFaqs
    }
];
