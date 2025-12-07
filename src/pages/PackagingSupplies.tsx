// PackagingSupplies.tsx
import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const PackagingSupplies: React.FC = () => {
  const service = services.find(s => s.id === "packaging-supplies")!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Visit our <InternalLink variant="geo" to="/shipping-center-concord-township">local shipping center</InternalLink> for all your packaging supplies,
          including boxes, tape, bubble wrap, and more.
        </p>
      </div>
    </ServicePageV2>
  );
};