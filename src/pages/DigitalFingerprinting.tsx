// DigitalFingerprinting.tsx
import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const DigitalFingerprinting: React.FC = () => {
  const service = services.find((s) => s.id === 'digital-fingerprinting')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Part of our comprehensive{' '}
          <InternalLink variant="geo" to="/business-services-concord-township">
            business services in Concord Township
          </InternalLink>
          , we provide fast and secure digital fingerprinting for background checks. We also offer{' '}
          <InternalLink variant="geo" to="/notary">
            notary services
          </InternalLink>{' '}
          for your important documents.
        </p>
      </div>
    </ServicePageV2>
  );
};
