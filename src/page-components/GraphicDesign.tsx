// GraphicDesign.tsx
import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const GraphicDesign: React.FC = () => {
  const service = services.find(s => s.id === "graphic-design")!;
  return (
    <ServicePageV2 {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          From concept to completion, our graphic design team supports our full range of <InternalLink variant="geo" to="/printing-services-concord-township">printing services in Concord Township</InternalLink>.
          Whether you need <InternalLink variant="geo" to="/copy-print/business-cards">business cards</InternalLink>, <InternalLink variant="geo" to="/copy-print/flyers-brochures">flyers</InternalLink>, or large format <InternalLink variant="geo" to="/copy-print/posters-printing">posters</InternalLink>, we help you look your best.
        </p>
      </div>
    </ServicePageV2>
  );
};