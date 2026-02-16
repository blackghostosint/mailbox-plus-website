import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const DigitalMailboxRental: React.FC = () => {
  const service = services.find(s => s.id === "digital-mailbox-rental")!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Manage your mail from anywhere with our <InternalLink variant="geo" to="/virtual-mailbox-concord-township">virtual mailbox services</InternalLink>.
          See your mail on your phone or computer without visiting the store.
          Prefer a physical mailbox? We also offer traditional <InternalLink variant="geo" to="/mailbox-rental">private mailbox rentals</InternalLink>.
        </p>
      </div>
    </ServicePageV2>
  );
};
