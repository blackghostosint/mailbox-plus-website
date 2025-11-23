// DigitalFingerprinting.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const DigitalFingerprinting: React.FC = () => {
  const service = services.find(s => s.id === "digital-fingerprinting")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Part of our comprehensive <InternalLink variant="geo" to="/business-services-concord-township">business services in Concord Township</InternalLink>,
          we provide fast and secure digital fingerprinting for background checks.
        </p>
      </div>
    </ServicePage>
  );
};