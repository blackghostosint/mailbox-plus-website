import Package from '~icons/lucide/package';
import Shield from '~icons/lucide/shield';
import Truck from '~icons/lucide/truck';
import Printer from '~icons/lucide/printer';
import FileText from '~icons/lucide/file-text';
import Palette from '~icons/lucide/palette';
import Star from '~icons/lucide/star';
import { Service } from '../../types/services';
import { getServiceImageUrl } from '../../lib/storage';
import { packShipFaqs, generalCopyPrintFaqs } from '../faqs';

export const coreServices: Service[] = [
  // ---------------------------
  // CORE
  // ---------------------------
  {
    id: 'pack-ship',
    category: 'core',
    city: 'Concord Township',
    serviceName: 'Pack & Ship',
    slug: '/pack-ship',
    pageTitle: 'Pack & Ship in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Compare UPS, FedEx, USPS, and DHL side-by-side in Concord Township. Custom packing for fragile items. Free package drop-offs. All 4 carriers, one counter.',
    keywords:
      'shipping comparison, multi-carrier, FedEx, UPS, USPS, DHL, custom packing, package drop-off, Concord Township, Lake County',
    heroTitle: 'The Counter That Compares',
    heroSubtitle:
      'Compare UPS, FedEx, USPS, and DHL side-by-side. Custom packing for fragile items. Returns and receiving — all at one counter in Concord Township.',
    heroImage: getServiceImageUrl('/images/pack-ship.webp'),
    content: [
      {
        heading: 'Every Shipping Service You Need — Under One Roof',
        body: `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
                            <div class="text-3xl mb-4">🚚</div>
                            <h3 class="text-xl font-bold mb-2">Compare Carrier Rates</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">UPS, FedEx, USPS, DHL at one counter. Pick the cheapest or fastest — you decide.</p>
                            <a href="/pack-ship/ups-authorized-shipper-outlet" class="text-[var(--color-primary)] font-semibold hover:underline">Compare All 4 Carriers →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
                            <div class="text-3xl mb-4">🎨</div>
                            <h3 class="text-xl font-bold mb-2">Fragile & Specialty Shipping</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">Artwork, bikes, golf clubs — custom crates that survive the sorting machines, not a prayer.</p>
                            <a href="/pack-ship/artwork-shipping" class="text-[var(--color-primary)] font-semibold hover:underline">See Specialty Options →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
                            <div class="text-3xl mb-4">📦</div>
                            <h3 class="text-xl font-bold mb-2">Professional Packing</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">We pack it so carrier sorting machines can't break it. You ship with confidence.</p>
                            <a href="/pack-ship/professional-packing" class="text-[var(--color-primary)] font-semibold hover:underline">Get Packed →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
                            <div class="text-3xl mb-4">📬</div>
                            <h3 class="text-xl font-bold mb-2">Package Drop-Offs</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">Free drop-offs for all 4 carriers. Bring any pre-labeled package — one stop, no waiting.</p>
                            <a href="/pack-ship/package-drop-offs" class="text-[var(--color-primary)] font-semibold hover:underline">Drop Off Now →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
                            <div class="text-3xl mb-4">🛡️</div>
                            <h3 class="text-xl font-bold mb-2">Package Receiving</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">We sign. We store. You pick up. No porch needed. From $10/package or $30/month unlimited.</p>
                            <a href="/pack-ship/package-receiving" class="text-[var(--color-primary)] font-semibold hover:underline">Stop Porch Pirates →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
                            <div class="text-3xl mb-4">↩️</div>
                            <h3 class="text-xl font-bold mb-2">Amazon Returns</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">From your cart to our counter. Label printing, packing, and carrier drop-off — we handle it all.</p>
                            <a href="/amazon-returns" class="text-[var(--color-primary)] font-semibold hover:underline">Start Your Return →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
                            <div class="text-3xl mb-4">📎</div>
                            <h3 class="text-xl font-bold mb-2">Packaging Supplies</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">Boxes, tape, bubble wrap — grab what you need right where you ship. No second stop.</p>
                            <a href="/pack-ship/packaging-supplies" class="text-[var(--color-primary)] font-semibold hover:underline">Shop Supplies →</a>
                        </div>
                    </div>
                `,
        isFullWidth: true,
      },
      {
        heading: 'Why One Counter Beats Three Stores',
        body: `
                    <div class="max-w-4xl mx-auto space-y-10 py-4">
                        <div class="grid md:grid-cols-3 gap-6">
                            <div class="text-center p-6">
                                <div class="text-4xl mb-4">🏪</div>
                                <h3 class="text-lg font-bold mb-2">Franchises Sell One</h3>
                                <p class="text-[var(--color-text-secondary)] text-sm leading-relaxed">UPS Store sells UPS. FedEx Office sells FedEx. You need to drive to multiple stores to compare. We put all 4 at one counter so you pick the best — not the only.</p>
                            </div>
                            <div class="text-center p-6">
                                <div class="text-4xl mb-4">⏰</div>
                                <h3 class="text-lg font-bold mb-2">Post Offices Have Lines</h3>
                                <p class="text-[var(--color-text-secondary)] text-sm leading-relaxed">Your lunch break isn't for waiting in line. We handle the same USPS services — plus UPS, FedEx, and DHL — without the wait.</p>
                            </div>
                            <div class="text-center p-6">
                                <div class="text-4xl mb-4">🎲</div>
                                <h3 class="text-lg font-bold mb-2">DIY Packing Is a Gamble</h3>
                                <p class="text-[var(--color-text-secondary)] text-sm leading-relaxed">One sorting-belt drop and your item is gone. Our professional packers use carrier-compliant materials that absorb the abuse — so your stuff arrives.</p>
                            </div>
                        </div>

                        <div class="text-center bg-[var(--color-bg-secondary)] rounded-2xl p-8 border border-[var(--color-border)]">
                            <h3 class="text-xl font-bold mb-3">Authorized for All 4 Carriers. Trained Packers. One Counter.</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4 max-w-2xl mx-auto">
                                We're your neighborhood authorized FedEx ShipCenter, UPS Authorized Shipper, USPS provider, and DHL Service Point — all at the same address. Bring your package in. We'll weigh it, show you rates for every carrier, and pack it if you need us to.
                            </p>
                            <p class="text-sm text-[var(--color-text-secondary)] italic">
                                "We help you compare. We don't upsell you to one carrier. We just help you pick the right one."
                            </p>
                        </div>
                    </div>
                `,
        isFullWidth: true,
      },
      {
        heading: 'While You\'re Here — Make Your Incoming Packages This Safe Too',
        body: `
                    <div class="max-w-4xl mx-auto py-4">
                        <div class="rounded-2xl bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] p-8 md:p-10 text-white text-center">
                            <h3 class="text-2xl font-bold mb-3">A Mailbox Means Your Packages Wait For You — Not Your Porch</h3>
                            <p class="text-white/80 mb-6 max-w-2xl mx-auto leading-relaxed">
                                Already dropping off packages here? A private mailbox means you <em>receive</em> packages from all carriers too. 
                                We sign for them, store them safely, and notify you within 4 hours. Porch pirates never get the chance.
                            </p>
                            <div class="flex flex-wrap justify-center gap-3">
                                <a href="/mailbox-rentals" class="inline-block bg-white text-[var(--color-primary-dark)] font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">Explore Mailbox Plans →</a>
                                <span class="inline-flex items-center text-white/60 text-sm">From $35/month · No contract</span>
                            </div>
                        </div>
                    </div>
                `,
        isFullWidth: true,
      },
    ],
    features: [
      {
        icon: Package,
        title: '4 Carriers, 1 Counter',
        description:
          'Compare UPS, FedEx, USPS, and DHL side-by-side — pick the cheapest or the fastest, not the only option.',
      },
      {
        icon: Shield,
        title: 'Professional Packing',
        description:
          'Custom crating for fragile items that absorbs sorting-machine abuse. We pack it so carriers can\'t break it.',
      },
      {
        icon: Truck,
        title: 'Package Receiving Included',
        description:
          'We sign for and store packages from all carriers — from $10/package or $30/month for unlimited peace of mind.',
      },
    ],
    faqs: packShipFaqs,
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
  {
    id: 'copy-print',
    category: 'core',
    city: 'Concord Township',
    serviceName: 'Copy & Print',
    slug: '/copy-print',
    pageTitle: 'Copy and Print Services in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Urgent printing in Concord Township? Your printer failed, we print while you wait. Business cards, flyers, documents, posters — color or B&W. No $60 ink cartridge required.',
    keywords: 'printing, copy, business cards, flyers, posters, document printing, Concord Township, Lake County',
    heroTitle: 'Your Printer Died. We\'re Your Backup.',
    heroSubtitle:
      'Same-day printing, color or B&W, while you wait. No $60 ink cartridge required.',
    heroImage: getServiceImageUrl('/images/document-printing.webp'),
    content: [
      // --- SECTION 1: Service Grid (SB7 Position: Plan — Process) ---
      {
        heading: 'What We Print — Same Day, While You Wait',
        body: `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
                            <div class="text-3xl mb-4">📄</div>
                            <h3 class="text-xl font-bold mb-2">Document Printing</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">Reports, presentations, contracts — color or B&W.</p>
                            <a href="/copy-print/document-printing" class="text-[var(--color-primary)] font-semibold hover:underline">Print Now →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
                            <div class="text-3xl mb-4">🪪</div>
                            <h3 class="text-xl font-bold mb-2">Business Cards</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">Professional cards that leave a lasting impression.</p>
                            <a href="/copy-print/business-cards" class="text-[var(--color-primary)] font-semibold hover:underline">Get Noticed →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
                            <div class="text-3xl mb-4">📢</div>
                            <h3 class="text-xl font-bold mb-2">Flyers & Brochures</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">Full-color marketing materials for your next event.</p>
                            <a href="/copy-print/flyers-brochures" class="text-[var(--color-primary)] font-semibold hover:underline">Print Your Flyer →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
                            <div class="text-3xl mb-4">🖼️</div>
                            <h3 class="text-xl font-bold mb-2">Poster Printing</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">Large-format posters for promotions and events.</p>
                            <a href="/copy-print/posters-printing" class="text-[var(--color-primary)] font-semibold hover:underline">Print Big →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
                            <div class="text-3xl mb-4">💌</div>
                            <h3 class="text-xl font-bold mb-2">Postcard Printing</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">Direct mail marketing, invitations, announcements.</p>
                            <a href="/copy-print/postcard-printing" class="text-[var(--color-primary)] font-semibold hover:underline">Print & Mail →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
                            <div class="text-3xl mb-4">📋</div>
                            <h3 class="text-xl font-bold mb-2">Copies</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">One copy or 500 — fast, accurate reproductions.</p>
                            <a href="/copy-print/copies" class="text-[var(--color-primary)] font-semibold hover:underline">Make Copies →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
                            <div class="text-3xl mb-4">🎨</div>
                            <h3 class="text-xl font-bold mb-2">Graphic Design</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">Not a designer? We are. Let's build your brand.</p>
                            <a href="/copy-print/graphic-design" class="text-[var(--color-primary)] font-semibold hover:underline">Design Help →</a>
                        </div>
                    </div>
                `,
        isFullWidth: true,
      },
      // --- SECTION 2: The Guide (SB7 Position: Guide — Empathy + Authority) ---
      {
        heading: 'Skip the Office Supply Store Run',
        body: `
                    <div class="text-center py-8">
                        <p class="text-[var(--color-text-primary)] leading-relaxed max-w-3xl mx-auto mb-8">
                            We get it — printers fail at the worst possible moment. That meeting, that client presentation,
                            that flyer for Saturday's event — it can't wait. And the office supply store wants $60 for a
                            cartridge that might not even work.
                        </p>
                        <p class="text-[var(--color-text-primary)] leading-relaxed max-w-3xl mx-auto">
                            Mailbox Plus is your local backup. Email us your file, walk in, and pick up your prints —
                            professional quality, color or B&W, while you wait. No markup. No line. No printer required.
                        </p>
                        <div class="flex flex-wrap justify-center gap-8 mt-8">
                            <div class="flex items-center gap-2">
                                <span class="text-green-600 font-bold">✓</span>
                                <span class="text-[var(--color-text-primary)]"><strong>Same-Day Turnaround</strong> — most jobs done while you wait</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-green-600 font-bold">✓</span>
                                <span class="text-[var(--color-text-primary)]"><strong>No Markup</strong> — fair pricing, no retail premiums</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-green-600 font-bold">✓</span>
                                <span class="text-[var(--color-text-primary)]"><strong>Professional Quality</strong> — sharp, vibrant results every time</span>
                            </div>
                        </div>
                    </div>
                `,
        isFullWidth: true,
      },
      // --- SECTION 3: Stakes (SB7 Position: Stakes — Loss Aversion) ---
      {
        heading: 'Every DIY Print Job Costs You More Than You Think',
        body: `
                    <div class="rounded-3xl p-8 text-center max-w-4xl mx-auto">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div class="text-3xl mb-3">⏱️</div>
                                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Time</h4>
                                <p class="text-[var(--color-text-secondary)]">15 minutes to the store + 20-minute wait + 15 minutes back = <strong>nearly an hour</strong> for a two-minute print job.</p>
                            </div>
                            <div>
                                <div class="text-3xl mb-3">💰</div>
                                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Money</h4>
                                <p class="text-[var(--color-text-secondary)]">That ink cartridge costs <strong>$60+</strong> at retail. And it'll run out again. We print per page — you only pay for what you need.</p>
                            </div>
                            <div>
                                <div class="text-3xl mb-3">😤</div>
                                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Frustration</h4>
                                <p class="text-[var(--color-text-secondary)]">Printer jams. Driver errors. "Low on ink" warnings on page 2. <strong>Your printer shouldn't be why you walk in empty-handed.</strong></p>
                            </div>
                        </div>
                    </div>
                `,
        isFullWidth: true,
      },
      // --- SECTION 4: Success (SB7 Position: Success — Aspirational Identity) ---
      {
        heading: 'You Showed Up Prepared — No Printer Required',
        body: `
                    <div class="max-w-3xl mx-auto text-center py-6">
                        <p class="text-[var(--color-text-primary)] leading-relaxed mb-8">
                            Professional materials. Zero printer headaches. You walked in with a file and walked out
                            with everything you needed — crisp, professional, ready to go.
                        </p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div class="p-6 rounded-2xl bg-white shadow-sm border border-[var(--color-border)]">
                                <p class="text-sm text-[var(--color-text-muted)] mb-1">BEFORE</p>
                                <p class="text-[var(--color-text-primary)]">Stressed professional fighting a broken printer minutes before a deadline</p>
                            </div>
                            <div class="p-6 rounded-2xl bg-white shadow-sm border border-[var(--color-border)]">
                                <p class="text-sm text-[var(--color-primary)] font-bold mb-1">AFTER</p>
                                <p class="text-[var(--color-text-primary)]">Calm, prepared, with professional materials in hand — no printer required</p>
                            </div>
                        </div>
                    </div>
                `,
        isFullWidth: true,
      },
      // --- SECTION 5: Cross-Sell Bridge (SB7 Position: CTA — Transitional) ---
      {
        heading: 'Printing for Your Business?',
        body: `
                    <div class="text-center py-8">
                        <p class="text-[var(--color-text-primary)] leading-relaxed max-w-3xl mx-auto">
                            If you're printing for your business, keep your work mail separate from your home address
                            with a <a href="/mailbox-rental" class="text-[var(--color-primary)] font-semibold hover:underline">Mailbox Plus mailbox</a>.
                            Same-day printing, plus a real street address — your business looks professional, your home stays private.
                        </p>
                        <p class="text-[var(--color-text-secondary)] text-sm mt-4">
                            Also offering <a href="/staples-printing-alternative-concord-township" class="text-[var(--color-primary)] hover:underline">Staples printing alternative</a> and
                            <a href="/office-depot-alternative-concord-township" class="text-[var(--color-primary)] hover:underline">Office Depot alternative</a> services in Concord Township.
                        </p>
                    </div>
                `,
        isFullWidth: true,
      },
    ],
    features: [
      {
        icon: Printer,
        title: 'While-You-Wait Printing',
        description: 'Email your file, we print it. Most jobs done same-day.',
      },
      {
        icon: FileText,
        title: 'Color & B&W',
        description: 'Full-color or black-and-white. We handle all document types.',
      },
      {
        icon: Star,
        title: 'No Printer Required',
        description: 'Skip the $60 ink cartridge. Pay per page, not per problem.',
      },
    ],
    faqs: generalCopyPrintFaqs,
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
];
