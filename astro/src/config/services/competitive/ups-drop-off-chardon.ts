import type { Service } from '../../../types/services';
import Clock from '~icons/lucide/clock';
import FileText from '~icons/lucide/file-text';
import Truck from '~icons/lucide/truck';

export const competePages: Service[] = [
  {
    id: 'ups-drop-off-chardon',
    category: 'pack-ship',
    city: 'Chardon',
    serviceName: 'UPS Drop-Off Near Chardon — Local & Fast | Mailbox Plus',
    slug: '/ups-drop-off-chardon',
    canonicalUrl: 'https://mailboxplusohio.com/ups-drop-off-chardon',
    pageTitle: 'UPS Drop-Off Near Chardon — Local & Fast | Mailbox Plus',
    metaDescription:
      'Looking for a UPS drop-off near Chardon, OH? Mailbox Plus handles UPS, FedEx, USPS, and DHL — just off SR 44 near Concord Township.',
    keywords: 'UPS drop-off Chardon, Chardon UPS shipping, Mailbox Plus Concord',
    heroTitle: 'UPS Drop-Off Near Chardon — Local & Fast',
    heroSubtitle:
      'Authorized FedEx, UPS, USPS, and DHL drop-off and shipping near Chardon. In and out fast.',
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
        heading: 'Package Drop-Off in Chardon — In & Out Fast',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Need to <a href="/pack-ship/package-drop-offs" class="text-[var(--color-primary)] hover:underline">drop off a pre-labeled package</a> near Chardon? Mailbox Plus on Fredle Drive in Concord Township accepts drop-offs for <strong>FedEx, UPS, USPS, and DHL</strong> — all at one counter.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">No waiting in franchise lines. No running between different stores for different carriers. Drop your package, get your receipt, done.</p>`,
      },
      {
        heading: 'How It Works — Drop Off or Ship From Chardon',
        body: `<img src="https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/articles/pack-ship/ups-drop-off-chardon-featured.webp" alt="Mailbox Plus shipping service for Chardon customers" class="w-full rounded-2xl shadow-md my-8" loading="lazy" width="1200" height="675" /><div class="grid md:grid-cols-3 gap-6 mb-8"><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">1. Bring Your Package</h4><p class="text-sm text-[var(--color-text-secondary)]">Pre-labeled or need help packing — we handle both.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">2. Quick Scan</h4><p class="text-sm text-[var(--color-text-secondary)]">We scan and provide a drop-off receipt on the spot.</p></div><div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">3. You're Done</h4><p class="text-sm text-[var(--color-text-secondary)]">Back in your day. In and out in under 2 minutes.</p></div></div>`,
        isFullWidth: true,
      },
      {
        heading: "Don't Settle — Chardon Deserves Better Service",
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Chardon residents deserve a shipping experience that respects their time. Just off SR 44 and SR 6, Mailbox Plus is only 12 miles from Chardon. Whether you're dropping off a return, shipping a birthday gift, or picking up a held package, Mailbox Plus is just 12 miles away on 7554 Fredle Drive in Concord Township. Come see the difference local service makes.</p>`,
      },
      {
        heading: 'What to Expect When You Visit',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">We accept packages from all major carriers — FedEx, UPS, USPS, and DHL — at one counter. No running between different stores. We scan every drop-off and provide a tracking receipt on the spot.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">If your package isn't ready to ship, we sell boxes, tape, bubble wrap, and packing peanuts. We can also professionally pack fragile or awkward items. For pre-labeled packages, just bring them in — we handle the rest.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">We're open Monday through Saturday with walk-in friendly service. Most drop-offs take under 2 minutes. While you're here, ask about our <a href="/home-business/mailbox-rental" class="text-[var(--color-primary)] hover:underline">mailbox rentals</a>, notary services, and printing — one trip can check off half your to-do list.</p>`,
      },
    ],
    faqs: [
      {
        question: 'How far is Mailbox Plus from Chardon?',
        answer:
          'Mailbox Plus is located at 7554 Fredle Drive in Concord Township, just 12 miles from Chardon. The drive is quick and easy.',
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
