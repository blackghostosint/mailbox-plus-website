import {
    Package, Shield, Globe, Truck
} from "lucide-react";
import { Service } from "../../../types/services";
import { getServiceImageUrl } from "../../../lib/storage";
import {
    generalShippingFaqs,
    artworkShippingFaqs,
    bicycleShippingFaqs,
    golfClubShippingFaqs
} from "../../faqs";

export const specialtyShippingServices: Service[] = [
    {
        id: "artwork-shipping",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Artwork Shipping",
        slug: "/pack-ship/artwork-shipping",
        pageTitle: "Artwork Shipping in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Professional artwork shipping in Concord Township. Custom packing and crating for paintings, sculptures, and fine art. Insured worldwide delivery.",
        keywords: "artwork shipping, fine art shipping, packing paintings, Concord Township, Lake County",
        heroTitle: "Artwork Shipping Services",
        heroSubtitle: "Expert packing and shipping solutions for paintings, sculptures, and fine art.",
        heroImage: getServiceImageUrl("/images/artwork-shipping.webp"),
        content: [
            {
                heading: "Expert Art Handling",
                body: "We understand the unique challenges of transporting artwork. From canvases to sculptures, our packing methods are tailored to protect every piece."
            },
            {
                heading: "Trusted by Collectors & Galleries",
                body: "Our team regularly works with private collectors, galleries, and artists to ensure their valuable items are packed and shipped with the highest standards."
            },
            {
                heading: "Professional Artwork Shipping in Concord Township, Ohio",
                body: `At Mailbox Plus, we specialize in the careful, professional packing and shipping of fine artwork throughout Concord Township, Lake County, and beyond. Whether you're an artist, collector, or gallery owner, our team provides white-glove service using archival-grade materials, custom-fit crates, and shock-resistant packaging. Each shipment is designed to protect the integrity of your art—from oil paintings and framed prints to sculptures and antiques—during domestic and international transport.

Our shipping experts coordinate with trusted carriers including FedEx, UPS, DHL, and USPS, ensuring your art arrives safely and on time. We also offer specialized insurance coverage for high-value pieces, so you can ship with confidence. As part of the local art community, we understand the value of craftsmanship, preservation, and presentation—and treat every item with the care it deserves.

If you're searching for <strong>artwork shipping near Concord Township</strong>, or need <strong>professional fine art packing in Lake County</strong>, visit us today or schedule a free consultation. We'll handle every detail—so your masterpiece arrives ready to impress.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Package, title: "Custom Crating", description: "We design custom crates for delicate artwork." },
            { icon: Shield, title: "Insured Shipments", description: "Third-party insurance covers valuable art pieces." },
            { icon: Globe, title: "Worldwide Delivery", description: "Safe international shipping with customs assistance." }
        ],
        faqs: [...generalShippingFaqs, ...artworkShippingFaqs],
        cta: {
        title: "Ready to ship your artwork?",
        subtitle: "Custom packing, insurance, and careful handling—done locally.",
        buttonText: "Schedule a Consult",
        buttonLink: "/contact-us",
        variant: "brand",
        align: "left"
        }
    },
    {
        id: "bicycle-shipping",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Bicycle Shipping",
        slug: "/pack-ship/bicycle-shipping",
        pageTitle: "Bicycle Shipping in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Safe bicycle shipping services in Concord Township. We pack and ship road bikes, mountain bikes, and e-bikes securely. Box and ship your bike today.",
        keywords: "bicycle shipping, bike box, shipping bicycles, Concord Township, Lake County",
        heroTitle: "Bicycle Shipping Experts",
        heroSubtitle: "Professional packing and shipping services for bicycles of all sizes.",
        heroImage: getServiceImageUrl("/images/bicycle-shipping.webp"),
        content: [
            {
                heading: "Shipping Bikes Made Simple",
                body: "Whether you're a cycling enthusiast or sending a bike to a loved one, we take care of the entire process from packing to shipping."
            },
            {
                heading: "E-Bike & Specialty Handling",
                body: "We can accommodate e-bikes and specialty bikes with safe packaging and compliance for battery shipments."
            },
            {
                heading: "Bicycle Shipping Experts in Concord Township, Ohio",
                body: `At Mailbox Plus, we make shipping your bicycle simple, safe, and stress-free. Whether you're sending your road bike across the country for a race, shipping an e-bike to a new owner, or returning a mountain bike from repair, our expert team handles every detail with care. We use high-quality bike boxes, protective foam, and frame stabilizers to ensure your ride arrives in perfect condition.

We ship through trusted carriers including UPS, FedEx, DHL, and USPS, giving you the best balance of speed and value. You can even track your shipment every step of the way. Need help packing? Our team can disassemble handlebars, pedals, and accessories, then reassemble your bike's packaging for a professional fit that meets carrier standards.

As your local bicycle shipping partner in Concord Township and Lake County, we're proud to help cyclists, clubs, and shops move bikes safely nationwide. If you're searching for <strong>"bike shipping near Concord Township"</strong> or <strong>"ship my bicycle in Lake County"</strong>, visit Mailbox Plus today — we'll handle the packing, labeling, and shipping, so you can focus on the ride ahead.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Package, title: "Custom Bike Boxes", description: "We provide reinforced bike boxes for safe transit." },
            { icon: Shield, title: "Protection Guaranteed", description: "Expert packing ensures frames and wheels stay secure." },
            { icon: Truck, title: "Domestic & International", description: "We ship bikes anywhere in the US or worldwide." }
        ],
        faqs: [...generalShippingFaqs, ...bicycleShippingFaqs]
    },
    {
        id: "golf-club-shipping",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Golf Club Shipping",
        slug: "/pack-ship/golf-club-shipping",
        pageTitle: "Golf Club Shipping in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Ship your golf clubs from Concord Township without the hassle. Secure packing and insured shipping for golf bags. Travel light to your next tee time.",
        keywords: "golf club shipping, sports equipment shipping, Concord Township, Lake County",
        heroTitle: "Golf Club Shipping",
        heroSubtitle: "Ship your golf clubs safely and conveniently worldwide.",
        heroImage: getServiceImageUrl("/images/golf-club-shipping.webp"),
        content: [
            {
                heading: "Safe Shipping for Your Clubs",
                body: "Whether you’re traveling for a tournament or sending clubs to a destination, we pack and ship them securely."
            },
            {
                heading: "Trusted by Golfers",
                body: "We've shipped golf bags and club sets for recreational players and professionals alike."
            },
            {
                heading: "Golf Club Shipping Experts in Concord Township, Ohio",
                body: `At Mailbox Plus, we specialize in safely packing and shipping golf clubs, bags, and equipment for players throughout Concord Township, Lake County, and beyond. Whether you're heading to a tournament, shipping clubs to a vacation destination, or returning gear to a manufacturer, we make the process simple, affordable, and secure.

Our expert team uses reinforced boxes, shaft guards, bubble wrap, and cushioning materials designed to protect your clubs from impact or pressure during transit. We work with trusted carriers including UPS, FedEx, DHL, and USPS to offer the best balance of price and delivery speed—so your gear arrives on time and ready to play.

As your local shipping partner, we understand how important your clubs are. We offer insurance options for added peace of mind and handle all the labeling, documentation, and drop-off logistics for you. If you're searching for **"golf club shipping near Concord Township"** or need **safe golf bag delivery in Lake County**, visit Mailbox Plus today. Let us handle your shipment from tee to green—so you can focus on your next round.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Package, title: "Custom Packing", description: "We provide reinforced boxes for golf clubs." },
            { icon: Shield, title: "Insured Options", description: "Coverage available for valuable sets." },
            { icon: Globe, title: "Ship Anywhere", description: "Domestic and international golf club shipping." }
        ],
        faqs: [...generalShippingFaqs, ...golfClubShippingFaqs]
    }
];