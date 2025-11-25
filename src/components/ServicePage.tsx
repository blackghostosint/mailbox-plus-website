import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// ✅ Barrel imports
import { Meta, Breadcrumbs, JsonLd, VisitUsButton } from "../components";
import { CarrierLogos } from "./CarrierLogos";
import { CompetitorAlternativeSection } from "./sections/CompetitorAlternative";
import { Service } from "../types/services";
import { getWebPageSchema, getServiceSchema, getFAQSchema } from "../utils/schema";
import { siteConfig } from "../config/siteConfig";

// ✅ Shadcn UI
import { SmartImage } from "./SmartImage";

interface ServicePageProps extends Service {
  children?: React.ReactNode;
}

export const ServicePage: React.FC<ServicePageProps> = (props) => {
  const {
    pageTitle,
    metaDescription,
    heroTitle,
    heroSubtitle,
    heroImage,
    children,
    faqs,
    aggregateRating,
    slug
  } = props;

  const canonicalUrl = props.canonicalUrl || `${siteConfig.domain}${slug}`;

  // Generate Schema
  const webPageSchema = getWebPageSchema(siteConfig, {
    name: pageTitle,
    description: metaDescription,
    url: canonicalUrl,
  });
  const serviceSchema = getServiceSchema(siteConfig, {
    ...props,
    url: canonicalUrl,
  });
  const faqSchema = faqs ? getFAQSchema(siteConfig, faqs) : undefined;

  return (
    <>
      <Meta
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
      />
      <JsonLd schema={[webPageSchema, serviceSchema, ...(faqSchema ? [faqSchema] : [])]} />

      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs service={props} />

        {/* ✅ Hero Section */}
        <section className="relative bg-[#0855B1] py-16 lg:py-24 text-center overflow-hidden">
          {heroImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-0"
            >
              <SmartImage
                priority
                src={heroImage}
                alt={heroTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>
          )}

          <div className="relative z-10 container mx-auto px-4">
            {aggregateRating && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(aggregateRating.ratingValue) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                    />
                  ))}
                </div>
                <span className="text-white font-medium">
                  {aggregateRating.ratingValue} ({aggregateRating.reviewCount} reviews)
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              {heroTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-blue-100 max-w-2xl mx-auto mb-8"
            >
              {heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <VisitUsButton variant="secondary" size="lg" />
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          {children}
        </main>

        {/* Carrier Logos */}
        <CarrierLogos />

        {/* Competitor Alternative */}
        <CompetitorAlternativeSection />
      </div>
    </>
  );
};
