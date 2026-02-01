import React from "react";
import { motion } from "framer-motion";
import Star from '~icons/lucide/star';

// Barrel exports
import { Meta, Breadcrumbs, JsonLd, VisitUsButton } from ".";
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

// Types & utils
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

    const reveal = {
        initial: prefersReducedMotion ? {} : { opacity: 0, y: 32 },
        whileInView: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.05 },
        transition: { duration: 0.55, ease: "easeOut" as const },
    };

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

                {/* ====================== HERO ======================= */}
                <section className="relative overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0B4BB6] via-[#1A6DFF] to-[#021B4A]" />

                    {/* Hero image softly blended in */}
                    {heroImage && (
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                            animate={prefersReducedMotion ? {} : { opacity: 0.35 }}
                            transition={{ duration: 0.9 }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            <SmartImage
                                priority
                                src={heroImage}
                                alt={heroTitle}
                                className="w-full h-full object-cover object-center scale-110 blur-[1px] opacity-90 mix-blend-soft-light"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-[#02152F]/80" />
                        </motion.div>
                    )}

                    <div className="relative z-10 container mx-auto px-4 pt-16 pb-40 lg:pt-20 lg:pb-44">
                        {/* Rating pill */}
                        {aggregateRating && (
                            <motion.div
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/40 px-4 py-1.5 mb-4 shadow-sm"
                            >
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(aggregateRating.ratingValue)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-blue-100/80"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs md:text-sm text-blue-50/90 font-medium">
                                    {aggregateRating.ratingValue} rating ·{" "}
                                    {aggregateRating.reviewCount}+ reviews
                                </span>
                            </motion.div>
                        )}

                        {/* Title + subtitle */}
                        <motion.h1
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 28 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.05 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mb-4"
                        >
                            {heroTitle}
                        </motion.h1>

                        <motion.p
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 28 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.14 }}
                            className="text-base md:text-lg lg:text-xl text-blue-100 max-w-2xl mb-8"
                        >
                            {heroSubtitle}
                        </motion.p>

                        {/* Primary CTA */}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.22 }}
                        >
                            <VisitUsButton variant="secondary" size="lg" />
                        </motion.div>
                    </div>

                    {/* Soft fade into page background */}
                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-slate-50" />
                </section>

                {/* ======================= MAIN ====================== */}
                {/* Slight overlap so intro card floats into hero */}
                <main className="relative -mt-20 pb-20 lg:pb-28">
                    <div className="container mx-auto px-4 space-y-20">
                        {/* -------- GLASS INTRO CARD -------- */}
                        {children && (
                            <motion.section {...reveal} className="max-w-3xl mx-auto">
                                <div className="relative">
                                    {/* subtle gradient border */}
                                    <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-r from-white/60 via-white/20 to-white/60 opacity-80" />
                                    <div className="relative rounded-[26px] bg-white/70 backdrop-blur-xl border border-white/70 shadow-[0_18px_45px_rgba(15,23,42,0.20)] px-6 py-6 md:px-10 md:py-8">
                                        {children}
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {/* -------- FEATURES STRIP -------- */}
                        {features && features.length > 0 && (
                            <motion.section {...reveal} className="max-w-6xl mx-auto">
                                <div className="flex flex-col gap-2 mb-6">
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                        <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                            Why customers choose this service
                                        </span>
                                    </h2>
                                    <p className="text-slate-600 text-sm md:text-base max-w-xl">
                                        Clear benefits, protections, and flexible options so you can
                                        ship, print, and manage your mail with confidence.
                                    </p>
                                </div>

                                <div className="grid gap-6 md:grid-cols-3">
                                    {features.map((feature, idx) => {
                                        const Icon = feature.icon;
                                        return (
                                            <motion.div
                                                key={idx}
                                                whileHover={
                                                    prefersReducedMotion
                                                        ? {}
                                                        : { y: -6, scale: 1.01, transition: { duration: 0.2 } }
                                                }
                                                className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                                            >
                                                {/* subtle overlay on hover */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-blue-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div className="relative p-6 flex flex-col gap-3">
                                                    {Icon && (
                                                        <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900/5 via-blue-500/10 to-blue-400/10 text-[#0855B1] w-12 h-12 shadow-inner shadow-white/40">
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
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        )}

                        {/* -------- CONTENT SECTIONS (GLASS PANELS) -------- */}
                        {content &&
                            content.map((block, idx) => (
                                <motion.section
                                    key={idx}
                                    {...reveal}
                                    className="max-w-5xl mx-auto"
                                >
                                    <div
                                        className={[
                                            "relative rounded-[28px] px-6 md:px-10 py-8 md:py-10 shadow-[0_18px_45px_rgba(15,23,42,0.10)]",
                                            "bg-white/75 backdrop-blur-xl border border-white/80",
                                            idx % 2 === 1
                                                ? "before:absolute before:inset-px before:rounded-[26px] before:bg-gradient-to-br before:from-blue-50/80 before:via-slate-50/50 before:to-blue-100/60 before:-z-10"
                                                : "",
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
                                </motion.section>
                            ))}

                        {/* -------- FAQ (GLASS BAND) -------- */}
                        {faqs && faqs.length > 0 && (
                            <motion.section
                                {...reveal}
                                className="py-12 rounded-[40px] bg-gradient-to-b from-slate-100/80 via-slate-200/70 to-slate-100/80"
                            >
                                <div className="max-w-4xl mx-auto">
                                    <div className="relative rounded-[30px] bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.18)] px-4 md:px-8 py-8 md:py-10">
                                        <div className="text-center mb-6 md:mb-8">
                                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                                Frequently Asked Questions
                                            </h2>
                                            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-xl mx-auto">
                                                Get quick answers to the most common questions about
                                                packaging, carriers, pricing, and what to expect.
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
                                                    className="rounded-2xl border border-slate-200/80 bg-slate-50/80 data-[state=open]:bg-white/90 shadow-sm"
                                                >
                                                    <AccordionTrigger className="px-4 py-3 text-left text-[#0855B1] font-semibold hover:no-underline">
                                                        {faq.question}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-4 pb-4 text-sm md:text-base text-slate-700 leading-relaxed">
                                                        {faq.answer}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {/* -------- CTA (GLASS + GRADIENT) -------- */}
                        {cta && (
                            <motion.section {...reveal} className="max-w-4xl mx-auto">
                                <div className="relative rounded-[30px] overflow-hidden shadow-[0_26px_65px_rgba(15,23,42,0.32)]">
                                    {/* gradient shell */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#0B4BB6] via-[#2F7CFB] to-[#021B4A]" />
                                    {/* glass overlay */}
                                    <div className="absolute inset-[1px] rounded-[28px] bg-white/5 backdrop-blur-xl border border-white/40" />
                                    <div className="relative px-8 py-9 md:px-10 md:py-11 text-white">
                                        <CTASection cta={cta} />
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </div>
                </main>

                {/* End-of-page sections (unchanged) */}
                <CarrierLogos />
                <CompetitorAlternativeSection />
            </div>
        </>
    );
};
