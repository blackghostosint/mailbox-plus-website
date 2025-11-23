import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const USPSDropOffAlternativePage: React.FC = () => {
  const service = services.find(s => s.id === "usps-drop-off-alternative-concord-township")!;
  return <ServicePage {...service} />;
};

export default USPSDropOffAlternativePage;