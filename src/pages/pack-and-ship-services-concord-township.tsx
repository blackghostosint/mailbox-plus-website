import React from "react";
import { Meta } from "../../components/Meta";
import { AutoBreadcrumbs } from "../../components/ui/AutoBreadcrumbs";
import { InternalLink } from "../../components/ui/InternalLink";
import { Button } from "../../components/ui/Button";

const PackAndShipServicesPage: React.FC = () => {
  return (
    <>
      <Meta
        title="Pack and Ship Services in Concord Township, Ohio | Mailbox Plus"
        description="Local Pack and Ship Services including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township."
        canonical="https://mailboxplusohio.com/seo/pack-and-ship-services-concord-township"
      />
      
      <main className="container mx-auto px-4 py-10 bg-white">
        <AutoBreadcrumbs />

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Professional Pack and Ship Services in Concord Township: Mailbox Plus
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            When you need expert <strong>pack and ship services in Concord Township, Ohio</strong>, trust the pros at Mailbox Plus. 
            Packing can be stressful and time-consuming, but our team makes it easy. We use high-quality materials and professional 
            techniques to ensure your items—whether fragile, valuable, or awkward—arrive safely. As an authorized 
            shipper for <strong>UPS, FedEx, USPS, and DHL</strong>, we can pack your item and ship it using the carrier that best fits 
            your budget and timeline.
          </p>
        </section>

        {/* Why We Are the Best Local Alternative */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Why Choose Mailbox Plus for Packing?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Expert Packing:</strong> We know exactly how to protect your items for transit.</li>
            <li><strong>Peace of Mind:</strong> Our professional packing often qualifies for carrier insurance guarantees.</li>
            <li><strong>Convenience:</strong> Bring in your item, and we'll handle the box, bubble wrap, and tape.</li>
            <li><strong>Multi-Carrier Shipping:</strong> Once packed, we can ship it via UPS, FedEx, USPS, or DHL.</li>
            <li><strong>Time Saving:</strong> Stop hunting for the right size box—we have it all here.</li>
            <li><strong>Custom Solutions:</strong> We can build custom boxes for odd-shaped or large items.</li>
          </ul>
        </section>

        {/* Services Included */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Complete Packing & Shipping Solutions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Professional Packing</h3>
              <p className="text-gray-600">From antiques to electronics, we pack it all with care and precision.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Custom Boxing</h3>
              <p className="text-gray-600">We create custom boxes to fit unique items perfectly.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Shipping Supplies</h3>
              <p className="text-gray-600">Purchase boxes, tape, bubble wrap, and peanuts for your DIY packing needs.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Freight Shipping</h3>
              <p className="text-gray-600">Assistance with palletizing and shipping larger freight items.</p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Mailbox Plus vs. DIY Packing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Feature</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-blue-50 text-blue-900">Mailbox Plus</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">DIY Packing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Safety</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Professional Standards</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Risk of Damage</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Materials</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Industrial Strength</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Consumer Grade</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Insurance Coverage</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Pack & Ship Guarantee Eligible</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Claims often denied</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Convenience</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">We do it for you</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Labor intensive</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Internal Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Explore Our Services</h2>
          <div className="flex flex-wrap gap-4">
            <InternalLink to="/pack-ship/professional-packing" variant="geo" className="text-blue-600 hover:underline">Professional Packing</InternalLink>
            <InternalLink to="/pack-ship/custom-box-making" variant="geo" className="text-blue-600 hover:underline">Custom Box Making</InternalLink>
            <InternalLink to="/pack-ship" variant="geo" className="text-blue-600 hover:underline">Shipping Services</InternalLink>
            <InternalLink to="/pack-ship/packaging-supplies" variant="geo" className="text-blue-600 hover:underline">Packaging Supplies</InternalLink>
            <InternalLink to="/pack-ship/artwork-shipping" variant="geo" className="text-blue-600 hover:underline">Artwork Shipping</InternalLink>
            <InternalLink to="/pack-ship/golf-club-shipping" variant="geo" className="text-blue-600 hover:underline">Golf Club Shipping</InternalLink>
          </div>
        </section>

        {/* Local Benefits */}
        <section className="mb-12 bg-blue-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Concord Township's Packing Experts</h2>
          <p className="text-blue-800 leading-relaxed">
            Residents of <strong>Concord Township, Ohio</strong> rely on Mailbox Plus for all their packing needs. 
            We also serve the surrounding communities of Mentor, Painesville, and Willoughby. Let us take the hassle out of shipping 
            your gifts, returns, and business packages.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">How much does packing cost?</h3>
              <p className="text-gray-700">The cost depends on the size, weight, and fragility of the item. Bring it in for a free quote!</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Can you pack fragile items like glass?</h3>
              <p className="text-gray-700">Absolutely. We use specialized materials like bubble wrap, foam, and peanuts to protect fragile items.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Do you have boxes for moving?</h3>
              <p className="text-gray-700">Yes, we sell a variety of box sizes perfect for moving or storage.</p>
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
            Let the experts at Mailbox Plus handle your packing and shipping needs in Concord Township.
          </p>
          <InternalLink to="/contact-us">
            <Button size="lg" className="px-8">Get Directions & Hours</Button>
          </InternalLink>
        </section>
      </main>
    </>
  );
};

export default PackAndShipServicesPage;