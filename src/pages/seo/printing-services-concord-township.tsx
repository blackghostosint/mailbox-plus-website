import React from "react";
import { Meta } from "../../components/Meta";
import { AutoBreadcrumbs } from "../../components/ui/AutoBreadcrumbs";
import { InternalLink } from "../../components/ui/InternalLink";
import { Button } from "../../components/ui/Button";

const PrintingServicesPage: React.FC = () => {
  return (
    <>
      <Meta
        title="Printing Services in Concord Township, Ohio | Mailbox Plus"
        description="Local Printing Services including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township."
        canonical="https://mailboxplusohio.com/seo/printing-services-concord-township"
      />
      
      <main className="container mx-auto px-4 py-10 bg-white">
        <AutoBreadcrumbs />

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            High-Quality Printing Services in Concord Township: Mailbox Plus
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Looking for professional <strong>printing services in Concord Township, Ohio</strong>? 
            Mailbox Plus is your local print shop for everything from business cards and flyers to documents and presentations. 
            We offer high-quality color and black & white printing with fast turnaround times. Whether you're a student, 
            a small business owner, or just need a few copies, our friendly team is here to help your projects look their best. 
            Plus, we can ship your printed materials anywhere with <strong>UPS, FedEx, USPS, and DHL</strong>.
          </p>
        </section>

        {/* Why We Are the Best Local Alternative */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Why Print with Mailbox Plus?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Quality:</strong> We use professional-grade equipment for crisp, clear results.</li>
            <li><strong>Speed:</strong> Same-day service available for many print jobs.</li>
            <li><strong>Convenience:</strong> Email us your files or bring them in on a USB drive.</li>
            <li><strong>Personal Service:</strong> We take the time to check your files and ensure they print correctly.</li>
            <li><strong>Full Service:</strong> We can print, bind, laminate, and ship your documents all in one visit.</li>
            <li><strong>Local Value:</strong> Competitive pricing without the big box store hassle.</li>
          </ul>
        </section>

        {/* Services Included */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Complete Printing Solutions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Document Printing</h3>
              <p className="text-gray-600">Resumes, reports, presentations, and flyers in color or B&W.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Business Cards</h3>
              <p className="text-gray-600">Make a great first impression with professionally printed business cards.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Finishing Services</h3>
              <p className="text-gray-600">Binding, laminating, stapling, and folding to give your project a polished look.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Digital Services</h3>
              <p className="text-gray-600">Scan documents to email or USB for easy digital archiving.</p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Mailbox Plus vs. Home Printing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Feature</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-blue-50 text-blue-900">Mailbox Plus</th>
                  <th className="border-b-2 border-gray-200 p-4 bg-gray-50 text-gray-800">Home Printer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Print Quality</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Professional Laser</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Consumer Inkjet</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Cost per Page</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Efficient / Bulk Rates</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Expensive Ink</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Speed</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">High Volume Fast</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Slow</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 p-4 text-gray-700">Paper Options</td>
                  <td className="border-b border-gray-100 p-4 font-medium text-blue-700">Various Stocks</td>
                  <td className="border-b border-gray-100 p-4 text-gray-600">Standard Paper</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Internal Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Explore Our Services</h2>
          <div className="flex flex-wrap gap-4">
            <InternalLink to="/copy-print/document-printing" variant="geo" className="text-blue-600 hover:underline">Document Printing</InternalLink>
            <InternalLink to="/copy-print/business-cards" variant="geo" className="text-blue-600 hover:underline">Business Cards</InternalLink>
            <InternalLink to="/copy-print/flyers-brochures" variant="geo" className="text-blue-600 hover:underline">Flyers & Brochures</InternalLink>
            <InternalLink to="/home-business/document-scanning" variant="geo" className="text-blue-600 hover:underline">Scanning Services</InternalLink>
            <InternalLink to="/pack-ship" variant="geo" className="text-blue-600 hover:underline">Shipping Services</InternalLink>
            <InternalLink to="/home-business/notary-services" variant="geo" className="text-blue-600 hover:underline">Notary Public</InternalLink>
          </div>
        </section>

        {/* Local Benefits */}
        <section className="mb-12 bg-blue-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Serving Concord Township's Printing Needs</h2>
          <p className="text-blue-800 leading-relaxed">
            Mailbox Plus is proud to be the local print center for <strong>Concord Township, Ohio</strong>. 
            We help residents and businesses in Mentor, Painesville, and Willoughby look professional on paper.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">How do I send you my file?</h3>
              <p className="text-gray-700">You can email it to us or bring it in on a USB drive.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Do you print in color?</h3>
              <p className="text-gray-700">Yes, we offer full-color and black & white printing on a variety of paper sizes.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Can you laminate documents?</h3>
              <p className="text-gray-700">Yes, we offer laminating services to protect your important documents.</p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="text-center py-10 bg-gray-50 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Visit Mailbox Plus Today</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get your documents printed fast and professionally in Concord Township.
          </p>
          <InternalLink to="/contact-us">
            <Button size="lg" className="px-8">Get Directions & Hours</Button>
          </InternalLink>
        </section>
      </main>
    </>
  );
};

export default PrintingServicesPage;