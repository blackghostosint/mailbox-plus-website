import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

export const PackShip: React.FC = () => {
  const service = services.find(s => s.id === 'pack-ship')!;
  return <ServicePageV2 {...service} />;
};
