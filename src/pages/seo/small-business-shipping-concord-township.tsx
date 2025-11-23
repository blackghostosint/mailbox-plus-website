import React from "react";
import { Meta } from "../../components/Meta";
import { AutoBreadcrumbs } from "../../components/ui/AutoBreadcrumbs";
import { InternalLink } from "../../components/ui/InternalLink";
import { Button } from "../../components/ui/Button";

const SmallBusinessShippingPage: React.FC = () => {
  return (
    <>
      <Meta
        title="Small Business Shipping in Concord Township, Ohio | Mailbox Plus"
        description="Local Small Business Shipping solutions including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township."
        canonical="https://mailboxplusohio.com/seo/small-business-shipping-concord-township"
      />
      
      <main className="container mx-auto px-4 py-10 bg-white">
        <AutoBreadcrumbs />

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Small Business Shipping Solutions in Concord Township: Mailbox Plus
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Running a business is hard work, but shipping doesn't have to be. Mailbox Plus specializes in 
            <strong>small business shipping in Concord Township, Ohio</strong>. We act as your off-site logistics department, 
            providing access to <strong>UPS, FedEx, USPS, and DHL</strong> all in one place. From sending out orders to managing returns, 
            we help you streamline your shipping process so you can focus on growing your business. 
            Enjoy personalized support, volume discounts potential, and a partner who truly cares about your success.
          </p>
        </section>

        {/* Why We Are the Best Local Alternative */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Business Logistics Partner</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Time Efficiency:</strong> Drop off all your packages for different carriers in one stop.</li>
            <li><strong>Cost Savings:</strong> We help you find the most economical shipping method for every order.</li>
            <li><strong>Professional Image:</strong> Rent a mailbox for a professional street address, not a PO Box.</li>
            <li><strong>Reliability:</strong> Trust us to pack and ship your products safely to your customers.</li>
            <li><strong>Support:</strong> We are always here to answer your questions and solve shipping problems.</li>
            <li><strong>Local Focus:</strong> We understand the needs of local businesses in Concord Township.</li>
          </ul>
        </section>

        {/* Services Included */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Services That Scale With You</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Multi-Carrier Shipping</h3>
              <p className="text-gray-600">Choose the best carrier for each shipment based on price and speed.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Business Printing</h3>
              <p className="text-gray-600">Marketing materials, invoices, and labels printed on demand.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Mailbox Rentals</h3>
              <p className="text-gray-600">Secure package receiving from all carriers to keep your home address private.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Fulfillment Help</h3>
              <p className="text-gray-600">We can help pack and ship your orders during busy seasons.</p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Mailbox Plus vs. Handling It Yourself</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Feature</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-blue-50 text-blue-900">Mailbox Plus</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">DIY / Home Office</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Carrier Accounts</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Access to all major carriers</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Managing multiple accounts</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Supplies</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Stocked & Ready</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Need to buy/store inventory</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Pickups</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Daily pickups included</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Scheduling/Paying for pickups</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Package Security</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Secure Receiving</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Risk of porch theft</td>
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
            <InternalLink to="/home-business/mailbox-rental" variant="geo" className="text-blue-600 hover:underline">Business Mailbox</InternalLink>
            <InternalLink to="/copy-print/business-cards" variant="geo" className="text-blue-600 hover:underline">Business Cards</InternalLink>
            <InternalLink to="/home-business/notary-services" variant="geo" className="text-blue-600 hover:underline">Notary Public</InternalLink>
            <InternalLink to="/pack-ship/custom-box-making" variant="geo" className="text-blue-600 hover:underline">Custom Packaging</InternalLink>
            <InternalLink to="/home-business/every-door-direct-mail" variant="geo" className="text-blue-600 hover:underline">Direct Mail</InternalLink>
          </div>
        </section>

        {/* Local Benefits */}
        <section className="mb-12 bg-blue-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Supporting Concord Township Businesses</h2>
          <p className="text-blue-800 leading-relaxed">
            As a local business in <strong>Concord Township, Ohio</strong>, we understand the challenges you face. 
            We are dedicated to helping fellow entrepreneurs in Mentor, Painesville, and Lake County succeed by taking the hassle out of shipping and logistics.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Do you offer business accounts?</h3>
              <p className="text-gray-700">We offer personalized services for frequent shippers. Stop in to discuss how we can support your business needs.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Can I receive shipments from suppliers here?</h3>
              <p className="text-gray-700">Yes! With a private mailbox rental, you can receive packages from any carrier, ensuring your inventory arrives safely.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">What about international shipping?</h3>
              <p className="text-gray-700">We are experts in international shipping and can help you navigate customs forms to get your products to global customers.</p>
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
            Partner with Mailbox Plus for all your small business shipping needs.
          </p>
          <InternalLink to="/contact-us">
            <Button size="lg" className="px-8">Get Directions & Hours</Button>
          </InternalLink>
        </section>
      </main>
    </>
  );
};

export default SmallBusinessShippingPage;