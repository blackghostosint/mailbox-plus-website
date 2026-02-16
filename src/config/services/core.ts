import Package from '~icons/lucide/package';
import Shield from '~icons/lucide/shield';
import Truck from '~icons/lucide/truck';
import Printer from '~icons/lucide/printer';
import FileText from '~icons/lucide/file-text';
import Palette from '~icons/lucide/palette';
import Star from '~icons/lucide/star';
import type { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";
import { packShipFaqs, generalCopyPrintFaqs } from "../faqs";

export const coreServices: Service[] = [
    // ---------------------------
    // CORE
    // ---------------------------
    {
        id: "pack-ship",
        category: "core",
        city: "Concord Township",
        serviceName: "Pack & Ship",
        slug: "/pack-ship",
        pageTitle: "Pack & Ship in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Expert Pack & Ship services in Concord Township, Ohio. We ship via FedEx, UPS, USPS, and DHL. Custom packing, estate shipping, and freight services available.",
        keywords: "shipping, packing, FedEx, UPS, USPS, DHL, Concord Township, Lake County",
        heroTitle: "Pack & Ship Services",
        heroSubtitle: "Professional shipping solutions with FedEx, UPS, USPS, DHL and more.",
        heroImage: getServiceImageUrl("/images/pack-ship.webp"),
        content: [
            {
                heading: "Our Pack & Ship Services",
                body: `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div class="text-3xl mb-4">🏛️</div>
                            <h3 class="text-xl font-bold mb-2">Carrier Services</h3>
                            <p class="text-slate-600 mb-4">UPS, FedEx, USPS, and DHL shipping all in one place.</p>
                            <a href="/pack-ship/ups-authorized-shipper-outlet" class="text-blue-600 font-semibold hover:underline">Compare Carriers →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div class="text-3xl mb-4">🎨</div>
                            <h3 class="text-xl font-bold mb-2">Specialty Shipping</h3>
                            <p class="text-slate-600 mb-4">Custom shipping for artwork, bicycles, and golf clubs.</p>
                            <a href="/pack-ship/artwork-shipping" class="text-blue-600 font-semibold hover:underline">See Specialty →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div class="text-3xl mb-4">📦</div>
                            <h3 class="text-xl font-bold mb-2">Packing Services</h3>
                            <p class="text-slate-600 mb-4">Professional packing for fragile or heavy items.</p>
                            <a href="/pack-ship/packing-services" class="text-blue-600 font-semibold hover:underline">Meet the Pros →</a>
                        </div>
                    </div>
                `,
                isFullWidth: true
            },
            {
                heading: "Your Local Concord Township Shipping Center",
                body: `
                    <div class="text-center py-8">
                        <p class="text-slate-700 leading-relaxed max-w-3xl mx-auto">
                            As your complete <a href="/ups-fedex-usps-dhl-shipping-concord-township" class="text-blue-600 hover:underline">shipping center in Concord Township</a>, 
                            we offer <a href="/shipping-center-concord-township" class="text-blue-600 hover:underline">multi-carrier shipping services</a> including 
                            <a href="/pack-ship/ups-authorized-shipper-outlet" class="text-blue-600 hover:underline">UPS</a>, 
                            <a href="/pack-ship/fedex-shipping" class="text-blue-600 hover:underline">FedEx</a>, and 
                            <a href="/pack-ship/usps-services" class="text-blue-600 hover:underline">USPS</a> to help you find the best rate and delivery time.
                        </p>
                    </div>
                `,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Package, title: "All Major Carriers", description: "Ship with FedEx, UPS, USPS, or DHL from one convenient location." },
            { icon: Shield, title: "Expert Packing", description: "Our trained staff use professional materials to ensure safe delivery." },
            { icon: Truck, title: "Fast & Reliable", description: "Multiple speed options from overnight to economy ground service." }
        ],
        faqs: packShipFaqs
    },
    {
        id: "copy-print",
        category: "core",
        city: "Concord Township",
        serviceName: "Copy & Print",
        slug: "/copy-print",
        pageTitle: "Copy and Print Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Professional Copy & Print services in Concord Township. High-quality business cards, flyers, brochures, and document printing. Fast turnaround and local service.",
        keywords: "copy, print, business cards, flyers, banners, Concord Township, Lake County",
        heroTitle: "Copy & Print Services",
        heroSubtitle: "Professional printing services from business cards to large format banners. High-quality results with fast turnaround times.",
        heroImage: getServiceImageUrl("/images/document-printing.webp"),
        content: [
            {
                heading: "Our Printing Services",
                body: `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div class="text-3xl mb-4">📄</div>
                            <h3 class="text-xl font-bold mb-2">Document Printing</h3>
                            <p class="text-slate-600 mb-4">High-quality copies, manuals, and presentations.</p>
                            <a href="/copy-print/document-printing" class="text-blue-600 font-semibold hover:underline">Print Now →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div class="text-3xl mb-4">🏗️</div>
                            <h3 class="text-xl font-bold mb-2">Blueprints</h3>
                            <p class="text-slate-600 mb-4">Oversized prints for architects and engineers.</p>
                            <a href="/copy-print/blueprints" class="text-blue-600 font-semibold hover:underline">View Options →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div class="text-3xl mb-4">🪪</div>
                            <h3 class="text-xl font-bold mb-2">Business Cards</h3>
                            <p class="text-slate-600 mb-4">Professional cards that leave a lasting impression.</p>
                            <a href="/copy-print/business-cards" class="text-blue-600 font-semibold hover:underline">Get Noticed →</a>
                        </div>
                    </div>
                `,
                isFullWidth: true
            },
            {
                heading: "The Local Staples Printing Alternative",
                body: `
                    <div class="text-center py-8">
                        <p class="text-slate-700 leading-relaxed max-w-3xl mx-auto">
                            For professional <a href="/printing-services-concord-township" class="text-blue-600 hover:underline">local printing services</a>, 
                            we are your convenient <a href="/staples-printing-alternative-concord-township" class="text-blue-600 hover:underline">Staples printing alternative</a> in Concord Township. 
                            We also offer <a href="/home-business/notary-services" class="text-blue-600 hover:underline">notary public services</a> and 
                            <a href="/copy-print/document-printing" class="text-blue-600 hover:underline">document finishing</a>.
                        </p>
                    </div>
                `,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Printer, title: "Professional Quality", description: "High-resolution printing with vibrant colors" },
            { icon: FileText, title: "All Document Types", description: "From business cards to large format posters" },
            { icon: Palette, title: "Design Services", description: "Professional graphic design available" },
            { icon: Star, title: "Fast Turnaround", description: "Quick service for urgent printing needs" }
        ],
        faqs: generalCopyPrintFaqs
    }
];
