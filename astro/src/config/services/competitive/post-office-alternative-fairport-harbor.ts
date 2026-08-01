import type { Service } from '../../../types/services';
import { getServiceImageUrl } from '../../../lib/storage';
import Clock from '~icons/lucide/clock';
import Truck from '~icons/lucide/truck';
import Users from '~icons/lucide/users';

export const competePages: Service[] = [
  {
    id: 'post-office-alternative-fairport-harbor',
    category: 'pack-ship',
    city: 'Fairport Harbor',
    serviceName: 'Post Office Alternative \u2014 Fairport Harbor',
    slug: '/post-office-alternative-fairport-harbor',
    canonicalUrl: 'https://mailboxplusohio.com/post-office-alternative-fairport-harbor',
    pageTitle: 'Post Office Alternative in Fairport Harbor, OH | Mailbox Plus',
    metaDescription:
      'Fairport Harbor Post Office closes at 4:30PM. Mailbox Plus is your Post Office Alternative with all 4 carriers — open later, walk-in notary, faster service.',
    keywords:
      'post office alternative Fairport Harbor OH, USPS alternative, Mailbox Plus, shipping',
    heroTitle: 'The Best Post Office Alternative in Fairport Harbor: Mailbox Plus',
    heroSubtitle:
      'Lake Erie village \u2014 seasonal tourism doubles population. Post office has limited hours (8:30-4:30). Only USPS available. No UPS Store or FedEx.',
    heroImage: getServiceImageUrl('/images/usps-services.webp'),
    features: [
      {
        title: 'Faster Service',
        description:
          'We pride ourselves on quick, efficient transactions \u2014 no post office lines.',
        icon: Clock,
      },
      {
        title: 'Carrier Flexibility',
        description:
          'USPS, UPS, FedEx, DHL \u2014 all at one counter. Compare rates and pick the best.',
        icon: Truck,
      },
      {
        title: 'Customer Service',
        description: 'Personalized, local assistance \u2014 not a corporate franchise.',
        icon: Users,
      },
    ],
    content: [
      {
        heading: 'The Best Post Office Alternative in Fairport Harbor: Mailbox Plus',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Fairport Harbor is a charming Lake Erie village where the population doubles in summer \u2014 but the local post office closes at 4:30 PM and only offers USPS. There's no UPS Store, no FedEx Office, and no multi-carrier shipping option in town.</p>
<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Mailbox Plus is your full-service <a href="/pack-ship/usps-services" class="text-[var(--color-primary)] hover:underline"><strong>Post Office alternative in Fairport Harbor, Ohio</strong></a>. We offer <strong>USPS, UPS, FedEx, and DHL</strong> shipping from one counter \u2014 plus walk-in notary, stamp sales, printing, and private mailbox rentals with seasonal mail holding. Just 12 minutes from Fairport Harbor at 7554 Fredle Drive.</p>`,
      },
      {
        heading: 'Why Choose Mailbox Plus Over the Post Office in Fairport Harbor?',
        body: `
          <ul class="space-y-4 my-6">
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Faster Service:</strong> Quick, efficient transactions \u2014 no post office lines, no waiting.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Multi-Carrier Choice:</strong> UPS, FedEx, DHL alongside USPS \u2014 compare rates at one counter.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Convenient Location:</strong> Just 12 minutes from Fairport Harbor at 7554 Fredle Drive.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Extended Hours:</strong> Open after the Fairport Harbor Post Office closes at 4:30 PM.</div>
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
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>USPS Priority Mail, Express, First Class & International</strong> \u2014 all USPS services at retail rates.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Certified Mail with Return Receipt</strong> \u2014 for important legal and business documents.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><a href="/home-business/mailbox-rental" class="text-[var(--color-primary)] hover:underline"><strong>Private Mailbox Rentals</strong></a> — with seasonal mail holding for Fairport Harbor's summer residents.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Stamp Sales, Walk-in Notary, Printing & Packing Supplies</strong> \u2014 all the services you need in one trip.</div>
            </li>
          </ul>`,
      },
    ],
    faqs: [
      {
        question: 'Are your USPS prices the same as the Post Office?',
        answer:
          'We offer competitive pricing on all USPS services, often matching retail rates for convenience. We also compare rates across UPS, FedEx, and DHL so you always get the best option.',
      },
      {
        question: 'Can I rent a mailbox here?',
        answer:
          "Yes! We offer secure private mailbox rentals with real street addresses at 7554 Fredle Drive \u2014 and we can hold your mail during the off-season if you're a seasonal Fairport Harbor resident.",
      },
      {
        question: 'Do you offer Certified Mail?',
        answer:
          'Yes, we can help you send letters via Certified Mail with Return Receipt, just like the Post Office.',
      },
      {
        question: "Can you hold my mail while I'm away for the season?",
        answer:
          "Yes! If you rent a private mailbox with us, we can hold your mail while you're away and forward it when needed \u2014 perfect for seasonal Fairport Harbor residents.",
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
    cta: {
      title: 'Visit Us \u2014 Fairport Harbor Is Just Minutes Away',
      subtitle:
        'One counter, four carriers, and all the services you need. No appointment necessary.',
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    hideCarrierLogos: true,
  },
];
