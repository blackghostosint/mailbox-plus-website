import React from 'react';
import { useInView } from '../hooks/useInView';
import { AutoBreadcrumbs } from '../components/ui/AutoBreadcrumbs';
import FileText from '~icons/lucide/file-text';
import Shield from '~icons/lucide/shield';
import AlertTriangle from '~icons/lucide/alert-triangle';
import Scale from '~icons/lucide/scale';
import Mail from '~icons/lucide/mail';
import Fingerprint from '~icons/lucide/fingerprint';
import Gavel from '~icons/lucide/gavel';
import RefreshCw from '~icons/lucide/refresh-cw';
import Phone from '~icons/lucide/phone';
import Star from '~icons/lucide/star';

const BulletPoint: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start">
    <div className="w-2 h-2 bg-[var(--color-accent-warm)] rounded-full mt-2 mr-3 flex-shrink-0"></div>
    <span className="text-[var(--color-text-secondary)] leading-relaxed">{children}</span>
  </li>
);

const sections = [
  {
    icon: FileText,
    title: 'Service Agreement',
    content: [
      'By using our services, you agree to these terms and conditions',
      'Services include shipping, printing, mailbox rental, and business services',
      'We reserve the right to refuse service for any reason',
      'All services are subject to availability and our operating hours',
      'Prices are subject to change without notice',
    ],
  },
  {
    icon: Shield,
    title: 'Shipping Services',
    content: [
      'We act as an authorized agent for FedEx, UPS, USPS, and DHL',
      'Shipping rates are determined by the respective carriers',
      'We are not liable for delays or damages caused by carriers',
      'Insurance and tracking are available through carrier programs',
      'Prohibited items cannot be shipped and will be refused',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Liability and Limitations',
    content: [
      'Our liability is limited to the value of services provided',
      'We are not responsible for carrier delays or service interruptions',
      'Customers are responsible for accurate shipping information',
      'Claims must be filed within 30 days of service date',
      'We maintain insurance for our business operations',
    ],
  },
  {
    icon: Scale,
    title: 'Payment and Refunds',
    content: [
      'Payment is due at time of service',
      'We accept cash or credit cards',
      'Refunds are subject to carrier policies for shipping services',
      'Service fees are non-refundable once work has begun',
    ],
  },
  {
    icon: Mail,
    title: 'Mailbox Rental Terms',
    body: 'Mailbox rental agreements are separate contracts with specific terms and conditions. Rental fees are due in advance and are non-refundable. We reserve the right to terminate mailbox services for non-payment or violation of postal regulations.',
    content: [
      'Valid photo ID required for mailbox access',
      'Mail forwarding services available for additional fees',
      'Unclaimed mail will be returned to sender after 180 days',
    ],
  },
  {
    title: 'Printing and Design Services',
    body: 'All printing orders must be approved by the customer before production begins. We are not responsible for errors in customer-provided files or content. Rush orders may incur additional charges.',
    content: [
      'Customer is responsible for copyright compliance',
      'Proof approval required before final production',
      'Files must be provided in acceptable formats',
    ],
  },
  {
    icon: Fingerprint,
    title: 'Digital Fingerprinting',
    body: 'Fingerprinting services are provided for legitimate background check purposes only. Valid identification is required. We comply with all applicable state and federal regulations regarding fingerprinting services.',
  },
  {
    title: 'Prohibited Items and Activities',
    body: 'We reserve the right to refuse service for any items or activities that are:',
    content: [
      'Illegal, hazardous, or prohibited by carrier regulations',
      'Offensive, defamatory, or inappropriate content',
      'Copyright or trademark infringing materials',
      'Items that could damage our equipment or premises',
    ],
  },
  {
    icon: Gavel,
    title: 'Dispute Resolution',
    body: 'Any disputes arising from our services will be resolved through good faith negotiation. If resolution cannot be reached, disputes will be subject to binding arbitration under Ohio state law. These terms are governed by the laws of the State of Ohio.',
  },
  {
    icon: RefreshCw,
    title: 'Changes to Terms',
    body: 'We reserve the right to modify these terms at any time. Changes will be posted on our website and take effect immediately. Continued use of our services constitutes acceptance of any modified terms.',
  },
  {
    icon: Star,
    title: 'Plus Points Rewards Program',
    body: 'Plus Points is a free loyalty program offered by Mailbox Plus. By enrolling, you agree to the following terms.',
    content: [
      'Enrollment is free and open to all customers. You must provide accurate contact information to participate.',
      'Points are earned at 1 point per $1 spent on qualifying services (shipping, packing, printing, notary, mailbox rentals, document services). Notary earns 5 points per signature. Mailbox rental fees earn points automatically each month.',
      'Points are calculated before tax and rounded down to the nearest whole number. Tier multipliers (Shipper: 1.2x, Pro: 1.5x) apply automatically based on year-to-date points. Double Point Wednesdays earn 2x the standard rate.',
      'Points have no cash value and may not be purchased, sold, or transferred.',
      'Reward menu items and point values are subject to change at any time. Rewards must be redeemed at the time of service and have no cash value. Redeemed points are non-refundable. Mailbox month rewards are available to active mailbox rental customers only.',
      "Tier status (Sender, Shipper, Pro) is determined by year-to-date points earned. Mailbox holders are automatically enrolled at Shipper tier. Tier status resets annually on the member's enrollment anniversary. Points balance does not reset.",
      'Members receive 250 points for each referred friend who signs up and makes a qualifying purchase. Referral credits are capped at 10 successful referrals per member per year. Self-referral or abuse of the referral system will result in forfeiture of points and possible program removal.',
      'Points expire 12 months after the last qualifying transaction. Making any qualifying purchase resets the expiration clock. Accounts inactive for 12 consecutive months may be closed and points forfeited.',
      'Mailbox Plus reserves the right to modify, suspend, or terminate the Plus Points program at any time. Accounts in violation of these terms may be terminated and points forfeited.',
    ],
  },
  {
    icon: Phone,
    title: 'Contact Information',
    body: 'If you have questions about these terms of service, please contact us:',
    highlight: true,
    content: [
      'Mailbox Plus of Ohio, LLC',
      '7554 Fredle Drive',
      'Concord Township, OH 44077',
      'Phone: (440) 709-1946',
      'Email: help@mailboxplusohio.com',
    ],
  },
];

export const Terms: React.FC = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [gridRef, gridInView] = useInView({ threshold: 0.1 });

  return (
    <div className="bg-[var(--color-bg-primary)]">
      {/* Hero Section - Navy Gradient */}
      <section
        ref={heroRef}
        className={`relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] py-16 lg:py-24 text-center ${heroInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 animate-fade-in-up [animation-delay:100ms] opacity-0">
            Terms of Service
          </h1>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium max-w-3xl mx-auto mb-10 animate-fade-in-up [animation-delay:200ms] opacity-0">
            These terms and conditions govern your use of our services. Please read them carefully
            before using our shipping, printing, and business services.
          </p>
          <p className="text-sm text-white/60 animate-fade-in-up [animation-delay:300ms] opacity-0">
            Last updated: June 2026
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)] z-10" />
      </section>

      <AutoBreadcrumbs />

      {/* Terms Sections - Warm Cards */}
      <section
        ref={gridRef}
        className={`py-20 bg-[var(--color-bg-primary)] ${gridInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {sections.map((section, index) => (
              <div
                key={section.title}
                className={`${section.highlight ? 'lg:col-span-2' : ''} bg-[var(--color-bg-secondary)] rounded-2xl p-8 shadow-sm animate-fade-in-up opacity-0`}
                style={{ animationDelay: `${index * 100 + 100}ms` }}
              >
                <div
                  className={`${section.highlight ? 'bg-[var(--color-bg-primary)] rounded-2xl p-8' : ''}`}
                >
                  <div className="flex items-center mb-6">
                    {section.icon && (
                      <div className="w-12 h-12 bg-[var(--color-accent-warm)]/10 rounded-xl flex items-center justify-center mr-4">
                        <section.icon
                          className="w-6 h-6 text-[var(--color-accent-warm)]"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                      {section.title}
                    </h2>
                  </div>

                  {section.body && (
                    <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                      {section.body}
                    </p>
                  )}

                  {section.content && (
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <BulletPoint key={itemIndex}>{item}</BulletPoint>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
