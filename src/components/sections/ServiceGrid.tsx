import React from 'react';
import { InternalLink } from '../ui/InternalLink';
import ArrowRight from '~icons/lucide/arrow-right';
import siteStructure from '../../data/siteStructure.json';

interface ServiceGridProps {
  pillarId: string;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ pillarId }) => {
  const pillar = siteStructure.pillars.find((p) => p.id === pillarId);

  if (!pillar) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pillar.children.map((service) => (
        <InternalLink
          key={service.id}
          to={service.url}
          className="group flex flex-col p-6 bg-white border border-[var(--color-border)] rounded-xl hover:shadow-lg transition-shadow duration-300"
        >
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
            {service.title}
          </h3>
          <div className="mt-4 flex items-center text-sm font-medium text-[var(--color-primary)]">
            Learn more
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </InternalLink>
      ))}
    </div>
  );
};
