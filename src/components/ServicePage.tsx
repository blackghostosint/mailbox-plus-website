import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// ✅ Barrel imports
import { Meta, Breadcrumbs } from "../components";
import { Service } from "../types/services";

// ✅ Shadcn Accordion
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const ServicePage: React.FC<Service> = (props) => {
  const {
    pageTitle,
    metaDescription,
    keywords,
    slug,
    heroTitle,
    heroSubtitle,
    heroImage,
    content = [],
    features = [],
    faqs = [],
    cta, // ✅ new optional CTA field
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

  // ✅ Group FAQs by category only if needed
  const hasCategories = sortedFaqs.some((faq) => faq.category);
  const groupedFaqs = hasCategories
    ? sortedFaqs.reduce((groups, faq) => {
        const category = faq.category || "General";
        if (!groups[category]) groups[category] = [];
        groups[category].push(faq);
        return groups;
      }, {} as Record<string, typeof faqs>)
    : { All: sortedFaqs };

  return (
    <div className="bg-white">
      {/* ✅ Metadata */}
      <Meta
        title={pageTitle}
        description={metaDescription}
        keywords={keywords}
        slug={slug}
      />

      {/* ✅ Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs service={props} />
      </div>

      {/* ✅ Hero Section */}
      <section className="bg-gradient-to-b from-white to-[#F9FAFB] py-16 lg:py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          {heroImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <img
                src={heroImage}
                alt={heroTitle}
                className="w-full h-72 object-cover rounded-2xl shadow-md"
              />
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-[#0855B1] mb-6"
          >
            {heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg text-[#4B5563] leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* ✅ Content Sections */}
      {content.length > 0 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
            {content.map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#F9FAFB] rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Optional icon support */}
                {block.icon && (
                  <div className="w-10 h-10 mb-3 rounded-lg bg-[#E6F0FF] flex items-center justify-center">
                    <block.icon className="w-5 h-5 text-[#0855B1]" />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-[#0855B1] mb-3">
                  {block.heading}
                </h2>
                <p className="text-gray-700 leading-relaxed">{block.body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ✅ Features Section */}
      {features.length > 0 && (
        <section className="bg-gray-50 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#111827] text-center mb-12">
              Why Choose Us
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {f.icon && (
                    <div className="w-12 h-12 rounded-xl bg-[#F0F7FF] flex items-center justify-center mb-4">
                      <f.icon className="w-6 h-6 text-[#0855B1]" />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-[#111827] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-[#4B5563] leading-relaxed">{f.description}</p>
                </motion.div>
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
                {hasCategories && (
                  <h3 className="text-xl font-semibold text-[#111827] mb-4">
                    {category}
                  </h3>
                )}

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

      {/* ✅ CTA Section */}
      {cta && (
        <section className="bg-[#0855B1] py-16 text-white text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">{cta.title}</h2>
            <p className="mb-6 text-lg">{cta.body}</p>
            {cta.buttonText && (
              <a
                href={cta.buttonLink}
                className="inline-block bg-white text-[#0855B1] font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition"
              >
                {cta.buttonText}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
