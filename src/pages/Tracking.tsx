import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Truck, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui';

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

  // Auto-detect carrier from tracking number
  const detectCarrier = (num: string): string | null => {
    const trimmed = num.trim().toUpperCase();

    // UPS: starts with 1Z and has 18 characters
    if (/^1Z[0-9A-Z]{16}$/.test(trimmed)) return 'UPS';

    // FedEx: 12, 15, 20, or 22 numeric
    if (/^[0-9]{12}$|^[0-9]{15}$|^[0-9]{20}$|^[0-9]{22}$/.test(trimmed)) return 'FedEx';

    // USPS: 20–22 numeric OR 2 letters + 9 digits + 2 letters
    if (/^[0-9]{20,22}$/.test(trimmed) || /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/.test(trimmed)) return 'USPS';

    // DHL: 10 digits OR starts with JD
    if (/^[0-9]{10}$/.test(trimmed) || /^JD[0-9]+$/.test(trimmed)) return 'DHL';

    return null;
  };

  const handleTrackingSubmit = () => {
    if (!trackingNumber.trim()) return;

    const carrier = carriers.find((c) => c.name === selectedCarrier);
    if (carrier) {
      const finalUrl = carrier.urlTemplate.replace(
        'TRACKINGNUMBER',
        encodeURIComponent(trackingNumber)
      );
      window.open(finalUrl, '_blank');
    }
  };

  const trackingTips = [
    { title: 'Keep Your Receipt', description: 'Your tracking number is on your shipping receipt. Keep it safe until delivery.' },
    { title: 'Check Multiple Times', description: 'Tracking information updates throughout the day as your package moves.' },
    { title: 'Delivery Notifications', description: 'Sign up for text or email notifications to stay updated on delivery status.' },
    { title: 'Need Help?', description: "Can't find your package? Contact us and we'll help track it down." },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6"
          >
            Track Your <span className="text-[#0855B1]">Package</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-[#4B5563] max-w-2xl mx-auto"
          >
            Enter your tracking number and choose your carrier to get real-time updates.
          </motion.p>
        </div>
      </section>

      {/* Tracking Input with Dropdown */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <div className="flex items-center mb-6">
              <Search className="w-6 h-6 text-[#0855B1] mr-3" />
              <h2 className="text-2xl font-bold text-[#111827]">Enter Tracking Number</h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTrackingSubmit();
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* Tracking Number Input */}
                <div className="sm:col-span-2">
                  <label htmlFor="tracking" className="block text-sm font-medium text-[#111827] mb-2">
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0855B1] focus:ring-2 focus:ring-[#B2D3EB] focus:outline-none text-lg"
                    placeholder="Enter your tracking number (e.g., 1Z999AA1234567890)"
                  />
                </div>

                {/* Carrier Dropdown */}
                <div>
                  <label htmlFor="carrier" className="block text-sm font-medium text-[#111827] mb-2">
                    Carrier
                  </label>
                  <select
                    id="carrier"
                    value={selectedCarrier}
                    onChange={(e) => setSelectedCarrier(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0855B1] focus:ring-2 focus:ring-[#B2D3EB] text-lg"
                  >
                    {carriers.map((carrier) => (
                      <option key={carrier.name} value={carrier.name}>
                        {carrier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="bg-white text-[#0855B1] border border-[#0855B1] hover:bg-[#0855B1] hover:text-white hover:shadow-md transition-all"
                >
                  Track Package
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Tracking Tips */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            Tracking Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {trackingTips.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="w-12 h-12 bg-[#F0F7FF] rounded-xl flex items-center justify-center mb-4">
                  <span className="text-[#0855B1] font-bold text-lg">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">
                  {tip.title}
                </h3>
                <p className="text-[#4B5563] text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-[#0855B1] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Truck className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Help Finding Your Package?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Can't locate your tracking number or having trouble with tracking? 
            Our team is here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="bg-white text-[#0855B1] hover:bg-gray-50">
              Contact Support
            </Button>
            <Button variant="link" size="lg" className="text-white hover:text-blue-100">
              Call (440) 709-1946
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
