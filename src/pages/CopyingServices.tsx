import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

export const CopyingServices: React.FC = () => {
  const service = services.find((s) => s.id === 'copying-services')!;
  return <ServicePageV2 {...service} />;
};
