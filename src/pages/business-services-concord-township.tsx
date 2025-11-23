import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const BusinessServicesPage: React.FC = () => {
  const service = services.find(s => s.id === "business-services-concord-township")!;
  return <ServicePage {...service} />;
};

export default BusinessServicesPage;