import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { getLocalBusinessSchema, getWebSiteSchema } from '../../utils/schema';
import { siteConfig } from '../../config/siteConfig';

// Utility to safely stringify JSON for <script>
const toJsonLd = (obj: unknown) => JSON.stringify(obj, null, 2);

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const origin = (siteConfig.domain || "").replace(/\/+$/, ""); // remove trailing slash
  const localBusinessSchema = getLocalBusinessSchema();
  const webSiteSchema = getWebSiteSchema(`${origin}/search?q={search_term_string}`);

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(webSiteSchema) }}
      />

      <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};