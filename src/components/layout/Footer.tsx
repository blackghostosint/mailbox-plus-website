import React from 'react';
import { InternalLink } from '../ui/InternalLink';
import Phone from '~icons/lucide/phone';
import Mail from '~icons/lucide/mail';
import MapPin from '~icons/lucide/map-pin';
import { siteConfig } from '../../config/siteConfig';
import { getServiceImageUrl } from '../../lib/storage';
import { SmartImage } from '../SmartImage';
import { getGoogleMapsLink } from '../../utils/location';

const quickLinks = [
  { name: 'Pack & Ship', href: '/pack-ship' },
  { name: 'FedEx Shipping', href: '/pack-ship/fedex-shipping' },
  { name: 'UPS Shipping', href: '/pack-ship/ups-authorized-shipper-outlet' },
  { name: 'Copy & Print', href: '/copy-print' },
  { name: 'Mailbox Rental', href: '/home-business/mailbox-rental' },
  { name: 'Notary Services', href: '/home-business/notary-services' },
  { name: 'Ask Mailbox Plus', href: '/ask-mailbox-plus' },
  { name: 'Shipping Partners', href: '/shipping-partners' },
  { name: 'DHL Express', href: '/pack-ship/dhl-express' },
  { name: 'Specialty Services', href: '/specialty/digital-fingerprinting' },
  { name: 'Every Door Direct Mail', href: '/home-business/every-door-direct-mail' },
];

export const Footer: React.FC = () => {
  // ✅ Supabase logo URL
  const logoUrl = getServiceImageUrl('/images/mailbox_plus_logo.webp');

  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
      {/* Global Tagline */}
      <div className="bg-[var(--color-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h2 className="text-2xl font-semibold text-white">{siteConfig.tagline}</h2>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <SmartImage
                src={logoUrl}
                alt={`${siteConfig.name} Logo`}
                width={256}
                height={80}
                className="h-20 w-auto object-contain aspect-[256/80]"
              />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {siteConfig.name} is your trusted{' '}
              <strong>pack & ship, printing, and business services store </strong>
              serving Concord Township, Painesville, Mentor, and all of Lake County, Ohio. Locally
              owned, faith-guided, and committed to our community.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 lg:text-center">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 lg:justify-center">
                <MapPin className="w-4 h-4 text-[var(--color-accent-warm)] flex-shrink-0" />
                <div className="text-sm text-[var(--color-text-secondary)]">
                  <a
                    href={getGoogleMapsLink('directions', siteConfig.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--color-accent-warm)]"
                  >
                    {siteConfig.contact.address.street}, {siteConfig.contact.address.city},{' '}
                    {siteConfig.contact.address.state} {siteConfig.contact.address.zip}
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3 lg:justify-center">
                <Phone className="w-4 h-4 text-[var(--color-accent-warm)] flex-shrink-0" />
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-warm)] transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3 lg:justify-center">
                <Mail className="w-4 h-4 text-[var(--color-accent-warm)] flex-shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-warm)] transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Store Hours (dynamic) */}
          <div className="space-y-4 lg:text-center">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Store Hours</h3>
            <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              {Object.entries(siteConfig.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                  <span className="text-[var(--color-text-primary)] font-medium">{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 lg:text-center">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Services</h3>
            <nav className="space-y-2" aria-label="Footer Services">
              {quickLinks.map((link) => (
                <InternalLink
                  key={link.name}
                  to={link.href}
                  className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-warm)] transition-colors"
                >
                  {link.name}
                </InternalLink>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4 lg:text-center">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Resources</h3>
            <nav className="space-y-2" aria-label="Footer Resources">
              <InternalLink
                to="/articles"
                className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-warm)] transition-colors"
              >
                Articles & Guides
              </InternalLink>
              <InternalLink
                to="/ask-mailbox-plus"
                className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-warm)] transition-colors"
              >
                FAQ
              </InternalLink>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-[var(--color-text-secondary)]">
              © 2025 Mailbox Plus of Ohio, LLC. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <InternalLink
                to="/privacy"
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-warm)] transition-colors"
              >
                Privacy Policy
              </InternalLink>
              <InternalLink
                to="/terms"
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-warm)] transition-colors"
              >
                Terms of Service
              </InternalLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
