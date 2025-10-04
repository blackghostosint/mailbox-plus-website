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
  } = props;

  const sortedFaqs = [...faqs].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return 0;
  });

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
          <div className="max-w-4xl mx-auto px-6 space-y-12">
            {content.map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <h2 className="text-2xl font-bold text-[#111827] mb-4">
                  {block.heading}
                </h2>
                <p className="text-[#4B5563] leading-relaxed">{block.body}</p>
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
                  <p className="text-[#4B5563] leading-relaxed">
                    {f.description}
                  </p>
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

            <Accordion type="single" collapsible className="w-full space-y-4">
              {sortedFaqs.map((faq, i) => (
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
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </div>
  );
};
