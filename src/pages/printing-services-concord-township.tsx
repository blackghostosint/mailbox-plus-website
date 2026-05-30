import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

const PrintingServicesPage: React.FC = () => {
  const service = services.find((s) => s.id === 'printing-services-concord-township')!;
  return <ServicePageV2 {...service} />;
};

export default PrintingServicesPage;
