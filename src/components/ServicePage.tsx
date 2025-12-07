console.log("🔥 SERVICEPAGE MOUNTED", props);
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// ✅ Barrel imports
import { Meta, Breadcrumbs, JsonLd, VisitUsButton } from "../components";
import { CarrierLogos } from "./CarrierLogos";
import { CompetitorAlternativeSection } from "./sections/CompetitorAlternative";
import { CTASection } from "./sections/CTA";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import { Service } from "../types/services";
import { getWebPageSchema, getServiceSchema, getFAQSchema } from "../utils/schema";
import { siteConfig } from "../config/siteConfig";

// ✅ Shadcn UI
import { SmartImage } from "./SmartImage";

interface ServicePageProps extends Service {
  children?: React.ReactNode;
  breadcrumbsBaseUrl?: string;
  breadcrumbsLabel?: string;
}

export const ServicePage: React.FC<ServicePageProps> = (props) => {
  const {
    pageTitle,
    metaDescription,
    heroTitle,
    heroSubtitle,
    heroImage,
    children,
    features,
    content,
    faqs,
    cta,
    aggregateRating,
    slug,
    breadcrumbsBaseUrl,
    breadcrumbsLabel
  } = props;

  console.group("SERVICE PROP VALIDATION");
  console.log("Props received:", props);

  [
    "pageTitle",
    "metaDescription",
    "heroTitle",
    "heroSubtitle",
    "heroImage",
    "slug"
  ].forEach((key) => {
    // Cast to any to avoid TS index signature error
    if (!(props as any)[key]) {
      console.error(`❌ Missing required prop: ${key}`, (props as any)[key]);
    }
  });
  console.groupEnd();

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

  console.group("FEATURE VALIDATION");
  if (!features || features.length === 0) {
    console.warn("No features provided");
  } else {
    features.forEach((f, i) => {
      console.log(`Feature ${i}`, f);
      // Optional check for icon validity if it's expected to be a component
      if (!f.icon || typeof f.icon !== "function") {
        console.error(`❌ INVALID ICON in feature ${i}`, f.icon);
      }
      if (!f.title) console.error(`❌ Feature ${i} is missing title`);
      if (!f.description) console.error(`❌ Feature ${i} is missing description`);
    });
  }
  console.groupEnd();

  console.group("CONTENT VALIDATION");
  if (!content) {
    console.warn("No content blocks defined");
  } else {
    content.forEach((block, i) => {
      console.log(`Block ${i}`, block);
      if (!block.heading || typeof block.heading !== "string") {
        console.error(`❌ Invalid heading in content block ${i}`, block.heading);
      }
      if (!block.body || typeof block.body !== "string") {
        console.error(`❌ Invalid body in content block ${i}`, block.body);
      }
    });
  }
  console.groupEnd();

  console.group("FAQ VALIDATION");
  if (!faqs || faqs.length === 0) {
    console.warn("No FAQs defined");
  } else {
    faqs.forEach((faq, i) => {
      console.log(`FAQ ${i}`, faq);
      if (!faq.question || typeof faq.question !== "string") {
        console.error(`❌ Invalid FAQ question in FAQ ${i}`, faq.question);
      }
      if (!faq.answer || typeof faq.answer !== "string") {
        console.error(`❌ Invalid FAQ answer in FAQ ${i}`, faq.answer);
      }
    });
  }
  console.groupEnd();

  return (
    <>
      <Meta
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
      />
      <JsonLd schema={[webPageSchema, serviceSchema, ...(faqSchema ? [faqSchema] : [])]} />

      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs
          service={props}
          baseUrl={breadcrumbsBaseUrl}
          baseLabel={breadcrumbsLabel}
        />

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

          {/* Features Grid */}
          {features && features.length > 0 && (
            <section className="mb-16">
              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      {Icon && (
                        <div className="w-12 h-12 bg-blue-50 text-[#0855B1] rounded-lg flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Dynamic Content Sections */}
          {content && content.map((block, idx) => (
            <section key={idx} className={`mb-16 ${block.isFullWidth ? '' : 'max-w-4xl mx-auto'}`}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{block.heading}</h2>
              <div
                className="prose prose-lg text-gray-700 leading-relaxed max-w-none"
                dangerouslySetInnerHTML={{ __html: block.body }}
              />
            </section>
          ))}

          {/* FAQ Section */}
          {faqs && faqs.length > 0 && (
            <section className="mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-white border border-gray-200 rounded-xl shadow-sm px-2">
                    <AccordionTrigger className="px-4 py-3 text-left font-semibold text-[#0855B1] hover:underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}

          {/* CTA Section */}
          {cta && <CTASection cta={cta} />}
        </main>

        {/* Carrier Logos */}
        <CarrierLogos />

        {/* Competitor Alternative */}
        <CompetitorAlternativeSection />
      </div>
    </>
  );
};
