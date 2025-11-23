import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ServicePage } from '../components/ServicePage';
import { InternalLink } from '../components/ui/InternalLink';
import { CTASection } from '../components/sections/CTA';
import { services } from '../config/services';
import { packShipServices } from '../config/services/pack-ship';
import { defaultCTA } from '../config/siteConfig';

export const PackShip: React.FC = () => {
  const service = services.find(s => s.id === 'pack-ship')!;

  return (
    <ServicePage {...service}>
      {/* Services Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Our Pack & Ship Services
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              Comprehensive shipping solutions for all your needs, from everyday packages 
              to specialized items requiring extra care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packShipServices.map((subService, index) => (
              <motion.div
                key={subService.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <div className="mb-4">
                  {subService.icon ? (
                    <subService.icon className="w-10 h-10 text-[#0855B1]" />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-[#111827] mb-3">
                  {subService.serviceName}
                </h3>
                <p className="text-[#4B5563] mb-6 leading-relaxed line-clamp-3">
                  {subService.heroSubtitle}
                </p>
                <InternalLink to={subService.slug} className="group/link">
                  <div className="inline-flex items-center gap-2 text-[#0855B1] font-semibold text-sm hover:text-[#064A9B] transition-colors">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </InternalLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-700">
            As your complete <InternalLink variant="geo" to="/ups-fedex-usps-dhl-shipping-concord-township">shipping center in Concord Township</InternalLink>,
            we offer <InternalLink variant="geo" to="/shipping-center-concord-township">multi-carrier shipping services</InternalLink> including <InternalLink variant="geo" to="/pack-ship/ups-authorized-shipper-outlet">UPS</InternalLink>, <InternalLink variant="geo" to="/pack-ship/fedex-shipping">FedEx</InternalLink>, and <InternalLink variant="geo" to="/pack-ship/usps-services">USPS</InternalLink> to help you find the best rate and delivery time.
          </p>
        </div>
      </section>

      {/* Reusable CTA Section */}
      <CTASection cta={defaultCTA} className="mb-20" />
    </ServicePage>
  );
};
