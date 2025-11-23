// BicycleShipping.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const BicycleShipping: React.FC = () => {
  const service = services.find(s => s.id === "bicycle-shipping")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Planning a cycling trip or selling a bike? We offer <InternalLink variant="geo" to="/pack-ship">packing services</InternalLink> and reliable shipping options.
          We can ship your bike via <InternalLink variant="geo" to="/fedex-shipping">FedEx</InternalLink> or <InternalLink variant="geo" to="/ups-shipping">UPS</InternalLink>.
        </p>
      </div>
    </ServicePage>
  );
};
