// HomeBusiness.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const HomeBusiness: React.FC = () => {
  const service = services.find(s => s.id === "home-business");
  if (!service) {
    return <div>Error: Service not found</div>;
  }
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Running a home business? We can help with <InternalLink variant="geo" to="/mailbox-rental">mailbox rentals</InternalLink>, <InternalLink variant="geo" to="/printing">printing marketing materials</InternalLink>, and <InternalLink variant="geo" to="/shipping">shipping your products</InternalLink>.
        </p>
      </div>
    </ServicePage>
  );
};