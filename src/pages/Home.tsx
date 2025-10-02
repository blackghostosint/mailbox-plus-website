import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Printer, Mail, Fingerprint, Truck, Clock, Shield, Users } from 'lucide-react';
import { Button } from '../components/ui';

export const Home: React.FC = () => {
  const services = [
    {
      icon: Package,
      title: 'Pack & Ship',
      description: 'FedEx, UPS, USPS, and DHL shipping with professional packing services.',
      href: '/pack-ship',
      features: ['Professional Packing', 'All Major Carriers', 'International Shipping']
    },
    {
      icon: Printer,
      title: 'Printing Services',
      description: 'Business cards, flyers, posters, and custom printing solutions.',
      href: '/copy-print',
      features: ['Business Cards', 'Marketing Materials', 'Graphic Design']
    },
    {
      icon: Mail,
      title: 'Mailbox Rental',
      description: 'Secure mailbox rental with a real street address for your business.',
      href: '/home-business/mailbox-rental',
      features: ['Real Street Address', 'Package Receiving', '24/7 Access']
    },
    {
      icon: Fingerprint,
      title: 'Digital Fingerprinting',
      description: 'Fast, clean LiveScan fingerprinting for employment and licensing.',
      href: '/digital-fingerprinting',
      features: ['LiveScan Technology', 'Quick Results', 'Professional Service']
    }
  ];

  const features = [
    {
      icon: Clock,
      title: 'Fast Service',
      description: 'Quick turnaround times on all services'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your packages and documents are safe with us'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Serving Mentor and surrounding areas since 2010'
    },
    {
      icon: Truck,
      title: 'Multiple Carriers',
      description: 'FedEx, UPS, USPS, and DHL all in one location'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <Link to="/" className="inline-block">
                <img 
                  src="/logo.png" 
                  alt="Mailbox Plus Ohio Logo"
                  className="w-full max-w-2xl mx-auto object-contain"
                />
              </Link>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold text-[#111827] tracking-tight mb-6"
            >
              Forget Everything You Know About{' '}
              <span className="text-[#0855B1]">Shipping</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-[#4B5563] mb-8 leading-relaxed"
            >
              Fast, community-based service — backed by integrity and care. 
              Your trusted pack & ship store in Lake County, Ohio.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/services">
                <Button variant="secondary" size="lg">View All Services</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Complete Business Solutions
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              From shipping and printing to mailbox rentals and fingerprinting, 
              we're your one-stop shop for all business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <div className="w-12 h-12 bg-[#0855B1] rounded-xl flex items-center justify-center mb-6">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#111827] mb-3">
                  {service.title}
                </h3>
                <p className="text-[#4B5563] mb-4 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-sm text-[#4B5563] flex items-center">
                      <div className="w-1.5 h-1.5 bg-[#0855B1] rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={service.href}>
                  <Button variant="link" className="text-sm">
                    Learn More →
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Why Choose Mailbox Plus?
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              We're more than just a shipping store. We're your neighbors, 
              committed to providing exceptional service to our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* CTA Section */}
      <section className="py-20 bg-[#0855B1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Visit our store in Concord Twp or contact us today for a quote on your shipping, 
              printing, or business service needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-[#0855B1] hover:bg-gray-50"
              >
                Get Directions
              </Button>
              <Button 
                variant="link" 
                size="lg"
                className="text-white hover:text-blue-100"
              >
                Call (440) 709-1946
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};