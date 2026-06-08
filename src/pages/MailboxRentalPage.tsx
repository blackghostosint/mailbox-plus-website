// MailboxRentalPage.tsx
import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const MailboxRentalPage: React.FC = () => {
  const service = services.find((s) => s.id === 'mailbox-rental')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
          Secure your packages with our{' '}
          <InternalLink variant="geo" to="/private-mailbox-rental-concord-township">
            private mailbox rental
          </InternalLink>{' '}
          services. We also offer a convenient{' '}
          <InternalLink variant="geo" to="/mail-forwarding-concord-township">
            mail forwarding service
          </InternalLink>{' '}
          for travelers and businesses. Interested in managing your mail online? Check out our{' '}
          <InternalLink variant="geo" to="/home-business/digital-mailbox-rental">
            digital mailbox rentals
          </InternalLink>
          .
        </p>
      </div>
    </ServicePageV2>
  );
};
