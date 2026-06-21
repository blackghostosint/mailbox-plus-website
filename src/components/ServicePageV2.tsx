import React from 'react';
import Star from '~icons/lucide/star';
import { useInView } from '../hooks/useInView';

// Barrel exports
import { Meta, Breadcrumbs, JsonLd, VisitUsButton } from '.';
import { InternalLink } from './ui/InternalLink';
import { CarrierLogos } from './CarrierLogos';
import { CompetitorAlternativeSection } from './sections/CompetitorAlternative';
import { CTASection } from './sections/CTA';

// UI
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';

// Types & utils
import { Service } from '../types/services';
import { getWebPageSchema, getServiceSchema, getFAQSchema } from '../utils/schema';
import { getRelatedServices } from '../utils/internal-links';
import { siteConfig } from '../config/siteConfig';

interface ServicePageProps extends Service {
  children?: React.ReactNode;
  breadcrumbsBaseUrl?: string;
  breadcrumbsLabel?: string;
}

export const ServicePageV2: React.FC<ServicePageProps> = (props) => {
  const {
    pageTitle,
    metaDescription,
    heroTitle,
    heroSubtitle,
    children,
    features,
    content,
    faqs,
    cta,
    aggregateRating,
    slug,
    breadcrumbsBaseUrl,
    breadcrumbsLabel,
    robots,
  } = props;

  const canonicalUrl = props.canonicalUrl || `${siteConfig.domain}${slug}`;
  const faqSchema = faqs ? getFAQSchema(siteConfig, faqs) : undefined;

  const [introRef, introInView] = useInView({ threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1 });

  return (
    <>
      {/* SEO */}
      <Meta
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        robots={robots}
      />
      <JsonLd
        schema={[
          getWebPageSchema(siteConfig, {
            name: pageTitle,
            description: metaDescription,
            url: canonicalUrl,
          }),
          getServiceSchema(siteConfig, { ...props, url: canonicalUrl }),
          ...(faqSchema ? [faqSchema] : []),
        ]}
      />

      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        {/* Breadcrumbs */}
        <Breadcrumbs service={props} baseUrl={breadcrumbsBaseUrl} baseLabel={breadcrumbsLabel} />

        {/* ====================== HERO ======================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] py-16 lg:py-24 text-center">
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            {/* Rating pill */}
            {aggregateRating && (
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/40 px-4 py-1.5 mb-4 shadow-sm animate-fade-in-up">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(aggregateRating.ratingValue)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-white/80'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs md:text-sm text-white/90 font-medium">
                  {aggregateRating.ratingValue} rating · {aggregateRating.reviewCount}+ reviews
                </span>
              </div>
            )}

            {/* Title + subtitle */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 animate-fade-in-up [animation-delay:50ms] opacity-0">
              {heroTitle}
            </h1>

            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium max-w-3xl mx-auto mb-10 animate-fade-in-up [animation-delay:140ms] opacity-0">
              {heroSubtitle}
            </p>

            {/* Primary CTA */}
            <div className="animate-fade-in-up [animation-delay:220ms] opacity-0">
              <VisitUsButton variant="secondary" size="lg" />
            </div>
          </div>

          {/* Soft fade into page background */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)] z-10" />
        </section>

        {/* ======================= MAIN ====================== */}
        {/* Slight overlap so intro card floats into hero */}
        <main className="relative z-20 -mt-20 pb-20 lg:pb-28">
          <div className="container mx-auto px-4 space-y-20">
            {/* -------- GLASS INTRO CARD -------- */}
            {children && (
              <section
                ref={introRef as any}
                className={`max-w-3xl mx-auto ${introInView ? 'animate-fade-in-up' : 'opacity-0'}`}
              >
                <div className="relative">
                  {/* subtle gradient border */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-white/60 via-white/20 to-white/60 opacity-80" />
                  <div className="relative rounded-lg bg-white/70 backdrop-blur-xl border border-white/70 shadow-lg px-6 py-6 md:px-10 md:py-8">
                    {children}
                  </div>
                </div>
              </section>
            )}

            {/* -------- FEATURES STRIP -------- */}
            {features && features.length > 0 && (
              <section
                ref={featuresRef as any}
                className={`max-w-6xl mx-auto ${featuresInView ? 'animate-fade-in-up' : 'opacity-0'}`}
              >
                <div className="flex flex-col gap-2 mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] font-heading">
                    <span className="bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-text-primary)] to-[var(--color-text-primary)] bg-clip-text text-transparent">
                      Why customers choose this service
                    </span>
                  </h2>
                  <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-xl">
                    Clear benefits, protections, and flexible options so you can ship, print, and
                    manage your mail with confidence.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={idx}
                        className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 backdrop-blur-xl shadow-sm hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-200"
                      >
                        {/* subtle overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-[var(--color-bg-blue-tint)]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative p-6 flex flex-col gap-3">
                          {Icon && (
                            <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-text-primary)]/5 via-[var(--color-primary)]/10 to-[var(--color-border-blue)]/10 text-[var(--color-primary)] w-12 h-12 shadow-inner shadow-white/40">
                              <Icon className="w-5 h-5" />
                            </div>
                          )}
                          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* -------- CONTENT SECTIONS (GLASS PANELS) -------- */}
            {content &&
              content.map((block, idx) => (
                <section key={idx} className="max-w-5xl mx-auto animate-fade-in-up">
                  <div
                    className={[
                      'relative rounded-[28px] px-6 md:px-10 py-8 md:py-10 shadow-lg',
                      'bg-white/75 backdrop-blur-xl border border-white/80',
                      idx % 2 === 1
                        ? 'before:absolute before:inset-px before:rounded-lg before:bg-gradient-to-br before:from-white/80 before:via-[var(--color-bg-secondary)]/50 before:to-[var(--color-border)]/60 before:-z-10'
                        : '',
                    ].join(' ')}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4 font-heading">
                      {block.heading}
                    </h2>
                    <div
                      className="prose prose-lg max-w-none text-[var(--color-text-primary)] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: block.body }}
                    />
                  </div>
                </section>
              ))}

            {/* -------- FAQ (GLASS BAND) -------- */}
            {faqs && faqs.length > 0 && (
              <section className="py-12 rounded-2xl bg-gradient-to-b from-[var(--color-bg-secondary)]/80 via-[var(--color-border)]/70 to-[var(--color-bg-secondary)]/80 animate-fade-in-up">
                <div className="max-w-4xl mx-auto">
                  <div className="relative rounded-xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-xl px-4 md:px-8 py-8 md:py-10">
                    <div className="text-center mb-6 md:mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] font-heading">
                        Frequently Asked Questions
                      </h2>
                      <p className="mt-2 text-sm md:text-base text-[var(--color-text-secondary)] max-w-xl mx-auto">
                        Get quick answers to the most common questions about packaging, carriers,
                        pricing, and what to expect.
                      </p>
                    </div>

                    <Accordion type="single" collapsible className="space-y-3">
                      {faqs.map((faq, i) => (
                        <AccordionItem
                          key={i}
                          value={`faq-${i}`}
                          className="rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-bg-primary)]/80 data-[state=open]:bg-white/90 shadow-sm"
                        >
                          <AccordionTrigger className="px-4 py-3 text-left text-[var(--color-primary)] font-semibold hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 text-sm md:text-base text-[var(--color-text-primary)] leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </section>
            )}

            {/* -------- RELATED SERVICES -------- */}
            {(() => {
              const serviceId = props.id;
              const allRelated = (getRelatedServices(serviceId as any) || []).filter(
                Boolean
              ) as Array<{ id: string; title: string; url: string }>;
              if (allRelated.length === 0) return null;
              return (
                <section className="max-w-5xl mx-auto animate-fade-in-up">
                  <div className="relative rounded-[28px] px-6 md:px-10 py-8 md:py-10 shadow-lg bg-white/75 backdrop-blur-xl border border-white/80">
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-6 font-heading">
                      Related Services You Might Need
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      {allRelated.map((rel, idx) => (
                        <InternalLink
                          key={idx}
                          to={rel.url}
                          variant="geo"
                          className="block p-4 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-blue)] hover:bg-[var(--color-bg-blue-tint)] transition-all text-[var(--color-text-primary)] font-semibold text-sm"
                        >
                          {rel.title} →
                        </InternalLink>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* -------- CTA (GLASS + GRADIENT) -------- */}
            {cta && (
              <section
                ref={ctaRef as any}
                className={`max-w-4xl mx-auto ${ctaInView ? 'animate-fade-in-up' : 'opacity-0'}`}
              >
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  {/* gradient shell */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)]" />
                  {/* glass overlay */}
                  <div className="absolute inset-[1px] rounded-[28px] bg-white/5 backdrop-blur-xl border border-white/40" />
                  <div className="relative px-8 py-9 md:px-10 md:py-11 text-white">
                    <CTASection cta={cta} />
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>

        {/* End-of-page sections (unchanged) */}
        <CarrierLogos />
        <CompetitorAlternativeSection />
      </div>
    </>
  );
};
