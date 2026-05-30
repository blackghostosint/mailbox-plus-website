import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { services } from '../config/services';

const VirtualMailboxPage: React.FC = () => {
  const service = services.find((s) => s.id === 'virtual-mailbox-concord-township')!;
  return <ServicePageV2 {...service} />;
};

export default VirtualMailboxPage;
