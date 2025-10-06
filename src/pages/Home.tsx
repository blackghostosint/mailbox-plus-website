import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Shield,
  Truck,
  Users,
} from "lucide-react";
import { Button } from "../components/ui";
import { siteConfig } from "../config/siteConfig";
import { services } from "../config/services";

export const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  const serviceCategories = [
    "Pack & Ship Services",
    "Professional Printing",
    "Mailbox Rentals",
    "Document Services",
    "Notary Services",
    "Digital Fingerprinting",
  ];

  const featuredServices = [
    services.find((s) => s.id === "mailbox-rental"),
    services.find((s) => s.id === "golf-club-shipping"),
    services.find((s) => s.id === "package-receiving"),
    services.find((s) => s.id === "package-drop-offs"),
    services.find((s) => s.id === "business-cards"),
    services.find((s) => s.id === "digital-fingerprinting"),
  ].filter(Boolean);

  const communityStories = [
    {
      id: 1,
      title: "Local Artist Ships Nationwide",
      description:
        "We helped a Concord Township artist safely ship their artwork collection to a New York gallery opening.",
      location: "Concord Township",
      icon: "🎨",
    },
    {
      id: 2,
      title: "Business Saves on Bulk Mailings",
      description:
        "A Mentor small business saved over $200 using our Every Door Direct Mail service to reach local customers.",
      location: "Mentor",
      icon: "💼",
    },
    {
      id: 3,
      title: "Secure Mailbox for Remote Workers",
      description:
        "Lake County residents working remotely trust our mailbox service for professional business addresses.",
      location: "Lake County",
      icon: "📮",
    },
    {
      id: 4,
      title: "Tournament-Ready Golf Clubs",
      description:
        "We pack and ship golf clubs for Painesville golfers traveling to tournaments across the country.",
      location: "Painesville",
      icon: "⛳",
    },
  ];

  const carriers = [
    {
      name: "FedEx",
      logo: "https://i.pinimg.com/736x/ca/81/86/ca8186c25901c848871ef27d1e28bb72.jpg",
    },
    {
      name: "UPS",
      logo: "https://www.citypng.com/public/uploads/preview/ups-black-logo-symbol-icon-hd-png-701751694777657xrnxzhkkat.png",
    },
    {
      name: "USPS",
      logo: "https://p7.hiclipart.com/preview/644/958/344/united-states-postal-service-mail-logo-united-states.jpg",
    },
    {
      name: "DHL",
      logo: "https://www.citypng.com/public/uploads/preview/hd-black-dhl-express-company-logo-transparent-background-701751694777679wwnbtwgoa8.png",
    },
  ];

  const whyChooseUs = [
    {
      icon: Clock,
      title: "Fast & Reliable Service",
      description:
        "Quick turnaround times on all services with multiple speed options",
    },
    {
      icon: Shield,
      title: "Secure & Insured",
      description:
        "Marsh insurance coverage and professional handling for peace of mind",
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Locally owned and operated, serving Lake County since 2010",
    },
    {
      icon: Truck,
      title: "All Major Carriers",
      description: "FedEx, UPS, USPS, and DHL all in one convenient location",
    },
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
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex(
        (prev) => (prev + 1) % serviceCategories.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [serviceCategories.length]);

  const nextStory = () => {
    setCurrentSlide((prev) => (prev + 1) % communityStories.length);
  };

  const prevStory = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + communityStories.length) % communityStories.length
    );
  };

  const packShipService = services.find((s) => s.id === "pack-ship");
  const topFaqs = packShipService?.faqs?.slice(0, 3) || [];

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
            <a href="#services">
              <Button className="bg-[#0855B1] hover:bg-[#064080] text-white">
                View Services <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${siteConfig.geo.lat},${siteConfig.geo.lng}`}
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

      {/* ... keep the Featured Services, Carriers, Local Areas, FAQs, Community Stories, and Why Choose Us sections the same ... */}

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
              href={`https://www.google.com/maps/dir/?api=1&destination=${siteConfig.geo.lat},${siteConfig.geo.lng}`}
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
          <div className="flex items-center justify-center gap-12 mt-10">
            <img
              src="https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/fedex-logo.jpg"
              alt="FedEx"
              className="h-20 w-auto object-contain drop-shadow-md"
              loading="lazy"
            />
            <img
              src="https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/ups-logo.jpg"
              alt="UPS"
              className="h-20 w-auto object-contain drop-shadow-md"
              loading="lazy"
            />
            <img
              src="https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/usps-logo.jpg"
              alt="USPS"
              className="h-20 w-auto object-contain drop-shadow-md"
              loading="lazy"
            />
            <img
              src="https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/dhl-logo.jpg"
              alt="DHL"
              className="h-20 w-auto object-contain drop-shadow-md"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
