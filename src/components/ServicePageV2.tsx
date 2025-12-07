import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// 🔹 Barrel imports (index.ts inside /components)
import { Meta, Breadcrumbs, JsonLd, VisitUsButton } from ".";

// 🔹 Local sibling components
import { CarrierLogos } from "./CarrierLogos";
import { CompetitorAlternativeSection } from "./sections/CompetitorAlternative";
import { CTASection } from "./sections/CTA";
import { SmartImage } from "./SmartImage";

// 🔹 UI components from /components/ui
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "./ui/accordion";

// 🔹 Types & utilities
import { Service } from "../types/services";
import {
    getWebPageSchema,
    getServiceSchema,
    getFAQSchema,
} from "../utils/schema";
import { siteConfig } from "../config/siteConfig";

interface ServicePageProps extends Service {
    children?: React.ReactNode;
    breadcrumbsBaseUrl?: string;
    breadcrumbsLabel?: string;
}

export const ServicePageV2: React.FC<ServicePageProps> = (props) => {
    const {
        pageTitle,
        metaDescription,
        heroTitle,
        heroSubtitle,
        heroImage,
        children,
        features,
        content,
        faqs,
        cta,
        aggregateRating,
        slug,
        breadcrumbsBaseUrl,
        breadcrumbsLabel,
    } = props;

    const canonicalUrl = props.canonicalUrl || `${siteConfig.domain}${slug}`;
    const faqSchema = faqs ? getFAQSchema(siteConfig, faqs) : undefined;

    // Accessibility: detect reduced motion
    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return (
        <>
            {/* 🔹 SEO */}
            <Meta
                title={pageTitle}
                description={metaDescription}
                canonical={canonicalUrl}
            />

            <JsonLd
                schema={[
                    getWebPageSchema(siteConfig, {
                        name: pageTitle,
                        description: metaDescription,
                        url: canonicalUrl,
                    }),
                    getServiceSchema(siteConfig, { ...props, url: canonicalUrl }),
                    ...(faqSchema ? [faqSchema] : []),
                ]}
            />

            <div className="min-h-screen bg-gray-50">
                <Breadcrumbs
                    service={props}
                    baseUrl={breadcrumbsBaseUrl}
                    baseLabel={breadcrumbsLabel}
                />

                {/* ------------------------------------------------------------------ */}
                {/* ⭐ HERO SECTION */}
                {/* ------------------------------------------------------------------ */}
                <section className="relative overflow-hidden bg-[#0855B1]">
                    {heroImage && (
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                            animate={prefersReducedMotion ? {} : { opacity: 0.35 }}
                            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
                            className="absolute inset-0 z-0"
                        >
                            <SmartImage
                                priority
                                src={heroImage}
                                alt={heroTitle}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-blue-900/80" />
                        </motion.div>
                    )}

                    <div className="relative z-10 container mx-auto px-4 pt-16 pb-32 lg:pt-24 lg:pb-40">
                        <div className="max-w-3xl">
                            {/* Star Rating */}
                            {aggregateRating && (
                                <motion.div
                                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex items-center gap-2 mb-4"
                                >
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(aggregateRating.ratingValue)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-blue-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-blue-100">
                                        {aggregateRating.ratingValue} ({aggregateRating.reviewCount} reviews)
                                    </span>
                                </motion.div>
                            )}

                            {/* Hero Title */}
                            <motion.h1
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4"
                            >
                                {heroTitle}
                            </motion.h1>

                            {/* Hero Subtitle */}
                            <motion.p
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-lg md:text-xl text-blue-100 max-w-xl mb-8"
                            >
                                {heroSubtitle}
                            </motion.p>

                            {/* Hero CTA */}
                            <VisitUsButton variant="secondary" size="lg" />
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------------ */}
                {/* ⭐ MAIN CONTENT */}
                {/* ------------------------------------------------------------------ */}
                <main className="relative -mt-14 lg:-mt-20 pb-20 lg:pb-28">
                    <div className="container mx-auto px-4 space-y-20">

                        {/* Floating intro card */}
                        {children && (
                            <section className="max-w-3xl mx-auto">
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                                    {children}
                                </div>
                            </section>
                        )}

                        {/* ------------------------------------------------------------------ */}
                        {/* ⭐ FEATURES GRID */}
                        {/* ------------------------------------------------------------------ */}
                        {features && features.length > 0 && (
                            <section className="max-w-6xl mx-auto">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Why customers choose this service
                                </h2>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {features.map((feature, idx) => {
                                        const Icon = feature.icon;
                                        return (
                                            <div
                                                key={idx}
                                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                                            >
                                                {Icon && (
                                                    <div className="w-12 h-12 bg-blue-50 text-[#0855B1] rounded-xl flex items-center justify-center mb-4">
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                )}
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm">{feature.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* ------------------------------------------------------------------ */}
                        {/* ⭐ CONTENT SECTIONS (card-style alternating) */}
                        {/* ------------------------------------------------------------------ */}
                        {content &&
                            content.map((block, idx) => (
                                <section key={idx} className="max-w-5xl mx-auto">
                                    <div
                                        className={`rounded-2xl border shadow-sm px-6 md:px-10 py-10 ${idx % 2 === 1
                                                ? "bg-blue-50 border-blue-100"
                                                : "bg-white border-gray-200"
                                            }`}
                                    >
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                            {block.heading}
                                        </h2>
                                        <div
                                            className="prose prose-lg text-gray-700 max-w-none"
                                            dangerouslySetInnerHTML={{ __html: block.body }}
                                        />
                                    </div>
                                </section>
                            ))}

                        {/* ------------------------------------------------------------------ */}
                        {/* ⭐ FAQ SECTION */}
                        {/* ------------------------------------------------------------------ */}
                        {faqs && faqs.length > 0 && (
                            <section className="max-w-4xl mx-auto">
                                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                                    Frequently Asked Questions
                                </h2>

                                <Accordion
                                    type="single"
                                    collapsible
                                    className="space-y-4"
                                >
                                    {faqs.map((faq, i) => (
                                        <AccordionItem
                                            key={i}
                                            value={`faq-${i}`}
                                            className="bg-white border border-gray-200 rounded-2xl shadow-sm"
                                        >
                                            <AccordionTrigger className="px-4 py-3 text-left font-semibold text-[#0855B1] hover:underline">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4 text-gray-700">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </section>
                        )}

                        {/* ------------------------------------------------------------------ */}
                        {/* ⭐ CTA SECTION */}
                        {/* ------------------------------------------------------------------ */}
                        {cta && (
                            <section className="max-w-4xl mx-auto">
                                <div className="rounded-2xl overflow-hidden shadow-xl border border-blue-100 bg-gradient-to-br from-[#0855B1] to-[#064080] p-10">
                                    <CTASection cta={cta} />
                                </div>
                            </section>
                        )}
                    </div>
                </main>

                {/* Carrier Logos */}
                <CarrierLogos />

                {/* Competitor Comparison */}
                <CompetitorAlternativeSection />
            </div>
        </>
    );
};
