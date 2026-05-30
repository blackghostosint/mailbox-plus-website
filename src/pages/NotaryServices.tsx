import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const NotaryServices: React.FC = () => {
  const service = services.find((s) => s.id === 'notary-services')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Our licensed{' '}
          <InternalLink variant="geo" to="/business-services-concord-township">
            notary public services
          </InternalLink>{' '}
          are available during all store hours. No appointment needed for most documents. We can
          also help you{' '}
          <InternalLink variant="geo" to="/shipping">
            ship
          </InternalLink>{' '}
          your notarized documents or provide{' '}
          <InternalLink variant="geo" to="/copy-print/copies">
            copies
          </InternalLink>{' '}
          for your records.
        </p>
      </div>
    </ServicePageV2>
  );
};
