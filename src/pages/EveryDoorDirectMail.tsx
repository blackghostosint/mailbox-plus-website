import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Target, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui';

export const EveryDoorDirectMail: React.FC = () => {
  return (
    <div className="bg-white">
      <section className="relative bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-6"
            >
              Every Door Direct{' '}
              <span className="text-[#0855B1]">Mail</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[#4B5563] mb-8 leading-relaxed"
            >
              USPS Every Door Direct Mail marketing services. Reach every household 
              and business in your target area with cost-effective direct mail campaigns.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg">Start Your Campaign</Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Mail, title: 'USPS Service', description: 'Official USPS Every Door Direct Mail program' },
              { icon: MapPin, title: 'Target Areas', description: 'Choose specific neighborhoods and zip codes' },
              { icon: Target, title: 'Reach Everyone', description: 'Deliver to every address in selected areas' },
              { icon: TrendingUp, title: 'Cost Effective', description: 'Affordable rates for mass marketing' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#F0F7FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-[#0855B1]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#4B5563] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};