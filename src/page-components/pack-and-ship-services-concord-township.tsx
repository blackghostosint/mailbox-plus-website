import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { services } from "../config/services";

const PackAndShipServicesPage: React.FC = () => {
  const service = services.find(s => s.id === "pack-and-ship-services-concord-township")!;
  return <ServicePageV2 {...service} />;
};

export default PackAndShipServicesPage;