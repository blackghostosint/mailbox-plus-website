import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const DigitalMailboxRental: React.FC = () => {
  const service = services.find(s => s.id === "digital-mailbox-rental")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Manage your mail from anywhere with our <InternalLink variant="geo" to="/virtual-mailbox-concord-township">virtual mailbox services</InternalLink>.
          See your mail on your phone or computer without visiting the store.
        </p>
      </div>
    </ServicePage>
  );
};
