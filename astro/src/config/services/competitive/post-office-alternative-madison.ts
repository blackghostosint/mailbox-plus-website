import type { Service } from '../../../types/services';
import { getServiceImageUrl } from '../../../lib/storage';
import Clock from '~icons/lucide/clock';
import Truck from '~icons/lucide/truck';
import Users from '~icons/lucide/users';

export const competePages: Service[] = [
  {
    id: 'post-office-alternative-madison',
    category: 'pack-ship',
    city: 'Madison',
    serviceName: 'Post Office Alternative --- Madison',
    slug: '/post-office-alternative-madison',
    canonicalUrl: 'https://mailboxplusohio.com/post-office-alternative-madison',
    pageTitle: 'Post Office Alternative in Madison, OH | Mailbox Plus',
    metaDescription:
      'Madison has no shipping store. Mailbox Plus is your Post Office Alternative with all 4 carriers and mailbox rentals — just 15 minutes away in Concord.',
    keywords: 'post office alternative Madison OH, USPS alternative, Mailbox Plus, shipping',
    heroTitle: 'The Best Post Office Alternative in Madison: Mailbox Plus',
    heroSubtitle:
      'Easternmost Lake County town --- rural, 91% homeownership. No UPS Store, no FedEx Office. Only a post office and a single UPS drop box. Agricultural shipping needs.',
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
        heading: 'The Best Post Office Alternative in Madison: Mailbox Plus',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">Madison is the easternmost town in Lake County --- a rural community with 91% homeownership, rolling farmland, and no dedicated shipping store. The local post office is limited, and there's no UPS Store or FedEx Office anywhere nearby.</p>
<p class="text-lg text-[var(--color-text-primary)] leading-relaxed">Mailbox Plus is your full-service <a href="/pack-ship/usps-services" class="text-[var(--color-primary)] hover:underline"><strong>Post Office alternative in Madison, Ohio</strong></a>. We offer <strong>USPS, UPS, FedEx, and DHL</strong> shipping from one counter --- plus stamp sales, walk-in notary, packing supplies, and private mailbox rentals. Just 15 minutes from Madison at 7554 Fredle Drive in Concord Township.</p>`,
      },
      {
        heading: 'Why Choose Mailbox Plus Over the Post Office in Madison?',
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
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Convenient Location:</strong> Just 15 minutes from Madison at 7554 Fredle Drive.</div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Extended Hours:</strong> Open when the Madison Post Office may be closed --- more time to get things done.</div>
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
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Certified Mail with Return Receipt</strong> --- for important documents and legal correspondence.</div>
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
              <div class="text-[var(--color-text-primary)] leading-relaxed"><strong>Moving Supplies, Notary, Printing & Stamp Sales</strong> --- everything you need for a smooth move or errand run.</div>
            </li>
          </ul>`,
      },
    ],
    faqs: [
      {
        question: 'Are your USPS prices the same as the Post Office?',
        answer:
          'We offer competitive pricing on all USPS services, often matching retail rates for convenience. Plus we compare rates across UPS, FedEx, and DHL so you always get the best option.',
      },
      {
        question: 'Can I rent a mailbox here?',
        answer:
          'Yes! We offer secure private mailbox rentals with real street addresses at 7554 Fredle Drive --- ideal for Madison residents who want a mailing address closer to town.',
      },
      {
        question: 'Do you offer Certified Mail?',
        answer:
          'Yes, we can help you send letters via Certified Mail with Return Receipt, just like the Post Office.',
      },
      {
        question: 'How far is Mailbox Plus from Madison?',
        answer:
          'Mailbox Plus is located at 7554 Fredle Drive in Concord Township, just 15 minutes from Madison. We serve the entire Lake County area.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
    cta: {
      title: 'Visit Us --- Madison Is Just Minutes Away',
      subtitle:
        'One counter, four carriers, and all the services you need. No appointment necessary.',
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    hideCarrierLogos: true,
  },
];
