import type { Service } from '../../../types/services';
import Clock from '~icons/lucide/clock';
import FileText from '~icons/lucide/file-text';
import Truck from '~icons/lucide/truck';

export const competePages: Service[] = [
  {
    id: 'dhl-drop-off-painesville',
    category: 'pack-ship',
    city: 'Painesville',
    serviceName: 'DHL Drop-Off in Painesville — Local & Fast | Mailbox Plus',
    slug: '/dhl-drop-off-painesville',
    canonicalUrl: 'https://mailboxplusohio.com/dhl-drop-off-painesville',
    pageTitle: 'DHL Drop-Off in Painesville — Local & Fast | Mailbox Plus',
    metaDescription:
      'Need a DHL drop-off near Painesville, OH? Mailbox Plus handles DHL Express — and FedEx, UPS, USPS — all at one counter.',
    keywords: 'DHL drop-off Painesville, Painesville DHL shipping, Mailbox Plus Concord',
    heroTitle: 'DHL Drop-Off in Painesville — Local & Fast',
    heroSubtitle:
      'Authorized FedEx, UPS, USPS, and DHL drop-off and shipping near Painesville. In and out fast.',
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
        heading: 'Package Drop-Off in Painesville — In & Out Fast',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Need to drop off a pre-labeled package near Painesville? Mailbox Plus on Fredle Drive in Concord Township accepts drop-offs for <strong>FedEx, UPS, USPS, and DHL</strong> — all at one counter.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">No waiting in franchise lines. No running between different stores for different carriers. Drop your package, get your receipt, done.</p>`,
      },
      {
        heading: 'How It Works — Drop Off or Ship From Painesville',
        body: `<img src="https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/articles/pack-ship/dhl-drop-off-painesville-featured.webp" alt="Mailbox Plus shipping service for Painesville customers" class="w-full rounded-2xl shadow-md my-8" loading="lazy" width="1200" height="675" /><div class="grid md:grid-cols-3 gap-6 mb-8"><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">1. Bring Your Package</h4><p class="text-sm text-[var(--color-text-secondary)]">Pre-labeled or need help packing — we handle both.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">2. Quick Scan</h4><p class="text-sm text-[var(--color-text-secondary)]">We scan and provide a drop-off receipt on the spot.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">3. You're Done</h4><p class="text-sm text-[var(--color-text-secondary)]">Back in your day. In and out in under 2 minutes.</p></div></div>`,
        isFullWidth: true,
      },
      {
        heading: "Don't Settle — Painesville Deserves Better Service",
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Painesville residents deserve a shipping experience that respects their time. Just off SR 2, SR 20, and SR 44, Mailbox Plus is only 8 miles from Painesville. Whether you're dropping off a return, shipping a birthday gift, or picking up a held package, Mailbox Plus is just 8 miles away on 7554 Fredle Drive in Concord Township. Come see the difference local service makes.</p>`,
      },
    ],
    faqs: [
      {
        question: 'How far is Mailbox Plus from Painesville?',
        answer:
          'Mailbox Plus is located at 7554 Fredle Drive in Concord Township, just 8 miles from Painesville. The drive is quick and easy.',
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
