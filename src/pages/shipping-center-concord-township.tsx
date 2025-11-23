import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const ShippingCenterPage: React.FC = () => {
  const service = services.find(s => s.id === "shipping-center-concord-township")!;
  return <ServicePage {...service} />;
};

export default ShippingCenterPage;