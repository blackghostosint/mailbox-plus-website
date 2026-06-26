import Users from '~icons/lucide/users';
import Palette from '~icons/lucide/palette';
import Star from '~icons/lucide/star';
import Printer from '~icons/lucide/printer';
import Layers from '~icons/lucide/layers';
import FileText from '~icons/lucide/file-text';
import Truck from '~icons/lucide/truck';
import Clock from '~icons/lucide/clock';
import { Service } from '../../types/services';
import { getServiceImageUrl } from '../../lib/storage';
import {
  generalCopyPrintFaqs,
  graphicDesignFaqs,
  businessCardsFaqs,
  flyersBrochuresFaqs,
  documentPrintingFaqs,
  postersPrintingFaqs,
  postcardPrintingFaqs,
  copiesFaqs,
} from '../faqs';

export const copyPrintServices: Service[] = [
  // ---------------------------
  // COPY & PRINT
  // ---------------------------
  {
    id: 'graphic-design',
    category: 'copy-print',
    city: 'Concord Township',
    serviceName: 'Graphic Design',
    slug: '/copy-print/graphic-design',
    pageTitle: 'Graphic Design in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Professional graphic design in Concord Township — business cards, flyers, brochures, logos, and branding. Custom designs that make your business look established. Print-ready files included.',
    keywords:
      'graphic design, marketing design, Concord Township, Lake County, branding, logo design',
    heroTitle: 'Professional Design That Makes You Look Established',
    heroSubtitle:
      "Don't let amateur design make your business look small. Custom graphics from real designers — logos, cards, flyers, and full brand kits.",
    heroImage: getServiceImageUrl('/images/graphic-design.webp'),
    hideCarrierLogos: true,
    content: [
      // ── Position 2: The Villain ──
      {
        heading: 'The DIY Design Disaster — Why Templates Make You Look Like Everyone Else',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You need a logo, a flyer, or some marketing materials. You fire up an online design tool with a free account. Two hours later, you've wrestled with margins, picked a template that sort of works, and exported something that looks... fine. Not great. Just fine.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the DIY Design Disaster.</strong> Templates are generic. Font choices are limited. Your business ends up looking like every other business that used the same template. And when you try to print it? The resolution is wrong, the colors don't match, and the text is cut off at the edge.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You spent hours creating something that makes your business look amateur — and now you have to pay to reprint it.
            </p>`,
      },
      // ── Position 3: The Guide ──
      {
        heading: 'Real Designers. Real Results. Print-Ready from Day One.',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, <strong>our graphic design team creates professional layouts</strong> for business cards, flyers, brochures, logos, banners, and more. We use industry-standard design tools — not templates — to create custom visuals that reflect your brand.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Bring us your ideas, your logo, or just a concept. We'll work with you to create something that looks professional and prints perfectly. Our designers understand <strong>print specifications, color profiles, and file formats</strong> — so your final design is production-ready from the start.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              And when the design is done? <strong>We can print it too.</strong> Right here, on our professional-grade equipment. One stop from concept to finished product.
            </p>`,
      },
      // ── Position 4: The Plan ──
      {
        heading: 'From Concept to Print — A Simple Process',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Share Your Vision</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Tell us about your business, your brand, and what you need. Bring samples, logos, or just describe your style — we take it from there.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Design & You Approve</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Our designers create concepts, you review proofs, and we refine until it's exactly right — all before anything goes to print.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Print or Digital — Your Choice</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Get print-ready files for your own use, or let us handle the printing — business cards, flyers, banners, and more.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── What We Design Grid ──
      {
        heading: 'What We Design for Local Businesses',
        body: `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">🪪</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Business Cards</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Custom-designed cards on premium stock — make a lasting first impression.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📣</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Flyers & Brochures</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Marketing materials that deliver your message with clarity and impact.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">🎯</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Logos & Branding</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Custom logos and brand identity packages that set you apart.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">🖼️</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Posters & Banners</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Large-format designs for events, promotions, and storefront displays.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📧</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Postcards & Mailers</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Direct mail designs that get noticed — EDDM-ready and print-ready.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">🎨</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Full Brand Kits</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Consistent branding across all your materials — cards, flyers, social graphics, and more.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 6: The Stakes ──
      {
        heading: 'What DIY Design Costs You',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Amateur Design Hurts Credibility</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Customers judge your business by your materials. A poorly designed flyer or cheap-looking business card signals that you don't pay attention to details.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Wasted Time, Wasted Money</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Hours spent wrestling with templates — then the print comes back wrong. Professional design gets it right the first time.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Templates Make You Invisible</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Generic templates mean you look like every other business. Custom design helps you stand out and get remembered.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Design + Print = One Stop</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We design and print in-house. No back-and-forth with online printers. No \u201cyour file isn't print-ready\u201d emails.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 7: The Success ──
      {
        heading: 'Look Professional. Get Noticed. Grow Your Business.',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You have a vision for your business. Let us help you communicate it visually. From a single business card design to a full brand identity, our team delivers professional results that make you look established — even if you're just starting out.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Our customers tell us: "I wish I'd done this sooner." Once you experience working with a real designer who understands print and branding, you'll never go back to templates.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Stop by Mailbox Plus and bring your ideas.</strong> Let's create something that makes your business look as good as it is.
            </p>`,
      },
    ],
    features: [
      {
        icon: Palette,
        title: 'Custom Designs',
        description:
          'Every project is unique — no templates, no shortcuts, just professional work.',
      },
      {
        icon: Users,
        title: 'Collaborative Process',
        description: 'You review proofs, we refine. Your vision, our expertise.',
      },
      {
        icon: Star,
        title: 'Print-Ready Results',
        description: 'Designed for print from day one. We can print it too — one stop.',
      },
    ],
    faqs: [...generalCopyPrintFaqs, ...graphicDesignFaqs],
  },
  {
    id: 'business-cards',
    category: 'copy-print',
    city: 'Concord Township',
    serviceName: 'Business Cards',
    slug: '/copy-print/business-cards',
    pageTitle: 'Business Cards in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Custom business card printing in Concord Township. Premium cardstocks, matte or glossy finishes, and design help included. Order 100 or 10,000 — fast local turnaround.',
    keywords: 'business cards, printing, Concord Township, Lake County, premium business cards',
    heroTitle: 'Business Cards That Start Conversations',
    heroSubtitle:
      'Forget the flimsy, generic cards that end up in the trash. Custom-designed, premium-stock business cards that people actually keep.',
    heroImage: getServiceImageUrl('/images/business-cards.webp'),
    hideCarrierLogos: true,
    content: [
      // ── Position 2: The Villain ──
      {
        heading: 'The Flimsy Card Trap — Why Most Business Cards End Up in the Trash',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You get a new business card. It's thin. It's flimsy. The ink is already smudging before you hand it over. The person on the receiving end takes it politely, glances at it for half a second, and slides it into a drawer you know they'll never open again.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Flimsy Card Trap.</strong> Cheap online printers, generic templates, and paper-thin cardstock that screams "I went with the cheapest option." Your business card is often the first physical impression someone has of you — and if it feels cheap, so does your brand.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              The worst part? You paid for a rush shipment and still waited a week. They arrived bent in the mailbox.
            </p>`,
      },
      // ── Position 3: The Guide ──
      {
        heading: 'Cards That Feel as Good as They Look',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, we believe your business card should feel substantial in hand. That's why we offer <strong>premium cardstocks, multiple finishes, and custom design services</strong> — all handled locally, not shipped from a warehouse.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Walk in with your logo and a rough idea, or let our <strong><a href="/copy-print/graphic-design" class="text-[var(--color-primary)] hover:underline">graphic design team</a></strong> create something from scratch. We'll help you choose the right stock, finish, and layout for your industry.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              No waiting for shipping. No surprise quality issues. Just cards you're proud to hand out — ready when you need them.
            </p>`,
      },
      // ── Position 4: The Plan ──
      {
        heading: 'Custom Business Cards in Three Steps',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Bring Your Vision</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Upload your design, bring a concept, or let us design it from scratch. We'll help you pick the right layout.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Choose Your Finish</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Matte, glossy, or premium cardstock. Full-color or spot finish. Rounded corners or standard. We walk you through the options.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Pick Up — No Shipping</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Most orders ready in days, not weeks. Pick up in store — no bent corners, no missed deliveries.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Options Grid ──
      {
        heading: 'Choose Your Card \u2014 We\u2019ll Help You Decide',
        body: `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">✨</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Matte Finish</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Elegant, non-glare surface. Perfect for professional services, law, finance, and real estate.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">🌟</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Glossy Finish</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Vibrant, high-shine colors. Great for creative fields, photography, retail, and design.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">💎</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Premium Cardstock</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Thick, substantial feel with a velvet-touch or linen texture. Cards people comment on.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">🎨</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Custom Design</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Don't have a design? Our graphic design team creates professional layouts from scratch.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">🔲</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Rounded Corners</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">A subtle premium touch that makes your card stand out from the standard square edge.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📦</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Bulk Orders</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">100 to 10,000+ cards. Volume pricing available for businesses with multiple team members.</p>
              </div>
            </div>
            <p class="text-center text-[var(--color-text-secondary)] text-sm mt-4">
              Not sure which finish is right for you? <strong>Bring us your logo and we'll walk you through the options.</strong> No pressure, no upselling — just honest advice.
            </p>`,
        isFullWidth: true,
      },
      // ── Position 6: The Stakes ──
      {
        heading: 'A First Impression Is a One-Time Opportunity',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Flimsy Cards Say "Cheap"</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Paper-thin cards from online printers tell potential clients you cut corners. Premium cardstock tells them you care about quality.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Generic Designs Get Forgotten</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">A template everyone uses won't make you memorable. Custom design ensures your card stands out — and gets saved.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Shipping Delays Miss Deadlines</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">That networking event is next week. Online printers take 7-10 days. We work locally — most orders ready in days.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">More Than Just Cards</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Need matching <a href="/copy-print/flyers-brochures" class="text-[var(--color-primary)] hover:underline">brochures</a> or <a href="/copy-print/postcard-printing" class="text-[var(--color-primary)] hover:underline">postcards</a>? We can design and print your full brand kit — all in one place.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 7: The Success ──
      {
        heading: 'Cards You\u2019ll Actually Want to Hand Out',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Imagine handing someone your business card and watching them pause — because it feels substantial, looks polished, and makes them actually want to keep it.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              That's what happens when you invest in quality. Your card becomes a conversation starter instead of a receipt they throw away.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Come see us at Mailbox Plus.</strong> Bring your logo or just an idea. We'll show you samples, help you choose, and have your cards ready before your next networking event.
            </p>`,
      },
    ],
    features: [
      {
        icon: Users,
        title: 'Custom Design',
        description: 'Upload your design or let our team create something custom.',
      },
      {
        icon: Palette,
        title: 'Premium Finishes',
        description: 'Matte, glossy, premium cardstock, and specialty textures.',
      },
      {
        icon: Star,
        title: 'Local Turnaround',
        description: 'No shipping delays. Most orders ready in days, not weeks.',
      },
    ],
    faqs: [...generalCopyPrintFaqs, ...businessCardsFaqs],
  },
  {
    id: 'flyers-brochures',
    category: 'copy-print',
    city: 'Concord Township',
    serviceName: 'Flyers & Brochures',
    slug: '/copy-print/flyers-brochures',
    pageTitle: 'Flyers & Brochures in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Print eye-catching flyers and brochures in Concord Township. Full-color marketing materials to promote your business or event. Fast local production.',
    keywords: 'flyers, brochures, printing, concord township',
    heroTitle: 'Flyer & Brochure Printing',
    heroSubtitle: 'High-quality printed materials for marketing, events, and promotions.',
    heroImage: getServiceImageUrl('/images/flyers_brochures.webp'),
    content: [
      {
        heading: 'Promote Your Business',
        body: 'Flyers and brochures remain one of the most cost-effective ways to share your message with the community.',
      },
      {
        heading: 'Professional Quality',
        body: 'Our print partners provide full-color, double-sided printing on premium paper stocks.',
      },
      {
        heading: 'High-Impact Marketing',
        body: 'Promote your business or event with <strong><a href="/copy-print/postcard-printing" class="text-[var(--color-primary)] hover:underline">professional flyer and brochure printing</a></strong> from Mailbox Plus. We help organizations across Lake County design and print eye-catching materials that deliver your message effectively.',
      },
      {
        heading: 'Custom Stocks & Sizes',
        body: 'We offer a variety of <strong>sizes, paper weights, and finishes</strong>—including tri-fold and glossy layouts. From small business promotions to community events, we ensure every print looks sharp and ready to impress.',
      },
      {
        heading: 'Polished Professionalism',
        body: 'Our team can assist with <strong>layout creation and brand consistency</strong> to ensure your materials look professional. We print in all quantities with fast turnaround times and affordable pricing to get your message noticed.',
      },
    ],
    features: [
      {
        icon: Printer,
        title: 'High-Resolution Printing',
        description: 'Sharp, full-color graphics every time.',
      },
      {
        icon: Palette,
        title: 'Custom Designs',
        description: 'Flexible templates or upload your own design.',
      },
      {
        icon: Layers,
        title: 'Variety of Finishes',
        description: 'Glossy, matte, and specialty options.',
      },
    ],
    faqs: [...generalCopyPrintFaqs, ...flyersBrochuresFaqs],
  },
  {
    id: 'document-printing',
    category: 'copy-print',
    city: 'Concord Township',
    serviceName: 'Document Printing',
    slug: '/copy-print/document-printing',
    pageTitle: 'Document Printing in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Document printing in Concord Township — without the kiosk nightmare. Color and B&W printing for reports, presentations, and manuals. We print, you pick up. Same-day service.',
    keywords:
      'document printing, business printing, Concord Township, Lake County, Staples alternative',
    heroTitle: 'Document Printing Without the Kiosk Nightmare',
    heroSubtitle:
      'Your document is ready. The printer should be the easy part. Drop off your file, we handle the rest — color or B&W, stapled, bound, ready to go.',
    heroImage: getServiceImageUrl('/images/document-printing.webp'),
    hideCarrierLogos: true,
    content: [
      // ── Position 2: The Villain ──
      {
        heading: 'The 4:45 PM Printing Panic — When the Machine Beats You',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              It's 4:45 PM. Your report is due tomorrow morning. You walk into the big box store, USB drive in hand. The self-serve kiosk is flashing "Paper Jam — Call for Assistance." The next machine says "Toner Low." The third one has a 30-minute queue.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Printing Panic.</strong> You're not just printing pages — you're racing against closing time, broken machines, and the sinking feeling that nobody in the store actually cares whether your document comes out right.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You just need crisp, professional prints. But the machine is making you its problem instead of the solution.
            </p>`,
      },
      // ── Position 3: The Guide ──
      {
        heading: "We Print. You Don't Have To.",
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, <strong>we do the document printing for you</strong>. Hand us your file — on a USB drive, by email, or from the cloud. Tell us color or B&W, one-sided or double-sided, stapled or bound.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Our team checks your file for alignment, margins, and page count before we print. If something looks off, we'll flag it. If you're not sure which paper to use, we'll recommend it. <strong>We print so you can get back to what matters.</strong>
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Think of us as your <strong><a href="/staples-printing-alternative-concord-township" class="text-[var(--color-primary)] hover:underline">personal print department</a></strong> — without the overhead of hiring one.
            </p>`,
      },
      // ── Position 4: The Plan ──
      {
        heading: 'Three Steps to Printed Perfection',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Send or Bring Your File</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Email it, bring a USB drive, or access cloud storage. We accept PDF, Word, Excel, and more.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Review & Print</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Our team checks your file, confirms color/B&W, single/double-sided, and finishes the job on professional-grade printers.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Pick Up, Stapled & Ready</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Most jobs done same-day. Add stapling, binding, hole-punch, or folding — all in-house.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── What We Print Grid ──
      {
        heading: 'What We Print — and What We Check',
        body: `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📊</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Presentations</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Deck slides, handouts, speaker notes — color or B&W, bound or stapled.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📑</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Reports & Proposals</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Business reports, grant proposals, financial docs — professional binding available.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📚</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Manuals & Handbooks</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Employee handbooks, training manuals, product guides — double-sided, tabbed, bound.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📄</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Resumes & Applications</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Crisp, professional résumés on premium paper — make the right impression.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📋</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Forms & Contracts</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Legal forms, contracts, applications — exact reproductions, no margin shifts.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📝</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Flyers & Newsletters</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Full-color newsletters, program guides, community announcements.</p>
              </div>
            </div>
            <p class="text-center text-[var(--color-text-secondary)] text-sm mt-4">
              Every file is <strong>reviewed before printing</strong> — we catch margin issues, low-resolution images, and formatting problems before they hit paper. 
              If you need <a href="/copy-print/copies" class="text-[var(--color-primary)] hover:underline">bulk copies</a> or <a href="/copy-print/flyers-brochures" class="text-[var(--color-primary)] hover:underline">marketing materials</a>, we do those too.
            </p>`,
        isFullWidth: true,
      },
      // ── Position 6: The Stakes ──
      {
        heading: 'What One Bad Print Job Costs You',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              A misaligned margin on a contract. A smudged résumé. A presentation where page 7 is missing because the stapler ran out. These aren't printing problems — they're credibility problems.
            </p>
            <div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Deadlines Don't Wait</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">The self-serve machine that jams at 4:58 PM doesn't care about your 9 AM meeting. We print during all business hours — most jobs done same-day.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Nobody Checks Your Work at the Kiosk</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">The big box machine prints whatever you send. If page 3 has a formatting error, you discover it when you're already in the parking lot. We review before we print.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Hidden Costs Add Up</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Printing at the kiosk seems cheap until you factor in the reprints, the rushed binding that falls apart, and the time you spent standing at a machine.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">More Than Just Printing</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">While you're here: <a href="/home-business/notary-services" class="text-[var(--color-primary)] hover:underline">notarize</a> that contract, <a href="/home-business/document-scanning" class="text-[var(--color-primary)] hover:underline">scan</a> the backup docs, or <a href="/home-business/shredding" class="text-[var(--color-primary)] hover:underline">shred</a> the old drafts — one stop.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 7: The Success ──
      {
        heading: 'From Deadline Panic to Done — in One Trip',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Walk in with your digital file. Walk out with finished, professional documents — stapled, bound, hole-punched, and ready to present.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              That's what document printing should feel like. No machine errors. No figuring out paper trays. No reprinting because the alignment was off.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>You focus on the content. We make it look good on paper.</strong> Whether it's one page or 500, we'll have you in and out and on to the next thing.
            </p>`,
      },
    ],
    features: [
      {
        icon: Printer,
        title: 'We Print for You',
        description: "Drop off, email, or cloud — we handle the machine so you don't have to.",
      },
      {
        icon: FileText,
        title: 'File Review Included',
        description: 'Our team checks alignment, margins, and resolution before printing.',
      },
      {
        icon: Star,
        title: 'Finishing Services',
        description: 'Stapling, binding, hole-punch, folding — all done in-house.',
      },
    ],
    faqs: [...generalCopyPrintFaqs, ...documentPrintingFaqs],
  },
  {
    id: 'posters-printing',
    category: 'copy-print',
    city: 'Concord Township',
    serviceName: 'Posters Printing',
    slug: '/copy-print/posters-printing',
    pageTitle: 'Posters Printing in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Large format poster printing in Concord Township. Vibrant, high-quality posters for events, signs, and displays. Custom sizes available.',
    keywords: 'poster printing, large format printing, Concord Township, Lake County',
    heroTitle: 'Poster Printing',
    heroSubtitle: 'Eye-catching posters for events, promotions, and presentations.',
    heroImage: getServiceImageUrl('/images/posters-printing.webp'),
    content: [
      {
        heading: 'Stand Out with Custom Posters',
        body: 'Our large-format poster printing services deliver vibrant, professional results for any occasion.',
      },
      {
        heading: 'Multiple Sizes Available',
        body: 'Choose from standard sizes or request custom dimensions to fit your specific needs.',
      },
      {
        heading: 'Bold Visual Impact',
        body: 'Make a statement with <strong><a href="/copy-print/document-printing" class="text-[var(--color-primary)] hover:underline">custom poster printing</a></strong> from Mailbox Plus. We specialize in high-resolution posters for businesses and schools throughout Lake County—perfect for promotions and special occasions.',
      },
      {
        heading: 'Premium Quality Prints',
        body: 'Our team uses <strong>professional-grade printers</strong> and photo-quality paper to ensure your posters look sharp and durable. Choose from glossy, matte, or laminated finishes in a variety of custom sizes.',
      },
    ],
    features: [
      {
        icon: Printer,
        title: 'Large Format',
        description: 'Print posters in various sizes up to 36 inches wide.',
      },
      {
        icon: Palette,
        title: 'Vibrant Colors',
        description: 'Full-color printing with rich, eye-catching graphics.',
      },
      {
        icon: Star,
        title: 'Quality Materials',
        description: 'Choose from glossy, matte, or premium paper stocks.',
      },
    ],
    faqs: [...generalCopyPrintFaqs, ...postersPrintingFaqs],
  },
  {
    id: 'postcard-printing',
    category: 'copy-print',
    city: 'Concord Township',
    serviceName: 'Postcard Printing',
    slug: '/copy-print/postcard-printing',
    pageTitle: 'Postcard Printing in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Custom postcard printing and mailing services in Concord Township. Perfect for direct mail marketing, EDDM, and invitations. High-quality local printing.',
    keywords: 'postcard printing, marketing postcards, Concord Township, Lake County',
    heroTitle: 'Postcard Printing',
    heroSubtitle: 'Affordable, high-quality postcard printing for any occasion.',
    heroImage: getServiceImageUrl('/images/postcard-printing.webp'),
    content: [
      {
        heading: 'Send Your Message',
        body: 'Postcards are a cost-effective way to reach customers and promote your brand.',
      },
      {
        heading: 'Design Options & Quality Printing',
        body: 'We work with top print suppliers to deliver postcards that reflect your brand. Choose from matte, glossy, and premium finishes.',
      },
      {
        heading: 'Custom Marketing Cards',
        body: 'Reach your audience with <strong>custom postcard printing</strong> from Mailbox Plus. We create high-quality, full-color postcards perfect for direct mail campaigns, event promotions, and special announcements.',
      },
      {
        heading: 'Professional Mailing Support',
        body: 'We offer a range of sizes and finishes, from glossy to heavyweight stocks. We also provide <strong>address printing and <a href="/home-business/every-door-direct-mail" class="text-[var(--color-primary)] hover:underline">EDDM preparation</a></strong> to make your postcard marketing effortless and effective.',
      },
    ],
    features: [
      {
        icon: Printer,
        title: 'Full-Color Printing',
        description: 'Bright, eye-catching postcards.',
      },
      {
        icon: Layers,
        title: 'Quality Paper',
        description: 'Choose from matte or glossy finishes.',
      },
      { icon: Star, title: 'Fast Turnaround', description: 'Get your postcards quickly.' },
    ],
    faqs: [...generalCopyPrintFaqs, ...postcardPrintingFaqs],
  },
  {
    id: 'copies',
    category: 'copy-print',
    city: 'Concord Township',
    serviceName: 'Copies',
    slug: '/copy-print/copies',
    pageTitle: 'Copies in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Copy services in Concord Township — quick, affordable B&W and color copies. No self-serve machine required. We copy, you pick up. Volume discounts available.',
    keywords: 'copy services, document copies, concord township, lake county, staples alternative',
    heroTitle: 'Copies Without the Machine Headache',
    heroSubtitle:
      'Need copies? We make them for you. B&W or color, one page or 500. No self-serve, no jams, no waiting.',
    heroImage: getServiceImageUrl('/images/copies.webp'),
    hideCarrierLogos: true,
    content: [
      // ── Position 2: The Villain ──
      {
        heading: 'The Copy Machine Curse \u2014 When \u201cMake a Copy\u201d Takes 20 Minutes',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You need copies. Simple, right? Then the self-serve machine flashes "Paper Jam \u2014 Call for Assistance." You call. Nobody comes. You try another machine. "Toner Low." The third one has a 15-minute queue of people who all look as frustrated as you feel.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Copy Machine Curse.</strong> What should be a 2-minute task turns into a 20-minute ordeal. And when you finally get your copies, the alignment is off, the pages are out of order, and you have to start over.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You just want fast, accurate copies. But the machine is making you do its job for it.
            </p>`,
      },
      // ── Position 3: The Guide ──
      {
        heading: 'We Copy So You Don\u2019t Have To',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, <strong>we make the copies for you</strong>. Hand us your originals, tell us B&W or color, and how many. We handle the machine. You pick up crisp, collated copies \u2014 stapled, sorted, and ready to go.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              One copy or 500. Single-sided or double-sided. Black-and-white or full color. <strong>Most jobs are done while you wait</strong>, and we review every page for quality before you leave.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              For larger runs, we offer <strong>volume discounts</strong>. And if you need <a href="/copy-print/document-printing" class="text-[var(--color-primary)] hover:underline">document printing</a> or <a href="/home-business/document-scanning" class="text-[var(--color-primary)] hover:underline">scanning</a>, we do that too.
            </p>`,
      },
      // ── Position 4: The Plan ──
      {
        heading: 'Three Steps to Perfect Copies',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Hand Us Your Originals</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Single page or a stack. Loose sheets, stapled documents, or bound materials \u2014 we handle it all.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Choose Your Settings</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">B&W or color, single or double-sided, stapled or loose. We confirm everything before we start.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Pick Up \u2014 Done Right</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Most jobs done same-day. Collated, stapled, and quality-checked before you walk out.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 6: The Stakes ──
      {
        heading: 'What Self-Serve Really Costs You',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Time You Can't Get Back</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">15 minutes at a self-serve kiosk is 15 minutes you could have spent running your business. We make your copies while you wait or run other errands.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Nobody Checks Your Copies</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">At the kiosk, you discover the smudge or missing page after you've paid. We check every copy before handing it over.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Bulk Orders Get Pricey Fast</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Self-serve per-page prices add up. We offer volume discounts for larger jobs and bulk projects.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">One-Stop Document Hub</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">While you're here: <a href="/copy-print/document-printing" class="text-[var(--color-primary)] hover:underline">print</a> that report, <a href="/home-business/document-scanning" class="text-[var(--color-primary)] hover:underline">scan</a> the originals, or <a href="/home-business/shredding" class="text-[var(--color-primary)] hover:underline">shred</a> what you don't need.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 7: The Success ──
      {
        heading: 'From \u201cI Need Copies\u201d to Done \u2014 in One Trip',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Walk in with your originals. Walk out with perfect copies. No machine, no stress, no wasted time.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              That's what copy services should feel like. Hand it to someone who knows what they're doing, confirm your settings, and get back to what matters.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Stop by Mailbox Plus for your next copy job.</strong> Whether it's one page or 500, we'll have you in and out and on to the next thing.
            </p>`,
      },
    ],
    features: [
      {
        icon: Printer,
        title: 'We Make the Copies',
        description: 'Hand us your originals, we handle the machine. B&W or color, any quantity.',
      },
      {
        icon: FileText,
        title: 'Collated & Stapled',
        description: 'Every copy job is finished, sorted, and quality-checked before you leave.',
      },
      {
        icon: Star,
        title: 'Volume Discounts',
        description: 'Bulk copy jobs at competitive prices. Ask us about large-run pricing.',
      },
    ],
    faqs: [...generalCopyPrintFaqs, ...copiesFaqs],
  },
  {
    id: 'staples-printing-alternative-concord-township',
    category: 'copy-print',
    city: 'Concord Township',
    serviceName: 'Staples Printing Alternative',
    slug: '/staples-printing-alternative-concord-township',
    pageTitle: 'Staples Printing Alternative in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Your local Staples printing alternative in Concord Township. Personalized service, no long lines, and high-quality printing and shipping solutions.',
    keywords: 'Staples printing alternative, Concord Township, Mailbox Plus',
    heroTitle: 'The Best Staples Printing Alternative in Concord Township: Mailbox Plus',
    heroSubtitle:
      'Mailbox Plus offers high-quality document services without the big-box store hassle.',
    heroImage: getServiceImageUrl('/images/document-printing.webp'),
    content: [
      {
        heading: 'The Best Staples Printing Alternative',
        body: `<p class="text-lg leading-relaxed mb-6">
                    Need a <strong>Staples alternative for <a href="/copy-print">printing services</a> in Concord Township, Ohio</strong>? 
                    Mailbox Plus offers high-quality document services without the big-box store hassle. 
                    Whether you need <a href="/copy-print/business-cards">business cards</a>, flyers, or secure shredding, our local team provides the personalized attention your projects deserve.
                </p>
                <div class="grid md:grid-cols-2 gap-6 mt-8">
                    <div class="p-6 rounded-2xl bg-white shadow-sm border border-[var(--color-border)] flex gap-4 items-start">
                        <div class="w-10 h-10 rounded-xl bg-[var(--color-bg-blue-tint)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                        </div>
                        <div>
                            <h4 class="font-bold text-[var(--color-text-primary)] mb-1">Printing & Business Services</h4>
                            <p class="text-sm text-[var(--color-text-secondary)]">Document services, print marketing, and secure shredding.</p>
                        </div>
                    </div>
                    <div class="p-6 rounded-2xl bg-white shadow-sm border border-[var(--color-border)] flex gap-4 items-start">
                        <div class="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        </div>
                        <div>
                            <h4 class="font-bold text-[var(--color-text-primary)] mb-1">Multi-Carrier Shipping</h4>
                            <p class="text-sm text-[var(--color-text-secondary)]">We ship via UPS, FedEx, USPS, and DHL (unlike Staples).</p>
                        </div>
                    </div>
                </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Comparison: Mailbox Plus vs. Staples',
        body: `<div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-[var(--color-bg-blue-tint)]/50">
                                <th class="p-4 border-b border-[var(--color-border-blue)] font-bold text-[var(--color-primary)]">Feature</th>
                                <th class="p-4 border-b border-[var(--color-border-blue)] font-bold text-[var(--color-primary)]">Mailbox Plus</th>
                                <th class="p-4 border-b border-[var(--color-border-blue)] font-bold text-[var(--color-primary)] text-opacity-60 italic">Staples</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[var(--color-border)]">
                            <tr>
                                <td class="p-4 text-[var(--color-text-primary)] font-medium">Customer Focus</td>
                                <td class="p-4 text-[var(--color-primary)]">Personalized Local Service</td>
                                <td class="p-4 text-[var(--color-text-muted)]">Big Box Retail</td>
                            </tr>
                            <tr>
                                <td class="p-4 text-[var(--color-text-primary)] font-medium">Shipping Options</td>
                                <td class="p-4 text-[var(--color-primary)]">UPS, FedEx, USPS, DHL</td>
                                <td class="p-4 text-[var(--color-text-muted)]">Limited (Usually UPS only)</td>
                            </tr>
                            <tr>
                                <td class="p-4 text-[var(--color-text-primary)] font-medium">Efficiency</td>
                                <td class="p-4 text-[var(--color-primary)]">Fast In & Out</td>
                                <td class="p-4 text-[var(--color-text-muted)]">Often Busy / Long Waits</td>
                            </tr>
                        </tbody>
                    </table>
                </div>`,
        isFullWidth: true,
      },
    ],
    features: [
      { title: 'Customer Focus', description: 'Personalized Local Service.', icon: Users },
      { title: 'Shipping Options', description: 'UPS, FedEx, USPS, DHL.', icon: Truck },
      { title: 'Efficiency', description: 'Fast In & Out.', icon: Clock },
    ],
    faqs: [
      {
        question: 'Do you offer the same printing services as Staples?',
        answer:
          'We offer a wide range of essential business printing services including copies, flyers, and business cards with faster turnaround times.',
      },
      {
        question: 'Can I ship packages here too?',
        answer: 'Yes! We are a comprehensive shipping center for UPS, FedEx, USPS, and DHL.',
      },
      {
        question: 'Do you offer shredding services?',
        answer:
          'Yes, we provide secure document destruction to keep your sensitive information safe.',
      },
    ],
  },
  {
    id: 'office-depot-alternative-concord-township',
    category: 'copy-print',
    city: 'Concord Township',
    serviceName: 'Office Depot Alternative',
    slug: '/office-depot-alternative-concord-township',
    pageTitle: 'Office Depot Alternative in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'The best Office Depot alternative in Concord Township for printing, shipping, and business services. Locally owned and dedicated to your success.',
    keywords: 'Office Depot alternative, Concord Township, Mailbox Plus',
    heroTitle: 'The Best Office Depot Alternative in Concord Township: Mailbox Plus',
    heroSubtitle:
      'Mailbox Plus provides the essential business services you rely on, right in your neighborhood.',
    heroImage: getServiceImageUrl('/images/document-printing.webp'),
    content: [
      {
        heading: 'The Best Office Depot Alternative',
        body: `<p class="text-lg leading-relaxed mb-6">
                    Looking for a more personal <a href="/copy-print">printing and shipping</a> experience? 
                    Mailbox Plus provides the essential <a href="/pack-ship">shipping services</a> you rely on, right in your neighborhood.
                </p>
                <div class="grid md:grid-cols-2 gap-8 items-center bg-[var(--color-bg-secondary)] rounded-3xl p-8">
                    <div class="space-y-4">
                        <div class="flex items-center gap-3">
                            <span class="text-green-600 font-bold shrink-0">✓</span>
                            <span class="text-[var(--color-text-primary)]"><strong>Faster Service:</strong> We respect your busy schedule.</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-green-600 font-bold shrink-0">✓</span>
                            <span class="text-[var(--color-text-primary)]"><strong>No Long Lines:</strong> Skip the frustration found at mega-retailers.</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-green-600 font-bold shrink-0">✓</span>
                            <span class="text-[var(--color-text-primary)]"><strong>Multi-Carrier Choice:</strong> UPS, FedEx, USPS, and DHL in one location.</span>
                        </div>
                    </div>
                    <div class="p-6 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm">
                        <h4 class="font-bold text-[var(--color-primary)] mb-3 text-center">Comprehensive Services</h4>
                        <div class="flex flex-wrap gap-2 justify-center">
                            <span class="px-3 py-1 bg-[var(--color-bg-blue-tint)] text-[var(--color-primary)] rounded-full text-xs font-semibold">Printing</span>
                            <span class="px-3 py-1 bg-[var(--color-bg-blue-tint)] text-[var(--color-primary)] rounded-full text-xs font-semibold">Copying</span>
                            <span class="px-3 py-1 bg-[var(--color-bg-blue-tint)] text-[var(--color-primary)] rounded-full text-xs font-semibold">Mailbox</span>
                            <span class="px-3 py-1 bg-[var(--color-bg-blue-tint)] text-[var(--color-primary)] rounded-full text-xs font-semibold">Notary</span>
                            <span class="px-3 py-1 bg-[var(--color-bg-blue-tint)] text-[var(--color-primary)] rounded-full text-xs font-semibold">Shredding</span>
                        </div>
                    </div>
                </div>`,
        isFullWidth: true,
      },
    ],
    features: [
      { title: 'Service Experience', description: 'Personal & Efficient.', icon: Star },
      { title: 'Shipping Carriers', description: 'UPS, FedEx, USPS, DHL.', icon: Truck },
      { title: 'Waiting Time', description: 'Minimal.', icon: Clock },
    ],
    faqs: [
      {
        question: 'What shipping services do you offer?',
        answer:
          'We offer shipping via UPS, FedEx, USPS, and DHL, allowing you to choose the best option for your needs.',
      },
      {
        question: 'Can I get documents printed here?',
        answer:
          'Absolutely! We handle copies, business cards, flyers, and more with professional quality.',
      },
      {
        question: 'Do you offer notary services?',
        answer: 'Yes, our on-site notary is available to assist you with your legal documents.',
      },
    ],
  },
  {
    id: 'printing-services-concord-township',
    category: 'copy-print',
    city: 'Concord Township',
    serviceName: 'Printing Services',
    slug: '/printing-services-concord-township',
    pageTitle: 'Printing Services in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Comprehensive printing services in Concord Township. From business cards to banners, we handle all your personal and business printing needs locally.',
    keywords: 'printing services, Concord Township, Mailbox Plus',
    heroTitle: 'High-Quality Printing Services in Concord Township: Mailbox Plus',
    heroSubtitle:
      'Mailbox Plus is your local print shop for everything from business cards and flyers to documents and presentations.',
    heroImage: getServiceImageUrl('/images/document-printing.webp'),
    content: [
      {
        heading: 'High-Quality Local Printing',
        body: `<p class="text-lg leading-relaxed mb-6">
                    Whatever you need to print, Mailbox Plus handles it with professional precision. 
                    From student projects to large-scale business materials, we ensure your work looks sharp and standout.
                </p>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    <div class="bg-[var(--color-bg-blue-tint)]/50 p-6 rounded-2xl border border-[var(--color-border-blue)]">
                        <h4 class="font-bold text-[var(--color-primary)] mb-2">Quality</h4>
                        <p class="text-sm text-[var(--color-text-secondary)]">Professional-grade equipment for crisp, clear results.</p>
                    </div>
                    <div class="bg-[var(--color-bg-blue-tint)]/50 p-6 rounded-2xl border border-[var(--color-border-blue)]">
                        <h4 class="font-bold text-[var(--color-primary)] mb-2">Speed</h4>
                        <p class="text-sm text-[var(--color-text-secondary)]">Same-day service available for many jobs.</p>
                    </div>
                    <div class="bg-[var(--color-bg-blue-tint)]/50 p-6 rounded-2xl border border-[var(--color-border-blue)]">
                        <h4 class="font-bold text-[var(--color-primary)] mb-2">Ease</h4>
                        <p class="text-sm text-[var(--color-text-secondary)]">Email us your files or bring them on a USB drive.</p>
                    </div>
                    <div class="bg-[var(--color-bg-blue-tint)]/50 p-6 rounded-2xl border border-[var(--color-border-blue)]">
                        <h4 class="font-bold text-[var(--color-primary)] mb-2">Value</h4>
                        <p class="text-sm text-[var(--color-text-secondary)]">Competitive pricing without big box hassle.</p>
                    </div>
                </div>`,
        isFullWidth: true,
      },
    ],
    features: [
      { title: 'Print Quality', description: 'Professional Laser.', icon: Printer },
      { title: 'Cost per Page', description: 'Efficient / Bulk Rates.', icon: Star },
      { title: 'Speed', description: 'High Volume Fast.', icon: Clock },
    ],
    faqs: [
      {
        question: 'How do I send you my file?',
        answer: 'You can email it to us or bring it in on a USB drive.',
      },
      {
        question: 'Do you print in color?',
        answer: 'Yes, we offer full-color and black & white printing on a variety of paper sizes.',
      },
      {
        question: 'Can you laminate documents?',
        answer: 'Yes, we offer laminating services to protect your important documents.',
      },
    ],
  },
];
