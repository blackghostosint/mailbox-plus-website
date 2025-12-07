import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

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
        initial: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
        whileInView: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
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

                {/* ----------------------- HERO -------------------------- */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#063AAE] via-[#0F6BFF] to-[#041B4A]" />

                    {heroImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.25 }}
                            transition={{ duration: 0.9 }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            <SmartImage
                                priority
                                src={heroImage}
                                alt={heroTitle}
                                className="w-full h-full object-cover object-center scale-110 blur-[1px] opacity-80 mix-blend-soft-light"
                            />
                        </motion.div>
                    )}

                    <div className="relative z-10 container mx-auto px-4 pt-16 pb-36 lg:pt-20 lg:pb-44">
                        <motion.div {...reveal} transition={{ delay: 0.05 }}>
                            {aggregateRating && (
                                <div className="inline-flex items-center gap-3 rounded-full bg-black/20 backdrop-blur-sm px-4 py-1.5 mb-4 border border-white/20">
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
                                </div>
                            )}
                        </motion.div>

                        <motion.h1
                            {...reveal}
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white max-w-3xl mb-4"
                        >
                            {heroTitle}
                        </motion.h1>

                        <motion.p
                            {...reveal}
                            transition={{ delay: 0.15, duration: 0.6 }}
                            className="text-lg md:text-xl text-blue-100 max-w-2xl mb-8"
                        >
                            {heroSubtitle}
                        </motion.p>

                        <motion.div {...reveal} transition={{ delay: 0.25 }}>
                            <VisitUsButton variant="secondary" size="lg" />
                        </motion.div>
                    </div>

                    {/* soft fade at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-slate-50" />
                </section>

                {/* ------------------------ MAIN ------------------------- */}
                <main className="relative -mt-14 pb-20 lg:pb-28">
                    <div className="container mx-auto px-4 space-y-20">

                        {/* Floating intro card */}
                        {children && (
                            <motion.section {...reveal} className="max-w-3xl mx-auto">
                                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/70 px-6 py-6 md:px-10 md:py-8">
                                    {children}
                                </div>
                            </motion.section>
                        )}

                        {/* ------------------- FEATURES ------------------- */}
                        {features && features.length > 0 && (
                            <motion.section {...reveal} className="max-w-6xl mx-auto">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                                    Why customers choose this service
                                </h2>

                                <div className="grid gap-6 md:grid-cols-3">
                                    {features.map((feature, idx) => {
                                        const Icon = feature.icon;
                                        return (
                                            <div
                                                key={idx}
                                                className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden p-6"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-100/60 opacity-0 group-hover:opacity-100 transition-opacity" />

                                                <div className="relative">
                                                    {Icon && (
                                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-[#0855B1] flex items-center justify-center mb-3">
                                                            <Icon className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                        {feature.title}
                                                    </h3>
                                                    <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        )}

                        {/* ----------------- CONTENT BLOCKS ----------------- */}
                        {content &&
                            content.map((block, idx) => (
                                <motion.section
                                    {...reveal}
                                    key={idx}
                                    className={`py-6 ${idx % 2 === 1
                                            ? "bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100/40 rounded-3xl"
                                            : ""
                                        }`}
                                >
                                    <div className="max-w-5xl mx-auto rounded-3xl shadow-sm border border-slate-200 bg-white px-6 md:px-10 py-8 md:py-10">
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

                        {/* --------------------- FAQ ---------------------- */}
                        {faqs && faqs.length > 0 && (
                            <motion.section
                                {...reveal}
                                className="py-12 bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-[40px]"
                            >
                                <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-lg border border-slate-200 p-8 md:p-10">
                                    <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-6">
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
                                                className="rounded-2xl border border-slate-200 bg-slate-50/70 data-[state=open]:bg-white shadow-sm"
                                            >
                                                <AccordionTrigger className="px-4 py-3 text-left text-[#0855B1] font-semibold hover:no-underline">
                                                    {faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4 text-slate-700 text-sm md:text-base">
                                                    {faq.answer}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </motion.section>
                        )}

                        {/* ---------------------- CTA ---------------------- */}
                        {cta && (
                            <motion.section {...reveal} className="max-w-4xl mx-auto">
                                <div className="rounded-3xl shadow-[0_22px_45px_rgba(15,107,255,0.35)] bg-gradient-to-br from-[#0753C8] via-[#0F6BFF] to-[#04245E] border border-blue-500/40 p-8 md:p-10 text-white">
                                    <CTASection cta={cta} />
                                </div>
                            </motion.section>
                        )}
                    </div>
                </main>

                {/* End-of-page sections */}
                <CarrierLogos />
                <CompetitorAlternativeSection />
            </div>
        </>
    );
};
