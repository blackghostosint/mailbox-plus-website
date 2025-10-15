import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Phone, Clock, ChevronUp } from "lucide-react";
import { Button } from "../components/ui";
import { siteConfig } from "../config/siteConfig";
import { services } from "../config/services";
import { getGoogleMapsLink } from "../utils/location";

// Utility to generate safe IDs
const makeId = (str: string) =>
  str.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");

// Map display category → actual service.category value (from services.ts)
const categoryMap: Record<string, string> = {
  "Pack & Ship Services": "pack-ship",
  "Professional Printing": "copy-print",
  "Mailbox Rentals": "mailbox-rentals",
  "Document Services": "document-services",
  "Additional Services": "additional-services",
};

export const Services: React.FC = () => {
  console.log('Services.tsx: Services component rendering');
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [showTopButton, setShowTopButton] = useState(false);

  const serviceCategories = [
    "Pack & Ship Services",
    "Professional Printing",
    "Mailbox Rentals",
    "Document Services",
    "Additional Services",
  ];

  // Rotate the tagline in hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % serviceCategories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [serviceCategories.length]);

  // Toggle the Back to Top button
  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section
        className="relative bg-cover bg-center py-32 lg:py-48"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/mailbox_plus_storefront_hero_image.webp')",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            Explore Our <span className="text-[#60A5FA]">Services</span>
          </motion.h1>

          {/* Rotating tagline */}
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#categories">
              <Button className="bg-[#0855B1] hover:bg-[#064080] text-white">
                View Categories <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            {/* Directions Button */}
            <a
              href={getGoogleMapsLink("directions", siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-white !text-[#0855B1] hover:bg-gray-100 hover:!text-[#064080]">
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>
            {/* View on Map Button */}
            <a
              href={getGoogleMapsLink("view", siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" className="text-white border border-white hover:bg-[#0855B1]/10">
                <MapPin className="w-5 h-5 mr-2" />
                View on Map
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORY NAVIGATION */}
      <section id="categories" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Explore Our Services</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {serviceCategories.map((category) => (
              <a
                key={category}
                href={`#${makeId(category)}`}
                className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#0855B1] hover:text-[#0855B1] transition"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE SECTIONS (cards auto-pulled from services.ts) */}
      {serviceCategories.map((category) => (
        <section
          key={category}
          id={makeId(category)}
          className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl font-bold mb-8">{category}</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services
              .filter((s) => s.category === categoryMap[category])
              .map((service) => (
                <div
                  key={service.id}
                  className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition flex flex-col"
                >
                  {/* Thumbnail with fade overlay + subtle zoom */}
                  {service.heroImage ? (
                    <div className="relative w-full aspect-[3/2] mb-4 overflow-hidden rounded-md group">
                      <img
                        src={service.heroImage}
                        alt={service.serviceName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  ) : service.icon ? (
                    <div className="w-full aspect-[3/2] flex items-center justify-center mb-4 bg-gray-50 rounded-md group relative overflow-hidden">
                      <service.icon className="w-12 h-12 text-[#0855B1] transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  ) : (
                    <div className="w-full aspect-[3/2] mb-4 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-lg font-bold group relative overflow-hidden">
                      ?
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}

                  <h3 className="text-xl font-semibold mb-2">
                    {service.serviceName}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {service.metaDescription}
                  </p>
                  <Link to={service.slug}>
                    <Button className="bg-[#0855B1] text-white hover:bg-[#064080]">
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
          </div>
        </section>
      ))}

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
              href={getGoogleMapsLink("directions", siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-white !text-[#0855B1] hover:bg-gray-100 hover:!text-[#064080]">
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>
            {/* View on Map Button */}
            <a
              href={getGoogleMapsLink("view", siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" className="text-white border border-white hover:bg-[#0855B1]/10">
                <MapPin className="w-5 h-5 mr-2" />
                View on Map
              </Button>
            </a>
            <a href={`tel:${siteConfig.contact.phone}`}>
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0855B1]">
                <Phone className="w-5 h-5 mr-2" />
                Call {siteConfig.contact.phone}
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-blue-100">
            <Clock className="w-5 h-5" />
            <span className="text-sm">
              Mon-Fri: 9AM-6PM | Sat: 9AM-2PM | Sun: Closed
            </span>
          </div>
        </div>
      </section>

      {/* BACK TO TOP BUTTON */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#0855B1] text-white p-3 rounded-full shadow-lg hover:bg-[#064080] transition"
          aria-label="Back to Top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
