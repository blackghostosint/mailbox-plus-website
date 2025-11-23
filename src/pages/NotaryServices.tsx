import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const NotaryServices: React.FC = () => {
  const service = services.find(s => s.id === "notary-services")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Our licensed <InternalLink variant="geo" to="/business-services-concord-township">notary public services</InternalLink> are available during all store hours.
          No appointment needed for most documents.
        </p>
      </div>
    </ServicePage>
  );
};