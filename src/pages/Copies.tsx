// Copies.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { InternalLink } from "../components/ui/InternalLink";
import { services } from "../config/services";

export const Copies: React.FC = () => {
  const service = services.find(s => s.id === "copies")!;
  return (
    <ServicePage {...service}>
      <div className="my-8">
        <p className="text-gray-700 leading-relaxed">
          Need high-quality copies fast? Mailbox Plus is your <InternalLink variant="geo" to="/staples-printing-alternative-concord-township">Staples alternative for copies</InternalLink> and <InternalLink variant="geo" to="/office-depot-alternative-concord-township">local copy center</InternalLink>.
          For larger projects, explore our <InternalLink variant="geo" to="/printing">full printing services</InternalLink>.
        </p>
      </div>
    </ServicePage>
  );
};