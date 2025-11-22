import React from "react";
import { useLocation } from "react-router-dom";
import { InternalLink } from "./InternalLink";
import { ChevronRight, Home } from "lucide-react";
import { getBreadcrumbs } from "../../utils/internal-links";
import { JsonLd } from "../JsonLd";

export const AutoBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const items = getBreadcrumbs(location.pathname);

  if (items.length <= 1 && location.pathname === '/') return null;

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol
          className="flex items-center space-x-2 text-sm text-gray-600 overflow-x-auto"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => (
            <li
              key={item.url}
              className="flex items-center whitespace-nowrap"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <ChevronRight
                  className="w-4 h-4 mx-1 text-gray-400 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {index === 0 ? (
                 <InternalLink to="/" className="hover:text-[#0855B1] transition-colors">
                    <Home className="w-4 h-4" />
                    <span className="sr-only">Home</span>
                 </InternalLink>
              ) : index < items.length - 1 ? (
                <InternalLink
                  to={item.url}
                  itemProp="item"
                  className="hover:text-[#0855B1] transition-colors"
                >
                  <span itemProp="name">{item.label}</span>
                </InternalLink>
              ) : (
                <span
                  className="font-semibold text-[#111827]"
                  aria-current="page"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </span>
              )}

              <meta itemProp="position" content={(index + 1).toString()} />
            </li>
          ))}
        </ol>
      </nav>

      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Thing",
              "@id": `https://mailboxplusohio.com${item.url}`,
              name: item.label,
            },
          })),
        }}
      />
    </>
  );
};