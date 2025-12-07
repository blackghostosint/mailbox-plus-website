import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// ✅ Barrel imports
import { Meta, Breadcrumbs, JsonLd, VisitUsButton } from "../components";
import { CarrierLogos } from "./CarrierLogos";
import { CompetitorAlternativeSection } from "./sections/CompetitorAlternative";
import { CTASection } from "./sections/CTA";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "./ui/accordion";
import { Service } from "../types/services";
import {
    getWebPageSchema,
    getServiceSchema,
    getFAQSchema,
} from "../utils/schema";
import { siteConfig } from "../config/siteConfig";

// ✅ Shadcn UI
import { SmartImage } from "./SmartImage";

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

    // Generate Schema
    const webPageSchema = getWebPageSchema(siteConfig, {
        name: pageTitle,
        description: metaDescription,
        url: canonicalUrl,
    });
    const serviceSchema = getServiceSchema(siteConfig, {
        ...props,
        url: canonicalUrl,
    });
    const faqSchema = faqs ? getFAQSchema(siteConfig, faqs) : undefined;

    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return (
        <>
            <Meta
                title={pageTitle}
                description={metaDescription}
                canonical={canonicalUrl}
            />
            <JsonLd
                schema={[
                    webPageSchema,
                    serviceSchema,
                    ...(faqSchema ? [faqSchema] : []),
                ]}
            />

            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    service={props}
                    baseUrl={breadcrumbsBaseUrl}
                    baseLabel={breadcrumbsLabel}
                />

                {/* ✅ HERO SECTION (upgraded) */}
                <section className="relative overflow-hidden bg-[#0855B1]">
                    {/* Background image + overlay */}
                    {heroImage && (
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                            animate={prefersReducedMotion ? {} : { opacity: 0.3 }}
                            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
                            className="absolute inset-0 z-0"
                        >
                            <SmartImage
                                priority
                                src={heroImage}
                                alt={heroTitle}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#062f63]/90" />
                        </motion.div>
                    )}

                    <div className="relative z-10 container mx-auto px-4 pt-16 pb-28 lg:pt-20 lg:pb-32">
                        <div className="max-w-3xl">
                            {aggregateRating && (
                                <motion.div
                                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                    transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                                    className="flex items-center gap-2 mb-4"
                                >
                                    <div className="flex gap-0.5">
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
                                    <span className="text-sm text-blue-100 font-medium">
                                        {aggregateRating.ratingValue} ({aggregateRating.reviewCount}{" "}
                                        reviews)
                                    </span>
                                </motion.div>
                            )}

                            <motion.h1
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
                                className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4"
                            >
                                {heroTitle}
                            </motion.h1>

                            <motion.p
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                transition={{
                                    duration: prefersReducedMotion ? 0 : 0.5,
                                    delay: prefersReducedMotion ? 0 : 0.1,
                                }}
                                className="text-lg md:text-xl text-blue-100 max-w-xl mb-8"
                            >
                                {heroSubtitle}
                            </motion.p>

                            <motion.div
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                transition={{
                                    duration: prefersReducedMotion ? 0 : 0.5,
                                    delay: prefersReducedMotion ? 0 : 0.2,
                                }}
                            >
                                <VisitUsButton variant="secondary" size="lg" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* MAIN CONTENT */}
                <main className="relative -mt-14 lg:-mt-20 pb-16 lg:pb-24">
                    <div className="container mx-auto px-4 space-y-20">
                        {/* Floating intro / children card */}
                        {children && (
                            <section className="max-w-3xl mx-auto">
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                                    {children}
                                </div>
                            </section>
                        )}

                        {/* Features Grid */}
                        {features && features.length > 0 && (
                            <section className="max-w-6xl mx-auto">
                                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                            Why customers choose this service
                                        </h2>
                                        <p className="text-gray-600 mt-2">
                                            Clear benefits and protections when you ship, print, or
                                            manage your mail with Mailbox Plus.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {features.map((feature, idx) => {
                                        const Icon = feature.icon;
                                        return (
                                            <div
                                                key={idx}
                                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full"
                                            >
                                                {Icon && (
                                                    <div className="w-12 h-12 bg-blue-50 text-[#0855B1] rounded-xl flex items-center justify-center mb-4">
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                )}
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Dynamic Content Sections */}
                        {content &&
                            content.map((block, idx) => {
                                const isAlt = idx % 2 === 1; // alternate background
                                return (
                                    <section
                                        key={idx}
                                        className={`${block.isFullWidth ? "" : "max-w-5xl mx-auto"
                                            }`}
                                    >
                                        <div
                                            className={`rounded-2xl border ${isAlt
                                                ? "bg-blue-50/60 border-blue-100"
                                                : "bg-white border-gray-100"
                                                } shadow-sm px-6 md:px-10 py-10`}
                                        >
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                                {block.heading}
                                            </h2>
                                            <div
                                                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: block.body }}
                                            />
                                        </div>
                                    </section>
                                );
                            })}

                        {/* FAQ Section */}
                        {faqs && faqs.length > 0 && (
                            <section className="max-w-4xl mx-auto">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        Frequently Asked Questions
                                    </h2>
                                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                                        Answers to common questions about this service, packaging,
                                        carriers, and what to expect.
                                    </p>
                                </div>
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full space-y-4"
                                >
                                    {faqs.map((faq, i) => (
                                        <AccordionItem
                                            key={i}
                                            value={`faq-${i}`}
                                            className="bg-white border border-gray-200 rounded-2xl shadow-sm px-2"
                                        >
                                            <AccordionTrigger className="px-4 py-3 text-left font-semibold text-[#0855B1] hover:underline">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4 text-gray-600 leading-relaxed text-sm md:text-base">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </section>
                        )}

                        {/* CTA Section – centered card */}
                        {cta && (
                            <section className="max-w-4xl mx-auto">
                                <div className="rounded-2xl overflow-hidden shadow-xl border border-blue-100 bg-gradient-to-br from-[#0855B1] to-[#064080]">
                                    <div className="px-8 py-10 md:px-10 md:py-12">
                                        <CTASection cta={cta} />
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </main>

                {/* Carrier Logos */}
                <CarrierLogos />

                {/* Competitor Alternative */}
                <CompetitorAlternativeSection />
            </div>
        </>
    );
};
