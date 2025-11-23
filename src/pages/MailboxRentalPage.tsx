// MailboxRentalPage.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const MailboxRentalPage: React.FC = () => {
  const service = services.find(s => s.id === "mailbox-rental")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Secure your packages with our <InternalLink variant="geo" to="/private-mailbox-rental-concord-township">private mailbox rental</InternalLink> services.
          We also offer a convenient <InternalLink variant="geo" to="/mail-forwarding-concord-township">mail forwarding service</InternalLink> for travelers and businesses.
          Interested in managing your mail online? Check out our <InternalLink variant="geo" to="/home-business/digital-mailbox-rental">digital mailbox rentals</InternalLink>.
        </p>
      </div>
    </ServicePage>
  );
};