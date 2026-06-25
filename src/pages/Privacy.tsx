import React from 'react';
import { useInView } from '../hooks/useInView';
import { AutoBreadcrumbs } from '../components/ui/AutoBreadcrumbs';
import Shield from '~icons/lucide/shield';
import Eye from '~icons/lucide/eye';
import Lock from '~icons/lucide/lock';
import FileText from '~icons/lucide/file-text';

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

export const Privacy: React.FC = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [analyticsRef, analyticsInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [rightsRef, rightsInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [retentionRef, retentionInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [changesRef, changesInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [contactRef, contactInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="bg-[var(--color-bg-primary)]">
      {/* Hero Section - Navy Gradient */}
      <section
        ref={heroRef}
        className={`relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] py-16 lg:py-24 text-center ${heroInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 animate-fade-in-up [animation-delay:100ms] opacity-0">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium max-w-3xl mx-auto mb-10 animate-fade-in-up [animation-delay:200ms] opacity-0">
            Your privacy is important to us. This policy explains how we collect, use, and protect
            your personal information when you use our services.
          </p>
          <p className="text-sm text-white/60 animate-fade-in-up [animation-delay:300ms] opacity-0">
            Last updated: February 2026
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)] z-10" />
      </section>

      <AutoBreadcrumbs />

      {/* Privacy Sections - Warm Cards */}
      <section className="py-20 bg-[var(--color-bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {sections.map((section, index) => (
              <div
                key={section.title}
                className={`bg-[var(--color-bg-secondary)] rounded-2xl p-8 shadow-sm animate-fade-in-up ${index === 0 ? '' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100 + 100}ms` }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[var(--color-accent-warm)]/10 rounded-xl flex items-center justify-center mr-4">
                    <section.icon className="w-6 h-6 text-[var(--color-accent-warm)]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-[var(--color-accent-warm)] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-[var(--color-text-secondary)] leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information - Warm Sections */}
      <section className="py-20 bg-[var(--color-bg-secondary)]/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div
              ref={analyticsRef}
              className={`animate-fade-in-up ${analyticsInView ? '' : 'opacity-0'}`}
            >
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                Analytics &amp; Site Usage Data
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                We use Google Analytics 4 (GA4) on this website to understand how visitors use our
                site and how we can improve. GA4 collects aggregated information such as your device
                type, browser type, pages visited, session duration, and — where available —
                demographic attributes like age range and gender, based on Google Signals data. All
                data collected is anonymized and aggregated; we do not use it to personally identify
                any individual.
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                We also use Google Tag Manager to deploy the GA4 &ldquo;Configuration&rdquo; tag
                across all pages and to fire custom event tags when users interact with specific
                features (for example, our &ldquo;Reserve My Box&rdquo; CTA).
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                Because we are a U.S.-based small business using anonymous analytics only, we do not
                display a cookie-consent banner to visitors. If you wish to restrict or disable
                cookies or analytics tracking, you may adjust your browser cookie settings or
                install the Google Analytics Opt-out Browser Add-on.
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                Google provides more information about its data collection and usage, including how
                to opt-out, on its website here:{' '}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent-warm)] hover:underline"
                >
                  https://policies.google.com/technologies/partner-sites
                </a>
                .
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                We do not sell your personal information to third parties for advertising or
                marketing purposes.
              </p>
            </div>

            <div
              ref={rightsRef}
              className={`animate-fade-in-up ${rightsInView ? '' : 'opacity-0'}`}
              style={{ animationDelay: '100ms' }}
            >
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                Your Rights
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[var(--color-accent-warm)] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-[var(--color-text-secondary)]">
                    Access and review your personal information
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[var(--color-accent-warm)] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-[var(--color-text-secondary)]">
                    Request corrections to inaccurate information
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[var(--color-accent-warm)] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-[var(--color-text-secondary)]">
                    Request deletion of your personal information
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[var(--color-accent-warm)] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-[var(--color-text-secondary)]">
                    Opt-out of marketing communications
                  </span>
                </li>
              </ul>
            </div>

            <div
              ref={retentionRef}
              className={`animate-fade-in-up ${retentionInView ? '' : 'opacity-0'}`}
              style={{ animationDelay: '200ms' }}
            >
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                Data Retention
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                We retain your personal information only as long as necessary to provide our
                services and comply with legal obligations. Shipping records may be kept for tax and
                business purposes as required by law. You may request deletion of your information
                at any time, subject to legal requirements.
              </p>
            </div>

            <div
              ref={changesRef}
              className={`animate-fade-in-up ${changesInView ? '' : 'opacity-0'}`}
              style={{ animationDelay: '300ms' }}
            >
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                Changes to This Policy
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                We may update this privacy policy from time to time to reflect changes in our
                practices or legal requirements. We will notify you of any significant changes by
                posting the updated policy on our website with a new effective date.
              </p>
            </div>

            <div
              ref={contactRef}
              className={`animate-fade-in-up ${contactInView ? '' : 'opacity-0'}`}
              style={{ animationDelay: '400ms' }}
            >
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                Contact Us
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                If you have questions about this privacy policy or how we handle your personal
                information, please contact us:
              </p>
              <div className="space-y-2 text-[var(--color-text-secondary)]">
                <p>
                  <strong>Mailbox Plus of Ohio, LLC</strong>
                </p>
                <p>7554 Fredle Drive</p>
                <p>Concord Township, OH 44077</p>
                <p>Phone: (440) 709-1946</p>
                <p>Email: help@mailboxplusohio.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
