import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

export const GolfClubShipping: React.FC = () => {
  const service = services.find((s) => s.id === 'golf-club-shipping')!;
  return <ServicePageV2 {...service} />;
};
