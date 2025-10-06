import type { LucideIcon } from "lucide-react";
import { FAQ } from "./faq";

export type ServiceCategory =
  | "core"
  | "pack-ship"
  | "copy-print"
  | "home-business"
  | "specialty";

// CTA type for reusable call-to-action sections
export interface CTA {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;    // internal route or absolute URL
  icon?: LucideIcon;
  bgImage?: string;      // optional background image path
  align?: "left" | "center"; // layout preference
  variant?: "brand" | "neutral" | "ghost"; // style variants
}

export interface Service {
  id: string;
  category: ServiceCategory;
  serviceName: string;
  slug: string;
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  icon?: LucideIcon;
  popular?: boolean;

  // 👇 NEW: long-form page content
  content?: Array<{
    heading: string;
    body: string;
  }>;

  features?: Array<{
    title: string;
    description: string;
    icon?: LucideIcon;
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
  icon: LucideIcon;
  color: string;
  bgColor: string;
  keywords: string;
  metaDescription: string;
  popular?: boolean;
}
