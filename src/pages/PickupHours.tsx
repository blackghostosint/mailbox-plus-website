import React from 'react';
import { useInView } from '../hooks/useInView';
import MapPin from '~icons/lucide/map-pin';
import Truck from '~icons/lucide/truck';
import { Meta } from '../components/Meta';
import { InternalLink } from '../components/ui/InternalLink';
import { JsonLd } from '../components/JsonLd';
import { siteConfig, defaultCTA } from '../config/siteConfig';
import { CTASection } from '../components/sections/CTA';
import {
  getWebPageSchema,
  getServiceSchema,
  getFAQSchema,
  getLocalBusinessSchema,
} from '../utils/schema';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/ui/accordion';
import { AutoBreadcrumbs } from '../components/ui/AutoBreadcrumbs';

// Warm Glass Card Style
const warmGlassCard =
  'bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl border border-[var(--color-border)] shadow-md rounded-lg';

const pickupHours = [
  {
    carrier: 'USPS Pickup',
    times: [
      { day: 'Monday – Friday', time: '2:30 PM' },
      { day: 'Saturday', time: '12:00 PM (Noon)' },
      { day: 'Sunday', time: 'No pickup' },
    ],
    details: 'Accepts stamped mail, prepaid labels, Priority Mail, and returns.',
    accentColor: 'bg-[var(--color-accent-warm)]',
    iconColor: 'text-[var(--color-accent-warm)]',
    bgTint: 'rgba(242, 237, 228, 0.5)',
  },
  {
    carrier: 'UPS Pickup',
    times: [
      { day: 'Monday – Friday', time: '4:00 PM' },
      { day: 'Saturday', time: 'No pickup' },
      { day: 'Sunday', time: 'No pickup' },
    ],
    details: 'Accepts pre-labeled drop-offs, Amazon returns (with label), and air/ground packages.',
    accentColor: 'bg-[var(--color-accent-gold)]',
    iconColor: 'text-[var(--color-accent-gold)]',
    bgTint: 'rgba(247, 200, 42, 0.08)',
  },
  {
    carrier: 'FedEx Express',
    times: [
      { day: 'Monday – Friday', time: '5:00 PM' },
      { day: 'Saturday', time: '12:00 PM (Noon)' },
      { day: 'Sunday', time: 'No pickup' },
    ],
    details: 'For overnight, 2-day, and express saver shipments. Separate from Ground.',
    accentColor: 'bg-[var(--color-primary)]',
    iconColor: 'text-[var(--color-primary)]',
    bgTint: 'rgba(242, 237, 228, 0.3)',
  },
  {
    carrier: 'FedEx Ground',
    times: [
      { day: 'Monday – Friday', time: '4:00 PM' },
      { day: 'Saturday', time: 'No pickup' },
      { day: 'Sunday', time: 'No pickup' },
    ],
    details: 'Standard ground shipping and Home Delivery packages.',
    accentColor: 'bg-[var(--color-accent-warm)]',
    iconColor: 'text-[var(--color-accent-warm)]',
    bgTint: 'rgba(235, 228, 216, 0.5)',
  },
];

const faqs = [
  {
    question: 'What time do I need to drop off my package for same-day shipping?',
    answer:
      "To ensure your package goes out the same day, please drop it off at least 15 minutes before the posted pickup time. For USPS, the cutoff is 2:15 PM Mon-Fri. For UPS, it's 3:45 PM. For FedEx, please arrive by 4:45 PM.",
  },
  {
    question: 'Do you accept QR codes for Amazon returns?',
    answer:
      "No, we cannot process QR codes that require the 'The UPS Store' specifically. We accept pre-printed labels or can help you print a label if you have the PDF file.",
  },
  {
    question: 'Is there a pickup on Saturday?',
    answer:
      'Yes! USPS picks up at 12:00 PM (Noon) and FedEx Express picks up at 12:00 PM (Noon) on Saturdays. UPS and FedEx Ground do not have regular Saturday pickups.',
  },
  {
    question: 'Can I drop off a package after the pickup time?',
    answer:
      "Absolutely. You can drop off packages anytime during our store hours. If you miss the daily pickup, your package will be securely stored and sent out with the next business day's pickup.",
  },
  {
    question: 'Do you pick up packages from my house?',
    answer:
      'We are a retail drop-off location and do not offer residential pickup services. You must bring your packages to our store at 7554 Fredle Drive, Concord Township.',
  },
];

