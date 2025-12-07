// BicycleShipping.tsx
import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const BicycleShipping: React.FC = () => {
  const service = services.find(s => s.id === "bicycle-shipping")!;
  return (
    <ServicePageV2 {...service}>
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Planning a cycling trip or selling a bike? We offer
          <InternalLink variant="geo" to="/pack-ship"> professional packing services </InternalLink>
          and reliable shipping options.
        </p>

        <p className="text-gray-700 leading-relaxed">
          We can ship your bike through
          <InternalLink variant="geo" to="/pack-ship/fedex-shipping"> FedEx</InternalLink>
          or
          <InternalLink variant="geo" to="/pack-ship/ups-authorized-shipper-outlet"> UPS</InternalLink>,
          with proper packing to protect your frame, wheels, and components.
        </p>
      </div>
    </ServicePageV2>
  );
};
