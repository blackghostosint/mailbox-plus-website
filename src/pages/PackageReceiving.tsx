// PackageReceiving.tsx
import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

export const PackageReceiving: React.FC = () => {
  const service = services.find((s) => s.id === 'package-receiving')!;
  return <ServicePageV2 {...service} />;
};
