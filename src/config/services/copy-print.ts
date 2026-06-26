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
      'High-quality business card printing in Concord Township, Ohio. Choose from premium cardstocks and finishes. Fast, professional local printing service.',
    keywords: 'business cards, printing, Concord Township, Lake County',
    heroTitle: 'Professional Business Cards',
    heroSubtitle: 'Make a lasting first impression with custom-designed business cards.',
    heroImage: getServiceImageUrl('/images/business-cards.webp'),
    content: [
      {
        heading: 'Why Business Cards Still Matter',
        body: 'In the digital age, a well-designed business card remains one of the most effective tools for building professional connections.',
      },
      {
        heading: 'Design Options & Quality Printing',
        body: 'We work with top print suppliers to deliver business cards that reflect your brand. Choose from matte, glossy, and premium finishes.',
      },
      {
        heading: 'Premium Brand Impressions',
        body: 'Make a lasting first impression with <strong>custom business cards</strong> <a href="/copy-print/document-printing" class="text-[var(--color-primary)] hover:underline">professionally printed</a> at Mailbox Plus. We help professionals throughout Lake County create high-quality, full-color business cards that reflect their brand and style.',
      },
      {
        heading: 'Quality Finishes',
        body: 'Our team offers <strong>matte, glossy, and premium cardstock finishes</strong>. Whether you need 100 cards or 10,000, we ensure crisp detail and vibrant color. We can help you create a design from scratch or polish your existing layout for print.',
      },
      {
        heading: 'Durable & Professional',
        body: 'Every card is printed using <strong>professional-grade printers</strong> to make sure your brand stands out with confidence. If you need <em>business card printing near Concord Township</em>, visit Mailbox Plus for cards that start conversations.',
      },
    ],
    features: [
      {
        icon: Users,
        title: 'Custom Design',
        description: 'Work with our staff or upload your own design.',
      },
      {
        icon: Palette,
        title: 'Premium Materials',
        description: 'Choose from multiple card stocks and finishes.',
      },
      {
        icon: Star,
        title: 'Fast Turnaround',
        description: 'Get your cards quickly, ready for your next meeting.',
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
      'Reliable document printing in Concord Township. Color and B&W printing for reports, presentations, and manuals. Quick service for students and businesses.',
    keywords: 'document printing, business printing, Concord Township, Lake County',
    heroTitle: 'Document Printing',
    heroSubtitle: 'High-quality document printing for all your needs.',
    heroImage: getServiceImageUrl('/images/document-printing.webp'),
    content: [
      {
        heading: 'Professional Document Printing',
        body: 'From single-page documents to large reports, we provide high-quality printing services for businesses and individuals.',
      },
      {
        heading: 'Fast Turnaround',
        body: 'Most printing jobs are completed the same day, so you can get your documents when you need them.',
      },
      {
        heading: 'Fast & Reliable Results',
        body: 'Mailbox Plus provides <strong><a href="/copy-print/copies" class="text-[var(--color-primary)] hover:underline">high-quality document printing</a></strong> for residents, students, and businesses in Concord Township. Whether you need resumes, presentations, or reports, we make it simple to get crisp results right when you need them.',
      },
      {
        heading: 'Custom Finishing Options',
        body: 'Our on-site printers produce <strong>black-and-white and full-color</strong> documents with <a href="/copy-print/business-cards" class="text-[var(--color-primary)] hover:underline">finishing options like stapling and binding</a>. We can print directly from email, USB, or cloud storage with total confidentiality.',
      },
      {
        heading: 'One-Stop Solutions',
        body: 'We also offer <strong>bulk printing, scanning, and faxing</strong> for small offices and local professionals. Most jobs are completed same-day or while you wait, helping you get it right the first time.',
      },
    ],
    features: [
      {
        icon: Printer,
        title: 'Color & B/W',
        description: 'Full-color or black and white printing options.',
      },
      {
        icon: FileText,
        title: 'Multiple Formats',
        description: 'Print documents, reports, presentations, and more.',
      },
      {
        icon: Star,
        title: 'Professional Quality',
        description: 'Sharp, crisp printing on premium paper.',
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
      'Fast and affordable copy services in Concord Township. Black & white and color copies, volume discounts, and finishing services available.',
    keywords: 'copy services, document copies, concord township, lake county',
    heroTitle: 'Copy Services',
    heroSubtitle: 'Quick, affordable copies for personal or business use.',
    heroImage: getServiceImageUrl('/images/copies.webp'),
    content: [
      {
        heading: 'Affordable Copying',
        body: 'Make black-and-white or color copies in any quantity you need.',
      },
      {
        heading: 'Bulk Discounts',
        body: 'Save more when you print larger volumes.',
      },
      {
        heading: 'Fast Reproduction Services',
        body: 'Mailbox Plus provides <strong><a href="/copy-print/document-printing" class="text-[var(--color-primary)] hover:underline">high-quality copy services</a></strong> for businesses and individuals in Concord Township. Whether you need a few pages or hundreds of copies, our professional printers ensure accurate reproductions every time.',
      },
      {
        heading: 'Full-Service Document Handling',
        body: 'We offer <strong>black-and-white and full-color</strong> copying with stapling and collating options. Our team can also help with <a href="/home-business/document-scanning" class="text-[var(--color-primary)] hover:underline">document scanning</a> and faxing, making us your local one-stop document hub.',
      },
    ],
    features: [
      {
        icon: Printer,
        title: 'Color & B/W Copies',
        description: 'Flexible copy options for any need.',
      },
      { icon: Layers, title: 'High Volume', description: 'We handle bulk orders quickly.' },
      { icon: Star, title: 'Quality Guaranteed', description: 'Clear, sharp copies every time.' },
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
