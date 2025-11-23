import React from "react";
import { Meta } from "../../components/Meta";
import { AutoBreadcrumbs } from "../../components/ui/AutoBreadcrumbs";
import { InternalLink } from "../../components/ui/InternalLink";
import { Button } from "../../components/ui/Button";

const ShippingCenterPage: React.FC = () => {
  return (
    <>
      <Meta
        title="Shipping Center in Concord Township, Ohio | Mailbox Plus"
        description="Local Shipping Center including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township."
        canonical="https://mailboxplusohio.com/seo/shipping-center-concord-township"
      />
      
      <main className="container mx-auto px-4 py-10 bg-white">
        <AutoBreadcrumbs />

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Your Premier Shipping Center in Concord Township: Mailbox Plus
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Welcome to Mailbox Plus, the leading <strong>shipping center in Concord Township, Ohio</strong>. 
            We provide a complete range of shipping and business services to meet the needs of residents and small businesses alike. 
            As an authorized shipping outlet for <strong>UPS, FedEx, USPS, and DHL</strong>, we offer you the unique ability to compare rates 
            and delivery times across all major carriers. Whether you're sending a care package to college or shipping products for your business, 
            our expert team is here to ensure your items arrive safely and on time.
          </p>
        </section>

        {/* Why We Are the Best Local Alternative */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Why Mailbox Plus is Concord Township's Top Shipping Choice</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Convenience:</strong> One stop for all your shipping, packing, and business needs.</li>
            <li><strong>Choice:</strong> We are the only local center offering UPS, FedEx, USPS, and DHL under one roof.</li>
            <li><strong>Local Ownership:</strong> We are your neighbors, dedicated to serving our community with care.</li>
            <li><strong>Efficiency:</strong> Fast service means you get back to your day sooner.</li>
            <li><strong>Expertise:</strong> Our staff are trained packing and shipping professionals.</li>
            <li><strong>Value:</strong> Competitive pricing and the ability to shop around for the best rate.</li>
          </ul>
        </section>

        {/* Services Included */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Full-Service Shipping Solutions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Domestic Shipping</h3>
              <p className="text-gray-600">Ground, Express, and Overnight shipping options to anywhere in the US.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">International Shipping</h3>
              <p className="text-gray-600">Reach the world with our global shipping partners: DHL, FedEx, and UPS.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Professional Packing</h3>
              <p className="text-gray-600">We pack it right to protect your items and meet carrier insurance standards.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Package Receiving</h3>
              <p className="text-gray-600">Never worry about porch pirates again with our secure package receiving service.</p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Mailbox Plus vs. Single-Carrier Stores</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Feature</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-blue-50 text-blue-900">Mailbox Plus</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Single-Carrier Store</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Carrier Options</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">UPS, FedEx, USPS, DHL</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Only One (e.g., UPS only)</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Best Rate Guarantee</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Compare & Save</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Fixed Rates</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Service Focus</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Customer Needs First</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Brand Policy First</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Atmosphere</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Friendly & Local</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Corporate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Internal Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Explore Our Services</h2>
          <div className="flex flex-wrap gap-4">
            <InternalLink to="/pack-ship" variant="geo" className="text-blue-600 hover:underline">Shipping Services</InternalLink>
            <InternalLink to="/pack-ship/custom-box-making" variant="geo" className="text-blue-600 hover:underline">Custom Box Making</InternalLink>
            <InternalLink to="/pack-ship/packaging-supplies" variant="geo" className="text-blue-600 hover:underline">Packaging Supplies</InternalLink>
            <InternalLink to="/home-business/mailbox-rental" variant="geo" className="text-blue-600 hover:underline">Mailbox Rental</InternalLink>
            <InternalLink to="/home-business/notary-services" variant="geo" className="text-blue-600 hover:underline">Notary Public</InternalLink>
            <InternalLink to="/pack-ship/package-drop-offs" variant="geo" className="text-blue-600 hover:underline">Drop Offs</InternalLink>
          </div>
        </section>

        {/* Local Benefits */}
        <section className="mb-12 bg-blue-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Proudly Serving Our Community</h2>
          <p className="text-blue-800 leading-relaxed">
            Mailbox Plus is more than just a business; we are a part of the <strong>Concord Township</strong> community. 
            We are honored to serve our neighbors in Mentor, Painesville, and across Lake County with reliable shipping and business services.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">What is the latest time I can drop off a package?</h3>
              <p className="text-gray-700">Our carrier pickup times vary, but we accept drop-offs during all business hours. Call us for specific cutoff times.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Can you pack my item for me?</h3>
              <p className="text-gray-700">Yes, we offer full-service professional packing to ensure your items are safe during transit.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Do you ship furniture?</h3>
              <p className="text-gray-700">We can handle many large items. Please contact us with the dimensions and weight for a quote.</p>
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-2 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">Related Services</h2>

          <p>
            Explore our <InternalLink variant="geo" to="/shipping">local shipping services</InternalLink> including UPS, FedEx, USPS, and DHL.
          </p>

          <p>
            Learn more about our <InternalLink variant="geo" to="/printing">professional printing services</InternalLink> for documents, flyers, and business materials.
          </p>

          <p>
            Need a secure address? Our <InternalLink variant="geo" to="/mailbox-rental">private mailbox rental in Concord Township</InternalLink> provides convenience and privacy.
          </p>
        </div>

        {/* Closing CTA */}
        <section className="text-center py-10 bg-gray-50 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Visit Mailbox Plus Today</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the convenience of a true multi-carrier shipping center.
          </p>
          <InternalLink to="/contact-us">
            <Button size="lg" className="px-8">Get Directions & Hours</Button>
          </InternalLink>
        </section>
      </main>
    </>
  );
};

export default ShippingCenterPage;