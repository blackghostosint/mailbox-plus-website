import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const FedExOfficeAlternativePage: React.FC = () => {
  const service = services.find(s => s.id === "fedex-office-alternative-concord-township")!;
  return <ServicePage {...service} />;
};

export default FedExOfficeAlternativePage;