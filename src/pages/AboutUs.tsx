import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../utils";
import { SmartImage } from "../components/SmartImage";
import { getServiceImageUrl } from "../lib/storage";
import { siteConfig } from "../config/siteConfig";
import { InternalLink } from "../components/ui/InternalLink";
import { Button } from "../components/ui";
import { CheckCircle } from "lucide-react";

export const AboutUs: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            {...fadeUp(0)}
            className="text-4xl md:text-5xl font-bold text-[#111827] mb-6"
          >
            About Mailbox Plus
          </motion.h1>
          <motion.p
            {...fadeUp(0.1)}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Your trusted local partner for shipping, printing, and business services in Concord Township and Lake County.
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp(0.2)}>
              <SmartImage
                src={getServiceImageUrl("/images/mailboxes.webp")}
                alt="A wall of secure, private mailboxes at Mailbox Plus"
                className="rounded-2xl shadow-lg w-full object-cover aspect-video"
              />
            </motion.div>
            <motion.div {...fadeUp(0.3)}>
              <h2 className="text-3xl font-bold text-[#111827] mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {siteConfig.name} is a locally owned and operated business dedicated to serving the Concord Township community and surrounding areas in Lake County, Ohio.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We are faith-guided and committed to providing personalized, professional service that you won&apos;t find at big box stores. Whether you need to ship a package, print documents, or rent a private mailbox, our friendly team is here to help.
              </p>
              <div className="flex gap-4">
                <InternalLink to="/contact-us">
                  <Button>Visit Us Today</Button>
                </InternalLink>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#111827] mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Frank */}
            <motion.div
              {...fadeUp(0.2)}
              className="bg-white p-8 rounded-2xl shadow-sm text-center"
            >
              <SmartImage
                src={getServiceImageUrl("/images/frank.webp")}
                alt="Frank Schwarz, Store Manager"
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-gray-100"
              />
              <h3 className="text-xl font-bold text-[#111827]">Frank Schwarz</h3>
              <p className="text-[#0855B1] font-medium">Store Manager</p>
            </motion.div>

            {/* Diana */}
            <motion.div
              {...fadeUp(0.3)}
              className="bg-white p-8 rounded-2xl shadow-sm text-center"
            >
              <SmartImage
                src={getServiceImageUrl("/images/diana.webp")}
                alt="Diana Goebelt, Owner"
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-gray-100"
              />
              <h3 className="text-xl font-bold text-[#111827]">Diana Goebelt</h3>
              <p className="text-[#0855B1] font-medium">Owner</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#111827] mb-12">Why Choose Mailbox Plus?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Locally Owned", desc: "We are part of your community, not a faceless corporation." },
              { title: "Expert Service", desc: "Our team is trained to handle your packing and shipping needs with care." },
              { title: "Convenient", desc: "Easy access, plenty of parking, and quick service." }
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp(0.1 * i)}
                className="p-6 bg-blue-50 rounded-xl border border-blue-100"
              >
                <CheckCircle className="w-8 h-8 text-[#0855B1] mb-4" />
                <h3 className="text-xl font-bold text-[#111827] mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
