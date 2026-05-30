import Package from '~icons/lucide/package';
import Shield from '~icons/lucide/shield';
import Globe from '~icons/lucide/globe';
import Truck from '~icons/lucide/truck';
import { Service } from '../../../types/services';
import { getServiceImageUrl } from '../../../lib/storage';
import {
  generalShippingFaqs,
  artworkShippingFaqs,
  bicycleShippingFaqs,
  golfClubShippingFaqs,
} from '../../faqs';

export const specialtyShippingServices: Service[] = [
  {
    id: 'artwork-shipping',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Artwork Shipping',
    slug: '/pack-ship/artwork-shipping',
    canonicalUrl: 'https://mailboxplusohio.com/pack-ship/artwork-shipping',
    pageTitle: 'Artwork Shipping in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Professional artwork shipping in Concord Township. Custom packing and crating for paintings, sculptures, and fine art. Insured worldwide delivery.',
    keywords:
      'artwork shipping, fine art shipping, packing paintings, Concord Township, Lake County',
    heroTitle: 'Artwork Shipping Services',
    heroSubtitle: 'Expert packing and shipping solutions for paintings, sculptures, and fine art.',
    heroImage: getServiceImageUrl('/images/artwork-shipping.webp'),
    content: [
      {
        heading: 'Professional Artwork Shipping & Preservation',
        body: 'Trust your masterpiece to the experts. We understand the unique challenges of transporting fine art, from delicate oil paintings to heavy sculptures. Our white-glove approach ensures every piece is handled with the highest standards of care and preservation.',
      },
      {
        heading: 'Gallery-Ready Protection',
        body: `<div class="grid md:grid-cols-2 gap-8 mt-8">
                    <div class="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <h4 class="text-xl font-bold text-blue-900 mb-4">White-Glove Art Handling</h4>
                        <ul class="space-y-3">
                            <li class="flex items-center gap-3">
                                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span class="text-gray-700"><strong>Archival Materials:</strong> We use acid-free packing supplies.</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span class="text-gray-700"><strong>Custom Crating:</strong> Precision-fit crates for fragile items.</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span class="text-gray-700"><strong>Expert Advice:</strong> Guidance on insurance and customs.</span>
                            </li>
                        </ul>
                    </div>
                    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h4 class="text-xl font-bold text-slate-900 mb-4">Gallery-Ready Service</h4>
                        <p class="text-gray-600 leading-relaxed italic">
                            "We bridge the gap between local creation and global delivery. Learn more about our 
                            <a href="/pack-ship/professional-packing" class="text-blue-600 font-semibold hover:underline">professional packing</a> 
                            for museum-grade protection."
                        </p>
                    </div>
                </div>`,
        isFullWidth: true,
      },
    ],
    features: [
      {
        icon: Package,
        title: 'Custom Crating',
        description: 'We design custom crates for delicate artwork.',
      },
      {
        icon: Shield,
        title: 'Insured Shipments',
        description: 'Third-party insurance covers valuable art pieces.',
      },
      {
        icon: Globe,
        title: 'Worldwide Delivery',
        description: 'Safe international shipping with customs assistance.',
      },
    ],
    faqs: [...generalShippingFaqs, ...artworkShippingFaqs],
    cta: {
      title: 'Ready to ship your artwork?',
      subtitle: 'Custom packing, insurance, and careful handling—done locally.',
      buttonText: 'Schedule a Consult',
      buttonLink: '/contact-us',
      variant: 'brand',
      align: 'left',
    },
  },
  {
    id: 'bicycle-shipping',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Bicycle Shipping',
    slug: '/pack-ship/bicycle-shipping',
    canonicalUrl: 'https://mailboxplusohio.com/pack-ship/bicycle-shipping',
    pageTitle: 'Bicycle Shipping in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Safe bicycle shipping services in Concord Township. We pack and ship road bikes, mountain bikes, and e-bikes securely. Box and ship your bike today.',
    keywords: 'bicycle shipping, bike box, shipping bicycles, Concord Township, Lake County',
    heroTitle: 'Bicycle Shipping Experts',
    heroSubtitle: 'Professional packing and shipping services for bicycles of all sizes.',
    heroImage: getServiceImageUrl('/images/bicycle-shipping.webp'),
    content: [
      {
        heading: 'Expert Bicycle Logistics & Packing',
        body: 'Planning a cycling trip or selling your ride? We take the stress out of bicycle logistics. From high-performance road bikes to heavy e-bikes, our team ensures your bicycle is packed securely and shipped via the most reliable carriers.',
      },
      {
        heading: 'Professional Standards',
        body: `<div class="grid md:grid-cols-2 gap-8 mt-8 bg-gray-50 p-8 rounded-3xl">
                    <div class="space-y-4">
                        <h4 class="text-xl font-bold text-gray-900 border-l-4 border-blue-500 pl-4">Carrier Flexibility</h4>
                        <p class="text-gray-600">
                            We ship your bike via 
                            <a href="/pack-ship/fedex-shipping" class="font-bold text-gray-900 hover:text-blue-600 underline decoration-blue-500/30">FedEx</a> or 
                            <a href="/pack-ship/ups-authorized-shipper-outlet" class="font-bold text-gray-900 hover:text-blue-600 underline decoration-blue-500/30">UPS</a>, 
                            comparing rates to find the best value for your route.
                        </p>
                        <div class="pt-2">
                             <a href="/pack-ship" class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors inline-block">Professional Packing Help</a>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-xl font-bold text-gray-900 mb-4">The Specialty Standard</h4>
                        <ul class="space-y-3">
                            <li class="flex items-center gap-3">
                                <span class="text-green-600">✓</span>
                                <span class="text-gray-700 font-medium">Reinforced, double-wall bike boxes</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <span class="text-green-600">✓</span>
                                <span class="text-gray-700 font-medium">Foam-wrap and axle protection</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <span class="text-green-600">✓</span>
                                <span class="text-gray-700 font-medium">Liability coverage for peace of mind</span>
                            </li>
                        </ul>
                    </div>
                </div>`,
        isFullWidth: true,
      },
    ],
    features: [
      {
        icon: Package,
        title: 'Custom Bike Boxes',
        description: 'We provide reinforced bike boxes for safe transit.',
      },
      {
        icon: Shield,
        title: 'Protection Guaranteed',
        description: 'Expert packing ensures frames and wheels stay secure.',
      },
      {
        icon: Truck,
        title: 'Domestic & International',
        description: 'We ship bikes anywhere in the US or worldwide.',
      },
    ],
    faqs: [...generalShippingFaqs, ...bicycleShippingFaqs],
    cta: {
      title: 'Ready to ship your bicycle?',
      subtitle: 'We handle the packing and shipping so you can just ride.',
      buttonText: 'Get a Quote',
      buttonLink: '/contact-us',
      variant: 'brand',
      align: 'left',
    },
  },
  {
    id: 'golf-club-shipping',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Golf Club Shipping',
    slug: '/pack-ship/golf-club-shipping',
    canonicalUrl: 'https://mailboxplusohio.com/pack-ship/golf-club-shipping',
    pageTitle: 'Golf Club Shipping in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Ship your golf clubs from Concord Township without the hassle. Secure packing and insured shipping for golf bags. Travel light to your next tee time.',
    keywords: 'golf club shipping, sports equipment shipping, Concord Township, Lake County',
    heroTitle: 'Golf Club Shipping',
    heroSubtitle: 'Ship your golf clubs safely and conveniently worldwide.',
    heroImage: getServiceImageUrl('/images/golf-club-shipping.webp'),
    content: [
      {
        heading: 'Tee-to-Green Golf Club Shipping',
        body: 'Travel light and hit the links without the hassle of airport baggage lines. Mailbox Plus specializes in secure golf club shipping, ensuring your gear arrives at your destination safely, on time, and ready for your first tee time.',
      },
      {
        heading: 'Shaft & Head Protection',
        body: `<div class="grid md:grid-cols-2 gap-8 mt-8">
                    <div class="border border-gray-200 p-8 rounded-3xl shadow-sm bg-white">
                        <h4 class="text-xl font-bold text-gray-900 mb-4">Travel Smarter</h4>
                        <p class="text-gray-600 mb-6">
                            Skip the heavy lifting. We offer 
                            <a href="/pack-ship/professional-packing" class="text-blue-600 font-semibold hover:underline">professional packing</a> 
                            for golf sets and bags, using specialized materials to protect delicate shafts and heads.
                        </p>
                        <div class="flex gap-4">
                            <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">UPS Authorized</span>
                            <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">FedEx Expert</span>
                        </div>
                    </div>
                    <div class="bg-blue-600 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-center">
                        <h4 class="text-xl font-bold mb-2">Maximum Protection</h4>
                        <p class="text-blue-100 italic leading-relaxed">
                            "Most golf club damage happens from pressure in cargo holds. Our packing methods use 
                            structural reinforcement to ensure your bag arrives exactly as you left it."
                        </p>
                    </div>
                </div>`,
        isFullWidth: true,
      },
    ],
    features: [
      {
        icon: Package,
        title: 'Custom Packing',
        description: 'We provide reinforced boxes for golf clubs.',
      },
      {
        icon: Shield,
        title: 'Insured Options',
        description: 'Coverage available for valuable sets.',
      },
      {
        icon: Globe,
        title: 'Ship Anywhere',
        description: 'Domestic and international golf club shipping.',
      },
    ],
    faqs: [...generalShippingFaqs, ...golfClubShippingFaqs],
    cta: {
      title: 'Ship your clubs hassle-free',
      subtitle: 'Insured shipping for your best game anywhere.',
      buttonText: 'Get a Quote',
      buttonLink: '/contact-us',
      variant: 'brand',
      align: 'left',
    },
  },
];
