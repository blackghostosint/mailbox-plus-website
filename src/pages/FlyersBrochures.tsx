// FlyersBrochures.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const FlyersBrochures: React.FC = () => {
  const service = services.find(s => s.id === "flyers-brochures")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Promote your event or business with our <InternalLink variant="geo" to="/printing-services-concord-township">flyer printing services</InternalLink>.
          Vibrant colors and professional paper stocks available.
        </p>
      </div>
    </ServicePage>
  );
};