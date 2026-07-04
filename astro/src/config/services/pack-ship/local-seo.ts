import Clock from '~icons/lucide/clock';
import Users from '~icons/lucide/users';
import FileText from '~icons/lucide/file-text';
import Truck from '~icons/lucide/truck';
import MapPin from '~icons/lucide/map-pin';
import Star from '~icons/lucide/star';
import Shield from '~icons/lucide/shield';
import Box from '~icons/lucide/box';
import { Service } from '../../../types/services';
import { getServiceImageUrl } from '../../../lib/storage';

export const localSeoServices: Service[] = [
  {
    id: 'ups-drop-off-alternative-concord-township',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'UPS Drop Off Alternative',
    slug: '/ups-drop-off-alternative-concord-township',
    pageTitle: 'UPS Drop Off Alternative in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'The best UPS Drop Off Alternative in Concord Township. Fast, friendly drop-off service for UPS, FedEx, USPS, and DHL packages. Skip the lines.',
    keywords: 'UPS drop off, Concord Township, Mailbox Plus, shipping',
    heroTitle: 'Convenient UPS Drop Off in Concord Township: Mailbox Plus',
    heroSubtitle:
      'Looking for a quick and easy UPS drop-off location in Concord Township, Ohio? Mailbox Plus is your local solution.',
    heroImage: getServiceImageUrl('/images/ups-shipping.webp'),
    content: [
      {
        heading: 'Convenient UPS Drop Off in Concord Township: Mailbox Plus',
        body: 'Looking for a quick and easy <a href="/pack-ship/ups-authorized-shipper-outlet" class="text-[var(--color-primary)] hover:underline"><strong>UPS drop-off location in Concord Township, Ohio</strong></a>? \nMailbox Plus is your local solution. As an authorized shipping outlet, we accept all pre-labeled UPS packages. \nSkip the long lines at The UPS Store and drop off your packages with us in seconds. We also offer \n<a href="/pack-ship/package-drop-offs" class="text-[var(--color-primary)] hover:underline"><strong> FedEx, USPS, and DHL</strong> services</a>, making us the ultimate hub for all your shipping needs.',
      },
      {
        heading: 'Why Mailbox Plus is Better for Drop Offs',
        body: `
                    <ul class="space-y-4 my-6">
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Speed:</strong> In and out fast so you can get back to your day.</div>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">No Waiting:</strong> Avoid the crowds and long lines typical of franchise stores.</div>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Receipts:</strong> We provide a drop-off receipt for tracking and peace of mind.</div>
                        </li>
                    </ul>
                `,
      },
      {
        heading: 'Your Local Shipping Center',
        body: `
                    <ul class="space-y-4 my-6">
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Multi-Carrier:</strong> We accept drop-offs for UPS, FedEx and USPS packages.</div>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Packing Help:</strong> Professional supplies and expertise available on-site.</div>
                        </li>
                    </ul>
                `,
      },
    ],
    features: [
      {
        title: 'Speed',
        description: 'We get you in and out fast so you can get back to your day.',
        icon: Clock,
      },
      {
        title: 'No Waiting',
        description: 'Avoid the crowds and long lines typical of franchise stores.',
        icon: Users,
      },
      {
        title: 'Receipts',
        description: 'We provide a drop-off receipt for tracking and peace of mind.',
        icon: FileText,
      },
    ],
    faqs: [
      {
        question: 'Is there a fee to drop off packages?',
        answer: 'No, there is no fee for dropping off pre-labeled UPS packages.',
      },
      {
        question: 'Do you provide a receipt?',
        answer: 'Yes, we will scan your package and provide a receipt for tracking.',
      },
      {
        question: 'Can I drop off after hours?',
        answer: 'No, for security reasons, packages must be dropped off during our business hours.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
  {
    id: 'ups-store-alternative-concord-township',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'UPS Store Alternative',
    slug: '/ups-store-alternative-concord-township',
    pageTitle: 'UPS Store Alternative in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Looking for a UPS Store Alternative in Concord Township? We offer UPS, FedEx, USPS, and DHL shipping at one counter \u2014 mailbox rentals, printing, notary. Locally owned, faster service.',
    keywords: 'UPS Store alternative, Concord Township, Mailbox Plus, shipping',
    heroTitle: 'Similar to the UPS Store, But With All 4 Carriers \u2014 and Shorter Lines',
    heroSubtitle:
      'UPS, FedEx, USPS, and DHL at one counter. Mailbox rentals, printing, notary, and packing services. Locally owned, faster service, same convenience.',
    heroImage: getServiceImageUrl('/images/ups-shipping.webp'),
    content: [
      {
        heading:
          'Looking for a UPS Store in Concord Township? We Do Everything They Do \u2014 Plus More',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              If you're searching for a <strong>UPS Store in Concord Township</strong>, you've probably been there before \u2014 the line, the franchise pricing, and the fact that they can only ship UPS. What if you could walk into a place that offers everything The UPS Store does, but also gives you access to FedEx, USPS, and DHL?
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              That's Mailbox Plus. We are your locally owned <strong>UPS Store alternative in Concord Township, Ohio</strong>. We offer the same UPS authorized shipping, <a href="/home-business/mailbox-rental" class="text-[var(--color-primary)] hover:underline">mailbox rentals</a>, <a href="/copy-print" class="text-[var(--color-primary)] hover:underline">printing</a>, and <a href="/home-business/notary-services" class="text-[var(--color-primary)] hover:underline">notary services</a> \u2014 plus we can ship FedEx, USPS, and DHL too. One counter, four carriers, faster service.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              And since we're locally owned, you get personalized service with shorter wait times. No franchise overhead, no pressure to use one carrier.
            </p>`,
      },
      {
        heading: "The Multi-Carrier Advantage: What the Franchise Can't Offer",
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              The UPS Store can only sell you UPS. If FedEx or USPS would be cheaper or faster for your shipment, they can't tell you that. At Mailbox Plus, <strong>we compare rates across all 4 major carriers</strong> and recommend the best option for your budget and timeline.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Need to drop off a pre-labeled FedEx package alongside a UPS return? No problem. We accept drop-offs for all carriers at the same counter.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              The UPS Store is great for UPS. Mailbox Plus is great for everything.
            </p>`,
      },
      {
        heading: 'Why Mailbox Plus is the Better Choice',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Faster Service</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We prioritize efficiency so you can get in and out quickly. No franchise wait times.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Multi-Carrier Options</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">UPS, FedEx, USPS, DHL \u2014 all at one counter. Compare rates before you ship.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Locally Owned</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Part of the Concord Township community. Friendly faces, no corporate bureaucracy.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Full Service Center</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Mailboxes, notary, printing, packing, shredding \u2014 all in one trip.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Services We Offer',
        body: `<div class="grid md:grid-cols-3 gap-6 my-8">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Shipping &amp; Packing</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Authorized for UPS, FedEx, USPS, and DHL with professional packing services. We help you choose the best carrier for every package.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Business Services</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Private mailbox rental, notary public, faxing, scanning, and secure shredding \u2014 everything a small business needs.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Printing &amp; Copying</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Color and B&W copies, business cards, flyers, document finishing \u2014 same services as the big print shops.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
    ],
    features: [
      {
        title: 'Faster Service',
        description: 'We prioritize efficiency so you can get in and out quickly.',
        icon: Clock,
      },
      {
        title: 'Multi-Carrier Options',
        description: 'We ship with UPS, FedEx, USPS, and DHL.',
        icon: Truck,
      },
      {
        title: 'Local Ownership',
        description: 'We are part of the Concord Township community.',
        icon: MapPin,
      },
    ],
    faqs: [
      {
        question: 'Can I ship FedEx or USPS at Mailbox Plus?',
        answer:
          'Yes! Unlike The UPS Store, we are an authorized shipping center for FedEx, USPS, UPS, and DHL, giving you more choices.',
      },
      {
        question: 'Do you offer notary services?',
        answer:
          'Absolutely. We have a commissioned notary public on-site to help with your legal documents. No appointment needed!',
      },
      {
        question: 'Is Mailbox Plus locally owned?',
        answer:
          'Yes, we are a locally owned and operated independent business in Concord Township, committed to excellent customer service.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
  {
    id: 'mail-boxes-etc-alternative-concord-township',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Mail Boxes Etc. Alternative',
    slug: '/mail-boxes-etc-alternative-concord-township',
    pageTitle: 'Mail Boxes Etc. Alternative in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'The premier Mail Boxes Etc. Alternative in Concord Township. Full-service packing, shipping, and business services. Locally owned and operated.',
    keywords: 'Mail Boxes Etc. alternative, Concord Township, Mailbox Plus, shipping',
    heroTitle: 'The Best Mail Boxes Etc. Alternative in Concord Township: Mailbox Plus',
    heroSubtitle:
      'Mailbox Plus fills the gap as your premier local solution for comprehensive shipping and business services.',
    heroImage: getServiceImageUrl('/images/pack-ship.webp'),
    content: [
      {
        heading: 'The Premier Choice',
        body: 'If you\u2019re searching for a <strong>Mail Boxes Etc. alternative in Concord Township, Ohio</strong>, look no further than Mailbox Plus. While the Mail Boxes Etc. brand has transitioned, the need for comprehensive <a href="/pack-ship" class="text-[var(--color-primary)] hover:underline">shipping</a> remains. Mailbox Plus fills that gap as your premier local solution.',
      },
      {
        heading: 'Multi-Carrier Flexibility',
        body: 'We offer <strong>UPS, FedEx, USPS, and DHL</strong> shipping, <a href="/home-business/mailbox-rental" class="text-[var(--color-primary)] hover:underline">private mailbox rentals</a>, and professional printing. We provide the personalized care and carrier flexibility that modern businesses and residents demand. Skip the confusion and choose the clear local leader: Mailbox Plus.',
      },
      {
        heading: 'Why Choose Mailbox Plus?',
        body: `
                    <ul class="space-y-4 my-6">
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Faster Service:</strong> We value your time and ensure a quick, efficient experience.</div>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Multi-Carrier Options:</strong> Access to UPS, FedEx, USPS, and DHL in one place.</div>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Local Ownership:</strong> Proud members of the Concord Township community.</div>
                        </li>
                    </ul>
                `,
      },
      {
        heading: 'Complete Business & Shipping Solutions',
        body: `
                    <ul class="space-y-4 my-6">
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Mailbox Rentals:</strong> Secure private mailboxes with a real street address.</div>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Printing & Notary:</strong> Full range of business support services on-site.</div>
                        </li>
                    </ul>
                `,
      },
    ],
    features: [
      { title: 'Modern Services', description: 'Up-to-date Technology', icon: Star },
      { title: 'Carrier Choice', description: 'All Major Carriers', icon: Truck },
      { title: 'Community Focus', description: 'Locally Owned & Operated', icon: Users },
    ],
    faqs: [
      {
        question: 'Do you offer the same services as Mail Boxes Etc.?',
        answer:
          'Yes, and more! We offer comprehensive packing, shipping, printing, and business services with modern efficiency.',
      },
      {
        question: 'Can I rent a mailbox here?',
        answer:
          'Yes, we offer private mailbox rentals with a real street address, ensuring security and professionalism for your mail.',
      },
      {
        question: 'What carriers do you support?',
        answer:
          'We support all major carriers: UPS, FedEx, USPS, and DHL, giving you the power of choice.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
  {
    id: 'fedex-office-alternative-concord-township',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'FedEx Office Alternative',
    slug: '/fedex-office-alternative-concord-township',
    pageTitle: 'FedEx Office Alternative in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Your local FedEx Office Alternative in Concord Township. Authorized FedEx shipping, printing, and business services. Compare rates with UPS and USPS at one counter.',
    keywords: 'FedEx Office alternative, Concord Township, Mailbox Plus, shipping',
    heroTitle: 'Similar to FedEx Office, But You Can Also Compare UPS, USPS, and DHL Rates',
    heroSubtitle:
      'Authorized FedEx shipping, professional printing, and business services \u2014 plus carrier rate comparison at the same counter.',
    heroImage: getServiceImageUrl('/images/fedex-shipping.webp'),
    content: [
      {
        heading: 'Searching for FedEx Office in Concord Township?',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              If you're looking for a FedEx Office in Concord Township, you know what to expect \u2014 FedEx shipping only, corporate pricing, and long lines during peak hours. But what if you could get everything FedEx Office offers, plus the ability to compare rates across all major carriers?
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Mailbox Plus is your <strong>FedEx Office alternative in Concord Township, Ohio</strong>. We are an authorized FedEx shipping center with <a href="/copy-print" class="text-[var(--color-primary)] hover:underline">professional printing</a>, packing services, and business support \u2014 but unlike FedEx Office, we also ship <strong>UPS, USPS, and DHL</strong>. Compare options to find the best rate and delivery speed for every package.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Same FedEx shipping. Same printing services. But with four carrier choices, shorter lines, and a locally owned atmosphere.
            </p>`,
      },
      {
        heading: 'Why Mailbox Plus Beats the Big Box',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Faster Service</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Skip the long lines typical of big box stores. We move you through quickly.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Multi-Carrier Choice</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Compare rates across FedEx, UPS, USPS, and DHL. FedEx Office can't do that.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Print &amp; Copy</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Professional document finishing, business cards, and full-color printing on-site.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Office Services</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Notary public, faxing, scanning, secure shredding \u2014 everything a small business needs.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Your One-Stop Business Center',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Printing &amp; Copying</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Color and B&W copies, business cards, flyers, and document finishing \u2014 same quality as the big print shops.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Shipping &amp; Packing</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">FedEx, UPS, USPS, DHL \u2014 we compare rates so you get the best option. Professional packing available.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
    ],
    features: [
      { title: 'Carrier Variety', description: 'FedEx, UPS, USPS, DHL', icon: Truck },
      { title: 'Price Comparison', description: 'Shop rates across carriers', icon: Shield },
      { title: 'Convenience', description: 'Quick In & Out', icon: Clock },
    ],
    faqs: [
      {
        question: 'Can I drop off pre-labeled FedEx packages?',
        answer: 'Yes! We accept drop-offs for FedEx as well as UPS and USPS packages.',
      },
      {
        question: 'Do you offer printing services like FedEx Office?',
        answer:
          'Yes, we offer a full range of copying and printing services, including business cards, flyers, and document finishing.',
      },
      {
        question: 'Is there a notary on site?',
        answer: 'Yes, we have a commissioned notary public available during all business hours.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
  {
    id: 'post-office-alternative-concord-township',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Post Office Alternative',
    slug: '/post-office-alternative-concord-township',
    pageTitle: 'Post Office Alternative in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Skip the Post Office lines! We are your Post Office Alternative in Concord Township. Authorized USPS shipping, stamps, and mail services.',
    keywords: 'Post Office alternative, Concord Township, Mailbox Plus, shipping',
    heroTitle: 'The Best Post Office Alternative in Concord Township: Mailbox Plus',
    heroSubtitle:
      'Mailbox Plus offers all the essential shipping services you need in a friendly, customer-focused environment.',
    heroImage: getServiceImageUrl('/images/usps-services.webp'),
    content: [
      {
        heading: 'The Best Post Office Alternative in Concord Township: Mailbox Plus',
        body: 'Tired of the long lines and limited hours at the local Post Office? \nMailbox Plus is the premier <a href="/pack-ship/usps-services" class="text-[var(--color-primary)] hover:underline"><strong>Post Office alternative in Concord Township, Ohio</strong></a>. \nWe offer all the essential shipping services you need\u2014including <strong>USPS, UPS, FedEx, and DHL</strong>\u2014in a friendly, \ncustomer-focused environment. From certified mail to package drop-offs and <a href="/pack-ship/postage-stamps" class="text-[var(--color-primary)] hover:underline">stamp sales</a>, we handle it all with speed \nand efficiency. Experience the difference of a shipping center that puts you first.',
      },
      {
        heading: 'Why Choose Mailbox Plus Over the Post Office?',
        body: `
                    <ul class="space-y-4 my-6">
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Faster Service:</strong> We pride ourselves on quick, efficient transactions.</div>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Multi-Carrier Choice:</strong> Access to UPS, FedEx, and DHL for when USPS isn't the best fit.</div>
                        </li>
                    </ul>
                `,
      },
      {
        heading: 'Complete Shipping & Postal Services',
        body: `
                    <ul class="space-y-4 my-6">
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">USPS Shipping:</strong> Priority Mail, Express, First Class, and International.</div>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-1 bg-[var(--color-bg-blue-tint)] p-1.5 rounded-full text-[var(--color-primary)] shrink-0 border border-[var(--color-border-blue)]">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div class="text-[var(--color-text-primary)] leading-relaxed"><strong class="text-[var(--color-text-primary)]">Private Mailboxes:</strong> Secure mailboxes with real street addresses.</div>
                        </li>
                    </ul>
                `,
      },
    ],
    features: [
      {
        title: 'Faster Service',
        description: 'We pride ourselves on quick, efficient transactions.',
        icon: Clock,
      },
      { title: 'Carrier Flexibility', description: 'USPS, UPS, FedEx, DHL', icon: Truck },
      { title: 'Customer Service', description: 'Personalized Assistance', icon: Users },
    ],
    faqs: [
      {
        question: 'Are your USPS prices the same as the Post Office?',
        answer:
          'We offer competitive pricing on all USPS services, often matching retail rates for convenience.',
      },
      {
        question: 'Can I renew my PO Box here?',
        answer:
          'If you rent a private mailbox with us, yes! We offer secure mailbox rentals with real street addresses.',
      },
      {
        question: 'Do you offer Certified Mail?',
        answer:
          'Yes, we can help you send letters via Certified Mail with Return Receipt, just like the Post Office.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
  {
    id: 'shipping-center-concord-township',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Shipping Center',
    slug: '/shipping-center-concord-township',
    pageTitle: 'Shipping Center in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Full-service shipping center in Concord Township. UPS, FedEx, USPS, and DHL services under one roof. Packing, printing, and mailbox rentals.',
    keywords: 'shipping center, Concord Township, Lake County',
    heroTitle: 'Local Shipping Center in Concord Township',
    heroSubtitle: 'Complete shipping, packing, and business services. Four carriers, one location.',
    heroImage: getServiceImageUrl('/images/pack-ship.webp'),
    content: [
      {
        heading: 'Your Complete Shipping Center',
        body: 'Conveniently located in Concord Township, Mailbox Plus is a full-service shipping center offering a complete range of services for individuals and small businesses. From packing and shipping to printing and mailbox rentals, we handle it all under one roof.',
      },
      {
        heading: 'Everything From One Counter',
        body: 'We offer shipping services for <strong>UPS, FedEx, USPS, and DHL</strong> at one counter. Our trained staff can help you choose the right service and packing materials for your needs.',
      },
      {
        heading: 'Learn More',
        body: 'Visit our <a href="/pack-ship" class="text-[var(--color-primary)] hover:underline">Pack & Ship services page</a> to learn more about all the shipping services we offer in Concord Township.',
      },
    ],
    features: [
      { title: 'All Carriers', description: 'UPS, FedEx, USPS, DHL', icon: Truck },
      { title: 'Local Service', description: 'Concord Township', icon: MapPin },
      { title: 'One-Stop', description: 'Packing, Printing, Mailboxes', icon: Box },
    ],
    faqs: [
      {
        question: 'What services does your shipping center offer?',
        answer:
          'We offer full-service shipping for UPS, FedEx, USPS, and DHL, as well as professional packing services.',
      },
      {
        question: 'Do you provide packing services?',
        answer:
          'Yes, our team provides professional packing using high-quality materials to ensure your items arrive safely.',
      },
      {
        question: 'Can I rent a mailbox?',
        answer: 'Yes, we offer private mailbox rentals with a real street address.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
  {
    id: 'staples-printing-alternative-concord-township',
    category: 'copy-print',
    city: 'Concord Township',
    serviceName: 'Staples Printing Alternative',
    slug: '/staples-printing-alternative-concord-township',
    pageTitle: 'Staples Printing Alternative in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Looking for a Staples Printing alternative in Concord Township? We offer color and B&W copies, business cards, flyers, and document finishing. Quick turnaround, friendly service.',
    keywords: 'Staples printing alternative, Concord Township, Mailbox Plus, printing services',
    heroTitle: 'The Best Staples Printing Alternative in Concord Township: Mailbox Plus',
    heroSubtitle:
      'Full-service printing and copying \u2014 color and B&W \u2014 without the big-box experience.',
    heroImage: getServiceImageUrl('/images/copy-print.webp'),
    content: [
      {
        heading: 'The Best Staples Printing Alternative in Concord Township: Mailbox Plus',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Need printing or copying and don't want to trek to Staples? Mailbox Plus is your <strong>Staples Printing alternative in Concord Township, Ohio</strong>. We offer the same professional printing services \u2014 color and B&W copies, business cards, flyers, and document finishing \u2014 without the big-box store experience.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Walk in, hand us your documents, and we handle the rest. Quick turnaround, competitive pricing, and friendly service from your local business center.
            </p>`,
      },
      {
        heading: 'Why Choose Mailbox Plus Over Staples?',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Faster Service</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">No wandering aisles looking for the copy center. Walk in, hand us your documents, we handle the rest.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Full Print Services</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Color and B&W copies, business cards, flyers, posters, and document finishing \u2014 same services as the big print shops.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Multi-Erand Ready</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Print, ship, notarize, shred \u2014 all in one trip. Staples can't match that convenience.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Local &amp; Personalized</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We know our customers by name. No corporate runaround, just friendly local service.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
    ],
    features: [
      { title: 'Quick Turnaround', description: 'Same-day printing and copying', icon: Clock },
      { title: 'Full Service', description: 'Color, B&W, finishing', icon: Star },
      { title: 'Local Convenience', description: 'Concord Township', icon: MapPin },
    ],
    faqs: [
      {
        question: 'Can you print from a USB drive?',
        answer:
          'Yes, simply bring your files on a USB drive or email them to us for quick printing.',
      },
      {
        question: 'Do you offer color printing?',
        answer: 'Yes, we offer both color and black-and-white printing and copying services.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
  {
    id: 'office-depot-alternative-concord-township',
    category: 'copy-print',
    city: 'Concord Township',
    serviceName: 'Office Depot Alternative',
    slug: '/office-depot-alternative-concord-township',
    pageTitle: 'Office Depot Alternative in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Your local Office Depot Alternative in Concord Township. Printing, copying, shipping, and office services \u2014 all under one roof with personalized service.',
    keywords: 'Office Depot alternative, Concord Township, Mailbox Plus, printing services',
    heroTitle: 'The Best Office Depot Alternative in Concord Township: Mailbox Plus',
    heroSubtitle:
      'Printing, copying, shipping, notary, and mailbox services \u2014 without the big-box trip.',
    heroImage: getServiceImageUrl('/images/copy-print.webp'),
    content: [
      {
        heading: 'The Best Office Depot Alternative in Concord Township: Mailbox Plus',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Sure, Office Depot has printing. But you also have to navigate a giant store, wait in line, and only get printing and shipping. What if you could do all of that \u2014 plus notarize, shred, and rent a mailbox \u2014 in one efficient trip?
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Mailbox Plus is your <strong>Office Depot alternative in Concord Township, Ohio</strong>. We offer professional <a href="/copy-print" class="text-[var(--color-primary)] hover:underline">printing and copying</a>, <a href="/pack-ship" class="text-[var(--color-primary)] hover:underline">shipping with all 4 major carriers</a>, <a href="/home-business/notary-services" class="text-[var(--color-primary)] hover:underline">notary services</a>, <a href="/home-business/shredding" class="text-[var(--color-primary)] hover:underline">shredding</a>, and <a href="/home-business/mailbox-rental" class="text-[var(--color-primary)] hover:underline">mailbox rentals</a> \u2014 all under one roof. One stop for everything Office Depot offers, plus services they don't.
            </p>`,
      },
      {
        heading: 'Why Choose Mailbox Plus Over Office Depot?',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">One-Stop Convenience</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Print, ship, notarize, shred, and mailbox services \u2014 all at one counter. No walking across a giant store.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Personalized Service</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We know our customers. No corporate runaround, just friendly local help.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Multi-Carrier Shipping</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">UPS, FedEx, USPS, DHL \u2014 compare rates at our counter. Office Depot only ships FedEx.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Faster In &amp; Out</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">In and out in minutes. No navigating aisles or waiting in long checkout lines.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
    ],
    features: [
      {
        title: 'One-Stop',
        description: 'Printing, shipping, notary, shredding, mailboxes',
        icon: Star,
      },
      { title: 'Carrier Choice', description: 'UPS, FedEx, USPS, DHL', icon: Truck },
      { title: 'Local Service', description: 'Concord Township', icon: MapPin },
    ],
    faqs: [
      {
        question: 'Do you offer printing like Office Depot?',
        answer:
          'Yes! We offer color and B&W printing, copying, business cards, flyers, and document finishing.',
      },
      {
        question: 'Can I ship packages here?',
        answer:
          'Absolutely. We ship with all major carriers \u2014 UPS, FedEx, USPS, and DHL \u2014 and help you compare rates.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
  {
    id: 'usps-drop-off-alternative-concord-township',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'USPS Drop Off Alternative',
    slug: '/usps-drop-off-alternative-concord-township',
    pageTitle: 'USPS Drop Off Alternative in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Looking for a USPS Drop Off Alternative in Concord Township? Avoid the post office line and drop off your USPS packages at Mailbox Plus.',
    keywords: 'USPS drop off, Concord Township, Mailbox Plus',
    heroTitle: 'The Best USPS Drop Off Alternative in Concord Township: Mailbox Plus',
    heroSubtitle:
      'Skip the post office line. Drop off pre-labeled USPS packages at our counter \u2014 fast, free, and friendly.',
    heroImage: getServiceImageUrl('/images/usps-services.webp'),
    content: [
      {
        heading: 'The Best USPS Drop Off Alternative in Concord Township: Mailbox Plus',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Need to drop off a USPS package but don't want to wait in the post office line? Mailbox Plus is your <strong>USPS drop-off alternative in Concord Township, Ohio</strong>. Bring your pre-labeled USPS package to our counter and we'll scan it in and hand you a receipt \u2014 in minutes, not minutes-plus-wait-in-line.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Need stamps? We carry them. Need to ship with another carrier? We offer FedEx, UPS, and DHL too. One stop for all your shipping needs.
            </p>`,
      },
      {
        heading: 'Why Choose Mailbox Plus Over the Post Office?',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">No Post Office Line</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Walk in, scan, receipt, done. Avoid the post office crowds entirely.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Multi-Carrier Convenience</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Bring your USPS, UPS, FedEx, and DHL packages together. One stop for all drop-offs.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Stamps &amp; Supplies</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Buy stamps, grab packing supplies, or get help with certified mail \u2014 all at our counter.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Drop-Off Receipt</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We scan every package and provide a receipt. No wondering if your return was accepted.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
    ],
    features: [
      { title: 'No Waiting', description: 'Skip the post office line', icon: Clock },
      { title: 'Multi-Carrier', description: 'USPS, UPS, FedEx, DHL', icon: Truck },
      { title: 'Stamps & More', description: 'Postage and packing supplies', icon: Star },
    ],
    faqs: [
      {
        question: 'Is there a fee to drop off USPS packages?',
        answer: 'No, there is no fee for dropping off pre-labeled packages at our counter.',
      },
      {
        question: 'Can I buy stamps here?',
        answer: 'Yes! We carry Forever Stamps and international postage at our counter.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
  {
    id: 'pack-and-ship-services-concord-township',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Pack and Ship Services',
    slug: '/pack-and-ship-services-concord-township',
    pageTitle: 'Pack and Ship Services in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Professional pack and ship services in Concord Township. We pack items right so they arrive safe. Authorized shipper for UPS, FedEx, USPS, and DHL.',
    keywords: 'pack and ship services, Concord Township, Mailbox Plus, shipping, packing',
    heroTitle: 'Pack and Ship Services in Concord Township: We Pack It Right So It Arrives Safe',
    heroSubtitle:
      'Fragile, valuable, or oddly shaped items? We pack, label, and ship with all 4 major carriers. One stop, done right.',
    heroImage: getServiceImageUrl('/images/professional-packing.webp'),
    hideCarrierLogos: true,
    content: [
      {
        heading: 'Why Leave Packing to Chance?',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You need to ship something. You grab a box from the closet, dig out the tape, and hope your packing skills hold up through the sorting machine.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>Professional packing is about knowing how sorting machines treat packages and which materials meet carrier standards.</strong> That's what we do at Mailbox Plus. We pack with carrier-compliant materials so your shipment is insurance-ready and arrives intact.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Bring your item in. We assess it, pack it right, and ship it with the carrier that fits your budget.
            </p>`,
      },
      {
        heading: 'Pack and Ship in Three Steps',
        body: `<div class="grid md:grid-cols-3 gap-6 my-8">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Bring Your Item</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Fragile, valuable, oddly shaped — we assess the best packing approach and carrier for your shipment.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Pack It Right</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Professional materials, carrier-compliant techniques, and insurance-ready packing — done on-site.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Pick the Best Carrier</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We compare UPS, FedEx, USPS, and DHL rates and recommend the best option for speed and cost.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Mailbox Plus vs. DIY Packing',
        body: `<div class="overflow-x-auto my-6">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th class="border-b-2 border-[var(--color-border)] p-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">Feature</th>
                                <th class="border-b-2 border-[var(--color-primary)] p-4 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">Mailbox Plus</th>
                                <th class="border-b-2 border-[var(--color-border)] p-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">DIY Packing</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="border-b border-[var(--color-border)] p-4 text-[var(--color-text-primary)] font-medium">Safety</td>
                                <td class="border-b border-[var(--color-border)] p-4 text-[var(--color-primary)]">Professional Standards</td>
                                <td class="border-b border-[var(--color-border)] p-4 text-[var(--color-text-secondary)]">Risk of Damage</td>
                            </tr>
                            <tr>
                                <td class="border-b border-[var(--color-border)] p-4 text-[var(--color-text-primary)] font-medium">Materials</td>
                                <td class="border-b border-[var(--color-border)] p-4 text-[var(--color-primary)]">Industrial Strength</td>
                                <td class="border-b border-[var(--color-border)] p-4 text-[var(--color-text-secondary)]">Consumer Grade</td>
                            </tr>
                            <tr>
                                <td class="border-b border-[var(--color-border)] p-4 text-[var(--color-text-primary)] font-medium">Insurance</td>
                                <td class="border-b border-[var(--color-border)] p-4 text-[var(--color-primary)]">Guarantee Eligible</td>
                                <td class="border-b border-[var(--color-border)] p-4 text-[var(--color-text-secondary)]">Claims often denied</td>
                            </tr>
                            <tr>
                                <td class="border-b border-[var(--color-border)] p-4 text-[var(--color-text-primary)] font-medium">Carrier Choice</td>
                                <td class="border-b border-[var(--color-border)] p-4 text-[var(--color-primary)]">UPS, FedEx, USPS, DHL</td>
                                <td class="border-b border-[var(--color-border)] p-4 text-[var(--color-text-secondary)]">One carrier, no choice</td>
                            </tr>
                        </tbody>
                    </table>
                </div>`,
        isFullWidth: true,
      },
      {
        heading: "Concord Township's Packing Experts",
        body: `<div class="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                    <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
                        Residents of <strong>Concord Township, Ohio</strong> rely on Mailbox Plus for all their packing and shipping needs. We also serve Mentor, Painesville, and Willoughby. Let us take the hassle out of shipping your gifts, returns, and business packages.
                    </p>
                </div>`,
        isFullWidth: true,
      },
    ],
    features: [
      {
        title: 'Expert Packing',
        description: 'We know exactly how to protect your items with carrier-compliant materials.',
        icon: Shield,
      },
      {
        title: 'Multi-Carrier',
        description: 'Ship via UPS, FedEx, USPS, or DHL — we compare rates for you.',
        icon: Truck,
      },
      {
        title: 'One-Stop Service',
        description: 'Drop off, pack, and ship all at the same counter. No extra trips.',
        icon: MapPin,
      },
    ],
    faqs: [
      {
        question: 'How much does packing cost?',
        answer:
          'The cost depends on the size, weight, and fragility of the item. Bring it in for a free quote!',
      },
      {
        question: 'Do I need to bring my own box?',
        answer:
          'No! We carry professional-grade boxes in a variety of sizes, plus custom box making for odd-shaped items.',
      },
      {
        question: 'What carriers do you use?',
        answer:
          'We ship with all 4 major carriers: UPS, FedEx, USPS, and DHL. We compare rates and recommend the best option for your shipment.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
  },
];
