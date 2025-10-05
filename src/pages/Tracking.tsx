import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui';

export const Tracking: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');

  const carriers = [
    {
      name: 'FedEx',
      logo: 'https://i.pinimg.com/736x/ca/81/86/ca8186c25901c848871ef27d1e28bb72.jpg',
      urlTemplate: 'https://www.fedex.com/fedextrack/?tracknumbers=TRACKINGNUMBER',
      description: 'Track FedEx Express, Ground, and Home Delivery packages'
    },
    {
      name: 'UPS',
      logo: 'https://www.citypng.com/public/uploads/preview/ups-black-logo-symbol-icon-hd-png-701751694777657xrnxzhkkat.png',
      urlTemplate: 'https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=TRACKINGNUMBER',
      description: 'Track UPS Ground, Air, and International shipments'
    },
    {
      name: 'USPS',
      logo: 'https://p7.hiclipart.com/preview/644/958/344/united-states-postal-service-mail-logo-united-states.jpg',
      urlTemplate: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=TRACKINGNUMBER',
      description: 'Track Priority Mail, Express, and other USPS services'
    },
    {
      name: 'DHL',
      logo: 'https://www.citypng.com/public/uploads/preview/hd-black-dhl-express-company-logo-transparent-background-701751694777679wwnbtwgoa8.png',
      urlTemplate: 'https://www.dhl.com/us-en/home/tracking/tracking-express.html?tracking-id=TRACKINGNUMBER',
      description: 'Track DHL Express and international shipments'
    }
  ];

  const handleTrackingSubmit = (carrierUrlTemplate: string) => {
    if (trackingNumber.trim()) {
      const finalUrl = carrierUrlTemplate.replace(
        'TRACKINGNUMBER',
        encodeURIComponent(trackingNumber)
      );
      window.open(finalUrl, '_blank');
    }
  };

  const trackingTips = [
    {
      title: 'Keep Your Receipt',
      description: 'Your tracking number is on your shipping receipt. Keep it safe until delivery.'
    },
    {
      title: 'Check Multiple Times',
      description: 'Tracking information updates throughout the day as your package moves.'
    },
    {
      title: 'Delivery Notifications',
      description: 'Sign up for text or email notifications to stay updated on delivery status.'
    },
    {
      title: 'Need Help?',
      description: "Can't find your package? Contact us and we'll help track it down."
    }
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
              Track Your{' '}
              <span className="text-[#0855B1]">Package</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[#4B5563] mb-8 leading-relaxed"
            >
              Enter your tracking number below and select your carrier to get real-time 
              updates on your shipment's location and delivery status.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Tracking Input */}
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
                if (trackingNumber.trim() && carriers.length > 0) {
                  handleTrackingSubmit(carriers[0].urlTemplate); // Default = FedEx
                }
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="tracking" className="block text-sm font-medium text-[#111827] mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0855B1] focus:ring-2 focus:ring-[#B2D3EB] focus:outline-none transition-colors text-lg"
                  placeholder="Enter your tracking number (e.g., 1Z999AA1234567890)"
                />
              </div>
              <p className="text-sm text-[#4B5563]">
                Press Enter to open FedEx by default, or click your carrier below.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Carrier Selection */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Select Your Carrier
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              Click on your shipping carrier to track your package. Each carrier 
              has its own tracking system with detailed delivery information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {carriers.map((carrier, index) => (
              <motion.div
                key={carrier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 text-center group cursor-pointer"
                onClick={() => handleTrackingSubmit(carrier.urlTemplate)}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform border border-gray-200">
                  <img 
                    src={carrier.logo} 
                    alt={`${carrier.name} logo`}
                    className="w-12 h-8 object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#111827] mb-3">
                  {carrier.name}
                </h3>
                <p className="text-[#4B5563] mb-6 leading-relaxed text-sm">
                  {carrier.description}
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full group-hover:bg-[#0855B1] group-hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrackingSubmit(carrier.urlTemplate);
                  }}
                >
                  Track with {carrier.name}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking Tips */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Tracking Tips
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              Get the most out of package tracking with these helpful tips and best practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trackingTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="w-12 h-12 bg-[#F0F7FF] rounded-xl flex items-center justify-center mb-4">
                  <span className="text-[#0855B1] font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-3">
                  {tip.title}
                </h3>
                <p className="text-[#4B5563] leading-relaxed text-sm">
                  {tip.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-[#0855B1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Truck className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need Help Finding Your Package?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Can't locate your tracking number or having trouble with tracking? 
              Our team is here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-[#0855B1] hover:bg-gray-50"
              >
                Contact Support
              </Button>
              <Button 
                variant="link" 
                size="lg"
                className="text-white hover:text-blue-100"
              >
                Call (440) 709-1946
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
