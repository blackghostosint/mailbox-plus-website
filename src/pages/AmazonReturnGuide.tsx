import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  MapPin,
  AlertTriangle,
  HelpCircle,
  XCircle
} from "lucide-react";
import { Meta, Breadcrumbs, JsonLd } from "../components";
import { CompetitorAlternativeSection } from "../components/sections/CompetitorAlternative";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";
import { getServiceImageUrl } from "../lib/storage";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import { SmartImage } from "../components/SmartImage";

export const AmazonReturnGuide: React.FC = () => {
  const service = services.find((s) => s.id === "amazon-returns")!;

  // JSON-LD Data
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mailbox Plus",
    "telephone": "+1-440-709-1946",
    "url": "https://mailboxplusohio.com",
    "image": service.heroImage,
    "description": service.metaDescription,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "7554 Fredle Drive",
      "addressLocality": "Concord Township",
      "addressRegion": "OH",
      "postalCode": "44077",
      "addressCountry": "US"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "14:00"
      }
    ],
    "areaServed": [
      "Concord Township",
      "Painesville",
      "Mentor",
      "Eastlake",
      "Willoughby",
      "Lake County"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can Mailbox Plus scan my Amazon QR code?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Mailbox Plus cannot scan or accept Amazon QR codes. These returns must be completed at Amazon-authorized partners such as The UPS Store, Kohl’s, Whole Foods, or Amazon Hub. We CAN help you with Amazon returns that include a printed shipping label."
        }
      },
      {
        "@type": "Question",
        "name": "Do you charge for helping with Amazon returns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We may charge for packaging materials, packing services, or printing labels. If your item is already labeled and ready to ship, the cost may be minimal."
        }
      },
      {
        "@type": "Question",
        "name": "Do you control whether Amazon approves my refund?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Amazon controls all refund decisions. We handle the packing and shipping portion only."
        }
      },
      {
        "@type": "Question",
        "name": "Can you print my Amazon label if I don’t have a printer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Bring your phone with the return email or login and we can print it."
        }
      },
      {
        "@type": "Question",
        "name": "Do you help with returns for other retailers besides Amazon?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Bring any return label or instructions and we will assist."
        }
      }
    ]
  };

  const faqs = [
    {
      question: "Can Mailbox Plus scan my Amazon QR code?",
      answer: "No. Mailbox Plus cannot scan or accept Amazon QR codes. These returns must be completed at Amazon-authorized partners such as The UPS Store, Kohl’s, Whole Foods, or Amazon Hub. We CAN help you with Amazon returns that include a printed shipping label."
    },
    {
      question: "Do you charge for helping with Amazon returns?",
      answer: "We may charge for packaging materials, packing services, or printing labels. If your item is already labeled and ready to ship, the cost may be minimal."
    },
    {
      question: "Do you control whether Amazon approves my refund?",
      answer: "No. Amazon controls all refund decisions. We handle the packing and shipping portion only."
    },
    {
      question: "Can you print my Amazon label if I don’t have a printer?",
      answer: "Yes. Bring your phone with the return email or login and we can print it."
    },
    {
      question: "Do you help with returns for other retailers besides Amazon?",
      answer: "Yes. Bring any return label or instructions and we will assist."
    }
  ];

  return (
    <div className="bg-white">
      {/* SEO Metadata */}
      <Meta
        title={service.pageTitle}
        description={service.metaDescription}
        keywords={service.keywords}
        canonical="https://mailboxplusohio.com/amazon-return-guide"
        ogImage={service.heroImage}
      />

      {/* Structured Data */}
      <JsonLd schema={localBusinessSchema} />
      <JsonLd schema={faqSchema} />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs service={service} />
      </div>

      {/* Hero Section */}
      <section className="relative bg-[#0855B1] py-16 lg:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <SmartImage
            priority
            src={service.heroImage}
            alt="Amazon Returns at Mailbox Plus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6"
          >
            How to Return Items to Amazon
            <span className="block text-2xl md:text-3xl mt-4 font-medium text-blue-100">
              (Local Guide for Lake County, Ohio)
            </span>
          </motion.h1>

          {/* NOTICE BOX */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-xl p-6 text-left shadow-xl border-l-8 border-yellow-500 max-w-3xl mx-auto mt-8"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600 shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">⚠️ Important Amazon QR-Code Notice</h3>
                <p className="text-gray-700 mb-4">
                  Mailbox Plus <strong>cannot scan or accept Amazon QR codes</strong> for label-free returns.
                  Amazon requires QR-code returns to be processed ONLY at Amazon-authorized partner locations (The UPS Store, Whole Foods, Kohl’s, Amazon Hub, etc.).
                </p>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="font-medium text-green-800">
                    We CAN accept Amazon returns when Amazon provides a printable shipping label (UPS, USPS, or FedEx).
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    If you do not have a printer, we can print the label for you.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Returning an item to Amazon doesn&apos;t have to be confusing. If you live in Concord Township, Painesville, Mentor, Eastlake, Willoughby, or anywhere in Lake County, Ohio, Mailbox Plus is here to make your Amazon returns simple. We help you pack, label, and ship your Amazon return—<strong>as long as Amazon provides a printable label</strong>.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Mailbox Plus is your convenient <InternalLink variant="geo" to="/amazon-returns-drop-off-concord-township">Amazon returns drop-off location</InternalLink> for pre-labeled packages.
            While you&apos;re here, we can also help with <InternalLink variant="geo" to="/pack-ship">packing other shipments</InternalLink> or
            <InternalLink variant="geo" to="/shipping">comparing shipping rates</InternalLink> for your personal or business needs.
          </p>
        </div>
      </section>

      {/* How Amazon Returns Work */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#111827] mb-8 text-center">How Amazon Returns Work</h2>
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#0855B1] shrink-0 mt-1" />
                <span className="text-gray-700 text-lg">Most Amazon items can be returned within about 30 days.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#0855B1] shrink-0 mt-1" />
                <span className="text-gray-700 text-lg">Some items (electronics, perishables, personalized items) have special rules.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#0855B1] shrink-0 mt-1" />
                <span className="text-gray-700 text-lg">Always check your Amazon &ldquo;Your Orders&rdquo; page for exact eligibility and deadlines.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Step-by-Step Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#111827] mb-10 text-center">Step-by-Step: How to Start an Amazon Return</h2>

          <div className="space-y-12">
            {[
              {
                title: "Start Your Return in the Amazon App",
                image: "step-01-return-replace-your-item.webp",
                description: "Open the Amazon app or website and navigate to **&quot;Your Orders.&quot;** Locate the item you wish to return to begin the process."
              },
              {
                title: "Pick Your Reason for Returning",
                image: "step-02-why-are-you-returning-your-item.webp",
                description: "Select the specific reason for your return from the provided list (e.g., &quot;defective,&quot; &quot;no longer needed&quot;). This helps Amazon process your request accurately."
              },
              {
                title: "Confirm the Packaging Status",
                image: "step-03-confirm-the-packaging-status.webp",
                description: "Indicate whether the item is still in its original packaging. This information helps Amazon determine the correct return method and restocking requirements."
              },
              {
                title: "Select Refund or Replacement",
                image: "step-04-select-refund-replacement.webp",
                description: "Choose your preferred resolution: receive a refund to your original payment method (or Amazon balance) or request a replacement item if available."
              },
              {
                title: "Describe the Issue and Proceed",
                image: "step-05-describe-issue-and-proceed.webp",
                description: "Add any specific comments describing the problem if prompted, then continue to the next step to finalize your return details."
              },
              {
                title: "Choose UPS Drop-Off (We can handle the Label!)",
                image: "step-06-choose-ups-dropoff.webp",
                description: "**Crucial Step:** Select a return method that provides a **printable shipping label** (often labeled as UPS Drop-off Points). *Avoid &quot;No Box/No Label&quot; options if you want to use Mailbox Plus.*"
              },
              {
                title: "Share Your Return Label With Us ($2.00 fee)",
                image: "step-07-share-label-with-friend.webp",
                description: "No printer? No problem! We can print your label for a small $2.00 fee. Simply choose the option to **&quot;Share&quot;** or **&quot;Email&quot;** the label from the app."
              },
              {
                title: "Email the Label to Us",
                image: "step-08-email-label-to-us.webp",
                description: "Select your preferred email app and prepare to send the label file directly to our store for fast printing."
              },
              {
                title: "Send the Label to Mailbox Plus",
                image: "step-09-use-our-email-address.webp",
                description: "Send your shipping label to **RETURNS@MAILBOXPLUSOHIO.COM**. We will print it out and have it ready for your arrival."
              },
              {
                title: "Confirmation: Label Sent Successfully",
                image: "step-10-abel-sentto-us.webp",
                description: "Ensure your email has been sent successfully. You can now head to our store knowing your paperwork is being handled."
              },
              {
                title: "Now Drop Off at Mailbox Plus",
                image: "step-11-pack-label-dropoff.webp",
                description: "Bring your item to **Mailbox Plus at 7554 Fredle Drive** in Concord Township. We'll professionally pack it (if needed), attach the label, and ship it out for you!"
              }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-start gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                {/* Step Number & Image */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0855B1] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                      {idx + 1}
                    </div>
                    <h3 className="text-lg font-bold text-[#0855B1] md:hidden">{step.title}</h3>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-md bg-white group">
                    <SmartImage
                      src={getServiceImageUrl(`/images/${step.image}`)}
                      alt={`Step ${idx + 1}: ${step.title}`}
                      className="w-full h-auto object-contain transform transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Step Content */}
                <div className="w-full md:w-2/3 flex flex-col justify-center py-2">
                  <h3 className="hidden md:block text-2xl font-bold text-[#0855B1] mb-3">{step.title}</h3>
                  <p className="text-gray-700 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: step.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border-l-4 border-[#0855B1] p-4 rounded-r-lg flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-[#0855B1] shrink-0 mt-1" />
            <div>
              <p className="font-bold text-[#0855B1]">Tip:</p>
              <p className="text-blue-900">Start your return as early as possible to avoid missing the return window.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How Mailbox Plus Helps */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">How Mailbox Plus Helps With Amazon Returns</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 text-red-300">
                  <XCircle className="w-6 h-6 shrink-0 mt-1" />
                  <p>Mailbox Plus is <strong>not</strong> an Amazon QR partner.</p>
                </div>
                <div className="flex items-start gap-3 text-red-300">
                  <XCircle className="w-6 h-6 shrink-0 mt-1" />
                  <p>We <strong>cannot</strong> scan or accept Amazon QR codes.</p>
                </div>
                <div className="flex items-start gap-3 text-green-400">
                  <CheckCircle className="w-6 h-6 shrink-0 mt-1" />
                  <p>We <strong>can</strong> assist with any Amazon return that includes a <strong>printable shipping label</strong>.</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-lg mb-2">Services We Provide:</p>
                {[
                  "Print your Amazon label (if needed)",
                  "Supply proper packaging",
                  "Professionally pack fragile or valuable items",
                  "Prepare shipments for UPS, USPS, or FedEx (based on the label Amazon issued)",
                  "Help customers understand Amazon&apos;s return instructions"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-blue-200">Why Choose Us?</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                &ldquo;At Mailbox Plus, we assist residents throughout Concord Township, Mentor, Painesville, Eastlake, Willoughby, and the rest of Lake County. We&apos;re a local, owner-operated pack-and-ship store—when Amazon&apos;s instructions get confusing, you can talk to a real person.&rdquo;
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>7554 Fredle Drive, Concord Township, OH</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Problems */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#111827] mb-10 text-center">Common Problems & How We Help You Avoid Them</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Wrong packaging",
              "Missing accessories",
              "Confusing labels",
              "No printer at home",
              "Misreading Amazon instructions",
              "Trying to use a QR code at a non-authorized location"
            ].map((problem, i) => (
              <div key={i} className="bg-red-50 p-6 rounded-xl border border-red-100 flex flex-col items-center text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
                <span className="font-medium text-gray-900">{problem}</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 font-medium text-red-600">
            &ldquo;If Amazon only provides a QR code with no printable label, you must take that return to an authorized Amazon partner.&rdquo;
          </p>
        </div>
      </section>

      {/* When NOT to use Mailbox Plus */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#111827] mb-8 text-center">When You Should NOT Use Mailbox Plus</h2>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3 text-gray-700">
                <XCircle className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <span>Amazon only gave you a QR code</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <XCircle className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <span>Amazon forced the return to a specific partner location</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <XCircle className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <span>Amazon requires in-person verification for certain products</span>
              </li>
            </ul>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-800 font-medium text-center">
              If the return instructions only show a QR code with no option for a shipping label, we cannot process that return.
            </div>
          </div>
        </div>
      </section>

      {/* Holiday Return Extensions */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#111827] mb-4">Holiday Return Extensions</h2>
          <p className="text-lg text-gray-600">
            During the holiday season (typically November and December), Amazon often extends its return window.
            This means gifts purchased early can often be returned into January. Check your order details for specific deadlines.
          </p>
        </div>
      </section>

      {/* Why Local Customers Choose Us */}
      <section className="py-16 bg-[#F0F7FF]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#111827] mb-8 text-center">Why Local Customers Choose Mailbox Plus</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Local, owner-operated business",
              "Located at 7554 Fredle Drive — minutes from I-90 and OH-44",
              "Friendly, knowledgeable team",
              "Packing materials available onsite",
              "Fast service",
              "Supports all major carriers"
            ].map((reason, i) => (
              <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                <CheckCircle className="w-5 h-5 text-[#0855B1] shrink-0" />
                <span className="text-gray-800 font-medium">{reason}</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-2xl font-bold text-[#0855B1] italic">
            “Let Us Handle Your Package!”
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 lg:py-24 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#111827] mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-white border border-gray-200 rounded-xl shadow-sm px-2"
              >
                <AccordionTrigger className="px-4 py-3 text-left font-semibold text-[#0855B1] hover:underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-[#4B5563] leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Competitor Alternative Section */}
      <CompetitorAlternativeSection />

      {/* Contact / Final CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Visit Mailbox Plus Today</h2>

          <p className="text-gray-300 mb-8">
            We&apos;re conveniently located near I-90 and OH-44, serving Concord Township, Painesville, Mentor, Eastlake, Willoughby, and the surrounding Lake County communities.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="/contact-us" className="inline-block bg-[#0855B1] text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition-colors">
              Get Directions
            </a>
            <a href="/pack-ship" className="inline-block bg-white text-[#0855B1] font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
              View All Shipping Services
            </a>
            <a href="/home-business/mailbox-rental" className="inline-block border border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-colors">
              Mailbox Rentals
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};