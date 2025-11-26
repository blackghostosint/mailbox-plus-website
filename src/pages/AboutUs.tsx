import { PageMeta } from "../components/SEO/PageMeta";
import { SmartImage } from "../components/SmartImage";
import { motion } from "framer-motion";
import { fadeUp } from "../utils/animations";
import { InternalLink } from "../components/ui/InternalLink";
import { getServiceImageUrl } from "../lib/storage";

export function AboutUs() {
  return (
    <>
      <PageMeta
        title="About Mailbox Plus | Locally Owned Shipping & Business Services in Concord Township"
        description="Learn about Mailbox Plus — your trusted, locally owned partner for shipping, printing, mailbox rentals, and business services in Concord Township and Lake County, Ohio."
        canonical="/about-us"
      />

      <div className="py-16">
        {/* -------------------------------- */}
        {/* HERO */}
        {/* -------------------------------- */}
        <div className="text-center max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">About Mailbox Plus</h1>
          <p className="text-gray-600 text-lg">
            Your trusted local partner for shipping, printing, mailbox rentals,
            and business services — proudly serving Concord Township and Lake County.
          </p>
        </div>

        {/* -------------------------------- */}
        {/* OUR STORY */}
        {/* -------------------------------- */}
        <section className="mt-16 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <motion.div {...fadeUp(0.1)} className="relative">
            <SmartImage
              src={getServiceImageUrl("/images/mailboxes.webp")}
              alt="Private mailbox wall at Mailbox Plus"
              className="rounded-2xl shadow-lg w-full aspect-video object-cover"
            />
          </motion.div>

          <motion.div {...fadeUp(0.2)}>
            <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mailbox Plus is a locally owned and operated business located in the
              heart of Concord Township, Ohio. We opened our doors to provide a
              friendly, reliable, and convenient alternative to driving to Mentor,
              Willoughby, or Painesville for shipping and business needs.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              Our mission is simple: offer honest, personal, neighborly service that
              you won’t find at big-box stores or national shipping chains. We combine
              small-town hospitality with big-city capabilities — giving you access to
              <strong> FedEx, UPS, USPS, and DHL</strong> all in one location.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Whether you're shipping a package, printing documents, renting a private
              mailbox, or handling business tasks, our team is here to help every step
              of the way.
            </p>

            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Visit Us Today
            </a>
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
        <section className="mt-20 max-w-6xl mx-auto px-4">
          <motion.h2 {...fadeUp(0.1)} className="text-3xl font-semibold text-center mb-10">
            Meet Our Team
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Frank */}
            <motion.div {...fadeUp(0.2)} className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <SmartImage
                src={getServiceImageUrl("/images/frank.webp")}
                alt="Frank Schwarz"
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">Frank Schwarz</h3>
              <p className="text-blue-600 font-medium">Store Manager</p>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Frank brings years of experience in customer service, operations, and
                business management, operations, logistics, and shipping. Known for his friendly approach and attention to detail,
                he ensures every customer leaves with a great experience.
              </p>
              <a
                href="https://www.linkedin.com/in/frank-schwarz/"
                target="_blank"
                className="text-blue-600 text-sm font-medium mt-4 inline-block"
              >
                View LinkedIn →
              </a>
            </motion.div>

            {/* Diana */}
            <motion.div {...fadeUp(0.3)} className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <SmartImage
                src={getServiceImageUrl("/images/diana.webp")}
                alt="Diana Goebelt Schwarz"
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">Diana Goebelt Schwarz</h3>
              <p className="text-blue-600 font-medium">Owner</p>
              <p className="text-gray-600 mt-3 leading-relaxed">
                With a strong background in operations, logistics, and customer care,
                Diana leads Mailbox Plus with a commitment to excellence and community-minded service.
                Her leadership ensures we continue to grow while maintaining a welcoming, family-run atmosphere.
              </p>
              <a
                href="https://www.linkedin.com/in/diana-goebelt-schwarz-94090737/"
                target="_blank"
                className="text-blue-600 text-sm font-medium mt-4 inline-block"
              >
                View LinkedIn →
              </a>
            </motion.div>
          </div>
        </section>

        {/* -------------------------------- */}
        {/* SERVICES WE OFFER */}
        {/* -------------------------------- */}
        <section className="mt-20 bg-gray-100 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <motion.h2 {...fadeUp(0.1)} className="text-3xl font-semibold text-center mb-10">
              What We Offer
            </motion.h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { title: "Pack & Ship (All Carriers)", link: "/shipping" },
                { title: "Copy & Print Services", link: "/copy-print" },
                { title: "Private Mailbox Rentals", link: "/mailbox-rental" },
                { title: "Notary & Document Services", link: "/notary" },
                { title: "Scanning & Shredding", link: "/document-services" },
                { title: "Package Receiving", link: "/package-receiving" },
              ].map((service, i) => (
                <motion.div
                  key={service.title}
                  {...fadeUp(0.1 * i)}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <InternalLink
                    to={service.link}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Learn More →
                  </InternalLink>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------- */}
        {/* CTA */}
        {/* -------------------------------- */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-semibold mb-4">Let Us Handle Your Package!</h2>
          <p className="text-gray-700 mb-6">
            Stop in today — we're located at 7554 Fredle Drive in Concord Township.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
          >
            Contact Us
          </a>
        </section>
      </div>
    </>
  );
}
