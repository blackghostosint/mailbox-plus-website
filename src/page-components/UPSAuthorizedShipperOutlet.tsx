// UPSAuthorizedShipperOutlet.tsx
import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const UPSAuthorizedShipperOutlet: React.FC = () => {
  const service = services.find(s => s.id === "ups-authorized-shipper-outlet")!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Skip the line and save time. Mailbox Plus is your local <InternalLink variant="geo" to="/ups-store-alternative-concord-township">UPS Store alternative</InternalLink> and authorized <InternalLink variant="geo" to="/ups-drop-off-alternative-concord-township">UPS drop-off location</InternalLink> in Concord Township.
          We also provide <InternalLink variant="geo" to="/pack-ship">professional packing</InternalLink> and can help you compare rates with <InternalLink variant="geo" to="/pack-ship/fedex-shipping">FedEx</InternalLink> and <InternalLink variant="geo" to="/pack-ship/usps-services">USPS</InternalLink>.
        </p>
      </div>
    </ServicePageV2>
  );
};