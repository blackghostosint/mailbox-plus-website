// DocumentScanning.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const DocumentScanning: React.FC = () => {
  const service = services.find(s => s.id === "document-scanning")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Digitize your important files with our <InternalLink variant="geo" to="/document-services-concord-township">document scanning services</InternalLink>.
          We offer high-resolution scanning to email or USB drive.
        </p>
      </div>
    </ServicePage>
  );
};