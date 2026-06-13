import React from 'react';
import { Meta } from '../components/Meta';
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
import { siteConfig } from '../config/siteConfig';
import { useCategoryFAQs } from '../hooks';

const FAQ_SKELETON = () => (
  <Accordion type="single" collapsible className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <AccordionItem
        key={`skeleton-${i}`}
        value={`skeleton-${i}`}
        className="border border-[var(--color-border)] rounded-xl px-4 data-[state=open]:bg-[var(--color-bg-secondary)] data-[state=open]:border-[var(--color-accent)] transition-colors animate-pulse"
      >
        <AccordionTrigger className="text-left font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] py-4 text-lg">
          <div className="h-6 w-3/4 bg-[var(--color-border)] rounded" />
        </AccordionTrigger>
        <AccordionContent className="text-[var(--color-text-secondary)] leading-relaxed pb-4 text-base">
          <div className="h-4 w-full bg-[var(--color-border)] rounded animate-pulse" />
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

const AskMailboxPlus: React.FC = () => {
  // Load all FAQ categories dynamically
  const { faqs: allFaqs } = useCategoryFAQs('pack-ship', [
    'packShipFaqs.json',
    'artworkShippingFaqs.json',
    'bicycleShippingFaqs.json',
    'customBoxMakingFaqs.json',
    'dhlExpressFaqs.json',
    'fedexShippingFaqs.json',
    'golfClubShippingFaqs.json',
    'internationalShippingFaqs.json',
    'packageDropOffsFaqs.json',
    'packageReceivingFaqs.json',
    'packagingSuppliesFaqs.json',
    'postageStampsFaqs.json',
    'professionalPackingFaqs.json',
    'upsShippingFaqs.json',
    'uspsServicesFaqs.json',
  ]);

  // Load other categories
  const { faqs: copyPrintFaqs } = useCategoryFAQs('copy-print', [
    'businessCardsFaqs.json',
    'copiesFaqs.json',
    'documentFinishingFaqs.json',
    'documentPrintingFaqs.json',
    'flyersBrochuresFaqs.json',
    'graphicDesignFaqs.json',
    'postcardPrintingFaqs.json',
    'posterBannerPrintingFaqs.json',
    'postersPrintingFaqs.json',
    'printDocumentServicesFaqs.json',
  ]);

  const { faqs: homeBusinessFaqs } = useCategoryFAQs('home-business', [
    'digitalMailboxRentalFaqs.json',
    'documentScanningFaqs.json',
    'everyDoorDirectMailFaqs.json',
    'faxServicesFaqs.json',
    'mailboxRentalFaqs.json',
    'shreddingFaqs.json',
  ]);

  const { faqs: specialtyFaqs } = useCategoryFAQs('specialty', [
    'digitalFingerprintingFaqs.json',
    'insuranceFaqs.json',
  ]);

  const { faqs: notaryFaqs } = useCategoryFAQs('notary', ['notaryServicesFaqs.json']);

  const categories = [
    { title: 'Pack & Ship', data: allFaqs },
    { title: 'Copy & Print', data: copyPrintFaqs },
    { title: 'Home & Business', data: homeBusinessFaqs },
    { title: 'Specialty Services', data: specialtyFaqs },
    { title: 'Notary', data: notaryFaqs },
  ];

  const allFaqsFlat = categories.flatMap((c) => c.data);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqsFlat.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Meta
        title="Ask Mailbox Plus | Shipping, Printing, and Business FAQs"
        description="Find expert answers to common questions about shipping, printing, and business services at Mailbox Plus in Concord Township, Ohio."
      />

      {/* ====================== HERO (V2 Standard) ======================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] py-16 lg:py-24 text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 animate-fade-in-up">
            Ask Mailbox Plus
          </h1>

          <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium max-w-3xl mx-auto mb-10 animate-fade-in-up [animation-delay:100ms] opacity-0">
            Your local experts for shipping, printing, and business solutions in Concord Township.
            Got questions? We have answers.
          </p>
        </div>

        {/* Soft fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)] z-10"></div>
      </section>

      {/* ====================== INTRO & LOCAL SEO ======================= */}
      <section className="relative z-10 -mt-20 max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-lg shadow-lg border border-white/50 text-center animate-fade-in-up [animation-delay:200ms] opacity-0">
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
        </div>
      </section>

      {/* ====================== FAQ CATEGORIES ======================= */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {categories.map((cat, idx) => (
          <div
            key={cat.title}
            className="mb-12 bg-white rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden animate-fade-in-up opacity-0"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="bg-[var(--color-bg-blue-tint)]/50 p-6 border-b border-[var(--color-accent)]/50">
              <h2 className="text-2xl font-bold text-[var(--color-primary)] flex items-center">
                <span className="w-2 h-8 bg-[var(--color-primary)] rounded-full mr-4"></span>
                {cat.title}
              </h2>
            </div>

            <div className="p-6 md:p-8">
              {cat.data.length === 0 ? (
                <FAQ_SKELETON />
              ) : (
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
              )}
            </div>
          </div>
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
};

export default AskMailboxPlus;
