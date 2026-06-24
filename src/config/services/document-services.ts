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
        body: 'With EDDM, you can <strong>choose specific postal routes</strong> and deliver postcards or brochures directly to every home in that area. It’s a powerful way to promote local sales, events, and grand openings.',
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
      'Clear the clutter and protect your identity with certified micro-cut shredding in Concord Township.',
    heroImage: getServiceImageUrl('/images/shredding.webp'),
    content: [
      {
        heading: 'The Risk Sitting in Your Trash Can',
        body: 'Old tax returns, bank statements, medical records. Throwing them in the household recycling bin doesn’t protect you—it just makes your family a target. Identity thieves don’t have to hack a database when they can simply exploit a vulnerable paper trail left at the curb.',
      },
      {
        heading: 'Immediate On-Site Destruction',
        body: 'We understand the weight of keeping your private records safe. You shouldn’t have to worry about who is handling your financial, medical, or personal history. Unlike competitor shipping stores that throw your documents into a locked bin where they sit for weeks waiting for an outside truck, <strong>Mailbox Plus shreds everything on-site immediately</strong>. Your documents never leave our sight, are never stored for later, and are never handed over to outside middlemen. We destroy them on our advanced micro-cut machines the moment you hand them to us.',
      },
      {
        heading: 'No Home Shredder Jams, No Paper Dust',
        body: 'Why spend your Saturday fighting with a cheap home shredder that overheats and jams after three pages? Our process is designed to get you in, out, and secure in under two minutes: <strong>1) Drop off your paperwork</strong> (staples and paperclips are fine). <strong>2) We shred it immediately on-site</strong> while you watch if you’d like. <strong>3) Walk out clutter-free</strong> with total peace of mind that your data is gone forever.',
      },
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
