// PostersPrinting.tsx
import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const PostersPrinting: React.FC = () => {
  const service = services.find((s) => s.id === 'posters-printing')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Choose Mailbox Plus as your{' '}
          <InternalLink variant="geo" to="/office-depot-alternative-concord-township">
            Office Depot printing alternative
          </InternalLink>{' '}
          for wide-format printing. Our posters and banners are printed with precision and care. We
          also offer{' '}
          <InternalLink variant="geo" to="/copy-print/graphic-design">
            professional graphic design
          </InternalLink>{' '}
          to help you create stunning visuals.
        </p>
      </div>
    </ServicePageV2>
  );
};
