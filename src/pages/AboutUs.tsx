import { PageMeta } from "../components/SEO/PageMeta";
import { SmartImage } from "../components/SmartImage";
import { motion } from "framer-motion";
import { fadeUp } from "../utils/animations";
import { InternalLink } from "../components/ui/InternalLink";
import { Button } from "../components/ui";
import { ArrowRight, MapPin, Package, Printer, Mail, FileText, ScanLine, Box } from "lucide-react";
import { getServiceImageUrl } from "../lib/storage";

export function AboutUs() {
  return (
    <>
      <PageMeta
        title="About Mailbox Plus | Locally Owned Shipping & Business Services in Concord Township"
        description="Learn about Mailbox Plus — your trusted, locally owned partner for shipping, printing, mailbox rentals, and business services in Concord Township and Lake County, Ohio."
      />

      {/* ====================== HERO SECTION (V2 Standard) ======================= */}
      <section className="relative bg-center py-32 lg:py-48 overflow-hidden min-h-[60vh]">
        {/* Background Image with V2 Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          <SmartImage
            priority
            sources={[
              {
                srcSet: getServiceImageUrl("aboutus_mailbox_plus.webp"),
                media: "(max-width: 768px)",
                type: "image/webp"
              },
              {
                srcSet: getServiceImageUrl("aboutus_mailbox_plus.webp"),
                media: "(min-width: 769px)",
                type: "image/webp"
              }
            ]}
            src={getServiceImageUrl("aboutus_mailbox_plus.webp")}
            alt="Mailbox Plus storefront in Concord Township, Ohio"
            className="w-full h-full object-cover mix-blend-soft-light opacity-90 blur-[1px] scale-105"
            style={{ objectPosition: 'center' }}
          />
          {/* V2 Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B4BB6] via-[#1A6DFF] to-[#021B4A] opacity-90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#02152F]/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-sm"
          >
            About <span className="text-blue-200">Mailbox Plus</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl md:text-2xl text-blue-50 leading-relaxed font-medium max-w-3xl mx-auto mb-10"
          >
            Your trusted local partner for shipping, printing, mailbox rentals,
            and business services — proudly serving Concord Township and Lake County.
          </motion.p>
        </div>

        {/* Soft fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-slate-50"></div>
      </section>

      {/* -------------------------------- */}
      {/* OUR STORY */}
      {/* -------------------------------- */}
      <section className="mt-16 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        <motion.div {...fadeUp(0.1)} className="relative">
          <SmartImage
            src={getServiceImageUrl("/images/mailboxes.webp")}
            alt="Private mailbox wall at Mailbox Plus"
            className="rounded-[26px] shadow-[0_18px_45px_rgba(15,23,42,0.15)] w-full aspect-video object-cover border border-white/50"
          />
        </motion.div>

        <motion.div
          {...fadeUp(0.2)}
          className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[26px] border border-white/50 shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-6 text-slate-900">Our Story</h2>
          <p className="text-slate-600 leading-relaxed mb-4 text-lg">
            Mailbox Plus is a locally owned and operated business located in the
            heart of Concord Township, Ohio. We opened our doors to provide a
            friendly, reliable, and convenient alternative to driving to Mentor,
            Willoughby, or Painesville for shipping and business needs.
          </p>

          <p className="text-slate-600 leading-relaxed mb-4 text-lg">
            Our mission is simple: offer honest, personal, neighborly service that
            you won’t find at big-box stores or national shipping chains. We combine
            small-town hospitality with big-city capabilities — giving you access to
            <strong className="text-[#0855B1]"> FedEx, UPS, USPS, and DHL</strong> all in one location.
          </p>

          <p className="text-slate-600 leading-relaxed mb-8 text-lg">
            Whether you&apos;re shipping a package, printing documents, renting a private
            mailbox, or handling business tasks, our team is here to help every step
            of the way.
          </p>

          <InternalLink to="/contact-us">
            <Button size="lg" className="shadow-lg">
              Visit Us Today <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </InternalLink>
        </motion.div>
      </section>

      {/* -------------------------------- */}
      {/* COMMUNITY FOCUS */}
      {/* -------------------------------- */}
      <section className="mt-20 bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.h2 {...fadeUp(0.1)} className="text-3xl font-semibold mb-6">
            Proudly Serving Concord Township & Lake County
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Our customers come from Concord Township, Mentor, Painesville,
            Willoughby, Eastlake, Madison, Chardon, Kirtland, Perry, and all across Lake County.
            We are deeply committed to supporting our local residents, nearby businesses, and
            community organizations with dependable service and genuine care.
          </motion.p>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* MEET OUR TEAM */}
      {/* -------------------------------- */}
      <section className="mt-20 max-w-7xl mx-auto px-4">
        <motion.h2 {...fadeUp(0.1)} className="text-3xl font-bold text-center mb-10 text-slate-900">
          Meet Our Team
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Frank */}
          <motion.div
            {...fadeUp(0.2)}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-[26px] shadow-lg border border-white/50 text-center hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className="w-32 h-32 mx-auto mb-6 p-1 bg-white rounded-full shadow-md">
              <SmartImage
                src={getServiceImageUrl("/images/frank.webp")}
                alt="Frank Schwarz"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Frank Schwarz</h3>
            <p className="text-[#0855B1] font-semibold text-lg mb-4">Store Manager</p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Frank brings years of experience in customer service, operations, and
              business management, operations, logistics, and shipping. Known for his friendly approach and attention to detail,
              he ensures every customer leaves with a great experience.
            </p>
            <a
              href="https://www.linkedin.com/in/frank-schwarz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="link" className="text-[#0855B1]">
                View LinkedIn <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </motion.div>

          {/* Diana */}
          <motion.div
            {...fadeUp(0.3)}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-[26px] shadow-lg border border-white/50 text-center hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className="w-32 h-32 mx-auto mb-6 p-1 bg-white rounded-full shadow-md">
              <SmartImage
                src={getServiceImageUrl("/images/diana.webp")}
                alt="Diana Goebelt Schwarz"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Diana Goebelt Schwarz</h3>
            <p className="text-[#0855B1] font-semibold text-lg mb-4">Owner</p>
            <p className="text-slate-600 leading-relaxed mb-6">
              With a strong background in operations, logistics, and customer care,
              Diana leads Mailbox Plus with a commitment to excellence and community-minded service.
              Her leadership ensures we continue to grow while maintaining a welcoming, family-run atmosphere.
            </p>
            <a
              href="https://www.linkedin.com/in/diana-goebelt-schwarz-94090737/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="link" className="text-[#0855B1]">
                View LinkedIn <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* SERVICES WE OFFER */}
      {/* -------------------------------- */}
      <section className="py-20 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 {...fadeUp(0.1)} className="text-3xl font-bold text-center mb-12 text-slate-900">
            What We Offer
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Pack & Ship", link: "/pack-ship", icon: Package, desc: "UPS, FedEx, DHL, USPS" },
              { title: "Print Services", link: "/copy-print", icon: Printer, desc: "Copies, Blueprints, Photos" },
              { title: "Mailbox Rentals", link: "/home-business/mailbox-rental", icon: Mail, desc: "Secure, Private, 24/7 Access" },
              { title: "Notary Public", link: "/home-business/notary-services", icon: FileText, desc: "Official Notarizations" },
              { title: "Scanning", link: "/home-business/document-scanning", icon: ScanLine, desc: "Digitize Your Documents" },
              { title: "Package Receiving", link: "/pack-ship/package-receiving", icon: Box, desc: "Never Miss a Delivery" },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                {...fadeUp(0.1 * i)}
                className="group p-6 bg-white rounded-[26px] shadow-sm hover:shadow-lg border border-slate-100 hover:border-blue-100 transition-all duration-300 hover:translate-y-[-4px]"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0855B1] transition-colors duration-300">
                  <service.icon className="w-6 h-6 text-[#0855B1] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">{service.title}</h3>
                <p className="text-slate-600 mb-4">{service.desc}</p>
                <InternalLink
                  to={service.link}
                  className="inline-flex items-center text-[#0855B1] font-semibold hover:text-[#064A9B]"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </InternalLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* CTA */}
      {/* -------------------------------- */}
      <section className="py-20 bg-gradient-to-br from-[#0B4BB6] via-[#1A6DFF] to-[#021B4A] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Let Us Handle Your Package!
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop in today — we&apos;re conveniently located at <span className="text-white font-semibold">7554 Fredle Drive</span> in Concord Township.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InternalLink to="/contact-us">
              <Button size="lg" variant="secondary" className="font-bold shadow-lg border-none min-h-12 px-8">
                Get in Touch
              </Button>
            </InternalLink>
            <a
              href="https://www.google.com/maps/dir//Mailbox+Plus+Concord+Township"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="ghost" className="text-white border border-white/40 hover:bg-white/10">
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>
          </div>
        </div>
      </section>

    </>
  );
}
