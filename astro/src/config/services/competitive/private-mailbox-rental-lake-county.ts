import type { Service } from '../../../types/services';
import MapPin from '~icons/lucide/map-pin';
import Package from '~icons/lucide/package';
import Lock from '~icons/lucide/lock';

export const competePages: Service[] = [
  {
    id: 'private-mailbox-rental-lake-county',
    category: 'mailbox-rentals',
    city: 'Concord Township',
    serviceName: 'Private Mailbox Rental in Lake County | Mailbox Plus',
    slug: '/private-mailbox-rental-lake-county',
    canonicalUrl: 'https://mailboxplusohio.com/private-mailbox-rental-lake-county',
    pageTitle: 'Private Mailbox Rental in Lake County | Mailbox Plus',
    metaDescription:
      'Private mailbox rental serving all of Lake County, OH. Real street address, secure mail, package receiving — from $35/month at Mailbox Plus in Concord.',
    keywords:
      'private mailbox rental Lake County OH, mailbox rental Lake County Ohio, business mailbox Lake County, street address Lake County, mailbox rental Mentor, mailbox rental Painesville, mailbox rental Willoughby',
    heroTitle: 'Private Mailbox Rental Serving All of Lake County, Ohio',
    heroSubtitle:
      'A real street address that works for every Lake County town. Accepts UPS, FedEx, USPS & DHL. From $35/month. Your home stays private.',
    features: [
      {
        title: 'Real Street Address',
        description:
          '7554 Fredle Drive, Concord Township — not a P.O. Box number. Use it for business filings, Amazon, and personal mail.',
        icon: MapPin,
      },
      {
        title: 'All-Carrier Acceptance',
        description:
          'UPS, FedEx, USPS, and DHL all deliver to your mailbox. We sign for packages so you never miss a delivery.',
        icon: Package,
      },
      {
        title: 'Secure & Private',
        description:
          'Your mail is held behind a locked counter. Your home address stays off every label, filing, and database.',
        icon: Lock,
      },
    ],
    content: [
      // ── H2: One Address. Every Carrier. Every Town. ──
      {
        heading: 'One Address. Every Carrier. Every Town.',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Mentor. Willoughby. Painesville. Eastlake. Madison. You live in one town, work in another, and your packages arrive from every direction.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">The post office gives you a PO Box that only accepts USPS. The UPS Store gives you a mailbox that only accepts UPS. Your front porch accepts everything — and so do the thieves who watch it.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Mailbox Plus is the only mailbox rental in Lake County that accepts <strong>UPS, FedEx, USPS, and DHL</strong> under one roof. One address. Four carriers. No runaround.</p>`,
      },
      // ── H2: The Lake County Difference ──
      {
        heading: 'The Lake County Difference',
        body: `<div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm"><thead class="bg-[var(--color-bg-secondary)]/80"><tr><th class="p-4 font-semibold text-[var(--color-text-primary)]">Feature</th><th class="p-4 font-semibold text-[var(--color-text-primary)]">Mailbox Plus</th><th class="p-4 font-semibold text-[var(--color-text-primary)]">UPS Store</th><th class="p-4 font-semibold text-[var(--color-text-primary)]">PO Box</th></tr></thead><tbody class="divide-y divide-[var(--color-border)]"><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Real street address</td><td class="p-4 text-green-700 font-bold">✓</td><td class="p-4 text-green-700">✓</td><td class="p-4 text-red-500">✗</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">UPS, FedEx, DHL</td><td class="p-4 text-green-700 font-bold">✓</td><td class="p-4 text-[var(--color-text-secondary)]">UPS only</td><td class="p-4 text-red-500">✗</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Multi-carrier shipping</td><td class="p-4 text-green-700 font-bold">✓</td><td class="p-4 text-[var(--color-text-secondary)]">UPS only</td><td class="p-4 text-red-500">✗</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Price online</td><td class="p-4 text-[var(--color-text-primary)] font-bold">$35/mo</td><td class="p-4 text-[var(--color-text-secondary)]">Hidden</td><td class="p-4 text-[var(--color-text-secondary)]">$10--$30</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Digital mailbox</td><td class="p-4 text-green-700 font-bold">✓</td><td class="p-4 text-red-500">✗</td><td class="p-4 text-red-500">✗</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">30-day risk-free</td><td class="p-4 text-green-700 font-bold">✓</td><td class="p-4 text-red-500">✗</td><td class="p-4 text-red-500">✗</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Locally owned</td><td class="p-4 text-green-700 font-bold">✓</td><td class="p-4 text-[var(--color-text-secondary)]">Franchise</td><td class="p-4 text-[var(--color-text-secondary)]">N/A</td></tr></tbody></table></div>`,
        isFullWidth: true,
      },
      // ── H2: Serving Every Lake County Town ──
      {
        heading: 'Serving Every Lake County Town',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Mailbox Plus is at <strong>7554 Fredle Drive in Concord Township</strong>. From your town, the drive is short.</p><div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm"><thead class="bg-[var(--color-bg-secondary)]/80"><tr><th class="p-4 font-semibold text-[var(--color-text-primary)]">Town</th><th class="p-4 font-semibold text-[var(--color-text-primary)]">Drive</th></tr></thead><tbody class="divide-y divide-[var(--color-border)]"><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Kirtland</td><td class="p-4 text-[var(--color-text-secondary)]">4 min</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Concord Twp</td><td class="p-4 text-[var(--color-text-secondary)]">At the store</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Willoughby</td><td class="p-4 text-[var(--color-text-secondary)]">5 min</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Mentor</td><td class="p-4 text-[var(--color-text-secondary)]">6 min</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Painesville</td><td class="p-4 text-[var(--color-text-secondary)]">8 min</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Eastlake</td><td class="p-4 text-[var(--color-text-secondary)]">9 min</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Willoughby Hills</td><td class="p-4 text-[var(--color-text-secondary)]">10 min</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Wickliffe</td><td class="p-4 text-[var(--color-text-secondary)]">12 min</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Fairport Harbor</td><td class="p-4 text-[var(--color-text-secondary)]">14 min</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Madison</td><td class="p-4 text-[var(--color-text-secondary)]">18 min</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Perry</td><td class="p-4 text-[var(--color-text-secondary)]">20 min</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Geneva</td><td class="p-4 text-[var(--color-text-secondary)]">22 min</td></tr></tbody></table></div><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">One address works for the whole county. Move from Willoughby to Painesville? Your mailbox stays the same.</p>`,
        isFullWidth: true,
      },
      // ── H2: A Real Street Address. Not a Box Number. ──
      {
        heading: 'A Real Street Address. Not a Box Number.',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Your address is <strong>7554 Fredle Drive, Concord Township, OH 44077</strong> — a real street address you can use for:</p><ul class="space-y-3 mb-6"><li class="flex items-start gap-3 text-lg text-[var(--color-text-primary)]"><span class="text-[var(--color-primary)] font-bold shrink-0">•</span><span><strong>Amazon & online shopping</strong> — every carrier delivers</span></li><li class="flex items-start gap-3 text-lg text-[var(--color-text-primary)]"><span class="text-[var(--color-primary)] font-bold shrink-0">•</span><span><strong>Business registration</strong> — LLCs, DBAs, sole proprietorships</span></li><li class="flex items-start gap-3 text-lg text-[var(--color-text-primary)]"><span class="text-[var(--color-primary)] font-bold shrink-0">•</span><span><strong>Personal mail</strong> — bank statements, tax documents, paychecks</span></li><li class="flex items-start gap-3 text-lg text-[var(--color-text-primary)]"><span class="text-[var(--color-primary)] font-bold shrink-0">•</span><span><strong>Package receiving</strong> — we sign for everything</span></li></ul><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">A PO Box is a number at the post office. A private mailbox is an address that works everywhere — including for FedEx and UPS packages that no PO Box can accept.</p>`,
      },
      // ── H2: Privacy ──
      {
        heading: 'Privacy That Works From Wickliffe to Geneva',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Every shipping label, every online order, every business filing pumps your home address into a system you cannot control. Data brokers buy it. Porch pirates track it.</p><p class="text-lg text-[var(--color-text-primary)] leading-relaxed">A mailbox rental at Mailbox Plus stops that. Your packages go to 7554 Fredle Drive. Your home address stays at home. Porch thieves find an empty porch. Data brokers find a mailbox.</p>`,
      },
      // ── H2: What You Get ──
      {
        heading: 'What You Get',
        body: `<div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm"><thead class="bg-[var(--color-bg-secondary)]/80"><tr><th class="p-4 font-semibold text-[var(--color-text-primary)]">Feature</th><th class="p-4 font-semibold text-[var(--color-text-primary)]">Detail</th></tr></thead><tbody class="divide-y divide-[var(--color-border)]"><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Real street address</td><td class="p-4 text-[var(--color-text-secondary)]">7554 Fredle Drive — not a PO Box</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">All 4 carriers</td><td class="p-4 text-[var(--color-text-secondary)]">UPS, FedEx, USPS, DHL</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Package signing</td><td class="p-4 text-[var(--color-text-secondary)]">We sign for every delivery</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">4-hour notification</td><td class="p-4 text-[var(--color-text-secondary)]">Know when your mail arrives</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Secure storage</td><td class="p-4 text-[var(--color-text-secondary)]">Locked behind our counter</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Digital mailbox</td><td class="p-4 text-[var(--color-text-secondary)]">View mail online</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Month-to-month</td><td class="p-4 text-[var(--color-text-secondary)]">No contract. Cancel anytime.</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">30-day risk-free</td><td class="p-4 text-[var(--color-text-secondary)]">Try it. Walk away if it is not for you.</td></tr></tbody></table></div>`,
        isFullWidth: true,
      },
      // ── H2: Pricing ──
      {
        heading: 'Pricing — Clear and Simple',
        body: `<div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm"><thead class="bg-[var(--color-bg-secondary)]/80"><tr><th class="p-4 font-semibold text-[var(--color-text-primary)]">Size</th><th class="p-4 font-semibold text-[var(--color-text-primary)]">Monthly</th><th class="p-4 font-semibold text-[var(--color-text-primary)]">Annual (Best Value)</th></tr></thead><tbody class="divide-y divide-[var(--color-border)]"><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Small Box</td><td class="p-4 text-[var(--color-text-primary)] font-bold">$35.00</td><td class="p-4 text-[var(--color-text-primary)]">$420.00</td></tr><tr><td class="p-4 text-[var(--color-text-primary)] font-medium">Large Box</td><td class="p-4 text-[var(--color-text-primary)] font-bold">$50.00</td><td class="p-4 text-[var(--color-text-primary)]">$600.00</td></tr></tbody></table></div><ul class="space-y-2 text-lg text-[var(--color-text-secondary)]"><li>5 packages included per month</li><li>Additional packages: $5.00 each</li><li>Key deposit: $5.00 (refundable)</li><li>3, 6, and 12-month terms available</li></ul><p class="text-lg text-[var(--color-text-primary)] leading-relaxed mt-6 font-semibold">Every other mailbox service in Lake County hides its prices. We do not. Start with our <a href="/home-business/mailbox-rental" class="text-[var(--color-primary)] hover:underline">private mailbox rental</a> page, or learn about our <a href="/pack-ship/package-receiving" class="text-[var(--color-primary)] hover:underline">package receiving</a> service.</p>`,
        isFullWidth: true,
      },
      // ── H2: Three Steps ──
      {
        heading: 'Three Steps to Your Lake County Address',
        body: `<div class="grid gap-6 md:grid-cols-3 my-6"><div class="p-6 rounded-2xl bg-[var(--color-bg-secondary)]/80 border border-[var(--color-border)]"><div class="font-bold text-[var(--color-primary)] mb-2 text-lg">1. Fill out USPS Form 1583</div><p class="text-sm leading-relaxed text-[var(--color-text-secondary)] font-medium">We help you at the counter. Each authorized recipient needs their own ID check.</p></div><div class="p-6 rounded-2xl bg-[var(--color-bg-secondary)]/80 border border-[var(--color-border)]"><div class="font-bold text-[var(--color-primary)] mb-2 text-lg">2. Bring two forms of ID</div><p class="text-sm leading-relaxed text-[var(--color-text-secondary)] font-medium">One photo ID (driver's license or passport). One with your current address (lease or utility bill).</p></div><div class="p-6 rounded-2xl bg-[var(--color-bg-secondary)]/80 border border-[var(--color-border)]"><div class="font-bold text-[var(--color-primary)] mb-2 text-lg">3. Start using your address</div><p class="text-sm leading-relaxed text-[var(--color-text-secondary)] font-medium">Immediately. Update Amazon, your bank, your business filings. Your home address comes off the pipeline.</p></div></div>`,
        isFullWidth: true,
      },
    ],
    faqs: [
      {
        question: 'I live in Mentor — do I need to drive to Concord Township for my mailbox?',
        answer:
          'Yes, and it is a six-minute drive. We are at 7554 Fredle Drive, right off I-90 and SR 306.',
      },
      {
        question: 'Can I receive FedEx and UPS packages at a mailbox rental?',
        answer:
          'Yes. Unlike a PO Box, your street address accepts UPS, FedEx, USPS, and DHL. We sign for everything.',
      },
      {
        question: 'What if I move within Lake County?',
        answer:
          'Your mailbox stays the same. Move from Willoughby to Painesville — your address does not change.',
      },
      {
        question: 'Is this the same as a PO Box?',
        answer:
          'No. A PO Box is a number at the post office that only receives USPS mail. Your Mailbox Plus address is a real street address that accepts all four carriers.',
      },
      {
        question: 'How much does it cost?',
        answer:
          'Small boxes start at $35/month. Large boxes at $50/month. Annual prepay saves you two months. No contracts — month-to-month, cancel anytime.',
      },
      {
        question: 'What do I need to bring to sign up?',
        answer:
          "Two forms of ID — one photo ID (driver's license or passport) and one showing your current address (lease or utility bill).",
      },
      {
        question: 'How far is Mailbox Plus from Painesville?',
        answer: 'Eight minutes. 7554 Fredle Drive, Concord Township — just off I-90.',
      },
      {
        question: 'Do you serve Willoughby Hills?',
        answer:
          'Yes. We serve every Lake County town, including Willoughby Hills, Wickliffe, Fairport Harbor, Madison, Perry, and Geneva.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
    cta: {
      title: 'Your Address at 7554 Fredle Drive',
      subtitle:
        'A real street address serving all of Lake County. Accepts UPS, FedEx, USPS & DHL. From $35/month. 30-day risk-free.',
      buttonText: 'Get Your Lake County Address →',
      buttonLink: '/contact-us',
    },
    hideCarrierLogos: false,
  },
];
