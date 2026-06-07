// DHLExpress.tsx
import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const DHLExpress: React.FC = () => {
  const service = services.find((s) => s.id === 'dhl-express')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-[var(--color-text-primary)] leading-relaxed">
          As an authorized{' '}
          <InternalLink variant="geo" to="/shipping-center-concord-township">
            international shipping center
          </InternalLink>
          , we make sending packages overseas simple and secure with DHL. We also offer domestic
          shipping via{' '}
          <InternalLink variant="geo" to="/pack-ship/ups-authorized-shipper-outlet">
            UPS
          </InternalLink>
          ,{' '}
          <InternalLink variant="geo" to="/pack-ship/fedex-shipping">
            FedEx
          </InternalLink>
          , and{' '}
          <InternalLink variant="geo" to="/pack-ship/usps-services">
            USPS
          </InternalLink>
          .
        </p>
      </div>
    </ServicePageV2>
  );
};
