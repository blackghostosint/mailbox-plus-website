import type { Service } from '../../../types/services';
import { getServiceImageUrl } from '../../../lib/storage';
import Clock from '~icons/lucide/clock';
import Truck from '~icons/lucide/truck';
import Users from '~icons/lucide/users';

export const competePages: Service[] = [
  {
    id: 'post-office-alternative-eastlake',
    category: 'pack-ship',
    city: 'Eastlake',
    serviceName: 'Post Office Alternative --- Eastlake',
    slug: '/post-office-alternative-eastlake',
    canonicalUrl: 'https://mailboxplusohio.com/post-office-alternative-eastlake',
    pageTitle: 'Post Office Alternative in Eastlake, OH | Mailbox Plus',
    metaDescription:
      'Eastlake has no UPS Store or FedEx. Mailbox Plus is your Post Office Alternative with all 4 carriers, just 10 minutes away. Walk-in notary available.',
    keywords: 'post office alternative Eastlake OH, USPS alternative, Mailbox Plus, shipping',
    heroTitle: 'The Best Post Office Alternative in Eastlake: Mailbox Plus',
    heroSubtitle:
      'Manufacturing hub --- Parker Hannifin, PCC Airfoils, Conn-Selmer. No UPS Store, no FedEx Office. Only a UPS drop box. Industrial shipping needs underserved.',
    heroImage: getServiceImageUrl('/images/usps-services.webp'),
    features: [
      {
        title: 'Faster Service',
        description:
          'We pride ourselves on quick, efficient transactions --- no post office lines.',
        icon: Clock,
      },
      {
        title: 'Carrier Flexibility',
        description:
          'USPS, UPS, FedEx, DHL --- all at one counter. Compare rates and pick the best.',
        icon: Truck,
      },
      {
        title: 'Customer Service',
        description: 'Personalized, local assistance --- not a corporate franchise.',
        icon: Users,
      },
    ],
    content: [
      {
        heading: 'The Best Post Office Alternative in Eastlake: Mailbox Plus',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Tired of waiting in line at the Eastlake Post Office? Eastlake is a manufacturing hub --- home to Parker Hannifin, PCC Airfoils, Conn-Selmer, and Voestalpine --- yet there's no UPS Store, no FedEx Office, and only a single UPS drop box in town.</p>
<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Mailbox Plus is the premier <a href="/pack-ship/usps-services" class="text-[var(--color-primary)] hover:underline"><strong>Post Office alternative for Eastlake, Ohio</strong></a>. We offer <strong>USPS, UPS, FedEx, and DHL</strong> shipping from one counter --- so whether you're shipping industrial prototypes, musical instruments, or certified documents, you get the best carrier and the best rate. Just 10 minutes from Eastlake.</p>`,
      },
      {
        heading: 'Why Choose Mailbox Plus Over the Post Office in Eastlake?',
        body: `
          <ul class="space-y-4 my-6">
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Faster Service:</strong> Quick, efficient transactions --- no post office lines, no waiting.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Multi-Carrier Choice:</strong> UPS, FedEx, DHL alongside USPS --- compare rates at one counter.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Convenient Location:</strong> Just 10 minutes from Eastlake at 7554 Fredle Drive in Concord Township.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Extended Hours:</strong> Open when the Eastlake Post Office may be closed --- perfect for shift workers.</div>
            </li>
          </ul>`,
      },
      {
        heading: 'Complete Shipping & Postal Services',
        body: `
          <ul class="space-y-4 my-6">
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>USPS Priority Mail, Express, First Class & International</strong> --- all USPS services at retail rates.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Certified Mail with Return Receipt</strong> --- perfect for legal and business documents.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><a href="/home-business/mailbox-rental" class="text-[var(--color-primary)] hover:underline"><strong>Private Mailbox Rentals</strong></a> --- secure mailboxes with a real street address.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Stamp Sales, Notary, Printing & Packing Supplies</strong> --- everything you need in one visit.</div>
            </li>
          </ul>`,
      },
    ],
    faqs: [
      {
        question: 'Are your USPS prices the same as the Post Office?',
        answer:
          'We offer competitive pricing on all USPS services, often matching retail rates for convenience. Plus we can compare rates across UPS, FedEx, and DHL so you always get the best option.',
      },
      {
        question: 'Can I rent a mailbox here?',
        answer:
          'Yes! We offer secure private mailbox rentals with real street addresses at 7554 Fredle Drive --- perfect for Eastlake residents and businesses.',
      },
      {
        question: 'Do you offer Certified Mail?',
        answer:
          'Yes, we can help you send letters via Certified Mail with Return Receipt, just like the Post Office.',
      },
      {
        question: 'How far is Mailbox Plus from Eastlake?',
        answer:
          'Mailbox Plus is located at 7554 Fredle Drive in Concord Township, just 10 minutes from Eastlake. We serve the entire Lake County area.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
    cta: {
      title: 'Visit Us --- Eastlake Is Just Minutes Away',
      subtitle:
        'One counter, four carriers, and all the services you need. No appointment necessary.',
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    hideCarrierLogos: true,
  },
];
