// GolfClubShipping.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const GolfClubShipping: React.FC = () => {
  const service = services.find(s => s.id === "golf-club-shipping")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Hit the links without the hassle. We offer <InternalLink variant="geo" to="/pack-ship/professional-packing">professional packing</InternalLink> for golf clubs and ship via <InternalLink variant="geo" to="/pack-ship/ups-authorized-shipper-outlet">UPS</InternalLink> or <InternalLink variant="geo" to="/pack-ship/fedex-shipping">FedEx</InternalLink>.
        </p>
      </div>
    </ServicePage>
  );
};