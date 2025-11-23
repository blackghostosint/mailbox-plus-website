import React from "react";
import { Meta } from "../../components/Meta";
import { AutoBreadcrumbs } from "../../components/ui/AutoBreadcrumbs";
import { InternalLink } from "../../components/ui/InternalLink";
import { Button } from "../../components/ui/Button";

const OfficeDepotAlternativePage: React.FC = () => {
  return (
    <>
      <Meta
        title="Office Depot Alternative in Concord Township, Ohio | Mailbox Plus"
        description="Local Office Depot Alternative for business services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township."
        canonical="https://mailboxplusohio.com/office-depot-alternative-concord-township"
      />
      
      <main className="container mx-auto px-4 py-10 bg-white">
        <AutoBreadcrumbs />

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            The Best Office Depot Alternative in Concord Township: Mailbox Plus
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Looking for an <strong>Office Depot alternative in Concord Township, Ohio</strong>? 
            Mailbox Plus provides the essential business services you rely on, right in your neighborhood. 
            From professional printing and copying to shipping and mailbox rentals, we offer a more personalized and efficient experience than the big chain stores. 
            Plus, as a multi-carrier shipping center, we give you more choices with <strong>UPS, FedEx, USPS, and DHL</strong> all in one location. 
            Choose Mailbox Plus for friendly service and expert solutions.
          </p>
        </section>

        {/* Why We Are the Best Local Alternative */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Why Mailbox Plus is Your Best Choice</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Faster Service:</strong> We get you in and out quickly, respecting your busy schedule.</li>
            <li><strong>No Long Lines:</strong> Avoid the wait times often found at Office Depot.</li>
            <li><strong>Local Ownership:</strong> We are a locally owned business invested in our community.</li>
            <li><strong>Multi-Carrier Shipping:</strong> Compare rates and services from UPS, FedEx, USPS, and DHL.</li>
            <li><strong>Transparent Pricing:</strong> Fair prices for all our services.</li>
            <li><strong>More Services:</strong> We offer comprehensive solutions like notary, shredding, and fingerprinting.</li>
          </ul>
        </section>

        {/* Services Included */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Comprehensive Business Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Printing & Copying</h3>
              <p className="text-gray-600">High-quality copies, business cards, flyers, and document finishing services.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Shipping & Packing</h3>
              <p className="text-gray-600">Authorized shipping center for UPS, FedEx, USPS, and DHL with professional packing.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Mailbox Services</h3>
              <p className="text-gray-600">Secure private mailboxes with package receiving from all carriers.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Office Essentials</h3>
              <p className="text-gray-600">Notary public, faxing, scanning, and secure shredding services.</p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Mailbox Plus vs. Office Depot</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Feature</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-blue-50 text-blue-900">Mailbox Plus</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Office Depot</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Service Experience</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Personal & Efficient</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Corporate & Impersonal</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Shipping Carriers</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">UPS, FedEx, USPS, DHL</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Limited options</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Waiting Time</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Minimal</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Often substantial</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Community Support</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Locally Owned</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">National Chain</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Internal Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Explore Our Services</h2>
          <div className="flex flex-wrap gap-4">
            <InternalLink to="/copy-print" variant="geo" className="text-blue-600 hover:underline">Printing Services</InternalLink>
            <InternalLink to="/copy-print/document-printing" variant="geo" className="text-blue-600 hover:underline">Document Printing</InternalLink>
            <InternalLink to="/pack-ship" variant="geo" className="text-blue-600 hover:underline">Shipping Services</InternalLink>
            <InternalLink to="/home-business/mailbox-rental" variant="geo" className="text-blue-600 hover:underline">Mailbox Rental</InternalLink>
            <InternalLink to="/home-business/shredding" variant="geo" className="text-blue-600 hover:underline">Shredding Services</InternalLink>
            <InternalLink to="/home-business/notary-services" variant="geo" className="text-blue-600 hover:underline">Notary Public</InternalLink>
          </div>
        </section>

        {/* Local Benefits */}
        <section className="mb-12 bg-blue-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Proudly Serving Concord Township</h2>
          <p className="text-blue-800 leading-relaxed">
            Mailbox Plus is your local business partner in <strong>Concord Township, Ohio</strong>. We serve Mentor, Painesville, Willoughby, and all of Lake County 
            with a commitment to excellence and community support. Get the services you need from people who care.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">What shipping services do you offer?</h3>
              <p className="text-gray-700">We offer shipping via UPS, FedEx, USPS, and DHL, allowing you to choose the best option for your needs.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Can I get documents printed here?</h3>
              <p className="text-gray-700">Absolutely! We handle copies, business cards, flyers, and more with professional quality.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Do you offer notary services?</h3>
              <p className="text-gray-700">Yes, our on-site notary is available to assist you with your legal documents.</p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="text-center py-10 bg-gray-50 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Visit Mailbox Plus Today</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The better local alternative for all your business and shipping needs in Concord Township.
          </p>
          <InternalLink to="/contact-us">
            <Button size="lg" className="px-8">Get Directions & Hours</Button>
          </InternalLink>
        </section>
      </main>
    </>
  );
};

export default OfficeDepotAlternativePage;