import React from "react";
import { motion } from "framer-motion";
import {
  Printer,
  Scan,
  Package,
  CheckCircle,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { Meta, Breadcrumbs, JsonLd } from "../components";
import { Button } from "../components/ui";
import { InternalLink } from "../components/ui/InternalLink";
import { CompetitorAlternativeSection } from "../components/sections/CompetitorAlternative";
import { services } from "../config/services";
import { siteConfig } from "../config/siteConfig";
import { getServiceSchema, getWebPageSchema } from "../utils/schema";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import { SmartImage } from "../components/SmartImage";


const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export const FedExEasyReturns: React.FC = () => {
  const service = services.find((s) => s.id === "fedex-easy-returns")!;
  const url = `${siteConfig.domain}${service.slug}`;

  // JSON-LD Data
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "FedEx Easy Returns Drop-Off",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Mailbox Plus",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": siteConfig.contact.address.street,
        "addressLocality": siteConfig.contact.address.city,
        "addressRegion": siteConfig.contact.address.state,
        "postalCode": siteConfig.contact.address.zip,
        "addressCountry": "US"
      }
    },
    "areaServed": [
      "Concord Township",
      "Mentor",
      "Painesville",
      "Eastlake",
      "Willoughby",
      "Kirtland",
      "Lake County"
    ],
    "url": url,
    "description": service.metaDescription
  };

  const faqs = [
    {
      question: "Do I need to print my return label?",
      answer: "No! If you have a QR code from your retailer, just bring that code on your phone. We scan it and start the return for you."
    },
    {
      question: "Does FedEx Easy Returns cost anything?",
      answer: "Dropping off a package with your QR code is free for you. We provide the receipt and tracking information at no charge."
    },
    {
      question: "Can you pack my return?",
      answer: "Yes!"
    }
  ];

  return (
    <div className="bg-white">
      {/* SEO Metadata */}
      <Meta
        title={service.pageTitle}
        description={service.metaDescription}
        keywords={service.keywords}
        canonical={url}
      />

      {/* Structured Data */}
      <JsonLd schema={getWebPageSchema(siteConfig, { name: service.pageTitle, description: service.metaDescription, url })} />
      <JsonLd schema={getServiceSchema(siteConfig, { serviceName: service.serviceName, url })} />
      <JsonLd schema={localBusinessSchema} />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs service={service} />
      </div>

      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative bg-center py-32 lg:py-48 overflow-hidden min-h-[70vh]">
        {/* Background Image with V2 Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          <SmartImage
            priority
            src={service.heroImage}
            alt="FedEx Easy Returns at Mailbox Plus"
            className="w-full h-full object-cover mix-blend-soft-light opacity-90 blur-[1px] scale-105"
            style={{ objectPosition: 'center' }}
          />
          {/* V2 Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B4BB6] via-[#1A6DFF] to-[#021B4A] opacity-90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#02152F]/90"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-8 drop-shadow-sm"
          >
            FedEx Easy Returns – <span className="text-blue-200">Fast & Hassle-Free</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl md:text-2xl text-blue-50 leading-relaxed font-medium mb-10 max-w-3xl mx-auto"
          >
            Quick drop-offs, QR code scanning, label printing, and tracking receipts.
            Serving specific all Lake County communities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <InternalLink to="/contact">
              <Button size="lg" variant="secondary" className="shadow-xl font-bold border-none min-h-12 px-8">
                Get Directions <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </InternalLink>
          </motion.div>
        </div>

        {/* Soft fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white"></div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#111827] mb-6">
            Returning Items Has Never Been Easier
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Skip the long lines and complicated processes. The FedEx Easy Returns Program at Mailbox Plus makes returning your online purchases simple.
            Bring your phone with your QR code, we’ll handle the rest—scanning, printing, and getting your package on its way.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50 relative z-10 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 {...reveal} className="text-3xl font-bold text-[#111827]">Why Return with Us?</motion.h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Super Fast Drop-Offs", desc: "In and out in minutes." },
              { icon: Printer, title: "No Printer Needed", desc: "We print labels from QR codes." },
              { icon: Scan, title: "QR Code Support", desc: "Just show your code on your phone." },
              { icon: Package, title: "Professional Packing", desc: "We can pack your item safely." },
              { icon: MapPin, title: "Convenient Location", desc: "Next to Pub Frato in Concord Twp." },
              { icon: ShieldCheck, title: "Friendly Guidance", desc: "Helpful staff to assist you." }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/70 backdrop-blur-xl p-8 rounded-[26px] shadow-sm hover:shadow-lg border border-white/50 flex flex-col items-center text-center transition-all hover:translate-y-[-4px]"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-[#0855B1]">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What is FedEx Easy Returns */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            {...reveal}
            className="bg-white/80 backdrop-blur-xl rounded-[32px] p-10 border border-white/60 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <h2 className="text-3xl font-bold text-[#0855B1] mb-6">What is FedEx Easy Returns?</h2>
            <p className="text-slate-700 leading-relaxed text-lg">
              FedEx Easy Returns is a consumer-friendly service designed to streamline the process of sending items back to retailers.
              Instead of worrying about printing labels at home or finding packaging, you can simply bring your item and your return information
              (often just a QR code) to Mailbox Plus. We verify the return, generate the label if needed,
              and accept the package for shipment—triggering your refund process faster.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#111827] text-center mb-12">How It Works</h2>
          <div className="relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-100 -z-10" />

            <div className="space-y-12">
              {[
                { step: 1, title: "Bring Your Item", desc: "Bring your item and your return QR code or label." },
                { step: 2, title: "Optional Packing", desc: "Need a box? We can pack it for you (fees may apply)." },
                { step: 3, title: "We Print the Label", desc: "We scan your code and print the shipping label." },
                { step: 4, title: "Process & Track", desc: "We scan the package into the FedEx system and give you a receipt." },
                { step: 5, title: "You're Done!", desc: "Leave with peace of mind while the retailer processes your refund." }
              ].map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-right">
                    {index % 2 === 0 && (
                      <>
                        <h3 className="text-xl font-bold text-[#111827] mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </>
                    )}
                  </div>

                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B4BB6] to-[#1A6DFF] text-white flex items-center justify-center font-bold text-xl shrink-0 ring-4 ring-white shadow-lg z-10">
                    {item.step}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    {index % 2 !== 0 && (
                      <>
                        <h3 className="text-xl font-bold text-[#111827] mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Common Items Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#111827] mb-10">Items Commonly Returned</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Clothing & Shoes",
              "Electronics",
              "Home Goods",
              "Toys & Games",
              "Books",
              "Small Appliances",
              "Accessories",
              "Gifts"
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 font-medium text-gray-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Visit */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#111827] mb-8 text-center">When to Visit Mailbox Plus</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900">You have a FedEx Easy Returns QR Code</h3>
                <p className="text-gray-600">Retailers like Walmart, Target, and Samsung often send these.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900">You Want a Receipt</h3>
                <p className="text-gray-600">Always get proof of your return for your records.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 lg:py-24 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#111827] mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-white border border-gray-200 rounded-xl shadow-sm px-2"
              >
                <AccordionTrigger className="px-4 py-3 text-left font-semibold text-[#0855B1] hover:underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-[#4B5563] leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Local SEO Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#111827] mb-6">
            Serving Your Local Community
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We are proud to provide FedEx Easy Returns services to residents and businesses in:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Concord Township",
              "Mentor",
              "Painesville",
              "Eastlake",
              "Willoughby",
              "Kirtland",
              "Greater Lake County"
            ].map((area) => (
              <span key={area} className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700 border border-gray-200">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Alternative Section */}
      <CompetitorAlternativeSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0B4BB6] via-[#1A6DFF] to-[#021B4A] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to return your package?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Visit Mailbox Plus today. Located in Gristmill Village next to Pub Frato.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InternalLink to="/contact">
              <Button size="lg" variant="secondary" className="font-bold shadow-lg border-none min-h-12 px-8">
                Get Directions <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </InternalLink>
          </div>
        </div>
      </section>
    </div>
  );
};