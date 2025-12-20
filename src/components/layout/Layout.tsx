import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { JsonLd } from '../JsonLd';
import FloatingReviewButton from '../ui/FloatingReviewButton';
import { PremierSignupModal } from '../ui';
import { getServiceImageUrl } from '../../lib/storage';
import { getLocalBusinessSchema, getWebSiteSchema } from '../../utils/schema';
import { siteConfig } from '../../config/siteConfig';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Capture Premier Signup signals from URL when users return from the loyalty app
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const signupCompleted = params.get('signup_completed') === 'true' || params.get('premierSignupCompleted') === 'true';
    const loyaltyId = params.get('loyaltyCardId');
    const memberId = params.get('premierMemberId');
    const token = params.get('qrToken');

    if (signupCompleted) {
      localStorage.setItem('premierSignupCompleted', 'true');
    }
    if (loyaltyId) {
      localStorage.setItem('loyaltyCardId', loyaltyId);
    }
    if (memberId) {
      localStorage.setItem('premierMemberId', memberId);
    }
    if (token) {
      localStorage.setItem('qrToken', token);
    }
  }, []);

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