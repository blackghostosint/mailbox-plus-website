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
      'DHL Express Service Point in Concord Township. International shipping to 220+ countries. Customs forms, packing, and tracking assistance included.',
    keywords: 'dhl shipping, concord township, lake county, dhl express, international shipping',
    heroTitle: 'DHL Express \u2014 International Shipping, Local Help',
    heroSubtitle:
      'Ship to over 220 countries with DHL Express. We help with customs forms, packing, and finding the best rate.',
    heroImage: getServiceImageUrl('/images/dhl-express.webp'),
    hideCarrierLogos: true,
    content: [
      // ── Position 2: The Villain ──
      {
        heading: 'International Shipping Feels Overwhelming \u2014 Customs, Forms, and Uncertainty',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You need to ship something overseas. Customs forms, international restrictions, packaging requirements \u2014 it\u2019s a lot. And finding a DHL drop-off location that actually helps with the paperwork isn\u2019t easy.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the International Shipping Maze.</strong> One wrong customs code and your package gets delayed. One packaging mistake and it gets returned. And most drop-off locations just hand you a label and leave you to figure it out.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You want to ship internationally with confidence. But without help, it\u2019s easy to get it wrong.
            </p>`,
      },
      // ── Position 3: The Guide ──
      {
        heading: 'Your Local DHL Service Point \u2014 We Handle the Paperwork Too',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Mailbox Plus is a <strong>DHL Express Service Point</strong> \u2014 your local access to DHL\u2019s global 220-country network. We don\u2019t just take your package and ship it. We help with everything.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Customs forms? We guide you through them. International restrictions? We know what can and can\u2019t ship. Packaging requirements? We pack it to DHL standards. And if DHL isn\u2019t the best option for your destination, <strong>we can compare rates with FedEx, UPS, and USPS</strong> too.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Whether you\u2019re shipping documents, packages, or freight \u2014 we make international shipping manageable.
            </p>`,
      },
      // ── Position 4: The Plan ──
      {
        heading: 'Shipping DHL Express in Three Steps',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Bring Your Item</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Documents, packages, or freight \u2014 we help you determine the best way to ship internationally.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Customs &amp; Paperwork</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We guide you through customs forms, restricted item checks, and required documentation.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Pack &amp; Ship</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Packed to DHL standards, labeled with tracking, and on its way \u2014 with customs-ready paperwork.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 6: The Stakes ──
      {
        heading: 'What Can Go Wrong Without Help',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Customs Delays</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Incorrect forms = stuck packages. We help you get customs paperwork right the first time.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Rate Comparison</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">DHL is great for international, but FedEx or USPS might be cheaper for your destination. We show you all options.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Packaging That Travels</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">International transit is rough on packages. We use carrier-compliant materials that survive the journey.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">One-Stop International</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">DHL, FedEx, UPS, USPS \u2014 we offer all four. For international, we help you pick the right one.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 7: The Success ──
      {
        heading: 'International Shipping, Simplified',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Your package needs to get across the world. We make sure it arrives \u2014 with the right carrier, the right packing, and the right paperwork.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              DHL Express to 220+ countries, right from our Concord Township counter.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Stop by Mailbox Plus for your next international shipment.</strong> We\u2019ll handle the details.
            </p>`,
      },
    ],
    features: [
      {
        icon: Globe,
        title: '220+ Countries',
        description: 'DHL Express Worldwide network \u2014 fast, reliable international shipping.',
      },
      {
        icon: Shield,
        title: 'Customs Support',
        description:
          'We help with forms, restrictions, and documentation for smooth customs clearance.',
      },
      {
        icon: Package,
        title: 'Multi-Carrier Options',
        description:
          'Compare DHL with FedEx, UPS, and USPS \u2014 pick the best international rate.',
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
