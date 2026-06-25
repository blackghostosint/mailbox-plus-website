import React from 'react';
import { AutoBreadcrumbs } from '../components/ui/AutoBreadcrumbs';
import { InternalLink } from '../components/ui/InternalLink';
import { serviceAreas } from '../config/serviceAreas';
import { Button } from '../components/ui';

export const ServiceAreaIndex: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <AutoBreadcrumbs />
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

      {/* Popular Services Section */}
      <section className="mb-12">
        <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-white/80 p-6 shadow-sm text-center">
          <h2 className="text-xl font-bold mb-4">Popular Services Near You</h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mx-auto">
            From{' '}
            <InternalLink variant="geo" to="/pack-ship">
              pack and ship
            </InternalLink>{' '}
            and{' '}
            <InternalLink variant="geo" to="/pack-ship/fedex-shipping">
              FedEx shipping
            </InternalLink>{' '}
            to{' '}
            <InternalLink variant="geo" to="/copy-print">
              professional printing
            </InternalLink>
            ,{' '}
            <InternalLink variant="geo" to="/home-business/mailbox-rental">
              mailbox rentals
            </InternalLink>
            , and{' '}
            <InternalLink variant="geo" to="/home-business/notary-services">
              notary services
            </InternalLink>{' '}
            — Mailbox Plus has your Concord Township errands covered.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceAreas.map((area) => (
          <div
            key={area.slug}
            className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] text-center flex flex-col items-center justify-between"
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
