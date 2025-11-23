import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

const service = services.find((s) => s.id === "every-door-direct-mail");

export const EveryDoorDirectMail: React.FC = () => {
  if (!service) {
    return <div>Service not found</div>;
  }
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Grow your local customer base with our <InternalLink variant="geo" to="/business-services-concord-township">direct mail services</InternalLink>.
          We handle the design, printing, and USPS paperwork for you.
        </p>
      </div>
    </ServicePage>
  );
};