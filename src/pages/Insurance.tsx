// Insurance.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const Insurance: React.FC = () => {
  const service = services.find(s => s.id === "insurance")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Protect your valuable shipments. We offer declared value coverage for your <InternalLink variant="geo" to="/pack-ship">packages</InternalLink> to give you peace of mind.
        </p>
      </div>
    </ServicePage>
  );
};