export const PickupHours: React.FC = () => {
  const pageTitle = 'Carrier Pickup Hours | UPS, FedEx, USPS | Mailbox Plus';
  const metaDescription =
    "Check daily pickup times for UPS, FedEx, and USPS at Mailbox Plus in Concord Township. Miss the truck? We'll secure your package for the next day.";
  const url = `${siteConfig.domain}/pickup-hours`;

  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [introRef, introInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [gridRef, gridInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [localRef, localInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [faqRef, faqInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)' }} className="min-h-screen">
      <Meta
        title={pageTitle}
        description={metaDescription}
        keywords="pickup hours, UPS pickup time, FedEx pickup time, USPS pickup time, drop off cutoff, shipping deadline Concord Township"
        canonical={url}
      />

      <JsonLd schema={getLocalBusinessSchema(siteConfig)} />
      <JsonLd
        schema={getWebPageSchema(siteConfig, {
          name: pageTitle,
          description: metaDescription,
          url,
        })}
      />
      <JsonLd
        schema={getServiceSchema(siteConfig, { serviceName: 'Carrier Pickup Services', url })}
      />
      <JsonLd schema={getFAQSchema(siteConfig, faqs)} />

      {/* Hero Section - Navy Gradient */}
      <section
        ref={heroRef}
        className={`relative bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] py-16 lg:py-24 text-center overflow-hidden ${heroInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 animate-fade-in-up [animation-delay:100ms] opacity-0">
            Carrier Pickup <span className="text-white">Hours</span>
          </h1>
          <p className="text-lg text-white leading-relaxed max-w-2xl mx-auto animate-fade-in-up [animation-delay:200ms] opacity-0">
            Daily collection times for UPS, FedEx, and USPS. Drop off your packages with confidence.
          </p>
        </div>

        {/* Soft edge blend at bottom of hero */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            backgroundImage: 'linear-gradient(to bottom, transparent, var(--color-bg-primary))',
          }}
        ></div>
      </section>

      <main className="relative z-20 -mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-8 pl-1">
          <AutoBreadcrumbs />
        </div>

        {/* Intro Text in Warm Card */}
        <div
          ref={introRef}
          className={`max-w-3xl mx-auto mb-16 ${introInView ? 'animate-fade-in-up' : 'opacity-0'}`}
        >
          <div
            className={`${warmGlassCard} p-8 md:p-10 text-center animate-fade-in-up [animation-delay:100ms] opacity-0`}
          >
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Knowing the exact pickup times ensures your important shipments go out the same day.
              We are an authorized ship center for{' '}
              <InternalLink variant="geo" to="/pack-ship/ups-authorized-shipper-outlet">
                UPS
              </InternalLink>
              ,{' '}
              <InternalLink variant="geo" to="/pack-ship/fedex-shipping">
                FedEx
              </InternalLink>
              , and{' '}
              <InternalLink variant="geo" to="/pack-ship/usps-services">
                USPS
              </InternalLink>
              . Residents of{' '}
              <InternalLink variant="geo" to="/shipping-center-concord-township">
                Concord Township
              </InternalLink>
              , Mentor, and Painesville rely on us for timely processing.
            </p>
          </div>
        </div>

        {/* Pickup Hours Warm Grids */}
        <div
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20 ${gridInView ? 'animate-fade-in-up' : 'opacity-0'}`}
        >
          {pickupHours.map((item, idx) => (
            <div
              key={item.carrier}
              className="relative rounded-lg p-8 border border-[var(--color-border)] shadow-sm shadow-md overflow-hidden group animate-fade-in-up opacity-0"
              style={{ backgroundColor: item.bgTint, animationDelay: `${idx * 100 + 100}ms` }}
            >
              {/* Decorative accent bar */}
              <div
                className={`absolute top-0 left-0 w-full h-1.5 ${item.accentColor} opacity-80`}
              ></div>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className={`p-3 rounded-xl bg-white/80 shadow-sm ${item.iconColor}`}>
                  <Truck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {item.carrier}
                </h2>
              </div>

              <ul className="space-y-4 mb-8 relative z-10">
                {item.times.map((t) => (
                  <li
                    key={t.day}
                    className="flex justify-between items-center border-b pb-2 last:border-0"
                    style={{
                      color: 'var(--color-text-primary)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <span className="font-medium">{t.day}</span>
                    <span
                      className="font-bold text-lg"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {t.time}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className="text-sm p-5 rounded-2xl relative z-10 border border-[var(--color-border)]"
                style={{
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'rgba(255,255,255,0.6)',
                }}
              >
                <p className="font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  Accepted Packages:
                </p>
                {item.details}
              </div>
            </div>
          ))}
        </div>

        {/* Local SEO Section - Warm Glass Panel */}
        <section
          ref={localRef}
          className={`${warmGlassCard} p-8 md:p-12 mb-16 relative overflow-hidden ${localInView ? 'animate-fade-in-up' : 'opacity-0'}`}
        >
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-start gap-4 mb-6">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: 'var(--color-accent-warm)/0.1' }}
              >
                <MapPin className="w-6 h-6 text-[var(--color-accent-warm)]" />
              </div>
              <h3
                className="text-2xl font-bold mt-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Serving Lake County &amp; Surrounding Areas
              </h3>
            </div>
            <p
              className="leading-relaxed mb-6 pl-[4.5rem]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Whether you are coming from{' '}
              <InternalLink variant="geo" to="/pack-ship">
                Mentor
              </InternalLink>
              ,{' '}
              <InternalLink variant="geo" to="/pack-ship">
                Painesville
              </InternalLink>
              , or right here in{' '}
              <InternalLink variant="geo" to="/shipping-center-concord-township">
                Concord Township
              </InternalLink>
              , Mailbox Plus is your most convenient drop-off point. Avoid the long lines at the
              post office or the remote drop boxes that may not be secure.
            </p>
            <p
              className="leading-relaxed pl-[4.5rem]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              We handle <InternalLink to="/amazon-returns">Amazon returns</InternalLink>, prepaid
              labels, and can help you pack your items if they aren&apos;t ready to ship. Visit our{' '}
              <InternalLink to="/mailbox-rental">mailbox rental</InternalLink> page if you need a
              secure place to receive packages instead of sending them!
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section
          ref={faqRef}
          className={`max-w-3xl mx-auto mb-20 ${faqInView ? 'animate-fade-in-up' : 'opacity-0'}`}
        >
          <h2
            className="text-3xl font-bold text-center mb-10"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-[var(--color-bg-secondary)]/80 backdrop-blur-md border border-[var(--color-border)] rounded-[20px] shadow-sm hover:shadow-md transition-all px-2 overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-4 text-left font-semibold text-[var(--color-accent-warm)] hover:no-underline hover:text-[var(--color-accent-warm-light)]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  className="px-4 pb-4 leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Explore Our Services - Warm Card */}
        <section className="max-w-4xl mx-auto px-4">
          <div className="bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl rounded-lg border border-[var(--color-border)] p-6 shadow-sm text-center">
            <h2 className="text-xl font-bold mb-4">Explore Our Services</h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xl mx-auto">
              While you&apos;re here, check out our{' '}
              <InternalLink variant="geo" to="/pack-ship">
                pack and ship services
              </InternalLink>
              ,{' '}
              <InternalLink variant="geo" to="/copy-print">
                professional printing
              </InternalLink>
              ,{' '}
              <InternalLink variant="geo" to="/home-business/mailbox-rental">
                mailbox rentals
              </InternalLink>
              , and{' '}
              <InternalLink variant="geo" to="/home-business/notary-services">
                notary services
              </InternalLink>
              .
            </p>
          </div>
        </section>

        <CTASection cta={defaultCTA} />
      </main>
    </div>
  );
};

export default PickupHours;
