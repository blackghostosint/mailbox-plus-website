import Users from '~icons/lucide/users';
import Star from '~icons/lucide/star';
import Scissors from '~icons/lucide/scissors';
import Shield from '~icons/lucide/shield';
import Archive from '~icons/lucide/archive';
import FileText from '~icons/lucide/file-text';
import FolderOpen from '~icons/lucide/folder-open';
import Printer from '~icons/lucide/printer';
import MapPin from '~icons/lucide/map-pin';
import Lock from '~icons/lucide/lock';
import Clock from '~icons/lucide/clock';
import { Service } from '../../types/services';
import { getServiceImageUrl } from '../../lib/storage';
import {
  generalHomeBusinessFaqs,
  everyDoorDirectMailFaqs,
  shreddingFaqs,
  documentScanningFaqs,
  faxServicesFaqs,
} from '../faqs';

export const documentServices: Service[] = [
  // ---------------------------
  // DOCUMENT SERVICES
  // ---------------------------
  {
    id: 'every-door-direct-mail',
    category: 'document-services',
    city: 'Concord Township',
    serviceName: 'Every Door Direct Mail (EDDM)',
    slug: '/home-business/every-door-direct-mail',
    pageTitle: 'Every Door Direct Mail (EDDM) in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'EDDM services in Concord Township: design, print, and USPS prep for postcards and flyers. Reach every home in your target neighborhood without a mailing list.',
    keywords:
      'EDDM, direct mail, Concord Township, Lake County, postcard marketing, local marketing, every door direct mail',
    heroTitle: 'Every Door Direct Mail',
    heroSubtitle:
      'Your neighbors are waiting to hear from you. We handle the design, printing, and USPS prep \u2014 you just tell us which streets.',
    heroImage: getServiceImageUrl('/images/every-door-direct-mail.webp'),
    featuresTitle: 'Reach Your Neighborhood Without the USPS Maze',
    featuresSubtitle:
      'No mailing lists. No regulations to learn. Just effective local marketing that lands in every mailbox on your chosen routes.',
    hideCarrierLogos: true,
    content: [
      // ── Position 2: The Villain ──
      {
        heading: 'The Marketing Maze \u2014 USPS Doesn\u2019t Make It Easy',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              USPS Every Door Direct Mail is one of the most affordable ways to reach your local community. But the reality? Route maps, design specs, bundle counts, drop-off requirements \u2014 it\u2019s a maze.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You just want your postcard in every mailbox on your street. USPS wants you to sort, bundle, tag, and route everything perfectly before they\u2019ll touch it.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              That\u2019s where most small business owners stop. The complexity kills the campaign before it starts.
            </p>`,
      },
      // ── Position 3: The Guide ──
      {
        heading: 'We Handle the USPS Maze. You Choose the Streets.',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              We get it. You\u2019re running a business \u2014 you don\u2019t have time to learn USPS EDDM regulations.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              That\u2019s what we\u2019re for. Mailbox Plus handles the entire EDDM workflow:
            </p>
            <ul class="space-y-4 mb-6">
              <li class="flex items-start gap-3">
                <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Design:</strong> Professional postcards and flyers that get noticed.</div>
              </li>
              <li class="flex items-start gap-3">
                <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Printing:</strong> High-quality color or B&W on the right stock.</div>
              </li>
              <li class="flex items-start gap-3">
                <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Sorting &amp; Bundling:</strong> USPS-compliant preparation for every route.</div>
              </li>
              <li class="flex items-start gap-3">
                <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Drop-off:</strong> We take everything to USPS \u2014 you don\u2019t lift a finger.</div>
              </li>
            </ul>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You just tell us which streets. We make it happen.
            </p>`,
      },
      // ── Position 4: The Plan ──
      {
        heading: 'How EDDM Works \u2014 Three Simple Steps',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Tell Us Your Area</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Specific ZIP codes, carrier routes, or neighborhoods in Lake County.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Design &amp; Print</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Postcards, flyers, or brochures \u2014 professionally designed and printed.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">USPS Drops Everything</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We sort, bundle, and deliver to USPS. Every door in your target area gets your mailer.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      // ── Position 6: The Stakes ──
      {
        heading: 'Your Competitors Are Already Mailing',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Every month you wait is a month your competitors\u2019 postcards are sitting in your neighbors\u2019 mailboxes. They\u2019re getting the grand opening traffic. They\u2019re getting the seasonal calls. They\u2019re getting the \u201cwe saw your flyer\u201d walk-ins.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              EDDM is affordable \u2014 as low as 20\u201325\u00a2 per piece for postcards. The real cost is the business you lose by not showing up.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Your neighbors want to know who\u2019s in their community. Don\u2019t let your competitors be the only name they recognize.
            </p>`,
      },
      // ── Position 7: The Success ──
      {
        heading: 'From Overwhelmed to Recognized',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              One EDDM campaign and everything changes. Your name is in every home. Your phone starts ringing. People walk in and say \u201cwe saw your postcard.\u201d
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You go from <em>small business owner who keeps meaning to do marketing</em> to <strong>the local name everyone recognizes.</strong>
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              That\u2019s what happens when you stop worrying about USPS rules and start reaching your community.
            </p>`,
      },
      // ── Cross-Sell: Mailbox ──
      {
        heading: 'Already Marketing Locally? Protect Your Business Address.',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              If you\u2019re putting your business on postcards and flyers, you want a professional address \u2014 not a PO Box. A <strong><a href="/home-business/mailbox-rental" class="text-[var(--color-primary)] hover:underline">Mailbox Plus private mailbox</a></strong> gives you:
            </p>
            <ul class="space-y-4 mb-6">
              <li class="flex items-start gap-3">
                <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div class="text-[var(--color-text-primary)] leading-relaxed">A real street address for your EDDM materials \u2014 valid for all carriers</div>
              </li>
              <li class="flex items-start gap-3">
                <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div class="text-[var(--color-text-primary)] leading-relaxed">A place for customers to mail responses to</div>
              </li>
              <li class="flex items-start gap-3">
                <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div class="text-[var(--color-text-primary)] leading-relaxed">Package receiving from all 4 carriers \u2014 one secure drop point</div>
              </li>
            </ul>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong class="text-[var(--color-primary-dark)]">$35/month \u2022 30-day risk-free \u2022 Real street address \u2014 not a PO Box</strong>
            </p>`,
      },
    ],
    features: [
      {
        icon: MapPin,
        title: 'Targeted Reach',
        description: 'Choose specific routes or ZIP codes \u2014 no mailing list needed.',
      },
      {
        icon: Printer,
        title: 'Design & Print',
        description: 'Professional postcards and flyers, USPS-compliant sizing.',
      },
      {
        icon: Star,
        title: 'USPS Prepared',
        description: 'We sort, bundle, and drop off \u2014 you just approve the design.',
      },
    ],
    cta: {
      title: 'Ready to reach every door in your neighborhood?',
      subtitle:
        'Stop wrestling with USPS rules. Tell us which streets and we handle the rest \u2014 design, print, sorting, and drop-off.',
      buttonText: 'Start Your EDDM Campaign',
      buttonLink: '/home-business/every-door-direct-mail',
      align: 'center',
      variant: 'brand',
    },
    faqs: [...generalHomeBusinessFaqs, ...everyDoorDirectMailFaqs],
  },
  {
    id: 'shredding',
    category: 'document-services',
    city: 'Concord Township',
    serviceName: 'Shredding Services',
    slug: '/home-business/shredding',
    pageTitle: 'Shredding Services in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Secure micro-cut document shredding (P-4 security) in Concord Township. Protect your identity with safe, certified destruction.',
    keywords:
      'shredding, micro-cut, P-4 security, document destruction, concord township, lake county',
    heroTitle: 'Your Private Documents. Permanently Gone.',
    heroSubtitle:
      'Immediate, on-site P-4 micro-cut shredding in Concord Township. Simple flat-rate pricing of $1.00 per pound with no minimums. Watch us shred.',
    heroImage: getServiceImageUrl('/images/shredding.webp'),
    featuresTitle: 'Complete Chain of Custody',
    featuresSubtitle:
      'No sitting in locked consoles for weeks. No third-party drivers. Just immediate, on-site P-4 micro-cut destruction.',
    hideCarrierLogos: true,
    collapseCompetitorAlternative: true,
    content: [
      // ── SB7 POSITION 1-2: PROBLEM (Villain: The Curb-Side Data Leak) ──
      {
        heading: 'The Risk Sitting in Your Trash Can',
        body: 'Old tax returns, bank statements, medical records — every piece of paper in your recycling bin is a data point. Identity thieves call it <strong>The Curb-Side Data Leak</strong>: a five-minute opportunity to grab your entire financial history from a cardboard box sitting on the street. The mechanism is simple — personal documents thrown away intact are accessible to anyone with five minutes and no shame. And they don\u2019t need all of it. One paper with your SSN, DOB, or bank account number is all it takes.',
      },
      // ── SB7 POSITION 3: GUIDE (Empathy + Authority) ──
      {
        heading: 'Immediate On-Site P-4 Destruction',
        body: 'We understand the high stakes of keeping your personal, financial, and medical history safe. Unlike competitor shipping stores that throw your documents into a locked console where they sit for weeks waiting for an outside contract truck, <strong>Mailbox Plus shreds everything on-site immediately</strong>. Your documents never leave our sight, are never stored for later, and are never handed over to outside middlemen. We destroy them on our advanced P-4 micro-cut machines the moment you hand them to us.',
      },
      // ── SB7 POSITION 4a: PLAN (Pricing — Agreement Plan) ──
      {
        heading: 'Simple, Flat-Rate Pricing: Just $1.00 per Pound',
        body: 'No minimums. No hidden setup fees. No guesswork. We weigh your documents right at our counter so you know the exact cost before we shred. Whether you have a single envelope of private medical receipts or an entire attic filled with ten years of business tax files, you get the same simple flat-rate: <strong>only $1.00 per pound</strong>. You get total transparency and no franchise markups.',
      },
      // ── SB7 POSITION 4b: PLAN (Process Plan — 3 Steps) ──
      {
        heading: 'No Home Shredder Jams, No Paper Dust',
        body: 'Why spend your Saturday fighting with a cheap home shredder that overheats and jams after three pages? Our commercial drop-off process is designed to get you secure and back on your way in under two minutes: <br/><br/><strong>1) Drop off your paperwork</strong> (staples, paper clips, and folders are perfectly fine\u2014no need to remove them). <br/><strong>2) We weigh and shred immediately on-site</strong> while you watch if you\u2019d like. <br/><strong>3) Walk out clutter-free</strong> with your hand-signed Certificate of Destruction and complete peace of mind.',
      },
      // ── SB7 POSITION 7: SUCCESS (Aspirational Identity) ──
      {
        heading: 'Our Official Certificate of Destruction',
        body: 'We don\u2019t just promise complete security\u2014we prove it. Every shredding job at Mailbox Plus is accompanied by an official, physical <strong>Mailbox Plus Certificate of Destruction</strong>. Hand-signed and stamped by our in-store security specialist the moment your files are shredded, this document serves as your physical, auditable proof that your private papers have been permanently destroyed under our strict P-4 security chain of custody.',
      },
      // ── SB7 POSITION 5 (transitional): CROSS-SELL ──
      {
        heading: 'Stop the Leak Before It Hits Your Porch',
        body: 'Protecting your sensitive files starts before they ever need to be shredded. If you are regularly shredding bank statements, tax records, or business correspondence, <strong><a href="/home-business/mailbox-rental" class="text-[var(--color-primary)] hover:underline">a Mailbox Plus private mailbox</a></strong> plugs the leak at the source. We accept all mail and packages in a secure, staffed commercial facility, keeping your home address private and your mail off your porch.',
      },
      {
        heading: 'Compliance & Security',
        body: `
                    <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
                        Did you know that federal laws often <strong>require</strong> the proper disposal of personal information? We make it easy for you and your business to comply with major privacy regulations:
                    </p>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed">
                                <strong class="text-[var(--color-text-primary)] block">The Fair and Accurate Credit Transactions Act (FACTA)</strong>
                                Ensures businesses take appropriate measures to dispose of consumer report information to protect against unauthorized access.
                            </div>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed">
                                <strong class="text-[var(--color-text-primary)] block">The Health Insurance Portability and Accountability Act (HIPAA)</strong>
                                Requires healthcare providers and insurers to safeguard the disposal of protected health information (PHI).
                            </div>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed">
                                <strong class="text-[var(--color-text-primary)] block">The Gramm-Leach-Bliley Act (GLBA)</strong>
                                Mandates that financial institutions must securely protect the confidentiality and proper disposal of consumer records.
                            </div>
                        </li>
                    </ul>
                    <p class="text-[var(--color-text-primary)] leading-relaxed">
                        <strong class="text-[var(--color-text-primary)]">State-Specific Regulations:</strong> In addition to federal laws, many states have their own regulations regarding document destruction. Our secure content destruction helps you meet requirements that act alongside federal standards, ensuring your sensitive records are handled with the highest level of security.
                    </p>
                `,
        isFullWidth: true,
      },
    ],
    features: [
      {
        icon: Scissors,
        title: 'Confetti-Grade Security',
        description: 'Micro-cut technology shreds 6x smaller than standard cross-cut.',
      },
      {
        icon: Shield,
        title: '100% On-Site Destruction',
        description: 'Shredded immediately in-store. No sitting in bins, no third parties.',
      },
      {
        icon: Archive,
        title: 'Bulk & Small Job Ready',
        description: 'We handle single envelopes up to boxes of tax records.',
      },
    ],
    // ── SB7 POSITION 5: CTA (Direct + Transitional) ──
    cta: {
      title: 'Ready to Destroy Your Paper Trail?',
      subtitle: '$1.00 per pound. No minimum. No appointment. Walk in, drop off, done.',
      buttonText: 'Bring Your Documents In →',
      buttonLink: '/home-business/shredding',
      variant: 'brand',
      align: 'center',
    },
    faqs: [...generalHomeBusinessFaqs, ...shreddingFaqs],
  },
  {
    id: 'document-scanning',
    category: 'document-services',
    city: 'Concord Township',
    serviceName: 'Document Scanning',
    slug: '/home-business/document-scanning',
    pageTitle: 'Document Scanning in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Professional document scanning services in Concord Township. Digitize your photos, files, and records for safe, space-saving storage.',
    keywords: 'document scanning, digital files, concord township, lake county',
    heroTitle: 'Document Scanning',
    heroSubtitle: 'Convert your paper documents into digital files.',
    heroImage: getServiceImageUrl('/images/document-scanning.webp'),
    content: [
      {
        heading: 'Go Paperless',
        body: 'Digitize your important documents for easier storage and access.',
      },
      {
        heading: 'Secure Storage',
        body: 'Your files are scanned with care and stored digitally.',
      },
      {
        heading: 'Go Paperless',
        body: '<strong>Preserve and organize your important paperwork</strong> with <a href="/home-business/shredding" class="text-[var(--color-primary)] hover:underline">professional document scanning</a>. We provide <strong>secure, high-resolution scanning</strong> for personal, legal, and business documents—helping you convert cluttered paper files into digital copies.',
      },
      {
        heading: 'Digital Archiving Experts',
        body: 'Our team handles everything from <strong>single-page scans to bulk projects</strong>, delivering files in your preferred format (PDF, JPEG, or searchable PDF) on a flash drive, email, or cloud storage.',
      },
      {
        heading: 'Safe & Secure Preservation',
        body: "Whether you're archiving records or protecting vital documents, we ensure <strong>fast turnaround and total privacy</strong>. Your originals are returned intact, and all digital copies are securely transferred.",
        isFullWidth: true,
      },
    ],
    features: [
      {
        icon: FileText,
        title: 'Digital Files',
        description: 'Scan to PDF, JPEG, or other formats.',
      },
      {
        icon: Shield,
        title: 'Secure Handling',
        description: 'We handle your documents with confidentiality.',
      },
      {
        icon: FolderOpen,
        title: 'Easy Organization',
        description: 'Organize and access files digitally.',
      },
    ],
    faqs: [...generalHomeBusinessFaqs, ...documentScanningFaqs],
  },
  {
    id: 'fax-services',
    category: 'document-services',
    city: 'Concord Township',
    serviceName: 'Fax Services',
    slug: '/home-business/fax-services',
    pageTitle: 'Fax Services in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Local fax services in Concord Township. Send and receive local, domestic, and international faxes securely and quickly.',
    keywords: 'fax services, send fax, concord township, lake county',
    heroTitle: 'Fax Services',
    heroSubtitle: 'Send and receive faxes securely and quickly.',
    heroImage: getServiceImageUrl('/images/fax-services.webp'),
    content: [
      {
        heading: 'Send Faxes Easily',
        body: 'Whether for business or personal needs, we help you send documents anywhere.',
      },
      {
        heading: 'Receive Faxes at Our Location',
        body: 'Use our store as your fax number and pick up documents securely.',
      },
      {
        heading: 'Secure Fax Transmission',
        body: '<strong><a href="/home-business/document-scanning" class="text-[var(--color-primary)] hover:underline">Send and receive faxes quickly and securely</a></strong> at Mailbox Plus. Whether you need to transmit <strong>legal documents, forms, or business papers</strong>, we make faxing fast and reliable—no fax machine required.',
      },
      {
        heading: 'Global & Domestic Faxing',
        body: 'Our in-store team helps you <strong>send local, domestic, and international faxes</strong> while ensuring your information remains private. You’ll receive a printed confirmation sheet for every fax sent for your records.',
      },
      {
        heading: 'Reliable Fax Receiving',
        body: 'We also provide <strong>fax receiving services</strong>—simply have your sender fax their documents to our store, and we will securely hold them for pickup. Perfect for individuals and small businesses.',
        isFullWidth: true,
      },
    ],
    features: [
      { icon: Printer, title: 'Send & Receive', description: 'Full fax services available.' },
      {
        icon: Shield,
        title: 'Secure Transmission',
        description: 'Your information is kept private.',
      },
      {
        icon: MapPin,
        title: 'Local Access',
        description: 'Conveniently send and receive in Concord Township.',
      },
    ],
    faqs: [...generalHomeBusinessFaqs, ...faxServicesFaqs],
  },
  {
    id: 'document-services-concord-township',
    category: 'document-services',
    city: 'Concord Township',
    serviceName: 'Document Services',
    slug: '/document-services-concord-township',
    pageTitle: 'Document Services in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Complete document services in Concord Township: printing, copying, scanning, faxing, notary, and shredding. Your local business support center.',
    keywords: 'document services, Concord Township, Mailbox Plus',
    heroTitle: 'Professional Document Services in Concord Township: Mailbox Plus',
    heroSubtitle:
      'Mailbox Plus is your trusted provider of document services in Concord Township, Ohio.',
    heroImage: getServiceImageUrl('/images/document-printing.webp'),
    content: [
      {
        heading: 'Professional Document Services in Concord Township',
        body: `<p class="text-lg leading-relaxed mb-6">
                    Mailbox Plus is your trusted provider of <strong><a href="/home-business">document services</a> in Concord Township, Ohio</strong>. 
                    Whether you need to print a report, notarize a legal form, or securely shred sensitive files, our experienced team 
                    is here to assist. We offer a full suite of services to help you manage your personal and business paperwork 
                    with ease and confidentiality.
                </p>
                <div class="grid md:grid-cols-2 gap-8 mt-8">
                    <div class="bg-[var(--color-bg-blue-tint)]/50 p-6 rounded-2xl border border-[var(--color-border-blue)]">
                        <h4 class="text-xl font-bold text-[var(--color-primary-dark)] mb-4">Complete Document Solutions</h4>
                        <ul class="space-y-3">
                            <li class="flex items-center gap-3">
                                <div class="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
                                <span class="text-[var(--color-text-primary)]"><strong>Printing & Copying:</strong> High-quality color and B&W.</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <div class="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
                                <span class="text-[var(--color-text-primary)]"><strong>Notary Services:</strong> Official notarization for legal forms.</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <div class="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
                                <span class="text-[var(--color-text-primary)]"><strong><a href="/home-business/shredding">Secure Shredding</a>:</strong> Safe destruction of confidential files.</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <div class="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
                                <span class="text-[var(--color-text-primary)]"><strong>Scanning & Faxing:</strong> Digitize or send files quickly.</span>
                            </li>
                        </ul>
                    </div>
                    <div class="bg-[var(--color-bg-secondary)] p-6 rounded-2xl border border-[var(--color-border)]">
                        <h4 class="text-xl font-bold text-[var(--color-text-primary)] mb-4">Why Local Choice Matters</h4>
                        <p class="text-[var(--color-text-secondary)] leading-relaxed italic">
                            "Skip the office supply store lines and enjoy personalized service right in your neighborhood. 
                            We handle your sensitive documents with the utmost care and confidentiality."
                        </p>
                    </div>
                </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Why Choose Mailbox Plus for Documents?',
        body: `<div class="grid md:grid-cols-3 gap-6">
                    <div class="p-4 border-l-4 border-[var(--color-primary)] bg-white shadow-sm">
                        <h5 class="font-bold text-[var(--color-primary-dark)]">Security</h5>
                        <p class="text-sm text-[var(--color-text-secondary)]">Utmost care and confidentiality for all sensitive files.</p>
                    </div>
                    <div class="p-4 border-l-4 border-[var(--color-primary)] bg-white shadow-sm">
                        <h5 class="font-bold text-[var(--color-primary-dark)]">Expertise</h5>
                        <p class="text-sm text-[var(--color-text-secondary)]">Staff trained for complex print jobs and notary requirements.</p>
                    </div>
                    <div class="p-4 border-l-4 border-[var(--color-primary)] bg-white shadow-sm">
                        <h5 class="font-bold text-[var(--color-primary-dark)]">Speed</h5>
                        <p class="text-sm text-[var(--color-text-secondary)]">Get your tasks done quickly and get back to your day.</p>
                    </div>
                </div>`,
      },
    ],
    features: [
      { title: 'Privacy', description: 'Discreet & Secure.', icon: Lock },
      { title: 'Service Speed', description: 'Fast & Efficient.', icon: Clock },
      { title: 'Personal Attention', description: 'Dedicated Staff.', icon: Users },
    ],
    faqs: [
      {
        question: 'What documents can you notarize?',
        answer:
          'We can notarize most documents, including wills, powers of attorney, and real estate forms. Please bring a valid ID.',
      },
      {
        question: 'Is your shredding service secure?',
        answer:
          'Yes, all shredding is done on-site. We never lock your documents in a bin to sit around for weeks or hand them over to outside partners—we shred them immediately for complete chain of custody.',
      },
      {
        question: 'Can you scan multiple pages to one PDF?',
        answer:
          'Yes, our high-speed scanners can combine multiple pages into a single digital file for easy emailing.',
      },
    ],
  },
];
