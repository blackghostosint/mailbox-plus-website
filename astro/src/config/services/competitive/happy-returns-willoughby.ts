import type { Service } from '../../../types/services';
import Clock from '~icons/lucide/clock';
import FileText from '~icons/lucide/file-text';
import Truck from '~icons/lucide/truck';

export const competePages: Service[] = [
  {
    id: 'happy-returns-willoughby',
    category: 'pack-ship',
    city: 'Willoughby',
    serviceName: 'Happy Returns Drop-Off in Willoughby — Fast & Easy | Mailbox Plus',
    slug: '/happy-returns-willoughby',
    canonicalUrl: 'https://mailboxplusohio.com/happy-returns-willoughby',
    pageTitle: 'Happy Returns Drop-Off in Willoughby — Fast & Easy | Mailbox Plus',
    metaDescription:
      'Need a Happy Returns drop-off location near Willoughby, OH? Mailbox Plus accepts Happy Returns, FedEx Easy Returns, and pre-labeled returns for all carriers.',
    keywords: 'Happy Returns Willoughby, return drop-off Willoughby, Mailbox Plus Concord',
    heroTitle: 'Happy Returns Drop-Off in Willoughby — Fast & Easy',
    heroSubtitle:
      'Authorized FedEx, UPS, USPS, and DHL drop-off and shipping near Willoughby. In and out fast.',
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
        heading: 'Return Drop-Off in Willoughby — Fast & Easy',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Need to drop off a return from Willoughby? Mailbox Plus handles Happy Returns, FedEx Easy Returns, and pre-labeled returns for all carriers — one stop, done.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">No running between different stores for different return types. Bring your package to Fredle Drive and we'll take care of it.</p>`,
      },
      {
        heading: 'How It Works — Drop Off or Ship From Willoughby',
        body: `<img src="https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/articles/pack-ship/happy-returns-willoughby-featured.webp" alt="Mailbox Plus shipping service for Willoughby customers" class="w-full rounded-2xl shadow-md my-8" loading="lazy" width="1200" height="675" /><div class="grid md:grid-cols-3 gap-6 mb-8"><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">1. Bring Your Package</h4><p class="text-sm text-[var(--color-text-secondary)]">Pre-labeled or need help packing — we handle both.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">2. Quick Scan</h4><p class="text-sm text-[var(--color-text-secondary)]">We scan and provide a drop-off receipt on the spot.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">3. You're Done</h4><p class="text-sm text-[var(--color-text-secondary)]">Back in your day. In and out in under 2 minutes.</p></div></div>`,
        isFullWidth: true,
      },
      {
        heading: "Don't Settle — Willoughby Deserves Better Service",
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Willoughby residents deserve a shipping experience that respects their time. Just off I-90, SR 2, and SR 306, Mailbox Plus is only 5 miles from Willoughby. Whether you're dropping off a return, shipping a birthday gift, or picking up a held package, Mailbox Plus is just 5 miles away on 7554 Fredle Drive in Concord Township. Come see the difference local service makes.</p>`,
      },
    ],
    faqs: [
      {
        question: 'How far is Mailbox Plus from Willoughby?',
        answer:
          'Mailbox Plus is located at 7554 Fredle Drive in Concord Township, just 5 miles from Willoughby. The drive is quick and easy.',
      },
      {
        question: 'Can I drop off pre-labeled packages?',
        answer:
          'Yes! We accept pre-labeled drop-offs for FedEx, UPS, USPS, and DHL. We scan and provide a receipt every time.',
      },
      {
        question: 'Can I drop off packages for different carriers at the same time?',
        answer:
          'Yes! Unlike single-carrier stores, we accept drop-offs for FedEx, UPS, USPS, and DHL at one counter. One trip, all your packages handled.',
      },
      {
        question: 'What are your hours?',
        answer:
          "Visit our pickup hours page for current business hours. We're open regular business hours and welcome walk-ins.",
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
