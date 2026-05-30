import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

const service = services.find((s) => s.id === 'every-door-direct-mail');

export const EveryDoorDirectMail: React.FC = () => {
  if (!service) {
    return <div>Service not found</div>;
  }
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Grow your local customer base with our{' '}
          <InternalLink variant="geo" to="/business-services-concord-township">
            direct mail services
          </InternalLink>
          . We handle the{' '}
          <InternalLink variant="geo" to="/copy-print/graphic-design">
            design
          </InternalLink>
          ,{' '}
          <InternalLink variant="geo" to="/copy-print/document-printing">
            printing
          </InternalLink>
          , and{' '}
          <InternalLink variant="geo" to="/pack-ship/usps-services">
            USPS paperwork
          </InternalLink>{' '}
          for you.
        </p>
      </div>
    </ServicePageV2>
  );
};
