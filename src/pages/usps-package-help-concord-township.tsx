import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const USPSPackageHelpPage: React.FC = () => {
  const service = services.find(s => s.id === "usps-package-help-concord-township");

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <ServicePage {...service}>
      {/* Comparison Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Mailbox Plus vs. DIY Shipping</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Feature</th>
                <th className="border-b-2 border-gray-200 p-4 bg-blue-50 text-blue-900">Mailbox Plus</th>
                <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Doing It Yourself</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-gray-100 p-4 text-gray-700">Convenience</td>
                <td className="border-b border-gray-100 p-4 font-medium text-blue-700">We do the work for you</td>
                <td className="border-b border-gray-100 p-4 text-gray-600">Time-consuming</td>
              </tr>
              <tr>
                <td className="border-b border-gray-100 p-4 text-gray-700">Packing Quality</td>
                <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Professional Standards</td>
                <td className="border-b border-gray-100 p-4 text-gray-600">Risk of damage</td>
              </tr>
              <tr>
                <td className="border-b border-gray-100 p-4 text-gray-700">Cost Savings</td>
                <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Compare carrier rates</td>
                <td className="border-b border-gray-100 p-4 text-gray-600">Limited to one carrier</td>
              </tr>
              <tr>
                <td className="border-b border-gray-100 p-4 text-gray-700">Peace of Mind</td>
                <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Tracking & Insurance</td>
                <td className="border-b border-gray-100 p-4 text-gray-600">Uncertainty</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Local Benefits */}
      <section className="mb-12 bg-blue-50 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Helping Concord Township Ship Smarter</h2>
        <p className="text-blue-800 leading-relaxed">
          Mailbox Plus is dedicated to making shipping easy for the residents of <strong>Concord Township, Ohio</strong>. 
          Whether you're in Mentor, Painesville, or anywhere in Lake County, our expert team is ready to help you with 
          all your package needs.
        </p>
      </section>
    </ServicePage>
  );
};

export default USPSPackageHelpPage;