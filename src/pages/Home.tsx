import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowRight from '~icons/lucide/arrow-right';
import MapPin from '~icons/lucide/map-pin';
import Phone from '~icons/lucide/phone';
import Clock from '~icons/lucide/clock';
import { Button } from '../components/ui';
import { siteConfig } from '../config/siteConfig';
import { CarrierLogos } from '../components/CarrierLogos';
import { getGoogleMapsLink } from '../utils/location';
import { Meta } from '../components/Meta';
import { pageMeta } from '../config/pageMeta';

const serviceCategories = [
  'Pack & Ship Services',
  'Professional Printing',
  'Mailbox Rentals',
  'Document Services',
  'Notary Services',
  'Digital Fingerprinting',
  'Fax & Scan Services',
  'Packaging Supplies',
  'Business Services',
  'Shredding Services',
  'Package Receiving',
  'Copy Services',
  'Drop-off Services',
];

/**
 * ServiceRotator Component
 *
 * Performance Optimization: Extracted from Home to isolate re-renders.
 * The 3-second interval only triggers updates within this small component,
 * preventing the entire Home page (and its children) from re-rendering.
 *
 * Expected Impact: Reduces main-thread work on the landing page.
 */
const ServiceRotator: React.FC = () => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [prevServiceIndex, setPrevServiceIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => {
        setPrevServiceIndex(prev);
        return (prev + 1) % serviceCategories.length;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-16 mb-8 overflow-hidden relative">
      <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium absolute inset-0 animate-fade-in-up">
        {serviceCategories[currentServiceIndex]}
      </p>
      {prevServiceIndex !== null && (
        <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium absolute inset-0 animate-fade-out-down">
          {serviceCategories[prevServiceIndex]}
        </p>
      )}
    </div>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const localAreas = [
    'Concord Township',
    'Mentor',
    'Painesville',
    'Eastlake',
    'Willoughby',
    'Wickliffe',
    'Madison',
    'Perry',
    'Kirtland',
    'Chardon',
    'Fairport Harbor',
    'Geneva',
  ];

  const { title, description, schema } = pageMeta['/'];

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Meta title={title} description={description} schema={schema} />

      {/* ====================== HERO SECTION (V2 Standard) ======================= */}
      <section className="relative bg-center py-20 md:py-32 lg:py-48 overflow-hidden min-h-[70vh] md:min-h-[80vh]">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 font-heading animate-fade-in-up">
            Pack & Ship in <span className="text-white/90">Concord Twp, Ohio</span>
          </h1>

          <ServiceRotator />

          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
            Your trusted local partner for shipping, printing, and business services. Serving Lake
            County communities with integrity and care.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
            <Button
              variant="secondary"
              className="w-full sm:w-auto font-bold shadow-lg border-none hover:bg-white hover:text-[var(--color-primary)] transition-colors"
              onClick={() => navigate('/services')}
            >
              View Services <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            {/* Directions Button */}
            <a
              href={getGoogleMapsLink('directions', siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-deeper)] border border-white/20 shadow-lg min-w-[48px] min-h-[48px]">
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>
            {/* View on Map Button */}
            <a
              href={getGoogleMapsLink('view', siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="ghost"
                className="w-full sm:w-auto text-white border border-white/40 hover:bg-white/10 min-w-[48px] min-h-[48px]"
              >
                <MapPin className="w-5 h-5 mr-2" />
                View on Map
              </Button>
            </a>
          </div>
        </div>

        {/* Soft fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)]"></div>
      </section>

      {/* ====================== VISIT US SECTION (V2 Gradient) ======================= */}
      <section className="py-20 bg-[var(--color-bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4 font-heading">
            Visit Us in Concord Township Today
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] mb-3 max-w-3xl mx-auto">
            Next to Pub Frato in Gristmill Village — serving all of Lake County
          </p>
          <p className="text-lg text-[var(--color-text-muted)] mb-10 max-w-2xl mx-auto">
            Stop by for all your shipping, printing, and business service needs. Our friendly team
            is ready to help!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* Directions Button */}
            <a
              href={getGoogleMapsLink('directions', siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-[48px] flex items-center"
            >
              <Button className="w-full sm:w-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] min-w-[48px] min-h-[48px]">
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>

            {/* View on Map Button */}
            <a
              href={getGoogleMapsLink('view', siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-[48px] flex items-center"
            >
              <Button variant="secondary" className="w-full sm:w-auto min-w-[48px] min-h-[48px]">
                <MapPin className="w-5 h-5 mr-2" />
                View on Map
              </Button>
            </a>

            {/* Call Button */}
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="w-full sm:w-auto min-h-[48px] flex items-center"
            >
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-[var(--color-primary)] hover:bg-[var(--color-bg-blue-tint)]"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call {siteConfig.contact.phone}
              </Button>
            </a>
          </div>

          {/* Hours */}
          <div className="flex items-center justify-center gap-2 text-[var(--color-text-muted)]">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Mon-Fri: 9AM-6PM | Sat: 9AM-2PM | Sun: Closed</span>
          </div>

          {/* Carrier Logos */}
          <CarrierLogos />
        </div>
      </section>

      {/* Section divider */}
      <div className="bg-[var(--color-bg-primary)] py-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-[var(--color-border)]"></div>
          <div className="w-2 h-2 rotate-45 bg-[var(--color-accent)]"></div>
          <div className="w-12 h-px bg-[var(--color-border)]"></div>
        </div>
      </div>

      {/* ====================== SERVICE AREA SECTION ======================= */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-10 font-heading">
            Service Areas
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            {localAreas.map((area) => {
              // turn "Concord Township" → "concord-township"
              const slug = area.toLowerCase().replace(/\s+/g, '-');
              return (
                <Button
                  key={area}
                  variant="secondary" // outlined style
                  size="sm"
                  className="!rounded-full border-2 border-[var(--color-primary)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-bg-blue-tint)] hover:border-[var(--color-primary-dark)]"
                  onClick={() => navigate(`/service-area/${slug}`)}
                >
                  {area}
                </Button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
