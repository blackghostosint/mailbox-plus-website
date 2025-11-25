import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// ✅ Barrel imports
import { Meta, Breadcrumbs, JsonLd, VisitUsButton } from "../components";
import { CarrierLogos } from "./CarrierLogos";
import { CompetitorAlternativeSection } from "./sections/CompetitorAlternative";
import { Service } from "../types/services";
import { siteConfig } from "../config/siteConfig";
import { getWebPageSchema, getServiceSchema, getFAQSchema } from "../utils/schema";
import { services } from "../config/services";
import { getGoogleMapsLink } from "../utils/location";

// ✅ Shadcn UI
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";

type ServicePageProps = Service & { children?: React.ReactNode };

export const ServicePage: React.FC<ServicePageProps> = (props) => {
  const {
    pageTitle,
    metaDescription,
    keywords,
    slug,
    canonicalUrl,
    serviceName,
    city,
    heroTitle,
    heroSubtitle,
    heroImage,
    content = [],
    features = [],
    faqs = [],
    priorityServices = [],
    introductoryContent,
    // cta, // Removed: not in Service type
  } = props;

  // ✅ Sort featured first, then by order if present
  const sortedFaqs = [...faqs].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return 0;
  });

  // ✅ Flatten FAQs into a single list without category separation
  const groupedFaqs = { All: sortedFaqs };

  const url = `${siteConfig.domain}${canonicalUrl}`;

  // ✅ Generate schema for priority services
  const priorityServiceSchemas = priorityServices
    .map(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (!service) return null;

      const serviceUrl = `${siteConfig.domain}${service.canonicalUrl}`;
      return getServiceSchema(siteConfig, {
        serviceName: service.serviceName,
        url: serviceUrl,
        areaServed: [city], // Highlight the specific city for this service
      });
    })
    .filter(Boolean);

  return (
    <div className="bg-white">
      {/* ✅ Metadata */}
      <Meta
        title={pageTitle}
        description={metaDescription}
        keywords={keywords}
        canonical={url}
      />

      {/* ✅ Structured Data */}
      <JsonLd schema={getWebPageSchema(siteConfig, { name: pageTitle, description: metaDescription, url })} />
      <JsonLd schema={getServiceSchema(siteConfig, { serviceName, url })} />
      {faqs?.length ? <JsonLd schema={getFAQSchema(siteConfig, faqs.map(faq => ({ question: faq.question, answer: faq.answer })))} /> : null}
      {priorityServiceSchemas.map((schema, index) => (
        schema ? <JsonLd key={`priority-service-${index}`} schema={schema} /> : null
      ))}

      {/* ✅ Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs service={props} />
      </div>

      {/* ✅ Hero Section */}
      <section className="relative bg-[#0855B1] py-16 lg:py-24 text-center overflow-hidden">
        {heroImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={heroImage}
              alt={heroTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            {heroTitle}
          </motion.h1>
          {heroSubtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-lg text-gray-200 leading-relaxed"
            >
              {heroSubtitle}
            </motion.p>
          )}
        </div>
      </section>

      {introductoryContent && (
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div
              className="text-lg text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: introductoryContent }}
            />
          </div>
        </section>
      )}

      {/* ✅ Content Sections */}
      {content.length > 0 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
            {content.map((block, i) => (
              block.isFullWidth ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="md:col-span-2 bg-white p-8 border border-gray-200 rounded-2xl shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-[#0855B1] mb-4">{block.heading}</h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.body }}></div>
                </motion.div>
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#F9FAFB] rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-semibold text-[#0855B1] mb-3">
                    {block.heading}
                  </h2>
                  <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.body }}></div>
                </motion.div>
              )
            ))}
          </div>
        </section>
      )}

      {/* ✅ Custom Content (Internal Links, etc.) */}
      {props.children && (
        <section className="py-8 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            {props.children}
          </div>
        </section>
      )}

      {/* WHY CHOOSE US SECTION */}
      {features.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-10">
              Why Choose Us
            </h2>

            <div className="flex flex-wrap justify-center gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full sm:w-72 text-center"
                >
                  <h3 className="text-lg font-semibold text-[#111827] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#4B5563]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ✅ FAQ Section */}
      {faqs.length > 0 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#111827] mb-8 text-center">
              Frequently Asked Questions
            </h2>

            {Object.entries(groupedFaqs).map(([category, items]) => (
              <div key={category} className="mb-10">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {items.map((faq, i) => (
                    <AccordionItem
                      key={faq.id || i}
                      value={`faq-${faq.id || i}`}
                      className={`border rounded-xl shadow-sm ${
                        faq.isFeatured
                          ? "bg-[#F0F7FF] border-[#0855B1]"
                          : "bg-white"
                      }`}
                    >
                      <AccordionTrigger className="px-4 py-3 text-left font-semibold text-[#0855B1] hover:underline">
                        <span className="flex items-center gap-2">
                          {faq.isFeatured && (
                            <Star className="w-4 h-4 fill-[#0855B1] text-[#0855B1]" />
                          )}
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-[#4B5563] leading-relaxed">
                        {faq.answer}
                        {faq.lastUpdated && (
                          <p className="mt-2 text-sm text-gray-400">
                            Last updated:{" "}
                            {new Date(faq.lastUpdated).toLocaleDateString()}
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>
      )}
{/* Competitor Alternative Section */}
<CompetitorAlternativeSection />

{/* Carrier Logos */}
<CarrierLogos />

      {/* ✅ CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a
            href={getGoogleMapsLink("directions", siteConfig.name)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <VisitUsButton
              defaultCity={city}
              className="bg-white !text-[#0855B1] hover:bg-gray-100 hover:!text-[#064080]"
            />
          </a>
        </div>
      </section>
    </div>
  );
};

