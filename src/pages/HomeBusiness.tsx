// HomeBusiness.tsx
import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const HomeBusiness: React.FC = () => {
  const service = services.find((s) => s.id === 'home-business');
  if (!service) {
    return <div>Error: Service not found</div>;
  }
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-[var(--color-text-primary)] leading-relaxed">
          Running a home business? We can help with{' '}
          <InternalLink variant="geo" to="/home-business/mailbox-rental">
            mailbox rentals
          </InternalLink>
          ,{' '}
          <InternalLink variant="geo" to="/copy-print">
            printing marketing materials
          </InternalLink>
          , and{' '}
          <InternalLink variant="geo" to="/pack-ship">
            shipping your products
          </InternalLink>
          .
        </p>
      </div>
    </ServicePageV2>
  );
};
