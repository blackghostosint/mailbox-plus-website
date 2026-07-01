import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const HappyReturnsPage: React.FC = () => {
  const service = services.find((s) => s.id === 'happy-returns')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-[var(--color-text-primary)] leading-relaxed">
          Mailbox Plus is an authorized <strong>Happy Returns Return Bar</strong> in Concord
          Township. Bring your QR code on your phone — no box, no label, no printer needed. We scan,
          bag, and receipt you in under 60 seconds. Need help with other returns? We also accept{' '}
          <InternalLink variant="geo" to="/nuuly-returns">
            Nuuly returns
          </InternalLink>
          ,{' '}
          <InternalLink variant="geo" to="/amazon-returns">
            Amazon returns
          </InternalLink>
          , and offer{' '}
          <InternalLink variant="geo" to="/fedex-easy-returns">
            FedEx Easy Returns
          </InternalLink>{' '}
          drop-offs. One stop for all your returns.
        </p>
      </div>
    </ServicePageV2>
  );
};

export default HappyReturnsPage;
