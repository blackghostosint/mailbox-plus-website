import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Barrel exports from components/index.ts
import { Meta, Breadcrumbs, JsonLd, VisitUsButton } from ".";

// Local components
import { CarrierLogos } from "./CarrierLogos";
import { CompetitorAlternativeSection } from "./sections/CompetitorAlternative";
import { CTASection } from "./sections/CTA";
import { SmartImage } from "./SmartImage";

// UI
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "./ui/accordion";

// Types & utilities
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

    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const heroAnimation = prefersReducedMotion
        ? {}
        : { opacity: 1, y: 0 };

    return (
        <>
            {/* SEO */}
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

            <div className="min-h-screen bg-slate-50">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    service={props}
                    baseUrl={breadcrumbsBaseUrl}
                    baseLabel={breadcrumbsLabel}
                />

                {/* ===========================================================
         * HERO
         * ===========================================================
         */}
                <section className="relative overflow-hidden">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#063AAE] via-[#0F6BFF] to-[#041B4A]" />

                    {/* Optional hero image as soft background layer */}
                    {heroImage && (
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                            animate={prefersReducedMotion ? {} : { opacity: 0.25 }}
                            transition={{ duration: 0.9 }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            <SmartImage
                                priority
                                src={heroImage}
                                alt={heroTitle}
                                className="w-full h-full object-cover object-center scale-110 blur-[1px] opacity-70 mix-blend-soft-light"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-[#041B4A]/80" />
                        </motion.div>
                    )}

                    <div className="relative z-10 container mx-auto px-4 pt-16 pb-32 lg:pt-20 lg:pb-40">
                        <div className="max-w-4xl">
                            {/* Rating */}
                            {aggregateRating && (
                                <motion.div
                                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                                    animate={heroAnimation}
                                    transition={{ duration: 0.4 }}
                                    className="inline-flex items-center gap-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 px-4 py-1.5 mb-4"
                                >
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(aggregateRating.ratingValue)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-blue-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs md:text-sm text-blue-50">
                                        {aggregateRating.ratingValue} rating ·{" "}
                                        {aggregateRating.reviewCount}+ reviews
                                    </span>
                                </motion.div>
                            )}

                            {/* Hero title */}
                            <motion.h1
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
                                animate={heroAnimation}
                                transition={{ duration: 0.6, delay: 0.05 }}
                                className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4"
                            >
                                {heroTitle}
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
                                animate={heroAnimation}
                                transition={{ duration: 0.6, delay: 0.12 }}
                                className="text-base md:text-lg lg:text-xl text-blue-100 max-w-xl mb-8"
                            >
                                {heroSubtitle}
                            </motion.p>

                            {/* Primary CTA */}
                            <motion.div
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
                                animate={heroAnimation}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <VisitUsButton variant="secondary" size="lg" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ===========================================================
         * FLOATING INTRO CARD
         * ===========================================================
         */}
                <main className="relative -mt-16 lg:-mt-20 pb-20 lg:pb-28">
                    <div className="container mx-auto px-4 space-y-20">
                        {children && (
                            <section className="max-w-3xl mx-auto">
                                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/80 px-6 py-6 md:px-10 md:py-8">
                                    {children}
                                </div>
                            </section>
                        )}

                        {/* =======================================================
             * FEATURES STRIP
             * =======================================================
             */}
                        {features && features.length > 0 && (
                            <section className="max-w-6xl mx-auto">
                                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                            Why customers choose this service
                                        </h2>
                                        <p className="text-slate-600 mt-2 text-sm md:text-base max-w-xl">
                                            Clear benefits, protections, and options when you ship,
                                            print, or manage your mail with Mailbox Plus.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-3">
                                    {features.map((feature, idx) => {
                                        const Icon = feature.icon;
                                        return (
                                            <div
                                                key={idx}
                                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-100/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="relative p-6 flex flex-col gap-3">
                                                    {Icon && (
                                                        <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-[#0855B1] w-11 h-11">
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                        {feature.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* =======================================================
             * CONTENT PANELS (ALTERNATING)
             * =======================================================
             */}
                        {content &&
                            content.map((block, idx) => (
                                <section key={idx} className="max-w-5xl mx-auto">
                                    <div
                                        className={[
                                            "rounded-3xl border px-6 md:px-10 py-8 md:py-10 shadow-sm",
                                            idx % 2 === 0
                                                ? "bg-white border-slate-200"
                                                : "bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100/60 border-blue-100",
                                        ].join(" ")}
                                    >
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                                            {block.heading}
                                        </h2>
                                        <div
                                            className="prose prose-lg max-w-none text-slate-700 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: block.body }}
                                        />
                                    </div>
                                </section>
                            ))}

                        {/* =======================================================
             * FAQ BAND
             * =======================================================
             */}
                        {faqs && faqs.length > 0 && (
                            <section className="relative">
                                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50" />
                                <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white shadow-sm px-4 md:px-8 py-10">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                            Frequently Asked Questions
                                        </h2>
                                        <p className="mt-2 text-sm md:text-base text-slate-600">
                                            Answers to the most common questions about this service,
                                            packaging, carriers, and what to expect.
                                        </p>
                                    </div>

                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="space-y-3"
                                    >
                                        {faqs.map((faq, i) => (
                                            <AccordionItem
                                                key={i}
                                                value={`faq-${i}`}
                                                className="rounded-2xl border border-slate-200 bg-slate-50/60 data-[state=open]:bg-white shadow-sm"
                                            >
                                                <AccordionTrigger className="px-4 py-3 text-left font-semibold text-[#0855B1] hover:no-underline">
                                                    {faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4 text-sm md:text-base text-slate-700 leading-relaxed">
                                                    {faq.answer}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </section>
                        )}

                        {/* =======================================================
             * CTA PANEL
             * =======================================================
             */}
                        {cta && (
                            <section className="max-w-4xl mx-auto">
                                <div className="overflow-hidden rounded-3xl border border-blue-500/40 bg-gradient-to-br from-[#0753C8] via-[#0F6BFF] to-[#04245E] shadow-[0_22px_45px_rgba(15,107,255,0.35)]">
                                    <div className="px-8 py-10 md:px-10 md:py-12 text-white">
                                        <CTASection cta={cta} />
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </main>

                {/* Carrier logos strip */}
                <CarrierLogos />

                {/* Competitor alternative content */}
                <CompetitorAlternativeSection />
            </div>
        </>
    );
};
