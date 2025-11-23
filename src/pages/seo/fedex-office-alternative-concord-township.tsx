import React from "react";
import { Meta } from "../../components/Meta";
import { AutoBreadcrumbs } from "../../components/ui/AutoBreadcrumbs";
import { InternalLink } from "../../components/ui/InternalLink";
import { Button } from "../../components/ui/Button";

const FedExOfficeAlternativePage: React.FC = () => {
  return (
    <>
      <Meta
        title="FedEx Office Alternative in Concord Township, Ohio | Mailbox Plus"
        description="Local FedEx Office Alternative including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township."
        canonical="https://mailboxplusohio.com/seo/fedex-office-alternative-concord-township"
      />
      
      <main className="container mx-auto px-4 py-10 bg-white">
        <AutoBreadcrumbs />

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            The Best FedEx Office Alternative in Concord Township: Mailbox Plus
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Searching for a <strong>FedEx Office alternative in Concord Township, Ohio</strong>? 
            Mailbox Plus provides the same high-quality packing, shipping, and printing services you expect, 
            but with the added benefit of being a multi-carrier center. Unlike FedEx Office, which only ships FedEx, 
            Mailbox Plus allows you to compare options from <strong>FedEx, UPS, USPS, and DHL</strong> to find the best rate 
            and delivery speed for your needs. Enjoy personalized service, shorter lines, and a locally owned atmosphere 
            that puts you first.
          </p>
        </section>

        {/* Why We Are the Best Local Alternative */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Why Mailbox Plus Beats the Competition</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Faster Service:</strong> Skip the long lines typical of big box stores.</li>
            <li><strong>No Long Lines:</strong> We value your time and get you on your way quickly.</li>
            <li><strong>Local Ownership:</strong> We are a dedicated part of the Concord Township community.</li>
            <li><strong>Multi-Carrier Options:</strong> We aren't limited to just FedEx; we offer UPS, USPS, and DHL too.</li>
            <li><strong>Transparent Pricing:</strong> Honest rates with no hidden surprises.</li>
            <li><strong>More Services:</strong> From notary public to key duplication, we do it all.</li>
          </ul>
        </section>

        {/* Services Included */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your One-Stop Business Center</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Authorized Shipping</h3>
              <p className="text-gray-600">Official ship center for FedEx, UPS, USPS, and DHL.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Print & Copy</h3>
              <p className="text-gray-600">Professional color and B&W copies, binding, laminating, and business cards.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Office Services</h3>
              <p className="text-gray-600">Notary public, faxing, scanning, and secure document shredding.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Rentals & Returns</h3>
              <p className="text-gray-600">Private mailbox rentals and easy returns for FedEx, Amazon, and more.</p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Mailbox Plus vs. FedEx Office</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Feature</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-blue-50 text-blue-900">Mailbox Plus</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">FedEx Office</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Carrier Variety</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">FedEx, UPS, USPS, DHL</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">FedEx Only</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Price Comparison</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Shop rates across carriers</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Single carrier rates</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Convenience</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Quick In & Out</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Often busy / corporate feel</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Atmosphere</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Friendly Local Business</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Corporate Chain</td>
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
            <InternalLink to="/home-business/mailbox-rental" variant="geo" className="text-blue-600 hover:underline">Mailbox Rental</InternalLink>
            <InternalLink to="/copy-print" variant="geo" className="text-blue-600 hover:underline">Printing Services</InternalLink>
            <InternalLink to="/home-business/notary-services" variant="geo" className="text-blue-600 hover:underline">Notary Public</InternalLink>
            <InternalLink to="/amazon-returns" variant="geo" className="text-blue-600 hover:underline">Amazon Returns</InternalLink>
            <InternalLink to="/fedex-easy-returns" variant="geo" className="text-blue-600 hover:underline">FedEx Returns</InternalLink>
            <InternalLink to="/pack-ship/package-drop-offs" variant="geo" className="text-blue-600 hover:underline">Package Drop Offs</InternalLink>
          </div>
        </section>

        {/* Local Benefits */}
        <section className="mb-12 bg-blue-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Serving Concord Township & Lake County</h2>
          <p className="text-blue-800 leading-relaxed">
            Conveniently located in <strong>Concord Township, Ohio</strong>, Mailbox Plus serves the entire region including Mentor, Painesville, and Willoughby. 
            We provide the high-quality services you expect from a national brand like FedEx Office, but with the personal touch of a local neighbor.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Can I drop off pre-labeled FedEx packages?</h3>
              <p className="text-gray-700">Yes! We accept drop-offs for FedEx as well as UPS and USPS packages.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Do you offer printing services like FedEx Office?</h3>
              <p className="text-gray-700">Yes, we offer a full range of copying and printing services, including business cards, flyers, and document finishing.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Is there a notary on site?</h3>
              <p className="text-gray-700">Yes, we have a commissioned notary public available during all business hours.</p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="text-center py-10 bg-gray-50 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Visit Mailbox Plus in Concord Township</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your best local alternative for multi-carrier shipping and business services.
          </p>
          <InternalLink to="/contact-us">
            <Button size="lg" className="px-8">Get Directions & Hours</Button>
          </InternalLink>
        </section>
      </main>
    </>
  );
};

export default FedExOfficeAlternativePage;