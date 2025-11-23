// PostersPrinting.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const PostersPrinting: React.FC = () => {
  const service = services.find(s => s.id === "posters-printing")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Choose Mailbox Plus as your <InternalLink variant="geo" to="/office-depot-alternative-concord-township">Office Depot printing alternative</InternalLink> for wide-format printing.
          Our posters and banners are printed with precision and care.
        </p>
      </div>
    </ServicePage>
  );
};