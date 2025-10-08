import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { JsonLd } from '../JsonLd';
import { getLocalBusinessSchema, getWebSiteSchema } from '../../utils/schema';
import { siteConfig } from '../../config/siteConfig';

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
      <JsonLd schema={localBusinessSchema} />
      <JsonLd schema={webSiteSchema} />

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