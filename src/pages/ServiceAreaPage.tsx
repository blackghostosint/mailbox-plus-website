import React from "react";
import { useParams } from "react-router-dom";
import { serviceAreas } from "../config/serviceAreas";
import { ServicePage } from "../components/ServicePage";
import { Meta } from "../components/Meta";
import { siteConfig } from "../config/siteConfig";
import localPages from "../data/localPages.json";
import { getServiceImageUrl } from "../lib/storage";

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

  const areaWithContent = {
    ...area,
    introductoryContent: localPage?.introductoryContent,
    // Map introTitle to heroTitle as it matches the prominent heading use case
    heroTitle: localPage?.introTitle || area.heroTitle,
    // Use localPage heroImage if available, otherwise fallback to area
    heroImage: localPage?.heroImage ? getServiceImageUrl(localPage.heroImage) : area.heroImage,
    // Map services list to priorityServices
    priorityServices: localPage?.services || area.priorityServices,
    // Map canonical URL
    canonicalUrl: localPage?.canonical || area.canonicalUrl,
    // Map meta fields
    pageTitle: localPage?.metaTitle || area.pageTitle,
    metaDescription: localPage?.metaDescription || area.metaDescription,
    // Use localPage FAQs if they exist (though currently moved to serviceAreas.ts mostly), fallback to area
    faqs: area.faqs,
  };

  const fullCanonicalUrl = `${siteConfig.domain}${areaWithContent.canonicalUrl}`;

  return (
    <>
      <Meta
        title={areaWithContent.pageTitle}
        description={areaWithContent.metaDescription}
        canonical={fullCanonicalUrl}
      />
      <ServicePage {...areaWithContent} />
    </>
  );
};
