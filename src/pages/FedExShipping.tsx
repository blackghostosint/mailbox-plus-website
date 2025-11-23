// FedExShipping.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const FedExShipping: React.FC = () => {
  const service = services.find(s => s.id === "fedex-shipping")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          We are your convenient <InternalLink variant="geo" to="/fedex-office-alternative-concord-township">FedEx Office alternative</InternalLink>.
          Ship express or ground with the same reliable service, right here in Concord Township.
          Need a box? We have <InternalLink variant="geo" to="/pack-ship/packaging-supplies">packaging supplies</InternalLink> and offer <InternalLink variant="geo" to="/pack-ship/professional-packing">expert packing services</InternalLink> to ensure your shipment arrives safely.
        </p>
      </div>
    </ServicePage>
  );
};