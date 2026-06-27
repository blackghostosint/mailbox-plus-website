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
