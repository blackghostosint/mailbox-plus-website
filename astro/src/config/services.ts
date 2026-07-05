import type { Service } from '../types/services';
import { coreServices } from './services/core';
import { packShipServices } from './services/pack-ship';
import { copyPrintServices } from './services/copy-print';
import { mailboxRentalServices } from './services/mailbox-rentals';
import { documentServices } from './services/document-services';
import { additionalServices } from './services/additional-services';
import { specialtyShippingServices } from './services/pack-ship/specialty-shipping';
import { microProblems } from './services/micro-problems';
import { competitivePages } from './services/competitive';

// Main aggregation of all services
export const services: Service[] = [
  ...coreServices,
  ...packShipServices,
  ...copyPrintServices,
  ...mailboxRentalServices,
  ...documentServices,
  ...additionalServices,
  ...specialtyShippingServices,
  ...microProblems,
  ...competitivePages,
];
