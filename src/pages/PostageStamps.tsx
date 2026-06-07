// PostageStamps.tsx
import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const PostageStamps: React.FC = () => {
  const service = services.find((s) => s.id === 'postage-stamps')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-[var(--color-text-primary)] leading-relaxed">
          Skip the long lines. Mailbox Plus is your{' '}
          <InternalLink variant="geo" to="/usps-drop-off-alternative-concord-township">
            USPS drop-off alternative
          </InternalLink>{' '}
          for stamps, mailing supplies, and package shipping. While you&apos;re here, check out our{' '}
          <InternalLink variant="geo" to="/mailbox-rental">
            private mailbox rentals
          </InternalLink>{' '}
          or ask about{' '}
          <InternalLink variant="geo" to="/pack-ship/usps-services">
            certified mail services
          </InternalLink>
          .
        </p>
      </div>
    </ServicePageV2>
  );
};
