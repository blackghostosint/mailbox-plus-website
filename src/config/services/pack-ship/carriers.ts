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
      'Authorized FedEx ShipCenter in Concord Township. Express, Ground, and International shipping services. Packing, labeling, and drop-offs available.',
    keywords: 'fedex shipping, concord township, lake county',
    heroTitle: 'FedEx Shipping Services',
    heroSubtitle: 'Ship your packages with the speed and reliability of FedEx.',
    heroImage: getServiceImageUrl('/images/fedex-shipping.webp'),
    content: [
      {
        heading: 'Convenient FedEx Drop-Off',
        body: 'We are your neighborhood FedEx Authorized ShipCenter. Bring your labeled packages or let us prepare them for you.',
      },
      {
        heading: 'Flexible Shipping Options',
        body: 'Choose from FedEx Express, Ground, and International services depending on your delivery timeline and budget.',
      },
      {
        heading: 'Trusted FedEx Partner',
        body: 'At Mailbox Plus, we’re proud to be your local <strong>Authorized FedEx Shipping Center</strong>—serving Concord Township and Lake County. Our team ensures your shipment is packed, labeled, and processed according to FedEx’s professional standards.',
      },
      {
        heading: 'Global & Domestic Reach',
        body: 'We offer the full range of <strong>FedEx Express, Ground, and International</strong> services. From overnight document delivery to secure international shipping, we help you choose the best option for your destination and budget.',
      },
      {
        heading: 'Professional Shipping Standards',
        body: 'Every package is packed with care using <a href="/pack-ship/packaging-supplies" class="text-[var(--color-primary)] hover:underline">high-quality materials</a> that protect against vibration and compression. We provide <strong>real-time tracking, <a href="/specialty/insurance" class="text-[var(--color-primary)] hover:underline">shipment insurance</a>, and on-site packing assistance</strong> for your peace of mind.',
      },
    ],
    features: [
      {
        icon: Truck,
        title: 'Fast Delivery',
        description: 'Overnight and 2-day shipping available.',
      },
      {
        icon: Shield,
        title: 'Reliable Handling',
        description: 'Your shipments are handled with care.',
      },
      {
        icon: Globe,
        title: 'International Reach',
        description: 'Ship worldwide with customs support.',
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
      'USPS postal services in Concord Township — Priority Mail, First-Class, Certified Mail, and stamps. No post office lines. We handle UPS, FedEx, and DHL too.',
    keywords: 'usps, postal services, concord township, lake county, post office alternative',
    heroTitle: 'USPS Services Without the Post Office Wait',
    heroSubtitle:
      'Priority Mail, First-Class, Certified Mail, and stamps — all at our counter. Skip the post office line and compare rates with other carriers while you\u2019re here.',
    heroImage: getServiceImageUrl('/images/usps-services.webp'),
    hideCarrierLogos: true,
    content: [
      // ── Position 2: The Villain ──
      {
        heading: 'The Post Office Line \u2014 Why It Takes 30 Minutes to Mail a Package',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You need to mail a package USPS. You drive to the post office. The line wraps around. When you finally get to the counter, you realize you could have saved money by shipping UPS or FedEx \u2014 but you can't compare rates here.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Post Office Tax.</strong> Limited hours. Long waits. And the post office can only sell you USPS \u2014 they can\u2019t show you what another carrier would cost.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Meanwhile, you're burning your lunch break waiting in line for a service that shouldn't take more than 5 minutes.
            </p>`,
      },
      // ── Position 3: The Guide ──
      {
        heading: 'USPS Services \u2014 Plus Three More Carriers at the Same Counter',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Mailbox Plus is your local <strong>USPS provider</strong> \u2014 Priority Mail, First-Class, Certified Mail, and stamps, all without the post office hassle.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Bring your package in. We'll help you choose the right USPS service, weigh it, apply postage, and get it on its way. And if USPS isn't the cheapest option today, <strong>we can show you rates for UPS, FedEx, and DHL</strong> too \u2014 all from the same counter.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Need stamps? We carry Forever Stamps, books, and international postage \u2014 grab them while you\u2019re here.
            </p>`,
      },
      // ── Position 4: The Plan ──
      {
        heading: 'USPS Made Simple',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Bring Your Item</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Letter, package, or certified mail \u2014 we handle it all. No post office forms to fill out.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Choose Your Service</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">First-Class, Priority, Certified, or International \u2014 plus a quick rate check against other carriers.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Handle It</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Weighing, postage, tracking \u2014 done at our counter. You\u2019re in and out in minutes.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 6: The Stakes ──
      {
        heading: 'What You Miss at the Post Office',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Long Lines, Short Hours</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Post offices close early and get crowded. We\u2019re open longer and move you through quickly.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Can\u2019t Compare Rates</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">The post office only offers USPS. We show you all 4 carriers \u2014 you might save 20-40%.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Stamps While You Ship</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Forget a separate trip for stamps. We carry Forever Stamps, international, and books at our counter.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">One-Stop Multi-Carrier</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">USPS, UPS, FedEx, DHL \u2014 we offer all four. Why limit yourself to one?</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 7: The Success ──
      {
        heading: 'USPS With Options \u2014 No Post Office Required',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              All the USPS services you need, without the post office experience. That\u2019s Mailbox Plus.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Priority Mail, Certified Mail, stamps, and more \u2014 plus the ability to compare rates with UPS, FedEx, and DHL at the same counter.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Stop by Mailbox Plus for your next USPS shipment.</strong> We\u2019ll handle the rest.
            </p>`,
      },
    ],
    features: [
      {
        icon: Mail,
        title: 'Priority & First-Class',
        description: 'Full USPS service \u2014 from letters to Priority Mail to Certified.',
      },
      {
        icon: Truck,
        title: 'Multi-Carrier Comparison',
        description: 'USPS, UPS, FedEx, DHL \u2014 compare rates at one counter before you choose.',
      },
      {
        icon: Globe,
        title: 'Stamps & International',
        description: 'Forever Stamps, books, and international postage available at our counter.',
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
