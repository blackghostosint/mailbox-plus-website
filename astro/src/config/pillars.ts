import type { AnchorTextConfig, InternalLinkConfig } from '../types/services';

export interface PillarConfig {
  id: string;
  title: string;
  url: string;
  description: string;
  categoryFilter?: string | string[];
  internalLink?: InternalLinkConfig;
  anchorText?: AnchorTextConfig;
}

export interface SubSupportingConfig {
  id: string;
  url: string;
  title: string;
  internalLink?: InternalLinkConfig;
  anchorText?: AnchorTextConfig;
}

export interface StandaloneSeoLandingConfig {
  id: string;
  url: string;
  title: string;
  internalLink?: InternalLinkConfig;
  anchorText?: AnchorTextConfig;
}

export const pillarConfigs: PillarConfig[] = [
  {
    id: 'pack-ship',
    title: 'Pack & Ship',
    url: '/pack-ship',
    description: 'Professional packing and shipping services with FedEx, UPS, USPS, and DHL.',
    categoryFilter: 'pack-ship',
    internalLink: {
      parent: null,
      related: [
        'fedex-shipping',
        'ups-shipping',
        'usps-services',
        'dhl-express',
        'professional-packing',
        'packaging-supplies',
        'package-drop-offs',
        'ship-a-fragile-item-safely-in-concord-township-glass-ceramics-electronics',
        'ship-a-heavy-package-in-concord-township-over-50-lbs-wont-get-rejected',
        'print-amazon-return-label',
        'print-return-label-without-printer',
        'return-without-original-box',
        'package-a-return-so-its-accepted-by-the-carrier',
        'ship-an-odd-shaped-or-oversized-item-in-concord-township-guitars-lamps-sports-equipment',
        'unsure-of-carrier-rules',
        'mailing-services-concord-ohio',
        'ship-return-strict-size-weight-limits',
        'pickup-hours',
      ],
      priority: true,
    },
    anchorText: {
      exact: ['Pack & Ship', 'Packing and Shipping'],
      lsi: ['shipping services', 'parcel delivery', 'shipping store', 'send a package'],
      geo: ['shipping store in Concord Township', 'pack and ship near Mentor'],
    },
  },
  {
    id: 'copy-print',
    title: 'Copy & Print',
    url: '/copy-print',
    description: 'High-quality printing, copying, and graphic design services.',
    categoryFilter: 'copy-print',
    internalLink: {
      parent: null,
      related: [
        'document-printing',
        'business-cards',
        'flyers-brochures',
        'posters-printing',
        'postcard-printing',
        'graphic-design',
        'copies',
        'office-depot-alternative-concord-township',
      ],
      priority: true,
    },
    anchorText: {
      exact: ['Copy & Print', 'Copy and Print Services', 'Printing Center'],
      lsi: [
        'printing services',
        'copy center',
        'digital printing',
        'professional printing',
        'document solutions',
      ],
      geo: [
        'copy and print in Concord Township',
        'printing center near Mentor',
        'copy services in Lake County',
      ],
    },
  },
  {
    id: 'home-business',
    title: 'Home & Business',
    url: '/home-business',
    description: 'Essential business services including mailbox rentals, shredding, and scanning.',
    categoryFilter: [
      'mailbox-rentals',
      'document-services',
      'notary-services',
      'additional-services',
    ],
    internalLink: {
      parent: null,
      related: [
        'mailbox-rental',
        'digital-mailbox-rental',
        'notary-services',
        'shredding',
        'document-scanning',
        'fax-services',
        'every-door-direct-mail',
      ],
      priority: true,
    },
    anchorText: {
      exact: ['Home & Business Services', 'Business Services Center'],
      lsi: [
        'small business services',
        'office services',
        'business support',
        'professional services',
      ],
      geo: [
        'business services in Concord Township',
        'office services near Mentor',
        'home business solutions in Lake County',
      ],
    },
  },
  {
    id: 'micro-problems',
    title: 'Micro Problems',
    url: '/vinted-drop-off',
    description: 'Solutions for common shipping and return problems.',
    categoryFilter: 'micro-problems',
    internalLink: {
      parent: null,
      related: ['pack-ship', 'copy-print', 'home-business', 'package-drop-offs'],
      priority: true,
    },
  },
  {
    id: 'specialty',
    title: 'Specialty Services',
    url: '/specialty/digital-fingerprinting',
    description: 'Specialized services including fingerprinting and insurance.',
    categoryFilter: 'specialty',
    internalLink: {
      parent: null,
      related: [
        'digital-fingerprinting',
        'insurance',
        'pack-ship',
        'home-business',
        'notary-services',
        'document-scanning',
      ],
      priority: true,
    },
    anchorText: {
      exact: ['Specialty Services', 'Specialized Business Services'],
      lsi: [
        'specialty business solutions',
        'professional fingerprinting',
        'shipping insurance',
        'unique business services',
      ],
      geo: [
        'specialty services in Concord Township',
        'specialized services near Mentor',
        'business services in Lake County',
      ],
    },
  },
  {
    id: 'geo-dropoffs',
    title: 'Drop-Off Locations',
    url: '/pack-ship/package-drop-offs',
    description: 'Carrier drop-off locations in Lake County and surrounding areas.',
    categoryFilter: 'geo-dropoffs',
    internalLink: {
      parent: null,
      related: [
        'fedex-shipping',
        'ups-shipping',
        'usps-services',
        'dhl-express',
        'happy-returns',
        'package-drop-offs',
      ],
      priority: true,
    },
  },
];

