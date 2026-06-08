// src/pages/ShippingPartners.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { shippingPartners } from '../data/shippingPartners';
import { Meta } from '../components/Meta';
import { InternalLink } from '../components/ui/InternalLink';
import { SmartImage } from '../components/SmartImage';
import { CarrierLogos } from '../components/CarrierLogos'; // Using barrel export if available, checking imports

// Animation constants from PRD
const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: 'easeOut' as const },
};

const ShippingPartners: React.FC = () => {
  return (
    <div className="bg-[var(--color-bg-primary)]">
      <Meta
        title="Shipping Partners - Mailbox Plus"
        description="Meet the businesses that trust Mailbox Plus for their shipping and logistics needs."
        canonical="https://www.mailboxplus.com/shipping-partners"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] py-16 lg:py-24 text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6"
          >
            Our Shipping Partners
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium max-w-3xl mx-auto mb-10"
          >
            We&apos;re proud to work with a wide range of businesses who trust Mailbox Plus for
            their packing, shipping, and logistics needs.
          </motion.p>
        </div>

        {/* Soft edge blend at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)] z-10" />
      </section>

      <main className="relative z-20 -mt-20 container mx-auto px-4 pb-20 space-y-20">
        {/* ====================== GLASS INTRO CARD ======================= */}
        <motion.div {...reveal} className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Note: Using rigid PRD styles */}
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-white/60 via-white/20 to-white/60 opacity-80" />
            <div className="relative rounded-lg bg-white/70 backdrop-blur-xl border border-white/70 shadow-lg px-6 py-6 md:px-10 md:py-8 text-center">
              <p className="text-lg text-[var(--color-text-primary)] leading-relaxed">
                We are your one-stop{' '}
                <InternalLink variant="geo" to="/ups-fedex-usps-dhl-shipping-concord-township">
                  UPS, FedEx, USPS, and DHL shipping center
                </InternalLink>
                . Compare rates and services for{' '}
                <InternalLink variant="geo" to="/pack-ship/ups-authorized-shipper-outlet">
                  UPS shipping
                </InternalLink>
                ,{' '}
                <InternalLink variant="geo" to="/pack-ship/fedex-shipping">
                  FedEx services
                </InternalLink>
                ,{' '}
                <InternalLink variant="geo" to="/pack-ship/usps-services">
                  USPS mail
                </InternalLink>
                , and{' '}
                <InternalLink variant="geo" to="/pack-ship/dhl-express">
                  DHL international shipping
                </InternalLink>
                .
              </p>
            </div>
          </div>
        </motion.div>

        {/* ====================== PARTNER GRID (V2 Glass Cards) ======================= */}
        <motion.div {...reveal} className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {shippingPartners.map((partner, i) => (
              <motion.a
                key={partner.name}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center p-8 rounded-lg bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 * i }}
              >
                {/* Icon Container V2 */}
                <div className="h-32 w-full flex items-center justify-center mb-6 rounded-2xl bg-white/80 border border-white/50 shadow-inner">
                  <SmartImage
                    src={partner.logoUrl}
                    alt={`${partner.name} logo`}
                    className="max-h-20 max-w-[80%] object-contain"
                  />
                </div>

                <span className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                  {partner.name}
                </span>
                <span className="text-sm text-[var(--color-bg-primary)] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Visit Website →
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ====================== CTA SECTION (V2 Gradient Panel) ======================= */}
        <motion.section {...reveal} className="max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            {/* V2 Gradient Shell */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)]" />
            {/* Inner Glass */}
            <div className="absolute inset-[1px] rounded-[28px] bg-white/10 backdrop-blur-xl border border-white/30" />

            <div className="relative z-10 px-8 py-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Need to Ship a Package?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Visit Mailbox Plus today for expert packing and shipping services. We make it easy
                to ship anything, anywhere.
              </p>
              <InternalLink
                to="/contact-us"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[var(--color-primary)] bg-white rounded-xl shadow-lg hover:bg-[var(--color-bg-blue-tint)] transition-all hover:scale-105"
              >
                Visit Us Today
              </InternalLink>
            </div>
          </div>
        </motion.section>
      </main>

      <CarrierLogos />
    </div>
  );
};

export default ShippingPartners;
