import type { Service } from '../../../types/services';
import Clock from '~icons/lucide/clock';
import Truck from '~icons/lucide/truck';
import MapPin from '~icons/lucide/map-pin';

export const competePages: Service[] = [
  {
    id: 'ups-store-alternative-kirtland',
    category: 'pack-ship',
    city: 'Kirtland',
    serviceName: 'UPS Store Alternative',
    slug: '/ups-store-alternative-kirtland',
    canonicalUrl: 'https://mailboxplusohio.com/ups-store-alternative-kirtland',
    pageTitle: 'UPS Store Alternative in Kirtland, Ohio | Mailbox Plus',
    metaDescription:
      'Looking for a UPS Store Alternative in Kirtland, OH? We offer UPS, FedEx, USPS, and DHL at one counter — mailbox rentals, printing, notary, locally owned.',
    keywords:
      'UPS Store alternative, Kirtland, Mailbox Plus, shipping, Kirtland ups store, Kirtland shipping, Kirtland printing',
    heroTitle: 'The UPS Store Alternative Kirtland Needs — All 4 Carriers at One Counter',
    heroSubtitle:
      'UPS, FedEx, USPS, and DHL at one counter. Mailbox rentals, printing, notary, and packing services. Locally owned, faster service, same convenience.',
    features: [
      {
        title: 'Faster Service',
        description:
          'We prioritize efficiency so you can get in and out quickly. No franchise wait times.',
        icon: Clock,
      },
      {
        title: 'Multi-Carrier Options',
        description: 'We ship with UPS, FedEx, USPS, and DHL.',
        icon: Truck,
      },
      {
        title: 'Locally Owned',
        description: 'We are proud to serve the Kirtland community.',
        icon: MapPin,
      },
    ],
    content: [
      {
        heading: 'There’s No UPS Store in Kirtland, but These Services Are Closer Than You Think',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              If you've been searching for a <strong>UPS Store in Kirtland</strong>, you probably already know there isn't one nearby. The closest is Willoughby (about 5 miles away) — and it’s a drive. But you don't need a franchise to get everything they offer.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              That's Mailbox Plus. We are your locally owned <strong>UPS Store alternative in Kirtland, Ohio</strong>. We offer the same UPS authorized shipping, <a href="/home-business/mailbox-rental" class="text-[var(--color-primary)] hover:underline">mailbox rentals</a>, <a href="/copy-print" class="text-[var(--color-primary)] hover:underline">printing</a>, and <a href="/home-business/notary-services" class="text-[var(--color-primary)] hover:underline">notary services</a> — plus we can ship FedEx, USPS, and DHL too. One counter, four carriers, faster service.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              And since we're independently owned, you get personalized service without franchise overhead. No pressure to use one carrier. Just honest advice and faster service — 6 miles from Kirtland at 7554 Fredle Drive in Concord Township.
            </p>`,
      },
      {
        heading: "The Multi-Carrier Advantage: What the Franchise Can't Offer",
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              The UPS Store can only sell you UPS. If FedEx or USPS would be cheaper or faster for your shipment, they can't tell you that. At Mailbox Plus, <strong>we compare rates across all 4 major carriers</strong> and recommend the best option for your budget and timeline.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Need to drop off a pre-labeled FedEx package alongside a UPS return? No problem. We accept drop-offs for all carriers at the same counter.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              The UPS Store is great for UPS. Mailbox Plus is great for everything.
            </p>`,
      },
      {
        heading: 'Why Mailbox Plus is the Better Choice',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Faster Service</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We prioritize efficiency so you can get in and out quickly. No franchise wait times.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Multi-Carrier Options</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">UPS, FedEx, USPS, DHL — all at one counter. Compare rates before you ship.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Locally Owned</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Part of the Kirtland community. Friendly faces, no corporate bureaucracy.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Full Service Center</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Mailboxes, notary, printing, packing, shredding — all in one trip.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Services We Offer',
        body: `<div class="grid md:grid-cols-3 gap-6 my-8">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Shipping &amp; Packing</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Authorized for UPS, FedEx, USPS, and DHL with professional packing services. We help you choose the best carrier for every package.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Business Services</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Private mailbox rental, notary public (just $5/sig), faxing, scanning, and secure shredding — everything a small business needs.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Printing &amp; Copying</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Color and B&W copies, business cards, flyers, laminating — same services as the big print shops, but we do it for you.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
    ],
    faqs: [
      {
        question: 'Can I ship FedEx or USPS at Mailbox Plus?',
        answer:
          'Yes! Unlike The UPS Store, we are an authorized shipping center for FedEx, USPS, UPS, and DHL, giving you more choices at one counter.',
      },
      {
        question: 'Do you offer notary services?',
        answer:
          'Absolutely. We have a commissioned notary public on-site to help with your legal documents. Just $5 per signature — no appointment needed!',
      },
      {
        question: 'Is Mailbox Plus locally owned?',
        answer:
          'Yes, we are a locally owned and operated independent business serving Kirtland and all of Lake County, committed to excellent customer service.',
      },
      {
        question: 'How far is Mailbox Plus from Kirtland?',
        answer:
          "We're located at 7554 Fredle Drive in Concord Township, about 10 minutes from Kirtland. It's an easy drive — and worth it for access to all 4 carriers.",
      },
      {
        question: 'Do you offer mailbox rentals for Kirtland residents?',
        answer:
          'Absolutely! Our private mailboxes with real street addresses serve customers from Kirtland and all across Lake County. From $35/month with 4-hour email notification.',
      },
      {
        question: 'Can I make Amazon returns at Mailbox Plus?',
        answer:
          'Yes! We accept Amazon returns with or without a box. We can print your label for just $2.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
    cta: {
      title: 'Ready to Save Time?',
      subtitle: 'Bring your package to 7554 Fredle Drive in Concord Township.',
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    hideCarrierLogos: true,
  },
];
