// USPSServices.tsx
import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const USPSServices: React.FC = () => {
  const service = services.find(s => s.id === "usps-services")!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Why wait in line at the post office? Mailbox Plus is your convenient <InternalLink variant="geo" to="/post-office-alternative-concord-township">post office alternative in Concord Township</InternalLink> for stamps, certified mail, and package shipping.
          Need a secure address for your mail? Consider our <InternalLink variant="geo" to="/mailbox-rental">private mailbox rentals</InternalLink> for 24-hour access and package receiving.
        </p>
      </div>
    </ServicePageV2>
  );
};