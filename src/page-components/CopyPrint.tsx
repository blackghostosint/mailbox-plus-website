import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

export const CopyPrint: React.FC = () => {
  const service = services.find(s => s.id === 'copy-print')!;
  return <ServicePageV2 {...service} />;
};