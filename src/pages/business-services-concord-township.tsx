import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

const BusinessServicesPage: React.FC = () => {
  const service = services.find((s) => s.id === 'business-services-concord-township')!;
  return <ServicePageV2 {...service} />;
};

export default BusinessServicesPage;
