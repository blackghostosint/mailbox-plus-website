import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

const PackAndShipServicesPage: React.FC = () => {
  const service = services.find(s => s.id === "pack-and-ship-services-concord-township");

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <ServicePageV2 {...service}>
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
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Concord Township&apos;s Packing Experts</h2>
        <p className="text-blue-800 leading-relaxed">
          Residents of <strong>Concord Township, Ohio</strong> rely on Mailbox Plus for all their packing needs.
          We also serve the surrounding communities of Mentor, Painesville, and Willoughby. Let us take the hassle out of shipping
          your gifts, returns, and business packages.
        </p>
      </section>

      {/* Related Services Text */}
      <div className="mt-8 space-y-2 mb-12">
        <h2 className="text-lg font-semibold text-gray-900">Related Services</h2>

        <p>
          Explore our <InternalLink variant="geo" to="/pack-ship">local shipping services</InternalLink> including UPS, FedEx, USPS, and DHL.
        </p>

        <p>
          Learn more about our <InternalLink variant="geo" to="/copy-print">professional printing services</InternalLink> for documents, flyers, and business materials.
        </p>

        <p>
          Need a secure address? Our <InternalLink variant="geo" to="/home-business/mailbox-rental">private mailbox rental in Concord Township</InternalLink> provides convenience and privacy.
        </p>
      </div>
    </ServicePageV2>
  );
};

export default PackAndShipServicesPage;