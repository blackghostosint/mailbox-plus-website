import Mail from '~icons/lucide/mail';
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
import type { Service } from '../../types/services';
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
    pageTitle: 'Every Door Direct Mail (EDDM) in Concord | Mailbox Plus',
    metaDescription:
      'Grow your business with EDDM services in Concord Township. We help with design, printing, and USPS paperwork to reach every home in your target area.',
    keywords: 'EDDM, direct mail, Concord Township, Lake County',
    heroTitle: 'Every Door Direct Mail',
    heroSubtitle: 'Reach your local community with cost-effective mail campaigns.',
    heroImage: getServiceImageUrl('/images/every-door-direct-mail.webp'),
    content: [
      {
        heading: 'Grow Your Business',
        body: 'EDDM helps you target local neighborhoods with affordable bulk mailings.',
      },
      {
        heading: 'Convenience & Flexibility',
        body: 'EDDM is easy to use and cost-effective.',
      },
      {
        heading: 'Reach Every Neighborhood',
        body: '<strong>Every Door Direct Mail (EDDM)</strong> from Mailbox Plus makes it easy and affordable to reach potential customers in your local area—without needing a mailing list.',
      },
      {
        heading: 'Targeted Local Marketing',
        body: 'With EDDM, you can <strong>choose specific postal routes</strong> and deliver postcards or brochures directly to every home in that area. It\u2019s a powerful way to promote local sales, events, and grand openings.',
      },
      {
        heading: 'Full-Service EDDM Support',
        body: `
                    <ul class="space-y-4 my-6">
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Design & Printing:</strong> Professional postcards and brochures.</div>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Sorting & Bundling:</strong> USPS-compliant route delivery preparation.</div>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Paperwork Assistance:</strong> Complete USPS program guidance.</div>
                        </li>
                    </ul>
                `,
        isFullWidth: true,
      },
    ],
    features: [
      { icon: Mail, title: 'Bulk Mailing', description: 'Send to entire ZIP codes or routes.' },
      { icon: Users, title: 'Targeted Reach', description: 'Focus on specific neighborhoods.' },
      {
        icon: Star,
        title: 'Affordable',
        description: 'Save money compared to traditional mailing lists.',
      },
    ],
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
    content: [
      // ---- SB7 POSITION 1-2: PROBLEM (Villain: The Curb-Side Data Leak) ----
      {
        heading: 'The Risk Sitting in Your Trash Can',
        body: 'Old tax returns, bank statements, medical records \u2014 every piece of paper in your recycling bin is a data point. Identity thieves call it <strong>The Curb-Side Data Leak</strong>: a five-minute opportunity to grab your entire financial history from a cardboard box sitting on the street. The mechanism is simple \u2014 personal documents thrown away intact are accessible to anyone with five minutes and no shame. And they don\u2019t need all of it. One paper with your SSN, DOB, or bank account number is all it takes.',
      },
      // ---- SB7 POSITION 3: GUIDE (Empathy + Authority) ----
      {
        heading: 'Immediate On-Site P-4 Destruction',
        body: 'We understand the high stakes of keeping your personal, financial, and medical history safe. Unlike competitor shipping stores that throw your documents into a locked console where they sit for weeks waiting for an outside contract truck, <strong>Mailbox Plus shreds everything on-site immediately</strong>. Your documents never leave our sight, are never stored for later, and are never handed over to outside middlemen. We destroy them on our advanced P-4 micro-cut machines the moment you hand them to us.',
      },
      // ---- SB7 POSITION 4a: PLAN (Pricing \u2014 Agreement Plan) ----
      {
        heading: 'Simple, Flat-Rate Pricing: Just $1.00 per Pound',
        body: 'No minimums. No hidden setup fees. No guesswork. We weigh your documents right at our counter so you know the exact cost before we shred. Whether you have a single envelope of private medical receipts or an entire attic filled with ten years of business tax files, you get the same simple flat-rate: <strong>only $1.00 per pound</strong>. You get total transparency and no franchise markups.',
      },
      // ---- SB7 POSITION 4b: PLAN (Process Plan \u2014 3 Steps) ----
      {
        heading: 'No Home Shredder Jams, No Paper Dust',
        body: 'Why spend your Saturday fighting with a cheap home shredder that overheats and jams after three pages? Our commercial drop-off process is designed to get you secure and back on your way in under two minutes: <br/><br/><strong>1) Drop off your paperwork</strong> (staples, paper clips, and folders are perfectly fine\u2014no need to remove them). <br/><strong>2) We weigh and shred immediately on-site</strong> while you watch if you\u2019d like. <br/><strong>3) Walk out clutter-free</strong> with your hand-signed Certificate of Destruction and complete peace of mind.',
      },
      // ---- SB7 POSITION 7: SUCCESS (Aspirational Identity) ----
      {
        heading: 'Our Official Certificate of Destruction',
        body: 'We don\u2019t just promise complete security\u2014we prove it. Every shredding job at Mailbox Plus is accompanied by an official, physical <strong>Mailbox Plus Certificate of Destruction</strong>. Hand-signed and stamped by our in-store security specialist the moment your files are shredded, this document serves as your physical, auditable proof that your private papers have been permanently destroyed under our strict P-4 security chain of custody.',
      },
      // ---- SB7 POSITION 5 (transitional): CROSS-SELL ----
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
    // ---- SB7 POSITION 5: CTA (Direct + Transitional) ----
    cta: {
      title: 'Ready to Destroy Your Paper Trail?',
      subtitle: '$1.00 per pound. No minimum. No appointment. Walk in, drop off, done.',
      buttonText: 'Bring Your Documents In \u2192',
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
      'Document scanning in Concord Township. Digitize your paper records \u2014 tax returns, contracts, photos. High-resolution, secure, same-day. We scan, you get digital files.',
    keywords: 'document scanning, digitize documents, paperless, Concord Township, Lake County',
    heroTitle: 'That Pile of Papers Isn\u2019t Going to Scan Itself',
    heroSubtitle:
      'Document scanning in Concord Township. High-resolution. Secure. Same-day turnaround. PDF, JPEG, or searchable PDF.',
    heroImage: getServiceImageUrl('/images/document-scanning.webp'),
    hideCarrierLogos: true,
    content: [
      // ---- SB7 POSITION 1-2: VILLAIN ----
      {
        heading: 'The Paper Avalanche \u2014 It Starts With One Receipt',
        body: 'One tax return. A signed contract. Old medical records. Photos from a decade ago. They sit in a drawer. Then a box. Then a filing cabinet. You know you should digitize them. You buy a scanner. You use it once. The pile grows. Now you have a physical archive you can\u2019t search, can\u2019t back up, and can\u2019t access from your phone. That\u2019s the Paper Avalanche \u2014 it doesn\u2019t happen overnight, but once it starts, it\u2019s hard to stop.',
      },
      // ---- SB7 POSITION 2: INTERNAL PROBLEM ----
      {
        heading: 'The Anxiety of \u201cWhere Did I Put That Document?\u201d',
        body: 'You need that contract from three years ago. You know you have it. You spend 20 minutes rifling through files. You find it \u2014 but it\u2019s wrinkled, faded, and hard to read. The anxiety isn\u2019t just the search \u2014 it\u2019s knowing that every important document in your life is sitting in a physical pile somewhere, vulnerable to fire, water, or simply getting lost in a move.',
      },
      // ---- SB7 POSITION 3: GUIDE ----
      {
        heading: 'Hand Us the Pile. We\u2019ll Hand You the Files.',
        body: 'We scan documents the way they should be scanned \u2014 high-resolution, carefully handled, and delivered in the format you need. Single page or a whole filing cabinet. Photos, legal documents, medical records. We return your originals intact and give you clean digital copies on USB, email, or cloud storage. Searchable PDFs available for text documents. No more digging through drawers.',
      },
      // ---- SB7 POSITION 4: PLAN ----
      {
        heading: 'Drop Off. We Scan. You Download.',
        body: '<div class="grid md:grid-cols-3 gap-6 my-8"><div class="p-6 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm"><div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div><h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Drop Off Your Documents</h4><p class="text-sm text-[var(--color-text-secondary)]">Bring in your papers, photos, or records. We\u2019ll review the scope and give you a timeline.</p></div><div class="p-6 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm"><div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div><h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Scan & Process</h4><p class="text-sm text-[var(--color-text-secondary)]">High-resolution scanning. PDF, JPEG, or searchable PDF. We handle each page with care and confidentiality.</p></div><div class="p-6 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm"><div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div><h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Get Digital Files + Originals Back</h4><p class="text-sm text-[var(--color-text-secondary)]">Pick up your originals and receive your digital files \u2014 on USB, email, or cloud. Your documents are now searchable, shareable, and backed up.</p></div></div>',
        isFullWidth: true,
      },
      // ---- SB7 POSITION 5: AGREEMENT PLAN ----
      {
        heading: 'No Minimum. Total Privacy. Same-Day Available.',
        body: '<ul class="space-y-3 my-4"><li class="flex items-start gap-3"><span class="text-[var(--color-primary)] font-bold shrink-0">\u2713</span><span><strong>No minimum page count.</strong> One page or a thousand \u2014 same professional handling.</span></li><li class="flex items-start gap-3"><span class="text-[var(--color-primary)] font-bold shrink-0">\u2713</span><span><strong>Multiple formats.</strong> PDF, JPEG, or searchable PDF with OCR. You choose.</span></li><li class="flex items-start gap-3"><span class="text-[var(--color-primary)] font-bold shrink-0">\u2713</span><span><strong>Total confidentiality.</strong> Your documents are handled by staff, in-store, never farmed out.</span></li></ul>',
        isFullWidth: true,
      },
      // ---- SB7 POSITION 6: STAKES ----
      {
        heading: 'What You Risk by Leaving Papers in a Pile',
        body: '<div class="grid md:grid-cols-2 gap-6 my-6"><div class="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">Lost Documents</h4><p class="text-sm text-[var(--color-text-secondary)]">Fire, water, mice, or simply forgetting which drawer. Physical documents are fragile. Digital copies last forever.</p></div><div class="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">Hours Wasted Searching</h4><p class="text-sm text-[var(--color-text-secondary)]">Every \u201cwhere did I put that?\u201d costs you time. Digital files are searchable in seconds. Paper is a guessing game.</p></div></div>',
        isFullWidth: true,
      },
      // ---- SB7 POSITION 7: SUCCESS ----
      {
        heading: 'Your Documents, Digitized. Your Clutter, Gone.',
        body: 'Everything in one place. Searchable. Sharable. Backed up. You open your phone, type \u201ctax return 2023\u201d and there it is. No drawers. No boxes. No \u201cI know I have it somewhere.\u201d That\u2019s what document scanning should feel like. One drop-off. Done.',
      },
    ],
    features: [
      {
        icon: FileText,
        title: 'Digital Files',
        description: 'PDF, JPEG, or searchable PDF with OCR. You choose the format.',
      },
      {
        icon: Shield,
        title: 'Secure Handling',
        description: 'Your documents stay in our care, in our store. Never outsourced.',
      },
      {
        icon: FolderOpen,
        title: 'Same-Day Turnaround',
        description:
          'Most jobs completed same-day. Drop off in the morning, pick up in the afternoon.',
      },
    ],
    faqs: [...generalHomeBusinessFaqs, ...documentScanningFaqs],
    cta: {
      title: 'Turn Your Paper Pile Into Digital Files',
      subtitle:
        'Drop off your documents. We scan. You download. PDF, JPEG, or searchable. Same-day available.',
      buttonText: 'Start Your Scanning Project \u2192',
      buttonLink: '/contact-us',
      variant: 'brand',
      align: 'center',
    },
  },
  {
    id: 'fax-services',
    category: 'document-services',
    city: 'Concord Township',
    serviceName: 'Fax Services',
    slug: '/home-business/fax-services',
    pageTitle: 'Fax Services in Concord Township | Mailbox Plus',
    metaDescription:
      'Fax services in Concord Township. Send and receive faxes \u2014 no fax machine needed. Local, domestic, international. Confirmation sheet included.',
    keywords:
      'fax services, send fax, receive fax, Concord Township, Lake County, document transmission',
    heroTitle: 'Where Do You Even Find a Fax Machine These Days?',
    heroSubtitle:
      'Fax services in Concord Township. Send and receive \u2014 local, domestic, international. No machine needed. We handle it.',
    heroImage: getServiceImageUrl('/images/fax-services.webp'),
    hideCarrierLogos: true,
    content: [
      // ---- SB7 POSITION 1-2: VILLAIN ----
      {
        heading: 'The Fax Hunt \u2014 Everyone Needs One. Nobody Has One.',
        body: 'Your bank needs a signed form faxed. The title agency sends documents by fax only. The pharmacy needs a prescription faxed. You don\u2019t own a fax machine. You check the library \u2014 their machine is \u201cdown for maintenance.\u201d The office supply store has one but there\u2019s a line. You end up driving 20 minutes to send a single page. That\u2019s the Fax Hunt \u2014 a service everyone still requires but nobody provides easily.',
      },
      // ---- SB7 POSITION 2: INTERNAL PROBLEM ----
      {
        heading: 'The \u201cI Just Need to Send One Page\u201d Frustration',
        body: 'It\u2019s one document. One page. It should take two minutes. Instead, you\u2019re searching for a machine, waiting in line, watching the clock, and hoping it goes through. And when it does, you walk away hoping the other end actually got it \u2014 because there\u2019s no confirmation, no tracking, just a machine on the other end that may or may not have worked.',
      },
      // ---- SB7 POSITION 3: GUIDE ----
      {
        heading: 'We Fax. You Go Back to Your Day.',
        body: 'Hand us your document. Tell us the number. We send it. You get a printed confirmation sheet. That\u2019s it. Local, domestic, or international. We also receive faxes at our store \u2014 just have them send it to our number, and we\u2019ll hold it for pickup. No machine to fight with. No \u201cout of order\u201d signs. No line.',
      },
      // ---- SB7 POSITION 4: PLAN ----
      {
        heading: 'How Faxing Works at Mailbox Plus',
        body: '<div class="grid md:grid-cols-3 gap-6 my-8"><div class="p-6 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm"><div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div><h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Bring or Email Your Document</h4><p class="text-sm text-[var(--color-text-secondary)]">Bring it in on paper, email it to us, or have it ready on your phone. We accept any format.</p></div><div class="p-6 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm"><div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div><h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Dial & Send</h4><p class="text-sm text-[var(--color-text-secondary)]">Tell us the number. We dial, send, and wait for the confirmation. Local, domestic, or international.</p></div><div class="p-6 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm"><div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div><h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Confirmation & Done</h4><p class="text-sm text-[var(--color-text-secondary)]">You get a printed confirmation sheet. If you\u2019re receiving, we\u2019ll hold your fax securely for pickup.</p></div></div>',
        isFullWidth: true,
      },
      // ---- SB7 POSITION 6: STAKES ----
      {
        heading: 'The Cost of Not Having a Fax Machine When You Need One',
        body: '<div class="grid md:grid-cols-2 gap-6 my-6"><div class="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">Missed Deadlines</h4><p class="text-sm text-[var(--color-text-secondary)]">Real estate, legal, and medical documents often require fax by end of business. Driving around looking for a machine costs you time and money.</p></div><div class="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm"><h4 class="font-bold text-[var(--color-text-primary)] mb-2">No Confirmation</h4><p class="text-sm text-[var(--color-text-secondary)]">Online fax services don\u2019t always confirm delivery. We provide a printed confirmation sheet for every fax sent.</p></div></div>',
        isFullWidth: true,
      },
      // ---- SB7 POSITION 7: SUCCESS ----
      {
        heading: 'One Document. One Stop. Done.',
        body: 'Hand it over. We send it. You get confirmation. No machine. No subscription. No \u201cI\u2019ll have to come back.\u201d Whether you need to send one page or receive a 50-page contract, we\u2019re your fax solution. Two minutes in and out. Confirmation in hand.',
      },
    ],
    features: [
      {
        icon: Printer,
        title: 'Send & Receive',
        description: 'Local, domestic, and international faxing. We handle the dialing.',
      },
      {
        icon: Shield,
        title: 'Confirmation Provided',
        description: 'Printed confirmation sheet for every fax sent. You know it went through.',
      },
      {
        icon: MapPin,
        title: 'Fax Receiving Available',
        description: 'Use our number. We\u2019ll hold your incoming faxes securely for pickup.',
      },
    ],
    faqs: [...generalHomeBusinessFaqs, ...faxServicesFaqs],
    cta: {
      title: 'Need to Send a Fax? We\u2019ve Got You.',
      subtitle:
        'No machine needed. Just bring your document. Local, domestic, international. Confirmation included.',
      buttonText: 'Stop By to Fax \u2192',
      buttonLink: '/contact-us',
      variant: 'brand',
      align: 'center',
    },
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
