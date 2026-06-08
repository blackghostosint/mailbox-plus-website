import { PageMeta } from '../components/SEO/PageMeta';
import { SmartImage } from '../components/SmartImage';
import { motion } from 'framer-motion';
import { fadeUp } from '../utils/animations';
import { InternalLink } from '../components/ui/InternalLink';
import { Button } from '../components/ui';
import ArrowRight from '~icons/lucide/arrow-right';
import MapPin from '~icons/lucide/map-pin';
import Package from '~icons/lucide/package';
import Printer from '~icons/lucide/printer';
import Mail from '~icons/lucide/mail';
import FileText from '~icons/lucide/file-text';
import ScanLine from '~icons/lucide/scan-line';
import Box from '~icons/lucide/box';
import { getServiceImageUrl } from '../lib/storage';

export function AboutUs() {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <>
      <PageMeta
        title="About Mailbox Plus | Locally Owned Shipping & Business Services in Concord Township"
        description="Learn about Mailbox Plus — your trusted, locally owned partner for shipping, printing, mailbox rentals, and business services in Concord Township and Lake County, Ohio."
      />

      {/* ====================== HERO SECTION (V2 STANDARD) ======================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] py-16 lg:py-24 text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h1
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6"
          >
            About <span className="text-white/90">Mailbox Plus</span>
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.1 }}
            className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium max-w-3xl mx-auto mb-10"
          >
            Your trusted local partner for shipping, printing, mailbox rentals, and business
            services — proudly serving Concord Township and Lake County.
          </motion.p>
        </div>

        {/* Soft fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)] z-10"></div>
      </section>

      {/* -------------------------------- */}
      {/* OUR STORY */}
      {/* -------------------------------- */}
      <section className="mt-16 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        <motion.div {...fadeUp(0.1)} className="relative">
          <SmartImage
            src={getServiceImageUrl('/images/mailboxes.webp')}
            alt="Private mailbox wall at Mailbox Plus"
            className="rounded-lg shadow-lg w-full aspect-video object-cover border border-white/50"
          />
        </motion.div>

        <motion.div
          {...fadeUp(0.2)}
          className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-lg border border-white/50 shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">Our Story</h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4 text-lg">
            Mailbox Plus is a locally owned and operated business located in the heart of Concord
            Township, Ohio. We opened our doors to provide a friendly, reliable, and convenient
            alternative to driving to Mentor, Willoughby, or Painesville for shipping and business
            needs.
          </p>

          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4 text-lg">
            Our mission is simple: offer honest, personal, neighborly service that you won’t find at
            big-box stores or national shipping chains. We combine small-town hospitality with
            big-city capabilities — giving you access to
            <strong className="text-[var(--color-primary)]"> FedEx, UPS, USPS, and DHL</strong> all
            in one location.
          </p>

          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8 text-lg">
            Whether you&apos;re shipping a package, printing documents, renting a private mailbox,
            or handling business tasks, our team is here to help every step of the way.
          </p>

          <InternalLink to="/contact-us">
            <Button size="lg" className="shadow-lg">
              Visit Us Today <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </InternalLink>
        </motion.div>
      </section>

      {/* -------------------------------- */}
      {/* COMMUNITY FOCUS */}
      {/* -------------------------------- */}
      <section className="mt-20 bg-[var(--color-bg-secondary)] py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.h2 {...fadeUp(0.1)} className="text-3xl font-semibold mb-6">
            Proudly Serving Concord Township & Lake County
          </motion.h2>
          <motion.p
            {...fadeUp(0.2)}
            className="text-[var(--color-text-primary)] max-w-3xl mx-auto leading-relaxed"
          >
            Our customers come from Concord Township, Mentor, Painesville, Willoughby, Eastlake,
            Madison, Chardon, Kirtland, Perry, and all across Lake County. We are deeply committed
            to supporting our local residents, nearby businesses, and community organizations with
            dependable service and genuine care.
          </motion.p>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* MEET OUR TEAM */}
      {/* -------------------------------- */}
      <section className="mt-20 max-w-7xl mx-auto px-4">
        <motion.h2
          {...fadeUp(0.1)}
          className="text-3xl font-bold text-center mb-10 text-[var(--color-text-primary)]"
        >
          Meet Our Team
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Frank */}
          <motion.div
            {...fadeUp(0.2)}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-lg shadow-lg border border-white/50 text-center hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className="w-32 h-32 mx-auto mb-6 p-1 bg-white rounded-full shadow-md">
              <SmartImage
                src={getServiceImageUrl('/images/frank.webp')}
                alt="Frank Schwarz"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">Frank Schwarz</h3>
            <p className="text-[var(--color-primary)] font-semibold text-lg mb-4">Store Manager</p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              Frank brings years of experience in customer service, operations, and business
              management, operations, logistics, and shipping. Known for his friendly approach and
              attention to detail, he ensures every customer leaves with a great experience.
            </p>
            <a
              href="https://www.linkedin.com/in/frank-schwarz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="link" className="text-[var(--color-primary)]">
                View LinkedIn <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </motion.div>

          {/* Diana */}
          <motion.div
            {...fadeUp(0.3)}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-lg shadow-lg border border-white/50 text-center hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className="w-32 h-32 mx-auto mb-6 p-1 bg-white rounded-full shadow-md">
              <SmartImage
                src={getServiceImageUrl('/images/diana.webp')}
                alt="Diana Goebelt Schwarz"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Diana Goebelt Schwarz
            </h3>
            <p className="text-[var(--color-primary)] font-semibold text-lg mb-4">Owner</p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              With a strong background in operations, logistics, and customer care, Diana leads
              Mailbox Plus with a commitment to excellence and community-minded service. Her
              leadership ensures we continue to grow while maintaining a welcoming, family-run
              atmosphere.
            </p>
            <a
              href="https://www.linkedin.com/in/diana-goebelt-schwarz-94090737/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="link" className="text-[var(--color-primary)]">
                View LinkedIn <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* SERVICES WE OFFER */}
      {/* -------------------------------- */}
      <section className="py-20 bg-[var(--color-bg-primary)] relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            {...fadeUp(0.1)}
            className="text-3xl font-bold text-center mb-12 text-[var(--color-text-primary)]"
          >
            What We Offer
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Pack & Ship',
                link: '/pack-ship',
                icon: Package,
                desc: 'UPS, FedEx, DHL, USPS',
              },
              {
                title: 'Print Services',
                link: '/copy-print',
                icon: Printer,
                desc: 'Copies, Photos',
              },
              {
                title: 'Mailbox Rentals',
                link: '/home-business/mailbox-rental',
                icon: Mail,
                desc: 'Secure, Private, Business Hours',
              },
              {
                title: 'Notary Public',
                link: '/home-business/notary-services',
                icon: FileText,
                desc: 'Official Notarizations',
              },
              {
                title: 'Scanning',
                link: '/home-business/document-scanning',
                icon: ScanLine,
                desc: 'Digitize Your Documents',
              },
              {
                title: 'Package Receiving',
                link: '/pack-ship/package-receiving',
                icon: Box,
                desc: 'Never Miss a Delivery',
              },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                {...fadeUp(0.1 * i)}
                className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-lg border border-[var(--color-border)] hover:border-[var(--color-border-blue)] transition-all duration-300 hover:translate-y-[-4px]"
              >
                <div className="w-12 h-12 bg-[var(--color-bg-blue-tint)] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] transition-colors duration-300">
                  <service.icon className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">
                  {service.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-4">{service.desc}</p>
                <InternalLink
                  to={service.link}
                  className="inline-flex items-center text-[var(--color-primary)] font-semibold hover:text-[var(--color-primary-dark)]"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </InternalLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* CTA */}
      {/* -------------------------------- */}
      <section className="py-20 bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Let Us Handle Your Package!
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop in today — we&apos;re conveniently located at{' '}
            <span className="text-white font-semibold">7554 Fredle Drive</span> in Concord Township.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InternalLink to="/contact-us">
              <Button
                size="lg"
                variant="secondary"
                className="font-bold shadow-lg border-none min-h-12 px-8"
              >
                Get in Touch
              </Button>
            </InternalLink>
            <a
              href="https://www.google.com/maps/dir//Mailbox+Plus+Concord+Township"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="ghost"
                className="text-white border border-white/40 hover:bg-white/10"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
