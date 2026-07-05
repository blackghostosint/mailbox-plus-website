import type { Service } from '../../../types/services';
import Clock from '~icons/lucide/clock';
import FileText from '~icons/lucide/file-text';
import Truck from '~icons/lucide/truck';

export const competePages: Service[] = [
  {
    id: 'fedex-drop-off-madison',
    category: 'pack-ship',
    city: 'Madison',
    serviceName: 'FedEx Drop-Off Near Madison — Worth the Drive | Mailbox Plus',
    slug: '/fedex-drop-off-madison',
    canonicalUrl: 'https://mailboxplusohio.com/fedex-drop-off-madison',
    pageTitle: 'FedEx Drop-Off Near Madison — Worth the Drive | Mailbox Plus',
    metaDescription:
      'FedEx drop-off near Madison, OH. Mailbox Plus in Concord Township offers authorized FedEx shipping with friendly local service — 18 miles, worth it.',
    keywords: 'FedEx drop-off Madison, Madison FedEx shipping, Mailbox Plus Concord',
    heroTitle: 'FedEx Drop-Off Near Madison — Worth the Drive',
    heroSubtitle:
      'Authorized FedEx, UPS, USPS, and DHL drop-off and shipping near Madison. In and out fast.',
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
        heading: 'FedEx Drop-Off & Shipping in Madison',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Need to drop off a FedEx package or ship something from Madison? Mailbox Plus on Fredle Drive in Concord Township is your authorized FedEx ShipCenter — just 18 miles from Madison near I-90, SR 20, and SR 528.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Skip the corporate FedEx Office lines. Same FedEx service, same tracking, same reliability — with a shorter wait and local service.</p>`,
      },
      {
        heading: 'How It Works — Drop Off or Ship From Madison',
        body: `<img src="https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/articles/pack-ship/fedex-drop-off-madison-featured.webp" alt="Mailbox Plus shipping service for Madison customers" class="w-full rounded-2xl shadow-md my-8" loading="lazy" width="1200" height="675" /><div class="grid md:grid-cols-3 gap-6 mb-8"><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">1. Bring Your Package</h4><p class="text-sm text-[var(--color-text-secondary)]">Pre-labeled or need help packing — we handle both.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">2. Quick Scan</h4><p class="text-sm text-[var(--color-text-secondary)]">We scan and provide a drop-off receipt on the spot.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">3. You're Done</h4><p class="text-sm text-[var(--color-text-secondary)]">Back in your day. In and out in under 2 minutes.</p></div></div>`,
        isFullWidth: true,
      },
      {
        heading: "Don't Settle — Madison Deserves Better Service",
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Madison residents deserve a shipping experience that respects their time. Just off I-90, SR 20, and SR 528, Mailbox Plus is only 18 miles from Madison. Whether you're dropping off a return, shipping a birthday gift, or picking up a held package, Mailbox Plus is just 18 miles away on 7554 Fredle Drive in Concord Township. Come see the difference local service makes.</p>`,
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
        question: "Can I drop off FedEx packages that weren't printed here?",
        answer:
          "Absolutely. Bring any pre-labeled FedEx package and we'll scan it, provide a receipt, and get it into the FedEx system.",
      },
      {
        question: 'Do you offer FedEx packing services?',
        answer:
          'Yes. We offer professional packing for FedEx shipments, with proper cushioning, boxes, and tape to ensure your package arrives safely.',
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
