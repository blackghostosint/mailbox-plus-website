import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { services } from "../config/services";

const UPSStoreAlternativePage: React.FC = () => {
  const service = services.find(s => s.id === "ups-store-alternative-concord-township")!;
  return <ServicePageV2 {...service} />;
};

export default UPSStoreAlternativePage;