import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const UPSDropOffAlternativePage: React.FC = () => {
  const service = services.find(s => s.id === "ups-drop-off-alternative-concord-township")!;
  return <ServicePage {...service} />;
};

export default UPSDropOffAlternativePage;