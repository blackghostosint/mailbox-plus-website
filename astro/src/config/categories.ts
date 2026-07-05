// categories.ts
import type { ServiceCategory } from '../types/services';

export interface Category {
  id: ServiceCategory;
  name: string;
  href: string;
}

export const categories: Category[] = [
  {
    id: 'core',
    name: 'Service Areas',
    href: '/service-areas',
  },
  {
    id: 'pack-ship',
    name: 'Pack & Ship',
    href: '/pack-ship',
  },
  {
    id: 'copy-print',
    name: 'Copy & Print',
    href: '/copy-print',
  },
  {
    id: 'mailbox-rentals',
    name: 'Mailbox Rentals',
    href: '/mailbox-rentals',
  },
  {
    id: 'document-services',
    name: 'Document Services',
    href: '/document-services',
  },
  {
    id: 'notary-services',
    name: 'Notary Services',
    href: '/notary-services',
  },
  {
    id: 'specialty',
    name: 'Specialty Services',
    href: '/digital-fingerprinting',
  },
];
