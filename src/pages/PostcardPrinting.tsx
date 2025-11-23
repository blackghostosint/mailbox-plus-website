// PostcardPrinting.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const PostcardPrinting: React.FC = () => {
  const service = services.find(s => s.id === "postcard-printing")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Get the word out with our <InternalLink variant="geo" to="/printing-services-concord-township">postcard printing services</InternalLink>.
          Perfect for <InternalLink variant="geo" to="/home-business/every-door-direct-mail">direct mail campaigns</InternalLink>, invitations, and announcements.
        </p>
      </div>
    </ServicePage>
  );
};