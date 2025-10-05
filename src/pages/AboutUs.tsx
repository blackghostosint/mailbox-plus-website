import React from "react";
import { motion } from "framer-motion";
import { Heart, Users, Award, Clock, Package, Shield, Printer, Fingerprint } from "lucide-react";
import { Meta } from "../components/Meta";
import { siteConfig } from "../config/siteConfig";
import { getLocalBusinessSchema, getWebPageSchema, getFAQSchema } from "../utils";
import { getServiceImageUrl } from "../lib/supabase";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

export const AboutUs: React.FC = () => {
  // ✅ Schema setup
  const faqData = [
    {
      question: "Where is Mailbox Plus located?",
      answer: "We're in Gristmill Village, next to Pub Frato in Concord Township, Ohio—serving Lake County and nearby communities like Painesville, Mentor, and Eastlake.",
    },
    {
      question: "Do you offer mailbox rentals?",
      answer: "Yes! Our secure mailboxes provide a real street address and protection from porch pirates.",
    },
    {
      question: "What services do you provide beyond shipping?",
      answer: "We also offer LiveScan fingerprinting, printing, copying, scanning, faxing, and Every Door Direct Mail (EDDM) marketing support.",
    },
  ];

  const faqSchema = getFAQSchema(faqData);

  const webPageSchema = getWebPageSchema({
    name: "About Mailbox Plus",
    description: "Learn about Mailbox Plus — your trusted local pack-and-ship store in Concord Township, Lake County, Ohio. Family-owned, faith-guided, serving neighbors with care.",
    url: `${siteConfig.domain}/about-us`,
    breadcrumbItems: [
      { name: "Home", url: siteConfig.domain },
      { name: "About Us", url: `${siteConfig.domain}/about-us` },
    ],
  });

  const localBusinessSchema = getLocalBusinessSchema();

  // ✅ Values & Services
  const values = [
    {
      icon: Heart,
      title: "Integrity",
      description: "We do business the right way — honest, transparent, and guided by Biblical principles.",
    },
    {
      icon: Users,
      title: "Service",
      description: "Neighbors first. Every package, print job, and mailbox rental is handled with personal care.",
    },
    {
      icon: Award,
      title: "Stewardship",
      description: "We manage time and resources wisely to deliver dependable quality at fair prices.",
    },
    {
      icon: Clock,
      title: "Community",
      description: "We're more than a store — we're a trusted local partner invested in Lake County.",
    },
  ];

  const services = [
    {
      icon: Package,
      label: "Pack & Ship Services — UPS, FedEx, USPS, and DHL under one roof with expert packing.",
    },
    {
      icon: Shield,
      label: "Secure Mailboxes — A real street address and peace of mind (goodbye, porch pirates).",
    },
    {
      icon: Printer,
      label: "Printing & Business Services — Copies, scans, faxing, and EDDM marketing support.",
    },
    {
      icon: Fingerprint,
      label: "LiveScan Fingerprinting — Fast, accurate digital prints for employment and licensing.",
    },
  ];

  return (
    <div className="bg-white">
      {/* ✅ SEO Metadata */}
      <Meta
        title="About Us | Mailbox Plus in Concord Township, Ohio"
        description="Learn about Mailbox Plus — your trusted local pack-and-ship store in Concord Township, Lake County, Ohio. Family-owned, faith-guided, serving neighbors with care."
        keywords="About Mailbox Plus, Concord Township shipping, Lake County pack-and-ship, mailbox rentals, printing, fingerprinting"
        canonical={`${siteConfig.domain}/about-us`}
        schema={[localBusinessSchema, faqSchema, webPageSchema].filter(Boolean)}
      />

      {/* Hero */}
      <section className="relative bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <motion.h1 {...fadeUp(0)} className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6">
            About <span className="text-[#0855B1]">Mailbox Plus</span>
          </motion.h1>
          <motion.p {...fadeUp(0.15)} className="text-xl text-[#4B5563] mb-8 leading-relaxed">
            We exist to make life easier for our neighbors in Lake County, Ohio. Whether you need to ship a package, rent a secure mailbox, get fingerprints taken, or print important documents, we're your one-stop shop — right here in your own community.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp(0)}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">Our Story</h2>
            <div className="space-y-6 text-[#4B5563] leading-relaxed">
              <p>We're a locally owned, faith-guided business committed to serving with integrity, stewardship, and respect. Every customer who walks through our doors is treated like a neighbor, because that's exactly who you are.</p>
              <p>What started as a simple pack-and-ship shop has grown into a trusted local resource for families, small businesses, and professionals. Our tagline says it best: <strong>"Let us handle your package"</strong></p>
              <p>As Concord Township and the greater Lake County area grow, we continue to expand our services to meet the needs of our community — always with a personal touch and a heart for service.</p>
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="relative">
            <img src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1400&auto=format&fit=crop" alt="" className="rounded-2xl shadow-lg w-full aspect-video object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">What We Do</h2>
          <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
            We offer a wide range of essential services including pack & ship, secure mailbox rentals, printing, and digital fingerprinting.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm"
            >
              <div className="w-12 h-12 bg-[#F0F7FF] rounded-xl flex items-center justify-center flex-shrink-0">
                <service.icon className="w-6 h-6 text-[#0855B1]" />
              </div>
              <p className="text-[#4B5563] leading-relaxed">{service.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeUp(0)} className="text-3xl md:text-4xl font-bold text-center text-[#111827] mb-16">
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="text-center">
                <div className="w-16 h-16 bg-[#F0F7FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-[#0855B1]" />
                </div>
                <h3 className="text-xl font-semibold text-[#111827] mb-4">{value.title}</h3>
                <p className="text-[#4B5563] leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 {...fadeUp(0)} className="text-3xl md:text-4xl font-bold text-[#111827] mb-8">
            Leadership
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-lg text-[#4B5563] max-w-3xl mx-auto mb-12">
            Our team is committed to serving with integrity, professionalism, and a heart for our community.
          </motion.p>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <motion.div {...fadeUp(0.3)} className="bg-white p-8 rounded-2xl shadow-sm max-w-md mx-auto">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" alt="" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold text-[#111827] mb-2">Store Manager</h3>
              <p className="text-[#4B5563]">Leading with integrity and a commitment to exceptional customer service.</p>
            </motion.div>
            <motion.div {...fadeUp(0.4)} className="bg-white p-8 rounded-2xl shadow-sm max-w-md mx-auto">
              {(() => {
                const imageUrl = getServiceImageUrl("/images/diana.jpg");
                return (
                  <img src={imageUrl} alt="Diana Goebelt" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                );
              })()}
              <h3 className="text-xl font-semibold text-[#111827] mb-2">Diana Goebelt<br /><span className="text-base font-normal text-[#4B5563]">Owner</span></h3>
              <p className="text-[#4B5563]">Guiding Mailbox Plus with dedication, community focus, and a passion for outstanding customer care.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-[#0855B1] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeUp(0)} className="text-3xl font-bold mb-4">
            Ready to Experience the Mailbox Plus Difference?
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-lg mb-6">
            Visit us in Gristmill Village, Concord Township — where neighbors help neighbors get things done.
          </motion.p>
          <motion.p {...fadeUp(0.3)} className="font-semibold">
            Serving Concord Township, Painesville, Mentor, Eastlake, and all of Lake County, Ohio.
          </motion.p>
        </div>
      </section>
    </div>
  );
};
