/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import CheckCircle from '~icons/lucide/check-circle';
import Check from '~icons/lucide/check';
import ChevronRight from '~icons/lucide/chevron-right';
import Gift from '~icons/lucide/gift';
import Package from '~icons/lucide/package';
import Mailbox from '~icons/lucide/mailbox';
import Trophy from '~icons/lucide/trophy';
import Award from '~icons/lucide/award';
import Star from '~icons/lucide/star';
import { FormField } from '../components/ui/FormField';
import { useLiveAnnouncer } from '../hooks/useLiveAnnouncer';

declare global {
  interface Window {
    grecaptcha?: {
      /* eslint-disable no-unused-vars */
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      /* eslint-enable no-unused-vars */
    };
  }
}

const RECAPTCHA_SITE_KEY =
  (import.meta.env && import.meta.env.VITE_RECAPTCHA_SITE_KEY) ||
  (import.meta.env && import.meta.env.RECAPTCHA_SITE_KEY) ||
  '';

export const PlusPoints: React.FC = () => {
  const { announceAssertive, LiveAnnouncer } = useLiveAnnouncer();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    birthday: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (
      RECAPTCHA_SITE_KEY &&
      typeof document !== 'undefined' &&
      !document.getElementById('recaptcha-v3-script')
    ) {
      const script = document.createElement('script');
      script.id = 'recaptcha-v3-script';
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const queryParams = new URLSearchParams(window.location.search);
      const referredBy = queryParams.get('r') || '';

      let recaptchaToken = '';
      if (RECAPTCHA_SITE_KEY && window.grecaptcha) {
        try {
          recaptchaToken = await new Promise<string>((resolve) => {
            window.grecaptcha?.ready(() => {
              window.grecaptcha
                ?.execute(RECAPTCHA_SITE_KEY, { action: 'plus_points_signup' })
                .then(resolve)
                .catch(() => resolve(''));
            });
          });
        } catch (err) {
          console.error('reCAPTCHA execution error:', err);
        }
      }

      const res = await fetch('/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          referredBy,
          recaptchaToken,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const err = await res.json();
        const msg = err.error || 'Failed to register account';
        setErrorMsg(msg);
        announceAssertive(msg);
      }
    } catch (err) {
      console.error('Error registering customer:', err);
      const msg = 'Network error. Please try again.';
      setErrorMsg(msg);
      announceAssertive(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <LiveAnnouncer />
      <div className="plus-points-wrapper">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary text-white py-16 lg:py-24">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-deeper via-primary-dark to-primary opacity-90" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-accent-gold font-bold mb-6">
                <Gift className="w-5 h-5" />
                <span>Mailbox Plus Rewards</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Every Package You Ship <br />
                <span className="text-accent-gold">Pays You Back.</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Earn 1 point per $1 on everything — shipping, printing, notary, and mailbox rentals.
                Redeem for free tape, boxes, packing, or even free mailbox months.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a
                  href="#join"
                  className="btn-primary w-full sm:w-auto bg-accent-gold text-primary hover:bg-accent-goldLight border-transparent font-bold text-[15px]"
                >
                  Join Free Today <ChevronRight className="w-5 h-5 ml-1 inline" />
                </a>
                <p className="text-sm text-blue-200 mt-2 sm:mt-0 sm:ml-4">Takes just 30 seconds</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 lg:py-24 bg-bg-primary border-b border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-4">Membership Benefits</h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Start earning immediately. The more you use Mailbox Plus, the faster you get
                rewarded.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <Package />,
                  title: 'Free Tape at 50 pts',
                  desc: 'Never pay for a tape roll again.',
                },
                {
                  icon: <CheckCircle />,
                  title: 'Free Packing at 200 pts',
                  desc: 'Let our pros pack your fragile items free.',
                },
                {
                  icon: <Mailbox />,
                  title: 'Free Mailbox Month',
                  desc: 'Redeem 500 points for one free month of rental.',
                },
                {
                  icon: <Gift />,
                  title: 'Birthday Treat',
                  desc: '$10 credit every year on your birthday.',
                },
                {
                  icon: <Award />,
                  title: 'Share & Earn',
                  desc: 'Share your link and earn 500 points per friend.',
                },
                {
                  icon: <Star />,
                  title: 'Double Points Days',
                  desc: 'Look out for special bonus days to earn faster.',
                },
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="bg-bg-secondary p-8 rounded-lg border border-border hover:border-border-strong transition-colors flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-accent-warm mb-4 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">{benefit.title}</h3>
                  <p className="text-text-secondary text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tier Progression */}
        <section className="py-16 lg:py-24 bg-bg-warm-tint">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-4">Level Up Your Earnings</h2>
              <p className="text-text-secondary">Higher tiers earn points up to 50% faster.</p>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-4xl mx-auto">
              <div className="flex-1 bg-white p-8 rounded-xl border border-border flex flex-col items-center text-center shadow-sm">
                <div className="w-14 h-14 bg-bg-primary rounded-full flex items-center justify-center text-text-primary mb-4 font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Sender</h3>
                <p className="text-accent-warm font-bold mb-4">1x Points</p>
                <p className="text-sm text-text-secondary">
                  Your starting point. Earn 1 point for every $1 spent in-store.
                </p>
              </div>

              <div className="flex-1 bg-white p-8 rounded-xl border-2 border-border-strong flex flex-col items-center text-center shadow-md relative transform md:-translate-y-2">
                <div className="absolute -top-3 bg-accent-gold text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
                <div className="w-14 h-14 bg-bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-xl mb-4 shadow-sm border border-border">
                  2
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Shipper</h3>
                <p className="text-accent-warm font-bold mb-4">1.2x Points</p>
                <p className="text-sm text-text-secondary">
                  Ship regularly and earn points 20% faster on every transaction.
                </p>
              </div>

              <div className="flex-1 bg-primary text-white p-8 rounded-xl flex flex-col items-center text-center shadow-lg transform md:-translate-y-4">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-accent-gold font-bold text-xl mb-4 border border-white/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <p className="text-accent-gold font-bold mb-4">1.5x Points</p>
                <p className="text-sm text-blue-100">
                  For power users. Earn points 50% faster, plus exclusive quarterly bonuses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Signup Form */}
        <section id="join" className="py-16 lg:py-24 bg-bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-border-strong overflow-hidden">
              {success ? (
                <div className="p-8 md:p-12 text-center space-y-6 animate-fade-in-up">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-sm">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-text-primary">Welcome to Plus Points!</h2>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    Your loyalty account has been created successfully. We've sent a magic login
                    link to <strong className="text-text-primary">{formData.email}</strong>.
                  </p>
                  <p className="text-text-secondary text-sm">
                    Open your email and click the link to access your portal, view points, and start
                    sharing your referral code to earn bonus points!
                  </p>
                  <div className="pt-4">
                    <a
                      href="/"
                      className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                    >
                      Return to Homepage
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-bg-secondary border-b border-border p-6 md:p-8 text-center">
                    <h2 className="text-2xl font-bold text-text-primary">
                      Join Free — It Takes 30 Seconds
                    </h2>
                    <p className="text-text-secondary mt-2">
                      No password to remember. We'll send you a magic link when you need to log in.
                    </p>
                  </div>
                  <div className="p-6 md:p-8">
                    {errorMsg && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2.5 text-sm">
                        <span className="font-bold">⚠️</span>
                        <span>{errorMsg}</span>
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField id="firstName" label="First Name" required>
                          <input
                            required
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-border transition-colors text-text-primary bg-bg-primary"
                            placeholder="First Name"
                          />
                        </FormField>
                        <FormField id="lastName" label="Last Name" required>
                          <input
                            required
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-border transition-colors text-text-primary bg-bg-primary"
                            placeholder="Last Name"
                          />
                        </FormField>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField id="phone" label="Phone Number" required>
                          <input
                            required
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-border transition-colors text-text-primary bg-bg-primary"
                            placeholder="(555) 555-5555"
                          />
                        </FormField>
                        <FormField id="email" label="Email Address" required>
                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-border transition-colors text-text-primary bg-bg-primary"
                            placeholder="you@email.com"
                          />
                        </FormField>
                      </div>

                      <FormField id="street" label="Street Address" required>
                        <input
                          required
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border transition-colors text-text-primary bg-bg-primary"
                          placeholder="123 Main St"
                        />
                      </FormField>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField id="city" label="City" required className="md:col-span-1">
                          <input
                            required
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-border transition-colors text-text-primary bg-bg-primary"
                            placeholder="City"
                          />
                        </FormField>
                        <FormField id="state" label="State" required>
                          <input
                            required
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-border transition-colors text-text-primary bg-bg-primary"
                            placeholder="State"
                          />
                        </FormField>
                        <FormField id="zip" label="ZIP" required>
                          <input
                            required
                            type="text"
                            name="zip"
                            value={formData.zip}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-border transition-colors text-text-primary bg-bg-primary"
                            placeholder="ZIP"
                          />
                        </FormField>
                      </div>

                      <FormField
                        id="birthday"
                        label="Birthday"
                        helpText="Optional — for birthday treat"
                      >
                        <input
                          type="text"
                          name="birthday"
                          value={formData.birthday}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border transition-colors text-text-primary bg-bg-primary"
                          placeholder="MM/DD"
                        />
                      </FormField>

                      <div className="flex items-start gap-3 mt-4">
                        <input
                          required
                          type="checkbox"
                          id="terms"
                          className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="terms" className="text-sm text-text-secondary">
                          I agree to earn points when I ship at Mailbox Plus and accept the Rewards
                          Terms of Service.
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-accent-warm hover:bg-opacity-90 disabled:opacity-50 text-white font-bold rounded-lg text-lg transition-colors flex justify-center items-center gap-2"
                      >
                        {submitting ? 'Creating Account...' : 'Start Earning'}{' '}
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      <p className="text-center text-sm text-text-secondary mt-4">
                        Already a member?{' '}
                        <a href="/rewards/me/" className="text-primary font-bold hover:underline">
                          Log in here
                        </a>{' '}
                        or ask staff to look you up.
                      </p>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
