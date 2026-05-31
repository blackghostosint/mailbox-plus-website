import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
import { SmartImage } from '../components/SmartImage';
import { getServiceImageUrl } from '../lib/storage';

// Animation Constant
const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: 'easeOut' as const },
};

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
    <div className="bg-slate-50 min-h-screen">
      <Meta
        title="Contact Us - Mailbox Plus"
        description="Get in touch with Mailbox Plus in Concord Township, Ohio. Call, email, or visit us for all your shipping and printing needs."
        canonical="https://www.mailboxplus.com/contact-us"
      />

      {/* ====================== HERO (V2 Standard) ======================= */}
      <section className="relative overflow-hidden">
        {/* Background Image with V2 Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          <SmartImage
            priority
            sources={[
              {
                srcSet: getServiceImageUrl('mailbox_plus_storefront_hero_image_mobile.webp'),
                media: '(max-width: 768px)',
                type: 'image/webp',
              },
              {
                srcSet: getServiceImageUrl('mailbox_plus_storefront_hero_image.webp'),
                media: '(min-width: 769px)',
                type: 'image/webp',
              },
            ]}
            src={getServiceImageUrl('mailbox_plus_storefront_hero_image.webp')}
            alt="Mailbox Plus storefront in Concord Township, Ohio"
            className="w-full h-full object-cover object-center mix-blend-soft-light opacity-90 blur-[1px] scale-105"
          />
          {/* V2 Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-start)] via-[var(--color-accent)] to-[var(--color-gradient-mid)] opacity-90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[var(--color-gradient-end)]/90"></div>
        </div>

        {/* Soft Fade Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-slate-50 z-10" />

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-44 lg:pt-32 lg:pb-52 text-center max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            Get in <span className="text-blue-200">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl text-blue-100 mb-8 leading-relaxed"
          >
            Visit our store in Concord Twp., or contact us today. We&apos;re here to help with all
            your shipping, printing, and business service needs.
          </motion.p>
        </div>
      </section>

      {/* ====================== MAIN CONTENT ======================= */}
      <div className="relative z-20 -mt-20 container mx-auto px-4 pb-20 space-y-20">
        {/* Contact Info Cards (Glass) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.1 }}
              className="group relative flex flex-col items-center p-8 text-center rounded-lg bg-white/70 backdrop-blur-xl border border-white/70 shadow-lg hover:bg-white/90 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center mb-6 text-[var(--color-primary)] shadow-inner">
                <info.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{info.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed flex-grow">{info.details}</p>
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
            </motion.div>
          ))}
        </div>

        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Form GLASS PANEL */}
          <motion.section {...reveal} className="relative">
            {/* Glass container */}
            <div className="relative rounded-[28px] px-6 md:px-10 py-8 md:py-10 bg-white/75 backdrop-blur-xl border border-white/80 shadow-lg h-full">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Send Us a Message
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Have a question about our services or need a custom quote? Fill out the form below
                and we&apos;ll get back to you promptly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-slate-700">
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
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-border-blue)] focus:outline-none transition-all shadow-sm"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">
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
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-border-blue)] focus:outline-none transition-all shadow-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      aria-label="Phone number"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-border-blue)] focus:outline-none transition-all shadow-sm"
                      placeholder="(440) 555-0123"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-semibold text-slate-700">
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      aria-label="Service interest"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-border-blue)] focus:outline-none transition-all shadow-sm appearance-none"
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
                  <label htmlFor="message" className="text-sm font-semibold text-slate-700">
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
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-border-blue)] focus:outline-none transition-all shadow-sm resize-none"
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
          </motion.section>

          {/* Sidebar (Hours + Map) */}
          <motion.div {...reveal} className="space-y-8">
            {/* Hours Card */}
            <div className="rounded-[28px] p-8 bg-white/60 backdrop-blur border border-white/60 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-[var(--color-primary)]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Store Hours</h3>
              </div>
              <div className="space-y-4">
                {hours.map((schedule) => (
                  <div
                    key={schedule.day}
                    className="flex justify-between items-center border-b border-slate-200/60 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-slate-600 font-medium">{schedule.day}</span>
                    <span className="text-slate-900 font-bold">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Container */}
            <div className="bg-slate-100 rounded-[28px] overflow-hidden h-96 w-full shadow-lg border border-white/50">
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

            {/* Directions Tip */}
            <div className="bg-blue-50/80 border border-blue-100/50 rounded-2xl p-6 text-center">
              <p className="text-sm text-blue-900 font-medium">
                📍 We are located in the Gristmill Village plaza, next to Pub Frato and close to
                I-90.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
