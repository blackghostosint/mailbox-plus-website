import React from 'react';
import { useLocation } from 'react-router-dom';
import { InternalLink } from './InternalLink';
import ChevronRight from '~icons/lucide/chevron-right';
import Home from '~icons/lucide/home';
import { getBreadcrumbs } from '../../utils/navigation-helpers';
import { JsonLd } from '../JsonLd';

export const AutoBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const items = getBreadcrumbs(location.pathname);

  if (items.length <= 1 && location.pathname === '/') return null;

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)] overflow-x-auto">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center whitespace-nowrap">
              {index > 0 && (
                <ChevronRight
                  className="w-4 h-4 mx-1 text-[var(--color-text-muted)] flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {index === 0 ? (
                <InternalLink
                  to="/"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="sr-only">Home</span>
                </InternalLink>
              ) : index < items.length - 1 ? (
                <InternalLink
                  to={item.url || '/'}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  <span>{item.label}</span>
                </InternalLink>
              ) : (
                <span
                  className="font-semibold text-[var(--color-text-primary)]"
                  aria-current="page"
                >
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Thing',
              '@id': `https://mailboxplusohio.com${item.url}`,
              name: item.label,
            },
          })),
        }}
      />
    </>
  );
};
