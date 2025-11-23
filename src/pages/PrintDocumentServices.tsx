// PrintDocumentServices.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const PrintDocumentServices: React.FC = () => {
  const service = services.find(s => s.id === "print-document-services")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          From reports to presentations, our <InternalLink variant="geo" to="/document-services-concord-township">document services</InternalLink> cover all your printing and finishing needs.
        </p>
      </div>
    </ServicePage>
  );
};