import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, Shield, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui';

export const PackShip: React.FC = () => {
  const services = [
    {
      title: 'Artwork Shipping',
      description: 'Specialized packaging and shipping for valuable artwork and fragile items.',
      href: '/pack-ship/artwork-shipping',
      icon: '🎨'
    },
    {
      title: 'Bicycle Shipping',
      description: 'Professional bicycle packing and shipping services nationwide.',
      href: '/pack-ship/bicycle-shipping',
      icon: '🚲'
    },
    {
      title: 'Golf Club Shipping',
      description: 'Professional golf club packing and shipping for tournaments and travel.',
      href: '/pack-ship/golf-club-shipping',
      icon: '⛳'
    },
    {
      title: 'FedEx Shipping',
      description: 'Full-service FedEx authorized shipping center with all service levels.',
      href: '/pack-ship/fedex-shipping',
      icon: '📦'
    },
    {
      title: 'UPS Authorized Shipper Outlet',
      description: 'Complete UPS shipping services with competitive rates.',
      href: '/pack-ship/ups-authorized-shipper-outlet',
      icon: '🚚'
    },
    {
      title: 'Postage Stamps',
      description: 'USPS postage stamps and postal services available.',
      href: '/pack-ship/postage-stamps',
      icon: '📮'
    },
    {
      title: 'International Shipping',
      description: 'Worldwide shipping with customs documentation assistance.',
      href: '/pack-ship/international-shipping',
      icon: '🌍'
    },
    {
      title: 'Package Drop-offs',
      description: 'Convenient drop-off service for pre-labeled packages.',
      href: '/pack-ship/package-drop-offs',
      icon: '📋'
    },
    {
      title: 'Package Receiving',
      description: 'Secure package receiving service for your deliveries.',
      href: '/pack-ship/package-receiving',
      icon: '📥'
    },
    {
      title: 'Custom Box Making',
      description: 'Custom-sized boxes made to fit your specific items.',
      href: '/pack-ship/custom-box-making',
      icon: '📦'
    },
    {
      title: 'Professional Packing',
      description: 'Expert packing services to ensure safe delivery.',
      href: '/pack-ship/professional-packing',
      icon: '🛡️'
    },
    {
      title: 'Packaging Supplies',
      description: 'Complete selection of boxes, tape, bubble wrap, and more.',
      href: '/pack-ship/packaging-supplies',
      icon: '📦'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Packaging',
      description: 'Professional packing ensures your items arrive safely'
    },
    {
      icon: Clock,
      title: 'Fast Service',
      description: 'Quick turnaround times for all shipping needs'
    },
    {
      icon: Truck,
      title: 'Multiple Carriers',
      description: 'FedEx, UPS, USPS, and DHL all in one location'
    },
    {
      icon: Package,
      title: 'Custom Solutions',
      description: 'Tailored packaging for unique or fragile items'
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
              Pack & Ship{' '}
              <span className="text-[#0855B1]">Services</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[#4B5563] mb-8 leading-relaxed"
            >
              Professional packing and shipping services with FedEx, UPS, USPS, and DHL. 
              From fragile artwork to everyday packages, we handle it all with care.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg">Get Shipping Quote</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Services Grid */}
      <section className="py-20 bg-white">
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
                <Link to={service.href}>
                  <Button variant="link" className="text-sm group">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
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
              Ready to Ship?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Visit our store for professional packing and shipping services, 
              or contact us for a custom quote on your shipping needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-[#0855B1] hover:bg-gray-50"
              >
                Visit Our Store
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