// PrintDocumentServices.tsx
import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const PrintDocumentServices: React.FC = () => {
  const service = services.find(s => s.id === "print-document-services")!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          From reports to presentations, our <InternalLink variant="geo" to="/document-services-concord-township">document services</InternalLink> cover all your printing and finishing needs.
          We also provide <InternalLink variant="geo" to="/copy-print/copies">copying services</InternalLink> and <InternalLink variant="geo" to="/home-business/document-scanning">document scanning</InternalLink>.
        </p>
      </div>
    </ServicePageV2>
  );
};