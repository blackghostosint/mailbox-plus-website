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
      'Compare UPS, FedEx, USPS, and DHL side-by-side. Custom packing for fragile items. Returns and receiving \u2014 all at one counter in Concord Township.',
    heroImage: getServiceImageUrl('/images/pack-ship.webp'),
    featuresTitle: 'Why One Counter Beats Three Stores',
    featuresSubtitle:
      'Franchises sell one carrier. We sell all four. You compare, you pick, you save.',
    hideCarrierLogos: true,
    content: [
      // ── Position 2: The Villain ──
      {
        heading: 'The Three-Store Errand \u2014 Why Shipping Shouldn\u2019t Take All Afternoon',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You need to ship a package. You want to compare rates between carriers because that's what any smart business owner would do. But UPS only sells UPS. FedEx only sells FedEx. The post office has a 20-minute wait, and none of them are in the same strip mall.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Three-Store Errand.</strong> To compare rates, you drive to The UPS Store, then to FedEx Office, then to the post office \u2014 burning your lunch break and still guessing whether you got the best deal.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Meanwhile, your package isn't packed right for the trip. And if something breaks, you're the one eating the cost.
            </p>`,
      },
      // ── Position 3: The Guide ──
      {
        heading: 'All 4 Carriers at One Counter \u2014 Compare Before You Ship',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, <strong>we put UPS, FedEx, USPS, and DHL at the same counter</strong>. Bring your package in. We weigh it, show you rates for every carrier side-by-side, and let <em>you</em> pick the cheapest or fastest.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              We're your neighborhood <strong>authorized FedEx ShipCenter, UPS Authorized Shipper, USPS provider, and DHL Service Point</strong> \u2014 all at the same address. No franchise pushing one carrier. No upselling. Just honest rate comparisons and professional packing from trained staff.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>We help you compare. We don't upsell you to one carrier. We just help you pick the right one.</strong>
            </p>`,
      },
      // ── Plan / Services Grid ──
      {
        heading: 'Every Shipping Service You Need \u2014 Under One Roof',
        body: `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
              <a href="/pack-ship/ups-authorized-shipper-outlet" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-4">🚚</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Compare Carrier Rates</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">UPS, FedEx, USPS, DHL at one counter. Pick the cheapest or fastest \u2014 you decide.</p>
              </a>
              <a href="/pack-ship/artwork-shipping" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-4">🎨</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Fragile &amp; Specialty Shipping</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Artwork, bikes, golf clubs \u2014 custom crates that survive the sorting machines.</p>
              </a>
              <a href="/pack-ship/packing-services" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-4">📦</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Professional Packing</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">We pack it so carrier sorting machines can't break it. Ship with confidence.</p>
              </a>
              <a href="/pack-ship/package-drop-offs" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-4">📬</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Package Drop-Offs</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Free drop-offs for all 4 carriers. Bring any pre-labeled package \u2014 one stop.</p>
              </a>
              <a href="/pack-ship/package-receiving" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-4">🛡️</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Package Receiving</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">We sign. We store. You pick up. No porch needed. From $10/package.</p>
              </a>
              <a href="/amazon-returns" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-4">↩️</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Amazon Returns</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">From your cart to our counter. Label printing, packing, and drop-off.</p>
              </a>
              <a href="/pack-ship/packaging-supplies" class="block p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="text-3xl mb-4">📎</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Packaging Supplies</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Boxes, tape, bubble wrap \u2014 grab what you need right where you ship.</p>
              </a>
            </div>`,
        isFullWidth: true,
      },
      // ── Competitive Comparison ──
      {
        heading: 'Why One Counter Beats Three Stores',
        body: `<div class="max-w-4xl mx-auto space-y-10 py-4">
              <div class="grid md:grid-cols-3 gap-6">
                <div class="text-center p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                  <div class="text-4xl mb-4">🏪</div>
                  <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-2">Franchises Sell One</h3>
                  <p class="text-[var(--color-text-secondary)] text-sm leading-relaxed">UPS Store sells UPS. FedEx Office sells FedEx. You drive to multiple stores to compare. We put all 4 at one counter so you pick the best \u2014 not the only.</p>
                </div>
                <div class="text-center p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                  <div class="text-4xl mb-4">⏰</div>
                  <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-2">Post Offices Have Lines</h3>
                  <p class="text-[var(--color-text-secondary)] text-sm leading-relaxed">Your lunch break isn't for waiting in line. We handle the same USPS services \u2014 plus UPS, FedEx, and DHL \u2014 without the wait.</p>
                </div>
                <div class="text-center p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                  <div class="text-4xl mb-4">🎲</div>
                  <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-2">DIY Packing Is a Gamble</h3>
                  <p class="text-[var(--color-text-secondary)] text-sm leading-relaxed">One sorting-belt drop and your item is gone. Our professional packers use carrier-compliant materials that absorb the abuse \u2014 so your stuff arrives.</p>
                </div>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 6: The Stakes ──
      {
        heading: 'What It Costs You to Drive Store-to-Store',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Wasted Time</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Driving between three stores to compare rates takes 45+ minutes. We do side-by-side comparisons at one counter in under 5.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-secondary)] mb-2">Overpaying by Default</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Franchises can't show you competitor rates. We do. You might find FedEx is cheaper than UPS today \u2014 but you'd never know at The UPS Store.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Damage From Bad Packing</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">DIY packing fails in transit. Our trained packers use carrier-compliant materials \u2014 your item arrives in one piece.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Porch Pirate Risk</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Having packages delivered to your home? We receive, sign for, and store packages from all carriers. No porch required. <a href="/mailbox-rentals" class="text-[var(--color-primary)] hover:underline">From $35/month</a>.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 7: The Success ──
      {
        heading: 'One Stop. Compare. Pick the Best. Ship.',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              That's the Mailbox Plus difference. Walk in with your package. We weigh it, show you rates from all 4 carriers, pack it if needed, and send it on its way \u2014 all from one counter.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              No more driving store-to-store. No more guessing whether you got the best rate. No more worrying about whether your package will survive the trip.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Stop by Mailbox Plus for your next shipment.</strong> Bring your package. We'll compare carriers, pack it right, and get it out the door \u2014 so you can get back to your day.
            </p>`,
      },
    ],
    features: [
      {
        icon: Package,
        title: '4 Carriers, 1 Counter',
        description:
          'Compare UPS, FedEx, USPS, and DHL side-by-side \u2014 pick the cheapest or the fastest.',
      },
      {
        icon: Shield,
        title: 'Professional Packing',
        description:
          'Custom crating for fragile items that survives sorting-machine abuse. We pack so carriers can\u2019t break it.',
      },
      {
        icon: Truck,
        title: 'Package Receiving',
        description:
          'We sign for and store packages from all carriers \u2014 from $10/package or $35/month unlimited.',
      },
    ],
    faqs: packShipFaqs,
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
    cta: {
      title: 'One Counter. All 4 Carriers.',
      subtitle:
        'Compare UPS, FedEx, USPS, DHL side-by-side. Custom packing and free drop-offs. From $35/month for a private mailbox.',
      buttonText: 'Get Started Shipping \u2192',
      buttonLink: '/contact-us',
      variant: 'brand',
      align: 'center',
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
    cta: {
      title: 'Need Something Printed?',
      subtitle:
        "Business cards, flyers, posters, copies \u2014 we print so you don't have to. From $35/month for a private mailbox.",
      buttonText: 'Start Your Print Job \u2192',
      buttonLink: '/contact-us',
      variant: 'brand',
      align: 'center',
    },
  },
];
