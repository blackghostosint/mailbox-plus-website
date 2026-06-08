import React from 'react';
import { Meta } from '../components/Meta';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/ui/accordion';
import { InternalLink } from '../components/ui/InternalLink';
import { Button } from '../components/ui';
import MapPin from '~icons/lucide/map-pin';
import Phone from '~icons/lucide/phone';
import { fadeUp } from '../utils/animations';
import { siteConfig } from '../config/siteConfig';

// Import all named FAQ arrays from each category index
import * as packShipFaqs from '../config/faqs/pack-ship';
import * as copyPrintFaqs from '../config/faqs/copy-print';
import * as homeBusinessFaqs from '../config/faqs/home-business';
import * as specialtyFaqs from '../config/faqs/specialty';
import * as notaryFaqs from '../config/faqs/notary';

// Type for FAQ (imported for type safety)
import { FAQ } from '../types/faq';

// Helper to flatten all FAQ arrays from a category object
function flattenFaqs(faqModule: Record<string, unknown>): FAQ[] {
  return Object.values(faqModule)
    .filter((arr) => Array.isArray(arr))
    .flat() as FAQ[];
}

const categories = [
  { title: 'Pack & Ship', data: flattenFaqs(packShipFaqs) },
  { title: 'Copy & Print', data: flattenFaqs(copyPrintFaqs) },
  { title: 'Home & Business', data: flattenFaqs(homeBusinessFaqs) },
  { title: 'Specialty Services', data: flattenFaqs(specialtyFaqs) },
  { title: 'Notary', data: flattenFaqs(notaryFaqs) },
];

const allFaqs: FAQ[] = categories.flatMap((c) => c.data);

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const AskMailboxPlus: React.FC = () => (
  <div className="bg-[var(--color-bg-primary)] min-h-screen">
    <Meta
      title="Ask Mailbox Plus | Shipping, Printing, and Business FAQs"
      description="Find expert answers to common questions about shipping, printing, and business services at Mailbox Plus in Concord Township, Ohio."
    />

    {/* ====================== HEADER (V2 Standard) ======================= */}
    <section className="relative py-32 lg:py-48 overflow-hidden min-h-[60vh]">
      {/* Navy Gradient Background */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 drop-shadow-sm"
        >
          Ask <span className="text-white">Mailbox Plus</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-xl md:text-2xl text-white leading-relaxed font-medium max-w-3xl mx-auto mb-10"
        >
          Your local experts for shipping, printing, and business solutions in Concord Township. Got
          questions? We have answers.
        </motion.p>
      </div>

      {/* Soft fade bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)]"></div>
    </section>

    {/* ====================== INTRO & LOCAL SEO ======================= */}
    <section className="relative z-10 -mt-20 max-w-5xl mx-auto px-4 pb-16">
      <motion.div
        {...fadeUp(0.2)}
        className="bg-white/70 backdrop-blur-xl p-8 rounded-lg shadow-lg border border-white/50 text-center"
      >
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
          Serving Lake County, Ohio
        </h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg mb-6">
          Whether you are in{' '}
          <strong>Concord Township, Mentor, Painesville, Willoughby, or Kirtland</strong>, Mailbox
          Plus is your neighborhood resource. We specialize in solving complex shipping problems,
          handling{' '}
          <InternalLink
            to="/amazon-returns"
            className="text-[var(--color-primary)] font-semibold hover:underline"
          >
            Amazon returns
          </InternalLink>
          , and providing secure{' '}
          <InternalLink
            to="/mailbox-rental"
            className="text-[var(--color-primary)] font-semibold hover:underline"
          >
            private mailbox rentals
          </InternalLink>
          .
        </p>
      </motion.div>
    </section>

    {/* ====================== FAQ CATEGORIES ======================= */}
    <section className="max-w-6xl mx-auto px-4 py-8">
      {categories.map((cat, idx) => (
        <motion.div
          key={cat.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="mb-12 bg-white rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden"
        >
          <div className="bg-[var(--color-bg-blue-tint)]/50 p-6 border-b border-[var(--color-accent)]/50">
            <h2 className="text-2xl font-bold text-[var(--color-primary)] flex items-center">
              <span className="w-2 h-8 bg-[var(--color-primary)] rounded-full mr-4"></span>
              {cat.title}
            </h2>
          </div>

          <div className="p-6 md:p-8">
            <Accordion type="single" collapsible className="space-y-4">
              {cat.data.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${idx}-${i}`}
                  className="border border-[var(--color-border)] rounded-xl px-4 data-[state=open]:bg-[var(--color-bg-secondary)] data-[state=open]:border-[var(--color-accent)] transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] py-4 text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[var(--color-text-secondary)] leading-relaxed pb-4 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      ))}
    </section>

    {/* ====================== CTA SECTION (V2 Gradient) ======================= */}
    <section className="py-20 bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Still have questions?</h2>
        <p className="text-xl text-white mb-10 max-w-2xl mx-auto leading-relaxed">
          Giving us a call is often the fastest way to get help. We&apos;re open 6 days a week!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={`tel:${siteConfig.contact.phone}`}>
            <Button
              size="lg"
              variant="secondary"
              className="font-bold shadow-lg border-none min-h-12 px-8"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call {siteConfig.contact.phone}
            </Button>
          </a>
          <InternalLink to="/contact">
            <Button
              size="lg"
              variant="ghost"
              className="text-white border border-white/40 hover:bg-white/10"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Get Directions
            </Button>
          </InternalLink>
        </div>
      </div>
    </section>

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  </div>
);

export default AskMailboxPlus;
