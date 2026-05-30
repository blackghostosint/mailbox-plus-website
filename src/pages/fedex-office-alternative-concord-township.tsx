import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

const FedExOfficeAlternativePage: React.FC = () => {
  const service = services.find((s) => s.id === 'fedex-office-alternative-concord-township')!;
  return <ServicePageV2 {...service} />;
};

export default FedExOfficeAlternativePage;
