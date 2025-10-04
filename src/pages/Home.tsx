import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Shield,
  Package,
  Truck,
  Users,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui';
import { siteConfig } from '../config/siteConfig';
import { services } from '../config/services';

export const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  const serviceCategories = [
    'Pack & Ship Services',
    'Professional Printing',
    'Mailbox Rentals',
    'Document Services',
    'Notary Services',
    'Digital Fingerprinting'
  ];

  const featuredServices = [
    services.find(s => s.id === 'mailbox-rental'),
    services.find(s => s.id === 'golf-club-shipping'),
    services.find(s => s.id === 'package-receiving'),
    services.find(s => s.id === 'package-drop-offs'),
    services.find(s => s.id === 'business-cards'),
    services.find(s => s.id === 'digital-fingerprinting')
  ].filter(Boolean);

  const communityStories = [
    {
      id: 1,
      title: 'Local Artist Ships Nationwide',
      description: 'We helped a Concord Township artist safely ship their artwork collection to a New York gallery opening.',
      location: 'Concord Township',
      icon: '🎨'
    },
    {
      id: 2,
      title: 'Business Saves on Bulk Mailings',
      description: 'A Mentor small business saved over $200 using our Every Door Direct Mail service to reach local customers.',
      location: 'Mentor',
      icon: '💼'
    },
    {
      id: 3,
      title: 'Secure Mailbox for Remote Workers',
      description: 'Lake County residents working remotely trust our mailbox service for professional business addresses.',
      location: 'Lake County',
      icon: '📮'
    },
    {
      id: 4,
      title: 'Tournament-Ready Golf Clubs',
      description: 'We pack and ship golf clubs for Painesville golfers traveling to tournaments across the country.',
      location: 'Painesville',
      icon: '⛳'
    }
  ];

  const carriers = [
    {
      name: 'FedEx',
      logo: 'https://i.pinimg.com/736x/ca/81/86/ca8186c25901c848871ef27d1e28bb72.jpg'
    },
    {
      name: 'UPS',
      logo: 'https://www.citypng.com/public/uploads/preview/ups-black-logo-symbol-icon-hd-png-701751694777657xrnxzhkkat.png'
    },
    {
      name: 'USPS',
      logo: 'https://p7.hiclipart.com/preview/644/958/344/united-states-postal-service-mail-logo-united-states.jpg'
    },
    {
      name: 'DHL',
      logo: 'https://www.citypng.com/public/uploads/preview/hd-black-dhl-express-company-logo-transparent-background-701751694777679wwnbtwgoa8.png'
    }
  ];

  const whyChooseUs = [
    {
      icon: Clock,
      title: 'Fast & Reliable Service',
      description: 'Quick turnaround times on all services with multiple speed options'
    },
    {
      icon: Shield,
      title: 'Secure & Insured',
      description: 'Marsh insurance coverage and professional handling for peace of mind'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Locally owned and operated, serving Lake County since 2010'
    },
    {
      icon: Truck,
      title: 'All Major Carriers',
      description: 'FedEx, UPS, USPS, and DHL all in one convenient location'
    }
  ];

  const localAreas = [
    'Concord Township',
    'Mentor',
    'Painesville',
    'Eastlake',
    'Willoughby',
    'Wickliffe',
    'Madison',
    'Perry'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % serviceCategories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [serviceCategories.length]);

  const nextStory = () => {
    setCurrentSlide((prev) => (prev + 1) % communityStories.length);
  };

  const prevStory = () => {
    setCurrentSlide((prev) => (prev - 1 + communityStories.length) % communityStories.length);
  };

  const packShipService = services.find(s => s.id === 'pack-ship');
  const topFaqs = packShipService?.faqs?.slice(0, 3) || [];

  return (
    <div className="bg-white">
      <section
        className="relative bg-cover bg-center py-32 lg:py-48"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/mailbox_plus_storefront_hero_image.jpg')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
            >
              Pack & Ship in{' '}
              <span className="text-[#60A5FA]">Concord Township, Ohio</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-16 mb-8"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentServiceIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl md:text-2xl text-gray-100 leading-relaxed"
                >
                  {serviceCategories[currentServiceIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed"
            >
              Your trusted local partner for shipping, printing, and business services.
              Serving Lake County communities with integrity and care.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a href="#services">
                <Button size="lg" className="bg-[#0855B1] hover:bg-[#064080] text-white">
                  View Services
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${siteConfig.geo.lat},${siteConfig.geo.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-[#0855B1] hover:bg-gray-100"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Get Directions
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold text-[#111827] mb-4"
            >
              Our Featured Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-[#4B5563] max-w-3xl mx-auto"
            >
              From everyday shipping to specialized business services, we're your one-stop shop
              for all your professional needs in Lake County.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service?.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-200"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service?.heroImage}
                    alt={service?.serviceName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white">
                    {service?.serviceName}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-[#4B5563] mb-6 leading-relaxed">
                    {service?.heroSubtitle}
                  </p>
                  <Link to={service?.slug || '#'} className="group/link">
                    <div className="inline-flex items-center gap-2 text-[#0855B1] font-semibold text-sm hover:text-[#064A9B] transition-colors">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Trusted by All Major Carriers
            </h2>
            <p className="text-lg text-[#4B5563] mb-8 max-w-2xl mx-auto">
              We're authorized to ship with FedEx, UPS, USPS, and DHL.
              Plus, all shipments are backed by Marsh insurance for your peace of mind.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center items-center gap-12 mb-12"
          >
            {carriers.map((carrier, index) => (
              <motion.div
                key={carrier.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-16 flex items-center justify-center mb-3 bg-white rounded-lg border border-gray-200 p-3">
                  <img
                    src={carrier.logo}
                    alt={`${carrier.name} logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-[#4B5563]">{carrier.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-3 p-6 bg-[#F0F7FF] rounded-2xl max-w-2xl mx-auto"
          >
            <Shield className="w-8 h-8 text-[#0855B1] flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-[#111827] mb-1">
                Peace of Mind Protection
              </h3>
              <p className="text-sm text-[#4B5563]">
                All shipments are protected with Marsh insurance coverage for added security
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                Proudly Serving Lake County Communities
              </h2>
              <p className="text-lg text-[#4B5563] mb-6 leading-relaxed">
                Located in the heart of Concord Township, we're proud to serve families and
                businesses throughout Lake County. Whether you're in Mentor, Painesville,
                Eastlake, or surrounding areas, we're your trusted local partner.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {localAreas.map((area) => (
                  <span
                    key={area}
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-[#0855B1] border border-[#0855B1]/20"
                  >
                    {area}
                  </span>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#111827] mb-4">
                  Frequently Asked Questions
                </h3>
                {topFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white p-5 rounded-xl border border-gray-200"
                  >
                    <h4 className="font-semibold text-[#111827] mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-[#4B5563]">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-24"
            >
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=Mailbox+Plus+Concord+Township+OH`}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mailbox Plus Location Map"
                  className="w-full"
                />
              </div>
              <div className="mt-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <MapPin className="w-6 h-6 text-[#0855B1] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[#111827] mb-1">Visit Us</h4>
                    <p className="text-sm text-[#4B5563]">
                      {siteConfig.contact.address.street}<br />
                      {siteConfig.contact.address.city}, {siteConfig.contact.address.state} {siteConfig.contact.address.zip}
                    </p>
                    <p className="text-xs text-[#4B5563] mt-2 italic">
                      Next to Pub Frato in Gristmill Village
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-[#0855B1] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[#111827] mb-1">Store Hours</h4>
                    <p className="text-sm text-[#4B5563]">
                      Mon-Fri: 9:00 AM - 6:00 PM<br />
                      Sat: 9:00 AM - 2:00 PM<br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Community Stories
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              See how we've helped Lake County residents and businesses with their shipping and service needs.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-[#F0F7FF] to-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200"
              >
                <div className="text-6xl mb-6">{communityStories[currentSlide].icon}</div>
                <h3 className="text-2xl font-bold text-[#111827] mb-4">
                  {communityStories[currentSlide].title}
                </h3>
                <p className="text-lg text-[#4B5563] mb-6 leading-relaxed">
                  {communityStories[currentSlide].description}
                </p>
                <div className="flex items-center gap-2 text-sm text-[#0855B1] font-medium">
                  <MapPin className="w-4 h-4" />
                  {communityStories[currentSlide].location}
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={prevStory}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous story"
            >
              <ChevronLeft className="w-6 h-6 text-[#0855B1]" />
            </button>

            <button
              onClick={nextStory}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Next story"
            >
              <ChevronRight className="w-6 h-6 text-[#0855B1]" />
            </button>

            <div className="flex justify-center gap-2 mt-8">
              {communityStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-[#0855B1] w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to story ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Why Choose Mailbox Plus?
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              More than just a shipping store—we're your neighbors, committed to providing
              exceptional service to our Lake County community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="w-16 h-16 bg-[#F0F7FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-[#0855B1]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#4B5563] leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#0855B1] to-[#064080]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Visit Us in Concord Township Today
            </h2>
            <p className="text-xl text-blue-100 mb-3 max-w-3xl mx-auto">
              Next to Pub Frato in Gristmill Village — serving all of Lake County
            </p>
            <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto">
              Stop by for all your shipping, printing, and business service needs.
              Our friendly team is ready to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${siteConfig.geo.lat},${siteConfig.geo.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-white text-[#0855B1] hover:bg-gray-100 hover:text-[#064080]"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Get Directions
                </Button>
              </a>
              <a href={`tel:${siteConfig.contact.phone}`}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0855B1]"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call {siteConfig.contact.phone}
                </Button>
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 text-blue-100">
              <Clock className="w-5 h-5" />
              <span className="text-sm">
                Mon-Fri: 9AM-6PM | Sat: 9AM-2PM | Sun: Closed
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
