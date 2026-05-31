import React, { useState, useMemo } from 'react';
import { InternalLink } from '../components/ui/InternalLink';
import { motion } from 'framer-motion';
import Search from '~icons/lucide/search';
import Truck from '~icons/lucide/truck';
import ExternalLink from '~icons/lucide/external-link';
import PackageCheck from '~icons/lucide/package-check';
import AlertCircle from '~icons/lucide/alert-circle';
import Bell from '~icons/lucide/bell';
import { Button } from '../components/ui';
import { siteConfig } from '../config/siteConfig';
import { getServiceImageUrl } from '../lib/storage';
import { getTrackingSchema } from '../utils/schema';
import { SmartImage } from '../components/SmartImage';

// Utility to safely stringify JSON for <script>
const toJsonLd = (obj: unknown) => JSON.stringify(obj, null, 2);

// V2 Animation Constants
const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: 'easeOut' as const },
};

export const Tracking: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('FedEx');

  // ✅ Carrier templates
  const carriers = useMemo(
    () => [
      {
        name: 'FedEx',
        urlTemplate: 'https://www.fedex.com/fedextrack/?tracknumbers=TRACKINGNUMBER',
      },
      {
        name: 'UPS',
        urlTemplate: 'https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=TRACKINGNUMBER',
      },
      {
        name: 'USPS',
        urlTemplate: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=TRACKINGNUMBER',
      },
      {
        name: 'DHL',
        urlTemplate:
          'https://www.dhl.com/us-en/home/tracking/tracking-express.html?tracking-id=TRACKINGNUMBER',
      },
    ],
    []
  );

  // ✅ Detect carrier by number format
  const detectCarrier = (num: string): string | null => {
    const trimmed = num.trim().toUpperCase();
    if (/^1Z[0-9A-Z]{16}$/.test(trimmed)) return 'UPS'; // UPS
    if (/^[0-9]{12}$|^[0-9]{15}$|^[0-9]{20}$|^[0-9]{22}$/.test(trimmed)) return 'FedEx'; // FedEx
    if (/^[0-9]{20,22}$/.test(trimmed) || /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/.test(trimmed)) return 'USPS'; // USPS
    if (/^[0-9]{10}$/.test(trimmed) || /^JD[0-9]+$/.test(trimmed)) return 'DHL'; // DHL
    return null;
  };

  // ✅ Handle submit
  const handleTrackingSubmit = () => {
    if (!trackingNumber.trim()) return;
    const carrierName = detectCarrier(trackingNumber) || selectedCarrier;
    const carrier = carriers.find((c) => c.name === carrierName);
    if (carrier) {
      const finalUrl = carrier.urlTemplate.replace(
        'TRACKINGNUMBER',
        encodeURIComponent(trackingNumber)
      );
      window.open(finalUrl, '_blank');
    }
  };

  // ✅ JSON-LD schema (ParcelDelivery only, LocalBusiness is global)
  const jsonLd = useMemo(() => {
    if (!trackingNumber) return [];

    const carrierName = detectCarrier(trackingNumber) || selectedCarrier;
    const carrier = carriers.find((c) => c.name === carrierName);
    const trackingUrl = carrier?.urlTemplate.replace(
      'TRACKINGNUMBER',
      encodeURIComponent(trackingNumber)
    );

    const trackingSchema = getTrackingSchema(
      siteConfig,
      trackingNumber,
      carrierName,
      trackingUrl || ''
    );

    return [trackingSchema];
  }, [trackingNumber, selectedCarrier, carriers]);

  // ✅ Tracking tips
  const trackingTips = [
    {
      title: 'Keep Your Receipt',
      description: 'Your tracking number is on your shipping receipt. Keep it safe until delivery.',
      icon: PackageCheck,
    },
    {
      title: 'Check Multiple Times',
      description: 'Tracking information updates throughout the day as your package moves.',
      icon: Truck,
    },
    {
      title: 'Delivery Notifications',
      description: 'Sign up for text or email notifications to stay updated on delivery status.',
      icon: Bell,
    },
    {
      title: 'Need Help?',
      description: "Can't find your package? Contact us and we'll help track it down.",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ✅ Inject LocalBusiness + ParcelDelivery schema */}
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }} />
      )}

      {/* ====================== HERO (V2 Standard) ======================= */}
      <section className="relative overflow-hidden">
        {/* V2 Gradient: var(--color-gradient-start) → var(--color-accent) → var(--color-gradient-mid) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-start)] via-[var(--color-accent)] to-[var(--color-gradient-mid)]" />

        {/* Hero Image with Soft Blend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <SmartImage
            priority
            src={getServiceImageUrl('/images/tracking.webp')}
            alt="Background pattern"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </motion.div>

        {/* Soft Fade Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-slate-50 z-10" />

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-44 lg:pt-32 lg:pb-52 text-center max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            Track Your <span className="text-blue-200">Package</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl text-blue-100 mb-8 leading-relaxed"
          >
            Enter your tracking number and get real-time updates.
          </motion.p>
        </div>
      </section>

      {/* ====================== MAIN CONTENT ======================= */}
      <main className="relative z-20 -mt-20 container mx-auto px-4 pb-20 space-y-20">
        {/* Tracking Form Glass Panel */}
        <motion.div {...reveal} className="max-w-3xl mx-auto">
          <div className="relative rounded-[28px] bg-white/70 backdrop-blur-xl border border-white/70 shadow-[0_18px_45px_rgba(var(--color-overlay),0.15)] p-8 md:p-10">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-4 shadow-sm text-[var(--color-primary)]">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Enter Tracking Number</h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTrackingSubmit();
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tracking Number Input */}
                <div className="md:col-span-2 space-y-2">
                  <label
                    htmlFor="tracking"
                    className="block text-sm font-semibold text-slate-700 ml-1"
                  >
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTrackingNumber(value);
                      const detected = detectCarrier(value);
                      if (detected) setSelectedCarrier(detected);
                    }}
                    aria-label="Tracking number"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-border-blue)] focus:outline-none transition-all shadow-sm text-lg"
                    placeholder="e.g., 1Z999AA1234567890"
                  />
                </div>

                {/* Carrier Dropdown */}
                <div className="space-y-2">
                  <label
                    htmlFor="carrier"
                    className="block text-sm font-semibold text-slate-700 ml-1"
                  >
                    Carrier
                  </label>
                  <div className="relative">
                    <select
                      id="carrier"
                      value={selectedCarrier}
                      onChange={(e) => setSelectedCarrier(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-border-blue)] focus:outline-none transition-all shadow-sm text-lg appearance-none cursor-pointer"
                    >
                      {carriers.map((carrier) => (
                        <option key={carrier.name} value={carrier.name}>
                          {carrier.name}
                        </option>
                      ))}
                    </select>
                    {/* Custom Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg
                        className="h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto px-8 py-4 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-deep)] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all rounded-xl font-bold flex items-center justify-center"
                >
                  Track Package
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Tracking Tips Grid */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Tracking Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trackingTips.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/60 backdrop-blur-md rounded-[24px] p-6 border border-white/50 shadow-sm hover:shadow-[0_10px_30px_rgba(var(--color-shadow),0.08)] transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-50/80 rounded-2xl flex items-center justify-center mb-4 text-[var(--color-primary)] shadow-inner">
                  <tip.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{tip.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Help Section - Glass Gradient Panel */}
        <motion.section {...reveal} className="max-w-5xl mx-auto">
          <div className="relative rounded-[30px] overflow-hidden shadow-[0_26px_65px_rgba(var(--color-overlay),0.25)]">
            {/* V2 Gradient Shell */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-start)] via-[var(--color-accent-light)] to-[var(--color-gradient-mid)]" />

            <div className="relative z-10 px-8 py-16 text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Need Help Finding Your Package?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Can&apos;t locate your tracking number or having trouble with tracking? Our team is
                here to help you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <InternalLink to="/contact-us">
                  <Button
                    size="lg"
                    className="bg-white text-[var(--color-primary)] hover:bg-blue-50 border-none font-bold px-8 shadow-lg"
                  >
                    Contact Support
                  </Button>
                </InternalLink>
                <a href={`tel:${siteConfig.contact.phone}`}>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/10 border border-white/30"
                  >
                    Call {siteConfig.contact.phone}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};
