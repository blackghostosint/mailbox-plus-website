import React from "react";
import type { SVGProps } from "react";
import { FAQ } from "./faq";

// Icon component type compatible with both lucide-react and unplugin-icons
export type IconComponent = React.ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

export type ServiceCategory =
  | "core"
  | "pack-ship"
  | "copy-print"
  | "mailbox-rentals"
  | "document-services"
  | "additional-services"
  | "notary-services"
  | "specialty"
  | "micro-problem";

// CTA type for reusable call-to-action sections
export interface CTA {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;    // internal route or absolute URL
  icon?: IconComponent;
  bgImage?: string;      // optional background image path
  align?: "left" | "center"; // layout preference
  variant?: "brand" | "neutral" | "ghost"; // style variants
}

export interface Service {
  id: string;
  category: ServiceCategory;
  serviceName: string;
  slug: string;
  canonicalUrl?: string;
  priorityServices?: string[];
  city: string;
  pageTitle: string;
  metaDescription: string;
  keywords?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  icon?: IconComponent;
  popular?: boolean;
  introductoryContent?: string;
  intentKey?: string;
  indexable?: boolean;

  // 👇 NEW: long-form page content
  content?: Array<{
    heading: string;
    body: string;
    isFullWidth?: boolean;
  }>;

  features?: Array<{
    title: string;
    description: string;
    icon?: IconComponent;
  }>;

  faqs?: FAQ[];

  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };

  // Optional CTA block for this service
  cta?: CTA;
}

export interface Category {
  id: ServiceCategory;
  name: string;
  href: string;
  description: string;
  icon: IconComponent;
  color: string;
  bgColor: string;
  keywords: string;
  metaDescription: string;
  popular?: boolean;
}
