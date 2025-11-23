// DHLExpress.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const DHLExpress: React.FC = () => {
  const service = services.find(s => s.id === "dhl-express")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          As an authorized <InternalLink variant="geo" to="/shipping-center-concord-township">international shipping center</InternalLink>,
          we make sending packages overseas simple and secure with DHL.
        </p>
      </div>
    </ServicePage>
  );
};
