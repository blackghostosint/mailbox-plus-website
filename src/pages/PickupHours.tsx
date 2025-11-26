import React from "react";
import { motion } from "framer-motion";
import { MapPin, Truck } from "lucide-react";
import { Meta } from "../components/Meta";
import { InternalLink } from "../components/ui/InternalLink";
import { JsonLd } from "../components/JsonLd";
import { siteConfig, defaultCTA } from "../config/siteConfig";
import { CTASection } from "../components/sections/CTA";
import {
  getWebPageSchema,
  getServiceSchema,
  getFAQSchema,
  getLocalBusinessSchema
} from "../utils/schema";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion";
import { AutoBreadcrumbs } from "../components/ui/AutoBreadcrumbs";
import { getServiceImageUrl } from "../lib/storage";
import { SmartImage } from "../components/SmartImage";

const pickupHours = [
  {
    carrier: "USPS Pickup",
    times: [
      { day: "Monday – Friday", time: "2:30 PM" },
      { day: "Saturday", time: "12:00 PM (Noon)" },
      { day: "Sunday", time: "No pickup" },
    ],
    details: "Accepts stamped mail, prepaid labels, Priority Mail, and returns.",
    color: "border-blue-200 bg-blue-50/50",
    iconColor: "text-blue-600",
  },
  {
    carrier: "UPS Pickup",
    times: [
      { day: "Monday – Friday", time: "4:00 PM" },
      { day: "Saturday", time: "No pickup" },
      { day: "Sunday", time: "No pickup" },
    ],
    details: "Accepts pre-labeled drop-offs, Amazon returns (with label), and air/ground packages.",
    color: "border-amber-200 bg-amber-50/50",
    iconColor: "text-amber-700",
  },
  {
    carrier: "FedEx Express",
    times: [
      { day: "Monday – Friday", time: "5:00 PM" },
      { day: "Saturday", time: "12:00 PM (Noon)" },
      { day: "Sunday", time: "No pickup" },
    ],
    details: "For overnight, 2-day, and express saver shipments. Separate from Ground.",
    color: "border-purple-200 bg-purple-50/50",
    iconColor: "text-purple-600",
  },
  {
    carrier: "FedEx Ground",
    times: [
      { day: "Monday – Friday", time: "5:00 PM" },
      { day: "Saturday", time: "No pickup" },
      { day: "Sunday", time: "No pickup" },
    ],
    details: "Standard ground shipping and Home Delivery packages.",
    color: "border-green-200 bg-green-50/50",
    iconColor: "text-green-600",
  },
];

const faqs = [
  {
    question: "What time do I need to drop off my package for same-day shipping?",
    answer: "To ensure your package goes out the same day, please drop it off at least 15 minutes before the posted pickup time. For USPS, the cutoff is 2:15 PM Mon-Fri. For UPS, it's 3:45 PM. For FedEx, please arrive by 4:45 PM.",
  },
  {
    question: "Do you accept QR codes for Amazon returns?",
    answer: "No, we cannot process QR codes that require the 'The UPS Store' specifically. We accept pre-printed labels or can help you print a label if you have the PDF file.",
  },
  {
    question: "Is there a pickup on Saturday?",
    answer: "Yes! USPS picks up at 12:00 PM (Noon) and FedEx Express picks up at 12:00 PM (Noon) on Saturdays. UPS and FedEx Ground do not have regular Saturday pickups.",
  },
  {
    question: "Can I drop off a package after the pickup time?",
    answer: "Absolutely. You can drop off packages anytime during our store hours. If you miss the daily pickup, your package will be securely stored and sent out with the next business day's pickup.",
  },
  {
    question: "Do you pick up packages from my house?",
    answer: "We are a retail drop-off location and do not offer residential pickup services. You must bring your packages to our store at 7554 Fredle Drive, Concord Township.",
  },
];

