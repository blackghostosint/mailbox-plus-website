import React from "react";
import { Meta } from "../../components/Meta";
import { AutoBreadcrumbs } from "../../components/ui/AutoBreadcrumbs";
import { InternalLink } from "../../components/ui/InternalLink";
import { Button } from "../../components/ui/Button";

const MultiCarrierShippingPage: React.FC = () => {
  return (
    <>
      <Meta
        title="UPS, FedEx, USPS, DHL Shipping in Concord Township, Ohio | Mailbox Plus"
        description="Local UPS, FedEx, USPS, and DHL Shipping services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township."
        canonical="https://mailboxplusohio.com/seo/ups-fedex-usps-dhl-shipping-concord-township"
      />
      
      <main className="container mx-auto px-4 py-10 bg-white">
        <AutoBreadcrumbs />

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Ship with UPS, FedEx, USPS, and DHL in Concord Township: Mailbox Plus
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Looking for a place where you can ship with <strong>UPS, FedEx, USPS, and DHL in Concord Township, Ohio</strong>? 
            Mailbox Plus is your all-in-one shipping destination. Why limit yourself to just one carrier when you can have them all? 
            We are authorized shipping partners for all major carriers, giving you the power to compare rates, delivery speeds, 
            and services to find the perfect fit for every package. From overnight documents to international freight, 
            we have the right solution for you.
          </p>
        </section>

        {/* Why We Are the Best Local Alternative */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">The Power of Choice at Mailbox Plus</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Compare & Save:</strong> We can show you rates from all 4 carriers side-by-side.</li>
            <li><strong>One Stop Shop:</strong> No need to drive to multiple stores to ship different packages.</li>
            <li><strong>Expert Advice:</strong> Our staff understands the strengths of each carrier and can guide you.</li>
            <li><strong>Local Convenience:</strong> Located right here in Concord Township for easy access.</li>
            <li><strong>Authorized Center:</strong> We are official partners, ensuring your packages are handled correctly.</li>
            <li><strong>Returns Accepted:</strong> We accept drop-offs for all carriers too.</li>
          </ul>
        </section>

        {/* Services Included */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Shipping Partners</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">UPS Shipping</h3>
              <p className="text-gray-600">Reliable ground and air services for domestic and international shipments.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">FedEx Shipping</h3>
              <p className="text-gray-600">Fast express and economical ground options for time-sensitive packages.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">USPS Shipping</h3>
              <p className="text-gray-600">Priority Mail, First Class, and flat-rate boxes for cost-effective shipping.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">DHL International</h3>
              <p className="text-gray-600">The world leader in international shipping for documents and parcels.</p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Mailbox Plus vs. Single Carrier Stores</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Feature</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-blue-50 text-blue-900">Mailbox Plus</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Carrier Store</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Carrier Options</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">UPS, FedEx, USPS, DHL</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Only One</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Price Shopping</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Yes, compare all 4</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">No, fixed rates</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Objectivity</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Unbiased Advice</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Brand Loyal</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Flexibility</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Solutions for every need</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Limited options</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Internal Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Explore Our Services</h2>
          <div className="flex flex-wrap gap-4">
            <InternalLink to="/pack-ship/ups-authorized-shipper-outlet" variant="geo" className="text-blue-600 hover:underline">UPS Shipping</InternalLink>
            <InternalLink to="/pack-ship/fedex-shipping" variant="geo" className="text-blue-600 hover:underline">FedEx Shipping</InternalLink>
            <InternalLink to="/pack-ship/usps-services" variant="geo" className="text-blue-600 hover:underline">USPS Services</InternalLink>
            <InternalLink to="/pack-ship/dhl-express" variant="geo" className="text-blue-600 hover:underline">DHL International</InternalLink>
            <InternalLink to="/pack-ship/packaging-supplies" variant="geo" className="text-blue-600 hover:underline">Packaging Supplies</InternalLink>
            <InternalLink to="/pack-ship/package-drop-offs" variant="geo" className="text-blue-600 hover:underline">Package Drop Offs</InternalLink>
          </div>
        </section>

        {/* Local Benefits */}
        <section className="mb-12 bg-blue-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Your Concord Township Shipping Hub</h2>
          <p className="text-blue-800 leading-relaxed">
            Mailbox Plus brings world-class shipping options right to your doorstep in <strong>Concord Township, Ohio</strong>. 
            We are proud to connect our neighbors in Mentor, Painesville, and Lake County with the rest of the world through our comprehensive shipping services.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Which carrier is the cheapest?</h3>
              <p className="text-gray-700">It depends on the package size, weight, and destination. We can compare them all instantly to find the lowest price.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Which carrier is the fastest?</h3>
              <p className="text-gray-700">FedEx and UPS often offer the fastest express options, but DHL is excellent for international speed.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Do you take drop-offs for all carriers?</h3>
              <p className="text-gray-700">Yes! We accept prepaid drop-off packages for UPS, FedEx, USPS, and DHL.</p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="text-center py-10 bg-gray-50 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Visit Mailbox Plus Today</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ship any package, any way you want, right here in Concord Township.
          </p>
          <InternalLink to="/contact-us">
            <Button size="lg" className="px-8">Get Directions & Hours</Button>
          </InternalLink>
        </section>
      </main>
    </>
  );
};

export default MultiCarrierShippingPage;