import React from 'react';
import { Meta } from '../components/Meta';
import { AutoBreadcrumbs } from '../components/ui/AutoBreadcrumbs';
import { InternalLink } from '../components/ui/InternalLink';
import { Button } from '../components/ui/Button';

const DocumentServicesPage: React.FC = () => {
  return (
    <>
      <Meta
        title="Document Services in Concord Township, Ohio | Mailbox Plus"
        description="Local Document Services including printing, scanning, shredding, and notary. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township."
        canonical="https://mailboxplusohio.com/seo/document-services-concord-township"
      />

      <main className="container mx-auto px-4 py-10 bg-white">
        <AutoBreadcrumbs />

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--color-text-primary)]">
            Professional Document Services in Concord Township: Mailbox Plus
          </h1>
          <p className="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
            Mailbox Plus is your trusted provider of{' '}
            <strong>document services in Concord Township, Ohio</strong>. Whether you need to print
            a report, notarize a legal form, or securely shred sensitive files, our experienced team
            is here to assist. We offer a full suite of services to help you manage your personal
            and business paperwork with ease and confidentiality. Skip the office supply store lines
            and enjoy personalized service right in your neighborhood.
          </p>
        </section>

        {/* Why We Are the Best Local Alternative */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">
            Why Choose Mailbox Plus for Documents?
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-primary)]">
            <li>
              <strong>Security:</strong> We handle your sensitive documents with the utmost care and
              confidentiality.
            </li>
            <li>
              <strong>Convenience:</strong> Print, scan, fax, notarize, and shred all in one place.
            </li>
            <li>
              <strong>Expertise:</strong> Our staff is trained to handle complex print jobs and
              notary requirements.
            </li>
            <li>
              <strong>Speed:</strong> Get your tasks done quickly so you can get back to your day.
            </li>
            <li>
              <strong>Local Focus:</strong> We are proud to serve the document needs of the Concord
              Township community.
            </li>
            <li>
              <strong>One-Stop Shop:</strong> We also offer shipping and packing services if you
              need to send your documents.
            </li>
          </ul>
        </section>

        {/* Services Included */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">
            Complete Document Solutions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Printing & Copying</h3>
              <p className="text-[var(--color-text-secondary)]">
                High-quality color and B&W reproduction for all your document needs.
              </p>
            </div>
            <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Notary Services</h3>
              <p className="text-[var(--color-text-secondary)]">
                Official notarization for wills, deeds, contracts, and other legal forms.
              </p>
            </div>
            <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Secure Shredding</h3>
              <p className="text-[var(--color-text-secondary)]">
                Safe destruction of confidential documents to prevent identity theft.
              </p>
            </div>
            <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Scanning & Faxing</h3>
              <p className="text-[var(--color-text-secondary)]">
                Digitize your paper files or send them quickly via fax.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">
            Mailbox Plus vs. Big Box Stores
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-[var(--color-border)] p-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
                    Feature
                  </th>
                  <th className="border-b-2 border-[var(--color-border)] p-4 bg-[var(--color-bg-blue-tint)] text-blue-900">
                    Mailbox Plus
                  </th>
                  <th className="border-b-2 border-[var(--color-border)] p-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
                    Big Box Office Store
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-[var(--color-border)] p-4 text-[var(--color-text-primary)]">
                    Privacy
                  </td>
                  <td className="border-b border-[var(--color-border)] p-4 font-medium text-[var(--color-primary)]">
                    Discreet & Secure
                  </td>
                  <td className="border-b border-[var(--color-border)] p-4 text-[var(--color-text-secondary)]">
                    Public & Exposed
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[var(--color-border)] p-4 text-[var(--color-text-primary)]">
                    Service Speed
                  </td>
                  <td className="border-b border-[var(--color-border)] p-4 font-medium text-[var(--color-primary)]">
                    Fast & Efficient
                  </td>
                  <td className="border-b border-[var(--color-border)] p-4 text-[var(--color-text-secondary)]">
                    Often Slow
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[var(--color-border)] p-4 text-[var(--color-text-primary)]">
                    Personal Attention
                  </td>
                  <td className="border-b border-[var(--color-border)] p-4 font-medium text-[var(--color-primary)]">
                    Dedicated Staff
                  </td>
                  <td className="border-b border-[var(--color-border)] p-4 text-[var(--color-text-secondary)]">
                    Minimal Assistance
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[var(--color-border)] p-4 text-[var(--color-text-primary)]">
                    Wait Times
                  </td>
                  <td className="border-b border-[var(--color-border)] p-4 font-medium text-[var(--color-primary)]">
                    Short
                  </td>
                  <td className="border-b border-[var(--color-border)] p-4 text-[var(--color-text-secondary)]">
                    Long Lines
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Internal Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">
            Explore Our Services
          </h2>
          <div className="flex flex-wrap gap-4">
            <InternalLink
              to="/copy-print/document-printing"
              variant="geo"
              className="text-[var(--color-primary)] hover:underline"
            >
              Document Printing
            </InternalLink>
            <InternalLink
              to="/home-business/notary-services"
              variant="geo"
              className="text-[var(--color-primary)] hover:underline"
            >
              Notary Public
            </InternalLink>
            <InternalLink
              to="/home-business/shredding"
              variant="geo"
              className="text-[var(--color-primary)] hover:underline"
            >
              Document Shredding
            </InternalLink>
            <InternalLink
              to="/home-business/document-scanning"
              variant="geo"
              className="text-[var(--color-primary)] hover:underline"
            >
              Scanning Services
            </InternalLink>
            <InternalLink
              to="/home-business/fax-services"
              variant="geo"
              className="text-[var(--color-primary)] hover:underline"
            >
              Fax Services
            </InternalLink>
            <InternalLink
              to="/copy-print"
              variant="geo"
              className="text-[var(--color-primary)] hover:underline"
            >
              Printing Services
            </InternalLink>
          </div>
        </section>

        {/* Local Benefits */}
        <section className="mb-12 bg-[var(--color-bg-blue-tint)] p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">
            Serving Concord Township & Lake County
          </h2>
          <p className="text-[var(--color-text-primary)] leading-relaxed">
            From Mentor to Painesville, residents rely on Mailbox Plus in{' '}
            <strong>Concord Township, Ohio</strong> for all their document needs. We are committed
            to providing professional, reliable service to our local community.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-[var(--color-text-primary)]">
                What documents can you notarize?
              </h3>
              <p className="text-[var(--color-text-primary)]">
                We can notarize most documents, including wills, powers of attorney, and real estate
                forms. Please bring a valid ID.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[var(--color-text-primary)]">
                Is your shredding service secure?
              </h3>
              <p className="text-[var(--color-text-primary)]">
                Yes, we place your documents in a locked bin until they are securely shredded by a
                certified service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[var(--color-text-primary)]">
                Can you scan multiple pages to one PDF?
              </h3>
              <p className="text-[var(--color-text-primary)]">
                Yes, our high-speed scanners can combine multiple pages into a single digital file
                for easy emailing.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-2 mb-12">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Related Services
          </h2>

          <p>
            Explore our{' '}
            <InternalLink variant="geo" to="/shipping">
              local shipping services
            </InternalLink>{' '}
            including UPS, FedEx, USPS, and DHL.
          </p>

          <p>
            Learn more about our{' '}
            <InternalLink variant="geo" to="/printing">
              professional printing services
            </InternalLink>{' '}
            for documents, flyers, and business materials.
          </p>

          <p>
            Need a secure address? Our{' '}
            <InternalLink variant="geo" to="/mailbox-rental">
              private mailbox rental in Concord Township
            </InternalLink>{' '}
            provides convenience and privacy.
          </p>
        </div>

        {/* Closing CTA */}
        <section className="text-center py-10 bg-[var(--color-bg-secondary)] rounded-2xl">
          <h2 className="text-3xl font-bold mb-4 text-[var(--color-text-primary)]">
            Visit Mailbox Plus Today
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
            Your local expert for all printing, notary, and document services.
          </p>
          <InternalLink to="/contact-us">
            <Button size="lg" className="px-8">
              Get Directions & Hours
            </Button>
          </InternalLink>
        </section>
      </main>
    </>
  );
};

export default DocumentServicesPage;
