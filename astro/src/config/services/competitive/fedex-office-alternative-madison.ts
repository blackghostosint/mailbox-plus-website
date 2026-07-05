import type { Service } from '../../../types/services';
import Star from '~icons/lucide/star';
import Truck from '~icons/lucide/truck';
import Users from '~icons/lucide/users';

export const competePages: Service[] = [
  {
    id: 'fedex-office-alternative-madison',
    category: 'pack-ship',
    city: 'Madison',
    serviceName: 'FedEx Office Alternative Near Madison — Worth the Drive | Mailbox Plus',
    slug: '/fedex-office-alternative-madison',
    canonicalUrl: 'https://mailboxplusohio.com/fedex-office-alternative-madison',
    pageTitle: 'FedEx Office Alternative Near Madison — Worth the Drive | Mailbox Plus',
    metaDescription:
      'Need a FedEx Office alternative near Madison, OH? Mailbox Plus offers FedEx, UPS, USPS, and DHL — plus printing, mailboxes, and notary — all locally owned.',
    keywords: 'FedEx Office alternative Madison, Madison shipping services, Mailbox Plus Concord',
    heroTitle: 'FedEx Office Alternative Near Madison — Worth the Drive',
    heroSubtitle:
      'Authorized FedEx, UPS, USPS, and DHL drop-off and shipping near Madison. In and out fast.',
    features: [
      {
        title: 'Carrier Choice',
        description: "FedEx, UPS, USPS, DHL — the chains can't match this.",
        icon: Truck,
      },
      {
        title: 'Locally Owned',
        description: 'Part of the community, not a corporate franchise.',
        icon: Users,
      },
      {
        title: 'Full Service',
        description: 'Shipping, mailboxes, notary, printing — all in one trip.',
        icon: Star,
      },
    ],
    content: [
      {
        heading: 'A Better Option Than the Big Box Store Near Madison',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">If you're searching for a FedEx Office, UPS Store, or similar chain near Madison, you already know what to expect — single-carrier service, franchise pricing, and unpredictable wait times.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Mailbox Plus is different. We're an authorized FedEx ShipCenter with professional printing, packing, notary, and mailbox rentals — but unlike the chains, we also ship <strong>UPS, USPS, and DHL</strong>. Compare rates. Pick the best carrier. All at one counter.</p>`,
      },
      {
        heading: 'Why Madison Customers Choose Mailbox Plus',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8"><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">Multi-Carrier Choice</h4><p class="text-sm text-[var(--color-text-secondary)]">FedEx, UPS, USPS, DHL — compare rates at one counter. No chain store can match that.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">Shorter Wait Times</h4><p class="text-sm text-[var(--color-text-secondary)]">Locally owned means we move faster. No corporate bureaucracy.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">Full Service Center</h4><p class="text-sm text-[var(--color-text-secondary)]">Mailboxes, notary, printing, packing — everything in one trip.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">Locally Owned</h4><p class="text-sm text-[var(--color-text-secondary)]">Part of the Concord Township community since day one.</p></div></div>`,
        isFullWidth: true,
      },
      {
        heading: "Don't Settle — Madison Deserves Better Service",
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Madison residents deserve a shipping experience that respects their time. Just off I-90, SR 20, and SR 528, Mailbox Plus is only 18 miles from Madison. Whether you're dropping off a return, shipping a birthday gift, or picking up a held package, Mailbox Plus is just 18 miles away on 7554 Fredle Drive in Concord Township. Come see the difference local service makes.</p>`,
      },
      {
        heading: 'What to Expect When You Visit',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">We accept packages from all major carriers — FedEx, UPS, USPS, and DHL — at one counter. No running between different stores. We scan every drop-off and provide a tracking receipt on the spot.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">If your package isn't ready to ship, we sell boxes, tape, bubble wrap, and packing peanuts. We can also professionally pack fragile or awkward items. For pre-labeled packages, just bring them in — we handle the rest.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">We're open Monday through Saturday with walk-in friendly service. Most drop-offs take under 2 minutes. While you're here, ask about our mailbox rentals, notary services, and printing — one trip can check off half your to-do list.</p>`,
      },
    ],
    faqs: [
      {
        question: 'How far is Mailbox Plus from Madison?',
        answer:
          'Mailbox Plus is located at 7554 Fredle Drive in Concord Township, just 18 miles from Madison. The drive is quick and easy.',
      },
      {
        question: 'Can I drop off pre-labeled packages?',
        answer:
          'Yes! We accept pre-labeled drop-offs for FedEx, UPS, USPS, and DHL. We scan and provide a receipt every time.',
      },
      {
        question: 'Do you offer printing and notary services?',
        answer:
          'Yes — full-service printing, copying, and a commissioned notary public on-site during all business hours. No appointment needed for notary.',
      },
      {
        question: 'Are your prices competitive with the chain stores?',
        answer:
          "Yes. We match retail carrier rates and often beat franchise pricing because we're locally owned with lower overhead. Plus, we can compare rates across all four carriers so you always get the best option.",
      },
      {
        question: 'What should I bring when I visit?',
        answer:
          "For drop-offs: your package with a shipping label attached. If you don't have a label, we can help you create one. For packing: bring your item and we'll box it up with the right materials. For mailbox rental: bring two forms of valid ID (driver's license, passport, or state ID).",
      },
      {
        question: "What's the best time to come?",
        answer:
          "Mid-mornings and early afternoons (9:30 AM to 2:30 PM) on weekdays tend to be the quietest. Saturdays can get busier. If you're in a hurry, call ahead and we'll let you know our current wait — but most visits are in and out in under 5 minutes.",
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
