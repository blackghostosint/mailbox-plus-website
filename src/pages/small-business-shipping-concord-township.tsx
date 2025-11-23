import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const SmallBusinessShippingPage: React.FC = () => {
  const service = services.find(s => s.id === "small-business-shipping-concord-township")!;
  return <ServicePage {...service} />;
};

export default SmallBusinessShippingPage;