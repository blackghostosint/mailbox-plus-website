import React from 'react';
import { useParams } from 'react-router-dom';
import { serviceAreas } from '../config/serviceAreas';
import { ServicePageV2 } from '../components/ServicePageV2';
import { InternalLink } from '../components/ui/InternalLink';
import localPages from '../data/localPages.json';
import { getServiceImageUrl } from '../lib/storage';
import { Service } from '../types/services';

export const ServiceAreaPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const area = serviceAreas.find((a) => a.slug === slug);
  const localPage = localPages.find((p) => p.slug === slug);

  if (!area) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Area Not Found</h1>
        <p className="text-[var(--color-text-secondary)] mt-4">
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
    <>
      {/* Services Available in {city} - geo-qualified links */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-white/80 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Services Available in {area.city}</h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Mailbox Plus offers{' '}
            <InternalLink variant="geo" to="/pack-ship">
              pack and ship services
            </InternalLink>
            ,{' '}
            <InternalLink variant="geo" to="/pack-ship/fedex-shipping">
              FedEx shipping
            </InternalLink>
            ,{' '}
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
            near {area.city}. Stop by our Concord Township location or contact us to learn more.
          </p>
        </div>
      </section>

      <ServicePageV2
        {...areaWithContent}
        breadcrumbsBaseUrl="/service-area"
        breadcrumbsLabel="Service Areas"
      />
    </>
  );
};
