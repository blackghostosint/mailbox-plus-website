import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Truck, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui';
import { getServiceImageUrl } from "../lib/supabase";

// ✅ Utility to safely stringify JSON for <script>
const toJsonLd = (obj: any) => JSON.stringify(obj, null, 2);

export const Tracking: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('FedEx');

  const carriers = [
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
      urlTemplate: 'https://www.dhl.com/us-en/home/tracking/tracking-express.html?tracking-id=TRACKINGNUMBER',
    },
  ];

  const detectCarrier = (num: string): string | null => {
    const trimmed = num.trim().toUpperCase();
    if (/^1Z[0-9A-Z]{16}$/.test(trimmed)) return 'UPS';
    if (/^[0-9]{12}$|^[0-9]{15}$|^[0-9]{20}$|^[0-9]{22}$/.test(trimmed)) return 'FedEx';
    if (/^[0-9]{20,22}$/.test(trimmed) || /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/.test(trimmed)) return 'USPS';
    if (/^[0-9]{10}$/.test(trimmed) || /^JD[0-9]+$/.test(trimmed)) return 'DHL';
    return null;
  };

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

  // ✅ JSON-LD schema (updates with tracking number)
  const jsonLd = useMemo(() => {
    if (!trackingNumber) return null;

    const carrierName = detectCarrier(trackingNumber) || selectedCarrier;
    return {
      "@context": "https://schema.org",
      "@type": "ParcelDelivery",
      "trackingNumber": trackingNumber,
      "provider": {
        "@type": "Organization",
        "name": carrierName
      },
      "trackingUrl": carriers.find((c) => c.name === carrierName)?.urlTemplate.replace(
        'TRACKINGNUMBER',
        encodeURIComponent(trackingNumber)
      ),
      "deliveryAddress": {
        "@type": "PostalAddress",
        "addressLocality": "Concord Township",
        "addressRegion": "OH",
        "addressCountry": "US"
      }
    };
  }, [trackingNumber, selectedCarrier]);

  const trackingTips = [
    { title: 'Keep Your Receipt', description: 'Your tracking number is on your shipping receipt. Keep it safe until delivery.' },
    { title: 'Check Multiple Times', description: 'Tracking information updates throughout the day as your package moves.' },
    { title: 'Delivery Notifications', description: 'Sign up for text or email notifications to stay updated on delivery status.' },
    { title: 'Need Help?', description: "Can't find your package? Contact us and we'll help track it down." },
  ];

  return (
    <div className="bg-white">
      {/* Inject JSON-LD if tracking number entered */}
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }} />
      )}

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full">
          <img
            src={getServiceImageUrl("/images/tracking.jpg")}
            alt="Tracking hero"
            className="absolute inset-0 w-full h-full object-cover rounded-b-2xl"
          />
          <div className="absolute inset-0 bg-black/40 rounded-b-2xl flex items-center justify-center text-center px-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold text-white mb-4"
              >
                Track Your <span className="text-[#B2D3EB]">Package</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
              >
                Enter your tracking number and get real-time updates.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* --- rest of your sections unchanged --- */}
      {/* Form, Tips, Help Section... */}
    </div>
  );
};
