// FaxServices.tsx
import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const FaxServices: React.FC = () => {
  const service = services.find((s) => s.id === 'fax-services')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Need to send a fax? We provide reliable{' '}
          <InternalLink variant="geo" to="/business-services-concord-township">
            business services in Concord Township
          </InternalLink>
          , including local and international faxing. While you&apos;re here, you can also handle
          your{' '}
          <InternalLink variant="geo" to="/copy-print/copies">
            copying
          </InternalLink>{' '}
          and{' '}
          <InternalLink variant="geo" to="/printing">
            printing
          </InternalLink>{' '}
          needs.
        </p>
      </div>
    </ServicePageV2>
  );
};
