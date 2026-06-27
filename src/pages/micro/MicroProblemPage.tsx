import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { InternalLink } from '../../components/ui/InternalLink';
import { services } from '../../config/services';
import { ServicePageV2 } from '../../components/ServicePageV2';

const MicroProblemPage: React.FC = () => {
  const location = useLocation();

  // Find service matching the current path
  const service = services.find((s) => s.slug === location.pathname);

  // If no service found, or if it's not a micro-problem (safety check), 404
  if (!service || service.category !== 'micro-problem') {
    return <Navigate to="/404" replace />;
  }

  return (
    <ServicePageV2 {...service}>
      <div className="my-6 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
          Getting Packages Regularly? Keep Them Off Your Porch.
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          If you're dealing with shipping and returns often, a{' '}
          <InternalLink variant="geo" to="/home-business/mailbox-rental">
            Mailbox Plus private mailbox
          </InternalLink>{' '}
          means every package goes to our counter, not your doorstep. We sign for deliveries from
          UPS, FedEx, USPS, and DHL. From $35/month. No porch pirates. No missed deliveries.
        </p>
      </div>
    </ServicePageV2>
  );
};

export default MicroProblemPage;
