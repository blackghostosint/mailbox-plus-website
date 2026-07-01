/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import { Meta } from '../components/Meta';
import { AutoBreadcrumbs } from '../components/ui/AutoBreadcrumbs';
import { Button } from '../components/ui';
import { useInView } from '../hooks/useInView';
import { InternalLink } from '../components/ui/InternalLink';
import UserCheck from '~icons/lucide/user-check';
import Mail from '~icons/lucide/mail';
import MapPin from '~icons/lucide/map-pin';
import ShieldCheck from '~icons/lucide/shield-check';
import Inbox from '~icons/lucide/inbox';
import Sparkles from '~icons/lucide/sparkles';
import ArrowRight from '~icons/lucide/arrow-right';
import Clock from '~icons/lucide/clock';

export const AfterSignup: React.FC = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [stepsRef, stepsInView] = useInView({ threshold: 0.1 });
  const [faqRef, faqInView] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1 });

  return (
    <>
      <Meta
        title="Welcome Onboard! Post-Signup Guide & Video | Mailbox Plus"
        description="Your setup guide and explainer video. See what happens next after registering for your private physical mailbox at Mailbox Plus."
      />

      <div className="after-signup-wrapper overflow-x-hidden bg-bg-primary min-h-screen">
        <AutoBreadcrumbs />

        {/* ====================== HERO SECTION (Navy Gradient) ======================= */}
        <section
          ref={heroRef}
          className={`relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] py-20 md:py-32 text-center transition-all duration-700 ${
            heroInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-accent-gold font-bold mb-6 animate-fade-in-up">
              <Sparkles className="w-5 h-5" />
              <span>Welcome to Mailbox Plus</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-none">
              Your Mailbox Journey <br />
              <span className="text-accent-gold">Starts Here</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium max-w-3xl mx-auto mb-12">
              Watch this 70-second video to see exactly how we receive, secure, and manage your mail
              and packages.
            </p>

            {/* Video Container */}
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-[var(--color-border-strong)] bg-[var(--color-primary-deep)] relative aspect-video">
              <video
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                poster="/videos/mailbox-plus-explainer-thumbnail.jpg"
                playsInline
              >
                <source src="/videos/mailbox-plus-explainer.mp4" type="video/mp4" />
                <track
                  src="/videos/mailbox-plus-explainer-captions.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                  default
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Soft fade bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)] z-10"></div>
        </section>

        {/* ====================== EXPECTATIONS SECTION (Steps) ======================= */}
        <section ref={stepsRef} className="py-20 bg-bg-primary border-b border-border">
          <div className="max-w-7xl mx-auto px-4">
            <div
              className={`text-center mb-16 transition-all duration-700 ${
                stepsInView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                What Happens Next?
              </h2>
              <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                Setting up your mailbox is quick and painless. Here is the step-by-step timeline of
                what to expect from our team.
              </p>
            </div>

            <div
              className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto transition-all duration-700 delay-200 ${
                stepsInView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
            >
              {[
                {
                  icon: <UserCheck className="w-6 h-6" />,
                  stepNum: '1',
                  title: 'Application Review',
                  desc: 'Our staff reviews your application details. Personal accounts activate right away, while business accounts are verified by the next business day.',
                },
                {
                  icon: <Mail className="w-6 h-6" />,
                  stepNum: '2',
                  title: 'Activation Email',
                  desc: 'You will receive an activation email. Simply click the link inside to verify your identity and officially open your mailbox.',
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  stepNum: '3',
                  title: 'Address Assigned',
                  desc: 'Your official mailing address becomes: 7554 Fredle Drive, PMB [Your Number], Concord Township, OH 44077.',
                },
                {
                  icon: <Inbox className="w-6 h-6" />,
                  stepNum: '4',
                  title: 'Welcome Kit',
                  desc: 'A welcome email follows with your mailbox details, our operating hours, and a list of two forms of ID required for mail pickup.',
                },
                {
                  icon: <ShieldCheck className="w-6 h-6" />,
                  stepNum: '5',
                  title: 'Secure Logging',
                  desc: 'We sign for all packages from FedEx, UPS, USPS, and DHL. Our on-site team logs every single item in our secure, locked vault.',
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  stepNum: '6',
                  title: 'Easy Collection',
                  desc: 'Stop by during office hours, show your ID, and collect your mail and packages. Fast, friendly, and hassle-free!',
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-bg-secondary p-8 rounded-lg border border-[var(--color-border-strong)] hover:border-[var(--color-accent-warm)] transition-all duration-300 flex flex-col relative group hover:shadow-md"
                >
                  <div className="absolute top-4 right-6 text-5xl font-black text-[var(--color-border-strong)]/40 group-hover:text-[var(--color-accent-warm)]/10 transition-colors pointer-events-none">
                    {step.stepNum}
                  </div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--color-accent-warm)] mb-6 shadow-sm border border-[var(--color-border)]">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================== QUICK FAQ SECTION ======================= */}
        <section ref={faqRef} className="py-20 bg-bg-warm-tint border-b border-border">
          <div className="max-w-4xl mx-auto px-6">
            <div
              className={`text-center mb-12 transition-all duration-700 ${
                faqRef ? 'animate-fade-in-up' : 'opacity-0'
              }`}
            >
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
                Common Questions
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                Everything you need to know about starting your new mailbox.
              </p>
            </div>

            <div
              className={`space-y-6 transition-all duration-700 delay-200 ${
                faqInView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
            >
              {[
                {
                  q: 'When can I start sending mail to my new address?',
                  a: 'You can begin giving out your address as soon as you receive your confirmation welcome email containing your assigned PMB number!',
                },
                {
                  q: 'What forms of ID do I need to bring?',
                  a: 'By federal regulations, you must present two forms of identification. One must contain a photograph (e.g., driver’s license, passport) and the other must verify your address (e.g., utility bill, voter registration, vehicle registration). Social security cards and credit cards are not acceptable.',
                },
                {
                  q: 'Do you accept package deliveries from all carriers?',
                  a: 'Yes! Unlike standard post office boxes, we accept and sign for deliveries from FedEx, UPS, USPS, DHL, and local couriers.',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-bg-primary p-6 md:p-8 rounded-xl border border-[var(--color-border-strong)]"
                >
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex gap-3">
                    <span className="text-[var(--color-accent-warm)] font-black">Q:</span>
                    {faq.q}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] pl-7 leading-relaxed text-sm">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================== CTA SECTION ======================= */}
        <section
          ref={ctaRef}
          className={`py-20 bg-bg-primary text-center transition-all duration-700 ${
            ctaInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-6">
              Ready to Secure Your Mail?
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg mb-10 max-w-xl mx-auto">
              If you have any questions, our local Concord Township team is standing by to help you
              get completely set up.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <InternalLink to="/" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Using Your Mailbox <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </InternalLink>

              <InternalLink to="/contact-us" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Contact Our Office
                </Button>
              </InternalLink>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
