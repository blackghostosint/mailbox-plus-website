import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const BusinessCardsPage: React.FC = () => {
  const service = services.find(s => s.id === "business-cards")!;
  return <ServicePage {...service} />;
};
