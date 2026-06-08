import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const BusinessCardsPage: React.FC = () => {
  const service = services.find((s) => s.id === 'business-cards')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
          Make a lasting impression with our{' '}
          <InternalLink variant="geo" to="/printing-services-concord-township">
            local business card printing
          </InternalLink>{' '}
          services. We offer a wide variety of card stocks and finishes, and our{' '}
          <InternalLink variant="geo" to="/copy-print/graphic-design">
            graphic design services
          </InternalLink>{' '}
          can help bring your vision to life.
        </p>
      </div>
    </ServicePageV2>
  );
};
