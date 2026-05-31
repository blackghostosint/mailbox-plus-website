import React from 'react';
import { InternalLink } from '../components/ui/InternalLink';
import { serviceAreas } from '../config/serviceAreas';
import { Button } from '../components/ui';

export const ServiceAreaIndex: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-8 text-center">
        Our Service Areas
      </h1>
      <p className="text-lg text-[var(--color-text-secondary)] mb-12 text-center max-w-3xl mx-auto">
        Mailbox Plus proudly serves families, small businesses, and professionals across Lake County
        and Northeast Ohio. Explore our dedicated service pages for{' '}
        <InternalLink variant="geo" to="/shipping">
          shipping
        </InternalLink>
        ,{' '}
        <InternalLink variant="geo" to="/printing">
          printing
        </InternalLink>
        , and business support in your community.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceAreas.map((area) => (
          <div
            key={area.slug}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center justify-between"
          >
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
              {area.city}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              {area.metaDescription}
            </p>
            <InternalLink to={`/service-area/${area.slug}`}>
              <Button variant="secondary" size="sm" className="!rounded-full">
                View {area.city} Services
              </Button>
            </InternalLink>
          </div>
        ))}
      </div>
    </div>
  );
};
