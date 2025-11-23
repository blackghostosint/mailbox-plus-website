import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const BusinessCardsPage: React.FC = () => {
  const service = services.find(s => s.id === "business-cards")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Make a lasting impression with our <InternalLink variant="geo" to="/printing-services-concord-township">local business card printing</InternalLink> services.
          We offer a wide variety of card stocks and finishes, and our <InternalLink variant="geo" to="/copy-print/graphic-design">graphic design services</InternalLink> can help bring your vision to life.
        </p>
      </div>
    </ServicePage>
  );
};
