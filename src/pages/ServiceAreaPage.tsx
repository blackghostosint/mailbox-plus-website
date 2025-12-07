import React from "react";
import { useParams } from "react-router-dom";
import { serviceAreas } from "../config/serviceAreas";
import { ServicePageV2 } from "../components/ServicePageV2";
import localPages from "../data/localPages.json";
import { getServiceImageUrl } from "../lib/storage";
import { Service } from "../types/services";

export const ServiceAreaPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const area = serviceAreas.find((a) => a.slug === slug);
  const localPage = localPages.find((p) => p.slug === slug);

  if (!area) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Area Not Found</h1>
        <p className="text-gray-600 mt-4">
          Sorry, we don’t have a service area page for this location yet.
        </p>
      </div>
    );
  }

  // Merge area data with localPage overrides
  // We type this as Service to ensure we meet the interface
  const areaWithContent: Service = {
    ...area,
    // Merge specific fields from localPage if they exist
    introductoryContent: localPage?.introductoryContent || area.introductoryContent,
    heroTitle: localPage?.introTitle || area.heroTitle,
    heroImage: localPage?.heroImage ? getServiceImageUrl(localPage.heroImage) : area.heroImage,
    priorityServices: localPage?.services || area.priorityServices,
    canonicalUrl: localPage?.canonical || area.canonicalUrl,
    pageTitle: localPage?.metaTitle || area.pageTitle,
    metaDescription: localPage?.metaDescription || area.metaDescription,
    // Explicitly set city and serviceName from area to ensure Schema accuracy
    city: area.city,
    serviceName: area.serviceName,
    // Ensure faqs are carried over
    faqs: area.faqs,
  };

  return (
    <ServicePageV2
      {...areaWithContent}
      breadcrumbsBaseUrl="/service-area"
      breadcrumbsLabel="Service Areas"
    />
  );
};
