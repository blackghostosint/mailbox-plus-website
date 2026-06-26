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
      'Postage stamps in Concord Township — Forever stamps, international stamps, and metered mail. No post office line required. Grab stamps while you ship.',
    keywords: 'postage stamps, USPS stamps, Concord Township, Lake County, post office alternative',
    heroTitle: 'Stamps Without the Post Office Line',
    heroSubtitle:
      'Forever stamps, international postage, and metered mail — available at our counter. No separate trip required.',
    heroImage: getServiceImageUrl('/images/postage-stamps.webp'),
    hideCarrierLogos: true,
    content: [
      // ── Position 2: The Villain ──
      {
        heading: 'The Post Office Trip \u2014 20 Minutes in Line for a Book of Stamps',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You need a book of Forever Stamps. It should take 30 seconds. Instead, you drive to the post office, wait in line behind three people shipping packages, and realize you could have done this a lot faster.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Post Office Tax.</strong> Limited hours. Long lines. And when you finally get to the counter, it's a $20 minimum on the credit card machine.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You just want stamps. But the post office makes it a whole errand.
            </p>`,
      },
      // ── Position 3: The Guide ──
      {
        heading: 'Grab Stamps While You\u2019re Here',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, <strong>we carry USPS postage stamps at our counter</strong>. Forever Stamps, additional ounce stamps, international postage, and stamp books \u2014 all available while you're handling your other business.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Already coming in to ship a package, make copies, or notarize a document? <strong>Just add stamps to your visit.</strong> No separate trip. No post office line. No parking hassle.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Our staff can also help you <strong>weigh your mail, calculate postage, and prepare items for mailing</strong> \u2014 including <a href="/pack-ship/usps-services" class="text-[var(--color-primary)] hover:underline">certified mail</a> and priority packages.
            </p>`,
      },
      // ── The Plan ──
      {
        heading: 'Getting Stamps Is as Easy as Walking In',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Walk In</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">No appointment needed. Stamps are at our counter during all business hours.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Pick Your Stamps</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Forever Stamps, books, international, or metered mail. Single stamps or full sheets.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Done</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Pay and go. Or stay and take care of shipping, copies, notary \u2014 all in one trip.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 6: The Stakes ──
      {
        heading: 'Why Make a Separate Trip?',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Post Office Lines</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Average post office visit: 15\u201330 minutes. Grabbing stamps at Mailbox Plus: under 2 minutes.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Limited Hours</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Post offices close early. We're open during extended business hours \u2014 stamps available every day we're here.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Bundle Your Errands</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Shipping, copies, stamps, notary, shredding \u2014 all at one counter. One trip beats four.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Certified Mail Help</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Sending something important? We handle <a href="/pack-ship/usps-services" class="text-[var(--color-primary)] hover:underline">certified mail, return receipts, and priority packages</a> \u2014 plus the stamps to go with them.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 7: The Success ──
      {
        heading: 'Stamps While You Ship \u2014 One Trip, Done',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              That's the Mailbox Plus advantage. You were already coming in to ship a package. Why make a separate trip to the post office for stamps?
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Add a book of Forever Stamps to your visit. Pay once. Leave with everything done.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Next time you're here, just ask us for stamps.</strong> We'll add them to your tab \u2014 one stop, no line, no extra trip.
            </p>`,
      },
    ],
    features: [
      {
        icon: Mail,
        title: 'USPS Stamps',
        description: 'Forever Stamps, international postage, and stamp books at our counter.',
      },
      {
        icon: Star,
        title: 'No Post Office Trip',
        description: 'Grab stamps while you ship — no separate errand required.',
      },
      {
        icon: Package,
        title: 'Mailing Help Included',
        description: 'We weigh, calculate postage, and prepare certified mail and packages.',
      },
    ],
    faqs: [...generalShippingFaqs, ...postageStampsFaqs],
  },
];
