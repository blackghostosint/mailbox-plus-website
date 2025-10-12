import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import { Button } from "../components/ui";
import { siteConfig } from "../config/siteConfig";
import { CarrierLogos } from "../components/CarrierLogos";
import { getGoogleMapsLink } from "../utils/location";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  const serviceCategories = [
    "Pack & Ship Services",
    "Professional Printing",
    "Mailbox Rentals",
    "Document Services",
    "Notary Services",
    "Digital Fingerprinting",
    "Fax & Scan Services",
    "Packaging Supplies",
    "Business Services",
    "Shredding Services",
    "Package Receiving",
    "Copy Services",
    "Drop-off Services",
  ];

  const localAreas = [
    "Concord Township",
    "Mentor",
    "Painesville",
    "Eastlake",
    "Willoughby",
    "Wickliffe",
    "Madison",
    "Perry",
    "Kirtland",
    "Chardon",
    "Fairport Harbor",
    "Geneva",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex(
        (prev) => (prev + 1) % serviceCategories.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [serviceCategories.length]);

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section
        className="relative bg-cover bg-center py-32 lg:py-48"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/mailbox_plus_storefront_hero_image.jpg')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            Pack & Ship in{" "}
            <span className="text-[#60A5FA]">Concord Twp, Ohio</span>
          </motion.h1>

          {/* Rotating service tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-16 mb-8"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentServiceIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-xl md:text-2xl text-gray-100 leading-relaxed"
              >
                {serviceCategories[currentServiceIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
            Your trusted local partner for shipping, printing, and business
            services. Serving Lake County communities with integrity and care.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-[#0855B1] hover:bg-[#064080] text-white"
              onClick={() => navigate('/services')}
            >
              View Services <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <a
              href={getGoogleMapsLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-white !text-[#0855B1] hover:bg-gray-100 hover:!text-[#064080]">
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* VISIT US SECTION */}
      <section className="py-20 bg-gradient-to-br from-[#0855B1] to-[#064080]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Visit Us in Concord Township Today
          </h2>
          <p className="text-xl text-blue-100 mb-3 max-w-3xl mx-auto">
            Next to Pub Frato in Gristmill Village — serving all of Lake County
          </p>
          <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto">
            Stop by for all your shipping, printing, and business service needs.
            Our friendly team is ready to help!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* Directions Button */}
            <a
              href={getGoogleMapsLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-white !text-[#0855B1] hover:bg-gray-100 hover:!text-[#064080]">
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>

            {/* Call Button */}
            <a href={`tel:${siteConfig.contact.phone}`}>
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:!text-[#0855B1]">
                <Phone className="w-5 h-5 mr-2" />
                Call {siteConfig.contact.phone}
              </Button>
            </a>
          </div>

          {/* Hours */}
          <div className="flex items-center justify-center gap-2 text-blue-100">
            <Clock className="w-5 h-5" />
            <span className="text-sm">
              Mon-Fri: 9AM-6PM | Sat: 9AM-2PM | Sun: Closed
            </span>
          </div>

          {/* Carrier Logos */}
          <CarrierLogos />
        </div>
      </section>

      {/* SERVICE AREA SECTION */}
      <section className="py-16 bg-[#F9FAFB] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-10">
            Service Areas
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            {localAreas.map((area) => {
              // turn "Concord Township" → "concord-township"
              const slug = area.toLowerCase().replace(/\s+/g, "-");
              return (
                <Button
                  key={area}
                  variant="secondary" // outlined style, or "primary" if you want solid blue
                  size="sm"
                  className="!rounded-full"
                  onClick={() => navigate(`/service-area/${slug}`)}
                >
                  {area}
                </Button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
