import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { InternalLink } from '../ui/InternalLink';
import { motion, AnimatePresence } from 'framer-motion';
import Menu from '~icons/lucide/menu';
import X from '~icons/lucide/x';
import Phone from '~icons/lucide/phone';
import MapPin from '~icons/lucide/map-pin';
import { siteConfig } from '../../config/siteConfig';
import { SearchBox } from '../ui';
import { getServiceImageUrl } from '../../lib/storage';
import { SmartImage } from '../SmartImage';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Services', href: '/services' },
    { name: 'Tracking', href: '/tracking' },
    { name: 'Pickup Hours', href: '/pickup-hours' },
    { name: 'Contact', href: '/contact-us' },
    // External link to standalone sales page
    { name: 'Mailbox Rental Offer', href: '/MailboxPlusSalesPage.html', external: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  // ✅ Logo URL via Supabase
  const logoUrl = getServiceImageUrl('mailbox_plus_logo.webp');

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[var(--color-bg-primary)] border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-6">
              {/* Phone */}
              <div className="flex items-center space-x-2 text-[var(--color-text-secondary)]">
                <Phone className="w-4 h-4" />
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
              {/* Address linked to Google Maps */}
              <div className="hidden sm:flex items-center space-x-2 text-[var(--color-text-secondary)]">
                <MapPin className="w-4 h-4" />
                <a
                  href="https://maps.google.com/?q=Mailbox+Plus+Concord+Township+OH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-primary)]"
                >
                  Concord Township, OH
                </a>
              </div>
            </div>
            <div className="text-[var(--color-text-secondary)]">
              Mon-Fri: 9AM-6PM | Sat: 9AM-2PM
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <InternalLink to="/" className="flex items-center space-x-2">
            <SmartImage
              priority={true}
              src={getServiceImageUrl('/images/mailbox_plus_logo.webp')}
              alt="Mailbox Plus Concord Township Ohio Logo"
              width={256}
              height={80}
              className="h-12 w-auto object-contain"
            />
            <span className="sr-only">Mailbox Plus - Concord Township, OH</span>
          </InternalLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navigation.map((item) =>
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-yellow-800 hover:text-yellow-900 transition-colors"
                  style={{ fontWeight: 700 }}
                >
                  {item.name}
                </a>
              ) : (
                <InternalLink
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {item.name}
                </InternalLink>
              )
            )}
          </nav>

          {/* Search Box */}
          <div className="hidden md:block">
            <SearchBox />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-primary)]"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-300"
          >
            <nav className="px-4 py-4 space-y-4" aria-label="Mobile Navigation">
              {navigation.map((item) =>
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-base font-bold text-yellow-800 hover:text-yellow-900 transition-colors"
                  >
                    {item.name}
                  </a>
                ) : (
                  <InternalLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-[var(--color-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {item.name}
                  </InternalLink>
                )
              )}
            </nav>
            <div className="px-4 pb-4 pt-2">
              <SearchBox />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Local Business Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Mailbox Plus',
            image: logoUrl, // ✅ Use Supabase logo URL
            '@id': 'https://mailboxplusohio.com',
            url: 'https://mailboxplusohio.com',
            telephone: siteConfig.contact.phone,
            address: {
              '@type': 'PostalAddress',
              streetAddress: siteConfig.contact.address.street,
              addressLocality: siteConfig.contact.address.city,
              addressRegion: siteConfig.contact.address.state,
              postalCode: siteConfig.contact.address.zip,
              addressCountry: 'US',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 41.664959,
              longitude: -81.246493,
            },
            openingHours: ['Mo-Fr 09:00-18:00', 'Sa 09:00-14:00'],
            priceRange: '$$',
          }),
        }}
      />
    </header>
  );
};
