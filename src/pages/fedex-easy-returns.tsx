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
} from "lucide-react";
import { Meta, Breadcrumbs, JsonLd } from "../components";
import { CTASection } from "../components/sections/CTA";
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
      <section className="relative bg-[#0855B1] py-16 lg:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <SmartImage
             priority
             src={service.heroImage}
             alt="FedEx Easy Returns at Mailbox Plus"
             className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            FedEx Easy Returns – Fast, Hassle-Free Returns
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg text-gray-200 leading-relaxed mb-4"
          >
            Quick drop-offs, QR code scanning, label printing, and tracking receipts.
            <br />
            <span className="text-blue-200 font-medium mt-2 block">
              Serving Concord Township, Mentor, Painesville, and all Lake County communities.
            </span>
          </motion.p>
        </div>
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111827]">Why Return with Us?</h2>
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
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
                <benefit.icon className="w-10 h-10 text-[#0855B1] mb-4" />
                <h3 className="text-lg font-semibold text-[#111827] mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is FedEx Easy Returns */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#F0F7FF] rounded-2xl p-8 border border-[#0855B1]/20">
            <h2 className="text-2xl font-bold text-[#0855B1] mb-4">What is FedEx Easy Returns?</h2>
            <p className="text-gray-700 leading-relaxed">
              FedEx Easy Returns is a consumer-friendly service designed to streamline the process of sending items back to retailers. 
              Instead of worrying about printing labels at home or finding packaging, you can simply bring your item and your return information 
              (often just a QR code) to Mailbox Plus. We verify the return, generate the label if needed, 
              and accept the package for shipment—triggering your refund process faster.
            </p>
          </div>
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
                  
                  <div className="w-12 h-12 rounded-full bg-[#0855B1] text-white flex items-center justify-center font-bold text-xl shrink-0 ring-4 ring-white shadow-lg">
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
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <CTASection
          cta={{
            title: "Ready to return your package?",
            subtitle: "Visit Mailbox Plus today. Located in Gristmill Village next to Pub Frato.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us",
            variant: "brand"
          }}
        />
      </div>
    </div>
  );
};