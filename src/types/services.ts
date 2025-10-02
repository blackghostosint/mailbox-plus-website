import { Video as LucideIcon } from "lucide-react";

export type ServiceCategory = 
  | "core" 
  | "pack-ship" 
  | "copy-print" 
  | "home-business" 
  | "specialty";

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

  faqs?: Array<{
    question: string;
    answer: string;
  }>;

  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
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
