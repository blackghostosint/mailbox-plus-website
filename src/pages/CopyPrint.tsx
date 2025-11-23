import React from 'react';
import { InternalLink } from '../components/ui/InternalLink';
import { motion } from 'framer-motion';
import { Printer, FileText, Palette, Star, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui';
import { CTASection } from "../components/sections/CTA";
import { defaultCTA } from "../config/siteConfig";

export const CopyPrint: React.FC = () => {
  const services = [
    {
      title: 'Business Cards',
      description: 'Professional business cards with custom design options.',
      href: '/copy-print/business-cards',
      icon: '💼'
    },
    {
      title: 'Copying Services',
      description: 'High-quality black and white and color copying.',
      href: '/copy-print/copies',
      icon: '📄'
    },
    /*
    {
      title: 'Document Finishing',
      description: 'Binding, laminating, and professional document finishing.',
      href: '/copy-print/document-finishing',
      icon: '📚'
    },
    */
    {
      title: 'Flyers & Brochures',
      description: 'Eye-catching marketing materials for your business.',
      href: '/copy-print/flyers-brochures',
      icon: '📰'
    },
    {
      title: 'Graphic Design',
      description: 'Professional design services for all your print needs.',
      href: '/copy-print/graphic-design',
      icon: '🎨'
    },
    {
      title: 'Poster & Banner Printing',
      description: 'Large format printing for events and promotions.',
      href: '/copy-print/posters-printing',
      icon: '🖼️'
    },
    {
      title: 'Postcard Printing',
      description: 'Custom postcards for marketing and personal use.',
      href: '/copy-print/postcard-printing',
      icon: '📮'
    },
    {
      title: 'Print Document Services',
      description: 'Complete document printing and production services.',
      href: '/copy-print/document-printing',
      icon: '🖨️'
    }
  ];

  const features = [
    {
      icon: Printer,
      title: 'Professional Quality',
      description: 'High-resolution printing with vibrant colors'
    },
    {
      icon: FileText,
      title: 'All Document Types',
      description: 'From business cards to large format posters'
    },
    {
      icon: Palette,
      title: 'Design Services',
      description: 'Professional graphic design available'
    },
    {
      icon: Star,
      title: 'Fast Turnaround',
      description: 'Quick service for urgent printing needs'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-6"
            >
              Copy & Print{' '}
              <span className="text-[#0855B1]">Services</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[#4B5563] mb-8 leading-relaxed"
            >
              Professional printing services from business cards to large format banners. 
              High-quality results with fast turnaround times.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a href="mailto:help@mailboxplusohio.com">
                <Button size="lg">Get Printing Quote</Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
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

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Our Printing Services
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              From everyday copying to professional marketing materials, 
              we provide comprehensive printing solutions for all your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-[#111827] mb-3">
                  {service.title}
                </h3>
                <p className="text-[#4B5563] mb-6 leading-relaxed">
                  {service.description}
                </p>
                <InternalLink to={service.href} className="group/link">
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

      {/* Reusable CTA Section */}
      <CTASection cta={defaultCTA} className="mb-20" />
    </div>
  );
};