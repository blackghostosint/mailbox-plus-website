import React from 'react';
import { useInView } from '../hooks/useInView';
import { InternalLink } from '../components/ui/InternalLink';
import ArrowRight from '~icons/lucide/arrow-right';
import MapPin from '~icons/lucide/map-pin';
import Phone from '~icons/lucide/phone';
import Clock from '~icons/lucide/clock';
import ChevronUp from '~icons/lucide/chevron-up';
import { Button } from '../components/ui';
import { siteConfig } from '../config/siteConfig';
import { services } from '../config/services';
import { getGoogleMapsLink } from '../utils/location';
import { Meta } from '../components/Meta';
import { AutoBreadcrumbs } from '../components/ui/AutoBreadcrumbs';
import { pageMeta } from '../config/pageMeta';
import { SmartImage } from '../components/SmartImage';

// Utility to generate safe IDs
const makeId = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

// Map display category → actual service.category value (from services.ts)
const categoryMap: Record<string, string> = {
  'Pack & Ship Services': 'pack-ship',
  'Professional Printing': 'copy-print',
  'Mailbox Rentals': 'mailbox-rentals',
  'Document Services': 'document-services',
  'Additional Services': 'additional-services',
};

// Services to hide from the cards grid (pages still exist for SEO / direct links)
const hiddenFromGrid = new Set([
  // "Alternative" landing pages — near-duplicate content
  'ups-drop-off-alternative-concord-township',
  'ups-store-alternative-concord-township',
  'mail-boxes-etc-alternative-concord-township',
  'fedex-office-alternative-concord-township',
  'post-office-alternative-concord-township',
  'staples-printing-alternative-concord-township',
  'office-depot-alternative-concord-township',
  // Summary / meta pages that just list other services
  'shipping-center-concord-township',
  'ups-fedex-usps-dhl-shipping-concord-township',
  'usps-drop-off-alternative-concord-township',
  'usps-package-help-concord-township',
  'business-services-concord-township',
  'document-services-concord-township',
  // Every Door Direct Mail (keep accessible but hide from main grid for cleaner UI)
  'every-door-direct-mail',
  // Additional pack & ship services (keep accessible but hide from main grid for cleaner UI)
  'postage-stamps',
  'usps-services',
  'pack-and-ship-services-concord-township',
  'custom-box-making',
  // Specialty shipping services (keep accessible but hide from main grid for cleaner UI)
  'artwork-shipping',
  'bicycle-shipping',
  'golf-club-shipping',
  'packaging-supplies',
  // Printing and design services (keep accessible but hide from main grid for cleaner UI)
  'graphic-design',
  'business-cards',
  'flyers-brochures',
  'posters-printing',
  'postcard-printing',
  'printing-services-concord-township',
  // Mailbox sub-pages collapsed into main two cards
  'private-mailbox-rental-concord-township',
  'virtual-mailbox-concord-township',
  'mail-forwarding-concord-township',
  // Amazon returns — keep the guide, drop the duplicate landing page
  'amazon-returns-drop-off-concord-township',
  // Amazon return guide (keep accessible but hide from main grid for cleaner UI)
  'amazon-returns',
]);

