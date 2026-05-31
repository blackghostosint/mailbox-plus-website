import React from 'react';
import { motion } from 'framer-motion';
import Clock from '~icons/lucide/clock';
import MapPin from '~icons/lucide/map-pin';
import Phone from '~icons/lucide/phone';
import Calendar from '~icons/lucide/calendar';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/ui';
import { getGoogleMapsLink } from '../utils/location';

export const StoreHours: React.FC = () => {
  const hours = [
    { day: 'Monday', time: '9:00 AM - 6:00 PM', isToday: false },
    { day: 'Tuesday', time: '9:00 AM - 6:00 PM', isToday: false },
    { day: 'Wednesday', time: '9:00 AM - 6:00 PM', isToday: false },
    { day: 'Thursday', time: '9:00 AM - 6:00 PM', isToday: false },
    { day: 'Friday', time: '9:00 AM - 6:00 PM', isToday: false },
    { day: 'Saturday', time: '9:00 AM - 2:00 PM', isToday: false },
    { day: 'Sunday', time: 'Closed', isToday: false },
  ];

  const holidays = [
    { name: 'New Year&apos;s Day', date: 'January 1', status: 'Closed' },
    { name: 'Memorial Day', date: 'Last Monday in May', status: 'Closed' },
    { name: 'Independence Day', date: 'July 4', status: 'Closed' },
    { name: 'Labor Day', date: 'First Monday in September', status: 'Closed' },
    { name: 'Thanksgiving', date: 'Fourth Thursday in November', status: 'Closed' },
    { name: 'Christmas Day', date: 'December 25', status: 'Closed' },
  ];

  return (
    <div className="bg-white">
      <section className="relative bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-6"
            >
              Store <span className="text-[var(--color-primary)]">Hours</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[var(--color-text-secondary)] mb-8 leading-relaxed"
            >
              Visit us during our convenient business hours. We&apos;re here to help with all your
              shipping, printing, and business service needs.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Store Hours */}
      <section className="py-20 bg-[var(--color-bg-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <div className="flex items-center mb-8">
              <Clock className="w-8 h-8 text-[var(--color-primary)] mr-4" />
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Regular Hours</h2>
            </div>

            <div className="space-y-4">
              {hours.map((schedule, index) => (
                <motion.div
                  key={schedule.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex justify-between items-center p-4 rounded-xl ${
                    schedule.isToday
                      ? 'bg-[var(--color-bg-blue-tint)] border-2 border-[var(--color-primary)]'
                      : 'bg-gray-50'
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      schedule.isToday
                        ? 'text-[var(--color-primary)]'
                        : 'text-[var(--color-text-primary)]'
                    }`}
                  >
                    {schedule.day}
                    {schedule.isToday && <span className="ml-2 text-sm">(Today)</span>}
                  </span>
                  <span
                    className={`font-bold ${
                      schedule.time === 'Closed'
                        ? 'text-red-600'
                        : 'text-[var(--color-text-primary)]'
                    }`}
                  >
                    {schedule.time}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-[var(--color-bg-cyan-tint)] rounded-xl">
              <p className="text-[var(--color-primary)] font-medium text-center">
                📞 Call ahead during holiday seasons as hours may vary
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center"
            >
              <div className="w-16 h-16 bg-[var(--color-bg-blue-tint)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                Call Us
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-4">{siteConfig.contact.phone}</p>
              <a href={`tel:${siteConfig.contact.phone}`}>
                <Button variant="link" className="text-sm">
                  Call Now →
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center"
            >
              <div className="w-16 h-16 bg-[var(--color-bg-blue-tint)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                Visit Us
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                {siteConfig.contact.address.street}
                <br />
                {siteConfig.contact.address.city}, {siteConfig.contact.address.state}{' '}
                {siteConfig.contact.address.zip}
              </p>
              <a
                href={getGoogleMapsLink('directions', siteConfig.name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="link" className="text-sm min-w-[48px] min-h-[48px]">
                  Get Directions →
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center"
            >
              <div className="w-16 h-16 bg-[var(--color-bg-blue-tint)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                Plan Your Visit
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Extended hours Monday through Friday
                <br />
                Saturday morning availability
              </p>
              <Button variant="link" className="text-sm">
                Contact Us →
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Holiday Hours */}
      <section className="py-20 bg-[var(--color-bg-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">
              Holiday Hours
            </h2>
            <p className="text-[var(--color-text-secondary)] text-center mb-8">
              We observe the following holidays. Please plan accordingly.
            </p>

            <div className="space-y-3">
              {holidays.map((holiday, index) => (
                <motion.div
                  key={holiday.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {holiday.name}
                    </span>
                    <span className="text-[var(--color-text-secondary)] ml-2">
                      ({holiday.date})
                    </span>
                  </div>
                  <span className="font-bold text-red-600">{holiday.status}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
