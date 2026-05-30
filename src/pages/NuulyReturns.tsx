import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const NuulyReturns: React.FC = () => {
  const service = services.find((s) => s.id === 'nuuly-returns')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Drop off your Nuuly clothing rental returns at Mailbox Plus, your local{' '}
          <InternalLink variant="geo" to="/pack-ship/ups-authorized-shipper-outlet">
            authorized UPS location
          </InternalLink>{' '}
          in Concord Township. We provide same-day scanning and receipts for all Nuuly returns. Need
          help with other returns? We also accept{' '}
          <InternalLink variant="geo" to="/amazon-returns">
            Amazon returns
          </InternalLink>{' '}
          and offer{' '}
          <InternalLink variant="geo" to="/pack-ship/package-drop-offs">
            multi-carrier drop-off services
          </InternalLink>{' '}
          for all your shipping needs.
        </p>
      </div>
    </ServicePageV2>
  );
};
