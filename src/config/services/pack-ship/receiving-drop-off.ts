import {
    Package, Truck, MapPin, Shield, Clock
} from "lucide-react";
import { Service } from "../../../types/services";
import { getServiceImageUrl } from "../../../lib/storage";
import {
    generalShippingFaqs,
    packageDropOffsFaqs,
    packageReceivingFaqs
} from "../../faqs";

export const receivingDropOffServices: Service[] = [
    {
        id: "package-drop-offs",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Package Drop-Offs",
        slug: "/pack-ship/package-drop-offs",
        pageTitle: "Package Drop-Offs in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Free package drop-off location in Concord Township. Accepted carrier drop-offs: UPS, FedEx, USPS, and DHL. Drop off pre-labeled packages for free.",
        keywords: "package drop-offs, fedex, ups, usps, dhl, concord township",
        heroTitle: "Package Drop-Offs",
        heroSubtitle: "Drop off your pre-labeled packages for free with all major carriers.",
        heroImage: getServiceImageUrl("/images/package-drop-offs.webp"),
        content: [
            {
                heading: "Convenient Drop-Offs",
                body: "Already have a prepaid label? Drop off your packages here for FedEx, UPS, USPS, and DHL at no extra cost."
            },
            {
                heading: "Save Time & Gas",
                body: "Avoid long drives to carrier hubs and drop your packages at one local location."
            },
            {
                heading: "Convenient Package Drop-Offs in Concord Township, Ohio",
                body: `Mailbox Plus makes it simple and stress-free to drop off your pre-labeled packages for <strong>FedEx, UPS, DHL, and USPS</strong>. As an authorized drop-off location serving Concord Township and Lake County, we provide a secure and convenient way to handle your outgoing shipments—whether for business, online sales, or personal returns.

For returns, please note that <strong>a return shipping label is required</strong> on all packages. If you need your label printed, our team can help—<strong>label printing is available for just $2.00 per label</strong>. Unfortunately, <strong>we cannot process Amazon QR code returns at this time</strong>. However, <strong>FedEx QR code returns work successfully about 90% of the time</strong> for most eCommerce stores.

Once your package is labeled and sealed, simply drop it off with us. We'll scan it, verify the carrier, and ensure it's placed in the correct pickup area for daily carrier collection. Our staff makes sure your packages are processed securely and shipped on time.

Mailbox Plus also accepts <strong>Amazon, eBay, and prepaid returns</strong> with standard labels—making us your one-stop local destination for all carrier drop-offs.

If you're looking for <em>package drop-off near Concord Township</em> or need <em>authorized returns and shipping services in Lake County, Ohio</em>, visit Mailbox Plus today. We'll handle your shipment with care and help you get it where it needs to go.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Package, title: "All Carriers Accepted", description: "FedEx, UPS, USPS, and DHL drop-offs welcome." },
            { icon: Truck, title: "Free Service", description: "No charge for package drop-offs." },
            { icon: MapPin, title: "Local Convenience", description: "Located right in Concord Township." }
        ],
        faqs: [...generalShippingFaqs, ...packageDropOffsFaqs]
    },
    {
        id: "package-receiving",
        category: "pack-ship",
        city: "Concord Township",
        serviceName: "Package Receiving",
        slug: "/pack-ship/package-receiving",
        pageTitle: "Package Receiving in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Secure package receiving in Concord Township. Never miss a delivery again. We sign for your packages from all carriers. Safe, secure, and convenient.",
        keywords: "package receiving, mail handling, Concord Township, Lake County",
        heroTitle: "Package Receiving",
        heroSubtitle: "Let us sign for and securely store your packages.",
        heroImage: getServiceImageUrl("/images/package-receiving.webp"),
        content: [
            {
                heading: "Safe & Secure",
                body: "We accept packages from all carriers and keep them safe until you pick them up."
            },
            {
                heading: "Convenient & Affordable",
                body: "For occasional deliveries, we offer a straightforward $10.00 per package setup, or choose our UNLIMITED Package Receiving Plan for just $30.00 per month—perfect for individuals and small businesses that receive regular shipments."
            },
            {
                heading: "Secure Package Receiving Services in Concord Township, Ohio",
                body: `Mailbox Plus provides reliable and secure <strong>package receiving services</strong> for residents, small businesses, and travelers throughout Concord Township and Lake County. If you need a safe place to receive deliveries when you’re not home or want to protect your packages from theft, our service makes it simple to <strong>receive, hold, and pick up shipments safely and on your schedule</strong>.

We accept deliveries from all major carriers—<strong>UPS, FedEx, USPS, and DHL</strong>—and sign for them on your behalf. Every package is logged, stored in a secure area, and ready for pickup at your convenience. For occasional deliveries, we offer a straightforward <strong>$10.00 per package setup</strong>, or choose our <strong>UNLIMITED Package Receiving Plan for just $30.00 per month</strong>—a perfect solution for individuals and small businesses that receive regular shipments.

This service is also an excellent way to <strong>protect against the growing porch pirate theft problem</strong> affecting neighborhoods across Ohio and the rest of the United States. By having your packages delivered directly to Mailbox Plus, you ensure that your items are <strong>kept safe, secure, and out of sight</strong> until you’re ready to pick them up.

Our customers receive <strong>real-time delivery notifications</strong> and personalized assistance from our friendly local team. Whether you’re searching for <em>package receiving near Concord Township</em> or need <em>secure delivery holding in Lake County, Ohio</em>, Mailbox Plus offers affordable, flexible solutions designed to keep your deliveries safe and your peace of mind intact.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Package, title: "All Carriers", description: "FedEx, UPS, USPS, and DHL accepted." },
            { icon: Shield, title: "Secure Storage", description: "We keep your packages safe." },
            { icon: Clock, title: "Convenient Pickup", description: "Pick up packages during store hours." }
        ],
        faqs: [...generalShippingFaqs, ...packageReceivingFaqs]
    }
];
