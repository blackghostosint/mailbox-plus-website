// PackageDropOffs.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const PackageDropOffs: React.FC = () => {
  const service = services.find(s => s.id === "package-drop-offs")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          We accept drop-offs for <InternalLink variant="geo" to="/pack-ship/ups-authorized-shipper-outlet">UPS</InternalLink>, <InternalLink variant="geo" to="/pack-ship/fedex-shipping">FedEx</InternalLink>, <InternalLink variant="geo" to="/pack-ship/usps-services">USPS</InternalLink>, and <InternalLink variant="geo" to="/pack-ship/dhl-express">DHL</InternalLink>.
          Simply bring in your labeled package and we'll handle the rest.
        </p>
      </div>
    </ServicePage>
  );
};