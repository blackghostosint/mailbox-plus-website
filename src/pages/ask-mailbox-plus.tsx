import React from "react";
import { Meta } from "../components/Meta";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";

// Import all named FAQ arrays from each category index
import * as packShipFaqs from "../config/faqs/pack-ship";
import * as copyPrintFaqs from "../config/faqs/copy-print";
import * as homeBusinessFaqs from "../config/faqs/home-business";
import * as specialtyFaqs from "../config/faqs/specialty";
import * as notaryFaqs from "../config/faqs/notary";

// Type for FAQ (imported for type safety)
import { FAQ } from "../types/faq";

// Helper to flatten all FAQ arrays from a category object
function flattenFaqs(faqModule: Record<string, unknown>): FAQ[] {
  return Object.values(faqModule)
    .filter((arr) => Array.isArray(arr))
    .flat() as FAQ[];
}

const categories = [
  { title: "Pack & Ship", data: flattenFaqs(packShipFaqs) },
  { title: "Copy & Print", data: flattenFaqs(copyPrintFaqs) },
  { title: "Home & Business", data: flattenFaqs(homeBusinessFaqs) },
  { title: "Specialty Services", data: flattenFaqs(specialtyFaqs) },
  { title: "Notary", data: flattenFaqs(notaryFaqs) },
];

const allFaqs: FAQ[] = categories.flatMap((c) => c.data);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": allFaqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer,
    },
  })),
};

const AskMailboxPlus: React.FC = () => (
  <>
    <Meta
      title="Ask Mailbox Plus | Shipping, Printing, and Business FAQs"
      description="Find expert answers to common questions about shipping, printing, and business services at Mailbox Plus in Concord Township, Ohio."
    />

    <section className="max-w-6xl mx-auto px-4 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-4 text-[#111827]"
      >
        Ask Mailbox Plus
      </motion.h1>
      <p className="text-center text-gray-600 mb-10">
        Your local shipping, printing, and business answers — straight from the experts at Mailbox Plus in Concord Township, Ohio.
      </p>

      {categories.map((cat, idx) => (
        <motion.div
          key={cat.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-4 text-[#0855B1]">
            {cat.title}
          </h2>
          <Accordion type="single" collapsible>
            {cat.data.map((faq, i) => (
              <AccordionItem key={i} value={`item-${idx}-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      ))}
    </section>

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  </>
);

export default AskMailboxPlus;