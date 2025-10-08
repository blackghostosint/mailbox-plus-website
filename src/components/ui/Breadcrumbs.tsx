import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Service } from "../../types/services";
import { getServiceBreadcrumbs } from "../../utils/services-helpers";
import { JsonLd } from "../JsonLd";
import { siteConfig } from "../../config/siteConfig";

interface BreadcrumbsProps {
  service: Service;
  baseUrl?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ service, baseUrl = "" }) => {
  const items = getServiceBreadcrumbs(service, baseUrl);
  const origin = siteConfig.domain.replace(/\/$/, "");

  return (
    <>
      {/* Visible + microdata breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol
          className="flex items-center space-x-2 text-sm text-gray-600 overflow-x-auto"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => (
            <li
              key={item.url}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <ChevronRight
                  className="w-4 h-4 mx-1 text-gray-400"
                  aria-hidden="true"
                />
              )}
              {index < items.length - 1 ? (
                <Link
                  to={item.url}
                  itemProp="item"
                  className="hover:text-[#0855B1] transition-colors"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
              ) : (
                <span
                  className="font-semibold text-[#111827]"
                  aria-current="page"
                  itemProp="name"
                >
                  {item.name}
                </span>
              )}
              <meta itemProp="position" content={(index + 1).toString()} />
            </li>
          ))}
        </ol>
      </nav>

      {/* JSON-LD breadcrumbs for Google */}
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${origin}${item.url}`,
            "@id": `${origin}${item.url}#breadcrumb-${index + 1}`,
          })),
        }}
      />
    </>
  );
};
