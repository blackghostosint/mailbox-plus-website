import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const UPSStoreAlternativePage: React.FC = () => {
  const service = services.find(s => s.id === "ups-store-alternative-concord-township")!;
  return <ServicePage {...service} />;
};

export default UPSStoreAlternativePage;