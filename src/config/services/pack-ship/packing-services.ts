import Box from '~icons/lucide/box';
import Shield from '~icons/lucide/shield';
import Package from '~icons/lucide/package';
import Star from '~icons/lucide/star';
import type { Service } from "../../../types/services";
import { getServiceImageUrl } from "../../../lib/storage";
import {
    generalShippingFaqs,
    customBoxMakingFaqs,
    professionalPackingFaqs,
    packagingSuppliesFaqs
} from "../../faqs";

export const packingServices: Service[] = [
    {
        id: "custom-box-making",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Custom Box Making",
        slug: "/pack-ship/custom-box-making",
        pageTitle: "Custom Box Making in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Custom box making service in Concord Township. We build heavy-duty, made-to-measure boxes for any item. Protect your shipment with custom packaging.",
        keywords: "custom boxes, packaging, concord township, lake county",
        heroTitle: "Custom Box Making",
        heroSubtitle: "We create custom-sized boxes for items that don't fit standard packaging.",
        heroImage: getServiceImageUrl("/images/custom-box-making.webp"),
        content: [
            {
                heading: "Made-to-Fit Packaging",
                body: "Some items just don't fit in standard boxes. We build custom solutions to fit your shipment perfectly."
            },
            {
                heading: "Protect Your Items",
                body: "Custom packaging ensures your items are secure during shipping."
            },
            {
                heading: "Made-to-Measure Design",
                body: "At Mailbox Plus, we specialize in <strong>custom box design and fabrication</strong>—perfect for safely shipping items that don't fit standard packaging sizes. From artwork and antiques to oversized products and fragile collectibles, our experts create boxes that ensure your shipment is <strong>secure, professional, and carrier-compliant</strong>."
            },
            {
                heading: "Precision Protection",
                body: "Each box is designed for your item's exact dimensions and shipping method, using high-quality corrugated materials for maximum protection. We also offer <strong>foam inserts, double-wall boxes, and reinforced corners</strong> to keep even the most delicate pieces safe during transit."
            },
            {
                heading: "Online Custom Box Calculator",
                body: `For customers who prefer a hands-on approach, we've developed an <strong>online custom box calculator</strong> available at <a href="https://boxsize.cc/" target="_blank" rel="noopener noreferrer" style="color: #2DA0ED; font-weight: bold;">https://boxsize.cc/</a>. This free tool allows you to <em>design, measure, and visualize your own box layout at home</em> before bringing it in for professional assembly or packing assistance.`
            },
            {
                heading: "Local Expertise",
                body: "Whether you're a small business shipping products or an individual preparing a one-of-a-kind item, Mailbox Plus offers <strong>custom box solutions built for precision and protection.</strong> If you're searching for <em>custom box making near Concord Township</em> visit us today."
            }
        ],
        features: [
            { icon: Box, title: "Custom Sizes", description: "Boxes built to fit your unique item." },
            { icon: Shield, title: "Secure Protection", description: "Keeps fragile or irregular items safe." },
            { icon: Package, title: "On-Demand Service", description: "We create boxes while you wait." }
        ],
        faqs: [...generalShippingFaqs, ...customBoxMakingFaqs]
    },
    {
        id: "professional-packing",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Professional Packing",
        slug: "/pack-ship/professional-packing",
        pageTitle: "Professional Packing in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Professional packing services in Concord Township. Expert packers for fragile, valuable, and odd-shaped items. We guarantee our packing for safe arrival.",
        keywords: "professional packing, secure shipping, concord township, lake county",
        heroTitle: "Professional Packing",
        heroSubtitle: "Let our experts pack your items for maximum protection.",
        heroImage: getServiceImageUrl("/images/professional-packing.webp"),
        content: [
            {
                heading: "Safe Packing, Every Time",
                body: "Our trained team knows how to pack fragile, heavy, and oversized items for safe shipping."
            },
            {
                heading: "Save Time & Stress",
                body: "Bring your items in and let us handle the packing so you can relax."
            },
            {
                heading: "Trusted Packing Experts",
                body: "At Mailbox Plus, we take the stress out of shipping with our <strong>professional packing services</strong>—trusted by residents and businesses throughout Concord Township. Whether you're shipping fragile glassware, valuable artwork, or electronics, our trained staff uses proven methods and high-quality materials to ensure every package is <strong>secure, protected, and carrier-approved</strong>."
            },
            {
                heading: "Custom Protective Solutions",
                body: "We provide <strong>custom packing solutions</strong> that match your item's size, weight, and fragility. From double-boxing and foam cushioning to bubble wrap and reinforced corners, every detail is handled with care. Our experts also specialize in <em>insurance-eligible packaging</em> to safeguard valuable shipments."
            },
            {
                heading: "Specialized On-Site Consultations",
                body: "For those who need specialized assistance, we offer <strong>on-site packing consultations</strong> and guidance on the best shipping materials for your needs. Whether you're preparing one item or managing a large shipment, we'll design the right packing plan for your timeline and budget."
            }
        ],
        features: [
            { icon: Shield, title: "Expert Team", description: "Professionally trained packers." },
            { icon: Package, title: "Quality Materials", description: "We use bubble wrap, foam, and sturdy boxes." },
            { icon: Star, title: "Proven Methods", description: "Techniques designed to minimize risk of damage." }
        ],
        faqs: [...generalShippingFaqs, ...professionalPackingFaqs]
    },
    {
        id: "packaging-supplies",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Packaging Supplies",
        slug: "/pack-ship/packaging-supplies",
        pageTitle: "Packaging Supplies in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Packaging supplies store in Concord Township. Boxes, bubble wrap, tape, and packing peanuts available. Everything you need to pack and ship securely.",
        keywords: "shipping supplies, boxes, tape, bubble wrap, concord township",
        heroTitle: "Packaging Supplies",
        heroSubtitle: "Everything you need to pack and ship your items.",
        heroImage: getServiceImageUrl("/images/packaging-supplies.webp"),
        content: [
            {
                heading: "One Stop for Supplies",
                body: "We carry boxes, tape, bubble wrap, and more—all the supplies you need to pack at home."
            },
            {
                heading: "Convenient & Affordable",
                body: "Avoid the big-box stores and pick up your supplies right where you ship."
            },
            {
                heading: "Full Range of Professional Supplies",
                body: "At Mailbox Plus, we stock a full range of <strong>professional packaging supplies</strong> to help you prepare shipments of any size or fragility. Serving Concord Township and surrounding communities, our shop carries everything you need to <strong>pack, protect, and ship your items securely</strong>."
            },
            {
                heading: "Carrier-Grade Materials",
                body: "Our inventory includes <strong>boxes, bubble wrap, tape, mailing tubes, and packing peanuts</strong>—plus specialty options like <em>double-wall cartons and custom-fit inserts</em>. We provide durable materials that meet <strong>carrier-grade standards</strong> for UPS, FedEx, DHL, and USPS."
            },
            {
                heading: "Expert Supply Guidance",
                body: "Need guidance? Our experts can help you choose the right materials for your shipment to ensure maximum protection and carrier compliance. We also offer <strong>custom box making</strong> for irregular items that require extra care."
            }
        ],
        features: [
            { icon: Package, title: "Variety of Boxes", description: "Multiple sizes and styles available." },
            { icon: Shield, title: "Protective Materials", description: "Bubble wrap, foam, and peanuts for safe shipping." },
            { icon: Star, title: "Everything Else", description: "Tape, labels, and more for your convenience." }
        ],
        faqs: [...generalShippingFaqs, ...packagingSuppliesFaqs]
    }
];
