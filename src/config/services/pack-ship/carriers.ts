import Truck from '~icons/lucide/truck';
import Shield from '~icons/lucide/shield';
import Globe from '~icons/lucide/globe';
import Mail from '~icons/lucide/mail';
import Package from '~icons/lucide/package';
import Star from '~icons/lucide/star';
import { Service } from '../../../types/services';
import { getServiceImageUrl } from '../../../lib/storage';
import {
  generalShippingFaqs,
  fedexShippingFaqs,
  upsShippingFaqs,
  uspsServicesFaqs,
  dhlExpressFaqs,
  postageStampsFaqs,
} from '../../faqs';

export const carrierServices: Service[] = [
  {
    id: 'fedex-shipping',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'FedEx Shipping',
    slug: '/pack-ship/fedex-shipping',
    pageTitle: 'FedEx Shipping in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Authorized FedEx ShipCenter in Concord Township. Express, Ground, and International shipping. Packing, labeling, and same-day drop-offs at our counter.',
    keywords: 'fedex shipping, concord township, lake county, fedex drop off, fedex ship center',
    heroTitle: 'FedEx Shipping \u2014 Authorized, Packed, Shipped',
    heroSubtitle:
      'Ship FedEx Express, Ground, or International from our neighborhood counter. We pack, label, and process \u2014 you just drop off and go.',
    heroImage: getServiceImageUrl('/images/fedex-shipping.webp'),
    hideCarrierLogos: true,
    content: [
      // ── Position 2: The Villain ──
      {
        heading: 'The FedEx Office Run \u2014 Why a Drop-Off Shouldn\u2019t Take 30 Minutes',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You need to ship FedEx. You drive to the FedEx Office location. The parking lot is full. Inside, there's a line, the self-serve kiosk is flashing an error, and nobody's available to help pack your fragile item.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the FedEx Office Runaround.</strong> You just want to drop off a package and go. But the corporate store makes it a whole production \u2014 and you can't compare rates with other carriers while you're there.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Meanwhile, your package isn't packed right, and you're not sure if you chose the cheapest shipping option.
            </p>`,
      },
      // ── Position 3: The Guide ──
      {
        heading: 'Your Neighborhood FedEx ShipCenter \u2014 We Do the Heavy Lifting',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Mailbox Plus is an <strong>Authorized FedEx ShipCenter</strong> \u2014 the same FedEx services you'd get at a corporate location, but with local service that actually helps.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Bring your item in. We'll help you choose between <strong>FedEx Express, Ground, or International</strong> based on your budget and timeline. We pack it properly with carrier-compliant materials, print the label, and process the shipment \u2014 all from our counter.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Plus, if FedEx isn't the cheapest option today, we can show you rates for <strong>UPS, USPS, and DHL</strong> too \u2014 all at the same counter. No extra stops.
            </p>`,
      },
      // ── Position 4: The Plan ──
      {
        heading: 'Shipping FedEx in Three Easy Steps',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Bring Your Item</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Packaged or unpackaged \u2014 we can help either way. If it's pre-labeled, just drop it off.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Choose Your Service</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Express, Ground, or International. We explain the options and help you pick the best fit.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Handle the Rest</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Packing, labeling, tracking, insurance \u2014 all taken care of. You get a receipt and you're on your way.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 6: The Stakes ──
      {
        heading: 'What You Miss at the Corporate Store',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">No Rate Comparison</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">FedEx Office only offers FedEx. We can show you UPS, USPS, and DHL rates too \u2014 you might save 20-40% by switching carriers.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Packing Help Included</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Self-serve kiosks don't pack your items. Our trained staff uses carrier-compliant materials to protect your shipment.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Skip the Corporate Lines</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">FedEx Office can get crowded. We move you through quickly \u2014 most drop-offs under 5 minutes.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Bundle Your Errands</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Ship FedEx, grab <a href="/copy-print/copies" class="text-[var(--color-primary)] hover:underline">copies</a>, notarize a document \u2014 all in one trip. FedEx Office can't do that.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 7: The Success ──
      {
        heading: 'Ship FedEx With Local Help \u2014 Every Time',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Imagine walking into a FedEx location where someone actually helps you pack, compares your options, and gets you on your way in minutes. That's Mailbox Plus.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              We're an authorized FedEx ShipCenter \u2014 same FedEx services, better experience.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Stop by Mailbox Plus for your next FedEx shipment.</strong> We'll pack it, label it, and ship it \u2014 so you can get back to your day.
            </p>`,
      },
    ],
    features: [
      {
        icon: Truck,
        title: 'FedEx Express & Ground',
        description: 'Full range of FedEx services \u2014 from overnight to economy shipping.',
      },
      {
        icon: Shield,
        title: 'Authorized ShipCenter',
        description: 'Official FedEx location with trained staff and carrier-compliant packing.',
      },
      {
        icon: Globe,
        title: 'International Shipping',
        description: 'FedEx International services with customs documentation assistance.',
      },
    ],
    faqs: [...generalShippingFaqs, ...fedexShippingFaqs],
  },
  {
    id: 'ups-authorized-shipper-outlet',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'UPS Authorized Shipper Outlet',
    slug: '/pack-ship/ups-authorized-shipper-outlet',
    pageTitle: 'UPS Authorized Shipper Outlet in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'UPS Authorized Shipping Outlet in Concord Township. Ship UPS Ground, Next Day Air, and International. Drop off pre-labeled packages for free.',
    keywords: 'ups shipping, concord township, lake county',
    heroTitle: 'UPS Shipping Services',
    heroSubtitle: 'Full-service UPS Authorized Shipping Outlet for your convenience.',
    heroImage: getServiceImageUrl('/images/ups-shipping.webp'),
    content: [
      {
        heading: 'Ship with UPS Confidence',
        body: 'As a UPS Authorized Shipper, we offer all the services of a UPS Store without the long drive.',
      },
      {
        heading: 'Flexible Options for Businesses',
        body: 'Ground, Next Day Air, and International services available to meet your business shipping needs.',
      },
      {
        heading: 'Local UPS Shipping Hub',
        body: 'Mailbox Plus is your <strong>Authorized UPS Shipping Center</strong>—serving Concord Township with reliable packing and shipping solutions. Our staff ensures your shipment meets <strong>UPS packaging and handling standards</strong> for safety and speed.',
      },
      {
        heading: 'Comprehensive UPS Services',
        body: 'We offer a full suite of services including <em>UPS Ground, 2nd Day Air, Next Day Air, and International</em> options. Our experts help you choose the best method for your budget while guaranteeing secure packaging.',
      },
      {
        heading: 'Convenient One-Stop Shop',
        body: 'As a local business in Gristmill Village, we provide fast UPS drop-off and shipping assistance. Enjoy <strong>on-site packing, <a href="/copy-print/document-printing" class="text-[var(--color-primary)] hover:underline">printed labels</a>, tracking, and insurance coverage</strong> all in one stop.',
      },
    ],
    features: [
      {
        icon: Truck,
        title: 'Ground & Air',
        description: 'Reliable UPS Ground and Next Day Air shipping.',
      },
      {
        icon: Shield,
        title: 'Authorized Outlet',
        description: 'Same UPS services with local convenience.',
      },
      {
        icon: Package,
        title: 'Drop-Offs Welcome',
        description: 'Bring your pre-labeled UPS packages for free drop-off.',
      },
    ],
    faqs: [...generalShippingFaqs, ...upsShippingFaqs],
  },
  {
    id: 'usps-services',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'USPS Postal Services',
    slug: '/pack-ship/usps-services',
    pageTitle: 'USPS Postal Services in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Official USPS postal services in Concord Township. Buy stamps, send Priority Mail, and ship packages without the long post office lines.',
    keywords: 'usps, postal services, concord township, lake county',
    heroTitle: 'USPS Postal Services',
    heroSubtitle:
      'Access all the services of the United States Postal Service right here in Concord Township.',
    heroImage: getServiceImageUrl('/images/usps-services.webp'),
    content: [
      {
        heading: 'Skip the Post Office Line',
        body: 'We offer the same USPS shipping services without the hassle of the post office.',
      },
      {
        heading: 'Mail & Package Services',
        body: 'From stamps to international shipments, we cover all your USPS needs.',
      },
      {
        heading: 'Convenient USPS Hub',
        body: 'Mailbox Plus is your hub for <strong>USPS postal and shipping services</strong> in Concord Township. As an authorized provider, we handle <strong><a href="/pack-ship/postage-stamps" class="text-[var(--color-primary)] hover:underline">First-Class Mail</a></strong>, <strong>Priority Mail</strong>, and <em>Certified Mail</em> in one friendly location.',
      },
      {
        heading: 'Efficient Mailing Support',
        body: 'Avoid the long lines at the post office. Our team provides fast, accurate service with expert packing, custom labeling, and on-the-spot postage for envelopes and parcels of all sizes.',
      },
      {
        heading: 'Small Business & Personal Solutions',
        body: 'Whether you need to send a single letter or manage regular mailings, we offer <strong>secure USPS drop-off, tracking assistance, and bulk mailing support</strong> right here in your community.',
      },
    ],
    features: [
      {
        icon: Mail,
        title: 'First-Class Mail',
        description: 'Affordable shipping for letters and small packages.',
      },
      {
        icon: Truck,
        title: 'Priority Mail',
        description: 'Fast and reliable USPS Priority Mail shipping.',
      },
      {
        icon: Globe,
        title: 'International Service',
        description: 'Ship globally with USPS international options.',
      },
    ],
    faqs: [...generalShippingFaqs, ...uspsServicesFaqs],
  },
  {
    id: 'dhl-express',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'DHL Express',
    slug: '/pack-ship/dhl-express',
    pageTitle: 'DHL Express in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'DHL Express Service Point in Concord Township. Fast and reliable international shipping. We help with customs forms and packaging.',
    keywords: 'dhl shipping, concord township, lake county',
    heroTitle: 'DHL Express Shipping',
    heroSubtitle: 'Fast international shipping with DHL Express.',
    heroImage: getServiceImageUrl('/images/dhl-express.webp'),
    content: [
      {
        heading: 'Ship Worldwide with DHL',
        body: 'DHL Express specializes in international delivery, making it the go-to choice for global shipments.',
      },
      {
        heading: 'Trusted Worldwide Carrier',
        body: 'DHL is known for its reliability and global network.',
      },
      {
        heading: 'Global Express Service Point',
        body: 'At Mailbox Plus, we serve as your local access point for <strong>DHL Express international shipping</strong>—helping you send packages quickly and securely around the world via the same 220-country network as any DHL location.',
      },
      {
        heading: 'Expert International Readiness',
        body: 'Our team ensures every shipment is <strong>professionally packed and customs-ready</strong>. We provide expert guidance on <em>customs forms, international restrictions, and packaging requirements</em> for DHL Express Worldwide.',
      },
      {
        heading: 'Peace of Mind Worldwide',
        body: 'Every DHL shipment comes with detailed tracking and delivery confirmation. We can also combine DHL with <a href="/pack-ship/fedex-shipping" class="text-[var(--color-primary)] hover:underline">other carriers like FedEx</a> or <a href="/pack-ship/ups-authorized-shipper-outlet" class="text-[var(--color-primary)] hover:underline">UPS</a> to provide the most cost-effective solution for your budget.',
      },
    ],
    features: [
      {
        icon: Globe,
        title: 'Global Network',
        description: 'Ship to over 220 countries worldwide.',
      },
      {
        icon: Shield,
        title: 'Secure Delivery',
        description: 'DHL ensures safe and fast delivery.',
      },
      {
        icon: Package,
        title: 'Express Options',
        description: 'Choose express services for urgent packages.',
      },
    ],
    faqs: [...generalShippingFaqs, ...dhlExpressFaqs],
  },
  {
    id: 'postage-stamps',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Postage Stamps',
    slug: '/pack-ship/postage-stamps',
    pageTitle: 'Postage Stamps in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Buy postage stamps in Concord Township. Forever stamps, international stamps, and metered mail services available. Skip the post office wait.',
    keywords: 'postage stamps, USPS stamps, Concord Township, Lake County',
    heroTitle: 'Postage Stamps',
    heroSubtitle: 'Convenient access to USPS stamps without the post office trip.',
    heroImage: getServiceImageUrl('/images/postage-stamps.webp'),
    content: [
      {
        heading: 'Quick & Easy',
        body: 'Pick up individual stamps or full books for personal or business use.',
      },
      {
        heading: 'Local Postage & Mailing',
        body: 'Mailbox Plus is your local source for <strong>postage stamps and mailing supplies</strong> in Concord Township. Get the exact postage you need for personal or business mail—without waiting in long post office lines.',
      },
      {
        heading: 'Stamps & Custom Metering',
        body: 'We carry <strong>Forever Stamps and standard USPS postage options</strong> for domestic and international mail. Our staff can help you calculate exact rates, weigh envelopes, and prepare your items for shipment.',
      },
    ],
    features: [
      { icon: Mail, title: 'USPS Stamps', description: 'Official USPS postage stamps.' },
      { icon: Star, title: 'Convenient', description: 'Buy while shipping your packages.' },
      { icon: Package, title: 'Books & Sheets', description: 'Available in multiple quantities.' },
    ],
    faqs: [...generalShippingFaqs, ...postageStampsFaqs],
  },
];
