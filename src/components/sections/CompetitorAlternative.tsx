import React from 'react';
import { InternalLink } from '../ui/InternalLink';

export const CompetitorAlternativeSection: React.FC = () => {
  return (
    <section id="competitor-alternative" className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          A Better Alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and
          Office Depot in Concord Township
        </h2>

        <p className="text-gray-700 leading-relaxed mb-6">
          When you need reliable shipping, printing, or business services in Concord Township, skip
          the long lines and impersonal service at the big chain stores. Mailbox Plus offers a
          superior, locally owned alternative to the Post Office (USPS), The UPS Store, FedEx
          Office, Staples, and Office Depot. Unlike single-carrier outlets, we provide multi-carrier
          shipping options—allowing you to compare rates and delivery times for FedEx, UPS, USPS,
          and DHL all in one place.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          Our friendly, knowledgeable staff takes the stress out of your errands with personalized
          assistance for professional packing, notary public services, mailbox rentals, and
          high-quality printing. We are also your local expert for Amazon Returns, FedEx Easy
          Returns, and digital fingerprinting. Experience faster service, shorter waits, and a
          commitment to our local community that national chains simply can&apos;t match.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          Don&apos;t settle for limited options or long lines. See how Mailbox Plus compares to the
          competition.
        </p>

        <div className="mt-4 space-y-1">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <InternalLink to="/pack-ship" variant="geo">
              Shipping Services
            </InternalLink>
            <InternalLink to="/home-business/mailbox-rental" variant="geo">
              Mailbox Rental
            </InternalLink>
            <InternalLink to="/copy-print/document-printing" variant="geo">
              Printing & Document Services
            </InternalLink>
            <InternalLink to="/home-business/notary-services" variant="geo">
              Notary Public
            </InternalLink>
            <InternalLink to="/amazon-returns" variant="geo">
              Amazon Returns
            </InternalLink>
            <InternalLink to="/fedex-easy-returns" variant="geo">
              FedEx Easy Returns
            </InternalLink>
          </div>
        </div>
      </div>
    </section>
  );
};
