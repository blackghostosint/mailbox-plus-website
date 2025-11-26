// src/pages/ShippingPartners.tsx
import React from "react";
import { motion } from "framer-motion";
import { shippingPartners } from "../data/shippingPartners";
import { Meta } from "../components/Meta";
import { InternalLink } from "../components/ui/InternalLink";

import { SmartImage } from "../components/SmartImage";
import { fadeUp } from "../utils";

const ShippingPartners: React.FC = () => {
  return (
    <div className="bg-white">
      <Meta
        title="Shipping Partners – Mailbox Plus"
        description="Meet the businesses that trust Mailbox Plus for their shipping and logistics needs."
        canonical="https://www.mailboxplus.com/shipping-partners"
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0855B1] to-[#064080] py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <motion.h1 {...fadeUp(0)} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6">
            Our Shipping <span className="text-[#60A5FA]">Partners</span>
          </motion.h1>
          <motion.p {...fadeUp(0.15)} className="text-xl text-blue-100 mb-8 leading-relaxed">
            We&apos;re proud to work with a wide range of businesses who trust Mailbox Plus for their packing, shipping, and logistics needs.
          </motion.p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-20">
        {/* Intro Text */}
        <motion.div {...fadeUp(0.2)} className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed">
            We are your one-stop <InternalLink variant="geo" to="/ups-fedex-usps-dhl-shipping-concord-township">UPS, FedEx, USPS, and DHL shipping center</InternalLink>.
            Compare rates and services for <InternalLink variant="geo" to="/pack-ship/ups-authorized-shipper-outlet">UPS shipping</InternalLink>, <InternalLink variant="geo" to="/pack-ship/fedex-shipping">FedEx services</InternalLink>, <InternalLink variant="geo" to="/pack-ship/usps-services">USPS mail</InternalLink>, and <InternalLink variant="geo" to="/pack-ship/dhl-express">DHL international shipping</InternalLink>.
          </p>
        </motion.div>

        {/* Partner Grid */}
        <motion.div {...fadeUp(0.3)} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 justify-items-center max-w-6xl mx-auto">
          {shippingPartners.map((partner, i) => (
            <motion.a
              key={partner.name}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center group w-full p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <div className="h-40 w-full flex items-center justify-center mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow duration-300">
                <SmartImage
                  src={partner.logoUrl}
                  alt={`${partner.name} logo`}
                  className="max-h-32 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-lg font-semibold text-gray-800 group-hover:text-[#0855B1] transition-colors">
                {partner.name}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </main>

      {/* CTA */}
      <section className="py-16 bg-[#F9FAFB] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeUp(0)} className="text-3xl font-bold text-[#111827] mb-4">
            Need to Ship a Package?
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-lg text-[#4B5563] mb-8">
            Visit Mailbox Plus today for expert packing and shipping services.
          </motion.p>
          <motion.div {...fadeUp(0.3)}>
            <InternalLink
              to="/contact-us"
              className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-4 px-8 py-4 text-base rounded-xl bg-[#0855B1] text-white hover:bg-[#064A9B] hover:shadow-lg focus:ring-[#B2D3EB] shadow-md hover:no-underline"
            >
              Visit Us Today
            </InternalLink>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPartners;