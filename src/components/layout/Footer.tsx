import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { getLocalBusinessSchema } from '../../utils';

export const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Pack & Ship', href: '/pack-ship' },
    { name: 'Copy & Print', href: '/copy-print' },
    { name: 'Home & Business', href: '/home-business' },
    { name: 'Digital Fingerprinting', href: '/digital-fingerprinting' }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Global Tagline */}
      <div className="bg-[#F9FAFB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h3 className="text-2xl font-semibold text-[#0855B1]">
            {siteConfig.tagline}
          </h3>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src={siteConfig.logo}
                alt={`${siteConfig.name} Logo`}
                className="h-20 object-contain"
              />
            </div>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              {siteConfig.name} is your trusted <strong>pack & ship, printing, and business services store </strong> 
              serving Concord Township, Painesville, Mentor, and all of Lake County, Ohio. 
              Locally owned, faith-guided, and committed to our community.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#111827]">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-[#0855B1] flex-shrink-0" />
                <div className="text-sm text-[#4B5563]">
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.contact.address.street + ", " + siteConfig.contact.address.city)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#0855B1]"
                  >
                    {siteConfig.contact.address.street}, {siteConfig.contact.address.city}, {siteConfig.contact.address.state} {siteConfig.contact.address.zip}
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#0855B1] flex-shrink-0" />
                <a 
                  href={`tel:${siteConfig.contact.phone}`}
                  className="text-sm text-[#4B5563] hover:text-[#0855B1] transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#0855B1] flex-shrink-0" />
                <a 
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-sm text-[#4B5563] hover:text-[#0855B1] transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Store Hours (dynamic) */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#111827]">Store Hours</h4>
            <div className="space-y-2 text-sm text-[#4B5563]">
              {Object.entries(siteConfig.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize">
                    {day.charAt(0).toUpperCase() + day.slice(1)}:
                  </span>
                  <span className="text-[#111827] font-medium">{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#111827]">Services</h4>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-sm text-[#4B5563] hover:text-[#0855B1] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-[#4B5563]">
              © 2025 Mailbox Plus of Ohio, LLC. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="text-sm text-[#4B5563] hover:text-[#0855B1] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-[#4B5563] hover:text-[#0855B1] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Local Business Schema (auto from siteConfig) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getLocalBusinessSchema())
        }}
      />
    </footer>
  );
};