interface CategorySectionProps {
  category: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  return (
    <section
      key={category}
      id={makeId(category)}
      className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      ref={ref as any}
    >
      <div className={isInView ? 'animate-fade-in-up' : 'opacity-0'}>
        <h2 className="text-3xl font-bold mb-8 text-[var(--color-text-primary)] flex items-center">
          <span className="w-2 h-8 bg-gradient-to-b from-[var(--color-gradient-start)] to-[var(--color-accent-gold)] rounded-full mr-4"></span>
          {category}
        </h2>

        {/* See also - cross-category links */}
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          {category === 'Pack & Ship Services' && (
            <>
              Also explore our{' '}
              <InternalLink variant="geo" to="/copy-print">
                professional printing
              </InternalLink>{' '}
              and{' '}
              <InternalLink variant="geo" to="/home-business">
                business services
              </InternalLink>
              .
            </>
          )}
          {category === 'Professional Printing' && (
            <>
              Need shipping too? See our{' '}
              <InternalLink variant="geo" to="/pack-ship">
                pack and ship services
              </InternalLink>{' '}
              or{' '}
              <InternalLink variant="geo" to="/home-business">
                business support
              </InternalLink>
              .
            </>
          )}
          {category === 'Mailbox Rentals' && (
            <>
              Combine your mailbox with{' '}
              <InternalLink variant="geo" to="/pack-ship/package-receiving">
                package receiving
              </InternalLink>{' '}
              or{' '}
              <InternalLink variant="geo" to="/home-business/notary-services">
                notary services
              </InternalLink>
              .
            </>
          )}
          {category === 'Document Services' && (
            <>
              Pair with{' '}
              <InternalLink variant="geo" to="/copy-print">
                copy and print
              </InternalLink>{' '}
              or{' '}
              <InternalLink variant="geo" to="/home-business/shredding">
                secure shredding
              </InternalLink>
              .
            </>
          )}
          {category === 'Additional Services' && (
            <>
              Also see our{' '}
              <InternalLink variant="geo" to="/home-business/notary-services">
                notary services
              </InternalLink>{' '}
              and{' '}
              <InternalLink variant="geo" to="/pack-ship">
                pack and ship
              </InternalLink>{' '}
              options.
            </>
          )}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services
            .filter((s) => s.category === categoryMap[category] && !hiddenFromGrid.has(s.id))
            .map((service, i) => (
              <div
                key={service.id}
                className="p-6 bg-[var(--color-bg-secondary)]/80 backdrop-blur-md border border-[var(--color-border)] rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-250 flex flex-col group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Thumbnail with fade overlay + subtle zoom */}
                {service.heroImage ? (
                  <div className="relative w-full aspect-[3/2] mb-6 overflow-hidden rounded-2xl group-hover:shadow-md transition-all">
                    <SmartImage
                      src={service.heroImage}
                      alt={service.serviceName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[var(--color-accent-warm)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                  </div>
                ) : service.icon ? (
                  <div className="w-full aspect-[3/2] flex items-center justify-center mb-6 bg-[var(--color-bg-warm-tint)] rounded-2xl group relative overflow-hidden border border-[var(--color-border)]">
                    <service.icon className="w-12 h-12 text-[var(--color-accent-warm)] transition-transform duration-500 group-hover:scale-110" />
                  </div>
                ) : (
                  <div className="w-full aspect-[3/2] mb-6 bg-[var(--color-bg-warm-tint)] rounded-2xl flex items-center justify-center text-[var(--color-text-muted)] text-lg font-bold">
                    ?
                  </div>
                )}

                <h3 className="text-xl font-bold mb-3 text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-warm)] transition-colors">
                  {service.serviceName}
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-6 flex-grow leading-relaxed">
                  {service.metaDescription}
                </p>
                <InternalLink to={service.slug} className="mt-auto">
                  <Button variant="secondary" className="w-full shadow-sm">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </InternalLink>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export const Services: React.FC = () => {
  const serviceCategories = [
    'Pack & Ship Services',
    'Professional Printing',
    'Mailbox Rentals',
    'Document Services',
    'Additional Services',
  ];

  // Toggle the Back to Top button

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const { title, description, schema } = pageMeta['/services'];

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Meta title={title} description={description} schema={schema} />

      <AutoBreadcrumbs />

      {/* Hero Section - Navy Gradient */}
      <section className="relative bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] py-16 lg:py-24 text-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 animate-fade-in-up">
            Explore Our <span className="text-white">Services</span>
          </h1>
          <p className="text-lg text-white leading-relaxed max-w-2xl mx-auto animate-fade-in-up [animation-delay:100ms] opacity-0">
            Shipping, printing, mailbox rentals, and business services — all in one convenient
            location in Concord Township.
          </p>
        </div>

        {/* Soft edge blend at bottom of hero */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            backgroundImage: 'linear-gradient(to bottom, transparent, var(--color-bg-primary))',
          }}
        ></div>
      </section>

      {/* ====================== CATEGORY NAVIGATION ======================= */}
      <section id="categories" className="py-12 bg-[var(--color-bg-primary)] relative z-10 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-[var(--color-bg-secondary)]/70 backdrop-blur-xl rounded-lg shadow-md border border-[var(--color-border)] p-8">
            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
              Explore Our Services
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {serviceCategories.map((category) => (
                <a
                  key={category}
                  href={`#${makeId(category)}`}
                  className="px-6 py-3 bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-warm-tint)] rounded-full border border-[var(--color-border)] hover:border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:text-[var(--color-accent-warm)] transition-all shadow-sm flex items-center justify-center font-medium"
                >
                  {category}
                </a>
              ))}
            </div>
            <div className="mt-8 text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              <p>
                Looking for{' '}
                <InternalLink variant="geo" to="/pack-and-ship-services-concord-township">
                  pack and ship services in Concord Township
                </InternalLink>
                ? Whether you need{' '}
                <InternalLink variant="geo" to="/shipping">
                  UPS, FedEx, DHL, or USPS shipping
                </InternalLink>
                ,
                <InternalLink variant="geo" to="/printing">
                  professional printing
                </InternalLink>
                , or a
                <InternalLink variant="geo" to="/mailbox-rental">
                  secure private mailbox
                </InternalLink>
                , browse our full list of offerings below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== SERVICE SECTIONS (Warm Cards) ======================= */}
      {serviceCategories
        .filter((category) =>
          services.some((s) => s.category === categoryMap[category] && !hiddenFromGrid.has(s.id))
        )
        .map((category) => (
          <CategorySection key={category} category={category} />
        ))}

      {/* ====================== VISIT US SECTION (Navy Gradient) ======================= */}
      <section className="py-20 bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Visit Us in Concord Township Today
          </h2>
          <p className="text-xl text-white/80 mb-3 max-w-3xl mx-auto">
            Next to Pub Frato in Gristmill Village — serving all of Lake County
          </p>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Stop by for all your shipping, printing, and business service needs. Our friendly team
            is ready to help!
          </p>

          <div className="mb-8 text-white/80">
            <p>
              We specialize in{' '}
              <InternalLink
                variant="geo"
                to="/amazon-returns"
                className="text-white hover:text-white/80 underline decoration-white/50 underline-offset-4"
              >
                Amazon returns
              </InternalLink>
              ,
              <InternalLink
                variant="geo"
                to="/notary"
                className="text-white hover:text-white/80 underline decoration-white/50 underline-offset-4"
              >
                notary services
              </InternalLink>
              , and
              <InternalLink
                variant="geo"
                to="/pack-ship"
                className="text-white hover:text-white/80 underline decoration-white/50 underline-offset-4"
              >
                custom packing
              </InternalLink>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* Directions Button - Gold on Navy */}
            <a
              href={getGoogleMapsLink('directions', siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="gold" size="lg" className="font-bold shadow-lg min-h-11">
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>
            {/* View on Map Button - Gold Outline on Navy */}
            <a
              href={getGoogleMapsLink('view', siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="gold-outline"
                size="lg"
                className="min-h-11 min-w-[48px] min-h-[48px]"
              >
                <MapPin className="w-5 h-5 mr-2" />
                View on Map
              </Button>
            </a>
            <a href={`tel:${siteConfig.contact.phone}`}>
              <Button variant="gold-outline" size="lg" className="min-h-11">
                <Phone className="w-5 h-5 mr-2" />
                Call {siteConfig.contact.phone}
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-white/80">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Mon-Fri: 9AM-6PM | Sat: 9AM-2PM | Sun: Closed</span>
          </div>
        </div>
      </section>

      {/* BACK TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-[var(--color-accent-warm)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--color-accent-warm-light)] transition hover:scale-110 z-50"
        aria-label="Back to Top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
};
