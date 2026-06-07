// DocumentScanning.tsx
import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const DocumentScanning: React.FC = () => {
  const service = services.find((s) => s.id === 'document-scanning')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-[var(--color-text-primary)] leading-relaxed">
          Digitize your important files with our{' '}
          <InternalLink variant="geo" to="/document-services-concord-township">
            document scanning services
          </InternalLink>
          . We offer high-resolution scanning to email or USB drive. Once digitized, we can help you
          with{' '}
          <InternalLink variant="geo" to="/home-business/document-shredding">
            secure shredding
          </InternalLink>{' '}
          of the originals.
        </p>
      </div>
    </ServicePageV2>
  );
};
