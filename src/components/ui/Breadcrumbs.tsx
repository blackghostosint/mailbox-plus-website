import React from 'react';
import { InternalLink } from './InternalLink';
import ChevronRight from '~icons/lucide/chevron-right';
import { Service } from '../../types/services';
import { getServiceBreadcrumbs } from '../../utils/services-helpers';
import { JsonLd } from '../JsonLd';

interface BreadcrumbsProps {
  service: Service;
  baseUrl?: string;
  baseLabel?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ service, baseUrl = '', baseLabel }) => {
  const items = getServiceBreadcrumbs(service, baseUrl, baseLabel);

  return (
    <>
      {/* Visible breadcrumbs (semantic & accessible) */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 mb-6">
        <ol className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)] overflow-x-auto">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="w-4 h-4 mx-1 text-[var(--color-text-muted)] flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {index < items.length - 1 ? (
                <InternalLink
                  to={item.url}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  <span>{item.name}</span>
                </InternalLink>
              ) : (
                <span
                  className="font-semibold text-[var(--color-text-primary)]"
                  aria-current="page"
                >
                  <span>{item.name}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* JSON-LD breadcrumbs */}
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Thing',
              '@id': item.url,
              name: item.name,
            },
          })),
        }}
      />
    </>
  );
};
