export interface PillarConfig {
  id: string;
  title: string;
  url: string;
  description: string;
  categoryFilter?: string | string[];
}

export interface SubSupportingConfig {
  id: string;
  url: string;
  title: string;
}

export interface StandaloneSeoLandingConfig {
  id: string;
  url: string;
  title: string;
}

export const pillarConfigs: PillarConfig[] = [
  {
    id: 'pack-ship',
    title: 'Pack & Ship',
    url: '/pack-ship',
    description: 'Professional packing and shipping services with FedEx, UPS, USPS, and DHL.',
    categoryFilter: 'pack-ship',
  },
  {
    id: 'copy-print',
    title: 'Copy & Print',
    url: '/copy-print',
    description: 'High-quality printing, copying, and graphic design services.',
    categoryFilter: 'copy-print',
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
  },
  {
    id: 'micro-problems',
    title: 'Micro Problems',
    url: '/vinted-drop-off',
    description: 'Solutions for common shipping and return problems.',
    categoryFilter: 'micro-problems',
  },
  {
    id: 'specialty',
    title: 'Specialty Services',
    url: '/specialty/digital-fingerprinting',
    description: 'Specialized services including fingerprinting and insurance.',
    categoryFilter: 'specialty',
  },
  {
    id: 'geo-dropoffs',
    title: 'Drop-Off Locations',
    url: '/pack-ship/package-drop-offs',
    description: 'Carrier drop-off locations in Lake County and surrounding areas.',
    categoryFilter: 'geo-dropoffs',
  },
];

export const subSupportingConfigs: SubSupportingConfig[] = [
  {
    id: 'amazon-returns',
    url: '/amazon-returns',
    title: 'Amazon Return Guide',
  },
  {
    id: 'fedex-easy-returns',
    url: '/fedex-easy-returns',
    title: 'FedEx Easy Returns',
  },
  {
    id: 'nuuly-returns',
    url: '/nuuly-returns',
    title: 'Nuuly Returns Guide',
  },
  {
    id: 'happy-returns',
    url: '/happy-returns',
    title: 'Happy Returns Bar',
  },
  {
    id: 'pickup-hours',
    url: '/pickup-hours',
    title: 'Carrier Pickup Hours',
  },
  {
    id: 'shipping-partners',
    url: '/shipping-partners',
    title: 'Shipping Partners',
  },
];

export const standaloneSeoLandingConfigs: StandaloneSeoLandingConfig[] = [
  {
    id: 'mailbox-rental-concord-ohio',
    url: '/mailbox-rental-concord-ohio',
    title: 'Mailbox Rental Concord Ohio',
  },
  {
    id: 'private-mailbox-rental',
    url: '/private-mailbox-rental',
    title: 'Private Mailbox Rental',
  },
];
