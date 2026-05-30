import React from 'react';
import { motion } from 'framer-motion';
import Shield from '~icons/lucide/shield';
import Eye from '~icons/lucide/eye';
import Lock from '~icons/lucide/lock';
import FileText from '~icons/lucide/file-text';

export const Privacy: React.FC = () => {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: [
        'Personal information you provide when using our services (name, address, phone, email)',
        'Shipping and package information for delivery services',
        'Payment information for transactions (processed securely through third-party providers)',
        'Website usage data through cookies and analytics',
      ],
    },
    {
      icon: Shield,
      title: 'How We Use Your Information',
      content: [
        'Provide shipping, printing, and business services',
        'Process payments and complete transactions',
        'Communicate about your orders and services',
        'Improve our website and services',
        'Send promotional materials (with your consent)',
      ],
    },
    {
      icon: Lock,
      title: 'Information Security',
      content: [
        'We implement appropriate security measures to protect your personal information',
        'Payment information is processed through secure, encrypted connections',
        'Access to personal information is limited to authorized personnel only',
        'We regularly review and update our security practices',
      ],
    },
    {
      icon: FileText,
      title: 'Information Sharing',
      content: [
        'We do not sell, trade, or rent your personal information to third parties',
        'We may share information with shipping carriers (FedEx, UPS, USPS) as necessary for delivery',
        'We may disclose information when required by law or to protect our rights',
        'Service providers who assist us may have access to information necessary to perform their functions',
      ],
    },
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
              Privacy <span className="text-[#0855B1]">Policy</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[#4B5563] mb-8 leading-relaxed"
            >
              Your privacy is important to us. This policy explains how we collect, use, and protect
              your personal information when you use our services.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm text-[#4B5563]"
            >
              Last updated: February 2026
            </motion.p>
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#F0F7FF] rounded-xl flex items-center justify-center mr-4">
                    <section.icon className="w-6 h-6 text-[#0855B1]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#111827]">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-[#0855B1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-[#4B5563] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-[#111827] mb-4">
                Analytics & Site Usage Data
              </h2>
              <p className="text-[#4B5563] leading-relaxed mb-4">
                We use Google Analytics 4 (GA4) on this website to understand how visitors use our
                site and how we can improve. GA4 collects aggregated information such as your device
                type, browser type, pages visited, session duration, and — where available —
                demographic attributes like age range and gender, based on Google Signals data. All
                data collected is anonymized and aggregated; we do not use it to personally identify
                any individual.
              </p>
              <p className="text-[#4B5563] leading-relaxed mb-4">
                We also use Google Tag Manager to deploy the GA4 “Configuration” tag across all
                pages and to fire custom event tags when users interact with specific features (for
                example, our “Reserve My Box” CTA).
              </p>
              <p className="text-[#4B5563] leading-relaxed mb-4">
                Because we are a U.S.-based small business using anonymous analytics only, we do not
                display a cookie-consent banner to visitors. If you wish to restrict or disable
                cookies or analytics tracking, you may adjust your browser cookie settings or
                install the Google Analytics Opt-out Browser Add-on.
              </p>
              <p className="text-[#4B5563] leading-relaxed mb-4">
                Google provides more information about its data collection and usage, including how
                to opt-out, on its website here:{' '}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0855B1] hover:underline"
                >
                  https://policies.google.com/technologies/partner-sites
                </a>
                .
              </p>
              <p className="text-[#4B5563] leading-relaxed">
                We do not sell your personal information to third parties for advertising or
                marketing purposes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-[#111827] mb-4">Your Rights</h2>
              <p className="text-[#4B5563] leading-relaxed mb-4">You have the right to:</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#0855B1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-[#4B5563]">
                    Access and review your personal information
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#0855B1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-[#4B5563]">
                    Request corrections to inaccurate information
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#0855B1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-[#4B5563]">
                    Request deletion of your personal information
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#0855B1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-[#4B5563]">Opt-out of marketing communications</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-[#111827] mb-4">Data Retention</h2>
              <p className="text-[#4B5563] leading-relaxed">
                We retain your personal information only as long as necessary to provide our
                services and comply with legal obligations. Shipping records may be kept for tax and
                business purposes as required by law. You may request deletion of your information
                at any time, subject to legal requirements.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-[#111827] mb-4">Changes to This Policy</h2>
              <p className="text-[#4B5563] leading-relaxed">
                We may update this privacy policy from time to time to reflect changes in our
                practices or legal requirements. We will notify you of any significant changes by
                posting the updated policy on our website with a new effective date.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[#F9FAFB] rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-[#111827] mb-4">Contact Us</h2>
              <p className="text-[#4B5563] leading-relaxed mb-4">
                If you have questions about this privacy policy or how we handle your personal
                information, please contact us:
              </p>
              <div className="space-y-2 text-[#4B5563]">
                <p>
                  <strong>Mailbox Plus of Ohio, LLC</strong>
                </p>
                <p>7554 Fredle Drive</p>
                <p>Concord Township, OH 44077</p>
                <p>Phone: (440) 709-1946</p>
                <p>Email: help@mailboxplusohio.com</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