export const subSupportingConfigs: SubSupportingConfig[] = [
  {
    id: 'amazon-returns',
    url: '/amazon-returns',
    title: 'Amazon Return Guide',
    internalLink: {
      parent: 'pack-ship',
      related: [
        'package-drop-offs',
        'packaging-supplies',
        'fedex-easy-returns',
        'happy-returns',
        'fedex-shipping',
      ],
      priority: false,
    },
  },
  {
    id: 'fedex-easy-returns',
    url: '/fedex-easy-returns',
    title: 'FedEx Easy Returns',
    internalLink: {
      parent: 'pack-ship',
      related: [
        'fedex-shipping',
        'package-drop-offs',
        'amazon-returns',
        'happy-returns',
        'nuuly-returns',
      ],
      priority: false,
    },
  },
  {
    id: 'nuuly-returns',
    url: '/nuuly-returns',
    title: 'Nuuly Returns Guide',
    internalLink: {
      parent: 'pack-ship',
      related: ['happy-returns', 'amazon-returns', 'fedex-easy-returns', 'package-drop-offs'],
      priority: false,
    },
  },
  {
    id: 'happy-returns',
    url: '/happy-returns',
    title: 'Happy Returns Bar',
    internalLink: {
      parent: 'pack-ship',
      related: [
        'nuuly-returns',
        'amazon-returns',
        'fedex-easy-returns',
        'package-drop-offs',
        'happy-returns-willoughby',
        'happy-returns-mentor',
        'happy-returns-painesville',
        'happy-returns-eastlake',
        'happy-returns-kirtland',
        'happy-returns-chardon',
        'happy-returns-madison',
        'happy-returns-fairport-harbor',
      ],
      priority: false,
    },
  },
  {
    id: 'pickup-hours',
    url: '/pickup-hours',
    title: 'Carrier Pickup Hours',
    internalLink: {
      parent: 'pack-ship',
      related: ['fedex-shipping', 'ups-shipping', 'usps-services', 'dhl-express'],
      priority: false,
    },
  },
  {
    id: 'shipping-partners',
    url: '/shipping-partners',
    title: 'Shipping Partners',
    internalLink: {
      parent: 'pack-ship',
      related: ['pack-ship', 'copy-print', 'home-business', 'package-drop-offs'],
      priority: true,
    },
  },
];

export const standaloneSeoLandingConfigs: StandaloneSeoLandingConfig[] = [
  {
    id: 'mailbox-rental-concord-ohio',
    url: '/mailbox-rental-concord-ohio',
    title: 'Mailbox Rental Concord Ohio',
    internalLink: {
      parent: 'home-business',
      related: [
        'mailbox-rental',
        'digital-mailbox-rental',
        'private-mailbox-rental-concord-township',
      ],
      priority: false,
    },
  },
  {
    id: 'private-mailbox-rental',
    url: '/private-mailbox-rental',
    title: 'Private Mailbox Rental',
    internalLink: {
      parent: 'home-business',
      related: [
        'mailbox-rental',
        'private-mailbox-rental-concord-township',
        'private-mailbox-rental-lake-county',
        'mailbox-rental-concord-ohio',
        'package-receiving',
      ],
      priority: true,
    },
  },
];
