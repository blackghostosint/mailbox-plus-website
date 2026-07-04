import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowRight from '~icons/lucide/arrow-right';
import MapPin from '~icons/lucide/map-pin';
import Phone from '~icons/lucide/phone';
import Clock from '~icons/lucide/clock';
import Truck from '~icons/lucide/truck';
import Package from '~icons/lucide/package';
import Mail from '~icons/lucide/mail';
import FileText from '~icons/lucide/file-text';
import { Button } from '../components/ui';
import { siteConfig } from '../config/siteConfig';
import { getGoogleMapsLink } from '../utils/location';
import { Meta } from '../components/Meta';
import { pageMeta } from '../config/pageMeta';
import { useInView } from '../hooks/useInView';

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

  const [heroRef] = useInView<HTMLElement>({ threshold: 0 });
  const [cardsRef, cardsInView] = useInView<HTMLElement>({ threshold: 0.1 });
  const [visitRef, visitInView] = useInView<HTMLElement>({ threshold: 0.1 });
  const [areaRef, areaInView] = useInView<HTMLElement>({ threshold: 0.1 });

  const stagger = (i: number) => ({ animationDelay: `${i * 100}ms` });

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Meta title={title} description={description} schema={schema} />

      {/* ====================== HERO SECTION ======================= */}
      <section
        ref={heroRef}
        className="relative bg-center py-20 md:py-32 lg:py-48 overflow-hidden min-h-[70vh] md:min-h-[80vh]"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)]"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.15] mb-8 font-heading animate-fade-in-up">
            Shipping, Returns, and Private Mailboxes
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-accent-warm)] leading-relaxed mb-8 animate-fade-in-up [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
            Four carriers, one counter, no runaround.
          </p>

          <p className="text-lg sm:text-xl md:text-2xl text-white/80 leading-loose max-w-3xl mx-auto mb-6 animate-fade-in-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
            Shipping shouldn’t cost you an hour. Stop running around Lake County for returns or
            carrier drop-offs.
          </p>

          <p className="text-base sm:text-lg font-semibold text-white/90 tracking-widest uppercase mb-4 animate-fade-in-up [animation-delay:300ms] opacity-0 [animation-fill-mode:forwards]">
            Your Local Pack &amp; Ship in Concord Township
          </p>
        </div>

        {/* Soft fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)]"></div>
      </section>

      {/* ====================== SERVICE CARDS SECTION ======================= */}
      <section
        ref={cardsRef}
        className={`py-16 md:py-24 bg-[var(--color-bg-primary)] transition-all duration-600 ${
          cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ship a Package */}
            <div
              className="bg-[var(--color-bg-secondary)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-250 group"
              style={cardsInView ? stagger(0) : undefined}
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-warm)]/10 flex items-center justify-center text-[var(--color-accent-warm)] mb-4 group-hover:bg-[var(--color-accent-warm)]/15 transition-colors">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                Ship a Package
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                UPS, FedEx, USPS, DHL — we compare rates and get it out same day.
              </p>
              <a
                href="/pack-ship"
                className="mt-auto inline-flex items-center text-sm font-semibold text-[var(--color-accent-warm)] hover:text-[var(--color-accent-warm-light)] transition-colors"
              >
                Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>

            {/* Return an Order */}
            <div
              className="bg-[var(--color-bg-secondary)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-250 group"
              style={cardsInView ? stagger(1) : undefined}
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-warm)]/10 flex items-center justify-center text-[var(--color-accent-warm)] mb-4 group-hover:bg-[var(--color-accent-warm)]/15 transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                Return an Order
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                FedEx, UPS, USPS, Amazon — doesn't matter who the label's from, we scan it and it's
                gone.
              </p>
              <a
                href="/pack-ship/package-receiving"
                className="mt-auto inline-flex items-center text-sm font-semibold text-[var(--color-accent-warm)] hover:text-[var(--color-accent-warm-light)] transition-colors"
              >
                Drop Off a Return <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>

            {/* Private Mailbox */}
            <div
              className="bg-[var(--color-bg-secondary)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-250 group"
              style={cardsInView ? stagger(2) : undefined}
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-warm)]/10 flex items-center justify-center text-[var(--color-accent-warm)] mb-4 group-hover:bg-[var(--color-accent-warm)]/15 transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                Private Mailbox
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                A real street address for your business or privacy. All-carrier package acceptance,
                no porch theft.
              </p>
              <a
                href="/home-business/mailbox-rental"
                className="mt-auto inline-flex items-center text-sm font-semibold text-[var(--color-accent-warm)] hover:text-[var(--color-accent-warm-light)] transition-colors"
              >
                See Options <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>

            {/* Notary & More */}
            <div
              className="bg-[var(--color-bg-secondary)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-250 group"
              style={cardsInView ? stagger(3) : undefined}
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-warm)]/10 flex items-center justify-center text-[var(--color-accent-warm)] mb-4 group-hover:bg-[var(--color-accent-warm)]/15 transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                Notary & More
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                Notary, shredding, fingerprinting, passport photos — everything else your errand
                list needs, one counter.
              </p>
              <a
                href="/home-business/notary-services"
                className="mt-auto inline-flex items-center text-sm font-semibold text-[var(--color-accent-warm)] hover:text-[var(--color-accent-warm-light)] transition-colors"
              >
                Notary &amp; Business Services <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== VISIT US SECTION ======================= */}
      <section
        id="visit-us"
        ref={visitRef}
        className={`py-24 md:py-32 lg:py-36 bg-[var(--color-bg-primary)] transition-all duration-600 ${
          visitInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Gold CTA moved from hero */}
          <div className="mb-14">
            <Button
              variant="gold"
              size="lg"
              className="animate-cta-pulse text-base sm:text-lg px-10 py-5"
              onClick={() => navigate('/pack-ship')}
            >
              Get Started Shipping <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-2xl md:text-4xl font-bold text-[var(--color-text-secondary)] mb-4 max-w-3xl mx-auto">
            Next to Pub Frato in Gristmill Village — serving all of Lake County
          </p>
          <p className="text-lg text-[var(--color-text-muted)] mb-14 max-w-2xl mx-auto">
            Stop by for all your shipping, printing, and business service needs. We are ready to
            help you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href={getGoogleMapsLink('directions', siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-[48px] flex items-center"
            >
              <Button variant="primary" className="w-full sm:w-auto min-w-[48px] min-h-[48px]">
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>

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

            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="w-full sm:w-auto min-h-[48px] flex items-center"
            >
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-[var(--color-accent-warm)] hover:bg-[var(--color-accent-warm)]/10"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call {siteConfig.contact.phone}
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-[var(--color-text-muted)] mb-10">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Mon-Fri: 9AM-6PM | Sat: 9AM-2PM | Sun: Closed</span>
          </div>

          <div className="mb-14 flex flex-col items-center justify-center">
            <a
              href="https://g.page/r/CYyNUX4atT3PEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex flex-col items-center p-6 md:p-8 bg-white/70 backdrop-blur border border-[var(--color-border)] rounded-[28px] shadow-sm hover:shadow-md hover:scale-102 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-[var(--color-accent-gold)] text-2xl md:text-3xl font-bold flex">
                  ★ ★ ★ ★ ★
                </span>
                <span className="text-lg md:text-xl font-bold text-[var(--color-text-primary)]">
                  {siteConfig.aggregateRating?.ratingValue || 5.0} / 5.0
                </span>
              </div>
              <p className="text-sm md:text-base font-bold text-[var(--color-text-primary)] mt-2 group-hover:text-[var(--color-accent-warm)] transition-colors">
                Based on {siteConfig.aggregateRating?.reviewCount || 32} Verified Google Reviews
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* ====================== SERVICE AREA SECTION ======================= */}
      <section
        ref={areaRef}
        className={`py-16 bg-[var(--color-bg-primary)] transition-all duration-600 ${
          areaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-10 font-heading">
            Service Areas
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            {localAreas.map((area, i) => {
              const slug = area.toLowerCase().replace(/\s+/g, '-');
              return (
                <Button
                  key={area}
                  variant="secondary"
                  size="sm"
                  style={areaInView ? stagger(i) : undefined}
                  className="!rounded-full border-2 border-[var(--color-primary)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-accent-warm)]/10 hover:border-[var(--color-accent-warm)]"
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