const PickupHours: React.FC = () => {
  const pageTitle = "Carrier Pickup Hours | UPS, FedEx, USPS | Mailbox Plus";
  const metaDescription = "Check daily pickup times for UPS, FedEx, and USPS at Mailbox Plus in Concord Township. Miss the truck? We'll secure your package for the next day.";
  const url = `${siteConfig.domain}/pickup-hours`;

  return (
    <div className="bg-white">
      <Meta
        title={pageTitle}
        description={metaDescription}
        keywords="pickup hours, UPS pickup time, FedEx pickup time, USPS pickup time, drop off cutoff, shipping deadline Concord Township"
        canonical={url}
      />

      <JsonLd schema={getLocalBusinessSchema(siteConfig)} />
      <JsonLd schema={getWebPageSchema(siteConfig, { name: pageTitle, description: metaDescription, url })} />
      <JsonLd schema={getServiceSchema(siteConfig, { serviceName: "Carrier Pickup Services", url })} />
      <JsonLd schema={getFAQSchema(siteConfig, faqs)} />

      {/* Hero Section */}
      <section className="relative bg-[#0855B1] py-16 lg:py-24 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <SmartImage
            priority
            src={getServiceImageUrl("package-drop-offs.jpg")}
            alt="Packages ready for pickup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            Carrier Pickup <span className="text-blue-300">Hours</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto"
          >
            Daily collection times for UPS, FedEx, and USPS. Drop off your packages with confidence.
          </motion.p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <AutoBreadcrumbs />
        </div>

        {/* Intro Text */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-lg text-gray-600 leading-relaxed">
            Knowing the exact pickup times ensures your important shipments go out the same day.
            We are an authorized ship center for <InternalLink variant="geo" to="/pack-ship/ups-authorized-shipper-outlet">UPS</InternalLink>, <InternalLink variant="geo" to="/pack-ship/fedex-shipping">FedEx</InternalLink>, and <InternalLink variant="geo" to="/pack-ship/usps-services">USPS</InternalLink>.
            Residents of <InternalLink variant="geo" to="/shipping-center-concord-township">Concord Township</InternalLink>, Mentor, and Painesville rely on us for timely processing.
          </p>
        </div>

        {/* Pickup Hours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {pickupHours.map((item, idx) => (
            <motion.div
              key={item.carrier}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl p-8 border ${item.color} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="absolute top-0 left-0 w-2 h-full rounded-l-2xl bg-current opacity-20" />

              <div className="flex items-center gap-4 mb-6">
                <Truck className={`w-8 h-8 ${item.iconColor}`} />
                <h2 className="text-2xl font-bold text-gray-900">{item.carrier}</h2>
              </div>

              <ul className="space-y-4 mb-6">
                {item.times.map((t) => (
                  <li key={t.day} className="flex justify-between items-center text-gray-700 border-b border-gray-200/60 pb-2 last:border-0">
                    <span className="font-medium">{t.day}</span>
                    <span className="font-bold text-gray-900 text-lg">{t.time}</span>
                  </li>
                ))}
              </ul>

              <div className="text-sm text-gray-600 bg-white/60 p-4 rounded-lg">
                <p className="font-medium text-gray-900 mb-1">Accepted Packages:</p>
                {item.details}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Local SEO Section */}
        <section className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16 border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <MapPin className="w-6 h-6 text-[#0855B1] mt-1 flex-shrink-0" />
              <h3 className="text-2xl font-bold text-gray-900">Serving Lake County & Surrounding Areas</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Whether you are coming from <InternalLink variant="geo" to="/pack-ship">Mentor</InternalLink>, <InternalLink variant="geo" to="/pack-ship">Painesville</InternalLink>, or right here in <InternalLink variant="geo" to="/shipping-center-concord-township">Concord Township</InternalLink>,
              Mailbox Plus is your most convenient drop-off point. Avoid the long lines at the post office or the remote drop boxes that may not be secure.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We handle <InternalLink to="/amazon-returns">Amazon returns</InternalLink>, prepaid labels, and can help you pack your items if they aren&apos;t ready to ship.
              Visit our <InternalLink to="/mailbox-rental">mailbox rental</InternalLink> page if you need a secure place to receive packages instead of sending them!
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-[#0855B1] hover:no-underline hover:text-[#064A9B]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <CTASection cta={defaultCTA} />
      </main>
    </div>
  );
};

export default PickupHours;