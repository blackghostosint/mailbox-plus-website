// GolfClubShipping.tsx
import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const GolfClubShipping: React.FC = () => {
  const service = services.find(s => s.id === "golf-club-shipping")!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Hit the links without the hassle. We offer <InternalLink variant="geo" to="/pack-ship/professional-packing">professional packing</InternalLink> for golf clubs and ship via <InternalLink variant="geo" to="/pack-ship/ups-authorized-shipper-outlet">UPS</InternalLink> or <InternalLink variant="geo" to="/pack-ship/fedex-shipping">FedEx</InternalLink>.
        </p>
      </div>
    </ServicePageV2>
  );
};