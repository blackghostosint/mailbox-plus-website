import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  Printer, 
  Mail, 
  Fingerprint, 
  Truck, 
  FileText, 
  Shield, 
  Globe,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui';

export const Services: React.FC = () => {
  const mainServices = [
    {
      icon: Package,
      title: 'Pack & Ship Services',
      description: 'Complete shipping solutions with FedEx, UPS, USPS, and DHL. Professional packing, international shipping, and package receiving.',
      href: '/pack-ship',
      features: [
        'All Major Carriers',
        'Professional Packing',
        'International Shipping',
        'Package Drop-offs',
        'Custom Box Making',
        'Fragile Item Specialists'
      ],
      image: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Printer,
      title: 'Printing & Design',
      description: 'Professional printing services from business cards to large format posters. Full-service graphic design and document finishing.',
      href: '/copy-print',
      features: [
        'Business Cards',
        'Marketing Materials',
        'Poster & Banners',
        'Graphic Design',
        'Document Binding',
        'Laminating Services'
      ],
      image: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Mail,
      title: 'Mailbox & Business Services',
      description: 'Secure mailbox rentals with real street addresses, document services, and business support solutions.',
      href: '/home-business',
      features: [
        'Private Mailbox Rental',
        'Real Street Address',
        'Package Receiving',
        'Document Scanning',
        'Shredding Services',
        'Fax Services'
      ],
      image: 'https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Fingerprint,
      title: 'Digital Fingerprinting',
      description: 'Fast, clean LiveScan fingerprinting services for employment, licensing, and background checks.',
      href: '/digital-fingerprinting',
      features: [
        'LiveScan Technology',
        'Employment Screening',
        'License Applications',
        'Background Checks',
        'Quick Results',
        'Professional Service'
      ],
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const additionalServices = [
    {
      icon: Truck,
      title: 'Package Tracking',
      description: 'Track all your shipments in one place',
      href: '/tracking'
    },
    {
      icon: FileText,
      title: 'Document Services',
      description: 'Copying, scanning, and document management',
      href: '/home-business/document-scanning'
    },
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'Safe and secure package holding',
      href: '/pack-ship/package-receiving'
    },
    {
      icon: Globe,
      title: 'International Services',
      description: 'Global shipping and customs assistance',
      href: '/pack-ship/international-shipping'
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
              Complete Business{' '}
              <span className="text-[#0855B1]">Solutions</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[#4B5563] mb-8 leading-relaxed"
            >
              From shipping and printing to mailbox rentals and fingerprinting, 
              we provide comprehensive business services to meet all your needs.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg">Get Started Today</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Our Core Services
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              Professional services designed to support your personal and business needs 
              with the highest level of care and expertise.
            </p>
          </div>

          <div className="space-y-16">
            {mainServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="w-16 h-16 bg-[#0855B1] rounded-2xl flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#111827] mb-4">
                    {service.title}
                  </h3>
                  <p className="text-lg text-[#4B5563] mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-[#4B5563]">
                        <div className="w-2 h-2 bg-[#0855B1] rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link to={service.href}>
                    <Button className="group">
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="relative">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="rounded-2xl shadow-lg w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Additional Services
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              We offer a comprehensive range of additional services to support 
              all your business and personal needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 text-center"
              >
                <div className="w-12 h-12 bg-[#F0F7FF] rounded-xl flex items-center justify-center mx-auto mb-6">
                  <service.icon className="w-6 h-6 text-[#0855B1]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-3">
                  {service.title}
                </h3>
                <p className="text-[#4B5563] mb-4 leading-relaxed">
                  {service.description}
                </p>
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

      {/* CTA Section */}
      <section className="py-20 bg-[#0855B1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Our experienced team is here to help you find the perfect solution 
              for your specific needs. Contact us today for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-[#0855B1] hover:bg-gray-50"
              >
                Contact Our Team
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