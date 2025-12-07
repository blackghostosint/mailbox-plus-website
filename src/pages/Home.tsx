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
import { Meta } from "../components/Meta";
import { SmartImage } from "../components/SmartImage";
import { getServiceImageUrl } from "../lib/storage";
import { pageMeta } from "../config/pageMeta";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  // Detect reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  const { title, description, schema } = pageMeta['/'];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Meta title={title} description={description} schema={schema} />

      {/* ====================== HERO SECTION (V2 Standard) ======================= */}
      <section className="relative bg-center py-32 lg:py-48 overflow-hidden min-h-[80vh]">
        {/* Background Image with V2 Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          <SmartImage
            priority
            sources={[
              {
                srcSet: getServiceImageUrl("mailbox_plus_storefront_hero_image_mobile.webp"),
                media: "(max-width: 768px)",
                type: "image/webp"
              },
              {
                srcSet: getServiceImageUrl("mailbox_plus_storefront_hero_image.webp"),
                media: "(min-width: 769px)",
                type: "image/webp"
              }
            ]}
            src={getServiceImageUrl("mailbox_plus_storefront_hero_image.webp")}
            alt="Mailbox Plus storefront in Concord Township, Ohio"
            className="w-full h-full object-cover mix-blend-soft-light opacity-90 blur-[1px] scale-105"
            style={{ objectPosition: 'center' }}
          />
          {/* V2 Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B4BB6] via-[#1A6DFF] to-[#021B4A] opacity-90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#02152F]/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-sm"
          >
            Pack & Ship in{" "}
            <span className="text-blue-200">Concord Twp, Ohio</span>
          </motion.h1>

          {/* Rotating service tagline */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            className="h-16 mb-8"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentServiceIndex}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
                className="text-xl md:text-2xl text-blue-50 leading-relaxed font-medium"
              >
                {serviceCategories[currentServiceIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Your trusted local partner for shipping, printing, and business
            services. Serving Lake County communities with integrity and care.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-white text-[#0855B1] hover:bg-blue-50 font-bold shadow-lg border-none"
              onClick={() => navigate('/services')}
            >
              View Services <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            {/* Directions Button */}
            <a
              href={getGoogleMapsLink("directions", siteConfig.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#0855B1] text-white hover:bg-[#064080] border border-blue-400/30 shadow-lg min-w-[48px] min-h-[48px]">
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
              <Button variant="ghost" className="text-white border border-white/40 hover:bg-white/10 min-w-[48px] min-h-[48px]">
                <MapPin className="w-5 h-5 mr-2" />
                View on Map
              </Button>
            </a>
          </div>
        </div>

        {/* Soft fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-slate-50"></div>
      </section>

      {/* ====================== VISIT US SECTION (V2 Gradient) ======================= */}
      <section className="py-20 bg-gradient-to-br from-[#0B4BB6] via-[#1A6DFF] to-[#021B4A]">
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
              <Button className="bg-white !text-[#0855B1] hover:bg-gray-100 hover:!text-[#064080] min-w-[48px] min-h-[48px]">
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
              <Button variant="ghost" className="text-white border border-white/40 hover:bg-white/10 min-w-[48px] min-h-[48px]">
                <MapPin className="w-5 h-5 mr-2" />
                View on Map
              </Button>
            </a>

            {/* Call Button */}
            <a href={`tel:${siteConfig.contact.phone}`}>
              <Button className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10">
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

      {/* ====================== SERVICE AREA SECTION ======================= */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
            Service Areas
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            {localAreas.map((area) => {
              // turn "Concord Township" → "concord-township"
              const slug = area.toLowerCase().replace(/\s+/g, "-");
              return (
                <Button
                  key={area}
                  variant="secondary" // outlined style
                  size="sm"
                  className="!rounded-full border-blue-200 bg-white text-blue-900 hover:bg-blue-50"
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
