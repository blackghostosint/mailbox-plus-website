import React, { useState } from 'react';
import Phone from '~icons/lucide/phone';
import Mail from '~icons/lucide/mail';
import MapPin from '~icons/lucide/map-pin';
import Clock from '~icons/lucide/clock';
import Send from '~icons/lucide/send';
import ReCAPTCHA from 'react-google-recaptcha';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/ui';
import { getGoogleMapsLink } from '../utils/location';
import { Meta } from '../components/Meta';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    recaptcha: '',
    website: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.website) {
      console.warn('Spam detected via honeypot.');
      return;
    }

    if (!formData.recaptcha) {
      alert('Please verify that you are not a robot.');
      return;
    }

    try {
      const verifyResponse = await fetch('/.netlify/functions/verifyRecaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: formData.recaptcha }),
      });

      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        alert('reCAPTCHA verification failed. Please try again.');
        return;
      }

      const response = await fetch('/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Message sent successfully! We'll get back to you soon.");
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
          recaptcha: '',
          website: '',
        });
      } else {
        alert('⚠️ Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error(error);
      alert('❌ Unable to send message. Please check your connection.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: siteConfig.contact.phone,
      action: `tel:${siteConfig.contact.phone}`,
      actionText: 'Call Now',
    },
    {
      icon: Mail,
      title: 'Email',
      details: siteConfig.contact.email,
      action: `mailto:${siteConfig.contact.email}`,
      actionText: 'Send Email',
    },
    {
      icon: MapPin,
      title: 'Address',
      details: `${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.state} ${siteConfig.contact.address.zip}`,
      action: getGoogleMapsLink('directions', siteConfig.name),
      actionText: 'Get Directions',
    },
  ];

  const hours = [
    { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 2:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ];

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Meta
        title="Contact Us - Mailbox Plus"
        description="Get in touch with Mailbox Plus in Concord Township, Ohio. Call, email, or visit us for all your shipping and printing needs."
        canonical="https://mailboxplusohio.com/contact-us"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] py-16 lg:py-24 text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 animate-fade-in-up">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium max-w-3xl mx-auto mb-10 animate-fade-in-up [animation-delay:150ms] opacity-0">
            Visit our store in Concord Twp., or contact us today. We&apos;re here to help with all
            your shipping, printing, and business service needs.
          </p>
        </div>

        {/* Soft edge blend at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)] z-10" />
      </section>

      {/* ====================== MAIN CONTENT ======================= */}
      <div className="relative z-20 -mt-20 container mx-auto px-4 pb-20 space-y-20">
        {/* Contact Info Cards (Glass) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <div
              key={info.title}
              className="group relative flex flex-col items-center p-8 text-center rounded-lg bg-white/70 backdrop-blur-xl border border-white/70 shadow-lg hover:bg-white/90 transition-all duration-300 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-[var(--color-bg-blue-tint)] rounded-2xl flex items-center justify-center mb-6 text-[var(--color-primary)] shadow-inner">
                <info.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                {info.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed flex-grow">
                {info.details}
              </p>
              <a
                href={info.action}
                target={info.title === 'Address' ? '_blank' : undefined}
                rel={info.title === 'Address' ? 'noopener noreferrer' : undefined}
              >
                <Button
                  variant="link"
                  className="text-[var(--color-primary)] font-bold text-base hover:text-[var(--color-primary-dark)] p-0"
                >
                  {info.actionText} →
                </Button>
              </a>
            </div>
          ))}
        </div>

        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Form GLASS PANEL */}
          <section className="relative animate-fade-in-up">
            {/* Glass container */}
            <div className="relative rounded-[28px] px-6 md:px-10 py-8 md:py-10 bg-white/75 backdrop-blur-xl border border-white/80 shadow-lg h-full">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4">
                Send Us a Message
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                Have a question about our services or need a custom quote? Fill out the form below
                and we&apos;ll get back to you promptly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-[var(--color-text-primary)]"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      aria-label="Full name"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-border-blue)] focus:outline-none transition-all shadow-sm"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-[var(--color-text-primary)]"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      aria-label="Email address"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-border-blue)] focus:outline-none transition-all shadow-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-[var(--color-text-primary)]"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      aria-label="Phone number"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-border-blue)] focus:outline-none transition-all shadow-sm"
                      placeholder="(440) 555-0123"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="service"
                      className="text-sm font-semibold text-[var(--color-text-primary)]"
                    >
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      aria-label="Service interest"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-border-blue)] focus:outline-none transition-all shadow-sm appearance-none"
                    >
                      <option value="">Select a service</option>
                      <option value="shipping">Pack & Ship</option>
                      <option value="printing">Printing Services</option>
                      <option value="mailbox">Mailbox Rental</option>
                      <option value="fingerprinting">Digital Fingerprinting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-[var(--color-text-primary)]"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    aria-label="Your message"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-border-blue)] focus:outline-none transition-all shadow-sm resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="pt-2">
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={(token) => setFormData({ ...formData, recaptcha: token || '' })}
                  />
                </div>

                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full group shadow-md hover:shadow-lg bg-[var(--color-primary)] border-none text-white"
                >
                  <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </Button>
              </form>
            </div>
          </section>

          {/* Sidebar (Hours + Map) */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Hours Card */}
            <div className="rounded-[28px] p-8 bg-white/60 backdrop-blur border border-white/60 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center mr-4 text-[var(--color-primary)]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Store Hours</h3>
              </div>
              <div className="space-y-4">
                {hours.map((schedule) => (
                  <div
                    key={schedule.day}
                    className="flex justify-between items-center border-b border-[var(--color-border)]/60 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-[var(--color-text-secondary)] font-medium">
                      {schedule.day}
                    </span>
                    <span className="text-[var(--color-text-primary)] font-bold">
                      {schedule.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Container */}
            <div className="bg-[var(--color-bg-secondary)] rounded-[28px] overflow-hidden h-96 w-full shadow-lg border border-white/50">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=Mailbox+Plus+Concord+Township+OH`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mailbox Plus Location"
              />
            </div>

            {/* Google Reviews Badge */}
            <div className="bg-white/90 border border-white/50 rounded-2xl p-6 shadow-md flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-2">
                <div className="text-[var(--color-accent)] text-2xl font-bold flex">★ ★ ★ ★ ★</div>
                <span className="text-lg font-bold text-[var(--color-text-primary)]">
                  {siteConfig.aggregateRating?.ratingValue || 5.0} / 5
                </span>
              </div>
              <div>
                <p className="text-base font-bold text-[var(--color-text-primary)]">
                  Based on {siteConfig.aggregateRating?.reviewCount || 32} Google Reviews
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  100% of our customers rate us 5 stars for retail packing & shipping!
                </p>
              </div>
              <a
                href="https://g.page/r/CYyNUX4atT3PEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block bg-[var(--color-primary)] text-white text-sm font-bold py-3 px-6 rounded-xl hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all shadow-sm"
              >
                Write a Google Review
              </a>
            </div>

            {/* Directions Tip */}
            <div className="bg-white/80 border border-white/50 rounded-2xl p-6 text-center">
              <p className="text-sm text-white/90 font-medium">
                📍 We are located in the Gristmill Village plaza, next to Pub Frato and close to
                I-90.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
