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
      'Expert Pack & Ship services in Concord Township, Ohio. We ship via FedEx, UPS, USPS, and DHL. Custom packing, estate shipping, and freight services available.',
    keywords: 'shipping, packing, FedEx, UPS, USPS, DHL, Concord Township, Lake County',
    heroTitle: 'Pack & Ship Services',
    heroSubtitle: 'Professional shipping solutions with FedEx, UPS, USPS, DHL and more.',
    heroImage: getServiceImageUrl('/images/pack-ship.webp'),
    content: [
      {
        heading: 'Our Pack & Ship Services',
        body: `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
                            <div class="text-3xl mb-4">🏛️</div>
                            <h3 class="text-xl font-bold mb-2">Carrier Services</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">UPS, FedEx, USPS, and DHL shipping all in one place.</p>
                            <a href="/pack-ship/ups-authorized-shipper-outlet" class="text-[var(--color-primary)] font-semibold hover:underline">Compare Carriers →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
                            <div class="text-3xl mb-4">🎨</div>
                            <h3 class="text-xl font-bold mb-2">Specialty Shipping</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">Custom shipping for artwork, bicycles, and golf clubs.</p>
                            <a href="/pack-ship/artwork-shipping" class="text-[var(--color-primary)] font-semibold hover:underline">See Specialty →</a>
                        </div>
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
                            <div class="text-3xl mb-4">📦</div>
                            <h3 class="text-xl font-bold mb-2">Packing Services</h3>
                            <p class="text-[var(--color-text-secondary)] mb-4">Professional packing for fragile or heavy items.</p>
                            <a href="/pack-ship/packing-services" class="text-[var(--color-primary)] font-semibold hover:underline">Meet the Pros →</a>
                        </div>
                    </div>
                `,
        isFullWidth: true,
      },
      {
        heading: 'Your Local Concord Township Shipping Center',
        body: `
                    <div class="text-center py-8">
                        <p class="text-[var(--color-text-primary)] leading-relaxed max-w-3xl mx-auto">
                            As your complete <a href="/ups-fedex-usps-dhl-shipping-concord-township" class="text-[var(--color-primary)] hover:underline">shipping center in Concord Township</a>, 
                            we offer <a href="/shipping-center-concord-township" class="text-[var(--color-primary)] hover:underline">multi-carrier shipping services</a> including 
                            <a href="/pack-ship/ups-authorized-shipper-outlet" class="text-[var(--color-primary)] hover:underline">UPS</a>, 
                            <a href="/pack-ship/fedex-shipping" class="text-[var(--color-primary)] hover:underline">FedEx</a>, and 
                            <a href="/pack-ship/usps-services" class="text-[var(--color-primary)] hover:underline">USPS</a> to help you find the best rate and delivery time.
                        </p>
                    </div>
                `,
        isFullWidth: true,
      },
    ],
    features: [
      {
        icon: Package,
        title: 'All Major Carriers',
        description: 'Ship with FedEx, UPS, USPS, or DHL from one convenient location.',
      },
      {
        icon: Shield,
        title: 'Expert Packing',
        description: 'Our trained staff use professional materials to ensure safe delivery.',
      },
      {
        icon: Truck,
        title: 'Fast & Reliable',
        description: 'Multiple speed options from overnight to economy ground service.',
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
      'Professional Copy & Print services in Concord Township — without the big box runaround. Business cards, flyers, document printing, and design. Real people, fast turnaround, no self-serve kiosks.',
    keywords:
      'copy, print, business cards, flyers, banners, Concord Township, Lake County, Staples alternative',
    heroTitle: 'Copy & Print Without the Big Box Runaround',
    heroSubtitle:
      'Get professional printing done right — business cards, flyers, document printing, posters, and more. Real people who know paper. No self-serve kiosks.',
    heroImage: getServiceImageUrl('/images/document-printing.webp'),
    featuresTitle: 'Why Choose Mailbox Plus for Printing?',
    featuresSubtitle: 'Because your project deserves more than a machine with a jammed paper tray.',
    hideCarrierLogos: true,
    content: [
      // ── Position 2: The Villain ──
      {
        heading: 'The Big Box Printing Trap — Where Your Time Goes to Die',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You walk into the office supply store. The self-serve kiosk is flashing an error you've never seen. A teenager shrugs and says "that one's down." The next machine has a 45-minute wait. Nobody can help you pick the right paper weight. Nobody checks your color alignment.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Big Box Printing Trap</strong> — a system designed to push you through a broken machine and hope for the best. Need 50 business cards in a hurry? Stand in line. Want someone to double-check your margins? Good luck finding someone who cares.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You're not just paying for paper. You're paying with your time, your patience, and the quality of your finished product.
            </p>`,
      },
      // ── Position 3: The Guide ──
      {
        heading: "We Print so You Don't Have To",
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, <strong>we do the printing for you</strong>. No kiosks. No guessing. No "figure it out yourself."
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Walk in with your digital file. Tell us what you need — business cards, flyers, documents, posters, copies, <a href="/copy-print/postcard-printing" class="text-[var(--color-primary)] hover:underline">postcards</a>, or <a href="/copy-print/flyers-brochures" class="text-[var(--color-primary)] hover:underline">brochures</a>. Our team checks your file, recommends the right paper, and handles the production from start to finish.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              We're your <strong><a href="/staples-printing-alternative-concord-township" class="text-[var(--color-primary)] hover:underline">local alternative to Staples and Office Depot</a></strong> — a real printing partner who actually wants to help you look good.
            </p>`,
      },
      // ── Position 4: The Plan ──
      {
        heading: 'Three Steps to Professional Results',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Tell Us What You Need</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Walk in with your file, email it to us, or use our design services to create something from scratch.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Review & Print</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Our team checks your file, confirms specs, and produces it on professional-grade equipment.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Pick Up or Add Finishing</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Grab your finished prints, or add stapling, binding, folding, and trimming — all in-house.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Services Grid ──
      {
        heading: 'Everything You Need — All Under One Roof',
        body: `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
              <a href="/copy-print/document-printing" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-3">📄</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Document Printing</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Color & B&W — reports, presentations, manuals, resumes.</p>
              </a>
              <a href="/copy-print/business-cards" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-3">🪪</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Business Cards</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Matte, glossy, premium stocks — custom or your design.</p>
              </a>
              <a href="/copy-print/flyers-brochures" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-3">📣</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Flyers & Brochures</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Full-color marketing materials for events and promotions.</p>
              </a>
              <a href="/copy-print/posters-printing" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-3">🖼️</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Posters</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Large-format posters, signs, and displays — custom sizes.</p>
              </a>
              <a href="/copy-print/postcard-printing" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-3">💌</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Postcard Printing</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Direct mail, EDDM, invitations — with mailing support.</p>
              </a>
              <a href="/copy-print/copies" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-3">📋</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Copies</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">B&W and color copies with volume discounts available.</p>
              </a>
              <a href="/copy-print/graphic-design" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-3">🎨</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Graphic Design</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Custom designs for cards, flyers, branding, and more.</p>
              </a>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 6: The Stakes ──
      {
        heading: 'What You Lose by Going to the Big Box',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Every time you settle for the big box store, you're trading your time, your quality, and your peace of mind for a slightly lower per-page price that nobody ever actually calculates.
            </p>
            <div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Lost Time</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">45-minute waits, machine jams, "come back later" — time you'll never get back. We print while you shop or wait. Most jobs done same-day.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Lost Quality</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Nobody checks your print at the self-serve kiosk. We review every file — margins, resolution, color — before it hits paper.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Lost Expertise</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">"Which paper should I use?" "Will this look good in color?" We answer those questions. The kiosk just beeps at you.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Lost Convenience</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Run your printing errand alongside <a href="/pack-ship" class="text-[var(--color-primary)] hover:underline">shipping</a>, <a href="/home-business/notary-services" class="text-[var(--color-primary)] hover:underline">notary</a>, <a href="/home-business/shredding" class="text-[var(--color-primary)] hover:underline">shredding</a> — one stop, multiple tasks done.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 7: The Success ──
      {
        heading: 'Walk In With a Need. Walk Out With Results.',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              That's how printing should feel. Hand your file to someone who knows what they're doing, confirm a few details, and walk out with professional-quality prints that make you look good.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Our customers tell us they wish they'd found us sooner — because once you've experienced <strong>real people who care about your print job</strong>, you never want to go back to the kiosk.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              And while you're here, ask us about <strong><a href="/copy-print/graphic-design" class="text-[var(--color-primary)] hover:underline">graphic design services</a></strong> — we can help you create the perfect layout before we even touch the printer.
            </p>`,
      },
    ],
    features: [
      {
        icon: Printer,
        title: 'We Do the Printing',
        description: 'Drop off your file, we handle the rest — no self-serve, no guessing.',
      },
      {
        icon: FileText,
        title: 'All Document Types',
        description: 'Business cards, flyers, posters, documents — one-stop print shop.',
      },
      {
        icon: Palette,
        title: 'Design Help Available',
        description: 'Graphic design services for layouts, branding, and custom projects.',
      },
      {
        icon: Star,
        title: 'Quick Turnaround',
        description: "Same-day service on most jobs. Urgent? Ask us — we'll make it work.",
      },
    ],
    faqs: generalCopyPrintFaqs,
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
];
