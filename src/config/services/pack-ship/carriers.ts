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
      'UPS Authorized Shipping Outlet in Concord Township. Ground, Next Day Air, and International. Free pre-labeled drop-offs. Compare UPS, FedEx, USPS, and DHL rates at one counter.',
    keywords: 'ups shipping, concord township, lake county, ups drop off, ups store alternative',
    heroTitle: 'UPS Shipping Without the Ups Store Line',
    heroSubtitle:
      'Authorized UPS shipping outlet — Ground, Next Day Air, and International. We pack, label, and ship. No franchise markup, no long wait.',
    heroImage: getServiceImageUrl('/images/ups-shipping.webp'),
    hideCarrierLogos: true,
    content: [
      // ── Position 2: The Villain ──
      {
        heading: 'The Ups Store Line \u2014 Why the Franchise Isn\u2019t Your Only Option',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You need to ship UPS. You drive to The UPS Store. There\u2019s a line. The staff is overwhelmed. You wait. When you get to the counter, you pay their rate without knowing if FedEx or USPS would have been cheaper.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the UPS Store Tax.</strong> Franchise locations have higher overhead, longer lines, and they can only sell you UPS \u2014 they can't show you what FedEx or USPS would cost for the same package.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You're paying a premium for convenience, but you're not actually getting the best deal.
            </p>`,
      },
      // ── Position 3: The Guide ──
      {
        heading: 'Same UPS. Better Counter.',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Mailbox Plus is an <strong>Authorized UPS Shipping Outlet</strong> \u2014 the same UPS Ground, Next Day Air, and International services you\u2019d get at The UPS Store, without the franchise experience.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Bring your item in. We\u2019ll help you choose the right UPS service. We pack it, label it, and process the shipment. And if UPS isn\u2019t the cheapest option today, <strong>we can show you rates for FedEx, USPS, and DHL</strong> too \u2014 all from the same counter.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Already have a label? <strong>Free UPS drop-offs</strong> \u2014 bring your pre-labeled package and we\u2019ll get it scanned and on its way.
            </p>`,
      },
      // ── Position 4: The Plan ──
      {
        heading: 'Shipping UPS in Three Easy Steps',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Bring Your Package</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Pre-labeled or not \u2014 we accept drop-offs and help with packing if needed. Amazon returns welcome.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Choose Ground or Air</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Ground, 2nd Day Air, Next Day Air, or International \u2014 we explain options and help you pick.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Handle the Rest</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Packing, label printing, tracking, insurance \u2014 all done at our counter. You get a receipt and go.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 6: The Stakes ──
      {
        heading: 'What You Miss at the Franchise',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">No Rate Comparison</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">The UPS Store only sells UPS. We show you all 4 carriers \u2014 you might save 20-40% by switching.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Free Drop-Offs</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Pre-labeled UPS packages? Drop them off for free at our counter. Quick scan, receipt, and go.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Shorter Wait Times</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">The UPS Store can get backed up. We move you through quickly \u2014 most shipments under 5 minutes.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">More Than Just Shipping</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Ship UPS, <a href="/copy-print/copies" class="text-[var(--color-primary)] hover:underline">make copies</a>, <a href="/home-business/notary-services" class="text-[var(--color-primary)] hover:underline">notarize</a>, or <a href="/home-business/shredding" class="text-[var(--color-primary)] hover:underline">shred</a> \u2014 all in one trip.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 7: The Success ──
      {
        heading: 'UPS Shipping With Options \u2014 Every Time',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              An authorized UPS outlet where someone helps you pack, compares your options, and gets you on your way in minutes \u2014 that\u2019s Mailbox Plus.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              And if UPS isn't your cheapest option today? We'll show you the alternatives. No extra stops required.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Stop by Mailbox Plus for your next UPS shipment.</strong> Authorized, packed, shipped \u2014 done.
            </p>`,
      },
    ],
    features: [
      {
        icon: Truck,
        title: 'Ground, Air & International',
        description:
          'Full UPS service lineup \u2014 from ground to overnight to worldwide shipping.',
      },
      {
        icon: Shield,
        title: 'Authorized Shipper',
        description: 'Official UPS outlet with trained staff and carrier-compliant packing.',
      },
      {
        icon: Package,
        title: 'Free Drop-Offs',
        description:
          'Bring pre-labeled UPS packages for free drop-off \u2014 quick scan and receipt.',
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
