import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

const USPSDropOffAlternativePage: React.FC = () => {
  const service = services.find((s) => s.id === 'usps-drop-off-alternative-concord-township')!;
  return <ServicePageV2 {...service} />;
};

export default USPSDropOffAlternativePage;
