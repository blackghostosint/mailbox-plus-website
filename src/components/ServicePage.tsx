import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// ✅ Barrel imports
import { Meta, Breadcrumbs, JsonLd, VisitUsButton } from "../components";
import { CarrierLogos } from "./CarrierLogos";
import { CompetitorAlternativeSection } from "./sections/CompetitorAlternative";
import { Service } from "../types/services";
import { siteConfig } from "../config/siteConfig";
import { getWebPageSchema, getServiceSchema, getFAQSchema } from "../utils/schema";
import { services } from "../config/services";
import { getGoogleMapsLink } from "../utils/location";

// ✅ Shadcn UI
import { SmartImage } from "./SmartImage";

// ... (rest of the file is the same until the hero section)

      {/* ✅ Hero Section */}
      <section className="relative bg-[#0855B1] py-16 lg:py-24 text-center overflow-hidden">
        {heroImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <SmartImage
              priority
              src={heroImage}
              alt={heroTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        )}

