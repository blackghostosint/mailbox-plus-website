// Insurance.tsx
import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const Insurance: React.FC = () => {
  const service = services.find((s) => s.id === 'insurance')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
          Protect your valuable shipments. We offer declared value coverage for your{' '}
          <InternalLink variant="geo" to="/pack-ship">
            packages
          </InternalLink>{' '}
          to give you peace of mind.
        </p>
      </div>
    </ServicePageV2>
  );
};
