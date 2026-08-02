import type { Service } from '../../../types/services';
import Clock from '~icons/lucide/clock';
import FileText from '~icons/lucide/file-text';
import Truck from '~icons/lucide/truck';

export const competePages: Service[] = [
  {
    id: 'package-receiving-lake-county',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Package Receiving Service in Lake County, OH — Secure Drop-Offs | Mailbox Plus',
    slug: '/package-receiving-lake-county',
    canonicalUrl: 'https://mailboxplusohio.com/package-receiving-lake-county',
    pageTitle: 'Package Receiving Service in Lake County, OH — Secure Drop-Offs | Mailbox Plus',
    metaDescription:
      'Secure package receiving service serving all of Lake County, OH. Mailbox Plus accepts FedEx, UPS, USPS, and DHL deliveries — keep your packages safe.',
    keywords:
      'package receiving Lake County, package receiving service Lake County OH, Mailbox Plus Concord',
    heroTitle: 'Package Receiving in Lake County — Secure & Convenient',
    heroSubtitle:
      'Authorized FedEx, UPS, USPS, and DHL drop-off and package receiving for all of Lake County. In and out fast.',
    features: [
      {
        title: 'In & Out Fast',
        description: 'No franchise wait times. Drop your package and go.',
        icon: Clock,
      },
      {
        title: 'Multi-Carrier',
        description: 'FedEx, UPS, USPS, DHL — compare rates at one counter.',
        icon: Truck,
      },
      {
        title: 'Drop-Off Receipt',
        description: 'We scan and provide a tracking receipt every time.',
        icon: FileText,
      },
    ],
    content: [
      {
        heading: 'Package Receiving & Drop-Off Serving All of Lake County',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Need a secure place to <a href="/pack-ship/package-receiving" class="text-[var(--color-primary)] hover:underline">receive packages</a> or drop off shipments anywhere in Lake County? Mailbox Plus on Fredle Drive in Concord Township accepts packages and drop-offs for <strong>FedEx, UPS, USPS, and DHL</strong> — all at one counter, serving residents from Willoughby to Madison.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">No waiting in franchise lines. No running between different stores for different carriers. Drop your package, get your receipt, done.</p>`,
      },
      {
        heading: 'How It Works — Package Receiving in Lake County',
        body: `<img src="https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/articles/pack-ship/package-receiving-lake-county-featured.webp" alt="Mailbox Plus package receiving service for Lake County customers" class="w-full rounded-2xl shadow-md my-8" loading="lazy" width="1200" height="675" /><div class="grid md:grid-cols-3 gap-6 mb-8"><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">1. Bring Your Package</h4><p class="text-sm text-[var(--color-text-secondary)]">Pre-labeled or need help packing — we handle both.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">2. Quick Scan</h4><p class="text-sm text-[var(--color-text-secondary)]">We scan and provide a drop-off receipt on the spot.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">3. You're Done</h4><p class="text-sm text-[var(--color-text-secondary)]">Back in your day. In and out in under 2 minutes.</p></div></div>`,
        isFullWidth: true,
      },
      {
        heading: 'Serving Willoughby, Mentor, Painesville, Eastlake, Madison & Beyond',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Lake County residents deserve a shipping experience that respects their time. Centrally located in Concord Township just off I-90, Mailbox Plus is a short drive from every corner of Lake County — Willoughby (5 min), Mentor (6 min), Painesville (8 min), Eastlake (9 min), Kirtland (4 min), and Madison (18 min). Whether you're dropping off a return, receiving a package, or shipping a gift, we're your local hub.</p>`,
      },
      {
        heading: 'What to Expect When You Visit',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">We accept packages from all major carriers — FedEx, UPS, USPS, and DHL — at one counter. No running between different stores. We scan every drop-off and provide a tracking receipt on the spot.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">If your package isn't ready to ship, we sell boxes, tape, bubble wrap, and packing peanuts. We can also professionally pack fragile or awkward items. For pre-labeled packages, just bring them in — we handle the rest.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">We're open Monday through Saturday with walk-in friendly service. Most drop-offs take under 2 minutes. While you're here, ask about our mailbox rentals, notary services, and printing — one trip can check off half your to-do list.</p>`,
      },
    ],
    faqs: [
      {
        question: 'Do you serve the entire Lake County area?',
        answer:
          "Yes! Mailbox Plus is centrally located in Concord Township and serves all of Lake County — including Willoughby, Mentor, Painesville, Eastlake, Kirtland, Madison, Concord Township, Wickliffe, Willoughby Hills, Fairport Harbor, Perry, and all surrounding communities. We're just a short drive from anywhere in the county.",
      },
      {
        question: 'Can I drop off pre-labeled packages?',
        answer:
          'Yes! We accept pre-labeled drop-offs for FedEx, UPS, USPS, and DHL. We scan and provide a receipt every time.',
      },
      {
        question:
          'Can I receive packages at Mailbox Plus even if I live in another Lake County town?',
        answer:
          'Yes! If you rent a mailbox with us, you can receive packages from all carriers at our Concord Township location. We accept deliveries from FedEx, UPS, USPS, and DHL and will hold them securely until you pick them up.',
      },
      {
        question: 'What are your hours?',
        answer:
          "Visit our pickup hours page for current business hours. We're open regular business hours and welcome walk-ins.",
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
