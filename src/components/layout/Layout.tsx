import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { JsonLd } from '../JsonLd';
import FloatingReviewButton from '../ui/FloatingReviewButton';
import { PremierSignupModal } from '../ui';
import { getServiceImageUrl } from '../../lib/storage';
import { getLocalBusinessSchema, getWebSiteSchema } from '../../utils/schema';
import { siteConfig } from '../../config/siteConfig';

import { useSignupSignals } from '../../hooks/useSignupSignals';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Capture Premier Signup signals from URL when users return from the loyalty app
  useSignupSignals();

  // console.log('Layout.tsx: Layout component rendering');
  const origin = (siteConfig.domain || "").replace(/\/+$/, ""); // remove trailing slash
  const localBusinessSchema = getLocalBusinessSchema(siteConfig);
  const webSiteSchema = getWebSiteSchema(siteConfig, `${origin}/search?q={search_term_string}`);

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
        <FloatingReviewButton imageSrc={getServiceImageUrl("review-us-on-google.webp")} />

        {/* Premier Signup Modal */}
        <PremierSignupModal />
      </div>
    </>
  );
};