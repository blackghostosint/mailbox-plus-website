// FedExShipping.tsx
import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const FedExShipping: React.FC = () => {
  const service = services.find(s => s.id === "fedex-shipping")!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          We are your convenient <InternalLink variant="geo" to="/fedex-office-alternative-concord-township">FedEx Office alternative</InternalLink>.
          Ship express or ground with the same reliable service, right here in Concord Township.
          Need a box? We have <InternalLink variant="geo" to="/pack-ship/packaging-supplies">packaging supplies</InternalLink> and offer <InternalLink variant="geo" to="/pack-ship/professional-packing">expert packing services</InternalLink> to ensure your shipment arrives safely.
        </p>
      </div>
    </ServicePageV2>
  );
};