import type { Service } from '../../../types/services';
import MapPin from '~icons/lucide/map-pin';
import Package from '~icons/lucide/package';
import Clock from '~icons/lucide/clock';
import Mail from '~icons/lucide/mail';
import Bell from '~icons/lucide/bell';
import Shield from '~icons/lucide/shield';

export const competePages: Service[] = [
  {
    id: 'mailbox-rental-mentor',
    category: 'mailbox-rentals',
    city: 'Mentor',
    serviceName:
      'Mailbox Rental in Mentor, OH --- Real Street Address | From $35/mo --- Mailbox Plus',
    slug: '/mailbox-rental-mentor',
    canonicalUrl: 'https://mailboxplusohio.com/mailbox-rental-mentor',
    pageTitle:
      'Mailbox Rental in Mentor, OH --- Real Street Address | From $35/mo --- Mailbox Plus',
    metaDescription:
      'Rent a private mailbox in Mentor, OH with a real street address. Secure USPS mail, package receiving, and 24/7 access — from $35/month. Locally owned.',
    keywords:
      'mailbox rental Mentor OH, private mailbox Mentor Ohio, real street address Mentor OH, UPS Store alternative Mentor Ohio, PO Box alternative Mentor OH, package receiving service Mentor OH, mailbox rental near Mentor OH 44060, small business mailing address Mentor Ohio',
    heroTitle: 'Get a Real Street Address for Your Home or Business --- From Just $35/Month',
    heroSubtitle:
      'Stop using your home address for packages, business mail, and online orders. Mailbox Plus gives you a real Mentor-area street address. We accept packages from all four carriers --- UPS, FedEx, USPS, and DHL --- at one counter. No PO Box. No hidden fees. No annual contract.',
    features: [
      {
        title: 'Real Street Address, Not a PO Box',
        description:
          'Your mailbox gives you a real street address. Use it for Amazon, Etsy, LLC filings, and client invoices. Unlike a PO Box, every carrier can deliver here. We sign for every package.',
        icon: MapPin,
      },
      {
        title: 'All 4 Carriers at One Counter',
        description:
          'UPS, FedEx, USPS, and DHL. Every carrier drops at our door. You pick up from one counter. No more driving to three places to get your packages.',
        icon: Package,
      },
      {
        title: 'Clear Price, No Hidden Fees',
        description:
          "From $35/month. No application fee. No surprise charges. The UPS Store won't tell you their price online. We do.",
        icon: Clock,
      },
      {
        title: 'Month-to-Month, No Contract',
        description:
          'Try us 30 days risk-free. Not for you? Cancel with no penalty. No annual contract. No paperwork.',
        icon: Mail,
      },
      {
        title: '4-Hour Mail Notification',
        description:
          "Mail arrives. We scan it within 4 hours. You get a phone alert. Know what's waiting. Forward what you need. Pick up the rest when it works for you.",
        icon: Bell,
      },
      {
        title: 'No More Porch Theft',
        description:
          'Every package is signed for and locked behind a secure counter. Your packages stay safe, even when you are at work or out of town.',
        icon: Shield,
      },
    ],
    content: [
      // ── H2: The UPS Store Alternative Comparison ──
      {
        heading: 'Mailbox Plus vs. The UPS Store in Mentor',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">The UPS Store has two Mentor locations, but both use the same corporate template. Here is how Mailbox Plus stacks up.</p><div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm"><thead class="bg-[var(--color-bg-secondary)]/80"><tr><th class="p-4 font-semibold text-[var(--color-text-primary)]"></th><th class="p-4 font-semibold text-[var(--color-text-primary)]">Mailbox Plus</th><th class="p-4 font-semibold text-[var(--color-text-primary)]">The UPS Store (Mentor)</th></tr></thead><tbody class="divide-y divide-[var(--color-border)]"><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Monthly price</td><td class="p-4 text-[var(--color-text-primary)] font-bold">From $35 --- shown online</td><td class="p-4 text-[var(--color-text-secondary)]">"Call for pricing"</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Contract</td><td class="p-4 text-[var(--color-text-primary)]">Month-to-month, cancel anytime</td><td class="p-4 text-[var(--color-text-secondary)]">Annual deal varies</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Carriers at one counter</td><td class="p-4 text-[var(--color-text-primary)]">UPS, FedEx, USPS, DHL</td><td class="p-4 text-[var(--color-text-secondary)]">UPS-focused</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Package alert</td><td class="p-4 text-[var(--color-text-primary)]">Within 4 hours</td><td class="p-4 text-[var(--color-text-secondary)]">Yes</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Risk-free trial</td><td class="p-4 text-[var(--color-text-primary)]">30 days</td><td class="p-4 text-[var(--color-text-secondary)]">Not offered</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Locally owned</td><td class="p-4 text-[var(--color-text-primary)]">Yes --- Concord Township</td><td class="p-4 text-[var(--color-text-secondary)]">Corporate franchise</td></tr></tbody></table></div>`,
      },
      // ── H2: Audience Segments ──
      {
        heading: 'A Mailbox for Every Story',
        body: `<div class="grid gap-6 md:grid-cols-3 my-6"><div class="p-6 rounded-2xl bg-[var(--color-bg-secondary)]/80 border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Small Business Owners</h4><p class="text-sm leading-relaxed text-[var(--color-text-secondary)] font-medium">Your home address is on every filing, every invoice, every shipping label. It hurts your image and your privacy. A Mailbox Plus address looks professional. Use it for your LLC, your website, and your business cards. No office rent needed.</p></div><div class="p-6 rounded-2xl bg-[var(--color-bg-secondary)]/80 border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Remote Workers & Travelers</h4><p class="text-sm leading-relaxed text-[var(--color-text-secondary)] font-medium">You work from home or travel for work. When you leave, mail still shows up. We scan your mail within 4 hours. Forward what you need. Hold the rest. Check your mail from your phone. Snowbirds: this is how you handle mail from the road.</p></div><div class="p-6 rounded-2xl bg-[var(--color-bg-secondary)]/80 border border-[var(--color-border)]"><h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Residents Tired of Porch Theft</h4><p class="text-sm leading-relaxed text-[var(--color-text-secondary)] font-medium">Packages sit on your porch until you get home. Maybe one got stolen. With Mailbox Plus, every package is signed for and locked up. Pick up after work or on weekends. $35/month is less than one stolen package.</p></div></div>`,
        isFullWidth: true,
      },
      // ── H2: Pricing Table ──
      {
        heading: 'Simple Pricing. No Surprises.',
        body: `<div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm"><thead class="bg-[var(--color-bg-secondary)]/80"><tr><th class="p-4 font-semibold text-[var(--color-text-primary)]">Box Size</th><th class="p-4 font-semibold text-[var(--color-text-primary)]">Monthly</th><th class="p-4 font-semibold text-[var(--color-text-primary)]">Includes</th></tr></thead><tbody class="divide-y divide-[var(--color-border)]"><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Small Box</td><td class="p-4 text-[var(--color-text-primary)] font-bold">$35/mo</td><td class="p-4 text-[var(--color-text-secondary)]">Mail + parcels, 5 packages/mo</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Large Box</td><td class="p-4 text-[var(--color-text-primary)] font-bold">$50/mo</td><td class="p-4 text-[var(--color-text-secondary)]">Mail + parcels, 5 packages/mo</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Extra packages</td><td class="p-4 text-[var(--color-text-primary)] font-bold">$5 each</td><td class="p-4 text-[var(--color-text-secondary)]">Over 5 per month</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Key deposit</td><td class="p-4 text-[var(--color-text-primary)] font-bold">$5 refundable</td><td class="p-4 text-[var(--color-text-secondary)]">One-time, returned when you close</td></tr></tbody></table></div><p class="text-sm text-[var(--color-text-muted)] italic">All plans include: 4-hour mail alerts, secure storage, all-carrier acceptance, month-to-month or annual terms.</p>`,
      },
      // ── H2: 3-Step Setup ──
      {
        heading: 'Get Your Mentor Mailbox in 3 Steps',
        body: `<div class="grid gap-6 md:grid-cols-3 my-6"><div class="p-6 rounded-2xl bg-[var(--color-bg-secondary)]/80 border border-[var(--color-border)]"><div class="font-bold text-[var(--color-primary)] mb-2 text-lg">1. Fill out USPS Form 1583</div><p class="text-sm leading-relaxed text-[var(--color-text-secondary)] font-medium">One page. We have copies at the counter.</p></div><div class="p-6 rounded-2xl bg-[var(--color-bg-secondary)]/80 border border-[var(--color-border)]"><div class="font-bold text-[var(--color-primary)] mb-2 text-lg">2. Bring 2 Forms of ID</div><p class="text-sm leading-relaxed text-[var(--color-text-secondary)] font-medium">One photo ID plus one proof of address.</p></div><div class="p-6 rounded-2xl bg-[var(--color-bg-secondary)]/80 border border-[var(--color-border)]"><div class="font-bold text-[var(--color-primary)] mb-2 text-lg">3. Start Today</div><p class="text-sm leading-relaxed text-[var(--color-text-secondary)] font-medium">Your new Mentor-area mailbox is active right away.</p></div></div>`,
        isFullWidth: true,
      },
      // ── H2: Local Area ──
      {
        heading: 'Serving Mentor and All of Lake County',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Located at 7554 Fredle Drive, Concord Township — just off Mentor Avenue near Great Lakes Mall. We serve Little Mountain, Mentor-on-the-Lake, Headlands, and Mentor Lagoons. About 5 minutes from Great Lakes Mall and an 8-minute drive from central Mentor.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed mt-4">Whether you're a small business owner needing a professional address, a remote worker managing mail from the road, or a resident tired of porch theft — <a href="/home-business/mailbox-rental" class="text-[var(--color-primary)] hover:underline">Mailbox Plus</a> is your Mentor-area mailbox solution. No contract. Month-to-month. 30-day risk-free. And when it's time to ship, we take <a href="/pack-ship/package-drop-offs" class="text-[var(--color-primary)] hover:underline">drop-offs for all four carriers</a> at the same counter.</p>`,
      },
    ],
    faqs: [
      {
        question: 'How far is Mailbox Plus from Mentor?',
        answer:
          'About 5 minutes from Great Lakes Mall. We are at 7554 Fredle Drive in Concord Township, just off Mentor Avenue. An 8-minute drive from central Mentor.',
      },
      {
        question: 'Can I use this address for my LLC?',
        answer:
          'Yes. This is a real street address, not a PO Box. Use it for Ohio LLC filings, IRS forms, and client invoices.',
      },
      {
        question: 'Do you take packages from Amazon, FedEx, and UPS?',
        answer: 'Yes, every carrier. Amazon, FedEx, UPS, USPS, DHL. If it ships, we sign for it.',
      },
      {
        question: 'What is the difference between this and a PO Box at the Mentor Post Office?',
        answer:
          'A PO Box only gets USPS mail. FedEx and UPS will not deliver there. With Mailbox Plus, all four carriers deliver. Plus you get 4-hour alerts and package forwarding.',
      },
      {
        question: 'Can you forward my mail when I travel?',
        answer:
          'Yes. See every envelope scan in our digital portal. Tell us what to forward and where. We ship it to you.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
    cta: {
      title: 'Ready to Stop Using Your Home Address?',
      subtitle: 'Get a Mentor-area mailbox from $35/month. No contract. 30-day risk-free.',
      buttonText: 'Get Your Mentor Address →',
      buttonLink: '/contact-us',
    },
    hideCarrierLogos: false,
  },
];
