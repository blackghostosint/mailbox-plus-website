import React from 'react';
import { useInView } from '../hooks/useInView';
import Printer from '~icons/lucide/printer';
import Scan from '~icons/lucide/scan';
import Package from '~icons/lucide/package';
import CheckCircle from '~icons/lucide/check-circle';
import MapPin from '~icons/lucide/map-pin';
import Clock from '~icons/lucide/clock';
import ShieldCheck from '~icons/lucide/shield-check';
import ArrowRight from '~icons/lucide/arrow-right';
import { Meta, Breadcrumbs, JsonLd } from '../components';
import { Button } from '../components/ui';
import { InternalLink } from '../components/ui/InternalLink';
import { CompetitorAlternativeSection } from '../components/sections/CompetitorAlternative';
import { services } from '../config/services';
import { siteConfig } from '../config/siteConfig';
import { getServiceSchema, getWebPageSchema } from '../utils/schema';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/ui/accordion';

export const FedExEasyReturns: React.FC = () => {
  const service = services.find((s) => s.id === 'fedex-easy-returns')!;
  const url = `${siteConfig.domain}${service.slug}`;

  // JSON-LD Data
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'FedEx Easy Returns Drop-Off',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Mailbox Plus',
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.contact.address.street,
        addressLocality: siteConfig.contact.address.city,
        addressRegion: siteConfig.contact.address.state,
        postalCode: siteConfig.contact.address.zip,
        addressCountry: 'US',
      },
    },
    areaServed: [
      'Concord Township',
      'Mentor',
      'Painesville',
      'Eastlake',
      'Willoughby',
      'Kirtland',
      'Lake County',
    ],
    url: url,
    description: service.metaDescription,
  };

  const faqs = [
    {
      question: 'Do I need to print my return label?',
      answer:
        'No! If you have a QR code from your retailer, just bring that code on your phone. We scan it and start the return for you.',
    },
    {
      question: 'Does FedEx Easy Returns cost anything?',
      answer:
        'Dropping off a package with your QR code is free for you. We provide the receipt and tracking information at no charge.',
    },
    {
      question: 'Can you pack my return?',
      answer: 'Yes!',
    },
  ];

  const benefits = [
    { icon: Clock, title: 'Super Fast Drop-Offs', desc: 'In and out in minutes.' },
    { icon: Printer, title: 'No Printer Needed', desc: 'We print labels from QR codes.' },
    { icon: Scan, title: 'QR Code Support', desc: 'Just show your code on your phone.' },
    {
      icon: Package,
      title: 'Professional Packing',
      desc: 'We can pack your item safely.',
    },
    {
      icon: MapPin,
      title: 'Convenient Location',
      desc: 'Next to Pub Frato in Concord Twp.',
    },
    {
      icon: ShieldCheck,
      title: 'Friendly Guidance',
      desc: 'Helpful staff to assist you.',
    },
  ];

  const steps = [
    { step: 1, title: 'Bring Your Item', desc: 'Bring your item and your return QR code or label.' },
    {
      step: 2,
      title: 'Optional Packing',
      desc: 'Need a box? We can pack it for you (fees may apply).',
    },
    {
      step: 3,
      title: 'We Print the Label',
      desc: 'We scan your code and print the shipping label.',
    },
    {
      step: 4,
      title: 'Process &amp; Track',
      desc: 'We scan the package into the FedEx system and give you a receipt.',
    },
    {
      step: 5,
      title: "You're Done!",
      desc: 'Leave with peace of mind while the retailer processes your refund.',
    },
  ];

  const commonItems = [
    'Clothing &amp; Shoes',
    'Electronics',
    'Home Goods',
    'Toys &amp; Games',
    'Books',
    'Small Appliances',
    'Accessories',
    'Gifts',
  ];

  const areas = [
    'Concord Township',
    'Mentor',
    'Painesville',
    'Eastlake',
    'Willoughby',
    'Kirtland',
    'Greater Lake County',
  ];

  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1 });
  const [stepsRef, stepsInView] = useInView({ threshold: 0.1 });
  const [whatRef, whatInView] = useInView({ threshold: 0.1 });
  const [whenRef, whenInView] = useInView({ threshold: 0.1 });
  const [faqRef, faqInView] = useInView({ threshold: 0.1 });
  const [localRef, localInView] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1 });

  return (
    <div className="bg-white">
      {/* SEO Metadata */}
      <Meta
        title={service.pageTitle}
        description={service.metaDescription}
        keywords={service.keywords}
        canonical={url}
      />

      {/* Structured Data */}
      <JsonLd
        schema={getWebPageSchema(siteConfig, {
          name: service.pageTitle,
          description: service.metaDescription,
          url,
        })}
      />
      <JsonLd schema={getServiceSchema(siteConfig, { serviceName: service.serviceName, url })} />
      <JsonLd schema={localBusinessSchema} />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs service={service} />
      </div>

      {/* Hero Section - Navy Gradient */}
      <section
        ref={heroRef}
        className={`relative bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] py-16 lg:py-24 text-center overflow-hidden ${heroInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8 animate-fade-in-up [animation-delay:100ms] opacity-0">
            FedEx Easy Returns – <span className="text-white/80">Fast &amp; Hassle-Free</span>
          </h1>
          <p className="text-lg text-white leading-relaxed max-w-2xl mx-auto animate-fade-in-up [animation-delay:200ms] opacity-0">
            Quick drop-offs, QR code scanning, label printing, and tracking receipts. Serving
            specific all Lake County communities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-up [animation-delay:300ms] opacity-0">
            <InternalLink to="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="shadow-xl font-bold border-none min-h-12 px-8"
              >
                Get Directions <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </InternalLink>
          </div>
        </div>

        {/* Soft edge blend at bottom of hero */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            backgroundImage: 'linear-gradient(to bottom, transparent, var(--color-bg-primary))',
          }}
        ></div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
            Returning Items Has Never Been Easier
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
            Skip the long lines and complicated processes. The FedEx Easy Returns Program at Mailbox
            Plus makes returning your online purchases simple. Bring your phone with your QR code,
            we'll handle the rest—scanning, printing, and getting your package on its way.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        ref={benefitsRef}
        className={`py-20 bg-[var(--color-bg-primary)] relative z-10 -mt-10 ${benefitsInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Why Return with Us?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur-xl p-8 rounded-lg shadow-sm hover:shadow-lg border border-white/50 flex flex-col items-center text-center transition-all hover:translate-y-[-4px] animate-fade-in-up opacity-0"
                style={{ animationDelay: `${idx * 100 + 100}ms` }}
              >
                <div className="w-14 h-14 bg-[var(--color-bg-blue-tint)] rounded-2xl flex items-center justify-center mb-6 text-[var(--color-primary)]">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is FedEx Easy Returns */}
      <section
        ref={whatRef}
        className={`py-16 ${whatInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-10 border border-white/60 shadow-xl relative overflow-hidden animate-fade-in-up [animation-delay:100ms] opacity-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-bg-blue-tint)] rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">
              What is FedEx Easy Returns?
            </h2>
            <p className="text-[var(--color-text-primary)] leading-relaxed text-lg">
              FedEx Easy Returns is a consumer-friendly service designed to streamline the process
              of sending items back to retailers. Instead of worrying about printing labels at home
              or finding packaging, you can simply bring your item and your return information
              (often just a QR code) to Mailbox Plus. We verify the return, generate the label if
              needed, and accept the package for shipment—triggering your refund process faster.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section
        ref={stepsRef}
        className={`py-16 bg-white ${stepsInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] text-center mb-12">
            How It Works
          </h2>
          <div className="relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[var(--color-border)] -z-10" />

            <div className="space-y-12">
              {steps.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-right">
                    {index % 2 === 0 && (
                      <>
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                          {item.title}
                        </h3>
                        <p className="text-[var(--color-text-secondary)]">{item.desc}</p>
                      </>
                    )}
                  </div>

                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xl shrink-0 ring-4 ring-white shadow-lg z-10 animate-fade-in-up [animation-delay:100ms] opacity-0">
                    {item.step}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    {index % 2 !== 0 && (
                      <>
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                          {item.title}
                        </h3>
                        <p className="text-[var(--color-text-secondary)]">{item.desc}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Common Items Grid */}
      <section className="py-16 bg-[var(--color-bg-secondary)]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-10">
            Items Commonly Returned
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {commonItems.map((item, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow-sm border border-[var(--color-border)] font-medium text-[var(--color-text-primary)] animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 50 + 100}ms` }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Visit */}
      <section
        ref={whenRef}
        className={`py-16 bg-white ${whenInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8 text-center">
            When to Visit Mailbox Plus
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-[var(--color-text-primary)]">
                  You have a FedEx Easy Returns QR Code
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  Retailers like Walmart, Target, and Samsung often send these.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-[var(--color-text-primary)]">
                  You Want a Receipt
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  Always get proof of your return for your records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        ref={faqRef}
        className={`bg-white py-16 lg:py-24 border-t border-[var(--color-border)] ${faqInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-white border border-[var(--color-border)] rounded-xl shadow-sm px-2"
              >
                <AccordionTrigger className="px-4 py-3 text-left font-semibold text-[var(--color-primary)] hover:underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-[var(--color-text-secondary)] leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Local SEO Section */}
      <section
        ref={localRef}
        className={`py-16 bg-[var(--color-bg-secondary)] ${localInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            Serving Your Local Community
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
            We are proud to provide FedEx Easy Returns services to residents and businesses in:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {areas.map((area) => (
              <span
                key={area}
                className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-[var(--color-text-primary)] border border-[var(--color-border)]"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Alternative Section */}
      <CompetitorAlternativeSection />

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className={`py-20 bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] text-center ${ctaInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to return your package?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Visit Mailbox Plus today. Located in Gristmill Village next to Pub Frato.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InternalLink to="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="font-bold shadow-lg border-none min-h-12 px-8"
              >
                Get Directions <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </InternalLink>
          </div>
        </div>
      </section>
    </div>
  );
};