import React from "react";
import { Meta } from "../../components/Meta";
import { AutoBreadcrumbs } from "../../components/ui/AutoBreadcrumbs";
import { InternalLink } from "../../components/ui/InternalLink";
import { Button } from "../../components/ui/Button";

const BusinessServicesPage: React.FC = () => {
  return (
    <>
      <Meta
        title="Business Services in Concord Township, Ohio | Mailbox Plus"
        description="Local Business Services including UPS, FedEx, USPS, and DHL shipping. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township."
        canonical="https://mailboxplusohio.com/seo/business-services-concord-township"
      />
      
      <main className="container mx-auto px-4 py-10 bg-white">
        <AutoBreadcrumbs />

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Essential Business Services in Concord Township: Mailbox Plus
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Mailbox Plus is the one-stop shop for all your <strong>business services in Concord Township, Ohio</strong>. 
            We provide the essential tools you need to run your business efficiently, without the overhead of a large office. 
            From <strong>UPS, FedEx, USPS, and DHL</strong> shipping to private mailbox rentals, notary public, and document shredding, 
            we have you covered. Our team acts as your personal support staff, helping you tackle your to-do list so you can focus on what matters most.
          </p>
        </section>

        {/* Why We Are the Best Local Alternative */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Local Business Support Center</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Efficiency:</strong> Get multiple errands done in one quick trip.</li>
            <li><strong>Reliability:</strong> Count on us for secure handling of your mail and packages.</li>
            <li><strong>Professionalism:</strong> Enhance your business image with our high-quality services.</li>
            <li><strong>Flexibility:</strong> We offer solutions tailored to small businesses and home offices.</li>
            <li><strong>Cost-Effective:</strong> Save money by only paying for the services you need.</li>
            <li><strong>Local Partner:</strong> We are invested in the success of the Concord Township business community.</li>
          </ul>
        </section>

        {/* Services Included */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Comprehensive Business Solutions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Mailbox Rentals</h3>
              <p className="text-gray-600">Get a prestigious street address and secure 24-hour access to your mail.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Notary Public</h3>
              <p className="text-gray-600">On-site notary services to legalize your important documents.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Document Shredding</h3>
              <p className="text-gray-600">Securely destroy sensitive files and protect your business data.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Fax & Scan</h3>
              <p className="text-gray-600">Send and receive faxes or digitize your paper records.</p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Mailbox Plus vs. Traditional Office</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Feature</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-blue-50 text-blue-900">Mailbox Plus</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Leased Office</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Cost</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Low Monthly Fee</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">High Rent & Utilities</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Staffing</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Our Team Helps You</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Payroll Expenses</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Equipment</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Use Ours (Print/Fax)</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Purchase & Maintain</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Flexibility</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Scale as Needed</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Long-term Lease</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Internal Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Explore Our Services</h2>
          <div className="flex flex-wrap gap-4">
            <InternalLink to="/home-business/mailbox-rental" variant="geo" className="text-blue-600 hover:underline">Mailbox Rental</InternalLink>
            <InternalLink to="/home-business/notary-services" variant="geo" className="text-blue-600 hover:underline">Notary Public</InternalLink>
            <InternalLink to="/home-business/shredding" variant="geo" className="text-blue-600 hover:underline">Shredding</InternalLink>
            <InternalLink to="/home-business/fax-services" variant="geo" className="text-blue-600 hover:underline">Fax Services</InternalLink>
            <InternalLink to="/pack-ship" variant="geo" className="text-blue-600 hover:underline">Shipping Services</InternalLink>
            <InternalLink to="/copy-print/business-cards" variant="geo" className="text-blue-600 hover:underline">Business Cards</InternalLink>
          </div>
        </section>

        {/* Local Benefits */}
        <section className="mb-12 bg-blue-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Powering Concord Township Businesses</h2>
          <p className="text-blue-800 leading-relaxed">
            We are dedicated to helping businesses in <strong>Concord Township, Ohio</strong> thrive. 
            Serving Mentor, Painesville, and Willoughby, Mailbox Plus is your local partner for growth and efficiency.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Can I use your address for my business?</h3>
              <p className="text-gray-700">Yes! Our mailbox rentals provide a real street address that you can use for business registration and marketing.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Do you offer volume discounts?</h3>
              <p className="text-gray-700">We may offer discounts for high-volume shipping or printing. Please ask us for details.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Is the notary always in?</h3>
              <p className="text-gray-700">Our notary is typically available during all business hours, but feel free to call ahead to confirm.</p>
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
            Take your business to the next level with our professional services.
          </p>
          <InternalLink to="/contact-us">
            <Button size="lg" className="px-8">Get Directions & Hours</Button>
          </InternalLink>
        </section>
      </main>
    </>
  );
};

export default BusinessServicesPage;