import type { Service } from '../../../types/services';
import { getServiceImageUrl } from '../../../lib/storage';
import Clock from '~icons/lucide/clock';
import Truck from '~icons/lucide/truck';
import Users from '~icons/lucide/users';

export const competePages: Service[] = [
  {
    id: 'post-office-alternative-willoughby',
    category: 'pack-ship',
    city: 'Willoughby',
    serviceName: 'Post Office Alternative --- Willoughby',
    slug: '/post-office-alternative-willoughby',
    canonicalUrl: 'https://mailboxplusohio.com/post-office-alternative-willoughby',
    pageTitle: 'Post Office Alternative in Willoughby, OH | Mailbox Plus',
    metaDescription:
      'Skip the Willoughby Post Office line! Mailbox Plus is your Post Office Alternative with USPS, UPS, FedEx, and DHL — plus notary, printing, and mailbox rentals.',
    keywords: 'post office alternative Willoughby OH, USPS alternative, Mailbox Plus, shipping',
    heroTitle: 'The Best Post Office Alternative in Willoughby: Mailbox Plus',
    heroSubtitle:
      'Has both UPS Store and FedEx Office --- but both are corporate franchises. Differentiators: walk-in notary (vs by appointment), 4-carrier comparison, personal service, no long lines.',
    heroImage: getServiceImageUrl('/images/usps-services.webp'),
    features: [
      {
        title: 'Faster Service',
        description: 'Quick, efficient transactions --- no long lines, no waiting.',
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
        heading: 'The Best Post Office Alternative in Willoughby: Mailbox Plus',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Willoughby has both a UPS Store and a FedEx Office --- but they're corporate franchises with single-carrier service, appointment-only notary, and unpredictable wait times. The Willoughby Post Office has the usual long lines and limited hours.</p>
<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Mailbox Plus is your full-service <a href="/pack-ship/usps-services" class="text-[var(--color-primary)] hover:underline"><strong>Post Office alternative in Willoughby, Ohio</strong></a>. We offer <strong>USPS, UPS, FedEx, and DHL</strong> from one counter --- plus a walk-in notary available during all business hours (no appointment needed), stamp sales, printing, and private mailbox rentals. Just 6 minutes from Willoughby at 7554 Fredle Drive in Concord Township.</p>`,
      },
      {
        heading: 'Why Choose Mailbox Plus Over the Post Office in Willoughby?',
        body: `
          <ul class="space-y-4 my-6">
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Faster Service:</strong> Quick, efficient transactions --- no long lines at the Post Office.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Multi-Carrier Choice:</strong> UPS, FedEx, DHL alongside USPS --- the UPS Store and FedEx Office can only ship their own carrier.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Walk-in Notary:</strong> No appointment needed --- unlike the UPS Store in Willoughby, our notary is available during all business hours.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Convenient Location:</strong> Just 6 minutes from Willoughby at 7554 Fredle Drive --- often faster than driving across town to the UPS Store.</div>
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
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Certified Mail with Return Receipt</strong> --- for legal, business, and official correspondence.</div>
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
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Walk-in Notary, Stamp Sales, Printing & Packing Supplies</strong> --- everything you need, no appointment necessary.</div>
            </li>
          </ul>`,
      },
    ],
    faqs: [
      {
        question: 'Are your USPS prices the same as the Post Office?',
        answer:
          'We offer competitive pricing on all USPS services, often matching retail rates for convenience. And unlike the UPS Store, we can compare rates across all four carriers so you always get the best option.',
      },
      {
        question: 'Can I rent a mailbox here?',
        answer:
          'Yes! We offer secure private mailbox rentals with real street addresses at 7554 Fredle Drive.',
      },
      {
        question: 'Do I need an appointment for notary services?',
        answer:
          'No! Unlike the UPS Store in Willoughby, our notary is walk-in during all business hours --- no appointment needed.',
      },
      {
        question: 'How does Mailbox Plus compare to the UPS Store in Willoughby?',
        answer:
          'The UPS Store ships only UPS. We ship USPS, UPS, FedEx, and DHL from one counter, so you can compare rates and choose the best carrier. Plus our notary is walk-in (theirs is by appointment), and we offer personalized local service instead of corporate franchise service.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
    cta: {
      title: 'Visit Us --- Willoughby Is Just Minutes Away',
      subtitle:
        'One counter, four carriers, and all the services you need. No appointment necessary.',
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    hideCarrierLogos: true,
  },
];
