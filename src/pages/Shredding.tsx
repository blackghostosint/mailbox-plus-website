// Shredding.tsx
import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

export const Shredding: React.FC = () => {
  const service = services.find((s) => s.id === 'shredding')!;
  return <ServicePageV2 {...service} />;
};
