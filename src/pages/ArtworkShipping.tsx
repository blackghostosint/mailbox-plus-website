// ArtworkShipping.tsx
import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const ArtworkShipping: React.FC = () => {
  const service = services.find(s => s.id === "artwork-shipping")!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Trust your valuable artwork to the experts. We use specialized packing materials and custom boxes.
          Learn more about our <InternalLink variant="geo" to="/pack-ship/professional-packing">professional packing services</InternalLink> for fragile items.
        </p>
      </div>
    </ServicePageV2>
  );
};