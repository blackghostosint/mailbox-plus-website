import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

const AmazonReturnsPage: React.FC = () => {
  const service = services.find((s) => s.id === 'amazon-returns-drop-off-concord-township')!;
  return <ServicePageV2 {...service} />;
};

export default AmazonReturnsPage;
