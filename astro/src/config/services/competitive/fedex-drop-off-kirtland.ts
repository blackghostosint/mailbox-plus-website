import type { Service } from '../../../types/services';
import Clock from '~icons/lucide/clock';
import FileText from '~icons/lucide/file-text';
import Truck from '~icons/lucide/truck';

export const competePages: Service[] = [
  {
    id: 'fedex-drop-off-kirtland',
    category: 'pack-ship',
    city: 'Kirtland',
    serviceName: 'FedEx Drop-Off Near Kirtland — Minutes Away | Mailbox Plus',
    slug: '/fedex-drop-off-kirtland',
    canonicalUrl: 'https://mailboxplusohio.com/fedex-drop-off-kirtland',
    pageTitle: 'FedEx Drop-Off Near Kirtland — Minutes Away | Mailbox Plus',
    metaDescription:
      'Looking for a FedEx drop-off near Kirtland, OH? Mailbox Plus is just 4 miles away on Fredle Drive in Concord Township.',
    keywords: 'FedEx drop-off Kirtland, Kirtland FedEx shipping, Mailbox Plus Concord',
    heroTitle: 'FedEx Drop-Off Near Kirtland — Minutes Away',
    heroSubtitle:
      'Authorized FedEx, UPS, USPS, and DHL drop-off and shipping near Kirtland. In and out fast.',
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
        heading: 'FedEx Drop-Off & Shipping in Kirtland',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Need to drop off a FedEx package or ship something from Kirtland? Mailbox Plus on Fredle Drive in Concord Township is your authorized FedEx ShipCenter — just 4 miles from Kirtland.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Skip the corporate FedEx Office lines. Same FedEx service, same tracking, same reliability — with a shorter wait and local service.</p>`,
      },
      {
        heading: 'How It Works — Drop Off or Ship From Kirtland',
        body: `<img src="https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/articles/pack-ship/fedex-drop-off-kirtland-featured.webp" alt="Mailbox Plus shipping service for Kirtland customers" class="w-full rounded-2xl shadow-md my-8" loading="lazy" width="1200" height="675" /><div class="grid md:grid-cols-3 gap-6 mb-8"><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">1. Bring Your Package</h4><p class="text-sm text-[var(--color-text-secondary)]">Pre-labeled or need help packing — we handle both.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">2. Quick Scan</h4><p class="text-sm text-[var(--color-text-secondary)]">We scan and provide a drop-off receipt on the spot.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">3. You\'re Done</h4><p class="text-sm text-[var(--color-text-secondary)]">Back in your day. In and out in under 2 minutes.</p></div></div>`,
        isFullWidth: true,
      },
      {
        heading: "Don't Settle — Kirtland Deserves Better Service",
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Kirtland residents deserve a shipping experience that respects their time. Whether you\'re dropping off a return, shipping a birthday gift, or picking up a held package, Mailbox Plus is just 4 miles away on 7554 Fredle Drive in Concord Township. Come see the difference local service makes.</p>`,
      },
    ],
    faqs: [
      {
        question: 'How far is Mailbox Plus from Kirtland?',
        answer:
          'Mailbox Plus is located at 7554 Fredle Drive in Concord Township, just 4 miles from Kirtland. The drive is quick and easy.',
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
