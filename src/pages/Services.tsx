import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Printer, Mail, Fingerprint } from 'lucide-react';
import { Button } from '../components/ui';
import { Meta } from '../components';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { services } from '../config/services';
import { getServicesByCategory } from '../utils/services-helpers';
import type { ServiceCategory } from '../types/services';

const categoryData = [
  {
    id: 'pack-ship' as ServiceCategory,
    name: 'Pack & Ship',
    tagline: '📦 Pack & Ship — Shipping with FedEx, UPS, USPS, and DHL made easy.',
    icon: Package,
    color: '#0855B1'
  },
  {
    id: 'copy-print' as ServiceCategory,
    name: 'Copy & Print',
    tagline: '🖨️ Copy & Print — Professional printing and design services for your business.',
    icon: Printer,
    color: '#059669'
  },
  {
    id: 'home-business' as ServiceCategory,
    name: 'Mailbox & Business',
    tagline: '📬 Mailbox & Business — Secure mailbox rentals and comprehensive business solutions.',
    icon: Mail,
    color: '#DC2626'
  },
  {
    id: 'specialty' as ServiceCategory,
    name: 'Specialty Services',
    tagline: '👆 Specialty Services — Digital fingerprinting and specialized offerings.',
    icon: Fingerprint,
    color: '#7C3AED'
  }
];

const faqs = [
  {
    question: 'Do you accept Amazon returns?',
    answer: 'Yes! We accept Amazon returns through our UPS and USPS shipping services. Just bring your QR code or printed return label and we\'ll handle the rest.'
  },
  {
    question: 'Do I need an appointment for fingerprinting?',
    answer: 'Walk-ins are welcome for digital fingerprinting services! However, making an appointment can help reduce your wait time, especially during busy periods.'
  },
  {
    question: 'Can you ship fragile artwork?',
    answer: 'Absolutely! We specialize in shipping fragile items including artwork, sculptures, and antiques. Our expert packing team uses professional materials and custom crating to ensure safe delivery.'
  }
];

export const Services: React.FC = () => {
  return (
    <>
      <Meta
        title="Mailbox Plus Services in Concord Township, Lake County, Ohio"
        description="Explore shipping, printing, mailbox rentals, fingerprinting, and more services from Mailbox Plus in Lake County, Ohio."
        keywords="mailbox plus services, shipping, printing, mailbox rental, fingerprinting, concord township, lake county ohio"
      />

      <div className="bg-white">
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight mb-6"
              >
                Our Services
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg md:text-xl text-[#4B5563] mb-8 leading-relaxed"
              >
                From shipping and printing to mailbox rentals and fingerprinting — Mailbox Plus is your one-stop business solution in Lake County.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link to="/contact-us">
                  <Button size="lg" className="group">
                    Contact Us
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {categoryData.map((category, categoryIndex) => {
          const categoryServices = getServicesByCategory(category.id).filter(s => s.id !== category.id);

          if (categoryServices.length === 0) return null;

          return (
            <section
              key={category.id}
              className={`py-16 lg:py-20 ${categoryIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-12"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <category.icon className="w-6 h-6" style={{ color: category.color }} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#111827]">
                      {category.name}
                    </h2>
                  </div>
                  <p className="text-lg text-[#4B5563] max-w-3xl">
                    {category.tagline}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {categoryServices.map((service, serviceIndex) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: serviceIndex * 0.1 }}
                    >
                      <Link
                        to={service.slug}
                        className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 h-full"
                      >
                        {service.heroImage && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={service.heroImage}
                              alt={service.serviceName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            {service.popular && (
                              <div className="absolute top-3 right-3 bg-[#0855B1] text-white px-3 py-1 rounded-full text-xs font-semibold">
                                Featured
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          </div>
                        )}

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-[#0855B1] transition-colors">
                            {service.serviceName}
                          </h3>
                          <p className="text-[#4B5563] mb-4 leading-relaxed line-clamp-2">
                            {service.heroSubtitle}
                          </p>
                          <div className="flex items-center text-[#0855B1] font-semibold text-sm group-hover:gap-2 transition-all">
                            Learn More
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-[#4B5563]">
                Quick answers to common questions about our services
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-gray-50 rounded-lg border border-gray-200 px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold text-[#111827] hover:text-[#0855B1] transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#4B5563] leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-[#0855B1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Have Questions About Our Services?
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Our experienced team is here to help you find the perfect solution for your needs. Contact us today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact-us">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-[#0855B1] hover:bg-gray-50 font-semibold"
                  >
                    Contact Us
                  </Button>
                </Link>
                <a href="tel:4407091946">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#0855B1] font-semibold"
                  >
                    Call (440) 709-1946
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Mailbox Plus",
          "description": "Complete business solutions including shipping, printing, mailbox rentals, and fingerprinting services in Concord Township, Lake County, Ohio.",
          "url": "https://mailboxplusohio.com/services",
          "telephone": "+14407091946",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Concord Township",
            "addressRegion": "OH",
            "addressCountry": "US"
          },
          "areaServed": [
            {
              "@type": "City",
              "name": "Concord Township"
            },
            {
              "@type": "City",
              "name": "Painesville"
            },
            {
              "@type": "City",
              "name": "Mentor"
            },
            {
              "@type": "City",
              "name": "Eastlake"
            }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Mailbox Plus Services",
            "itemListElement": services.map(service => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": service.serviceName,
                "description": service.heroSubtitle,
                "url": `https://mailboxplusohio.com${service.slug}`
              }
            }))
          }
        })}
      </script>
    </>
  );
};
