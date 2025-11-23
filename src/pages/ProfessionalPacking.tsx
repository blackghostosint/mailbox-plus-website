// ProfessionalPacking.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const ProfessionalPacking: React.FC = () => {
  const service = services.find(s => s.id === "professional-packing")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          From fragile heirlooms to heavy equipment, our experts use the best materials to protect your items.
          We also carry a full line of <InternalLink variant="geo" to="/pack-ship/packaging-supplies">packaging supplies</InternalLink> for do-it-yourself packing.
        </p>
      </div>
    </ServicePage>
  );
};