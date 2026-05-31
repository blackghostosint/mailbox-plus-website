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
    <div className="bg-slate-50">
      <Meta
        title="Shipping Partners - Mailbox Plus"
        description="Meet the businesses that trust Mailbox Plus for their shipping and logistics needs."
        canonical="https://www.mailboxplus.com/shipping-partners"
      />

      {/* ====================== HERO (V2 Standard) ======================= */}
      <section className="relative overflow-hidden">
        {/* V2 Gradient: #0B4BB6 → #1A6DFF → #021B4A */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B4BB6] via-[#1A6DFF] to-[#021B4A]" />

        {/* Soft Fade Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-slate-50 z-10" />

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-44 lg:pt-32 lg:pb-52 text-center max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            Our Shipping <span className="text-blue-200">Partners</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl text-blue-100 mb-8 leading-relaxed"
          >
            We&apos;re proud to work with a wide range of businesses who trust Mailbox Plus for
            their packing, shipping, and logistics needs.
          </motion.p>
        </div>
      </section>

      <main className="relative z-20 -mt-20 container mx-auto px-4 pb-20 space-y-20">
        {/* ====================== GLASS INTRO CARD ======================= */}
        <motion.div {...reveal} className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Note: Using rigid PRD styles */}
            <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-r from-white/60 via-white/20 to-white/60 opacity-80" />
            <div className="relative rounded-[26px] bg-white/70 backdrop-blur-xl border border-white/70 shadow-[0_18px_45px_rgba(15,23,42,0.20)] px-6 py-6 md:px-10 md:py-8 text-center">
              <p className="text-lg text-slate-700 leading-relaxed">
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
                className="group relative flex flex-col items-center p-8 rounded-[26px] bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1"
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

                <span className="text-lg font-bold text-slate-800 group-hover:text-[var(--color-primary)] transition-colors">
                  {partner.name}
                </span>
                <span className="text-sm text-slate-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Visit Website →
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ====================== CTA SECTION (V2 Gradient Panel) ======================= */}
        <motion.section {...reveal} className="max-w-4xl mx-auto">
          <div className="relative rounded-[30px] overflow-hidden shadow-[0_26px_65px_rgba(15,23,42,0.32)]">
            {/* V2 Gradient Shell */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B4BB6] via-[#2F7CFB] to-[#021B4A]" />
            {/* Inner Glass */}
            <div className="absolute inset-[1px] rounded-[28px] bg-white/10 backdrop-blur-xl border border-white/30" />

            <div className="relative z-10 px-8 py-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Need to Ship a Package?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Visit Mailbox Plus today for expert packing and shipping services. We make it easy
                to ship anything, anywhere.
              </p>
              <InternalLink
                to="/contact-us"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[var(--color-primary)] bg-white rounded-xl shadow-lg hover:bg-blue-50 transition-all hover:scale-105"
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
