import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

const USPSPackageHelpPage: React.FC = () => {
  const service = services.find((s) => s.id === 'usps-package-help-concord-township')!;
  return <ServicePageV2 {...service} />;
};

export default USPSPackageHelpPage;
