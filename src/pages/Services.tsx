import React, { useState, useEffect } from 'react';
import { InternalLink } from '../components/ui/InternalLink';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowRight from '~icons/lucide/arrow-right';
import MapPin from '~icons/lucide/map-pin';
import Phone from '~icons/lucide/phone';
import Clock from '~icons/lucide/clock';
import ChevronUp from '~icons/lucide/chevron-up';
import { Button } from '../components/ui';
import { siteConfig } from '../config/siteConfig';
import { services } from '../config/services';
import { getGoogleMapsLink } from '../utils/location';
import { Meta } from '../components/Meta';
import { pageMeta } from '../config/pageMeta';
import { SmartImage } from '../components/SmartImage';
import { getServiceImageUrl } from '../lib/storage';

// Utility to generate safe IDs
const makeId = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

// Map display category → actual service.category value (from services.ts)
const categoryMap: Record<string, string> = {
  'Pack & Ship Services': 'pack-ship',
  'Professional Printing': 'copy-print',
  'Mailbox Rentals': 'mailbox-rentals',
  'Document Services': 'document-services',
  'Additional Services': 'additional-services',
};

// Animation constants (V2 Spec)
const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: 'easeOut' as const },
};

export const Services: React.FC = () => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [showTopButton, setShowTopButton] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const serviceCategories = [
    'Pack & Ship Services',
    'Professional Printing',
    'Mailbox Rentals',
    'Document Services',
    'Additional Services',
  ];

  // Rotate the tagline in hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % serviceCategories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [serviceCategories.length]);

  // Toggle the Back to Top button
  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const { title, description, schema } = pageMeta['/services'];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Meta title={title} description={description} schema={schema} />

      {/* ====================== HERO SECTION (V2 Standard) ======================= */}
      <section className="relative bg-center py-32 lg:py-48 overflow-hidden min-h-[80vh]">
        {/* Background Image with V2 Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          <SmartImage
            priority
            sources={[
              {
                srcSet: getServiceImageUrl('mailbox_plus_storefront_hero_image_mobile.webp'),
                media: '(max-width: 768px)',
                type: 'image/webp',
              },
              {
                srcSet: getServiceImageUrl('mailbox_plus_storefront_hero_image.webp'),
                media: '(min-width: 769px)',
                type: 'image/webp',
              },
            ]}
            src={getServiceImageUrl('mailbox_plus_storefront_hero_image.webp')}
            alt="Mailbox Plus storefront in Concord Township, Ohio"
            className="w-full h-full object-cover mix-blend-soft-light opacity-90 blur-[1px] scale-105"
            style={{ objectPosition: 'center' }}
          />
          {/* V2 Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-start)] via-[var(--color-accent)] to-[var(--color-gradient-mid)] opacity-90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[var(--color-gradient-end)]/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-sm"
          >
            Explore Our <span className="text-blue-200">Services</span>
          </motion.h1>

          {/* Rotating tagline */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            className="h-16 mb-8"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentServiceIndex}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
                className="text-xl md:text-2xl text-blue-50 leading-relaxed font-medium"
              >
                {serviceCategories[currentServiceIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#categories">
              <Button
                size="lg"
                variant="secondary"
                className="hover:bg-blue-50 font-bold shadow-lg border-none min-h-11"
              >
                View Categories <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            {/* Directions Button */}
            <a
              href={getGoogleMapsLink('directions', siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-deeper)] border border-blue-400/30 shadow-lg min-h-11 min-w-[48px] min-h-[48px]"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>
            {/* View on Map Button */}
            <a
              href={getGoogleMapsLink('view', siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="ghost"
                className="text-white border border-white/40 hover:bg-white/10 min-h-11 min-w-[48px] min-h-[48px]"
              >
                <MapPin className="w-5 h-5 mr-2" />
                View on Map
              </Button>
            </a>
          </div>
        </div>

        {/* Soft fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-slate-50"></div>
      </section>

      {/* ====================== CATEGORY NAVIGATION ======================= */}
      <section id="categories" className="py-12 bg-slate-50 relative z-10 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/70 backdrop-blur-xl rounded-[26px] shadow-lg border border-white/50 p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Explore Our Services</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {serviceCategories.map((category) => (
                <a
                  key={category}
                  href={`#${makeId(category)}`}
                  className="px-6 py-3 bg-white/50 hover:bg-white rounded-full border border-blue-100/50 hover:border-blue-300 text-slate-700 hover:text-[var(--color-primary)] transition-all shadow-sm flex items-center justify-center font-medium"
                >
                  {category}
                </a>
              ))}
            </div>
            <div className="mt-8 text-gray-600 max-w-2xl mx-auto">
              <p>
                Looking for{' '}
                <InternalLink variant="geo" to="/pack-and-ship-services-concord-township">
                  pack and ship services in Concord Township
                </InternalLink>
                ? Whether you need{' '}
                <InternalLink variant="geo" to="/shipping">
                  UPS, FedEx, DHL, or USPS shipping
                </InternalLink>
                ,
                <InternalLink variant="geo" to="/printing">
                  professional printing
                </InternalLink>
                , or a
                <InternalLink variant="geo" to="/mailbox-rental">
                  secure private mailbox
                </InternalLink>
                , browse our full list of offerings below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== SERVICE SECTIONS (V2 Glass Cards) ======================= */}
      {serviceCategories.map((category) => (
        <section
          key={category}
          id={makeId(category)}
          className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={reveal.initial}
            whileInView={reveal.whileInView}
            viewport={reveal.viewport}
            transition={reveal.transition}
          >
            <h2 className="text-3xl font-bold mb-8 text-slate-900 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-[var(--color-gradient-start)] to-[var(--color-accent)] rounded-full mr-4"></span>
              {category}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services
                .filter((s) => s.category === categoryMap[category])
                .map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="p-6 bg-white/70 backdrop-blur-md border border-white/60 rounded-[26px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(var(--color-primary),0.1)] transition-all flex flex-col group"
                  >
                    {/* Thumbnail with fade overlay + subtle zoom */}
                    {service.heroImage ? (
                      <div className="relative w-full aspect-[3/2] mb-6 overflow-hidden rounded-2xl group-hover:shadow-md transition-all">
                        <SmartImage
                          src={service.heroImage}
                          alt={service.serviceName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[var(--color-primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                      </div>
                    ) : service.icon ? (
                      <div className="w-full aspect-[3/2] flex items-center justify-center mb-6 bg-blue-50/50 rounded-2xl group relative overflow-hidden border border-blue-100/50">
                        <service.icon className="w-12 h-12 text-[var(--color-primary)] transition-transform duration-500 group-hover:scale-110" />
                      </div>
                    ) : (
                      <div className="w-full aspect-[3/2] mb-6 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 text-lg font-bold">
                        ?
                      </div>
                    )}

                    <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-[var(--color-primary)] transition-colors">
                      {service.serviceName}
                    </h3>
                    <p className="text-slate-600 mb-6 flex-grow leading-relaxed">
                      {service.metaDescription}
                    </p>
                    <InternalLink to={service.slug} className="mt-auto">
                      <Button variant="secondary" className="w-full shadow-sm">
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </InternalLink>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </section>
      ))}

      {/* ====================== VISIT US SECTION (V2 Gradient) ======================= */}
      <section className="py-20 bg-gradient-to-br from-[var(--color-gradient-start)] via-[var(--color-accent)] to-[var(--color-gradient-mid)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Visit Us in Concord Township Today
          </h2>
          <p className="text-xl text-blue-100 mb-3 max-w-3xl mx-auto">
            Next to Pub Frato in Gristmill Village — serving all of Lake County
          </p>
          <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto">
            Stop by for all your shipping, printing, and business service needs. Our friendly team
            is ready to help!
          </p>

          <div className="mb-8 text-blue-100">
            <p>
              We specialize in{' '}
              <InternalLink
                variant="geo"
                to="/amazon-returns"
                className="text-white hover:text-blue-200 underline decoration-blue-300/50 underline-offset-4"
              >
                Amazon returns
              </InternalLink>
              ,
              <InternalLink
                variant="geo"
                to="/notary"
                className="text-white hover:text-blue-200 underline decoration-blue-300/50 underline-offset-4"
              >
                notary services
              </InternalLink>
              , and
              <InternalLink
                variant="geo"
                to="/pack-ship"
                className="text-white hover:text-blue-200 underline decoration-blue-300/50 underline-offset-4"
              >
                custom packing
              </InternalLink>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* Directions Button */}
            <a
              href={getGoogleMapsLink('directions', siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="secondary"
                className="hover:bg-blue-50 font-bold shadow-lg border-none min-h-11"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>
            {/* View on Map Button */}
            <a
              href={getGoogleMapsLink('view', siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="ghost"
                className="text-white border border-white/40 hover:bg-white/10 min-h-11 min-w-[48px] min-h-[48px]"
              >
                <MapPin className="w-5 h-5 mr-2" />
                View on Map
              </Button>
            </a>
            <a href={`tel:${siteConfig.contact.phone}`}>
              <Button
                size="lg"
                className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 min-h-11"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call {siteConfig.contact.phone}
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-blue-100">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Mon-Fri: 9AM-6PM | Sat: 9AM-2PM | Sun: Closed</span>
          </div>
        </div>
      </section>

      {/* BACK TO TOP BUTTON */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[var(--color-primary)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--color-primary-deeper)] transition hover:scale-110 z-50"
          aria-label="Back to Top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
