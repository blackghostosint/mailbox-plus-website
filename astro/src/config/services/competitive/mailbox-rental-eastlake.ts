import type { Service } from '../../../types/services';
import MapPin from '~icons/lucide/map-pin';
import Truck from '~icons/lucide/truck';
import Users from '~icons/lucide/users';

export const competePages: Service[] = [
  {
    id: 'mailbox-rental-eastlake',
    category: 'mailbox-rentals',
    city: 'Eastlake',
    serviceName: 'Mailbox Rental in Eastlake — Private Mailbox Near Eastlake, OH | Mailbox Plus',
    slug: '/mailbox-rental-eastlake',
    canonicalUrl: 'https://mailboxplusohio.com/mailbox-rental-eastlake',
    pageTitle: 'Mailbox Rental in Eastlake — Private Mailbox Near Eastlake, OH | Mailbox Plus',
    metaDescription:
      'Private mailbox rental near Eastlake, OH. Get a real street address, package acceptance from all carriers, and secure mail handling at Mailbox Plus.',
    keywords: 'mailbox rental Eastlake OH, private mailbox Eastlake, Mailbox Plus Concord',
    heroTitle: 'Mailbox Rental in Eastlake — Private Mailbox Near Eastlake, OH',
    heroSubtitle:
      'Authorized FedEx, UPS, USPS, and DHL drop-off and shipping near Eastlake. In and out fast.',
    features: [
      {
        title: 'Direct Service',
        description: 'Work with the local store, not a national middleman.',
        icon: Users,
      },
      {
        title: 'Real Street Address',
        description: '7554 Fredle Drive — not a P.O. Box number.',
        icon: MapPin,
      },
      {
        title: 'All Carriers',
        description: 'FedEx, UPS, USPS, DHL — we accept everything.',
        icon: Truck,
      },
    ],
    content: [
      {
        heading: 'Virtual Mailbox Service Serving Eastlake',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Looking for a virtual mailbox or mail forwarding service near Eastlake? Mailbox Plus in Concord Township provides real street address mailboxes, package acceptance from all carriers, and digital mail management — all without paying a national middleman like iPostal1 or Anytime Mailbox.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">When you use a national service, they subcontract to local stores like ours. Skip the markup. Work directly with the people handling your mail.</p>`,
      },
      {
        heading: 'How It Works — Drop Off or Ship From Eastlake',
        body: `<img src="https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/articles/mailbox-services/mailbox-rental-eastlake-featured.webp" alt="Mailbox Plus shipping service for Eastlake customers" class="w-full rounded-2xl shadow-md my-8" loading="lazy" width="1200" height="675" /><div class="grid md:grid-cols-3 gap-6 mb-8"><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">1. Bring Your Package</h4><p class="text-sm text-[var(--color-text-secondary)]">Pre-labeled or need help packing — we handle both.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">2. Quick Scan</h4><p class="text-sm text-[var(--color-text-secondary)]">We scan and provide a drop-off receipt on the spot.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">3. You're Done</h4><p class="text-sm text-[var(--color-text-secondary)]">Back in your day. In and out in under 2 minutes.</p></div></div>`,
        isFullWidth: true,
      },
      {
        heading: "Don't Settle — Eastlake Deserves Better Service",
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Eastlake residents deserve a shipping experience that respects their time. Just off SR 2 and SR 91, Mailbox Plus is only 9 miles from Eastlake. Whether you're dropping off a return, shipping a birthday gift, or picking up a held package, Mailbox Plus is just 9 miles away on 7554 Fredle Drive in Concord Township. Come see the difference local service makes.</p>`,
      },
      {
        heading: 'What to Expect When You Visit',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">We accept packages from all major carriers — FedEx, UPS, USPS, and DHL — at one counter. No running between different stores. We scan every drop-off and provide a tracking receipt on the spot.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">If your package isn't ready to ship, we sell boxes, tape, bubble wrap, and packing peanuts. We can also professionally pack fragile or awkward items. For pre-labeled packages, just bring them in — we handle the rest.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">We're open Monday through Saturday with walk-in friendly service. Most drop-offs take under 2 minutes. While you're here, ask about our mailbox rentals, notary services, and printing — one trip can check off half your to-do list.</p>`,
      },
    ],
    faqs: [
      {
        question: 'How far is Mailbox Plus from Eastlake?',
        answer:
          'Mailbox Plus is located at 7554 Fredle Drive in Concord Township, just 9 miles from Eastlake. The drive is quick and easy.',
      },
      {
        question: 'Can I drop off pre-labeled packages?',
        answer:
          'Yes! We accept pre-labeled drop-offs for FedEx, UPS, USPS, and DHL. We scan and provide a receipt every time.',
      },
      {
        question: 'How is Mailbox Plus different from iPostal1 or Anytime Mailbox?',
        answer:
          'Those national services subcontract to local stores like ours. When you work directly with Mailbox Plus, you cut out the middleman — better pricing, direct communication, and the same real people handling your mail every day.',
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
