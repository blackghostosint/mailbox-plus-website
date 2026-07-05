import type { Service } from '../../types/services';
import { carrierServices } from './pack-ship/carriers';
import { specialtyShippingServices } from './pack-ship/specialty-shipping';
import { packingServices } from './pack-ship/packing-services';
import { receivingDropOffServices } from './pack-ship/receiving-drop-off';
import { localSeoServices } from './pack-ship/local-seo';
import { amazonReturnsService } from './pack-ship/amazon-returns';

export const packShipServices: Service[] = [
  ...specialtyShippingServices,
  ...carrierServices,
  ...receivingDropOffServices,
  ...packingServices,
  ...localSeoServices,
  amazonReturnsService,
];
