// CustomBoxMaking.tsx
import React from 'react';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import { services } from '../config/services';

export const CustomBoxMaking: React.FC = () => {
  const service = services.find((s) => s.id === 'custom-box-making')!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Oddly shaped item? No problem. We build{' '}
          <InternalLink variant="geo" to="/pack-ship/packaging-supplies">
            custom boxes
          </InternalLink>{' '}
          to ensure a perfect fit and safe transport. Pair this with our{' '}
          <InternalLink variant="geo" to="/pack-ship/professional-packing">
            professional packing services
          </InternalLink>{' '}
          for complete peace of mind.
        </p>
      </div>
    </ServicePageV2>
  );
};
