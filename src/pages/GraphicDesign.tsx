// GraphicDesign.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const GraphicDesign: React.FC = () => {
  const service = services.find(s => s.id === "graphic-design")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          From concept to completion, our graphic design team supports our full range of <InternalLink variant="geo" to="/printing-services-concord-township">printing services in Concord Township</InternalLink>.
        </p>
      </div>
    </ServicePage>
  );
};