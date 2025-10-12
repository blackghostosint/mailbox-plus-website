import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/ui';
import { getGoogleMapsLink } from '../utils/location';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/.netlify/functions/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", phone: "", service: "", message: "" });
      } else {
        alert("⚠️ Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Unable to send message. Please check your connection.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: siteConfig.contact.phone,
      action: `tel:${siteConfig.contact.phone}`,
      actionText: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email',
      details: siteConfig.contact.email,
      action: `mailto:${siteConfig.contact.email}`,
      actionText: 'Send Email'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: `${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.state} ${siteConfig.contact.address.zip}`,
      action: getGoogleMapsLink(),
      actionText: 'Get Directions'
    }
  ];

  const hours = [
    { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 2:00 PM' },
    { day: 'Sunday', time: 'Closed' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-6"
            >
              Get in{' '}
              <span className="text-[#0855B1]">Touch</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[#4B5563] mb-8 leading-relaxed"
            >
              Visit our store in Concord Twp., or contact us today. We're here to help 
              with all your shipping, printing, and business service needs.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm text-center"
              >
                <div className="w-16 h-16 bg-[#F0F7FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <info.icon className="w-8 h-8 text-[#0855B1]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-3">
                  {info.title}
                </h3>
                <p className="text-[#4B5563] mb-4 leading-relaxed">
                  {info.details}
                </p>
                <a 
                  href={info.action}
                  target={info.title === 'Address' ? '_blank' : undefined}
                  rel={info.title === 'Address' ? 'noopener noreferrer' : undefined}
                >
                  <Button variant="link" className="text-sm">
                    {info.actionText} →
                  </Button>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Hours */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[#111827] mb-6">
                Send Us a Message
              </h2>
              <p className="text-[#4B5563] mb-8 leading-relaxed">
                Have a question about our services or need a custom quote? 
                Fill out the form below and we'll get back to you promptly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0855B1] focus:ring-2 focus:ring-[#B2D3EB] focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0855B1] focus:ring-2 focus:ring-[#B2D3EB] focus:outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#111827] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0855B1] focus:ring-2 focus:ring-[#B2D3EB] focus:outline-none transition-colors"
                      placeholder="(440) 555-0123"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-[#111827] mb-2">
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0855B1] focus:ring-2 focus:ring-[#B2D3EB] focus:outline-none transition-colors"
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

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#111827] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0855B1] focus:ring-2 focus:ring-[#B2D3EB] focus:outline-none transition-colors resize-vertical"
                    placeholder="Tell us about your needs or ask any questions..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full group">
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Store Hours & Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Store Hours */}
              <div className="bg-[#F9FAFB] rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <Clock className="w-6 h-6 text-[#0855B1] mr-3" />
                  <h3 className="text-xl font-semibold text-[#111827]">Store Hours</h3>
                </div>
                <div className="space-y-3">
                  {hours.map((schedule) => (
                    <div key={schedule.day} className="flex justify-between items-center">
                      <span className="text-[#4B5563] font-medium">{schedule.day}</span>
                      <span className="text-[#111827] font-semibold">{schedule.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-[#E0F2FE] rounded-xl">
                  <p className="text-sm text-[#0855B1] font-medium">
                    📦 Holiday hours may vary. Call ahead during holiday seasons.
                  </p>
                </div>
              </div>

              {/* Map */}
              <div className="bg-gray-100 rounded-2xl overflow-hidden h-80 w-full">
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

              {/* Directions */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="font-semibold text-[#111827] mb-3">Getting Here</h4>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  We're conveniently located nextdoor to Pub Frato, just minutes from I-90 and OH-44. 
                  Plenty of free parking available. Look for our red Mailbox Plus sign!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};