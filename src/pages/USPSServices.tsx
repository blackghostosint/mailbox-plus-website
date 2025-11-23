// USPSServices.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const USPSServices: React.FC = () => {
  const service = services.find(s => s.id === "usps-services")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Why wait in line at the post office? Mailbox Plus is your convenient <InternalLink variant="geo" to="/post-office-alternative-concord-township">post office alternative in Concord Township</InternalLink> for stamps, certified mail, and package shipping.
        </p>
      </div>
    </ServicePage>
  );
};